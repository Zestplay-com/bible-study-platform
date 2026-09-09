import { kjvBibleProvider } from "./kjv-provider";
import type { BibleProvider } from "./provider";

const providers: Record<string, BibleProvider> = {
  kjv: kjvBibleProvider,
};

export function getBibleProvider(translationId: string): BibleProvider | null {
  return providers[translationId] ?? null;
}
