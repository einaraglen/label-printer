import React from "react";
import "./App.css";
import { Button, ThemeProvider } from "@material-ui/core";
import FolderOpenIcon from "@material-ui/icons/FolderOpen";
import CheckIcon from "@material-ui/icons/Check";
import ErrorOutlineIcon from "@material-ui/icons/ErrorOutline";
import Tooltip from "@material-ui/core/Tooltip";
import { MenuItem, FormControl, Select } from "@material-ui/core/";
import { Context } from "context/State";
import packageJson from "../package.json";
import SettingsIcon from "@material-ui/icons/Settings";
import IconButton from "@material-ui/core/IconButton";
import PrintView from "components/PrintView";
import CloseIcon from "@material-ui/icons/Close";
import Settings from "components/Settings";
import Badge from "@material-ui/core/Badge";
import { readFile } from "utils";
import DevTools from "components/DevTools";
import { UnmountClosed } from 'react-collapse';

//we can now amazingly access awsome shit in our render!
const fs = window.require("fs");
const { ipcRenderer } = window.require("electron");

const App = () => {
    const [printers, setPrinters] = React.useState([]);
    const [isPrinting, setIsPrinting] = React.useState(false);
    const [devTools, setDevTools] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(true);
    const [toolTipText, setToolTipText] = React.useState("");
    const [collapseComplete, setCollapseComplete] = React.useState(false);

    const state = React.useContext(Context);
    const stateRef = React.useRef(state);

    const checkConfigKeys = React.useCallback((xml) => {
        //checks if the template choosen has the right key values, except "_Extra"
        let result = { status: true, missing: [] };
        for (let i = 0; i < stateRef.current.value.usableProperties.length; i++) {
            if (
                xml.indexOf(stateRef.current.value.usableProperties[i]) === -1 &&
                stateRef.current.value.usableProperties[i] !== "_Extra"
            ) {
                result.missing.push(stateRef.current.value.usableProperties[i]);
                result.status = false;
            }
        }
        return result;
    }, []);

    const isTemplateGood = React.useCallback(async () => {
        //check file
        let tempPath = await ipcRenderer.invoke("get-template");
        if (!fs.existsSync(tempPath)) {
            setToolTipText("File not found");
            return false;
        }
        //check template contents
        let xml = await readFile(tempPath);
        let checkResult = checkConfigKeys(xml);
        if (!checkResult.status) {
            let toolTip = "Template missing: ";
            for (let i = 0; i < checkResult.missing.length; i++) {
                toolTip += checkResult.missing[i];
                toolTip += i === checkResult.missing.length - 1 ? "" : ", ";
            }
            setToolTipText(toolTip);
            return false;
        }
        setToolTipText("Template Working");
        return true;
    }, [checkConfigKeys]);

    const isConfigGood = React.useCallback((config) => {
        //a blank config will work
        if (!config || !config[Object.keys(config)[0]]) return true;
        for (let property in config[Object.keys(config)[0]]) {
            if (stateRef.current.value.usableProperties.indexOf(property) === -1) return false;
        }
        return true;
    }, []);

    React.useEffect(() => {
        //guard setup
        let isMounted = true;
        //loads in the template file and stores it into state
        const getTemplate = async () => {
            let template = await ipcRenderer.invoke("get-template");
            if (!template || !isMounted) return true;
            stateRef.current.method.setTemplate(template);
            stateRef.current.method.setIsTemplateGood(await isTemplateGood());
            return true;
        };

        //loads in the file-path and stores it into state
        const getFilePath = async () => {
            let filePath = await ipcRenderer.invoke("get-file");
            //testing / release
            filePath = !filePath ? stateRef.current.method.handleFileResult(filePath) : filePath;
            if (!filePath || !isMounted) {
                stateRef.current.method.setNoFileFound(true);
                return true;
            }
            stateRef.current.method.setCurrentPath(filePath);
            return true;
        };

        //loads in the config and stores it into state
        const getConfig = async () => {
            let config = await ipcRenderer.invoke("get-config");
            if (!isMounted) return true;
            //bad old config (from earlier builds)
            if (!isConfigGood(config)) {
                //wipe old config, since it does not fit anymore
                await ipcRenderer.invoke("set-config", {});
                stateRef.current.method.setConfig(config);
                return true;
            } 
            //normal execution
            stateRef.current.method.setConfig(config);
            return true;
        };

        //loads in the printers and printer-in-use, then stores it into state
        const getPrinters = async () => {
            //get all printers
            let printers = await ipcRenderer.invoke("get-printers");
            if (!printers || !isMounted) return true;
            setPrinters(printers);
            //get printer stored as our printer in-use, if none stored: use [0]
            let printer = await ipcRenderer.invoke("get-printer");
            if (!printer || !isMounted) return true;
            stateRef.current.method.setPrinter(!printer ? printers[0].name : printer);
            return true;
        };

        //big brain move :O
        const completeLoad = async () => {
            if (!isMounted) return;
            let result =
                (await getTemplate()) &&
                (await getFilePath()) &&
                (await getConfig()) &&
                (await getPrinters());
            setIsLoading(!result);
        };

        //full useEffect execution!
        completeLoad();

        //prevent memory leak
        return () => {
            isMounted = false;
        };
    }, [isTemplateGood, isConfigGood]);

    const handleInputChange = async (event) => {
        if (!event.target.value) return;
        state.method.setTemplate(event.target.files[0].path);
        await ipcRenderer.invoke("set-template", event.target.files[0].path);
        stateRef.current.method.setIsTemplateGood(await isTemplateGood());
    };

    const handleFormEvent = async (event) => {
        await ipcRenderer.invoke("set-printer", event.target.value);
        state.method.setPrinter(event.target.value);
    };

    const toggleSettings = async () => {
        //toggle
        state.method.setSettingsOpen((s) => !s);
    };

    const toggleDevTools = () => {
        setDevTools(!devTools);
    };

    //devtools controlls
    let ctrlDown = false;
    document.body.onkeydown = (event) => {
        if (event.code === "Insert" && ctrlDown) return toggleDevTools();
        if (event.code === "ControlLeft") return (ctrlDown = true);
    };

    document.body.onkeyup = (event) => {
        if (event.code === "ControlLeft") return (ctrlDown = true);
    };

    return (
        <ThemeProvider theme={state.theme}>
            {devTools ? <DevTools /> : null}
            {isLoading ? (
                null
            ) : (
                <div className="main">
                    <div className="tools">
                        <div className="template-picker">
                            <input
                                disabled={state.value.dymoError}
                                id="file-button"
                                style={{ display: "none" }}
                                accept={[".xml", ".dymo"]}
                                type="file"
                                name="upload_file"
                                onChange={handleInputChange}
                            />
                            <label htmlFor="file-button">
                                <Button
                                    disabled={isPrinting || state.value.dymoError}
                                    component="span"
                                    variant="text"
                                    color="primary"
                                    startIcon={<FolderOpenIcon />}
                                    endIcon={
                                        <Tooltip title={toolTipText} placement="bottom">
                                            {!state.value.isTemplateGood ? (
                                                <ErrorOutlineIcon color="secondary" />
                                            ) : (
                                                <CheckIcon style={{ color: "#8bc34a" }} />
                                            )}
                                        </Tooltip>
                                    }
                                >
                                    Template
                                </Button>
                            </label>
                        </div>
                        <FormControl
                            style={{ width: "46%", marginLeft: "2%", marginRight: "2%" }}
                            size="small"
                            variant="filled"
                            elevation={1}
                        >
                            <Select
                                disabled={isPrinting || state.value.dymoError}
                                onChange={handleFormEvent}
                                name="printer"
                                value={state.value.printer}
                            >
                                {printers.map((printer) => (
                                    <MenuItem key={printer.name} value={printer.name}>
                                        {printer.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <div className="settings-button">
                            <IconButton
                                disabled={isPrinting || state.value.dymoError || state.value.noFileFound}
                                onClick={toggleSettings}
                                size="medium"
                                color="primary"
                                variant="outlined"
                            >
                                <Badge
                                    color="secondary"
                                    variant="dot"
                                    invisible={state.value.allPicked || state.value.noFileFound}
                                >
                                    {state.value.settingsOpen ? <CloseIcon /> : <SettingsIcon />}
                                </Badge>
                            </IconButton>
                        </div>
                    </div>
                    <UnmountClosed onRest={() => setCollapseComplete(state.value.settingsOpen)} isOpened={state.value.settingsOpen}>
                        <Settings collapseComplete={collapseComplete} />
                    </UnmountClosed>
                    {collapseComplete && state.value.settingsOpen ? null : <PrintView startPrint={() => setIsPrinting(true)} />}
                    <div className="bottom unselectable">
                        <div>Created by Einar Aglen</div>
                        <div>{`Version ${packageJson.version}`}</div>
                    </div>
                </div>
            )}
        </ThemeProvider>
    );
};

export default App;
