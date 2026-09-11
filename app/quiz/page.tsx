import { sitePath } from "@/lib/site";
import { defaultTranslationId } from "@/lib/bible/translations";
import { getBibleProvider } from "@/lib/bible/registry";
import { parseBibleReference } from "@/lib/bible/reference";
import BibleQuiz from "@/components/BibleQuiz";

type Props = { searchParams: Promise<{ reference?: string }> };

type Question = {
  reference: string;
  question: string;
  answer: string;
  options: string[];
  explanation: string;
};

function makeQuestions(reference: string, text: string, chapter: { reference: string; text: string }[]): Question[] {
  if (!chapter.length) return [];
  const candidates = chapter.filter((verse) => verse.text.trim().length >= 18);
  const target = candidates.find((verse) => verse.reference.toLowerCase() === reference.toLowerCase()) ?? candidates[0];
  const chosen = candidates.filter((verse) => verse.reference !== target.reference).slice(0, 5);
  const questions: Question[] = [];
  const sourceText = text || target.text;

  for (const verse of [target, ...chosen].slice(0, 5)) {
    const distractors = candidates.filter((item) => item.reference !== verse.reference && item.text !== verse.text).slice(0, 2).map((item) => item.text);
    if (distractors.length < 2) continue;
    questions.push({
      reference: verse.reference,
      question: `Which statement is actually found in ${verse.reference}?`,
      answer: verse.text,
      options: [verse.text, ...distractors].sort(() => 0.5 - Math.random()),
      explanation: `${verse.reference} says: “${verse.text}” This quiz is testing whether you can recognize what the text actually says, rather than relying on memory or assumptions. ${verse.reference === target.reference ? `This is the passage you started with: ${sourceText}` : "Read the surrounding verses to understand why this statement appears here."}`,
    });
  }
  return questions;
}

export default async function QuizPage({ searchParams }: Props) {
  const params = await searchParams;
  const reference = params.reference ?? "John 3:16";
  const provider = getBibleProvider(defaultTranslationId);
  const parsed = parseBibleReference(reference);
  const chapter = parsed && provider ? provider.getChapter(defaultTranslationId, parsed.bookId, parsed.chapter) : [];
  const verse = parsed && provider?.getVerse ? provider.getVerse(defaultTranslationId, parsed.bookId, parsed.chapter, parsed.verse) : null;
  const actualReference = verse?.reference ?? reference;
  const questions = makeQuestions(actualReference, verse?.text ?? "", chapter);

  return <main className="action-page quiz-page">
    <style>{`.quiz-page{max-width:820px}.quiz-lede{max-width:680px;color:var(--muted);margin:-10px 0 24px}.quiz-card{padding:28px;border:1px solid var(--line);border-radius:18px;background:var(--surface)}.quiz-progress{display:flex;justify-content:space-between;color:var(--muted);font-size:.8rem;font-weight:800}.quiz-bar{height:5px;background:var(--background);border-radius:99px;overflow:hidden;margin:10px 0 28px}.quiz-bar span{display:block;height:100%;background:var(--accent)}.quiz-card h2{font-size:1.55rem;line-height:1.4;margin-bottom:20px}.quiz-options{display:grid;gap:10px}.quiz-option{width:100%;display:flex;justify-content:space-between;gap:14px;text-align:left;padding:15px;border:1px solid var(--line);border-radius:13px;background:var(--background);color:var(--text);font:inherit;line-height:1.55;cursor:pointer}.quiz-option:hover:not(:disabled){border-color:var(--accent);transform:translateY(-1px)}.quiz-option:disabled{cursor:default}.quiz-option.correct{border-color:var(--accent);background:var(--surface)}.quiz-option.wrong{border-color:#b33;background:#fff5f5}.quiz-feedback{margin-top:18px;padding:16px;border-radius:13px;background:var(--background)}.quiz-feedback strong{display:block;margin-bottom:5px}.quiz-feedback p{margin:0;color:var(--muted);line-height:1.65}.quiz-next{margin-top:18px}.quiz-score{font-size:3.5rem;font-weight:900;letter-spacing:-.06em;color:var(--accent);margin:5px 0}.quiz-results h2{margin-bottom:10px}.quiz-results>p{color:var(--muted);line-height:1.7}.quiz-review{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin:20px 0}.quiz-review strong{width:100%}.quiz-review span{padding:7px 10px;border:1px solid var(--line);border-radius:999px;font-size:.78rem;font-weight:800}.quiz-intro{margin-bottom:22px}@media(max-width:600px){.quiz-card{padding:21px}.quiz-card h2{font-size:1.3rem}}`}</style>
    <a className="back-link" href={sitePath("/bible")}>← Back to Bible</a>
    <p className="eyebrow">BIBLE QUIZ</p>
    <h1>Test what you actually understood.</h1>
    <p className="quiz-lede">Answer from the text, see why the answer is right, and use mistakes as a signal to return to Scripture.</p>
    <div className="quiz-intro"><strong>{actualReference}</strong> · {questions.length} questions</div>
    <BibleQuiz questions={questions} passageReference={actualReference} />
  </main>;
}
