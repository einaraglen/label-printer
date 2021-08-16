import React from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import LineInfoPicker from "./LineInfoPicker";

//we can now amazingly access awsome shit in our render!
const fs = window.require("fs");

const SettingsRow = ({
    currentConfig,
    property,
    setProperty,
    options
}) => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [selectedIndex, setSelectedIndex] = React.useState(0);

    React.useEffect(() => {
        let isMounted = true;
        const getSelected = async () => {
            //async guard
            if (!isMounted) return;
            setSelectedIndex(
                options.indexOf(currentConfig[property])
            );
        };

        getSelected();
        return () => {
            isMounted = false;
        };
    }, []);

    const handleClickListItem = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuItemClick = (event, index, property) => {
        setAnchorEl(null);
        if (index === -1) return console.log("Add");
        setSelectedIndex(index);
        setProperty({
            ...currentConfig,
            [property]: options[index],
        });
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const buildLineInfo = (lineInfo) => {
        if (!lineInfo) return;
        let lineInfoString = "";
        for (let i = 0; i < lineInfo.length; i++) {
            lineInfoString += lineInfo[i];
            lineInfoString += i === lineInfo.length - 1 ? "" : ", ";
        }
        return lineInfoString;
    };

    const setLineInfo = (lineInfo) => {
        //we send the new list upwards
        setProperty({
            ...currentConfig,
            [property]: lineInfo,
        });
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
        <tr key={property}>
            <td style={{ width: "30%", textAlign: "center" }}>{property}</td>
            <td>
                {property === "LineInfo" ? (
                    <LineInfoPicker
                        options={options}
                        text={buildLineInfo(currentConfig[property])}
                        currentPicked={currentConfig[property]}
                        setLineInfo={(lineInfo) => setLineInfo(lineInfo)}
                    />
                ) : (
                    <>
                        <List component="nav">
                            <ListItem
                                style={{ height: "4rem" }}
                                button
                                aria-haspopup="true"
                                aria-controls="line-menu"
                                onClick={handleClickListItem}
                            >
                                <ListItemText
                                    primary={currentConfig[property]}
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
                            {options.map((option, index) => (
                                <MenuItem
                                    key={option}
                                    selected={index === selectedIndex}
                                    onClick={(event) =>
                                        handleMenuItemClick(
                                            event,
                                            index,
                                            property
                                        )
                                    }
                                >
                                    {option}
                                </MenuItem>
                            ))}
                        </Menu>
                    </>
                )}
            </td>
        </tr>
    );
};

export default SettingsRow;
