import { Checkbox, FormControlLabel } from "@mui/material";

interface Props {
    adjustment: Adjustment;
    updateAdjustment: Function;
}

const Boolean = ({ adjustment, updateAdjustment }: Props) => {
    const handleCheck = (e: any) => {
        updateAdjustment({
          name: e.target.name,
          value: e.target.checked,
        });
      };
    return (
        <FormControlLabel disabled={adjustment.name === "Groups"} control={<Checkbox onClick={handleCheck} name={adjustment.name} checked={adjustment.value} />} label={adjustment.name} />
    )
}

export default Boolean;