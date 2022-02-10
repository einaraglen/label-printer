import axios from "axios";

export default class Dymo {
  hostname: string;
  port: number;
  printername: string;
  dymo_api: any

  constructor(options?: { hostname: string; port: number; printername: string }) {
    let _options = options || { hostname: "", port: null, printername: "" };

    this.hostname = _options.hostname || "127.0.0.1";
    this.port = _options.port || 41951;
    this.printername = _options.printername;

    this.dymo_api = axios.create({
      baseURL: `https://${this.hostname}:${this.port}/DYMO/DLS/Printing`,
      withCredentials: false,
      headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
      },
  });
  }

  get apiUrl() {
    return `https://${this.hostname}:${this.port}/DYMO/DLS/Printing`;
  }

  print(printername: string, label_xml: string, label_set_xml = "") {
    let label = `printerName=${encodeURIComponent(printername)}&printParamsXml=&labelXml=${encodeURIComponent(label_xml)}&labelSetXml=${encodeURIComponent(label_set_xml)}`;

    if (typeof process !== "undefined" && process.env) {
      process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"; // TODO: Bundle the certificates.
    }

    return this.dymo_api
      .post(`PrintLabel`, label, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      })
      .then((response: any) => handleResponse(response))
      .catch((error: any) => handleErrorResponse(error));
  }

  renderLabel(label_xml: string) {
    let label = `printerName=&renderParamsXml=&labelXml=${encodeURIComponent(label_xml)}&labelSetXml=`;

    if (typeof process !== "undefined" && process.env) {
      process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"; // TODO: Bundle the certificates.
    }

    return this.dymo_api
      .post(`RenderLabel`, label, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      })
      .then((response: any) => handleResponse(response))
      .catch((error: any) => handleErrorResponse(error));
  }

  getStatus() {
    if (typeof process !== "undefined" && process.env) {
      process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"; // TODO: Bundle the certificates.
    }

    return this.dymo_api
      .get(`StatusConnected`)
      .then((response: any) => handleResponse(response))
      .catch((error: any) => handleErrorResponse(error));
  }

  getPrinters() {
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
  if (error.response) {
    // Request made and server responded
    return { data: error.response.data, status: error.response.status };
  } else if (error.request) {
    // The request was made but no response was received
    return { data: error.request, status: 500 };
  } else {
    // Something happened in setting up the request that triggered an Error
    return { data: error.message, status: 500 };
  }
};
