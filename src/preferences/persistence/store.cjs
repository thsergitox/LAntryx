const fs = require("node:fs/promises");
const { writeAtomic } = require("../../profiles/persistence/atomic.cjs");
function createPreferences(file) {
  return {
    async get() {
      try {
        const value = JSON.parse(await fs.readFile(file, "utf8"));
        return { language: value.language === "en" ? "en" : "es" };
      } catch (error) {
        if (error.code === "ENOENT") return { language: "es" };
        throw error;
      }
    },
    async set(language) {
      if (!["en", "es"].includes(language)) throw new Error("invalid-language");
      await writeAtomic(file, { language });
    },
  };
}
module.exports = { createPreferences };
