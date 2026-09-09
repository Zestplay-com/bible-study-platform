import type { BibleTranslation } from "./types";

export const bibleTranslations: BibleTranslation[] = [
  {
    id: "kjv",
    name: "King James Version",
    abbreviation: "KJV",
    language: "English",
    license: "King James Version text: public domain. Data package: MIT-licensed kjv package; verify jurisdiction-specific requirements before production distribution.",
    status: "production",
  },
];

export const defaultTranslationId = "kjv";
