import { List, ListItem, ListItemText, IconButton } from "@mui/material";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import ReduxAccessor from "../../store/accessor";

interface Props {
  navigate: Function;
  setSelected: Function;
}

const ConfigList = ({ navigate, setSelected }: Props) => {
  const { configs } = ReduxAccessor();
  const handleListClick = (entry: Config) => {
    setSelected(entry);
    navigate(1);
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
