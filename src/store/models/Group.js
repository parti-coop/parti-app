import { PropTypes } from 'React';
import { Model, fk, many, attr } from 'redux-orm';
import propTypesMixin from 'redux-orm-proptypes';

import { GROUPS_SET_GROUPS } from  '../actions/actionTypes';

const ValidatingModel = propTypesMixin(Model);

class Group extends ValidatingModel {
  static get fields() {
    return {
      id: attr(),
      title: attr(),
      slug: attr(),
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
      categories : data.categories.map(category => Category.upsert(category)),
      channels : data.channels.map(channel => Channel.upsert(channel))
    };

    return this.upsert(clonedData);
  }

  static reducer(action, Group, session) {
    switch(action.type){
      case GROUPS_SET_GROUPS:
        action.groups.map((group) => {
          Group.parse(group);
        });
        break;
    }
  }
}

export default Group;
