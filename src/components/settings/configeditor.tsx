import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import ArrowBackIosRoundedIcon from "@mui/icons-material/ArrowBackIosRounded";
import FileUploadIcon from '@mui/icons-material/FileUpload';
import KeyList from "./keylist";
import TopBar from "./topbar";
import InvokeHandler from "../../utils/invoke";
import { IPC } from "../../utils/enums";

interface Props {
  selected: Config | null;
  setConfigkey: Function;
  navigate: Function;
}

const ConfigEditor = ({ selected, navigate, setConfigkey }: Props) => {
  const { invoke } = InvokeHandler();
  
  const handleExportClick = async () => {
    await invoke(IPC.EXPORT_CONFIG, {
      args: JSON.stringify(selected),
    });
  }

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
            <Tooltip title="Export">
              <IconButton onClick={handleExportClick} size="large">
                <FileUploadIcon fontSize="medium" />
              </IconButton>
              </Tooltip>
            </Box>
          </TopBar>
          <KeyList {...{ selected, navigate, setConfigkey }} />
        </>
      )}
    </Box>
  );
};

export default ConfigEditor;
