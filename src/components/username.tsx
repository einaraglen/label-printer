import React, { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import ReduxAccessor from "../store/accessor";
import InvokeHandler from "../utils/invoke";
import { IPC } from "../utils/enums";
import FirebaseHandler from "../utils/handlers/firebaseHandler";

interface Props {
  open: boolean;
}

const UsernameModal = ({ open }: Props) => {
    const [username, _setUsername] = useState("");
    const { setStatus, setUsername } = ReduxAccessor(); 
    const { invoke } = InvokeHandler();
    const { addUser } = FirebaseHandler();
    const regex = (key: string) => new RegExp(key, "g"); 

  const handleContinue = async () => {
    await invoke(IPC.SET_USERNAME, {
      args: username,
      next: (data: any) => {
        addUser(data.username)
        setUsername(data.username)
        setStatus({ key: "isUsername", value: true })
      },
    });
  };

  return (
    <Dialog open={open} >
      <DialogTitle sx={{ bgcolor: "hsl(215, 28%, 14%)" }}>Username</DialogTitle>
      <DialogContent sx={{ bgcolor: "hsl(215, 28%, 14%)", width: "19rem" }} >
        <DialogContentText>{`Keep track of your printing!`}</DialogContentText>
        <TextField autoFocus placeholder="Username" value={username} onChange={(e: any) => _setUsername(e.target.value.replace(regex(" "), ""))} margin="dense" fullWidth variant="standard" />
      </DialogContent>
      <DialogActions sx={{ bgcolor: "hsl(215, 28%, 14%)" }}>
        <Button onClick={handleContinue} disabled={username === ""} >
          Continue
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UsernameModal;
