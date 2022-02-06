import { List, ListItem, ListItemText, IconButton } from "@mui/material";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import { capitalize } from "../../utils/tools";
import { useEffect, useState } from "react";
import ReduxAccessor from "../../store/accessor";

interface Props {
  config: Config;
  next: Function;
  setKey: Function;
  setObjectkey: Function;
}

const KeyList = ({ config, next, setKey, setObjectkey }: Props) => {
  const [current, setCurrent] = useState<Config>(config);
  const { configs } = ReduxAccessor();
  const handledKeys = () => {
    return Object.keys(config).filter((key: string) => key !== "name");
  };

  const handleListClick = (key: any) => {
    setObjectkey(key)
    setKey(((config as any)[key] as ConfigKey));
    next(2);
  };

  useEffect(() => {
    let current = configs.find((entry: Config) => entry.name === config.name);
    if (!current) return;
    setCurrent(current)
  }, [configs]);  

  return (
    <List component="nav" sx={{ maxHeight: "10rem", overflowY: "scroll" }}>
      {handledKeys().map((key: string, idx: number) => (
        <ListItem
          key={idx}
          onClick={() => handleListClick(key)}
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
          <ListItemText primary={capitalize(key)} sx={{ pl: 2 }} secondary={((current as any)[key] as ConfigKey).accessor || "Not Set"} />
        </ListItem>
      ))}
    </List>
  );
};

export default KeyList;
