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

const Settings = ({ settingsOpen }) => {
    const [config, setConfig] = React.useState({});
    const [properties, setProperties] = React.useState([]);
    const [currentConfig, setCurrentConfig] = React.useState({});
    const [indexOfConfig, setIndexOfConfig] = React.useState(0);
    const [isChanged, setIsChanged] = React.useState(false);
    const [options, setOptions] = React.useState([]);

    const state = React.useContext(Context);

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
            console.log(options)
        };

        const getConfig = async () => {
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

            //test paths
            const paths = [
                "CustomerOrderS16112 210804-110500.xml",
                "InventoryPartInStock 210802-155209.xml",
                "PurchaseOrder629195 210803-141357.xml",
                "InventoryPartInStock 210812-124414.xml",
            ];
            let filePath = await ipcRenderer.invoke("get-file");
            filePath = !filePath ? `./src/test/${paths[2]}` : filePath;
            const fileName = path.parse(filePath).base.toString().split(" ")[0];
            let index = getIndexOfConfig(result, fileName);
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
    }, [settingsOpen]);

    const getIndexOfConfig = (config, fileName) => {
        for (let i = 0; i < Object.keys(config).length; i++) {
            if (fileName.indexOf(Object.keys(config)[i]) > -1) return i;
        }
        return 0;
    };

    const setNewConfig = (newConfig) => {
        //recognize changes and enable to save
        setIsChanged(JSON.stringify(newConfig) !== JSON.stringify(config[Object.keys(config)[indexOfConfig]]));
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
        <div className="settings">
            {!settingsOpen ? null : <div>
                <List component="nav">
                    <ListItem button aria-controls="config-menu">
                        <ListItemText
                            primary="Selected Config"
                            secondary={Object.keys(config)[indexOfConfig]}
                        />
                    </ListItem>
                </List>
                {/*<table>
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
                        </table>*/}
                <List component="nav" >
                    <ListItem disabled={!isChanged} style={{height: "3.5rem", textAlign: "center"}} button aria-controls="config-menu">
                        <ListItemText
                            primary="Save"
                        />
                    </ListItem>
                </List>
            </div>}
        </div>
    );
};

export default Settings;
