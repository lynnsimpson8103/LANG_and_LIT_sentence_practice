# Context Quest 🏆

A vocabulary game that helps students write strong context-clue sentences. AI grades each sentence on 5 criteria and gives friendly, specific feedback.

Built for a 12-year-old with autism who learns best with clear rules, structured scoring, and immediate feedback.

![Game screenshot](https://img.shields.io/badge/status-working-brightgreen)

## How It Works

1. Student picks a vocabulary word and sees its roots + definition
2. They write a sentence using the word, with context clues in ALL CAPS
3. AI grades the sentence on 5 criteria:
   - **🔤 ALL CAPS used** for context clues
   - **🎯 Whole definition** covered (not just one root)
   - **🎬 Show, don't tell** — paints a scene, doesn't just restate the definition
   - **📝 Grammar** is correct
   - **🔍 Blank Test** — could someone guess the word from the caps alone?
4. Student earns XP, climbs ranks, and builds streaks

## Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) v18 or later
- An [Anthropic API key](https://console.anthropic.com/settings/keys)

### Setup

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/context-quest.git
cd context-quest

# Install dependencies
npm install

# Create your .env file with your API key
cp .env.example .env
# Edit .env and paste your Anthropic API key
```

### Run locally

```bash
# Start both the frontend and backend
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser. That's it!

### Build for production

```bash
# Build the frontend
npm run build

# Start the production server (serves both API + frontend)
npm start
```

The app will be available at `http://localhost:3001`.

## Editing the Word Bank

Click **✏️ Edit Words** in the app to:
- Add, edit, or delete individual words
- **Quick Import** — paste a list of words (one per line) to add them all at once
- Reorder words with ▲▼ arrows
- Reset to the default 20-word set

Each word needs at minimum a **word** and a **definition**. Roots and hints are optional but help the student a lot.

Word bank changes are saved in the browser's localStorage and persist between sessions.

## Deploying

### Option A: Railway / Render (easiest)

1. Push to GitHub
2. Connect the repo to [Railway](https://railway.app) or [Render](https://render.com)
3. Set the environment variable `ANTHROPIC_API_KEY`
4. Set the start command to `npm run build && npm start`
5. Done — you'll get a URL to share

### Option B: Any VPS / server

```bash
npm install
npm run build
ANTHROPIC_API_KEY=sk-ant-xxxxx npm start
```

## Cost

Each sentence graded uses one API call to Claude Sonnet (~500 input tokens, ~300 output tokens). At current pricing that's roughly **$0.003 per grading** — about 300 sentences per dollar.

## Project Structure

```
context-quest/
├── server/
│   └── index.js          # Express backend (proxies Anthropic API)
├── src/
│   ├── main.jsx          # React entry point
│   └── App.jsx           # The entire game UI
├── index.html            # HTML shell
├── vite.config.js        # Vite config with dev proxy
├── package.json
├── .env.example          # API key template
└── .gitignore
```

## License

MIT — use it however you want.
