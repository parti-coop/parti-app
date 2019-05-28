import { CURRENT_USER_LOAD_INFO_RESPONDED, CURRENT_USER_CLEAR_ALL } from "../actionTypes";

export const currentUserLoadInfoResponded = (currentUser) => {
  return {
    type: CURRENT_USER_LOAD_INFO_RESPONDED,
    currentUser: currentUser,
  };
};

export const currentUserClearAll = () => {
  return {
    type: CURRENT_USER_CLEAR_ALL
  };
};
