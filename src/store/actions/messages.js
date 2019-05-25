import { MESSAGES_SET_NEW_COUNTS, MESSAGES_REMOVE_NEW_COUNTS } from "../actionTypes";
import API from '../effects/api';

export const messagesGetNewCounts = () => {
  return async (dispatch, getState) => {
    try {
      const res = await API(dispatch, "/messages/new_counts");
      if(!res) { return; }

      dispatch(messagesSetNewCounts(
        res.new_messages_count,
        res.new_mentions_count
      ));
    } catch(err) {
      console.log("Unknown Error: " + err);
    }
  }
};

export const messagesSetNewCounts = (newMessagesCount, newMentionsCount) => {
  return {
    type: MESSAGES_SET_NEW_COUNTS,
    newMessagesCount: newMessagesCount,
    newMentionsCount: newMentionsCount
  };
};

export const messagesRemoveNewCounts = () => {
  return {
    type: MESSAGES_REMOVE_NEW_COUNTS
  };
};
