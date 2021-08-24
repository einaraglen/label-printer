import React from "react";
import { Button } from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import { Context } from "context/State";
import LabelCarousel from "./LabelCarousel";
import Switch from "@material-ui/core/Switch";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { readFile, getConfigName, cleanXMLString } from "utils";

//we can now amazingly access awsome shit in our render!
const parser = window.require("fast-xml-parser");
const { ipcRenderer } = window.require("electron");

const PrintView = ({ startPrint }) => {
    const [images, setImages] = React.useState([]);
    const [printIndex, setPrintIndex] = React.useState(null);
    const [isLoading, setIsLoading] = React.useState(false);
    const [isBuilding, setIsBuilding] = React.useState(true);
    const [labels, setLabels] = React.useState([]);
    const [currentMode, setCurrentMode] = React.useState("default");
    const [unknowConfig, setUnknownConfig] = React.useState(false);
    const [specialCases, setSpecialCases] = React.useState({
        single: false,
        group: false,
    });

    const state = React.useContext(Context);
    const stateRef = React.useRef(state);

    const handleInfo = React.useCallback((currentProperty, current) => {
        let lineInfo = "";
        for (let i = 0; i < currentProperty.length; i++) {
            if (currentProperty[i] === "EMPTY") return "";
            let currentLine = current[currentProperty[i]];
            lineInfo += currentLine;
            lineInfo +=
                i === currentProperty.length - 1 || currentLine.length === 0
                    ? ""
                    : " - ";
        }
        return lineInfo;
    }, []);

    const handleProperty = React.useCallback(
        (currentMode, property, current, labelXML, currentConfig) => {
            const regex = new RegExp(property, "g");
            const currentProperty = currentConfig[property];
            //if user has selected the empty item, we add dead space
            if (currentConfig[property] === "EMPTY")
                return labelXML.toString().replace(regex, "");
            //handle "_Info" and "_Extra"
            if (property === "_Info" || property === "_Extra") {
                let lineInfo = handleInfo(currentProperty, current);
                return labelXML.toString().replace(regex, lineInfo);
            }
            //add "pcs" for quantity
            if (property === "_Quantity") {
                return labelXML
                    .toString()
                    .replace(
                        regex,
                        currentMode !== "single"
                            ? `${current[currentConfig[property]]} pcs`
                            : "1 pcs"
                    );
            }
            //defualt return
            return labelXML
                .toString()
                .replace(regex, current[currentConfig[property]]);
        },
        [handleInfo]
    );

    const buildLabels = React.useCallback(
        (currentMode, currentData, currentConfig, templateXML) => {
            let currentLabels = [];
            let labelXML = templateXML.toString();
            //loop every label
            for (let i = 0; i < currentData.length; i++) {
                let current = currentData[i];
                let limit =
                    currentMode === "single"
                        ? current[currentConfig._Quantity]
                        : 1;
                //extra loop for quantity if singles is enabled
                for (let j = 0; j < limit; j++) {
                    //loop for the display info on the label
                    for (const property in currentConfig) {
                        labelXML = handleProperty(
                            currentMode,
                            property,
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
            let currentXML = cleanXMLString(currentLabels[i]);
            let response = await ipcRenderer.invoke(
                "image-preview",
                currentXML
            );
            //this is only false when a dymo error is thrown, usually when Dymo Connect is not installed!
            if (!response.status) {
                stateRef.current.method.setDymoError(true);
                return null;
            }
            images.push(response.image.replace(/"/g, ""));
        }
        return images;
    }, []);

    React.useEffect(() => {
        //guard setup
        let isMounted = true;

        const getLabels = async () => {
            //init build loading
            setIsBuilding(true);
            //for when we save a new config
            setUnknownConfig(false);
            let currentConfig = getCurrentConfig();

            //if the opened file is not recognized
            if (!currentConfig) {
                return setUnknownConfig(true);
            }

            let rawData = await readFile(stateRef.current.value.currentPath);
            let data = parser.parse(rawData);
            let rows = data.Table.Row;
            let currentData = !rows.length ? [rows] : [...rows];
            //build print data for dymo printer
            let builtLabels = buildLabels(
                currentMode,
                currentData,
                currentConfig,
                await readFile(stateRef.current.value.template)
            );
            let builtImages = await getImages(builtLabels);

            //async guard
            if (!isMounted) return;
            setSpecialCases({
                single: singlesDetected(currentConfig, currentData),
                group: groupDetected(currentConfig, currentData)
            });
            setLabels([...builtLabels]);
            setImages(builtImages);
            //carousel will render after this is set to false
            setIsBuilding(false);
        };

        getLabels();
        return () => {
            isMounted = false;
        };
        //}, [buildLabels, getImages, singles]);
    }, [buildLabels, getImages, currentMode]);

    //needs to be added to useEffect, currently running every render!!!
    const singlesDetected = (currentConfig, jsonData) => {
        //check if any labels contain n>1 labels
        let hasMoreThanOne = false;
        for (let i = 0; i < jsonData.length; i++) {
            if (jsonData[i][currentConfig._Quantity] > 1)
                hasMoreThanOne = true;
        }
        return (
            hasMoreThanOne &&
            (jsonData.length !== 1 ||
                jsonData[0][currentConfig._Quantity] > 1)
        );
    };

    //needs to be added to useEffect, currently running every render!!!
    const groupDetected = (currentConfig, jsonData) => {
        //detect that there are more than one instance of any partnumber in given data
        let frequency = [];
        for (let i = 0; i < jsonData.length; i++) {
            let index = frequency.findIndex(
                (entry) =>
                    entry._Number === jsonData[i][currentConfig._Number] &&
                    entry._Info1 === jsonData[i][currentConfig._Info[0]]
            );
            if (index === -1) {
                frequency.push({
                    _Number: jsonData[i][currentConfig._Number],
                    _Info1: jsonData[i][currentConfig._Info[0]],
                    data: [jsonData[i]],
                });
            } else {
                frequency[index] = {
                    ...frequency[index],
                    data: [...frequency[index].data, jsonData[i]],
                };
            }
        }
        return jsonData.length !== frequency.length;
    };

    //had to be extracted into method, very unreadable without..
    const getCurrentConfig = () => {
        return stateRef.current.value.config[
            getConfigName(stateRef.current.value.currentPath)
        ];
    };

    const print = async () => {
        setIsLoading(true);
        //this calles the start printing method from App.js
        startPrint();
        for (let i = 0; i < labels.length; i++) {
            let currentLabel = cleanXMLString(labels[i]);
            setPrintIndex(i);
            state.method.setButtonText(
                `Printing Label ${i + 1} of ${labels.length}`
            );
            let result = await ipcRenderer.invoke("print-label", currentLabel);
            if (!result.status)
                return state.method.setButtonText("Printer Error!");
            await new Promise((resolve) => setTimeout(resolve, 2000));
        }
        //complete print with close
        state.method.setButtonText("Print Complete");
        //setIsLoading(false);
        await new Promise((resolve) => setTimeout(resolve, 2000));
        await ipcRenderer.invoke("complete");
    };

    const toggleSingles = (event) => {
        //if same as prev = default, if not = event.target.value
        setCurrentMode((mode) =>
            mode === event.target.value ? "default" : event.target.value
        );
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
            ) : state.value.noFileFound ? (
                <div className="preview">No File Found</div>
            ) : unknowConfig ? (
                <div className="preview">
                    <p>Please setup config</p>
                </div>
            ) : (
                <div className="preview">
                    {isBuilding ? (
                        <CircularProgress size={40} />
                    ) : (
                        <LabelCarousel
                            images={images}
                            isPrinting={isLoading}
                            index={printIndex}
                        />
                    )}
                </div>
            )}
            <div className="print">
                <div className="controlls left">
                    <FormControlLabel
                        control={
                            <Switch
                                value="single"
                                disabled={
                                    !specialCases.single ||
                                    unknowConfig ||
                                    state.value.noFileFound
                                }
                                checked={currentMode === "single"}
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
                        !state.value.isTemplateGood ||
                        isLoading ||
                        state.value.noFileFound
                            ? null
                            : print
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
                <div className="controlls right">
                    <FormControlLabel
                        control={
                            <Switch
                                value="group"
                                disabled={
                                    !specialCases.group ||
                                    unknowConfig ||
                                    state.value.noFileFound
                                }
                                checked={currentMode === "group"}
                                onChange={toggleSingles}
                                color="primary"
                            />
                        }
                        label="Group"
                        labelPlacement="end"
                    />
                </div>
            </div>
        </>
    );
};

export default PrintView;
