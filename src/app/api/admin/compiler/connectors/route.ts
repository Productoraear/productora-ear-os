import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAdmin } from '@/lib/security/adminGuard';
import {
  evaluateConnectorMatrix,
  toggleConnector,
  type ConnectorState,
} from '@/lib/compiler/connector-matrix';
import {
  createConnectorStateStore,
  probeOntologySyntax,
} from '@/lib/compiler/metacompiler-server-hosts';
import { CONNECTORS } from '@/lib/catalog/ecosystem-ontology';

/**
 * ════════════════════════════════════════════════════════════════════════════
 * /api/admin/compiler/connectors — MATRIZ EN CALIENTE DE LOS 5 CONECTORES
 * ════════════════════════════════════════════════════════════════════════════
 *   GET  → estado + matriz evaluada + sincronización con las 3 puertas + salud
 *          sintáctica real de `ecosystem-ontology.ts` (hash y errores del parser).
 *   POST → conmuta un conector. La operación es TRANSACCIONAL: si dejaría una
 *          puerta sin conector activo, responde 409 con el estado intacto.
 *
 * Default-deny (SEC-1): sin sesión de administrador no se lee ni se escribe.
 * Zod estricto (SEC-4) en ambos cuerpos. Cero DDL: el estado vive en
 * `providerProfileField` bajo una clave única (INV-08).
 * ════════════════════════════════════════════════════════════════════════════
 */

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MAX_BODY_BYTES = 4 * 1024;

const ToggleBodySchema = z
  .object({
    id: z.enum(['CLIENTE', 'PROVEEDOR', 'AFILIADO', 'MECENAS', 'SOCIO_ESTRATEGICO']),
    active: z.boolean(),
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

/** Catálogo real (fuente única) más la salud sintáctica del fichero que lo declara. */
async function catalogueHealth(now: string) {
  let syntax: Awaited<ReturnType<typeof probeOntologySyntax>> | null = null;
  try {
    syntax = await probeOntologySyntax();
  } catch {
    syntax = null;
  }
  return {
    connectors: CONNECTORS.map((connector) => ({ id: connector.id, label: connector.label })),
    file: syntax === null
      ? { ok: false, bytes: 0, sha256: null, errors: ['ecosystem-ontology.ts ilegible'] }
      : { ok: syntax.ok, bytes: syntax.bytes, sha256: syntax.sha256, errors: syntax.errors },
    checkedAt: now,
  };
}

export async function GET(request: Request): Promise<NextResponse> {
  try {
    const auth = await requireAdmin(request);
    if (!auth.ok) return auth.response;

    const now = new Date().toISOString();
    const store = createConnectorStateStore();
    let loaded: { readonly state: ConnectorState; readonly persisted: boolean };
    try {
      loaded = await store.load(now);
    } catch (error: unknown) {
      // La DB puede estar caída: se declara SIN_EVIDENCIA. Nunca se pinta un
      // estado "guardado" que en realidad no se ha podido leer.
      return json(
        {
          ok: false,
          error: 'No se pudo leer el estado persistido de conectores.',
          status: 'SIN_EVIDENCIA',
          detail: error instanceof Error ? error.message : 'error desconocido',
          store: store.kind,
        },
        503,
      );
    }

    return json({
      ok: true,
      data: {
        store: store.kind,
        persisted: loaded.persisted,
        state: loaded.state,
        matrix: evaluateConnectorMatrix(loaded.state, now),
        catalogue: await catalogueHealth(now),
        checkedAt: now,
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

    const parsed = ToggleBodySchema.safeParse(rawBody);
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
    const store = createConnectorStateStore();
    const loaded = await store.load(now);
    const outcome = toggleConnector(loaded.state, parsed.data, now, auth.email);

    if (!outcome.ok) {
      // 409: la conmutación choca con una invariante de negocio, no con un error
      // de sintaxis. El estado devuelto es el ORIGINAL, intacto.
      return json(
        {
          ok: false,
          code: outcome.code,
          error: outcome.detail,
          data: { state: outcome.state, matrix: outcome.matrix, persisted: loaded.persisted },
        },
        outcome.code === 'UNKNOWN_CONNECTOR' ? 404 : 409,
      );
    }

    const saved = await store.save(outcome.state);
    return json({
      ok: true,
      data: {
        code: outcome.code,
        detail: outcome.detail,
        state: outcome.state,
        matrix: outcome.matrix,
        persistence: { store: store.kind, persisted: saved.persisted, detail: saved.detail },
        checkedAt: now,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error interno.';
    return json({ ok: false, error: message }, 500);
  }
}

