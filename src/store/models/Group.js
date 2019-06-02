import { PropTypes } from 'React';
import { Model, fk, many, attr } from 'redux-orm';
import propTypesMixin from 'redux-orm-proptypes';

import { HOME_LOAD_GROUPS_RESPONDED } from  '../actionTypes';

const ValidatingModel = propTypesMixin(Model);

class Group extends ValidatingModel {
  static get fields() {
    return {
      id: attr(),
      key: attr(),
      title: attr(),
      slug: attr(),
      logoUrl: attr(),
      isMember: attr(),
      categories: many('Category'),
      channels: many('Channel'),
    }
  }

  static get modelName() {
    return 'Group';
  }

  static parse(data) {
    const { Category, Channel } = this.session;
    let clonedData = {
      ...data,
      key: String(data.id),
      categories : data.categories.map(category => Category.upsert(category)),
      channels : data.channels.map(channel => Channel.upsert(channel))
    };

    return this.upsert(clonedData);
  }

  static reducer(action, Group, session) {
    switch(action.type){
      case HOME_LOAD_GROUPS_RESPONDED:
        action.groups?.map((group) => {
          Group.parse(group);
        });
        break;
    }
  }
}

export default Group;
