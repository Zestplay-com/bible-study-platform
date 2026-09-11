import { sitePath } from "@/lib/site";
import { defaultTranslationId } from "@/lib/bible/translations";
import { getBibleProvider } from "@/lib/bible/registry";
import { parseBibleReference } from "@/lib/bible/reference";
import BibleQuiz from "@/components/BibleQuiz";

type Props = { searchParams: Promise<{ reference?: string; difficulty?: string }> };

type Question = {
  reference: string;
  question: string;
  answer: string;
  options: string[];
  explanation: string;
  kind: "Recall" | "Understand" | "Context" | "Apply";
};

function deterministicOptions(correct: string, alternatives: string[]) {
  return [correct, ...alternatives.filter((item) => item !== correct).slice(0, 2)];
}

function makeQuestions(reference: string, chapter: { reference: string; text: string }[], difficulty: string): Question[] {
  if (!chapter.length) return [];
  const candidates = chapter.filter((verse) => verse.text.trim().length >= 18);
  const target = candidates.find((verse) => verse.reference.toLowerCase() === reference.toLowerCase()) ?? candidates[0];
  const neighbors = candidates.filter((verse) => verse.reference !== target.reference);
  const selected = [target, ...neighbors.slice(0, 4)];
  const questions: Question[] = [];

  for (const [index, verse] of selected.entries()) {
    const distractors = candidates.filter((item) => item.reference !== verse.reference).slice(0, 4).map((item) => item.text);
    const kind = index === 0 ? "Understand" : index === 1 ? "Context" : "Recall";
    const question = kind === "Understand"
      ? `What is the clearest main idea of ${verse.reference}?`
      : kind === "Context"
        ? `Which statement is actually found in ${verse.reference}, in its biblical context?`
        : `Which statement is actually found in ${verse.reference}?`;
    questions.push({
      reference: verse.reference,
      question,
      answer: verse.text,
      options: deterministicOptions(verse.text, distractors).sort((a, b) => a.localeCompare(b)),
      explanation: kind === "Understand"
        ? `${verse.reference} says: “${verse.text}” Start with this wording, then read the surrounding verses before turning the passage into an application.`
        : kind === "Context"
          ? `The answer is the exact wording of ${verse.reference}. Read the verses before and after it to understand how the statement functions in the chapter.`
          : `The answer comes directly from ${verse.reference}: “${verse.text}” The goal is to recognize Scripture accurately before relying on memory or assumptions.`,
      kind,
    });
  }

  if (difficulty === "hard" && candidates.length >= 6) {
    const extra = candidates[5];
    questions.push({
      reference: extra.reference,
      question: `Why does the wording of ${extra.reference} matter when you apply this chapter?`,
      answer: extra.text,
      options: deterministicOptions(extra.text, candidates.filter((item) => item.reference !== extra.reference).slice(0, 3).map((item) => item.text)).sort((a, b) => a.localeCompare(b)),
      explanation: `A faithful application begins with the actual wording of the passage. ${extra.reference} says: “${extra.text}”`,
      kind: "Apply",
    });
  }
  return questions;
}

export default async function QuizPage({ searchParams }: Props) {
  const params = await searchParams;
  const reference = params.reference ?? "John 3:16";
  const difficulty = ["easy", "standard", "hard"].includes(params.difficulty ?? "") ? params.difficulty! : "standard";
  const provider = getBibleProvider(defaultTranslationId);
  const parsed = parseBibleReference(reference);
  const chapter = parsed && provider ? provider.getChapter(defaultTranslationId, parsed.bookId, parsed.chapter) : [];
  const verse = parsed && provider?.getVerse ? provider.getVerse(defaultTranslationId, parsed.bookId, parsed.chapter, parsed.verse) : null;
  const actualReference = verse?.reference ?? reference;
  const questions = makeQuestions(actualReference, chapter, difficulty);

  return <main className="action-page quiz-page">
    <style>{`.quiz-page{max-width:820px}.quiz-lede{max-width:680px;color:var(--muted);margin:-10px 0 24px}.quiz-levels{display:flex;flex-wrap:wrap;gap:8px;margin:0 0 20px}.quiz-levels a{padding:8px 12px;border:1px solid var(--line);border-radius:999px;font-size:.78rem;font-weight:800}.quiz-levels a.active{border-color:var(--accent);background:var(--surface)}.quiz-card{padding:28px;border:1px solid var(--line);border-radius:18px;background:var(--surface)}.quiz-intro{margin-bottom:22px}.quiz-page .quiz-card{margin-top:0}@media(max-width:600px){.quiz-card{padding:21px}}`}</style>
    <a className="back-link" href={sitePath("/bible")}>← Back to Bible</a>
    <p className="eyebrow">BIBLE QUIZ</p>
    <h1>Test what you actually understood.</h1>
    <p className="quiz-lede">Move beyond memorizing words. Test recall, understanding, context, and application from the actual passage.</p>
    <div className="quiz-levels" aria-label="Quiz difficulty">
      {[["easy","Easy"],["standard","Standard"],["hard","Hard"]].map(([value,label]) => <a className={difficulty === value ? "active" : ""} key={value} href={sitePath(`/quiz?reference=${encodeURIComponent(actualReference)}&difficulty=${value}`)}>{label}</a>)}
    </div>
    <div className="quiz-intro"><strong>{actualReference}</strong> · {questions.length} questions · {difficulty}</div>
    {questions.length ? <BibleQuiz questions={questions} passageReference={actualReference} /> : <section className="study-card"><h2>Choose a Bible passage first</h2><p>Open a chapter and use Test me to create a grounded quiz from that passage.</p><a className="primary-button" href={sitePath("/bible")}>Open Bible</a></section>}
  </main>;
}
