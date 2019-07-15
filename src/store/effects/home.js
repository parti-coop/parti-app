import { uiShowError } from './ui';
import { homeLoadGroupsResponded } from '../actions';
import API from './api';

// eslint-disable-next-line import/prefer-default-export
export const homeLoadGroupsRequested = () => {
  return async (dispatch) => {
    try {
      const res = await API(dispatch, '/home/groups');
      if (!res) {
        console.log('Error on currentUserLoadGroups');
        dispatch(uiShowError());
        return;
      }

      dispatch(homeLoadGroupsResponded(res));
    } catch (err) {
      console.log(err);
      dispatch(uiShowError(err));
      throw err;
    }
  };
};
