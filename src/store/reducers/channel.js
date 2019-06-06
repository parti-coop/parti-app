import { CHANNELS_LOAD_POSTS_SUCCEEDED, CHANNELS_CLEAR_ALL } from "../actionTypes";

const initialState = {
  posts: [],
  currentChannel: null
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case CHANNELS_LOAD_POSTS_SUCCEEDED:
      posts = [];
      if(!!action.afterDateTime && state.currentChannel.id === action.channel.id) {
        for (index = 0; index < state.posts.length; index++) {
          if (state.posts[index]?.lastStroked?.at?.getTime() < action.afterDateTime.getTime()) {
            break;
          }
          posts.push(state.posts[index]);
        }
      }

      for(post of action.posts) {
        console.log("Refresh Posts");
        posts.push(post);
      }

      return {
        ...state,
        posts: posts,
        currentChannel: action.channel
      };
    case CHANNELS_CLEAR_ALL:
      return {
        ...initialState
      }
    default:
      return state;
  }
};

export default reducer;
