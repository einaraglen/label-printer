import React from "react";
import "./App.css";
import { Button } from "@material-ui/core";
import FolderOpenIcon from "@material-ui/icons/FolderOpen";
import CheckIcon from "@material-ui/icons/Check";
import ErrorOutlineIcon from "@material-ui/icons/ErrorOutline";

//we can now amazingly access awsome shit in our render!
const fs = window.require("fs");
const parser = window.require("fast-xml-parser");
const { ipcRenderer } = window.require("electron");

const App = () => {
    const [text, setText] = React.useState("");
    const [templatePath, setTemplatePath] = React.useState(null);
    const [template, setTemplate] = React.useState("");
    const [data, setData] = React.useState([]);
    const [imagePreview, setImagePreview] = React.useState(null);
    const [labels, setLabels] = React.useState([]);
    //here we define what we want to extract from the IFS XML
    const keyValues = [
        "PartNo",
        "PartDescription",
        "SubProjectID",
        "ProjectID",
        "Quantity",
    ];

    React.useEffect(() => {
        let currentTemplate = null;
        const getTemplate = async () => {
            let tempRes = await ipcRenderer.invoke("get-template");
            currentTemplate = tempRes;
            setTemplatePath(tempRes);
        };

        const loadData = async () => {
            //we chill for a bit to make sure we get the template path
            await new Promise((resolve) => setTimeout(resolve, 1000));
            //make sure we have a template
            if (!currentTemplate) return setText("Please select a Template");
            const templateXML = await readFile(currentTemplate);
            setTemplate(templateXML.toString());
            const result = await ipcRenderer.invoke("get-file");
            //make sure we have a print file
            if (result.length === 0)
                return setText("App was not opened with file");
            const rawData = await readFile(result);
            const data = parser.parse(rawData);
            const rows = data.Table.Row;
            setData(!rows.length ? [rows] : [...rows]);

            //build print data for dymo printer
            let labelXML = templateXML.toString();
            let currentData = !rows.length ? [rows] : [...rows];
            let currentLabels = [];
            for (let i = 0; i < currentData.length; i++) {
                let current = currentData[i];
                console.log(current)
                for (let j = 0; j < keyValues.length; j++) {
                    let regex = new RegExp(keyValues[j], "g");
                    labelXML = labelXML
                        .toString()
                        .replace(regex, current[keyValues[j]]);
                }
                currentLabels.push(labelXML);
                //reset the template string
                labelXML = templateXML.toString();
            }
            //preview first label
            let preview = await ipcRenderer.invoke(
                "image-preview",
                currentLabels[0]
            );
            setImagePreview(preview.replace(/"/g, ""));
            setLabels([...currentLabels]);
        };

        getTemplate();
        loadData();
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

    const isTemplateGood = () => {
        try {
            if (fs.existsSync(templatePath)) return true;
        } catch (err) {
            setText(err);
        }
        return false;
    };

    const print = async () => {
        for (let i = 0; i < labels.length; i++) {
            let currentLabel = labels[i].replace(/(\r\n|\n|\r)/gm, "");
            //set current preview
            let preview = await ipcRenderer.invoke(
                "image-preview",
                currentLabel
            );
            setImagePreview(preview.replace(/"/g, ""));
            setText(`Printing Label ${i + 1} of ${labels.length}`);
            let printResult = await ipcRenderer.invoke("print-label", currentLabel);
            console.log(printResult);
            await new Promise((resolve) => setTimeout(resolve, 2000));
        }
        //complete print with close
        setText("Print Complete");
        await new Promise((resolve) => setTimeout(resolve, 2000));
        await ipcRenderer.invoke("complete");
    };

    const handleInputChange = async (event) => {
        let result = await ipcRenderer.invoke(
            "set-template",
            event.target.files[0].path
        );
        setText(result.message);
        if (result) setTemplatePath(event.target.files[0].path);
    };

    return (
        <div className="main">
            <div className="template-picker">
                <input
                    id="file-button"
                    style={{ display: "none" }}
                    accept=".xml"
                    type="file"
                    name="upload_file"
                    onChange={handleInputChange}
                />
                <label htmlFor="file-button">
                    <Button
                        component="span"
                        variant="contained"
                        color="primary"
                        startIcon={<FolderOpenIcon />}
                        style={{ marginRight: ".4rem" }}
                    >
                        Template
                    </Button>
                </label>
                {!isTemplateGood() ? (
                    <ErrorOutlineIcon color="secondary" />
                ) : (
                    <CheckIcon color="primary" />
                )}
            </div>
            <div className="preview">
                {!imagePreview ? null : (
                    <img
                        style={{ height: "8rem" }}
                        alt="label preview"
                        src={`data:image/png;base64,${imagePreview}`}
                    />
                )}
            </div>
            <div className="print">
                <Button
                    disabled={!isTemplateGood()}
                    onClick={print}
                    color="primary"
                    variant="contained"
                >
                    Print
                </Button>
                <p>{text}</p>
            </div>
        </div>
    );
};

export default App;
