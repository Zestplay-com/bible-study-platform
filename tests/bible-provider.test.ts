import { describe, expect, it } from "vitest";
import { getBibleProvider } from "@/lib/bible/registry";
import { defaultTranslationId } from "@/lib/bible/translations";

const provider = getBibleProvider(defaultTranslationId);

describe("Bible provider", () => {
  it("returns the sample John 3:16 verse", () => {
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

  it("returns verses in chapter order", () => {
    const verses = provider?.getChapter(defaultTranslationId, "john", 1) ?? [];
    expect(verses.map((verse) => verse.verse)).toEqual([1, 2, 3]);
  });

  it("returns null for an unknown verse", () => {
    expect(provider?.getVerse?.(defaultTranslationId, "john", 3, 99)).toBeNull();
  });

  it("returns no verses for an unknown translation", () => {
    expect(provider?.getChapter("unknown", "john", 3)).toEqual([]);
  });
});
