import { createSelector as ormCreateSelector } from 'redux-orm';
import createCachedSelector from 're-reselect';
import orm from '../models';

const toView = (postId, session) => {
  const postModel = session.Post.withId(postId);
  if (!postModel.id) {
    // eslint-disable-next-line no-console
    console.warn('postId null', postModel.id);
    return null;
  }
  return Object.assign({
    key: postModel.id.toString(),
    channel: { ...session.Channel.withId(postModel.channelId).ref },
    user: { ...postModel.user.ref }
  }, postModel.ref);
};

// eslint-disable-next-line import/prefer-default-export
export const channelPostsSelector = createCachedSelector(
  state => state.orm,
  (state, currentChannel) => {
    if (!state.channel.responsePosts) {
      return null;
    }
    return state.channel.responsePosts[currentChannel?.id];
  },
  (session, responsePosts) => {
    if (!responsePosts || responsePosts.length <= 0) {
      return [];
    }

    return responsePosts.map(responsePost => toView(responsePost.id, session)).filter(obj => obj);
  }
)(
  (state, currentChannel) => currentChannel?.id || '',
  { selectorCreator: (...args) => ormCreateSelector(orm, ...args) }
);
