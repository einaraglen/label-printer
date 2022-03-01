import { Box, IconButton, Tooltip, TextField, Switch, Typography } from "@mui/material";
import ArrowBackIosRoundedIcon from "@mui/icons-material/ArrowBackIosRounded";
import AbcIcon from "@mui/icons-material/Abc";
import AccessorList from "./accessorlist";
import { useEffect, useState } from "react";
import TopBar from "./topbar";
import UnitModal from "./unitmodal";

interface Props {
  configkey: ConfigKey | null;
  selected: Config | null;
  handleUpdateAccessor: Function;
  navigate: Function;
  setConfigkey: Function;
}

const KeyEditor = ({ configkey, selected, navigate, handleUpdateAccessor, setConfigkey }: Props) => {
  const [searchkey, setSearchkey] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setSearchkey("")
  }, [navigate])

  const handleChange = (e: any) => {
    setSearchkey(e.target.value);
  };

  const handleSwitch = () => {
    if (!configkey) return;
    let _configkey = configkey.multiple ? convertToString(configkey) : convertToStringList(configkey);
    setConfigkey(_configkey);
    handleUpdateAccessor(_configkey);
  };

  const convertToString = (_congfigkey: ConfigKey): ConfigKey => {
    let value = _congfigkey.value.length === 0 ? "" : _congfigkey.value[0];
    return {
      name: _congfigkey.name,
      key: _congfigkey.key,
      multiple: false,
      value,
    };
  };

  const convertToStringList = (_congfigkey: ConfigKey): ConfigKey => {
    return {
      name: _congfigkey.name,
      key: _congfigkey.key,
      multiple: true,
      value: _congfigkey.value === "" ? [] : [_congfigkey.value],
    };
  };

  return (
    <Box sx={{ postition: "relative" }}>
      {!configkey ? null : (
        <>
          <TopBar>
            <Box sx={{ width: "25%", display: "flex" }}>
              <Tooltip title="Back">
                <IconButton onClick={() => navigate(1)} size="large">
                  <ArrowBackIosRoundedIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Typography gutterBottom sx={{ my: "auto", fontSize: 15, ml: 2 }}>
                {configkey.name}
              </Typography>
            </Box>
            <Box sx={{ width: "50%", textAlign: "center", display: "flex" }}>
              <TextField autoFocus variant="standard" placeholder="Search" value={searchkey} onChange={handleChange} sx={{ my: "auto", mx: "auto" }} />
            </Box>
            <Box sx={{ width: "25%", display: "flex", justifyContent: "space-between" }}>
              <Tooltip title="Units">
                <IconButton onClick={() => setOpen(true)} size="large">
                  <AbcIcon fontSize="medium" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Multiple">
                <Switch sx={{ my: "auto" }} onClick={handleSwitch} checked={configkey.multiple} />
              </Tooltip>
            </Box>
          </TopBar>
          <UnitModal {...{ open, setOpen, handleUpdateAccessor, configkey, setConfigkey }} />
          <AccessorList {...{ searchkey, configkey, selected, handleUpdateAccessor, setConfigkey }} />
        </>
      )}
    </Box>
  );
};

export default KeyEditor;
