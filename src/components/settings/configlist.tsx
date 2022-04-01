import { List, ListItem, ListItemText, IconButton, Chip, Box, Tooltip, Typography } from "@mui/material";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import ReduxAccessor from "../../store/accessor";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WarningIcon from "@mui/icons-material/Warning";
import ArrowBackIosRoundedIcon from "@mui/icons-material/ArrowBackIosRounded";
import TopBar from "./topbar";
import { useNavigate } from "react-router-dom";
import DownloadIcon from "@mui/icons-material/Download";
import { readFile } from "../../utils/tools";
import InvokeHandler from "../../utils/invoke";
import { IPC } from "../../utils/enums";

interface Props {
  navigate: Function;
  setSelected: Function;
}

const ConfigList = ({ navigate, setSelected }: Props) => {
  const { configs, config, setStatus, addConfig, updateConfig } = ReduxAccessor();
  const { invoke } = InvokeHandler();
  const routerNavigate = useNavigate();
  const handleListClick = (entry: Config) => {
    setSelected(entry);
    navigate(1);
  };

  const configExists = (_config: Config) => {
    let match = configs.find((c: Config) => c.name === _config.name);
    if (match) return true;
    return false;
  };

  const handleObject = (_config: Config) => {
    let isConfig = checkConfig(_config);
    if (isConfig) {
      if (configExists(_config)) return updateConfig({ name: _config.name, payload: _config });
      addConfig(_config);
    }
  }

  const handleArray = (_configs: Config[]) => {
    _configs.forEach((_config: Config) => handleObject(_config))
  }

  const handleInputChange = async (e: any) => {
    if (!e.target.value) return;
    try {
      let raw_config = await readFile(e.target.files[0].path);
      let _config = JSON.parse(raw_config);
      if (Array.isArray(_config)) return handleArray(_config)
      handleObject(_config)
    } catch (err: any) {
      console.warn(err);
    }
  };

  const checkConfig = (_config: Config | null) => {
    if (!_config) return false;
    let flag = false;
    _config.keys.forEach((key: ConfigKey) => {
      if (key.value === "") flag = true;
    });
    if (_config.name === config) setStatus({ key: "isConfig", value: !flag });
    return !flag;
  };

  const handleExportClick = async () => {
    await invoke(IPC.EXPORT_CONFIG, {
       args: JSON.stringify(configs),
    });
  };

  return (
    <>
      <TopBar>
        <Box sx={{ display: "flex" }}>
          <Tooltip title="Back">
            <IconButton onClick={() => routerNavigate(-1)} size="large">
              <ArrowBackIosRoundedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Typography gutterBottom sx={{ my: "auto", fontSize: 15, ml: 2 }}>
            Settings
          </Typography>
        </Box>
        <Box>
          <Tooltip title="Export all Configs">
            <IconButton onClick={handleExportClick} size="large">
              <FileUploadIcon fontSize="medium" />
            </IconButton>
          </Tooltip>
          <input id="file-button" style={{ display: "none" }} accept={".json"} type="file" name="upload_file" onChange={handleInputChange} />
          <label htmlFor="file-button">
            <Tooltip title="Import">
              <IconButton size="large" component="span">
                <DownloadIcon fontSize="medium" />
              </IconButton>
            </Tooltip>
          </label>
        </Box>
      </TopBar>
      <List component="nav" sx={{ maxHeight: "13rem", overflowY: "scroll" }}>
        {configs.map((entry: Config, idx: number) => (
          <ListItem
            key={idx}
            onClick={() => handleListClick(entry)}
            sx={{
              height: "3.5rem",
            }}
            button
            aria-controls="config-menu"
            secondaryAction={<ArrowForwardIosRoundedIcon fontSize="small" />}
          >
            <Box sx={{ display: "flex", width: "15rem", justifyContent: "space-between" }}>
              <ListItemText sx={{ pl: 2 }} primary={entry.name} />
              {!checkConfig(entry) ? (
                <Tooltip title="Config needs setup">
                  <WarningIcon color="warning" />
                </Tooltip>
              ) : (
                <Tooltip title="Config good">
                  <CheckCircleIcon color="success" />
                </Tooltip>
              )}
            </Box>
            {config === entry.name ? <Chip sx={{ ml: 10 }} label="Current" /> : null}
          </ListItem>
        ))}
      </List>
    </>
  );
};

export default ConfigList;
