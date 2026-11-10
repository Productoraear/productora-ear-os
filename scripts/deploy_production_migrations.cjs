#!/usr/bin/env node
/* eslint-disable no-console */
/**
 * ════════════════════════════════════════════════════════════════════════════
 * Ω DEPLOY DE MIGRACIONES A PRODUCCIÓN — `prisma migrate deploy` VERIFICADO
 * ════════════════════════════════════════════════════════════════════════════
 * Problema que cierra: `docker-entrypoint.cjs` aplica `migrate deploy` con
 * fail-open (correcto para no tumbar la web), pero eso significa que un fallo de
 * migración en Coolify es INVISIBLE: la web sirve igual, la tabla
 * `LiveTelemetryPing` no existe y `/api/telemetry/[id]` responde 503 durante
 * días sin que nadie lo note. F-6-REVERIFY firmó SOSPECHOSO exactamente por eso.
 *
 * Este script es el brazo EXPLÍCITO y fail-closed de ese arranque:
 *   1. Verifica que la URL apunta a PostgreSQL (nunca SQLite: otro motor no
 *      certifica el schema — AF-5).
 *   2. Comprueba CONEXIÓN real por TCP + una consulta `SELECT 1` vía Prisma.
 *   3. Ejecuta `prisma migrate deploy` (idempotente, sólo migraciones pendientes).
 *   4. Healthcheck POST: cada tabla exigida debe existir en `information_schema`
 *      y el delegado Prisma debe hacer un `SELECT` real (no basta el DDL).
 *   5. Sale con código != 0 si algo falta: el pipeline no puede quedar verde
 *      con una migración pendiente.
 *
 * Exit codes:
 *   0  OK          migraciones aplicadas y tablas verificadas
 *   2  SIN_EVIDENCIA  no hay URL de base de datos (no se inventa un verde)
 *   3  CONEXION    la URL no responde
 *   4  MIGRACION   `migrate deploy` falló (se muestra la causa)
 *   5  HEALTHCHECK `migrate deploy` dijo OK pero la tabla no existe / no lee
 *
 * Uso:
 *   node scripts/deploy_production_migrations.cjs
 *   node scripts/deploy_production_migrations.cjs --url="postgresql://…" --require=LiveTelemetryPing
 *   node scripts/deploy_production_migrations.cjs --check-only   (sin aplicar)
 *
 * Variables de entorno aceptadas, en orden: POSTGRES_PRISMA_URL,
 * POSTGRES_URL_NON_POOLING, DATABASE_URL, EAR_VERIFY_DATABASE_URL.
 * Este script NUNCA imprime la contraseña de la URL (sólo host/puerto/base).
 * ════════════════════════════════════════════════════════════════════════════
 */
'use strict';

const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const net = require('node:net');
const path = require('node:path');

const { listMigrations } = require('./lib/migration-signatures.cjs');

const ROOT = path.resolve(__dirname, '..');
const PRISMA_CLI = path.join(ROOT, 'node_modules', 'prisma', 'build', 'index.js');
const MIGRATIONS_DIR = path.join(ROOT, 'prisma', 'migrations');
const MIGRATE_TIMEOUT_MS = 180_000;
const CONNECT_TIMEOUT_MS = 8_000;

const ENV_KEYS = [
  'POSTGRES_PRISMA_URL',
  'POSTGRES_URL_NON_POOLING',
  'DATABASE_URL',
  'EAR_VERIFY_DATABASE_URL',
];

const EXIT = Object.freeze({
  OK: 0,
  SIN_EVIDENCIA: 2,
  CONEXION: 3,
  MIGRACION: 4,
  HEALTHCHECK: 5,
});

function log(message) {
  process.stdout.write(`${message}\n`);
}

function fail(code, message, remedy) {
  process.stderr.write(`[FAIL] ${message}\n`);
  if (remedy) process.stderr.write(`REMEDIACION: ${remedy}\n`);
  process.exit(code);
}

function arg(name, fallback) {
  const hit = process.argv.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.slice(name.length + 3) : fallback;
}

function hasFlag(name) {
  return process.argv.includes(`--${name}`);
}

/** Enmascara credenciales: sólo host, puerto y base. Nunca el secreto. */
function redact(rawUrl) {
  try {
    const parsed = new URL(rawUrl);
    return `${parsed.protocol}//${parsed.hostname}:${parsed.port || '5432'}${parsed.pathname}`;
  } catch {
    return '<url-invalida>';
  }
}

function resolveDatabaseUrl() {
  const explicit = arg('url', '');
  if (explicit) return { url: explicit, source: '--url' };

  for (const key of ENV_KEYS) {
    const value = process.env[key];
    if (typeof value === 'string' && value.trim().length > 0) {
      return { url: value.trim(), source: key };
    }
  }
  return { url: '', source: 'none' };
}

function isPostgresUrl(rawUrl) {
  return /^postgres(ql)?:\/\//i.test(rawUrl);
}

function parseTarget(rawUrl) {
  const parsed = new URL(rawUrl);
  return {
    hostname: parsed.hostname || '127.0.0.1',
    port: Number(parsed.port || '5432'),
    database: (parsed.pathname || '/').replace(/^\//, '') || 'postgres',
  };
}

function probeTcp(hostname, port, timeoutMs = CONNECT_TIMEOUT_MS) {
  return new Promise((resolve) => {
    const socket = net.connect({ host: hostname, port });
    const done = (ok, detail) => {
      socket.destroy();
      resolve({ ok, detail });
    };
    socket.setTimeout(timeoutMs);
    socket.once('connect', () => done(true, 'tcp-connect'));
    socket.once('timeout', () => done(false, `timeout ${timeoutMs} ms`));
    socket.once('error', (error) => done(false, error.code || error.message));
  });
}

/**
 * Ejecuta `prisma migrate deploy`. Se lanza en un proceso hijo (no en éste)
 * porque el CLI escribe en stdout/stderr y necesitamos su exit code intacto.
 *
 * CRÍTICO (fallo medido por el arnés): `prisma/schema.prisma` declara
 *   url       = env("POSTGRES_PRISMA_URL")
 *   directUrl = env("POSTGRES_URL_NON_POOLING")
 * Si sólo se inyecta la primera, Prisma usa `directUrl` para las MIGRACIONES y
 * la migración acaba en la base de datos que dijera la variable heredada del
 * entorno (en local: localhost:5432, inexistente). Ambas se fijan aquí.
 */
function runMigrateDeploy(url) {
  if (!fs.existsSync(PRISMA_CLI)) {
    return { status: 1, signal: null, stdout: '', stderr: `CLI de Prisma ausente: ${PRISMA_CLI}` };
  }
  if (!fs.existsSync(MIGRATIONS_DIR)) {
    return { status: 1, signal: null, stdout: '', stderr: `Directorio ausente: ${MIGRATIONS_DIR}` };
  }

  const result = spawnSync(process.execPath, [PRISMA_CLI, 'migrate', 'deploy'], {
    cwd: ROOT,
    encoding: 'utf8',
    timeout: MIGRATE_TIMEOUT_MS,
    env: {
      ...process.env,
      POSTGRES_PRISMA_URL: url,
      POSTGRES_URL_NON_POOLING: url,
      DATABASE_URL: url,
    },
  });

  return {
    status: result.status,
    signal: result.signal,
    stdout: result.stdout || '',
    stderr: result.stderr || '',
    error: result.error ? result.error.message : null,
  };
}

/**
 * ¿La base ya tiene tablas de negocio creadas fuera del historial de Prisma?
 * Es el caso REAL de producción: el schema se creó a mano, `0_baseline` nunca
 * se marcó como aplicada y cualquier `migrate deploy` choca con P3005
 * ("The database schema is not empty") — medido en el arnés.
 */
async function inspectMigrationState(prisma, requiredTables) {
  const historyProbe = await prisma.$queryRawUnsafe(
    "SELECT COUNT(*)::int AS count FROM information_schema.tables WHERE table_schema = 'public' AND table_name = '_prisma_migrations'",
  );
  const historyRows = Array.isArray(historyProbe) && historyProbe.length > 0 ? historyProbe[0].count : 0;
  const hasHistory = Number(historyRows) > 0;

  // "Vacía" se mide sobre CUALQUIER tabla del schema `public`, no sólo sobre las
  // exigidas: una base con tablas ajenas también dispara P3005. Se excluye el
  // historial de Prisma porque es metadatos, no schema de negocio.
  const existingProbe = await prisma.$queryRawUnsafe(
    "SELECT COUNT(*)::int AS count FROM information_schema.tables WHERE table_schema = 'public' AND table_name <> '_prisma_migrations'",
  );
  const existingRows = Array.isArray(existingProbe) && existingProbe.length > 0 ? existingProbe[0].count : 0;
  const existingTableCount = Number(existingRows);

  if (!hasHistory) {
    const presentTables = await prisma.$queryRawUnsafe(
      "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name = ANY($1::text[])",
      requiredTables,
    );
    return {
      hasHistory: false,
      applied: [],
      failed: [],
      presentTables: presentTables.map((row) => row.table_name),
      existingTableCount,
    };
  }

  const applied = await prisma.$queryRawUnsafe(
    'SELECT migration_name FROM _prisma_migrations WHERE finished_at IS NOT NULL AND rolled_back_at IS NULL',
  );
  const failed = await prisma.$queryRawUnsafe(
    'SELECT migration_name FROM _prisma_migrations WHERE finished_at IS NULL AND rolled_back_at IS NULL',
  );
  const presentTables = await prisma.$queryRawUnsafe(
    "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name = ANY($1::text[])",
    requiredTables,
  );

  return {
    hasHistory: true,
    applied: applied.map((row) => row.migration_name),
    failed: failed.map((row) => row.migration_name),
    presentTables: presentTables.map((row) => row.table_name),
    existingTableCount,
  };
}

/** Migraciones ordenadas tal y como las aplica Prisma (lexicográfico). */
function listMigrationNames() {
  if (!fs.existsSync(MIGRATIONS_DIR)) return [];
  return fs
    .readdirSync(MIGRATIONS_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && fs.existsSync(path.join(MIGRATIONS_DIR, entry.name, 'migration.sql')))
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b));
}

/**
 * ¿Existen YA en la base los objetos que crea esta migración?
 * Evidencia objetiva (information_schema + pg_type), sin ejecutar DDL.
 * Una migración sin firmas reconocibles devuelve `null` (no se puede afirmar).
 */
async function inspectMigrationObjects(prisma, migration) {
  if (migration.tables.length === 0 && migration.types.length === 0) return null;

  const tables = await prisma.$queryRawUnsafe(
    "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name = ANY($1::text[])",
    migration.tables,
  );
  const presentTables = tables.map((row) => row.table_name);

  const types =
    migration.types.length === 0
      ? []
      : await prisma.$queryRawUnsafe(
          "SELECT typname FROM pg_type WHERE typname = ANY($1::text[])",
          migration.types,
        );
  const presentTypes = types.map((row) => row.typname);

  const missingTables = migration.tables.filter((name) => !presentTables.includes(name));
  const missingTypes = migration.types.filter((name) => !presentTypes.includes(name));

  return {
    name: migration.name,
    presentTables,
    presentTypes,
    missingTables,
    missingTypes,
    fullyApplied: missingTables.length === 0 && missingTypes.length === 0,
    partiallyApplied: missingTables.length + missingTypes.length < migration.tables.length + migration.types.length,
  };
}

/**
 * Marca una migración como aplicada (`prisma migrate resolve --applied`).
 * El llamador es responsable de haber demostrado, por `information_schema` y
 * `pg_type`, que los objetos de esa migración YA existen en la base: marcar sin
 * evidencia dejaría una tabla inexistente con el historial "en verde".
 */
function resolveBaselineApplied(migrationName, url) {
  if (!fs.existsSync(PRISMA_CLI)) {
    return { ok: false, detail: `CLI de Prisma ausente: ${PRISMA_CLI}` };
  }

  const result = spawnSync(
    process.execPath,
    [PRISMA_CLI, 'migrate', 'resolve', '--applied', migrationName],
    {
      cwd: ROOT,
      encoding: 'utf8',
      timeout: MIGRATE_TIMEOUT_MS,
      env: { ...process.env, POSTGRES_PRISMA_URL: url, POSTGRES_URL_NON_POOLING: url, DATABASE_URL: url },
    },
  );

  return {
    ok: result.status === 0,
    detail: `${result.stdout || ''}${result.stderr || ''}`.trim().slice(-400),
  };
}

/**
 * Healthcheck REAL: no basta con que `migrate deploy` devuelva 0 (puede no haber
 * encontrado migraciones porque el histórico `_prisma_migrations` ya las marca,
 * aunque la tabla se haya borrado a mano). Se comprueba en `information_schema`
 * y además se ejecuta un COUNT por el delegado Prisma generado.
 */
async function healthcheckTables(tables, url) {
  const report = [];
  let PrismaClient;
  try {
    ({ PrismaClient } = require(path.join(ROOT, 'node_modules', '@prisma', 'client')));
  } catch (error) {
    return {
      ok: false,
      detail: `cliente Prisma no generado (${error.message})`,
      tables: [],
    };
  }

  const prisma = new PrismaClient({ datasources: { db: { url } } });
  try {
    for (const table of tables) {
      let exists = false;
      try {
        const rows = await prisma.$queryRawUnsafe(
          "SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = $1 LIMIT 1",
          table,
        );
        exists = Array.isArray(rows) && rows.length > 0;
      } catch (error) {
        report.push({ table, exists: false, readable: false, detail: error.message });
        continue;
      }

      let readable = false;
      let detail = 'tabla ausente en information_schema';
      if (exists) {
        try {
          const counted = await prisma.$queryRawUnsafe(
            `SELECT COUNT(*)::int AS n FROM "${table.replace(/"/g, '""')}"`,
          );
          const n = Array.isArray(counted) && counted.length > 0 ? counted[0].n : null;
          readable = typeof n === 'number';
          detail = `filas=${String(n)}`;
        } catch (error) {
          detail = `no legible: ${error.message}`;
        }
      }
      report.push({ table, exists, readable, detail });
    }
  } finally {
    await prisma.$disconnect().catch(() => {});
  }

  return {
    ok: report.every((entry) => entry.exists && entry.readable),
    detail: 'information_schema + SELECT real por delegado Prisma',
    tables: report,
  };
}

async function main() {
  log('--- DEPLOY DE MIGRACIONES A PRODUCCION (fail-closed) ---');

  const { url, source } = resolveDatabaseUrl();
  if (!url) {
    fail(
      EXIT.SIN_EVIDENCIA,
      `No hay URL de base de datos (revisadas: ${ENV_KEYS.join(', ')}). No se firma un verde inventado.`,
      'Exporta POSTGRES_PRISMA_URL (o pasa --url=…) con la cadena de PostgreSQL de Coolify.',
    );
  }

  if (!isPostgresUrl(url)) {
    fail(
      EXIT.SIN_EVIDENCIA,
      'La URL no es PostgreSQL. SQLite u otro motor NO certifica prisma/schema.prisma.',
      'Usa la cadena postgresql:// real del despliegue.',
    );
  }

  const target = parseTarget(url);
  log(`DB_SOURCE=${source}`);
  log(`DB_TARGET=${redact(url)}`);

  // 1. Conexión real por TCP antes de invocar el CLI (8 s, Ley del AbortController).
  const tcp = await probeTcp(target.hostname, target.port);
  log(`DB_TCP=${tcp.ok ? 'OPEN' : 'CLOSED'} detail=${tcp.detail}`);
  if (!tcp.ok) {
    fail(
      EXIT.CONEXION,
      `PostgreSQL inalcanzable en ${target.hostname}:${target.port} (${tcp.detail}).`,
      'Verifica que el contenedor/DB está arriba y que la red del despliegue alcanza el puerto 5432.',
    );
  }

  const requireList = arg('require', 'LiveTelemetryPing')
    .split(',')
    .map((name) => name.trim())
    .filter((name) => name.length > 0);
  log(`REQUIRED_TABLES=${requireList.join(',')}`);

  if (hasFlag('check-only')) {
    const check = await healthcheckTables(requireList, url);
    log(JSON.stringify({ modo: 'check-only', ...check }, null, 2));
    if (!check.ok) {
      fail(EXIT.HEALTHCHECK, 'Healthcheck fallido en modo --check-only.');
    }
    log('MIGRATIONS_CHECK_ONLY=OK');
    return;
  }

  // 2. Estado del historial de migraciones (P3005 se EVITA, no se sufre).
  //    Producción tiene las tablas creadas fuera del historial de Prisma: sin
  //    marcar la base como aplicada, `migrate deploy` aborta SIEMPRE con
  //    "The database schema is not empty" y la tabla nueva nunca se crea.
  const migrationNames = listMigrationNames();
  const migrations = listMigrations();
  const baselineName = migrationNames.find((name) => /^0[_-]/.test(name)) || '';
  log(`MIGRATION_BASELINE=${baselineName || 'none'}`);

  let PrismaClient;
  try {
    ({ PrismaClient } = require(path.join(ROOT, 'node_modules', '@prisma', 'client')));
  } catch (error) {
    fail(EXIT.SIN_EVIDENCIA, `Cliente Prisma no generado: ${error.message}`, 'Ejecuta `prisma generate` antes del deploy.');
  }

  let prisma = new PrismaClient({ datasources: { db: { url } } });
  try {
    const state = await inspectMigrationState(prisma, requireList);
    log(
      `MIGRATION_HISTORY=${state.hasHistory ? 'present' : 'absent'} applied=${state.applied.length} ` +
        `failed=${state.failed.length} publicTables=${state.existingTableCount} ` +
        `requiredTablesPresent=${state.presentTables.join(',') || 'none'}`,
    );

    const needsBaseline =
      baselineName.length > 0 &&
      state.applied.length === 0 &&
      state.existingTableCount > 0;

    if (state.failed.length > 0) {
      fail(
        EXIT.MIGRACION,
        `Hay migraciones en estado FAILED sin resolver: ${state.failed.join(', ')}.`,
        'Resuelve cada una con `prisma migrate resolve --rolled-back <name>` antes de reintentar. No se automatiza para no enmascarar un DDL roto.',
      );
    }

    if (needsBaseline) {
      if (!hasFlag('allow-baseline')) {
        fail(
          EXIT.MIGRACION,
          `La base ya contiene ${state.existingTableCount} tablas en el schema public pero el ` +
            `historial de Prisma está vacío (riesgo P3005: "The database schema is not empty").`,
          `Esta es la situación esperada de producción. Re-ejecuta con --allow-baseline: marcará ` +
            `como aplicadas las migraciones cuyos objetos YA existen (cambio de METADATOS, sin DDL destructivo) ` +
            `y sólo aplicará las que falten.`,
        );
      }

      // Marcar como aplicada SÓLO con evidencia: la migración debe estar
      // completamente presente en la base y todas las anteriores también. En
      // cuanto una no encaja, se deja para que la aplique `migrate deploy`.
      const toMark = [];
      for (const migration of migrations) {
        const inspection = await inspectMigrationObjects(prisma, migration);
        if (inspection === null) {
          log(`BASELINE_SKIP=${migration.name} (sin firmas reconocibles)`);
          break;
        }
        if (!inspection.fullyApplied) {
          log(
            `BASELINE_STOP=${migration.name} missingTables=${inspection.missingTables.join(',') || 'none'} ` +
              `missingTypes=${inspection.missingTypes.join(',') || 'none'}`,
          );
          break;
        }
        toMark.push(inspection.name);
      }

      if (toMark.length === 0) {
        log('BASELINE_REQUIRED=none (ninguna migracion esta ya presente; la aplica migrate deploy)');
      }

      for (const name of toMark) {
        log(`Aplicando baseline: marcando "${name}" como aplicada (solo metadatos).`);
        const resolved = resolveBaselineApplied(name, url);
        if (!resolved.ok) {
          fail(EXIT.MIGRACION, `No se pudo marcar "${name}" como aplicada: ${resolved.detail}`);
        }
        log(`BASELINE_MARKED=${name}`);
      }

      if (toMark.length > 0) {
        // Reabrir la conexión: el historial cambió fuera de esta transacción.
        await prisma.$disconnect().catch(() => {});
        prisma = new PrismaClient({ datasources: { db: { url } } });
      }
    }
  } finally {
    await prisma.$disconnect().catch(() => {});
  }

  // 3. `prisma migrate deploy` (idempotente).
  log('Ejecutando prisma migrate deploy...');
  const migrate = runMigrateDeploy(url);
  const rawOutput = `${migrate.stdout}\n${migrate.stderr}`.trim();
  if (rawOutput.length > 0) log(rawOutput);

  if (migrate.signal) {
    fail(EXIT.MIGRACION, `migrate deploy abortado por senal ${migrate.signal}.`);
  }
  if (migrate.status !== 0) {
    fail(
      EXIT.MIGRACION,
      `migrate deploy devolvio exit ${migrate.status}${migrate.error ? ` (${migrate.error})` : ''}.`,
      'Revisa el DDL de prisma/migrations y el historico _prisma_migrations antes de reintentar.',
    );
  }
  log('MIGRATE_DEPLOY=OK');

  // 3. Healthcheck de tablas: el DDL aplicado no prueba que la tabla exista HOY.
  const health = await healthcheckTables(requireList, url);
  log(JSON.stringify({ modo: 'healthcheck', ...health }, null, 2));
  if (!health.ok) {
    fail(
      EXIT.HEALTHCHECK,
      'migrate deploy OK pero el healthcheck de tablas fallo.',
      'Revisa _prisma_migrations: puede estar marcada como aplicada sin haber creado la tabla.',
    );
  }

  log(`MIGRATION_DEPLOY=VERIFICADO tables=${requireList.join(',')}`);
  log('RESULTADO: migraciones aplicadas y tablas legibles.');
}

if (require.main === module) {
  main().catch((error) => {
    fail(EXIT.MIGRACION, `Error no controlado: ${error && error.message ? error.message : String(error)}`);
  });
}
