const fs = require("node:fs/promises");
const path = require("node:path");
const { createHash } = require("node:crypto");
async function findInterface(directory) {
  for (
    let current = directory;
    current !== "/";
    current = path.dirname(current)
  ) {
    try {
      return parseInt(
        (
          await fs.readFile(path.join(current, "bInterfaceNumber"), "utf8")
        ).trim(),
        16,
      );
    } catch (error) {
      if (!["ENOENT", "ENOTDIR"].includes(error.code)) throw error;
    }
  }
  return -1;
}
async function inspectLinuxCandidates(root = "/sys/class/hidraw") {
  let entries;
  try {
    entries = await fs.readdir(root);
  } catch (error) {
    if (error.code === "ENOENT") return [];
    throw error;
  }
  const candidates = [];
  for (const name of entries.filter((name) => /^hidraw\d+$/.test(name))) {
    try {
      const device = await fs.realpath(path.join(root, name, "device"));
      const uevent = await fs.readFile(path.join(device, "uevent"), "utf8");
      const match = uevent.match(
        /^HID_ID=[0-9A-Fa-f]+:([0-9A-Fa-f]+):([0-9A-Fa-f]+)/m,
      );
      if (
        !match ||
        parseInt(match[1], 16) !== 0x258a ||
        parseInt(match[2], 16) !== 0x49
      )
        continue;
      const descriptor = await fs.readFile(
        path.join(device, "report_descriptor"),
      );
      candidates.push({
        path: path.join("/dev", name),
        vendorId: parseInt(match[1], 16),
        productId: parseInt(match[2], 16),
        interface: await findInterface(device),
        descriptorHash: createHash("sha256").update(descriptor).digest("hex"),
      });
    } catch (error) {
      if (["ENOENT", "ENODEV"].includes(error.code)) continue;
      throw error;
    }
  }
  return candidates;
}
module.exports = { inspectLinuxCandidates };
