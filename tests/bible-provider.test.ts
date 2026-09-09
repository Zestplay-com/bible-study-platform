import { describe, expect, it } from "vitest";
import { getBibleProvider } from "@/lib/bible/registry";
import { defaultTranslationId } from "@/lib/bible/translations";

const provider = getBibleProvider(defaultTranslationId);

describe("Bible provider", () => {
  it("loads the complete KJV corpus", () => {
    const verseCount = Array.from({ length: 66 }).reduce((total, _, index) => {
      const bookId = [
        "genesis", "exodus", "leviticus", "numbers", "deuteronomy", "joshua", "judges", "ruth",
        "1-samuel", "2-samuel", "1-kings", "2-kings", "1-chronicles", "2-chronicles", "ezra", "nehemiah",
        "esther", "job", "psalms", "proverbs", "ecclesiastes", "song-of-solomon", "isaiah", "jeremiah",
        "lamentations", "ezekiel", "daniel", "hosea", "joel", "amos", "obadiah", "jonah", "micah", "nahum",
        "habakkuk", "zephaniah", "haggai", "zechariah", "malachi", "matthew", "mark", "luke", "john", "acts",
        "romans", "1-corinthians", "2-corinthians", "galatians", "ephesians", "philippians", "colossians",
        "1-thessalonians", "2-thessalonians", "1-timothy", "2-timothy", "titus", "philemon", "hebrews", "james",
        "1-peter", "2-peter", "1-john", "2-john", "3-john", "jude", "revelation",
      ][index];
      return total + Array.from({ length: 150 }, (_, chapter) =>
        provider?.getChapter(defaultTranslationId, bookId, chapter + 1).length ?? 0,
      ).reduce((sum, count) => sum + count, 0);
    }, 0);

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

  it("searches the full Bible text", () => {
    const results = provider?.search?.(defaultTranslationId, "For God so loved the world") ?? [];
    expect(results.some((verse) => verse.reference === "John 3:16")).toBe(true);
  });

  it("returns null for an unknown verse", () => {
    expect(provider?.getVerse?.(defaultTranslationId, "john", 3, 99)).toBeNull();
  });

  it("returns no verses for an unknown translation", () => {
    expect(provider?.getChapter("unknown", "john", 3)).toEqual([]);
  });
});
