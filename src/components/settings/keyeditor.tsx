import { Box, IconButton, Tooltip, TextField } from "@mui/material";
import ArrowBackIosRoundedIcon from "@mui/icons-material/ArrowBackIosRounded";
import AccessorList from "./accessorlist";
import { useState } from "react";

interface Props {
  configkey: ConfigKey | null;
  selected: Config | null;
  back: Function;
  handleUpdateAccessor: Function;
  objectkey: string;
}

const KeyEditor = ({ configkey, back, selected, handleUpdateAccessor, objectkey }: Props) => {
  const [searchkey, setSearchkey] = useState("");
  

  const handleChange = (e: any) => {
    setSearchkey(e.target.value);
  };

  return (
    <Box sx={{ postition: "relative" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", pl: 2, pt: 1 }}>
        <Box sx={{ width: "25%" }}>
          <Tooltip title="Back">
            <IconButton onClick={() => back(1)} size="large">
              <ArrowBackIosRoundedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
        <Box sx={{ width: "50%", textAlign: "center", display: "flex" }}>
          <TextField variant="standard" placeholder="Search" value={searchkey} onChange={handleChange} sx={{ my: "auto", mx: "auto" }} />
        </Box>
        <Box sx={{ width: "25%", display: "flex", justifyContent: "end" }}></Box>
      </Box>
      <AccessorList {...{ searchkey, configkey, selected, handleUpdateAccessor, objectkey }} />
    </Box>
  );
};

export default KeyEditor;
