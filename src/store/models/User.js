import { PropTypes } from 'React';
import { Model, fk, many, attr } from 'redux-orm';
import propTypesMixin from 'redux-orm-proptypes';

import { CHANNELS_LOAD_POSTS_RESPONDED } from '../actionTypes';

const ValidatingModel = propTypesMixin(Model);

class User extends ValidatingModel {
  static get fields() {
    return {
      id: attr(),
      nickname: attr(),
      email: attr(),
      imageUrl: attr(),
      profileUrl: attr()
    }
  }

  static get modelName() {
    return 'User';
  }

  static parse(data) {
    return this.upsert(data);
  }

  static reducer(action, User, session) {
    switch(action.type){
      case CHANNELS_LOAD_POSTS_RESPONDED:
        action.posts?.reduce((fetchingUsers, post) => {
          if(!post.user) { return }
          const exists = fetchingUsers.some((fetchingUser) => {
            fetchingUser.id === post.user?.id
          });
          if(exists) { return }

          fetchingUsers.push(post.user);
          return fetchingUsers;
        }, []).map((user) => {
          User.parse(user);
        });
        break;
    }
  }
}

export default User;
