import { HOME_SELECT_GROUP, HOME_SELECT_CHANNEL, HOME_LOAD_GROUPS_RESPONDED } from '../actionTypes';

export const homeSelectGroup = group => ({
  type: HOME_SELECT_GROUP,
  group
});

export const homeSelectChannel = (group, channel) => ({
  type: HOME_SELECT_CHANNEL,
  group,
  channel
});

export const homeLoadGroupsResponded = groups => ({
  type: HOME_LOAD_GROUPS_RESPONDED,
  groups,
});
