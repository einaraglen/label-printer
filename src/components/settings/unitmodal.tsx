import React, { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

interface Props {
  open: boolean;
  setOpen: Function;
  configkey: ConfigKey;
  handleUpdateAccessor: Function;
  setConfigkey: Function;
}

const UnitModal = ({ open, setOpen, configkey, handleUpdateAccessor, setConfigkey }: Props) => {
  const [unit, setUnit] = useState(configkey.unit || "");

  const handleClose = () => {
    setOpen(false);
  };

  const handleSave = () => {
    let _configkey = { ...configkey, unit }
    setConfigkey(_configkey);
    handleUpdateAccessor(_configkey);
    setOpen(false);
  }

  return (
    <Dialog open={open} onClose={handleClose} >
      <DialogTitle sx={{ bgcolor: "hsl(215, 28%, 14%)" }}>Units</DialogTitle>
      <DialogContent sx={{ bgcolor: "hsl(215, 28%, 14%)" }}>
        <DialogContentText>{`This text will be displayed in the end of the label ${configkey.name}.`}</DialogContentText>
        <TextField defaultValue={configkey.unit || ""} onChange={(e: any) => setUnit(e.target.value)} autoFocus margin="dense" fullWidth variant="standard" />
      </DialogContent>
      <DialogActions sx={{ bgcolor: "hsl(215, 28%, 14%)" }}>
        <Button onClick={handleClose}>Cancel</Button>
        <Button disabled={configkey.unit === unit} onClick={handleSave}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UnitModal;
