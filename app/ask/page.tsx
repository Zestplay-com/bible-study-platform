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
      <a className="back-link" href={sitePath("/bible")}>← Back to Bible</a>
      <p className="eyebrow">BIBLE TEACHER</p>
      <h1>Go deeper into {reference}</h1>
      <p className="study-lead">Do not stop at a surface definition. Study the passage, its context, key original-language words, connected Scriptures, and what faithful obedience can look like.</p>

      <blockquote className="scripture-card">
        <strong>{reference}</strong>
        <span>{text || "Open a verse from the Bible reader to study it here."}</span>
      </blockquote>

      <div className="teacher-mode-list" role="tablist" aria-label="Bible teacher modes">
        {modes.map((item) => (
          <button key={item.id} type="button" className={mode === item.id ? "teacher-mode active" : "teacher-mode"} onClick={() => setMode(item.id)}>{item.label}</button>
        ))}
      </div>

      {insight ? (
        <section className="teacher-dossier">
          <div className="teacher-card teacher-big-idea">
            <p className="eyebrow">THE BIG IDEA</p>
            <h2>{insight.theme}</h2>
            <p>{insight.bigIdea}</p>
          </div>

          {mode === "explain" && <>
            <div className="teacher-card">
              <h2>What is God showing here?</h2>
              <div className="insight-list">{insight.whatGodIsShowing.map((item) => <p key={item}><span>✓</span>{item}</p>)}</div>
            </div>
            <div className="teacher-card">
              <h2>Read the passage in context</h2>
              <p>{insight.context}</p>
            </div>
          </>}

          {mode === "context" && <div className="teacher-card"><p className="eyebrow">CONTEXT</p><h2>Before you apply it</h2><p>{insight.context}</p><h3>Questions to ask</h3><div className="insight-list">{insight.questions.map((item) => <p key={item}><span>?</span>{item}</p>)}</div></div>}

          {mode === "original" && <div className="teacher-card"><p className="eyebrow">ORIGINAL LANGUAGE</p><h2>Words worth slowing down for</h2><div className="word-study-list">{insight.words.map((word) => <article key={word.word}><div><strong>{word.word}</strong><span>{word.original} · {word.transliteration}</span></div><p><b>Meaning:</b> {word.meaning}</p><p><b>Why it matters:</b> {word.whyItMatters}</p></article>)}</div><p className="teacher-note">Original-language notes are study aids, not a replacement for reading the full passage in context.</p></div>}

          {mode === "connections" && <div className="teacher-card"><p className="eyebrow">SCRIPTURE CONNECTS WITH SCRIPTURE</p><h2>Follow the thread</h2><div className="connection-list">{insight.crossReferences.map((item) => <article key={item.reference}><strong>{item.reference}</strong><p>{item.connection}</p><a href={sitePath(`/bible/search?q=${encodeURIComponent(item.reference)}`)}>Open in Bible search →</a></article>)}</div></div>}

          {mode === "apply" && <div className="teacher-card"><p className="eyebrow">FROM KNOWLEDGE TO OBEDIENCE</p><h2>What should change?</h2><div className="insight-list">{insight.application.map((item) => <p key={item}><span>→</span>{item}</p>)}</div><div className="prayer-box"><strong>Turn it into prayer</strong><p>{insight.prayer}</p></div></div>}

          <div className="teacher-card teacher-question">
            <p className="eyebrow">ASK THE TEACHER</p>
            <h2>What are you still wondering?</h2>
            <div className="teacher-input-row"><input value={question} onChange={(event) => setQuestion(event.target.value)} placeholder={`Ask about ${reference}...`} aria-label={`Ask a question about ${reference}`} /><button type="button" className="primary-button button-reset" disabled={!question.trim()}>Ask</button></div>
            <p className="teacher-note">The full AI Teacher connection will use this same grounded study structure: Scripture first, context second, interpretation carefully, application clearly.</p>
          </div>
        </section>
      ) : (
        <section className="study-card"><h2>Build the full study</h2><p>This passage is not yet in the curated deep-study library. Start with the chapter, compare nearby verses, and use the teacher modes above as the study framework.</p><a className="primary-button" href={sitePath("/bible")}>Choose another passage</a></section>
      )}

      <div className="action-page-links">
        <a className="secondary-button" href={sitePath(`/memory?reference=${encodeURIComponent(reference)}&text=${encodeURIComponent(text)}`)}>Build a memory review</a>
        <a className="primary-button" href={sitePath(`/notes?reference=${encodeURIComponent(reference)}&text=${encodeURIComponent(text)}`)}>Take a study note</a>
      </div>
    </main>
  );
}
