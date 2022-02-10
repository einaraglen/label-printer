import { Box, Typography, FormGroup, FormControlLabel, Checkbox } from "@mui/material";
import React from "react";
import BuildIcon from "@mui/icons-material/Build";

const Adjustments = () => {
  return (
    <Box sx={{ width: "10rem", p: 2 }}>
      <Box sx={{ display: "flex", justifyItems: "center" }}>
        <Typography gutterBottom sx={{ fontSize: 15, fontWeight: 500 }}>
          Adjustments
        </Typography>
        <BuildIcon sx={{ ml: 1, mt: 0.1 }} fontSize="small" />
      </Box>
      <FormGroup>
      <FormControlLabel control={<Checkbox defaultChecked />} label="Singles" />
      <FormControlLabel control={<Checkbox defaultChecked />} label="Groups" />
      <FormControlLabel control={<Checkbox defaultChecked />} label="Max length" />
    </FormGroup>
    </Box>
  );
};

export default Adjustments;
