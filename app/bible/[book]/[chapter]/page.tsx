import { notFound } from "next/navigation";
import { bibleBooks } from "@/lib/bible/catalog";
import { defaultTranslationId } from "@/lib/bible/translations";
import { getBibleProvider } from "@/lib/bible/registry";
import { sitePath } from "@/lib/site";

type Props = { params: Promise<{ book: string; chapter: string }> };

export function generateStaticParams() {
  return bibleBooks.flatMap((book) =>
    Array.from({ length: book.chapters }, (_, index) => ({
      book: book.id,
      chapter: String(index + 1),
    })),
  );
}

export default async function ChapterPage({ params }: Props) {
  const { book: bookId, chapter: chapterParam } = await params;
  const book = bibleBooks.find((item) => item.id === bookId);
  const chapter = Number(chapterParam);
  if (!book || !Number.isInteger(chapter) || chapter < 1 || chapter > book.chapters) notFound();

  const provider = getBibleProvider(defaultTranslationId);
  if (!provider) throw new Error(`Bible provider not configured: ${defaultTranslationId}`);
  const verses = provider.getChapter(defaultTranslationId, book.id, chapter);
  const previous = chapter > 1 ? sitePath(`/bible/${book.id}/${chapter - 1}`) : null;
  const next = chapter < book.chapters ? sitePath(`/bible/${book.id}/${chapter + 1}`) : null;

  return (
    <main className="reader-shell">
      <header className="reader-header">
        <a href={sitePath(`/bible/${book.id}`)} className="back-link">← {book.name}</a>
        <a href={sitePath("/bible/search")} className="ask-link">Search Bible</a>
      </header>

      <article className="chapter-reader">
        <div className="chapter-title">
          <p className="eyebrow">{book.name.toUpperCase()} · KJV</p>
          <h1>Chapter {chapter}</h1>
        </div>

        {verses.length > 0 ? (
          <div className="verse-list">
            {verses.map((verse) => (
              <div className="verse" key={verse.verse}>
                <span className="verse-number">{verse.verse}</span>
                <p>{verse.text}</p>
                <div className="verse-actions">
                  <a href={sitePath(`/ask?reference=${encodeURIComponent(verse.reference)}`)}>Explain</a>
                  <a href={sitePath("/memory")}>Memorize</a>
                  <a href={sitePath("/notes")}>Note</a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-reader">
            <h2>Chapter unavailable</h2>
            <p>No verses were returned by the Bible provider for this chapter.</p>
          </div>
        )}
      </article>

      <nav className="chapter-nav" aria-label="Chapter navigation">
        {previous ? <a href={previous}>← Previous</a> : <span />}
        <a href={sitePath(`/bible/${book.id}`)}>All chapters</a>
        {next ? <a href={next}>Next →</a> : <span />}
      </nav>
    </main>
  );
}
