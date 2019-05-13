import { AUTH_SET_TOKEN, AUTH_REMOVE_TOKEN } from "../actions/actionTypes";

const initialState = {
  token: null,
  expiryTimestamp: null
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case AUTH_SET_TOKEN:
      return {
        ...state,
        token: action.token,
        expiryTimestamp: action.expiryDate
      };
    case AUTH_REMOVE_TOKEN:
      return {
        ...state,
        token: null,
        expiryTimestamp: null
      };
    default:
      return state;
  }
};

export default reducer;
