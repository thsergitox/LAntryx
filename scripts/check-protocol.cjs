const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const os = require("node:os");
const path = require("node:path");
const { encodeLiveRgb } = require("../src/lighting/protocol/live-rgb.cjs");
const {
  DESCRIPTOR_HASH,
  validateCandidate,
} = require("../src/device/detection/identity.cjs");
const { inspectLinuxCandidates } = require("../src/device/detection/linux.cjs");
const { sendLiveFrame } = require("../src/device/transport/hid.cjs");
(async () => {
  const frame = encodeLiveRgb({ r: 0, g: 128, b: 255 });
  assert.equal(frame.length, 382);
  assert.deepEqual([...frame.subarray(0, 4)], [8, 10, 122, 1]);
  for (let i = 4; i < 382; i += 3)
    assert.deepEqual([...frame.subarray(i, i + 3)], [0, 128, 255]);
  for (const rgb of [
    { r: -1, g: 0, b: 0 },
    { r: 256, g: 0, b: 0 },
    { r: 1.2, g: 0, b: 0 },
    { r: 0, g: 0, b: 0, a: 1 },
  ])
    assert.throws(() => encodeLiveRgb(rgb));
  const candidate = {
    vendorId: 0x258a,
    productId: 0x49,
    interface: 1,
    descriptorHash: DESCRIPTOR_HASH,
    path: "/dev/not-a-real-device",
  };
  assert.equal(validateCandidate(candidate).valid, true);
  for (const change of [
    { vendorId: 1 },
    { interface: 0 },
    { descriptorHash: "wrong" },
  ])
    assert.equal(validateCandidate({ ...candidate, ...change }).valid, false);
  let sends = 0,
    closes = 0;
  const open = async () => ({
    sendFeatureReport: async (bytes) => {
      sends++;
      assert.equal(bytes.length, 382);
      return 382;
    },
    close: async () => {
      closes++;
    },
  });
  assert.equal(
    (await sendLiveFrame(candidate, { r: 255, g: 0, b: 0 }, open)).outcome,
    "transport-accepted",
  );
  assert.equal(sends, 1);
  assert.equal(closes, 1);
  await assert.rejects(
    sendLiveFrame({ ...candidate, interface: 0 }, { r: 0, g: 0, b: 0 }, open),
  );
  assert.equal(sends, 1);
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "lantryx-sysfs-"));
  try {
    assert.deepEqual(await inspectLinuxCandidates(root), []);
    await fs.mkdir(path.join(root, "hidraw2", "device"), { recursive: true });
    await fs.writeFile(
      path.join(root, "hidraw2/device/uevent"),
      "HID_ID=0003:0000258A:00000049",
    );
    await fs.writeFile(
      path.join(root, "hidraw2/device/report_descriptor"),
      Buffer.from([1, 2]),
    );
    await fs.writeFile(
      path.join(root, "hidraw2/device/bInterfaceNumber"),
      "01",
    );
    const items = await inspectLinuxCandidates(root);
    assert.equal(items.length, 1);
    assert.equal(validateCandidate(items[0]).valid, false);
  } finally {
    await fs.rm(root, { recursive: true, force: true });
  }
  assert.equal(
    require.cache[require.resolve("../src/device/transport/hid.cjs")] !==
      undefined,
    true,
  );
  assert.equal(
    Object.keys(require.cache).some((file) => file.includes("/node-hid/")),
    false,
  );
  console.log(
    "PASS protocol: report-8 layout, RGB limits, identity rejection, single send, fixture-only sysfs, lazy HID",
  );
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
