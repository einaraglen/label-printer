import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import ArrowBackIosRoundedIcon from "@mui/icons-material/ArrowBackIosRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import KeyList from "./keylist";

interface Props {
  selected: Config | null;
  setConfigkey: Function;
  navigate: Function
}

const ConfigEditor = ({ selected, navigate, setConfigkey }: Props) => {

  return (
    <Box sx={{ postition: "relative" }}>
      {!selected ? null : (
        <>
          <Box sx={{ display: "flex", justifyContent: "space-between", px: 2, pt: 1 }}>
            <Box sx={{ width: "75%", display: "flex" }}>
              <Tooltip title="Back">
                <IconButton onClick={() => navigate(0)} size="large">
                  <ArrowBackIosRoundedIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Typography gutterBottom sx={{ my: "auto", fontSize: 15 }}>
                {selected.name}
              </Typography>
            </Box>
            <Box sx={{ width: "25%", display: "flex", justifyContent: "end" }}>
                <IconButton disabled onClick={() => navigate(0)} size="large">
                  <DeleteRoundedIcon fontSize="small" />
                </IconButton>
            </Box>
          </Box>
          <KeyList {...{ selected, navigate, setConfigkey }} />
        </>
      )}
    </Box>
  );
};

export default ConfigEditor;
