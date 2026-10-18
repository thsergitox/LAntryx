const { contextBridge, ipcRenderer } = require("electron");
async function invoke(action, payload) {
  const result = await ipcRenderer.invoke("lantryx:action", action, payload);
  if (!result.ok) throw new Error(result.error);
  return result.value;
}
contextBridge.exposeInMainWorld("lantryx", {
  profiles: {
    list: () => invoke("profiles.list"),
    warnings: () => invoke("profiles.warnings"),
    save: (profile) => invoke("profiles.save", profile),
    remove: (id) => invoke("profiles.remove", id),
    import: () => invoke("profiles.import"),
    export: (id) => invoke("profiles.export", id),
  },
  preferences: {
    get: () => invoke("preferences.get"),
    set: (language) => invoke("preferences.set", language),
  },
  device: {
    inspect: () => invoke("device.inspect"),
    simulate: (lighting) => invoke("device.simulate", lighting),
  },
});
