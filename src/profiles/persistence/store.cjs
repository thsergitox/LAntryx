const fs = require("node:fs/promises");
const path = require("node:path");
const { validateProfile, validateId } = require("../model/schema.cjs");
const { writeAtomic } = require("./atomic.cjs");
function createProfileStore(directory) {
  const file = (id) => path.join(directory, validateId(id) + ".json");
  return {
    async list() {
      await fs.mkdir(directory, { recursive: true, mode: 0o700 });
      const entries = await fs.readdir(directory);
      const result = [];
      for (const entry of entries.filter((name) => name.endsWith(".json"))) {
        const id = entry.slice(0, -5);
        const value = validateProfile(
          JSON.parse(await fs.readFile(file(id), "utf8")),
        );
        if (value.id !== id) throw new Error("invalid-profile");
        result.push(value);
      }
      return result.sort((a, b) => a.name.localeCompare(b.name));
    },
    async save(profile) {
      const value = validateProfile(profile);
      await writeAtomic(file(value.id), value);
    },
    async remove(id) {
      await fs.unlink(file(id));
    },
  };
}
module.exports = { createProfileStore };
