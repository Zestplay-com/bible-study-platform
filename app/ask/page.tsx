import { sitePath } from "@/lib/site";
import { defaultTranslationId } from "@/lib/bible/translations";
import { getBibleProvider } from "@/lib/bible/registry";
import { parseBibleReference } from "@/lib/bible/reference";
import { getStudyInsight } from "@/lib/study/insights";
import { buildDynamicInsight } from "@/lib/study/dynamic";
import TeacherChat from "@/components/TeacherChat";

type Props = { searchParams: Promise<{ reference?: string; text?: string }> };
type TeacherMode = "explain" | "context" | "original" | "connections" | "apply";
const modes: { id: TeacherMode; label: string }[] = [
  { id: "explain", label: "Explain deeply" },
  { id: "context", label: "Context" },
  { id: "original", label: "Greek / Hebrew" },
  { id: "connections", label: "Bible connections" },
  { id: "apply", label: "Apply it" },
];

export default async function AskPage({ searchParams }: Props) {
  const params = await searchParams;
  const reference = params.reference ?? "Scripture";
  const text = params.text ?? "";
  const provider = getBibleProvider(defaultTranslationId);
  const curated = getStudyInsight(reference);
  const insight = curated ?? buildDynamicInsight(reference, text, provider ?? undefined, defaultTranslationId);
  const parsed = parseBibleReference(reference);
  const bookId = parsed?.bookId ?? null;
  const chapter = parsed?.chapter ?? 1;
  const chapterVerses = provider && bookId ? provider.getChapter(defaultTranslationId, bookId, chapter) : [];
  const normalizedReference = reference.trim().toLowerCase().replace(/\bpsalm\b/g, "psalms");
  const verseIndex = chapterVerses.findIndex((verse) => verse.reference.toLowerCase() === normalizedReference);
  const actualText = text || chapterVerses[verseIndex]?.text || "Open a verse from the Bible reader to study it here.";
  const previous = verseIndex > 0 ? chapterVerses[verseIndex - 1] : null;
  const next = verseIndex >= 0 && verseIndex < chapterVerses.length - 1 ? chapterVerses[verseIndex + 1] : null;

  return (
    <main className="action-page teacher-page">
      <style>{`.teacher-page{max-width:900px}.study-lead{margin:-12px 0 24px;max-width:720px;color:var(--muted);font-size:1.06rem}.teacher-mode-list{display:flex;flex-wrap:wrap;gap:8px;margin:18px 0 28px}.teacher-mode{border:1px solid var(--line);background:var(--surface);color:var(--muted);padding:10px 14px;border-radius:999px;font-size:.8rem;font-weight:800}.teacher-mode.active{background:var(--accent);color:#fff;border-color:var(--accent)}.teacher-dossier{display:grid;gap:14px}.teacher-card{padding:26px;border:1px solid var(--line);border-radius:18px;background:var(--surface)}.teacher-card h2{font-size:1.65rem;margin-bottom:12px}.teacher-card h3{font-size:1rem;margin:24px 0 8px}.teacher-card>p{color:var(--muted)}.teacher-big-idea{border-left:4px solid var(--accent)}.teacher-big-idea p:last-child{font-size:1.1rem;color:var(--text);line-height:1.75}.insight-list{display:grid;gap:13px}.insight-list p{display:grid;grid-template-columns:25px 1fr;gap:8px;margin:0;color:var(--text)}.insight-list span{color:var(--accent);font-weight:900}.word-study-list{display:grid;gap:12px}.word-study-list article{padding:17px;border:1px solid var(--line);border-radius:13px}.word-study-list article>div{display:flex;align-items:baseline;justify-content:space-between;gap:15px}.word-study-list strong{font-size:1.15rem}.word-study-list span{color:var(--accent);font-size:.82rem}.word-study-list p{margin:8px 0 0;font-size:.92rem}.connection-list{display:grid;gap:10px}.connection-list article{padding:16px;border:1px solid var(--line);border-radius:13px}.connection-list strong{color:var(--accent)}.connection-list p{margin:5px 0;color:var(--muted)}.connection-list a{font-size:.78rem;font-weight:800;color:var(--accent)}.prayer-box{margin-top:22px;padding:18px;border-radius:14px;background:var(--background)}.prayer-box p{margin:7px 0 0;font-family:Georgia,serif;color:var(--text)}.teacher-question{margin-top:2px}.teacher-chat-form{display:flex;gap:8px}.teacher-chat-form input{flex:1;min-width:0;padding:13px 14px;border:1px solid var(--line);border-radius:12px;background:var(--background);outline:none}.teacher-chat-form input:focus{border-color:var(--accent);box-shadow:0 0 0 4px var(--focus)}.teacher-chat-form button:disabled{opacity:.55;cursor:not-allowed}.teacher-chat-hint{font-size:.78rem!important;margin-top:12px}.teacher-chat-error{margin-top:12px;padding:12px 14px;border-radius:12px;background:#fff1f1;color:#9b1c1c;font-size:.86rem}.teacher-chat-answer{margin-top:18px;padding:18px;border-radius:14px;background:var(--background)}.teacher-chat-answer div{white-space:pre-wrap;line-height:1.75;color:var(--text)}.teacher-note{font-size:.78rem!important;margin-top:12px}.scripture-card{display:grid;gap:8px}.scripture-card strong{font-family:Arial,sans-serif;font-size:.85rem;color:var(--accent)}.teacher-neighbors{display:flex;flex-wrap:wrap;gap:10px;margin-top:14px}.teacher-neighbors a{padding:9px 12px;border:1px solid var(--line);border-radius:999px;color:var(--accent);font-size:.78rem;font-weight:800}@media(max-width:600px){.teacher-card{padding:21px}.teacher-chat-form{flex-direction:column}.teacher-chat-form button{width:100%}.word-study-list article>div{display:block}.word-study-list span{display:block;margin-top:3px}}`}</style>
      <a className="back-link" href={sitePath("/bible")}>← Back to Bible</a>
      <p className="eyebrow">BIBLE TEACHER</p>
      <h1>Go deeper into {reference}</h1>
      <p className="study-lead">Understand the text, examine its context, explore original-language words, trace Scripture connections, reflect on what it reveals about God, and turn truth into obedience.</p>
      <blockquote className="scripture-card"><strong>{reference}</strong><span>{actualText}</span></blockquote>
      <div className="teacher-neighbors">
        {previous && <a href={sitePath(`/ask?reference=${encodeURIComponent(previous.reference)}&text=${encodeURIComponent(previous.text)}`)}>← {previous.reference}</a>}
        {next && <a href={sitePath(`/ask?reference=${encodeURIComponent(next.reference)}&text=${encodeURIComponent(next.text)}`)}>{next.reference} →</a>}
        {bookId && <a href={sitePath(`/bible/${bookId}/${chapter}`)}>Read chapter</a>}
      </div>
      <div className="teacher-mode-list" role="tablist" aria-label="Bible teacher modes">
        {modes.map((item) => <a key={item.id} className={item.id === "explain" ? "teacher-mode active" : "teacher-mode"} href={`#${item.id}`}>{item.label}</a>)}
      </div>
      <section className="teacher-dossier">
        <div id="explain" className="teacher-card teacher-big-idea"><p className="eyebrow">THE BIG IDEA</p><h2>{insight.theme}</h2><p>{insight.bigIdea}</p></div>
        <div className="teacher-card"><p className="eyebrow">WHAT GOD IS SHOWING</p><h2>Look beneath the words</h2><div className="insight-list">{insight.whatGodIsShowing.map((item) => <p key={item}><span>✓</span>{item}</p>)}</div></div>
        <div id="context" className="teacher-card"><p className="eyebrow">CONTEXT</p><h2>Never isolate the verse</h2><p>{insight.context}</p><h3>Questions to ask</h3><div className="insight-list">{insight.questions.map((item) => <p key={item}><span>?</span>{item}</p>)}</div></div>
        <div id="original" className="teacher-card"><p className="eyebrow">ORIGINAL LANGUAGE</p><h2>Greek / Hebrew word study</h2><div className="word-study-list">{insight.words.map((word) => <article key={word.word}><div><strong>{word.word}</strong><span>{word.original} · {word.transliteration}</span></div><p><b>Meaning:</b> {word.meaning}</p><p><b>Why it matters:</b> {word.whyItMatters}</p></article>)}</div><p className="teacher-note">Word notes are study aids. Exact Hebrew or Greek form, grammar, and sense must always be checked in context.</p></div>
        <div id="connections" className="teacher-card"><p className="eyebrow">SCRIPTURE CONNECTS WITH SCRIPTURE</p><h2>Follow the thread</h2><div className="connection-list">{insight.crossReferences.length ? insight.crossReferences.map((item) => <article key={item.reference}><strong>{item.reference}</strong><p>{item.connection}</p><a href={sitePath(`/bible/search?q=${encodeURIComponent(item.reference)}`)}>Open passage →</a></article>) : <p>Related Scripture will expand here as the semantic Bible index grows.</p>}</div></div>
        <div id="apply" className="teacher-card"><p className="eyebrow">FROM KNOWLEDGE TO OBEDIENCE</p><h2>What should change?</h2><div className="insight-list">{insight.application.map((item) => <p key={item}><span>→</span>{item}</p>)}</div><div className="prayer-box"><strong>Turn it into prayer</strong><p>{insight.prayer}</p></div></div>
        <div className="teacher-card teacher-question"><p className="eyebrow">ASK THE TEACHER</p><h2>Ask a real Bible question</h2><p>The AI Teacher answers from this passage and the Bible context already loaded above.</p><TeacherChat reference={reference} /></div>
      </section>
      <div className="action-page-links"><a className="secondary-button" href={sitePath(`/memory?reference=${encodeURIComponent(reference)}&text=${encodeURIComponent(actualText)}`)}>Build a memory review</a><a className="primary-button" href={sitePath(`/notes?reference=${encodeURIComponent(reference)}&text=${encodeURIComponent(actualText)}`)}>Take a study note</a></div>
    </main>
  );
}
