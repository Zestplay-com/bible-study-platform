import { generateText } from "ai";
import { defaultTranslationId } from "@/lib/bible/translations";
import { getBibleProvider } from "@/lib/bible/registry";
import { parseBibleReference } from "@/lib/bible/reference";
import { buildDynamicInsight } from "@/lib/study/dynamic";
import { getStudyInsight } from "@/lib/study/insights";

const MODEL = "openai/gpt-5.6-luna";

export async function askBibleTeacher(reference: string, question: string) {
  const cleanReference = reference.trim().slice(0, 120);
  const cleanQuestion = question.trim().slice(0, 1200);
  if (!cleanReference || !cleanQuestion) throw new Error("Reference and question are required.");

  const provider = getBibleProvider(defaultTranslationId);
  const parsed = parseBibleReference(cleanReference);
  const verse = parsed && provider?.getVerse
    ? provider.getVerse(defaultTranslationId, parsed.bookId, parsed.chapter, parsed.verse)
    : null;
  const chapter = parsed && provider ? provider.getChapter(defaultTranslationId, parsed.bookId, parsed.chapter) : [];
  const insight = getStudyInsight(cleanReference) ?? buildDynamicInsight(cleanReference, verse?.text ?? "", provider ?? undefined, defaultTranslationId);

  const contextVerses = verse
    ? chapter.filter((item) => Math.abs(item.verse - verse.verse) <= 2).map((item) => `${item.reference}: ${item.text}`).join("\n")
    : "No exact verse was found in the Bible provider.";

  const { text } = await generateText({
    model: MODEL,
    maxOutputTokens: 1200,
    system: `You are the Bible Teacher inside a Scripture-first Bible study platform.

Your job is to help the user understand Scripture faithfully, clearly, deeply, and practically.
Rules:
- Treat the supplied Bible text as the primary source. Do not invent verses, quotations, Greek/Hebrew forms, historical facts, or meanings.
- Distinguish clearly between what the passage says, a reasonable interpretation, and an application.
- Never claim private revelation such as "God told me". Instead say what the passage reveals about God, His character, purposes, commands, promises, or the human response.
- When discussing Greek or Hebrew, only use the supplied study notes unless you are certain. Do not manufacture morphology or etymology.
- Connect Scripture with Scripture carefully. A shared word alone does not prove the same meaning.
- Use simple English, but do not make the answer shallow.
- When useful, structure the answer with short headings such as Meaning, Context, What This Reveals, Bible Connections, and What To Do.
- If the question is unrelated to Scripture, politely bring the conversation back to the passage.

Grounding dossier:
Reference: ${cleanReference}
Verse text: ${verse?.text ?? "Not available"}
Immediate chapter context:
${contextVerses}
Study insight theme: ${insight.theme}
Study insight: ${insight.bigIdea}
Original-language study notes:
${insight.words.map((word) => `${word.word}: ${word.original} (${word.transliteration}) — ${word.meaning}. ${word.whyItMatters}`).join("\n")}
Cross-reference notes:
${insight.crossReferences.map((item) => `${item.reference}: ${item.connection}`).join("\n")}`,
    prompt: cleanQuestion,
  });

  return { answer: text, reference: cleanReference, model: MODEL };
}
