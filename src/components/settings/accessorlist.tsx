import { List, ListItem, ListItemText, Radio, RadioGroup, Checkbox } from "@mui/material";
import ReduxAccessor from "../../store/accessor";
import { parseFile } from "../../utils/tools";
import { useEffect, useState } from "react";
interface Props {
    searchkey: string,
    configkey: ConfigKey | null;
    selected: Config | null;
    handleUpdateAccessor: Function;
    setConfigkey: Function
}

const AccessorList = ({ searchkey, configkey, selected, handleUpdateAccessor, setConfigkey }: Props) => {
  const [accessors, setAccessors] = useState<string[]>([]);
  const { filepath } = ReduxAccessor();
  const handleChange = async  (e: any) => {
    await changeValue(e.target.value)
  }

  const changeValue = (value: any) => {
    if (!configkey) return;
    let _value = value;
    if (configkey.multiple) _value = handleStringList(value)
    //TODO: set configkey 
    //setCurrent(_value)
    let _configkey: ConfigKey = {
      ...configkey,
      value: _value
    }
    setConfigkey(_configkey)
    handleUpdateAccessor(_configkey)
  }

  const handleStringList  = (value: string) => {
    if (!configkey) return []
    if (!configkey.multiple) return [];
    let values = [ ...configkey.value ];
    let index = values.indexOf(value);
    if (index > -1) values.splice(index, 1); 
    if (index === -1) values.push(value);
    return values;
  } 

  const handledAccessors = () => {
    if (searchkey === "") return accessors.sort((a, b) => a.localeCompare(b));
    return accessors.filter((accessor: string) => accessor.toLowerCase().includes(searchkey));
  }

  const isChecked = (value: string) => {
    if (!configkey) return false;
    return configkey.value.includes(value)
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

  const getStringValue = (value: any) => {
    if (Array.isArray(value)) return "";
    return value;
  }

  return (
    <RadioGroup value={getStringValue(configkey?.value)} onChange={handleChange}>
      <List component="nav" sx={{ maxHeight: "10rem", overflowY: "scroll" }}>
        {handledAccessors().map((value: string, idx: number) => (
            <ListItem
            key={idx}
            onClick={() => changeValue(value)}
              sx={{
                height: "3.5rem",
              }}
              button
            >
              {configkey?.multiple ? <Checkbox checked={isChecked(value)} onClick={() => changeValue(value)} /> : <Radio value={value}  />}
              <ListItemText primary={value} />
            </ListItem>
          ))}
      </List>
    </RadioGroup>
  );
};

export default AccessorList;
