import { List, ListItem, ListItemText, Radio, RadioGroup } from "@mui/material";
import ReduxAccessor from "../../store/accessor";
import { parseFile } from "../../utils/tools";
import { useEffect, useState } from "react";
import { AnyArray } from "immer/dist/internal";

interface Props {
    searchkey: string
}

const AccessorList = ({ searchkey }: Props) => {
  const [accessors, setAccessors] = useState<string[]>([]);
  const [value, setValue] = useState<string>("");
  const { filepath } = ReduxAccessor();

  const handleChange = (e: any) => {
    setValue(e.target.value);
  }

  const handledAccessors = () => {
    if (searchkey === "") return accessors.sort((a, b) => a.localeCompare(b));
    return accessors.filter((accessor: string) => accessor.toLowerCase().includes(searchkey));
  }

  useEffect(() => {
    const parse = async () => {
      if (!filepath) return;
      let data = await parseFile(filepath);
      if (!data) return;
      console.log(Object.keys(data[0]));
      setAccessors(Object.keys(data[0]));
    };
    parse();
  }, []);

  return (
    <RadioGroup value={value} onChange={handleChange}>
      <List component="nav" sx={{ maxHeight: "10rem", overflowY: "scroll" }}>
        {handledAccessors().map((accessor: string, idx: number) => (
            <ListItem
            key={idx}
            onClick={() => setValue(accessor)}
              sx={{
                height: "3.5rem",
              }}
              button
            >
              <Radio value={accessor} inputProps={{ "aria-label": "A" }} />
              <ListItemText primary={accessor} />
            </ListItem>
          ))}
      </List>
    </RadioGroup>
  );
};

export default AccessorList;
