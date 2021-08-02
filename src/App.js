import React from "react";
import "./App.css";
import { Button } from "@material-ui/core";

//we can now amazingly access awsome shit in our render!
const fs = window.require("fs");
const parser = window.require("fast-xml-parser");
const { ipcRenderer } = window.require('electron');

const App = () => {
    //makes it so we can get our data async
    const readFile = async (path) => {
        return new Promise((resolve, reject) => {
            fs.readFile(path, "utf8", function (err, data) {
                if (err) reject(err);
                resolve(data);
            });
        });
    };

    const print = async () => {
        //setup template XML
        let rawTemplate = await readFile("./src/template/xml-template.xml");
        let template = rawTemplate.toString();
        //get the data rows
        let rawData = await readFile("./src/test/test1.xml");
        let data = [];
        //convert XML into JSON
        let json = parser.parse(rawData.toString());
        //extract the rows (this can be either a single object or an array!)
        let toBePrinted = json.Table.Row;
        //return row(s)
        data = (!toBePrinted.length) ? [toBePrinted] : [...toBePrinted]
        //start print process
        data.forEach((data) => {
            for (const key in data) {
                let regex = new RegExp(key, "g");
                if (template.indexOf(key) > -1)
                    template = template.toString().replace(regex, data[key]);
            }
            //listen for response from main process
            ipcRenderer.on('print-response', (event, arg) => {
                console.log(arg); // prints "Hello World!"
            });
            //try print
            ipcRenderer.send('print-label', template);
        });
    };

    return (
        <div className="App-header">
            <Button onClick={print} color="primary" variant="outlined">
                Print
            </Button>
        </div>
    );
};

export default App;
