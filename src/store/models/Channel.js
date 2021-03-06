import { Model, many, attr } from 'redux-orm';
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
      logoXsUrl: attr(),
      logoSmUrl: attr(),
      logoMdUrl: attr(),
      categoryId: attr(),
      groupId: attr(),
      isUnread: attr(),
      posts: many('Post'),
    };
  }

  static get modelName() {
    return 'Channel';
  }

  // static reducer(action, SessionSpecificChannel, session) {
  // }
}

export default Channel;
