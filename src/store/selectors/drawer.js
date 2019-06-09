import orm from '../models'
import { createSelector as ormCreateSelector } from 'redux-orm';
import Category from '../models/Category';

export const drawerGroupsSelector = ormCreateSelector(
  orm,
  state => { return state.orm },
  session => {
    return session.Group.filter({ isMember: true }).toRefArray().map(groupRef => {
      return Object.assign({ key: groupRef.id.toString() }, groupRef);
    });
  }
);

export const drawerChannelsGroupByCategory = ormCreateSelector(
  orm,
  state => { return state.orm },
  state => { return state.home.selectedGroup?.id },
  (session, groupId) => {
    console.log("groupId", groupId);
    if(groupId) {
      const groupModel = session.Group.withId(groupId);
      const categoryRefArray = (groupModel.categories.toRefArray() || []);
      const nullCategorizedChannels = [];
      const dictChannels = groupModel.channels.filter({ isMember: true }).toRefArray().reduce((dictChannels, channelRef) => {
        channelRef = {
          ...channelRef,
          key: channelRef.id.toString(),
          group: Object.assign({}, groupModel.ref),
        }
        const categoryId = channelRef.categoryId;
        if(!!categoryId && categoryRefArray.some((categoryRef) => (categoryId === categoryRef.id))) {
          (dictChannels[channelRef.categoryId] = dictChannels[channelRef.categoryId] || []).push(channelRef);
        } else {
          nullCategorizedChannels.push(channelRef);
        }
        return dictChannels;
      }, {});

      let result = categoryRefArray.map((categoryRef) => {
        return {
          ...categoryRef,
          key: categoryRef.id.toString(),
          data: (dictChannels[categoryRef.id] || [])
        }
      });

      if(nullCategorizedChannels.length > 0) {
        const hasSibling = result.length > 0;
        result.push({
          ...Category.nullObject(hasSibling),
          key: '0',
          data: nullCategorizedChannels
        });
      }

      console.log('Drawer Selector', result);
      return result;
    } else {
      return [];
    }
  }
);
