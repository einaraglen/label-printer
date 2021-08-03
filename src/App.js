import React from "react";
import "./App.css";
import { Button } from "@material-ui/core";
import FolderOpenIcon from "@material-ui/icons/FolderOpen";

//we can now amazingly access awsome shit in our render!
const fs = window.require("fs");
const parser = window.require("fast-xml-parser");
const { ipcRenderer } = window.require("electron");

const App = () => {
    const [text, setText] = React.useState("Path Here");
    const [templatePath, setTemplatePath] = React.useState(
        "./src/template/xml-template.xml"
    );
    //here we define what we want to extract from the IFS XML
    const keyValues = [
        "PartNo",
        "PartDescription",
        "SubProjectID",
        "ProjectID",
        "Quantity",
    ];

    React.useEffect(() => {
        const getTemplate = async () => {
            let result = await ipcRenderer.invoke("get-template");
            setTemplatePath(result);
        };
        getTemplate();
    }, []);

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
        //TODO: find a wait to select template file and store it
        if (!templatePath) return setText("Please select a Template");
        let rawTemplate = await readFile(templatePath);
        let template = rawTemplate.toString();
        //get data from opened file
        const result = await ipcRenderer.invoke("get-file");
        console.log(result);
        //exits methode if file is absent
        if (result.length === 0) return setText("App was not opened with file");
        let rawData = await readFile(result);
        let json = parser.parse(rawData.toString());
        //extract the rows (this can be either a single object or an array!)
        let toBePrinted = json.Table.Row;
        let data = !toBePrinted.length ? [toBePrinted] : [...toBePrinted];
        //start print process
        for (let i = 0; i < data.length; i++) {
            let current = data[i];
            for (let j = 0; j < keyValues.length; j++) {
                let regex = new RegExp(keyValues[j], "g");
                template = template
                    .toString()
                    .replace(regex, current[keyValues[j]]);
            }
            //try print
            let printResult = await ipcRenderer.invoke("print-label", template);
            console.log(printResult);
            await new Promise((resolve) => setTimeout(resolve, 2000));
            template = rawTemplate.toString();
        }
    };

    const handleInputChange = async (event) => {
        let result = await ipcRenderer.invoke("set-template", event.target.files[0].path);
        setText(result.message);
        if (result) setTemplatePath(event.target.files[0].path);
    };

    return (
        <div className="App-header">
            <div>
                <input
                    id="file-button"
                    style={{ display: "none" }}
                    accept="xml"
                    type="file"
                    name="upload_file"
                    onChange={handleInputChange}
                />
                <label
                    style={{
                        gridArea: "button",
                        width: "7rem",
                        margin: "auto",
                    }}
                    htmlFor="file-button"
                >
                    <Button
                        component="span"
                        variant="outlined"
                        color="primary"
                        startIcon={<FolderOpenIcon />}
                    >
                    </Button>
                </label>
            </div>
            <Button onClick={print} color="primary" variant="outlined">
                Print
            </Button>
            <p>{text}</p>
        </div>
    );
};

export default App;
