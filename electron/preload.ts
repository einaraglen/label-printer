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
  Start: () => {
    ipcRenderer.send(WindowEvent.DYMOWebServices)
  }
};

contextBridge.exposeInMainWorld('ui', ui_api);