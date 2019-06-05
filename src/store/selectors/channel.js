import orm from '../models';
import { createSelector as ormCreateSelector } from 'redux-orm';

export const channelPostsForceSelector = (state, postIds) => {
  if(!postIds || postIds.length <= 0) {
    return [];
  }

  let session = orm.session(state.orm);
  const {Post, Channel} = session;

  return postIds.map((postId) => {
    const postModel = Post.withId(postId);
    return Object.assign({
      key: postModel.id.toString(),
      channel: { ...Channel.withId(postModel.channelId).ref },
      user: { ...postModel.user.ref }
    }, postModel.ref);
  });
};
