export type BibleBook = {
  id: string;
  name: string;
  abbreviation: string;
  chapters: number;
  testament: "old" | "new";
};

export type BibleVerse = {
  translationId: string;
  bookId: string;
  bookName: string;
  chapter: number;
  verse: number;
  reference: string;
  text: string;
};

export type BibleTranslation = {
  id: string;
  name: string;
  abbreviation: string;
  language: string;
  license: string;
  status: "development" | "production";
};
