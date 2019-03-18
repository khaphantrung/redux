import React from "react";

const animationRefesh = 10;
const BACK_SIDE_CARD =
  "https://i.pinimg.com/236x/3d/e3/40/3de340dc82f10724b4b61e8ef2f1f506--playing-card-design-bicycle-cards.jpg";

const Player = ({ player, position, isDraw, isReveal }) => {
  const { name = "", cards = [] } = player;
  let revealClass = "";
  if (isReveal) {
    revealClass = "reveal";
  }
  return (
    <div className={`player player-${position}`}>
      {isDraw && (
        <div className="player-cards">
          {cards.map((card, index) => {
            const { image = "" } = card;
            return (
              <img
                alt="card"
                key={isReveal ? index : animationRefesh + index}
                className={`player-cards-${index} ${revealClass}`}
                src={isReveal ? image : BACK_SIDE_CARD}
              />
            );
          })}
        </div>
      )}
      <div className="player-name">{name}</div>
    </div>
  );
};

export default Player;
