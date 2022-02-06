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
  templates: [],
  config: [],
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
  [actionTypes.ADD_CONFIG]: (state: ReduxState, action: AddConfigAction) => {
    state.config.push(action.payload)
  },
  [actionTypes.ADD_TEMPLATE]: (state: ReduxState, action: AddTemplateAction) => {
    state.templates.push({ filepath: action.payload, selected: false })
  },
});

export default reducer;