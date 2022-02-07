export enum IPC {
    EXPORT_CONFIG = "EXPORT_CONFING",
    DYMO_STATUS = "DYMO_STATUS",
    IMAGE_PREVIEW = "IMAGE_PREVIEW",
    OPEN_BROWSER = "OPEN_BROWSER",
    PRINT_LABEL = "PRINT_LABEL",
    GET_TEMPLATE = "GET_TEMPLATE",
    SET_TEMPLATE = "SET_TEMPLATE",
    GET_TEMPLATES = "GET_TEMPLATES",
    SET_TEMPLATES = "SET_TEMPLATES",
    GET_CONFIGS = "GET_CONFIGS",
    SET_CONFIGS = "SET_CONFIGS",
    GET_PRINTERS = "GET_PRINTERS",
    GET_PRINTER = "GET_PRINTER",
    SET_PRINTER = "SET_PRINTER",
    QUIT = "QUIT",
    GET_FILE = "GET_FILE"
}

export enum ProgramState {
    Loading,
    Empty,
    Ready,
    Printing
}

export enum LogType {
    Success,
    Error,
    Failure,
    Info
}