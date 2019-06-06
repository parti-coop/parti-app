import queryString from 'query-string';
import moment from 'moment';

import API from './api';
import { channelLoadPostsResponded, channelLoadPostsSucceeded } from '../actions';
import { uiShowError } from './ui';
import { channelPostsForceSelector } from "../selectors/channel";

export const channelLoadMorePostsRequested = (channel) => {
  return async (dispatch, getState) => {
    try {
      let afterDateTime = null;

      let params = { channel_id: channel.id };
      if(channel.id === getState().channel.selectedChannel?.id) {
        const [lastPost] = getState().channel.posts.slice(-1);
        afterDateTime = lastPost?.lastStroked?.at
        if(!!afterDateTime) {
          params['before_date_time'] = moment(afterDateTime).format('YYYY-MM-DDTHH:mm:ssZ');
        }
      }

      const res = await API(dispatch, `/posts?${queryString.stringify(params)}`);
      if(!res || !res?.posts) {
        console.log("Error on channelLoadPosts");
        dispatch(uiShowError());
        return;
      }

      let selectedPosts = [];
      if(res.posts.length > 0) {
        await dispatch(channelLoadPostsResponded(res.posts));
        selectedPosts = channelPostsForceSelector(getState(), res.posts.map((post) => post.id));
      }
      dispatch(channelLoadPostsSucceeded(channel, selectedPosts, afterDateTime));
    } catch(err) {
      console.log(err);
      dispatch(uiShowError(err));
    }
  };
};
