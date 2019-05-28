import { CHANNELS_LOAD_POSTS_SUCCEEDED,
  HOME_SELECT_GROUP, HOME_SELECT_CHANNEL } from "../actionTypes";

const initialState = {
  posts: [],
  channel: null
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case CHANNELS_LOAD_POSTS_SUCCEEDED:
      return {
        ...state,
        posts: [
          ...state.posts,
          ...(action.posts || [])
        ],
        channel: action.channel
      };
    case HOME_SELECT_GROUP:
      return {
        ...initialState,
      };
    case HOME_SELECT_CHANNEL:
      if(state.channel === action.channel) {
        return state;
      }

      return {
        ...initialState,
      };
    default:
      return state;
  }
};

export default reducer;
