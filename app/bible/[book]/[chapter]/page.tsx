import { notFound } from "next/navigation";
import { bibleBooks } from "@/lib/bible/catalog";
import { getChapter } from "@/lib/bible/sample";

type Props = { params: Promise<{ book: string; chapter: string }> };

export default async function ChapterPage({ params }: Props) {
  const { book: bookId, chapter: chapterParam } = await params;
  const book = bibleBooks.find((item) => item.id === bookId);
  const chapter = Number(chapterParam);
  if (!book || !Number.isInteger(chapter) || chapter < 1 || chapter > book.chapters) notFound();

  const verses = getChapter(book.id, chapter);
  const previous = chapter > 1 ? `/bible/${book.id}/${chapter - 1}` : null;
  const next = chapter < book.chapters ? `/bible/${book.id}/${chapter + 1}` : null;

  return (
    <main className="reader-shell">
      <header className="reader-header">
        <a href={`/bible/${book.id}`} className="back-link">← {book.name}</a>
        <a href="/ask" className="ask-link">Ask AI</a>
      </header>

      <article className="chapter-reader">
        <div className="chapter-title">
          <p className="eyebrow">{book.name.toUpperCase()}</p>
          <h1>Chapter {chapter}</h1>
        </div>

        {verses.length > 0 ? (
          <div className="verse-list">
            {verses.map((verse) => (
              <div className="verse" key={verse.verse}>
                <span className="verse-number">{verse.verse}</span>
                <p>{verse.text}</p>
                <div className="verse-actions">
                  <a href={`/ask?reference=${encodeURIComponent(`${book.name} ${chapter}:${verse.verse}`)}`}>Explain</a>
                  <a href="/memory">Memorize</a>
                  <a href="/notes">Note</a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-reader">
            <h2>More Scripture is coming.</h2>
            <p>This development build currently contains a small sample dataset. The full Bible dataset will be connected only after its licensing/public-domain status is verified.</p>
          </div>
        )}
      </article>

      <nav className="chapter-nav" aria-label="Chapter navigation">
        {previous ? <a href={previous}>← Previous</a> : <span />}
        <a href={`/bible/${book.id}`}>All chapters</a>
        {next ? <a href={next}>Next →</a> : <span />}
      </nav>
    </main>
  );
}
