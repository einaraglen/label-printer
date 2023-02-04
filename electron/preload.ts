import { ipcRenderer, contextBridge } from 'electron';
import { WindowEvent } from './events';

declare global {
  interface Window {
    ui: typeof ui_api;
  }
}

const ui_api = {
  Minimize: () => {
    ipcRenderer.send(WindowEvent.Minimize);
  },
  Close: () => {
    ipcRenderer.send(WindowEvent.Close);
  },
  Printers: () => {
    return "test" //ipcRenderer.send(WindowEvent.Printers)
  }
};

contextBridge.exposeInMainWorld('ui', ui_api);