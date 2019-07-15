import { createSelector as ormCreateSelector } from 'redux-orm';
import orm from '../models';

import Category from '../models/Category';

// export const getEntitiesSession = createSelector(
//   ormSelector,
//   entities => orm.from(entities)
// );

// eslint-disable-next-line import/prefer-default-export
export const homeGroupsSelector = ormCreateSelector(
  orm,
  state => state.orm,
  session => session.Group.filter({ isMember: true }).toModelArray().map((groupModel) => {
    const groupView = Object.assign({}, groupModel.ref);

    const uncategorizedChannels = [];
    const categorizedChannels = {};
    groupView.isUnread = false;
    groupModel.channels.filter({ isMember: true }).toRefArray().forEach((channelRef) => {
      const channelView = {
        ...channelRef,
        key: String(channelRef.id),
        group: Object.assign({}, groupModel.ref),
      };
      if (!groupView.isUnread) {
        groupView.isUnread = channelRef.isUnread;
      }
      const { categoryId } = channelRef;
      if (categoryId) {
        // eslint-disable-next-line max-len
        categorizedChannels[channelRef.categoryId] = categorizedChannels[channelRef.categoryId] || [];
        categorizedChannels[channelRef.categoryId].push(channelView);
      } else {
        uncategorizedChannels.push(channelView);
      }
    });

    groupView.categories = [];
    Object.keys(categorizedChannels).forEach((categoryId) => {
      const categoryRef = session.Category.withId(categoryId).ref;
      const isChannelUnread = categorizedChannels[categoryId]
        .some(channelView => channelView.isUnread);
      groupView.categories.push({
        ...categoryRef,
        isUnread: isChannelUnread,
        key: categoryRef.id.toString(),
        channels: categorizedChannels[categoryId]
      });
    });

    if (uncategorizedChannels.length > 0) {
      const hasSibling = (categorizedChannels.length > 0);
      const isChannelUnread = uncategorizedChannels.some(channelView => channelView.isUnread);
      groupView.categories.push({
        ...Category.nullObject(hasSibling),
        isUnread: isChannelUnread,
        key: `null-${groupModel.id.toString()}`,
        channels: uncategorizedChannels
      });
    }

    return groupView;
  }).map(group => ({
    group,
    data: group.categories.reduce((data, category) => {
      if (!Category.isNullObject(category) || category.hasSibling) {
        data.push(category);
      }
      category.channels.map(channel => data.push(channel));
      return data;
    }, [])
  }))
);