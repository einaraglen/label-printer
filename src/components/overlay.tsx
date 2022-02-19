import { Box, Accordion, AccordionSummary, Typography, AccordionDetails, Button } from "@mui/material";
import React, { useEffect } from "react";
import ReduxAccessor from "../store/accessor";
import { LogType } from "../utils/enums";
import WarningIcon from "@mui/icons-material/Warning";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import InfoIcon from "@mui/icons-material/Info";
import ErrorIcon from "@mui/icons-material/Error";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

//purely for functioning as an anchor
const AlwaysScrollToBottom = () => {
  const elementRef: any = React.useRef();
  useEffect(() => {
    if (!elementRef.current) return;
    elementRef.current.scrollIntoView({ behavior: "smooth" });
  });
  return <div ref={elementRef} />;
};

interface Props {
  open: boolean;
  setOpen: Function;
}

const Overlay = ({ open, setOpen }: Props) => {
  const { status, logs } = ReduxAccessor();

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

  const getTime = (created: string) => {
    try {
      let date = new Date(created);
      return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
    } catch (err: any) {
      console.warn(err);
      return "No date Found";
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    setOpen(!status.isDYMO || !status.isFile || !status.isPrinter);
  }, [status]);

  const getLogBundles = (_logs: ProgramLog[]) => {
    let result: any = [];
    for (let i = 0; i < logs.length; i++) {
      let index = result.findIndex((_log: any) => _log.name === logs[i].name);
      if (index > -1) {
        let _log: any = result[index];
        result[index] = { ..._log, type: logs[i].type, created: logs[i].created, messages: [..._log.messages, { message: logs[i].message, created: logs[i].created }], count: _log.count + 1 };
      } else {
        result.push({
          ...logs[i],
          messages: [{ message: logs[i].message, created: logs[i].created }],
          count: 1,
        });
      }
    }
    return result;
  };

  const getMessages = (messages: any[]) => {
    return messages.map((m: any) => (
      <Box sx={{ display: "flex", justifyContent: "space-between", my: 1 }}>
        <Typography>{m.message}</Typography>
        <Typography>{getTime(m.created)}</Typography>
      </Box>
    ));
  };

  return (
    <>
      {open ? (
        <Box sx={{ backdropFilter: "blur(6px)", position: "absolute", zIndex: 20, top: 0, bottom: 0, left: 0, right: 0, display: "flex" }}>
          <Box sx={{ flexGrow: 1, overflowY: "scroll", overflowX: "hidden", px: 4, py: 2 }}>
            <Typography gutterBottom sx={{ my: "auto", fontSize: 15, ml: 5.3, mb: 2 }}>
              Diagnostics
            </Typography>
            {getLogBundles(logs).map((l: any, idx: number) => (
              <Accordion key={idx} sx={{ bgcolor: "transparent" }} elevation={0}>
                <AccordionSummary sx={{ bgcolor: "transparent", border: "0" }} expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
                  {getIcon(l.type)}
                  <Box sx={{ display: "flex", flexGrow: 1, justifyContent: "space-between" }}>
                    <Typography sx={{ ml: 2 }}>{l.name}</Typography>
                    <Box sx={{ display: "flex", width: "7rem", mr: 5, justifyContent: "space-between" }}>
                      <Typography sx={{ height: "20px", width: "20px", textAlign: "center", bgcolor: "hsla(215, 28%, 14%, 0.5)", borderRadius: "10px" }}>{l.count}</Typography>

                      <Typography sx={{ ml: 2 }}>{getTime(l.created)}</Typography>
                    </Box>
                  </Box>
                </AccordionSummary>
                <AccordionDetails sx={{ bgcolor: "rgba(26, 34, 46, 0.3)", ml: 5.7, p: 1, maxHeight: "7rem", overflowY: "scroll" }}>
                  {getMessages(l.messages)}
                  <AlwaysScrollToBottom />
                </AccordionDetails>
              </Accordion>
            ))}
            <AlwaysScrollToBottom />
            <Button sx={{ float: "right", mt: 2 }} onClick={handleClose}>
              Close
            </Button>
          </Box>
        </Box>
      ) : null}
    </>
  );
};

export default Overlay;
