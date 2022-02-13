import * as actionTypes from "./actiontypes";
import { createReducer } from "@reduxjs/toolkit";
import { ProgramState } from "../utils/enums";

const initialState: ReduxState = {
  state: ProgramState.Loading,
  status: {
    isFile: false,
    isTemplate: false,
    isConfig: false,
    isDYMO: false,
    isPrinter: false
  },
  printer: null,
  filepath: null,
  template: null,
  update: null,
  templates: [],
  config: null,
  configs: [],
  adjustments: [
    {
      name: "Singles",
      value: false
    },
    {
      name: "Groups",
      value: false
    },
    {
      name: "Max length",
      value: true
    },
  ],
  logs: []
};

const reducer = createReducer(initialState, {
  [actionTypes.SET_STATE]: (state: ReduxState, action: SetStateAction) => {
    state.state = action.payload;
  },
  [actionTypes.LOG]: (state: ReduxState, action: LogAction) => {
    state.logs.push(action.payload);
  },
  [actionTypes.SET_STATUS]: (state: ReduxState, action: StatusAction) => {
    (state.status as any)[action.payload.key] = action.payload.value
  },
  [actionTypes.SET_FILEPATH]: (state: ReduxState, action: FilePathAction) => {
    state.filepath = action.payload;
  },
  [actionTypes.SET_CONFIG]: (state: ReduxState, action: ConfigAction) => {
    state.config = action.payload;
  },
  [actionTypes.SET_CONFIGS]: (state: ReduxState, action: SetConfigAction) => {
    state.configs = action.payload;
  },
  [actionTypes.UPDATE_CONFIG]: (state: ReduxState, action: UpdateConfigAction) => {
    handleUpdateConfig(state.configs, action.payload.name, action.payload.payload)
  },
  [actionTypes.UPDATE_CONFIGKEY]: (state: ReduxState, action: UpdateConfigKeyAction) => {
    handleUpdateConfigKey(state.configs, action.payload.name, action.payload.payload)
  },
  [actionTypes.ADD_CONFIG]: (state: ReduxState, action: AddConfigAction) => {
    state.configs.push(action.payload)
  },
  [actionTypes.REMOVE_CONFIG]: (state: ReduxState, action: RemoveConfigAction) => {
    state.configs = state.configs.filter((c: Config) => c.name !== action.payload.name)
  },
  [actionTypes.SET_TEMPLATES]: (state: ReduxState, action: SetTemplatesAction) => {
    state.templates = action.payload;
  },
  [actionTypes.SET_TEMPLATE]: (state: ReduxState, action: SetTemplateAction) => {
    state.template = action.payload;
  },
  [actionTypes.ADD_TEMPLATE]: (state: ReduxState, action: AddTemplateAction) => {
    state.templates.push({ filepath: action.payload })
  },
  [actionTypes.UPDATE_ADJUSTMENT]: (state: ReduxState, action: UpdateAdjustmentAction) => {
    handleUpdateAdjustment(state.adjustments, action.payload.name, action.payload.value)
  },
  [actionTypes.SET_PRINTER]: (state: ReduxState, action: SetPrinterAction) => {
    state.printer = action.payload;
  },
  [actionTypes.SET_UPDATE]: (state: ReduxState, action: SetUpdateAction) => {
    state.update = action.payload;
  },
});

const handleUpdateConfig= (configs: Config[], name: string, payload: Config) => {
  let configindex = configs.findIndex((entry: Config) => entry.name === name);
  if (configindex === -1) return;
  configs[configindex] = { ...payload };
}

const handleUpdateConfigKey = (configs: Config[], name: string, payload: any) => {
  let configindex = configs.findIndex((entry: Config) => entry.name === name);
  if (configindex === -1) return;
  let config = configs[configindex];
  let keyindex = config.keys.findIndex((key: ConfigKey) => key.name === payload.name);
  if (keyindex === -1) return;
  let keys = [ ...config.keys]
  keys[keyindex] = payload;
  configs[configindex] = { ...config, keys };
}

const handleUpdateAdjustment = (adjustments: Adjustment[], name: string, value: any) => {
  let adjustmentindex = adjustments.findIndex((adjustment: Adjustment) => adjustment.name === name);
  if (adjustmentindex === -1) return;
  adjustments[adjustmentindex] = { name, value }
}

export default reducer;