import Config from 'react-native-config'

import { goToAuth, goHome } from '../../screens/routes';
import { uiStartLoading, uiStopLoading } from "./ui";
import { authGetToken, authCreateToken, authClearStorage, authRemoveToken } from "./accessToken";
import { currentUserPrepare } from "./currentUser";
import { messagesRemoveNewCounts } from "./messages";
import { currentUserRemoveData } from "./currentUser";

export const authAutoSignIn = () => {
  return async (dispatch) => {
    const token = await dispatch(authGetToken());
    if(token) {
      goHome();
    } else {
      goToAuth();
    }
  };
};

export const authSignIn = (authData) => {
  return async (dispatch) => {
    dispatch(uiStartLoading());
    try {
      const accessToken = await dispatch(authCreateToken(authData));
      if (!accessToken) {
        alert("앗! 로그인이 안되네요. 잠시 후에 다시 시도해 주세요.");
        dispatch(uiStopLoading());
        return;
      }

      await dispatch(currentUserPrepare());

      goHome();
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
    await dispatch(authClearStorage());
    await dispatch(authRemoveToken());
    await dispatch(messagesRemoveNewCounts());
    await dispatch(currentUserRemoveData());
    goToAuth();
  };
};
