"use client";

import { useMemo, useState } from "react";
import { sitePath } from "@/lib/site";

type Question = {
  reference: string;
  question: string;
  answer: string;
  options: string[];
  explanation: string;
};

type Props = { questions: Question[]; passageReference: string };

export default function BibleQuiz({ questions, passageReference }: Props) {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [missed, setMissed] = useState<string[]>([]);

  const current = questions[index];
  const answered = selected !== null;
  const percent = questions.length ? Math.round((score / questions.length) * 100) : 0;

  const encouragement = useMemo(() => {
    if (percent >= 90) return "Excellent. You are paying close attention to the text.";
    if (percent >= 70) return "Good work. Review the questions you missed and return to the passage.";
    return "Keep going. The goal is not just a score—it is understanding the Word.";
  }, [percent]);

  function choose(option: string) {
    if (answered) return;
    setSelected(option);
    if (option === current.answer) setScore((value) => value + 1);
    else setMissed((items) => [...items, current.reference]);
  }

  function next() {
    if (!answered) return;
    if (index === questions.length - 1) setFinished(true);
    else {
      setIndex((value) => value + 1);
      setSelected(null);
    }
  }

  function restart() {
    setIndex(0);
    setSelected(null);
    setScore(0);
    setFinished(false);
    setMissed([]);
  }

  if (!questions.length) return <section className="quiz-card"><p>No quiz questions could be created for this passage yet.</p></section>;

  if (finished) return (
    <section className="quiz-card quiz-results">
      <p className="eyebrow">QUIZ COMPLETE</p>
      <div className="quiz-score">{score}/{questions.length}</div>
      <h2>{percent}% — {encouragement}</h2>
      <p>You tested your understanding of <strong>{passageReference}</strong>. Read the passage again before moving on.</p>
      {missed.length > 0 && <div className="quiz-review"><strong>Review these verses</strong>{missed.map((ref) => <span key={ref}>{ref}</span>)}</div>}
      <div className="action-page-links">
        <button className="secondary-button button-reset" type="button" onClick={restart}>Try again</button>
        <a className="primary-button" href={sitePath(`/ask?reference=${encodeURIComponent(passageReference)}`)}>Study this passage</a>
      </div>
    </section>
  );

  return (
    <section className="quiz-card">
      <div className="quiz-progress"><span>Question {index + 1} of {questions.length}</span><span>{score} correct</span></div>
      <div className="quiz-bar"><span style={{ width: `${((index + 1) / questions.length) * 100}%` }} /></div>
      <p className="eyebrow">{current.reference}</p>
      <h2>{current.question}</h2>
      <div className="quiz-options">
        {current.options.map((option) => {
          const state = answered ? option === current.answer ? "correct" : option === selected ? "wrong" : "" : "";
          return <button key={option} type="button" className={`quiz-option ${state}`} onClick={() => choose(option)} disabled={answered}>
            <span>{option}</span>{state === "correct" && <b>✓</b>}{state === "wrong" && <b>×</b>}
          </button>;
        })}
      </div>
      {answered && <div className={`quiz-feedback ${selected === current.answer ? "good" : "bad"}`}><strong>{selected === current.answer ? "Correct." : "Not quite."}</strong><p>{current.explanation}</p></div>}
      <button className="primary-button quiz-next button-reset" type="button" onClick={next} disabled={!answered}>{index === questions.length - 1 ? "See my result" : "Next question →"}</button>
    </section>
  );
}
