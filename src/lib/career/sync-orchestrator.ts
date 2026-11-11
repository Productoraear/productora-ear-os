/**
 * ════════════════════════════════════════════════════════════════════════════
 * CAREER OS · ORQUESTADOR DE SINCRONIZACIÓN (W53_T03)
 * ════════════════════════════════════════════════════════════════════════════
 * Contrato en src/lib/career/connectors/types.ts. Reglas NO negociables:
 *
 *   1. RECORRIDO: solo conexiones `live` CON credencial cifrada. Una conexión
 *      `live` sin token es una fachada (AF-2): se reporta FAILED, no se salta.
 *   2. INTENTOS ACOTADOS: reintentos SOLO si el fallo es `retryable` (429/5xx/
 *      timeout). 401/403 o payload inválido NO se reintentan: quemar cuota contra
 *      una credencial muerta es un fallo doble.
 *   3. JITTER: backoff exponencial full jitter. El `Retry-After` del proveedor
 *      manda cuando existe y es el SUELO del jitter (nunca antes de lo que exige
 *      el servidor).
 *   4. ESCRITURA ATÓMICA: todas las métricas de una conexión entran en UNA
 *      transacción. O entran todas, o no entra ninguna (compensación total).
 *   5. IDEMPOTENCIA: upsert por clave natural (artistId, platformId, metric,
 *      capturedAt). Dos ejecuciones del mismo payload dejan las MISMAS filas.
 *   6. DLQ HONESTA: todo fallo definitivo deja rastro append-only con el último
 *      código de error y los intentos consumidos. `null` si no hubo fallos.
 *
 * Estado honesto: `persisted: true` SOLO tras transacción confirmada contra la
 * base PostgreSQL declarada en prisma/schema.prisma. Si la BD falla, se LANZA:
 * jamás se captura el error de base de datos para devolver un verde estático
 * (prohibición expresa de SOTA_2026_ELEVATION).
 *
 * Cero `any`. Cero log de tokens (INV-14). Server-only.
 * ════════════════════════════════════════════════════════════════════════════
 */

import { createHash } from 'node:crypto';

import type { Prisma, PrismaClient } from '@prisma/client';

import { prisma as defaultPrisma } from '@/lib/prisma';
import { getPlatform, type MetricPoint } from '@/lib/career/platform-registry';
import { isEncryptedTokenShape } from '@/lib/career/token-vault';
import {
  ConnectorError,
  DEFAULT_RETRY_POLICY,
  assertMetricPoints,
  computeBackoffMs,
  resolveConnector,
  sourceForSyncMode,
  type ConnectorConnectionView,
  type ConnectorCredential,
  type RetryPolicy,
} from '@/lib/career/connectors/types';

/** Timeout duro por intento de conector (INV-17). */
export const SYNC_ATTEMPT_TIMEOUT_MS = 8_000 as const;

// ── Contrato público ────────────────────────────────────────────────────────

/**
 * Persistencia DURADERA y honesta: los tres valores que exige la elevación
 * SOTA_2026 y que verifica el arnés de elevación.
 *
 * W53_T05 · DEUDA CERRADA: antes `runCareerSync` copiaba estas constantes al
 * reporte, así que `persisted:true` era una AFIRMACIÓN DE MÓDULO, no el
 * resultado de la ejecución. Ahora el sello se DERIVA de las transacciones
 * realmente confirmadas por cada conexión (`persistenceFor`). Las constantes se
 * conservan como contrato público del vocabulario y como valor de una ejecución
 * sin trabajo que hacer, no como sustituto de la medición.
 */
export const SYNC_PERSISTENCE_MARKERS = {
  mode: 'REAL',
  source: 'live',
  persisted: true,
} as const;

export type SyncConnectionState = 'SYNCED' | 'SKIPPED' | 'FAILED';

/** Resultado por conexión. `error` es el mensaje del último fallo, nunca el payload. */
export interface ConnectionSyncResult {
  readonly connectionId: string;
  readonly platformId: string;
  readonly state: SyncConnectionState;
  /** Puntos válidos recibidos del conector (0 si no llegó a haber lote). */
  readonly pointsReceived: number;
  /** Filas realmente escritas (created + updated). 0 si la conexión falló. */
  readonly rowsWritten: number;
  /** Intentos consumidos, incluido el primero. */
  readonly attempts: number;
  readonly retryable: boolean;
  readonly errorCode: string | null;
  readonly error: string | null;
  readonly lastSyncAt: string | null;
}

/** Sello de honestidad de la ejecución completa. */
export interface SyncPersistence {
  readonly mode: 'REAL';
  readonly source: 'live';
  readonly persisted: boolean;
}

/**
 * DERIVA el sello de persistencia de las transacciones CONFIRMADAS (W53_T05).
 *
 * Antes el reporte copiaba `SYNC_PERSISTENCE_MARKERS` y declaraba
 * `persisted:true` aunque ninguna transacción hubiera confirmado. Ahora:
 *   · hay al menos una conexión efectivamente persistida (`rowsWritten > 0`)
 *     => `persisted: true`, porque una transacción interactiva se confirmó;
 *   · no hubo nada que escribir (0 filas en todas las conexiones, p. ej. un
 *     cron dentro de la ventana o un lote sin cambios) => `persisted: false`:
 *     no se miente sobre una escritura que no ocurrió.
 * `mode` y `source` siguen el vocabulario cerrado y nunca cambian de valor.
 */
export function persistenceFor(connections: readonly ConnectionSyncResult[]): SyncPersistence {
  const confirmed = connections.some((result) => result.rowsWritten > 0);
  return {
    mode: SYNC_PERSISTENCE_MARKERS.mode,
    source: SYNC_PERSISTENCE_MARKERS.source,
    persisted: confirmed,
  };
}

/** Entrada de la cola de fallos (DLQ). Sin secretos, sin payloads completos. */
export interface SyncDlqEntry {
  readonly claim: string;
  readonly connectionId: string;
  readonly platformId: string;
  readonly errorCode: string;
  readonly attempts: number;
  readonly retryable: boolean;
  readonly message: string;
  readonly ts: string;
  readonly persistence: SyncPersistence;
}

export interface SyncReport {
  readonly artistId: string | null;
  readonly startedAt: string;
  readonly finishedAt: string;
  readonly connections: readonly ConnectionSyncResult[];
  readonly synced: number;
  readonly failed: number;
  readonly skipped: number;
  /** Suma de filas escritas en toda la ejecución. */
  readonly rowsWritten: number;
  readonly persistence: SyncPersistence;
  /** `null` cuando no hubo fallos definitivos: no se inventa una entrada vacía. */
  readonly deadLetter: SyncDlqEntry | null;
}

/** Vista mínima de conexión que el orquestador necesita (select quirúrgico). */
export interface SyncConnectionRecord {
  readonly id: string;
  readonly artistId: string;
  readonly platformId: string;
  readonly encryptedToken: string | null;
  readonly lastSyncAt: Date | null;
}

/** Handle persistente mínimo: subconjunto tipado de PrismaClient, sin `any`. */
export interface SyncPrismaHandle {
  readonly platformConnection: Pick<PrismaClient['platformConnection'], 'findMany'>;
  readonly metricSnapshot: Pick<PrismaClient['metricSnapshot'], 'findMany' | 'createMany' | 'update'>;
  /** Transacción interactiva: la unidad de compensación total. */
  readonly $transaction: PrismaClient['$transaction'];
}

export interface SyncOrchestratorOptions {
  /** Cliente Prisma (por defecto el singleton de servidor). */
  readonly client?: SyncPrismaHandle;
  /** Artista a sincronizar. `null` o ausente = todos los que tengan conexión live. */
  readonly artistId?: string | null;
  readonly retryPolicy?: Partial<RetryPolicy>;
  /** Espera entre reintentos. Inyectable: las pruebas no esperan de verdad. */
  readonly sleep?: (ms: number) => Promise<void>;
  /** Descifrado del token (inyectado: el vault es W53_T02, aquí no se duplica). */
  readonly decrypt: (serializedToken: string) => string;
  /** Reloj inyectable para pruebas deterministas de `lastSyncAt`. */
  readonly now?: () => Date;
  /** Emisor de la DLQ (por defecto: consola, sin secretos ni tokens). */
  readonly deadLetterSink?: (entry: SyncDlqEntry) => void;
}

// ── Clave natural de idempotencia ───────────────────────────────────────────

/** Sello de procedencia: SHA-256 del payload normalizado del conector. */
export function computeProvenanceHash(platformId: string, points: readonly MetricPoint[]): string {
  const canonical = [...points]
    .map((p) => `${p.artistId}|${p.platformId}|${p.metric}|${p.value}|${p.capturedAt}|${p.source}`)
    .sort()
    .join('\n');
  return createHash('sha256').update(`${platformId}\n${canonical}`, 'utf8').digest('hex');
}

/**
 * Clave natural de `MetricSnapshot`: (artistId, platformId, metric, capturedAt).
 *
 * HECHO MEDIDO EN DISCO: `MetricSnapshotWhereUniqueInput` (node_modules/.prisma/
 * client/index.d.ts:102276) solo declara `id`. NO existe compuesto único en el
 * esquema, así que `upsert` por clave natural es INEXPRESABLE contra el cliente
 * generado. Fingir un `upsert` con un cast sería un falso verde.
 *
 * Alternativa implementada (honesta y determinista): lectura de las filas
 * existentes dentro de la MISMA transacción interactiva y escritura
 * create/update por diferencia. Dos ejecuciones del mismo payload => mismas filas.
 * DEUDA DECLARADA: promover a @@unique([artistId, platformId, metric, capturedAt])
 * exige migración DDL (ASK FIRST, ARCHITECT_DIRECTIVE_SOTA_2026 §6.3).
 */
function snapshotNaturalKey(fields: {
  readonly artistId: string;
  readonly platformId: string;
  readonly metric: string;
  readonly capturedAt: string | Date;
}): string {
  const at = typeof fields.capturedAt === 'string' ? fields.capturedAt : fields.capturedAt.toISOString();
  return `${fields.artistId}|${fields.platformId}|${fields.metric}|${new Date(at).toISOString()}`;
}

function snapshotCreateData(point: MetricPoint, connectionId: string, provenanceHash: string): Prisma.MetricSnapshotUncheckedCreateInput {
  return {
    artistId: point.artistId,
    platformId: point.platformId,
    connectionId,
    metric: point.metric,
    value: point.value,
    capturedAt: new Date(point.capturedAt),
    source: point.source,
    provenanceHash,
  };
}

// ── Reconocimiento de fallos del proveedor ──────────────────────────────────

const ABORT_ERROR_NAMES = new Set(['AbortError', 'TimeoutError']);

/** Extrae un código HTTP si el conector lo declara (`status` / `httpStatus`). */
function readHttpStatus(error: unknown): number | null {
  if (typeof error !== 'object' || error === null) return null;
  const candidate = error as { readonly status?: unknown; readonly httpStatus?: unknown };
  for (const value of [candidate.status, candidate.httpStatus]) {
    if (typeof value === 'number' && Number.isInteger(value)) return value;
  }
  return null;
}

/**
 * Convierte cualquier excepción del conector en `ConnectorError` clasificada.
 * Prioridad: error tipado → status HTTP declarado → AbortSignal → fallo transitorio.
 * DOMException de aborto <=> timeout del proveedor: reintentable.
 */
export function normalizeConnectorFailure(platformId: string, error: unknown): ConnectorError {
  if (error instanceof ConnectorError) return error;
  if (error instanceof Error && ABORT_ERROR_NAMES.has(error.name)) {
    return new ConnectorError({
      code: 'TIMEOUT',
      message: `Timeout de ${SYNC_ATTEMPT_TIMEOUT_MS} ms en "${platformId}".`,
      platformId,
      retryable: true,
    });
  }
  const status = readHttpStatus(error);
  if (status !== null) {
    if (status === 429) {
      const retryAfter = (error as { readonly retryAfterMs?: unknown }).retryAfterMs;
      const retryAfterMs = typeof retryAfter === 'number' ? retryAfter : null;
      return new ConnectorError({
        code: 'RATE_LIMITED',
        message: `HTTP 429 en "${platformId}": rate limit del proveedor.`,
        platformId,
        httpStatus: 429,
        retryAfterMs,
        retryable: true,
      });
    }
    if (status >= 500) {
      return new ConnectorError({
        code: 'TRANSIENT',
        message: `HTTP ${status} en "${platformId}": fallo transitorio del proveedor.`,
        platformId,
        httpStatus: status,
        retryable: true,
      });
    }
    if (status === 401 || status === 403) {
      return new ConnectorError({
        code: 'UNAUTHORIZED',
        message: `HTTP ${status} en "${platformId}": credencial rechazada.`,
        platformId,
        httpStatus: status,
        retryable: false,
      });
    }
    return new ConnectorError({
      code: 'INVALID_PAYLOAD',
      message: `HTTP ${status} en "${platformId}": respuesta no procesable.`,
      platformId,
      httpStatus: status,
      retryable: false,
    });
  }
  return new ConnectorError({
    code: 'TRANSIENT',
    message: `Fallo transitorio no clasificado en "${platformId}".`,
    platformId,
    retryable: true,
  });
}

/** Espera real entre reintentos (inyectable en pruebas). */
const defaultSleep = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

/** El suelo es `Retry-After` del proveedor; el techo, la política. */
export function nextRetryDelayMs(error: ConnectorError, attempt: number, policy: RetryPolicy): number {
  const backoff = computeBackoffMs(attempt, policy);
  const serverFloor = error.retryAfterMs ?? 0;
  return Math.max(backoff, serverFloor);
}

// ── Cola de conexiones a sincronizar ────────────────────────────────────────

/** SELECT quirúrgico: sin `metrics`, sin relaciones, sin columnas no usadas (INV-20). */
const connectionSelect = {
  id: true,
  artistId: true,
  platformId: true,
  encryptedToken: true,
  lastSyncAt: true,
} satisfies Prisma.PlatformConnectionSelect;

function readSyncQueue(client: SyncPrismaHandle, artistId: string | null): Promise<readonly SyncConnectionRecord[]> {
  return client.platformConnection.findMany({
    where: {
      status: 'live',
      ...(artistId === null ? {} : { artistId }),
    },
    select: connectionSelect,
    orderBy: [{ artistId: 'asc' }, { platformId: 'asc' }],
  });
}

// ── Motor por conexión ──────────────────────────────────────────────────────

function failureResult(
  record: SyncConnectionRecord,
  error: ConnectorError,
  attempts: number,
): ConnectionSyncResult {
  return {
    connectionId: record.id,
    platformId: record.platformId,
    state: 'FAILED',
    pointsReceived: 0,
    rowsWritten: 0,
    attempts,
    retryable: error.retryable,
    errorCode: error.code,
    error: error.message,
    lastSyncAt: record.lastSyncAt === null ? null : record.lastSyncAt.toISOString(),
  };
}

interface AttemptOutcome {
  readonly points: readonly MetricPoint[] | null;
  readonly error: ConnectorError | null;
  readonly connection: ConnectorConnectionView;
  readonly credential: ConnectorCredential;
}

/**
 * Un intento: refresh si el conector lo declara, descifrado ya hecho por el
 * llamador, `fetchMetrics` con deadline, y validación estricta del lote.
 * `deadline` acota el intento completo: el conector debe honrarlo con AbortSignal.
 */
async function runAttempt(
  input: {
    readonly platformId: string;
    readonly record: SyncConnectionRecord;
    readonly since: string | null;
    readonly accessToken: string;
    readonly now: () => Date;
  },
): Promise<AttemptOutcome> {
  const connector = resolveConnector(input.platformId);
  const connection: ConnectorConnectionView = {
    connectionId: input.record.id,
    artistId: input.record.artistId,
    platformId: input.record.platformId,
  };
  const credential: ConnectorCredential = {
    accessToken: input.accessToken,
    refreshToken: null,
    expiresAt: null,
  };
  if (connector === null) {
    return {
      points: null,
      error: new ConnectorError({
        code: 'NOT_IMPLEMENTED',
        message: `Sin conector registrado para "${input.platformId}".`,
        platformId: input.platformId,
        retryable: false,
      }),
      connection,
      credential,
    };
  }
  try {
    const raw = await connector.fetchMetrics({
      connection,
      credential,
      since: input.since,
      deadline: new Date(input.now().getTime() + SYNC_ATTEMPT_TIMEOUT_MS),
    });
    const points = assertMetricPoints(input.platformId, raw);
    return { points, error: null, connection, credential };
  } catch (error) {
    return { points: null, error: normalizeConnectorFailure(input.platformId, error), connection, credential };
  }
}

/** Fecha de `since` para el conector: último sync, o `null` en la primera. */
function sinceOf(record: SyncConnectionRecord): string | null {
  return record.lastSyncAt === null ? null : record.lastSyncAt.toISOString();
}

/**
 * Persiste un lote en UNA transacción interactiva (compensación total).
 * Algoritmo idempotente por clave natural:
 *   1. Lee las filas existentes del artista+plataforma para las claves del lote.
 *   2. `createMany` de las claves ausentes.
 *   3. `update` de las presentes cuyo `value`/`source` cambió.
 * Reejecutar el MISMO payload => 0 creates y 0 updates: mismas filas, mismo conteo.
 *
 * Puntos marcados `demo` por el proveedor NO se disfrazan de OAuth real (AF-2):
 * conservan `demo`. El resto adopta el `source` que dicta el `syncMode` del SSOT.
 */
async function persistPoints(
  client: SyncPrismaHandle,
  record: SyncConnectionRecord,
  points: readonly MetricPoint[],
): Promise<number> {
  const def = getPlatform(record.platformId);
  const payload: readonly MetricPoint[] =
    def === undefined
      ? points
      : points.map((point) => ({
          ...point,
          source: point.source === 'demo' ? 'demo' : sourceForSyncMode(def.syncMode),
        }));
  if (payload.length === 0) return 0;
  const provenanceHash = computeProvenanceHash(record.platformId, payload);
  const artistIds = [...new Set(payload.map((point) => point.artistId))];

  return client.$transaction(async (tx) => {
    const existing = await tx.metricSnapshot.findMany({
      where: {
        artistId: { in: artistIds },
        platformId: record.platformId,
        metric: { in: [...new Set(payload.map((point) => point.metric))] },
        capturedAt: { in: payload.map((point) => new Date(point.capturedAt)) },
      },
      select: { id: true, artistId: true, platformId: true, metric: true, capturedAt: true, value: true, source: true },
    });
    const index = new Map<string, (typeof existing)[number]>();
    for (const row of existing) {
      index.set(
        snapshotNaturalKey({
          artistId: row.artistId,
          platformId: row.platformId,
          metric: row.metric,
          capturedAt: row.capturedAt,
        }),
        row,
      );
    }

    const toCreate: Prisma.MetricSnapshotCreateManyInput[] = [];
    const toUpdate: { readonly id: string; readonly value: number; readonly source: MetricPoint['source'] }[] = [];
    for (const point of payload) {
      const current = index.get(snapshotNaturalKey(point));
      if (current === undefined) {
        toCreate.push(snapshotCreateData(point, record.id, provenanceHash));
        continue;
      }
      if (current.value !== point.value || current.source !== point.source) {
        toUpdate.push({ id: current.id, value: point.value, source: point.source });
      }
    }

    if (toCreate.length > 0) {
      await tx.metricSnapshot.createMany({ data: toCreate });
    }
    for (const patch of toUpdate) {
      await tx.metricSnapshot.update({
        where: { id: patch.id },
        data: { value: patch.value, source: patch.source, connectionId: record.id, provenanceHash },
        select: { id: true },
      });
    }
    return toCreate.length + toUpdate.length;
  });
}

// ── Sincronización de UNA conexión ──────────────────────────────────────────

interface SingleSyncContext {
  readonly client: SyncPrismaHandle;
  readonly policy: RetryPolicy;
  readonly sleep: (ms: number) => Promise<void>;
  readonly decrypt: (serializedToken: string) => string;
  readonly now: () => Date;
}

/**
 * Bucle acotado: primer intento + `maxRetries` reintentos, SOLO si el fallo es
 * reintentable. Un éxito rompe el bucle; un fallo no reintentable sale al acto.
 */
async function syncConnection(
  context: SingleSyncContext,
  record: SyncConnectionRecord,
): Promise<ConnectionSyncResult> {
  const platformDef = getPlatform(record.platformId);
  if (platformDef === undefined) {
    return failureResult(
      record,
      new ConnectorError({
        code: 'NOT_IMPLEMENTED',
        message: `platformId "${record.platformId}" fuera del SSOT de plataformas.`,
        platformId: record.platformId,
        retryable: false,
      }),
      0,
    );
  }
  // Fachada AF-2: `live` sin credencial cifrada no es una conexión real.
  const tokenEnvelope = record.encryptedToken;
  if (tokenEnvelope === null || !isEncryptedTokenShape(tokenEnvelope)) {
    return failureResult(
      record,
      new ConnectorError({
        code: 'UNAUTHORIZED',
        message: `Conexión "${record.platformId}" marcada live sin sobre cifrado válido (fachada AF-2).`,
        platformId: record.platformId,
        retryable: false,
      }),
      0,
    );
  }

  let accessToken: string;
  try {
    accessToken = context.decrypt(tokenEnvelope);
  } catch {
    return failureResult(
      record,
      new ConnectorError({
        code: 'UNAUTHORIZED',
        message: `El sobre cifrado de "${record.platformId}" no descifra con la clave vigente.`,
        platformId: record.platformId,
        retryable: false,
      }),
      0,
    );
  }

  const since = sinceOf(record);
  let attempts = 0;
  let lastError = new ConnectorError({
    code: 'TRANSIENT',
    message: 'Sin intentos ejecutados.',
    platformId: record.platformId,
    retryable: false,
  });

  for (let retry = 0; retry <= context.policy.maxRetries; retry += 1) {
    attempts += 1;
    const outcome = await runAttempt({
      platformId: record.platformId,
      record,
      since,
      accessToken,
      now: context.now,
    });
    if (outcome.points !== null) {
      const rowsWritten = await persistPoints(context.client, record, outcome.points);
      return {
        connectionId: record.id,
        platformId: record.platformId,
        state: 'SYNCED',
        pointsReceived: outcome.points.length,
        rowsWritten,
        attempts,
        retryable: false,
        errorCode: null,
        error: null,
        lastSyncAt: context.now().toISOString(),
      };
    }
    lastError = outcome.error ?? lastError;
    if (!lastError.retryable) break;
    if (retry === context.policy.maxRetries) break;
    await context.sleep(nextRetryDelayMs(lastError, retry, context.policy));
  }
  return failureResult(record, lastError, attempts);
}

// ── Orquestador: recorrido completo con jitter y compensación ───────────────

function buildDeadLetter(
  failures: readonly ConnectionSyncResult[],
  ts: string,
  persistence: SyncPersistence,
): SyncDlqEntry | null {
  // Un único primario en la entrada: el resto viaja en `connections[]` del reporte.
  const first = failures[0];
  if (first === undefined) return null;
  return {
    claim: `W53_T03_SYNC_DLQ:${first.platformId}:${first.connectionId}`,
    connectionId: first.connectionId,
    platformId: first.platformId,
    errorCode: first.errorCode ?? 'TRANSIENT',
    attempts: first.attempts,
    retryable: first.retryable,
    message: first.error ?? 'Fallo sin detalle',
    ts,
    persistence,
  };
}

/**
 * Sincroniza todas las conexiones `live` (filtrables por artista).
 * Cada conexión es un compartimento estanco: el fallo de una NO revierte las
 * filas ya confirmadas de otra (cada transacción es independiente y atómica).
 */
export async function runCareerSync(options: SyncOrchestratorOptions): Promise<SyncReport> {
  const client = options.client ?? defaultPrisma;
  const policy: RetryPolicy = { ...DEFAULT_RETRY_POLICY, ...(options.retryPolicy ?? {}) };
  const now = options.now ?? (() => new Date());
  const sleep = options.sleep ?? defaultSleep;
  const artistFilter = options.artistId ?? null;
  const startedAt = now().toISOString();

  const queue = await readSyncQueue(client, artistFilter);
  const context: SingleSyncContext = {
    client,
    policy,
    sleep,
    decrypt: options.decrypt,
    now,
  };

  const results: ConnectionSyncResult[] = [];
  for (const record of queue) {
    results.push(await syncConnection(context, record));
  }

  const failures = results.filter((r) => r.state === 'FAILED');
  // W53_T05: el sello se DERIVA de las transacciones confirmadas. Si ninguna
  // conexión escribió filas, `persisted` es false: no hay escritura que declarar.
  const persistence: SyncPersistence = persistenceFor(results);
  const finishedAt = now().toISOString();
  const deadLetter = buildDeadLetter(failures, finishedAt, persistence);
  if (deadLetter !== null) {
    const sink =
      options.deadLetterSink ??
      ((entry: SyncDlqEntry) => {
        // Sin tokens, sin payloads: solo la identidad del fallo (INV-14).
        console.error(`[career-sync:dlq] ${entry.platformId} code=${entry.errorCode} attempts=${entry.attempts}`);
      });
    sink(deadLetter);
  }

  return {
    artistId: artistFilter,
    startedAt,
    finishedAt,
    connections: results,
    synced: results.filter((r) => r.state === 'SYNCED').length,
    failed: failures.length,
    skipped: results.filter((r) => r.state === 'SKIPPED').length,
    rowsWritten: results.reduce((sum, r) => sum + r.rowsWritten, 0),
    persistence,
    deadLetter,
  };
}

/** Conteo de filas por conexión: instrumento de idempotencia (2 ejecuciones = mismas filas). */
export async function countConnectionSnapshots(
  client: SyncPrismaHandle,
  input: { readonly artistId: string; readonly platformId: string },
): Promise<number> {
  const rows = await client.metricSnapshot.findMany({
    where: { artistId: input.artistId, platformId: input.platformId },
    select: { id: true },
  });
  return rows.length;
}
