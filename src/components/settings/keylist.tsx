import { List, ListItem, ListItemText, IconButton } from "@mui/material";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import { capitalize } from "../../utils/tools";

interface Props {
  config: Config;
  next: Function;
}

const KeyList = ({ config, next }: Props) => {

    const handledKeys = () => {
        return Object.keys(config).filter((key: string) => key !== "name");
    }

  return (
    <List component="nav" sx={{ maxHeight: "10rem", overflowY: "scroll" }}>
      {handledKeys().map((key: string, idx: number) => (
        <ListItem
        key={idx}
          onClick={() => next(2)}
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
          <ListItemText primary={capitalize(key)} sx={{pl: 2}} secondary={((config as any)[key] as ConfigKey).accessor} />
        </ListItem>
      ))}
    </List>
  );
};

export default KeyList;
