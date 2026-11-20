import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAdmin } from '@/lib/security/adminGuard';
import { compileMetaSpec, type MetaCompilerResult } from '@/lib/compiler/metacompiler-engine';
import { MetaCompilerSpecSchema, buildDefaultSpec, DESIGN_CONSTITUTION } from '@/lib/compiler/metacompiler-spec';
import { META_FSM_STATES, META_TRANSITIONS } from '@/lib/compiler/metacompiler-fsm';
import { createServerRuntime } from '@/lib/compiler/metacompiler-server-runtime';

/**
 * ════════════════════════════════════════════════════════════════════════════
 * /api/admin/compiler/fsm — EJECUCIÓN DEL METACOMPILADOR (MOTOR LOCAL)
 * ════════════════════════════════════════════════════════════════════════════
 * Ejecuta la FSM determinista `IDLE → HASH_VERIF → TYPE_CHECK → LINT_AST →
 * GATE_EVAL → SEALED | ABORT` sobre una `MetaCompilerSpec` validada con Zod.
 *
 * Default-deny (SEC-1): sin sesión de administrador ⇒ 401. El primer caso que
 * se prueba es el negativo; el camino feliz no existe para anónimos.
 *
 * Cero tokens remotos: el motor importa el compilador de TypeScript en local y
 * el centinela de Zona Cero. No hay llamada a ningún LLM ni a ninguna API de
 * pago en toda la ruta.
 * ════════════════════════════════════════════════════════════════════════════
 */

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MAX_BODY_BYTES = 256 * 1024;

/** Esquema del cuerpo: `spec` es obligatoria salvo en `GET`. */
const FsmBodySchema = z
  .object({
    spec: MetaCompilerSpecSchema,
    /** Sembrado idempotente de ontología en PostgreSQL (INV-08). */
    seedOntology: z.boolean().optional(),
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

/** Metadatos de la máquina de estados (contrato visible para la UI). */
function contractPayload(): Record<string, unknown> {
  return {
    ok: true,
    data: {
      states: META_FSM_STATES,
      transitions: META_TRANSITIONS,
      initial: 'IDLE',
      terminals: ['SEALED', 'ABORT'],
      constitution: DESIGN_CONSTITUTION.map((constant) => ({
        id: constant.id,
        ssotSymbol: constant.ssotSymbol,
        expected: constant.expected,
        actual: constant.actual,
        invariant: constant.invariant,
        parity: constant.expected === constant.actual,
      })),
      defaultSpec: buildDefaultSpec(),
      probed: true,
      source: 'live',
      mode: 'REAL',
      checkedAt: new Date().toISOString(),
    },
  };
}

export async function GET(request: Request): Promise<NextResponse> {
  try {
    const auth = await requireAdmin(request);
    if (!auth.ok) return auth.response;
    return json(contractPayload());
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

    const parsed = FsmBodySchema.safeParse(rawBody);
    if (!parsed.success) {
      const details = parsed.error.issues.map(
        (issue) => `${issue.path.join('.') || 'body'}: ${issue.message}`,
      );
      return json({ ok: false, error: 'Payload invalido.', details }, 400);
    }

    const result: MetaCompilerResult = await compileMetaSpec(parsed.data.spec, {
      now: new Date().toISOString(),
      runtime: createServerRuntime(),
      seedOntology: parsed.data.seedOntology === true,
    });

    return json({
      ok: true,
      data: result,
      /** Alias explícito: el único veredicto de éxito admitido es SEALED. */
      sealed: result.state === 'SEALED',
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error interno.';
    return json({ ok: false, error: message }, 500);
  }
}
