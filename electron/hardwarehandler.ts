import { IPC } from "./handletypes";
import { handleResponse } from "./responsehandler";
import Dymo from "./lib/dymo";

const dymo = new Dymo();
const { dialog } = require("electron");
const fs = require("fs");
const shell = require("electron").shell;
const Store = require("electron-store");
const store = new Store();
const { XMLParser } = require("fast-xml-parser");
const parser = new XMLParser();
const codes = require("http-codes")

enum StoreKey {
  Printer = "lable.printer",
  Template = "label.template",
  Templates = "label.templates",
  Configs = "label.configs",
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
    case IPC.QUIT:
      return handleQuit(event, args);
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
      return handleResponse({ status: codes.INTERNAL_SERVER_ERROR, message: formatFailure("exporting Config File", err) });
    }
  });
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
    return handleResponse({ status: codes.INTERNAL_SERVER_ERROR, message: formatFailure("opening browser", err) });
  }
};

const handlePrintLabel = async (event: any, args: any): Promise<LabelResponse> => {
  let result = await dymo.print(args.printer, args.labels);
  console.log(result)
  if (checkStatus(result.status)) return handleResponse({ message: result.data });
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
  return handleResponse({ payload: { confisg: args } });
};

const handleGetPrinters = async (event: any, args: any): Promise<LabelResponse> => {
  //old way, we got every printer in system
  //return window.webContents.getPrinters();
  //new way, we get all printers recognized by DYMO Software
  let result = await dymo.getPrinters();
  if (checkStatus(result.status)) {
    let data = parser.parse(result.data);
    if ("Printers" in data) {
      let printers: any[] = [];
      if (data.Printers) {
        printers = !data.Printers.length ? [data.Printers] : [...data.Printers];
      }
      return handleResponse({ payload: { printers } });
    }
    return handleResponse({ status: codes.NOT_FOUND, message: formatFailure("fetching printers", "Error while accessing Printers") });
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
