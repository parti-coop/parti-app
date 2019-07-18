import {
  HOME_START_LOADING, HOME_STOP_LOADING,
} from '../actionTypes';

const initialState = {
  isLoading: false,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case HOME_START_LOADING:
      return {
        ...state,
        isLoading: true,
      };
    case HOME_STOP_LOADING:
      return {
        ...state,
        isLoading: false,
      };
    default:
      return state;
  }
};

export default reducer;
