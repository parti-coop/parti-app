import { ACCESS_TOKEN_SET_INFO_SUCCEEDED, ACCESS_TOKEN_CLEAR_ALL } from "../actionTypes";

export const accessTokenSetInfoSucceeded = (token, refreshToken, expiryTimestamp) => {
  return {
    type: ACCESS_TOKEN_SET_INFO_SUCCEEDED,
    token: token,
    refreshToken: refreshToken,
    expiryTimestamp: expiryTimestamp
  };
};

export const accessTokenClearAll = () => {
  return {
    type: ACCESS_TOKEN_CLEAR_ALL
  };
};
