import queryString from 'query-string';

import API from './api';
import {
  channelLoadPostsResponded, channelLoadPostsSucceeded,
  channelStopLoading, channelStartLoading,
} from '../actions';
import { uiShowError } from './ui';

// eslint-disable-next-line import/prefer-default-export
export const channelLoadMorePostsRequested = channel => async (dispatch, getState) => {
  dispatch(channelStartLoading(channel));
  try {
    let afterDateTime = null;
    const params = { channel_id: channel.id };
    const [lastPost] = getState().channel.responsePosts[channel?.id]?.slice(-1) || [];
    afterDateTime = lastPost?.lastStrokedAt;
    if (afterDateTime) {
      params.last_stroked_at = Date.parse(afterDateTime) / 1000;
    }

    const res = await API(dispatch, `/posts?${queryString.stringify(params)}`);
    if (!res || !res?.posts) {
      // eslint-disable-next-line no-console
      console.warn('Error on channelLoadPosts');
      dispatch(uiShowError());
      return;
    }

    await dispatch(channelLoadPostsResponded(channel, res.posts, afterDateTime));
    const responsePosts = res.posts
      .map(post => ({ id: post.id, lastStrokedAt: post.lastStroked.at }));
    const noMoreData = res.isLastPage;
    dispatch(channelLoadPostsSucceeded(channel, responsePosts, noMoreData, afterDateTime));

  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn('channelLoadMorePostsRequested ERROR', err);
    dispatch(uiShowError(err));
  }
  dispatch(channelStopLoading(channel));
};
