import React from "react";
import "./App.css";
import { Button } from "@material-ui/core";
import FolderOpenIcon from "@material-ui/icons/FolderOpen";
import CheckIcon from "@material-ui/icons/Check";
import ErrorOutlineIcon from "@material-ui/icons/ErrorOutline";
import Tooltip from "@material-ui/core/Tooltip";
import CircularProgress from "@material-ui/core/CircularProgress";
import { MenuItem, FormControl, Select } from "@material-ui/core/";

//we can now amazingly access awsome shit in our render!
const fs = window.require("fs");
const parser = window.require("fast-xml-parser");
const { ipcRenderer } = window.require("electron");
const path = window.require("path");

const App = () => {
    const [text, setText] = React.useState("Print");
    const [templatePath, setTemplatePath] = React.useState(null);
    const [imagePreview, setImagePreview] = React.useState(null);
    const [labels, setLabels] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(false);
    const [printers, setPrinters] = React.useState([]);
    const [printer, setPrinter] = React.useState("");

    const config = {
        CustomerOrder: {
            PartNo: "SalesPartNo",
            PartDescription: "Description",
            LineInfo: ["CustomersPONo", "ProjectID"],
            Quantity: "SalesQty",
        },
        InventoryPartInStock: {
            PartNo: "PartNo",
            PartDescription: "PartDescription",
            LineInfo: ["ProjectID", "SubProjectID"],
            Quantity: "OnHandQty",
        },
        PurchaseOrder: {
            PartNo: "PartNo",
            PartDescription: "PartDescription",
            LineInfo: ["PurchaseOrder", "ProjectID", "SubProjectID"],
            Quantity: "Quantity",
        },
    };

    const confRef = React.useRef(config);

    React.useEffect(() => {
        let currentTemplate = null;
        const getTemplate = async () => {
            let tempRes = await ipcRenderer.invoke("get-template");
            currentTemplate = tempRes;
            setTemplatePath(tempRes);
        };

        //test paths
        const paths = [
            "CustomerOrderS16112 210804-110500.xml",
            "InventoryPartInStock 210802-155209.xml",
            "PurchaseOrder629195 210803-141357.xml",
        ];

        const loadData = async () => {
            let printers = await ipcRenderer.invoke("get-printers");
            setPrinters(printers)
            let printer = await ipcRenderer.invoke("get-printer");
            setPrinter(printer)
            //we chill for a bit to make sure we get the template path
            await new Promise((resolve) => setTimeout(resolve, 1000));
            //make sure we have a template
            if (!currentTemplate) return setText("Please select a Template");
            const templateXML = await readFile(currentTemplate);
            let result = await ipcRenderer.invoke("get-file");
            //for testing
            result = !result ? `./src/test/${paths[2]}` : result;
            const fileName = path.parse(result).base.toString().split(" ")[0];
            let currentConfig = {};
            for (const property in confRef.current)
                if (fileName.indexOf(property) > -1)
                    currentConfig = confRef.current[property];
            const rawData = await readFile(result);
            const data = parser.parse(rawData);
            const rows = data.Table.Row;
            let currentData = !rows.length ? [rows] : [...rows];
            //build print data for dymo printer
            let labelXML = templateXML.toString();
            let currentLabels = buildLabels(
                currentData,
                currentConfig,
                labelXML,
                templateXML,
                fileName
            );
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

    const buildLabels = (
        currentData,
        currentConfig,
        labelXML,
        templateXML,
        fileName
    ) => {
        let currentLabels = [];
        for (let i = 0; i < currentData.length; i++) {
            let current = currentData[i];
            for (const property in currentConfig) {
                const regex = new RegExp(property, "g");
                const currentProperty = currentConfig[property];
                //handle "LineInfo"
                if (property === "LineInfo") {
                    //TODO: handle shit and return the string
                    let lineInfo = handleLineInfo(
                        currentProperty,
                        fileName,
                        current
                    );
                    labelXML = labelXML.toString().replace(regex, lineInfo);
                } else {
                    labelXML = labelXML
                        .toString()
                        .replace(regex, current[currentConfig[property]]);
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
            lineInfo += (i === currentProperty.length - 1 || currentLine.length === 0) ? "" : " - ";
        }
        return lineInfo;
    };

    const handleLine = (currentPropertyOf, fileName, current) => {
        if (currentPropertyOf === "PurchaseOrder")
            return `PO ${fileName.replace("PurchaseOrder", "")}`;
        if (currentPropertyOf === "CustomersPONo")
            return `PO ${current[currentPropertyOf]}`;
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

    const isTemplateGood = () => {
        try {
            if (fs.existsSync(templatePath)) return true;
        } catch (err) {
            setText(err);
        }
        return false;
    };

    const print = async () => {
        setIsLoading(true);
        for (let i = 0; i < labels.length; i++) {
            let currentLabel = labels[i].replace(/(\r\n|\n|\r)/gm, "");
            //set current preview
            let preview = await ipcRenderer.invoke(
                "image-preview",
                currentLabel
            );
            setImagePreview(preview.replace(/"/g, ""));
            setText(`Printing Label ${i + 1} of ${labels.length}`);
            let printResult = await ipcRenderer.invoke(
                "print-label",
                currentLabel
            );
            console.log(printResult);
            await new Promise((resolve) => setTimeout(resolve, 2000));
        }
        //complete print with close
        setText("Print Complete");
        setIsLoading(false);
        await new Promise((resolve) => setTimeout(resolve, 2000));
        await ipcRenderer.invoke("complete");
    };

    const handleInputChange = async (event) => {
        let result = await ipcRenderer.invoke(
            "set-template",
            event.target.files[0].path
        );
        if (result) setTemplatePath(event.target.files[0].path);
    };

    const handleFormEvent = async (event) => {
        await ipcRenderer.invoke("set-printer", event.target.value);
        setPrinter(event.target.value)
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
                        variant="outlined"
                        color="primary"
                        startIcon={<FolderOpenIcon />}
                        style={{ marginRight: ".4rem" }}
                    >
                        Template
                    </Button>
                </label>
                {!isTemplateGood() ? (
                    <Tooltip title="Check Template file" placement="bottom">
                        <ErrorOutlineIcon color="secondary" />
                    </Tooltip>
                ) : (
                    <Tooltip title="Template Working" placement="bottom">
                        <CheckIcon color="primary" />
                    </Tooltip>
                )}
                <FormControl
                        style={{ width: "100%", marginLeft: "5rem" }}
                        size="small"
                        variant="filled"
                        elevation={1}
                    >
                        <Select
                            onChange={handleFormEvent}
                            name="printer"
                            value={printer}
                        >
                            {printers.map((printer) => (
                                <MenuItem
                                    key={printer.name}
                                    value={printer.name}
                                >
                                    {printer.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
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
                    onClick={(!isTemplateGood() || isLoading) ? null : print}
                    color={!isTemplateGood() ? "secondary" : "primary"}
                    variant="outlined"
                    style={{ width: "20rem" }}
                    endIcon={isLoading ? <CircularProgress size={20} /> : null}
                >
                    {text}
                </Button>
            </div>
        </div>
    );
};

export default App;
