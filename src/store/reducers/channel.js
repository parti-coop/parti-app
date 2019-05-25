import { CHANNELS_LOAD_POSTS_SUCCEEDED } from "../actionTypes";

const initialState = {
  posts: [],
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case CHANNELS_LOAD_POSTS_SUCCEEDED:
      return {
        ...state,
        posts: [
          ...state.posts,
          ...(action?.posts || [])
        ],
        error: null
      };
    default:
      return state;
  }
};

export default reducer;
