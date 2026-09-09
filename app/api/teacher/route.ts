import { NextResponse } from "next/server";
import { askBibleTeacher } from "@/lib/ai/teacher";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function POST(request: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: "AI Teacher is not configured yet. Add OPENAI_API_KEY to the server environment." }, { status: 503 });
    }

    const body = await request.json() as { reference?: unknown; question?: unknown };
    const reference = typeof body.reference === "string" ? body.reference : "";
    const question = typeof body.question === "string" ? body.question : "";

    if (question.trim().length < 3) {
      return NextResponse.json({ error: "Please ask a more specific question." }, { status: 400 });
    }

    if (question.length > 1200) {
      return NextResponse.json({ error: "Please keep your question under 1,200 characters." }, { status: 400 });
    }

    const result = await askBibleTeacher(reference, question);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Bible Teacher request failed", error);
    return NextResponse.json({ error: "The Bible Teacher could not answer right now. Please try again." }, { status: 500 });
  }
}
