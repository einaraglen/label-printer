let fetcher: any;

if (typeof fetch === "undefined") {
  fetcher = require("node-fetch");
} else {
  fetcher = fetch;
}

export default class Dymo {
  hostname: string;
  port: number;
  printername: string;

  constructor(options: { hostname: string; port: number; printername: string }) {
    options = options || {};

    this.hostname = options.hostname || "127.0.0.1";
    this.port = options.port || 41951;
    this.printername = options.printername;
  }

  get apiUrl() {
    return `https://${this.hostname}:${this.port}/DYMO/DLS/Printing`;
  }

  print(printername: string, label_xml: string, label_set_xml = "") {
    let label = `printerName=${encodeURIComponent(printername)}&printParamsXml=&labelXml=${encodeURIComponent(label_xml)}&labelSetXml=${encodeURIComponent(label_set_xml)}`;

    if (typeof process !== "undefined" && process.env) {
      process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"; // TODO: Bundle the certificates.
    }

    return fetcher(`${this.apiUrl}/PrintLabel`, {
      method: "POST",
      body: label,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })
      .then((response: any) => {
          console.log(response)
          return response.text()
        })
      .then((result: any) => {
          console.warn(result)
          return result
        });
  }

  renderLabel(label_xml: string) {
    let label = `printerName=&renderParamsXml=&labelXml=${encodeURIComponent(label_xml)}&labelSetXml=`;

    if (typeof process !== "undefined" && process.env) {
      process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"; // TODO: Bundle the certificates.
    }

    return fetcher(`${this.apiUrl}/RenderLabel`, {
      method: "POST",
      body: label,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }).then((response: any) => {
        console.log(response.text())
        return response.text()
    }).catch((result: any) => {
        console.warn(result)
        return result;
    });
  }

  getStatus() {
    if (typeof process !== "undefined" && process.env) {
      process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"; // TODO: Bundle the certificates.
    }

    return fetcher(`${this.apiUrl}/StatusConnected`).then((response: any) => response.text()).catch((result: any) => result);
  }

  getPrinters() {
    if (typeof process !== "undefined" && process.env) {
      process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"; // TODO: Bundle the certificates.
    }

    return fetcher(`${this.apiUrl}/GetPrinters`).then((response: any) => response.text()).catch((result: any) => result);
  }
}