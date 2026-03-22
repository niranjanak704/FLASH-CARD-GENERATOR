import { useState } from "react";
import TextInput from "./components/TextInput.jsx";
import FlashcardDeck from "./components/FlashcardDeck.jsx";
import "./App.css";

export default function App() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async (text) => {
    setLoading(true);
    setError("");
    setCards([]);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to generate flashcards.");

      setCards(data.cards);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setCards([]);
    setError("");
  };

  return (
    <div className="app">
      <header className="header">
        <p className="header-eyebrow">Study tool</p>
        <h1>Flashcard <em>Generator</em></h1>
        <p className="header-sub">Paste any text — get instant study cards</p>
      </header>

      {cards.length === 0 ? (
        <TextInput
          onGenerate={handleGenerate}
          loading={loading}
          error={error}
        />
      ) : (
        <FlashcardDeck cards={cards} onReset={handleReset} />
      )}
    </div>
  );
}
