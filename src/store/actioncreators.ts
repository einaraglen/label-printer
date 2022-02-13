import * as actionTypes from "./actiontypes";

export const _setState = (payload: any) => {
  const action: SetStateAction = {
    type: actionTypes.SET_STATE,
    payload,
  };
  return (dispatch: DispatchType) => {
    dispatch(action);
  };
};

export const _log = (payload: any) => {
  const action: LogAction = {
    type: actionTypes.LOG,
    payload,
  };
  return (dispatch: DispatchType) => {
    dispatch(action);
  };
};

export const _setStatus = (payload: any) => {
  const action: StatusAction = {
    type: actionTypes.SET_STATUS,
    payload,
  };
  return (dispatch: DispatchType) => {
    dispatch(action);
  };
};

export const _setFilePath = (payload: any) => {
  const action: FilePathAction = {
    type: actionTypes.SET_FILEPATH,
    payload,
  };
  return (dispatch: DispatchType) => {
    dispatch(action);
  };
};

export const _setConfig = (payload: any) => {
  const action: ConfigAction = {
    type: actionTypes.SET_CONFIG,
    payload,
  };
  return (dispatch: DispatchType) => {
    dispatch(action);
  };
};

export const _setConfigs = (payload: any) => {
  const action: SetConfigAction = {
    type: actionTypes.SET_CONFIGS,
    payload,
  };
  return (dispatch: DispatchType) => {
    dispatch(action);
  };
};

export const _addConfig = (payload: any) => {
  const action: AddConfigAction = {
    type: actionTypes.ADD_CONFIG,
    payload,
  };
  return (dispatch: DispatchType) => {
    dispatch(action);
  };
};

export const _removeConfig = (payload: any) => {
  const action: RemoveConfigAction = {
    type: actionTypes.REMOVE_CONFIG,
    payload,
  };
  return (dispatch: DispatchType) => {
    dispatch(action);
  };
};

export const _updateConfig = (payload: any) => {
  const action: UpdateConfigAction = {
    type: actionTypes.UPDATE_CONFIG,
    payload,
  };
  return (dispatch: DispatchType) => {
    dispatch(action);
  };
};

export const _updateConfigKey = (payload: any) => {
  const action: UpdateConfigKeyAction = {
    type: actionTypes.UPDATE_CONFIGKEY,
    payload,
  };
  return (dispatch: DispatchType) => {
    dispatch(action);
  };
};

export const _addTemplate = (payload: any) => {
  const action: AddTemplateAction = {
    type: actionTypes.ADD_TEMPLATE,
    payload,
  };
  return (dispatch: DispatchType) => {
    dispatch(action);
  };
};

export const _setTemplates = (payload: any) => {
  const action: SetTemplatesAction = {
    type: actionTypes.SET_TEMPLATES,
    payload,
  };
  return (dispatch: DispatchType) => {
    dispatch(action);
  };
};

export const _setTemplate = (payload: any) => {
  const action: SetTemplateAction = {
    type: actionTypes.SET_TEMPLATE,
    payload,
  };
  return (dispatch: DispatchType) => {
    dispatch(action);
  };
};

export const _updateAdjustment = (payload: any) => {
  const action: UpdateAdjustmentAction = {
    type: actionTypes.UPDATE_ADJUSTMENT,
    payload,
  };
  return (dispatch: DispatchType) => {
    dispatch(action);
  };
};

export const _setPrinter = (payload: any) => {
  const action: SetPrinterAction = {
    type: actionTypes.SET_PRINTER,
    payload,
  };
  return (dispatch: DispatchType) => {
    dispatch(action);
  };
};
