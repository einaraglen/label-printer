import React from "react";
import {
    Checkbox,
    FormControl,
    FormControlLabel,
    FormGroup,
    Menu,
} from "@material-ui/core/";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ErrorOutlineIcon from "@material-ui/icons/ErrorOutline";

const LineInfoPicker = ({ options, text, currentPicked, setLineInfo }) => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [picked, setPicked] = React.useState(!currentPicked ? [] : currentPicked);

    const handleClickListItem = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleChange = (event) => {
        //if already in list, remove
        let newList =
            picked.indexOf(event.currentTarget.id) > -1
                ? picked.filter((item) => item !== event.currentTarget.id)
                : [...picked, event.currentTarget.id];
        setPicked(newList);
        setLineInfo(newList);
    };

    return (
        <div>
            <ListItem
                style={{ height: "4rem" }}
                button
                onClick={handleClickListItem}
            >
                <ListItemText primary={!text ? "Pick LineInfo" : text} />
                {!text ? <ErrorOutlineIcon color="secondary" /> : null}
            </ListItem>
            <Menu
                onClose={handleClose}
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
            >
                <FormControl>
                    <FormGroup>
                        {!options ? null : options.map((option) => (
                            <FormControlLabel
                                key={option}
                                style={{ paddingLeft: "1rem" }}
                                label={`${option} ${picked.indexOf(option) > -1 ? " - " + (picked.indexOf(option) + 1) : ""}`}
                                control={
                                    <Checkbox
                                        color="primary"
                                        checked={picked.indexOf(option) > -1}
                                        onChange={(event) =>
                                            handleChange(event)
                                        }
                                        id={option}
                                    />
                                }
                            />
                        ))}
                    </FormGroup>
                </FormControl>
            </Menu>
        </div>
    );
};

export default LineInfoPicker;
