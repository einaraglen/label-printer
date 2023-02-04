// Native
import { join } from 'path';

// Packages
import { BrowserWindow, app, ipcMain, IpcMainEvent } from 'electron';
import isDev from 'electron-is-dev';

const height = 400;
const width = 600;

function createWindow() {
  const window = new BrowserWindow({
    width,
    height,
    frame: false,
    show: true,
    resizable: false,
    transparent: true, 
    fullscreenable: true,
    webPreferences: {
      preload: join(__dirname, 'preload.js')
    }
  });

  const port = process.env.PORT || 3000;
  const url = isDev ? `http://localhost:${port}` : join(__dirname, '../src/out/index.html');

  if (isDev) {
    window.webContents.openDevTools();
    window?.loadURL(url);
  } else {
    window?.loadFile(url);
  }

  ipcMain.on('minimize', () => {
    window.isMinimized() ? window.restore() : window.minimize();
  });

  ipcMain.on('close', () => {
    window.close();
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

ipcMain.on('message', (event: IpcMainEvent, message: any) => {
  console.log(message);
  setTimeout(() => event.sender.send('message', 'hi from electron'), 500);
});