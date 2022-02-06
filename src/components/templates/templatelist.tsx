import { Box, IconButton, Tooltip, Typography, RadioGroup, Radio, List, ListItem, ListItemText } from "@mui/material";
import ArrowBackIosRoundedIcon from "@mui/icons-material/ArrowBackIosRounded";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import InvokeHandler from "../../utils/invoke";
import { IPC } from "../../utils/enums";
import ReduxAccessor from "../../store/accessor";
import DeleteIcon from '@mui/icons-material/Delete';
import { parseFilename } from "../../utils/tools";

const TemplatesList = () => {
  const navigate = useNavigate();
  const { invoke } = InvokeHandler();
  const { setTemplates, setTemplate, templates, template } = ReduxAccessor();

  const exists = (filepath: string) => {
    let pathmatch = templates.find((template: Template) => template.filepath === filepath)
    let filematch = templates.find((template: Template) => parseFilename(template.filepath) === parseFilename(filepath))
    if (!pathmatch || !filematch) return false;
    return true;
  }

  const handleInputChange = async (e: any) => {
    if (!e.target.value) return;
    if (exists(e.target.files[0].path)) return;
    let _templates = [ ...templates, { filepath: e.target.files[0].path } ];
    await invoke(IPC.SET_TEMPLATES, {
      args: JSON.stringify(_templates),
      next: (data: any) => setTemplates(JSON.parse(data.templates)),
    });
  };

  const handleDeleteTemplate = async (filepath: string) => {
    let _templates = templates.filter((template: Template) => template.filepath !== filepath)
    await handleDeleteTemplateEffect(filepath)
    await invoke(IPC.SET_TEMPLATES, {
      args: JSON.stringify(_templates),
      next: (data: any) => setTemplates(JSON.parse(data.templates)),
    });
  }

  const handleDeleteTemplateEffect = async (filepath: string) => {
    if (template !== filepath) return;
    await invoke(IPC.SET_TEMPLATE, {
      args: "",
      next: (data: any) => {
        setTemplate(data.template)
      },
    });
  }

  const handleChange = async (e: any) => {
    await handleSetTemplate(e.target.value)
  };

  const handleSetTemplate = async (filepath: string) => {
    await invoke(IPC.SET_TEMPLATE, {
      args: filepath,
      next: (data: any) => {
        setTemplate(data.template)
      },
    });
  }

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", px: 2, pt: 1 }}>
        <Box sx={{ width: "25%" }}>
          <Tooltip title="Back">
            <IconButton size="large" onClick={() => navigate(-1)}>
              <ArrowBackIosRoundedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
        <Box sx={{ width: "50%", textAlign: "center", display: "flex" }}>
          <Typography variant="h6" gutterBottom sx={{ my: "auto", mx: "auto" }}>
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
      </Box>
      <RadioGroup value={template ?? ""} onChange={handleChange}>
        <List component="nav" sx={{ maxHeight: "10rem", overflowY: "scroll" }}>
          {templates.map((_template: Template, idx: number) => (
            <ListItem
            key={idx}
              onClick={() => handleSetTemplate(_template.filepath)}
              sx={{
                height: "3.5rem",
              }}
              button
              secondaryAction={
                <IconButton onClick={() => handleDeleteTemplate(_template.filepath)} edge="end" aria-label="delete">
                  <DeleteIcon />
                </IconButton>
              }
            >
              <Radio value={_template.filepath} inputProps={{ "aria-label": "A" }} />
              <ListItemText primary={parseFilename(_template.filepath)} />
            </ListItem>
          ))}
        </List>
      </RadioGroup>
    </Box>
  );
};

export default TemplatesList;
