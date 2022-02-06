import * as actionTypes from "./actiontypes";

export const saveLocation = (payload: any) => {
  const action: IAction = {
    type: actionTypes.SET_LOCATIONS,
    payload,
  };
  return (dispatch: DispatchType) => {
    dispatch(action);
  };
};