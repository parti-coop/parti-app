import { Model, fk, attr } from 'redux-orm';
import propTypesMixin from 'redux-orm-proptypes';

import { CHANNELS_LOAD_POSTS_RESPONDED } from '../actionTypes';

const ValidatingModel = propTypesMixin(Model);

class Post extends ValidatingModel {
  static get fields() {
    return {
      id: attr(),
      body: attr(),
      specificDescStripedTags: attr(),
      channelId: attr(),
      groupId: attr(),
      createdAt: attr(),
      lastStroked: attr(),
      url: attr(),
      userId: fk({
        to: 'User',
        as: 'user',
        relatedName: 'posts',
      }),
      upvotesCount: attr(),
      commentsCount: attr(),
      isUpvotedByMe: attr(),
      isUpvotable: attr(),
    }
  }

  static get modelName() {
    return 'Post';
  }

  static parse(data) {
    return this.upsert({
      ...data,
      createdAt: Date.parse(data.createdAt),
      lastStroked: {
        ...data.lastStroked,
        at: Date.parse(data.lastStroked.at)
      }
    });
  }

  static reducer(action, SesstionSpecificPost) {
    switch (action.type) {
      case CHANNELS_LOAD_POSTS_RESPONDED:
        action.posts?.map((post) => {
          SesstionSpecificPost.parse(post);
        });
        break;
      default:
        break;
    }
  }
}

export default Post;
