import { describe, expect, it } from "vitest";
import {
  getMemoryStatus,
  getNextMemoryLevel,
  getNextReviewAt,
  getReviewIntervalDays,
  isMemoryDue,
} from "@/lib/memory";

describe("memory scheduler", () => {
  it("moves good reviews forward one level", () => {
    expect(getNextMemoryLevel(0, "good")).toBe(1);
    expect(getNextMemoryLevel(3, "good")).toBe(4);
  });

  it("gives easy reviews a larger interval and caps mastery", () => {
    expect(getNextMemoryLevel(4, "easy")).toBe(5);
    expect(getReviewIntervalDays(4, "easy")).toBe(60);
    expect(getNextMemoryLevel(5, "easy")).toBe(5);
  });

  it("resets a failed recall and schedules it for tomorrow", () => {
    expect(getNextMemoryLevel(4, "again")).toBe(0);
    expect(getReviewIntervalDays(4, "again")).toBe(1);
  });

  it("keeps hard reviews close", () => {
    expect(getNextMemoryLevel(4, "hard")).toBe(3);
    expect(getReviewIntervalDays(4, "hard")).toBe(2);
  });

  it("calculates due state from the supplied clock", () => {
    const now = 1_000_000;
    expect(isMemoryDue(now - 1, now)).toBe(true);
    expect(isMemoryDue(now + 1, now)).toBe(false);
    expect(getNextReviewAt(0, "good", now)).toBe(now + 2 * 86400000);
  });

  it("labels progress clearly", () => {
    expect(getMemoryStatus(0)).toBe("Learning");
    expect(getMemoryStatus(2)).toBe("Remembering");
    expect(getMemoryStatus(5)).toBe("Mastery");
  });
});
