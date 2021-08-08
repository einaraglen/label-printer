import React from "react";
import { Button } from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import { Context } from "context/State";

//we can now amazingly access awsome shit in our render!
const fs = window.require("fs");
const parser = window.require("fast-xml-parser");
const { ipcRenderer } = window.require("electron");
const path = window.require("path");

const PrintView = () => {
    const [imagePreview, setImagePreview] = React.useState(null);
    const [isLoading, setIsLoading] = React.useState(false);
    const [labels, setLabels] = React.useState([]);

    const state = React.useContext(Context);
    const stateRef = React.useRef(state);

    React.useEffect(() => {
        //test paths
        const paths = [
            "CustomerOrderS16112 210804-110500.xml",
            "InventoryPartInStock 210802-155209.xml",
            "PurchaseOrder629195 210803-141357.xml",
        ];

        const loadData = async () => {
            let result = await ipcRenderer.invoke("get-file");
            //for testing
            result = !result ? `./src/test/${paths[0]}` : result;
            const fileName = path.parse(result).base.toString().split(" ")[0];
            let currentConfig = getCurrentConfig(stateRef.current.value.config, fileName);
            const rawData = await readFile(result);
            const data = parser.parse(rawData);
            const rows = data.Table.Row;
            let currentData = !rows.length ? [rows] : [...rows];
            let tempPath = await ipcRenderer.invoke("get-template");
            //build print data for dymo printer
            let currentLabels = buildLabels(currentData, currentConfig, await readFile(tempPath), fileName);
            //preview first label
            if (!currentLabels[0]) return;
            let preview = await ipcRenderer.invoke("image-preview", currentLabels[0]);
            setImagePreview(preview.replace(/"/g, ""));
            setLabels([...currentLabels]);
        };

        loadData();
    }, []);

    const getCurrentConfig = (config, fileName) => {
        for (const property in config) if (fileName.indexOf(property) > -1) return config[property];
    };

    const buildLabels = (currentData, currentConfig, templateXML, fileName) => {
        let currentLabels = [];
        let labelXML = templateXML.toString();
        for (let i = 0; i < currentData.length; i++) {
            let current = currentData[i];
            for (const property in currentConfig) {
                const regex = new RegExp(property, "g");
                const currentProperty = currentConfig[property];
                //handle "LineInfo"
                if (property === "LineInfo") {
                    //TODO: handle shit and return the string
                    let lineInfo = handleLineInfo(currentProperty, fileName, current);
                    labelXML = labelXML.toString().replace(regex, lineInfo);
                } else {
                    labelXML = labelXML.toString().replace(regex, current[currentConfig[property]]);
                }
            }
            currentLabels.push(labelXML);
            //reset the template string
            labelXML = templateXML.toString();
        }
        return [...currentLabels];
    };

    const handleLineInfo = (currentProperty, fileName, current) => {
        let lineInfo = "";
        for (let i = 0; i < currentProperty.length; i++) {
            let currentLine = handleLine(currentProperty[i], fileName, current);
            lineInfo += currentLine;
            lineInfo += i === currentProperty.length - 1 || currentLine.length === 0 ? "" : " - ";
        }
        return lineInfo;
    };

    const handleLine = (currentPropertyOf, fileName, current) => {
        if (currentPropertyOf === "PurchaseOrder") return `PO ${fileName.replace("PurchaseOrder", "")}`;
        if (currentPropertyOf === "CustomersPONo") return `PO ${current[currentPropertyOf]}`;
        if (currentPropertyOf === "ProjectID")
            return current[currentPropertyOf].length !== 0 ? `P-${current[currentPropertyOf]}` : "";
        return current[currentPropertyOf];
    };

    //makes it so we can get our data async
    const readFile = async (path) => {
        return new Promise((resolve, reject) => {
            fs.readFile(path, "utf8", (err, data) => {
                if (err) reject(err);
                resolve(data);
            });
        });
    };

    const print = async () => {
        setIsLoading(true);
        for (let i = 0; i < labels.length; i++) {
            let currentLabel = labels[i].replace(/(\r\n|\n|\r)/gm, "");
            //set current preview
            let preview = await ipcRenderer.invoke("image-preview", currentLabel);
            setImagePreview(preview.replace(/"/g, ""));
            state.method.setButtonText(`Printing Label ${i + 1} of ${labels.length}`);
            let printResult = await ipcRenderer.invoke("print-label", currentLabel);
            await new Promise((resolve) => setTimeout(resolve, 2000));
        }
        //complete print with close
        state.method.setButtonText("Print Complete");
        setIsLoading(false);
        await new Promise((resolve) => setTimeout(resolve, 2000));
        await ipcRenderer.invoke("complete");
    };

    return (
        <>
            <div className="preview">
                {!imagePreview ? null : (
                    <img style={{ height: "8rem" }} alt="label preview" src={`data:image/png;base64,${imagePreview}`} />
                )}
            </div>
            <div className="print">
                <Button
                    onClick={!state.value.isTemplateGood || isLoading ? null : print}
                    color={!state.value.isTemplateGood ? "secondary" : "primary"}
                    variant="outlined"
                    style={{ width: "20rem" }}
                    endIcon={isLoading ? <CircularProgress size={20} /> : null}
                >
                    {state.value.buttonText}
                </Button>
            </div>
        </>
    );
};

export default PrintView;
