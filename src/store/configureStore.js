import { createStore, combineReducers, compose, applyMiddleware } from "redux";
import thunk from "redux-thunk";

import authReducer from "./reducers/auth";
import currentUserReducer from "./reducers/currentUser";
import messagesReducer from "./reducers/messages";
import uiReducer from "./reducers/ui";

const rootReducer = combineReducers({
  auth: authReducer,
  currentUser: currentUserReducer,
  ui: uiReducer,
  messages: messagesReducer
});

let composeEnhancers = compose;
if (__DEV__) {
  composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
}

const configureStore = () => {
  return createStore(rootReducer, composeEnhancers(applyMiddleware(thunk)));
};

export default configureStore;

