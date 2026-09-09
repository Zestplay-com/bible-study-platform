"use client";

import { useEffect, useState } from "react";
import { sitePath } from "@/lib/site";

type MemoryItem = { reference: string; text: string; remembered: boolean };

const STORAGE_KEY = "bible-study-memory";

export default function MemoryPage() {
  const [reference, setReference] = useState("");
  const [text, setText] = useState("");
  const [items, setItems] = useState<MemoryItem[]>([]);
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setReference(params.get("reference") ?? "");
    setText(params.get("text") ?? "");
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setItems(JSON.parse(saved));
    } catch {
      setItems([]);
    }
  }, []);

  function saveVerse() {
    if (!reference || !text) return;
    const next = [...items.filter((item) => item.reference !== reference), { reference, text, remembered: false }];
    setItems(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }

  function markRemembered() {
    const next = items.map((item) => item.reference === reference ? { ...item, remembered: true } : item);
    setItems(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }

  const saved = items.some((item) => item.reference === reference);

  return (
    <main className="action-page">
      <a className="back-link" href={sitePath("/bible")}>← Back to Bible</a>
      <p className="eyebrow">SCRIPTURE MEMORY</p>
      <h1>Memorize {reference || "a Scripture"}</h1>
      <section className="memory-card">
        <p className="memory-reference">{reference || "Choose a verse from the Bible reader."}</p>
        {showText ? <p className="memory-text">{text}</p> : <div className="memory-hidden">Try to recall the verse before revealing it.</div>}
        {text && <button className="primary-button button-reset" onClick={() => setShowText((value) => !value)}>{showText ? "Hide verse" : "Reveal verse"}</button>}
      </section>
      <div className="action-page-links">
        <button className="secondary-button button-reset" onClick={saveVerse} disabled={!reference || !text}>{saved ? "Saved to memory" : "Save for review"}</button>
        <button className="primary-button button-reset" onClick={markRemembered} disabled={!saved}>{saved ? "I remembered it ✓" : "Save it first"}</button>
      </div>
      <section className="study-card">
        <h2>Your saved verses</h2>
        {items.length === 0 ? <p>No memory verses saved yet. Choose a verse in the Bible reader to begin.</p> : <ul className="memory-list">{items.map((item) => <li key={item.reference}><strong>{item.reference}</strong><span>{item.remembered ? "Remembered ✓" : "Needs review"}</span></li>)}</ul>}
      </section>
    </main>
  );
}
