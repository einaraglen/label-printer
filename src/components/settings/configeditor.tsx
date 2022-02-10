import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import ArrowBackIosRoundedIcon from "@mui/icons-material/ArrowBackIosRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import KeyList from "./keylist";
import TopBar from "./topbar";

interface Props {
  selected: Config | null;
  setConfigkey: Function;
  navigate: Function;
}

const ConfigEditor = ({ selected, navigate, setConfigkey }: Props) => {
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
              <IconButton disabled onClick={() => navigate(0)} size="large">
                <DeleteRoundedIcon fontSize="small" />
              </IconButton>
            </Box>
          </TopBar>
          <KeyList {...{ selected, navigate, setConfigkey }} />
        </>
      )}
    </Box>
  );
};

export default ConfigEditor;
