import { ipcRenderer, contextBridge } from 'electron';
import { WindowEvent } from './events';
import { XMLParser } from "fast-xml-parser"
import fs from "fs"

declare global {
  interface Window {
    ui: typeof ui_api;
    main: typeof main_api
  }
}

const ui_api = {
  Minimize: () => {
    ipcRenderer.send(WindowEvent.Minimize);
  },
  Close: () => {
    ipcRenderer.send(WindowEvent.Close);
  },
};

const main_api = {
  GetFile: async () => {
    return await ipcRenderer.invoke(WindowEvent.File)
  },
  StartService: () => {
    ipcRenderer.send(WindowEvent.DYMOWebServices)
  },
  on: {
    file: (callback: (data: any) => void) => {
      ipcRenderer.on(WindowEvent.FileOpen, (event: any, file: any) => {
        callback(new XMLParser().parse(fs.readFileSync(file).toString()))
      })
      
    }
  }
}

contextBridge.exposeInMainWorld('ui', ui_api);
contextBridge.exposeInMainWorld('main', main_api);
