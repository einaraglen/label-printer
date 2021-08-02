const { app, BrowserWindow, ipcMain } = require("electron");
const fs = require("fs");
const path = require("path");
const Dymo = require("dymojs");
const printer = new Dymo();

const isDev = require("electron-is-dev");

require("@electron/remote/main").initialize();

let window;
const files = [];

const createWindow = () => {
    // Create the browser window.
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
ipcMain.on("print-label", async (event, arg) => {
    //
    try {
        printer.print("DYMO LabelWriter Wireless", arg);
        //give label time to print
        await new Promise((resolve) => setTimeout(resolve, 2000));
        event.sender.send("print-response", {
            status: true,
            message: "Print Success!",
        });
    } catch (err) {
        console.log(err);
        event.sender.send("print-response", {
            status: false,
            message: err,
        });
    }
});

ipcMain.on("get-file", (event, arg) => {
    event.sender.send("file-response", files);
});

//when OS deos "open file with <THIS_APP>"
app.on("open-file", (event, path) => {
    files.push(path);
});

//MAC OS STUFF
app.whenReady().then(() => {
    createWindow();
    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
});
