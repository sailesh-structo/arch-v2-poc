const { app, BrowserWindow } = require("electron");

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
  });

  win.loadURL("http://localhost:4000/app");
};

app.whenReady().then(() => {
  createWindow();
});
