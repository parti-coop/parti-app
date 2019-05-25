import { AUTH_SET_TOKEN, AUTH_REMOVE_TOKEN } from "../actionTypes";

const initialState = {
  isAuthenticated: false,
  token: null,
  expiryTimestamp: null
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case AUTH_SET_TOKEN:
      return {
        ...state,
        isAuthenticated: !!action.token,
        token: action.token,
        expiryTimestamp: action.expiryDate
      };
    case AUTH_REMOVE_TOKEN:
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
