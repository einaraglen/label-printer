import { useEffect } from "react";
import ReduxAccessor from "../../store/accessor";
import { IPC } from "../enums";
import InvokeHandler from "../invoke";

const ConfigHandler = () => {
  const { configs, setStatus, addConfig, updateConfigKey } = ReduxAccessor();
  const { invoke } = InvokeHandler();

  const checkForExistingConfig = async (name: string): Promise<{ created: boolean, config: Config }> => {
    let match = configs.find((entry: Config) => entry.name === name);
    if (match) return { created: false, config: match };
    let config = await createNewConfig(name)
    return { created: true, config };
  };

  const updateAccessorOfKey = async (name: string, payload: any) => {
    updateConfigKey({ name, payload })
  };

  const resetConfig = (name: string) => {
    let _config = clean(name);
    for (let i = 0; i < _config.keys.length; i++) {
      updateAccessorOfKey(name, _config.keys[i])
    }
    return _config;
  }

  const createNewConfig = async (name: string) => {
    setStatus({ key: "isConfig", value: false });
    addConfig(clean(name))
    return clean(name);
  };

  //listen to the state change, and persist data
  useEffect(() => {
    if (configs.length === 0) return;
    const apply = async () => {
      await invoke(IPC.SET_CONFIGS, {
        args: JSON.stringify(configs),
      });
    }
    apply()
  }, [configs])

  const clean = (name: string): Config => ({
    name,
    keys: [
      {
        name:"Number",
        key: "_Number",
        multiple: false,
        value: "",
      },
      {
        name:"Description",
        key: "_Description",
        multiple: false,
        value: "",
      },
      {
        name:"Info",
        key: "_Info",
        multiple: false,
        value: "",
      },
      {
        name:"Quantity",
        key: "_Quantity",
        multiple: false,
        value: "",
      },
    ]
  });

  return { checkForExistingConfig, updateAccessorOfKey, resetConfig };
};

export default ConfigHandler;
