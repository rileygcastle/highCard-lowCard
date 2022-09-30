import React, { useState, useEffect } from "react";
import "./cardgame.styles.css";
import cardDown from "./cardDown.png";

const ShuffleDeckUrl =
  "https://www.deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1";
const makeDrawCardUrl = (deckId) =>
  `https://www.deckofcardsapi.com/api/deck/${deckId}/draw/?count=2`;

const cardRanks = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "JACK",
  "QUEEN",
  "KING",
  "ACE",
];

const CardGame = () => {
  const [deckId, setDeckId] = useState();

  const [cards, setCards] = useState([]);

  const [userAnswered, setUserAnswered] = useState(false);

  const [userWon, setUserWon] = useState();

  const [userScore, setUserScore] = useState(0);

  const [gameStarted, setGameStarted] = useState(false);

  const [disableBtns, setDisableBtns] = useState(false);

  useEffect(() => {
    const fetchAndShuffleDeck = async () => {
      const response = await fetch(ShuffleDeckUrl);
      const data = await response.json();
      setDeckId(data.deck_id);
    };
    fetchAndShuffleDeck();
  }, []);

  const handleDrawTwoCards = async () => {
    if (!deckId) return alert("deck id required");
    const response = await fetch(makeDrawCardUrl(deckId));
    const data = await response.json();
    if (data.cards[0].value === data.cards[1].value) {
      handleDrawTwoCards();
    } else {
      setUserAnswered(false);
      setGameStarted(true);
      setDisableBtns(true);
      setTimeout(
        () => {
          setCards(data.cards);
          setDisableBtns(false);
        },
        gameStarted ? 600 : 0
      );
    }
  };

  const userCorrect = () => {
    setUserWon(true);
    setUserScore(userScore + 1);
  };
  const userIncorrect = () => {
    setUserWon(false);
    setUserScore(userScore - 1);
  };

  const handleGuess = (e) => {
    if(disableBtns) return;
    const guess = e.target.id;
    const [cardOne, cardTwo] = cards;
    const rankOne = cardRanks.indexOf(cardOne.value);
    const rankTwo = cardRanks.indexOf(cardTwo.value);
    const mysteryCardIsGreater = rankTwo > rankOne;
    setUserAnswered(true);
    if (
      (mysteryCardIsGreater && guess === "high") ||
      (!mysteryCardIsGreater && guess === "low")
    ) {
      userCorrect();
    } else {
      userIncorrect();
    }
  };

  return (
    <div className="card-game">
      <div>
        <div className="top-text">
          <h1 className="header">High Card Low Card</h1>
          <p className="description">
            A card game inspired by Animal Crossing, a Nintendo game.
          </p>
        </div>
        <h2 className="how-to">How To Play:</h2>
        <div className="instruction-box">
          <p className="instructions">
            You will recive 2 cards, 1 of which you can see the face, and the
            other a mystery. Guess wether the mystery card will be higher or
            lower than the card with its face shown.
          </p>
        </div>
      </div>
      {!gameStarted && (
        <>
          <p className="instructions-2">Click the button below to begin</p>
          <button onClick={handleDrawTwoCards} className="btn start-btn">
            Start
          </button>
        </>
      )}
      {cards.length > 0 && (
        <div>
          <div className="card-container">
            <img
              alt={`${cards[0].value} of ${cards[0].suit}`}
              src={cards[0].image}
              className="card"
            />

            <div className="scene">
              <div className={`flip-card ${userAnswered && "is-flipped"}`}>
                <img
                  alt="card facing down"
                  src={cardDown}
                  className="card card__face"
                />
                <img
                  src={cards[1].image}
                  alt={`${cards[1].value} of ${cards[1].suit}`}
                  className="card card__face card__face--back"
                />
              </div>
            </div>
          </div>
          <div className="result">
            {userAnswered && (
              <>
                <p>
                  {userWon
                    ? "You guessed correctly! Good job!"
                    : "Sorry, you guessed incorrectly. Try again!"}
                </p>
                <p>Your score is: {userScore}</p>
                <button onClick={handleDrawTwoCards} className="btn">
                  Play Again
                </button>
              </>
            )}
          </div>
          {!userAnswered && (
            <div className="h-l-btn">
              <button className="btn" id="high" onClick={handleGuess}>
                Guess Higher
              </button>
              <button className="btn" id="low" onClick={handleGuess}>
                Guess Lower
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CardGame;
