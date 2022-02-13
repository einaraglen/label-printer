import axios from "axios";

export default class Dymo {
  hostname: string;
  port: number;
  printername: string;
  dymo_api: any;

  constructor(options?: { hostname: string; port: number; printername: string }) {
    let _options = options || { hostname: "", port: null, printername: "" };

    this.hostname = _options.hostname || "127.0.0.1";
    this.port = _options.port || 41951;
    this.printername = _options.printername;

    this.dymo_api = axios.create({
      baseURL: `https://${this.hostname}:${this.port}/DYMO/DLS/Printing`,
      withCredentials: false,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
      },
    });
  }

  get apiUrl() {
    return `https://${this.hostname}:${this.port}/DYMO/DLS/Printing`;
  }

  print(printername: string, label_xml: string, label_set_xml = ""): DymoResponse {
    let label = `printerName=${encodeURIComponent(printername)}&printParamsXml=&labelXml=${encodeURIComponent(label_xml)}&labelSetXml=${encodeURIComponent(label_set_xml)}`;

    if (typeof process !== "undefined" && process.env) {
      process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"; // TODO: Bundle the certificates.
    }

    return this.dymo_api
      .post(`PrintLabel`, label)
      .then((response: any) => handleResponse(response))
      .catch((error: any) => handleErrorResponse(error));
  }

  renderLabel(label_xml: string): DymoResponse {
    let label = `printerName=&renderParamsXml=&labelXml=${encodeURIComponent(label_xml)}&labelSetXml=`;

    if (typeof process !== "undefined" && process.env) {
      process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"; // TODO: Bundle the certificates.
    }

    return this.dymo_api
      .post(`RenderLabel`, label)
      .then((response: any) => handleResponse(response))
      .catch((error: any) => handleErrorResponse(error));
  }

  getStatus(): DymoResponse {
    if (typeof process !== "undefined" && process.env) {
      process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"; // TODO: Bundle the certificates.
    }

    return this.dymo_api
      .get(`StatusConnected`)
      .then((response: any) => handleResponse(response))
      .catch((error: any) => handleErrorResponse(error));
  }

  getPrinters(): DymoResponse {
    if (typeof process !== "undefined" && process.env) {
      process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"; // TODO: Bundle the certificates.
    }

    return this.dymo_api
      .get(`GetPrinters`)
      .then((response: any) => handleResponse(response))
      .catch((error: any) => handleErrorResponse(error));
  }
}

interface DymoResponse {
  data: any;
  status: number;
}

const handleResponse = (response: any): DymoResponse => {
  return {
    data: response.data,
    status: response.status,
  };
};

export const handleErrorResponse = (error: any): DymoResponse => {
  try {
    //426 Upgrade Required / DYMO Web Service needs restart
    if (!error.toJSON().code) return { data: "Restart DYMO Web Services", status: 426 };
    if (error.toJSON()) return { data: error.toJSON().message, status: error.toJSON().status };
    if (error.response) return { data: error.response.data, status: error.response.status };
    // Request made and server responded
    if (error.request) return { data: error.request, status: 500 };
    // The request was made but no response was received
    // Something happened in setting up the request that triggered an Error
    return { data: error.message, status: 500 };
  } catch (err: any) {
    return { data: err, status: 500 };
  }
};
