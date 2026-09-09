"use client";

import { useEffect, useMemo, useState } from "react";
import { sitePath } from "@/lib/site";
import {
  getMemoryStatus,
  getNextMemoryLevel,
  getNextReviewAt,
  getReviewIntervalDays,
  isMemoryDue,
  type MemoryRating,
} from "@/lib/memory";

type MemoryItem = {
  reference: string;
  text: string;
  remembered: boolean;
  level: number;
  nextReview: number;
};

const STORAGE_KEY = "bible-study-memory";

function normalizeItem(item: MemoryItem): MemoryItem {
  return {
    ...item,
    level: item.level ?? 0,
    nextReview: item.nextReview ?? Date.now(),
  };
}

function formatReviewDate(timestamp: number) {
  if (isMemoryDue(timestamp)) return "Due today";
  return `Next review ${new Date(timestamp).toLocaleDateString(undefined, { month: "short", day: "numeric" })}`;
}

export default function MemoryPage() {
  const [reference, setReference] = useState("");
  const [text, setText] = useState("");
  const [items, setItems] = useState<MemoryItem[]>([]);
  const [answer, setAnswer] = useState("");
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState<MemoryRating | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setReference(params.get("reference") ?? "");
    setText(params.get("text") ?? "");
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setItems((JSON.parse(saved) as MemoryItem[]).map(normalizeItem));
    } catch {
      setItems([]);
    }
  }, []);

  function persist(next: MemoryItem[]) {
    setItems(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Storage can be unavailable in private or restricted browser contexts.
    }
  }

  function openReview(item: MemoryItem) {
    setReference(item.reference);
    setText(item.text);
    setAnswer("");
    setRevealed(false);
    setScore(null);
    window.history.replaceState(null, "", sitePath(`/memory?reference=${encodeURIComponent(item.reference)}&text=${encodeURIComponent(item.text)}`));
  }

  function startDueReview() {
    const due = items
      .filter((item) => isMemoryDue(item.nextReview))
      .sort((a, b) => a.nextReview - b.nextReview)[0];
    if (due) openReview(due);
  }

  function saveVerse() {
    if (!reference || !text) return;
    const old = items.find((item) => item.reference === reference);
    const next = [
      ...items.filter((item) => item.reference !== reference),
      old ?? { reference, text, remembered: false, level: 0, nextReview: Date.now() },
    ];
    persist(next);
  }

  function review(rating: MemoryRating) {
    if (!reference) return;
    const current = items.find((item) => item.reference === reference);
    if (!current) return;
    const level = getNextMemoryLevel(current.level, rating);
    const nextReview = getNextReviewAt(current.level, rating);
    const remembered = level >= 5;
    persist(items.map((item) =>
      item.reference === reference
        ? { ...item, level, remembered, nextReview }
        : item,
    ));
    setScore(rating);
    setRevealed(false);
    setAnswer("");
  }

  const current = useMemo(() => items.find((item) => item.reference === reference), [items, reference]);
  const dueItems = useMemo(() => items.filter((item) => isMemoryDue(item.nextReview)), [items]);
  const masteredCount = items.filter((item) => item.level >= 5).length;
  const cloze = text
    ? text.split(/\s+/).map((word, index) => index % 5 === 0 ? "_____" : word).join(" ")
    : "";
  const status = current ? getMemoryStatus(current.level) : "Learning";

  return (
    <main className="action-page memory-page">
      <style>{`.memory-page{max-width:850px}.memory-lede{color:var(--muted);max-width:650px;margin:-10px 0 24px}.memory-card{display:grid;gap:16px}.memory-reference{font-size:.85rem}.memory-challenge{padding:20px;border-radius:14px;background:var(--background)}.memory-challenge p{margin:0;font-family:Georgia,serif;font-size:1.16rem;line-height:1.8}.memory-answer{display:grid;gap:8px}.memory-answer label{font-size:.82rem;font-weight:800}.memory-answer textarea{width:100%;min-height:110px;padding:13px;border:1px solid var(--line);border-radius:12px;background:var(--surface);font:inherit;resize:vertical}.memory-controls{display:flex;flex-wrap:wrap;gap:8px}.memory-review{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-top:12px}.memory-review button{min-height:54px;border:1px solid var(--line);border-radius:12px;background:var(--surface);font-weight:800;cursor:pointer}.memory-review button:hover{border-color:var(--accent);transform:translateY(-1px)}.memory-rating-note{display:block;margin-top:4px;color:var(--muted);font-size:.72rem;font-weight:500}.memory-stat{display:flex;flex-wrap:wrap;gap:8px;margin:0 0 18px}.memory-stat span{padding:7px 10px;border:1px solid var(--line);border-radius:999px;color:var(--muted);font-size:.78rem;font-weight:800}.memory-success{padding:12px 14px;border-radius:12px;background:var(--background);font-size:.85rem}.memory-level{color:var(--accent)!important}.memory-queue{display:grid;gap:8px}.memory-queue button{display:flex;justify-content:space-between;gap:12px;text-align:left;padding:13px;border:1px solid var(--line);border-radius:12px;background:var(--surface);cursor:pointer}.memory-queue button strong{display:block}.memory-queue button span{display:block;color:var(--muted);font-size:.75rem;margin-top:3px}.memory-list li{align-items:center}.memory-list li a{color:var(--accent);font-size:.8rem;font-weight:800}.memory-actions{display:flex;flex-wrap:wrap;gap:8px}.memory-actions>*{flex:1}.memory-empty{color:var(--muted)}@media(max-width:620px){.memory-review{grid-template-columns:1fr 1fr}.memory-actions>*{flex-basis:100%}}@media(max-width:420px){.memory-review{grid-template-columns:1fr}.memory-challenge p{font-size:1.05rem}}`}</style>

      <a className="back-link" href={sitePath("/bible")}>← Back to Bible</a>
      <p className="eyebrow">SCRIPTURE MEMORY</p>
      <h1>Remember the Word, not just read it.</h1>
      <p className="memory-lede">Recall it first. Check yourself second. Then rate how difficult it felt so the next review is scheduled for you.</p>

      <div className="memory-stat">
        <span>{items.length} saved</span>
        <span>{dueItems.length} due now</span>
        <span>{masteredCount} mastered</span>
      </div>

      {!reference && dueItems.length > 0 && (
        <section className="study-card memory-queue">
          <div>
            <h2>Review due</h2>
            <p>Start with the verse that has waited the longest.</p>
          </div>
          <button type="button" onClick={startDueReview}>
            <span><strong>{dueItems[0].reference}</strong><span>{getMemoryStatus(dueItems[0].level)} · {formatReviewDate(dueItems[0].nextReview)}</span></span>
            <strong>Review →</strong>
          </button>
        </section>
      )}

      <section className="memory-card study-card">
        <p className="memory-reference">{reference || "Choose a verse from the Bible reader."}</p>
        {text ? (
          <>
            <div className="memory-answer">
              <label htmlFor="memory-answer">What do you remember?</label>
              <textarea
                id="memory-answer"
                value={answer}
                onChange={(event) => setAnswer(event.target.value)}
                placeholder="Type the verse from memory before you reveal it."
                disabled={revealed}
              />
            </div>
            <div className="memory-challenge"><p>{revealed ? text : cloze}</p></div>
            <div className="memory-controls">
              <button type="button" className="secondary-button button-reset" onClick={() => setRevealed(true)} disabled={revealed}>
                {revealed ? "Verse revealed" : "Reveal & check"}
              </button>
              <button type="button" className="secondary-button button-reset" onClick={() => { setAnswer(""); setRevealed(false); setScore(null); }}>
                Try again
              </button>
            </div>
          </>
        ) : (
          <div className="memory-hidden">Open a verse from the Bible reader to begin an active recall session.</div>
        )}

        {current && revealed && (
          <div>
            <p className="memory-reference">How did that recall feel? Your answer changes the next review.</p>
            <div className="memory-review">
              {(["again", "hard", "good", "easy"] as MemoryRating[]).map((rating) => (
                <button key={rating} type="button" onClick={() => review(rating)}>
                  {rating === "again" ? "Again" : rating === "hard" ? "Hard" : rating === "good" ? "Good" : "Easy"}
                  <span className="memory-rating-note">{getReviewIntervalDays(current.level, rating)} day{getReviewIntervalDays(current.level, rating) === 1 ? "" : "s"}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {score && current && (
          <div className="memory-success">
            Review recorded. <span className="memory-level">{getMemoryStatus(current.level)} · Level {current.level}/5</span>. {formatReviewDate(current.nextReview)}.
          </div>
        )}
      </section>

      <div className="memory-actions">
        <button className="secondary-button button-reset" onClick={saveVerse} disabled={!reference || !text}>
          {current ? "Saved to memory" : "Save for review"}
        </button>
        <a className="primary-button" href={sitePath("/study?minutes=5")}>Study this Scripture</a>
      </div>

      <section className="study-card">
        <h2>Your saved verses</h2>
        {items.length === 0 ? (
          <p className="memory-empty">No memory verses saved yet. Choose a verse in the Bible reader to begin.</p>
        ) : (
          <ul className="memory-list">
            {items.map((item) => (
              <li key={item.reference}>
                <div>
                  <strong>{item.reference}</strong>
                  <span>{getMemoryStatus(item.level)} · Level {item.level}/5 · {formatReviewDate(item.nextReview)}</span>
                </div>
                <button type="button" className="button-reset" onClick={() => openReview(item)}>Review →</button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
