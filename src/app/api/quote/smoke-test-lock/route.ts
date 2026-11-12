/**
 * ════════════════════════════════════════════════════════════════════════════
 * POST /api/quote/smoke-test-lock — PRUEBA PRIVADA DE LA PASARELA (1,00 €)
 * ════════════════════════════════════════════════════════════════════════════
 * Crea una sesión REAL de Stripe Checkout por importe exacto de 1,00 € para la
 * reserva de Edwin Agudelo. Permite al CEO verificar de punta a punta la
 * pasarela en producción real con exposición financiera de un euro.
 *
 * Reglas de seguridad (SEC-1 · SEC-3 · SEC-5 · INV-17):
 *  1. DEFAULT-DENY ROTATIVO: si `SMOKE_TEST_LOCK_SECRET` está definida, el
 *     header `x-smoke-test-key` debe coincidir. Sin variable definida, la ruta
 *     solo acepta peticiones locales (`localhost` / `127.0.0.1`), de modo que
 *     en producción queda cerrada hasta que el CEO fije el secreto.
 *  2. Importe INMUTABLE: 100 céntimos. El body NO puede alterarlo.
 *  3. El secreto de Stripe jamás sale del servidor (`getStripe()` server-only).
 *  4. Timeout explícito de 8 s en la llamada al PSP.
 *  5. Metadata sellada con `mode: 'SMOKE_TEST'` para que el webhook no
 *     contamine el ledger de comisiones con una prueba de 1,00 €.
 * ════════════════════════════════════════════════════════════════════════════
 */

import { NextResponse } from 'next/server';
import { getStripe } from '@/lib/payments';
import {
  SUELO_SOLISTA_EUR,
  TARIFA_SOLISTA_EUR,
  CONDICIONES_CONTRATO_SOLISTA,
} from '@/lib/pricing/solista-pricing';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/** Importe INMUTABLE de la prueba privada: 1,00 € = 100 céntimos. */
const SMOKE_TEST_LOCK_CENTS = 100;

const TIMEOUT_MS = 8_000;

/** Cabecera canónica de autorización de la prueba. */
const SMOKE_TEST_HEADER = 'x-smoke-test-key';

function isLocalRequest(req: Request): boolean {
  const forwarded = req.headers.get('x-forwarded-for') ?? '';
  const host = req.headers.get('host') ?? '';
  const candidates: string[] = [
    forwarded.split(',')[0]?.trim() ?? '',
    req.headers.get('x-real-ip') ?? '',
    host.split(':')[0] ?? '',
  ];
  return candidates.some(
    (value) =>
      value === 'localhost' || value === '127.0.0.1' || value === '::1' || value === '[::1]',
  );
}

/**
 * Autoriza la prueba. FAIL-CLOSED: cualquier duda ⇒ `false`.
 * Con secreto configurado se exige igualdad exacta; sin secreto solo se admite
 * tráfico local (entorno de desarrollo del CEO).
 */
function isSmokeTestAuthorized(req: Request): boolean {
  const expected = process.env.SMOKE_TEST_LOCK_SECRET?.trim();
  if (expected && expected.length > 0) {
    const provided = req.headers.get(SMOKE_TEST_HEADER)?.trim();
    return provided !== undefined && provided.length > 0 && provided === expected;
  }
  return isLocalRequest(req);
}

export async function POST(req: Request) {
  // 1. Caso negativo primero: la ruta nace cerrada.
  if (!isSmokeTestAuthorized(req)) {
    return NextResponse.json(
      {
        ok: false,
        error: 'SMOKE_TEST_FORBIDDEN',
        detail:
          'Prueba privada. Requiere la cabecera x-smoke-test-key (SMOKE_TEST_LOCK_SECRET) o tráfico local.',
      },
      { status: 403 },
    );
  }

  let payload: unknown = {};
  try {
    const rawText = await req.text();
    if (rawText.trim().length > 0) payload = JSON.parse(rawText);
  } catch {
    return NextResponse.json(
      { ok: false, error: 'INVALID_JSON', detail: 'El body debe ser JSON válido o vacío.' },
      { status: 400 },
    );
  }

  if (typeof payload !== 'object' || payload === null) {
    return NextResponse.json(
      { ok: false, error: 'INVALID_BODY', detail: 'El body debe ser un objeto JSON.' },
      { status: 400 },
    );
  }

  const { eventDate } = payload as { eventDate?: unknown };
  const fecha =
    typeof eventDate === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(eventDate.trim())
      ? eventDate.trim()
      : new Date().toISOString().slice(0, 10);

  const baseUrl = (process.env.NEXT_PUBLIC_BASE_URL || 'https://productoraear.com').replace(
    /\/$/,
    '',
  );

  try {
    const session = await getStripe().checkout.sessions.create(
      {
        mode: 'payment',
        payment_method_types: ['card'],
        line_items: [
          {
            quantity: 1,
            price_data: {
              currency: 'eur',
              unit_amount: SMOKE_TEST_LOCK_CENTS,
              product_data: {
                name: 'Smoke Test · Reserva Edwin Agudelo (1,00 €)',
                description:
                  'Prueba privada de la pasarela en producción real. Importe simbólico de 1,00 €: no bloquea agenda ni genera obligación contractual.',
              },
            },
          },
        ],
        metadata: {
          mode: 'SMOKE_TEST',
          tipo: 'SMOKE_TEST_LOCK',
          artista: 'Edwin Agudelo',
          fecha,
          tarifaEstandarEur: TARIFA_SOLISTA_EUR.toFixed(2),
          sueloSolistaEur: SUELO_SOLISTA_EUR.toFixed(2),
          reservaPct: '0.5',
          condiciones: CONDICIONES_CONTRATO_SOLISTA.reserva,
        },
        success_url: `${baseUrl}/checkout?smoke_test=success&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${baseUrl}/checkout?smoke_test=cancelled`,
      },
      { timeout: TIMEOUT_MS },
    );

    if (!session.url) {
      return NextResponse.json(
        {
          ok: false,
          error: 'STRIPE_URL_MISSING',
          detail: 'Stripe no devolvió URL de checkout.',
        },
        { status: 502 },
      );
    }

    return NextResponse.json(
      {
        ok: true,
        sessionId: session.id,
        url: session.url,
        amountCents: SMOKE_TEST_LOCK_CENTS,
        currency: 'eur',
        mode: 'SMOKE_TEST' as const,
        eventDate: fecha,
        probed: true,
        source: 'live' as const,
        checkedAt: new Date().toISOString(),
      },
      { status: 201 },
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'UNKNOWN_ERROR';
    const missingKey = message.includes('STRIPE_SECRET_KEY');
    return NextResponse.json(
      {
        ok: false,
        error: missingKey ? 'STRIPE_KEY_MISSING' : 'SMOKE_TEST_FAILED',
        detail: message,
        probed: true,
        source: 'live' as const,
        checkedAt: new Date().toISOString(),
      },
      { status: missingKey ? 503 : 502 },
    );
  }
}
