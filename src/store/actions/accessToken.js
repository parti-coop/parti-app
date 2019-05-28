import { ACCESS_TOKEN_SET_INFO_SUCCEEDED, ACCESS_TOKEN_CLEAR_ALL_SUCCEEDED } from "../actionTypes";

export const accessTokenSetInfoSucceeded = (token, expiryTimestamp) => {
  return {
    type: ACCESS_TOKEN_SET_INFO_SUCCEEDED,
    token: token,
    expiryTimestamp: expiryTimestamp
  };
};

export const accessTokenClearAllSucceeded = () => {
  return {
    type: ACCESS_TOKEN_CLEAR_ALL_SUCCEEDED
  };
};
