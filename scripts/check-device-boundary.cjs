const assert = require("node:assert/strict");
const { EventEmitter } = require("node:events");
const { createSession } = require("../src/device/connection/session.cjs");
const {
  createOfflineTransport,
} = require("../src/device/transport/offline.cjs");
const { dispatch } = require("../src/desktop/bridge/policy.cjs");
const { deviceHandlers } = require("../src/desktop/bridge/device-handlers.cjs");
const { createProfile } = require("../src/profiles/model/schema.cjs");
const { runWorker } = require("../src/device/transport/worker-client.cjs");
(async () => {
  const lighting = createProfile().lighting;
  const offline = createOfflineTransport();
  assert.equal((await offline.inspect()).canApply, false);
  assert.equal((await offline.apply(lighting, 0)).outcome, "simulated");
  await assert.rejects(createSession(offline).apply(lighting, 0));
  await assert.rejects(
    dispatch({}, "device.raw", { path: "/dev/hidraw0", bytes: [1] }),
  );
  await assert.rejects(
    dispatch(deviceHandlers(offline), "device.simulate", {
      ...lighting,
      path: "/dev/hidraw0",
    }),
  );
  let resolveApply;
  const transport = {
    inspect: async () => ({ canApply: true }),
    apply: () => new Promise((resolve) => (resolveApply = resolve)),
    close: async () => {},
  };
  const session = createSession(transport);
  const pending = session.apply(lighting, 0);
  await new Promise((resolve) => setImmediate(resolve));
  await assert.rejects(session.apply(lighting, 0));
  session.disconnect();
  resolveApply({ outcome: "transport-accepted", generation: 0 });
  assert.equal((await pending).outcome, "unknown");
  const instant = createSession({
    inspect: async () => ({ canApply: true }),
    apply: async () => ({ outcome: "transport-accepted", generation: 0 }),
    close: async () => {},
  });
  const concurrent = await Promise.allSettled([
    instant.apply(lighting, 0),
    instant.apply(lighting, 0),
  ]);
  assert.equal(
    concurrent.filter((item) => item.status === "fulfilled").length,
    1,
  );
  let killed = 0;
  const spawn = () => {
    const child = new EventEmitter();
    child.stdout = new EventEmitter();
    child.stdin = new EventEmitter();
    child.stdin.end = () => {};
    child.kill = () => {
      killed++;
    };
    return child;
  };
  assert.equal(
    (await runWorker({}, { timeout: 10, spawn })).outcome,
    "unknown",
  );
  assert.equal(killed, 1);
  console.log(
    "PASS device: offline refusal, IPC allowlist, validation, disconnect, duplicate apply, worker timeout",
  );
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
