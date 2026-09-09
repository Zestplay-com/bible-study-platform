"use client";

import { useSearchParams } from "next/navigation";
import { sitePath } from "@/lib/site";

export default function AskPage() {
  const params = useSearchParams();
  const reference = params.get("reference") ?? "Scripture";
  const text = params.get("text") ?? "";

  return (
    <main className="action-page">
      <a className="back-link" href={sitePath("/bible")}>← Back to Bible</a>
      <p className="eyebrow">UNDERSTAND THE WORD</p>
      <h1>Explain {reference}</h1>
      <blockquote className="scripture-card">{text || "Open a verse from the Bible reader to see it here."}</blockquote>
      <section className="study-card">
        <h2>What should I look for?</h2>
        <p>Start with the words in the verse. Ask what the writer is saying, who is being addressed, and what the verse teaches in its surrounding passage.</p>
        <h3>Context matters</h3>
        <p>Read the verses before and after this Scripture before forming an application. A verse should be understood in its chapter, book, and wider biblical context.</p>
        <h3>Next step</h3>
        <p>Read the full chapter, write down one truth you learned, and choose one practical way to live it out today.</p>
      </section>
      <div className="action-page-links">
        <a className="secondary-button" href={sitePath(`/memory?reference=${encodeURIComponent(reference)}&text=${encodeURIComponent(text)}`)}>Memorize this verse</a>
        <a className="primary-button" href={sitePath(`/notes?reference=${encodeURIComponent(reference)}&text=${encodeURIComponent(text)}`)}>Take a note</a>
      </div>
    </main>
  );
}
