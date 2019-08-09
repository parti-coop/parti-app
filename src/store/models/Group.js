import { Model, many, attr } from 'redux-orm';
import propTypesMixin from 'redux-orm-proptypes';

import { HOME_LOAD_GROUPS_RESPONDED } from '../actionTypes';

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
    };
  }

  static get modelName() {
    return 'Group';
  }

  static parse(actionGroup) {
    const { Category, Channel } = this.session;
    const SessionSpecificGroup = this.session.Group;
    const clonedData = {
      ...actionGroup,
      key: String(actionGroup.id),
      categories: actionGroup.categories.map(category => Category.upsert(category)),
      channels: actionGroup.channels.map(channel => Channel.upsert(channel))
    };

    const actionChannelIds = actionGroup.channels.map(channel => channel.id);
    const groupModel = SessionSpecificGroup.withId(actionGroup.id);
    if (groupModel) {
      const notMemberChannels = groupModel.channels
        .filter({ isMember: true })
        .filter(channel => !(actionChannelIds.includes(channel.id)));
      notMemberChannels.update({ isMember: false });
    }

    return this.upsert(clonedData);
  }

  static reducer(action, SessionSpecificGroup) {
    switch (action.type) {
      case HOME_LOAD_GROUPS_RESPONDED: {
        const actionGroupIds = action.groups?.map(group => group.id) || [];
        const notMemberGroups = SessionSpecificGroup
          .filter({ isMember: true })
          .filter(group => !(actionGroupIds.includes(group.id)));
        notMemberGroups.toModelArray().forEach((group) => {
          group.channels.update({ isMember: false });
        });
        notMemberGroups.update({ isMember: false });

        action.groups?.forEach(actionGroup => SessionSpecificGroup.parse(actionGroup));
        break;
      }
      default:
        break;
    }
  }
}

export default Group;
