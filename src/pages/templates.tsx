import { Box, Tooltip, IconButton, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import TopBar from "../components/settings/topbar";
import TemplatesList from "../components/templates/templatelist";
import ReduxAccessor from "../store/accessor";
import { parseFilename, parseIFSPage } from "../utils/tools";
import ArrowBackIosRoundedIcon from "@mui/icons-material/ArrowBackIosRounded";
import { useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import InvokeHandler from "../utils/invoke";
import { IPC } from "../utils/enums";

const Templates = () => {
  const [IFS, setIFS] = useState<string | null>(null);
  const { filepath, setTemplates, templates } = ReduxAccessor();
  const navigate = useNavigate();
  const { invoke } = InvokeHandler();

  const exists = (filepath: string) => {
    let pathmatch = templates.find((template: Template) => template.filepath === filepath);
    let filematch = templates.find((template: Template) => parseFilename(template.filepath) === parseFilename(filepath));
    if (!pathmatch || !filematch) return false;
    return true;
  };

  const handleInputChange = async (e: any) => {
    if (!e.target.value) return;
    if (exists(e.target.files[0].path)) return;
    let _templates = [...templates, { filepath: e.target.files[0].path }];
    await invoke(IPC.SET_TEMPLATES, {
      args: JSON.stringify(_templates),
      next: (data: any) => setTemplates(JSON.parse(data.templates)),
    });
  };

  useEffect(() => {
    if (filepath) setIFS(parseIFSPage(filepath) ?? "No File Found");
  }, [filepath]);

  return (
    <Box sx={{ display: "flex", flexGrow: 1, flexDirection: "column", overflow: "hidden" }}>
      <Helmet>
        <title>{`LabelPrinter+ | ${IFS ?? "Loading ..."} | Templates`}</title>
      </Helmet>
      <TopBar>
        <Box sx={{ display: "flex", width: "75%" }}>
          <Tooltip title="Back">
            <IconButton size="large" onClick={() => navigate(-1)}>
              <ArrowBackIosRoundedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Typography gutterBottom sx={{ my: "auto", fontSize: 15, ml: 2 }}>
            Templates
          </Typography>
        </Box>
        <Box sx={{ width: "25%", display: "flex", justifyContent: "end" }}>
          <input id="file-button" style={{ display: "none" }} accept={".dymo"} type="file" name="upload_file" onChange={handleInputChange} />
          <label htmlFor="file-button">
            <Tooltip title="Add">
              <IconButton size="large" component="span">
                <AddIcon fontSize="medium" />
              </IconButton>
            </Tooltip>
          </label>
        </Box>
      </TopBar>
      <TemplatesList />
    </Box>
  );
};

export default Templates;
