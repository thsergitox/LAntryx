const { spawn: spawnProcess } = require("node:child_process");
const path = require("node:path");
function runWorker(message, { timeout = 3000, spawn = spawnProcess } = {}) {
  return new Promise((resolve) => {
    const child = spawn("python3", [path.join(__dirname, "native-probe.py")], {
      stdio: ["pipe", "pipe", "ignore"],
    });
    let settled = false,
      output = "";
    function finish(value) {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      child.kill("SIGKILL");
      resolve(value);
    }
    const timer = setTimeout(
      () =>
        finish({
          outcome: "unknown",
          message: "Timed out. No retry; a transfer may have occurred.",
        }),
      timeout,
    );
    child.stdout.on("data", (chunk) => {
      output += chunk.toString();
      if (output.length > 16384)
        finish({ outcome: "unknown", message: "Invalid worker output." });
    });
    child.once("error", () =>
      finish({
        outcome: "failed",
        message: "Could not start Python 3; no transfer requested.",
      }),
    );
    child.stdin.on("error", () =>
      finish({
        outcome: "unknown",
        message: "Worker input failed; outcome unknown.",
      }),
    );
    child.once("close", () => {
      try {
        const result = JSON.parse(output);
        if (
          !["transport-accepted", "failed", "unknown"].includes(result.outcome)
        )
          throw new Error();
        finish(result);
      } catch {
        finish({
          outcome: "unknown",
          message: "Worker ended without a valid result.",
        });
      }
    });
    child.stdin.end(JSON.stringify(message));
  });
}
module.exports = { runWorker };
