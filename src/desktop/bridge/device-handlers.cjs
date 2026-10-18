const { validateLighting } = require("../../profiles/model/schema.cjs");
function deviceHandlers(offline) {
  return {
    "device.inspect": () => offline.inspect(),
    "device.simulate": (input) => offline.apply(validateLighting(input), 0),
  };
}
module.exports = { deviceHandlers };
