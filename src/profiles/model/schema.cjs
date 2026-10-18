const { randomUUID } = require("node:crypto");
const UUID =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
function invalid() {
  throw new Error("invalid-profile");
}
function keys(value, expected) {
  if (!value || typeof value !== "object" || Array.isArray(value)) invalid();
  const actual = Object.keys(value);
  if (
    actual.length !== expected.length ||
    actual.some((key) => !expected.includes(key))
  )
    invalid();
}
function validateId(id) {
  if (typeof id !== "string" || !UUID.test(id)) invalid();
  return id;
}
function validateLighting(value) {
  keys(value, ["color", "brightness", "effect", "enabled"]);
  keys(value.color, ["r", "g", "b"]);
  if (
    Object.values(value.color).some(
      (v) => !Number.isInteger(v) || v < 0 || v > 255,
    )
  )
    invalid();
  if (
    ![1, 2, 3, 4, 5].includes(value.brightness) ||
    value.effect !== "uniform" ||
    typeof value.enabled !== "boolean"
  )
    invalid();
  return structuredClone(value);
}
function validateProfile(value) {
  keys(value, ["schemaVersion", "id", "name", "model", "layout", "lighting"]);
  validateId(value.id);
  if (
    value.schemaVersion !== 1 ||
    value.model !== "MK825-TRIX" ||
    value.layout !== "es-69"
  )
    invalid();
  if (
    typeof value.name !== "string" ||
    value.name !== value.name.trim() ||
    !value.name.length ||
    value.name.length > 64 ||
    /[\x00-\x1f\x7f]/.test(value.name)
  )
    invalid();
  return { ...value, lighting: validateLighting(value.lighting) };
}
function createProfile(name = "Mi perfil") {
  return validateProfile({
    schemaVersion: 1,
    id: randomUUID(),
    name,
    model: "MK825-TRIX",
    layout: "es-69",
    lighting: {
      color: { r: 152, g: 214, b: 160 },
      brightness: 4,
      effect: "uniform",
      enabled: true,
    },
  });
}
module.exports = {
  validateProfile,
  validateLighting,
  validateId,
  createProfile,
};
