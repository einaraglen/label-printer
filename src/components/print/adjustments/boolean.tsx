import { Checkbox, FormControlLabel } from "@mui/material";

interface Props {
  adjustment: Adjustment;
  updateAdjustment: Function;
}

const Boolean = ({ adjustment, updateAdjustment }: Props) => {
  const handleEffect = (e: any) => {
    if (e.target.name === "Singles") {
      updateAdjustment({
        name: "Bundle",
        value: false,
      });
    }
    if (e.target.name === "Bundle") {
      updateAdjustment({
        name: "Singles",
        value: false,
      });
    }
  };

  const handleCheck = (e: any) => {
    updateAdjustment({
      name: e.target.name,
      value: e.target.checked,
    });
    handleEffect(e);
  };
  return <FormControlLabel disabled={adjustment.name === "Groups"} control={<Checkbox onClick={handleCheck} name={adjustment.name} checked={adjustment.value} />} label={adjustment.name} />;
};

export default Boolean;
