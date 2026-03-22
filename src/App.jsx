import { useState, useRef, useEffect, useCallback } from "react";

const DEFAULT_WORDS = [
  { word: "Politician", roots: "poli (city/citizen) + tic (relating to) + ian (person who)", definition: "A person who is active in government or public affairs, especially someone who holds or seeks elected office.", hint: "Don't just say 'a person in government.' Picture one: Where are they? What are they doing? Maybe they're at a podium, shaking hands, making promises to a crowd?" },
  { word: "Asterisk", roots: "aster (star) + isk (small)", definition: "A small star-shaped symbol (*) used in writing to mark a note or reference.", hint: "Picture someone reading a page and noticing a tiny mark next to a word. What does that mark look like? What does it tell the reader to do?" },
  { word: "Intercosmic", roots: "inter (between) + cosm (universe/world) + ic (relating to)", definition: "Relating to the space or activity between worlds, galaxies, or universes.", hint: "Imagine a spaceship traveling from one galaxy to another. What does the space between them look like? How vast is the gap? Describe the journey across that emptiness." },
  { word: "Geologist", roots: "geo (earth) + log (study) + ist (person who)", definition: "A scientist who studies the earth's physical structure, especially rocks, soil, and minerals.", hint: "Paint a scene: Where is this person? Maybe at a canyon, in a lab, out in the field? What tools do they have? What are they looking at or doing with rocks?" },
  { word: "Monolith", roots: "mono (one/single) + lith (stone)", definition: "A single large block of stone, especially one shaped into a pillar or monument.", hint: "Imagine standing in front of it. How tall is it? What does it feel like to touch? Is it alone or surrounded by other things? Make the reader feel its size." },
  { word: "Dendriform", roots: "dendri (tree) + form (shape)", definition: "Having the shape or branching pattern of a tree.", hint: "Picture something that ISN'T a tree but LOOKS like one — maybe frost on a window, lightning in the sky, or veins in a leaf. Describe what it looks like." },
  { word: "Megalopolis", roots: "mega (great/large) + polis (city)", definition: "A very large, heavily populated city or a region made up of several cities that have grown together.", hint: "Imagine flying over it in a plane. What do you see below? Describe the view — how far does it stretch? Can you tell where one city ends and another begins?" },
  { word: "Zooblast", roots: "zoo (animal) + blast (bud/germ/early cell)", definition: "An early or immature animal cell; an animal cell in its earliest stage of development.", hint: "Imagine a scientist peering through a microscope at something tiny. What are they seeing? How small is it? What stage of life is it in? Set the scene in a lab." },
  { word: "Petrology", roots: "petro (rock/stone) + logy (study of)", definition: "The branch of science that studies the origin, composition, and structure of rocks.", hint: "Picture a university class or a research lab. What's on the table? What tools are being used? What are they trying to figure out about the rocks?" },
  { word: "Subterranean", roots: "sub (under/below) + terra (earth/land) + ean (relating to)", definition: "Existing, occurring, or done beneath the earth's surface; underground.", hint: "Put the reader IN the place. How dark is it? What's above you? Can you feel the weight of the earth overhead? Are you in a cave, a tunnel, a bunker?" },
  { word: "Asterozoa", roots: "aster (star) + zoa (animals/living things)", definition: "A group of sea creatures (like starfish and brittle stars) that have star-shaped bodies.", hint: "Picture a tide pool. What's crawling on the rocks? Describe the shape of the creatures, how they move, what the water looks like around them." },
  { word: "Astrologer", roots: "astro (star) + log (study) + er (person who)", definition: "A person who studies the positions of stars and planets and claims to interpret how they influence human lives and events.", hint: "Show this person at work. Maybe they're sitting with a client, pointing at a star chart, making a prediction. What are they telling the person? What are they looking at?" },
  { word: "Cosmos", roots: "cosm (universe/world/order)", definition: "The universe seen as a well-ordered whole; all of space and everything in it.", hint: "Imagine watching a documentary about space. The camera zooms out past planets, past our solar system, past galaxies. Describe what you see — the vastness, the order of it all." },
  { word: "Zooplankton", roots: "zoo (animal) + plankton (wanderer/drifter)", definition: "Tiny animals that float and drift in oceans and lakes, unable to swim against currents.", hint: "Imagine dropping a special camera into the ocean. What do you see floating by? How small are they? Are they swimming or just drifting? What's pushing them along?" },
  { word: "Paleolithic", roots: "paleo (old/ancient) + lith (stone) + ic (relating to)", definition: "Relating to the earliest period of the Stone Age, when humans first used rough stone tools.", hint: "Picture early humans thousands of years ago. What are they holding? What did they make it from? Where are they? Set the scene in a cave or a wild landscape." },
  { word: "Arboriculture", roots: "arbor (tree) + culture (growing/cultivation)", definition: "The practice of growing, managing, and caring for trees and shrubs.", hint: "Show someone working with trees — maybe they're up on a ladder pruning branches, planting saplings in a park, or inspecting a sick oak. What tools do they have?" },
  { word: "Extraterrestrial", roots: "extra (outside/beyond) + terra (earth) + ial (relating to)", definition: "Coming from or existing outside the earth or its atmosphere; from beyond our planet.", hint: "Imagine scientists finding something that clearly didn't come from here. Where did it come from? How do they know it's not from Earth? Describe the discovery." },
  { word: "Petroglyph", roots: "petro (rock/stone) + glyph (carving/writing)", definition: "An image or symbol carved or scratched into a rock surface, especially by prehistoric people.", hint: "Imagine hiking through a desert canyon and finding something on a cliff wall. What does it look like? How old does it seem? Who do you think put it there? Describe finding it." },
  { word: "Lithium", roots: "lith (stone) + ium (chemical element)", definition: "A soft, silver-white chemical element that is the lightest metal, originally discovered in stone minerals.", hint: "Imagine holding a piece of this metal. How does it feel? How heavy is it compared to other metals? What color is it? What kind of rock was it originally found inside?" },
  { word: "Necropolis", roots: "necro (death/dead) + polis (city)", definition: "A large cemetery or burial ground, especially an elaborate one from an ancient city.", hint: "Imagine walking through rows and rows of ancient tombs and stone markers. How big is this place? How old does it feel? What civilization might have built it? Describe what surrounds you." }
];

const RANKS = [
  { min: 0, label: "Apprentice Scribe", icon: "✏️" },
  { min: 50, label: "Word Crafter", icon: "📜" },
  { min: 130, label: "Sentence Smith", icon: "⚒️" },
  { min: 220, label: "Context Commander", icon: "🛡️" },
  { min: 330, label: "Clue Master", icon: "🏆" },
  { min: 460, label: "Grandmaster of Words", icon: "👑" }
];

function getRank(xp) {
  let r = RANKS[0];
  for (const rank of RANKS) { if (xp >= rank.min) r = rank; }
  return r;
}
function getNextRank(xp) {
  for (const rank of RANKS) { if (xp < rank.min) return rank; }
  return null;
}

const CRITERIA = [
  { id: "caps", label: "Used ALL CAPS for context clues", icon: "🔤", pts: 5 },
  { id: "whole_def", label: "Caps describe the WHOLE definition", icon: "🎯", pts: 8 },
  { id: "show_dont_tell", label: "Shows meaning through a scene, not just restating the definition", icon: "🎬", pts: 8 },
  { id: "grammar", label: "Sentence is grammatically correct", icon: "📝", pts: 4 },
  { id: "blank_test", label: "Passes the Blank Test", icon: "🔍", pts: 8 }
];

async function gradeSentence(word, definition, roots, sentence) {
  const prompt = `You are grading a 12-year-old student's vocabulary sentence. The student must write a sentence using the word "${word}" where ALL CAPS words serve as context clues that help the reader understand the word's meaning.

Word: ${word}
Roots: ${roots}
Full definition: ${definition}
Student's sentence: ${sentence}

Grade on these 5 criteria. For each, respond with PASS or FAIL and a short, FRIENDLY explanation (1 sentence max, speak directly to the student using "you"):

1. CAPS_USED: Did the student put context clues in ALL CAPS? (At least some words must be in ALL CAPS that aren't just the vocab word itself)

2. WHOLE_DEFINITION: Do the ALL CAPS words relate to the WHOLE word's definition, not just one root? For example, if the word is "pyrotechnics" (meaning fireworks display), writing "FIRE" only clues the root "pyro" — the caps need to describe a fireworks display. Be generous but accurate.

3. SHOW_DONT_TELL: This is CRITICAL. The sentence must SHOW the meaning through a scene, action, or situation — NOT just restate or paraphrase the dictionary definition with the caps bolted on. The student should paint a picture that LEADS the reader to figure out the meaning.

FAIL examples (just restating the definition):
- "A geologist is a SCIENTIST WHO STUDIES ROCKS AND THE EARTH." ← This just copies the definition. FAIL.
- "The megalopolis was A VERY LARGE CITY WITH MANY PEOPLE." ← This is the definition with caps. FAIL.
- "Subterranean means UNDER THE EARTH'S SURFACE." ← Literally defining the word. FAIL.
- "An astrologer is someone who READS STARS AND CLAIMS TO PREDICT THE FUTURE." ← Just the definition. FAIL.

PASS examples (showing through a scene):
- "The geologist KNELT AT THE EDGE OF THE CANYON, CHIPPING SAMPLES FROM LAYERS OF ANCIENT ROCK with her hammer." ← Paints a picture of what this person does in action.
- "The megalopolis STRETCHED FROM ONE HORIZON TO THE OTHER, with NEIGHBORHOODS THAT USED TO BE SEPARATE TOWNS NOW BLENDING INTO ONE ENDLESS URBAN SPRAWL." ← Shows the scale and merged-cities quality through description.
- "In the subterranean passage, the explorers' headlamps were THE ONLY LIGHT FAR BENEATH THE SURFACE, surrounded by COLD DAMP EARTH ON ALL SIDES." ← You experience being underground.
- "The astrologer TRACED HER FINGER ACROSS A STAR CHART, then told her client that JUPITER'S POSITION MEANT BIG CHANGES WERE COMING in his career." ← Shows the person doing the activity in a scene.

The key test: Does the sentence feel like a SCENE in a movie, or does it feel like a DICTIONARY ENTRY? If it reads like a dictionary, it fails. If you can picture it happening, it passes. Even a short sentence can pass if it has a concrete action, setting, or situation rather than just defining.

4. GRAMMAR: Is the sentence grammatically correct and makes sense?

5. BLANK_TEST: If you covered up the word "${word}", could a reasonable person guess it (or something very close) from ONLY the ALL CAPS words? Be honest but fair.

Also write a short FEEDBACK paragraph (2-3 sentences, friendly and encouraging, addressed to "you"). If they did well, celebrate it. If they need improvement, give ONE specific actionable tip. If they failed SHOW_DONT_TELL, explain the difference between "defining" and "showing" with a concrete suggestion for their specific sentence — like "Instead of saying a geologist STUDIES ROCKS, try putting your geologist somewhere doing something, like kneeling at a canyon wall."

ALSO write an IMPROVED version of their sentence if they scored less than perfect — keep it close to their original idea but transform it into a scene. If perfect, just repeat their sentence.

Respond in this exact JSON format only, no other text:
{"caps_used":{"pass":true,"note":"..."},"whole_definition":{"pass":true,"note":"..."},"show_dont_tell":{"pass":true,"note":"..."},"grammar":{"pass":true,"note":"..."},"blank_test":{"pass":true,"note":"..."},"feedback":"...","improved":"..."}`;
  try {
    const response = await fetch("/api/grade", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt })
    });
    const data = await response.json();
    if (data.error) throw new Error(data.error);
    return JSON.parse(data.text.replace(/```json|```/g, "").trim());
  } catch (e) { console.error(e); return null; }
}

const STORAGE_KEYS = { words: "context-quest-words", progress: "context-quest-progress" };

async function loadData(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch { return fallback; }
}

async function saveData(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { console.error("Save failed:", e); }
}

function StarBar({ filled, total }) {
  return (
    <div style={{ display: "flex", gap: 3 }}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} style={{
          width: 18, height: 18,
          clipPath: "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)",
          background: i < filled ? "#f59e0b" : "#3a3530",
          transition: "background 0.3s", transitionDelay: `${i * 100}ms`
        }} />
      ))}
    </div>
  );
}

function XPBar({ xp }) {
  const rank = getRank(xp);
  const next = getNextRank(xp);
  const pct = next ? ((xp - rank.min) / (next.min - rank.min)) * 100 : 100;
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
        <span style={{ fontSize: 13, fontWeight: 700, fontFamily: "var(--mono)" }}>{rank.icon} {rank.label}</span>
        <span style={{ fontSize: 12, fontFamily: "var(--mono)", color: "#8a8278" }}>{xp} XP {next ? `/ ${next.min}` : "— MAX!"}</span>
      </div>
      <div style={{ height: 10, borderRadius: 5, background: "#2e2a24", overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${Math.min(pct, 100)}%`, background: "linear-gradient(90deg, #b8860b, #f59e0b)", borderRadius: 5, transition: "width 0.8s cubic-bezier(0.22, 1, 0.36, 1)" }} />
      </div>
    </div>
  );
}

function HighlightCaps({ text }) {
  const parts = text.split(/(\b[A-Z][A-Z',/\- ]+[A-Z]\b)/g);
  return <span>{parts.map((p, i) => /^[A-Z][A-Z',/\- ]+[A-Z]$/.test(p) ? <span key={i} style={{ background: "linear-gradient(180deg, transparent 55%, rgba(245,158,11,0.3) 55%)", fontWeight: 700 }}>{p}</span> : <span key={i}>{p}</span>)}</span>;
}

/* ─── WORD EDITOR ─── */
function WordEditor({ words, onSave, onClose }) {
  const [list, setList] = useState(words.map(w => ({ ...w })));
  const [editIdx, setEditIdx] = useState(null);
  const [form, setForm] = useState({ word: "", roots: "", definition: "", hint: "" });
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [saved, setSaved] = useState(false);
  const [importMode, setImportMode] = useState(false);
  const [importText, setImportText] = useState("");

  const openEdit = (idx) => { setEditIdx(idx); setForm({ ...list[idx] }); setConfirmDelete(null); };
  const openAdd = () => { setEditIdx(-1); setForm({ word: "", roots: "", definition: "", hint: "" }); setConfirmDelete(null); };

  const saveItem = () => {
    if (!form.word.trim() || !form.definition.trim()) return;
    const cleaned = { word: form.word.trim(), roots: form.roots.trim(), definition: form.definition.trim(), hint: form.hint.trim() || "Think about what the full word means, not just the roots." };
    if (editIdx === -1) { setList([...list, cleaned]); } else { const u = [...list]; u[editIdx] = cleaned; setList(u); }
    setEditIdx(null);
  };

  const deleteItem = (idx) => { setList(list.filter((_, i) => i !== idx)); setConfirmDelete(null); setEditIdx(null); };
  const moveItem = (idx, dir) => { const n = [...list]; const t = idx + dir; if (t < 0 || t >= n.length) return; [n[idx], n[t]] = [n[t], n[idx]]; setList(n); };
  const handleSaveAll = () => { onSave(list); setSaved(true); setTimeout(() => setSaved(false), 2000); };
  const handleReset = () => { setList(DEFAULT_WORDS.map(w => ({ ...w }))); setEditIdx(null); };

  const handleImport = () => {
    const lines = importText.trim().split("\n").map(l => l.trim()).filter(Boolean);
    const newWords = lines.map(l => ({
      word: l, roots: "", definition: "", hint: "Think about what the full word means, not just the roots."
    }));
    if (newWords.length > 0) { setList([...list, ...newWords]); setImportText(""); setImportMode(false); }
  };

  const inputStyle = {
    width: "100%", padding: "10px 12px", background: "#1a1814", border: "1px solid #3a3530",
    borderRadius: 6, color: "#ede8df", fontSize: 14, fontFamily: "inherit", outline: "none", boxSizing: "border-box"
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <button onClick={onClose} style={{ background: "none", border: "none", color: "#8a8278", fontFamily: "var(--mono)", fontSize: 12, cursor: "pointer" }}>← Back to game</button>
        <button onClick={handleReset} style={{ padding: "6px 12px", background: "#2e2a24", border: "1px solid #3a3530", borderRadius: 6, color: "#8a8278", fontFamily: "var(--mono)", fontSize: 11, cursor: "pointer" }}>Reset defaults</button>
      </div>

      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <div style={{ fontSize: 11, fontFamily: "var(--mono)", color: "#f59e0b", letterSpacing: "0.15em", marginBottom: 4 }}>WORD BANK EDITOR</div>
        <div style={{ fontSize: 13, color: "#8a8278" }}>Add, edit, or remove words. Hit save when done.</div>
      </div>

      {/* Quick import */}
      <button onClick={() => setImportMode(!importMode)} style={{
        display: "block", width: "100%", padding: "10px 14px", marginBottom: 8,
        background: "#252119", border: "1px solid #3a3530", borderRadius: 8,
        color: "#d4c9b8", fontSize: 12, fontFamily: "var(--mono)", cursor: "pointer", textAlign: "left"
      }}>📥 {importMode ? "Hide" : "Quick Import"} — paste a list of words (one per line)</button>

      {importMode && (
        <div style={{ background: "#252119", border: "1px solid #3a3530", borderRadius: 8, padding: "14px", marginBottom: 12, animation: "fadeSlide 0.2s ease" }}>
          <div style={{ fontSize: 11, fontFamily: "var(--mono)", color: "#8a8278", marginBottom: 6 }}>
            Paste words below (one per line). You can fill in roots, definitions, and hints after importing.
          </div>
          <textarea value={importText} onChange={e => setImportText(e.target.value)}
            placeholder={"Pyrotechnics\nBenevolent\nChronology\n..."}
            rows={5} style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6, marginBottom: 8 }} />
          <button onClick={handleImport} disabled={!importText.trim()} style={{
            width: "100%", padding: "10px", background: importText.trim() ? "linear-gradient(90deg, #b8860b, #d4a017)" : "#2e2a24",
            border: "none", borderRadius: 6, color: importText.trim() ? "#1a1814" : "#6b6358",
            fontFamily: "var(--mono)", fontSize: 12, fontWeight: 700, cursor: importText.trim() ? "pointer" : "default"
          }}>Add {importText.trim().split("\n").filter(l => l.trim()).length || 0} Words to Bank</button>
        </div>
      )}

      {/* Edit form */}
      {editIdx !== null && (
        <div style={{ background: "#252119", border: "1px solid #f59e0b44", borderRadius: 10, padding: "18px", marginBottom: 16, animation: "fadeSlide 0.2s ease" }}>
          <div style={{ fontSize: 11, fontFamily: "var(--mono)", color: "#f59e0b", letterSpacing: "0.1em", marginBottom: 12 }}>
            {editIdx === -1 ? "ADD NEW WORD" : `EDITING: ${list[editIdx]?.word}`}
          </div>
          <div style={{ display: "grid", gap: 10 }}>
            <div>
              <label style={{ fontSize: 11, fontFamily: "var(--mono)", color: "#8a8278", display: "block", marginBottom: 3 }}>WORD *</label>
              <input value={form.word} onChange={e => setForm({ ...form, word: e.target.value })} placeholder="e.g. Pyrotechnics" style={inputStyle} />
            </div>
            <div>
              <label style={{ fontSize: 11, fontFamily: "var(--mono)", color: "#8a8278", display: "block", marginBottom: 3 }}>ROOTS (optional but helpful)</label>
              <input value={form.roots} onChange={e => setForm({ ...form, roots: e.target.value })} placeholder="e.g. pyro (fire) + techn (skill/craft)" style={inputStyle} />
            </div>
            <div>
              <label style={{ fontSize: 11, fontFamily: "var(--mono)", color: "#8a8278", display: "block", marginBottom: 3 }}>DEFINITION *</label>
              <textarea value={form.definition} onChange={e => setForm({ ...form, definition: e.target.value })} placeholder="The full definition..." rows={3} style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }} />
            </div>
            <div>
              <label style={{ fontSize: 11, fontFamily: "var(--mono)", color: "#8a8278", display: "block", marginBottom: 3 }}>HINT (thinking prompt for the student)</label>
              <textarea value={form.hint} onChange={e => setForm({ ...form, hint: e.target.value })} placeholder="e.g. Think: what does this look like?" rows={2} style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }} />
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
            <button onClick={() => setEditIdx(null)} style={{ flex: 1, padding: "10px", background: "#2e2a24", border: "1px solid #3a3530", borderRadius: 6, color: "#8a8278", fontFamily: "var(--mono)", fontSize: 12, cursor: "pointer" }}>Cancel</button>
            <button onClick={saveItem} disabled={!form.word.trim() || !form.definition.trim()} style={{
              flex: 1, padding: "10px",
              background: form.word.trim() && form.definition.trim() ? "linear-gradient(90deg, #b8860b, #d4a017)" : "#2e2a24",
              border: "none", borderRadius: 6,
              color: form.word.trim() && form.definition.trim() ? "#1a1814" : "#6b6358",
              fontFamily: "var(--mono)", fontSize: 12, fontWeight: 700,
              cursor: form.word.trim() && form.definition.trim() ? "pointer" : "default"
            }}>{editIdx === -1 ? "Add Word" : "Save Changes"}</button>
          </div>
        </div>
      )}

      {/* Word list */}
      <div style={{ display: "grid", gap: 4, marginBottom: 12 }}>
        {list.map((w, i) => {
          const missing = !w.definition;
          return (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 8, padding: "10px 12px",
              background: missing ? "#2a1e1e" : editIdx === i ? "#2a2510" : "#252119",
              border: `1px solid ${missing ? "#5a3030" : editIdx === i ? "#5a4a20" : "#3a3530"}`,
              borderRadius: 8
            }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <button onClick={() => moveItem(i, -1)} disabled={i === 0} style={{ background: "none", border: "none", color: i === 0 ? "#2e2a24" : "#6b6358", fontSize: 10, cursor: i === 0 ? "default" : "pointer", padding: 0, lineHeight: 1 }}>▲</button>
                <button onClick={() => moveItem(i, 1)} disabled={i === list.length - 1} style={{ background: "none", border: "none", color: i === list.length - 1 ? "#2e2a24" : "#6b6358", fontSize: 10, cursor: i === list.length - 1 ? "default" : "pointer", padding: 0, lineHeight: 1 }}>▼</button>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#ede8df", display: "flex", alignItems: "center", gap: 6 }}>
                  {w.word}
                  {missing && <span style={{ fontSize: 10, color: "#d4544a", fontFamily: "var(--mono)" }}>needs definition</span>}
                </div>
                <div style={{ fontSize: 11, color: "#6b6358", fontFamily: "var(--mono)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {w.roots || "no roots yet"}
                </div>
              </div>
              <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
                <button onClick={() => openEdit(i)} style={{ padding: "6px 10px", background: "#2e2a24", border: "1px solid #3a3530", borderRadius: 5, color: "#d4c9b8", fontSize: 11, fontFamily: "var(--mono)", cursor: "pointer" }}>Edit</button>
                {confirmDelete === i ? (
                  <div style={{ display: "flex", gap: 3 }}>
                    <button onClick={() => deleteItem(i)} style={{ padding: "6px 8px", background: "#5a2020", border: "none", borderRadius: 5, color: "#f5a0a0", fontSize: 11, fontFamily: "var(--mono)", cursor: "pointer" }}>Yes</button>
                    <button onClick={() => setConfirmDelete(null)} style={{ padding: "6px 8px", background: "#2e2a24", border: "1px solid #3a3530", borderRadius: 5, color: "#8a8278", fontSize: 11, fontFamily: "var(--mono)", cursor: "pointer" }}>No</button>
                  </div>
                ) : (
                  <button onClick={() => setConfirmDelete(i)} style={{ padding: "6px 10px", background: "#2e2a24", border: "1px solid #3a3530", borderRadius: 5, color: "#8a6358", fontSize: 11, fontFamily: "var(--mono)", cursor: "pointer" }}>✕</button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {editIdx === null && (
        <button onClick={openAdd} style={{
          display: "block", width: "100%", padding: "12px",
          background: "none", border: "2px dashed #3a3530", borderRadius: 8,
          color: "#8a8278", fontFamily: "var(--mono)", fontSize: 13, cursor: "pointer", marginBottom: 16
        }}>+ Add New Word</button>
      )}

      <button onClick={handleSaveAll} style={{
        display: "block", width: "100%", padding: "14px",
        background: saved ? "#2a3a2a" : "linear-gradient(90deg, #b8860b, #d4a017)",
        border: "none", borderRadius: 8,
        color: saved ? "#6abe6a" : "#1a1814",
        fontFamily: "var(--mono)", fontSize: 14, fontWeight: 700,
        letterSpacing: "0.08em", cursor: "pointer", transition: "all 0.3s"
      }}>{saved ? "✓ SAVED!" : `SAVE WORD BANK (${list.length} words)`}</button>
    </div>
  );
}

/* ─── MAIN GAME ─── */
export default function ContextClueGame() {
  const [screen, setScreen] = useState("home");
  const [words, setWords] = useState(DEFAULT_WORDS);
  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [completedWords, setCompletedWords] = useState({});
  const [currentIdx, setCurrentIdx] = useState(null);
  const [sentence, setSentence] = useState("");
  const [grading, setGrading] = useState(false);
  const [result, setResult] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [showImproved, setShowImproved] = useState(false);
  const [showRubric, setShowRubric] = useState(false);
  const [particles, setParticles] = useState([]);
  const [celebration, setCelebration] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const textareaRef = useRef(null);

  useEffect(() => {
    (async () => {
      const savedWords = await loadData(STORAGE_KEYS.words, null);
      if (savedWords && Array.isArray(savedWords) && savedWords.length > 0) setWords(savedWords);
      const prog = await loadData(STORAGE_KEYS.progress, null);
      if (prog) {
        if (prog.xp !== undefined) setXp(prog.xp);
        if (prog.bestStreak !== undefined) setBestStreak(prog.bestStreak);
        if (prog.completedWords) setCompletedWords(prog.completedWords);
      }
      setLoaded(true);
    })();
  }, []);

  const saveProgress = useCallback(async (newXp, newBest, newCompleted) => {
    await saveData(STORAGE_KEYS.progress, { xp: newXp, bestStreak: newBest, completedWords: newCompleted });
  }, []);

  const word = currentIdx !== null && currentIdx < words.length ? words[currentIdx] : null;

  const startWord = (idx) => {
    if (!words[idx].definition) { setScreen("editor"); return; }
    setCurrentIdx(idx); setSentence(""); setResult(null); setShowHint(false); setShowImproved(false); setScreen("play");
    setTimeout(() => textareaRef.current?.focus(), 100);
  };

  const spawnParticles = () => {
    const p = Array.from({ length: 20 }).map((_, i) => ({
      id: Date.now() + i, x: 30 + Math.random() * 40, y: 40 + Math.random() * 20,
      emoji: ["⭐", "✨", "🌟", "💫", "🔥", "🎯"][Math.floor(Math.random() * 6)],
      dx: (Math.random() - 0.5) * 60, dy: -20 - Math.random() * 40, delay: Math.random() * 0.3
    }));
    setParticles(p);
    setTimeout(() => setParticles([]), 2000);
  };

  const handleSubmit = async () => {
    if (!sentence.trim() || grading || !word) return;
    setGrading(true); setResult(null);
    const res = await gradeSentence(word.word, word.definition, word.roots, sentence.trim());
    setGrading(false);
    if (!res) { setResult({ error: true }); return; }

    const mapping = [
      { key: "caps_used", id: "caps" }, { key: "whole_definition", id: "whole_def" },
      { key: "show_dont_tell", id: "show_dont_tell" },
      { key: "grammar", id: "grammar" }, { key: "blank_test", id: "blank_test" }
    ];
    let earned = 0;
    const scores = {};
    mapping.forEach(({ key, id }) => {
      const passed = res[key]?.pass === true;
      const crit = CRITERIA.find(c => c.id === id);
      scores[id] = { pass: passed, note: res[key]?.note || "", pts: passed ? crit.pts : 0 };
      earned += passed ? crit.pts : 0;
    });
    const stars = mapping.filter(({ key }) => res[key]?.pass).length;
    const perfect = stars === 5;
    const newStreak = perfect ? streak + 1 : 0;
    const streakBonus = perfect && newStreak > 1 ? Math.min(newStreak, 5) * 2 : 0;
    const totalEarned = earned + streakBonus;
    const newXp = xp + totalEarned;
    const newBest = Math.max(newStreak, bestStreak);
    const newCompleted = { ...completedWords, [currentIdx]: Math.max(completedWords[currentIdx] || 0, stars) };

    setXp(newXp); setStreak(newStreak); setBestStreak(newBest); setCompletedWords(newCompleted);
    setResult({ scores, stars, earned, streakBonus, totalEarned, feedback: res.feedback, improved: res.improved, perfect });
    saveProgress(newXp, newBest, newCompleted);
    if (perfect) { setCelebration(true); spawnParticles(); setTimeout(() => setCelebration(false), 1500); }
  };

  const handleRetry = () => { setSentence(""); setResult(null); setShowHint(false); setShowImproved(false); setTimeout(() => textareaRef.current?.focus(), 100); };

  const handleSaveWords = async (newWords) => {
    setWords(newWords);
    await saveData(STORAGE_KEYS.words, newWords);
    setCompletedWords({});
    await saveProgress(xp, bestStreak, {});
  };

  const handleResetProgress = async () => {
    setXp(0); setStreak(0); setBestStreak(0); setCompletedWords({});
    await saveProgress(0, 0, {});
  };

  if (!loaded) return <div style={{ fontFamily: "'Courier New', monospace", display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: "#1a1814", color: "#8a8278" }}>Loading...</div>;

  return (
    <div style={{ "--mono": "'Courier New', monospace", fontFamily: "'Segoe UI', 'Helvetica Neue', sans-serif", minHeight: "100vh", background: "#1a1814", color: "#ede8df", position: "relative", overflow: "hidden" }}>
      {particles.map(p => (
        <div key={p.id} style={{ position: "fixed", left: `${p.x}%`, top: `${p.y}%`, fontSize: 22, pointerEvents: "none", zIndex: 100, animation: "particleFly 1.2s ease-out forwards", animationDelay: `${p.delay}s`, "--dx": `${p.dx}vw`, "--dy": `${p.dy}vh` }}>{p.emoji}</div>
      ))}

      <div style={{ maxWidth: 640, margin: "0 auto", padding: "20px 16px" }}>
        {/* Top bar */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8, paddingBottom: 12, borderBottom: "1px solid #2e2a24" }}>
          <div onClick={() => setScreen("home")} style={{ fontSize: 11, fontFamily: "var(--mono)", letterSpacing: "0.15em", textTransform: "uppercase", color: "#f59e0b", fontWeight: 700, cursor: "pointer" }}>Context Quest</div>
          <div style={{ display: "flex", gap: 14, fontSize: 12, fontFamily: "var(--mono)", color: "#8a8278" }}>
            <span>🔥 {streak}</span>
            <span>🏆 {bestStreak}</span>
            <span>⭐ {xp}</span>
          </div>
        </div>
        <div style={{ marginBottom: 20 }}><XPBar xp={xp} /></div>

        {/* EDITOR */}
        {screen === "editor" && <WordEditor words={words} onSave={handleSaveWords} onClose={() => setScreen("home")} />}

        {/* HOME */}
        {screen === "home" && (
          <div>
            <div style={{ textAlign: "center", padding: "28px 20px", marginBottom: 16, background: "linear-gradient(135deg, #2a2520, #1e1b16)", borderRadius: 10, border: "1px solid #3a3530" }}>
              <div style={{ fontSize: 36, marginBottom: 8 }}>{getRank(xp).icon}</div>
              <h1 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 6px", background: "linear-gradient(90deg, #f59e0b, #fbbf24)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Context Quest</h1>
              <p style={{ fontSize: 13, color: "#8a8278", margin: 0 }}>Write sentences with strong context clues. Earn XP. Rise through the ranks.</p>
            </div>

            <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
              <button onClick={() => setShowRubric(!showRubric)} style={{ flex: 1, padding: "10px 12px", background: "#252119", border: "1px solid #3a3530", borderRadius: 8, color: "#d4c9b8", fontSize: 12, fontFamily: "var(--mono)", cursor: "pointer", textAlign: "center" }}>📋 Rules</button>
              <button onClick={() => setScreen("editor")} style={{ flex: 1, padding: "10px 12px", background: "#252119", border: "1px solid #3a3530", borderRadius: 8, color: "#d4c9b8", fontSize: 12, fontFamily: "var(--mono)", cursor: "pointer", textAlign: "center" }}>✏️ Edit Words</button>
              <button onClick={handleResetProgress} style={{ flex: 1, padding: "10px 12px", background: "#252119", border: "1px solid #3a3530", borderRadius: 8, color: "#8a8278", fontSize: 12, fontFamily: "var(--mono)", cursor: "pointer", textAlign: "center" }}>↺ Reset XP</button>
            </div>

            {showRubric && (
              <div style={{ background: "#252119", border: "1px solid #3a3530", borderRadius: 8, padding: "16px", marginBottom: 16, animation: "fadeSlide 0.3s ease" }}>
                <div style={{ fontSize: 12, color: "#8a8278", margin: "0 0 12px", fontFamily: "var(--mono)" }}>GRADING CRITERIA:</div>
                {CRITERIA.map(c => (
                  <div key={c.id} style={{ display: "flex", gap: 10, alignItems: "center", padding: "8px 0", borderBottom: "1px solid #2e2a24" }}>
                    <span style={{ fontSize: 18 }}>{c.icon}</span>
                    <span style={{ flex: 1, fontSize: 13 }}>{c.label}</span>
                    <span style={{ fontSize: 12, fontFamily: "var(--mono)", color: "#f59e0b", fontWeight: 700 }}>+{c.pts}</span>
                  </div>
                ))}
                <div style={{ marginTop: 12, padding: "10px 12px", background: "#2a2510", borderRadius: 6, fontSize: 12, color: "#d4b860", lineHeight: 1.7, borderLeft: "3px solid #f59e0b" }}>
                  <strong style={{ color: "#f59e0b" }}>🎬 SHOW, DON'T TELL</strong> is the hardest rule. Don't just restate the definition with caps on it. Instead, paint a scene — put a person somewhere, doing something, so the reader figures out the meaning.<br/><br/>
                  <span style={{ color: "#d4544a" }}>❌ "A geologist STUDIES ROCKS AND THE EARTH."</span> ← Just the definition.<br/>
                  <span style={{ color: "#6abe6a" }}>✅ "The geologist KNELT AT THE CANYON WALL, CHIPPING SAMPLES FROM LAYERS OF ANCIENT ROCK."</span> ← A scene!
                </div>
                <div style={{ marginTop: 8, padding: "10px 12px", background: "#1a1814", borderRadius: 6, fontSize: 12, color: "#b8a990", lineHeight: 1.6 }}>
                  <strong style={{ color: "#f59e0b" }}>💡 STREAK BONUS:</strong> Get all 5 in a row for escalating bonus XP!
                </div>
              </div>
            )}

            <div style={{ fontSize: 11, fontFamily: "var(--mono)", color: "#8a8278", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>
              Choose a word ({Object.keys(completedWords).length}/{words.length} attempted)
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
              {words.map((w, i) => {
                const stars = completedWords[i] || 0;
                const perfect = stars === 5;
                const missing = !w.definition;
                return (
                  <button key={i} onClick={() => startWord(i)} style={{
                    padding: "12px 14px",
                    background: missing ? "#2a1e1e" : perfect ? "linear-gradient(135deg, #2a2510, #1e1b10)" : "#252119",
                    border: `1px solid ${missing ? "#5a3030" : perfect ? "#5a4a20" : "#3a3530"}`,
                    borderRadius: 8, cursor: "pointer", textAlign: "left", transition: "all 0.15s", position: "relative"
                  }}>
                    {perfect && <div style={{ position: "absolute", top: 6, right: 8, fontSize: 12 }}>✅</div>}
                    {missing && <div style={{ position: "absolute", top: 6, right: 8, fontSize: 10, color: "#d4544a", fontFamily: "var(--mono)" }}>setup →</div>}
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#ede8df", marginBottom: 4 }}>{w.word}</div>
                    <div style={{ fontSize: 10, fontFamily: "var(--mono)", color: "#6b6358" }}>
                      {w.roots ? w.roots.split("+").map(r => r.trim().split(" ")[0]).join(" + ") : "—"}
                    </div>
                    {stars > 0 && <div style={{ marginTop: 6 }}><StarBar filled={stars} total={5} /></div>}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* PLAY */}
        {screen === "play" && word && (
          <div>
            <button onClick={() => setScreen("home")} style={{ background: "none", border: "none", color: "#8a8278", fontFamily: "var(--mono)", fontSize: 12, cursor: "pointer", padding: "4px 0", marginBottom: 12 }}>← Back to words</button>

            <div style={{ background: "linear-gradient(135deg, #2a2520, #1e1b16)", border: "1px solid #3a3530", borderRadius: 10, padding: "20px", marginBottom: 16, position: "relative" }}>
              {celebration && <div style={{ position: "absolute", inset: 0, borderRadius: 10, border: "2px solid #f59e0b", animation: "glowPulse 0.5s ease-out", pointerEvents: "none" }} />}
              <div style={{ fontSize: 10, fontFamily: "var(--mono)", color: "#6b6358", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 4 }}>WORD {currentIdx + 1} OF {words.length}</div>
              <h2 style={{ fontSize: 26, fontWeight: 700, margin: "0 0 12px", color: "#f59e0b" }}>{word.word}</h2>
              {word.roots && <div style={{ fontSize: 11, fontFamily: "var(--mono)", color: "#8a8278", marginBottom: 6, letterSpacing: "0.05em" }}>ROOTS: {word.roots}</div>}
              <div style={{ fontSize: 14, lineHeight: 1.7, color: "#d4c9b8", padding: "10px 14px", background: "#1a1814", borderRadius: 6, borderLeft: "3px solid #f59e0b" }}>
                <span style={{ fontSize: 10, fontFamily: "var(--mono)", color: "#8a8278" }}>DEFINITION: </span>{word.definition}
              </div>
              {word.hint && (
                <>
                  <button onClick={() => setShowHint(!showHint)} style={{ marginTop: 10, background: "none", border: "none", color: "#6b6358", fontSize: 12, fontFamily: "var(--mono)", cursor: "pointer", padding: "4px 0" }}>
                    {showHint ? "🙈 Hide hint" : "💡 Need a hint?"}
                  </button>
                  {showHint && <div style={{ marginTop: 8, padding: "10px 14px", background: "#2a2510", borderRadius: 6, fontSize: 13, color: "#d4b860", lineHeight: 1.6, animation: "fadeSlide 0.2s ease" }}>{word.hint}</div>}
                </>
              )}
            </div>

            {!result && (
              <div>
                <div style={{ fontSize: 11, fontFamily: "var(--mono)", color: "#8a8278", marginBottom: 6 }}>WRITE YOUR SENTENCE (context clues in ALL CAPS):</div>
                <textarea ref={textareaRef} value={sentence} onChange={e => setSentence(e.target.value)}
                  placeholder={`Write a sentence using "${word.word}" with context clues in ALL CAPS...`}
                  onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSubmit(); } }}
                  style={{ width: "100%", minHeight: 100, padding: "14px 16px", background: "#252119", border: "1px solid #3a3530", borderRadius: 8, color: "#ede8df", fontSize: 15, lineHeight: 1.7, fontFamily: "inherit", resize: "vertical", outline: "none", boxSizing: "border-box" }}
                />
                <button onClick={handleSubmit} disabled={!sentence.trim() || grading} style={{
                  display: "block", width: "100%", marginTop: 10, padding: "14px",
                  background: grading ? "#3a3530" : sentence.trim() ? "linear-gradient(90deg, #b8860b, #d4a017)" : "#3a3530",
                  color: sentence.trim() && !grading ? "#1a1814" : "#6b6358",
                  border: "none", borderRadius: 8, fontFamily: "var(--mono)", fontSize: 14, fontWeight: 700, letterSpacing: "0.08em",
                  cursor: sentence.trim() && !grading ? "pointer" : "default"
                }}>{grading ? "⏳ GRADING..." : "SUBMIT FOR GRADING →"}</button>
              </div>
            )}

            {result?.error && (
              <div style={{ padding: "16px", background: "#3a1515", borderRadius: 8, border: "1px solid #5a2020", fontSize: 14, color: "#f5a0a0", marginTop: 10 }}>
                Something went wrong with grading. Please try again.
                <button onClick={handleRetry} style={{ display: "block", marginTop: 10, padding: "10px 16px", background: "#5a2020", border: "none", borderRadius: 6, color: "#f5a0a0", fontFamily: "var(--mono)", fontSize: 12, cursor: "pointer" }}>RETRY</button>
              </div>
            )}

            {result && !result.error && (
              <div style={{ animation: "fadeSlide 0.4s ease" }}>
                <div style={{
                  textAlign: "center", padding: "20px",
                  background: result.perfect ? "linear-gradient(135deg, #2a2510, #1e1b10)" : "linear-gradient(135deg, #252119, #1e1b16)",
                  border: `1px solid ${result.perfect ? "#5a4a20" : "#3a3530"}`, borderRadius: 10, marginBottom: 12
                }}>
                  <div style={{ marginBottom: 8 }}><StarBar filled={result.stars} total={5} /></div>
                  <div style={{ fontSize: 28, fontWeight: 700, color: result.perfect ? "#f59e0b" : "#d4c9b8", fontFamily: "var(--mono)" }}>
                    {result.perfect ? "PERFECT!" : result.stars >= 4 ? "GREAT JOB!" : result.stars >= 3 ? "GOOD TRY!" : result.stars >= 2 ? "GETTING THERE!" : "KEEP GOING!"}
                  </div>
                  <div style={{ fontSize: 14, fontFamily: "var(--mono)", color: "#f59e0b", fontWeight: 700, marginTop: 4 }}>
                    +{result.totalEarned} XP
                    {result.streakBonus > 0 && <span style={{ color: "#fbbf24", marginLeft: 8, fontSize: 12 }}>(🔥 streak +{result.streakBonus})</span>}
                  </div>
                </div>

                <div style={{ padding: "14px 16px", background: "#252119", borderRadius: 8, border: "1px solid #3a3530", marginBottom: 12, fontSize: 14, lineHeight: 1.7 }}>
                  <div style={{ fontSize: 10, fontFamily: "var(--mono)", color: "#6b6358", marginBottom: 4, letterSpacing: "0.1em" }}>YOUR SENTENCE:</div>
                  <HighlightCaps text={sentence} />
                </div>

                <div style={{ background: "#252119", borderRadius: 8, border: "1px solid #3a3530", overflow: "hidden", marginBottom: 12 }}>
                  {CRITERIA.map((c, i) => {
                    const s = result.scores[c.id];
                    return (
                      <div key={c.id} style={{
                        display: "flex", gap: 10, alignItems: "flex-start", padding: "12px 14px",
                        borderBottom: i < CRITERIA.length - 1 ? "1px solid #2e2a24" : "none",
                        animation: "fadeSlide 0.3s ease", animationDelay: `${i * 0.1}s`, animationFillMode: "both"
                      }}>
                        <div style={{ fontSize: 18, flexShrink: 0, marginTop: 1 }}>{s.pass ? "✅" : "❌"}</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 12, fontWeight: 600, color: s.pass ? "#6abe6a" : "#d4544a", marginBottom: 2 }}>
                            {c.label}
                            <span style={{ float: "right", fontFamily: "var(--mono)", color: s.pass ? "#f59e0b" : "#6b6358" }}>{s.pass ? `+${c.pts}` : "+0"}</span>
                          </div>
                          <div style={{ fontSize: 12, color: "#8a8278", lineHeight: 1.5 }}>{s.note}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div style={{
                  padding: "14px 16px", background: result.perfect ? "#2a2510" : "#1e2530",
                  borderRadius: 8, border: `1px solid ${result.perfect ? "#5a4a20" : "#2a3545"}`,
                  marginBottom: 12, fontSize: 14, lineHeight: 1.7, color: "#d4c9b8"
                }}>
                  <div style={{ fontSize: 10, fontFamily: "var(--mono)", color: result.perfect ? "#d4a017" : "#5a8ab5", marginBottom: 4, letterSpacing: "0.1em" }}>FEEDBACK</div>
                  {result.feedback}
                </div>

                {!result.perfect && (
                  <div>
                    <button onClick={() => setShowImproved(!showImproved)} style={{
                      display: "block", width: "100%", padding: "10px 14px", background: "#252119",
                      border: "1px solid #3a3530", borderRadius: 8, color: "#8a8278", fontSize: 12,
                      fontFamily: "var(--mono)", cursor: "pointer", textAlign: "left", marginBottom: 8
                    }}>✨ {showImproved ? "Hide" : "Show"} improved version</button>
                    {showImproved && (
                      <div style={{ padding: "14px 16px", background: "#1e2a1e", borderRadius: 8, border: "1px solid #2a3a2a", marginBottom: 12, fontSize: 14, lineHeight: 1.7, animation: "fadeSlide 0.2s ease" }}>
                        <HighlightCaps text={result.improved || ""} />
                      </div>
                    )}
                  </div>
                )}

                <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                  <button onClick={handleRetry} style={{
                    flex: 1, padding: "13px", background: "#252119", border: "1px solid #3a3530",
                    borderRadius: 8, color: "#d4c9b8", fontFamily: "var(--mono)", fontSize: 13, fontWeight: 700, cursor: "pointer"
                  }}>🔄 TRY AGAIN</button>
                  {currentIdx < words.length - 1 && (
                    <button onClick={() => startWord(currentIdx + 1)} style={{
                      flex: 1, padding: "13px", background: "linear-gradient(90deg, #b8860b, #d4a017)",
                      border: "none", borderRadius: 8, color: "#1a1814", fontFamily: "var(--mono)",
                      fontSize: 13, fontWeight: 700, cursor: "pointer"
                    }}>NEXT WORD →</button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeSlide { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes glowPulse { 0% { box-shadow: 0 0 0 0 rgba(245, 158, 11, 0.6); } 100% { box-shadow: 0 0 30px 10px rgba(245, 158, 11, 0); } }
        @keyframes particleFly { 0% { transform: translate(0, 0) scale(1); opacity: 1; } 100% { transform: translate(var(--dx), var(--dy)) scale(0.3); opacity: 0; } }
        textarea::placeholder { color: #5a5550; }
        textarea:focus { border-color: #f59e0b !important; }
        button:hover { filter: brightness(1.08); }
      `}</style>
    </div>
  );
}
