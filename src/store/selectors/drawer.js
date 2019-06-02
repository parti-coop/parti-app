import orm from '../models'
import { createSelector as ormCreateSelector } from 'redux-orm';

export const drawerGroupsSelector = ormCreateSelector(
  orm,
  state => { return state.orm },
  session => {
    return session.Group.filter({ isMember: true }).toRefArray().map(groupRef => {
      return Object.assign({}, groupRef);
    });
  }
);
