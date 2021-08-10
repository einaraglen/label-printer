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
        width: 550,
        height: 320,
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

    //for debugging
   //window.webContents.openDevTools();
};

ipcMain.handle("image-preview", (event, arg) => {
    // returns imageData as base64 encoded png.
    return printer.renderLabel(arg).then(imageData => {
        return imageData;
    });
})

//print method that renderer can acces vi   a ipcRenderer
ipcMain.handle("print-label", async (event, arg) => {
    try {
        printer.print(store.get("printer"), arg);
        return { status: true, message: "Success!"};
    } catch (err) {
        return { status: false, messsage: err};
    }
});

//returns our stored path to template file || default is null
ipcMain.handle("get-template", async (event, arg) => {
    return store.get("template");
});

//set template variable in electron-store
ipcMain.handle("set-template", async (event, arg) => {
    store.set("template", arg);
    return { status: true, message: "Template set!"}
});

//get config used to select data
ipcMain.handle("get-config", async (event, arg) => {
    return store.get("config", arg);
});

//set config used to select data
ipcMain.handle("set-config", async (event, arg) => {
    store.set("config", arg);
    return { status: true, config: arg}
});

//quit app when done
ipcMain.handle("complete", async (event, arg) => {
    app.quit();
});

//returns printers connected to computer
ipcMain.handle("get-printers", async (event, arg) => {
    return window.webContents.getPrinters();
});

//returns printer stored in electron-store
ipcMain.handle("get-printer", async (event, arg) => {
    return store.get("printer");
});

//sets which printer we should use
ipcMain.handle("set-printer", async (event, arg) => {
    store.set("printer", arg);
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
