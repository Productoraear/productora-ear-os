import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { z } from "zod";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export interface LocalAudioItem {
  filename: string;
  fullPath: string;
  streamUrl: string;
  sizeBytes: number;
  sizeFormatted: string;
  category: "fx" | "bass" | "keys" | "brass" | "drums" | "ambient" | "vocal" | "other";
  durationEstimatedSeconds?: number;
}

const AUDIO_EXTENSIONS = [".ogg", ".wav", ".mp3", ".flac", ".aac"] as const;

const CATEGORY_VALUES = [
  "fx",
  "bass",
  "keys",
  "brass",
  "drums",
  "ambient",
  "vocal",
  "other",
] as const;

type AudioCategory = (typeof CATEGORY_VALUES)[number];

const QuerySchema = z.object({
  q: z
    .string()
    .max(200, "Query demasiado larga")
    .transform((v) => v.toLowerCase().trim())
    .default(""),
  category: z
    .enum(["all", ...CATEGORY_VALUES] as [string, ...string[]])
    .default("all"),
  limit: z
    .string()
    .optional()
    .transform((v) => {
      const n = parseInt(v ?? "100", 10);
      if (Number.isNaN(n) || n <= 0) return 100;
      return Math.min(n, 500);
    }),
});

const SECURITY_HEADERS: Record<string, string> = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "no-referrer",
  "Cache-Control": "no-store, max-age=0",
  "X-EAR-OS": "v2",
};

function jsonResponse<T>(body: T, status = 200): NextResponse {
  return NextResponse.json(body, { status, headers: SECURITY_HEADERS });
}

function classifyAudio(lowerName: string): AudioCategory {
  if (lowerName.includes("bass") || lowerName.includes("sub") || lowerName.includes("808")) return "bass";
  if (lowerName.includes("chord") || lowerName.includes("piano") || lowerName.includes("key") || lowerName.includes("bell")) return "keys";
  if (lowerName.includes("brass") || lowerName.includes("horn")) return "brass";
  if (lowerName.includes("kick") || lowerName.includes("tom") || lowerName.includes("drum") || lowerName.includes("snare")) return "drums";
  if (lowerName.includes("ambient") || lowerName.includes("atmosphere") || lowerName.includes("pad")) return "ambient";
  if (lowerName.includes("vocal") || lowerName.includes("voice")) return "vocal";
  return "fx";
}

function formatSize(size: number): string {
  if (size > 1024 * 1024) return `${(size / (1024 * 1024)).toFixed(2)} MB`;
  return `${(size / 1024).toFixed(1)} KB`;
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const parsed = QuerySchema.safeParse({
      q: searchParams.get("q") ?? undefined,
      category: searchParams.get("category") ?? undefined,
      limit: searchParams.get("limit") ?? undefined,
    });

    if (!parsed.success) {
      return jsonResponse(
        {
          success: false,
          error: "Parámetros inválidos",
          details: parsed.error.flatten().fieldErrors,
        },
        400,
      );
    }

    const { q: query, category: categoryFilter, limit } = parsed.data;

    const sourceFolders: string[] = [
      path.join("D:", "BRUTOS_AUDIO", "GRABACIONES_CUBASE_(Sesiones)"),
      path.join("D:", "01_PRODUCCION_AUDIO", "Media_Suelta"),
    ];

    const results: LocalAudioItem[] = [];

    for (const folder of sourceFolders) {
      if (results.length >= limit) break;
      if (!fs.existsSync(folder)) continue;

      let fileNames: string[] = [];
      try {
        fileNames = fs.readdirSync(folder);
      } catch (e) {
        console.warn(`[local-audio] No se pudo leer directorio ${folder}:`, e);
        continue;
      }

      for (const name of fileNames) {
        if (results.length >= limit) break;

        const ext = path.extname(name).toLowerCase();
        if (!(AUDIO_EXTENSIONS as readonly string[]).includes(ext)) continue;

        if (query && !name.toLowerCase().includes(query)) continue;

        const lowerName = name.toLowerCase();
        const cat = classifyAudio(lowerName);

        if (categoryFilter !== "all" && cat !== categoryFilter) continue;

        const fullPath = path.join(folder, name);
        let size = 0;
        try {
          size = fs.statSync(fullPath).size;
        } catch {
          // Ignorar archivos inaccesibles
        }

        results.push({
          filename: name,
          fullPath,
          streamUrl: `/api/admin/video-factory/media/stream?file=${encodeURIComponent(fullPath)}`,
          sizeBytes: size,
          sizeFormatted: formatSize(size),
          category: cat,
          durationEstimatedSeconds: 3,
        });
      }
    }

    return jsonResponse({
      success: true,
      totalFound: results.length,
      limit,
      audios: results,
      totalAvailableIndexed: 1516,
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Error al indexar audios locales";
    console.error("[local-audio] Error crítico:", error);
    return jsonResponse({ success: false, error: msg }, 500);
  }
}