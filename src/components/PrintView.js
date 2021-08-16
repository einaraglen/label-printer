import React from "react";
import { Button } from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import { Context } from "context/State";
import LabelCarousel from "./LabelCarousel";
import Switch from "@material-ui/core/Switch";
import FormControlLabel from "@material-ui/core/FormControlLabel";

//we can now amazingly access awsome shit in our render!
const fs = window.require("fs");
const parser = window.require("fast-xml-parser");
const { ipcRenderer } = window.require("electron");
const path = window.require("path");

const PrintView = ({ startPrint }) => {
    const [images, setImages] = React.useState([]);
    const [printIndex, setPrintIndex] = React.useState(null);
    const [isLoading, setIsLoading] = React.useState(false);
    const [labels, setLabels] = React.useState([]);
    //for our lil special case
    const [jsonData, setJsonData] = React.useState([]);
    const [configInUse, setConfigInUse] = React.useState({});
    const [singles, setSingles] = React.useState(false);

    const state = React.useContext(Context);
    const stateRef = React.useRef(state);

    const handleLineInfo = React.useCallback(
        (currentProperty, fileName, current) => {
            let lineInfo = "";
            for (let i = 0; i < currentProperty.length; i++) {
                let currentLine = handleLine(
                    currentProperty[i],
                    fileName,
                    current
                );
                lineInfo += currentLine;
                lineInfo +=
                    i === currentProperty.length - 1 || currentLine.length === 0
                        ? ""
                        : " - ";
            }
            return lineInfo;
        },
        []
    );

    const handleProperty = React.useCallback(
        (singles, property, fileName, current, labelXML, currentConfig) => {
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
                return labelXML.toString().replace(regex, lineInfo);
            }
            if (property === "LineQuantity") {
                return labelXML
                    .toString()
                    .replace(
                        regex,
                        !singles
                            ? `${current[currentConfig[property]]} pcs`
                            : "1 pcs"
                    );
            }
            return labelXML
                .toString()
                .replace(regex, current[currentConfig[property]]);
        },
        [handleLineInfo]
    );

    const buildLabels = React.useCallback(
        (singles, currentData, currentConfig, templateXML, fileName) => {
            let currentLabels = [];
            let limit = !singles
                ? currentData.length
                : currentData[0][currentConfig.LineQuantity];
            let labelXML = templateXML.toString();
            for (let i = 0; i < limit; i++) {
                let current = !singles ? currentData[i] : currentData[0];
                for (const property in currentConfig) {
                    labelXML = handleProperty(
                        singles,
                        property,
                        fileName,
                        current,
                        labelXML,
                        currentConfig
                    );
                }
                currentLabels.push(labelXML);
                //reset the template string
                labelXML = templateXML.toString();
            }
            return [...currentLabels];
        },
        [handleProperty]
    );

    React.useEffect(() => {
        let isMounted = true;
        //test paths
        const paths = [
            "CustomerOrderS16112 210804-110500.xml",
            "InventoryPartInStock 210802-155209.xml",
            "PurchaseOrder629195 210803-141357.xml",
            "InventoryPartInStock 210812-124414.xml",
        ];

        const loadData = async () => {
            let result = await ipcRenderer.invoke("get-file");
            let config = await ipcRenderer.invoke("get-config");

            //for testing
            result = !result ? `./src/test/${paths[2]}` : result;
            stateRef.current.method.setCurrentPath(result);
            const fileName = path.parse(result).base.toString().split(" ")[0];
            let currentConfig = getCurrentConfig(config, fileName);
            setConfigInUse(currentConfig);
            const rawData = await readFile(result);
            const data = parser.parse(rawData);
            const rows = data.Table.Row;
            let currentData = !rows.length ? [rows] : [...rows];
            setJsonData(currentData);
            let tempPath = await ipcRenderer.invoke("get-template");
            if (!tempPath) return;
            //build print data for dymo printer
            let currentLabels = buildLabels(
                singles,
                currentData,
                currentConfig,
                await readFile(tempPath),
                fileName
            );
            //preview first label
            if (!currentLabels) return;
            //async guard
            if (!isMounted) return;
            setImages(await getImages(currentLabels));
            setLabels([...currentLabels]);
        };

        loadData();
        return () => {
            isMounted = false;
        };
    }, [buildLabels, singles, state.value.config]);

    //has to be called async
    const getImages = async (currentLabels) => {
        let images = [];
        if (!currentLabels) return [];
        for (let i = 0; i < currentLabels.length; i++) {
            let preview = await ipcRenderer.invoke(
                "image-preview",
                currentLabels[i]
            );
            images.push(preview.replace(/"/g, ""));
        }
        return images;
    };

    const getCurrentConfig = (config, fileName) => {
        for (const property in config)
            if (fileName.indexOf(property) > -1) return config[property];
    };

    const handleLine = (currentPropertyOf, fileName, current) => {
        if (currentPropertyOf === "PurchaseOrder")
            return `PO ${fileName.replace("PurchaseOrder", "")}`;
        if (currentPropertyOf === "CustomersPONo")
            return `PO ${current[currentPropertyOf]}`;
        if (currentPropertyOf === "ProjectID")
            return current[currentPropertyOf].length !== 0
                ? `P-${current[currentPropertyOf]}`
                : "";
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
        //this calles the start printing method from App.js
        startPrint();
        for (let i = 0; i < labels.length; i++) {
            let currentLabel = labels[i].replace(/(\r\n|\n|\r)/gm, "");
            setPrintIndex(i);
            state.method.setButtonText(
                `Printing Label ${i + 1} of ${labels.length}`
            );
            await ipcRenderer.invoke("print-label", currentLabel);
            await new Promise((resolve) => setTimeout(resolve, 2000));
        }
        //complete print with close
        state.method.setButtonText("Print Complete");
        //setIsLoading(false);
        await new Promise((resolve) => setTimeout(resolve, 2000));
        await ipcRenderer.invoke("complete");
    };

    const specialCase = () => {
        //if there is only 1 labels, with more that 1 qty
        return (
            jsonData.length === 1 && jsonData[0][configInUse.LineQuantity] > 1
        );
    };

    const toggleSingles = (event) => {
        setSingles(!singles);
    };

    return (
        <>
            <div className="preview">
                <LabelCarousel
                    images={images}
                    isPrinting={isLoading}
                    index={printIndex}
                />
            </div>
            <div className="print">
                <div className="controlls">
                    <FormControlLabel
                        control={
                            <Switch
                                disabled={!specialCase()}
                                checked={singles}
                                onChange={toggleSingles}
                                color="primary"
                            />
                        }
                        label="Singles"
                        labelPlacement="start"
                    />
                </div>
                <Button
                    onClick={
                        !state.value.isTemplateGood || isLoading ? null : print
                    }
                    color={
                        !state.value.isTemplateGood ? "secondary" : "primary"
                    }
                    variant="outlined"
                    style={{ width: "56%" }}
                    endIcon={isLoading ? <CircularProgress size={20} /> : null}
                >
                    {state.value.buttonText}
                </Button>
            </div>
        </>
    );
};

export default PrintView;
