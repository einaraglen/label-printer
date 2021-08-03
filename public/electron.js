const { app, BrowserWindow, ipcMain } = require("electron");
const fs = require("fs");
const path = require("path");
const Dymo = require("dymojs");
const printer = new Dymo();
const Store = require("electron-store");
const store = new Store();

const isDev = require("electron-is-dev");
const devEnv = /electron/.test(process.argv[0]);

require("@electron/remote/main").initialize();

let window;

//check if already open
const gotTheLock = app.requestSingleInstanceLock();
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
}

//build our renderer
const createWindow = () => {
    window = new BrowserWindow({
        width: 420,
        height: 200,
        fullscreenable: false,
        //frame: false,
        resizable: false,
        transparent: false,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            nodeIntegration: true,
            enableRemoteModule: true,
            contextIsolation: false,
            nodeIntegrationInWorker: true,
            nodeIntegrationInSubFrames: true,
        },
    });

    window.removeMenu();

    window.on("close", () => {
        window = null;
    });

    // and load the index.html of the app.
    window.loadURL(
        isDev
            ? "http://localhost:3000"
            : `file://${path.join(__dirname, "../build/index.html")}`
    );

    window.webContents.openDevTools();
};

//print method that renderer can acces via ipcRenderer
ipcMain.handle("print-label", async (event, arg) => {
    //
    try {
        printer.print("DYMO LabelWriter Wireless", arg);
        return { status: true, message: "Success!"};
    } catch (err) {
        return { status: false, messsage: err};
    }
});

//returns our stored path to template file || default is null
ipcMain.handle("get-template", async (event, arg) => {
    return store.get("template");
});

ipcMain.handle("set-template", async (event, arg) => {
    store.set("template", arg);
    return { status: true, message: "Template set!"}
});

//when ready
app.whenReady().then(() => {
    if (
        process.platform.startsWith("win") &&
        !devEnv &&
        process.argv.length >= 2
    ) {
        //if app is opened with file
        const filePath = process.argv[1];
        ipcMain.handle("get-file", (event, arg) => {
            return filePath;
        });
    } else {
        //opened default method
        ipcMain.handle("get-file", (event, arg) => {
            return "";
        });
    }

    createWindow();

    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

//MAC OS STUFF
app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
});
