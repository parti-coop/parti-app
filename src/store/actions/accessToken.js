import { ACCESS_TOKEN_SET_INFO_SUCCEEDED, ACCESS_TOKEN_CLEAR_ALL } from '../actionTypes';

export const accessTokenSetInfoSucceeded = (token, refreshToken, expiryTimestamp) => ({
  type: ACCESS_TOKEN_SET_INFO_SUCCEEDED,
  token,
  refreshToken,
  expiryTimestamp
});

export const accessTokenClearAll = () => ({
  type: ACCESS_TOKEN_CLEAR_ALL
});
