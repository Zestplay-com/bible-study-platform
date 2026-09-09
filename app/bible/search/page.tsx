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

      <section className="reader-intro search-intro">
        <p className="eyebrow">SCRIPTURE SEARCH</p>
        <h1>Find a Scripture.</h1>
        <p>Search the full KJV by word, phrase, or reference.</p>
      </section>

      <form className="search-form" method="get" action={sitePath("/bible/search")}>
        <label htmlFor="bible-query">Search Scripture</label>
        <div className="search-row">
          <input
            id="bible-query"
            name="q"
            type="search"
            defaultValue={query}
            placeholder="Try “faith”, “prayer”, or “John 3:16”"
            autoComplete="off"
          />
          <button type="submit">Search</button>
        </div>
        <p className="search-hint">Tip: references such as John 3:16 and Psalm 23:1 go straight to the verse.</p>
      </form>

      {query ? (
        <section className="search-results" aria-labelledby="results-heading">
          <div className="results-heading-row">
            <div>
              <p className="eyebrow">RESULTS</p>
              <h2 id="results-heading">{results.length} {results.length === 1 ? "match" : "matches"}</h2>
            </div>
            <a className="text-button" href={sitePath("/bible/search")}>Clear</a>
          </div>

          {results.length > 0 ? (
            <div className="search-result-list">
              {results.map((verse) => {
                const queryParams = `reference=${encodeURIComponent(verse.reference)}&text=${encodeURIComponent(verse.text)}`;
                return (
                  <article className="search-result-card" key={`${verse.reference}-${verse.translationId}`}>
                    <a className="result-reference" href={sitePath(`/bible/${verse.bookId}/${verse.chapter}`)}>
                      {verse.reference}
                    </a>
                    <p>{verse.text}</p>
                    <div className="result-actions">
                      <a href={sitePath(`/ask?${queryParams}`)}>Explain</a>
                      <a href={sitePath(`/memory?${queryParams}`)}>Memorize</a>
                      <a href={sitePath(`/notes?${queryParams}`)}>Note</a>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="empty-reader">
              <h2>Nothing found yet</h2>
              <p>Try a shorter word, another phrase, or a reference such as John 3:16.</p>
            </div>
          )}
        </section>
      ) : (
        <section className="search-empty-state">
          <span className="search-icon" aria-hidden="true">⌕</span>
          <h2>What are you looking for?</h2>
          <p>Find a verse, phrase, or passage and continue your study from there.</p>
        </section>
      )}
    </main>
  );
}
