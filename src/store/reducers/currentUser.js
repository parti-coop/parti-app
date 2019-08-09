import { CURRENT_USER_LOAD_INFO_RESPONDED } from '../actionTypes';

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
    default:
      return state;
  }
};

export default reducer;
