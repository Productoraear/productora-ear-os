import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAdmin } from '@/lib/security/adminGuard';
import { compileMetaSpec } from '@/lib/compiler/metacompiler-engine';
import { buildDefaultSpec, MetaCompilerSpecSchema } from '@/lib/compiler/metacompiler-spec';
import { createServerRuntime } from '@/lib/compiler/metacompiler-server-runtime';
import {
  COOLIFY_WEBHOOK_ENV,
  createConnectorStateStore,
  createDeployHost,
  createMutationHost,
  isDatabaseConfigured,
} from '@/lib/compiler/metacompiler-server-hosts';
import { evaluateConnectorMatrix } from '@/lib/compiler/connector-matrix';
import { verifySsotIntegrity } from '@/lib/security/ssotIntegrityGuard';

/**
 * ════════════════════════════════════════════════════════════════════════════
 * /api/admin/compiler/seal — ACCIÓN SOBERANA: SELLAR MUTACIÓN Y DESPLEGAR
 * ════════════════════════════════════════════════════════════════════════════
 * Un único endpoint ejecuta la secuencia completa que exige la directiva:
 *
 *   1. Compila la especificación con el motor local (FSM completa).
 *   2. Exige estado terminal `SEALED`: si aborta, NO se despliega nada.
 *   3. Exige la matriz de conectores en paridad: si una puerta queda huérfana,
 *      NO se despliega nada (INV-09).
 *   4. Exige Zona Cero intacta: si el hash no cuadra, NO se despliega (INV-05).
 *   5. Sólo entonces, y sólo si `deploy:true`, dispara el webhook de Coolify.
 *
 * Honestidad de salida (AF-1/AF-5): la respuesta declara `dispatched:false` con
 * el motivo exacto siempre que no se haya disparado nada. Nunca "desplegado".
 * ════════════════════════════════════════════════════════════════════════════
 */

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MAX_BODY_BYTES = 64 * 1024;

const SealBodySchema = z
  .object({
    spec: MetaCompilerSpecSchema,
    /** Siembra idempotente de ontología en PostgreSQL (INV-08). */
    seedOntology: z.boolean().optional(),
    /** Dispara el webhook tras sellar. Requiere confirmación explícita. */
    deploy: z.boolean().optional(),
  })
  .strict();

const SECURITY_HEADERS: Readonly<Record<string, string>> = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'no-referrer',
  'Cross-Origin-Resource-Policy': 'same-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
};

function json(payload: unknown, status = 200): NextResponse {
  return NextResponse.json(payload, { status, headers: SECURITY_HEADERS });
}

export async function GET(request: Request): Promise<NextResponse> {
  try {
    const auth = await requireAdmin(request);
    if (!auth.ok) return auth.response;
    const host = createDeployHost([]);
    return json({
      ok: true,
      data: {
        defaultSpec: buildDefaultSpec(),
        deploy: { envVar: COOLIFY_WEBHOOK_ENV, configured: host.configured, requiresSealed: true },
        database: { configured: isDatabaseConfigured() },
        mutationHost: { file: createMutationHost().file },
        checkedAt: new Date().toISOString(),
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error interno.';
    return json({ ok: false, error: message }, 500);
  }
}

export async function POST(request: Request): Promise<NextResponse> {
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
      return json({ ok: false, error: 'El cuerpo debe ser JSON valido.' }, 400);
    }

    const parsed = SealBodySchema.safeParse(rawBody);
    if (!parsed.success) {
      return json(
        {
          ok: false,
          error: 'Payload invalido.',
          details: parsed.error.issues.map(
            (issue) => `${issue.path.join('.') || 'body'}: ${issue.message}`,
          ),
        },
        400,
      );
    }

    const now = new Date().toISOString();

    // ── Paso 1: compilación completa en el motor local (zero-token) ─────────
    const result = await compileMetaSpec(parsed.data.spec, {
      now,
      runtime: createServerRuntime(),
      seedOntology: parsed.data.seedOntology === true,
    });

    // ── Paso 2: precondiciones de despliegue ───────────────────────────────
    const ssot = verifySsotIntegrity();
    const store = createConnectorStateStore();
    const loaded = await store.load(now);
    const matrix = evaluateConnectorMatrix(loaded.state, now);

    const blockers: string[] = [];
    if (result.state !== 'SEALED') {
      blockers.push(
        `FSM=${result.state}${result.abortReason === null ? '' : `:${result.abortReason}`}`,
      );
    }
    if (matrix.parity !== 'PASS') blockers.push(...matrix.findings);
    if (!ssot.intact) blockers.push('SSOT_HASH_MISMATCH');
    const sealed = blockers.length === 0;

    // ── Paso 3: despliegue (sólo si todo cuadra y el operador lo pidió) ─────
    let deploy = {
      requested: parsed.data.deploy === true,
      configured: false,
      dispatched: false,
      detail: 'No solicitado.',
    };

    if (deploy.requested) {
      const host = createDeployHost(sealed ? [result.sealHash] : []);
      deploy = { ...deploy, configured: host.configured };
      if (!sealed) {
        deploy.detail = `BLOQUEADO: ${blockers.join(' · ')}`;
      } else if (!host.configured) {
        deploy.detail = `${COOLIFY_WEBHOOK_ENV} no definido: no hay despliegue que disparar.`;
      } else {
        const outcome = await host.trigger();
        deploy = { ...deploy, dispatched: outcome.dispatched, detail: outcome.detail };
      }
    }

    return json(
      {
        ok: sealed,
        data: {
          status: sealed ? 'SEALED' : 'ABORT',
          blockers,
          state: result.state,
          abortReason: result.abortReason,
          sealHash: result.sealHash,
          evidence: result.evidence,
          stats: result.stats,
          ssot: {
            computedHash: ssot.computedHash,
            referenceHash: ssot.referenceHash,
            intact: ssot.intact,
          },
          connectors: {
            store: store.kind,
            persisted: loaded.persisted,
            parity: matrix.parity,
            activeCount: matrix.activeCount,
            totalCount: matrix.totalCount,
            doors: matrix.doors.map((door) => ({ door: door.door, active: door.active })),
          },
          database: { configured: isDatabaseConfigured() },
          deploy,
          operator: auth.email,
          checkedAt: now,
          probed: true,
          source: 'live',
          mode: 'REAL' as const,
        },
      },
      sealed ? 200 : 409,
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error interno.';
    return json({ ok: false, error: message }, 500);
  }
}

