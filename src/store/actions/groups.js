import { GROUPS_SET_GROUPS } from "./actionTypes";

export const groupsSetGroups = (groups) => {
  return {
    type: GROUPS_SET_GROUPS,
    groups: groups,
  };
};

