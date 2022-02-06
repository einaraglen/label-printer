import ReduxAccessor from "../../store/accessor";

const ConfigHandler = () => {
    const { configs } = ReduxAccessor();

    const checkForExistingConfig = (name: string) => {
        let match = configs.find((entry: Config) => entry.name === name)
        if (!match) return;
    }

    return {}
}

export default ConfigHandler;