import React from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import LineInfoPicker from "./LineInfoPicker";
import ErrorOutlineIcon from "@material-ui/icons/ErrorOutline";
import { fasterIndexOf  } from "utils";

const SettingsRow = ({ currentConfig, property, setProperty, options }) => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [selectedIndex, setSelectedIndex] = React.useState(0);

    React.useEffect(() => {
        let isMounted = true;
        const getSelected = async () => {
            //async guard
            if (!isMounted) return;
            setSelectedIndex(fasterIndexOf(options, currentConfig[property]));
        };

        getSelected();
        return () => {
            isMounted = false;
        };
    }, [currentConfig, options, property]);

    const handleClickListItem = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuItemClick = (event, index, property) => {
        setAnchorEl(null);
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
                                property === "LineInfo"
                                    ? "Multiple"
                                    : "Single"
                            }
                        />
                    </ListItem>
                </List>
            </td>
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
                                    primary={!currentConfig[property] ? `Pick ${property}` : currentConfig[property]}
                                />
                                {!currentConfig[property] ? <ErrorOutlineIcon color="secondary" /> : null}
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
