import { HOME_SELECT_GROUP } from "../actions/actionTypes";

const initialState = {
  selectedGroup: null
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case HOME_SELECT_GROUP:
      return {
        ...state,
        selectedGroup: action.group
      };
    default:
      return state;
  }
};

export default reducer;
