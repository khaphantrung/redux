import deck from "./deckReducer";
import players from "./playersReducer";
import { combineReducers } from "redux";
import { RESET_GAME } from "../action_types";

const appReducer = combineReducers({
  deck,
  players
});

const rootReducer = (state = {}, action) => {
  if (action.type === RESET_GAME) {
    state = undefined;
  }
  console.log("rootReducer", state);
  return appReducer(state, action);
};

export default rootReducer;
