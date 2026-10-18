const { app, BrowserWindow, ipcMain, dialog, session } = require("electron");
const path = require("node:path");
const { createWindow } = require("./window.cjs");
const { createProfileStore } = require("../../profiles/persistence/store.cjs");
const {
  createPreferences,
} = require("../../preferences/persistence/store.cjs");
const { profileHandlers } = require("../bridge/profile-handlers.cjs");
const { deviceHandlers } = require("../bridge/device-handlers.cjs");
const { validateSender, dispatch } = require("../bridge/policy.cjs");
const {
  createOfflineTransport,
} = require("../../device/transport/offline.cjs");
const origin = process.env.LANTRYX_DEV_ORIGIN;
if (!origin || !/^http:\/\/127\.0\.0\.1:\d+$/.test(origin))
  throw new Error("Start with npm run dev:offline");
if (process.env.LANTRYX_DATA_DIR)
  app.setPath("userData", path.resolve(process.env.LANTRYX_DATA_DIR));
let window;
app.whenReady().then(async () => {
  session.defaultSession.setPermissionRequestHandler(
    (_contents, _permission, callback) => callback(false),
  );
  session.defaultSession.setPermissionCheckHandler(() => false);
  const store = createProfileStore(
    path.join(app.getPath("userData"), "profiles"),
  );
  const preferences = createPreferences(
    path.join(app.getPath("userData"), "preferences.json"),
  );
  let language = "es";
  const handlers = {
    ...profileHandlers(store, dialog, () => window),
    ...deviceHandlers(createOfflineTransport()),
    "preferences.get": async () => {
      const value = await preferences.get();
      language = value.language;
      return value;
    },
    "preferences.set": async (value) => {
      await preferences.set(value);
      language = value;
    },
  };
  ipcMain.handle("lantryx:action", async (event, action, payload) => {
    try {
      validateSender(event, origin);
      return { ok: true, value: await dispatch(handlers, action, payload) };
    } catch (error) {
      const known = [
        "invalid-profile",
        "invalid-language",
        "forbidden",
        "device-unavailable",
        "unverified",
      ];
      return {
        ok: false,
        error: known.includes(error.message) ? error.message : "storage-error",
      };
    }
  });
  window = createWindow(BrowserWindow, origin);
  const { confirmClose } = require("./close-confirmation.cjs");
  window.webContents.on("will-prevent-unload", (event) =>
    confirmClose(window, dialog, language, event),
  );
});
app.on("window-all-closed", () => app.quit());
