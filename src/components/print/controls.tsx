import { Box, Button, Drawer, Tooltip, IconButton } from "@mui/material";
import React, { useState } from "react";
import PrintIcon from "@mui/icons-material/Print";
import BuildIcon from "@mui/icons-material/Build";
import Adjustments from "./adjustments";

const Controls = () => {
  const [open, setOpen] = useState(false);
  return (
    <Box sx={{ display: "flex", justifyContent: "space-between", flexGrow: 1, px: 2 }}>
      <Box sx={{ display: "flex", width: "25%" }}>
        <Tooltip title="Adjustments">
          <IconButton onClick={() => setOpen(true)} size="large" sx={{ my: "auto" }}>
            <BuildIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
      <Box sx={{ display: "flex", width: "50%" }}>
        <Button variant="contained" sx={{ my: "auto", flexGrow: 1, color: "black" }} endIcon={<PrintIcon />}>
          Print
        </Button>
      </Box>
      <Box sx={{ display: "flex", width: "25%" }}>
      </Box>
      <Drawer anchor="left" open={open} onClose={() => setOpen(false)}>
        <Adjustments />
      </Drawer>
    </Box>
  );
};

export default Controls;
