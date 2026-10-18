const { encodeLiveRgb } = require("../../lighting/protocol/live-rgb.cjs");
const { validateCandidate } = require("../detection/identity.cjs");
async function sendLiveFrame(candidate, rgb, open) {
  if (!validateCandidate(candidate).valid) throw new Error("identity-mismatch");
  const report = encodeLiveRgb(rgb);
  const device = await open(candidate.path);
  try {
    const count = await device.sendFeatureReport([...report]);
    return {
      outcome: "transport-accepted",
      reportedCount: count,
      reportBytes: report.length,
      message: "Physical effect and persistence not confirmed",
    };
  } finally {
    await device.close();
  }
}
function loadNativeOpen() {
  const HID = require("node-hid");
  HID.setDriverType("hidraw");
  return (path) => HID.HIDAsync.open(path);
}
module.exports = { sendLiveFrame, loadNativeOpen };
