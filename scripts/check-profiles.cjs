const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const os = require("node:os");
const path = require("node:path");
const {
  createProfile,
  validateProfile,
} = require("../src/profiles/model/schema.cjs");
const { createProfileStore } = require("../src/profiles/persistence/store.cjs");
const {
  parseImport,
} = require("../src/profiles/application/import-export.cjs");
const {
  createPreferences,
} = require("../src/preferences/persistence/store.cjs");
(async () => {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), "lantryx-profiles-"));
  try {
    const store = createProfileStore(path.join(dir, "profiles"));
    const profile = createProfile();
    await store.save(profile);
    assert.deepEqual(await store.list(), [profile]);
    for (const change of [
      { schemaVersion: 2 },
      { name: " " },
      { name: " trailing " },
      { name: "x".repeat(65) },
      { id: "../../outside" },
      { path: "/tmp/escape" },
      { lighting: { ...profile.lighting, color: { r: -1, g: 0, b: 0 } } },
      { lighting: { ...profile.lighting, brightness: 6 } },
    ])
      assert.throws(() => validateProfile({ ...profile, ...change }));
    assert.throws(() => parseImport(Buffer.alloc(65537)));
    assert.throws(() => parseImport(Buffer.from("{")));
    const imported = parseImport(Buffer.from(JSON.stringify(profile)));
    assert.notEqual(imported.id, profile.id);
    await store.save(imported);
    assert.equal((await store.list()).length, 2);
    const rename = fs.rename;
    fs.rename = async () => {
      throw new Error("injected write failure");
    };
    try {
      await assert.rejects(store.save({ ...profile, name: "Changed" }));
    } finally {
      fs.rename = rename;
    }
    assert.equal(
      (await store.list()).find((p) => p.id === profile.id).name,
      profile.name,
    );
    assert.equal(
      (await fs.readdir(path.join(dir, "profiles"))).filter((n) =>
        n.endsWith(".tmp"),
      ).length,
      0,
    );
    const prefs = createPreferences(path.join(dir, "preferences.json"));
    assert.deepEqual(await prefs.get(), { language: "es" });
    await prefs.set("en");
    assert.deepEqual(await prefs.get(), { language: "en" });
    await assert.rejects(prefs.set("bad"));
    await store.remove(imported.id);
    assert.equal((await store.list()).length, 1);
    console.log(
      "PASS profiles: validation, import isolation, atomic failure, preferences, delete",
    );
  } finally {
    await fs.rm(dir, { recursive: true, force: true });
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
