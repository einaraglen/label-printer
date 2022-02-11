import { IconButton, RadioGroup, Radio, List, ListItem, ListItemText } from "@mui/material";
import InvokeHandler from "../../utils/invoke";
import { IPC } from "../../utils/enums";
import ReduxAccessor from "../../store/accessor";
import DeleteIcon from "@mui/icons-material/Delete";
import { parseFilename } from "../../utils/tools";

const TemplatesList = () => {
  const { invoke } = InvokeHandler();
  const { setTemplates, setTemplate, templates, template } = ReduxAccessor();

  const handleDeleteTemplate = async (filepath: string) => {
    let _templates = templates.filter((template: Template) => template.filepath !== filepath);
    await handleDeleteTemplateEffect(filepath);
    await invoke(IPC.SET_TEMPLATES, {
      args: JSON.stringify(_templates),
      next: (data: any) => setTemplates(JSON.parse(data.templates)),
    });
  };

  const handleDeleteTemplateEffect = async (filepath: string) => {
    if (template !== filepath) return;
    await invoke(IPC.SET_TEMPLATE, {
      args: "",
      next: (data: any) => {
        setTemplate(data.template);
      },
    });
  };

  const handleChange = async (e: any) => {
    await handleSetTemplate(e.target.value);
  };

  const handleSetTemplate = async (filepath: string) => {
    await invoke(IPC.SET_TEMPLATE, {
      args: filepath,
      next: (data: any) => {
        setTemplate(data.template);
      },
    });
  };

  return (
    <RadioGroup value={template ?? ""} onChange={handleChange}>
      <List component="nav" sx={{ maxHeight: "13rem", overflowY: "scroll" }}>
        {templates.map((_template: Template, idx: number) => (
          <ListItem
            key={idx}
            onClick={() => handleSetTemplate(_template.filepath)}
            sx={{ height: "3.5rem" }}
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
  );
};

export default TemplatesList;
