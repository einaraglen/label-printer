import React from "react";
import "./App.css";
import { Button } from "@material-ui/core";

//we can now amazingly access awsome shit in our render!
const fs = window.require("fs");
const parser = window.require("fast-xml-parser");
const { ipcRenderer } = window.require('electron');

const App = () => {
    const [text, setText] = React.useState("");
    //here we define what we want to extract from the IFS XML
    const keyValues = ["PartNo", "PartDescription", "SubProjectID", "ProjectID", "OnHandQty"]
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
        let rawData = await readFile("./src/test/test.xml");
        let data = [];
        //convert XML into JSON
        let json = parser.parse(rawData.toString());
        //extract the rows (this can be either a single object or an array!)
        let toBePrinted = json.Table.Row;
        //return row(s)
        data = (!toBePrinted.length) ? [toBePrinted] : [...toBePrinted]
        //start print process
        data.forEach((data) => {
            keyValues.forEach((key) => {
                let regex = new RegExp(key, "g");
                template = template.toString().replace(regex, data[key]);
            });
            //listen for response from main process
            ipcRenderer.on('print-response', (event, arg) => {
                console.log(arg);
            });
            //try print
            ipcRenderer.send('print-label', template);
            template = rawTemplate.toString();
        });
    };

    const test = () => {
        ipcRenderer.on('file-response', (event, arg) => {
            console.log(arg)
        });
        //try print
        ipcRenderer.send('get-file');
    }

    return (
        <div className="App-header">
            <Button onClick={test} color="primary" variant="outlined">
                Print
            </Button>
            <p>{text}</p>
        </div>
    );
};

export default App;
