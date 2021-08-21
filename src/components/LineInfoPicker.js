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
import List from "@material-ui/core/List";

const LineInfoPicker = ({ options, text, currentPicked, setInfo }) => {
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClickListItem = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleChange = (event) => {
        //then check if exists, if so -> remove
        let newList =
            currentPicked.indexOf(event.currentTarget.id) > -1
                ? currentPicked.filter(
                      (item) => item !== event.currentTarget.id
                  )
                : [...currentPicked, event.currentTarget.id];
        //remember to filter out "EMPTY"
        setInfo(newList.filter((item) => item !== "EMPTY"));
    };

    const handleSpecialButtons = (closeAfter) => {
        //EMPTY
        if (closeAfter) {
            setInfo(["EMPTY"])
            return handleClose();
        }
        //Unselect All
        setInfo([]);
    }

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
                    <List component="controlls">
                            <ListItem
                                style={{ height: "2rem" }}
                                button
                                aria-haspopup="true"
                                onClick={() => handleSpecialButtons(false)}
                            >
                                <ListItemText
                                    primary="Unselect All"
                                />
                            </ListItem>
                            <ListItem
                                style={{ height: "2rem" }}
                                button
                                aria-haspopup="true"
                                onClick={() => handleSpecialButtons(true)}
                                selected={currentPicked.indexOf("EMPTY") !== -1}
                            >
                                <ListItemText
                                    primary="EMPTY"
                                />
                            </ListItem>
                        </List>

                        {!options
                            ? null
                            : options.map((option) => (
                                  <FormControlLabel
                                      key={option}
                                      style={{ paddingLeft: "1rem" }}
                                      label={`${option} ${
                                          currentPicked.indexOf(option) > -1
                                              ? " - " +
                                                (currentPicked.indexOf(option) +
                                                    1)
                                              : ""
                                      }`}
                                      control={
                                          <Checkbox
                                              color="primary"
                                              checked={
                                                  currentPicked.indexOf(
                                                      option
                                                  ) > -1
                                              }
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
