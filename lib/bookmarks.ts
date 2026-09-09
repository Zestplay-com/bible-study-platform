export type Bookmark = {
  reference: string;
  text: string;
  translationId: string;
  savedAt: number;
};

export const BOOKMARKS_STORAGE_KEY = "bible-study-bookmarks";

export function bookmarkId(reference: string, translationId = "kjv") {
  return `${translationId}:${reference}`;
}

export function addBookmark(bookmarks: Bookmark[], bookmark: Bookmark) {
  if (bookmarks.some((item) => bookmarkId(item.reference, item.translationId) === bookmarkId(bookmark.reference, bookmark.translationId))) {
    return bookmarks;
  }
  return [bookmark, ...bookmarks];
}

export function removeBookmark(bookmarks: Bookmark[], bookmark: Pick<Bookmark, "reference" | "translationId">) {
  return bookmarks.filter(
    (item) => bookmarkId(item.reference, item.translationId) !== bookmarkId(bookmark.reference, bookmark.translationId),
  );
}
