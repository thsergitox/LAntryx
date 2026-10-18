const { validateLighting } = require("../../profiles/model/schema.cjs");
function createSession(transport) {
  let generation = 0,
    busy = false,
    closed = false;
  return {
    async inspect() {
      const state = await transport.inspect();
      return { ...state, generation };
    },
    async apply(input, expected) {
      const lighting = validateLighting(input);
      if (closed || busy || expected !== generation)
        throw new Error("device-unavailable");
      busy = true;
      try {
        const state = await transport.inspect();
        if (closed || expected !== generation)
          throw new Error("device-unavailable");
        if (!state.canApply) throw new Error("unverified");
        const result = await transport.apply(lighting, generation);
        return expected === generation
          ? result
          : { outcome: "unknown", generation, message: "disconnected" };
      } finally {
        busy = false;
      }
    },
    disconnect() {
      generation += 1;
    },
    async close() {
      closed = true;
      generation += 1;
      await transport.close();
    },
  };
}
module.exports = { createSession };
