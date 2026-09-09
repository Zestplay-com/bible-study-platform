import { describe, expect, it } from "vitest";
import { getKnownInsightReferences, getStudyInsight } from "@/lib/study/insights";

describe("deep study insights", () => {
  it("normalizes Psalm references", () => {
    expect(getStudyInsight("Psalm 23:1")?.key).toBe("psalms 23:1");
  });

  it("provides original-language study and connections", () => {
    const insight = getStudyInsight("John 3:16");
    expect(insight?.words.length).toBeGreaterThanOrEqual(4);
    expect(insight?.crossReferences.length).toBeGreaterThanOrEqual(4);
    expect(insight?.whatGodIsShowing.length).toBeGreaterThanOrEqual(3);
  });

  it("keeps a known insight catalog", () => {
    expect(getKnownInsightReferences()).toContain("john 3:16");
    expect(getStudyInsight("unknown 1:1")).toBeNull();
  });
});
