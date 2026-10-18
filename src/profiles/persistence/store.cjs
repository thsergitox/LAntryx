const fs = require("node:fs/promises");
const path = require("node:path");
const { validateProfile, validateId } = require("../model/schema.cjs");
const { writeAtomic } = require("./atomic.cjs");
function createProfileStore(directory) {
  let warnings = 0;
  const file = (id) => path.join(directory, validateId(id) + ".json");
  return {
    async list() {
      await fs.mkdir(directory, { recursive: true, mode: 0o700 });
      const entries = await fs.readdir(directory);
      const result = [];
      warnings = 0;
      for (const entry of entries.filter((name) => name.endsWith(".json"))) {
        try {
          const id = entry.slice(0, -5);
          const target = file(id);
          const stat = await fs.lstat(target);
          if (!stat.isFile() || stat.size > 65536)
            throw new Error("invalid-profile");
          const value = validateProfile(
            JSON.parse(await fs.readFile(target, "utf8")),
          );
          if (value.id !== id) throw new Error("invalid-profile");
          result.push(value);
        } catch (error) {
          if (
            !(error instanceof SyntaxError) &&
            error.message !== "invalid-profile" &&
            error.code !== "ENOENT"
          )
            throw error;
          warnings += 1;
        }
      }
      return result.sort((a, b) => a.name.localeCompare(b.name));
    },
    getWarnings() {
      return warnings;
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
