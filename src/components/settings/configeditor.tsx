import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import ArrowBackIosRoundedIcon from "@mui/icons-material/ArrowBackIosRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import KeyList from "./keylist";

interface Props {
  config: Config | null;
  back: Function;
  next: Function;
  setKey: Function;
  setObjectkey: Function;
}

const ConfigEditor = ({ config, back, next, setKey, setObjectkey }: Props) => {

  return (
    <Box sx={{ postition: "relative" }}>
      {!config ? null : (
        <>
          <Box sx={{ display: "flex", justifyContent: "space-between", px: 2, pt: 1 }}>
            <Box sx={{ width: "10%" }}>
              <Tooltip title="Back">
                <IconButton onClick={() => back()} size="large">
                  <ArrowBackIosRoundedIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
            <Box sx={{ width: "50%", textAlign: "center", display: "flex" }}>
              <Typography variant="h6" gutterBottom sx={{ my: "auto" }}>
                {config.name}
              </Typography>
            </Box>
            <Box sx={{ width: "25%", display: "flex", justifyContent: "end" }}>
              <Tooltip title="Delete">
                <IconButton disabled onClick={() => back()} size="large">
                  <DeleteRoundedIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
          <KeyList {...{ config, next, setKey, setObjectkey }} />
        </>
      )}
    </Box>
  );
};

export default ConfigEditor;
