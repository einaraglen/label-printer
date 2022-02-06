import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Container from "@mui/material/Container";
import SettingsIcon from "@mui/icons-material/Settings";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import CheckIcon from "@mui/icons-material/Check";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

import { useNavigate } from "react-router-dom";
import { Button, InputLabel, Select, MenuItem } from "@mui/material";

const TopBar = () => {
  const navigate = useNavigate();

  const handleSettingsClick = () => navigate("/settings");

  const getButtonEndIcon = (valid: boolean) => {
    if (valid) return <CheckIcon sx={{ color: "lightgreen" }} />
    return <InfoOutlinedIcon sx={{ color: "secondary.main" }} />
  }

  return (
    <AppBar position="static" elevation={0}>
      <Container >
        <Toolbar disableGutters sx={{ display: "flex", justifyContent: "space-between" }}>
            <Button variant="text" startIcon={<FolderOpenIcon />} endIcon={getButtonEndIcon(true)}>
              Template
            </Button>
        <Select
        size="small"
          labelId="demo-simple-select-standard-label"
          id="demo-simple-select-standard"
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          <MenuItem value={10}>Ten</MenuItem>
          <MenuItem value={20}>Twenty</MenuItem>
          <MenuItem value={30}>Thirty</MenuItem>
        </Select>
            <IconButton onClick={handleSettingsClick} size="large">
              <SettingsIcon />
            </IconButton>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default TopBar;
