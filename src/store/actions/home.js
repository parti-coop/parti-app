import { HOME_SELECT_GROUP } from "./actionTypes";
import { fetchPartiAPI } from './partiFetcher';
import { groupsSetGroups } from './groups';

export const homeSelectGroup = (group) => {
  return {
    type: HOME_SELECT_GROUP,
    group: group
  };
};

export const homeLoadGroups = () => {
  return async (dispatch) => {
    try {
      const res = await fetchPartiAPI(dispatch, "/home/groups");
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
