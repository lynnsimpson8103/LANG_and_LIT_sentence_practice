import express from "express";
import cors from "cors";
import Anthropic from "@anthropic-ai/sdk";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Serve the built frontend in production
app.use(express.static(path.join(__dirname, "../dist")));

// Anthropic client — reads ANTHROPIC_API_KEY from .env
const anthropic = new Anthropic();

// Grading endpoint
app.post("/api/grade", async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: "Missing prompt" });

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      messages: [{ role: "user", content: prompt }],
    });

    const text = message.content.map((c) => c.text || "").join("");
    res.json({ text });
  } catch (err) {
    console.error("Anthropic API error:", err.message);
    res.status(500).json({ error: "Grading failed. Check your API key." });
  }
});

// Catch-all: serve frontend for any non-API route (SPA support)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../dist/index.html"));
});

app.listen(PORT, () => {
  console.log(`✅ Context Quest server running at http://localhost:${PORT}`);
});
