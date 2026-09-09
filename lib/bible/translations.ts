import type { BibleTranslation } from "./types";

export const bibleTranslations: BibleTranslation[] = [
  {
    id: "kjv-sample",
    name: "King James Version (sample)",
    abbreviation: "KJV",
    language: "English",
    license: "Development sample only; replace with a verified public-domain/licensed dataset before production.",
    status: "development",
  },
];

export const defaultTranslationId = "kjv-sample";
