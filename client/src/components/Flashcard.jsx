import "./Flashcard.css";

export default function Flashcard({ card, flipped, onFlip }) {
  return (
    <div className="card-scene" onClick={onFlip}>
      <div className={`card-inner ${flipped ? "flipped" : ""}`}>
        {/* Front — Question */}
        <div className="card-face card-front">
          <div className="card-corner-label">Question</div>
          <div className="card-content">
            <p className="card-text">{card.question}</p>
          </div>
          <div className="card-hint">
            <span className="hint-icon">↵</span>
            click to reveal answer
          </div>
        </div>

        {/* Back — Answer */}
        <div className="card-face card-back">
          <div className="card-corner-label">Answer</div>
          <div className="card-content">
            <p className="card-text">{card.answer}</p>
          </div>
          <div className="card-hint">
            <span className="hint-icon">↵</span>
            click to flip back
          </div>
        </div>
      </div>
    </div>
  );
}
