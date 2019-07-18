import { uiShowError } from './ui';
import { homeLoadGroupsResponded, homeStartLoading, homeStopLoading } from '../actions';
import API from './api';

// eslint-disable-next-line import/prefer-default-export
export const homeLoadGroupsRequested = () => {
  return async (dispatch) => {
    dispatch(homeStartLoading());
    try {
      const res = await API(dispatch, '/home/groups');
      if (!res) {
        // eslint-disable-next-line no-console
        console.warn('Error on currentUserLoadGroups');
        dispatch(uiShowError());
        return;
      }

      dispatch(homeLoadGroupsResponded(res));
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn('homeLoadGroupsRequested', err);
      dispatch(uiShowError(err));
      throw err;
    }
    dispatch(homeStopLoading());
  };
};
