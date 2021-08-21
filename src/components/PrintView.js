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
    const [labels, setLabels] = React.useState([]);
    //for our lil special case
    const [jsonData, setJsonData] = React.useState([]);
    const [singles, setSingles] = React.useState(false);
    const [unknowConfig, setUnknownConfig] = React.useState(false);

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
        (singles, property, current, labelXML, currentConfig) => {
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
        [handleInfo]
    );

    const buildLabels = React.useCallback(
        (singles, currentData, currentConfig, templateXML) => {
            let currentLabels = [];
            let labelXML = templateXML.toString();
            //loop every label
            for (let i = 0; i < currentData.length; i++) {
                let current = currentData[i];
                let limit = singles ? current[currentConfig._Quantity] : 1;
                //extra loop for quantity if singles is enabled
                for (let j = 0; j < limit; j++) {
                    //loop for the display info on the label
                    for (const property in currentConfig) {
                        labelXML = handleProperty(
                            singles,
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
        let isMounted = true;

        const getLabels = async () => {
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
                singles,
                currentData,
                currentConfig,
                await readFile(stateRef.current.value.template)
            );
            let builtImages = await getImages(builtLabels);

            //async guard
            if (!isMounted) return;
            setJsonData(currentData);
            setLabels([...builtLabels]);
            setImages(builtImages);
        };

        getLabels();
        return () => {
            isMounted = false;
        };
        //crackhead method to get re-render on every state change..
        //}, [buildLabels, singles, state.method]);
    }, [buildLabels, getImages, singles]);

    //damn thats a whole method..
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

    const specialCase = () => {
        //check if any labels contain n>1 labels
        let hasMoreThanOne = false;
        for (let i = 0; i < jsonData.length; i++) {
            if (jsonData[i][getCurrentConfig()._Quantity] > 1)
                hasMoreThanOne = true;
        }
        return (
            hasMoreThanOne &&
            (jsonData.length !== 1 ||
                jsonData[0][getCurrentConfig()._Quantity] > 1)
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
                                disabled={
                                    !specialCase() ||
                                    unknowConfig ||
                                    state.value.noFileFound
                                }
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
            </div>
        </>
    );
};

export default PrintView;
