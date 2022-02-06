import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Container from "@mui/material/Container";
import SettingsIcon from "@mui/icons-material/Settings";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import { useLocation, useNavigate } from "react-router-dom";
import { Tooltip, Select, MenuItem, FormControl } from "@mui/material";

const TopBar = () => {
  const navigate = useNavigate();
  const location = useLocation()

  const handleSettingsClick = () => {
    if (location.pathname.includes("settings")) return navigate("/")
    navigate("/settings")
  };

  const handleTemplatesClick = () => {
    navigate("/templates")
    if (location.pathname.includes("templates")) return navigate("/")
  };

  const getSettingseIcon = (_location: any) => {
    if (_location.pathname.includes("settings")) return <HomeRoundedIcon />
    return <SettingsIcon />
  }

  const getTemplateIcon = (_location: any) => {
    if (_location.pathname.includes("templates")) return <HomeRoundedIcon />
    return <FolderOpenIcon />
  }

  const getToolTip = (_location: any, tip: string) => {
    if (_location.pathname.includes(tip.toLowerCase())) return "Home"
    return tip
  }

  return (
    <AppBar position="sticky" color="transparent" sx={{ backdropFilter: "blur(5px)", borderBottomColor: "hsl(215, 28%, 14%)" }} elevation={4}>
      <Container>
        <Toolbar disableGutters sx={{ display: "flex", justifyContent: "space-between" }}>
          <Tooltip placement="right" title={getToolTip(location, "Templates")}>
            <IconButton onClick={handleTemplatesClick} size="large">
            {getTemplateIcon(location)}
            </IconButton>
          </Tooltip>
          <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
          <Select value={10} size="small">
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            <MenuItem value={10}>Ten</MenuItem>
            <MenuItem value={20}>Twenty</MenuItem>
            <MenuItem value={30}>Thirty</MenuItem>
          </Select>
          </FormControl>
      
          <Tooltip placement="left"  title={getToolTip(location, "Settings")}>
            <IconButton onClick={handleSettingsClick} size="large">
            {getSettingseIcon(location)}
            </IconButton>
          </Tooltip>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default TopBar;
