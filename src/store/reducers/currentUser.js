import { CURRENT_USER_LOAD_INFO_RESPONDED, CURRENT_USER_CLEAR_ALL } from "../actionTypes";

const initialState = {
  nickname: null,
  new_messages_count: null,
  new_mentions_count: null,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case CURRENT_USER_LOAD_INFO_RESPONDED:
      return {
        ...state,
        ...action.currentUser
      };
    case CURRENT_USER_CLEAR_ALL:
      return {
        ...initialState
      }
    default:
      return state;
  }
};

export default reducer;
