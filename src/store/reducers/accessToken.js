import { ACCESS_TOKEN_SET_INFO_SUCCEEDED, ACCESS_TOKEN_CLEAR_ALL_SUCCEEDED } from "../actionTypes";

const initialState = {
  isAuthenticated: false,
  token: null,
  expiryTimestamp: null
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case ACCESS_TOKEN_SET_INFO_SUCCEEDED:
      return {
        ...state,
        isAuthenticated: !!action.token,
        token: action.token,
        expiryTimestamp: action.expiryTimestamp
      };
    case ACCESS_TOKEN_CLEAR_ALL_SUCCEEDED:
      return {
        ...state,
        isAuthenticated: false,
        token: null,
        expiryTimestamp: null
      };
    default:
      return state;
  }
};

export default reducer;
