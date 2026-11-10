#!/usr/bin/env node
/* eslint-disable no-console */
/**
 * Arnés del script de despliegue de migraciones (F-4 / item 1).
 *
 * Verifica los DOS caminos contra PostgreSQL REAL (mismo motor que producción):
 *   · Negativo: URL inválida / no-PostgreSQL ⇒ Exit != 0 (jamás un verde).
 *   · Positivo: `migrate deploy` + healthcheck de `LiveTelemetryPing` ⇒ Exit 0.
 *
 * USO: node scripts/verify_production_migrations_deploy.cjs
 */
'use strict';

const { spawnSync } = require('node:child_process');
const path = require('node:path');
const { resolveVerificationDatabase, ROOT } = require('./lib/ephemeral-postgres.cjs');
const { listMigrations } = require('./lib/migration-signatures.cjs');

const SCRIPT = path.join(ROOT, 'scripts', 'deploy_production_migrations.cjs');

function run(args) {
  const result = spawnSync(process.execPath, [SCRIPT, ...args], {
    cwd: ROOT,
    encoding: 'utf8',
    timeout: 240_000,
  });
  return {
    status: result.status,
    output: `${result.stdout || ''}${result.stderr || ''}`,
  };
}

async function main() {
  const failures = [];

  // 1. Negativo: sin URL ⇒ SIN_EVIDENCIA (2).
  const none = spawnSync(process.execPath, [SCRIPT], {
    cwd: ROOT,
    encoding: 'utf8',
    timeout: 60_000,
    env: {
      ...process.env,
      POSTGRES_PRISMA_URL: '',
      POSTGRES_URL_NON_POOLING: '',
      DATABASE_URL: '',
      EAR_VERIFY_DATABASE_URL: '',
    },
  });
  if (none.status !== 2) failures.push(`sin URL debe salir 2 (SIN_EVIDENCIA), salio ${none.status}`);

  // 2. Negativo: motor equivocado ⇒ SIN_EVIDENCIA (2).
  const sqlite = run([`--url=file:./dev.db`]);
  if (sqlite.status !== 2) failures.push(`URL no-PostgreSQL debe salir 2, salio ${sqlite.status}`);

  // 3. Positivo A — base VACÍA: migraciones desde cero (incluye el baseline).
  // 3. Positivo A — base VACÍA: migraciones desde cero (incluye el baseline).
  //    El clúster efímero se CACHEA entre ejecuciones, así que "vacía" hay que
  //    garantizarlo, no suponerlo.
  const db = await resolveVerificationDatabase();
  if (db === null) {
    console.log(
      JSON.stringify(
        {
          veredicto: 'SIN_EVIDENCIA',
          motivo: 'sin PostgreSQL disponible (ni declarado ni efímero)',
          previos: failures,
        },
        null,
        2,
      ),
    );
    process.exit(2);
  }

  const { Client } = require(path.join(ROOT, 'node_modules', 'pg'));
  const pgUrl = db.url.replace(/^postgresql:\/\//, 'postgres://');

  async function resetSchema() {
    const client = new Client({ connectionString: pgUrl });
    await client.connect();
    try {
      await client.query('DROP SCHEMA public CASCADE');
      await client.query('CREATE SCHEMA public');
    } finally {
      await client.end();
    }
  }

  await resetSchema();

  const fresh = run([`--url=${db.url}`, '--require=LiveTelemetryPing']);

  if (fresh.status !== 0) {
    failures.push(`base vacia: se esperaba exit 0, salio ${fresh.status}`);
  }
  for (const token of ['MIGRATE_DEPLOY=OK', 'MIGRATION_DEPLOY=VERIFICADO', 'information_schema']) {
    if (!fresh.output.includes(token)) failures.push(`base vacia: falta el token ${token}`);
  }

  // 4. Positivo B — topología REAL de producción: la base ya tiene el schema
  //    (creado a mano, con los tipos/enums de las migraciones) y el historial de
  //    Prisma está vacío ⇒ P3005. Sin `--allow-baseline` debe NEGARSE; con ella
  //    debe marcar como aplicadas las que ya están presentes y aplicar el resto.
  const client = new Client({ connectionString: pgUrl });
  await client.connect();
  try {
    // Quitar el schema que dejó el escenario A y simular el de producción:
    // `ProbeLegacyTable` (tabla ajena) + tipos y tablas de las 2 primeras
    // migraciones, que en producción ya existen.
    await client.query('DROP SCHEMA public CASCADE');
    await client.query('CREATE SCHEMA public');
    await client.query('CREATE TABLE "ProbeLegacyTable" (id text PRIMARY KEY)');
    const [baseline, userSpace] = listMigrations();
    for (const migration of [baseline, userSpace]) {
      for (const type of migration.types) {
        await client.query(`CREATE TYPE "${type}" AS ENUM ('A')`);
      }
      for (const table of migration.tables) {
        await client.query(`CREATE TABLE IF NOT EXISTS "${table}" ()`);
      }
    }
  } finally {
    await client.end();
  }

  const denied = run([`--url=${db.url}`, '--require=LiveTelemetryPing']);
  if (denied.status !== 4) {
    failures.push(`P3005 sin --allow-baseline debe salir 4, salio ${denied.status}`);
  }
  if (!denied.output.includes('allow-baseline')) {
    failures.push('P3005 debe explicar la remediacion --allow-baseline');
  }

  const baselined = run([`--url=${db.url}`, '--require=LiveTelemetryPing', '--allow-baseline']);
  if (baselined.status !== 0) {
    failures.push(`P3005 con --allow-baseline debe salir 0, salio ${baselined.status}`);
  }
  for (const token of [
    'BASELINE_MARKED=0_baseline',
    'BASELINE_MARKED=20261005025846_add_user_space',
    'MIGRATION_DEPLOY=VERIFICADO',
  ]) {
    if (!baselined.output.includes(token)) failures.push(`baseline: falta el token ${token}`);
  }

  // 5. Idempotencia: repetir el deploy no debe romper ni duplicar historial.
  const second = run([`--url=${db.url}`, '--require=LiveTelemetryPing', '--allow-baseline']);
  if (second.status !== 0) {
    failures.push(`segundo deploy (idempotencia) debe salir 0, salio ${second.status}`);
  }

  // La base efímera se libera DESPUÉS de todos los escenarios.
  await db.stop();

  // Higiene: la contraseña de la URL no debe aparecer en ninguna salida.
  const secretFragment = db.url.replace(/^.*:\/\/([^:]+):([^@]+)@.*$/, '$2');
  const allOutput = `${fresh.output}${denied.output}${baselined.output}${second.output}`;
  if (secretFragment && secretFragment.length > 4 && allOutput.includes(secretFragment)) {
    failures.push('la salida publica la contrasena de la base de datos');
  }

  const report = {
    veredicto: failures.length === 0 ? 'PASS' : 'FAIL',
    postgres: db.ephemeral ? 'ephemeral-real' : 'declarado',
    casos: 7,
    fallos: failures,
    tail: second.output.trim().split('\n').slice(-2),
  };
  console.log(JSON.stringify(report, null, 2));

  if (failures.length > 0) {
    for (const failure of failures) console.error(`[X] ${failure}`);
    process.exit(1);
  }
  console.log('[OK] deploy_production_migrations verificado: negativo 2/2 + positivo migrado y legible');
}

main().catch((error) => {
  console.error(`[X] ${error && error.message ? error.message : String(error)}`);
  process.exit(1);
});
