import { useState } from "react";
import "./TextInput.css";

export default function TextInput({ onGenerate, loading, error }) {
  const [text, setText] = useState("");

  const handleSubmit = () => {
    if (!text.trim()) return;
    onGenerate(text);
  };

  return (
    <div className="input-panel">
      <div className="textarea-wrapper">
        <span className="textarea-label">Your study material</span>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste your notes, an article, or any study text here — all content will be covered…"
          spellCheck={false}
        />
        <div className="char-count">{text.length} chars</div>
      </div>

      {error && (
        <div className="error-box">
          <span className="error-icon">⚠</span>
          <span>{error}</span>
        </div>
      )}

      <button
        className="generate-btn"
        onClick={handleSubmit}
        disabled={loading || !text.trim()}
      >
        {loading ? (
          <><div className="spinner" /> Generating cards…</>
        ) : (
          <>Generate flashcards →</>
        )}
      </button>
    </div>
  );
}
