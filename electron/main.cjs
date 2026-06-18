const { app, BrowserWindow } = require('electron');
const path = require('path');

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1024,
    minHeight: 700,
    title: 'TomaShops — Video 1st Marketplace',
    icon: path.join(__dirname, '..', 'public', 'favicon.ico'),
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, 'preload.cjs'),
    },
    titleBarStyle: 'default',
    show: false,
  });

  win.loadFile(path.join(__dirname, '..', 'dist', 'index.html'));

  win.once('ready-to-show', () => {
    win.show();
  });
};

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
