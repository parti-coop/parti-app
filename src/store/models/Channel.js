import { PropTypes } from 'React';
import { Model, fk, many, attr } from 'redux-orm';
import propTypesMixin from 'redux-orm-proptypes';

const ValidatingModel = propTypesMixin(Model);

class Channel extends ValidatingModel {
  static get fields() {
    return {
      id: attr(),
      title: attr(),
      slug: attr(),
      isMember: attr(),
      logoUrl: attr(),
      categoryId: attr(),
      groupId: attr(),
      posts: many('Post'),
    }
  }

  static get modelName() {
    return 'Channel';
  }

  static reducer(action, Post, session) {
  }
}

export default Channel;
