import { createStore, combineReducers, compose, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { createReducer } from 'redux-orm';

import authReducer from "./reducers/auth";
import currentUserReducer from "./reducers/currentUser";
import messagesReducer from "./reducers/messages";
import homeReducer from "./reducers/home";
import uiReducer from "./reducers/ui";
import channelReducer from "./reducers/channel";
import orm from './models';

const rootReducer = combineReducers({
  auth: authReducer,
  currentUser: currentUserReducer,
  ui: uiReducer,
  messages: messagesReducer,
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

