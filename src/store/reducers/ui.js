import { UI_START_LOADING, UI_STOP_LOADING,
  UI_HOME_ACTIVE_DRAWER, UI_HOME_INACTIVE_DRAWER } from "../actionTypes";

const initialState = {
  isLoading: false,
  homeActiveDrawer: false,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case UI_START_LOADING:
      return {
        ...state,
        isLoading: true
      };
    case UI_STOP_LOADING:
      return {
        ...state,
        isLoading: false
      };
    case UI_HOME_ACTIVE_DRAWER:
      return {
        ...state,
        homeActiveDrawer: true
      };
    case UI_HOME_INACTIVE_DRAWER:
      return {
        ...state,
        homeActiveDrawer: false
      };
    default:
      return state;
  }
};

export default reducer;
