import React from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import SettingsRow from "./SettingsRow";
import { Context } from "context/State";
import { readFile, getConfigName } from "utils";

const { ipcRenderer } = window.require("electron");
const parser = window.require("fast-xml-parser");

const Settings = ({ collapseComplete }) => {
    const [options, setOptions] = React.useState([]);
    const [currentConfig, setCurrentConfig] = React.useState({});
    const [isLoading, setIsLoading] = React.useState(true);

    const state = React.useContext(Context);
    const stateRef = React.useRef(state);

    React.useEffect(() => {
        let isMounted = true;
        const getOptions = async () => {
            const rawData = await readFile(stateRef.current.value.currentPath);
            const data = parser.parse(rawData);
            let rows = data.Table.Row;
            let currentData = !rows.length ? [rows] : [...rows];

            //async guard
            if (!isMounted) return;
            //gets the options from the XML file
            setOptions(Object.keys(currentData[0]));
            setIsLoading(false);
        };

        let configName = getConfigName(stateRef.current.value.currentPath);
        let configNotFound = !stateRef.current.value.config[configName];
        let cleanConfig = {
            _Number: "",
            _Description: "",
            _Info: [],
            _Extra: [],
            _Quantity: "",
        };

        //async guard
        if (!isMounted) return;
        setCurrentConfig(
            configNotFound
                ? cleanConfig
                : stateRef.current.value.config[getConfigName(stateRef.current.value.currentPath)]
        );
        stateRef.current.method.setAllPicked(
            checkAllPicked(
                configNotFound
                    ? cleanConfig
                    : stateRef.current.value.config[getConfigName(stateRef.current.value.currentPath)]
            )
        );
        getOptions();
        return () => {
            isMounted = false;
        };
    }, []);

    const checkAllPicked = (newConfig) => {
        if (!newConfig) return false;
        let keys = Object.keys(newConfig);
        let result = true;
        for (let i = 0; i < keys.length; i++) {
            if (newConfig[keys[i]].length < 1) result = false;
        }
        return result;
    };

    const setNewConfig = (newConfig) => {
        state.method.setAllPicked(checkAllPicked(newConfig));
        setCurrentConfig(newConfig);
    };

    const saveCurrentConfing = async () => {
        let configName = getConfigName(state.value.currentPath);
        let newConfig = {
            ...state.value.config,
            [configName]: currentConfig,
        };
        state.method.setConfig(newConfig);
        await ipcRenderer.invoke("set-config", newConfig);
        state.method.setSettingsOpen(false);
    };

    return (
        <div className="settings">
            <List component="nav">
                <ListItem aria-controls="config-menu">
                    <ListItemText
                        primary={getConfigName(state.value.currentPath)}
                        secondary="Current Config"
                    />
                </ListItem>
            </List>

            <table>
                <tbody>
                    {state.value.usableProperties.map((property) => (
                        <SettingsRow
                            collapseComplete={collapseComplete}
                            key={property}
                            currentConfig={currentConfig}
                            property={property}
                            setProperty={setNewConfig}
                            options={options}
                        />
                    ))}
                </tbody>
            </table>
            <List component="nav">
                <ListItem
                    disabled={!state.value.allPicked}
                    style={{
                        height: "3.5rem",
                        textAlign: "center",
                    }}
                    button
                    aria-controls="config-menu"
                    onClick={saveCurrentConfing}
                >
                    <ListItemText primary="Save" />
                </ListItem>
            </List>
        </div>
    );
};

export default Settings;
