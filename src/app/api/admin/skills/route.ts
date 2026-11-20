import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAdmin } from '@/lib/security/adminGuard';
import { catalogForRole, dispatchSkill, SKILL_TIMEOUT_MS } from '@/lib/skills/dispatcher';
import { ARTIFACT_MIME, SKILL_ROLES, type SkillRole } from '@/lib/skills/skill-contract';

/**
 * ════════════════════════════════════════════════════════════════════════════
 * /api/admin/skills — DESPACHADOR LOCAL DE CARTUCHOS EJECUTIVOS
 * ════════════════════════════════════════════════════════════════════════════
 *   GET  ?role=CEO       → manifiestos del rol (sin ejecutar nada)
 *   POST                 → ejecuta el cartucho y devuelve metadatos + descarga
 *   GET  ?download=<tok> → entrega los bytes del artefacto ya generado
 *
 * Default-deny (SEC-1): sin sesión admin válida, 401 antes que nada. Zod
 * estricto (SEC-4). Guard de tamaño (256 KB). Cero tokens: no hay ni una
 * llamada a un modelo en toda la ruta.
 *
 * Transporte del binario: la ejecución viaja como `{ ok, data }` (igual que el
 * resto del panel) y el artefacto se descarga en una segunda llamada con el
 * `token` devuelto. Así `adminFetch` —que exige sobre JSON— sigue funcionando
 * sin excepciones y el cliente nunca recibe un binario que no haya pedido.
 * ════════════════════════════════════════════════════════════════════════════
 */

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MAX_BODY_BYTES = 256 * 1024;

/** Vida del artefacto en memoria: 5 minutos. Es un búfer, no un almacén. */
const ARTIFACT_TTL_MS = 5 * 60 * 1000;

const SECURITY_HEADERS: Readonly<Record<string, string>> = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'no-referrer',
  'Cross-Origin-Resource-Policy': 'same-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
};

interface StoredArtifact {
  readonly bytes: Uint8Array;
  readonly filename: string;
  readonly mime: string;
  readonly sha256: string;
  readonly expiresAt: number;
}

/**
 * Búfer de artefactos en memoria del proceso.
 * `globalThis` para sobrevivir al recargado de módulos en desarrollo.
 * Un artefacto caducado no se sirve nunca: se descarta y se pide regenerar.
 */
const artifactStore: Map<string, StoredArtifact> = (() => {
  const key = '__earOsSkillArtifactStore__';
  const holder = globalThis as unknown as Record<string, Map<string, StoredArtifact> | undefined>;
  if (holder[key] === undefined) holder[key] = new Map<string, StoredArtifact>();
  return holder[key] as Map<string, StoredArtifact>;
})();

function pruneExpired(nowMs: number): void {
  for (const [token, stored] of artifactStore) {
    if (stored.expiresAt <= nowMs) artifactStore.delete(token);
  }
}

const ExecuteBodySchema = z
  .object({
    skillId: z.string().trim().min(3).max(80),
    role: z.enum(SKILL_ROLES),
    payload: z.record(z.string(), z.unknown()),
  })
  .strict();

const DownloadQuerySchema = z
  .object({
    download: z.string().trim().min(8).max(128),
  })
  .strict();

function json(payload: unknown, status = 200): NextResponse {
  return NextResponse.json(payload, { status, headers: SECURITY_HEADERS });
}

function isSkillRole(value: string | null): value is SkillRole {
  return value !== null && (SKILL_ROLES as readonly string[]).includes(value);
}

export async function GET(request: Request): Promise<Response> {
  try {
    const auth = await requireAdmin(request);
    if (!auth.ok) return auth.response;

    const url = new URL(request.url);
    const downloadToken = url.searchParams.get('download');

    // ── Descarga del artefacto ya generado ──────────────────────────
    if (downloadToken !== null) {
      const parsedDownload = DownloadQuerySchema.safeParse({ download: downloadToken });
      if (!parsedDownload.success) {
        return json({ ok: false, error: 'Token de descarga inválido.' }, 400);
      }
      const nowMs = Date.now();
      pruneExpired(nowMs);
      const stored = artifactStore.get(parsedDownload.data.download);
      if (stored === undefined) {
        return json(
          { ok: false, error: 'Artefacto no encontrado o caducado. Vuelve a ejecutar el cartucho.' },
          404,
        );
      }
      const safeName = stored.filename.replace(/["\\\r\n]/g, '_');
      return new Response(new Uint8Array(stored.bytes), {
        status: 200,
        headers: {
          ...SECURITY_HEADERS,
          'Content-Type': stored.mime,
          'Content-Length': String(stored.bytes.length),
          'Content-Disposition': `attachment; filename="${safeName}"`,
          'X-Artifact-SHA256': stored.sha256,
        },
      });
    }

    // ── Catálogo de manifiestos del rol ─────────────────────────────
    const roleParam = url.searchParams.get('role');
    const role: SkillRole = isSkillRole(roleParam) ? roleParam : 'CEO';
    return json({
      ok: true,
      data: {
        role,
        skills: catalogForRole(role),
        timeoutMs: SKILL_TIMEOUT_MS,
        externalTokenCost: 0,
        probed: true,
        source: 'live',
        checkedAt: new Date().toISOString(),
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error interno.';
    return json({ ok: false, error: message }, 500);
  }
}

export async function POST(request: Request): Promise<Response> {
  try {
    const auth = await requireAdmin(request);
    if (!auth.ok) return auth.response;

    const declared = request.headers.get('content-length');
    if (declared !== null) {
      const size = Number.parseInt(declared, 10);
      if (Number.isFinite(size) && size > MAX_BODY_BYTES) {
        return json({ ok: false, error: 'Payload demasiado grande.' }, 413);
      }
    }

    let rawBody: unknown;
    try {
      rawBody = await request.json();
    } catch {
      return json({ ok: false, error: 'El cuerpo debe ser JSON válido.' }, 400);
    }

    const parsed = ExecuteBodySchema.safeParse(rawBody);
    if (!parsed.success) {
      const details = parsed.error.issues.map(
        (issue) => `${issue.path.join('.') || 'body'}: ${issue.message}`,
      );
      return json({ ok: false, error: 'Payload inválido.', details }, 400);
    }

    const result = await dispatchSkill(parsed.data.skillId, parsed.data.payload, {
      role: parsed.data.role,
    });

    if (!result.ok) {
      const status =
        result.code === 'UNKNOWN_SKILL'
          ? 404
          : result.code === 'ROLE_FORBIDDEN'
            ? 403
            : result.code === 'INVALID_INPUT'
              ? 400
              : result.code === 'ABORTED_BY_POLICY'
                ? 422
                : result.code === 'SKILL_TIMEOUT'
                  ? 504
                  : 500;
      return json(
        {
          ok: false,
          error: result.error,
          code: result.code,
          details: result.issues ?? result.available ?? [],
        },
        status,
      );
    }

    // Registro del artefacto con token opaco (no se expone ningún nombre interno).
    const nowMs = Date.now();
    pruneExpired(nowMs);
    const artifacts = result.execution.artifacts.map((artifact) => {
      const token = `${nowMs.toString(36)}-${Math.random().toString(36).slice(2, 14)}`;
      artifactStore.set(token, {
        bytes: artifact.bytes,
        filename: artifact.filename,
        mime: ARTIFACT_MIME[artifact.kind],
        sha256: artifact.sha256,
        expiresAt: nowMs + ARTIFACT_TTL_MS,
      });
      return {
        kind: artifact.kind,
        filename: artifact.filename,
        byteLength: artifact.byteLength,
        sha256: artifact.sha256,
        downloadUrl: `/api/admin/skills?download=${token}`,
        expiresInSeconds: Math.round(ARTIFACT_TTL_MS / 1000),
      };
    });

    return json({
      ok: true,
      data: {
        skill: result.execution.skill,
        title: result.execution.title,
        role: result.execution.role,
        mode: result.execution.mode,
        probed: result.execution.probed,
        checkedAt: result.execution.checkedAt,
        summary: result.execution.summary,
        evidence: result.execution.evidence,
        artifacts,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error interno.';
    return json({ ok: false, error: message }, 500);
  }
}
