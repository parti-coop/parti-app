import { HOME_SELECT_GROUP, HOME_SELECT_CHANNEL, HOME_LOAD_GROUPS_RESPONDED } from "../actionTypes";

export const homeSelectGroup = (group) => {
  return {
    type: HOME_SELECT_GROUP,
    group: group
  };
};

export const homeSelectChannel = (group, channel) => {
  return {
    type: HOME_SELECT_CHANNEL,
    group: group,
    channel: channel
  };
};

export const homeLoadGroupsResponded = (groups) => {
  return {
    type: HOME_LOAD_GROUPS_RESPONDED,
    groups: groups,
  };
};

