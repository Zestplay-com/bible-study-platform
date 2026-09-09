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
  if (minutes === 10) {
    return {
      title: "A focused 10-minute study",
      description: "Go beyond the surface: read the passage, understand its context, and reflect on what it means for your life.",
      steps: [
        ["READ", "Read the passage slowly twice. Notice repeated words, commands, promises, and contrasts."],
        ["UNDERSTAND", "Ask who is speaking, who is listening, what is happening, and what comes before and after the passage."],
        ["REFLECT", "Write one truth that stands out and one question you still have."],
        ["APPLY", "Choose one clear action you can take today because of what you read."],
      ],
    };
  }
  if (minutes === 20) {
    return {
      title: "A deeper 20-minute study",
      description: "Take your time with Scripture. Observe the text, trace its meaning, and turn your learning into action.",
      steps: [
        ["READ", "Read the passage three times. Mark key words, repeated ideas, commands, promises, and changes in thought."],
        ["CONTEXT", "Read the surrounding section. Identify the writer, audience, situation, purpose, and major theme."],
        ["DISCOVER", "Compare related Scriptures and look for how this passage connects with the wider message of the Bible."],
        ["REFLECT", "Write what this passage teaches about God, people, faith, obedience, or the gospel."],
        ["APPLY", "Turn your learning into one specific action, prayer, or change of attitude."],
      ],
    };
  }
  return {
    title: "A focused 5-minute study",
    description: "You do not need a long session to make progress. Read a short passage carefully and leave with one clear truth and one next step.",
    steps: [
      ["READ", "Read the passage slowly. Do not rush. Notice one phrase that catches your attention."],
      ["UNDERSTAND", "Ask: What is this passage saying? What does it reveal about God or how I should live?"],
      ["REFLECT", "Write one sentence describing the main truth you learned."],
      ["APPLY", "Choose one small, practical step you will take today."],
    ],
  };
}

export default async function StudyPage({ searchParams }: Props) {
  const params = await searchParams;
  const minutes = getStudyMinutes(params.minutes);
  const content = getStudyContent(minutes);
  const provider = getBibleProvider(defaultTranslationId);
  const verse = provider?.getVerse?.(defaultTranslationId, "john", 3, 16);

  return (
    <main className="action-page study-page">
      <a className="back-link" href={sitePath("/")}>← Home</a>
      <p className="eyebrow">LAZY-PROOF STUDY</p>
      <h1>{content.title}</h1>
      <p className="study-lead">{content.description}</p>

      <div className="study-time-switcher" aria-label="Choose study length">
        {STUDY_MINUTES.map((option) => (
          <a key={option} className={option === minutes ? "time-option active" : "time-option"} href={sitePath(`/study?minutes=${option}`)}>
            {option} min
          </a>
        ))}
      </div>

      <section className="study-card featured-passage">
        <p className="eyebrow">START HERE</p>
        <h2>{verse?.reference ?? "John 3:16"}</h2>
        <p className="study-verse">{verse?.text ?? "For God so loved the world..."}</p>
        <a className="primary-button" href={sitePath("/bible/john/3")}>Open the chapter</a>
      </section>

      <section className="study-steps" aria-labelledby="study-steps-heading">
        <div className="section-heading">
          <p className="eyebrow">YOUR NEXT {minutes} MINUTES</p>
          <h2 id="study-steps-heading">One step at a time.</h2>
        </div>
        <div className="study-step-list">
          {content.steps.map(([title, text], index) => (
            <article className="study-step" key={title}>
              <span className="method-number">{String(index + 1).padStart(2, "0")}</span>
              <div>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="study-finish">
        <p className="eyebrow">FINISH STRONG</p>
        <h2>What will you do with what you learned?</h2>
        <p>Do not end with information only. Pray over what you learned, choose your next step, and put it into practice.</p>
        <div className="action-page-links">
          <a className="primary-button" href={sitePath("/memory")}>Memorize Scripture</a>
          <a className="secondary-button" href={sitePath("/notes")}>Write a note</a>
        </div>
      </section>
    </main>
  );
}
