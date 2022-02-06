import ReduxAccessor from "../../store/accessor";
import { IPC } from "../enums";
import InvokeHandler from "../invoke";

const ConfigHandler = () => {
  const { configs, setConfigs } = ReduxAccessor();
  const { invoke } = InvokeHandler();

  const checkForExistingConfig = async (name: string): Promise<Config> => {
    let _configs: any = null
    await invoke(IPC.GET_CONFIGS, {
      next: async (data: any) => {
        _configs = [...JSON.parse(data.configs)];
      },
    });
    while(!_configs) {} // LINE BLOCKER LMAO
    let match = _configs.find((entry: Config) => entry.name === name);
    if (!match) return await createNewConfig(name);
    return match;
  };

  const updateAccessorOfKey = async (name: string, payload: any) => {
    await invoke(IPC.GET_CONFIGS, {
      next: async (data: any) => {
        let _configs = [...JSON.parse(data.configs)];
        let index = _configs.findIndex((entry: Config) => entry.name === name);
        if (index === -1) return;
        let config = _configs[index];
        config = { ...config, ...payload };
        _configs[index] = config;
        await invoke(IPC.SET_CONFIGS, {
          args: JSON.stringify(_configs),
          next: (data: any) => setConfigs(_configs),
        });
      },
    });
  };

  const createNewConfig = async (name: string) => {
    console.log("CREATE NEW CONFIOG")
    let config: Config = {
      name,
      number: {
        key: "_number",
        accessor: "",
      },
      description: {
        key: "_description",
        accessor: "",
      },
      info: {
        key: "_info",
        accessor: "",
      },
      quantity: {
        key: "_quantity",
        accessor: "",
      },
    };
    await invoke(IPC.GET_CONFIGS, {
      next: async (data: any) => {
        let _configs = [...JSON.parse(data.configs), config];
        await invoke(IPC.SET_CONFIGS, {
          args: JSON.stringify(_configs),
          next: (data: any) => setConfigs(_configs),
        });
      },
    });

    return config;
  };

  return { checkForExistingConfig, updateAccessorOfKey };
};

export default ConfigHandler;
