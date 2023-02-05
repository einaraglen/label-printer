// Native
import { join } from 'path'
import { WindowEvent } from './events'
// Packages
import { BrowserWindow, app, ipcMain, IpcMainEvent} from 'electron'
import isDev from 'electron-is-dev'
import { Printer } from './printer'
import { startDYMOWebServices } from './startup'
import { XMLParser } from 'fast-xml-parser'
import fs from "fs"

const height = 400
const width = 600

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
      preload: join(__dirname, 'preload.js'),
    },
  })

  const port = process.env.PORT || 3000
  const url = isDev ? `http://localhost:${port}` : join(__dirname, '../src/out/index.html')

  if (isDev) {
    window.webContents.openDevTools()
    window?.loadURL(url)
  } else {
    window?.loadFile(url)
  }

  ipcMain.on(WindowEvent.Minimize, () => {
    window.isMinimized() ? window.restore() : window.minimize()
  })

  ipcMain.on(WindowEvent.Close, () => {
    window.close()
  })

  ipcMain.on(WindowEvent.DYMOWebServices, () => {
    startDYMOWebServices()
  })
}

ipcMain.handle(WindowEvent.Printers, async () => {
  return await Printer.list()
})

const test_path = "C:\\temp\\examples\\MaterialTransferRequisitions 210824-100806.xml"

app.whenReady().then(() => {
  createWindow()
  startDYMOWebServices()

  if (process.platform.startsWith('win') && process.argv.length >= 2) {
    const file = fs.readFileSync(process.argv[1] !== "." ?  process.argv[1] : test_path)
    ipcMain.handle(WindowEvent.File, () => {
      return new XMLParser().parse(file.toString())
    })
  }



  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

ipcMain.on('message', (event: IpcMainEvent, message: any) => {
  console.log(message)
  setTimeout(() => event.sender.send('message', 'hi from electron'), 500)
})
