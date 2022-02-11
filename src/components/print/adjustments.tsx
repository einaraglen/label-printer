import { Box, Typography, FormGroup, FormControlLabel, Checkbox } from "@mui/material";
import React from "react";
import BuildIcon from "@mui/icons-material/Build";
import ReduxAccessor from "../../store/accessor";

const Adjustments = () => {
  const { adjustments, updateAdjustment } = ReduxAccessor();

  const handleCheck = (e: any) => {
    updateAdjustment({
      name: e.target.name,
      value: e.target.checked,
    });
  };

  return (
    <Box sx={{ width: "10rem", p: 2, bgcolor: "hsl(215, 28%, 14%)", minHeight: "100vh" }}>
      <Box sx={{ display: "flex", justifyItems: "center" }}>
        <Typography gutterBottom sx={{ fontSize: 15, fontWeight: 500 }}>
          Adjustments
        </Typography>
        <BuildIcon sx={{ ml: 1, mt: 0.1 }} fontSize="small" />
      </Box>
      <FormGroup>
        {adjustments.map((adjustment: Adjustment, idx: number) => (
          <FormControlLabel key={idx} control={<Checkbox onClick={handleCheck} name={adjustment.name} checked={adjustment.value} />} label={adjustment.name} />
        ))}
      </FormGroup>
    </Box>
  );
};

export default Adjustments;
