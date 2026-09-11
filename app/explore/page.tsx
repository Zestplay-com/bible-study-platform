import { sitePath } from "@/lib/site";
import { defaultTranslationId } from "@/lib/bible/translations";
import { getBibleProvider } from "@/lib/bible/registry";

export default async function ExplorePage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const params = await searchParams;
  const query = (params.q ?? "").trim();
  const provider = getBibleProvider(defaultTranslationId);
  const results = query && provider?.search ? provider.search(defaultTranslationId, query).slice(0, 20) : [];
  return <main className="action-page" style={{maxWidth:900}}>
    <a className="back-link" href={sitePath("/bible")}>← Bible</a>
    <p className="eyebrow">DISCOVER SCRIPTURE</p>
    <h1>Explore a word, theme, or question.</h1>
    <p className="page-lede">Search the Bible itself, then move from a result into study, explanation, memory, or notes.</p>
    <form style={{display:"flex",gap:8,margin:"24px 0"}} action={sitePath("/explore")}><input name="q" defaultValue={query} placeholder="faith, prayer, grace, John 3:16..." style={{flex:1,padding:14,border:"1px solid var(--line)",borderRadius:12,background:"var(--surface)",font:"inherit"}}/><button className="primary-button button-reset" type="submit">Explore</button></form>
    {!query ? <section className="study-card"><h2>Try something</h2><div style={{display:"flex",gap:8,flexWrap:"wrap"}}>{["faith","prayer","grace","wisdom","John 3:16","love"].map(item=><a key={item} className="secondary-button" href={sitePath(`/explore?q=${encodeURIComponent(item)}`)}>{item}</a>)}</div></section> : <section><div className="section-heading"><p className="eyebrow">{results.length} RESULTS</p><h2>Scripture for “{query}”</h2></div>{results.length ? <div style={{display:"grid",gap:10}}>{results.map(result=><article className="study-card" key={`${result.reference}-${result.verse}`}><strong>{result.reference}</strong><p style={{lineHeight:1.7}}>{result.text}</p><div style={{display:"flex",gap:8,flexWrap:"wrap"}}><a className="secondary-button" href={sitePath(`/study?minutes=10&reference=${encodeURIComponent(result.reference)}`)}>Study</a><a className="secondary-button" href={sitePath(`/ask?reference=${encodeURIComponent(result.reference)}`)}>Explain</a><a className="secondary-button" href={sitePath(`/memory?reference=${encodeURIComponent(result.reference)}&text=${encodeURIComponent(result.text)}`)}>Memorize</a><a className="secondary-button" href={sitePath(`/notes?reference=${encodeURIComponent(result.reference)}&text=${encodeURIComponent(result.text)}`)}>Note</a></div></article>)}</div> : <section className="study-card"><h2>No results found</h2><p>Try a simpler word, a Bible reference, or another phrase.</p></section>}</section>}
  </main>;
}
