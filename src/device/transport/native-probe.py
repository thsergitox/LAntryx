"""Linux x86_64, same-handle HID identity validation and one bounded RGB frame."""
import fcntl
import hashlib
import json
import os
import platform
import re
import struct
import sys

DESCRIPTOR_HASH = "461f0e70d2935c415730c741c54e67da9bded09fbf8f6b40a1126212a1250144"


def ioctl_code(direction, number, size):
    # asm-generic/ioctl.h and linux/hidraw.h; production entry is x86_64-only.
    return (direction << 30) | (size << 16) | (ord("H") << 8) | number


def inspect_handle(fd):
    info = bytearray(8)
    fcntl.ioctl(fd, ioctl_code(2, 3, 8), info, True)
    bus, vendor, product = struct.unpack("<Ihh", info)
    size_buffer = bytearray(4)
    fcntl.ioctl(fd, ioctl_code(2, 1, 4), size_buffer, True)
    size = struct.unpack("<I", size_buffer)[0]
    if not 0 < size <= 4096:
        raise ValueError("invalid-descriptor")
    descriptor = bytearray(4100)
    struct.pack_into("<I", descriptor, 0, size)
    fcntl.ioctl(fd, ioctl_code(2, 2, 4100), descriptor, True)
    return (bus == 3 and vendor & 0xFFFF == 0x258A and product & 0xFFFF == 0x0049
            and hashlib.sha256(descriptor[4:4 + size]).hexdigest() == DESCRIPTOR_HASH)


def encode_frame(color):
    if (not isinstance(color, dict) or set(color) != {"r", "g", "b"}
            or any(type(v) is not int or not 0 <= v <= 255 for v in color.values())):
        raise ValueError("invalid-color")
    return bytearray([8, 10, 122, 1] + [color["r"], color["g"], color["b"]] * 126)


def send_frame(fd, frame):
    return fcntl.ioctl(fd, ioctl_code(3, 6, len(frame)), frame, True)


def probe(request, opener=os.open, inspect=inspect_handle, sender=send_frame, closer=os.close):
    frame = encode_frame(request.get("color"))
    if request.get("action") != "live-rgb" or not re.fullmatch(r"/dev/hidraw\d+", request.get("path", "")):
        raise ValueError("forbidden")
    fd = opener(request["path"], os.O_RDWR | os.O_CLOEXEC | os.O_NOFOLLOW)
    result = {"outcome": "failed", "message": "Opened-handle identity mismatch; no transfer requested."}
    try:
        if inspect(fd):
            try:
                count = sender(fd, frame)
                result = {"outcome": "transport-accepted" if count == len(frame) else "unknown",
                          "reportedCount": count, "reportBytes": len(frame),
                          "message": "Physical effect and persistence not confirmed."}
            except OSError as error:
                result = {"outcome": "unknown", "message": str(error)}
    finally:
        try:
            closer(fd)
        except OSError as error:
            result["cleanupWarning"] = str(error)
    return result


if __name__ == "__main__":
    try:
        if sys.platform != "linux" or platform.machine() != "x86_64" or sys.byteorder != "little":
            raise ValueError("This experimental ioctl backend is only validated structurally for Linux x86_64.")
        text = sys.stdin.buffer.read(4097)
        if len(text) > 4096:
            raise ValueError("oversized-request")
        print(json.dumps(probe(json.loads(text))))
    except (ValueError, OSError, TypeError) as error:
        print(json.dumps({"outcome": "failed", "message": str(error)}))
