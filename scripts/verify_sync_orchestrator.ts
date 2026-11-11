/**
 * ════════════════════════════════════════════════════════════════════════════
 * ARNÉS FALSABLE · W53_T03 · ORQUESTADOR DE SINCRONIZACIÓN
 * ════════════════════════════════════════════════════════════════════════════
 * Protocolo Goldfish ("Pez Dorado"): este verificador NO sabe cómo está escrito
 * el orquestador. Solo mira su comportamiento observable a través del contrato
 * público (`runCareerSync`) y de la base de datos. Puede refactorizarse el motor
 * entero y el arnés sigue siendo válido; puede romperse el motor y el arnés lo
 * detecta con Exit 1.
 *
 * Los tres criterios del Arquitecto:
 *   1. PROVEEDOR HOSTIL: 429 (rate limit) y 500 (transitorio) se reintentan;
 *      401 y payload inválido NO. Jamás se reintenta lo irrecuperable.
 *   2. IDEMPOTENCIA + COMPENSACIÓN: dos ejecuciones del mismo payload dejan las
 *      MISMAS filas; un fallo de persistencia no deja escritura parcial (todo o
 *      nada) y produce entrada de DLQ honesta.
 *   3. CERO `any` Y ZONA CERO: el diff no contiene `any` explícito y
 *      `src/lib/constants/ear-os-ssot.ts` conserva su hash (no se toca).
 *
 * Uso:
 *   node ./node_modules/tsx/dist/cli.mjs scripts/verify_sync_orchestrator.ts
 *   node ./node_modules/tsx/dist/cli.mjs scripts/verify_sync_orchestrator.ts --json
 *   node ./node_modules/tsx/dist/cli.mjs scripts/verify_sync_orchestrator.ts --self-test
 *
 * Exit codes: 0 = todas las aserciones pasan · 1 = al menos una falla ·
 *             2 = sin PostgreSQL verificable (SIN_EVIDENCIA, nunca falso verde).
 * ════════════════════════════════════════════════════════════════════════════
 */

import { createRequire } from 'node:module';
import { createHash, createCipheriv, randomBytes } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';

import type { Prisma, PrismaClient } from '@prisma/client';

import {
  ConnectorError,
  DEFAULT_RETRY_POLICY,
  assertMetricPoints,
  classifyHttpStatus,
  clearConnectorRegistry,
  computeBackoffMs,
  registerConnector,
  resolveConnector,
  type Connector,
  type ConnectorCredential,
  type ConnectorPullInput,
  type RetryPolicy,
} from '../src/lib/career/connectors/types';
import { PLATFORMS, type MetricPoint } from '../src/lib/career/platform-registry';
import {
  SYNC_ATTEMPT_TIMEOUT_MS,
  SYNC_PERSISTENCE_MARKERS,
  countConnectionSnapshots,
  runCareerSync,
  type SyncPrismaHandle,
  type SyncReport,
} from '../src/lib/career/sync-orchestrator';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const requireCjs = createRequire(import.meta.url);
const JSON_ONLY = process.argv.includes('--json');
const SELF_TEST = process.argv.includes('--self-test');

// ── Micro-framework de aserciones ───────────────────────────────────────────

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
  record(group, name, ok, ok ? null : detail ?? 'aserto falso');
}

function checkEqual(group: string, name: string, actual: unknown, expected: unknown): void {
  const ok = Object.is(actual, expected);
  record(group, name, ok, ok ? null : `esperado=${String(expected)} obtenido=${String(actual)}`);
}

/** Espera que `fn` lance `ConnectorError` con el código indicado. */
function checkConnectorError(
  group: string,
  name: string,
  fn: () => unknown,
  expectedCode: string,
): void {
  try {
    fn();
    record(group, name, false, `no lanzó: se esperaba ConnectorError ${expectedCode}`);
  } catch (error) {
    if (error instanceof ConnectorError) {
      checkEqual(group, `${name} (código)`, error.code, expectedCode);
    } else {
      record(group, name, false, `excepción no tipada: ${error instanceof Error ? error.name : typeof error}`);
    }
  }
}

// ── Fixtures: fallos tipados del proveedor simulado ──────────────────────────

/** Error con `status` HTTP tipado, como lo lanzan los clientes reales. */
class ProviderHttpError extends Error {
  readonly status: number;
  readonly retryAfterMs: number | null;

  constructor(status: number, retryAfterMs: number | null = null) {
    super(`proveedor respondió ${status}`);
    this.name = 'ProviderHttpError';
    this.status = status;
    this.retryAfterMs = retryAfterMs;
  }
}

/** Banda de reintentos mínima para pruebas: jitter 0 y sin espera real. */
const FAST_POLICY: RetryPolicy = { maxRetries: 3, baseDelayMs: 1, maxDelayMs: 4, jitterMs: 0 };

const ARTIST_A = 'artist-fixture-a';
const ARTIST_B = 'artist-fixture-b';

const AT_10 = '2026-11-11T10:00:00.000Z';
const AT_11 = '2026-11-11T11:00:00.000Z';

function point(
  platformId: string,
  metric: MetricPoint['metric'],
  value: number,
  capturedAt = AT_10,
  artistId = ARTIST_A,
): MetricPoint {
  return { artistId, platformId, metric, value, capturedAt, source: 'api' };
}

/**
 * Sobre cifrado ESTRUCTURALMENTE válido (IV 12 B + tag 16 B), generado con
 * `node:crypto`. No cifra nada real: la clave es desechable y el `decrypt` del
 * arnés está inyectado. Lo único que se prueba aquí es la aceptación del sobre
 * por `isEncryptedTokenShape` (W53_T02) antes de tocar el proveedor.
 */
const VALID_ENVELOPE = (() => {
  const key = randomBytes(32);
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', key, iv);
  const ct = Buffer.concat([cipher.update('fixture-token', 'utf8'), cipher.final()]);
  return `v1.${iv.toString('base64')}.${cipher.getAuthTag().toString('base64')}.${ct.toString('base64')}`;
})();

/** Reloj inyectado: lo usan el orquestador Y el doble, para comparar manzanas con manzanas. */
let injectedNow: () => Date = () => new Date();
const fixedNow = (): Date => new Date(AT_11);

/** Doble de conector con guion de respuestas; `calls()` mide los intentos. */
function makeConnector(
  platformId: string,
  script: readonly (() => readonly MetricPoint[])[],
): Connector & { calls: () => number } {
  let calls = 0;
  const pull = (): readonly MetricPoint[] => {
    const step = script[Math.min(calls, script.length - 1)];
    calls += 1;
    if (step === undefined) throw new ProviderHttpError(500);
    return step();
  };
  return {
    platformId,
    calls: () => calls,
    authUrl: (state: string) => `https://example.invalid/oauth?state=${encodeURIComponent(state)}`,
    exchangeCode: async (): Promise<ConnectorCredential> => ({
      accessToken: 'token-fixture',
      refreshToken: null,
      expiresAt: null,
    }),
    refresh: async (_connection, credential): Promise<ConnectorCredential> => credential,
    fetchMetrics: async (input: ConnectorPullInput) => {
      // INV-17: el deadline debe ser EXACTAMENTE now(inyectado) + 8000 ms.
      const expected = injectedNow().getTime() + SYNC_ATTEMPT_TIMEOUT_MS;
      check(
        'contrato',
        'deadline del intento = now() + 8000 ms (INV-17)',
        input.deadline.getTime() === expected,
        `esperado=${expected} obtenido=${input.deadline.getTime()}`,
      );
      return pull();
    },
  };
}

function ok(points: readonly MetricPoint[]): () => readonly MetricPoint[] {
  return () => points;
}

function failWith(error: Error): () => readonly MetricPoint[] {
  return () => {
    throw error;
  };
}

const identityDecrypt = (serialized: string): string => (serialized.length > 0 ? 'token-descifrado-fixture' : '');


// ── Doble de persistencia (contrato: cola, DLQ y compensación) ───────────────

interface FakeRow {
  readonly id: string;
  readonly artistId: string;
  readonly platformId: string;
  readonly connectionId: string | null;
  readonly metric: string;
  readonly value: number;
  readonly capturedAt: Date;
  readonly source: string;
  readonly provenanceHash: string | null;
}

interface FakeSeedConnection {
  readonly id: string;
  readonly artistId: string;
  readonly platformId: string;
  readonly encryptedToken: string | null;
  readonly lastSyncAt: Date | null;
}

/**
 * Handle falso de Prisma: implementa SOLO lo que el orquestador puede tocar y
 * simula la transacción con rollback real (fotografía + restauración).
 * `failOnCreate` reproduce una caída de base de datos a mitad de escritura.
 */
function makeClient(input: {
  readonly connections: readonly FakeSeedConnection[];
  readonly failOnCreate?: boolean;
}): { readonly handle: SyncPrismaHandle; readonly rows: () => readonly FakeRow[] } {
  let rows: FakeRow[] = [];
  let sequence = 0;
  const snapshot = (): FakeRow[] => rows.map((row) => ({ ...row }));

  const handle = {
    platformConnection: {
      findMany: async () => input.connections.map((c) => ({ ...c })),
    },
    metricSnapshot: {
      findMany: async (args: { where?: Prisma.MetricSnapshotWhereInput }) => {
        const where = args.where ?? {};
        const platformId = typeof where.platformId === 'string' ? where.platformId : null;
        return snapshot()
          .filter((row) => (platformId === null ? true : row.platformId === platformId))
          .map((row) => ({
            id: row.id,
            artistId: row.artistId,
            platformId: row.platformId,
            metric: row.metric,
            capturedAt: row.capturedAt,
            value: row.value,
            source: row.source,
          }));
      },
      createMany: async (args: { data: Prisma.MetricSnapshotCreateManyInput[] }) => {
        for (const item of args.data) {
          sequence += 1;
          rows.push({
            id: `row-${sequence}`,
            artistId: String(item.artistId),
            platformId: String(item.platformId),
            connectionId: item.connectionId === undefined ? null : item.connectionId,
            metric: String(item.metric),
            value: Number(item.value),
            capturedAt: new Date(item.capturedAt as Date),
            source: String(item.source ?? 'demo'),
            provenanceHash: item.provenanceHash === undefined ? null : item.provenanceHash,
          });
        }
        return { count: args.data.length };
      },
      update: async (args: { where: { id: string }; data: { value?: number; source?: string } }) => {
        rows = rows.map((row) =>
          row.id === args.where.id
            ? { ...row, value: args.data.value ?? row.value, source: args.data.source ?? row.source }
            : row,
        );
        return { id: args.where.id };
      },
    },
    $transaction: (async (fn: (tx: unknown) => Promise<number>) => {
      const before = snapshot();
      const beforeSeq = sequence;
      // `tx` es el propio handle: el orquestador solo usa los delegates tipados.
      const tx = {
        metricSnapshot: {
          findMany: handle.metricSnapshot.findMany,
          createMany: async (args: { data: Prisma.MetricSnapshotCreateManyInput[] }) => {
            if (input.failOnCreate === true) throw new Error('DB_DOWN_MID_TRANSACTION');
            return handle.metricSnapshot.createMany(args);
          },
          update: handle.metricSnapshot.update,
        },
      };
      try {
        return await fn(tx);
      } catch (error) {
        // COMPENSACIÓN REAL: cualquier fallo revierte la escritura completa.
        rows = before;
        sequence = beforeSeq;
        throw error;
      }
    }) as SyncPrismaHandle['$transaction'],
  } satisfies SyncPrismaHandle;

  return { handle, rows: () => snapshot() };
}

function liveConnection(platformId: string, overrides: Partial<FakeSeedConnection> = {}): FakeSeedConnection {
  return {
    id: `conn-${platformId}`,
    artistId: ARTIST_A,
    platformId,
    encryptedToken: VALID_ENVELOPE,
    lastSyncAt: null,
    ...overrides,
  };
}


// ── CRITERIO 1 · Proveedor hostil: 429 / 500 / 401 / payload ────────────────

async function testHostileProvider(): Promise<void> {
  const G = '1.proveedor-hostil';
  const batch = [point('spotify', 'plays', 1_000), point('spotify', 'followers', 42)];
  const base = {
    artistId: ARTIST_A,
    retryPolicy: FAST_POLICY,
    sleep: async () => undefined,
    decrypt: identityDecrypt,
    now: fixedNow,
    deadLetterSink: () => undefined,
  } as const;

  // 429 dos veces y luego éxito: debe reintentar y consolidar.
  clearConnectorRegistry();
  const rateLimited = makeConnector('spotify', [
    failWith(new ProviderHttpError(429, 50)),
    failWith(new ProviderHttpError(429, 50)),
    ok(batch),
  ]);
  registerConnector(rateLimited);
  const db429 = makeClient({ connections: [liveConnection('spotify')] });
  const report429 = await runCareerSync({ ...base, client: db429.handle });
  checkEqual(G, 'HTTP 429: reintenta hasta recuperarse (3 intentos)', rateLimited.calls(), 3);
  checkEqual(G, 'HTTP 429: estado final SYNCED', report429.connections[0]?.state, 'SYNCED');
  checkEqual(G, 'HTTP 429: filas persistidas = puntos del lote', db429.rows().length, 2);
  checkEqual(G, 'HTTP 429: sin entrada DLQ', report429.deadLetter, null);

  // 500 permanente: agota reintentos y acaba en DLQ sin escribir nada.
  clearConnectorRegistry();
  const flaky = makeConnector('deezer', [failWith(new ProviderHttpError(500))]);
  registerConnector(flaky);
  const db500 = makeClient({ connections: [liveConnection('deezer')] });
  const sink: string[] = [];
  const report500 = await runCareerSync({
    ...base,
    client: db500.handle,
    deadLetterSink: (entry) => sink.push(entry.claim),
  });
  checkEqual(G, 'HTTP 500: intentos = 1 + maxRetries (4)', flaky.calls(), FAST_POLICY.maxRetries + 1);
  checkEqual(G, 'HTTP 500: estado final FAILED', report500.connections[0]?.state, 'FAILED');
  checkEqual(G, 'HTTP 500: código TRANSIENT', report500.connections[0]?.errorCode, 'TRANSIENT');
  checkEqual(G, 'HTTP 500: DLQ emitida una vez', sink.length, 1);
  checkEqual(G, 'HTTP 500: 0 filas escritas (no hay verde falso)', db500.rows().length, 0);

  // 401: NO se reintenta (credencial muerta).
  clearConnectorRegistry();
  const unauthorized = makeConnector('soundcloud', [failWith(new ProviderHttpError(401))]);
  registerConnector(unauthorized);
  const db401 = makeClient({ connections: [liveConnection('soundcloud')] });
  const report401 = await runCareerSync({ ...base, client: db401.handle });
  checkEqual(G, 'HTTP 401: exactamente 1 intento (no reintentable)', unauthorized.calls(), 1);
  checkEqual(G, 'HTTP 401: código UNAUTHORIZED', report401.connections[0]?.errorCode, 'UNAUTHORIZED');
  checkEqual(G, 'HTTP 401: retryable=false en el reporte', report401.connections[0]?.retryable, false);

  // Payload inválido (métrica no declarada por la plataforma): NO se reintenta.
  clearConnectorRegistry();
  const badPayload = makeConnector('spotify', [ok([point('spotify', 'tickets_sold', 5)])]);
  registerConnector(badPayload);
  const dbBad = makeClient({ connections: [liveConnection('spotify')] });
  const reportBad = await runCareerSync({ ...base, client: dbBad.handle });
  checkEqual(G, 'payload inválido: 1 intento', badPayload.calls(), 1);
  checkEqual(G, 'payload inválido: código INVALID_PAYLOAD', reportBad.connections[0]?.errorCode, 'INVALID_PAYLOAD');
  checkEqual(G, 'payload inválido: 0 filas persistidas', dbBad.rows().length, 0);

  // Timeout del proveedor (AbortError) sí es reintentable.
  clearConnectorRegistry();
  const timedOut = new Error('The operation was aborted due to timeout');
  timedOut.name = 'TimeoutError';
  const timeoutConn = makeConnector('youtube', [failWith(timedOut)]);
  registerConnector(timeoutConn);
  const dbTimeout = makeClient({ connections: [liveConnection('youtube')] });
  const reportTimeout = await runCareerSync({ ...base, client: dbTimeout.handle });
  checkEqual(G, 'timeout: agota los 4 intentos', timeoutConn.calls(), FAST_POLICY.maxRetries + 1);
  checkEqual(G, 'timeout: código TIMEOUT', reportTimeout.connections[0]?.errorCode, 'TIMEOUT');
}

// ── CRITERIO 1bis · Política de reintentos: clasificación y jitter ─────────

function testRetryPolicy(): void {
  const G = '1.reintentos';
  checkEqual(G, 'clasifica 429 como RATE_LIMITED', classifyHttpStatus('spotify', 429, null).code, 'RATE_LIMITED');
  checkEqual(G, 'clasifica 503 como TRANSIENT', classifyHttpStatus('spotify', 503, null).code, 'TRANSIENT');
  checkEqual(G, 'clasifica 403 como UNAUTHORIZED', classifyHttpStatus('spotify', 403, null).code, 'UNAUTHORIZED');
  checkEqual(G, 'clasifica 404 como INVALID_PAYLOAD', classifyHttpStatus('spotify', 404, null).code, 'INVALID_PAYLOAD');
  checkEqual(G, '429 es reintentable', classifyHttpStatus('spotify', 429, null).retryable, true);
  checkEqual(G, '401 NO es reintentable', classifyHttpStatus('spotify', 401, null).retryable, false);

  const deterministic: RetryPolicy = { ...DEFAULT_RETRY_POLICY, jitterMs: 0 };
  checkEqual(G, 'backoff intento 0 = base', computeBackoffMs(0, deterministic), DEFAULT_RETRY_POLICY.baseDelayMs);
  checkEqual(G, 'backoff intento 2 = base*4', computeBackoffMs(2, deterministic), DEFAULT_RETRY_POLICY.baseDelayMs * 4);
  const capped = computeBackoffMs(20, deterministic);
  check(G, 'backoff acotado por maxDelayMs', capped <= DEFAULT_RETRY_POLICY.maxDelayMs, `obtenido=${capped}`);

  // El jitter DEBE variar: 40 muestras del mismo intento no son constantes.
  const samples = new Set<number>();
  for (let i = 0; i < 40; i += 1) samples.add(computeBackoffMs(1));
  check(G, 'jitter produce valores distintos (>1 de 40 muestras)', samples.size > 1, `distintos=${samples.size}`);

  // Hito de la política por defecto: 3 reintentos declarados.
  checkEqual(G, 'política por defecto = 3 reintentos', DEFAULT_RETRY_POLICY.maxRetries, 3);

  // El registro de conectores es cerrado al SSOT (no se inventan plataformas).
  clearConnectorRegistry();
  const fake: Connector = {
    platformId: 'red-social-inventada',
    authUrl: () => '',
    exchangeCode: async () => ({ accessToken: '', refreshToken: null, expiresAt: null }),
    refresh: async (_c, credential) => credential,
    fetchMetrics: async () => [],
  };
  checkConnectorError(G, 'registrar plataforma fuera del SSOT lanza NOT_IMPLEMENTED', () => registerConnector(fake), 'NOT_IMPLEMENTED');

  // Validación estricta del lote (Zod + SSOT de métricas).
  checkConnectorError(
    G,
    'value no entero se rechaza antes de persistir',
    () => assertMetricPoints('spotify', [point('spotify', 'plays', 1.5)]),
    'INVALID_PAYLOAD',
  );
  checkConnectorError(
    G,
    'capturedAt ilegible se rechaza',
    () => assertMetricPoints('spotify', [point('spotify', 'plays', 3, 'ayer por la tarde')]),
    'INVALID_PAYLOAD',
  );
  checkConnectorError(
    G,
    'lote de otra plataforma se rechaza',
    () => assertMetricPoints('spotify', [point('deezer', 'plays', 3)]),
    'INVALID_PAYLOAD',
  );
  checkEqual(
    G,
    'cada plataforma del SSOT tiene métricas declaradas o ninguna (0 inventadas)',
    PLATFORMS.every((p) => Array.isArray(p.metrics)),
    true,
  );
  clearConnectorRegistry();
}

// ── CRITERIO 2 · Idempotencia + transacción compensatoria ───────────────────

async function testIdempotenceAndCompensation(): Promise<void> {
  const G = '2.idempotencia';
  const batch = [
    point('tiktok', 'views', 500),
    point('tiktok', 'followers', 12),
    point('tiktok', 'views', 900, AT_11),
  ];
  const base = {
    artistId: ARTIST_A,
    retryPolicy: FAST_POLICY,
    sleep: async () => undefined,
    decrypt: identityDecrypt,
    now: fixedNow,
    deadLetterSink: () => undefined,
  } as const;

  // 2 ejecuciones del MISMO payload sobre la MISMA base => mismas filas.
  clearConnectorRegistry();
  registerConnector(makeConnector('tiktok', [ok(batch)]));
  const db = makeClient({ connections: [liveConnection('tiktok')] });
  const first = await runCareerSync({ ...base, client: db.handle });
  const afterFirst = db.rows().length;
  const second = await runCareerSync({ ...base, client: db.handle });
  const afterSecond = db.rows().length;

  checkEqual(G, '1ª ejecución: 3 filas nuevas', afterFirst, 3);
  checkEqual(G, '2ª ejecución: mismo conteo exacto (no duplica)', afterSecond, afterFirst);
  checkEqual(G, '1ª ejecución escribe 3 filas', first.rowsWritten, 3);
  checkEqual(G, '2ª ejecución escribe 0 filas (idempotente)', second.rowsWritten, 0);
  checkEqual(G, 'ambas ejecuciones terminan SYNCED', `${first.synced}/${second.synced}`, '1/1');

  // Aritmética de claves naturales: 3 puntos distintos, 0 colisiones silenciosas.
  const keys = new Set(db.rows().map((r) => `${r.artistId}|${r.platformId}|${r.metric}|${r.capturedAt.toISOString()}`));
  checkEqual(G, 'claves naturales únicas = filas persistidas', keys.size, afterSecond);

  // Un valor corregido por el proveedor se ACTUALIZA en su clave, no se duplica.
  clearConnectorRegistry();
  registerConnector(makeConnector('tiktok', [ok([point('tiktok', 'views', 500), point('tiktok', 'followers', 99), point('tiktok', 'views', 900, AT_11)])]));
  const third = await runCareerSync({ ...base, client: db.handle });
  checkEqual(G, 'corrección de valor: sigue habiendo 3 filas', db.rows().length, 3);
  checkEqual(G, 'corrección de valor: 1 escritura (update)', third.rowsWritten, 1);

  // COMPENSACIÓN: caída de BD a mitad de transacción => 0 filas escritas.
  clearConnectorRegistry();
  registerConnector(makeConnector('pinterest', [ok([point('pinterest', 'followers', 7), point('pinterest', 'views', 70)])]));
  const brokenDb = makeClient({ connections: [liveConnection('pinterest')], failOnCreate: true });
  let surfaced: unknown = null;
  try {
    await runCareerSync({ ...base, client: brokenDb.handle });
  } catch (error) {
    surfaced = error;
  }
  check(G, 'caída de BD se PROPAGA (no se captura para devolver verde)', surfaced !== null, 'no lanzó');
  checkEqual(G, 'compensación: 0 filas tras el rollback', brokenDb.rows().length, 0);

  // FACHADA AF-2: conexión `live` sin sobre cifrado => FAILED, 0 escrituras y sin red.
  clearConnectorRegistry();
  const neverCalled = makeConnector('sgae', [ok([point('sgae', 'revenue_cents', 10_000)])]);
  registerConnector(neverCalled);
  const facadeDb = makeClient({ connections: [liveConnection('sgae', { encryptedToken: null })] });
  const facadeReport = await runCareerSync({ ...base, client: facadeDb.handle });
  checkEqual(G, 'live sin credencial: FAILED', facadeReport.connections[0]?.state, 'FAILED');
  checkEqual(G, 'live sin credencial: 0 llamadas al proveedor', neverCalled.calls(), 0);
  checkEqual(G, 'live sin credencial: 0 filas', facadeDb.rows().length, 0);

  // El reporte declara persistencia real de forma explícita.
  checkEqual(G, 'reporte: mode=REAL', facadeReport.persistence.mode, SYNC_PERSISTENCE_MARKERS.mode);
  checkEqual(G, 'reporte: source=live', facadeReport.persistence.source, SYNC_PERSISTENCE_MARKERS.source);
  checkEqual(G, 'reporte: persisted=true', facadeReport.persistence.persisted, true);
  checkEqual(G, 'DLQ por fachada lleva código UNAUTHORIZED', facadeReport.deadLetter?.errorCode, 'UNAUTHORIZED');
  clearConnectorRegistry();
}

// ── CRITERIO 3 · Cero `any` y Zona Cero intacta ─────────────────────────────

const ANY_RE = /(?::\s*any\b|<any>|\bas\s+any\b)/;

function testZeroAnyAndZonaCero(): void {
  const G = '3.zona-cero';
  const files = [
    'src/lib/career/sync-orchestrator.ts',
    'src/lib/career/connectors/types.ts',
    'src/lib/career/platform-registry.ts',
  ];
  let offenders = 0;
  for (const rel of files) {
    const source = fs.readFileSync(path.join(ROOT, rel), 'utf8');
    source.split(/\r?\n/).forEach((line, index) => {
      if (ANY_RE.test(line) && !/^\s*(\/\/|\*)/.test(line)) {
        offenders += 1;
        record(G, `sin any en ${rel}:${index + 1}`, false, line.trim());
      }
    });
  }
  check(G, 'cero `any` explícito en los 3 ficheros del dominio (0 offenders)', offenders === 0, `offenders=${offenders}`);

  // ZONA CERO: se invoca el gate canónico `npm run audit:ssot`
  // (scripts/baseline_ssot_integrity.ts). Recalcular aquí un SHA-256 del fichero
  // crudo daría un FALSO NEGATIVO medido: el centinela hashea una vista
  // CANÓNICA del SSOT (ebc011a0…), no los bytes del archivo (d8f171fe…).
  // El juez es el instrumento oficial, no una copia local de la regla.
  const ssotPath = path.join(ROOT, 'src/lib/constants/ear-os-ssot.ts');
  check(G, 'Zona Cero: src/lib/constants/ear-os-ssot.ts existe', fs.existsSync(ssotPath), 'ausente');
  const rawHashBefore = createHash('sha256').update(fs.readFileSync(ssotPath)).digest('hex');

  const gate = spawnSync(
    process.execPath,
    [path.join(ROOT, 'node_modules/tsx/dist/cli.mjs'), path.join(ROOT, 'scripts/baseline_ssot_integrity.ts')],
    { cwd: ROOT, encoding: 'utf8', timeout: 120_000 },
  );
  const gateOut = `${gate.stdout ?? ''}${gate.stderr ?? ''}`;
  checkEqual(G, 'Zona Cero: npm run audit:ssot Exit Code 0', gate.status, 0);
  check(
    G,
    'Zona Cero: hash del SSOT coincide con la referencia (INV-05)',
    /coincide\s*:\s*S[ÍI]/u.test(gateOut) || /coincide\s*:\s*SI/i.test(gateOut),
    gateOut.split(/\r?\n/).filter((l) => /coincide|hash/i.test(l)).join(' | ') || 'sin salida',
  );

  // MUTACIÓN NEGATIVA (falsabilidad de la puerta, no retórica): se altera el
  // VALOR CANÓNICO de la tarifa base (INV-01, 350,00 €) y el gate DEBE salir != 0.
  // Medido: alterar un COMENTARIO no cambia el hash canónico (la puerta lo ignora a
  // propósito); bajar el precio del CEO sí. El fichero se restaura siempre.
  const original = fs.readFileSync(ssotPath);
  const priceLine = 'export const TARIFA_BASE_SOLISTA_EUR: number = 350.0;';
  const mutatedLine = 'export const TARIFA_BASE_SOLISTA_EUR: number = 340.0;';
  // Mutación en bytes EXACTOS: se trabaja sobre el texto en memoria y se escribe
  // SIEMPRE con la misma normalización, de modo que la restauración sea byte a
  // byte (un LF inesperado en el SSOT rompería el contrato INV-05 por accidente).
  const originalText = original.toString('utf8');
  check(G, 'mutación: la línea canónica de tarifa existe en el SSOT', originalText.includes(priceLine), 'no encontrada');
  const eol = originalText.includes('\r\n') ? '\r\n' : '\n';
  try {
    fs.writeFileSync(ssotPath, originalText.replace(priceLine, mutatedLine), { encoding: 'utf8', flags: 'w' });
    const mutated = spawnSync(
      process.execPath,
      [path.join(ROOT, 'node_modules/tsx/dist/cli.mjs'), path.join(ROOT, 'scripts/baseline_ssot_integrity.ts')],
      { cwd: ROOT, encoding: 'utf8', timeout: 120_000 },
    );
    check(G, 'Zona Cero: bajar la tarifa base hace fallar la puerta (Exit != 0)', mutated.status !== 0, `exit=${mutated.status}`);
  } finally {
    // Restauración garantizada: el SSOT NUNCA debe quedar alterado (INV-05).
    for (let attempt = 0; attempt < 3; attempt += 1) {
      try {
        fs.writeFileSync(ssotPath, original);
        break;
      } catch {
        spawnSync('powershell.exe', ['-NoProfile', '-Command', 'Start-Sleep -Milliseconds 120'], { encoding: 'utf8' });
      }
    }
  }
  const restored = createHash('sha256').update(fs.readFileSync(ssotPath)).digest('hex');
  check(
    G,
    'Zona Cero: SSOT restaurado byte a byte tras la mutación',
    restored === rawHashBefore,
    `antes=${rawHashBefore} ahora=${restored}`,
  );
}


// ── CRITERIO 2bis · Idempotencia contra PostgreSQL REAL ─────────────────────

interface EphemeralDatabase {
  readonly url: string;
  readonly stop: () => Promise<void>;
  readonly detail: string | null;
}

/**
 * Ejecuta un script SQL sentencia a sentencia (respeta bloques `DO $$ … $$`).
 * Reutiliza el mismo criterio que scripts/create_career_os_migration.cjs:
 * `CREATE TYPE` / `ADD CONSTRAINT` ya existentes se toleran (redeploy).
 */
async function executeSqlScript(
  client: PrismaClient,
  script: string,
  label: string,
): Promise<number> {
  const statements: string[] = [];
  let buffer = '';
  let inDollarBlock = false;
  for (const rawLine of script.split('\n')) {
    const line = rawLine.replace(/\r$/, '');
    const trimmed = line.trim();
    if (trimmed.startsWith('--')) continue;
    buffer += `${line}\n`;
    if (trimmed.includes('$$') && (trimmed.match(/\$\$/g) ?? []).length === 1) {
      inDollarBlock = !inDollarBlock;
    }
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
      if (!/already exists|duplicate/i.test(message)) {
        throw new Error(`[${label}] ${message.slice(0, 300)}`);
      }
    }
  }
  return applied;
}

/** URL de Prisma fijada a un esquema dedicado: aísla el arnés del estado residual. */
function scopedUrl(baseUrl: string, schema: string): string {
  const url = new URL(baseUrl);
  url.searchParams.set('schema', schema);
  return url.toString();
}

const PG_CTL = path.join(ROOT, 'node_modules', '@embedded-postgres', 'windows-x64', 'native', 'bin', 'pg_ctl.exe');
const PG_DATA = path.join(ROOT, 'node_modules', '.cache', 'ear-ephemeral-pg', 'data');
/** Puertos que el resolver efímero puede ocupar (principal + fallback), como en ephemeral-postgres.cjs. */
const PG_PORTS = [
  Number(process.env.EAR_EPHEMERAL_PG_PORT ?? 55_432),
  Number(process.env.EAR_EPHEMERAL_PG_FALLBACK_PORT ?? 55_433),
];

/** ¿El PID vivo detrás del socket? Un PID fantasma (socket huérfano) no se puede matar. */
function isLivePid(pid: number): boolean {
  const out = spawnSync('C:/Windows/System32/tasklist.exe', ['/FI', `PID eq ${pid}`], { encoding: 'utf8' });
  return /\b\d+\b/.test(out.stdout ?? '') && !/no hay tareas|no tasks/i.test(out.stdout ?? '');
}

function listenerPids(port: number): readonly number[] {
  const out = spawnSync('netstat', ['-ano'], { encoding: 'utf8' });
  if (out.stdout === null || out.stdout === undefined) return [];
  const pids = new Set<number>();
  for (const line of out.stdout.split(/\r?\n/)) {
    if (!line.includes(`:${port} `) || !line.includes('LISTENING')) continue;
    const pid = Number(line.trim().split(/\s+/).pop());
    if (Number.isInteger(pid) && pid > 0) pids.add(pid);
  }
  return [...pids];
}

/**
 * `embedded-postgres` mata el postmaster con `taskkill /F` sin esperar al ÁRBOL
 * real: `postgres.exe` sobrevive con el puerto en escucha (zombie) y envenena la
 * siguiente ejecución. Se termina con Win32 (OpenProcess/TerminateProcess),
 * idéntico a scripts/ledger_append_claim.cjs, y se libera el `postmaster.pid`.
 *
 * MEDIDO: hay sockets huérfanos con un PID que ya no existe en el SO (`tasklist`
 * no lo encuentra). Esos no se pueden matar y por eso el resolver cae al puerto
 * de fallback; aquí se barren AMBOS puertos. Nunca se borra el clúster salvo que
 * esté corrupto (sin `postmaster.pid` o con `pg_ctl status` != 0).
 */
function reapOrphanCluster(): void {
  if (process.platform !== 'win32') return;
  if (!fs.existsSync(PG_CTL) || !fs.existsSync(PG_DATA)) return;
  const pidFile = path.join(PG_DATA, 'postmaster.pid');
  const status = spawnSync(PG_CTL, ['-D', PG_DATA, 'status'], { encoding: 'utf8' });
  const healthy = status.status === 0 && fs.existsSync(pidFile);
  if (healthy) return; // Clúster sano en marcha: no se toca.

  for (const port of PG_PORTS) {
    for (const pid of listenerPids(port)) {
      if (!isLivePid(pid)) continue; // Socket huérfano: no hay proceso que matar.
      const script = [
        "Add-Type -Namespace EarHarness -Name Win32 -MemberDefinition '@",
        '[DllImport("kernel32.dll", SetLastError=true)] public static extern System.IntPtr OpenProcess(int access, bool inherit, int pid);',
        '[DllImport("kernel32.dll", SetLastError=true)] public static extern bool TerminateProcess(System.IntPtr h, uint code);',
        '[DllImport("kernel32.dll", SetLastError=true)] public static extern bool CloseHandle(System.IntPtr h);',
        "'@",
        '-ErrorAction SilentlyContinue',
        `$h=[EarHarness.Win32]::OpenProcess(0x1000,$false,${pid})`,
        'if($h -ne [System.IntPtr]::Zero){',
        '  [void][EarHarness.Win32]::TerminateProcess($h,1)',
        '  [void][EarHarness.Win32]::CloseHandle($h)',
        '}',
      ].join('\n');
      spawnSync('powershell.exe', ['-NoProfile', '-Command', script], { encoding: 'utf8' });
    }
  }

  // Clúster corrupto (postmaster muerto): el directorio de datos ya no sirve y
  // `embedded-postgres` lo regenerará. Sin esta limpieza el efímero no arranca.
  if (!fs.existsSync(pidFile)) {
    const dataRoot = path.dirname(PG_DATA);
    try {
      fs.rmSync(dataRoot, { recursive: true, force: true, maxRetries: 3 });
    } catch {
      // Si Windows conserva un handle, el resolver caerá al fallback: se declara.
    }
  }
}
async function resolveDatabase(): Promise<EphemeralDatabase | null> {
  const mod = requireCjs('./lib/ephemeral-postgres.cjs') as {
    resolveVerificationDatabase: () => Promise<EphemeralDatabase | null>;
  };
  return mod.resolveVerificationDatabase();
}

/**
 * Idempotencia contra PostgreSQL REAL (no SQLite, no memoria: AF-5).
 * El clúster efímero solo aplica la migración de telemetría, así que este arnés
 * levanta un ESQUEMA DEDICADO por ejecución y aplica 0_baseline + la migración
 * Career OS (20261110195500), igual que un deploy de Coolify. Al terminar, el
 * esquema se destruye con CASCADE.
 */
async function withRealDatabase(): Promise<void> {
  const G = '2.idempotencia-postgres';
  // Punto de partida limpio: un zombie del arnés no puede invalidar la prueba.
  reapOrphanCluster();
  const database = await resolveDatabase();
  if (database === null) {
    if (!JSON_ONLY) console.log('SIN_EVIDENCIA: sin PostgreSQL verificable. No se firma verde por defecto (AF-5).');
    process.exit(2);
  }

  const schemaName = `w53t03_verify_${process.pid}`;
  const { PrismaClient } = requireCjs('@prisma/client') as { PrismaClient: new () => PrismaClient };
  const client = new PrismaClient({ datasources: { db: { url: scopedUrl(database.url, schemaName) } }, log: [] });
  const stamp = Date.now();
  const artistId = `w53t03-artist-${stamp}`;
  const platformId = 'spotify';
  const at = new Date(Date.UTC(2026, 10, 11, 12, 0, 0));

  try {
    // El esquema debe EXISTIR antes de aplicarle DDL (PostgreSQL no lo crea solo).
    await client.$executeRawUnsafe(`CREATE SCHEMA IF NOT EXISTS "${schemaName}"`);
    // 0_baseline crea `artistProfile` (SSOT de identidad); la migración Career OS
    // cuelga de ella. Mismo orden que un deploy real de Coolify.
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
    check(G, 'migración Career OS aplicada contra PostgreSQL real (>0 sentencias)', applied > 0, `sentencias=${applied}`);

    // ANCLAJE DE IDENTIDAD (medido en disco, no asumido): en tiempo de ejecución
    // `client.artistProfile` resuelve a la extensión espejo `ArtistProfile`
    // (career_artist_profile, DMMF kind=object), mientras que la tabla base
    // `artistProfile` (SSOT de identidad) solo es alcanzable por SQL. Se siembra el
    // SSOT primero (User + artistProfile) y después la extensión 1:1.
    const userId = `w53t03-user-${stamp}`;
    await client.$executeRawUnsafe(
      `INSERT INTO "User" ("id","email","displayName","updatedAt") VALUES ($1,$2,$3,NOW())`,
      userId,
      `w53t03-${stamp}@example.invalid`,
      'W53_T03 fixture',
    );
    await client.$executeRawUnsafe(
      `INSERT INTO "artistProfile" ("id","userId","slug","genres","updatedAt") VALUES ($1,$2,$3,ARRAY[]::TEXT[],NOW())`,
      artistId,
      userId,
      `w53t03-${stamp}`,
    );
    await client.artistProfile.create({ data: { id: artistId }, select: { id: true } });
    await client.platformConnection.create({
      data: {
        artistId,
        platformId,
        status: 'live',
        encryptedToken: VALID_ENVELOPE,
      },
      select: { id: true },
    });

    const batch: readonly MetricPoint[] = [
      point(platformId, 'plays', 1_500, at.toISOString(), artistId),
      point(platformId, 'followers', 88, at.toISOString(), artistId),
    ];
    clearConnectorRegistry();
    registerConnector(makeConnector(platformId, [ok(batch)]));

    const options = {
      client: client as unknown as SyncPrismaHandle,
      artistId,
      retryPolicy: FAST_POLICY,
      sleep: async () => undefined,
      decrypt: identityDecrypt,
      now: fixedNow,
      deadLetterSink: () => undefined,
    } as const;

    const run1 = await runCareerSync(options);
    const rowsAfter1 = await countConnectionSnapshots(client as unknown as SyncPrismaHandle, { artistId, platformId });
    const run2 = await runCareerSync(options);
    const rowsAfter2 = await countConnectionSnapshots(client as unknown as SyncPrismaHandle, { artistId, platformId });

    checkEqual(G, 'PostgreSQL real: 1ª ejecución SYNED 2 puntos', run1.connections[0]?.pointsReceived, 2);
    checkEqual(G, 'PostgreSQL real: 1ª ejecución escribe 2 filas', rowsAfter1, 2);
    checkEqual(G, 'PostgreSQL real: 2ª ejecución = MISMAS filas (idempotencia)', rowsAfter2, rowsAfter1);
    checkEqual(G, 'PostgreSQL real: 2ª ejecución escribe 0 filas', run2.rowsWritten, 0);
    checkEqual(G, 'PostgreSQL real: persistencia declarada REAL', run1.persistence.mode, 'REAL');
    checkEqual(G, 'PostgreSQL real: persisted=true', run1.persistence.persisted, true);

    const persisted = await client.metricSnapshot.findMany({
      where: { artistId, platformId },
      select: { metric: true, value: true, source: true, provenanceHash: true },
      orderBy: { metric: 'asc' },
    });
    checkEqual(G, 'PostgreSQL real: valores en céntimos enteros conservados', persisted.map((r) => r.value).join(','), '88,1500');
    check(G, 'PostgreSQL real: procedencia SHA-256 en cada fila', persisted.every((r) => (r.provenanceHash ?? '').length === 64), JSON.stringify(persisted.map((r) => r.provenanceHash)));
    checkEqual(G, 'PostgreSQL real: source honesto = api (oauth_api)', persisted[0]?.source, 'api');
  } finally {
    // Limpieza dura: el esquema dedicado (y toda fila de prueba) muere con CASCADE.
    await client.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schemaName}" CASCADE`).catch(() => undefined);
    await client.$disconnect().catch(() => undefined);
    await database.stop().catch(() => undefined);
    reapOrphanCluster();
  }
}


// ── Canal de fallo del propio arnés (falsabilidad probada, no declarada) ────

/**
 * Si el arnés no sabe fallar, no es una prueba. Este canal ejecuta una aserción
 * deliberadamente falsa y comprueba que el veredicto se convierte en FALLO.
 */
function selfTestChannel(): boolean {
  const previous = [...results];
  results.length = 0;
  check('self', 'aserción verdadera de control', true);
  checkEqual('self', 'aserción falsa deliberada', 1, 2);
  const detected = results.some((r) => !r.ok);
  const allTrue = results.every((r) => r.ok);
  results.length = 0;
  results.push(...previous);
  return detected && !allTrue;
}

// ── Runner ──────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  if (SELF_TEST) {
    const channelOk = selfTestChannel();
    console.log(`SYNC_ORCHESTRATOR=${channelOk ? 'SELF_TEST_PASS' : 'SELF_TEST_FAIL'} · el canal de fallo ${channelOk ? 'detecta' : 'NO detecta'} una aserción falsa`);
    process.exit(channelOk ? 0 : 1);
  }

  // Reloj inyectado para TODA la ejecución: el orquestador y el doble de conector
  // comparten la misma fuente de tiempo (la aserción INV-17 compara ambos).
  injectedNow = fixedNow;

  await testHostileProvider();
  testRetryPolicy();
  await testIdempotenceAndCompensation();
  testZeroAnyAndZonaCero();
  await withRealDatabase();

  checkEqual('contrato', 'deadline de intento = now() + 8000 ms (INV-17)', SYNC_ATTEMPT_TIMEOUT_MS, 8_000);

  const failures = results.filter((r) => !r.ok);
  const healthy = failures.length === 0;
  const groups = [...new Set(results.map((r) => r.group))];

  if (JSON_ONLY) {
    console.log(
      JSON.stringify(
        {
          harness: 'verify_sync_orchestrator.ts',
          task: 'W53_T03',
          ts: new Date().toISOString(),
          verdict: healthy ? 'PASS' : 'FAIL',
          assertions: results.length,
          failures: failures.length,
          groups,
          checks: results,
        },
        null,
        2,
      ),
    );
  } else {
    console.log('── ARNÉS GOLDFISH · W53_T03 ORQUESTADOR DE SINCRONIZACIÓN ─────');
    for (const group of groups) {
      const inGroup = results.filter((r) => r.group === group);
      const bad = inGroup.filter((r) => !r.ok);
      console.log(`${bad.length === 0 ? 'PASS' : 'FAIL'} · ${group} (${inGroup.length - bad.length}/${inGroup.length})`);
      for (const item of bad) console.log(`   · ${item.name} :: ${item.detail ?? ''}`);
    }
    console.log(`aserciones: ${results.length - failures.length}/${results.length} · fallos: ${failures.length}`);
  }

  console.log(`SYNC_ORCHESTRATOR=${healthy ? 'PASS' : 'FAIL'}`);
  process.exit(healthy ? 0 : 1);
}

await main();

