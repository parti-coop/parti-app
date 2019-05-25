import { HOME_SELECT_GROUP, HOME_SELECT_CHANNEL } from "../actionTypes";
import API from '../effects/api';
import { groupsSetGroups } from './groups';

export const homeSelectGroup = (group) => {
  return {
    type: HOME_SELECT_GROUP,
    group: group
  };
};

export const homeSelectChannel = (channel) => {
  return {
    type: HOME_SELECT_CHANNEL,
    channel: channel
  };
};

export const homeLoadGroups = () => {
  return async (dispatch) => {
    try {
      const res = await API(dispatch, "/home/groups");
      if(!res) {
        console.log("Error on currentUserLoadGroups");
        return;
      }

      dispatch(groupsSetGroups(res));
    } catch(err) {
      console.log(err);
      throw err;
    }
  };
};
