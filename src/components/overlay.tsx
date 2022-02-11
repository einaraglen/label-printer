import { Box, Accordion, AccordionSummary, Typography, AccordionDetails } from "@mui/material";
import React from "react";
import ReduxAccessor from "../store/accessor";
import { LogType } from "../utils/enums";
import WarningIcon from "@mui/icons-material/Warning";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import InfoIcon from "@mui/icons-material/Info";
import ErrorIcon from "@mui/icons-material/Error";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const Overlay = () => {
  const { status, logs } = ReduxAccessor();

  const isBad = () => {
    return !status.isDYMO || !status.isFile || !status.isPrinter;
  };

  const getIcon = (type: LogType) => {
    switch (type) {
      case LogType.Failure:
        return <ErrorIcon color="error" />;
      case LogType.Error:
        return <WarningIcon color="warning" />;
      case LogType.Info:
        return <InfoIcon color="info" />;
      default:
        return <CheckCircleIcon color="success" />;
    }
  };

  return (
    <>
      {isBad() ? (
        <Box sx={{ backdropFilter: "blur(6px)", position: "absolute", zIndex: 20, top: 0, bottom: 0, left: 0, right: 0, display: "flex" }}>
            <Box sx={{ flexGrow: 1, overflowY: "scroll", overflowX: "hidden", p: 4 }}>
            {logs.map((l: ProgramLog, idx: number) => (
            <Accordion key={idx} sx={{ bgcolor: "transparent" }} elevation={0}>
            <AccordionSummary sx={{ bgcolor: "transparent", border: "0" }} expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
                {getIcon(l.type)}
              <Typography sx={{ ml: 2 }}>{l.name}</Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ bgcolor: "transparent",  ml: 5.7, py: 0.5 }}>
              <Typography>{l.message}</Typography>
            </AccordionDetails>
          </Accordion>
          ))}
            </Box>
         
        </Box>
      ) : null}
    </>
  );
};

export default Overlay;
