import { Box, IconButton, Typography, Tooltip } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

interface Props {
  adjustment: Adjustment;
  updateAdjustment: Function;
}

const Number = ({ adjustment, updateAdjustment }: Props) => {
  const count = (_count: any) => {
      if (adjustment.value === 1 && _count === -1) return;
    updateAdjustment({
      name: adjustment.name,
      value: adjustment.value + _count,
    });
  };
  return (
      <Box sx={{ display: "flex", justifyContent: "space-between"}}>
          <IconButton onClick={() => count(-1)}  size="large" sx={{ my: "auto" }}>
            <RemoveIcon fontSize="medium" />
          </IconButton>
          <Tooltip title={`Prints ${adjustment.value} labels for each`}>
          <Typography gutterBottom sx={{ fontSize: 14, fontWeight: 700, mx: "auto", my: "auto" }}>
          {adjustment.value}
        </Typography>
        </Tooltip>
       
          <IconButton onClick={() => count(+1)} size="large" sx={{ my: "auto" }}>
            <AddIcon fontSize="medium" />
          </IconButton>
      </Box>
  )
  //return <TextField value={adjustment.value} name={adjustment.name} onChange={handleChange} label={adjustment.name} variant="standard" type="number" InputLabelProps={{ shrink: true }} />;
};

export default Number;
