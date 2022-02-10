import { List, ListItem, ListItemText, IconButton } from "@mui/material";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import ReduxAccessor from "../../store/accessor";

interface Props {
  selected: Config;
  setConfigkey: Function;
  navigate: Function
}

const KeyList = ({ selected, setConfigkey, navigate }: Props) => {
  const { config } = ReduxAccessor();
  const handleListClick = (key: ConfigKey) => {
    setConfigkey(key);
    navigate(2);
  };

  const getSecondaryText = (key: ConfigKey) => {
    if (key.multiple) return key.value.toString();
    return key.value;
  }

  return (
    <List component="nav" sx={{ maxHeight: "13rem", overflowY: "scroll" }}>
      {selected.keys.map((key: ConfigKey, idx: number) => (
        <ListItem
        disabled={config !== selected.name}
          key={idx}
          onClick={() => handleListClick(key)}
          sx={{
            height: "3.5rem",
          }}
          button
          aria-controls="config-menu"
          secondaryAction={
              <ArrowForwardIosRoundedIcon fontSize="small" />
          }
        >
          <ListItemText primary={key.name} sx={{ pl: 2 }} secondary={getSecondaryText(key) || "Not Set"} />
        </ListItem>
      ))}
    </List>
  );
};

export default KeyList;
