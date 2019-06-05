import { CHANNELS_LOAD_POSTS_SUCCEEDED } from "../actionTypes";

const initialState = {
  posts: [],
  selectedChannel: null
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case CHANNELS_LOAD_POSTS_SUCCEEDED:
      posts = [];
      if(!!action.afterDateTime && state.selectedChannel.id == action.channel.id) {
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
        selectedChannel: action.channel
      };
    default:
      return state;
  }
};

export default reducer;
