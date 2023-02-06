import { ipcRenderer, contextBridge } from 'electron';
import { WindowEvent } from './events';
import { Parser } from './parser';

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
  GetTemplate: async () => {
    return await ipcRenderer.invoke(WindowEvent.Template)
  },
  StartService: () => {
    ipcRenderer.send(WindowEvent.DYMOWebServices)
  },
  on: {
    file: (callback: (data: any) => void) => {
      ipcRenderer.on(WindowEvent.FileOpen, (event: any, file: any) => {
        Parser.csv(file).then((res) => callback(res))
      })
    },
    error: (callback: (data: any) => void) => {
      ipcRenderer.on(WindowEvent.Error, (event: any, err: any) => {
        callback(err)
      })
    }
  }
}

contextBridge.exposeInMainWorld('ui', ui_api);
contextBridge.exposeInMainWorld('main', main_api);
