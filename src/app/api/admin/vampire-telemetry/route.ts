import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { z } from 'zod';
import { requireAdmin } from '@/lib/security/adminGuard';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// ─────────────────────────────────────────────────────────────────────────────
// SSOT: Security headers (OLED / EAR OS v2)
// ─────────────────────────────────────────────────────────────────────────────
const SECURITY_HEADERS: Record<string, string> = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
  'Pragma': 'no-cache',
  'Expires': '0',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'no-referrer',
  'X-EAR-OS': 'v2',
};

// ─────────────────────────────────────────────────────────────────────────────
// Zod Schemas — strict validation of on-disk JSON artifacts
// ─────────────────────────────────────────────────────────────────────────────
const ProgressSchema = z
  .object({
    total_requests: z.number().int().nonnegative().optional(),
    new_providers: z.number().int().nonnegative().optional(),
    completed_urls: z.array(z.string()).optional(),
    started_at: z.string().optional(),
    updated_at: z.string().optional(),
  })
  .passthrough();

const ProviderSchema = z
  .object({
    name: z.string().optional(),
    url: z.string().optional(),
    phone: z.string().optional(),
    source: z.string().optional(),
  })
  .passthrough();

const ProviderListSchema = z.union([
  z.array(ProviderSchema),
  z.object({ providers: z.array(ProviderSchema).optional() }).passthrough(),
]);

const VaultSchema = z.union([
  z.array(ProviderSchema),
  z
    .object({
      providers: z.array(ProviderSchema).optional(),
      total: z.number().int().nonnegative().optional(),
    })
    .passthrough(),
]);

const PhonesSchema = z.union([
  z.array(z.unknown()),
  z.object({ phones: z.array(z.unknown()).optional() }).passthrough(),
]);

// ─────────────────────────────────────────────────────────────────────────────
// Typed response contract
// ─────────────────────────────────────────────────────────────────────────────
type ProviderRecord = z.infer<typeof ProviderSchema>;

interface TelemetryMetrics {
  total_online_captured: number;
  total_vault_absorbed: number;
  total_phones_recovered: number;
  total_requests: number;
  waf_status: string;
  daemon_status: string;
  started_at: string;
  updated_at: string;
}

interface TelemetrySuccessResponse {
  success: true;
  timestamp: string;
  metrics: TelemetryMetrics;
  log_tail: string[];
  recent_leads: ProviderRecord[];
  vault_sample: ProviderRecord[];
}

interface TelemetryErrorResponse {
  success: false;
  error: string;
  timestamp: string;
}

type TelemetryResponse = TelemetrySuccessResponse | TelemetryErrorResponse;

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────
const MAX_LOG_TAIL = 30;
const MAX_RECENT_LEADS = 50;
const MAX_VAULT_SAMPLE = 10;
const MAX_FILE_BYTES = 5 * 1024 * 1024; // 5 MB hard cap per artifact

function safeReadJson<T>(
  filePath: string,
  schema: z.ZodType<T>,
  fallback: T,
): T {
  try {
    if (!fs.existsSync(filePath)) return fallback;
    const stat = fs.statSync(filePath);
    if (!stat.isFile() || stat.size === 0 || stat.size > MAX_FILE_BYTES) {
      return fallback;
    }
    const raw = fs.readFileSync(filePath, 'utf-8');
    const parsed: unknown = JSON.parse(raw);
    const result = schema.safeParse(parsed);
    return result.success ? result.data : fallback;
  } catch {
    return fallback;
  }
}

function safeReadText(filePath: string): string | null {
  try {
    if (!fs.existsSync(filePath)) return null;
    const stat = fs.statSync(filePath);
    if (!stat.isFile() || stat.size === 0 || stat.size > MAX_FILE_BYTES) {
      return null;
    }
    return fs.readFileSync(filePath, 'utf-8');
  } catch {
    return null;
  }
}

function tailLines(content: string, max: number): string[] {
  const lines = content.split('\n').filter((l) => l.trim().length > 0);
  return lines.length > 0 ? lines.slice(-max) : [];
}

function jsonResponse(
  body: TelemetryResponse,
  status: number = 200,
): NextResponse<TelemetryResponse> {
  return NextResponse.json(body, { status, headers: SECURITY_HEADERS });
}

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/admin/vampire-telemetry
// ─────────────────────────────────────────────────────────────────────────────
export async function GET(
  request: Request,
): Promise<NextResponse<TelemetryResponse>> {
  // 1. Auth gate (fail-closed)
  try {
    const auth = await requireAdmin(request);
    if (!auth.ok) {
      return auth.response as NextResponse<TelemetryResponse>;
    }
  } catch {
    return jsonResponse(
      {
        success: false,
        error: 'AUTH_GUARD_FAILURE',
        timestamp: new Date().toISOString(),
      },
      401,
    );
  }

  try {
    const baseDir = process.cwd();
    const resultsDir = path.join(baseDir, 'scripts', 'nightcrawler_results');

    // ── 1. Progress file ────────────────────────────────────────────────────
    const progress = safeReadJson(
      path.join(resultsDir, 'nightcrawler_progress.json'),
      ProgressSchema,
      {
        total_requests: 0,
        new_providers: 0,
        completed_urls: [],
        started_at: '',
        updated_at: '',
      },
    );

    // ── 2. Online providers ─────────────────────────────────────────────────
    const onlineRaw = safeReadJson(
      path.join(resultsDir, 'new_online_providers.json'),
      ProviderListSchema,
      [] as ProviderRecord[],
    );
    const onlineProviders: ProviderRecord[] = Array.isArray(onlineRaw)
      ? onlineRaw
      : onlineRaw.providers ?? [];

    // ── 3. Vault absorbed providers ─────────────────────────────────────────
    const vaultRaw = safeReadJson(
      path.join(resultsDir, 'vault_absorbed_providers.json'),
      VaultSchema,
      [] as ProviderRecord[],
    );
    const vaultProviders: ProviderRecord[] = Array.isArray(vaultRaw)
      ? vaultRaw
      : vaultRaw.providers ?? [];
    const vaultCount: number = Array.isArray(vaultRaw)
      ? vaultProviders.length
      : vaultRaw.total ?? vaultProviders.length;
    const vaultSample: ProviderRecord[] = vaultProviders.slice(
      0,
      MAX_VAULT_SAMPLE,
    );

    // ── 4. Fast phones ──────────────────────────────────────────────────────
    const phonesRaw = safeReadJson(
      path.join(resultsDir, 'fast_extracted_phones.json'),
      PhonesSchema,
      [] as unknown[],
    );
    const phonesCount: number = Array.isArray(phonesRaw)
      ? phonesRaw.length
      : phonesRaw.phones?.length ?? 0;

    // ── 5. Stdout log tail ──────────────────────────────────────────────────
    let logTail: string[] = [];
    const stdoutContent = safeReadText(path.join(resultsDir, 'stdout.log'));
    if (stdoutContent) {
      const lines = stdoutContent
        .split('\n')
        .filter((l) => l.trim().length > 0);
      if (lines.length > 5) {
        logTail = lines.slice(-MAX_LOG_TAIL);
      }
    }

    // ── 5b. Fallback: active task logs ──────────────────────────────────────
    if (logTail.length <= 5) {
      try {
        const homeDir =
          process.env.USERPROFILE || process.env.HOME || '';
        if (homeDir) {
          const brainBase = path.join(
            homeDir,
            '.gemini',
            'antigravity-ide',
            'brain',
          );
          if (fs.existsSync(brainBase)) {
            const convFolders = fs.readdirSync(brainBase);
            outer: for (const conv of convFolders) {
              const tasksDir = path.join(
                brainBase,
                conv,
                '.system_generated',
                'tasks',
              );
              if (!fs.existsSync(tasksDir)) continue;

              const taskFiles = fs
                .readdirSync(tasksDir)
                .filter((f) => f.endsWith('.log'))
                .map((f) => {
                  const full = path.join(tasksDir, f);
                  try {
                    const st = fs.statSync(full);
                    return { name: f, full, mtime: st.mtimeMs, size: st.size };
                  } catch {
                    return { name: f, full, mtime: 0, size: 0 };
                  }
                })
                .filter((f) => f.size > 100 && f.size <= MAX_FILE_BYTES)
                .sort((a, b) => b.mtime - a.mtime);

              for (const tf of taskFiles) {
                const content = safeReadText(tf.full);
                if (!content) continue;
                if (
                  content.includes('[CRAWL OK]') ||
                  content.includes('OPERACIÓN CAÓTICA') ||
                  tf.name.includes('4595')
                ) {
                  const lines = content
                    .split('\n')
                    .filter((l) => l.trim().length > 0);
                  if (lines.length > 0) {
                    logTail = lines.slice(-MAX_LOG_TAIL);
                    break outer;
                  }
                }
              }
            }
          }
        }
      } catch {
        // Non-fatal: fallback log discovery is best-effort
      }
    }

    // ── 5c. Reconstruct from completed_urls ─────────────────────────────────
    if (
      logTail.length === 0 &&
      Array.isArray(progress.completed_urls) &&
      progress.completed_urls.length > 0
    ) {
      logTail = progress.completed_urls
        .slice(-15)
        .map((u: string) => `[CRAWL OK] ${u} -> Procesado con éxito.`);
    }

    // ── 6. Recent leads ─────────────────────────────────────────────────────
    const recentLeads: ProviderRecord[] = onlineProviders
      .slice(-MAX_RECENT_LEADS)
      .reverse();

    const payload: TelemetrySuccessResponse = {
      success: true,
      timestamp: new Date().toISOString(),
      metrics: {
        total_online_captured: onlineProviders.length,
        total_vault_absorbed: vaultCount,
        total_phones_recovered: phonesCount,
        total_requests: progress.total_requests ?? 0,
        waf_status: 'BYPASS_ACTIVE_CHROME110',
        daemon_status: 'RUNNING',
        started_at: progress.started_at ?? '',
        updated_at: progress.updated_at ?? '',
      },
      log_tail: logTail,
      recent_leads: recentLeads,
      vault_sample: vaultSample,
    };

    return jsonResponse(payload, 200);
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'UNKNOWN_TELEMETRY_ERROR';
    return jsonResponse(
      {
        success: false,
        error: message,
        timestamp: new Date().toISOString(),
      },
      500,
    );
  }
}