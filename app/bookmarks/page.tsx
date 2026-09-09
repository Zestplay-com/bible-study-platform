"use client";

import { useEffect, useState } from "react";
import { bibleBooks } from "@/lib/bible/catalog";
import { bookmarkId, BOOKMARKS_STORAGE_KEY, removeBookmark, type Bookmark } from "@/lib/bookmarks";
import { sitePath } from "@/lib/site";

function readBookmarks(): Bookmark[] {
  try {
    const value = window.localStorage.getItem(BOOKMARKS_STORAGE_KEY);
    const parsed = value ? (JSON.parse(value) as unknown) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function chapterPath(reference: string) {
  const match = reference.match(/^(.+)\s+(\d+):(\d+)$/);
  if (!match) return sitePath("/bible");
  const [, bookName, chapter] = match;
  const book = bibleBooks.find((item) => item.name.toLowerCase() === bookName.toLowerCase());
  return book ? sitePath(`/bible/${book.id}/${chapter}`) : sitePath("/bible");
}

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

  function refresh() {
    setBookmarks(readBookmarks());
  }

  useEffect(() => {
    refresh();
    window.addEventListener("bible-bookmarks-changed", refresh);
    return () => window.removeEventListener("bible-bookmarks-changed", refresh);
  }, []);

  function remove(bookmark: Bookmark) {
    const next = removeBookmark(bookmarks, bookmark);
    setBookmarks(next);
    try {
      window.localStorage.setItem(BOOKMARKS_STORAGE_KEY, JSON.stringify(next));
      window.dispatchEvent(new Event("bible-bookmarks-changed"));
    } catch {
      // Keep the UI responsive if browser storage is unavailable.
    }
  }

  return (
    <main className="action-page bookmarks-page">
      <a href={sitePath("/bible")} className="back-link">← Bible</a>
      <div className="bookmarks-heading">
        <div>
          <p className="eyebrow">YOUR LIBRARY</p>
          <h1>Saved verses</h1>
          <p className="page-lede">Keep the verses you want to return to. Your bookmarks are saved on this device.</p>
        </div>
        {bookmarks.length > 0 && <span className="bookmark-count">{bookmarks.length} saved</span>}
      </div>

      {bookmarks.length === 0 ? (
        <section className="bookmark-empty">
          <h2>No saved verses yet</h2>
          <p>While reading the Bible, tap Save on any verse you want to keep close.</p>
          <a className="primary-button" href={sitePath("/bible")}>Open Bible</a>
        </section>
      ) : (
        <div className="bookmark-list">
          {bookmarks.map((bookmark) => {
            const query = `reference=${encodeURIComponent(bookmark.reference)}&text=${encodeURIComponent(bookmark.text)}`;
            return (
              <article className="bookmark-card" key={bookmarkId(bookmark.reference, bookmark.translationId)}>
                <div>
                  <a className="result-reference" href={chapterPath(bookmark.reference)}>{bookmark.reference}</a>
                  <p>{bookmark.text}</p>
                </div>
                <div className="bookmark-actions">
                  <a href={sitePath(`/ask?${query}`)}>Explain</a>
                  <a href={sitePath(`/memory?${query}`)}>Memorize</a>
                  <a href={sitePath(`/notes?${query}`)}>Note</a>
                  <button type="button" className="text-button" onClick={() => remove(bookmark)}>Remove</button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </main>
  );
}
