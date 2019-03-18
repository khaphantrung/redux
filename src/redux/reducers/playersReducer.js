import { DRAW_CARDS_FOR_PLAYERS, UPDATE_SCORE } from "../action_types";

const initialState = {
  "0": { name: "Kimochi", score: 0, cards: [] },
  "1": { name: "Sugoi", score: 0, cards: [] },
  "2": { name: "You", score: 0, cards: [] },
  "3": { name: "Yamate", score: 0, cards: [] }
};

const players = (state = initialState, action) => {
  switch (action.type) {
    case DRAW_CARDS_FOR_PLAYERS:
      return { ...drawCardForPlayers(cloneDeep(state), action) };

    case UPDATE_SCORE:
      console.log(state, action);
      return { ...updateScore(cloneDeep(state), action) };
    default:
      return state;
  }
};

const drawCardForPlayers = (stateClone, action) => {
  const { players = [] } = action;
  players.forEach(player => {
    const { playerId = -1, cards } = player;
    if (playerId >= 0) {
      stateClone[playerId].cards = cards;
    }
  });
  return stateClone;
};

const updateScore = (stateClone, action) => {
  const { resultPerRound = [] } = action;
  resultPerRound.forEach(player => {
    const { playerId = -1, value } = player;
    if (playerId >= 0) {
      stateClone[playerId].score += value;
    }
  });
  return stateClone;
};

const cloneDeep = jsonObject => {
  return JSON.parse(JSON.stringify(jsonObject));
};

export default players;
