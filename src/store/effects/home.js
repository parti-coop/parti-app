import { uiShowError } from './ui';
import { homeLoadGroupsResponded } from '../actions';
import API from '../effects/api';

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

export const homeLoadGroupsRequested = () => {
  return async (dispatch) => {
    try {
      const res = await API(dispatch, "/home/groups");
      if(!res) {
        console.log("Error on currentUserLoadGroups");
        dispatch(uiShowError());
        return;
      }

      dispatch(homeLoadGroupsResponded(res));
    } catch(err) {
      console.log(err);
      dispatch(uiShowError(err));
      throw err;
    }
  };
};
