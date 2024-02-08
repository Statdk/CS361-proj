const electron = require("electron");
const path = require("path");

function startWindow() {
  const window = new electron.BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "src", "preload.js"),
    },
  });

  // window.setMenu(null);
  window.loadFile(path.join(__dirname, "src", "index.html"));
}

electron.app.whenReady().then(() => {
  startWindow();
});

electron.app.on("window-all-closed", () => {
  electron.app.quit();
});
