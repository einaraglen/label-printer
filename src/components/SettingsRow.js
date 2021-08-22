import React from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import LineInfoPicker from "./LineInfoPicker";
import ErrorOutlineIcon from "@material-ui/icons/ErrorOutline";

const SettingsRow = ({ collapseComplete, currentConfig, property, setProperty, options }) => {
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClickListItem = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuItemClick = (event, property, option) => {
        setAnchorEl(null);
        setProperty({
            ...currentConfig,
            [property]: option,
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

    const setInfo = (info) => {
        //we send the new list upwards
        setProperty({
            ...currentConfig,
            [property]: info,
        });
    };

    return (
        <tr key={property}>
            <td style={{ width: "30%", textAlign: "center" }}>
                <List component="nav">
                    <ListItem aria-controls="property text" style={{ height: "4rem", textAlign: "center" }}>
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
                {!collapseComplete ? (
                    <List component="nav">
                        <ListItem style={{ height: "4rem" }} disabled>
                            <ListItemText
                                primary={
                                    property === "_Info" || property === "_Extra"
                                        ? buildLineInfo(currentConfig[property])
                                        : !currentConfig[property]
                                        ? `Pick ${property}`
                                        : currentConfig[property]
                                }
                            />
                            {!currentConfig[property] && property !== "_Extra" ? (
                                <ErrorOutlineIcon color="secondary" />
                            ) : null}
                        </ListItem>
                    </List>
                ) : property === "_Info" || property === "_Extra" ? (
                    <LineInfoPicker
                        options={options}
                        text={buildLineInfo(currentConfig[property])}
                        currentPicked={currentConfig[property]}
                        setInfo={(info) => setInfo(info)}
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
                                {!currentConfig[property] && property !== "_Extra" ? (
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
                                selected={currentConfig[property] === "EMPTY"}
                                onClick={(event) => handleMenuItemClick(event, property, "EMPTY")}
                            >
                                EMPTY
                            </MenuItem>
                            {options.map((option) => (
                                <MenuItem
                                    key={option}
                                    selected={currentConfig[property] === option}
                                    onClick={(event) => handleMenuItemClick(event, property, option)}
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
