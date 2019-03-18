import React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import Action from "../redux/actions";
import GameAPI from "../api";
import Player from "../component/Player";

const CARD_VALUES = {
  ACE: 1,
  "2": 2,
  "3": 3,
  "4": 4,
  "5": 5,
  "6": 6,
  "7": 7,
  "8": 8,
  "9": 9,
  "10": 10,
  KING: 10,
  QUEEN: 10,
  JACK: 10
};
const SPECIAL_CARDS = ["KING", "QUEEN", "JACK"];
const BET = 5000;
const TOTAL = 5000 * 4;
const MAX_ROUND = 5;

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isDraw: false,
      isCards: false,
      isReveal: false,
      isShuffling: true,
      round: 0,
      winners: []
    };
    this.newGame();
  }

  newGame = () => {
    GameAPI.getDeck().then(response => {
      const { data: { deck_id } = {} } = response;
      this.props.actions.getDeck(response.data);
      this.drawDeckData(deck_id);
    });
  };

  shuffleDeck = e => {
    const { deck: { id } = {} } = this.props.state;
    if (!id) return;
    this.setState({
      isDraw: false,
      isCards: false,
      isReveal: false,
      isShuffling: true
    });
    GameAPI.shuffleDeck(id).then(response => {
      this.setState({
        isDraw: false,
        isCards: false,
        isReveal: false
      });
      const { deck_id, remaining = 0, success = false } = response.data;
      if (remaining === 52 && success && deck_id) {
        this.drawDeckData(deck_id);
      }
    });
  };

  drawDeckData(deckId) {
    GameAPI.drawCardsForAll(deckId).then(responses => {
      const players = [];
      responses.forEach((response, index) => {
        const { data: { cards = [] } = {} } = response;
        players.push({ playerId: index, cards });
      });
      this.props.actions.drawCardsForPlayers(players);
      this.setState({ isCards: true, isShuffling: false });
    });
  }

  onDrawCard = e => {
    this.setState({ isDraw: true });
  };

  calSorce(cards) {
    let score = 0;
    let specicalCard = 0;
    cards.forEach(card => {
      if (SPECIAL_CARDS.indexOf(card.value) >= 0) {
        specicalCard++;
      }
      score += CARD_VALUES[card.value];
    });
    if (specicalCard === 3) {
      return 1000;
    }
    return score % 10;
  }

  revealCard = () => {
    const { players = {} } = this.props.state;
    const { round } = this.state;
    const scoreList = Object.values(players).map(player => {
      return this.calSorce(player.cards);
    });
    //find hightest score
    let highestScore = 0;
    scoreList.forEach(score => {
      if (highestScore < score) highestScore = score;
    });
    let winners = [];
    scoreList.forEach((score, index) => {
      if (highestScore === score) winners.push(players[index].name);
    });
    const resultPerRound = scoreList.map((score, index) => {
      if (score === highestScore) {
        return {
          playerId: index,
          value: Math.round(TOTAL / winners.length) - BET
        };
      }
      return { playerId: index, value: -BET };
    });
    this.props.actions.updateSocre(resultPerRound);
    const nextRound = round + 1;
    this.setState({ isReveal: true, round: nextRound, winners });
  };

  resetGame = () => {
    this.props.actions.resetGame();
    this.setState({
      isDraw: false,
      isCards: false,
      isReveal: false,
      isShuffling: true,
      round: 0
    });
    this.newGame();
  };

  renderPopup = players => {
    let highestScore = 0;
    const ScoreList = [];
    if (players.length === 0) {
      return;
    }
    players.forEach(player => {
      const playerScore = player.score;
      ScoreList.push(playerScore);
      if (highestScore < playerScore) highestScore = playerScore;
    });
    const finalWinners = [];
    ScoreList.forEach((score, index) => {
      if (highestScore === score) finalWinners.push(players[index].name);
    });
    return (
      <div className="game-popup">
        <div className="content">
          <span>{`${this.buildMessage(finalWinners)} this game`}</span>
          <p>Press OK to start new game</p>
          <button onClick={this.resetGame}>OK</button>
        </div>
      </div>
    );
  };

  buildMessage = winners => {
    let message = "";
    if (winners.length > 1) {
      message = `${winners.toString()} win`;
    } else {
      message = `${winners.toString()} wins`;
    }
    return message;
  };

  render() {
    const { players = {} } = this.props.state;
    const {
      isDraw,
      isCards,
      isReveal,
      isShuffling,
      winners,
      round
    } = this.state;
    let isDisableDrawBtn = false;
    let isDisableRevealBtn = false;
    if (!isCards) {
      isDisableDrawBtn = true;
      isDisableRevealBtn = true;
    } else {
      isDisableDrawBtn = isDraw;
      isDisableRevealBtn = !isDraw || isReveal;
    }
    const playerList = Object.values(players);
    return (
      <div className="game">
        <div className="table-responsive">
          <div className="game-table">
            {playerList.map((player, index) => {
              return (
                <Player
                  key={index}
                  player={player}
                  position={index}
                  isDraw={isDraw}
                  isReveal={isDisableRevealBtn}
                />
              );
            })}
          </div>
          <div className="game-control">
            <div className="score-table">
              <div className="game-player-name">
                <div>Name</div>
                {playerList.map((player, index) => {
                  return <div key={index}>{player.name}</div>;
                })}
              </div>
              <div className="game-player-score">
                <div>Score</div>
                {playerList.map((player, index) => {
                  return <div key={index}>{player.score}</div>;
                })}
              </div>
            </div>
            {isReveal && (
              <div className="round-winner-mesaage">
                {`${this.buildMessage(winners)} this round`}
              </div>
            )}
            <div className="game-action">
              <button
                disabled={isDisableDrawBtn}
                onClick={this.onDrawCard}
                className="btn-draw"
              >
                DRAW
              </button>
              <button
                disabled={round === MAX_ROUND || isShuffling}
                onClick={this.shuffleDeck}
                className="btn-shuffle"
              >
                SHUFFLE
              </button>
              <button
                disabled={isDisableRevealBtn}
                onClick={this.revealCard}
                className="btn-reveal"
              >
                REVEAL
              </button>
            </div>
          </div>
          {round === MAX_ROUND && isReveal && this.renderPopup(playerList)}
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  actions: { ...bindActionCreators({ ...Action }, dispatch) }
});

const mapStateToProps = state => {
  return {
    state: state
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Game);
