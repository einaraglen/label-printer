import { useCallback } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { LogType, ProgramState } from "../utils/enums";
import {
  _log,
  _addConfig,
  _setConfig,
  _setConfigs,
  _setFilePath,
  _setState,
  _setStatus,
  _addTemplate,
  _setTemplates,
  _setTemplate,
  _updateConfigKey,
  _updateAdjustment,
  _setPrinter,
  _updateConfig,
  _removeConfig,
  _setUpdate,
} from "./actioncreators";

const ReduxAccessor = () => {
  const dispatch: Dispatch<any> = useDispatch();

  const push_log = useCallback((log: ProgramLog) => dispatch(_log(log)), [dispatch]);
  const setState = useCallback((state: ProgramState) => dispatch(_setState(state)), [dispatch]);
  const setStatus = useCallback((status: { key: string; value: boolean }) => dispatch(_setStatus(status)), [dispatch]);
  const setFilePath = useCallback((filePath: string) => dispatch(_setFilePath(filePath)), [dispatch]);
  const addConfig = useCallback((config: Config) => dispatch(_addConfig(config)), [dispatch]);
  const removeConfig = useCallback((config: Config) => dispatch(_removeConfig(config)), [dispatch]);
  const updateConfigKey = useCallback(({ name, payload }: { name: string; payload: any }) => dispatch(_updateConfigKey({ name, payload })), [dispatch]);
  const updateConfig = useCallback(({ name, payload }: { name: string; payload: Config }) => dispatch(_updateConfig({ name, payload })), [dispatch]);
  const setConfig = useCallback((config: string) => dispatch(_setConfig(config)), [dispatch]);
  const setConfigs = useCallback((config: Config[]) => dispatch(_setConfigs(config)), [dispatch]);
  const addTemplate = useCallback((template: string) => dispatch(_addTemplate(template)), [dispatch]);
  const setTemplates = useCallback((templates: Template[]) => dispatch(_setTemplates(templates)), [dispatch]);
  const setTemplate = useCallback((_template: Template) => dispatch(_setTemplate(_template)), [dispatch]);
  const updateAdjustment = useCallback((adjustment: { name: string, value: any }) => dispatch(_updateAdjustment(adjustment)), [dispatch]);
  const setPrinter = useCallback((_printer: string) => dispatch(_setPrinter(_printer)), [dispatch]);
  const setUpdate = useCallback((_update: Update) => dispatch(_setUpdate(_update)), [dispatch]);

  const state: ProgramState = useSelector((state: ReduxState) => state.state, shallowEqual);
  const status: ProgramStatus = useSelector((state: ReduxState) => state.status, shallowEqual);
  const filepath: string | null = useSelector((state: ReduxState) => state.filepath, shallowEqual);
  const configs: Config[] = useSelector((state: ReduxState) => state.configs, shallowEqual);
  const config: string | null = useSelector((state: ReduxState) => state.config, shallowEqual);
  const logs: ProgramLog[] = useSelector((state: ReduxState) => state.logs, shallowEqual);
  const templates: Template[] = useSelector((state: ReduxState) => state.templates, shallowEqual);
  const template: string | null = useSelector((state: ReduxState) => state.template, shallowEqual);
  const adjustments: Adjustment[] = useSelector((state: ReduxState) => state.adjustments, shallowEqual);
  const printer: string | null = useSelector((state: ReduxState) => state.printer, shallowEqual);
  const update: Update | null = useSelector((state: ReduxState) => state.update, shallowEqual);

  const log = (type: LogType, name: string, message: string) => {
    let now = new Date();
    let entry: ProgramLog = {
      created: now.toISOString(),
      name,
      type,
      message,
    };
    push_log(entry);
  };

  return {
    log,
    setState,
    setStatus,
    setFilePath,
    addConfig,
    updateConfigKey,
    updateConfig,
    setConfig,
    setConfigs,
    addTemplate,
    setTemplates,
    setTemplate,
    updateAdjustment,
    setPrinter,
    removeConfig,
    setUpdate,
    state,
    status,
    filepath,
    config,
    configs,
    logs,
    templates,
    template,
    adjustments,
    printer,
    update,
  };
};

export default ReduxAccessor;
