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
  filepath: null,
  template: null,
  templates: [],
  config: null,
  configs: [],
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
  [actionTypes.ADD_CONFIG]: (state: ReduxState, action: AddConfigAction) => {
    state.configs.push(action.payload)
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
});

export default reducer;