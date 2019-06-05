import { UI_START_LOADING, UI_STOP_LOADING,
  UI_HOME_ACTIVE_DRAWER, UI_HOME_INACTIVE_DRAWER } from '../actionTypes';

export const uiStartLoading = () => {
    return {
        type: UI_START_LOADING
    };
};

export const uiStopLoading = () => {
    return {
        type: UI_STOP_LOADING
    };
};

export const uiHomeActiveDrawer = () => {
    return {
        type: UI_HOME_ACTIVE_DRAWER
    };
};

export const uiHomeInactiveDrawer = () => {
    return {
        type: UI_HOME_INACTIVE_DRAWER
    };
};
