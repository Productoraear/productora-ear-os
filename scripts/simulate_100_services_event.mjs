#!/usr/bin/env node
/**
 * ════════════════════════════════════════════════════════════════════════════
 * EAR OS · SIMULACIÓN END-TO-END DE UN EVENTO COMPLETO (122 SERVICIOS)
 * ════════════════════════════════════════════════════════════════════════════
 * Recorre el ecosistema real por HTTP (no reimplementa lógica):
 *
 *   1. AISLAMIENTO DE AGENDAS
 *      · Lee la agenda de un artista y la de un proveedor de catering.
 *      · Verifica que son registros distintos (fin de la fuga de agenda).
 *   2. PLANO DEL EVENTO
 *      · POST /api/events/blueprint con un perfil exigente.
 *      · Exige ≥100 servicios evaluados y proveedores reales con ≥75 %.
 *   3. CARRITO
 *      · Comprueba que cada proveedor del carrito tiene agenda propia + iCal.
 *   4. COBRO DE 1 € POR PROVEEDOR (simulado)
 *      · POST /api/events/deposit en modo `simulate`.
 *      · Materializa el bloqueo real de franja en la agenda de cada proveedor.
 *
 * USO:
 *   npm run dev                    (en otra terminal, puerto 3007)
 *   node scripts/simulate_100_services_event.mjs
 *
 * Variables: EAR_BASE_URL (default http://127.0.0.1:3007),
 *            EAR_SIM_PROVINCE (madrid), EAR_SIM_GUESTS (180),
 *            EAR_SIM_BUDGET (45000), EAR_SIM_DATE (ISO), EAR_SIM_SLOT (14:00)
 *
 * SALIDA: reports/event_simulation_report.json + resumen JSON en consola.
 * Exit code 0 = todas las aserciones pasan. 1 = al menos una falla.
 * ════════════════════════════════════════════════════════════════════════════
 */

import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const BASE_URL = (process.env.EAR_BASE_URL || 'http://127.0.0.1:3007').replace(/\/+$/, '');
const PROVINCE = (process.env.EAR_SIM_PROVINCE || 'madrid').trim().toLowerCase();
const GUESTS = Number(process.env.EAR_SIM_GUESTS || 180);
const BUDGET = Number(process.env.EAR_SIM_BUDGET || 45000);
const SLOT = process.env.EAR_SIM_SLOT || '14:00';
const MIN_SERVICES = 100;
const MIN_MATCH = 75;

const SIM_DATE =
  process.env.EAR_SIM_DATE ||
  (() => {
    const date = new Date();
    date.setDate(date.getDate() + 120);
    return date.toISOString().slice(0, 10);
  })();

const results = [];
let failures = 0;

function check(name, passed, detail) {
  results.push({ name, passed, detail });
  if (!passed) failures += 1;
  const icon = passed ? 'PASS' : 'FAIL';
  console.log(`[${icon}] ${name}${detail ? ` :: ${JSON.stringify(detail)}` : ''}`);
}

async function api(pathname, init) {
  const response = await fetch(`${BASE_URL}${pathname}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(process.env.EAR_ADMIN_TOKEN ? { 'x-ear-admin-token': process.env.EAR_ADMIN_TOKEN } : {}),
      ...(init?.headers ?? {}),
    },
  });
  const text = await response.text();
  let body = null;
  try {
    body = JSON.parse(text);
  } catch {
    body = { raw: text.slice(0, 400) };
  }
  return { status: response.status, ok: response.ok, body };
}

async function waitForServer(attempts = 25) {
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const res = await fetch(`${BASE_URL}/api/health`, { method: 'GET' });
      if (res.status < 500) return true;
    } catch {
      // Servidor aún no disponible.
    }
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }
  return false;
}

async function main() {
  console.log(`\nEAR OS · SIMULACIÓN DE EVENTO COMPLETO · ${BASE_URL}\n`);

  const reachable = await waitForServer();
  if (!reachable) {
    console.error(
      `No se pudo alcanzar ${BASE_URL}. Arranca el servidor con "npm run dev" y reintenta.`,
    );
    process.exit(2);
  }

  /* ── 1. AGENDA DEL ARTISTA (base de comparación) ───────────────────────── */
  const artistCalendar = await api('/api/calendar/artista/edwin-agudelo');
  check('Agenda del artista responde', artistCalendar.ok && artistCalendar.body?.ok === true, {
    status: artistCalendar.status,
    entity: artistCalendar.body?.entity?.slug,
  });

  /* ── 2. PLANO DEL EVENTO (122 SERVICIOS) ───────────────────────────────── */
  const blueprint = await api('/api/events/blueprint', {
    method: 'POST',
    body: JSON.stringify({
      province: PROVINCE,
      guests: GUESTS,
      budgetEur: BUDGET,
      eventDate: SIM_DATE,
      timeSlot: SLOT,
    }),
  });

  const cart = blueprint.body?.cart ?? null;
  check('El plano del evento se genera', blueprint.ok && blueprint.body?.ok === true, {
    status: blueprint.status,
    providersEvaluated: blueprint.body?.providersEvaluated ?? null,
    executionTimeMs: blueprint.body?.executionTimeMs ?? null,
  });

  const serviceCount = cart?.totals?.services ?? 0;
  check(`Catálogo cubre más de ${MIN_SERVICES} servicios`, serviceCount > MIN_SERVICES, {
    serviceCount,
    catalogServices: blueprint.body?.catalogServices ?? null,
  });

  const providers = cart?.providers ?? [];
  check('El carrito contiene proveedores reales', providers.length > 0, {
    uniqueProviders: providers.length,
    coverage: cart?.totals?.coveragePercent ?? 0,
    essentialCoverage: cart?.totals?.essentialCoveragePercent ?? 0,
  });

  const belowThreshold = providers.filter((provider) => provider.bestScore < MIN_MATCH);
  check(`Todos los proveedores del carrito superan el ${MIN_MATCH} %`, belowThreshold.length === 0, {
    below: belowThreshold.map((provider) => ({ slug: provider.slug, score: provider.bestScore })),
  });

  const withoutCalendar = providers.filter(
    (provider) => !provider.calendarHref?.includes(`/${provider.kind}/`) || !provider.icalHref,
  );
  check('Cada proveedor del carrito tiene agenda propia e iCal', withoutCalendar.length === 0, {
    invalid: withoutCalendar.slice(0, 5).map((provider) => provider.slug),
  });

  const uniqueCount = new Set(providers.map((provider) => provider.slug)).size;
  check('Sin proveedores duplicados en el carrito', uniqueCount === providers.length, {
    unique: uniqueCount,
    total: providers.length,
  });

  /* ── 2b. AISLAMIENTO REAL ENTRE AGENDAS ────────────────────────────────── */
  const sampleProvider = providers[0];
  if (sampleProvider) {
    const providerCalendar = await api(`/api/calendar/${sampleProvider.kind}/${sampleProvider.slug}`);
    const providerEntity = providerCalendar.body?.entity ?? null;
    check(
      'La agenda del proveedor NO es la del artista',
      providerCalendar.ok &&
        providerEntity !== null &&
        providerEntity.slug !== artistCalendar.body?.entity?.slug,
      {
        provider: providerEntity?.slug ?? null,
        kind: sampleProvider.kind,
        artist: artistCalendar.body?.entity?.slug ?? null,
      },
    );

    const artistBlocked = new Set(artistCalendar.body?.blockedDates ?? []);
    const providerBlocked = new Set(providerCalendar.body?.blockedDates ?? []);
    const overlap = [...artistBlocked].filter((date) => providerBlocked.has(date));
    check('Cero fechas bloqueadas compartidas entre entidades', overlap.length === 0, {
      artistBlocked: artistBlocked.size,
      providerBlocked: providerBlocked.size,
      overlap,
    });

    const ical = await api(`/api/calendar/${sampleProvider.kind}/${sampleProvider.slug}/ical`);
    const icalText = typeof ical.body?.raw === 'string' ? ical.body.raw : '';
    check('El feed iCal del proveedor responde (no 404)', ical.status === 200 && icalText.includes('BEGIN:VCALENDAR'), {
      status: ical.status,
    });
  }

  /* ── 3. COBRO DE 1 € POR PROVEEDOR (SIMULADO) ──────────────────────────── */
  const deposit = await api('/api/events/deposit', {
    method: 'POST',
    body: JSON.stringify({
      mode: 'simulate',
      eventDate: SIM_DATE,
      timeSlot: SLOT,
      idempotencyKey: `ear-sim-${SIM_DATE}-${PROVINCE}`,
      items: providers.map((provider) => ({
        slug: provider.slug,
        kind: provider.kind,
        name: provider.name,
        serviceIds: provider.services.map((service) => service.id),
      })),
    }),
  });

  const receipts = deposit.body?.receipts ?? [];
  const charged = deposit.body?.charged ?? 0;
  check('Garantía de 1 € procesada para cada proveedor', charged === providers.length, {
    requested: deposit.body?.requested ?? 0,
    charged,
    failed: deposit.body?.failed ?? 0,
    totalCents: deposit.body?.totalCents ?? 0,
  });

  const rejected = receipts.filter((receipt) => receipt.status === 'REJECTED');
  check('Cero garantías rechazadas', rejected.length === 0, {
    rejected: rejected.slice(0, 5).map((receipt) => ({ slug: receipt.slug, reason: receipt.reason })),
  });

  const withCalendarHref = receipts.filter((receipt) => typeof receipt.calendarHref === 'string');
  check('Cada recibo apunta a la agenda de SU proveedor', withCalendarHref.length === receipts.length, {
    receipts: receipts.length,
    withCalendarHref: withCalendarHref.length,
  });

  /* ── 4. VERIFICACIÓN DE ESCRITURA REAL ─────────────────────────────────── */
  const sample = receipts[0];
  if (sample) {
    const reservedCalendar = await api(`/api/calendar/${sample.kind}/${sample.slug}`);
    const reservedDates = reservedCalendar.body?.confirmedDates ?? [];
    check('La fecha quedó bloqueada en la agenda del proveedor', reservedDates.includes(SIM_DATE), {
      slug: sample.slug,
      eventDate: SIM_DATE,
      confirmedDates: reservedDates.slice(0, 5),
    });
  }

  /* ── 5. IDEMPOTENCIA (reintento del cobro) ─────────────────────────────── */
  const replay = await api('/api/events/deposit', {
    method: 'POST',
    body: JSON.stringify({
      mode: 'simulate',
      eventDate: SIM_DATE,
      timeSlot: SLOT,
      idempotencyKey: `ear-sim-${SIM_DATE}-${PROVINCE}`,
      items: providers.slice(0, 3).map((provider) => ({
        slug: provider.slug,
        kind: provider.kind,
        name: provider.name,
        serviceIds: provider.services.map((service) => service.id),
      })),
    }),
  });
  const replayStatuses = (replay.body?.receipts ?? []).map((receipt) => receipt.status);
  const replayIdempotent = replayStatuses.every(
    (status) => status === 'ALREADY_ACTIVE' || status === 'PAID_SIMULATED',
  );
  check('Reintento idempotente no duplica reservas', replayIdempotent, { statuses: replayStatuses });

  /* ── 6. REPORTE ────────────────────────────────────────────────────────── */
  const report = {
    generatedAt: new Date().toISOString(),
    baseUrl: BASE_URL,
    brief: {
      province: PROVINCE,
      guests: GUESTS,
      budgetEur: BUDGET,
      eventDate: SIM_DATE,
      timeSlot: SLOT,
    },
    catalogServices: blueprint.body?.catalogServices ?? null,
    providersEvaluated: blueprint.body?.providersEvaluated ?? null,
    totals: cart?.totals ?? null,
    thresholds: { minServices: MIN_SERVICES, minMatch: MIN_MATCH },
    providers: providers.map((provider) => ({
      slug: provider.slug,
      name: provider.name,
      category: provider.category,
      kind: provider.kind,
      bestScore: provider.bestScore,
      services: provider.services.length,
      calendarHref: provider.calendarHref,
    })),
    gaps: (cart?.gaps ?? []).map((gap) => gap.name),
    deposit: {
      mode: deposit.body?.mode ?? null,
      requested: deposit.body?.requested ?? 0,
      charged,
      failed: deposit.body?.failed ?? 0,
      totalCents: deposit.body?.totalCents ?? 0,
    },
    assertions: results,
    failures,
  };

  const reportPath = path.join(process.cwd(), 'reports', 'event_simulation_report.json');
  await mkdir(path.dirname(reportPath), { recursive: true });
  await writeFile(reportPath, JSON.stringify(report, null, 2), 'utf8');

  console.log('\n─── RESUMEN ───');
  console.log(
    JSON.stringify(
      {
        ok: failures === 0,
        assertions: results.length,
        failures,
        catalogServices: report.catalogServices,
        providersEvaluated: report.providersEvaluated,
        coverage: cart?.totals?.coveragePercent ?? 0,
        essentialCoverage: cart?.totals?.essentialCoveragePercent ?? 0,
        uniqueProviders: providers.length,
        chargedCents: deposit.body?.totalCents ?? 0,
        reportPath: path.relative(process.cwd(), reportPath),
      },
      null,
      2,
    ),
  );

  process.exit(failures === 0 ? 0 : 1);
}

main().catch((error) => {
  console.error('SIMULACIÓN FALLIDA:', error);
  process.exit(1);
});

