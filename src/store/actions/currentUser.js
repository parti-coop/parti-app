import { CURRENT_USER_SET_DATA, CURRENT_USER_REMOVE_DATA } from "./actionTypes";
import { fetchPartiAPI } from './partiFetcher';

export const currentUserSetData = (nickname) => {
  return {
    type: CURRENT_USER_SET_DATA,
    nickname: nickname,
  };
};

export const currentUserRemoveData = () => {
  return {
    type: CURRENT_USER_REMOVE_DATA
  };
};

export const currentUserPrepare = () => {
  return async (dispatch) => {
    try {
      const res = await fetchPartiAPI(dispatch, "/users/current_user");
      if(!res) {
        console.log("Error on currentUserPrepare");
        return;
      }

      await dispatch(currentUserSetData(res.nickname));
    } catch(err) {
      console.log(err);
    }
  };
};
