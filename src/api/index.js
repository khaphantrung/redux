import axios from "axios";

const getDeck = () => {
  return axios.get(
    "https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1"
  );
};

const shuffleDeck = deckId => {
  return axios.get(`https://deckofcardsapi.com/api/deck/${deckId}/shuffle/`);
};

const drawCards = deckId => {
  return axios.get(
    `https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=3`
  );
};

const drawCardsForAll = deckId => {
  const p1 = drawCards(deckId);
  const p2 = drawCards(deckId);
  const p3 = drawCards(deckId);
  const p4 = drawCards(deckId);

  return Promise.all([p1, p2, p3, p4]);
};

export default { getDeck, shuffleDeck, drawCardsForAll };
