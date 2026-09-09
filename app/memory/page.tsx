"use client";

import { useEffect, useMemo, useState } from "react";
import { sitePath } from "@/lib/site";

type MemoryItem = { reference: string; text: string; remembered: boolean; level: number; nextReview: number };
const STORAGE_KEY = "bible-study-memory";

function normalizeItem(item: MemoryItem): MemoryItem {
  return { ...item, level: item.level ?? 0, nextReview: item.nextReview ?? Date.now() };
}

export default function MemoryPage() {
  const [reference, setReference] = useState("");
  const [text, setText] = useState("");
  const [items, setItems] = useState<MemoryItem[]>([]);
  const [showText, setShowText] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState<"easy" | "hard" | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setReference(params.get("reference") ?? "");
    setText(params.get("text") ?? "");
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setItems((JSON.parse(saved) as MemoryItem[]).map(normalizeItem));
    } catch { setItems([]); }
  }, []);

  function persist(next: MemoryItem[]) {
    setItems(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }

  function saveVerse() {
    if (!reference || !text) return;
    const old = items.find((item) => item.reference === reference);
    const next = [...items.filter((item) => item.reference !== reference), old ?? { reference, text, remembered: false, level: 0, nextReview: Date.now() }];
    persist(next);
  }

  function review(difficulty: "easy" | "hard") {
    if (!reference) return;
    const current = items.find((item) => item.reference === reference);
    if (!current) return;
    const level = difficulty === "easy" ? Math.min(5, current.level + 1) : Math.max(0, current.level - 1);
    const days = difficulty === "easy" ? [1, 2, 4, 7, 14, 30][level] : 1;
    persist(items.map((item) => item.reference === reference ? { ...item, level, remembered: difficulty === "easy" && level >= 2, nextReview: Date.now() + days * 86400000 } : item));
    setScore(difficulty);
    setRevealed(false);
    setShowText(false);
  }

  const current = useMemo(() => items.find((item) => item.reference === reference), [items, reference]);
  const dueCount = items.filter((item) => item.nextReview <= Date.now()).length;
  const cloze = text ? text.split(" ").map((word, index) => index % 5 === 0 ? "_____" : word).join(" ") : "";

  return (
    <main className="action-page memory-page">
      <style>{`.memory-page{max-width:850px}.memory-lede{color:var(--muted);max-width:650px;margin:-10px 0 24px}.memory-card{display:grid;gap:16px}.memory-reference{font-size:.85rem}.memory-challenge{padding:20px;border-radius:14px;background:var(--background)}.memory-challenge p{margin:0;font-family:Georgia,serif;font-size:1.16rem;line-height:1.8}.memory-controls{display:flex;flex-wrap:wrap;gap:8px}.memory-review{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:12px}.memory-review button{min-height:48px;border:1px solid var(--line);border-radius:12px;background:var(--surface);font-weight:800}.memory-review button:hover{border-color:var(--accent)}.memory-stat{display:flex;flex-wrap:wrap;gap:8px;margin:0 0 18px}.memory-stat span{padding:7px 10px;border:1px solid var(--line);border-radius:999px;color:var(--muted);font-size:.78rem;font-weight:800}.memory-success{padding:12px 14px;border-radius:12px;background:var(--background);font-size:.85rem}.memory-level{color:var(--accent)!important}.memory-list li{align-items:center}.memory-list li a{color:var(--accent);font-size:.8rem;font-weight:800}@media(max-width:520px){.memory-review{grid-template-columns:1fr}.memory-controls>*{width:100%}}`}</style>
      <a className="back-link" href={sitePath("/bible")}>← Back to Bible</a>
      <p className="eyebrow">SCRIPTURE MEMORY</p>
      <h1>Remember the Word, not just read it.</h1>
      <p className="memory-lede">Real memory practice should make you retrieve Scripture, check yourself, and return to it at increasing intervals.</p>
      <div className="memory-stat"><span>{items.length} saved</span><span>{dueCount} due for review</span><span>5-level review</span></div>

      <section className="memory-card">
        <p className="memory-reference">{reference || "Choose a verse from the Bible reader."}</p>
        {text ? <div className="memory-challenge"><p>{revealed ? text : cloze}</p></div> : <div className="memory-hidden">Open a verse from the Bible reader to begin an active recall session.</div>}
        {text && <div className="memory-controls"><button className="secondary-button button-reset" onClick={() => { setRevealed(true); setShowText(true); }}>{revealed ? "Verse revealed" : "Check my answer"}</button><button className="secondary-button button-reset" onClick={() => setShowText((value) => !value)}>{showText ? "Hide verse" : "Show full verse"}</button></div>}
        {current && <div className="memory-review"><button type="button" onClick={() => review("hard")}>I struggled</button><button type="button" onClick={() => review("easy")}>I knew it ✓</button></div>}
        {score && <div className="memory-success">Review recorded. Your next review has been scheduled. <span className="memory-level">Level {current?.level ?? 0}/5</span></div>}
      </section>

      <div className="action-page-links"><button className="secondary-button button-reset" onClick={saveVerse} disabled={!reference || !text}>{current ? "Saved to memory" : "Save for review"}</button><a className="primary-button" href={sitePath("/study?minutes=5")}>Study this Scripture</a></div>

      <section className="study-card"><h2>Your saved verses</h2>{items.length === 0 ? <p>No memory verses saved yet. Choose a verse in the Bible reader to begin.</p> : <ul className="memory-list">{items.map((item) => <li key={item.reference}><div><strong>{item.reference}</strong><span>{item.remembered ? "Remembered ✓" : "Needs review"} · Level {item.level}/5</span></div><a href={sitePath(`/memory?reference=${encodeURIComponent(item.reference)}&text=${encodeURIComponent(item.text)}`)}>Review →</a></li>)}</ul>}</section>
    </main>
  );
}
