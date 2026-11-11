#!/usr/bin/env -S node ./node_modules/tsx/dist/cli.mjs
/**
 * ════════════════════════════════════════════════════════════════════════════
 * ARNÉS FALSABLE · W53_T05 · CRON DE SINCRONIZACIÓN DE CARRERA
 * ════════════════════════════════════════════════════════════════════════════
 * `node ./node_modules/tsx/dist/cli.mjs scripts/verify_career_sync_cron.ts`
 *
 * Qué prueba (y por qué cada grupo puede FALLAR de verdad):
 *   1. ventana        — `schedule.ts` es puro: 15 min para `oauth_api`, `null`
 *                       = DUE, skew de reloj = DUE, `csv_import`/`manual` fuera.
 *                       Si alguien cambia el intervalo o confunde «nunca
 *                       sincronizada» con «no toca», este grupo cae.
 *   2. auth           — la ruta real (`GET`) con el SSOT `cronSecretGuard`:
 *                       producción sin secreto => 503, sin cabecera => 401,
 *                       cabecera distinta => 401, correcta => 200.
 *   3. seleccion      — con Prisma y orquestador inyectados: una conexión fuera
 *                       de ventana NO se toca; una nunca sincronizada SÍ; una de
 *                       `csv_import` se declara `skipped` y jamás se sincroniza.
 *   4. sello          — `persisted` se DERIVA de la transacción: 0 filas => false,
 *                       filas confirmadas => true. Un sello constante (la deuda de
 *                       W53_T03) hace caer este grupo.
 *   5. higiene        — ni el secreto de cron ni los tokens aparecen en la
 *                       respuesta ni en la consola (INV-14).
 *   6. postgres-real  — idempotencia con PostgreSQL real (0_baseline + la
 *                       migración Career OS en un esquema dedicado): dos pasadas
 *                       del MISMO payload => mismas filas. Sin PostgreSQL
 *                       verificable el arnés NO firma verde (AF-5).
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
  OAUTH_SYNC_INTERVAL_MINUTES,
  SYNC_INTERVAL_MINUTES,
  evaluateSyncEligibility,
  intervalMsForMode,
  isSyncableMode,
  partitionByDue,
} from '../src/lib/career/schedule';
import {
  computeProvenanceHash,
  countConnectionSnapshots,
  persistenceFor,
  runCareerSync,
  type SyncPrismaHandle,
} from '../src/lib/career/sync-orchestrator';
import {
  registerConnector,
  type Connector,
  type ConnectorCredential,
  type ConnectorPullInput,
} from '../src/lib/career/connectors/types';
import type { MetricPoint } from '../src/lib/career/platform-registry';
import { decryptToken, encryptToken } from '../src/lib/career/token-vault';
import { generateStateSecret } from '../src/lib/career/oauth-flow';

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

function checkIncludes(group: string, name: string, haystack: string, needle: string): void {
  record(group, name, haystack.includes(needle), `no contiene «${needle}»`);
}

function checkExcludes(group: string, name: string, haystack: string, needle: string): void {
  record(group, name, !haystack.includes(needle), `FUGA: contiene «${needle}»`);
}

// ── Fixtures ────────────────────────────────────────────────────────────────

const VAULT_KEY = generateStateSecret();
const CRON_SECRET = generateStateSecret();
const WRONG_CRON_SECRET = generateStateSecret();
const ARTIST_ID = 'artist-w53t05-fixture';
const PLATFORM = 'spotify';
const ACCESS_TOKEN = 'access-token-w53t05-ficticio';
const T0 = Date.UTC(2026, 10, 11, 10, 0, 0);

const VAULT_ENV: Record<string, string> = { CAREER_TOKEN_KEY: VAULT_KEY };
const CRON_ENV: NodeJS.ProcessEnv = { NODE_ENV: 'production', CRON_SECRET };

// ── 1 · Ventana de sincronización (función pura, reloj inyectado) ───────────

function checkScheduleWindow(): void {
  const G = '1.ventana';
  const now = new Date(T0);

  checkEqual(G, 'intervalo canónico = 15 min', OAUTH_SYNC_INTERVAL_MINUTES, 15);
  checkEqual(G, 'intervalo oauth_api (min)', SYNC_INTERVAL_MINUTES.oauth_api, 15);
  checkEqual(G, 'intervalo csv_import (min)', SYNC_INTERVAL_MINUTES.csv_import, 0);
  checkEqual(G, 'intervalo manual (min)', SYNC_INTERVAL_MINUTES.manual, 0);
  checkEqual(G, 'intervalo webhook (min)', SYNC_INTERVAL_MINUTES.webhook, 0);
  checkEqual(G, 'ms de intervalo oauth_api', intervalMsForMode('oauth_api'), 900_000);
  check(G, 'oauth_api es sincronizable', isSyncableMode('oauth_api'));
  check(G, 'csv_import NO es sincronizable', !isSyncableMode('csv_import'));
  check(G, 'manual NO es sincronizable', !isSyncableMode('manual'));

  // Nunca sincronizada: DEBE entrar (primera sync del artista).
  const never = evaluateSyncEligibility({ platformId: PLATFORM, lastSyncAt: null }, now);
  check(G, 'lastSyncAt null => due', never.due);
  checkEqual(G, 'lastSyncAt null => DUE_NEVER_SYNCED', never.reason, 'DUE_NEVER_SYNCED');
  checkEqual(G, 'lastSyncAt null => lastSyncAt null', never.lastSyncAt, null);

  // Hace 14 min: todavía no toca; minutos restantes = 1.
  const fresh = evaluateSyncEligibility(
    { platformId: PLATFORM, lastSyncAt: new Date(T0 - 14 * 60_000) },
    now,
  );
  check(G, 'hace 14 min => NO due', !fresh.due);
  checkEqual(G, 'hace 14 min => NOT_DUE', fresh.reason, 'NOT_DUE');
  checkEqual(G, 'hace 14 min => 1 min restante', fresh.minutesUntilDue, 1);

  // Frontera exacta a 15 min: entra (>= intervalo).
  const boundary = evaluateSyncEligibility(
    { platformId: PLATFORM, lastSyncAt: new Date(T0 - 15 * 60_000) },
    now,
  );
  check(G, 'exactamente 15 min => due (frontera inclusiva)', boundary.due);
  checkEqual(G, 'exactamente 15 min => DUE_INTERVAL_ELAPSED', boundary.reason, 'DUE_INTERVAL_ELAPSED');

  // 1 ms antes de la frontera: no toca.
  const justBefore = evaluateSyncEligibility(
    { platformId: PLATFORM, lastSyncAt: new Date(T0 - 900_000 + 1) },
    now,
  );
  check(G, '1 ms antes de la frontera => NO due', !justBefore.due);

  // Fecha futura (reloj movido hacia atrás): se reintenta, no se duerme.
  const skew = evaluateSyncEligibility({ platformId: PLATFORM, lastSyncAt: new Date(T0 + 3600_000) }, now);
  check(G, 'lastSyncAt futuro => due', skew.due);
  checkEqual(G, 'lastSyncAt futuro => DUE_CLOCK_SKEW', skew.reason, 'DUE_CLOCK_SKEW');

  // Iso string aceptado (lo que devuelve la BD serializada).
  const iso = evaluateSyncEligibility(
    { platformId: PLATFORM, lastSyncAt: new Date(T0 - 3600_000).toISOString() },
    now,
  );
  check(G, 'ISO string hace 1 h => due', iso.due);

  // Modo no sincronizable: `apple-music` es csv_import en el SSOT.
  const csv = evaluateSyncEligibility(
    { platformId: 'apple-music', lastSyncAt: new Date(T0 - 86_400_000) },
    now,
  );
  check(G, 'csv_import viejo => NO due', !csv.due);
  checkEqual(G, 'csv_import => MODE_NOT_SYNCABLE', csv.reason, 'MODE_NOT_SYNCABLE');
  checkEqual(G, 'csv_import => syncMode declarado', csv.syncMode, 'csv_import');

  // Plataforma fuera del SSOT: nunca se inventa.
  const unknown = evaluateSyncEligibility({ platformId: 'plataforma-inventada', lastSyncAt: null }, now);
  check(G, 'plataforma fuera del SSOT => NO due', !unknown.due);
  checkEqual(G, 'plataforma fuera del SSOT => PLATFORM_UNKNOWN', unknown.reason, 'PLATFORM_UNKNOWN');
  checkEqual(G, 'plataforma fuera del SSOT => sin modo', unknown.syncMode, null);

  // Partición estable.
  const batch = [
    { id: 'c1', platformId: 'spotify', lastSyncAt: null },
    { id: 'c2', platformId: 'spotify', lastSyncAt: new Date(T0 - 60_000) },
    { id: 'c3', platformId: 'deezer', lastSyncAt: new Date(T0 - 3600_000) },
    { id: 'c4', platformId: 'apple-music', lastSyncAt: null },
  ];
  const split = partitionByDue(batch, now);
  checkEqual(G, 'partición: 2 due', split.due.length, 2);
  checkEqual(G, 'partición: 2 skipped', split.skipped.length, 2);
  checkEqual(G, 'partición: orden estable de due', split.due.map((c) => c.id).join(','), 'c1,c3');
}

// ── 2 · Autenticación real de la ruta (SSOT cronSecretGuard) ────────────────

interface RouteModule {
  GET: (req: Request) => Promise<{ status: number; json: () => Promise<unknown> }>;
}

function bearer(secret: string): Request {
  return new Request('https://productoraear.com/api/cron/career-sync', {
    headers: { authorization: `Bearer ${secret}` },
  });
}

const CRON_ENV_KEYS = ['CRON_SECRET', 'CRON_SECRET_SECONDARY', 'NODE_ENV'] as const;

/** Fija el entorno del guard durante una comprobación y restaura TODO después. */
async function withCronEnv<T>(env: NodeJS.ProcessEnv, fn: () => Promise<T>): Promise<T> {
  const snapshot = new Map<string, string | undefined>();
  for (const key of CRON_ENV_KEYS) {
    snapshot.set(key, process.env[key]);
    const value = env[key];
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
  try {
    return await fn();
  } finally {
    for (const [key, value] of snapshot) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  }
}

async function checkRouteAuth(): Promise<void> {
  const G = '2.auth';
  const mod = (await import('../src/app/api/cron/career-sync/route')) as unknown as RouteModule;

  const notConfigured = await withCronEnv({ NODE_ENV: 'production' }, async () =>
    mod.GET(new Request('https://productoraear.com/api/cron/career-sync')),
  );
  checkEqual(G, 'producción sin CRON_SECRET => 503 (fail-closed)', notConfigured.status, 503);
  const ncBody = (await notConfigured.json()) as { code?: string };
  checkEqual(G, 'cuerpo del 503 declara NOT_CONFIGURED', ncBody.code, 'CRON_SECRET_NOT_CONFIGURED');

  const noHeader = await withCronEnv(CRON_ENV, async () =>
    mod.GET(new Request('https://productoraear.com/api/cron/career-sync')),
  );
  checkEqual(G, 'sin cabecera => 401', noHeader.status, 401);
  const nhBody = (await noHeader.json()) as { code?: string };
  checkEqual(G, 'cuerpo del 401 declara ABSENT', nhBody.code, 'CRON_SECRET_ABSENT');

  const wrong = await withCronEnv(CRON_ENV, async () => mod.GET(bearer(WRONG_CRON_SECRET)));
  checkEqual(G, 'cabecera distinta => 401', wrong.status, 401);
  const wrongBody = (await wrong.json()) as { code?: string };
  checkEqual(G, 'cuerpo del 401 declara MISMATCH', wrongBody.code, 'CRON_SECRET_MISMATCH');

  // Ruta protegida por defecto: sin secreto NUNCA hay 200 (SEC-1).
  check(G, 'sin secreto jamás 200', noHeader.status !== 200 && notConfigured.status !== 200);

  // Con credencial válida la petición cruza el guard. La base no está disponible
  // en local => 503 DEPENDENCY_UNAVAILABLE: es un NO-VERDE explícito, no un 200
  // de fachada. Si el guard bloqueara, el código sería CRON_SECRET_*.
  const authorized = await withCronEnv(CRON_ENV, async () => mod.GET(bearer(CRON_SECRET)));
  const authBody = (await authorized.json()) as { code?: string; ok?: boolean };
  check(G, 'credencial válida cruza el guard (no 401/CRON_SECRET_*)',
    authorized.status !== 401 && authBody.code !== 'CRON_SECRET_MISMATCH',
    `status=${authorized.status} code=${String(authBody.code)}`);
  check(G, 'sin base de datos no se declara ok:true', authBody.ok !== true);
}

// ── 3 · Selección de trabajo + 4 · sello derivado ───────────────────────────

/** Doble de Prisma: un OBJETO PLANO con los tres miembros que el orquestador usa. */
function makeHandle(impl: unknown): SyncPrismaHandle {
  const source = impl as Record<string, unknown>;
  return {
    platformConnection: source.platformConnection as SyncPrismaHandle['platformConnection'],
    metricSnapshot: source.metricSnapshot as SyncPrismaHandle['metricSnapshot'],
    $transaction: source.$transaction as SyncPrismaHandle['$transaction'],
  };
}

const ADAPTER_STATE = { fetchCalls: 0, points: [] as readonly MetricPoint[] };

/** Conector doble registrado en el SSOT (spotify es oauth_api). Sin red. */
function installFakeConnector(): void {
  const connector: Connector = {
    platformId: PLATFORM,
    authUrl: (state: string) => `https://example.invalid/authorize?state=${state}`,
    exchangeCode: async (): Promise<ConnectorCredential> => ({
      accessToken: 'no-usado',
      refreshToken: null,
      expiresAt: null,
    }),
    refresh: async (): Promise<ConnectorCredential> => ({
      accessToken: 'no-usado',
      refreshToken: null,
      expiresAt: null,
    }),
    fetchMetrics: async (): Promise<readonly MetricPoint[]> => {
      ADAPTER_STATE.fetchCalls += 1;
      return ADAPTER_STATE.points;
    },
  };
  registerConnector(connector);
}

interface HarnessConnection {
  readonly id: string;
  readonly artistId: string;
  readonly platformId: string;
  readonly encryptedToken: string | null;
  readonly lastSyncAt: Date | null;
}

function makeConnection(overrides: Partial<HarnessConnection>): HarnessConnection {
  return {
    id: 'conn-1',
    artistId: ARTIST_ID,
    platformId: PLATFORM,
    encryptedToken: encryptToken(ACCESS_TOKEN, { env: VAULT_ENV }),
    lastSyncAt: null,
    ...overrides,
  };
}

async function checkSelectionAndSeal(): Promise<void> {
  const G = '3.seleccion';
  installFakeConnector();

  // (a) Conexión DENTRO de ventana => el cron la descarta antes de tocar la base.
  const recent = makeConnection({ lastSyncAt: new Date(Date.now() - 60_000) });
  ADAPTER_STATE.fetchCalls = 0;
  ADAPTER_STATE.points = [];
  const { due: quietDue } = partitionByDue([recent], new Date());
  checkEqual(G, 'conexión dentro de ventana => 0 due', quietDue.length, 0);

  // (b) Sin trabajo que escribir: el sello NO puede declarar persistencia.
  ADAPTER_STATE.points = [];
  const emptyHandle = makeHandle({
    platformConnection: { findMany: async () => [] },
    metricSnapshot: { findMany: async () => [] },
    $transaction: async () => [],
  });
  const emptyReport = await runCareerSync({
    client: emptyHandle,
    artistId: ARTIST_ID,
    decrypt: (serialized) => decryptToken(serialized, { env: VAULT_ENV }),
  });
  checkEqual(G, 'sin conexiones: 0 filas', emptyReport.rowsWritten, 0);
  check(G, 'sin escritura: sello.persisted es falso', emptyReport.persistence.persisted === false);
  checkEqual(G, 'sello: mode REAL', emptyReport.persistence.mode, 'REAL');
  checkEqual(G, 'sello: source live', emptyReport.persistence.source, 'live');

  // (c) Conexión due con payload nuevo => sync real y persisted=true.
  const dueConnection = makeConnection({ lastSyncAt: null });
  const capturedAt = new Date(Date.now() - 120_000).toISOString();
  ADAPTER_STATE.fetchCalls = 0;
  ADAPTER_STATE.points = [
    { artistId: ARTIST_ID, platformId: PLATFORM, metric: 'plays', value: 1_234, capturedAt, source: 'api' },
  ];
  const written: string[] = [];
  const writeHandle = makeHandle({
    platformConnection: { findMany: async () => [dueConnection] },
    metricSnapshot: {
      findMany: async () => [],
      createMany: async (args: { data: readonly Prisma.MetricSnapshotCreateManyInput[] }) => {
        for (const row of args.data) written.push(String(row.metric));
        return { count: args.data.length };
      },
      update: async () => ({ id: 'nunca' }),
    },
    $transaction: async (fn: (tx: unknown) => Promise<unknown>) => fn(writeHandle),
  });
  const writeReport = await runCareerSync({
    client: writeHandle,
    artistId: ARTIST_ID,
    decrypt: (serialized) => decryptToken(serialized, { env: VAULT_ENV }),
  });
  checkEqual(G, 'due: el conector se invoca una vez', ADAPTER_STATE.fetchCalls, 1);
  checkEqual(G, 'due: 1 fila escrita', writeReport.rowsWritten, 1);
  checkEqual(G, 'due: state SYNCED', writeReport.connections[0]?.state, 'SYNCED');
  check(G, 'con escritura confirmada: persisted=true', writeReport.persistence.persisted === true);
  checkIncludes(G, 'la métrica escrita es la del conector', written.join(','), 'plays');
}

async function checkModeAndFacade(): Promise<void> {
  // (d) Modo no sincronizable (apple-music = csv_import): nunca entra en la pasada.
  const GC = '3.seleccion.csv';
  const csvSplit = partitionByDue(
    [{ id: 'conn-csv', platformId: 'apple-music', lastSyncAt: null }],
    new Date(),
  );
  checkEqual(GC, 'csv_import => 0 due', csvSplit.due.length, 0);
  checkEqual(GC, 'csv_import => 1 skipped', csvSplit.skipped.length, 1);
  checkEqual(GC, 'csv_import se declara MODE_NOT_SYNCABLE', csvSplit.skipped[0]?.eligibility.reason, 'MODE_NOT_SYNCABLE');

  // (e) Sobre cifrado inválido: fachada AF-2 => FAILED, no se salta en silencio.
  const GF = '3.seleccion.fachada';
  ADAPTER_STATE.fetchCalls = 0;
  const facade = makeConnection({ encryptedToken: 'texto-plano-no-cifrado' });
  const facadeHandle = makeHandle({
    platformConnection: { findMany: async () => [facade] },
    metricSnapshot: { findMany: async () => [] },
    $transaction: async () => [],
  });
  const facadeReport = await runCareerSync({
    client: facadeHandle,
    artistId: ARTIST_ID,
    decrypt: (serialized) => decryptToken(serialized, { env: VAULT_ENV }),
  });
  checkEqual(GF, 'sobre inválido => FAILED', facadeReport.connections[0]?.state, 'FAILED');
  checkEqual(GF, 'sobre inválido => UNAUTHORIZED', facadeReport.connections[0]?.errorCode, 'UNAUTHORIZED');
  checkEqual(GF, 'sobre inválido no invoca al conector', ADAPTER_STATE.fetchCalls, 0);
  checkEqual(GF, 'sobre inválido no escribe filas', facadeReport.rowsWritten, 0);
  check(GF, 'sobre inválido no declara persistencia', facadeReport.persistence.persisted === false);
  check(GF, 'el fallo declara la conexión en la DLQ', facadeReport.deadLetter !== null);
  checkExcludes(GF, 'la DLQ no filtra el token', JSON.stringify(facadeReport.deadLetter), ACCESS_TOKEN);

  // (f) Sello de procedencia determinista (idempotencia observable).
  const GS = '4.sello';
  const capturedAt = new Date(Date.now() - 120_000).toISOString();
  const payload: readonly MetricPoint[] = [
    { artistId: ARTIST_ID, platformId: PLATFORM, metric: 'plays', value: 7, capturedAt, source: 'api' },
  ];
  checkEqual(
    GS,
    'provenanceHash determinista (mismo payload => mismo sello)',
    computeProvenanceHash(PLATFORM, payload),
    computeProvenanceHash(PLATFORM, [...payload]),
  );
  check(
    GS,
    'persistenceFor([]) => persisted=false',
    persistenceFor([]).persisted === false,
  );
  check(
    GS,
    'persistenceFor(SYNCED con 0 filas) => persisted=false',
    persistenceFor([
      {
        connectionId: 'x',
        platformId: PLATFORM,
        state: 'SYNCED',
        pointsReceived: 3,
        rowsWritten: 0,
        attempts: 1,
        retryable: false,
        errorCode: null,
        error: null,
        lastSyncAt: null,
      },
    ]).persisted === false,
  );
  check(
    GS,
    'persistenceFor(1 fila escrita) => persisted=true',
    persistenceFor([
      {
        connectionId: 'y',
        platformId: PLATFORM,
        state: 'SYNCED',
        pointsReceived: 1,
        rowsWritten: 1,
        attempts: 1,
        retryable: false,
        errorCode: null,
        error: null,
        lastSyncAt: null,
      },
    ]).persisted === true,
  );
}

// ── 6 · PostgreSQL real: dos pasadas del MISMO payload => mismas filas ──────

interface EphemeralDatabase {
  readonly url: string;
  readonly stop: () => Promise<void>;
  readonly detail: string | null;
}

/**
 * Ejecuta un script SQL sentencia a sentencia (respeta bloques `DO $$ … $$`).
 * Mismo criterio que los arneses W53_T03/T04: `already exists` se tolera.
 */
async function executeSqlScript(client: PrismaClient, script: string, label: string): Promise<number> {
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

async function withRealDatabase(): Promise<void> {
  const G = '6.postgres-real';
  const mod = requireCjs('./lib/ephemeral-postgres.cjs') as {
    resolveVerificationDatabase: () => Promise<EphemeralDatabase | null>;
  };
  const database = await mod.resolveVerificationDatabase();
  if (database === null) {
    if (!JSON_ONLY) console.log('SIN_EVIDENCIA: sin PostgreSQL verificable. No se firma verde por defecto (AF-5).');
    process.exit(2);
  }

  const schemaName = `w53t05_verify_${process.pid}`;
  const { PrismaClient } = requireCjs('@prisma/client') as { PrismaClient: new () => PrismaClient };
  const client = new PrismaClient({ datasources: { db: { url: scopedUrl(database.url, schemaName) } }, log: [] });
  const stamp = Date.now();
  const artistId = `w53t05-artist-${stamp}`;
  const capturedAt = new Date(stamp - 120_000).toISOString();

  try {
    await client.$executeRawUnsafe(`CREATE SCHEMA IF NOT EXISTS "${schemaName}"`);
    await executeSqlScript(client, fs.readFileSync(path.join(ROOT, 'prisma/migrations/0_baseline/migration.sql'), 'utf8'), '0_baseline');
    const applied = await executeSqlScript(
      client,
      fs.readFileSync(path.join(ROOT, 'prisma/migrations/20261110195500_add_career_os_models/migration.sql'), 'utf8'),
      'W53',
    );
    check(G, 'migración Career OS aplicada contra PostgreSQL real', applied > 0, `sentencias=${applied}`);
    check(G, 'el motor de la prueba es PostgreSQL (no SQLite)', database.url.startsWith('postgres'), database.url.split(':')[0]);

    // Identidad: `artistProfile` es la tabla del SSOT; Prisma la expone como espejo.
    const userId = `w53t05-user-${stamp}`;
    await client.$executeRawUnsafe(
      'INSERT INTO "User" ("id","email","displayName","updatedAt") VALUES ($1,$2,$3,NOW())',
      userId,
      `w53t05-${stamp}@example.invalid`,
      'W53_T05 fixture',
    );
    await client.$executeRawUnsafe(
      'INSERT INTO "artistProfile" ("id","userId","slug","genres","updatedAt") VALUES ($1,$2,$3,ARRAY[]::TEXT[],NOW())',
      artistId,
      userId,
      `w53t05-${stamp}`,
    );
    await client.artistProfile.create({ data: { id: artistId }, select: { id: true } });

    // Conexión live con sobre del vault y lastSyncAt antiguo (due por intervalo).
    const envelope = encryptToken(ACCESS_TOKEN, { env: VAULT_ENV });
    await client.platformConnection.create({
      data: {
        artistId,
        platformId: PLATFORM,
        status: 'live',
        encryptedToken: envelope,
        lastSyncAt: new Date(stamp - 3_600_000),
      },
      select: { id: true },
    });

    const rows = await client.platformConnection.findMany({
      where: { artistId, platformId: PLATFORM },
      select: { id: true, platformId: true, lastSyncAt: true },
    });
    checkEqual(G, 'conexión de PostgreSQL real leída', rows.length, 1);
    const eligibility = evaluateSyncEligibility(
      { platformId: rows[0]?.platformId ?? '', lastSyncAt: rows[0]?.lastSyncAt ?? null },
      new Date(),
    );
    check(G, 'la conexión de PostgreSQL real es DUE', eligibility.due, eligibility.reason);

    // Métricas del SSOT de spotify (plays/followers): valores enteros.
    ADAPTER_STATE.points = [
      { artistId, platformId: PLATFORM, metric: 'plays', value: 42, capturedAt, source: 'api' },
      { artistId, platformId: PLATFORM, metric: 'followers', value: 7, capturedAt, source: 'api' },
    ];
    const handle = client as PrismaClient as SyncPrismaHandle;
    const decrypt = (serialized: string): string => decryptToken(serialized, { env: VAULT_ENV });

    const first = await runCareerSync({ client: handle, artistId, decrypt, sleep: async () => undefined });
    checkEqual(G, 'primera pasada: SYNCED', first.connections[0]?.state, 'SYNCED');
    checkEqual(G, 'primera pasada: 2 filas escritas', first.rowsWritten, 2);
    check(G, 'primera pasada: persisted=true', first.persistence.persisted === true);
    const afterFirst = await countConnectionSnapshots(handle, { artistId, platformId: PLATFORM });
    checkEqual(G, 'PostgreSQL real: 2 MetricSnapshot tras la primera pasada', afterFirst, 2);

    // DOS EJECUCIONES DEL MISMO PAYLOAD => MISMAS FILAS (done_when de W53_T05).
    const second = await runCareerSync({ client: handle, artistId, decrypt, sleep: async () => undefined });
    checkEqual(G, 'segunda pasada: SYNCED (el conector respondió)', second.connections[0]?.state, 'SYNCED');
    checkEqual(G, 'segunda pasada: 0 filas nuevas (idempotente)', second.rowsWritten, 0);
    check(G, 'segunda pasada: persisted=false (no hubo escritura)', second.persistence.persisted === false);
    const afterSecond = await countConnectionSnapshots(handle, { artistId, platformId: PLATFORM });
    checkEqual(G, 'PostgreSQL real: siguen siendo 2 filas (sin duplicados)', afterSecond, 2);

    const stored = await client.metricSnapshot.findMany({
      where: { artistId, platformId: PLATFORM },
      select: { metric: true, value: true, provenanceHash: true, source: true },
      orderBy: { metric: 'asc' },
    });
    checkEqual(G, 'PostgreSQL real: 2 métricas con procedencia', stored.length, 2);
    check(G, 'provenanceHash de 64 hex en cada fila', stored.every((row) => /^[0-9a-f]{64}$/.test(row.provenanceHash)));
    check(G, 'source: api (oauth_api en el SSOT)', stored.every((row) => row.source === 'api'));
    check(G, 'values enteros (cero floats en la ruta de dinero)', stored.every((row) => Number.isInteger(row.value)));
    checkExcludes(G, 'el token NO se persiste en claro', JSON.stringify(stored), ACCESS_TOKEN);
  } finally {
    await client.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schemaName}" CASCADE`).catch(() => undefined);
    await client.$disconnect().catch(() => undefined);
    await database.stop().catch(() => undefined);
  }
}

// ── Ejecución ───────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  checkScheduleWindow();
  await checkRouteAuth();
  await checkSelectionAndSeal();
  await checkModeAndFacade();

  // `--self-test`: una aserción imposible debe tumbar el arnés. Si sigue en
  // PASS con el canal de fallo roto, el veredicto se invierte y sale 1.
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
    console.log(JSON.stringify({ arnes: 'verify_career_sync_cron.ts', results, failures: failures.length }, null, 2));
  } else {
    console.log('── ARNÉS FALSABLE · W53_T05 · CRON DE SINCRONIZACIÓN DE CARRERA ──');
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
  console.log(`CAREER_SYNC_CRON=${ok ? 'PASS' : 'FAIL'}`);
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








