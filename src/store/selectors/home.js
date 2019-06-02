import orm from '../models'
import { createSelector as ormCreateSelector } from 'redux-orm';

// export const getEntitiesSession = createSelector(
//   ormSelector,
//   entities => orm.from(entities)
// );

export const homeGroupsSelector = ormCreateSelector(
  orm,
  state => { return state.orm },
  session => {
    return session.Group.filter({ isMember: true }).toModelArray().map(groupModel => {
      const groupRef = Object.assign({uncategorizedChannels: []}, groupModel.ref);
      const categoryRefArray = groupModel.categories.toRefArray();

      const categoryIdArray = categoryRefArray.map((categoryRef) => categoryRef.id);
      let dictChannels = groupModel.channels.filter({ isMember: true }).toRefArray().reduce((dictChannels, channelRef) => {
        channelRef = {
          ...channelRef,
          group: groupRef
        }
        const categoryId = channelRef.categoryId;
        if(!!categoryId && categoryIdArray.includes(categoryId)) {
          (dictChannels[channelRef.categoryId] = dictChannels[channelRef.categoryId] || []).push(channelRef);
        } else {
          groupRef.uncategorizedChannels.push(channelRef);
        }
        return dictChannels;
      }, {});

      groupRef.categories = categoryRefArray.map((categoryRef) => {
        return {
          ...categoryRef,
          channels: (dictChannels[categoryRef.id] || []),
          hasChannelsJoinable: groupModel.channels.filter({ isMember: false, categoryId: categoryRef.id }).exists()
        }
      });

      groupRef.hasChannelsJoinable = groupModel.channels.filter({ isMember: false }).exists();
      groupRef.hasUncategorizedChannelsJoinable = groupModel.channels.filter({ isMember: false, categoryId: null }).exists();

      return groupRef;
    }).map((group) => {
      // HomeScreen SectionList
      let data;
      if(group.categories?.length < 0)
        data= [{
          key: `${group.id}-all`,
          type: "channels",
          hasChannelsJoinable: group.hasChannelsJoinable,
          channels: group.uncategorizedChannels}]
      else {
        data = group.categories.map((category) => {
          if(category.channels?.length > 0) {
            return {
              key: `${group.id}-${category.id}`,
              type: "category",
              hasChannelsJoinable: category.hasChannelsJoinable,
              ...category}
          }
        }).filter((e) => e);
        if(group.uncategorizedChannels?.length > 0) {
          let type = (data.length > 0 ? "category" : "channels");
          data.push({
            key: `${group.id}-uncategorized`,
            name: '미분류',
            type: type,
            channels: group.uncategorizedChannels,
            hasChannelsJoinable: group.hasUncategorizedChannelsJoinable
          });
        }
      }

      if(data.length <= 0) {
        [{
          key: `${group.id}-all`,
          type: "channels",
          channels: [],
          hasChannelsJoinable: true
        }];
      }
      return {group: group, data: data}
    });
  }
);
