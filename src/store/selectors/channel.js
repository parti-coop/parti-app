import orm from '../models';
import { createSelector as ormCreateSelector } from 'redux-orm';

export const channelPostsForceSelector = (state, posts) => {
  if(!posts) {
    return [];
  }

  let session = orm.session(state.orm);
  const {Post, Channel} = session;

  return posts.map((post) => {
    const postModel = Post.withId(post.id);
    return Object.assign({
      key: postModel.id.toString(),
      channel: { ...Channel.withId(postModel.channelId).ref },
      user: { ...postModel.user.ref }
    }, postModel.ref);
  });
};
