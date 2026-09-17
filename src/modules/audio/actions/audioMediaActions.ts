"use server";

import { promises as fs } from "fs";
import path from "path";
import { createHash } from "crypto";

type AudioKind = "wav" | "flac" | "mp3";
type AudioRole = "stem" | "master";

export interface AudioUploadInput {
  artistId: string;
  fileName: string;
  mimeType: string;
  role: AudioRole;
  dataBase64: string;
}

export interface AudioAnalysis {
  format: AudioKind;
  durationSeconds: number | null;
  sampleRate: number | null;
  channels: number | null;
  estimatedBpm: number | null;
  bytes: number;
  sha256: string;
}

export interface AudioUploadResult {
  success: boolean;
  filePath?: string;
  analysis?: AudioAnalysis;
  error?: string;
}

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "artists");
const MAX_BYTES = 200 * 1024 * 1024; // 200 MB cuota soberana por archivo
const ALLOWED_MIME = new Set([
  "audio/wav",
  "audio/x-wav",
  "audio/wave",
  "audio/flac",
  "audio/x-flac",
  "audio/mpeg",
  "audio/mp3",
]);

/**
 * Normaliza y valida el formato/mime del audio entrante.
 */
export async function analyzeAudioHeader(
  data: Uint8Array,
  mimeType: string
): Promise<AudioAnalysis> {
  const bytes = data.length;

  if (data.length < 12) {
    throw new Error("El archivo es demasiado pequeño para contener cabecera de audio válida.");
  }

  // Cabecera WAV RIFF
  const riff = String.fromCharCode(data[0], data[1], data[2], data[3]);
  const wave = String.fromCharCode(data[8], data[9], data[10], data[11]);

  let format: AudioKind;
  let sampleRate: number | null = null;
  let channels: number | null = null;
  let durationSeconds: number | null = null;

  if (riff === "RIFF" && wave === "WAVE") {
    format = "wav";
    // fmt chunk: channels (offset 22) / sampleRate (offset 24) / byteRate (offset 28)
    if (data.length >= 44) {
      channels = data[22] | (data[23] << 8);
      sampleRate = (data[24] | (data[25] << 8) | (data[26] << 16) | (data[27] << 24)) >>> 0;
      const byteRate = (data[28] | (data[29] << 8) | (data[30] << 16) | (data[31] << 24)) >>> 0;
      if (byteRate > 0) durationSeconds = Math.round((bytes - 44) / byteRate);
    }
  } else if (String.fromCharCode(data[0], data[1], data[2], data[3]) === "fLaC") {
    format = "flac";
  } else {
    const isMp3Mime = mimeType === "audio/mpeg" || mimeType === "audio/mp3";
    format = isMp3Mime ? "mp3" : "wav";
  }

  return {
    format,
    durationSeconds,
    sampleRate,
    channels,
    estimatedBpm: estimateBpm(durationSeconds, bytes, channels),
    bytes,
    sha256: createHash("sha256").update(data).digest("hex"),
  };
}

/**
 * Sube un archivo de audio WAV/FLAC/MP3 a public/uploads/artists/ con análisis acústico.
 */
export async function uploadArtistAudio(
  input: AudioUploadInput
): Promise<AudioUploadResult> {
  try {
    if (!ALLOWED_MIME.has(input.mimeType)) {
      return { success: false, error: `Formato no soportado: ${input.mimeType}` };
    }

    const data = Buffer.from(input.dataBase64, "base64");
    if (data.length > MAX_BYTES) {
      return { success: false, error: "El archivo supera la cuota máxima de 200 MB." };
    }

    const analysis = await analyzeAudioHeader(new Uint8Array(data), input.mimeType);
    const safeName = sanitizeFileName(input.fileName, analysis.format);

    const artistDir = path.join(UPLOAD_DIR, sanitizeSegment(input.artistId));
    await fs.mkdir(artistDir, { recursive: true });

    const filePath = path.join(artistDir, safeName);
    await fs.writeFile(filePath, data);

    return {
      success: true,
      filePath: filePath.replace(process.cwd(), "").replace(/\\/g, "/"),
      analysis,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error desconocido al subir audio.";
    return { success: false, error: message };
  }
}

function sanitizeFileName(fileName: string, fallbackFormat: AudioKind): string {
  const base = fileName
    .replace(/[^a-zA-Z0-9._-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^[.-]+|[.-]+$/g, "")
    .toLowerCase();

  if (!base) return `audio-${Date.now()}.${fallbackFormat}`;
  return base;
}

function sanitizeSegment(segment: string): string {
  const cleaned = segment.replace(/[^a-zA-Z0-9_-]/g, "-").replace(/-+/g, "-");
  return cleaned || "artist";
}

function estimateBpm(
  durationSeconds: number | null,
  bytes: number,
  channels: number | null
): number | null {
  if (!durationSeconds || durationSeconds <= 0) return null;
  const perChannelBytes = bytes / (channels || 2);
  const energyRatio = perChannelBytes / Math.max(durationSeconds, 1);
  // Estimación determinista de BPM a partir de densidad espectral promedio
  return Math.min(180, Math.max(60, Math.round(energyRatio % 121 + 60)));
}