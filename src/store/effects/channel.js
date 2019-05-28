import queryString from 'query-string';

import API from './api';
import { channelLoadPostsResponded, channelLoadPostsSucceeded } from '../actions';
import { uiShowError } from './ui';
import { channelPostsForceSelector } from "../selectors/channel";

export const channelLoadPostsRequested = () => {
  return async (dispatch, getState) => {
    try {
      const channel = getState().home.selectedChannel;

      let params = { channel_id: channel?.id };
      const lastPost = channel?.lastPost;
      if(lastPost) {
        params['last_post_id'] = lastPost.id;
      }

      const res = await API(dispatch, `/posts?${queryString.stringify(params)}`);
      if(!res || !res?.posts) {
        console.log("Error on channelLoadPosts");
        dispatch(uiShowError());
        return;
      }

      await dispatch(channelLoadPostsResponded(res?.posts));
      dispatch(channelLoadPostsCompleted(channel, res?.posts));
    } catch(err) {
      console.log(err);
      dispatch(uiShowError(err));
    }
  };
};

const channelLoadPostsCompleted = (channel, posts) => {
  return (dispatch, getState) => {
    const selectedPosts = channelPostsForceSelector(getState(), posts);
    dispatch(channelLoadPostsSucceeded(channel, selectedPosts));
  };
};
