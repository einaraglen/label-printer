declare interface ProgramLog {
    created: string;
    type: LogType;
    message: string;
}

declare interface ProgramStatus {
    isFile: boolean;
    isTemplate: boolean;
    isConfig: boolean;
    isDYMO: boolean;
    isPrinter: boolean
}

declare interface Template {
    filepath: string;
}

declare interface ConfigKey {
    key: string;
    accessor: string;
}

declare interface Config {
    name: string; 
    number?: ConfigKey;
    description?: ConfigKey;
    quantity?: ConfigKey;
    info?: ConfigKey;
}

declare interface ReduxState {
    state: ProgramState;
    status: ProgramStatus
    filepath: string | null,
    template: Template | null;
    templates: Template[];
    config: Config | null;
    configs: Config[];
    logs: ProgramLog[];
}

declare interface LabelResponse {
    statuscode: number;
    message: string;
    payload?: any;
}

declare interface ExportConfigResponse extends LabelResponse {
    payload?: {
        filepath: string;
    }
}

declare interface DYMOStatusResponse extends LabelResponse {}

declare interface ImagePreviewResponse extends LabelResponse {
    payload?: {
        image: string
    }
}

declare interface PrintLabelResponse extends LabelResponse {}

declare interface TemplateResponse extends LabelResponse {
    payload?: {
        template: any
    }
}

declare interface TemplatesResponse extends LabelResponse {
    payload?: {
        templates: any
    }
}

declare interface ConfigResponse extends LabelResponse {
    payload?: {
        config: any
    }
}

declare interface DYMOPrintersResponse extends LabelResponse {
    payload?: {
        printers: any
    }
}

declare interface PrinterResponse extends LabelResponse {
    payload?: {
        printer: any
    }
}