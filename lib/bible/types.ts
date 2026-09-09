export type BibleBook = {
  id: string;
  name: string;
  abbreviation: string;
  chapters: number;
  testament: "old" | "new";
};

export type BibleVerse = {
  bookId: string;
  bookName: string;
  chapter: number;
  verse: number;
  reference: string;
  text: string;
};
