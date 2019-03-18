import * as ActionTypes from "../action_types/index";

const getDeck = deck => {
  return {
    type: ActionTypes.GET_DECK_SUCCESS,
    deck: { id: deck.deck_id },
    isInitGame: true
  };
};
const resetGame = () => {
  return {
    type: ActionTypes.RESET_GAME
  };
};

const drawCardsForPlayers = players => {
  return {
    type: ActionTypes.DRAW_CARDS_FOR_PLAYERS,
    players
  };
};

const updateSocre = resultPerRound => {
  return {
    type: ActionTypes.UPDATE_SCORE,
    resultPerRound
  };
};

export default {
  getDeck,
  resetGame,
  drawCardsForPlayers,
  updateSocre
};
