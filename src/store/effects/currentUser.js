import { currentUserLoadInfoResponded } from '../actions';
import { uiShowError } from './ui';
import API from './api';

// eslint-disable-next-line import/prefer-default-export
export const currentUserLoadInfoRequested = () => async (dispatch) => {
  try {
    const res = await API(dispatch, '/users/current_user');
    if (!res) {
      console.warn('Error on currentUserLoadInfoRequested');
      dispatch(uiShowError());
      return;
    }

    dispatch(currentUserLoadInfoResponded(res));
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn('currentUserLoadInfoRequested', err);
    dispatch(uiShowError(err));
  }
};
