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

const LineInfoPicker = ({ options, text, currentPicked, setLineInfo }) => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [picked, setPicked] = React.useState(currentPicked);

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
                <ListItemText primary={text} />
            </ListItem>
            <Menu
                onClose={handleClose}
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
            >
                <FormControl>
                    <FormGroup>
                        {options.map((option) => (
                            <FormControlLabel
                                key={option}
                                style={{ paddingLeft: "1rem" }}
                                label={option}
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
