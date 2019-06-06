import orm from '../models'
import { createSelector as ormCreateSelector } from 'redux-orm';

export const drawerGroupsSelector = ormCreateSelector(
  orm,
  state => { return state.orm },
  session => {
    return session.Group.filter({ isMember: true }).toRefArray().map(groupRef => {
      return Object.assign({ key: groupRef.id.toString() }, groupRef);
    });
  }
);

export const drawerChannelsSelector = ormCreateSelector(
  orm,
  state => { return state.orm },
  state => { return state.home.selectedGroup?.id },
  (session, groupId) => {
    console.log("groupId", groupId);
    if(groupId) {
      return session.Channel.filter({ groupId: groupId }).toRefArray().map(channelRef => {
        return {...channelRef, key: channelRef.id.toString()};
      });
    } else {
      return [];
    }
  }
);
