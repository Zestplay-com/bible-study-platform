import { sitePath } from "@/lib/site";
import { defaultTranslationId } from "@/lib/bible/translations";
import { getBibleProvider } from "@/lib/bible/registry";

const STUDY_MINUTES = [5, 10, 20] as const;
type Props = { searchParams: Promise<{ minutes?: string }> };

function getStudyMinutes(value?: string) {
  const minutes = Number(value);
  return STUDY_MINUTES.includes(minutes as (typeof STUDY_MINUTES)[number]) ? minutes : 5;
}

function getStudyContent(minutes: number) {
  if (minutes === 10) return { title: "A focused 10-minute study", description: "Go beyond the surface: read the passage, understand its context, and reflect on what it means for your life.", steps: [["READ", "Read the passage slowly twice. Notice repeated words, commands, promises, and contrasts."], ["UNDERSTAND", "Ask who is speaking, who is listening, what is happening, and what comes before and after the passage."], ["REFLECT", "Write one truth that stands out and one question you still have."], ["APPLY", "Choose one clear action you can take today because of what you read."]] };
  if (minutes === 20) return { title: "A deeper 20-minute study", description: "Take your time with Scripture. Observe the text, trace its meaning, and turn your learning into action.", steps: [["READ", "Read the passage three times. Mark key words, repeated ideas, commands, promises, and changes in thought."], ["CONTEXT", "Read the surrounding section. Identify the writer, audience, situation, purpose, and major theme."], ["DISCOVER", "Compare related Scriptures and look for how this passage connects with the wider message of the Bible."], ["REFLECT", "Write what this passage teaches about God, people, faith, obedience, or the gospel."], ["APPLY", "Turn your learning into one specific action, prayer, or change of attitude."]] };
  return { title: "A focused 5-minute study", description: "You do not need a long session to make progress. Read a short passage carefully and leave with one clear truth and one next step.", steps: [["READ", "Read the passage slowly. Do not rush. Notice one phrase that catches your attention."], ["UNDERSTAND", "Ask: What is this passage saying? What does it reveal about God or how I should live?"], ["REFLECT", "Write one sentence describing the main truth you learned."], ["APPLY", "Choose one small, practical step you will take today."]] };
}

export default async function StudyPage({ searchParams }: Props) {
  const params = await searchParams;
  const minutes = getStudyMinutes(params.minutes);
  const content = getStudyContent(minutes);
  const provider = getBibleProvider(defaultTranslationId);
  const verse = provider?.getVerse?.(defaultTranslationId, "john", 3, 16);
  const verseQuery = `reference=${encodeURIComponent(verse?.reference ?? "John 3:16")}&text=${encodeURIComponent(verse?.text ?? "For God so loved the world...")}`;

  return (
    <main className="action-page study-page">
      <style>{`.study-lead{margin:-12px 0 24px;max-width:650px;color:var(--muted);font-size:1.08rem}.study-time-switcher{display:flex;gap:8px;margin:0 0 28px;padding:5px;width:max-content;max-width:100%;border:1px solid var(--line);border-radius:999px;background:var(--surface)}.time-option{padding:8px 15px;border-radius:999px;color:var(--muted);font-size:.82rem;font-weight:800}.time-option.active{background:var(--accent);color:#fff}.featured-passage h2{font-size:1.6rem;margin-bottom:8px}.study-verse{font-family:Georgia,serif;font-size:1.2rem;line-height:1.8;margin:0 0 18px}.study-steps{margin-top:52px}.study-step-list{border-top:1px solid var(--line)}.study-step{display:grid;grid-template-columns:48px 1fr;gap:16px;padding:20px 0;border-bottom:1px solid var(--line)}.study-step h3{margin:0 0 4px;font-size:.95rem}.study-step p{margin:0;color:var(--muted)}.study-finish{margin-top:52px;padding:26px;border:1px solid var(--line);border-radius:18px;background:var(--surface)}.study-finish h2{font-size:2rem;margin-bottom:10px}.study-finish>p:not(.eyebrow){color:var(--muted)}@media(max-width:520px){.study-time-switcher{width:100%}.time-option{flex:1;text-align:center;padding-left:8px;padding-right:8px}.study-step{grid-template-columns:34px 1fr}.study-finish{padding:22px}}`}</style>
      <a className="back-link" href={sitePath("/")}>← Home</a>
      <p className="eyebrow">LAZY-PROOF STUDY</p>
      <h1>{content.title}</h1>
      <p className="study-lead">{content.description}</p>
      <div className="study-time-switcher" aria-label="Choose study length">
        {STUDY_MINUTES.map((option) => <a key={option} className={option === minutes ? "time-option active" : "time-option"} href={sitePath(`/study?minutes=${option}`)}>{option} min</a>)}
      </div>
      <section className="study-card featured-passage">
        <p className="eyebrow">START HERE</p>
        <h2>{verse?.reference ?? "John 3:16"}</h2>
        <p className="study-verse">{verse?.text ?? "For God so loved the world..."}</p>
        <div className="action-page-links">
          <a className="primary-button" href={sitePath("/bible/john/3")}>Open the chapter</a>
          <a className="secondary-button" href={sitePath(`/ask?${verseQuery}`)}>Understand it</a>
        </div>
      </section>
      <section className="study-steps" aria-labelledby="study-steps-heading">
        <div className="section-heading"><p className="eyebrow">YOUR NEXT {minutes} MINUTES</p><h2 id="study-steps-heading">One step at a time.</h2></div>
        <div className="study-step-list">
          {content.steps.map(([title, text], index) => <article className="study-step" key={title}><span className="method-number">{String(index + 1).padStart(2, "0")}</span><div><h3>{title}</h3><p>{text}</p></div></article>)}
        </div>
      </section>
      <section className="study-finish"><p className="eyebrow">FINISH STRONG</p><h2>What will you do with what you learned?</h2><p>Do not end with information only. Pray over what you learned, choose your next step, and put it into practice.</p><div className="action-page-links"><a className="primary-button" href={sitePath("/memory")}>Memorize Scripture</a><a className="secondary-button" href={sitePath("/notes")}>Write a note</a></div></section>
    </main>
  );
}
