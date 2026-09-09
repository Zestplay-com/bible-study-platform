import { defaultTranslationId } from "./translations";
import { sampleBibleProvider } from "./sample-provider";

export const getChapter = (bookId: string, chapter: number) =>
  sampleBibleProvider.getChapter(defaultTranslationId, bookId, chapter);

export const getVerse = (bookId: string, chapter: number, verse: number) =>
  sampleBibleProvider.getVerse?.(defaultTranslationId, bookId, chapter, verse) ?? null;
