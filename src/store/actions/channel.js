import {
  CHANNELS_LOAD_POSTS_SUCCEEDED,
  CHANNELS_LOAD_POSTS_RESPONDED,
  CHANNELS_CLEAR_ALL,
  CHANNELS_START_LOADING,
  CHANNELS_STOP_LOADING,
} from '../actionTypes';

export const channelLoadPostsSucceeded = (channel, responsePosts, noMoreData, afterDateTime) => {
  return {
    type: CHANNELS_LOAD_POSTS_SUCCEEDED,
    channel,
    responsePosts,
    noMoreData,
    afterDateTime,
  };
};

export const channelLoadPostsResponded = posts => ({
  type: CHANNELS_LOAD_POSTS_RESPONDED,
  posts,
});

export const channelStartLoading = channel => ({
  type: CHANNELS_START_LOADING,
  channel,
});

export const channelStopLoading = channel => ({
  type: CHANNELS_STOP_LOADING,
  channel,
});

export const channelClearAll = channel => ({
  type: CHANNELS_CLEAR_ALL,
  channel,
});