import {
  createStore, combineReducers, compose, applyMiddleware
} from 'redux';
import thunk from 'redux-thunk';
import { createReducer } from 'redux-orm';
// import { createLogger } from 'redux-logger';
import { persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-community/async-storage';

import uiReducer from './reducers/ui';
import accessTokenReducer from './reducers/accessToken';
import currentUserReducer from './reducers/currentUser';
import homeReducer from './reducers/home';
import channelReducer from './reducers/channel';
import orm from './models';
import { AUTH_SIGN_OUT } from './actionTypes';


const appReducer = combineReducers({
  ui: uiReducer,
  accessToken: accessTokenReducer,
  currentUser: currentUserReducer,
  home: homeReducer,
  channel: channelReducer,
  orm: createReducer(orm)
});

const rootReducer = (state, action) => {
  let passState = state;
  if (action.type === AUTH_SIGN_OUT) {
    passState = undefined;
  }

  return appReducer(passState, action);
};

let composeEnhancers = compose;
// eslint-disable-next-line no-undef
if (__DEV__) {
  // eslint-disable-next-line no-undef
  composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
}

// const logger = createLogger({
//   // eslint-disable-next-line no-undef
//   level: (__DEV__ ? 'log' : 'error')
// });

const persistConfig = {
  key: 'root7',
  storage: AsyncStorage,
  whitelist: ['accessToken', 'home', 'currentUser', 'channel', 'orm'],
  timeout: null,
};
const persistedReducer = persistReducer(persistConfig, rootReducer);

// export const store = createStore(persistedReducer,
//   composeEnhancers(applyMiddleware(thunk, logger)));
// export const persistor = persistStore(store);

const configureStore = () => createStore(persistedReducer,
  composeEnhancers(applyMiddleware(
    thunk,
    // logger
  )));
export default configureStore;
