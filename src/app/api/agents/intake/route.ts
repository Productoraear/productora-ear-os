/**
 * 🚪 `/api/agents/intake` — Puerta única de los formularios hacia la flota Ω.
 * ----------------------------------------------------------------------------
 * Reemplaza el `fetch` ciego de cada modal por una cascada auditable:
 * formulario → saneado → SSOT → agentes → n8n (background) → recibo tipado.
 *
 * Defensas:
 *  - runtime Node (los handlers leen SSOT y despachan a n8n).
 *  - kill-switch global (`.antigravity/STOP`).
 *  - rate-limit por IP (10/min) — por encima del presupuesto del bus (30 msg/min
 *    ≈ 10 ingesta/min con 3 saltos por traza) se devuelve 429 honesto.
 *  - cuerpo máximo 16 KB y `no-store` (nunca se cachea un veredicto comercial).
 * ----------------------------------------------------------------------------
 */
import { NextResponse } from 'next/server';
import { isKillSwitchActive } from '@/lib/agents/killSwitch';
import { SlidingWindowRateLimiter } from '@/lib/agents/chatGuard';
import { listIntakeRoutes, runFormIntake } from '@/lib/agents/formIntake';
import type { IntakeOutcome } from '@/lib/agents/formIntake';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MAX_BODY_BYTES = 16_384;
const intakeLimiter = new SlidingWindowRateLimiter(10, 60_000);

const NO_STORE_HEADERS: Readonly<Record<string, string>> = {
  'Cache-Control': 'no-store, max-age=0',
  'X-Content-Type-Options': 'nosniff',
};

function clientKey(request: Request): string {
  const forwarded: string | null = request.headers.get('x-forwarded-for');
  const candidate: string = forwarded?.split(',')[0]?.trim() ?? '';
  return candidate.length > 0 ? candidate : 'anon';
}

/** Censo de rutas: permite auditar el puente sin abrir el código. */
export async function GET(): Promise<NextResponse> {
  return NextResponse.json(
    { routes: listIntakeRoutes(), formTypes: listIntakeRoutes().map((route) => route.formType) },
    { status: 200, headers: NO_STORE_HEADERS },
  );
}

export async function POST(request: Request): Promise<NextResponse> {
  try {
    if (isKillSwitchActive()) {
      return NextResponse.json(
        { error: 'Ingesta de formularios suspendida por el CEO (kill-switch).', fields: [] },
        { status: 503, headers: NO_STORE_HEADERS },
      );
    }

    intakeLimiter.prune();
    if (!intakeLimiter.allow(clientKey(request))) {
      return NextResponse.json(
        { error: 'Demasiadas solicitudes. Espera un minuto o escríbenos por WhatsApp.', fields: [] },
        { status: 429, headers: { ...NO_STORE_HEADERS, 'Retry-After': '60' } },
      );
    }

    const raw: string = await request.text();
    if (raw.length === 0) {
      return NextResponse.json(
        { error: 'Cuerpo vacío: falta el formulario.', fields: [] },
        { status: 400, headers: NO_STORE_HEADERS },
      );
    }
    if (raw.length > MAX_BODY_BYTES) {
      return NextResponse.json(
        { error: 'Formulario demasiado grande.', fields: [] },
        { status: 413, headers: NO_STORE_HEADERS },
      );
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      return NextResponse.json(
        { error: 'JSON inválido.', fields: [] },
        { status: 400, headers: NO_STORE_HEADERS },
      );
    }

    const outcome: IntakeOutcome = await runFormIntake(parsed);
    if (!outcome.ok) {
      return NextResponse.json(
        { error: outcome.error, fields: outcome.fields },
        { status: outcome.status, headers: NO_STORE_HEADERS },
      );
    }
    return NextResponse.json(outcome.result, { status: 200, headers: NO_STORE_HEADERS });
  } catch {
    return NextResponse.json(
      { error: 'Fallo interno al cualificar la solicitud.', fields: [] },
      { status: 500, headers: NO_STORE_HEADERS },
    );
  }
}
