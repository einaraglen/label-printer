import React from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import SettingsRow from "./SettingsRow";
import { Context } from "context/State";

const fs = window.require("fs");
const { ipcRenderer } = window.require("electron");
const path = window.require("path");
const parser = window.require("fast-xml-parser");

const Settings = ({ open }) => {
    const [config, setConfig] = React.useState({});
    const [properties, setProperties] = React.useState([]);
    const [currentConfig, setCurrentConfig] = React.useState({});
    const [indexOfConfig, setIndexOfConfig] = React.useState(0);
    const [isChanged, setIsChanged] = React.useState(false);
    const [options, setOptions] = React.useState([]);
    const [firstInit, setFirstInit] = React.useState(false);
    const [unknowConfig, setUnknownConfig] = React.useState(false);

    const state = React.useContext(Context);
    const stateRef = React.useRef(state);

    React.useEffect(() => {
        setFirstInit(!firstInit ? open : true);
    }, [open]);

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
            //console.log(options);
        };

        const getConfig = async () => {
            console.log("run");
            let result = await ipcRenderer.invoke("get-config");
            //for clean startup
            if (!result)
                await ipcRenderer.invoke("set-config", {
                    CustomerOrder: {
                        LineNo: "SalesPartNo",
                        LineDescription: "Description",
                        LineInfo: ["CustomersPONo", "ProjectID"],
                        LineQuantity: "SalesQty",
                    },
                    InventoryPartInStock: {
                        LineNo: "PartNo",
                        LineDescription: "PartDescription",
                        LineInfo: ["ProjectID", "SubProjectID"],
                        LineQuantity: "OnHandQty",
                    },
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
            filePath = !filePath
                ? `./src/test/${stateRef.current.value.test}`
                : filePath;
            const fileName = path.parse(filePath).base.toString().split(" ")[0];
            let index = getIndexOfConfig(result, fileName);
            //if we open a file not known to the program
            if (index === -1) return setUnknownConfig(true);
            //pure evil ...
            let configName = Object.keys(result)[index];
            let configObject = result[configName];
            let currentProperty = Object.keys(configObject);

            //async guard
            if (!isMounted) return;
            setIndexOfConfig(index);
            setProperties([...currentProperty]);
            setConfig(result);
            setCurrentConfig({
                ...result[configName],
            });
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
        setIsChanged(
            JSON.stringify(newConfig) !==
                JSON.stringify(config[Object.keys(config)[indexOfConfig]])
        );
        setCurrentConfig(newConfig);
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

    return (
        <>
            {unknowConfig ? (
                <p>Config not found</p>
            ) : (
                <div className="settings">
                    {!firstInit ? null : (
                        <div>
                            <List component="nav">
                                <ListItem button aria-controls="config-menu">
                                    <ListItemText
                                        primary="Selected Config"
                                        secondary={
                                            Object.keys(config)[indexOfConfig]
                                        }
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
                                    disabled={!isChanged}
                                    style={{
                                        height: "3.5rem",
                                        textAlign: "center",
                                    }}
                                    button
                                    aria-controls="config-menu"
                                >
                                    <ListItemText primary="Save" />
                                </ListItem>
                            </List>
                        </div>
                    )}
                </div>
            )}
        </>
    );
};

export default Settings;
