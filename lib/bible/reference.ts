import { bibleBooks } from "./catalog";

export type BibleReference = {
  bookName: string;
  bookId: string;
  chapter: number;
  verse: number;
};

const aliases: Record<string, string> = {
  psalm: "psalms",
  "song of songs": "song of solomon",
};

function normalizeBookName(value: string) {
  const normalized = value.trim().toLowerCase().replace(/\s+/g, " ");
  return aliases[normalized] ?? normalized;
}

export function resolveBookId(bookName: string) {
  const normalized = normalizeBookName(bookName);
  return bibleBooks.find((book) => book.name.toLowerCase() === normalized)?.id ?? null;
}

export function parseBibleReference(reference: string): BibleReference | null {
  const match = reference.trim().match(/^(.+?)\s+(\d+):(\d+)$/);
  if (!match) return null;

  const bookName = match[1];
  const bookId = resolveBookId(bookName);
  if (!bookId) return null;

  return {
    bookName,
    bookId,
    chapter: Number(match[2]),
    verse: Number(match[3]),
  };
}

export function normalizeBibleReference(reference: string) {
  const parsed = parseBibleReference(reference);
  if (!parsed) return reference.trim().toLowerCase().replace(/\s+/g, " ");
  const book = bibleBooks.find((item) => item.id === parsed.bookId);
  return `${book?.name ?? parsed.bookName} ${parsed.chapter}:${parsed.verse}`.toLowerCase();
}
