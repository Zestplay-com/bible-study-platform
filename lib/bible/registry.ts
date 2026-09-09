import { sampleBibleProvider } from "./sample-provider";
import type { BibleProvider } from "./provider";

const providers: Record<string, BibleProvider> = {
  "kjv-sample": sampleBibleProvider,
};

export function getBibleProvider(translationId: string): BibleProvider | null {
  return providers[translationId] ?? null;
}
