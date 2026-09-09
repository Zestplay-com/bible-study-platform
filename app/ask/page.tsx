"use client";

import { useEffect, useMemo, useState } from "react";
import { sitePath } from "@/lib/site";
import { getStudyInsight } from "@/lib/study/insights";

type TeacherMode = "explain" | "context" | "original" | "connections" | "apply";
const modes: { id: TeacherMode; label: string }[] = [
  { id: "explain", label: "Explain deeply" },
  { id: "context", label: "Context" },
  { id: "original", label: "Greek / Hebrew" },
  { id: "connections", label: "Bible connections" },
  { id: "apply", label: "Apply it" },
];

export default function AskPage() {
  const [reference, setReference] = useState("Scripture");
  const [text, setText] = useState("");
  const [mode, setMode] = useState<TeacherMode>("explain");
  const [question, setQuestion] = useState("");
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setReference(params.get("reference") ?? "Scripture");
    setText(params.get("text") ?? "");
  }, []);
  const insight = useMemo(() => getStudyInsight(reference), [reference]);

  return (
    <main className="action-page teacher-page">
      <style>{`.teacher-page{max-width:900px}.study-lead{margin:-12px 0 24px;max-width:720px;color:var(--muted);font-size:1.06rem}.teacher-mode-list{display:flex;flex-wrap:wrap;gap:8px;margin:18px 0 28px}.teacher-mode{border:1px solid var(--line);background:var(--surface);color:var(--muted);padding:10px 14px;border-radius:999px;font-size:.8rem;font-weight:800}.teacher-mode.active{background:var(--accent);color:#fff;border-color:var(--accent)}.teacher-dossier{display:grid;gap:14px}.teacher-card{padding:26px;border:1px solid var(--line);border-radius:18px;background:var(--surface)}.teacher-card h2{font-size:1.65rem;margin-bottom:12px}.teacher-card h3{font-size:1rem;margin:24px 0 8px}.teacher-card>p{color:var(--muted)}.teacher-big-idea{border-left:4px solid var(--accent)}.teacher-big-idea p:last-child{font-size:1.1rem;color:var(--text);line-height:1.75}.insight-list{display:grid;gap:13px}.insight-list p{display:grid;grid-template-columns:25px 1fr;gap:8px;margin:0;color:var(--text)}.insight-list span{color:var(--accent);font-weight:900}.word-study-list{display:grid;gap:12px}.word-study-list article{padding:17px;border:1px solid var(--line);border-radius:13px}.word-study-list article>div{display:flex;align-items:baseline;justify-content:space-between;gap:15px}.word-study-list strong{font-size:1.15rem}.word-study-list span{color:var(--accent);font-size:.82rem}.word-study-list p{margin:8px 0 0;font-size:.92rem}.connection-list{display:grid;gap:10px}.connection-list article{padding:16px;border:1px solid var(--line);border-radius:13px}.connection-list strong{color:var(--accent)}.connection-list p{margin:5px 0;color:var(--muted)}.connection-list a{font-size:.78rem;font-weight:800;color:var(--accent)}.prayer-box{margin-top:22px;padding:18px;border-radius:14px;background:var(--background)}.prayer-box p{margin:7px 0 0;font-family:Georgia,serif;color:var(--text)}.teacher-question{margin-top:2px}.teacher-input-row{display:flex;gap:8px}.teacher-input-row input{flex:1;min-width:0;padding:13px 14px;border:1px solid var(--line);border-radius:12px;background:var(--background);outline:none}.teacher-input-row input:focus{border-color:var(--accent);box-shadow:0 0 0 4px var(--focus)}.teacher-note{font-size:.78rem!important;margin-top:12px}.scripture-card{display:grid;gap:8px}.scripture-card strong{font-family:Arial,sans-serif;font-size:.85rem;color:var(--accent)}@media(max-width:600px){.teacher-card{padding:21px}.teacher-input-row{flex-direction:column}.teacher-input-row .primary-button{width:100%}.word-study-list article>div{display:block}.word-study-list span{display:block;margin-top:3px}}`}</style>
      <a className="back-link" href={sitePath("/bible")}>← Back to Bible</a>
      <p className="eyebrow">BIBLE TEACHER</p>
      <h1>Go deeper into {reference}</h1>
      <p className="study-lead">Do not stop at a surface definition. Study the passage, its context, key original-language words, connected Scriptures, and what faithful obedience can look like.</p>
      <blockquote className="scripture-card"><strong>{reference}</strong><span>{text || "Open a verse from the Bible reader to study it here."}</span></blockquote>
      <div className="teacher-mode-list" role="tablist" aria-label="Bible teacher modes">
        {modes.map((item) => <button key={item.id} type="button" className={mode === item.id ? "teacher-mode active" : "teacher-mode"} onClick={() => setMode(item.id)}>{item.label}</button>)}
      </div>
      {insight ? <section className="teacher-dossier">
        <div className="teacher-card teacher-big-idea"><p className="eyebrow">THE BIG IDEA</p><h2>{insight.theme}</h2><p>{insight.bigIdea}</p></div>
        {mode === "explain" && <><div className="teacher-card"><h2>What is God showing here?</h2><div className="insight-list">{insight.whatGodIsShowing.map((item) => <p key={item}><span>✓</span>{item}</p>)}</div></div><div className="teacher-card"><h2>Read the passage in context</h2><p>{insight.context}</p></div></>}
        {mode === "context" && <div className="teacher-card"><p className="eyebrow">CONTEXT</p><h2>Before you apply it</h2><p>{insight.context}</p><h3>Questions to ask</h3><div className="insight-list">{insight.questions.map((item) => <p key={item}><span>?</span>{item}</p>)}</div></div>}
        {mode === "original" && <div className="teacher-card"><p className="eyebrow">ORIGINAL LANGUAGE</p><h2>Words worth slowing down for</h2><div className="word-study-list">{insight.words.map((word) => <article key={word.word}><div><strong>{word.word}</strong><span>{word.original} · {word.transliteration}</span></div><p><b>Meaning:</b> {word.meaning}</p><p><b>Why it matters:</b> {word.whyItMatters}</p></article>)}</div><p className="teacher-note">Original-language notes are study aids, not a replacement for reading the full passage in context.</p></div>}
        {mode === "connections" && <div className="teacher-card"><p className="eyebrow">SCRIPTURE CONNECTS WITH SCRIPTURE</p><h2>Follow the thread</h2><div className="connection-list">{insight.crossReferences.map((item) => <article key={item.reference}><strong>{item.reference}</strong><p>{item.connection}</p><a href={sitePath(`/bible/search?q=${encodeURIComponent(item.reference)}`)}>Open in Bible search →</a></article>)}</div></div>}
        {mode === "apply" && <div className="teacher-card"><p className="eyebrow">FROM KNOWLEDGE TO OBEDIENCE</p><h2>What should change?</h2><div className="insight-list">{insight.application.map((item) => <p key={item}><span>→</span>{item}</p>)}</div><div className="prayer-box"><strong>Turn it into prayer</strong><p>{insight.prayer}</p></div></div>}
        <div className="teacher-card teacher-question"><p className="eyebrow">ASK THE TEACHER</p><h2>What are you still wondering?</h2><div className="teacher-input-row"><input value={question} onChange={(event) => setQuestion(event.target.value)} placeholder={`Ask about ${reference}...`} aria-label={`Ask a question about ${reference}`} /><button type="button" className="primary-button button-reset" disabled={!question.trim()}>Ask</button></div><p className="teacher-note">The AI Teacher connection will use this same grounded structure: Scripture first, context second, interpretation carefully, application clearly.</p></div>
      </section> : <section className="study-card"><h2>Build the full study</h2><p>This passage is not yet in the curated deep-study library. Start with the chapter, compare nearby verses, and use the teacher modes as your study framework.</p><a className="primary-button" href={sitePath("/bible")}>Choose another passage</a></section>}
      <div className="action-page-links"><a className="secondary-button" href={sitePath(`/memory?reference=${encodeURIComponent(reference)}&text=${encodeURIComponent(text)}`)}>Build a memory review</a><a className="primary-button" href={sitePath(`/notes?reference=${encodeURIComponent(reference)}&text=${encodeURIComponent(text)}`)}>Take a study note</a></div>
    </main>
  );
}
