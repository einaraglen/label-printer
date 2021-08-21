import React from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import LineInfoPicker from "./LineInfoPicker";
import ErrorOutlineIcon from "@material-ui/icons/ErrorOutline";

const SettingsRow = ({ currentConfig, property, setProperty, options }) => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [selectedIndex, setSelectedIndex] = React.useState(
        !currentConfig
            ? null
            : options.indexOf(currentConfig[property])
    );

    const handleClickListItem = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuItemClick = (event, index, property) => {
        setAnchorEl(null);
        setSelectedIndex(index);
        setProperty({
            ...currentConfig,
            [property]: index === -1 ? "EMPTY" : options[index],
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

    return (
        <tr key={property}>
            <td style={{ width: "30%", textAlign: "center" }}>
                <List component="nav">
                    <ListItem
                        aria-controls="property text"
                        style={{ height: "4rem", textAlign: "center" }}
                    >
                        <ListItemText
                            primary={property}
                            secondary={
                                property === "_Extra"
                                    ? "Optional"
                                    : property === "_Info"
                                    ? "Multiple"
                                    : "Single"
                            }
                        />
                    </ListItem>
                </List>
            </td>
            <td>
                {property === "_Info" || property === "_Extra" ? (
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
                                    primary={
                                        !currentConfig[property]
                                            ? `Pick ${property}`
                                            : currentConfig[property]
                                    }
                                />
                                {!currentConfig[property] &&
                                property !== "_Extra" ? (
                                    <ErrorOutlineIcon color="secondary" />
                                ) : null}
                            </ListItem>
                        </List>
                        <Menu
                            id="config-menu"
                            anchorEl={anchorEl}
                            keepMounted
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                        >
                            <MenuItem
                                selected={-1 === selectedIndex}
                                onClick={(event) =>
                                    handleMenuItemClick(event, -1, property)
                                }
                            >
                                EMPTY
                            </MenuItem>
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
