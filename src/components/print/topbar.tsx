import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Container from "@mui/material/Container";
import SettingsIcon from "@mui/icons-material/Settings";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import { useNavigate } from "react-router-dom";
import { Tooltip, Select, MenuItem, FormControl, Badge, Typography, Box } from "@mui/material";
import ReduxAccessor from "../../store/accessor";
import { useState, useEffect } from "react";
import InvokeHandler from "../../utils/invoke";
import { IPC } from "../../utils/enums";

const TopBar = () => {
  const [printers, setPrinters] = useState<DYMOPrinter[]>([]);
  const { status, setStatus, printer, setPrinter } = ReduxAccessor();
  const navigate = useNavigate();
  const { invoke } = InvokeHandler();

  useEffect(() => {
    const printers = async () => {
      await invoke(IPC.GET_PRINTERS, {
        next: (data: { printers: DYMOPrinter[] }) => {
          setPrinters(data.printers);
          if (!printer && data.printers.length > 0) setPrinter(data.printers[0].LabelWriterPrinter.Name);
          setStatus({ key: "isPrinter", value: true });
        },
      });
    };
    printers();
  }, []);

  return (
    <AppBar position="sticky" color="transparent" sx={{ backdropFilter: "blur(5px)", zIndex: 10, borderBottomColor: "hsl(215, 28%, 14%)" }} elevation={4}>
      <Container>
        <Toolbar disableGutters sx={{ display: "flex", justifyContent: "space-between" }}>
          <Tooltip placement="right" title="Templates">
            <IconButton onClick={() => navigate("/templates")} size="large">
              <Badge color="secondary" variant="dot" invisible={status.isTemplate}>
                <FolderOpenIcon />
              </Badge>
            </IconButton>
          </Tooltip>
          <Box sx={{ display: "flex", justifyItems: "center" }}>
            {true ? null : (
              <Typography gutterBottom sx={{ my: "auto", fontSize: 14 }}>
                Printer
              </Typography>
            )}
            <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
              <Select value={printer || ""} size="small" onChange={(e: any) => setPrinter(e.target.value)}>
                {printers.length === 0 ? <MenuItem value="">No Printers found</MenuItem> : null}
                {printers.map((printer: DYMOPrinter, idx: number) => (
                  <MenuItem key={idx} value={printer.LabelWriterPrinter.Name}>{printer.LabelWriterPrinter.Name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <Tooltip placement="left" title="Settings">
            <IconButton onClick={() => navigate("/settings")} size="large">
              <Badge color="secondary" variant="dot" invisible={status.isConfig}>
                <SettingsIcon />
              </Badge>
            </IconButton>
          </Tooltip>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default TopBar;
