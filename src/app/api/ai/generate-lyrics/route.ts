import { NextResponse } from "next/server";
import { generateStructuredLyrics, type StoryData } from "@/lib/ai/lyricsGenerator";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: { storyData?: StoryData; genre?: string };

  try {
    body = (await request.json()) as { storyData?: StoryData; genre?: string };
  } catch {
    return NextResponse.json(
      { error: "Cuerpo JSON inválido. Envía { storyData, genre }." },
      { status: 400 }
    );
  }

  const { storyData, genre } = body;

  if (!storyData || typeof storyData !== "object") {
    return NextResponse.json(
      { error: "storyData es obligatorio y debe contener la historia del evento." },
      { status: 422 }
    );
  }

  if (!genre || typeof genre !== "string") {
    return NextResponse.json(
      { error: "genre es obligatorio (ej. balada_romantica, bolero_gala)." },
      { status: 422 }
    );
  }

  const lyrics = generateStructuredLyrics(storyData, genre);

  return NextResponse.json(lyrics);
}