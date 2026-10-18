function createOfflineTransport() {
  return {
    async inspect() {
      return {
        generation: 0,
        status: "offline",
        canApply: false,
        reason: "offline",
      };
    },
    async apply(_lighting, generation) {
      return { outcome: "simulated", generation, message: "simulation-only" };
    },
    async close() {},
  };
}
module.exports = { createOfflineTransport };
