import { ipcRenderer, contextBridge } from 'electron';

declare global {
  interface Window {
    ui: typeof api;
  }
}

const api = {
  sendMessage: (message: string) => {
    ipcRenderer.send('message', message);
  },
  Minimize: () => {
    ipcRenderer.send('minimize');
  },
  Close: () => {
    ipcRenderer.send('close');
  },
};

contextBridge.exposeInMainWorld('ui', api);