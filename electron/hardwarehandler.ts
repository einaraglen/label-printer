import { IPC } from "./handletypes";
import { handleResponse } from "./responsehandler";
import Dymo from "./lib/dymo";
import Update from "./lib/updatE";

const dymo = new Dymo();
const update = new Update();
const { dialog } = require("electron");
const fs = require("fs");
const shell = require("electron").shell;
const Store = require("electron-store");
const store = new Store();
const { XMLParser } = require("fast-xml-parser");
const parser = new XMLParser();
const codes = require("http-codes");

enum StoreKey {
  Printer = "lable.printer",
  Template = "label.template",
  Templates = "label.templates",
  Configs = "label.configs",
  Username = "label.username",
}

interface Assets {
  browser_download_url: string;
}

interface Release {
  tag_name: string;
  published_at: string;
  body: string;
  assets: Assets[];
}

export const handleIPC = (accessor: string, event: any, args: any) => {
  switch (accessor) {
    case IPC.EXPORT_CONFIG:
      return handleExportConfig(event, args);
    case IPC.DYMO_STATUS:
      return handleDYMOStatus(event, args);
    case IPC.IMAGE_PREVIEW:
      return handleImagePreview(event, args);
    case IPC.OPEN_BROWSER:
      return handleOpenBrowser(event, args);
    case IPC.PRINT_LABEL:
      return handlePrintLabel(event, args);
    case IPC.GET_TEMPLATE:
      return handleGetTemplate(event, args);
    case IPC.SET_TEMPLATE:
      return handleSetTemplate(event, args);
    case IPC.GET_TEMPLATES:
      return handleGetTemplates(event, args);
    case IPC.SET_TEMPLATES:
      return handleSetTemplates(event, args);
    case IPC.GET_CONFIGS:
      return handleGetConfigs(event, args);
    case IPC.SET_CONFIGS:
      return handleSetConfigs(event, args);
    case IPC.GET_PRINTERS:
      return handleGetPrinters(event, args);
    case IPC.GET_PRINTER:
      return handleGetPrinter(event, args);
    case IPC.SET_PRINTER:
      return handleSetPrinter(event, args);
    case IPC.CHECK_UPDATE:
      return handleCheckUpdate(event, args);
    case IPC.QUIT:
      return handleQuit(event, args);
    case IPC.SET_USERNAME:
      return handleSetUsername(event, args);
    case IPC.GET_USERNAME:
      return handleGetUsername(event, args);
      case IPC.WIPE_STORAGE:
      return handleWipeElectronStore(event, args);
  }
};

const handleWipeElectronStore = (event: any, args: any) => {
  try {
    Object.keys(StoreKey).forEach((key: string) => {
      if (isNaN(parseInt(key)) && key !=="Username") {
        let storage_key = (StoreKey as any)[key];
        store.delete(storage_key);
      }
    });
    args.app.quit();
    return handleResponse({});
  } catch (err: any) {
    return handleResponse({ status: codes.INTERNAL_SERVER_ERROR, message: formatFailure("exporting Config File", err.message) });
  }
};

const handleExportConfig = (event: any, args: any): Promise<LabelResponse> => {
  let options = {
    title: "Export Config",
    defaultPath: "label-config",
    buttonLabel: "Save",
    filters: [{ name: "json", extensions: ["json"] }],
  };
  return dialog.showSaveDialog(null as any, options).then(({ filePath }) => {
    if (!filePath) return handleResponse({ status: codes.NOT_FOUND, message: formatFailure("exporting Config File", "Missing filepath") });
    if (filePath.length === 0) return handleResponse({ status: codes.NOT_FOUND, message: formatFailure("exporting Config File", "filepath length cannot be 0") });
    try {
      fs.writeFileSync(filePath, args, "utf-8");
      return handleResponse({ payload: { filePath } });
    } catch (err: any) {
      return handleResponse({ status: codes.INTERNAL_SERVER_ERROR, message: formatFailure("exporting Config File", err.message) });
    }
  });
};

const versionToNumber = (version: string): number => {
  try {
    let number = version.replace(/\./g, "");
    return parseInt(number);
  } catch (err: any) {
    throw err;
  }
};

const getURL = (release: Release): string | undefined => {
  try {
    return release.assets[0].browser_download_url;
  } catch (err: any) {
    throw err;
  }
};

const handleCheckUpdate = async (event: any, args: any): Promise<LabelResponse> => {
  let result = await update.getReleases();
  if (!checkStatus(result.status)) {
    let message = result.data || "No message";
    return handleResponse({ status: result.status, message: formatFailure("checking for updates", message) });
  }
  try {
    let current: Release = result.data;
    if (versionToNumber(current.tag_name) <= versionToNumber(args)) return handleResponse({ payload: null });
    let response: UpdateResponse = handleResponse({
      payload: {
        version: current.tag_name,
        published: current.published_at,
        download_url: getURL(current),
      },
    });
    return response;
  } catch (err: any) {
    return handleResponse({ status: result.status, message: formatFailure("checking for updates", err.message) });
  }
};

const handleDYMOStatus = async (event: any, args: any): Promise<LabelResponse> => {
  let result = await dymo.getStatus();
  if (checkStatus(result.status)) return handleResponse({ payload: result.data });
  let message = result.data || "No message";
  return handleResponse({ status: result.status, message: formatFailure("checking DYMO status", message) });
};

const handleImagePreview = async (event: any, args: any): Promise<LabelResponse> => {
  let result = await dymo.renderLabel(args);
  if (checkStatus(result.status)) return handleResponse({ payload: { image: result.data } });
  let message = result.data || "No message";
  return handleResponse({ status: result.status, message: formatFailure("fetching Image Preview", message) });
};

const handleOpenBrowser = async (event: any, args: any): Promise<LabelResponse> => {
  try {
    shell.openExternal(args);
    return handleResponse({});
  } catch (err: any) {
    return handleResponse({ status: codes.INTERNAL_SERVER_ERROR, message: formatFailure("opening browser", err.message) });
  }
};

const handlePrintLabel = async (event: any, args: any): Promise<LabelResponse> => {
  let result = await dymo.print(args.printer, args.labels);
  if (checkStatus(result.status)) return handleResponse({ payload: result.data });
  let message = result.data || "No message";
  return handleResponse({ status: result.status, message: formatFailure("printing", message) });
};

const handleGetTemplate = async (event: any, args: any): Promise<LabelResponse> => {
  let template = store.get(StoreKey.Template);
  if (!template) return handleResponse({ status: codes.NOT_FOUND, message: formatFailure("fetching template", "Could not find template") });
  return handleResponse({ payload: { template } });
};

const handleSetTemplate = async (event: any, args: any): Promise<LabelResponse> => {
  if (!args) return handleResponse({ status: codes.NOT_FOUND, message: formatFailure("fetching template", "Could not find template") });
  store.set(StoreKey.Template, args);
  return handleResponse({ payload: { template: args } });
};

const handleGetTemplates = async (event: any, args: any): Promise<LabelResponse> => {
  let templates = store.get(StoreKey.Templates);
  if (!templates) return handleResponse({ status: codes.NOT_FOUND, message: formatFailure("fetching templates", "Could not find templates") });
  return handleResponse({ payload: { templates } });
};

const handleSetTemplates = async (event: any, args: any): Promise<LabelResponse> => {
  if (!args) return handleResponse({ status: codes.NOT_FOUND, message: formatFailure("fetching templates", "Could not find templates") });
  store.set(StoreKey.Templates, args);
  return handleResponse({ payload: { templates: args } });
};

const handleGetConfigs = async (event: any, args: any): Promise<LabelResponse> => {
  let configs = store.get(StoreKey.Configs, args);
  if (!configs) return handleResponse({ status: codes.NOT_FOUND, message: formatFailure("fetching config", "Could not find config") });
  return handleResponse({ payload: { configs } });
};

const handleSetConfigs = async (event: any, args: any): Promise<LabelResponse> => {
  store.set(StoreKey.Configs, args);
  return handleResponse({ payload: { configs: args } });
};

const handleGetPrinters = async (event: any, args: any): Promise<LabelResponse> => {
  //old way, we got every printer in system
  //return window.webContents.getPrinters();
  //new way, we get all printers recognized by DYMO Software
  let result = await dymo.getPrinters();
  if (checkStatus(result.status)) {
    try {
      let data = parser.parse(result.data);
      if ("Printers" in data) {
        let printers: any[] = [];
        if (data.Printers) printers = !data.Printers.length ? [data.Printers] : [...data.Printers];
        let _message = `Found ${printers.length} printers!`;
        return handleResponse({ payload: { printers }, message: _message });
      }
      return handleResponse({ status: codes.NOT_FOUND, message: formatFailure("fetching printers", "Error while accessing Printers") });
    } catch (err: any) {
      return handleResponse({ status: codes.INTERNAL_SERVER_ERROR, message: formatFailure("fetching printers", err.message) });
    }
  }
  let message = result.data || "No message";
  return handleResponse({ status: result.status, message: formatFailure("fetching printers", message) });
};

const handleGetPrinter = async (event: any, args: any): Promise<LabelResponse> => {
  let _printer = store.get(StoreKey.Printer);
  if (!_printer) return handleResponse({ status: codes.NOT_FOUND, message: formatFailure("fetching printer", "Could not find printer") });
  return handleResponse({ payload: { printer: _printer } });
};

const handleSetPrinter = async (event: any, args: any): Promise<LabelResponse> => {
  store.set(StoreKey.Printer, args);
  return handleResponse({ payload: { printer: args } });
};

const handleGetUsername = async (event: any, args: any): Promise<LabelResponse> => {
  let _username = store.get(StoreKey.Username);
  if (!_username) return handleResponse({ status: codes.NOT_FOUND, message: formatFailure("fetching username", "Could not find username") });
  return handleResponse({ payload: { username: _username } });
};

const handleSetUsername = async (event: any, args: any): Promise<LabelResponse> => {
  store.set(StoreKey.Username, args);
  return handleResponse({ payload: { username: args } });
};

const handleQuit = async (event: any, args: any): Promise<LabelResponse> => {
  args.app.quit();
  return handleResponse({});
};

export const formatFailure = (when: string, message: string) => {
  return `Failure when ${when}: ${message}`;
};

const checkStatus = (statuscode: number): boolean => {
  return statuscode >= 200 && statuscode <= 299;
};
