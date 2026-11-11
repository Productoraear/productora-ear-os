#!/usr/bin/env node
/**
 * Proceso hijo que gobierna el ciclo de vida del PostgreSQL efímero (F-6).
 * ---------------------------------------------------------------------------
 * `embedded-postgres` registra `process.on('exit')` y no permite un apagado
 * limpio dentro del proceso que ya usa Prisma. Por eso el servidor vive aquí y
 * el arnés habla con él por stdin/stdout:
 *
 *   hijo → padre : READY            (base creada y DDL aplicado)
 *   hijo → padre : FAILED <motivo>  (sin binario, error de initdb, etc.)
 *   padre → hijo : STOP             (apagado ordenado)
 *
 * La base de trabajo se crea conectando a `postgres`; si esa base tampoco
 * existe (initdb mínimo en Windows), se conecta al propio usuario y se emite
 * `CREATE DATABASE`. Nunca se rinde en silencio: si algo falla, dice FAILED.
 */
const fs = require('node:fs');
const path = require('node:path');

const { CACHE_DIR, DDL_FILE, VERIFY_DB } = require('./ephemeral-postgres-core.cjs');
// El padre puede mover el puerto (fallback cuando el principal está envenenado):
// se acepta EAR_EPHEMERAL_PG_URL y se usa su puerto para datadir/clúster.
const URL_FROM_PARENT = process.env.EAR_EPHEMERAL_PG_URL || '';
const PORT = Number(
  (URL_FROM_PARENT ? Number(new URL(URL_FROM_PARENT).port) : 0) || process.env.EAR_EPHEMERAL_PG_PORT || 55_432,
);
const USER = 'ear_verify';
const PASSWORD = 'ear_verify_local_only';
// Cada puerto usa SU propio datadir: un clúster vivo en 55432 no puede compartir
// directorio con el de 55433 (dos postmasters del mismo datadir se bloquean).
const DATA_DIR = path.join(CACHE_DIR, PORT === 55_432 ? 'data' : `data-${PORT}`);


function emit(line) {
  process.stdout.write(`${line}\n`);
}

function fail(reason) {
  emit(`FAILED ${String(reason).slice(0, 300)}`);
  process.exit(0);
}

function ddlStatements() {
  return fs
    .readFileSync(DDL_FILE, 'utf8')
    .replace(/CREATE UNIQUE INDEX (?!IF NOT EXISTS)/g, 'CREATE UNIQUE INDEX IF NOT EXISTS')
    .replace(/CREATE INDEX (?!IF NOT EXISTS)/g, 'CREATE INDEX IF NOT EXISTS')
    .split(';')
    .map((chunk) => chunk.trim())
    .filter((chunk) => chunk.length > 0);
}

/** Sentencias idempotentes sobre el SQL crudo (sin base `postgres`). */
function ensureDatabaseAndSchema(pg) {
  return async () => {
    try {
      await pg.createDatabase(VERIFY_DB);
    } catch {
      // Ya existe (o la base `postgres` no está): se valida por SQL abajo.
    }
  };
}

async function main() {
  let EmbeddedPostgres;
  try {
    ({ default: EmbeddedPostgres } = await import('embedded-postgres'));
  } catch {
    fail('falta el paquete `embedded-postgres` (npm install embedded-postgres)');
    return;
  }

  fs.mkdirSync(CACHE_DIR, { recursive: true });
  const alreadyInitialised = fs.existsSync(path.join(DATA_DIR, 'PG_VERSION'));

  const pg = new EmbeddedPostgres({
    databaseDir: DATA_DIR,
    user: USER,
    password: PASSWORD,
    port: PORT,
    persistent: alreadyInitialised,
    initdbFlags: ['--encoding=UTF8', '--locale=C'],
  });

  if (!alreadyInitialised) {
    await pg.initialise();
  }
  await pg.start();

  await ensureDatabaseAndSchema(pg)();

  const { PrismaClient } = await import('@prisma/client');
  const url = `postgresql://${USER}:${PASSWORD}@127.0.0.1:${PORT}/${VERIFY_DB}`;
  const client = new PrismaClient({ datasources: { db: { url } }, log: [] });
  try {
    for (const statement of ddlStatements()) {
      await client.$executeRawUnsafe(statement);
    }
  } finally {
    await client.$disconnect().catch(() => undefined);
  }

  emit('READY');

  // Espera ordenada de apagado desde el padre.
  process.stdin.setEncoding('utf8');
  process.stdin.on('data', async (chunk) => {
    if (String(chunk).includes('STOP')) {
      try {
        await pg.stop();
      } catch {
        // Apagado best-effort.
      }
      emit('STOPPED');
      process.exit(0);
    }
  });
}

main().catch((reason) => {
  fail(reason instanceof Error ? reason.message : String(reason));
});
