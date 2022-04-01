import { Box, Typography, FormGroup, IconButton } from "@mui/material";
import React, { useEffect } from "react";
import BuildIcon from "@mui/icons-material/Build";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import ReduxAccessor from "../../../store/accessor";
import Boolean from "./boolean";
import Number from "./number";
import Text from "./text";

interface Props {
  setAdjOpen: Function;
}

const Adjustments = ({ setAdjOpen }: Props) => {
  const { adjustments, updateAdjustment } = ReduxAccessor();

  const getAdjustments = (filter: string) => {
    return adjustments
      .filter((a: Adjustment) => a.type === filter)
      .map((a: Adjustment, idx: number) => {
        if (typeof a.value == "boolean") return <Boolean key={idx} adjustment={a} {...{ updateAdjustment }} />;
        if (typeof a.value == "string") return <Text key={idx} adjustment={a} {...{ updateAdjustment }} />;
        if (!isNaN(a.value)) return <Number key={idx} adjustment={a} {...{ updateAdjustment }} />;
        return <div>Error!</div>;
      });
  };

  return (
    <Box sx={{ width: "15rem", py: 2, px: 1, display: "flex", flexDirection: "column", bgcolor: "hsl(215, 28%, 14%)", minHeight: "100vh", overflowY: "scroll" }}>
      <Box sx={{ display: "flex", justifyItems: "center", justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", justifyItems: "center" }}>
          <Typography gutterBottom sx={{ ml: 1, fontSize: 15, fontWeight: 500 }}>
            Adjustments
          </Typography>
          <BuildIcon sx={{ ml: 1, mt: 0.1 }} fontSize="small" />
        </Box>
        <IconButton onClick={() => setAdjOpen(false)} size="large" sx={{ mt: -1.5 }}>
          <ArrowForwardIosRoundedIcon fontSize="small" />
        </IconButton>
      </Box>
      <FormGroup sx={{ bgcolor: "hsl(215, 28%, 20%)", p: 1, borderRadius: "5px", mb: 1 }}>
        <Typography gutterBottom sx={{ fontSize: 14, fontWeight: 500 }}>
          Quantity
        </Typography>
        {getAdjustments("Quantity")}
      </FormGroup>
      <FormGroup sx={{ bgcolor: "hsl(215, 28%, 20%)", p: 1, borderRadius: "5px", mb: 1 }}>
        <Typography gutterBottom sx={{ fontSize: 14, fontWeight: 500 }}>
          Group
        </Typography>
        {getAdjustments("Group")}
      </FormGroup>
      <FormGroup sx={{ bgcolor: "hsl(215, 28%, 20%)", p: 1, borderRadius: "5px", mb: 1 }}>
        <Typography gutterBottom sx={{ fontSize: 14, fontWeight: 500 }}>
          Text
        </Typography>
        {getAdjustments("Text")}
      </FormGroup>
    </Box>
  );
};

export default Adjustments;
