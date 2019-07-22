import Config from 'react-native-config';

import { accessTokenSetInfoSucceeded, accessTokenClearAll } from '../actions';

export const accessTokenCreateTokenRequested = (authData) => {
  let payload = {
    client_id: Config.PARTI_KEY,
    client_secret: Config.PARTI_SECRET,
    provider: authData.provider,
  };

  switch (authData.provider) {
    case 'email':
      payload = {
        ...payload,
        grant_type: 'password',
        email: authData.email,
        password: authData.password
      };
      break;
    case 'facebook':
      payload = {
        ...payload,
        grant_type: 'assertion',
        assertion: authData.assertion
      };
      break;
    default:
  }

  return async (dispatch) => {
    try {
      const res = await fetch(`${Config.PARTI_API_BASE_URL}/oauth/token`, {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }
      });
      const parsedRes = await res.json();
      if (!parsedRes.access_token) {
        return null;
      }

      await dispatch(accessTokenStoreInfoRequested(
        parsedRes.access_token,
        parsedRes.refresh_token,
        parsedRes.expires_in
      ));

      return parsedRes.access_token;
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn('accessTokenCreateTokenRequested', err);
      return null;
    }
  };
};

export const accessTokenRefreshTokenRequested = () => async (dispatch, getState) => {
  try {
    const { refreshToken } = getState().accessToken;
    if (!refreshToken) {
      // eslint-disable-next-line no-console
      console.warn('accessTokenRefreshTokenRequested: RefreshToken Not Found');
      return null;
    }

    const res = await fetch(`${Config.PARTI_API_BASE_URL}/oauth/token`,
      {
        method: 'POST',
        body: JSON.stringify({
          refresh_token: refreshToken,
          client_id: Config.PARTI_KEY,
          client_secret: Config.PARTI_SECRET,
          grant_type: 'refresh_token'
        }),
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }
      });

    const parsedRes = await res.json();
    if (!parsedRes.access_token) {
      dispatch(accessTokenClearAll());
      // eslint-disable-next-line no-console
      console.warn('RefreshToken Response Failed: ', parsedRes);
      return null;
    }

    await dispatch(accessTokenStoreInfoRequested(
      parsedRes.access_token,
      parsedRes.refresh_token,
      parsedRes.expires_in
    ));
    return parsedRes.access_token;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn('Unknown Error: ', err);
    return null;
  }
};

export const accessTokenGetInfoRequested = () => async (dispatch, getState) => {
  const { token } = getState().accessToken;
  const { expiryTimestamp } = getState().accessToken;
  const now = new Date();

  if (token && new Date(expiryTimestamp) > now) {
    return token;
  }

  try {
    return await dispatch(accessTokenRefreshTokenRequested());
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn('accessTokenGetInfoRequested', err);
    return null;
  }
};

export const accessTokenStoreInfoRequested = (token, refreshToken, expiresIn) => (dispatch) => {
  const now = new Date();
  const expiryTimestamp = now.getTime() + expiresIn * 1000;
  dispatch(accessTokenSetInfoSucceeded(token, refreshToken, expiryTimestamp));
};
