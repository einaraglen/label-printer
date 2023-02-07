import { ipcRenderer, contextBridge } from "electron";
import { WindowEvent } from "./events";
import { Parser } from "./parser";
import { Config, Template, Variant } from "./store";

declare global {
  interface Window {
    ui: typeof ui_api;
    main: typeof main_api;
    store: typeof store_api;
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
    return await ipcRenderer.invoke(WindowEvent.File);
  },
  GetTemplate: async () => {
    return await ipcRenderer.invoke(WindowEvent.Template);
  },
  StartService: () => {
    ipcRenderer.send(WindowEvent.DYMOWebServices);
  },
  on: {
    file: (callback: (data: any) => void) => {
      ipcRenderer.on(WindowEvent.FileOpen, (event: any, file: any) => {
        Parser.csv(file).then((res) => callback(res));
      });
    },
    error: (callback: (data: any) => void) => {
      ipcRenderer.on(WindowEvent.Error, (event: any, err: any) => {
        callback(err);
      });
    },
  },
};

const store_api = {
  GetTemplates: async () => {
    return await ipcRenderer.invoke(WindowEvent.GetTemplates);
  },
  GetTemplate: async (template_id: string) => {
    return await ipcRenderer.invoke(WindowEvent.GetTemplate, template_id);
  },
  AddTemplate: async (args: { template_id: string, payload: Template }) => {
    return await ipcRenderer.invoke(WindowEvent.AddTemplate, args);
  },
  UpdateTemplate: async (args: { template_id: string, payload: Partial<Template> }) => {
    return await ipcRenderer.invoke(WindowEvent.UpdateTemplate, args);
  },
  DeleteTemplate: async (template_id: string) => {
    return await ipcRenderer.invoke(WindowEvent.DeleteTemplate, template_id);
  },
  GetConfigs: async (template_id: string) => {
    return await ipcRenderer.invoke(WindowEvent.GetConfigs, template_id);
  },
  GetConfig: async (args: { template_id: string, variant_id: string, config_id: string }) => {
    return await ipcRenderer.invoke(WindowEvent.GetConfig, args);
  },
  AddConfig: async (args: { template_id: string, variant_id: string, payload: Config }) => {
    return await ipcRenderer.invoke(WindowEvent.AddConfig, args);
  },
  UpdateConfig: async (args: { template_id: string, variant_id: string, config_id: string, payload: Partial<Config> }) => {
    return await ipcRenderer.invoke(WindowEvent.UpdateConfig, args);
  },
  DeleteConfig: async (args: { template_id: string, variant_id: string, config_id: string }) => {
    return await ipcRenderer.invoke(WindowEvent.DeleteConfig, args);
  },
  GetVariants: async () => {
    return await ipcRenderer.invoke(WindowEvent.GetVariants);
  },
  GetVariant: async (variant_id: string) => {
    return await ipcRenderer.invoke(WindowEvent.GetVariant, variant_id);
  },
  AddVariant: async (args: { variant_id: string, payload: Variant }) => {
    return await ipcRenderer.invoke(WindowEvent.AddVariant, args);
  },
  UpdateVariant: async (args: { variant_id: string, payload: Partial<Variant> }) => {
    return await ipcRenderer.invoke(WindowEvent.UpdateVariant, args);
  },
};

contextBridge.exposeInMainWorld("ui", ui_api);
contextBridge.exposeInMainWorld("main", main_api);
contextBridge.exposeInMainWorld("store", store_api);
