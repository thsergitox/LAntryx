const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const os = require("node:os");
const path = require("node:path");
const { createProfile } = require("../src/profiles/model/schema.cjs");
const { createProfileStore } = require("../src/profiles/persistence/store.cjs");
(async () => {
  const directory = await fs.mkdtemp(
    path.join(os.tmpdir(), "lantryx-corrupt-"),
  );
  try {
    const store = createProfileStore(directory);
    const good = createProfile();
    await store.save(good);
    const broken = path.join(directory, createProfile().id + ".json");
    await fs.writeFile(broken, "{");
    assert.deepEqual(await store.list(), [good]);
    assert.equal(store.getWarnings(), 1);
    assert.equal(await fs.readFile(broken, "utf8"), "{");
    const {
      confirmClose,
    } = require("../src/desktop/lifecycle/close-confirmation.cjs");
    let allowed = false;
    confirmClose(
      {},
      {
        showMessageBoxSync: (_window, options) => {
          assert.equal(options.cancelId, 0);
          assert.equal(options.message, "Discard unsaved changes and close?");
          return 0;
        },
      },
      "en",
      {
        preventDefault() {
          allowed = true;
        },
      },
    );
    assert.equal(allowed, false);
    confirmClose({}, { showMessageBoxSync: () => 1 }, "es", {
      preventDefault() {
        allowed = true;
      },
    });
    assert.equal(allowed, true);
    console.log(
      "PASS review regression: healthy profiles survive a corrupt neighbor, warning surfaced, original intact",
    );
  } finally {
    await fs.rm(directory, { recursive: true, force: true });
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
