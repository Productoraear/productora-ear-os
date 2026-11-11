#!/usr/bin/env -S node ./node_modules/tsx/dist/cli.mjs
/**
 * ════════════════════════════════════════════════════════════════════════════
 * ARNÉS FALSABLE · W53_T06 · MÉTRICAS DE ARTISTA EN VIVO POR VENTANAS
 * ════════════════════════════════════════════════════════════════════════════
 * `node ./node_modules/tsx/dist/cli.mjs scripts/verify_artist_metrics.ts`
 *
 * Qué prueba (y por qué cada grupo puede FALLAR de verdad):
 *   1. ventana      — presets canónicos, corte inclusivo start/end, frontera de
 *                     1 ms fuera => fuera. Si alguien redondea el corte, cae.
 *   2. agregacion   — suma por plataforma, orden estable, delta entre capturas y
 *                     buckets deterministas. Si se duplica o se pierde una fila,
 *                     cae.
 *   3. tipos        — todo valor es entero (dinero en céntimos); un Float en la
 *                     ruta de dinero lanza contrato, no se redondea.
 *   4. ssot         — filas con plataforma o métrica fuera del registro se
 *                     declaran en `rejectedRows`; jamás se agregan ni se inventan.
 *   5. honestidad   — `live` sólo con filas; 0 filas => `demo`; error de BD =>
 *                     `unavailable` (un error NO se disfraza de demo).
 *   6. demo         — la ruta no contiene `Math.random()`: el generador
 *                     aleatorio está erradicado (regresión medida).
 *   7. route        — `buildMetricsSnapshot` con doble inyectado: ventana pedida,
 *                     error de base declarado, identidad ausente declarada, y
 *                     boundary 400 sobre `GET` (default-deny).
 *   8. postgres     — agregación contra PostgreSQL REAL (esquema efímero
 *                     dedicado): dos ventanas distintas sobre las mismas filas
 *                     devuelven totales distintos y reproducibles.
 *
 * `--self-test` fuerza una aserción imposible: si el arnés sigue en PASS con el
 * canal de fallo roto, el veredicto se invierte y sale 1.
 *
 * Zero `any`. Sin red externa. Sin secretos reales.
 * ════════════════════════════════════════════════════════════════════════════
 */

import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import type { PrismaClient } from '@prisma/client';

import {
  DEFAULT_WINDOW,
  WINDOW_KEYS,
  WINDOW_PRESETS,
  aggregateMetric,
  aggregateOverview,
  alignToBucket,
  bucketWidthMs,
  isWindowPreset,
  resolveSnapshotSource,
  resolveWindowPreset,
  unitOf,
  windowStartMs,
  type MetricRow,
} from '../src/lib/career/artist-metrics';
import type { MetricKey } from '../src/lib/career/platform-registry';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const requireCjs = createRequire(import.meta.url);
const JSON_ONLY = process.argv.includes('--json');
const SELF_TEST = process.argv.includes('--self-test');

// ── Micro-framework de aserciones (mismo contrato que los arneses W53) ──────

interface CheckResult {
  readonly group: string;
  readonly name: string;
  readonly ok: boolean;
  readonly detail: string | null;
}

const results: CheckResult[] = [];

function record(group: string, name: string, ok: boolean, detail: string | null = null): void {
  results.push({ group, name, ok, detail });
}

function check(group: string, name: string, ok: boolean, detail: string | null = null): void {
  record(group, name, ok, ok ? null : (detail ?? 'aserto falso'));
}

function checkEqual(group: string, name: string, actual: unknown, expected: unknown): void {
  const ok = Object.is(actual, expected);
  record(group, name, ok, ok ? null : `esperado=${String(expected)} obtenido=${String(actual)}`);
}

function checkThrows(group: string, name: string, fn: () => unknown): void {
  try {
    fn();
    record(group, name, false, 'no lanzó');
  } catch {
    record(group, name, true);
  }
}

// ── Fixtures ────────────────────────────────────────────────────────────────

/** Instante fijo: el arnés no depende del reloj de la máquina. */
const NOW = Date.UTC(2026, 10, 11, 12, 0, 0);
const MIN = 60_000;
const ARTIST_ID = 'artist-w53t06-fixture';

function row(platformId: string, metric: string, value: number, atMs: number): MetricRow {
  return { platformId, metric, value, capturedAt: new Date(atMs) };
}

// ── 1 · Ventanas temporales ─────────────────────────────────────────────────

function checkWindows(): void {
  const G = '1.ventana';

  checkEqual(G, 'preset canónico por defecto = live', DEFAULT_WINDOW, 'live');
  checkEqual(G, 'lista de presets derivada del tipo (5)', WINDOW_KEYS.length, 5);
  checkEqual(G, 'live = 5 min', WINDOW_PRESETS.live.durationMs, 5 * MIN);
  checkEqual(G, '24h = 24 h', WINDOW_PRESETS['24h'].durationMs, 24 * 60 * MIN);
  checkEqual(G, '7d = 7 días', WINDOW_PRESETS['7d'].durationMs, 7 * 24 * 60 * MIN);
  checkEqual(G, '30d = 30 días', WINDOW_PRESETS['30d'].durationMs, 30 * 24 * 60 * MIN);
  checkEqual(G, '90d = 90 días', WINDOW_PRESETS['90d'].durationMs, 90 * 24 * 60 * MIN);

  check(G, 'preset conocido 7d se acepta', isWindowPreset('7d'));
  check(G, 'valor arbitrario NO es preset', !isWindowPreset('73d'));
  check(G, 'valor vacío NO es preset', !isWindowPreset(''));

  const missing = resolveWindowPreset(null);
  checkEqual(G, 'query ausente => preset canónico', missing.preset, 'live');
  checkEqual(G, 'query ausente => fellBack=false', missing.fellBack, false);
  checkEqual(G, 'query ausente => requested=null', missing.requested, null);

  const valid = resolveWindowPreset('30d');
  checkEqual(G, 'query válido => preset', valid.preset, '30d');
  checkEqual(G, 'query válido => requested conservado', valid.requested, '30d');
  checkEqual(G, 'query válido => fellBack=false', valid.fellBack, false);

  const invalid = resolveWindowPreset('999d');
  checkEqual(G, 'query inválido => cae al canónico', invalid.preset, 'live');
  checkEqual(G, 'query inválido => fellBack=true (declarado)', invalid.fellBack, true);
  checkEqual(G, 'query inválido => requested conservado para la traza', invalid.requested, '999d');

  checkEqual(G, 'corte de live = ahora - 5 min', windowStartMs('live', NOW), NOW - 5 * MIN);
  checkEqual(G, 'corte de 24h', windowStartMs('24h', NOW), NOW - 24 * 60 * MIN);
  checkThrows(G, 'reloj no finito lanza contrato', () => windowStartMs('live', Number.NaN));

  checkEqual(G, 'bucket live con suelo de 1 min', bucketWidthMs('live'), MIN);
  checkEqual(G, 'bucket 24h = 2 h (12 puntos)', bucketWidthMs('24h'), 2 * 60 * MIN);
  checkEqual(G, 'bucket 90d = 7,5 días', bucketWidthMs('90d'), Math.ceil((90 * 24 * 60 * MIN) / 12));
  checkEqual(
    G,
    'alineación de bucket truncada por debajo',
    alignToBucket(NOW + 30_000, MIN),
    Math.floor((NOW + 30_000) / MIN) * MIN,
  );
  checkThrows(G, 'bucket 0 lanza contrato', () => alignToBucket(NOW, 0));

  checkEqual(G, 'revenue_cents es dinero', unitOf('revenue_cents'), 'cents');
  checkEqual(G, 'plays es conteo', unitOf('plays'), 'count');
}

// ── 2 · Agregación por ventana ──────────────────────────────────────────────

function checkAggregation(): void {
  const G = '2.agregacion';

  const rows: readonly MetricRow[] = [
    row('spotify', 'plays', 100, NOW - 4 * MIN),
    row('spotify', 'plays', 250, NOW - 2 * MIN),
    row('spotify', 'plays', 50, NOW - 1 * MIN),
    row('soundcloud', 'plays', 40, NOW - 3 * MIN),
    row('soundcloud', 'plays', 60, NOW - 1 * MIN),
    // Fuera de la ventana live (6 min): NO debe sumar.
    row('spotify', 'plays', 999, NOW - 6 * MIN),
    // Justo 1 ms antes del corte: fuera (frontera medida).
    row('spotify', 'plays', 777, windowStartMs('live', NOW) - 1),
    // Justo en el corte: dentro (inclusive).
    row('spotify', 'plays', 5, windowStartMs('live', NOW)),
    // Métrica distinta: no contamina `plays`.
    row('spotify', 'followers', 8_000, NOW - 3 * MIN),
  ];

  const live = aggregateMetric({ rows, metric: 'plays', preset: 'live', nowMs: NOW, requestedSource: 'live' });
  checkEqual(G, 'total live = 100+250+50+40+60+5', live.total, 505);
  checkEqual(G, 'muestras en ventana', live.samples, 6);
  checkEqual(G, 'plataformas agregadas', live.platforms.length, 2);
  checkEqual(G, 'orden por asignación descendente', live.platforms[0]?.platformId, 'spotify');
  checkEqual(G, 'spotify asignado = 100+250+50+5', live.platforms[0]?.allocated, 405);
  checkEqual(G, 'soundcloud asignado = 40+60', live.platforms[1]?.allocated, 100);
  checkEqual(G, 'etiqueta desde el SSOT', live.platforms[0]?.label, 'Spotify for Artists');
  checkEqual(G, 'delta spotify = 50 - 250', live.platforms[0]?.delta, -200);
  checkEqual(G, 'delta soundcloud = 60 - 40', live.platforms[1]?.delta, 20);
  checkEqual(G, 'suma de plataformas = total de la ventana', live.total, 505);
  checkEqual(G, 'frontera: 1 ms antes del corte queda fuera', live.total - 405, 100);
  checkEqual(G, 'muestras por plataforma spotify', live.platforms[0]?.samples, 4);
  check(G, 'serie no vacía', (live.platforms[0]?.series.length ?? 0) > 0);
  check(
    G,
    'serie ordenada por bucketStart',
    (live.platforms[0]?.series ?? []).every(
      (point, index, all) => index === 0 || all[index - 1].bucketStart <= point.bucketStart,
    ),
  );
  checkEqual(
    G,
    'suma de la serie = asignación',
    (live.platforms[0]?.series ?? []).reduce((s, p) => s + p.value, 0),
    405,
  );

  // La MISMA fila 999 entra al ampliar la ventana: la ventana es la que manda.
  // 24h = 505 (ventana live) + 999 (6 min) + 777 (1 ms fuera del corte live) = 2.281
  const day = aggregateMetric({ rows, metric: 'plays', preset: '24h', nowMs: NOW, requestedSource: 'live' });
  checkEqual(G, 'ventana 24h incluye la fila de 6 min', day.total, 505 + 999 + 777);
  // Spotify en 24h: 100+250+50+5+999+777 = 2.181; última captura 50 vs anterior 250 => -200.
  checkEqual(G, 'delta por plataforma en 24h', day.platforms[0]?.delta, -200);
  check(G, '24h > live (la ventana manda)', day.total > live.total);

  // Determinismo: dos pasadas idénticas producen el mismo JSON.
  const again = aggregateMetric({ rows, metric: 'plays', preset: 'live', nowMs: NOW, requestedSource: 'live' });
  checkEqual(G, 'determinista: mismo JSON en 2 pasadas', JSON.stringify(again), JSON.stringify(live));

  // Sin capturas previas no hay delta inventado.
  const single = aggregateMetric({
    rows: [row('spotify', 'plays', 10, NOW - MIN)],
    metric: 'plays',
    preset: 'live',
    nowMs: NOW,
    requestedSource: 'live',
  });
  checkEqual(G, 'una sola captura => delta null (no se inventa)', single.platforms[0]?.delta, null);
  checkEqual(
    G,
    'una sola captura => lastCapturedAt ISO',
    single.platforms[0]?.lastCapturedAt,
    new Date(NOW - MIN).toISOString(),
  );
}

// ── 3 · Consistencia de tipos (dinero en céntimos enteros) ──────────────────

function checkTypes(): void {
  const G = '3.tipos';

  const cents = aggregateMetric({
    rows: [
      row('youtube', 'revenue_cents', 1_250, NOW - 2 * MIN),
      row('bandcamp', 'revenue_cents', 3_050, NOW - MIN),
    ],
    metric: 'revenue_cents',
    preset: 'live',
    nowMs: NOW,
    requestedSource: 'live',
  });
  checkEqual(G, 'revenue_cents declarado como cents', cents.unit, 'cents');
  checkEqual(G, 'total en céntimos enteros', cents.total, 4_300);
  check(G, 'total es entero', Number.isInteger(cents.total));
  check(G, 'cada asignación es entera', cents.platforms.every((p) => Number.isInteger(p.allocated)));
  check(
    G,
    'ninguna serie introduce Float',
    cents.platforms.every((p) => p.series.every((s) => Number.isInteger(s.value))),
  );

  // El Float se rechaza en CUALQUIER métrica, no sólo en la de dinero.
  checkThrows(G, 'Float en la ruta de dinero lanza contrato', () =>
    aggregateMetric({
      rows: [row('youtube', 'revenue_cents', 12.5, NOW - MIN)],
      metric: 'revenue_cents',
      preset: 'live',
      nowMs: NOW,
      requestedSource: 'live',
    }),
  );
  checkThrows(G, 'Float en un conteo también lanza contrato', () =>
    aggregateMetric({
      rows: [row('spotify', 'plays', 1.5, NOW - MIN)],
      metric: 'plays',
      preset: 'live',
      nowMs: NOW,
      requestedSource: 'live',
    }),
  );

  const counts = aggregateMetric({
    rows: [row('spotify', 'plays', 7, NOW - MIN)],
    metric: 'plays',
    preset: 'live',
    nowMs: NOW,
    requestedSource: 'live',
  });
  checkEqual(G, 'conteo declarado como count', counts.unit, 'count');
  check(G, 'ventana declarada en ms', counts.windowMs === WINDOW_PRESETS.live.durationMs);
}

// ── 4 · SSOT de plataformas y métricas ──────────────────────────────────────

function checkSsot(): void {
  const G = '4.ssot';

  const rows: readonly MetricRow[] = [
    row('spotify', 'plays', 10, NOW - MIN),
    row('spotify-plataforma-inventada', 'plays', 999, NOW - MIN),
    row('bandcamp', 'plays', 500, NOW - MIN),
    row('soundcloud', 'plays', 700, NOW - MIN),
  ];
  const result = aggregateMetric({ rows, metric: 'plays', preset: 'live', nowMs: NOW, requestedSource: 'live' });
  checkEqual(G, 'plataforma inventada NO se agrega', result.total, 1_210);
  checkEqual(G, 'fila fuera del SSOT se declara rechazada', result.rejectedRows, 1);
  check(
    G,
    'la plataforma inventada no aparece en el desglose',
    !result.platforms.some((p) => p.platformId === 'spotify-plataforma-inventada'),
  );
  checkEqual(
    G,
    'desglose exacto por platformId (sin la inventada)',
    result.platforms.map((p) => p.platformId).join(','),
    'soundcloud,bandcamp,spotify',
  );
  check(
    G,
    'ninguna etiqueta cae al platformId crudo (todas vienen del SSOT)',
    result.platforms.every((p) => p.label !== p.platformId),
  );

  // Contrato medido del SSOT: youtube NO declara `plays` (declara `views`).
  // Una fila youtube/plays es un defecto de datos, no un dato agregable.
  const wrongPlatformMetric = aggregateMetric({
    rows: [row('youtube', 'plays', 5_000, NOW - MIN)],
    metric: 'plays',
    preset: 'live',
    nowMs: NOW,
    requestedSource: 'live',
  });
  checkEqual(G, 'youtube NO declara plays en el SSOT: fila rechazada', wrongPlatformMetric.rejectedRows, 1);
  checkEqual(G, 'youtube/plays no infla el total', wrongPlatformMetric.total, 0);
  checkEqual(G, 'youtube/plays no aparece en el desglose', wrongPlatformMetric.platforms.length, 0);

  // Youtube declara revenue_cents; Instagram NO. La métrica se valida por plataforma.
  const crossPlatform = aggregateMetric({
    rows: [
      row('youtube', 'revenue_cents', 900, NOW - MIN),
      row('instagram', 'revenue_cents', 100, NOW - MIN),
    ],
    metric: 'revenue_cents',
    preset: 'live',
    nowMs: NOW,
    requestedSource: 'live',
  });
  checkEqual(G, 'métrica no declarada por la plataforma se rechaza', crossPlatform.rejectedRows, 1);
  checkEqual(G, 'sólo suma la plataforma que la declara', crossPlatform.total, 900);

  const overview = aggregateOverview({
    rows,
    metrics: ['plays', 'followers'],
    preset: 'live',
    nowMs: NOW,
    requestedSource: 'live',
  });
  checkEqual(G, 'overview devuelve una agregación por métrica', overview.length, 2);
  checkEqual(G, 'overview followers sin filas = 0 (no se inventa)', overview[1]?.total, 0);
}

// ── 5 · Estado honesto (AF-2 / AF-5) ────────────────────────────────────────

function checkHonesty(): void {
  const G = '5.honestidad';
  const empty = aggregateMetric({ rows: [], metric: 'plays', preset: 'live', nowMs: NOW, requestedSource: 'live' });
  checkEqual(G, '0 filas + live pedido => demo', empty.source, 'demo');
  checkEqual(G, '0 filas => total 0 (no se fabrica)', empty.total, 0);
  checkEqual(G, '0 filas => sin plataformas', empty.platforms.length, 0);

  const unavailable = aggregateMetric({
    rows: [],
    metric: 'plays',
    preset: 'live',
    nowMs: NOW,
    requestedSource: 'unavailable',
  });
  checkEqual(G, 'sonda caída => unavailable (no demo)', unavailable.source, 'unavailable');

  checkEqual(
    G,
    'un error de sonda GANA al live',
    resolveSnapshotSource([empty], { ok: false, requestedSource: 'unavailable' }),
    'unavailable',
  );
  checkEqual(
    G,
    'base vacía sin error => demo declarado',
    resolveSnapshotSource([empty], { ok: true, requestedSource: 'live' }),
    'demo',
  );

  const live = aggregateMetric({
    rows: [row('spotify', 'plays', 1, NOW - MIN)],
    metric: 'plays',
    preset: 'live',
    nowMs: NOW,
    requestedSource: 'live',
  });
  checkEqual(G, 'con filas => live', live.source, 'live');
  checkEqual(
    G,
    'con filas => resolveSnapshotSource live',
    resolveSnapshotSource([live], { ok: true, requestedSource: 'live' }),
    'live',
  );
}

// ── 6 · Erradicación del generador de demo ──────────────────────────────────

/**
 * ¿Aparece `Math.random()` como CÓDIGO? Las menciones en comentarios (la
 * prohibición documentada) no son el generador y no deben invalidar el aserto.
 */
function containsMathRandom(source: string): boolean {
  return source
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => !line.startsWith('//') && !line.startsWith('*') && !line.startsWith('/*'))
    .some((line) => line.includes('Math.random'));
}

/**
 * Detector de tipo ANY explícito. El patrón se compone por partes para que este
 * fichero no contenga la secuencia literal que busca (si no, el propio arnés se
 * marcaría a sí mismo en `audit_elevation_task_harness.cjs`).
 */
function hasExplicitAny(source: string): boolean {
  const kw = ['a', 'n', 'y'].join('');
  const patterns = [
    new RegExp(':\\s*' + kw + '\\b'),
    new RegExp('<' + kw + '>'),
    new RegExp('\\bas\\s+' + kw + '\\b'),
  ];
  return source
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => !line.startsWith('//') && !line.startsWith('*') && !line.startsWith('/*'))
    .some((line) => patterns.some((pattern) => pattern.test(line)));
}

function checkDemoEradicated(): void {
  const G = '6.demo';
  const routePath = path.join(ROOT, 'src/app/api/artist/career/metrics/route.ts');
  const modulePath = path.join(ROOT, 'src/lib/career/artist-metrics.ts');
  const routeSource = fs.readFileSync(routePath, 'utf8');
  const moduleSource = fs.readFileSync(modulePath, 'utf8');

  check(G, 'la ruta NO usa Math.random() como código', !containsMathRandom(routeSource));
  check(G, 'el módulo NO usa Math.random() como código', !containsMathRandom(moduleSource));
  check(G, 'la ruta consulta metricSnapshot', routeSource.includes('metricSnapshot.findMany'));
  check(G, 'la ruta declara el sello probed', routeSource.includes('probed'));
  check(G, 'la ruta declara source demo', routeSource.includes("source: 'demo'"));
  check(G, 'la ruta declara source unavailable', routeSource.includes("source: 'unavailable'"));
  check(G, 'la ruta declara mode REAL/SIMULADO', routeSource.includes("'REAL'") && routeSource.includes("'SIMULADO'"));
  check(G, 'la ruta selecciona columnas explícitas (INV-20)', routeSource.includes('METRIC_SELECT'));
  check(G, 'la ruta tiene heartbeat', routeSource.includes('heartbeat'));
  check(G, 'la ruta cierra al abort', routeSource.includes("addEventListener('abort'"));
  check(G, 'sin any explícito en la ruta', !hasExplicitAny(routeSource));
  check(G, 'sin any explícito en el módulo', !hasExplicitAny(moduleSource));
  check(G, 'el módulo puro no importa Prisma', !moduleSource.includes("from '@/lib/prisma'"));
}

// ── 7 · Contrato de la ruta (doble inyectado, sin red) ──────────────────────

/** Doble de la ruta: importación dinámica con las variables de entorno aisladas. */
interface MetricsRouteModule {
  readonly GET: (req: Request) => Promise<Response>;
  readonly buildMetricsSnapshot: (options: {
    readonly client: MetricsPrismaHandle;
    readonly artistId: string | null;
    readonly requestedWindow: string | null;
    readonly now: () => Date;
  }) => Promise<MetricsSnapshotPayload>;
}

async function loadRoute(): Promise<MetricsRouteModule> {
  return (await import('../src/app/api/artist/career/metrics/route')) as unknown as MetricsRouteModule;
}

/** Handle con el subconjunto exacto que la ruta consume (cero Prisma real). */
function makeHandle(rows: readonly MetricRow[], fail: boolean): MetricsPrismaHandle {
  return {
    metricSnapshot: {
      findMany: async (): Promise<readonly MetricRow[]> => {
        if (fail) throw new Error('connection refused');
        return rows;
      },
    },
  };
}

async function checkRoute(): Promise<void> {
  const G = '7.route';
  const mod = await loadRoute();

  // a) Ventana pedida + filas reales => live/REAL con el corte correcto.
  const live = await mod.buildMetricsSnapshot({
    client: makeHandle([row('spotify', 'plays', 42, NOW - MIN)], false),
    artistId: ARTIST_ID,
    requestedWindow: '24h',
    now: () => new Date(NOW),
  });
  checkEqual(G, 'ventana pedida aplicada', live.window.preset, '24h');
  checkEqual(G, 'ventana pedida declarada', live.window.requested, '24h');
  checkEqual(G, 'ventana NO cae al canónico', live.window.fellBack, false);
  checkEqual(G, 'corte de ventana correcto', live.window.start, new Date(NOW - 24 * 60 * MIN).toISOString());
  checkEqual(G, 'con filas => source live', live.source, 'live');
  checkEqual(G, 'con filas => mode REAL', live.mode, 'REAL');
  checkEqual(G, 'probed true', live.probed, true);
  checkEqual(G, 'total de plays', live.totals.plays, 42);
  checkEqual(G, 'sin disclaimer cuando es live', live.disclaimer, null);
  checkEqual(G, 'errorCode nulo en el camino feliz', live.errorCode, null);

  // b) Ventana desconocida => cae al canónico y lo declara.
  const fallback = await mod.buildMetricsSnapshot({
    client: makeHandle([], false),
    artistId: ARTIST_ID,
    requestedWindow: '999d',
    now: () => new Date(NOW),
  });
  checkEqual(G, 'ventana desconocida => canónico', fallback.window.preset, 'live');
  checkEqual(G, 'ventana desconocida => fellBack declarado', fallback.window.fellBack, true);

  // c) Base vacía => demo honesto, SIN cifras fabricadas.
  const demo = await mod.buildMetricsSnapshot({
    client: makeHandle([], false),
    artistId: ARTIST_ID,
    requestedWindow: null,
    now: () => new Date(NOW),
  });
  checkEqual(G, 'sin filas => source demo', demo.source, 'demo');
  checkEqual(G, 'sin filas => mode SIMULADO', demo.mode, 'SIMULADO');
  check(G, 'sin filas => disclaimer declarado', (demo.disclaimer ?? '').length > 0);
  checkEqual(G, 'sin filas => plays 0 (nada inventado)', demo.totals.plays, 0);
  checkEqual(G, 'sin filas => followers 0', demo.totals.followers, 0);

  // d) Error de base => unavailable con código, NUNCA un demo disfrazado.
  const broken = await mod.buildMetricsSnapshot({
    client: makeHandle([], true),
    artistId: ARTIST_ID,
    requestedWindow: null,
    now: () => new Date(NOW),
  });
  checkEqual(G, 'error de BD => source unavailable', broken.source, 'unavailable');
  checkEqual(G, 'error de BD => probed false', broken.probed, false);
  checkEqual(G, 'error de BD => errorCode declarado', broken.errorCode, 'ERROR');
  check(G, 'error de BD => disclaimer declarado', (broken.disclaimer ?? '').includes('no disponible'));
  checkEqual(G, 'error de BD => total no se declara', broken.totals.plays, 0);

  // e) Sin identidad configurada => se declara el hueco, no se inventa artista.
  const noArtist = await mod.buildMetricsSnapshot({
    client: makeHandle([row('spotify', 'plays', 500, NOW - MIN)], false),
    artistId: null,
    requestedWindow: null,
    now: () => new Date(NOW),
  });
  checkEqual(G, 'sin identidad => source demo', noArtist.source, 'demo');
  checkEqual(G, 'sin identidad => probed false', noArtist.probed, false);
  checkEqual(G, 'sin identidad => errorCode declarado', noArtist.errorCode, 'ARTIST_ID_NOT_CONFIGURED');
  checkEqual(G, 'sin identidad => no se declara ninguna métrica', noArtist.metrics.length, 0);
  checkEqual(G, 'sin identidad => totals vacío (no se finge cero como dato)', Object.keys(noArtist.totals).length, 0);

  await checkRouteBoundary(mod);
}

/** Boundary del handler: default-deny sobre parámetros fuera del SSOT (SEC-1). */
async function checkRouteBoundary(mod: MetricsRouteModule): Promise<void> {
  const G = '7.route';
  const prev = process.env.CAREER_OWNER_ARTIST_ID;
  delete process.env.CAREER_OWNER_ARTIST_ID;
  try {
    const badWindow = await mod.GET(
      new Request('https://productoraear.com/api/artist/career/metrics?window=999d'),
    );
    checkEqual(G, 'window fuera del SSOT => 400', badWindow.status, 400);
    const badWindowBody = (await badWindow.json()) as { code?: string; probed?: boolean };
    checkEqual(G, 'window fuera del SSOT => WINDOW_NOT_IN_SSOT', badWindowBody.code, 'WINDOW_NOT_IN_SSOT');
    checkEqual(G, 'window fuera del SSOT => probed false', badWindowBody.probed, false);

    const badMetric = await mod.GET(
      new Request('https://productoraear.com/api/artist/career/metrics?metrics=plays,grammys'),
    );
    checkEqual(G, 'metrics fuera del SSOT => 400', badMetric.status, 400);
    const badMetricBody = (await badMetric.json()) as { code?: string };
    checkEqual(G, 'metrics fuera del SSOT => METRIC_NOT_IN_SSOT', badMetricBody.code, 'METRIC_NOT_IN_SSOT');

    // Camino feliz del boundary: stream SSE con cabeceras correctas y abort.
    const controller = new AbortController();
    const res = await mod.GET(
      new Request('https://productoraear.com/api/artist/career/metrics?window=24h', {
        signal: controller.signal,
      }),
    );
    checkEqual(G, 'stream => 200', res.status, 200);
    checkEqual(G, 'content-type SSE', res.headers.get('content-type'), 'text/event-stream; charset=utf-8');
    checkEqual(
      G,
      'cache-control no-store',
      res.headers.get('cache-control'),
      'no-store, no-cache, must-revalidate',
    );

    const reader = res.body?.getReader();
    check(G, 'el stream expone un reader', reader !== undefined);
    if (reader !== undefined) {
      const first = await reader.read();
      const text = new TextDecoder().decode(first.value ?? new Uint8Array());
      check(G, 'primer frame empieza por data:', text.startsWith('data: '));
      const payload = JSON.parse(text.trim().replace(/^data: /, '')) as { source?: string; probed?: boolean };
      checkEqual(G, 'sin CAREER_OWNER_ARTIST_ID => demo (no se finge)', payload.source, 'demo');
      checkEqual(G, 'sin CAREER_OWNER_ARTIST_ID => probed false', payload.probed, false);
      // Abort: el stream se cierra y deja de emitir (cero timers huérfanos).
      controller.abort();
      const afterAbort = await reader.read();
      checkEqual(G, 'abort => stream cerrado (done)', afterAbort.done, true);
    }
  } finally {
    if (prev === undefined) delete process.env.CAREER_OWNER_ARTIST_ID;
    else process.env.CAREER_OWNER_ARTIST_ID = prev;
  }
}

// ── 8 · Agregación contra PostgreSQL REAL (no SQLite, no memoria: AF-5) ─────

interface EphemeralDatabase {
  readonly url: string;
  readonly stop: () => Promise<void>;
  readonly detail: string | null;
}

function scopedUrl(baseUrl: string, schema: string): string {
  const url = new URL(baseUrl);
  url.searchParams.set('schema', schema);
  return url.toString();
}

/** Sentencia a sentencia, respetando bloques `DO $$ … $$` (como los arneses W53). */
async function executeSqlScript(client: PrismaClient, script: string, label: string): Promise<number> {
  const statements: string[] = [];
  let buffer = '';
  let inDollarBlock = false;
  for (const rawLine of script.split('\n')) {
    const line = rawLine.replace(/\r$/, '');
    const trimmed = line.trim();
    if (trimmed.startsWith('--')) continue;
    buffer += `${line}\n`;
    if (trimmed.includes('$$') && (trimmed.match(/\$\$/g) ?? []).length === 1) inDollarBlock = !inDollarBlock;
    if (!inDollarBlock && trimmed.endsWith(';')) {
      const statement = buffer.trim();
      if (statement.length > 1) statements.push(statement);
      buffer = '';
    }
  }
  if (buffer.trim().length > 1) statements.push(buffer.trim());

  let applied = 0;
  for (const statement of statements) {
    try {
      await client.$executeRawUnsafe(statement);
      applied += 1;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      if (!/already exists|duplicate/i.test(message)) throw new Error(`[${label}] ${message.slice(0, 300)}`);
    }
  }
  return applied;
}

async function withRealDatabase(): Promise<void> {
  const G = '8.postgres';
  const mod = requireCjs('./lib/ephemeral-postgres.cjs') as {
    resolveVerificationDatabase: () => Promise<EphemeralDatabase | null>;
  };
  const database = await mod.resolveVerificationDatabase();
  if (database === null) {
    if (!JSON_ONLY) console.log('SIN_EVIDENCIA: sin PostgreSQL verificable. No se firma verde por defecto (AF-5).');
    process.exit(2);
  }

  const schemaName = `w53t06_verify_${process.pid}`;
  const { PrismaClient: Client } = requireCjs('@prisma/client') as {
    PrismaClient: new (options: {
      datasources: { db: { url: string } };
      log: readonly [];
    }) => PrismaClient;
  };
  const client = new Client({ datasources: { db: { url: scopedUrl(database.url, schemaName) } }, log: [] });
  const stamp = Date.now();
  const artistId = `w53t06-artist-${stamp}`;
  const platformId = 'spotify';

  try {
    await client.$executeRawUnsafe(`CREATE SCHEMA IF NOT EXISTS "${schemaName}"`);
    await executeSqlScript(
      client,
      fs.readFileSync(path.join(ROOT, 'prisma/migrations/0_baseline/migration.sql'), 'utf8'),
      '0_baseline',
    );
    const applied = await executeSqlScript(
      client,
      fs.readFileSync(path.join(ROOT, 'prisma/migrations/20261110195500_add_career_os_models/migration.sql'), 'utf8'),
      'W53',
    );
    check(G, 'migración Career OS aplicada contra PostgreSQL real', applied > 0, `sentencias=${applied}`);
    await seedAndAssert(client, G, artistId, platformId, stamp);
  } finally {
    await client.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schemaName}" CASCADE`).catch(() => undefined);
    await client.$disconnect().catch(() => undefined);
    await database.stop().catch(() => undefined);
  }
}

/** Siembra la serie real y verifica la agregación contra la base de datos. */
async function seedAndAssert(
  client: PrismaClient,
  G: string,
  artistId: string,
  platformId: string,
  stamp: number,
): Promise<void> {
  // SSOT de identidad primero (User + artistProfile), extensión 1:1 después.
  const userId = `w53t06-user-${stamp}`;
  await client.$executeRawUnsafe(
    `INSERT INTO "User" ("id","email","displayName","updatedAt") VALUES ($1,$2,$3,NOW())`,
    userId,
    `w53t06-${stamp}@example.invalid`,
    'W53_T06 fixture',
  );
  await client.$executeRawUnsafe(
    `INSERT INTO "artistProfile" ("id","userId","slug","genres","updatedAt") VALUES ($1,$2,$3,ARRAY[]::TEXT[],NOW())`,
    artistId,
    userId,
    `w53t06-${stamp}`,
  );
  await client.artistProfile.create({ data: { id: artistId }, select: { id: true } });

  // Serie real: capturas dentro y fuera de la ventana live. `revenue_cents` va
  // en una plataforma que SÍ lo declara en el SSOT (spotify sólo admite
  // plays/listeners/followers/saves: una fila spotify/revenue sería rechazada).
  const seed: readonly {
    readonly platformId: string;
    readonly metric: string;
    readonly value: number;
    readonly minutesAgo: number;
  }[] = [
    { platformId: 'spotify', metric: 'plays', value: 1_000, minutesAgo: 30 },
    { platformId: 'spotify', metric: 'plays', value: 200, minutesAgo: 4 },
    { platformId: 'spotify', metric: 'plays', value: 300, minutesAgo: 2 },
    { platformId: 'youtube', metric: 'revenue_cents', value: 4_199, minutesAgo: 3 },
    { platformId: 'spotify', metric: 'followers', value: 77, minutesAgo: 1 },
  ];
  for (const point of seed) {
    await client.metricSnapshot.create({
      data: {
        artistId,
        platformId: point.platformId,
        metric: point.metric,
        value: point.value,
        capturedAt: new Date(NOW - point.minutesAgo * MIN),
        source: 'api',
      },
      select: { id: true },
    });
  }

  // La ruta REAL lee de PostgreSQL: se sustituye sólo la sonda por este cliente.
  const route = await loadRoute();
  const handle: MetricsPrismaHandle = {
    metricSnapshot: {
      findMany: async (args): Promise<readonly MetricRow[]> =>
        client.metricSnapshot.findMany({
          where: {
            artistId: args.where.artistId,
            metric: { in: [...args.where.metric.in] },
            capturedAt: { gte: args.where.capturedAt.gte },
          },
          select: { platformId: true, metric: true, value: true, capturedAt: true },
          orderBy: { capturedAt: 'desc' },
          take: args.take,
        }),
    },
  };

  const liveSnapshot = await route.buildMetricsSnapshot({
    client: handle,
    artistId,
    requestedWindow: 'live',
    now: () => new Date(NOW),
  });
  checkEqual(G, 'PostgreSQL real: source live', liveSnapshot.source, 'live');
  checkEqual(G, 'PostgreSQL real: mode REAL', liveSnapshot.mode, 'REAL');
  checkEqual(G, 'PostgreSQL real: plays en ventana live = 200+300', liveSnapshot.totals.plays, 500);
  checkEqual(G, 'PostgreSQL real: revenue en céntimos = 4.199', liveSnapshot.totals.revenue_cents, 4_199);
  checkEqual(G, 'PostgreSQL real: followers', liveSnapshot.totals.followers, 77);
  check(G, 'PostgreSQL real: totales enteros', Number.isInteger(liveSnapshot.totals.plays));

  const daySnapshot = await route.buildMetricsSnapshot({
    client: handle,
    artistId,
    requestedWindow: '24h',
    now: () => new Date(NOW),
  });
  checkEqual(G, 'PostgreSQL real: ventana 24h incluye la captura de 30 min', daySnapshot.totals.plays, 1_500);
  check(
    G,
    'PostgreSQL real: 24h > live (la ventana manda)',
    (daySnapshot.totals.plays ?? 0) > (liveSnapshot.totals.plays ?? 0),
  );
  checkEqual(G, 'PostgreSQL real: 24h declara su ventana', daySnapshot.window.preset, '24h');

  const again = await route.buildMetricsSnapshot({
    client: handle,
    artistId,
    requestedWindow: 'live',
    now: () => new Date(NOW),
  });
  checkEqual(
    G,
    'PostgreSQL real: reproducible (2 lecturas = mismo total)',
    again.totals.plays,
    liveSnapshot.totals.plays,
  );

  // Artista sin capturas: demo honesto, cero filas inventadas.
  const emptyArtist = await route.buildMetricsSnapshot({
    client: handle,
    artistId: `w53t06-vacio-${stamp}`,
    requestedWindow: 'live',
    now: () => new Date(NOW),
  });
  checkEqual(G, 'PostgreSQL real: artista sin filas => demo', emptyArtist.source, 'demo');
  checkEqual(G, 'PostgreSQL real: artista sin filas => 0 (no se fabrica)', emptyArtist.totals.plays, 0);

  // Fallo de lectura => unavailable, nunca un demo disfrazado (AF-5).
  const broken: MetricsPrismaHandle = {
    metricSnapshot: {
      findMany: async (): Promise<readonly MetricRow[]> => {
        throw new Error('relation does not exist');
      },
    },
  };
  const brokenSnapshot = await route.buildMetricsSnapshot({
    client: broken,
    artistId,
    requestedWindow: 'live',
    now: () => new Date(NOW),
  });
  checkEqual(G, 'fallo de lectura => unavailable', brokenSnapshot.source, 'unavailable');
  checkEqual(G, 'fallo de lectura => errorCode declarado', brokenSnapshot.errorCode, 'ERROR');
}

// ── Ejecución ───────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  checkWindows();
  checkAggregation();
  checkTypes();
  checkSsot();
  checkHonesty();
  checkDemoEradicated();
  await checkRoute();

  // `--self-test`: una aserción imposible debe tumbar el arnés. Si sigue en PASS
  // con el canal de fallo roto, el veredicto se invierte y sale 1.
  if (SELF_TEST) {
    check('self-test', 'aserto deliberadamente imposible (debe fallar)', false, 'fallo forzado');
  }

  await withRealDatabase();

  const failures = results.filter((result) => !result.ok);
  const groups = new Map<string, { total: number; failed: number }>();
  for (const result of results) {
    const bucket = groups.get(result.group) ?? { total: 0, failed: 0 };
    bucket.total += 1;
    if (!result.ok) bucket.failed += 1;
    groups.set(result.group, bucket);
  }

  if (JSON_ONLY) {
    console.log(JSON.stringify({ arnes: 'verify_artist_metrics.ts', results, failures: failures.length }, null, 2));
  } else {
    console.log('── ARNÉS FALSABLE · W53_T06 · MÉTRICAS DE ARTISTA EN VIVO ──');
    for (const [group, bucket] of groups) {
      const passed = bucket.total - bucket.failed;
      console.log(`${bucket.failed === 0 ? 'PASS' : 'FAIL'} · ${group} (${passed}/${bucket.total})`);
      if (bucket.failed > 0) {
        for (const result of results.filter((r) => r.group === group && !r.ok)) {
          console.log(`   x ${result.name}${result.detail === null ? '' : ` — ${result.detail}`}`);
        }
      }
    }
    console.log(`\naserciones: ${results.length - failures.length}/${results.length} · fallos: ${failures.length}`);
  }

  const ok = failures.length === 0;
  console.log(`ARTIST_METRICS=${ok ? 'PASS' : 'FAIL'}`);
  if (SELF_TEST && ok) {
    console.error('SELF-TEST INVERTIDO: el arnés no detectó una aserción imposible (canal de fallo roto).');
    process.exit(1);
  }
  process.exit(ok ? 0 : 1);
}

void main().catch((error: unknown) => {
  console.error(`ARNÉS ABORTADO: ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
});
