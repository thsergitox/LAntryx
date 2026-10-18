const fs = require("node:fs/promises");
const { readImport } = require("../../profiles/application/import-export.cjs");
function profileHandlers(store, dialog, getWindow) {
  return {
    "profiles.list": () => store.list(),
    "profiles.warnings": () => store.getWarnings(),
    "profiles.save": async (profile) => {
      await store.save(profile);
      return profile;
    },
    "profiles.remove": (id) => store.remove(id),
    "profiles.import": async () => {
      const result = await dialog.showOpenDialog(getWindow(), {
        properties: ["openFile"],
        filters: [{ name: "LAntryx JSON", extensions: ["json"] }],
      });
      if (result.canceled) return null;
      const profile = await readImport(result.filePaths[0]);
      await store.save(profile);
      return profile;
    },
    "profiles.export": async (id) => {
      const profile = (await store.list()).find((item) => item.id === id);
      if (!profile) throw new Error("invalid-profile");
      const result = await dialog.showSaveDialog(getWindow(), {
        defaultPath: "lantryx-profile.json",
        filters: [{ name: "LAntryx JSON", extensions: ["json"] }],
      });
      if (result.canceled || !result.filePath) return false;
      await fs.writeFile(
        result.filePath,
        JSON.stringify(profile, null, 2) + "\n",
        { mode: 0o600 },
      );
      return true;
    },
  };
}
module.exports = { profileHandlers };
