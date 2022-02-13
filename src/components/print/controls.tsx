import { Box, Button, Drawer, Tooltip, IconButton, Badge } from "@mui/material";
import React, { useState } from "react";
import PrintIcon from "@mui/icons-material/Print";
import BuildIcon from "@mui/icons-material/Build";
import Adjustments from "./adjustments";
import ReduxAccessor from "../../store/accessor";
import { ProgramState } from "../../utils/enums";
import LinearProgress from "@mui/material/LinearProgress";
import NewReleasesIcon from "@mui/icons-material/NewReleases";
import UpdateModal from "./updatemodal";

interface Props {
  handlePrint: any;
  progress: number;
}

const Controls = ({ handlePrint, progress }: Props) => {
  const [adjOpen, setAdjOpen] = useState(false);
  const [updateOpen, setUpdateOpen] = useState(false);
  const { state, update } = ReduxAccessor();

  return (
    <Box sx={{ display: "flex", justifyContent: "space-between", flexGrow: 1, px: 2 }}>
      <Box sx={{ display: "flex", width: "25%" }}>
        <Tooltip title="Adjustments">
          <IconButton onClick={() => setAdjOpen(true)} size="large" sx={{ my: "auto" }} disabled={state === ProgramState.Printing}>
            <BuildIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
      <Box sx={{ display: "flex", width: "50%" }}>
        <Button variant="contained" onClick={handlePrint} sx={{ my: "auto", flexGrow: 1, color: "black" }} endIcon={<PrintIcon />} disabled={state === ProgramState.Printing}>
          {state === ProgramState.Printing ? (
            <Box sx={{ width: "100%" }}>
              <LinearProgress variant="determinate" color="success" value={progress} />
            </Box>
          ) : (
            "Print"
          )}
        </Button>
      </Box>
      <Box sx={{ display: "flex", width: "25%", justifyContent: "end" }}>
        <Tooltip title={update ? "Update ready!" : "Up to Date"}>
          <IconButton onClick={() => setUpdateOpen(true)} size="large" sx={{ my: "auto" }} disabled={state === ProgramState.Printing}>
          <Badge color="success" variant="dot" invisible={!update}>
            <NewReleasesIcon fontSize="medium" />
            </Badge>
          </IconButton>
        </Tooltip>
        <UpdateModal open={updateOpen} setOpen={setUpdateOpen} />
      </Box>
      <Drawer anchor="left" open={adjOpen} onClose={() => setAdjOpen(false)}>
        <Adjustments />
      </Drawer>
    </Box>
  );
};

export default Controls;
