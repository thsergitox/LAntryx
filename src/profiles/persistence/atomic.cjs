const fs = require("node:fs/promises");
const path = require("node:path");
const { randomUUID } = require("node:crypto");
async function writeAtomic(destination, value) {
  await fs.mkdir(path.dirname(destination), { recursive: true, mode: 0o700 });
  const temporary = `${destination}.${randomUUID()}.tmp`;
  try {
    const handle = await fs.open(temporary, "wx", 0o600);
    try {
      await handle.writeFile(JSON.stringify(value, null, 2) + "\n");
      await handle.sync();
    } finally {
      await handle.close();
    }
    await fs.rename(temporary, destination);
  } finally {
    await fs.rm(temporary, { force: true }).catch(() => {});
  }
}
module.exports = { writeAtomic };
