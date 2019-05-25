import { PropTypes } from 'React';
import { Model, fk, many, attr } from 'redux-orm';
import propTypesMixin from 'redux-orm-proptypes';

import { CHANNELS_LOAD_POSTS_RESPONDED } from '../actionTypes';

const ValidatingModel = propTypesMixin(Model);

class Post extends ValidatingModel {
  static get fields() {
    return {
      id: attr(),
      body: attr(),
      channelId: attr(),
      groupId: attr(),
      created_at: attr(),
      last_stroked_at: attr(),
      specific_desc_striped_tags: attr(),
      url: attr(),
    }
  }

  static get modelName() {
    return 'Post';
  }

  static parse(data) {
    return this.upsert(data);
  }

  static reducer(action, Post, session) {
    switch(action.type){
      case CHANNELS_LOAD_POSTS_RESPONDED:
        action.posts?.map((post) => {
          Post.parse(post);
        });
        break;
    }
  }
}

export default Post;
