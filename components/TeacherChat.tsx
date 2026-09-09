"use client";

import { FormEvent, useState } from "react";

type Props = { reference: string };

export default function TeacherChat({ reference }: Props) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const clean = question.trim();
    if (clean.length < 3 || loading) return;

    setLoading(true);
    setError("");
    setAnswer("");
    try {
      const response = await fetch("/api/teacher", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reference, question: clean }),
      });
      const data = await response.json() as { answer?: string; error?: string };
      if (!response.ok) throw new Error(data.error ?? "The Teacher could not answer.");
      setAnswer(data.answer ?? "No answer was returned.");
      setQuestion("");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="teacher-chat">
      <form onSubmit={submit} className="teacher-chat-form">
        <input
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          maxLength={1200}
          placeholder={`What do you want to understand about ${reference}?`}
          aria-label={`Ask the Bible Teacher about ${reference}`}
          disabled={loading}
        />
        <button type="submit" className="primary-button button-reset" disabled={loading || question.trim().length < 3}>
          {loading ? "Thinking…" : "Ask"}
        </button>
      </form>
      <p className="teacher-chat-hint">Ask about meaning, context, Greek/Hebrew, another Bible connection, or how to apply the passage.</p>
      {error && <div className="teacher-chat-error" role="alert">{error}</div>}
      {answer && <article className="teacher-chat-answer"><p className="eyebrow">TEACHER'S ANSWER</p><div>{answer}</div></article>}
    </div>
  );
}
