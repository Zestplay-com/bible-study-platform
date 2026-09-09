import { describe, expect, it } from "vitest";
import { getBibleProvider } from "@/lib/bible/registry";
import { defaultTranslationId } from "@/lib/bible/translations";
import { normalizeBibleReference, parseBibleReference } from "@/lib/bible/reference";
import { buildDynamicInsight } from "@/lib/study/dynamic";

const provider = getBibleProvider(defaultTranslationId);

describe("Bible reference resolver and universal study", () => {
  it.each([
    ["John 3:16", "john", 3, 16],
    ["Psalm 23:1", "psalms", 23, 1],
    ["1 Samuel 17:45", "1-samuel", 17, 45],
    ["2 Corinthians 5:17", "2-corinthians", 5, 17],
    ["Song of Songs 2:1", "song-of-solomon", 2, 1],
  ])("resolves %s", (reference, bookId, chapter, verse) => {
    expect(parseBibleReference(reference)).toEqual({
      bookName: reference.replace(/\s+\d+:\d+$/, ""),
      bookId,
      chapter,
      verse,
    });
  });

  it("normalizes singular Psalm references to the canonical Psalms name", () => {
    expect(normalizeBibleReference("Psalm 23:1")).toBe("psalms 23:1");
  });

  it.each([
    ["Genesis 1:1"],
    ["Psalm 23:1"],
    ["Matthew 5:3"],
    ["Romans 8:28"],
    ["Revelation 21:4"],
  ])("builds a study insight for %s", ([reference]) => {
    const parsed = parseBibleReference(reference);
    const verse = parsed ? provider?.getVerse?.(defaultTranslationId, parsed.bookId, parsed.chapter, parsed.verse) : null;
    const insight = buildDynamicInsight(reference, verse?.text ?? "", provider ?? undefined, defaultTranslationId);

    expect(insight.theme).toContain(reference);
    expect(insight.whatGodIsShowing.length).toBeGreaterThan(0);
    expect(insight.context.length).toBeGreaterThan(0);
    expect(insight.words.length).toBeGreaterThan(0);
    expect(insight.questions.length).toBeGreaterThan(0);
    expect(insight.application.length).toBeGreaterThan(0);
    expect(insight.prayer.length).toBeGreaterThan(0);
  });

  it("does not crash when the reference is not a Bible reference", () => {
    const insight = buildDynamicInsight("Something else", "A short study prompt", provider ?? undefined, defaultTranslationId);
    expect(insight.words.length).toBeGreaterThan(0);
    expect(insight.questions.length).toBeGreaterThan(0);
  });
});
