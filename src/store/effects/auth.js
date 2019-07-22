import { goToAuthRoot, goToHomeRoot } from '../../screens/routes';
import { uiStartLoading, uiStopLoading } from '../actions/ui';
import { accessTokenGetInfoRequested, accessTokenCreateTokenRequested } from './accessToken';
import { currentUserLoadInfoRequested } from './currentUser';
import { currentUserClearAll, accessTokenClearAll } from '../actions';

export const authAutoSignIn = () => async (dispatch) => {
  const token = await dispatch(accessTokenGetInfoRequested());
  if (token) {
    goToHomeRoot();
  } else {
    goToAuthRoot();
  }
};

export const authSignIn = authData => async (dispatch) => {
  dispatch(uiStartLoading());
  try {
    const accessToken = await dispatch(accessTokenCreateTokenRequested(authData));
    if (!accessToken) {
      alert('앗! 로그인이 안되네요. 잠시 후에 다시 시도해 주세요.2');
      dispatch(uiStopLoading());
      return;
    }

    await dispatch(currentUserLoadInfoRequested());
    await goToHomeRoot();
    dispatch(uiStopLoading());
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn('authSignIn', err);
    alert('앗! 로그인이 안되네요. 잠시 후에 다시 시도해 주세요.3');
    dispatch(uiStopLoading());
  }
};

export const authSignOut = () => async (dispatch) => {
  await dispatch(accessTokenClearAll());
  await dispatch(currentUserClearAll());
  goToAuthRoot();
};
