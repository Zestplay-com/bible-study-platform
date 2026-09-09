export type MemoryRating = "again" | "hard" | "good" | "easy";

export const MEMORY_INTERVALS_DAYS = [1, 2, 4, 7, 14, 30] as const;

export function getNextMemoryLevel(level: number, rating: MemoryRating): number {
  const current = Math.max(0, Math.min(5, Math.round(level || 0)));

  if (rating === "again") return 0;
  if (rating === "hard") return Math.max(0, current - (current > 0 ? 1 : 0));
  if (rating === "good") return Math.min(5, current + 1);
  return Math.min(5, current + 2);
}

export function getReviewIntervalDays(level: number, rating: MemoryRating): number {
  const nextLevel = getNextMemoryLevel(level, rating);

  if (rating === "again") return 1;
  if (rating === "hard") return Math.min(3, Math.max(1, Math.ceil(MEMORY_INTERVALS_DAYS[nextLevel] / 2)));
  if (rating === "easy") return Math.min(60, MEMORY_INTERVALS_DAYS[nextLevel] * 2);
  return MEMORY_INTERVALS_DAYS[nextLevel];
}

export function getNextReviewAt(level: number, rating: MemoryRating, now = Date.now()): number {
  return now + getReviewIntervalDays(level, rating) * 86400000;
}

export function isMemoryDue(nextReview: number, now = Date.now()): boolean {
  return nextReview <= now;
}

export function getMemoryStatus(level: number): "Learning" | "Remembering" | "Mastery" {
  if (level >= 5) return "Mastery";
  if (level >= 2) return "Remembering";
  return "Learning";
}
