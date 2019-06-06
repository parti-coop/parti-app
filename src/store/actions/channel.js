import { CHANNELS_LOAD_POSTS_SUCCEEDED,
  CHANNELS_LOAD_POSTS_RESPONDED,
  CHANNELS_CLEAR_ALL } from "../actionTypes";

export const channelLoadPostsSucceeded = (channel, posts, afterDateTime) => {
  return {
    type: CHANNELS_LOAD_POSTS_SUCCEEDED,
    channel: channel,
    posts: posts,
    afterDateTime: afterDateTime,
  };
};

export const channelLoadPostsResponded = (posts) => {
  return {
    type: CHANNELS_LOAD_POSTS_RESPONDED,
    posts: posts,
  };
};

export const channelClearAll = () => {
  return {
    type: CHANNELS_CLEAR_ALL,
  };
}
