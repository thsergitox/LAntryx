process.once("message", async (message) => {
  try {
    if (!message || message.action !== "live-rgb") throw new Error("forbidden");
    const { inspectLinuxCandidates } = require("../detection/linux.cjs");
    const { validateCandidate } = require("../detection/identity.cjs");
    const candidates = (await inspectLinuxCandidates()).filter(
      (item) => validateCandidate(item).valid,
    );
    if (candidates.length !== 1) throw new Error("identity-mismatch");
    const { sendLiveFrame, loadNativeOpen } = require("./hid.cjs");
    process.send({
      ok: true,
      value: await sendLiveFrame(
        candidates[0],
        message.color,
        loadNativeOpen(),
      ),
    });
  } catch (error) {
    process.send({ ok: false, error: error.message });
  } finally {
    process.disconnect();
  }
});
