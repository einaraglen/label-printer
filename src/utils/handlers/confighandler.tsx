import { useEffect } from "react";
import ReduxAccessor from "../../store/accessor";
import { IPC } from "../enums";
import InvokeHandler from "../invoke";

const ConfigHandler = () => {
  const { configs, setStatus, addConfig, updateConfig } = ReduxAccessor();
  const { invoke } = InvokeHandler();

  const checkForExistingConfig = async (name: string): Promise<{ created: boolean, config: Config }> => {
    let match = configs.find((entry: Config) => entry.name === name);
    if (match) return { created: false, config: match };
    let config = await createNewConfig(name)
    return { created: true, config };
  };

  const updateAccessorOfKey = async (name: string, payload: any) => {
    updateConfig({ name, payload })
  };

  const createNewConfig = async (name: string) => {
    let config: Config = {
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
    };
    setStatus({ key: "isConfig", value: false });
    addConfig(config)
    return config;
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

  return { checkForExistingConfig, updateAccessorOfKey };
};

export default ConfigHandler;
