import React from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import SettingsRow from "./SettingsRow";
import { Context } from "context/State";
import { readFile, getConfigName } from "utils";

const { ipcRenderer } = window.require("electron");
const parser = window.require("fast-xml-parser");

const Settings = () => {
    const [properties, setProperties] = React.useState([]);
    const [currentConfig, setCurrentConfig] = React.useState({
        LineNo: "",
        LineDescription: "",
        LineInfo: [],
        LineQuantity: "",
    });
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

    React.useEffect(() => {
        let isMounted = true;
        const getOptions = async () => {
            let filePath = await ipcRenderer.invoke("get-file");
            //testing / release
            if (!filePath) {
                if (stateRef.current.value.inDevMode) {
                    filePath = !filePath
                        ? `./src/test/${stateRef.current.value.test}`
                        : filePath;
                } else {
                    return stateRef.current.method.setNoFileFound(true);
                }
            }
            const rawData = await readFile(filePath);
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
            if (!filePath) {
                if (stateRef.current.value.inDevMode) {
                    filePath = !filePath
                        ? `./src/test/${stateRef.current.value.test}`
                        : filePath;
                } else {
                    return stateRef.current.method.setNoFileFound(true);
                }
            }
            const configName = getConfigName(filePath);
            let currentProperties = [
                "LineNo",
                "LineDescription",
                "LineInfo",
                "LineQuantity",
            ];

            //async guard
            if (!isMounted) return;
            setProperties([...currentProperties]);
            stateRef.current.method.setConfig(result);
            stateRef.current.method.setAllPicked(
                checkAllPicked(
                    configExists(result, configName)
                        ? {
                              LineNo: "",
                              LineDescription: "",
                              LineInfo: [],
                              LineQuantity: "",
                          }
                        : {
                              ...result[configName],
                          }
                )
            );
            setCurrentConfig(
                configExists(result, configName)
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

    const configExists = (config, configName) => {
        return !config[configName];
    };

    const setNewConfig = (newConfig) => {
        state.method.setAllPicked(checkAllPicked(newConfig));
        //recognize changes and enable to save
        let configName = getConfigName(state.value.currentPath);
        setIsChanged(
            JSON.stringify(newConfig) !==
                JSON.stringify(state.value.config[configName])
        );
        setCurrentConfig(newConfig);
    };

    const checkAllPicked = (newConfig) => {
        let keys = Object.keys(newConfig);
        let result = true;
        for (let i = 0; i < keys.length; i++) {
            if (newConfig[keys[i]].length < 1) result = false;
        }
        return result;
    };

    const saveCurrentConfing = async () => {
        let configName = getConfigName(state.value.currentPath);
        let newConfig = {
            ...state.value.config,
            [configName]: currentConfig,
        };
        setIsChanged(false);
        state.method.setConfig(newConfig);
        await ipcRenderer.invoke("set-config", newConfig);
        state.method.setSettingsOpen(false);
    };

    return (
        <div className="settings">
            {!firstInit ? null : (
                <div>
                    <List component="nav">
                        <ListItem aria-controls="config-menu">
                            <ListItemText
                                primary={getConfigName(state.value.currentPath)}
                                secondary="Current Config"
                            />
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
                            //disabled={!isChanged || !state.value.allPicked}
                            disabled={!state.value.allPicked}
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
