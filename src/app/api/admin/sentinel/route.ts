import { NextResponse } from 'next/server';
import { exec } from 'node:child_process';
import path from 'node:path';
import { promisify } from 'node:util';

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

type ScanBody = {
  action: 'scan';
  ts: string;
  pending: number;
  sizeMB: number;
  absorbed: number;
  absorptionPct: number;
  suggestions: string[];
  sample: { path: string; bytes: number }[];
};

type AbsorbBody = {
  action: 'absorb';
  ts: string;
  moved: number;
  failed: number;
  status: 'ok' | 'partial' | 'idle';
  message: string;
  destRoot: string;
  errors?: string[];
};

function parsePowerShellJson<T>(stdout: string): T {
  // La salida de PowerShell puede incluir BOM y saltos de línea finales.
  const trimmed = stdout.replace(/^\uFEFF/, '').trim();
  if (!trimmed) {
    throw new Error('Salida vacía del motor Sentinel.');
  }
  return JSON.parse(trimmed) as T;
}

async function runScript(action: 'scan' | 'absorb', paths: string[] = []): Promise<string> {
  const safePaths = paths.map((p) => `'${p.replace(/'/g, "''")}'`).join(' ');
  const command =
    action === 'scan'
      ? `powershell -NoProfile -ExecutionPolicy Bypass -File "${SCRIPT_PATH}" -Action scan`
      : `powershell -NoProfile -ExecutionPolicy Bypass -File "${SCRIPT_PATH}" -Action absorb${
          safePaths ? ` -Paths ${safePaths}` : ''
        }`;

  const { stdout, stderr } = await execAsync(command, {
    timeout: 30000,
    windowsHide: true,
  });

  if (stderr && stderr.trim()) {
    // PowerShell escribe warnings a stderr; no abortamos salvo error fatal.
    console.warn('[sentinel] stderr:', stderr.trim());
  }

  return stdout;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action') === 'absorb' ? 'absorb' : 'scan';

  try {
    const stdout = await runScript(action);
    const body = parsePowerShellJson<ScanBody | AbsorbBody>(stdout);
    return NextResponse.json(body, {
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error desconocido';
    return NextResponse.json(
      { action, error: 'Fallo al ejecutar el motor Sentinel.', detail: message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  let paths: string[] = [];
  try {
    const payload = (await request.json()) as { paths?: string[] };
    paths = Array.isArray(payload?.paths) ? payload.paths : [];
  } catch {
    paths = [];
  }

  try {
    const stdout = await runScript('absorb', paths);
    const body = parsePowerShellJson<AbsorbBody>(stdout);
    return NextResponse.json(body, {
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error desconocido';
    return NextResponse.json(
      { action: 'absorb', error: 'Fallo al absorber documentos.', detail: message },
      { status: 500 }
    );
  }
}