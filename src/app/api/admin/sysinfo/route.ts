export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import os from 'os';
import { z } from 'zod';
import { requireAdmin } from '@/lib/security/adminGuard';

/* ------------------------------------------------------------------ */
/*  SSOT / Constantes                                                  */
/* ------------------------------------------------------------------ */

const OLLAMA_BASE_URL = 'http://127.0.0.1:11434';
const OLLAMA_TIMEOUT_MS = 1500;
const BYTES_PER_GB = 1024 * 1024 * 1024;
const BYTES_PER_MB = 1024 * 1024;

const GPU_DEFAULT = {
  model: 'AMD Radeon RX 7900 XTX',
  totalVramMB: 24576,
} as const;

const FALLBACK_27B_VRAM_MB = 17200;
const DEFAULT_CONTEXT_SIZE = 215000;

/* ------------------------------------------------------------------ */
/*  Zod Schemas — validación estricta de respuestas externas           */
/* ------------------------------------------------------------------ */

const OllamaModelDetailsSchema = z
  .object({
    parameter_size: z.string().optional(),
    quantization_level: z.string().optional(),
  })
  .partial()
  .passthrough();

const OllamaTagModelSchema = z
  .object({
    name: z.string(),
    size: z.number().nonnegative().optional(),
    modified_at: z.string().optional(),
    details: OllamaModelDetailsSchema.optional(),
  })
  .passthrough();

const OllamaTagsResponseSchema = z
  .object({
    models: z.array(OllamaTagModelSchema).optional().default([]),
  })
  .passthrough();

const OllamaPsModelSchema = z
  .object({
    name: z.string(),
    size_vram: z.number().nonnegative().optional(),
    size: z.number().nonnegative().optional(),
    expires_at: z.string().optional(),
    context_size: z.number().int().positive().optional(),
  })
  .passthrough();

const OllamaPsResponseSchema = z
  .object({
    models: z.array(OllamaPsModelSchema).optional().default([]),
  })
  .passthrough();

/* ------------------------------------------------------------------ */
/*  Tipos de dominio                                                   */
/* ------------------------------------------------------------------ */

interface InstalledModel {
  name: string;
  sizeGB: string;
  parameterSize: string;
  quantization: string;
  modifiedAt: string | null;
}

interface RunningModel {
  name: string;
  vramMB: number;
  expiresAt: string | null;
  contextSize: number;
}

interface GpuInfo {
  model: string;
  totalVramMB: number;
  estimatedUsedVramMB: number;
  headroomVramMB: number;
}

interface SysInfoResponse {
  success: true;
  timestamp: string;
  system: {
    platform: NodeJS.Platform;
    uptimeSeconds: number;
    cpuModel: string;
    cpuCores: number;
    ramTotalGB: string;
    ramUsedGB: string;
    ramFreeGB: string;
    ramUsagePct: number;
  };
  hardware: {
    gpu: string;
    vramTotalMB: number;
    vramUsedMB: number;
    vramFreeMB: number;
    vramUsagePct: number;
  };
  ollama: {
    online: boolean;
    installedModelsCount: number;
    installedModels: InstalledModel[];
    runningModels: RunningModel[];
  };
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const SECURITY_HEADERS: Record<string, string> = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'no-referrer',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
};

function jsonResponse<T>(body: T, status = 200): NextResponse<T> {
  return NextResponse.json<T>(body, {
    status,
    headers: SECURITY_HEADERS,
  });
}

function toGB(bytes: number): string {
  return (bytes / BYTES_PER_GB).toFixed(2);
}

function toMB(bytes: number): number {
  return Math.round(bytes / BYTES_PER_MB);
}

function safeErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (typeof err === 'string') return err;
  return 'unknown error';
}

async function fetchOllamaJson(
  path: string,
  signal: AbortSignal,
): Promise<unknown | null> {
  try {
    const res = await fetch(`${OLLAMA_BASE_URL}${path}`, {
      signal,
      cache: 'no-store',
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) return null;
    return (await res.json()) as unknown;
  } catch {
    return null;
  }
}

/* ------------------------------------------------------------------ */
/*  Handler                                                            */
/* ------------------------------------------------------------------ */

export async function GET(request: Request): Promise<NextResponse> {
  try {
    const auth = await requireAdmin(request);
    if (!auth.ok) return auth.response;

    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMem = Math.max(0, totalMem - freeMem);
    const memUsagePct =
      totalMem > 0 ? Math.round((usedMem / totalMem) * 100) : 0;

    const cpus = os.cpus();
    const cpuModel = cpus.length > 0 ? cpus[0].model : 'AMD / Intel CPU';
    const cpuCores = cpus.length;

    let ollamaOnline = false;
    const installedModels: InstalledModel[] = [];
    const runningModels: RunningModel[] = [];
    const gpuInfo: GpuInfo = {
      model: GPU_DEFAULT.model,
      totalVramMB: GPU_DEFAULT.totalVramMB,
      estimatedUsedVramMB: 0,
      headroomVramMB: GPU_DEFAULT.totalVramMB,
    };

    /* -------- Consulta Ollama con timeout y validación Zod -------- */
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), OLLAMA_TIMEOUT_MS);

    try {
      const [tagsRaw, psRaw] = await Promise.all([
        fetchOllamaJson('/api/tags', controller.signal),
        fetchOllamaJson('/api/ps', controller.signal),
      ]);

      if (tagsRaw !== null) {
        const parsed = OllamaTagsResponseSchema.safeParse(tagsRaw);
        if (parsed.success) {
          for (const m of parsed.data.models) {
            const sizeBytes = m.size ?? 0;
            installedModels.push({
              name: m.name,
              sizeGB: (sizeBytes / BYTES_PER_GB).toFixed(2),
              parameterSize: m.details?.parameter_size ?? 'N/D',
              quantization: m.details?.quantization_level ?? 'N/D',
              modifiedAt: m.modified_at ?? null,
            });
          }
          ollamaOnline = true;
        }
      }

      if (psRaw !== null) {
        const parsed = OllamaPsResponseSchema.safeParse(psRaw);
        if (parsed.success) {
          for (const m of parsed.data.models) {
            const vramBytes = m.size_vram ?? m.size ?? 0;
            const vramMB = toMB(vramBytes);
            gpuInfo.estimatedUsedVramMB += vramMB;
            runningModels.push({
              name: m.name,
              vramMB,
              expiresAt: m.expires_at ?? null,
              contextSize: m.context_size ?? DEFAULT_CONTEXT_SIZE,
            });
          }
          gpuInfo.headroomVramMB = Math.max(
            0,
            gpuInfo.totalVramMB - gpuInfo.estimatedUsedVramMB,
          );
        }
      }
    } catch (err: unknown) {
      console.warn(
        '[SYSINFO API] Ollama offline o inaccesible:',
        safeErrorMessage(err),
      );
    } finally {
      clearTimeout(timeoutId);
    }

    /* -------- Fallback VRAM para modelo 27B -------- */
    if (
      gpuInfo.estimatedUsedVramMB === 0 &&
      installedModels.some((m) => m.name.includes('27b'))
    ) {
      gpuInfo.estimatedUsedVramMB = FALLBACK_27B_VRAM_MB;
      gpuInfo.headroomVramMB = Math.max(
        0,
        gpuInfo.totalVramMB - FALLBACK_27B_VRAM_MB,
      );
    }

    const vramUsagePct =
      gpuInfo.totalVramMB > 0
        ? Math.round(
            (gpuInfo.estimatedUsedVramMB / gpuInfo.totalVramMB) * 100,
          )
        : 0;

    const payload: SysInfoResponse = {
      success: true,
      timestamp: new Date().toISOString(),
      system: {
        platform: os.platform(),
        uptimeSeconds: Math.floor(os.uptime()),
        cpuModel,
        cpuCores,
        ramTotalGB: toGB(totalMem),
        ramUsedGB: toGB(usedMem),
        ramFreeGB: toGB(freeMem),
        ramUsagePct: memUsagePct,
      },
      hardware: {
        gpu: gpuInfo.model,
        vramTotalMB: gpuInfo.totalVramMB,
        vramUsedMB: gpuInfo.estimatedUsedVramMB,
        vramFreeMB: gpuInfo.headroomVramMB,
        vramUsagePct,
      },
      ollama: {
        online: ollamaOnline,
        installedModelsCount: installedModels.length,
        installedModels,
        runningModels,
      },
    };

    return jsonResponse(payload, 200);
  } catch (err: unknown) {
    console.error(
      '[SYSINFO API] Error crítico:',
      safeErrorMessage(err),
    );
    return jsonResponse(
      {
        success: false,
        error: 'SYSINFO_UNAVAILABLE',
        message: 'No se pudo obtener información del sistema.',
      },
      500,
    );
  }
}