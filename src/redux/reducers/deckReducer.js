import { GET_DECK_SUCCESS } from "../action_types";

const deck = (state = {}, action) => {
  console.log("rootReducer", state);
  switch (action.type) {
    case GET_DECK_SUCCESS:
      return {
        ...state,
        id: action.deck.id
      };
    default:
      return state;
  }
};

export default deck;
