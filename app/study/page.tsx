import { sitePath } from "@/lib/site";
import { defaultTranslationId } from "@/lib/bible/translations";
import { getBibleProvider } from "@/lib/bible/registry";
import { buildDynamicInsight } from "@/lib/study/dynamic";

const STUDY_MINUTES = [5, 10, 20] as const;
type Props = { searchParams: Promise<{ minutes?: string; reference?: string }> };

function getMinutes(value?: string) { const n=Number(value); return STUDY_MINUTES.includes(n as 5|10|20)?n:5; }

function stepsFor(minutes:number) {
  if(minutes===20) return [
    ["OBSERVE","Read the passage three times. Mark repeated words, commands, promises, contrasts, questions and changes in thought."],
    ["CONTEXT","Read the whole chapter. Identify the speaker, audience, setting, purpose, literary movement and what comes immediately before and after."],
    ["WORD STUDY","Slow down over important words. Ask what the Hebrew or Greek term means, how it functions here, and what meanings the context rules out."],
    ["CONNECT","Trace the truth through other Scriptures. Compare passages in context instead of collecting isolated proof texts."],
    ["INTERPRET","Ask what the passage teaches about God, Christ, the Spirit, humanity, sin, salvation, faith, obedience and the gospel."],
    ["APPLY","Write one truth, one attitude to change, one action to take and one prayer. Finish by choosing a concrete step of obedience."],
  ];
  if(minutes===10) return [
    ["READ","Read the passage twice. Notice the main idea, repeated words, commands, promises and contrasts."],
    ["CONTEXT","Read several verses around it. Ask who is speaking, who is listening, what is happening and why this statement appears here."],
    ["CONNECT","Compare one or two related Scriptures. Let the wider Bible clarify and balance your understanding."],
    ["REFLECT","Write what this passage reveals about God and what it exposes, corrects, promises or teaches in you."],
    ["APPLY","Choose one specific action or prayer for today. Do not finish with information only."],
  ];
  return [
    ["READ","Read one short passage slowly. Notice one phrase that catches your attention."],
    ["UNDERSTAND","Ask: What does this actually say? What does it reveal about God and how He calls me to live?"],
    ["RESPOND","Write one truth you learned, one sentence of prayer and one small step you can take today."],
  ];
}

export default async function StudyPage({ searchParams }: Props) {
  const params=await searchParams; const minutes=getMinutes(params.minutes); const provider=getBibleProvider(defaultTranslationId);
  const reference=params.reference||"John 3:16"; const parsed=reference.match(/^(.+?)\s+(\d+):(\d+)$/); const bookId=parsed?.[1].toLowerCase().replace(/\s+/g,"-"); const chapter=parsed?Number(parsed[2]):3;
  const verse=provider?.getVerse?.(defaultTranslationId,bookId||"john",chapter,parsed?Number(parsed[3]):16);
  const text=verse?.text||"For God so loved the world..."; const insight=buildDynamicInsight(reference,text,provider||undefined,defaultTranslationId); const steps=stepsFor(minutes);
  const query=`reference=${encodeURIComponent(verse?.reference||reference)}&text=${encodeURIComponent(text)}`;
  return <main className="action-page study-page">
    <style>{`.study-lead{margin:-12px 0 24px;max-width:700px;color:var(--muted);font-size:1.08rem}.study-time-switcher{display:flex;gap:8px;margin:0 0 28px;padding:5px;width:max-content;max-width:100%;border:1px solid var(--line);border-radius:999px;background:var(--surface)}.time-option{padding:8px 15px;border-radius:999px;color:var(--muted);font-size:.82rem;font-weight:800}.time-option.active{background:var(--accent);color:#fff}.featured-passage h2{font-size:1.6rem;margin-bottom:8px}.study-verse{font-family:Georgia,serif;font-size:1.2rem;line-height:1.8;margin:0 0 18px}.study-steps{margin-top:52px}.study-step-list{border-top:1px solid var(--line)}.study-step{display:grid;grid-template-columns:48px 1fr;gap:16px;padding:20px 0;border-bottom:1px solid var(--line)}.study-step h3{margin:0 0 4px;font-size:.95rem}.study-step p{margin:0;color:var(--muted)}.study-depth{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:20px}.study-depth-card{padding:16px;border:1px solid var(--line);border-radius:14px;background:var(--surface)}.study-depth-card strong{display:block;margin-bottom:5px}.study-depth-card span{color:var(--muted);font-size:.85rem}.study-finish{margin-top:52px;padding:26px;border:1px solid var(--line);border-radius:18px;background:var(--surface)}.study-finish h2{font-size:2rem;margin-bottom:10px}.study-finish>p:not(.eyebrow){color:var(--muted)}@media(max-width:650px){.study-time-switcher{width:100%}.time-option{flex:1;text-align:center;padding-left:8px;padding-right:8px}.study-step{grid-template-columns:34px 1fr}.study-depth{grid-template-columns:1fr}.study-finish{padding:22px}}`}</style>
    <a className="back-link" href={sitePath("/")}>← Home</a>
    <p className="eyebrow">LAZY-PROOF STUDY</p><h1>{minutes}-minute Bible study</h1>
    <p className="study-lead">A guided study that gets deeper as you give it more time: Scripture first, context, original-language insight, Bible connections, reflection and practical obedience.</p>
    <div className="study-time-switcher" aria-label="Choose study length">{STUDY_MINUTES.map(option=><a key={option} className={option===minutes?"time-option active":"time-option"} href={sitePath(`/study?minutes=${option}&reference=${encodeURIComponent(reference)}`)}>{option} min</a>)}</div>
    <section className="study-card featured-passage"><p className="eyebrow">START HERE</p><h2>{verse?.reference||reference}</h2><p className="study-verse">{text}</p><div className="action-page-links"><a className="primary-button" href={sitePath(bookId?`/bible/${bookId}/${chapter}`:"/bible")}>Open chapter</a><a className="secondary-button" href={sitePath(`/ask?${query}`)}>Deep study</a></div></section>
    <div className="study-depth"><div className="study-depth-card"><strong>5 MIN</strong><span>Capture the central truth and respond.</span></div><div className="study-depth-card"><strong>10 MIN</strong><span>Add context, connections and reflection.</span></div><div className="study-depth-card"><strong>20 MIN</strong><span>Trace meaning, words, theology and application.</span></div></div>
    <section className="study-steps" aria-labelledby="study-steps-heading"><div className="section-heading"><p className="eyebrow">YOUR NEXT {minutes} MINUTES</p><h2 id="study-steps-heading">Study, don't just read.</h2></div><div className="study-step-list">{steps.map(([title,description],i)=><article className="study-step" key={title}><span className="method-number">{String(i+1).padStart(2,"0")}</span><div><h3>{title}</h3><p>{description}</p></div></article>)}</div></section>
    <section className="study-card"><p className="eyebrow">YOUR STUDY COMPASS</p><h2>Three questions to carry with you.</h2><div className="insight-list"><p><span>01</span>What does this passage actually say in its own context?</p><p><span>02</span>What does it reveal about God and His purposes?</p><p><span>03</span>What should I believe, change, practice, pray or remember because of it?</p></div><div className="action-page-links"><a className="secondary-button" href={sitePath(`/ask?${query}`)}>Explore {reference}</a><a className="primary-button" href={sitePath(`/memory?${query}`)}>Memorize it</a></div></section>
    <section className="study-finish"><p className="eyebrow">FINISH STRONG</p><h2>Turn learning into living.</h2><p>Save the insight, write a note, pray over it, and take one specific step. The goal is not simply to know more Scripture, but to understand it and live it.</p><div className="action-page-links"><a className="primary-button" href={sitePath(`/notes?${query}`)}>Write a study note</a><a className="secondary-button" href={sitePath(`/ask?${query}#apply`)}>Apply this truth</a></div></section>
  </main>;
}
