import React from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import SettingsRow from "./SettingsRow";
import { Context } from "context/State";
import { readFile, getConfigName } from "utils";
import FiberNewIcon from '@material-ui/icons/FiberNew';

const { ipcRenderer } = window.require("electron");
const path = window.require("path");
const parser = window.require("fast-xml-parser");

const Settings = () => {
    const [properties, setProperties] = React.useState([]);
    const [currentConfig, setCurrentConfig] = React.useState({
        LineNo: "",
        LineDescription: "",
        LineInfo: [],
        LineQuantity: "",
    });
    const [indexOfConfig, setIndexOfConfig] = React.useState(0);
    const [isChanged, setIsChanged] = React.useState(false);
    const [options, setOptions] = React.useState([]);
    const [firstInit, setFirstInit] = React.useState(false);

    const state = React.useContext(Context);
    const stateRef = React.useRef(state);

    //toggle render ;)
    React.useEffect(() => {
        let isMounted = true;

        //guard
        if (!isMounted) return;
        setFirstInit(!firstInit ? state.value.settingsOpen : true);

        return () => {
            isMounted = false;
        };
    }, [state.value.settingsOpen, firstInit]);

    //check if all properties are picked!
    React.useEffect(() => {
        let isMounted = true;

        let keys =  Object.keys(currentConfig)
        let result = true;
        for (let i = 0; i < keys.length; i++) {
            if (currentConfig[keys[i]].length < 1) result = false;
        }
        //guard
        if (!isMounted) return;
        stateRef.current.method.setAllPicked(result);

        return () => {
            isMounted = false;
        };
    }, [setCurrentConfig, currentConfig]); 

    React.useEffect(() => {
        let isMounted = true;
        const getOptions = async () => {
            const rawData = await readFile(state.value.currentPath);
            const data = parser.parse(rawData);
            let rows = data.Table.Row;
            let currentData = !rows.length ? [rows] : [...rows];

            //async guard
            if (!isMounted) return;
            setOptions(Object.keys(currentData[0]));
        };

        const getConfig = async () => {
            let result = await ipcRenderer.invoke("get-config");
            //for clean startup
            if (!result)
                await ipcRenderer.invoke("set-config", {
                    PurchaseOrder: {
                        LineNo: "PartNo",
                        LineDescription: "PartDescription",
                        LineInfo: [
                            "PurchaseOrder",
                            "ProjectID",
                            "SubProjectID",
                        ],
                        LineQuantity: "Quantity",
                    },
                });

            let filePath = await ipcRenderer.invoke("get-file");
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
            const fileName = path.parse(filePath).base.toString().split(" ")[0];
            let index = getIndexOfConfig(result, fileName);
            //if we open a file not known to the program
            //pure evil ...
            let configName = Object.keys(result)[index === -1 ? 0 : index];
            let configObject = result[configName];
            //if config is not found, we run with the first rows data
            let currentProperty = Object.keys(configObject);

            //async guard
            if (!isMounted) return;
            setIndexOfConfig(index);
            setProperties([...currentProperty]);
            stateRef.current.method.setConfig(result);
            setCurrentConfig(
                index === -1
                    ? currentConfig
                    : {
                          ...result[configName],
                      }
            );
        };
        getOptions();
        getConfig();
        return () => {
            isMounted = false;
        };
    }, [firstInit]);

    const getIndexOfConfig = (config, fileName) => {
        for (let i = 0; i < Object.keys(config).length; i++) {
            if (fileName.indexOf(Object.keys(config)[i]) > -1) return i;
        }
        return -1;
    };

    const setNewConfig = (newConfig) => {
        //recognize changes and enable to save
        let configName = Object.keys(state.value.config)[indexOfConfig];
        setIsChanged(
            JSON.stringify(newConfig) !==
                JSON.stringify(state.value.config[configName])
        );
        setCurrentConfig(newConfig);
    };

    const saveCurrentConfing = async () => {
        let configName = indexOfConfig === -1 ? getConfigName(state.value.currentPath) : Object.keys(state.value.config)[indexOfConfig];
        let newConfig = {
            ...state.value.config,
            [configName]: currentConfig,
        }
        setIsChanged(false);
        state.method.setConfig(newConfig)
        await ipcRenderer.invoke("set-config", newConfig);
        state.method.setSettingsOpen(false);
    }

    return (
        <div className="settings">
            {!firstInit ? null : (
                <div>
                    <List component="nav">
                        <ListItem aria-controls="config-menu">
                            <ListItemText
                                primary={
                                    indexOfConfig === -1
                                        ? getConfigName(state.value.currentPath)
                                        : Object.keys(state.value.config)[indexOfConfig]
                                }
                                secondary="Current Config"
                            />
                            {/*indexOfConfig === -1*/ false ? <FiberNewIcon fontSize="large" style={{ color: "#8bc34a" }} /> : null}
                        </ListItem>
                    </List>
                    {
                        <table>
                            <tbody>
                                {properties.map((property) => (
                                    <SettingsRow
                                        key={property}
                                        currentConfig={currentConfig}
                                        property={property}
                                        setProperty={setNewConfig}
                                        options={options}
                                    />
                                ))}
                            </tbody>
                        </table>
                    }
                    <List component="nav">
                        <ListItem
                            disabled={!isChanged || !state.value.allPicked}
                            style={{
                                height: "3.5rem",
                                textAlign: "center",
                            }}
                            button
                            aria-controls="config-menu"
                            onClick={saveCurrentConfing}
                        >
                            <ListItemText primary="Save" />
                        </ListItem>
                    </List>
                </div>
            )}
        </div>
    );
};

export default Settings;
