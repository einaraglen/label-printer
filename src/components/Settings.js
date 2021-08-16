import React from "react";
import { Button } from "@material-ui/core";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import SettingsRow from "./SettingsRow";
import CircularProgress from "@material-ui/core/CircularProgress";

const { ipcRenderer } = window.require("electron");
const path = window.require("path");

const Settings = ({ settingsOpen }) => {
    const [config, setConfig] = React.useState({});
    const [properties, setProperties] = React.useState([]);
    const [currentConfig, setCurrentConfig] = React.useState({});
    const [isLoading, setIsLoading] = React.useState(true);
    const [indexOfConfig, setIndexOfConfig] = React.useState(0);


    React.useEffect(() => {
        let isMounted = true;
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
            console.log(index)
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
                ...result[configName]
            });
        };
        getConfig();
        setIsLoading(false);
        return () => {
            isMounted = false;
        };
    }, []);

    const getIndexOfConfig = (config, fileName) => {
        for (let i = 0; i < Object.keys(config).length; i++) {
            if (fileName.indexOf(Object.keys(config)[i]) > -1)
                return i;
        }
        return 0;
    };

    //set new config in electron-store and in render memory
    const setNewConfig = async (newConfig) => {
        //TODO: recognize changes and promt to save
        //console.log(newConfig === config[Object.keys(config)[indexOfConfig]]);
        setCurrentConfig(newConfig);
    };

    return (
        <div className="settings">
            {!settingsOpen ? null : (
                <div>
                    <List component="nav">
                        <ListItem button aria-controls="config-menu">
                            <ListItemText
                                primary="Selected Config"
                                secondary={Object.keys(config)[indexOfConfig]}
                            />
                        </ListItem>
                    </List>
                    <table>
                        <tbody>
                            {properties.map((property) => (
                                <SettingsRow
                                    key={property}
                                    currentConfig={currentConfig}
                                    property={property}
                                    setProperty={setNewConfig}
                                />
                            ))}
                        </tbody>
                    </table>
                    <Button
                        style={{ width: "12rem", margin: "auto" }}
                        color="primary"
                        variant="outlined"
                    >
                        Save
                    </Button>
                </div>
            )}
        </div>
    );
};

export default Settings;
