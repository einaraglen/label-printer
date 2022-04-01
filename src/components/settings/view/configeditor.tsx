import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import ArrowBackIosRoundedIcon from "@mui/icons-material/ArrowBackIosRounded";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import CachedIcon from "@mui/icons-material/Cached";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import KeyList from "./keylist";
import TopBar from "../topbar";
import InvokeHandler from "../../../utils/invoke";
import { IPC } from "../../../utils/enums";
import ReduxAccessor from "../../../store/accessor";
import ConfigHandler from "../../../utils/handlers/confighandler";

interface Props {
  selected: Config | null;
  setConfigkey: Function;
  navigate: Function;
  setSelected: Function;
}

const ConfigEditor = ({ selected, navigate, setConfigkey, setSelected }: Props) => {
  const { invoke } = InvokeHandler();
  const { removeConfig, config } = ReduxAccessor();
  const { resetConfig } = ConfigHandler();

  const handleExportClick = async () => {
    await invoke(IPC.EXPORT_CONFIG, {
      args: JSON.stringify(selected),
    });
  };
  
  const handleDeleteClick = () => {
    if (!selected) return;
    removeConfig(selected);
    navigate(0);
  };

  const handleReset = () => {
    if (selected) {
      let _config = resetConfig(selected.name);
      setSelected(_config);
    }
  };

  const isDeletable = () => {
    if (!selected || !config) return false;
    return selected.name !== config;
  };

  return (
    <Box sx={{ postition: "relative" }}>
      {!selected ? null : (
        <>
          <TopBar>
            <Box sx={{ display: "flex" }}>
              <Tooltip title="Back">
                <IconButton onClick={() => navigate(0)} size="large">
                  <ArrowBackIosRoundedIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Typography gutterBottom sx={{ my: "auto", fontSize: 15, ml: 2 }}>
                {selected.name}
              </Typography>
            </Box>
            <Box sx={{ width: "25%", display: "flex", justifyContent: "end" }}>
              <IconButton onClick={handleDeleteClick} disabled={!isDeletable()} size="large">
                <Tooltip title="Delete">
                  <DeleteRoundedIcon fontSize="medium" />
                </Tooltip>
              </IconButton>
              <Tooltip title="Reset">
                <IconButton onClick={handleReset} size="large">
                  <CachedIcon fontSize="medium" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Export">
                <IconButton onClick={handleExportClick} size="large">
                  <FileUploadIcon fontSize="medium" />
                </IconButton>
              </Tooltip>
            </Box>
          </TopBar>
          <KeyList {...{ selected, navigate, setConfigkey }} />
        </>
      )}
    </Box>
  );
};

export default ConfigEditor;
