#!/usr/bin/env node
/**
 * ════════════════════════════════════════════════════════════════════════════
 * VERIFICACIÓN EJECUTABLE — FICHA DE SERVICIO AL PROVEEDOR (2 h / firma)
 * ════════════════════════════════════════════════════════════════════════════
 * Sin red, sin Stripe, sin GPU: prueba el motor puro
 * `src/lib/booking/provider-service-brief.ts` con casos límite reales.
 *
 * Ejecuta:
 *   node ./node_modules/tsx/dist/cli.mjs scripts/verify_provider_service_brief.ts
 * Salida: Exit Code 0 si TODAS las aserciones pasan; 1 si alguna falla.
 * ════════════════════════════════════════════════════════════════════════════
 */

import {
  MAX_BRIEF_CHARS,
  PAYMENT_WINDOW_MS,
  buildProviderServiceBrief,
  buildProviderWhatsappUrl,
  formatEventDate,
  type ProviderBriefFicha,
  type ProviderBriefInput,
  type ProviderBriefPayment,
} from '../src/lib/booking/provider-service-brief.ts';

interface CaseResult {
  readonly id: number;
  readonly name: string;
  readonly ok: boolean;
  readonly detail: string;
}

const results: CaseResult[] = [];

function check(id: number, name: string, ok: boolean, detail: string): void {
  results.push({ id, name, ok, detail });
}

const REQUESTED_AT = '2026-11-04T10:00:00.000Z';
const CLOSES_AT = new Date(Date.parse(REQUESTED_AT) + PAYMENT_WINDOW_MS).toISOString();

const fullFicha: ProviderBriefFicha = {
  requestId: 'REQ-9F1C2D3E4A5B',
  reference: 'EAR-MCH-MW2CD4D1',
  provider: {
    id: 'edwin-agudelo',
    name: 'Edwin Agudelo',
    category: 'Solista Premium',
    email: 'artista@productoraear.com',
    phone: '+34 610 555 444',
  },
  clientName: 'Marta Ruiz',
  clientPhone: '+34 600 111 222',
  clientEmail: 'marta@example.com',
  eventType: 'Boda',
  eventPurpose: 'Ceremonia + cóctel',
  eventDate: '2026-11-18',
  startTime: '20:00',
  durationHours: 3,
  venueName: 'Finca El Roble',
  venueAddress: 'Camino de la Vega 12',
  city: 'Navalcarnero',
  province: 'Madrid',
  guests: 120,
  childrenCount: 24,
  isIndoor: false,
  serviceFormat: 'Solista Premium · 3 pases de 15 min',
  riderNotes: 'Serenata a la madre en el segundo pase',
};

function paidPayment(paidAt: string): ProviderBriefPayment {
  return { status: 'paid', amountEur: 100, paidAt, sessionId: 'cs_test_brief_001' };
}

function baseInput(overrides: Partial<ProviderBriefInput> = {}): ProviderBriefInput {
  return {
    ficha: fullFicha,
    requestedAt: REQUESTED_AT,
    now: '2026-11-04T11:00:00.000Z',
    totalEur: 350,
    depositEur: 100,
    setupMinutes: 60,
    signatureUrl: 'https://www.productoraear.com/api/booking/accept?token=abc.def',
    signatureExpiresAt: '2026-11-04T13:00:00.000Z',
    ...overrides,
  };
}

/* ── CASO 1 — pago 1 h 59 min después: ficha VALIDADA y firmable ─────────── */
{
  const brief = buildProviderServiceBrief(
    baseInput({ payment: paidPayment('2026-11-04T11:59:00.000Z') }),
  );

  const titles = brief.blocks.map((block) => block.title);
  const requiredTitles = [
    '1 · CUÁNDO',
    '2 · DÓNDE',
    '3 · QUÉ Y PARA QUÉ',
    '4 · QUIÉN CONTRATA Y PAGA',
    '5 · INVITADOS Y PRESIÓN SONORA',
    '6 · RIDER Y NECESIDADES',
    '7 · DINERO',
    '8 · TU ÚNICO PASO',
  ];
  const ok =
    brief.state === 'VALIDADO' &&
    brief.dispatchAllowed === true &&
    brief.signatureAllowed === true &&
    brief.missing.length === 0 &&
    brief.contractSeed !== null &&
    requiredTitles.every((title) => titles.includes(title)) &&
    brief.text.includes('mié 18/11/2026') &&
    brief.text.includes('Inicio 20:00 · Fin 23:00 · 3 h de servicio') &&
    brief.text.includes('Montaje: 60 min antes (19:00)') &&
    brief.text.includes('120 invitados (24 niños)') &&
    brief.text.includes('1440 W de refuerzo') &&
    brief.text.includes('A cobrar en el evento: 250,00 €') &&
    brief.text.includes('Firma el contrato que acepta el servicio') &&
    brief.chars <= MAX_BRIEF_CHARS &&
    /^[a-f0-9]{64}$/.test(brief.briefHash);

  check(
    1,
    'Pago a 1 h 59 min → VALIDADO, 8 bloques, firmable',
    ok,
    `state=${brief.state} · chars=${brief.chars}`,
  );
}

/* ── CASO 2 — pago 1 min tarde: fuera de plazo, sin contrato ─────────────── */
{
  const brief = buildProviderServiceBrief(
    baseInput({
      payment: paidPayment('2026-11-04T12:01:00.000Z'),
      now: '2026-11-04T12:05:00.000Z',
    }),
  );
  const ok =
    brief.state === 'PAGO_FUERA_DE_PLAZO' &&
    brief.dispatchAllowed === false &&
    brief.signatureAllowed === false &&
    brief.contractSeed === null &&
    brief.text.includes('PAGO FUERA DE PLAZO');
  check(2, 'Pago 1 min tarde → PAGO_FUERA_DE_PLAZO, sin despacho', ok, `state=${brief.state}`);
}

/* ── CASO 3 — pago exactamente en el límite: válido (<=) ────────────────── */
{
  const brief = buildProviderServiceBrief(baseInput({ payment: paidPayment(CLOSES_AT) }));
  const ok = brief.state === 'VALIDADO' && brief.paymentWindow.withinWindow === true;
  check(
    3,
    'Pago en el segundo exacto del cierre → VALIDADO',
    ok,
    `closesAt=${brief.paymentWindow.closesAt ?? 'null'}`,
  );
}

/* ── CASO 4 — sin pago dentro de la ventana: se emite, no se firma ──────── */
{
  const brief = buildProviderServiceBrief(baseInput({ payment: { status: 'pending' } }));
  const ok =
    brief.state === 'PENDIENTE_PAGO' &&
    brief.dispatchAllowed === false &&
    brief.signatureAllowed === false &&
    brief.text.includes('No firmes todavía') &&
    brief.text.includes('Depósito 100,00 € PENDIENTE');
  check(4, 'Sin pago dentro de ventana → PENDIENTE_PAGO, no se firma', ok, `state=${brief.state}`);
}

/* ── CASO 5 — sin pago y ventana vencida: no hay contrato ───────────────── */
{
  const brief = buildProviderServiceBrief(
    baseInput({ payment: { status: 'none' }, now: '2026-11-04T13:00:00.000Z' }),
  );
  const ok =
    brief.state === 'EXPIRADO_SIN_PAGO' &&
    brief.dispatchAllowed === false &&
    brief.text.includes('No hay contrato') &&
    brief.paymentWindow.remainingMs === 0;
  check(5, 'Ventana vencida sin pago → EXPIRADO_SIN_PAGO', ok, `state=${brief.state}`);
}

/* ── CASO 6 — ficha incompleta: dice qué falta, no inventa ──────────────── */
{
  const incomplete: ProviderBriefFicha = {
    requestId: 'REQ-INCOMPLETO-01',
    provider: { id: 'edwin-agudelo', name: 'Edwin Agudelo' },
    eventDate: '2026-11-18',
    clientName: 'Marta Ruiz',
  };
  const brief = buildProviderServiceBrief(
    baseInput({ ficha: incomplete, payment: paidPayment('2026-11-04T11:00:00.000Z') }),
  );

  const expectedMissing = [
    'Hora de inicio',
    'Duración (h)',
    'Dirección exacta del lugar',
    'Municipio',
    'Tipo de evento',
    'Teléfono del cliente',
    'Nº de invitados',
  ];
  const ok =
    brief.state === 'FICHA_INCOMPLETA' &&
    brief.paymentState === 'VALIDADO' &&
    brief.dispatchAllowed === false &&
    expectedMissing.every((label) => brief.missing.includes(label)) &&
    brief.text.includes('FALTAN DATOS') &&
    brief.text.includes('❌ falta') &&
    !brief.text.includes('Navalcarnero') &&
    !brief.text.includes('120 invitados');
  check(
    6,
    'Ficha incompleta → FICHA_INCOMPLETA con lista exacta, cero invención',
    ok,
    `missing=${brief.missing.length}`,
  );
}

/* ── CASO 7 — sello determinista y sensible al contenido ────────────────── */
{
  const a = buildProviderServiceBrief(
    baseInput({ payment: paidPayment('2026-11-04T11:00:00.000Z') }),
  );
  const b = buildProviderServiceBrief(
    baseInput({ payment: paidPayment('2026-11-04T11:00:00.000Z') }),
  );
  const c = buildProviderServiceBrief(
    baseInput({
      ficha: { ...fullFicha, guests: 121 },
      payment: paidPayment('2026-11-04T11:00:00.000Z'),
    }),
  );
  const ok = a.briefHash === b.briefHash && a.briefHash !== c.briefHash;
  check(7, 'Hash SHA-256 estable e íntegro (cambiar pax cambia el sello)', ok, `sha=${a.briefHash.slice(0, 16)}…`);
}

/* ── CASO 8 — cero ruido promocional en la ficha ────────────────────────── */
{
  const brief = buildProviderServiceBrief(
    baseInput({ payment: paidPayment('2026-11-04T11:00:00.000Z') }),
  );
  const banned = ['Bono', 'Reembolsable', 'Garantía', '0 Fallos', 'Inmediato', 'EDWIN150', 'Uber'];
  const found = banned.filter((word) => brief.text.includes(word));
  const ok = found.length === 0;
  check(
    8,
    'Sin marketing: 0 bonos, 0 garantías, 0 superlativos',
    ok,
    found.length === 0 ? 'texto limpio' : `encontrado: ${found.join(', ')}`,
  );
}

/* ── CASO 9 — fecha de calendario determinista (sin zona horaria) ───────── */
{
  const ok =
    formatEventDate('2026-11-18') === 'mié 18/11/2026' &&
    formatEventDate('2026-12-31') === 'jue 31/12/2026' &&
    formatEventDate('no-es-fecha') === null;
  check(9, 'formatEventDate correcto y fail-closed', ok, String(formatEventDate('2026-12-31')));
}

/* ── CASO 10 — enlace wa.me con prefijo 34 y texto codificado ───────────── */
{
  const url = buildProviderWhatsappUrl('610 555 444', 'Hola & adiós');
  const ok =
    url.startsWith('https://wa.me/34610555444?text=') && url.includes('Hola%20%26%20adi%C3%B3s');
  check(10, 'wa.me con prefijo 34 y payload codificado', ok, url.slice(0, 48));
}

/* ── Resumen ───────────────────────────────────────────────────────────── */
const failed = results.filter((result) => !result.ok);
for (const result of results) {
  const mark = result.ok ? 'PASS' : 'FAIL';
  console.log(`[${mark}] ${result.id}. ${result.name} — ${result.detail}`);
}
console.log(
  JSON.stringify(
    {
      suite: 'verify_provider_service_brief',
      cases: results.length,
      passed: results.length - failed.length,
      failed: failed.length,
      paymentWindowMs: PAYMENT_WINDOW_MS,
      maxBriefChars: MAX_BRIEF_CHARS,
      verdict: failed.length === 0 ? 'PASS' : 'FAIL',
    },
    null,
    2,
  ),
);

process.exit(failed.length === 0 ? 0 : 1);
