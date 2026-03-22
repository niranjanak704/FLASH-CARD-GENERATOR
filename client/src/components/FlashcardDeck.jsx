import { useState } from "react";
import Flashcard from "./Flashcard.jsx";
import "./FlashcardDeck.css";

export default function FlashcardDeck({ cards, onReset }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [seen, setSeen] = useState(new Set());

  const navigate = (dir) => {
    const next = currentIdx + dir;
    if (next < 0 || next >= cards.length) return;
    setSeen((s) => new Set([...s, currentIdx]));
    setFlipped(false);
    // small delay so the flip resets before card changes
    setTimeout(() => setCurrentIdx(next), 50);
  };

  const handleFlip = () => {
    if (!flipped) setSeen((s) => new Set([...s, currentIdx]));
    setFlipped((f) => !f);
  };

  return (
    <div className="deck-section">
      {/* Header row */}
      <div className="deck-header">
        <span className="deck-title">Your deck</span>
        <div className="progress-track">
          <div className="progress-pips">
            {cards.map((_, i) => (
              <div
                key={i}
                className={`pip ${
                  i === currentIdx ? "active" : seen.has(i) ? "seen" : ""
                }`}
              />
            ))}
          </div>
          <span className="progress-text">
            {currentIdx + 1}/{cards.length}
          </span>
        </div>
      </div>

      {/* Card */}
      <Flashcard
        card={cards[currentIdx]}
        flipped={flipped}
        onFlip={handleFlip}
      />

      {/* Navigation */}
      <div className="nav-controls">
        <button
          className="nav-btn"
          onClick={() => navigate(-1)}
          disabled={currentIdx === 0}
        >
          ← Prev
        </button>
        <span className="card-counter">
          {currentIdx + 1} of {cards.length}
        </span>
        <button
          className="nav-btn"
          onClick={() => navigate(1)}
          disabled={currentIdx === cards.length - 1}
        >
          Next →
        </button>
      </div>

      <button className="reset-btn" onClick={onReset}>
        ↩ New deck
      </button>
    </div>
  );
}
