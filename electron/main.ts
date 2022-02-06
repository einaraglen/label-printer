import { app, BrowserWindow, ipcMain } from "electron";
import * as path from "path";
import * as isDev from "electron-is-dev";
import installExtension, { REACT_DEVELOPER_TOOLS } from "electron-devtools-installer";
import { IPC } from "./handletypes";
import { formatFailure, handleIPC } from "./hardwarehandler";
import { handleResponse, StatusType } from "./responsehandler";

const devEnv = /electron/.test(process.argv[0]);

let window: BrowserWindow | null = null;

//check if already open
/*const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
} else {
  app.on("second-instance", (event, commandLine, workingDirectory) => {
    // Someone tried to run a second instance, we should focus our window.
    if (window) {
      if (window.isMinimized()) window.restore();
      window.focus();
    }
  });
}*/

//build our renderer
const createWindow = () => {
  window = new BrowserWindow({
    width: 550,
    height: 320,
    fullscreenable: false,
    //frame: false,
    resizable: false,
    transparent: false,
    webPreferences: {
      nodeIntegration: true,
      //enableRemoteModule: true,
      contextIsolation: false,
      nodeIntegrationInWorker: true,
      nodeIntegrationInSubFrames: true,
    },
  });

  window.removeMenu();

  window.on("close", () => {
    window = null;
  });

  window.loadURL(isDev ? "http://localhost:3000" : `file://${path.join(__dirname, "../build/index.html")}`);

  // DevTools
  installExtension(REACT_DEVELOPER_TOOLS)
    .then((name) => console.log(`Added Extension:  ${name}`))
    .catch((err) => console.log("An error occurred: ", err));

  if (isDev) {
    window.webContents.openDevTools();
  }
};

ipcMain.handle(IPC.EXPORT_CONFIG, async (event: any, arg: any) => handleIPC(IPC.EXPORT_CONFIG, event, arg));
ipcMain.handle(IPC.DYMO_STATUS, async (event: any, arg: any) => handleIPC(IPC.DYMO_STATUS, event, arg));
ipcMain.handle(IPC.IMAGE_PREVIEW, async (event: any, arg: any) => handleIPC(IPC.IMAGE_PREVIEW, event, arg));
ipcMain.handle(IPC.OPEN_BROWSER, async (event: any, arg: any) => handleIPC(IPC.OPEN_BROWSER, event, arg));
ipcMain.handle(IPC.PRINT_LABEL, async (event: any, arg: any) => handleIPC(IPC.PRINT_LABEL, event, arg));

ipcMain.handle(IPC.GET_TEMPLATE, async (event: any, arg: any) => handleIPC(IPC.GET_TEMPLATE, event, arg));
ipcMain.handle(IPC.SET_TEMPLATE, async (event: any, arg: any) => handleIPC(IPC.SET_TEMPLATE, event, arg));

ipcMain.handle(IPC.GET_TEMPLATES, async (event: any, arg: any) => handleIPC(IPC.GET_TEMPLATES, event, arg));
ipcMain.handle(IPC.SET_TEMPLATES, async (event: any, arg: any) => handleIPC(IPC.SET_TEMPLATES, event, arg));

ipcMain.handle(IPC.GET_CONFIGS, async (event: any, arg: any) => handleIPC(IPC.GET_CONFIGS, event, arg));
ipcMain.handle(IPC.SET_CONFIGS, async (event: any, arg: any) => handleIPC(IPC.SET_CONFIGS, event, arg));

ipcMain.handle(IPC.GET_PRINTERS, async (event: any, arg: any) => handleIPC(IPC.GET_PRINTERS, event, arg));
ipcMain.handle(IPC.GET_PRINTER, async (event: any, arg: any) => handleIPC(IPC.GET_PRINTER, event, arg));
ipcMain.handle(IPC.SET_PRINTER, async (event: any, arg: any) => handleIPC(IPC.SET_PRINTER, event, arg));

ipcMain.handle(IPC.QUIT, async (event: any, arg: any) => handleIPC(IPC.QUIT, event, { app }));

//when ready
app.whenReady().then(() => {
  if (process.platform.startsWith("win") && !devEnv && process.argv.length >= 2) {
    //if app is opened with file
    const filepath = process.argv[1];
    ipcMain.handle(IPC.GET_FILE, (event, arg) => {
      return handleResponse({ payload: { filepath } });
    });
  } else {
    //opened default method
    ipcMain.handle(IPC.GET_FILE, (event, arg) => {
      return handleResponse({ type: StatusType.Missing, message: formatFailure("fetching FilePath", "No file found on-open") });
    });
  }

  createWindow();

  app.on("activate", () => {
    //if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

//app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});