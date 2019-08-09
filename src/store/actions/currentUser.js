import { CURRENT_USER_LOAD_INFO_RESPONDED } from '../actionTypes';

// eslint-disable-next-line import/prefer-default-export
export const currentUserLoadInfoResponded = currentUser => ({
  type: CURRENT_USER_LOAD_INFO_RESPONDED,
  currentUser,
});
