const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const Dymo = require("dymojs");
const printer = new Dymo();

require("@electron/remote/main").initialize();

let window;

const createWindow = () => {
    // Create the browser window.
    window = new BrowserWindow({
        width: 420,
        height: 200,
        fullscreenable: false,
        frame: false,
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
    window.loadURL("http://localhost:3000");

    window.webContents.openDevTools();
};

//print method that renderer can acces via ipcRenderer
ipcMain.on("print-label", (event, arg) => {
    try {
        console.log(arg)
        printer.print("DYMO LabelWriter Wireless", arg.replace(" ", ""));
        event.sender.send("print-response", {
            status: true,
            message: "Print Success!",
        });
    } catch (err) {
        event.sender.send("print-response", {
            status: false,
            message: err,
        });
    }
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
