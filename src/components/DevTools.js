import React from "react";
import { TextField } from "@material-ui/core";
import { Context } from "context/State";

//purely for functioning as an anchor
const AlwaysScrollToBottom = () => {
    const elementRef = React.useRef();
    React.useEffect(() => elementRef.current.scrollIntoView({ behavior: "smooth" }));
    return <div ref={elementRef} />;
};

const DevTools = () => {
    const [commandField, setCommandField] = React.useState("");

    const state = React.useContext(Context);

    const handleKeyDown = (event) => {
        if (event.code === "Enter") return handleCommand();
    };

    const buildResponse = (valid, message) => {
        return <p>
            <span className={valid ? "good" : "bad"}>{valid ? "[Success] " : "[Error] "}</span>
            {message}
        </p>
    }

    const setCommand = (method, value) => {
        if (!method) return buildResponse(false, `Method keyword not found`);
        if (!state.method[method]) return buildResponse(false, `Method "${method}" does not exist`);
        if (!value) return buildResponse(false, `Missing value: "${method} VALUE"`);
        try {
            let currentValue = !isNaN(parseInt(value)) ? parseInt(value) : value;
            state.method[method](currentValue);
            return buildResponse(true, `${method}(${value}) was set`);
        } catch (err) {
            if (!state.method[method]) return buildResponse(false, `Cause: ${err.message}`);
        }
    }

    const handleCommand = () => {
        //grab keyword
        let command = commandField.split(" ")[0].toLocaleLowerCase();
        switch (command) {
            case "set":
                state.method.setOutput(o => [
                    ...o,
                    setCommand(commandField.split(" ")[1], commandField.split(" ")[2])
                ])
                break;
            case "clear":
                state.method.setOutput([]);
                break;
            default:
                state.method.setOutput(o => [
                    ...o,
                    buildResponse(false, `Command "${command}" not recognized`)
                ])
                break;
        }

        //clean text field area
        setCommandField("");
    };

    return (
        <div className="dev-tools">
            <div className="history" >
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
        </div>
    );
};

export default DevTools;
