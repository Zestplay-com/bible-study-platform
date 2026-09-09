import { notFound } from "next/navigation";
import { bibleBooks } from "@/lib/bible/catalog";

type Props = { params: Promise<{ book: string }> };

export default async function BookPage({ params }: Props) {
  const { book: bookId } = await params;
  const book = bibleBooks.find((item) => item.id === bookId);
  if (!book) notFound();

  return (
    <main className="reader-shell">
      <header className="reader-header">
        <a href="/bible" className="back-link">← All books</a>
        <a href="/ask" className="ask-link">Ask about Scripture</a>
      </header>

      <section className="reader-intro">
        <p className="eyebrow">{book.testament === "old" ? "OLD TESTAMENT" : "NEW TESTAMENT"}</p>
        <h1>{book.name}</h1>
        <p>Choose a chapter to begin reading.</p>
      </section>

      <div className="chapter-grid">
        {Array.from({ length: book.chapters }, (_, index) => index + 1).map((chapter) => (
          <a className="chapter-card" href={`/bible/${book.id}/${chapter}`} key={chapter}>
            {chapter}
          </a>
        ))}
      </div>
    </main>
  );
}
