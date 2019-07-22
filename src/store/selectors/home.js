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
  session => session.Group.filter({ isMember: true })
    .toModelArray()
    .sort((a, b) => a.title.toLowerCase().localeCompare(b.title.toLowerCase()))
    .map((groupModel) => {
      const groupView = Object.assign({}, groupModel.ref);

      const uncategorizedChannels = [];
      const categorizedChannels = {};

      groupView.isUnread = false;
      const unreadCategoryIds = new Set();
      let unreadNullCategory = false;

      groupModel.channels.filter({ isMember: true })
        .toRefArray()
        .sort((a, b) => a.title.toLowerCase().localeCompare(b.title.toLowerCase()))
        .forEach((channelRef) => {
          const channelView = {
            ...channelRef,
            key: String(channelRef.id),
            group: Object.assign({}, groupModel.ref),
          };

          const { categoryId } = channelRef;
          if (categoryId) {
            // eslint-disable-next-line max-len
            categorizedChannels[channelRef.categoryId] = categorizedChannels[channelRef.categoryId] || [];
            categorizedChannels[channelRef.categoryId].push(channelView);
          } else {
            uncategorizedChannels.push(channelView);
          }

          if (channelRef.isUnread) {
            if (!groupView.isUnread) {
              groupView.isUnread = true;
            }
            if (categoryId) {
              unreadCategoryIds.add(categoryId);
            } else {
              unreadNullCategory = true;
            }
          }
        });

      groupView.categories = [];
      Object.keys(categorizedChannels).forEach((categoryId) => {
        const categoryRef = session.Category.withId(categoryId).ref;
        groupView.categories.push({
          ...categoryRef,
          isUnread: unreadCategoryIds.has(categoryRef.id),
          key: categoryRef.id.toString(),
          channels: categorizedChannels[categoryId]
        });
      });

      if (uncategorizedChannels.length > 0) {
        const hasSibling = (groupView.categories.length > 0);
        groupView.categories.push({
          ...Category.nullObject(hasSibling),
          isUnread: unreadNullCategory,
          key: `null-${groupModel.id.toString()}`,
          channels: uncategorizedChannels,
          hasSibling,
        });
      }

      return groupView;
    })
    .map(group => ({
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
