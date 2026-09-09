import { defaultTranslationId } from "@/lib/bible/translations";
import { getBibleProvider } from "@/lib/bible/registry";
import { sitePath } from "@/lib/site";

type Props = { searchParams: Promise<{ q?: string }> };

export default async function BibleSearchPage({ searchParams }: Props) {
  const { q = "" } = await searchParams;
  const query = q.trim();
  const provider = getBibleProvider(defaultTranslationId);
  const results = query && provider?.search
    ? provider.search(defaultTranslationId, query)
    : [];

  return (
    <main className="reader-shell">
      <header className="reader-header">
        <a href={sitePath("/bible")} className="back-link">← Bible</a>
        <a href={sitePath("/")} className="ask-link">Home</a>
      </header>

      <section className="reader-intro">
        <p className="eyebrow">SCRIPTURE SEARCH</p>
        <h1>Search the Bible</h1>
        <p>Search the full KJV text by words, phrases, or references.</p>
      </section>

      <form className="search-form" method="get" action={sitePath("/bible/search")}>
        <label htmlFor="bible-query">Search Scripture</label>
        <div className="search-row">
          <input
            id="bible-query"
            name="q"
            type="search"
            defaultValue={query}
            placeholder="e.g. faith, John 3:16, prayer"
            autoComplete="off"
          />
          <button type="submit">Search</button>
        </div>
      </form>

      {query ? (
        <section className="search-results" aria-labelledby="results-heading">
          <h2 id="results-heading">
            {results.length} {results.length === 1 ? "result" : "results"} for “{query}”
          </h2>
          {results.length > 0 ? (
            <div className="verse-list">
              {results.map((verse) => (
                <article className="verse" key={`${verse.reference}-${verse.translationId}`}>
                  <a href={sitePath(`/bible/${verse.bookId}/${verse.chapter}`)}>
                    <strong>{verse.reference}</strong>
                  </a>
                  <p>{verse.text}</p>
                  <div className="verse-actions">
                    <a href={sitePath(`/ask?reference=${encodeURIComponent(verse.reference)}`)}>Explain</a>
                    <a href={sitePath("/memory")}>Memorize</a>
                    <a href={sitePath("/notes")}>Note</a>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="empty-reader">
              <h2>No matching verses</h2>
              <p>Try a shorter word, a different phrase, or a reference such as John 3:16.</p>
            </div>
          )}
        </section>
      ) : null}
    </main>
  );
}
