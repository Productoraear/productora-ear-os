import { NextResponse } from 'next/server';
import os from 'node:os';
import { exec } from 'node:child_process';
import { promisify } from 'node:util';
import { z } from 'zod';
import { requireAdmin } from '@/lib/security/adminGuard';

const execAsync = promisify(exec);

/**
 * B5.44 — Panel de Telemetría Global (Bare-Metal)
 * Devuelve métricas reales del host: CPU, RAM, red, Ollama (GPU local) y pasarela de pagos.
 * GET /api/admin/telemetry
 *
 * W02-API-017 — Security hardening:
 *  - Validación estricta de query params (Zod, strict).
 *  - try/catch global con respuesta tipada.
 *  - Headers de seguridad (no-store, nosniff, DENY, no-referrer).
 *  - Cero `any` implícitos.
 */

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// ---------------------------------------------------------------------------
// Schemas
// ---------------------------------------------------------------------------

const TelemetryQuerySchema = z
  .object({
    // Reservado para futuros filtros (p.ej. ?include=vram,ollama).
    include: z
      .string()
      .max(256)
      .regex(/^[a-z0-9,_-]*$/i, 'include contiene caracteres inválidos')
      .optional(),
  })
  .strict();

type TelemetryQuery = z.infer<typeof TelemetryQuerySchema>;

// ---------------------------------------------------------------------------
// Tipos de respuesta
// ---------------------------------------------------------------------------

interface OllamaStatus {
  online: boolean;
  models: string[];
  latencyMs: number;
}

interface VramInfo {
  totalMB: number;
  usedMB: number;
}

interface TelemetryPayload {
  timestamp: string;
  host: {
    platform: NodeJS.Platform;
    arch: string;
    hostname: string;
    node: string;
    uptimeSec: number;
  };
  cpu: {
    model: string;
    cores: number;
    loadAvg: number[];
  };
  memory: {
    totalMB: number;
    usedMB: number;
    freeMB: number;
    usedPct: number;
  };
  vram: VramInfo | null;
  network: { activeIps: string[] };
  ollama: OllamaStatus;
  payments: {
    stripeConfigured: boolean;
    webhookConfigured: boolean;
  };
  responseMs: number;
}

interface TelemetryErrorPayload {
  ok: false;
  error: string;
  code: 'BAD_REQUEST' | 'INTERNAL_ERROR';
}

// ---------------------------------------------------------------------------
// Headers
// ---------------------------------------------------------------------------

const SECURITY_HEADERS: Readonly<Record<string, string>> = Object.freeze({
  'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
  Pragma: 'no-cache',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'no-referrer',
  'Cross-Origin-Resource-Policy': 'same-origin',
});

function jsonResponse<T>(body: T, status = 200): NextResponse<T> {
  return NextResponse.json<T>(body, {
    status,
    headers: SECURITY_HEADERS,
  });
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function parseQuery(request: Request): TelemetryQuery {
  const url = new URL(request.url);
  const raw: Record<string, string> = {};
  for (const [key, value] of url.searchParams.entries()) {
    raw[key] = value;
  }
  return TelemetryQuerySchema.parse(raw);
}

async function probeOllama(): Promise<OllamaStatus> {
  const fallback: OllamaStatus = { online: false, models: [], latencyMs: 0 };
  try {
    const t0 = Date.now();
    const res = await fetch('http://127.0.0.1:11434/api/tags', {
      signal: AbortSignal.timeout(2500),
      cache: 'no-store',
    });
    if (!res.ok) return fallback;

    const parsed = (await res.json()) as unknown;
    const models: string[] = [];
    if (
      parsed !== null &&
      typeof parsed === 'object' &&
      'models' in parsed &&
      Array.isArray((parsed as { models?: unknown }).models)
    ) {
      for (const m of (parsed as { models: unknown[] }).models) {
        if (m !== null && typeof m === 'object' && 'name' in m) {
          const name = (m as { name?: unknown }).name;
          if (typeof name === 'string' && name.length > 0) {
            models.push(name);
          }
        }
      }
    }

    return {
      online: true,
      models,
      latencyMs: Date.now() - t0,
    };
  } catch {
    return fallback;
  }
}

async function probeVram(platform: NodeJS.Platform): Promise<VramInfo | null> {
  if (platform !== 'win32') return null;
  try {
    const { stdout } = await execAsync(
      'powershell -NoProfile -Command "(Get-CimInstance Win32_VideoController | Measure-Object -Property AdapterRAM -Sum).Sum"',
      { timeout: 3000, windowsHide: true }
    );
    const parsed = Number.parseInt(stdout.trim(), 10);
    if (!Number.isFinite(parsed) || parsed <= 0) return null;
    const totalMB = Math.round(parsed / (1024 * 1024));
    if (!Number.isFinite(totalMB) || totalMB <= 0) return null;
    return { totalMB, usedMB: 0 };
  } catch {
    return null;
  }
}

function collectNetworkIps(): string[] {
  const ifaces = os.networkInterfaces();
  const activeIps: string[] = [];
  for (const list of Object.values(ifaces)) {
    if (!list) continue;
    for (const i of list) {
      if (i && i.family === 'IPv4' && !i.internal) {
        activeIps.push(i.address);
      }
    }
  }
  return activeIps;
}

// ---------------------------------------------------------------------------
// Handler
// ---------------------------------------------------------------------------

export async function GET(request: Request): Promise<NextResponse> {
  try {
    const auth = await requireAdmin(request);
    if (!auth.ok) return auth.response;

    // Validación estricta de query params (rechaza claves desconocidas).
    try {
      parseQuery(request);
    } catch (err) {
      const message =
        err instanceof z.ZodError
          ? err.issues.map((i) => i.message).join('; ') || 'Query inválida'
          : 'Query inválida';
      const payload: TelemetryErrorPayload = {
        ok: false,
        error: message,
        code: 'BAD_REQUEST',
      };
      return jsonResponse(payload, 400);
    }

    const startedAt = Date.now();
    const platform = process.platform;

    // --- CPU / RAM (node:os) ---
    const cpus = os.cpus();
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMem = totalMem - freeMem;
    const memPct =
      totalMem > 0 ? Math.round((usedMem / totalMem) * 100) : 0;

    const loadAvg = os.loadavg();

    // --- Red ---
    const activeIps = collectNetworkIps();

    // --- Ollama + VRAM (paralelo) ---
    const [ollama, vram] = await Promise.all([
      probeOllama(),
      probeVram(platform),
    ]);

    // --- Pasarela de pagos (Stripe) ---
    const stripeConfigured = Boolean(process.env.STRIPE_SECRET_KEY);
    const webhookConfigured = Boolean(process.env.STRIPE_WEBHOOK_SECRET);

    const body: TelemetryPayload = {
      timestamp: new Date().toISOString(),
      host: {
        platform,
        arch: os.arch(),
        hostname: os.hostname(),
        node: process.version,
        uptimeSec: Math.round(os.uptime()),
      },
      cpu: {
        model: cpus[0]?.model ?? 'unknown',
        cores: cpus.length,
        loadAvg: loadAvg.map((n) => Math.round(n * 100) / 100),
      },
      memory: {
        totalMB: Math.round(totalMem / (1024 * 1024)),
        usedMB: Math.round(usedMem / (1024 * 1024)),
        freeMB: Math.round(freeMem / (1024 * 1024)),
        usedPct: memPct,
      },
      vram,
      network: { activeIps },
      ollama,
      payments: {
        stripeConfigured,
        webhookConfigured,
      },
      responseMs: Date.now() - startedAt,
    };

    return jsonResponse(body, 200);
  } catch (err) {
    const message =
      err instanceof Error ? err.message : 'Error interno de telemetría';
    const payload: TelemetryErrorPayload = {
      ok: false,
      error: message,
      code: 'INTERNAL_ERROR',
    };
    return jsonResponse(payload, 500);
  }
}