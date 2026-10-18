const { fork } = require("node:child_process");
const path = require("node:path");
function runWorker(
  message,
  {
    timeout = 3000,
    spawn = fork,
    workerPath = path.join(__dirname, "worker.cjs"),
  } = {},
) {
  return new Promise((resolve) => {
    const child = spawn(workerPath, [], {
      stdio: ["ignore", "ignore", "ignore", "ipc"],
    });
    let settled = false;
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
    child.once("message", (result) =>
      finish(
        result.ok ? result.value : { outcome: "failed", message: result.error },
      ),
    );
    child.once("error", () =>
      finish({
        outcome: "unknown",
        message: "Worker failed; outcome unknown.",
      }),
    );
    child.once("exit", () =>
      finish({
        outcome: "unknown",
        message: "Worker exited without a result.",
      }),
    );
    child.send(message);
  });
}
module.exports = { runWorker };
