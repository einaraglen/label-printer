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
import Accordion from "@material-ui/core/Accordion";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import CloseIcon from "@material-ui/icons/Close";
import Settings from "components/Settings";

//we can now amazingly access awsome shit in our render!
const fs = window.require("fs");
const { ipcRenderer } = window.require("electron");

const App = () => {
    const [printers, setPrinters] = React.useState([]);
    const [settingsOpen, setSettingsOpen] = React.useState(false);
    const [isPrinting, setIsPrinting] = React.useState(false);

    const state = React.useContext(Context);
    const stateRef = React.useRef(state);

    React.useEffect(() => {
        const getTemplate = async () => {
            let tempRes = await ipcRenderer.invoke("get-template");
            stateRef.current.method.setTemplate(tempRes);
            stateRef.current.method.setIsTemplateGood(await isTemplateGood());
        };

        const loadPrinters = async () => {
            //get all printers
            let printers = await ipcRenderer.invoke("get-printers");
            setPrinters(printers);
            //get printer stored as our printer in-use
            let printer = await ipcRenderer.invoke("get-printer");
            stateRef.current.method.setPrinter(printer);
        };

        getTemplate();
        loadPrinters();
    }, []);

    //makes it so we can get our data async
    const readFile = async (path) => {
        return new Promise((resolve, reject) => {
            fs.readFile(path, "utf8", (err, data) => {
                if (err) reject(err);
                resolve(data);
            });
        });
    };

    const isTemplateGood = async () => {
        try {
            let tempPath = await ipcRenderer.invoke("get-template");
            if (!fs.existsSync(tempPath)) return false;
            let xml = await readFile(tempPath);
            if (!await checkConfigKeys(xml)) return false;
            return true;
        } catch (err) {
            state.method.setButtonText("Please check Template");
        }
        return false;
    };

    const checkConfigKeys = async (xml) => {
        //checks if the template choosen has the right key values
        let config = await ipcRenderer.invoke("get-config");
        for (const key in config[Object.keys(config)[0]]) {
            if (xml.indexOf(key) === -1) return false;
        }
        return true;
    };

    const handleInputChange = async (event) => {
        if (!event.target.value) return;
        await ipcRenderer.invoke("set-template", event.target.files[0].path);
        stateRef.current.method.setIsTemplateGood(await isTemplateGood());
    };

    const handleFormEvent = async (event) => {
        await ipcRenderer.invoke("set-printer", event.target.value);
        state.method.setPrinter(event.target.value);
    };

    const toggleSettings = () => {
        //toggle
        setSettingsOpen(!settingsOpen);
    };

    return (
        <ThemeProvider theme={state.theme}>
            <div className="main">
                <Accordion square expanded={settingsOpen}>
                    <AccordionSummary>
                        <div className="tools">
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
                                    disabled={isPrinting}
                                        style={{ marginRight: "0rem" }}
                                        component="span"
                                        variant="text"
                                        color="primary"
                                        startIcon={<FolderOpenIcon />}
                                    >
                                        Template
                                    </Button>
                                </label>
                                {!state.value.isTemplateGood ? (
                                    <Tooltip title="Check Template file" placement="bottom">
                                        <ErrorOutlineIcon color="secondary" />
                                    </Tooltip>
                                ) : (
                                    <Tooltip title="Template Working" placement="bottom">
                                        <CheckIcon style={{ color: "#8bc34a" }} />
                                    </Tooltip>
                                )}
                            </div>
                            <FormControl style={{width: "14rem"}} size="small" variant="filled" elevation={1}>
                                <Select disabled={isPrinting} onChange={handleFormEvent} name="printer" value={state.value.printer}>
                                    {printers.map((printer) => (
                                        <MenuItem key={printer.name} value={printer.name}>
                                            {printer.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <IconButton disabled={isPrinting} onClick={toggleSettings} size="medium" color="primary" variant="outlined">
                                <Tooltip title={settingsOpen ? "Close Settings" : "Open Settings"} placement="bottom">
                                    {settingsOpen ? <CloseIcon /> : <SettingsIcon />}
                                </Tooltip>
                            </IconButton>
                        </div>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Settings />
                    </AccordionDetails>
                </Accordion>
                <PrintView startPrint={() => setIsPrinting(true)}/>
                <div className="bottom unselectable">
                    <div>Created by Einar Aglen</div>
                    <div>{`Version ${packageJson.version}`}</div>
                </div>
            </div>
        </ThemeProvider>
    );
};

export default App;
