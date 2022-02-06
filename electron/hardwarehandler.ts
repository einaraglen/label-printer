import { IPC } from "./handletypes";

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
  Config = "label.config"
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
    case IPC.GET_CONFIG:
      return handleGetConfig(event, args);
    case IPC.SET_CONFIG:
      return handleSetConfig(event, args);
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

const handleExportConfig = (event: any, args: any) => {
  let options = {
    title: "Export Config",
    defaultPath: "label-config",
    buttonLabel: "Save",
    filters: [{ name: "json", extensions: ["json"] }],
  };
  return dialog.showSaveDialog(null as any, options).then(({ filePath }) => {
    if (!filePath) return { status: false, message: "Config was not exported" };
    if (filePath.length === 0) return { status: false, message: "Config was not exported" };
    try {
      fs.writeFileSync(filePath, args, "utf-8");
      return {
        status: true,
        message: "Exported successfully",
        path: filePath,
      };
    } catch (err) {
      return { status: false, message: "File error while exporting" };
    }
  });
};

const handleDYMOStatus = (event: any, args: any) => {
  return printer
    .getStatus()
    .then((result: any) => {
      return { status: result };
    })
    .catch((err: any) => {
      return { status: false, error: err };
    });
};

const handleImagePreview = (event: any, args: any) => {
  // returns imageData as base64 encoded png.
  return printer
    .renderLabel(args)
    .then((imageData: any) => {
      return { status: true, image: imageData, printer: printer };
    })
    .catch((err: any) => {
      return { status: false, error: err, printer: printer };
    });
};

const handleOpenBrowser = (event: any, args: any) => {
  shell.openExternal(args);
};

const handlePrintLabel = async (event: any, args: any) => {
  let printer = store.get(StoreKey.Printer);
  let result = await printer.print(printer, args);
  if (!JSON.parse(result).exceptionMessage) return { status: true, message: "Success!" };
  return { status: false, message: JSON.parse(result).exceptionMessage };
};

const handleGetTemplate = async (event: any, args: any) => {
  return store.get("template");
};

const handleSetTemplate = async (event: any, args: any) => {
  store.set(StoreKey.Template, args);
  return { status: true, message: "Template set!" };
};

const handleGetConfig = async (event: any, args: any) => {
  return store.get(StoreKey.Config, args);
};

const handleSetConfig = async (event: any, args: any) => {
  store.set(StoreKey.Config, args);
  return { status: true, config: args };
};

const handleGetPrinters = async (event: any, args: any) => {
  //old way, we got every printer in system
  //return window.webContents.getPrinters();
  //new way, we get all printers recognized by DYMO Software
  return printer
    .getPrinters()
    .then((result: any) => {
      //here we need to parse XML to JSON and return array
      return parser.parse(result);
    })
    .catch((err: any) => {
      return { status: false, error: err };
    });
};

const handleGetPrinter = async (event: any, args: any) => {
  return store.get(StoreKey.Printer);
};

const handleSetPrinter = async (event: any, args: any) => {
  store.set(StoreKey.Printer, args);
  return { status: true, message: "Template set!" };
};

const handleQuit = async (event: any, args: any) => {
  args.app.quit();
};
