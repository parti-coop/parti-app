import { MESSAGES_SET_NEW_COUNTS, MESSAGES_REMOVE_NEW_COUNTS } from "../actions/actionTypes";

const initialState = {
  newMessagesCount: null,
  newMentionsCount: null
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case MESSAGES_SET_NEW_COUNTS:
      return {
        ...state,
        newMessagesCount: action.newMessagesCount,
        newMentionsCount: action.newMentionsCount
      };
    case MESSAGES_REMOVE_NEW_COUNTS:
      return {
        ...initialState
      };
    default:
      return state;
  }
};

export default reducer;
