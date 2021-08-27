import React from "react";
import { TextField } from "@material-ui/core";
import { Context } from "context/State";
import { readFile, isConfigGood, buildResponse } from "utils";

const { ipcRenderer } = window.require("electron");

//purely for functioning as an anchor
const AlwaysScrollToBottom = () => {
    const elementRef = React.useRef();
    React.useEffect(() =>
        elementRef.current.scrollIntoView({ behavior: "smooth" })
    );
    return <div ref={elementRef} />;
};

const DevTools = () => {
    const [commandField, setCommandField] = React.useState("");

    const inputRef = React.createRef(null);

    const state = React.useContext(Context);

    const handleKeyDown = (event) => {
        if (event.code === "Enter") return handleCommand();
    };

    const checkInput = (keyword, value) => {
        if (!keyword) return buildResponse(false, `Keyword not found`);
        if (!state.method[keyword])
            return buildResponse(false, `Keyword "${keyword}" does not exist`);
        if (!value)
            return buildResponse(false, `Missing value: "${keyword} VALUE"`);
        return false;
    };

    const setCommand = (keyword, value) => {
        if (checkInput(keyword, value)) return checkInput(keyword, value);
        try {
            let currentValue = !isNaN(parseInt(value))
                ? parseInt(value)
                : value;
            state.method[keyword](currentValue);
            return buildResponse(true, `${keyword}(${value}) was set`);
        } catch (err) {
            if (!state.method[keyword])
                return buildResponse(false, `Cause: ${err.message}`);
        }
    };

    const resetCommand = (keyword, value) => {
        if (checkInput(keyword, value)) return checkInput(keyword, value);
        try {
            state.method[keyword](null);
            return buildResponse(true, `${keyword} was reset`);
        } catch (err) {
            if (!state.method[keyword])
                return buildResponse(false, `Cause: ${err.message}`);
        }
    };

    const handleCommand = () => {
        //grab keyword
        let command = commandField.split(" ")[0].toLocaleLowerCase();
        switch (command) {
            case "set":
                state.method.setOutput((o) => [
                    ...o,
                    setCommand(
                        commandField.split(" ")[1],
                        commandField.split(" ")[2]
                    ),
                ]);
                break;
            case "reset":
                state.method.setOutput((o) => [
                    ...o,
                    resetCommand(commandField.split(" ")[1], "blank"),
                ]);
                break;
            case "import":
                openFileExplorer();
                break;
            case "export":
                exportConfig()
                break;
            case "clear":
                state.method.setOutput([]);
                break;
            default:
                state.method.setOutput((o) => [
                    ...o,
                    buildResponse(false, `Command "${command}" not recognized`),
                ]);
                break;
        }

        //clean text field area
        setCommandField("");
    };

    const openFileExplorer = () => {
        inputRef.current.click();
    };

    const exportConfig = async () => {
        let result = await ipcRenderer.invoke(
            "export-config",
            JSON.stringify(state.value.config)
        );
        if (!result || result.path === undefined) return state.method.setOutput((o) => [
            ...o,
            buildResponse(false, "Could not export, try again"),
        ]);
        state.method.setOutput((o) => [
            ...o,
            buildResponse(true, "Config was exported!"),
        ]);
    };

    const handleInputChange = async (event) => {
        if (!event.target.value) return;
        let rawJSON = await readFile(event.target.files[0].path);
        let config = JSON.parse(rawJSON);
        if (!isConfigGood(config, state.value.usableProperties))
            return state.method.setOutput((o) => [
                ...o,
                buildResponse(false, "Bad config file"),
            ]);
        //TODO: check that it is valid config file, and set state.method.setConfig(**PATH**)
        state.method.setConfig(config);
        await ipcRenderer.invoke("set-config", config);
        state.method.setOutput((o) => [
            ...o,
            buildResponse(true, "Config was imported!"),
        ]);
    };

    return (
        <div className="dev-tools">
            <div className="history">
                {state.value.output.map((current) => current)}
                <AlwaysScrollToBottom />
            </div>
            <TextField
                autoFocus
                onKeyDown={handleKeyDown}
                value={commandField}
                onChange={(event) => setCommandField(event.target.value)}
                style={{ width: "100%" }}
            />
            <input
                ref={inputRef}
                id="file-button"
                style={{ display: "none" }}
                accept={[".json", ".JSON"]}
                type="file"
                name="config_file"
                onChange={handleInputChange}
            />
        </div>
    );
};

export default DevTools;
