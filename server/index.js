const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "Server is running!" });
});

app.post("/api/generate", async (req, res) => {
  const { text } = req.body;

  if (!text || text.trim().length < 30) {
    return res.status(400).json({ error: "Please provide more text (at least a sentence or two)." });
  }

  const prompt = `You are an expert teacher who explains concepts in a very simple and clear way.

Convert the given text into flashcards.

Return ONLY valid JSON:
[
  {
    "question": "...",
    "answer": "..."
  }
]

Rules:
- Cover all important concepts from the text
- Each flashcard must represent a UNIQUE concept
- Do NOT repeat the same idea in different wording
- Avoid overlapping questions
- Questions should test understanding
- Answers must be:
  - Simple and easy to understand
  - Slightly detailed (2–4 lines)
- Use clear language (like teaching a beginner)
- If two ideas are similar, merge them into ONE flashcard
- Do NOT include any text outside JSON
- Ensure valid JSON format


Text:
"""
${text}
"""

JSON:`;

  try {
    const response = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
      {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.3, maxOutputTokens: 8192 },
      },
      {
        params: { key: process.env.GEMINI_API_KEY },
        headers: { "Content-Type": "application/json" },
      }
    );

    const raw = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    const cleaned = raw.replace(/^```(?:json)?|```$/gm, "").trim();

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      const match = cleaned.match(/\[[\s\S]*\]/);
      if (!match) throw new Error("Could not parse flashcard JSON.");
      parsed = JSON.parse(match[0]);
    }

    if (!Array.isArray(parsed) || parsed.length === 0) {
      throw new Error("No flashcards returned.");
    }

    const valid = parsed
      .filter((c) => c && typeof c.question === "string" && typeof c.answer === "string");

    if (valid.length === 0) throw new Error("Cards returned in unexpected format.");

    res.json({ cards: valid });
  } catch (err) {
    const msg = err.response?.data?.error?.message || err.message || "Failed to generate flashcards.";
    res.status(500).json({ error: msg });
  }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
