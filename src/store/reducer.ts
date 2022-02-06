import * as actionTypes from "./actiontypes";
import { createReducer } from "@reduxjs/toolkit";

const initialState: any = {
  locations: [],
  notifications: []
};
const reducer = createReducer(initialState, {
  //Locations
  [actionTypes.SET_LOCATIONS]: (state, action) => {
    state.locations = action.payload;
  },
  /*[actionTypes.ADD_NOTIFICATION]: (state, action) => {
    addNotification(state.notifications, action.payload)
  },*/
});

export default reducer;