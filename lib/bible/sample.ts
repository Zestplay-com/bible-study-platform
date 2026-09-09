import sample from "@/data/bible/sample-kjv.json";
import type { BibleVerse } from "./types";

export function getChapter(bookId: string, chapter: number): BibleVerse[] {
  return sample.verses
    .filter((verse) => verse.bookId === bookId && verse.chapter === chapter)
    .map((verse) => ({
      ...verse,
      bookName: "",
      reference: `${bookId} ${verse.chapter}:${verse.verse}`,
    }));
}
