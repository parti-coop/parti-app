import { CURRENT_USER_SET_DATA, CURRENT_USER_REMOVE_DATA } from "../actions/actionTypes";

const initialState = {
  nickname: "회원"
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case CURRENT_USER_SET_DATA:
      return {
        ...state,
        nickname: action.nickname
      };
    case CURRENT_USER_REMOVE_DATA:
      return {
        ...initialState
      }
    default:
      return state;
  }
};

export default reducer;
