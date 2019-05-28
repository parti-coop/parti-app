import { currentUserLoadInfoResponded } from "../actions";
import { uiShowError } from "./ui";
import API from '../effects/api';

export const currentUserLoadInfoRequested = () => {
  return async (dispatch) => {
    try {
      const res = await API(dispatch, "/users/current_user");
      if(!res) {
        console.log("Error on currentUserLoadInfoRequested");
        dispatch(uiShowError());
        return;
      }

      dispatch(currentUserLoadInfoResponded(res));
    } catch(err) {
      console.log(err);
      dispatch(uiShowError(err));
    }
  };
};
