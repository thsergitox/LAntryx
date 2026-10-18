const fs = require("node:fs/promises");
const { randomUUID } = require("node:crypto");
const { validateProfile } = require("../model/schema.cjs");
const MAX_IMPORT = 64 * 1024;
function parseImport(bytes) {
  if (!Buffer.isBuffer(bytes) || bytes.length > MAX_IMPORT)
    throw new Error("invalid-profile");
  let value;
  try {
    value = JSON.parse(bytes.toString("utf8"));
  } catch {
    throw new Error("invalid-profile");
  }
  const profile = validateProfile(value);
  return { ...profile, id: randomUUID() };
}
async function readImport(file) {
  const handle = await fs.open(file, "r");
  try {
    const buffer = Buffer.alloc(MAX_IMPORT + 1);
    const { bytesRead } = await handle.read(buffer, 0, buffer.length, 0);
    return parseImport(buffer.subarray(0, bytesRead));
  } finally {
    await handle.close();
  }
}
module.exports = { parseImport, readImport, MAX_IMPORT };
