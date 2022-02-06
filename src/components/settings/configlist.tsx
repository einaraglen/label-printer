import { List, ListItem, ListItemText, IconButton } from "@mui/material";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";

interface Props {
  configs: Config[];
  next: Function;
  setSelected: Function;
}

const ConfigList = ({ configs, next, setSelected }: Props) => {
  const handleListClick = (entry: Config) => {
    setSelected(entry);
    next();
  };

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
          <ListItemText sx={{ pl: 2 }} primary={entry.name} />
        </ListItem>
      ))}
    </List>
  );
};

export default ConfigList;
