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

declare interface UpdateResponse extends LabelResponse {
    payload?: {
        version: string;
        published: string;
        download_url: string;
    }
}

declare interface ConfigResponse extends LabelResponse {
    payload?: {
        configs: any
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