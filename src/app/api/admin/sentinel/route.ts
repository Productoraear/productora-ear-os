import { NextResponse } from 'next/server';
import { exec } from 'node:child_process';
import path from 'node:path';
import { promisify } from 'node:util';
import { z } from 'zod';
import { requireAdmin } from '@/lib/security/adminGuard';

const execAsync = promisify(exec);

/**
 * B0.20 — Consola Visual Sentinel
 * Puente seguro entre la vista /admin/sentinel y el motor bare-metal
 * scripts/sentinel_absorber.ps1. Devuelve JSON compacto (<250 tokens útiles).
 *
 * GET  /api/admin/sentinel?action=scan   -> radar de archivos pendientes
 * POST /api/admin/sentinel               -> absorber documentos ligeros
 */

const SCRIPT_PATH = path.join(process.cwd(), 'scripts', 'sentinel_absorber.ps1');

const SECURITY_HEADERS: Record<string, string> = {
  'Cache-Control': 'no-store, no-cache, must-revalidate',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'no-referrer',
  'Content-Security-Policy': "default-src 'none'; frame-ancestors 'none'",
};

const MAX_PATHS = 64;
const MAX_PATH_LENGTH = 512;

const PathSchema = z
  .string()
  .min(1)
  .max(MAX_PATH_LENGTH)
  .refine((p) => !p.includes('\u0000'), { message: 'NUL byte no permitido' })
  .refine((p) => !/[\r\n]/.test(p), { message: 'Saltos de línea no permitidos' });

const AbsorbPayloadSchema = z
  .object({
    paths: z.array(PathSchema).max(MAX_PATHS).optional(),
  })
  .strict();

const ScanBodySchema = z.object({
  action: z.literal('scan'),
  ts: z.string(),
  pending: z.number(),
  sizeMB: z.number(),
  absorbed: z.number(),
  absorptionPct: z.number(),
  suggestions: z.array(z.string()),
  sample: z.array(z.object({ path: z.string(), bytes: z.number() })),
});

const AbsorbBodySchema = z.object({
  action: z.literal('absorb'),
  ts: z.string(),
  moved: z.number(),
  failed: z.number(),
  status: z.enum(['ok', 'partial', 'idle']),
  message: z.string(),
  destRoot: z.string(),
  errors: z.array(z.string()).optional(),
});

type ScanBody = z.infer<typeof ScanBodySchema>;
type AbsorbBody = z.infer<typeof AbsorbBodySchema>;

function jsonResponse<T>(body: T, status = 200): NextResponse {
  return NextResponse.json(body, { status, headers: SECURITY_HEADERS });
}

function parsePowerShellJson<T>(stdout: string, schema: z.ZodType<T>): T {
  const trimmed = stdout.replace(/^\uFEFF/, '').trim();
  if (!trimmed) {
    throw new Error('Salida vacía del motor Sentinel.');
  }
  const raw: unknown = JSON.parse(trimmed);
  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    throw new Error('Respuesta del motor Sentinel con formato inválido.');
  }
  return parsed.data;
}

function sanitizePath(p: string): string {
  // Escapado PowerShell: comillas simples duplicadas.
  return `'${p.replace(/'/g, "''")}'`;
}

async function runScript(action: 'scan' | 'absorb', paths: string[] = []): Promise<string> {
  const safePaths = paths.map(sanitizePath).join(' ');
  const command =
    action === 'scan'
      ? `powershell -NoProfile -ExecutionPolicy Bypass -File "${SCRIPT_PATH}" -Action scan`
      : `powershell -NoProfile -ExecutionPolicy Bypass -File "${SCRIPT_PATH}" -Action absorb${
          safePaths ? ` -Paths ${safePaths}` : ''
        }`;

  const { stdout, stderr } = await execAsync(command, {
    timeout: 30000,
    windowsHide: true,
    maxBuffer: 1024 * 1024,
  });

  if (stderr && stderr.trim()) {
    console.warn('[sentinel] stderr:', stderr.trim());
  }

  return stdout;
}

export async function GET(request: Request): Promise<NextResponse> {
  try {
    const auth = await requireAdmin(request);
    if (!auth.ok) return auth.response;

    const { searchParams } = new URL(request.url);
    const actionParam = searchParams.get('action');
    const action: 'scan' | 'absorb' = actionParam === 'absorb' ? 'absorb' : 'scan';

    const stdout = await runScript(action);
    const body =
      action === 'scan'
        ? parsePowerShellJson<ScanBody>(stdout, ScanBodySchema)
        : parsePowerShellJson<AbsorbBody>(stdout, AbsorbBodySchema);

    return jsonResponse(body);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error desconocido';
    console.error('[sentinel][GET]', message);
    return jsonResponse(
      { action: 'scan', error: 'Fallo al ejecutar el motor Sentinel.', detail: message },
      500
    );
  }
}

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const auth = await requireAdmin(request);
    if (!auth.ok) return auth.response;

    let paths: string[] = [];
    try {
      const raw: unknown = await request.json();
      const parsed = AbsorbPayloadSchema.safeParse(raw);
      if (!parsed.success) {
        return jsonResponse(
          { action: 'absorb', error: 'Payload inválido.', detail: parsed.error.flatten() },
          400
        );
      }
      paths = parsed.data.paths ?? [];
    } catch {
      return jsonResponse(
        { action: 'absorb', error: 'JSON malformado en el cuerpo de la petición.' },
        400
      );
    }

    const stdout = await runScript('absorb', paths);
    const body = parsePowerShellJson<AbsorbBody>(stdout, AbsorbBodySchema);
    return jsonResponse(body);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error desconocido';
    console.error('[sentinel][POST]', message);
    return jsonResponse(
      { action: 'absorb', error: 'Fallo al absorber documentos.', detail: message },
      500
    );
  }
}