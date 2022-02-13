import React, { useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import ReduxAccessor from "../../store/accessor";
import packageJson from "../../../package.json";
import { IPC } from "../../utils/enums";
import InvokeHandler from "../../utils/invoke";

interface Props {
  open: boolean;
  setOpen: Function;
}

const UpdateModal = ({ open, setOpen }: Props) => {
  const { update } = ReduxAccessor();
  const { invoke } = InvokeHandler();

  const handleClose = () => {
    setOpen(false);
  };

  const getContentText = () => {
    if (update)
      return (
        <>
          A new version of <span style={{ fontWeight: 500, color: "#FFF" }}>LabelPriter+</span> was found!
        </>
      );
    return <>{`Your version is up to date!`}</>;
  };

  const getVersion = () => {
    const options: any = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
    if (update)
      return (
        <>
          <span style={{ fontWeight: 500, color: "#FFF" }}>{update.version}</span>
          {` - Published ${new Date(update.published).toLocaleDateString(undefined, options)}`}
        </>
      );
    return (
      <>
        <span style={{ fontWeight: 500, color: "#FFF" }}>{packageJson.version}</span>
        {` - Checked ${new Date().toLocaleDateString(undefined, options)}`}
      </>
    );
  };

  const handleDownload = async () => {
    if (!update) return;
    await invoke(IPC.OPEN_BROWSER, {
      args: update.download_url,
    });
  }

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle sx={{ bgcolor: "hsl(215, 28%, 14%)" }}>Update</DialogTitle>
      <DialogContent sx={{ bgcolor: "hsl(215, 28%, 14%)" }}>
        <DialogContentText>{getContentText()}</DialogContentText>
        <DialogContentText>{getVersion()}</DialogContentText>
      </DialogContent>
      <DialogActions sx={{ bgcolor: "hsl(215, 28%, 14%)" }}>
        <Button onClick={handleClose}>Close</Button>
        <Button disabled={!update} onClick={handleDownload}>Download</Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateModal;
