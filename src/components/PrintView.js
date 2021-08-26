import React from "react";
import { Button } from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import { Context } from "context/State";
import LabelCarousel from "./LabelCarousel";
import Switch from "@material-ui/core/Switch";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { readFile, getConfigName, cleanXMLString, buildResponse } from "utils";

//we can now amazingly access awsome shit in our render!
const parser = window.require("fast-xml-parser");
const { ipcRenderer } = window.require("electron");
const path = window.require("path");

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
            lineInfo += i === currentProperty.length - 1 || currentLine.length === 0 ? "" : " - ";
        }
        return lineInfo;
    }, []);

    const handleProperty = React.useCallback(
        (currentMode, property, current, labelXML, currentConfig) => {
            const regex = new RegExp(property, "g");
            const currentProperty = currentConfig[property];
            //if user has selected the empty item, we add dead space
            if (currentConfig[property] === "EMPTY") return labelXML.toString().replace(regex, "");
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
                        currentMode !== "single" ? `${current[currentConfig[property]]} pcs` : "1 pcs"
                    );
            }
            //defualt return
            return labelXML.toString().replace(regex, current[currentConfig[property]]);
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
                let limit = currentMode === "single" ? current[currentConfig._Quantity] : 1;
                //extra loop for quantity if singles is enabled
                for (let j = 0; j < limit; j++) {
                    //loop for the display info on the label
                    for (const property in currentConfig) {
                        labelXML = handleProperty(currentMode, property, current, labelXML, currentConfig);
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

    const handleGroupProperty = React.useCallback((property, current, labelXML, currentConfig) => {
        const regex = new RegExp(property, "g");
        //add "pcs" for quantity
        if (property === "_Quantity") {
            return labelXML.toString().replace(regex, current[property] + " pcs");
        }
        //defualt return
        return labelXML.toString().replace(regex, current[property]);
    }, []);

    const buildGroups = React.useCallback(
        (currentData, currentConfig, templateXML) => {
            let currentLabels = [];
            let labelXML = templateXML.toString();
            //loop every label
            for (let i = 0; i < currentData.length; i++) {
                let current = currentData[i];
                for (const property in currentData[0]) {
                    labelXML = handleGroupProperty(property, current, labelXML, currentConfig);
                }
                currentLabels.push(labelXML);
                //reset the template string
                labelXML = templateXML.toString();
            }
            return [...currentLabels];
        },
        [handleGroupProperty]
    );

    //has to be called async
    const getImages = React.useCallback(async (currentLabels) => {
        let images = [];
        if (!currentLabels) {
            stateRef.current.method.setOutput((o) => [...o, buildResponse(true, "No images loaded")]);
            return [];
        }
        stateRef.current.method.setOutput((o) => [
            ...o,
            buildResponse(true, "Starting to load images..", true),
        ]);

        for (let i = 0; i < currentLabels.length; i++) {
            //fix for xml error "Line 1 containes no data" removes all space between tags
            let currentXML = cleanXMLString(currentLabels[i]);
            let response = await ipcRenderer.invoke("image-preview", currentXML);
            //this is only false when a dymo error is thrown, usually when Dymo Connect is not installed!
            if (!response.status) {
                stateRef.current.method.setDymoError(true);
                stateRef.current.method.setOutput((o) => [
                    ...o,
                    buildResponse(false, response.error.message),
                ]);
                return null;
            }
            images.push(response.image.replace(/"/g, ""));
        }
        stateRef.current.method.setOutput((o) => [...o, buildResponse(true, "Image previews loaded")]);
        return images;
    }, []);

    React.useEffect(() => {
        //guard setup
        let isMounted = true;

        const getLabels = async () => {
            //init build loading
            setIsBuilding(true);
            //if config is empty
            if (Object.keys(stateRef.current.value.config).length === 0) {
                setIsBuilding(false);
                return setUnknownConfig(true);
            }
            //for when we save a new config
            setUnknownConfig(false);
            let currentConfig = getCurrentConfig();
            //if config is unknown
            if (!currentConfig) {
                setIsBuilding(false);
                return setUnknownConfig(true);
            }

            let rawData = await readFile(stateRef.current.value.currentPath);
            let data = parser.parse(rawData);
            let rows = data.Table.Row;
            let currentData = !rows.length ? [rows] : [...rows];
            //build print data for dymo printer
            let groups = getGroups(currentConfig, currentData);
            //if template is not yet selected
            if (!stateRef.current.value.template) {
                return setIsBuilding(false);
            }
            let builtLabels =
                currentMode === "group"
                    ? buildGroups(groups, currentConfig, await readFile(stateRef.current.value.template))
                    : buildLabels(
                          currentMode,
                          currentData,
                          currentConfig,
                          await readFile(stateRef.current.value.template)
                      );
            //let builtImages = await getImages(builtLabels);
            let builtImages = await getImages(builtLabels);

            //async guard
            if (!isMounted) return setIsBuilding(false);
            setSpecialCases({
                single: singlesDetected(currentConfig, currentData),
                group: groups.length !== currentData.length,
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
    }, [buildLabels, buildGroups, getImages, currentMode]);

    const singlesDetected = (currentConfig, jsonData) => {
        //check if any labels contain n>1 labels
        let hasMoreThanOne = false;
        for (let i = 0; i < jsonData.length; i++) {
            if (jsonData[i][currentConfig._Quantity] > 1) hasMoreThanOne = true;
        }
        return hasMoreThanOne && (jsonData.length !== 1 || jsonData[0][currentConfig._Quantity] > 1);
    };

    const getGroups = (currentConfig, jsonData) => {
        //if no "_Info" is picked, or is "EMPTY" return default data
        if (!currentConfig._Info[0] || currentConfig._Info[0] === "EMPTY") return jsonData;
        //detect that there are more than one instance of any partnumber in given data
        let frequency = [];
        for (let i = 0; i < jsonData.length; i++) {
            let index = frequency.findIndex(
                (entry) =>
                    entry._Number === jsonData[i][currentConfig._Number] &&
                    entry._Info1 === jsonData[i][currentConfig._Info[0]]
            );
            let moreInfo = !jsonData[i][currentConfig._Info[1]] ? "" : jsonData[i][currentConfig._Info[1]];
            if (index === -1) {
                frequency.push({
                    _Number: jsonData[i][currentConfig._Number],
                    _Info1: jsonData[i][currentConfig._Info[0]],
                    _Description: jsonData[i][currentConfig._Description],
                    _Info: `${jsonData[i][currentConfig._Info[0]]} - ${moreInfo}`,
                    _Quantity: `${jsonData[i][currentConfig._Quantity]}`,
                });
            } else {
                frequency[index] = {
                    ...frequency[index],
                    _Info: `${frequency[index]._Info}, ${moreInfo}`,
                    _Quantity: `${frequency[index]._Quantity}, ${jsonData[i][currentConfig._Quantity]}`,
                };
            }
        }
        return frequency;
    };

    //had to be extracted into method, very unreadable without..
    const getCurrentConfig = () => {
        return stateRef.current.value.config[getConfigName(stateRef.current.value.currentPath)];
    };

    const print = async () => {
        setIsLoading(true);
        //this calles the start printing method from App.js
        startPrint();
        for (let i = 0; i < labels.length; i++) {
            let currentLabel = cleanXMLString(labels[i]);
            setPrintIndex(i);
            state.method.setButtonText(`Printing Label ${i + 1} of ${labels.length}`);
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

    const toggleSingles = (event) => {
        //if same as prev = default, if not = event.target.value
        setCurrentMode((mode) => (mode === event.target.value ? "default" : event.target.value));
    };

    const openDymoDownload = async () => {
        //will open default brower with given link
        await ipcRenderer.invoke(
            "open-browser",
            "https://www.dymo.com/en_CA/dymo-connect-for-desktop-v1.3.2.html"
        );
    };

    const switchesDisabled = () => {
        return (
            !specialCases.single ||
            unknowConfig ||
            state.value.noFileFound ||
            state.value.dymoError ||
            !stateRef.current.value.template ||
            isLoading
        );
    };

    return (
        <>
            <p className="template-info">{!state.value.template ? "No Template Found" : path.parse(state.value.template).base}</p>
            {state.value.dymoError ? (
                <div className="preview">
                    <p>Install DYMO Connect</p>
                    <Button color="primary" variant="contained" onClick={openDymoDownload}>
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
                            noTemplate={!stateRef.current.value.template}
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
                                disabled={switchesDisabled()}
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
                    disabled={
                        unknowConfig ||
                        state.value.dymoError ||
                        state.value.noFileFound ||
                        !stateRef.current.value.template
                    }
                    onClick={isLoading ? null : print}
                    color={"primary"}
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
                                disabled={switchesDisabled()}
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
