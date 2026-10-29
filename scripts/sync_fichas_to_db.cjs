#!/usr/bin/env node
/**
 * ════════════════════════════════════════════════════════════════════════════
 * SYNC FICHAS → POSTGRESQL 16 (W44 · ESCRITURA REAL E IDEMPOTENTE)
 * ════════════════════════════════════════════════════════════════════════════
 * Persiste las 2.150 fichas selladas de W43 en la tabla `ProviderFicha`.
 *
 * IDEMPOTENCIA (no se declara: se comprueba contra la base)
 *   1. Construye el plan de escritura completo y calcula su huella SHA-256.
 *   2. Upserta por PK natural (`key`) en transacciones por lote.
 *   3. RELEE la base, recomputa la huella del estado persistido y la compara
 *      con la del plan. Si difieren, aborta con Exit 1.
 *   => N ejecuciones producen el mismo estado lógico y 1 sola fila por ficha.
 *
 * Uso:
 *   node scripts/sync_fichas_to_db.cjs --dry-run     # plan, sin tocar la base
 *   node scripts/sync_fichas_to_db.cjs               # escribe y verifica
 *   node scripts/sync_fichas_to_db.cjs --limit=50    # lote de humo
 *
 * Exit codes: 0 = OK · 1 = aserción fallida · 2 = base inalcanzable/sin URL.
 * Cero credenciales en stdout: se imprime host/puerto/base/usuario, nunca clave.
 * ════════════════════════════════════════════════════════════════════════════
 */
'use strict';

const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const EXIT_OK = 0;
const EXIT_FAIL = 1;
const EXIT_UNAVAILABLE = 2;
const URL_ENV_ORDER = ['POSTGRES_PRISMA_URL', 'DATABASE_URL', 'POSTGRES_URL_NON_POOLING'];

const {
  PROVIDER_FICHA_COLUMNS,
  buildRows,
  describeDbTarget,
  fingerprintRows,
  upsertArgs,
} = require('./fichas_db_rows.cjs');


const USAGE = [
  'sync_fichas_to_db.cjs — persistencia idempotente de fichas en PostgreSQL 16',
  '',
  '  --dry-run        construye y valida el plan sin abrir conexión',
  '  --limit=<n>      procesa sólo las primeras n fichas (humo)',
  '  --chunk=<n>      fichas por transacción (por defecto 100)',
  '  --timeout=<ms>   timeout de conexión (por defecto 15000)',
  '  --json           salida JSON de una línea',
  '',
  'Exit: 0 = escrito y verificado · 1 = aserción rota · 2 = base inalcanzable.',
].join('\n');

function parseArgs(argv) {
  const args = { dryRun: false, json: false, limit: null, chunk: 100, timeoutMs: 15000 };
  for (const raw of argv) {
    const token = typeof raw === 'string' ? raw.trim() : '';
    if (token === '') continue;
    if (token === '--dry-run') args.dryRun = true;
    else if (token === '--json') args.json = true;
    else if (token === '--help' || token === '-h') {
      console.log(USAGE);
      process.exit(EXIT_OK);
    } else if (/^--limit=\d+$/.test(token)) args.limit = Number(token.slice('--limit='.length));
    else if (/^--chunk=\d+$/.test(token)) args.chunk = Math.max(1, Number(token.slice('--chunk='.length)));
    else if (/^--timeout=\d+$/.test(token)) args.timeoutMs = Math.max(500, Number(token.slice('--timeout='.length)));
    else throw new Error(`[fichas:sync] argumento no reconocido: ${token}`);
  }
  return args;
}

/** Carga `.env` con la API nativa (Node >= 21.7). Nunca sobreescribe el entorno. */
function loadEnvironment() {
  try {
    process.loadEnvFile(path.join(ROOT, '.env'));
  } catch {
    /* .env opcional: en CI las variables llegan del runner */
  }
}

function resolveDatabaseUrl() {
  for (const key of URL_ENV_ORDER) {
    const value = process.env[key];
    if (typeof value === 'string' && value.trim().length > 0) return { key, url: value.trim() };
  }
  return null;
}

function emit(payload, json) {
  if (json) console.log(JSON.stringify(payload));
  else console.log(JSON.stringify(payload, null, 2));
}

async function withTimeout(promise, ms, label) {
  let timer = null;
  const guard = new Promise((_resolve, reject) => {
    timer = setTimeout(() => reject(new Error(`timeout ${ms}ms en ${label}`)), ms);
  });
  try {
    return await Promise.race([promise, guard]);
  } finally {
    if (timer !== null) clearTimeout(timer);
  }
}

// ─── Capa de base de datos (reutilizada por `verify_fichas_db.ts`) ──────────

/** Trocea una lista en lotes de tamaño fijo. */
function chunkRows(items, size) {
  const batches = [];
  for (let index = 0; index < items.length; index += size) batches.push(items.slice(index, index + size));
  return batches;
}

/** Cliente Prisma con URL explícita (nunca depende del entorno implícito). */
function createPrismaClient(datasourceUrl) {
  const clientModule = require('@prisma/client');
  const PrismaClientCtor = clientModule.PrismaClient;
  if (typeof PrismaClientCtor !== 'function') {
    throw new Error('[fichas:sync] @prisma/client no expone PrismaClient: ejecuta `prisma generate`.');
  }
  return new PrismaClientCtor({ datasourceUrl, log: [] });
}

/** SELECT de las columnas de contenido (mismo orden que el checksum). */
function selectColumns() {
  const select = {};
  for (const column of PROVIDER_FICHA_COLUMNS) select[column] = true;
  return select;
}

/** Ping con timeout: una base colgada no puede colgar el pipeline. */
async function pingDatabase(prisma, timeoutMs) {
  await withTimeout(prisma.$queryRaw`SELECT 1 AS ok`, timeoutMs, 'ping');
}

/**
 * Upserta el plan y comprueba, lote a lote, que existen EXACTAMENTE tantas
 * filas como fichas enviadas (ni una de más, ni una de menos).
 * @returns {Promise<{ batches: number, written: number }>}
 */
async function upsertBatches(prisma, rows, chunkSize) {
  const batches = chunkRows(rows, chunkSize);
  let written = 0;
  for (const batch of batches) {
    await prisma.$transaction(batch.map((row) => prisma.providerFicha.upsert(upsertArgs(row))));
    const persisted = await prisma.providerFicha.count({ where: { key: { in: batch.map((row) => row.key) } } });
    if (persisted !== batch.length) {
      throw new Error(`[fichas:sync] lote inconsistente: ${persisted}/${batch.length} filas persistidas.`);
    }
    written += batch.length;
  }
  return { batches: batches.length, written };
}

/** Relee el estado persistido de las claves del plan, en lotes. */
async function readBackRows(prisma, keys, chunkSize) {
  const read = [];
  for (const batch of chunkRows(keys, chunkSize)) {
    const rows = await prisma.providerFicha.findMany({
      where: { key: { in: batch } },
      select: selectColumns(),
    });
    for (const row of rows) read.push(row);
  }
  return read;
}

function isUnavailableError(error) {
  const message = error instanceof Error ? error.message : String(error);
  return /ECONNREFUSED|ENOTFOUND|ETIMEDOUT|EHOSTUNREACH|timeout \d+ms|P1001|P1000|P1017|Can't reach database server|Connection refused|getaddrinfo/i.test(
    message,
  );
}

// ─── Orquestación ──────────────────────────────────────────────────────────

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const startedAt = Date.now();
  const plan = buildRows(args.limit === null ? {} : { limit: args.limit });
  const planSha256 = fingerprintRows(plan.rows);

  if (args.dryRun) {
    emit(
      { mode: 'dry-run', status: 'PLAN_OK', planSha256, stats: plan.stats, durationMs: Date.now() - startedAt },
      args.json,
    );
    return EXIT_OK;
  }

  loadEnvironment();
  const resolved = resolveDatabaseUrl();
  if (resolved === null) {
    console.error(`[fichas:sync] ✗ sin URL de base. Define ${URL_ENV_ORDER[0]} (o DATABASE_URL).`);
    emit({ mode: 'apply', status: 'DB_URL_MISSING', planSha256, stats: plan.stats }, args.json);
    return EXIT_UNAVAILABLE;
  }
  const target = describeDbTarget(resolved.url);

  const prisma = createPrismaClient(resolved.url);
  try {
    await pingDatabase(prisma, args.timeoutMs);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`[fichas:sync] ✗ base inalcanzable (${resolved.key}): ${message}`);
    await prisma.$disconnect().catch(() => undefined);
    emit({ mode: 'apply', status: 'DB_UNREACHABLE', target, planSha256, stats: plan.stats }, args.json);
    return EXIT_UNAVAILABLE;
  }

  try {
    const keys = plan.rows.map((row) => row.key);

    const firstPass = await upsertBatches(prisma, plan.rows, args.chunk);
    const firstSha256 = fingerprintRows(await readBackRows(prisma, keys, args.chunk));

    // Segunda pasada idéntica: el estado persistido no puede moverse ni una fila.
    const secondPass = await upsertBatches(prisma, plan.rows, args.chunk);
    const persisted = await readBackRows(prisma, keys, args.chunk);
    const secondSha256 = fingerprintRows(persisted);

    const rowsMatch = persisted.length === plan.rows.length;
    const idempotent = firstSha256 === planSha256 && secondSha256 === planSha256;

    emit(
      {
        mode: 'apply',
        status: rowsMatch && idempotent ? 'VERIFIED' : 'ASSERTION_FAILED',
        target,
        planSha256,
        firstSha256,
        secondSha256,
        stats: plan.stats,
        rowsPersisted: persisted.length,
        batches: firstPass.batches,
        upserts: firstPass.written + secondPass.written,
        durationMs: Date.now() - startedAt,
      },
      args.json,
    );

    if (!rowsMatch || !idempotent) {
      console.error('[fichas:sync] ✗ idempotencia rota: el estado persistido no reproduce el plan.');
      return EXIT_FAIL;
    }
    return EXIT_OK;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`[fichas:sync] ✗ ${message}`);
    emit({ mode: 'apply', status: 'FAILED', target, planSha256, error: message }, args.json);
    return isUnavailableError(error) ? EXIT_UNAVAILABLE : EXIT_FAIL;
  } finally {
    await prisma.$disconnect().catch(() => undefined);
  }
}

if (require.main === module) {
  main()
    .then((code) => process.exit(code))
    .catch((error) => {
      console.error(`[fichas:sync] ✗ ${error instanceof Error ? error.message : String(error)}`);
      process.exit(EXIT_FAIL);
    });
}

module.exports = {
  EXIT_FAIL,
  EXIT_OK,
  EXIT_UNAVAILABLE,
  chunkRows,
  createPrismaClient,
  isUnavailableError,
  loadEnvironment,
  main,
  parseArgs,
  pingDatabase,
  readBackRows,
  resolveDatabaseUrl,
  selectColumns,
  upsertBatches,
  withTimeout,
};
