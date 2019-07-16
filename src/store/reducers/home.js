import { HOME_SELECT_GROUP, HOME_SELECT_CHANNEL } from '../actionTypes';

const initialState = {
  selectedGroup: null,
  selectedChannel: null,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case HOME_SELECT_GROUP:
      return {
        ...state,
        selectedGroup: action.group,
        selectedChannel: null,
      };
    case HOME_SELECT_CHANNEL:
      return {
        ...state,
        selectedGroup: action.group,
        selectedChannel: action.channel
      };
    default:
      return state;
  }
};

export default reducer;
