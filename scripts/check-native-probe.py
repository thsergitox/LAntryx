"""Focused fake-handle checks. Never opens a device or calls a real ioctl."""
import importlib.util
from pathlib import Path
spec = importlib.util.spec_from_file_location("native_probe", Path(__file__).resolve().parents[1] / "src/device/transport/native-probe.py")
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)
request = {"action": "live-rgb", "path": "/dev/hidraw99", "color": {"r": 255, "g": 0, "b": 128}}
assert len(module.encode_frame(request["color"])) == 382
assert module.encode_frame(request["color"])[-3:] == bytes([255, 0, 128])
sent = []
def sender(fd, frame):
    sent.append(bytes(frame))
    return 382
kwargs = {"opener": lambda *_: 42, "inspect": lambda _: True, "sender": sender, "closer": lambda _: None}
assert module.probe(request, **kwargs)["outcome"] == "transport-accepted"
assert len(sent) == 1
assert module.probe(request, **{**kwargs, "inspect": lambda _: False})["outcome"] == "failed"
assert len(sent) == 1, "Reused path/wrong opened descriptor must not send"
assert module.probe(request, **{**kwargs, "sender": lambda *_: 1})["outcome"] == "unknown"
def failed(*_):
    raise OSError("injected failure")
assert module.probe(request, **{**kwargs, "sender": failed})["outcome"] == "unknown"
result = module.probe(request, **{**kwargs, "closer": failed})
assert result["outcome"] == "transport-accepted" and "cleanupWarning" in result
assert module.ioctl_code(2, 1, 4) == 0x80044801
assert module.ioctl_code(2, 2, 4100) == 0x90044802
assert module.ioctl_code(3, 6, 382) == 0xC17E4806
print("PASS native probe: one fake transfer, opened-handle mismatch, short/uncertain send, cleanup preserves outcome")
