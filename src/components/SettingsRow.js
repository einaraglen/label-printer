import React from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import { Context } from "context/State";

//we can now amazingly access awsome shit in our render!
const fs = window.require("fs");
const parser = window.require("fast-xml-parser");

const SettingsRow = ({ currentConfig, property, setProperty }) => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [selectedIndex, setSelectedIndex] = React.useState(0);
    const [options, setOptions] = React.useState([]);

    const state = React.useContext(Context);
    const stateRef = React.useRef(state);

    React.useEffect(() => {
        const getOptions = async () => {
            const rawData = await readFile(stateRef.current.value.currentPath);
            const data = parser.parse(rawData);
            setOptions(Object.keys(data.Table.Row[0]));
        };
        getOptions();
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
            [property]: options[index]
        });
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const buildLineInfo = (lineInfo) => {
        let lineInfoString = "";
        for (let i = 0; i < lineInfo.length; i++) {
            lineInfoString += lineInfo[i];
            lineInfoString += i === lineInfo.length - 1 ? "" : ", ";
        }
        return lineInfoString;
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
                                property === "LineInfo"
                                    ? buildLineInfo(currentConfig[property])
                                    : currentConfig[property]
                            }
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
                                handleMenuItemClick(event, index, property)
                            }
                        >
                            {option}
                        </MenuItem>
                    ))}
                </Menu>
            </td>
        </tr>
    );
};

export default SettingsRow;
