import { bibleBooks } from "@/lib/bible/catalog";

export default function BiblePage() {
  const oldTestament = bibleBooks.filter((book) => book.testament === "old");
  const newTestament = bibleBooks.filter((book) => book.testament === "new");

  return (
    <main className="reader-shell">
      <header className="reader-header">
        <a href="/" className="back-link">← Home</a>
        <a href="/ask" className="ask-link">Ask about Scripture</a>
      </header>

      <section className="reader-intro">
        <p className="eyebrow">THE BIBLE</p>
        <h1>Where do you want to read?</h1>
        <p>Choose a book. We will build the reading experience around the passage—not just display the text.</p>
      </section>

      <BookGroup title="Old Testament" books={oldTestament} />
      <BookGroup title="New Testament" books={newTestament} />
    </main>
  );
}

function BookGroup({ title, books }: { title: string; books: typeof bibleBooks }) {
  return (
    <section className="book-group" aria-labelledby={title.replaceAll(" ", "-")}>
      <h2 id={title.replaceAll(" ", "-")}>{title}</h2>
      <div className="book-grid">
        {books.map((book) => (
          <a className="book-card" href={`/bible/${book.id}`} key={book.id}>
            <strong>{book.name}</strong>
            <span>{book.chapters} {book.chapters === 1 ? "chapter" : "chapters"}</span>
          </a>
        ))}
      </div>
    </section>
  );
}
