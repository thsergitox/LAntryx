const path = require("node:path");
function createWindow(BrowserWindow, origin) {
  const window = new BrowserWindow({
    width: 1180,
    height: 800,
    minWidth: 960,
    minHeight: 680,
    title: "LAntryx",
    backgroundColor: "#19221d",
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, "../bridge/preload.cjs"),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
      webSecurity: true,
    },
  });
  window.webContents.setWindowOpenHandler(() => ({ action: "deny" }));
  window.webContents.on("will-navigate", (event, url) => {
    if (new URL(url).origin !== origin) event.preventDefault();
  });
  window.loadURL(origin);
  return window;
}
module.exports = { createWindow };
