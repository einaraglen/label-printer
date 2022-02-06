import { useCallback } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { LogType, ProgramState } from "../utils/enums";
import { _log, _addConfig, _setConfig, _setFilePath, _setState, _setStatus } from "./actioncreators";

const ReduxAccessor = () => {
    const dispatch: Dispatch<any> = useDispatch();

    const push_log = useCallback((log: ProgramLog) => dispatch(_log(log)), [dispatch]);
    const setState = useCallback((state: ProgramState) => dispatch(_setState(state)), [dispatch]);
    const setStatus = useCallback((status: { key: string, value: boolean}) => dispatch(_setStatus(status)), [dispatch]);
    const setFilePath = useCallback((filePath: string) => dispatch(_setFilePath(filePath)), [dispatch]);
    const addConfig = useCallback((config: Config) => dispatch(_addConfig(config)), [dispatch]);
    const setConfig = useCallback((config: Config[]) => dispatch(_setConfig(config)), [dispatch]);


    const state: ProgramState = useSelector((state: ReduxState) => state.state, shallowEqual);
    const status: ProgramStatus = useSelector((state: ReduxState) => state.status, shallowEqual);
    const filepath: string | null = useSelector((state: ReduxState) => state.filepath, shallowEqual);
    const config: Config[] = useSelector((state: ReduxState) => state.config, shallowEqual);
    const logs: ProgramLog[] = useSelector((state: ReduxState) => state.logs, shallowEqual);

    const log = (type: LogType, message: string) => {
        let now = new Date();
        let entry: ProgramLog = {
            created: now.toISOString(),
            type,
            message
        }
        push_log(entry);
    }

    return { log, setState, setStatus, setFilePath, addConfig, setConfig, state, status, filepath, config, logs }
}

export default ReduxAccessor;