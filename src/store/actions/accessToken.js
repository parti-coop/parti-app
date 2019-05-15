import AsyncStorage from "@react-native-community/async-storage";
import Config from 'react-native-config'

import { AUTH_SET_TOKEN, AUTH_REMOVE_TOKEN } from "./actionTypes";

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

export const authCreateToken = (authData) => {
  let payload = {
    client_id: Config.PARTI_KEY,
    client_secret: Config.PARTI_SECRET,
    provider: authData.provider,
  }

  switch(authData.provider) {
    case 'email':
      payload = {
        ...payload,
        grant_type: 'password',
        email: authData.email,
        password: authData.password
      }
      break;
    case 'facebook':
      payload = {
        ...payload,
        grant_type: 'assertion',
        assertion: authData.assertion
      }
      break;
    default:
  }

  return async (dispatch) => {
    try {
      const res = await fetch(`${Config.PARTI_API_BASE_URL}/oauth/token`, {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
          'Accept': 'application/json',
          "Content-Type": "application/json"
        }
      });
      parsedRes = await res.json();
      if (!parsedRes.access_token) {
        return null;
      }

      await dispatch(authStoreToken(
        parsedRes.access_token,
        parsedRes.expires_in,
        parsedRes.refresh_token
      ));

      return parsedRes.access_token;
    } catch(err) {
      console.log(err);
      return null;
    }
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

      const res = await fetch(`${Config.PARTI_API_BASE_URL}/oauth/token`,
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

export const authRemoveToken = () => {
  return {
    type: AUTH_REMOVE_TOKEN
  };
};
