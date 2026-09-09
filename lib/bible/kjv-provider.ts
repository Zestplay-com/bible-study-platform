import verses from "kjv/json/verses-1769.json";
import { bibleBooks } from "./catalog";
import type { BibleProvider } from "./provider";
import type { BibleVerse } from "./types";

const translationId = "kjv";

type VerseMap = Record<string, string>;
const verseMap = verses as VerseMap;

const booksByName = [...bibleBooks].sort((a, b) => b.name.length - a.name.length);

function parseReference(reference: string) {
  const book = booksByName.find((candidate) => reference.startsWith(`${candidate.name} `));
  if (!book) return null;

  const remainder = reference.slice(book.name.length + 1);
  const match = remainder.match(/^(\d+):(\d+)$/);
  if (!match) return null;

  return { book, chapter: Number(match[1]), verse: Number(match[2]) };
}

function cleanText(text: string) {
  return text.replace(/#/g, "").replace(/\[|\]/g, "").replace(/\s+/g, " ").trim();
}

function toVerse(reference: string, text: string): BibleVerse | null {
  const parsed = parseReference(reference);
  if (!parsed) return null;

  return {
    translationId,
    bookId: parsed.book.id,
    bookName: parsed.book.name,
    chapter: parsed.chapter,
    verse: parsed.verse,
    reference,
    text: cleanText(text),
  };
}

const allVerses: BibleVerse[] = Object.entries(verseMap)
  .map(([reference, text]) => toVerse(reference, text))
  .filter((verse): verse is BibleVerse => verse !== null)
  .sort((a, b) =>
    a.bookId.localeCompare(b.bookId) || a.chapter - b.chapter || a.verse - b.verse,
  );

const chapterIndex = new Map<string, BibleVerse[]>();
const verseIndex = new Map<string, BibleVerse>();

for (const verse of allVerses) {
  const chapterKey = `${verse.bookId}:${verse.chapter}`;
  const chapter = chapterIndex.get(chapterKey) ?? [];
  chapter.push(verse);
  chapterIndex.set(chapterKey, chapter);
  verseIndex.set(`${chapterKey}:${verse.verse}`, verse);
}

export const kjvBibleProvider: BibleProvider = {
  getChapter(requestedTranslationId, bookId, chapter) {
    if (requestedTranslationId !== translationId) return [];
    return chapterIndex.get(`${bookId}:${chapter}`) ?? [];
  },

  getVerse(requestedTranslationId, bookId, chapter, verseNumber) {
    if (requestedTranslationId !== translationId) return null;
    return verseIndex.get(`${bookId}:${chapter}:${verseNumber}`) ?? null;
  },

  search(requestedTranslationId, query) {
    if (requestedTranslationId !== translationId) return [];
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return [];

    return allVerses
      .filter(
        (verse) =>
          verse.text.toLowerCase().includes(normalizedQuery) ||
          verse.reference.toLowerCase().includes(normalizedQuery),
      )
      .slice(0, 100);
  },
};
