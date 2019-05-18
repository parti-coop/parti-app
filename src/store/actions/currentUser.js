import { CURRENT_USER_SET_INFO, CURRENT_USER_SET_GROUPS, CURRENT_USER_REMOVE } from "./actionTypes";
import { fetchPartiAPI } from './partiFetcher';

export const currentUserSetInfo = (nickname) => {
  return {
    type: CURRENT_USER_SET_INFO,
    nickname: nickname,
  };
};

export const currentUserSetGroups = (groups) => {
  return {
    type: CURRENT_USER_SET_GROUPS,
    groups: groups,
  };
};

export const currentUserRemove = () => {
  return {
    type: CURRENT_USER_REMOVE
  };
};

export const currentUserLoadInfo = () => {
  return async (dispatch) => {
    try {
      const res = await fetchPartiAPI(dispatch, "/users/current_user");
      if(!res) {
        console.log("Error on currentUserLoadInfo");
        return;
      }

      await dispatch(currentUserSetInfo(res.nickname));
    } catch(err) {
      console.log(err);
    }
  };
};

export const currentUserLoadGroups = () => {
  return async (dispatch) => {
    try {
      const res = await fetchPartiAPI(dispatch, "/home/groups");
      if(!res) {
        console.log("Error on currentUserLoadGroups");
        return;
      }

      await dispatch(currentUserSetGroups(res));
    } catch(err) {
      console.log(err);
    }
  };
};
