import { List, ListItem, ListItemText, Radio, RadioGroup } from "@mui/material";
import ReduxAccessor from "../../store/accessor";
import { parseFile } from "../../utils/tools";
import { useEffect, useState } from "react";
interface Props {
    searchkey: string,
    objectkey: string;
    configkey: ConfigKey | null;
    selected: Config | null;
    handleUpdateAccessor: Function;
}

const AccessorList = ({ searchkey, objectkey, configkey, selected, handleUpdateAccessor }: Props) => {
  const [accessors, setAccessors] = useState<string[]>([]);
  const { filepath } = ReduxAccessor();
  const [current, setCurrent] = useState<string>(configkey?.accessor ?? "");

  const handleChange = async  (e: any) => {
    await changeAccessor(e.target.value)
  }

  const changeAccessor = async (accessor: string) => {
    //TODO: payload has to be { [object key]: {...} } for spread to work
    setCurrent(accessor)
    let key: any = {
      ...configkey,
      accessor
    }
    await handleUpdateAccessor({ 
      [objectkey]: { ...key  }
    })
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
      setAccessors(Object.keys(data[0]));
    };
    parse();
  }, []);

  return (
    <RadioGroup value={current} onChange={handleChange}>
      <List component="nav" sx={{ maxHeight: "10rem", overflowY: "scroll" }}>
        {handledAccessors().map((accessor: string, idx: number) => (
            <ListItem
            key={idx}
            onClick={async () => await changeAccessor(accessor)}
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
