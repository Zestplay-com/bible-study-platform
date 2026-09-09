import { bibleBooks } from "./catalog";
import type { BibleProvider } from "./provider";
import type { BibleVerse } from "./types";
import sample from "@/data/bible/sample-kjv.json";

const translationId = sample.translation.id;

function toVerse(verse: (typeof sample.verses)[number]): BibleVerse {
  const book = bibleBooks.find((item) => item.id === verse.bookId);
  const bookName = book?.name ?? verse.bookId;

  return {
    translationId,
    bookId: verse.bookId,
    bookName,
    chapter: verse.chapter,
    verse: verse.verse,
    reference: `${bookName} ${verse.chapter}:${verse.verse}`,
    text: verse.text,
  };
}

export const sampleBibleProvider: BibleProvider = {
  getChapter(requestedTranslationId, bookId, chapter) {
    if (requestedTranslationId !== translationId) return [];

    return sample.verses
      .filter((verse) => verse.bookId === bookId && verse.chapter === chapter)
      .map(toVerse)
      .sort((a, b) => a.verse - b.verse);
  },

  getVerse(requestedTranslationId, bookId, chapter, verseNumber) {
    return (
      this.getChapter(requestedTranslationId, bookId, chapter).find(
        (verse) => verse.verse === verseNumber,
      ) ?? null
    );
  },
};
