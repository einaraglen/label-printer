// Native
import { join } from 'path'
import { WindowEvent } from './events'
// Packages
import { BrowserWindow, app, ipcMain } from 'electron'
import isDev from 'electron-is-dev'
import { Printer } from './printer'
import { startDYMOWebServices } from './startup'
import { Parser } from './parser'
import path from 'path'
import { ApplicationStore } from './store'

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

ipcMain.handle(WindowEvent.Template, async () => {
  return Parser.xml('.\\assets\\Part Label S0722400 LW 36x89mm.dymo')
})

ipcMain.handle(WindowEvent.GetTemplates, async () => {
  return ApplicationStore.template.all()
})

ipcMain.handle(WindowEvent.GetTemplate, async (event, args) => {
  return ApplicationStore.template.get(args)
})

ipcMain.handle(WindowEvent.AddTemplate, async (event, args) => {
  return ApplicationStore.template.add(args)
})

ipcMain.handle(WindowEvent.UpdateTemplate, async (event, args) => {
  return ApplicationStore.template.update(args)
})

ipcMain.handle(WindowEvent.DeleteTemplate, async (event, args) => {
  return ApplicationStore.template.delete(args)
})

ipcMain.handle(WindowEvent.GetConfigs, async (event, args) => {
  return ApplicationStore.config.all(args)
})

ipcMain.handle(WindowEvent.GetConfig, async (event, args) => {
  return ApplicationStore.config.get(args)
})

ipcMain.handle(WindowEvent.AddConfig, async (event, args) => {
  return ApplicationStore.config.add(args)
})

ipcMain.handle(WindowEvent.UpdateConfig, async (event, args) => {
  return ApplicationStore.config.update(args)
})

ipcMain.handle(WindowEvent.DeleteConfig, async (event, args) => {
  return ApplicationStore.config.delete(args)
})

ipcMain.handle(WindowEvent.GetVariants, async () => {
  return ApplicationStore.variant.all()
})

ipcMain.handle(WindowEvent.GetVariant, async (event, args) => {
  return ApplicationStore.variant.get(args)
})

ipcMain.handle(WindowEvent.AddVariant, async (event, args) => {
  return ApplicationStore.variant.add(args)
})

ipcMain.handle(WindowEvent.UpdateVariant, async (event, args) => {
  return ApplicationStore.variant.update(args)
})

const test_path = '.\\assets\\InventoryPartInStock 230206-111430.csv'

app.whenReady().then(() => {
  createWindow()
  // startDYMOWebServices()

  if (process.platform.startsWith('win') && process.argv.length >= 2) {
    const filepath = process.argv[1] !== '.' ? process.argv[1] : test_path
    ipcMain.handle(WindowEvent.File, async () => {
      const payload = await Parser.csv(filepath)
      const cache =  Object.keys(payload[0])
      const id = path.parse(filepath).name.replace(/[^a-zA-Z ]/g,'')
      ApplicationStore.variant.add({ variant_id: id, payload: { id, cache } })
      return payload
    })
  }

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
