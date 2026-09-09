import { describe, expect, it } from "vitest";
import { addBookmark, bookmarkId, removeBookmark, type Bookmark } from "@/lib/bookmarks";

const first: Bookmark = {
  reference: "John 3:16",
  text: "For God so loved the world",
  translationId: "kjv",
  savedAt: 1,
};

describe("bookmark helpers", () => {
  it("creates a stable id from translation and reference", () => {
    expect(bookmarkId("John 3:16", "kjv")).toBe("kjv:John 3:16");
  });

  it("adds a new bookmark to the front", () => {
    const second = { ...first, reference: "Psalm 23:1", savedAt: 2 };
    expect(addBookmark([first], second)).toEqual([second, first]);
  });

  it("does not add the same verse twice", () => {
    expect(addBookmark([first], { ...first, savedAt: 99 })).toEqual([first]);
  });

  it("removes only the matching verse", () => {
    const second = { ...first, reference: "Psalm 23:1" };
    expect(removeBookmark([first, second], first)).toEqual([second]);
  });
});
