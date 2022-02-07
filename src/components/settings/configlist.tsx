import { List, ListItem, ListItemText, IconButton, Chip, Box, Tooltip } from "@mui/material";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import ReduxAccessor from "../../store/accessor";
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded';

interface Props {
  navigate: Function;
  setSelected: Function;
}

const ConfigList = ({ navigate, setSelected }: Props) => {
  const { configs, config, setStatus } = ReduxAccessor();
  const handleListClick = (entry: Config) => {
    setSelected(entry);
    navigate(1);
  };

  const checkConfig = (_config: Config | null) => {
    if (!_config) return false;
    let flag = false;
    _config.keys.forEach((key: ConfigKey) => {
      if (key.value === "") flag = true
    })
    if (_config.name === config) setStatus({ key: "isConfig", value: !flag });
    return !flag
  }

  return (
    <List component="nav" sx={{ maxHeight: "13rem" }}>
      {configs.map((entry: Config, idx: number) => (
        <ListItem
          key={idx}
          onClick={() => handleListClick(entry)}
          sx={{
            height: "3.5rem",
          }}
          button
          aria-controls="config-menu"
          secondaryAction={
            <IconButton edge="end" aria-label="delete">
              <ArrowForwardIosRoundedIcon fontSize="small" />
            </IconButton>
          }
        >
          <Box sx={{ display: "flex", width: "15rem", justifyContent: "space-between"}}>
          <ListItemText sx={{ pl: 2 }} primary={entry.name} />
         {!checkConfig(entry) ? <Tooltip title="Config needs setup">
          <ErrorOutlineRoundedIcon color="secondary" />
          </Tooltip> : <Tooltip title="Config good">
          <CheckCircleOutlineRoundedIcon color="success" />
          </Tooltip>}
          </Box>
          {config === entry.name ? <Chip sx={{ml: 10}} label="Current config" variant="outlined" /> : null}
        </ListItem>
      ))}
    </List>
  );
};

export default ConfigList;
