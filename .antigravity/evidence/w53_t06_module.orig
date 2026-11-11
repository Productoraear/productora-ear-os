/**
 * ════════════════════════════════════════════════════════════════════════════
 * CAREER OS · AGREGACIÓN DE MÉTRICAS DE ARTISTA POR VENTANAS (W53_T06)
 * ════════════════════════════════════════════════════════════════════════════
 * Módulo PURO (sin Prisma, sin red, sin reloj global): recibe filas ya leídas y
 * devuelve la agregación. La ruta SSE aporta las filas y el reloj; aquí no se
 * inventa ni un número.
 *
 * Reglas NO negociables:
 *   1. CERO ALEATORIEDAD: erradicado `Math.random()` como generador de métricas.
 *      0 filas produce `source: "demo"` ETIQUETADO, nunca datos fabricados.
 *   2. ESTADO HONESTO (AF-2 / AF-5): `live` exige filas leídas de PostgreSQL;
 *      `demo` = base consultada y vacía; `unavailable` = la sonda falló y viaja
 *      el código de error. No existe un verde por defecto.
 *   3. DINERO EN CÉNTIMOS ENTEROS: `revenue_cents` viaja como Int de céntimos.
 *      Prohibido Float; la agregación sólo suma enteros y lo verifica.
 *   4. SSOT DE PLATAFORMAS: `platformId` y `metric` se validan contra
 *      `src/lib/career/platform-registry.ts`. Una fila fuera del registro se
 *      declara en `rejectedRows` (no se descarta en silencio ni se inventa).
 *   5. VENTANAS: corte por `capturedAt` con comparación de instantes UTC. Los
 *      presets (live 5 min, 24h, 7d, 30d, 90d) son constantes; el desconocido
 *      cae al preset canónico del endpoint.
 *   6. CERO `any` y `strict: true`.
 * ════════════════════════════════════════════════════════════════════════════
 */

import { getPlatform, METRIC_KEYS, type MetricKey } from '@/lib/career/platform-registry';

// ── Ventanas temporales ─────────────────────────────────────────────────────

/** Presets canónicos de ventana. `durationMs` es la verdad; `label` es UI. */
export const WINDOW_PRESETS = {
  live: { durationMs: 5 * 60_000, label: 'Últimos 5 min' },
  '24h': { durationMs: 24 * 60 * 60_000, label: 'Últimas 24 h' },
  '7d': { durationMs: 7 * 24 * 60 * 60_000, label: 'Últimos 7 días' },
  '30d': { durationMs: 30 * 24 * 60 * 60_000, label: 'Últimos 30 días' },
  '90d': { durationMs: 90 * 24 * 60 * 60_000, label: 'Últimos 90 días' },
} as const;

export type WindowPreset = keyof typeof WINDOW_PRESETS;

/** Ventana aplicada por el endpoint si el cliente no pide otra. */
export const DEFAULT_WINDOW: WindowPreset = 'live';

/** Lista en ejecución derivada del tipo: añadir un preset sin la clave rompe la compilación. */
export const WINDOW_KEYS = ['live', '24h', '7d', '30d', '90d'] as const satisfies readonly WindowPreset[];

export function isWindowPreset(value: string): value is WindowPreset {
  return (WINDOW_KEYS as readonly string[]).includes(value);
}

/** Parámetro de query → preset. Un valor desconocido NO se inventa: cae al canónico. */
export function resolveWindowPreset(raw: string | null | undefined): {
  readonly preset: WindowPreset;
  readonly requested: string | null;
  readonly fellBack: boolean;
} {
  const requested = raw === null || raw === undefined || raw === '' ? null : raw;
  if (requested === null) return { preset: DEFAULT_WINDOW, requested: null, fellBack: false };
  if (isWindowPreset(requested)) return { preset: requested, requested, fellBack: false };
  return { preset: DEFAULT_WINDOW, requested, fellBack: true };
}

/** Instante de corte de la ventana. Función total: `nowMs` lo aporta el llamador. */
export function windowStartMs(preset: WindowPreset, nowMs: number): number {
  if (!Number.isFinite(nowMs)) {
    throw new CareerMetricsContractError(`nowMs inválido: ${String(nowMs)}`);
  }
  return nowMs - WINDOW_PRESETS[preset].durationMs;
}

// ── Contrato de entrada / salida ────────────────────────────────────────────

export type MetricsSource = 'live' | 'demo' | 'unavailable';

/** Fila mínima necesaria para agregar. Espejo del `select` quirúrgico de Prisma. */
export interface MetricRow {
  readonly platformId: string;
  readonly metric: string;
  /** Entero. Dinero SIEMPRE en céntimos. */
  readonly value: number;
  readonly capturedAt: Date;
}

/** Punto de serie para el gráfico de la ventana (buckets deterministas). */
export interface SeriesPoint {
  readonly bucketStart: string;
  readonly value: number;
}

export interface PlatformAggregate {
  readonly platformId: string;
  readonly label: string;
  /** Suma ENTERA de la métrica elegida en la ventana. */
  readonly allocated: number;
  /** Número de capturas que sostienen la cifra (0 filas = no se declara nada). */
  readonly samples: number;
  /** Última captura de la ventana (ISO-8601) o null si no hay filas. */
  readonly lastCapturedAt: string | null;
  /** Variación entre la última y la anterior captura. null con < 2 capturas. */
  readonly delta: number | null;
  /** Serie por bucket dentro de la ventana, ascendente. */
  readonly series: readonly SeriesPoint[];
}

export interface MetricAggregate {
  readonly metric: MetricKey;
  readonly unit: 'count' | 'cents';
  readonly windowMs: number;
  readonly windowStart: string;
  readonly windowEnd: string;
  readonly source: MetricsSource;
  /** Suma total de la métrica en la ventana (entero). */
  readonly total: number;
  readonly samples: number;
  readonly platforms: readonly PlatformAggregate[];
  /** Filas descartadas por contrato (plataforma o métrica fuera del SSOT). */
  readonly rejectedRows: number;
}

/** Error de contrato: se lanza ANTES de producir una cifra mentirosa. */
export class CareerMetricsContractError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CareerMetricsContractError';
  }
}

// ── Buckets deterministas ───────────────────────────────────────────────────

/**
 * Anchura de bucket para la ventana: objetivo ~12 puntos por serie, con suelo de
 * 1 minuto para que `live` no produzca 300 puntos. Siempre entero de ms.
 */
export function bucketWidthMs(preset: WindowPreset): number {
  const target = Math.ceil(WINDOW_PRESETS[preset].durationMs / 12);
  return Math.max(60_000, target);
}

/** Alinea un instante a su bucket (truncado por debajo). Determinista. */
export function alignToBucket(instantMs: number, bucketMs: number): number {
  if (!Number.isInteger(bucketMs) || bucketMs <= 0) {
    throw new CareerMetricsContractError(`bucketMs inválido: ${String(bucketMs)}`);
  }
  return Math.floor(instantMs / bucketMs) * bucketMs;
}

/** `revenue_cents` es dinero (céntimos). El resto son conteos. Sin `any`. */
export function unitOf(metric: MetricKey): 'count' | 'cents' {
  return metric === 'revenue_cents' ? 'cents' : 'count';
}

/** Clave de orden estable (locale-free) para que el arnés sea reproducible. */
function comparePlatforms(a: PlatformAggregate, b: PlatformAggregate): number {
  if (b.allocated !== a.allocated) return b.allocated - a.allocated;
  return a.platformId < b.platformId ? -1 : a.platformId > b.platformId ? 1 : 0;
}

/** Orden canónico de métricas: el orden de `METRIC_KEYS` del SSOT, no uno inventado. */
function metricOrder(metric: MetricKey): number {
  return METRIC_KEYS.indexOf(metric);
}

// ── Agregación ──────────────────────────────────────────────────────────────

export interface AggregateInput {
  readonly rows: readonly MetricRow[];
  readonly metric: MetricKey;
  readonly preset: WindowPreset;
  /** Reloj inyectado: la pureza no depende de `Date.now()` interno. */
  readonly nowMs: number;
  /** `source` propuesto por el llamador: `live` sólo se concede con filas. */
  readonly requestedSource: MetricsSource;
}

/**
 * Agrega las filas de la ventana. Total y determinista: mismas entradas,
 * mismas salidas, mismo orden.
 *
 * Falsabilidad medida por `scripts/verify_artist_metrics.ts`:
 *   · un corte de ventana mal calculado deja filas fuera => `total` cae.
 *   · aceptar filas fuera del SSOT => `rejectedRows` = 0 => cae.
 *   · devolver Float en dinero => falla la aserción de entero.
 *   · declarar `live` con 0 filas => cae la aserción de estado honesto.
 */
export function aggregateMetric(input: AggregateInput): MetricAggregate {
  const { metric, preset, nowMs, requestedSource } = input;
  const unit = unitOf(metric);
  const windowMs = WINDOW_PRESETS[preset].durationMs;
  const startMs = windowStartMs(preset, nowMs);
  const bucketMs = bucketWidthMs(preset);

  let rejectedRows = 0;
  let inWindow = 0;
  let total = 0;

  // Mapa plataforma → capturas de la métrica dentro de la ventana.
  const byPlatform = new Map<string, { at: number; value: number }[]>();

  for (const row of input.rows) {
    // 1 · Contrato SSOT: la plataforma y la métrica deben existir en el registro.
    //     Una fila fuera del SSOT es un defecto de datos: se declara en CADA
    //     métrica (no se descarta en silencio ni se atribuye a una plataforma).
    const def = getPlatform(row.platformId);
    const declaredMetric = row.metric as MetricKey;
    if (def === undefined || !METRIC_KEYS.includes(declaredMetric)) {
      rejectedRows += 1;
      continue;
    }
    // 2 · Enteros: la ruta de dinero JAMÁS acepta Float. Se comprueba antes del
    //     filtro de métrica para que un Float no pueda colarse por otra ventana.
    if (!Number.isInteger(row.value)) {
      throw new CareerMetricsContractError(
        `${row.platformId}/${row.metric} con valor no entero (${String(row.value)}): el SSOT trabaja en céntimos enteros.`,
      );
    }
    // 3 · Sólo la métrica pedida.
    if (row.metric !== metric) continue;
    // 4 · La plataforma DEBE declarar esa métrica en su conector (SSOT).
    if (!def.metrics.includes(declaredMetric)) {
      rejectedRows += 1;
      continue;
    }
    // 5 · Corte temporal de la ventana (start y end inclusive).
    const at = row.capturedAt.getTime();
    if (!Number.isFinite(at) || at < startMs || at > nowMs) continue;

    inWindow += 1;
    total += row.value;
    const bucket = byPlatform.get(row.platformId);
    if (bucket === undefined) byPlatform.set(row.platformId, [{ at, value: row.value }]);
    else bucket.push({ at, value: row.value });
  }

  const platforms: PlatformAggregate[] = [];
  for (const [platformId, captured] of byPlatform) {
    const sorted = captured.slice().sort((a, b) => a.at - b.at);
    const allocated = sorted.reduce((sum, sample) => sum + sample.value, 0);
    const last = sorted[sorted.length - 1];
    const previous = sorted[sorted.length - 2];
    const seriesMap = new Map<number, number>();
    for (const sample of sorted) {
      const key = alignToBucket(sample.at, bucketMs);
      seriesMap.set(key, (seriesMap.get(key) ?? 0) + sample.value);
    }
    const series: SeriesPoint[] = [...seriesMap.entries()]
      .sort((a, b) => a[0] - b[0])
      .map(([bucketStartMs, value]) => ({ bucketStart: new Date(bucketStartMs).toISOString(), value }));
    platforms.push({
      platformId,
      label: getPlatform(platformId)?.label ?? platformId,
      allocated,
      samples: sorted.length,
      lastCapturedAt: last === undefined ? null : new Date(last.at).toISOString(),
      delta: last === undefined || previous === undefined ? null : last.value - previous.value,
      series,
    });
  }
  platforms.sort(comparePlatforms);

  // 5 · Estado honesto: `live` es IMPOSIBLE sin filas leídas y en ventana.
  const source: MetricsSource =
    requestedSource !== 'live' ? requestedSource : inWindow > 0 ? 'live' : 'demo';

  if (unit === 'cents' && !Number.isInteger(total)) {
    throw new CareerMetricsContractError('aggregateMetric devolvió total no entero en la ruta de dinero.');
  }

  return {
    metric,
    unit,
    windowMs,
    windowStart: new Date(startMs).toISOString(),
    windowEnd: new Date(nowMs).toISOString(),
    source,
    total,
    samples: inWindow,
    platforms,
    rejectedRows,
  };
}

/**
 * Panorama completo para el SSE: una agregación por métrica solicitada. Las
 * métricas fuera del SSOT no se inventan: `assertMetric` las rechaza antes.
 */
export function assertMetric(metric: string): asserts metric is MetricKey {
  if (!METRIC_KEYS.includes(metric as MetricKey)) {
    throw new CareerMetricsContractError(`Métrica "${metric}" fuera del SSOT (METRIC_KEYS).`);
  }
}

export function aggregateOverview(input: {
  readonly rows: readonly MetricRow[];
  readonly metrics: readonly MetricKey[];
  readonly preset: WindowPreset;
  readonly nowMs: number;
  readonly requestedSource: MetricsSource;
}): readonly MetricAggregate[] {
  // Orden canónico del SSOT: el consumidor no depende del orden de llegada.
  const ordered = [...input.metrics].sort((a, b) => metricOrder(a) - metricOrder(b));
  return ordered.map((metric) =>
    aggregateMetric({
      rows: input.rows,
      metric,
      preset: input.preset,
      nowMs: input.nowMs,
      requestedSource: input.requestedSource,
    }),
  );
}

/**
 * Fuente global del snapshot: un error de sonda GANA siempre (`unavailable`, no
 * se maquilla como demo); con filas en ventana es `live`; base vacía sin error
 * es `demo` etiquetado. Nunca un verde por defecto.
 */
export function resolveSnapshotSource(
  aggregates: readonly MetricAggregate[],
  probe: { readonly ok: boolean; readonly requestedSource: MetricsSource },
): MetricsSource {
  if (!probe.ok) return 'unavailable';
  if (aggregates.some((aggregate) => aggregate.samples > 0)) return 'live';
  return 'demo';
}
