import React from "react";
import { Button } from "@material-ui/core";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import AddIcon from "@material-ui/icons/Add";
import SettingsRow from "./SettingsRow";

const { ipcRenderer } = window.require("electron");

const Settings = () => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [selectedIndex, setSelectedIndex] = React.useState(0);
    const [config, setConfig] = React.useState({});
    const [currentConfig, setCurrentConfig] = React.useState({});

    React.useEffect(() => {
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
            result = await ipcRenderer.invoke("get-config");
            setConfig(result);
        };
        getConfig();
    }, []);

    const handleClickListItem = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuItemClick = (event, index) => {
        setAnchorEl(null);
        if (index === -1) return console.log("Add");
        setSelectedIndex(index);
        setCurrentConfig(config[Object.keys(config)[index]]);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    //set new config in electron-store and in render memory
    const setNewConfig = async (newConfig) => {
        console.log(newConfig);
        setCurrentConfig(newConfig);
        /*let result = await ipcRenderer.invoke("set-config", {
            ...config,
            [Object.keys(config)[selectedIndex]]: newConfig,
        });
        if (!result.status) return;
        //console.log(result)
        setConfig(result.config);*/
    };

    return (
        <div className="settings">
            <List component="nav">
                <ListItem
                    button
                    aria-haspopup="true"
                    aria-controls="config-menu"
                    onClick={handleClickListItem}
                >
                    <ListItemText
                        primary="Selected Config"
                        secondary={Object.keys(config)[selectedIndex]}
                    />
                </ListItem>
            </List>
            <Menu
                id="config-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                {Object.keys(config).map((option, index) => (
                    <MenuItem
                        key={option}
                        selected={index === selectedIndex}
                        onClick={(event) => handleMenuItemClick(event, index)}
                    >
                        {option}
                    </MenuItem>
                ))}
                <MenuItem onClick={(event) => handleMenuItemClick(event, -1)}>
                    Add
                    <AddIcon
                        style={{ marginLeft: ".2rem", color: "#8bc34a" }}
                    />
                </MenuItem>
            </Menu>
            <table>
                <tbody>
                    {Object.keys(currentConfig).map((property) => (
                        <SettingsRow
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
    );
};

export default Settings;
