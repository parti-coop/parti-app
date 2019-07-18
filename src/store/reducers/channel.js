import _ from 'lodash';
import {
  CHANNELS_LOAD_POSTS_SUCCEEDED, CHANNELS_CLEAR_ALL,
  CHANNELS_START_LOADING, CHANNELS_STOP_LOADING,
} from '../actionTypes';

const initialState = {
  responsePosts: {},
  noMoreData: {},
  isLoading: {}
};

const loadPostsSucceeded = (state, action) => {
  let responsePosts = state.responsePosts[action.channel.id];
  if (!responsePosts) {
    responsePosts = [];
  }

  responsePosts.push(...action.responsePosts);
  responsePosts = _.sortBy(responsePosts, [
    responsePost => Date.parse(responsePost.lastStrokedAt) * -1
  ]);
  responsePosts = _.sortedUniqBy(responsePosts, 'id');

  return {
    ...state,
    responsePosts: {
      ...state.channels,
      [action.channel.id]: responsePosts,
    },
    noMoreData: {
      ...state.noMoreData,
      [action.channel.id]: action.noMoreData,
    }
  };
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case CHANNELS_LOAD_POSTS_SUCCEEDED:
      return loadPostsSucceeded(state, action);
    case CHANNELS_START_LOADING:
      return {
        ...state,
        isLoading: {
          ...state.isLoading,
          [action.channel.id]: true,
        },
      };
    case CHANNELS_STOP_LOADING:
      return {
        ...state,
        isLoading: {
          ...state.isLoading,
          [action.channel.id]: false,
        },
      };
    case CHANNELS_CLEAR_ALL:
      return {
        ...state,
        responsePosts: {
          ...state.channels,
          [action.channel.id]: [],
        },
        noMoreData: {
          ...state.noMoreData,
          [action.channel.id]: false,
        },
        isLoading: {
          ...state.isLoading,
          [action.channel.id]: false,
        },
      };
    default:
      return state;
  }
};

export default reducer;
