import {
  HOME_LOAD_GROUPS_RESPONDED,
  HOME_START_LOADING, HOME_STOP_LOADING
} from '../actionTypes';

export const homeLoadGroupsResponded = groups => ({
  type: HOME_LOAD_GROUPS_RESPONDED,
  groups,
});

export const homeStartLoading = channel => ({
  type: HOME_START_LOADING,
  channel,
});

export const homeStopLoading = channel => ({
  type: HOME_STOP_LOADING,
  channel,
});
