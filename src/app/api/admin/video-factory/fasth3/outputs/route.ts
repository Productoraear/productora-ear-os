import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export interface FastH3OutputFile {
  filename: string;
  relativePath: string;
  streamUrl: string;
  sizeBytes: number;
  sizeFormatted: string;
  createdAt: string;
  mediaType: "video" | "image" | "audio" | "other";
}

// Endpoint S-Class: Inspección forense de outputs generados por FastH3 / ComfyUI en H:\ComfyUI\output
export async function GET() {
  try {
    const outputDir = path.join("H:", "ComfyUI", "output");

    if (!fs.existsSync(outputDir)) {
      return NextResponse.json({ files: [] });
    }

    const dirents = fs.readdirSync(outputDir, { withFileTypes: true });
    const files: FastH3OutputFile[] = [];

    for (const dirent of dirents) {
      if (!dirent.isFile()) continue;
      const filename = dirent.name;
      if (filename.startsWith(".") || filename.startsWith("_")) continue;

      const fullPath = path.join(outputDir, filename);
      const stat = fs.statSync(fullPath);

      const ext = path.extname(filename).toLowerCase();
      let mediaType: "video" | "image" | "audio" | "other" = "other";
      if ([".mp4", ".webm", ".mov", ".mkv"].includes(ext)) mediaType = "video";
      else if ([".png", ".jpg", ".jpeg", ".webp"].includes(ext)) mediaType = "image";
      else if ([".mp3", ".wav", ".ogg", ".flac"].includes(ext)) mediaType = "audio";

      const sizeMB = (stat.size / (1024 * 1024)).toFixed(2);
      const sizeFormatted = stat.size > 1024 * 1024 ? `${sizeMB} MB` : `${(stat.size / 1024).toFixed(1)} KB`;

      files.push({
        filename,
        relativePath: filename,
        streamUrl: `/api/admin/video-factory/media/stream?file=${encodeURIComponent(filename)}`,
        sizeBytes: stat.size,
        sizeFormatted,
        createdAt: stat.mtime.toISOString(),
        mediaType,
      });
    }

    // Ordenar por fecha descendente (más recientes primero)
    files.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json({
      success: true,
      totalFiles: files.length,
      files,
      outputDir,
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Error al escanear carpeta de salida";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
