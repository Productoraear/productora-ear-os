import type { PrismaClient } from '@prisma/client';

import { prisma } from '@/lib/prisma';
import { METRIC_KEYS, type MetricKey } from '@/lib/career/platform-registry';
import {
  WINDOW_KEYS,
  WINDOW_PRESETS,
  aggregateOverview,
  bucketWidthMs,
  isWindowPreset,
  resolveSnapshotSource,
  resolveWindowPreset,
  type MetricAggregate,
  type MetricRow,
  type MetricsSource,
  type WindowPreset,
} from '@/lib/career/artist-metrics';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
/** Techo de vida del stream (segundos). El cliente reconecta con EventSource. */
export const maxDuration = 300;

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * SSE · MÉTRICAS DE ARTISTA EN VIVO (W53_T06)
 * ─────────────────────────────────────────────────────────────────────────────
 * Contrato:
 *   1. CERO ALEATORIEDAD: se erradicó `Math.random()`. Cada tick agrega las
 *      `MetricSnapshot` reales del artista en la ventana pedida. 0 filas NO
 *      fabrica números: se etiqueta `source: "demo"`.
 *   2. ESTADO HONESTO (AF-1 / AF-2 / AF-5): el payload viaja con
 *      `probed` / `source` / `mode` / `checkedAt`. Si la sonda de PostgreSQL
 *      falla, `source: "unavailable"` con `errorCode`: jamás un verde por
 *      defecto ni un demo disfrazado de error.
 *   3. SIN SESIÓN NO HAY DATOS: el artista se resuelve con
 *      `CAREER_OWNER_ARTIST_ID` (variable de servidor). Sin ella, `artistId`
 *      es `null`, `probed: false` y `source: "demo"`: se declara el hueco en
 *      lugar de inventar una identidad. Ningún secreto viaja al cliente.
 *   4. CADENCIA: agregación cada 5 s, heartbeat cada 15 s, cierre al abort.
 *   5. CONSULTA QUIRÚRGICA (INV-20): `select` explícito, ventana acotada por
 *      `capturedAt` y tope de filas por tick.
 *   6. CERO `any`. Sin emojis. Sin marcas de terceros fuera de las etiquetas
 *      del SSOT de plataformas.
 */

/** Cadencia de agregación (ms). */
const SNAPSHOT_INTERVAL_MS = 5_000;
/** Heartbeat SSE (ms): mantiene viva la conexión a través de proxies. */
const HEARTBEAT_INTERVAL_MS = 15_000;
/** Tope de filas por tick: el SSE no es un exportador de histórico. */
const ROW_LIMIT = 5_000;

/** Métricas que el panel muestra. Todas pertenecen al SSOT (`METRIC_KEYS`). */
const OVERVIEW_METRICS: readonly MetricKey[] = ['plays', 'listeners', 'followers', 'views', 'revenue_cents'];

/** Métricas admitidas por el query param, derivadas del SSOT global. */
const ALLOWED_METRICS: readonly MetricKey[] = METRIC_KEYS.filter((key) => OVERVIEW_METRICS.includes(key));

/** Columnas renderizadas, sin payload bloat (INV-20). */
const METRIC_SELECT = {
  platformId: true,
  metric: true,
  value: true,
  capturedAt: true,
} as const;

/**
 * Subconjunto de Prisma que el endpoint necesita. Un doble de prueba implementa
 * exactamente estos miembros: el arnés puede inyectarlo sin red ni base real.
 */
export interface MetricsPrismaHandle {
  readonly metricSnapshot: {
    findMany: (args: {
      readonly where: {
        readonly artistId: string;
        readonly metric: { readonly in: readonly string[] };
        readonly capturedAt: { readonly gte: Date };
      };
      readonly select: typeof METRIC_SELECT;
      readonly orderBy: { readonly capturedAt: 'desc' };
      readonly take: number;
    }) => Promise<readonly MetricRow[]>;
  };
}

/** Código de error acotado: nunca se filtra el mensaje de la BD al cliente. */
function errorCodeOf(error: unknown): string {
  if (error instanceof Error) {
    const name = error.name === '' ? 'Error' : error.name;
    return name.toUpperCase().replace(/[^A-Z0-9_]+/g, '_');
  }
  return 'UNKNOWN_ERROR';
}

/** Identidad del artista en servidor. Sin variable => null (no se inventa). */
export function resolveOwnerArtistId(): string | null {
  const raw = process.env.CAREER_OWNER_ARTIST_ID;
  if (raw === undefined) return null;
  const trimmed = raw.trim();
  return trimmed === '' ? null : trimmed;
}

/** Payload de un tick. Tipado y sin `any`. */
export interface MetricsSnapshotPayload {
  readonly probed: boolean;
  readonly source: MetricsSource;
  readonly mode: 'REAL' | 'SIMULADO';
  readonly checkedAt: string;
  readonly artistId: string | null;
  readonly window: {
    readonly preset: WindowPreset;
    readonly requested: string | null;
    readonly fellBack: boolean;
    readonly durationMs: number;
    readonly bucketMs: number;
    readonly start: string;
    readonly end: string;
  };
  readonly metrics: readonly MetricAggregate[];
  readonly totals: Readonly<Record<string, number>>;
  readonly rejectedRows: number;
  readonly errorCode: string | null;
  /** Declaración formal cuando no hay datos reales (AF-2). */
  readonly disclaimer: string | null;
}

const DEMO_DISCLAIMER =
  'Sin capturas en la ventana: no se generan cifras. Conecta una plataforma o importa un CSV para ver datos reales.';
const UNAVAILABLE_DISCLAIMER =
  'Base de datos no disponible: no se declara ningun total. Se reintenta automaticamente.';

/**
 * Un tick completo: lectura + agregación + sello. Todo lo externo entra por
 * parámetro, así que el arnés lo ejecuta sin abrir sockets ni depender del reloj.
 */
export async function buildMetricsSnapshot(options: {
  readonly client: MetricsPrismaHandle;
  readonly artistId: string | null;
  readonly requestedWindow: string | null;
  readonly now: () => Date;
}): Promise<MetricsSnapshotPayload> {
  const { client, artistId, requestedWindow, now } = options;
  const nowDate = now();
  const nowMs = nowDate.getTime();
  const resolved = resolveWindowPreset(requestedWindow);
  const preset = resolved.preset;
  const startMs = nowMs - WINDOW_PRESETS[preset].durationMs;
  const windowMeta = {
    preset,
    requested: resolved.requested,
    fellBack: resolved.fellBack,
    durationMs: WINDOW_PRESETS[preset].durationMs,
    bucketMs: bucketWidthMs(preset),
    start: new Date(startMs).toISOString(),
    end: nowDate.toISOString(),
  };

  // Sin identidad de artista no hay lectura: se declara, no se simula.
  if (artistId === null) {
    return {
      probed: false,
      source: 'demo',
      mode: 'SIMULADO',
      checkedAt: nowDate.toISOString(),
      artistId: null,
      window: windowMeta,
      metrics: [],
      totals: {},
      rejectedRows: 0,
      errorCode: 'ARTIST_ID_NOT_CONFIGURED',
      disclaimer: DEMO_DISCLAIMER,
    };
  }

  let rows: readonly MetricRow[];
  let probed = true;
  let errorCode: string | null = null;
  try {
    rows = await client.metricSnapshot.findMany({
      where: {
        artistId,
        metric: { in: OVERVIEW_METRICS },
        capturedAt: { gte: new Date(startMs) },
      },
      select: METRIC_SELECT,
      orderBy: { capturedAt: 'desc' },
      take: ROW_LIMIT,
    });
  } catch (error) {
    // Prohibido capturar el error y devolver un verde estático (AF-5).
    rows = [];
    probed = false;
    errorCode = errorCodeOf(error);
  }

  const requestedSource: MetricsSource = probed ? 'live' : 'unavailable';
  const aggregates = aggregateOverview({
    rows,
    metrics: OVERVIEW_METRICS,
    preset,
    nowMs,
    requestedSource,
  });
  const source = resolveSnapshotSource(aggregates, { ok: probed, requestedSource });

  const totals: Record<string, number> = {};
  for (const aggregate of aggregates) totals[aggregate.metric] = aggregate.total;

  return {
    probed,
    source,
    mode: source === 'live' ? 'REAL' : 'SIMULADO',
    checkedAt: nowDate.toISOString(),
    artistId,
    window: windowMeta,
    metrics: aggregates,
    totals,
    rejectedRows: aggregates.reduce((sum, aggregate) => sum + aggregate.rejectedRows, 0),
    errorCode,
    disclaimer: source === 'live' ? null : source === 'unavailable' ? UNAVAILABLE_DISCLAIMER : DEMO_DISCLAIMER,
  };
}

/** JSON de error con el tríptico honesto obligatorio (AF-1). */
function jsonFailure(status: number, code: string, extra: Record<string, unknown> = {}): Response {
  return new Response(
    JSON.stringify({
      ok: false,
      probed: false,
      source: 'unavailable',
      mode: 'SIMULADO',
      checkedAt: new Date().toISOString(),
      code,
      ...extra,
    }),
    { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } },
  );
}

export async function GET(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const requestedWindow = url.searchParams.get('window');
  const requestedMetrics = url.searchParams.get('metrics');

  // SEC-1 · Default-deny en el boundary: un parámetro fuera del SSOT no se
  // ignora en silencio ni se interpreta a la brava.
  if (requestedWindow !== null && !isWindowPreset(requestedWindow)) {
    return jsonFailure(400, 'WINDOW_NOT_IN_SSOT', { allowedWindows: WINDOW_KEYS });
  }
  if (requestedMetrics !== null) {
    const requested = requestedMetrics.split(',').map((key) => key.trim());
    const unknown = requested.filter((key) => !ALLOWED_METRICS.includes(key as MetricKey));
    if (unknown.length > 0) {
      return jsonFailure(400, 'METRIC_NOT_IN_SSOT', { allowedMetrics: ALLOWED_METRICS, rejected: unknown });
    }
  }

  const artistId = resolveOwnerArtistId();
  // El singleton `prisma` ES un PrismaClient completo; el handle declara el
  // subconjunto que el endpoint consume (mismo criterio que el cron de W53_T05).
  const client = prisma as PrismaClient as unknown as MetricsPrismaHandle;
  const encoder = new TextEncoder();
  let snapshotTimer: ReturnType<typeof setInterval> | undefined;
  let heartbeatTimer: ReturnType<typeof setInterval> | undefined;
  let closed = false;

  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      const write = (chunk: string): void => {
        if (closed) return;
        try {
          controller.enqueue(encoder.encode(chunk));
        } catch {
          closed = true;
        }
      };

      const stop = (): void => {
        if (closed) return;
        closed = true;
        if (snapshotTimer !== undefined) clearInterval(snapshotTimer);
        if (heartbeatTimer !== undefined) clearInterval(heartbeatTimer);
        try {
          controller.close();
        } catch {
          /* ya cerrado */
        }
      };

      const tick = (): void => {
        if (closed) return;
        void buildMetricsSnapshot({ client, artistId, requestedWindow, now: () => new Date() })
          .then((payload) => {
            write(`data: ${JSON.stringify(payload)}\n\n`);
          })
          .catch(() => {
            // Un fallo de serialización no tumba el stream en silencio: se declara.
            write(
              `data: ${JSON.stringify({
                probed: false,
                source: 'unavailable',
                mode: 'SIMULADO',
                checkedAt: new Date().toISOString(),
                errorCode: 'SNAPSHOT_FAILED',
              })}\n\n`,
            );
          });
      };

      tick();
      snapshotTimer = setInterval(tick, SNAPSHOT_INTERVAL_MS);
      heartbeatTimer = setInterval(() => {
        if (closed) return;
        write(
          `event: heartbeat\ndata: ${JSON.stringify({ kind: 'heartbeat', checkedAt: new Date().toISOString() })}\n\n`,
        );
      }, HEARTBEAT_INTERVAL_MS);
      req.signal.addEventListener('abort', stop);
    },
    cancel() {
      closed = true;
      if (snapshotTimer !== undefined) clearInterval(snapshotTimer);
      if (heartbeatTimer !== undefined) clearInterval(heartbeatTimer);
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-store, no-cache, must-revalidate',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  });
}
