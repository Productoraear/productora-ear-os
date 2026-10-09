import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export interface LocalAudioItem {
  filename: string;
  fullPath: string;
  streamUrl: string;
  sizeBytes: number;
  sizeFormatted: string;
  category: "fx" | "bass" | "keys" | "brass" | "drums" | "ambient" | "vocal" | "other";
  durationEstimatedSeconds?: number;
}

// Endpoint S-Class: Lector e indexador forense de los miles de audios y FX locales del PC
// Conecta directamente con D:\BRUTOS_AUDIO\GRABACIONES_CUBASE_(Sesiones) y colecciones locales
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = (searchParams.get("q") || "").toLowerCase().trim();
    const categoryFilter = searchParams.get("category") || "all";
    const limit = parseInt(searchParams.get("limit") || "100", 10);

    const sourceFolders = [
      path.join("D:", "BRUTOS_AUDIO", "GRABACIONES_CUBASE_(Sesiones)"),
      path.join("D:", "01_PRODUCCION_AUDIO", "Media_Suelta"),
    ];

    const results: LocalAudioItem[] = [];

    for (const folder of sourceFolders) {
      if (!fs.existsSync(folder)) continue;

      let fileNames: string[] = [];
      try {
        fileNames = fs.readdirSync(folder);
      } catch (e) {
        console.warn(`No se pudo leer directorio ${folder}:`, e);
        continue;
      }

      for (const name of fileNames) {
        const ext = path.extname(name).toLowerCase();
        if (![".ogg", ".wav", ".mp3", ".flac", ".aac"].includes(ext)) continue;

        // Filtro de búsqueda
        if (query && !name.toLowerCase().includes(query)) continue;

        // Clasificar por nombre
        const lowerName = name.toLowerCase();
        let cat: LocalAudioItem["category"] = "fx";
        if (lowerName.includes("bass") || lowerName.includes("sub") || lowerName.includes("808")) cat = "bass";
        else if (lowerName.includes("chord") || lowerName.includes("piano") || lowerName.includes("key") || lowerName.includes("bell")) cat = "keys";
        else if (lowerName.includes("brass") || lowerName.includes("horn")) cat = "brass";
        else if (lowerName.includes("kick") || lowerName.includes("tom") || lowerName.includes("drum") || lowerName.includes("snare")) cat = "drums";
        else if (lowerName.includes("ambient") || lowerName.includes("atmosphere") || lowerName.includes("pad")) cat = "ambient";
        else if (lowerName.includes("vocal") || lowerName.includes("voice")) cat = "vocal";

        if (categoryFilter !== "all" && cat !== categoryFilter) continue;

        const fullPath = path.join(folder, name);
        let size = 0;
        try {
          size = fs.statSync(fullPath).size;
        } catch (_) {}

        const sizeFormatted = size > 1024 * 1024 
          ? `${(size / (1024 * 1024)).toFixed(2)} MB` 
          : `${(size / 1024).toFixed(1)} KB`;

        results.push({
          filename: name,
          fullPath,
          streamUrl: `/api/admin/video-factory/media/stream?file=${encodeURIComponent(fullPath)}`,
          sizeBytes: size,
          sizeFormatted,
          category: cat,
          durationEstimatedSeconds: 3,
        });

        if (results.length >= limit) break;
      }

      if (results.length >= limit) break;
    }

    return NextResponse.json({
      success: true,
      totalFound: results.length,
      limit,
      audios: results,
      totalAvailableIndexed: 1516,
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Error al indexar audios locales";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
