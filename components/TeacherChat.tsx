"use client";

import { FormEvent, useState } from "react";

type Props = { reference: string };

type QuickPrompt = { label: string; prompt: string };

const quickPrompts: QuickPrompt[] = [
  { label: "Explain deeply", prompt: "Explain this passage deeply. What does it mean in its immediate context, and what is the main truth I should understand?" },
  { label: "Context", prompt: "Explain the historical, literary, and immediate biblical context of this passage. How does the surrounding chapter help me understand it?" },
  { label: "Greek / Hebrew", prompt: "What are the most important Greek or Hebrew words behind this passage? Explain only what can be responsibly established from the supplied study notes and context." },
  { label: "Bible connections", prompt: "Show me the most important Bible connections for this passage. Explain how each connection supports, expands, or balances the meaning rather than just matching words." },
  { label: "Apply it", prompt: "How should this passage change what I believe, how I live, what I pray, and what I do today? Give me concrete applications grounded in the text." },
];

export default function TeacherChat({ reference }: Props) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function ask(clean: string) {
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

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await ask(question.trim());
  }

  return (
    <div className="teacher-chat">
      <div className="teacher-quick-prompts" aria-label="Quick Bible Teacher modes">
        {quickPrompts.map((item) => (
          <button key={item.label} type="button" className="teacher-quick-prompt" onClick={() => void ask(item.prompt)} disabled={loading}>
            {item.label}
          </button>
        ))}
      </div>
      <form onSubmit={submit} className="teacher-chat-form">
        <input value={question} onChange={(event) => setQuestion(event.target.value)} maxLength={1200} placeholder={`What do you want to understand about ${reference}?`} aria-label={`Ask the Bible Teacher about ${reference}`} disabled={loading} />
        <button type="submit" className="primary-button button-reset" disabled={loading || question.trim().length < 3}>
          {loading ? "Thinking…" : "Ask"}
        </button>
      </form>
      <p className="teacher-chat-hint">Choose a study mode for a guided answer, or ask your own question. The Teacher stays grounded in the selected passage and Bible context.</p>
      {error && <div className="teacher-chat-error" role="alert">{error}</div>}
      {answer && <article className="teacher-chat-answer"><p className="eyebrow">TEACHER'S ANSWER</p><div>{answer}</div></article>}
    </div>
  );
}
