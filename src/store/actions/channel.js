import { CHANNELS_LOAD_POSTS_SUCCEEDED, CHANNELS_LOAD_POSTS_RESPONDED } from "../actionTypes";

export const channelLoadPostsSucceeded = (posts) => {
  return {
    type: CHANNELS_LOAD_POSTS_SUCCEEDED,
    posts: posts,
  };
};

export const channelLoadPostsResponded = (posts) => {
  return {
    type: CHANNELS_LOAD_POSTS_RESPONDED,
    posts: posts,
  };
};
