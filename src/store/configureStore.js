import { createStore, combineReducers, compose, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { createReducer } from 'redux-orm';

import uiReducer from "./reducers/ui";
import accessTokenReducer from "./reducers/accessToken";
import currentUserReducer from "./reducers/currentUser";
import homeReducer from "./reducers/home";
import channelReducer from "./reducers/channel";
import orm from './models';

const rootReducer = combineReducers({
  ui: uiReducer,
  accessToken: accessTokenReducer,
  currentUser: currentUserReducer,
  home: homeReducer,
  channel: channelReducer,
  orm: createReducer(orm)
});

let composeEnhancers = compose;
if (__DEV__) {
  composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
}

const configureStore = () => {
  return createStore(rootReducer, composeEnhancers(applyMiddleware(thunk)));
};

export default configureStore;

