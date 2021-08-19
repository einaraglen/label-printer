import React from "react";
import { Button } from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import { Context } from "context/State";
import LabelCarousel from "./LabelCarousel";
import Switch from "@material-ui/core/Switch";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { readFile, getConfigName } from "utils";

//we can now amazingly access awsome shit in our render!
const parser = window.require("fast-xml-parser");
const { ipcRenderer } = window.require("electron");

const PrintView = ({ startPrint }) => {
    const [images, setImages] = React.useState([]);
    const [printIndex, setPrintIndex] = React.useState(null);
    const [isLoading, setIsLoading] = React.useState(false);
    const [labels, setLabels] = React.useState([]);
    //for our lil special case
    const [jsonData, setJsonData] = React.useState([]);
    const [configInUse, setConfigInUse] = React.useState({});
    const [singles, setSingles] = React.useState(false);
    const [unknowConfig, setUnknownConfig] = React.useState(false);

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
                let lineInfo = handleLineInfo(
                    currentProperty,
                    fileName,
                    current
                );
                return labelXML.toString().replace(regex, lineInfo);
            }
            //add "pcs" for quantity
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
            //defualt return
            return labelXML
                .toString()
                .replace(regex, current[currentConfig[property]]);
        },
        [handleLineInfo]
    );

    const buildLabels = React.useCallback(
        (singles, currentData, currentConfig, templateXML, fileName) => {
            let currentLabels = [];
            let labelXML = templateXML.toString();
            //loop every label
            for (let i = 0; i < currentData.length; i++) {
                let current = currentData[i];
                let limit = singles ? current[currentConfig.LineQuantity] : 1;
                //extra loop for quantity if singles is enabled
                for (let j = 0; j < limit; j++) {
                    //loop for the display info on the label
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
            }
            return [...currentLabels];
        },
        [handleProperty]
    );

    //has to be called async
    const getImages = React.useCallback(async (currentLabels) => {
        let images = [];
        if (!currentLabels) return [];
        for (let i = 0; i < currentLabels.length; i++) {
            //fix for xml error "Line 1 containes no data" removes all space between tags
            let currentXML = currentLabels[i].replace(/>\s*/g, ">");
            currentXML = currentXML.replace(/\s*</g, "<");
            let response = await ipcRenderer.invoke(
                "image-preview",
                currentXML
            );
            //this is only false when a dymo error is thrown, usually when Dymo Connect is not installed!
            if (!response.status) {
                state.method.setDymoError(true);
                return null;
            }
            images.push(response.image.replace(/"/g, ""));
        }
        return images;
    }, [state.method]);

    React.useEffect(() => {
        let isMounted = true;

        const loadData = async () => {
            //for when we save a new config
            setUnknownConfig(false);
            let result = await ipcRenderer.invoke("get-file");
            let config = await ipcRenderer.invoke("get-config");

            //testing / release
            if (!result) {
                if (stateRef.current.value.inDevMode) {
                    result = !result
                        ? `./src/test/${stateRef.current.value.test}`
                        : result;
                } else {
                    return stateRef.current.method.setNoFileFound(true);
                }
            }
            stateRef.current.method.setCurrentPath(result);
            const fileName = getConfigName(result);
            let currentConfig = getCurrentConfig(config, fileName);

            //if the opened file is not recognized
            if (!currentConfig) {
                stateRef.current.method.setAllPicked(false);
                return setUnknownConfig(true);
            } 

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

            let builtImages = await getImages(currentLabels);

            if (!currentLabels) return;
            //async guard
            if (!isMounted) return;
            //if something went wrong, like Dymo Connect not working / not installed
            if (!builtImages) return;
            setImages(builtImages);
            setLabels([...currentLabels]);
        };

        loadData();
        return () => {
            isMounted = false;
        };
        //crackhead method to get re-render on every state change..
    }, [buildLabels, singles, state.method]);

    

    //damn thats a whole method..
    const getCurrentConfig = (config, fileName) => {
        return config[fileName];
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

    const print = async () => {
        setIsLoading(true);
        //this calles the start printing method from App.js
        startPrint();
        for (let i = 0; i < labels.length; i++) {
            let currentLabel = labels[i].replace(/>\s*/g, ">");
            currentLabel = labels[i].replace(/\s*</g, "<");
            setPrintIndex(i);
            state.method.setButtonText(
                `Printing Label ${i + 1} of ${labels.length}`
            );
            let result = await ipcRenderer.invoke("print-label", currentLabel);
            if (!result.status) return state.method.setButtonText("Printer Error!");
            await new Promise((resolve) => setTimeout(resolve, 2000));
        }
        //complete print with close
        state.method.setButtonText("Print Complete");
        //setIsLoading(false);
        await new Promise((resolve) => setTimeout(resolve, 2000));
        await ipcRenderer.invoke("complete");
    };

    const specialCase = () => {
        //check if any labels contain n>1 labels
        let hasMoreThanOne = false;
        for (let i = 0; i < jsonData.length; i++) {
            if (jsonData[i][configInUse.LineQuantity] > 1) hasMoreThanOne = true;
        }
        return (
            hasMoreThanOne && (jsonData.length !== 1 || jsonData[0][configInUse.LineQuantity] > 1)
        );
    };

    const toggleSingles = (event) => {
        setSingles(!singles);
    };

    const openDymoDownload = async () => {
        //will open default brower with given link
        await ipcRenderer.invoke(
            "open-browser",
            "https://www.dymo.com/en_CA/dymo-connect-for-desktop-v1.3.2.html"
        );
    };

    return (
        <>
            {state.value.dymoError ? (
                <div className="preview">
                    <p>Missing: [DYMO Connect]</p>
                    <p>Download, Install, Restart</p>
                    <Button
                        color="primary"
                        variant="contained"
                        onClick={openDymoDownload}
                    >
                        DYMO Connect
                    </Button>
                </div>
            ) : unknowConfig ? (
                <div className="preview">
                    <p>Please setup config</p>
                </div>
            ) : (
                <div className="preview">
                    <LabelCarousel
                        images={images}
                        isPrinting={isLoading}
                        index={printIndex}
                    />
                </div>
            )}
            <div className="print">
                <div className="controlls">
                    <FormControlLabel
                        control={
                            <Switch
                                disabled={!specialCase() || unknowConfig || state.value.noFileFound}
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
                    disabled={unknowConfig || state.value.dymoError}
                    onClick={
                        !state.value.isTemplateGood || isLoading || state.value.noFileFound ? null : print
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
