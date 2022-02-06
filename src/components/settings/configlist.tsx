import { List, ListItem, ListItemText, IconButton } from "@mui/material";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";

interface Props {
  config: Config[];
  next: Function;
}

const ConfigList = ({ config, next }: Props) => {
  return (
    <List component="nav" sx={{ maxHeight: "13rem" }}>
      {config.map((entry: Config, idx: number) => (
        <ListItem
        key={idx}
          onClick={() => next()}
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
          <ListItemText sx={{pl: 2}} primary={entry.name} />
        </ListItem>
      ))}
    </List>
  );
};

export default ConfigList;
