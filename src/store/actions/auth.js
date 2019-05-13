import AsyncStorage from "@react-native-community/async-storage";
import Config from 'react-native-config'

import { AUTH_SET_TOKEN, AUTH_REMOVE_TOKEN } from "./actionTypes";

import { goToAuth, goHome } from '../../screens/routes';
import startApp from '../../../App';
import { uiStartLoading, uiStopLoading } from "./ui";

const STORAGE_KEY_REFRESH_TOKEN = "auth:refreshToken";
const STORAGE_KEY_TOKEN = "auth:token";
const STORAGE_KEY_EXPIRY_TIMESTAMP = "auth:expiryTimestamp";

export const authClearStorage = () => {
  return dispatch => {
    AsyncStorage.removeItem(STORAGE_KEY_TOKEN);
    AsyncStorage.removeItem(STORAGE_KEY_EXPIRY_TIMESTAMP);
    return AsyncStorage.removeItem(STORAGE_KEY_REFRESH_TOKEN);
  };
};

export const authRefreshToken = () => {
  return async (dispatch) => {
    try {
      let refreshToken = await AsyncStorage.getItem(STORAGE_KEY_REFRESH_TOKEN);
      if(!refreshToken) {
        console.log("RefreshToken Not Found");
        return null;
      }

      // TODO: parti.xyz 도메인을 설정할 수 있게 만들기
      const res = await fetch("https://parti.xyz/oauth/token",
        {
          method: "POST",
          body: JSON.stringify({
            refresh_token: refreshToken,
            client_id: Config.PARTI_KEY,
            client_secret: Config.PARTI_SECRET,
            grant_type: 'refresh_token'
          }),
          headers: {
            'Accept': 'application/json',
            "Content-Type": "application/json"
          }
        }
      );
      const parsedRes = await res.json();
      if (!parsedRes.id_token) {
        dispatch(authClearStorage());
        console.log("RefreshToken Response Failed: " + parsedRes);
        return null;
      }

      await dispatch(authStoreToken(
        parsedRes.access_token,
        parsedRes.expires_in,
        parsedRes.refresh_token
      ));
      return parsedRes.id_token;
    } catch(err) {
      console.log("Unknown Error: " + err);
      return null;
    }
  }
};

export const authGetToken = () => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const expiryTimestamp = getState().auth.expiryTimestamp;
    const now = new Date();

    if (token && new Date(expiryTimestamp) > now) {
      return token;
    }

    try {
      let tokenFromStorage = await AsyncStorage.getItem(STORAGE_KEY_TOKEN);
      if (!tokenFromStorage) {
        return await dispatch(authRefreshToken());
      }

      let expiryTimestampFromStorage = await AsyncStorage.getItem(STORAGE_KEY_EXPIRY_TIMESTAMP);
      const parsedExpiryDate = new Date(parseInt(expiryTimestampFromStorage));
      if (parsedExpiryDate > now) {
        dispatch(authSetToken(tokenFromStorage, parseInt(expiryTimestampFromStorage)));
        return tokenFromStorage;
      } else {
        return await dispatch(authRefreshToken());
      }
    } catch(err) {
      console.log("Unknown Error: " + err);
      return null;
    }
  }
};

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

export const authStoreToken = (token, expiresIn, refreshToken) => {
  return dispatch => {
    const now = new Date();
    const expiryTimestamp = now.getTime() + expiresIn * 1000;
    dispatch(authSetToken(token, expiryTimestamp));
    AsyncStorage.setItem(STORAGE_KEY_TOKEN, token);
    AsyncStorage.setItem(STORAGE_KEY_EXPIRY_TIMESTAMP, expiryTimestamp.toString());
    AsyncStorage.setItem(STORAGE_KEY_REFRESH_TOKEN, refreshToken);
  };
};

export const authSetToken = (token, expiryTimestamp) => {
  return {
    type: AUTH_SET_TOKEN,
    token: token,
    expiryTimestamp: expiryTimestamp
  };
};

export const tryToSignIn = (authData) => {
  return async (dispatch) => {
    dispatch(uiStartLoading());
    try {
      let res = await fetch("http://parti.test/oauth/token", {
        method: "POST",
        body: JSON.stringify({
          email: authData.email,
          password: authData.password,
          client_id: Config.PARTI_KEY,
          client_secret: Config.PARTI_SECRET,
          grant_type: 'password',
          provider: 'email',
        }),
        headers: {
          'Accept': 'application/json',
          "Content-Type": "application/json"
        }
      });
      parsedRes = await res.json();
      if (!parsedRes.access_token) {
        alert("앗! 로그인이 안되네요. 잠시 후에 다시 시도해 주세요.");
        dispatch(uiStopLoading());
        return;
      }

      await dispatch(authStoreToken(
        parsedRes.access_token,
        parsedRes.expires_in,
        parsedRes.refresh_token
      ));
      dispatch(uiStopLoading());
      goHome();
    } catch(err) {
      console.log(err);
      alert("앗! 로그인이 안되네요. 잠시 후에 다시 시도해 주세요.");
      dispatch(uiStopLoading());
    }
  };
};

export const authLogout = () => {
  return async (dispatch) => {
    await dispatch(authClearStorage());
    await dispatch(authRemoveToken());
    goToAuth();
  };
};

export const authRemoveToken = () => {
  return {
    type: AUTH_REMOVE_TOKEN
  };
};
