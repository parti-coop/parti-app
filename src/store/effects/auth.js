import Config from 'react-native-config'

import { goToAuthRoot, goToHomeRoot } from '../../screens/routes';
import { uiStartLoading, uiStopLoading } from "../actions/ui";
import { accessTokenGetInfoRequested, accessTokenCreateTokenRequested, accessTokenClearAllRequested, authRemoveToken } from "./accessToken";
import { currentUserLoadInfoRequested } from "./currentUser";
import { currentUserClearAll, accessTokenClearAll } from "../actions";

export const authAutoSignIn = () => {
  return async (dispatch) => {
    const token = await dispatch(accessTokenGetInfoRequested());
    if(token) {
      goToHomeRoot();
    } else {
      goToAuthRoot();
    }
  };
};

export const authSignIn = (authData) => {
  return async (dispatch) => {
    dispatch(uiStartLoading());
    try {
      const accessToken = await dispatch(accessTokenCreateTokenRequested(authData));
      if (!accessToken) {
        alert("앗! 로그인이 안되네요. 잠시 후에 다시 시도해 주세요.");
        dispatch(uiStopLoading());
        return;
      }

      await dispatch(currentUserLoadInfoRequested());
      await goToHomeRoot();
      dispatch(uiStopLoading());
    } catch(err) {
      console.log(err);
      alert("앗! 로그인이 안되네요. 잠시 후에 다시 시도해 주세요.");
      dispatch(uiStopLoading());
    }
  };
};

export const authSignOut = () => {
  return async (dispatch) => {
    await dispatch(accessTokenClearAllRequested());
    await dispatch(currentUserClearAll());
    goToAuthRoot();
  };
};