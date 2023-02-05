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

  print(printername: string, label_xml: string, label_set_xml = ""): Promise<any> {
    let label = `printerName=${encodeURIComponent(printername)}&printParamsXml=&labelXml=${encodeURIComponent(label_xml)}&labelSetXml=${encodeURIComponent(label_set_xml)}`;
    return this.dymo_api.post(`PrintLabel`, label)
  }

  getLabel(label_xml: string): Promise<any> {
    let label = `printerName=&renderParamsXml=&labelXml=${encodeURIComponent(label_xml)}&labelSetXml=`;
    return this.dymo_api.post(`RenderLabel`, label)
  }

  getStatus(): Promise<any> {
    return this.dymo_api.get(`StatusConnected`)
  }
  
  getPrinters(): Promise<any> {
    return this.dymo_api.get(`GetPrinters`)
  }
}