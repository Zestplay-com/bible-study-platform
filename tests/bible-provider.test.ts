import { describe, expect, it } from "vitest";
import { bibleBooks } from "@/lib/bible/catalog";
import { getBibleProvider } from "@/lib/bible/registry";
import { defaultTranslationId } from "@/lib/bible/translations";
import { buildDynamicInsight, parseBibleReference, resolveBookId } from "@/lib/study/dynamic";

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

describe("Universal study references", () => {
  it.each([
    ["Genesis 1:1", "genesis"],
    ["Psalm 23:1", "psalms"],
    ["1 Samuel 17:45", "1-samuel"],
    ["Song of Songs 2:1", "song-of-solomon"],
    ["Matthew 5:3", "matthew"],
    ["Romans 8:28", "romans"],
    ["1 Corinthians 13:4", "1-corinthians"],
    ["Revelation 21:4", "revelation"],
  ])("resolves %s to %s", (reference, bookId) => {
    const parsed = parseBibleReference(reference);
    expect(parsed).not.toBeNull();
    expect(resolveBookId(parsed!.bookName)).toBe(bookId);
  });

  it("builds a study insight for a verse from any part of the KJV", () => {
    const references = ["Genesis 1:1", "Psalm 23:1", "Romans 8:28", "Revelation 21:4"];

    for (const reference of references) {
      const parsed = parseBibleReference(reference)!;
      const bookId = resolveBookId(parsed.bookName)!;
      const verse = provider?.getVerse?.(defaultTranslationId, bookId, parsed.chapter, parsed.verse);
      const insight = buildDynamicInsight(reference, verse?.text ?? "", provider ?? undefined, defaultTranslationId);

      expect(verse).not.toBeNull();
      expect(insight.bigIdea.length).toBeGreaterThan(20);
      expect(insight.context.length).toBeGreaterThan(20);
      expect(insight.words.length).toBeGreaterThan(0);
      expect(insight.questions.length).toBeGreaterThan(0);
      expect(insight.application.length).toBeGreaterThan(0);
      expect(insight.prayer.length).toBeGreaterThan(20);
    }
  });

  it("grounds a direct study request in the provider when text is omitted", () => {
    const insight = buildDynamicInsight("Genesis 1:1", "", provider ?? undefined, defaultTranslationId);
    expect(insight.bigIdea).not.toContain("Open the passage in the Bible reader");
    expect(insight.context).toContain("preceding verse");
  });

  it("does not crash on an invalid reference", () => {
    const insight = buildDynamicInsight("Not a Bible reference", "A simple study request.", provider ?? undefined, defaultTranslationId);
    expect(insight.words.length).toBeGreaterThan(0);
    expect(insight.application.length).toBe(3);
  });
});
