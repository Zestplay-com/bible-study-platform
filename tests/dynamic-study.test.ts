import { describe, expect, it } from "vitest";
import { getBibleProvider } from "@/lib/bible/registry";
import { defaultTranslationId } from "@/lib/bible/translations";
import { buildDynamicInsight } from "@/lib/study/dynamic";

const provider = getBibleProvider(defaultTranslationId);

describe("dynamic Bible study", () => {
  it("builds a study for Genesis 1:1", () => {
    const verse = provider?.getVerse?.(defaultTranslationId, "genesis", 1, 1);
    const insight = buildDynamicInsight("Genesis 1:1", verse?.text ?? "", provider ?? undefined, defaultTranslationId);

    expect(verse?.text).toBeTruthy();
    expect(insight.context).toContain("Genesis 1:1");
    expect(insight.words.length).toBeGreaterThan(0);
    expect(insight.questions.length).toBeGreaterThan(0);
    expect(insight.application.length).toBeGreaterThan(0);
  });

  it("resolves the singular Psalm name", () => {
    const verse = provider?.getVerse?.(defaultTranslationId, "psalms", 23, 1);
    const insight = buildDynamicInsight("Psalm 23:1", verse?.text ?? "", provider ?? undefined, defaultTranslationId);

    expect(insight.context).toContain("Psalms 23:1");
    expect(insight.context).toContain("The LORD is my shepherd");
  });

  it("resolves numbered and multi-word book names", () => {
    const cases = [
      ["1 Samuel 17:45", "1-samuel", 17, 45],
      ["2 Corinthians 5:17", "2-corinthians", 5, 17],
      ["Song of Solomon 2:1", "song-of-solomon", 2, 1],
    ] as const;

    for (const [reference, bookId, chapter, verseNumber] of cases) {
      const verse = provider?.getVerse?.(defaultTranslationId, bookId, chapter, verseNumber);
      const insight = buildDynamicInsight(reference, verse?.text ?? "", provider ?? undefined, defaultTranslationId);
      expect(verse?.text).toBeTruthy();
      expect(insight.context).toContain(verse?.reference ?? reference);
    }
  });

  it("never crashes when a verse is missing", () => {
    const insight = buildDynamicInsight("Not A Real Book 1:1", "", provider ?? undefined, defaultTranslationId);

    expect(insight.bigIdea).toBeTruthy();
    expect(insight.words.length).toBeGreaterThan(0);
    expect(insight.application.length).toBeGreaterThan(0);
  });
});
