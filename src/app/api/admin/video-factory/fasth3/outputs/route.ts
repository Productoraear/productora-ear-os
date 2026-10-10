import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export interface FastH3OutputFile {
  filename: string;
  relativePath: string;
  streamUrl: string;
  sizeBytes: number;
  sizeFormatted: string;
  createdAt: string;
  mediaType: "video" | "image" | "audio" | "other";
}

export interface FastH3OutputsResponse {
  success: true;
  totalFiles: number;
  files: FastH3OutputFile[];
  outputDir: string;
}

export interface FastH3OutputsErrorResponse {
  success: false;
  error: string;
  code: "OUTPUT_DIR_UNAVAILABLE" | "SCAN_FAILED";
}

const SECURITY_HEADERS: Record<string, string> = {
  "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "no-referrer",
  "Content-Security-Policy": "default-src 'none'; frame-ancestors 'none'",
};

const VIDEO_EXTS = new Set([".mp4", ".webm", ".mov", ".mkv"]);
const IMAGE_EXTS = new Set([".png", ".jpg", ".jpeg", ".webp"]);
const AUDIO_EXTS = new Set([".mp3", ".wav", ".ogg", ".flac"]);

const MAX_FILENAME_LENGTH = 512;
const SAFE_FILENAME_REGEX = /^[A-Za-z0-9._\-() [\]]+$/;

function jsonResponse<T>(body: T, status = 200): NextResponse<T> {
  return NextResponse.json<T>(body, { status, headers: SECURITY_HEADERS });
}

function resolveMediaType(ext: string): FastH3OutputFile["mediaType"] {
  if (VIDEO_EXTS.has(ext)) return "video";
  if (IMAGE_EXTS.has(ext)) return "image";
  if (AUDIO_EXTS.has(ext)) return "audio";
  return "other";
}

function formatSize(sizeBytes: number): string {
  if (sizeBytes >= 1024 * 1024) {
    return `${(sizeBytes / (1024 * 1024)).toFixed(2)} MB`;
  }
  if (sizeBytes >= 1024) {
    return `${(sizeBytes / 1024).toFixed(1)} KB`;
  }
  return `${sizeBytes} B`;
}

function isSafeFilename(filename: string): boolean {
  if (!filename || filename.length === 0 || filename.length > MAX_FILENAME_LENGTH) {
    return false;
  }
  if (filename.startsWith(".") || filename.startsWith("_")) {
    return false;
  }
  if (filename.includes("/") || filename.includes("\\") || filename.includes("..")) {
    return false;
  }
  if (filename.includes("\u0000")) {
    return false;
  }
  return SAFE_FILENAME_REGEX.test(filename);
}

export async function GET(): Promise<NextResponse<FastH3OutputsResponse | FastH3OutputsErrorResponse>> {
  try {
    const outputDir = path.join("H:", "ComfyUI", "output");

    if (!fs.existsSync(outputDir)) {
      return jsonResponse<FastH3OutputsResponse>(
        {
          success: true,
          totalFiles: 0,
          files: [],
          outputDir,
        },
        200,
      );
    }

    const dirents = fs.readdirSync(outputDir, { withFileTypes: true });
    const files: FastH3OutputFile[] = [];

    for (const dirent of dirents) {
      if (!dirent.isFile()) continue;

      const filename = dirent.name;
      if (!isSafeFilename(filename)) continue;

      const fullPath = path.join(outputDir, filename);

      let stat: fs.Stats;
      try {
        stat = fs.statSync(fullPath);
      } catch {
        continue;
      }

      if (!stat.isFile()) continue;

      const ext = path.extname(filename).toLowerCase();
      const mediaType = resolveMediaType(ext);

      files.push({
        filename,
        relativePath: filename,
        streamUrl: `/api/admin/video-factory/media/stream?file=${encodeURIComponent(filename)}`,
        sizeBytes: stat.size,
        sizeFormatted: formatSize(stat.size),
        createdAt: stat.mtime.toISOString(),
        mediaType,
      });
    }

    files.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return jsonResponse<FastH3OutputsResponse>(
      {
        success: true,
        totalFiles: files.length,
        files,
        outputDir,
      },
      200,
    );
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Error al escanear carpeta de salida";
    return jsonResponse<FastH3OutputsErrorResponse>(
      {
        success: false,
        error: msg,
        code: "SCAN_FAILED",
      },
      500,
    );
  }
}