import type { BibleVerse } from "./types";

export interface BibleProvider {
  getChapter(
    translationId: string,
    bookId: string,
    chapter: number,
  ): BibleVerse[];

  getVerse?(
    translationId: string,
    bookId: string,
    chapter: number,
    verse: number,
  ): BibleVerse | null;

  search?(translationId: string, query: string): BibleVerse[];
}
