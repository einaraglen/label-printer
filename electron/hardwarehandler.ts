import { IPC } from "./handletypes";
import { handleResponse, StatusType } from "./responsehandler";

const Dymo = require("dymojs");
const printer = new Dymo();
const { dialog } = require("electron");
const fs = require("fs");
const shell = require("electron").shell;
const Store = require("electron-store");
const store = new Store();
const parser = require("fast-xml-parser");

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
    if (!filePath) return handleResponse({ type: StatusType.Missing, message: formatFailure("exporting Config File", "Missing filepath") });
    if (filePath.length === 0) return handleResponse({ type: StatusType.Error, message: formatFailure("exporting Config File", "filepath length cannot be 0") });
    try {
      fs.writeFileSync(filePath, args, "utf-8");
      return handleResponse({ payload: { filePath } });
    } catch (err: any) {
      return handleResponse({ type: StatusType.Error, message: formatFailure("exporting Config File", err) });
    }
  });
};

const handleDYMOStatus = (event: any, args: any): Promise<LabelResponse> => {
  return printer
    .getStatus()
    .then((result: any) => {
      return handleResponse({ payload: result });
    })
    .catch((err: any) => {
      let message = err.message ?? "No message";
      return handleResponse({ type: StatusType.Error, message: formatFailure("checking DYMO status", message) });
    });
};

const handleImagePreview = (event: any, args: any): Promise<LabelResponse> => {
  // returns imageData as base64 encoded png.
  return printer
    .renderLabel(args)
    .then((imageData: any) => {
      return handleResponse({ payload: { image: imageData } });
    })
    .catch((err: any) => {
      let message = err.message ?? "No message";
      return handleResponse({ type: StatusType.Error, message: formatFailure("fetching Image Preview", message) });
    });
};

const handleOpenBrowser = async (event: any, args: any): Promise<LabelResponse> => {
  try {
    shell.openExternal(args);
    return handleResponse({});
  } catch (err: any) {
    return handleResponse({ type: StatusType.Error, message: formatFailure("opening browser", err) });
  }
};

const handlePrintLabel = async (event: any, args: any): Promise<LabelResponse> => {
  let printer = store.get(StoreKey.Printer);
  if (!printer) return handleResponse({ type: StatusType.Missing, message: formatFailure("printing", "Missing printer") });
  let result = await printer.print(printer, args);
  try {
    if (!JSON.parse(result).exceptionMessage) return handleResponse({});
    let message = JSON.parse(result).exceptionMessage ?? "No message";
    return handleResponse({ type: StatusType.Error, message: formatFailure("printing", message) });
  } catch (err: any) {
    return handleResponse({ type: StatusType.Error, message: formatFailure("printing", err) });
  }
};

const handleGetTemplate = async (event: any, args: any): Promise<LabelResponse> => {
  let template = store.get(StoreKey.Template);
  if (!template) return handleResponse({ type: StatusType.Missing, message: formatFailure("fetching template", "Could not find template") });
  return handleResponse({ payload: { template } });
};

const handleSetTemplate = async (event: any, args: any): Promise<LabelResponse> => {
  if (!args) return handleResponse({ type: StatusType.Missing, message: formatFailure("fetching template", "Could not find template") });
  store.set(StoreKey.Template, args);
  return handleResponse({ payload: { template: args } });
};

const handleGetTemplates = async (event: any, args: any): Promise<LabelResponse> => {
  let templates = store.get(StoreKey.Templates);
  if (!templates) return handleResponse({ type: StatusType.Missing, message: formatFailure("fetching templates", "Could not find templates") });
  return handleResponse({ payload: { templates } });
};

const handleSetTemplates = async (event: any, args: any): Promise<LabelResponse> => {
  if (!args) return handleResponse({ type: StatusType.Missing, message: formatFailure("fetching templates", "Could not find templates") });
  store.set(StoreKey.Templates, args);
  return handleResponse({ payload: { templates: args } });
};

const handleGetConfigs = async (event: any, args: any): Promise<LabelResponse> => {
  let configs = store.get(StoreKey.Configs, args);
  if (!configs) return handleResponse({ type: StatusType.Missing, message: formatFailure("fetching config", "Could not find config") });
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
  return printer
    .getPrinters()
    .then((result: any) => {
      //here we need to parse XML to JSON and return array
      return handleResponse({ payload: { printers: parser.parse(result) } });
    })
    .catch((err: any) => {
      return handleResponse({ type: StatusType.Missing, message: formatFailure("fetching printers", err) });
    });
};

const handleGetPrinter = async (event: any, args: any): Promise<LabelResponse> => {
  let _printer = store.get(StoreKey.Printer);
  if (!_printer) return handleResponse({ type: StatusType.Missing, message: formatFailure("fetching printer", "Could not find printer") });
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
