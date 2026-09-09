"use client";

import { FormEvent, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { sitePath } from "@/lib/site";

type Note = { id: string; reference: string; text: string; note: string };
const STORAGE_KEY = "bible-study-notes";

export default function NotesPage() {
  const params = useSearchParams();
  const reference = params.get("reference") ?? "";
  const text = params.get("text") ?? "";
  const [notes, setNotes] = useState<Note[]>([]);
  const [note, setNote] = useState("");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setNotes(JSON.parse(saved));
    } catch {
      setNotes([]);
    }
  }, []);

  function addNote(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!note.trim()) return;
    const next = [{ id: crypto.randomUUID(), reference: reference || "General note", text, note: note.trim() }, ...notes];
    setNotes(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setNote("");
  }

  function deleteNote(id: string) {
    const next = notes.filter((item) => item.id !== id);
    setNotes(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }

  return (
    <main className="action-page">
      <a className="back-link" href={sitePath("/bible")}>← Back to Bible</a>
      <p className="eyebrow">PERSONAL NOTES</p>
      <h1>{reference ? `Note on ${reference}` : "Your Bible notes"}</h1>
      {text && <blockquote className="scripture-card">{text}</blockquote>}
      <form className="note-form" onSubmit={addNote}>
        <label htmlFor="note">What did you learn?</label>
        <textarea id="note" value={note} onChange={(event) => setNote(event.target.value)} placeholder="Write a thought, question, lesson, or application..." rows={6} />
        <button className="primary-button button-reset" type="submit">Save note</button>
      </form>
      <section className="study-card">
        <h2>Saved notes</h2>
        {notes.length === 0 ? <p>No notes yet. Open a verse and write your first study thought.</p> : <div className="notes-list">{notes.map((item) => <article className="saved-note" key={item.id}><div><strong>{item.reference}</strong><p>{item.note}</p>{item.text && <small>{item.text}</small>}</div><button className="text-button" onClick={() => deleteNote(item.id)}>Delete</button></article>)}</div>}
      </section>
    </main>
  );
}
