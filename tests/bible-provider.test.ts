import { describe, expect, it } from "vitest";
import { bibleBooks } from "@/lib/bible/catalog";
import { getBibleProvider } from "@/lib/bible/registry";
import { defaultTranslationId } from "@/lib/bible/translations";

const provider = getBibleProvider(defaultTranslationId);

describe("Bible provider", () => {
  it("loads the complete KJV corpus", () => {
    const verseCount = bibleBooks.reduce(
      (total, book) =>
        total + Array.from({ length: book.chapters }, (_, index) =>
          provider?.getChapter(defaultTranslationId, book.id, index + 1).length ?? 0,
        ).reduce((sum, count) => sum + count, 0),
      0,
    );

    expect(verseCount).toBe(31102);
  });

  it("returns the full KJV John 3:16 verse", () => {
    expect(provider?.getVerse?.(defaultTranslationId, "john", 3, 16)).toMatchObject({
      reference: "John 3:16",
      text: expect.stringContaining("For God so loved the world"),
    });
  });

  it("returns Psalm 23:1", () => {
    expect(provider?.getVerse?.(defaultTranslationId, "psalms", 23, 1)).toMatchObject({
      reference: "Psalms 23:1",
      text: expect.stringContaining("The LORD is my shepherd"),
    });
  });

  it("returns a complete John 1 chapter", () => {
    const verses = provider?.getChapter(defaultTranslationId, "john", 1) ?? [];
    expect(verses).toHaveLength(51);
    expect(verses[0]?.verse).toBe(1);
    expect(verses.at(-1)?.verse).toBe(51);
  });

  it("finds an exact reference first", () => {
    expect(provider?.search?.(defaultTranslationId, "John 3:16")).toMatchObject([
      { reference: "John 3:16" },
    ]);
  });

  it("accepts the common singular Psalm reference", () => {
    expect(provider?.search?.(defaultTranslationId, "Psalm 23:1")).toMatchObject([
      { reference: "Psalms 23:1" },
    ]);
  });

  it("ranks exact phrases above weaker text matches", () => {
    const results = provider?.search?.(defaultTranslationId, "For God so loved the world") ?? [];
    expect(results[0]?.reference).toBe("John 3:16");
  });

  it("returns no verses for an empty search", () => {
    expect(provider?.search?.(defaultTranslationId, "   ")).toEqual([]);
  });

  it("returns null for an unknown verse", () => {
    expect(provider?.getVerse?.(defaultTranslationId, "john", 3, 99)).toBeNull();
  });

  it("returns no verses for an unknown translation", () => {
    expect(provider?.getChapter("unknown", "john", 3)).toEqual([]);
  });
});
