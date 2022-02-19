import { TextField, Box, Button } from "@mui/material";

interface Props {
  adjustment: Adjustment;
  updateAdjustment: Function;
}

const Text = ({ adjustment, updateAdjustment }: Props) => {
  const save = (e: any) => {
    e.preventDefault();
    updateAdjustment({
      name: adjustment.name,
      value: e.target.info.value,
    });
  };
  return (
    <form onSubmit={save}>
      <Box sx={{ display: "flex" }}>
        <TextField variant="standard" size="small" label={adjustment.name} name="info" defaultValue={adjustment.value} sx={{ my: "auto", mx: "auto" }} />
        <Button type="submit" sx={{ ml: 2 }}>
          Save
        </Button>
      </Box>
    </form>
  );
};

export default Text;
