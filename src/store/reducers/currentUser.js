import { CURRENT_USER_SET_INFO, CURRENT_USER_SET_GROUPS, CURRENT_USER_REMOVE } from "../actionTypes";

const initialState = {
  nickname: null,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case CURRENT_USER_SET_INFO:
      return {
        ...state,
        nickname: action.nickname
      };
    case CURRENT_USER_SET_GROUPS:
      return {
        ...state,
        groups: action.groups
      };
    case CURRENT_USER_REMOVE:
      return {
        ...initialState
      }
    default:
      return state;
  }
};

export default reducer;
