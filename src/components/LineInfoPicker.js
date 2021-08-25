import React from "react";
import { Checkbox, FormControl, FormControlLabel, FormGroup, Menu } from "@material-ui/core/";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ErrorOutlineIcon from "@material-ui/icons/ErrorOutline";
import List from "@material-ui/core/List";

const LineInfoPicker = ({ options, text, currentPicked, setInfo }) => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    //this is changed when Menu is Open (if we update up to Settings, picking becomes slow!)
    const [previewList, setPreviewList] = React.useState([...currentPicked]);

    const handleClickListItem = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
        //send updates upwards to Settings when closing Menu
        setInfo([...previewList]);
    };

    const handleChange = (event) => {
        //check if exists, if so -> remove
        let newList =
            previewList.indexOf(event.currentTarget.id) > -1
                ? previewList.filter((item) => item !== event.currentTarget.id)
                : [...previewList, event.currentTarget.id];
        //remember to filter out "EMPTY"
        setPreviewList(newList.filter((item) => item !== "EMPTY"));
    };

    const handleEMPTY = () => {
        setPreviewList(["EMPTY"]);
        setInfo(["EMPTY"]);
        setAnchorEl(null)
    };

    const unselectAll = () => {
        setPreviewList([]);
    };

    return (
        <div>
            <ListItem style={{ height: "4rem" }} button onClick={handleClickListItem}>
                <ListItemText primary={!text ? "Pick Info" : text} />
                {!text ? <ErrorOutlineIcon color="secondary" /> : null}
            </ListItem>
            <Menu onClose={handleClose} anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)}>
                <FormControl>
                    <FormGroup>
                        <List component="controlls">
                            <ListItem
                                style={{ height: "2rem" }}
                                button
                                aria-haspopup="true"
                                onClick={unselectAll}
                            >
                                <ListItemText primary="Unselect All" />
                            </ListItem>
                            <ListItem
                                style={{ height: "2rem" }}
                                button
                                aria-haspopup="true"
                                onClick={handleEMPTY}
                                selected={previewList.indexOf("EMPTY") !== -1}
                            >
                                <ListItemText primary="EMPTY" />
                            </ListItem>
                        </List>

                        {!options
                            ? null
                            : options.map((option) => (
                                  <FormControlLabel
                                      key={option}
                                      style={{ paddingLeft: "1rem" }}
                                      label={`${option} ${
                                          previewList.indexOf(option) > -1
                                              ? " - " + (previewList.indexOf(option) + 1)
                                              : ""
                                      }`}
                                      control={
                                          <Checkbox
                                              color="primary"
                                              checked={previewList.indexOf(option) > -1}
                                              onChange={(event) => handleChange(event)}
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
