#!/usr/bin/env node
/**
 * F-6 · PRUEBA EXPLÍCITA (persistencia durable de telemetría)
 * ---------------------------------------------------------------------------
 * Verifica que un ping GPS sobrevive a la MUERTE DEL PROCESO (equivalente a un
 * redeploy del contenedor en Coolify): exactamente el fallo que F-6 elimina.
 *
 * Qué comprueba:
 *   1. Prisma Client expone el delegado `liveTelemetryPing`.
 *   2. La tabla `LiveTelemetryPing` existe y es consultable.
 *   3. Se inserta un ping sintético con un missionId de prueba.
 *   4. SIMULACIÓN DE REDEPLOY: el proceso que escribió termina; un PROCESO
 *      NUEVO relee la fila. Si aparece, no vivía en `globalThis`.
 *   5. Limpieza de las filas sintéticas (jamás datos de cliente).
 *
 * BASE DE DATOS (nunca SQLite: otro motor no certifica PostgreSQL, AF-5):
 *   · si `EAR_VERIFY_DATABASE_URL` / `POSTGRES_PRISMA_URL` / `DATABASE_URL`
 *     responde ⇒ se usa tal cual;
 *   · si no ⇒ PostgreSQL EFÍMERO (`scripts/lib/ephemeral-postgres.cjs`) con el
 *     DDL de la migración 20261109190000 aplicado.
 *
 * MODO --remote (sonda de PRODUCCIÓN, F-6 LIVE):
 *   Interroga `GET <base>/api/telemetry/<id>` y EXIGE que el JSON declaren la
 *   evidencia durable: `persisted:true` Y `mode:"REAL"` Y `source:"live"`. Basta
 *   con que uno de los tres falle para sellar SOSPECHOSO: que la base exista no
 *   prueba que el proceso vivo la lea (el contenedor puede estar sin la variable
 *   de entorno y responder desde caché de proceso).
 *
 * Exit codes:
 *   0 = persistencia verificada (VERIFICADO)
 *   1 = persistencia NO verificada (SOSPECHOSO)
 *   2 = PostgreSQL no alcanzable / sonda remota sin respuesta (SIN_EVIDENCIA, no es fallo de código)
 *
 * Uso: npm run verify:telemetry-persistence
 *      node scripts/verify_telemetry_persistence.cjs --remote
 *      node scripts/verify_telemetry_persistence.cjs --remote --base=https://www.productoraear.com --id=EXP-VERIFY-F6
 */
'use strict';

const { spawnSync } = require('node:child_process');
const { ROOT, resolveVerificationDatabase } = require('./lib/ephemeral-postgres.cjs');

const MISSION_ID = 'EXP-VERIFY-F6';
const PROBE = { lat: 40.2369, lng: -4.0561, accuracy: 8.5, status: 'EN_RUTA' };

const REMOTE_BASE = (
  process.argv.find((a) => a.startsWith('--base='))?.slice('--base='.length) ||
  process.env.EAR_PROD_BASE_URL ||
  'https://www.productoraear.com'
).replace(/\/+$/, '');
const REMOTE_ID =
  process.argv.find((a) => a.startsWith('--id='))?.slice('--id='.length) || MISSION_ID;
const REMOTE_TIMEOUT_MS = 8_000; // Ley del AbortController (INV-17).

/** Sonda remota: el veredicto lo dicta el contrato durable, no la memoria del proceso. */
async function probeRemote() {
  const url = `${REMOTE_BASE}/api/telemetry/${encodeURIComponent(REMOTE_ID)}`;
  log(`MODO_REMOTE url=${url}`);

  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), REMOTE_TIMEOUT_MS);
  let http;
  let body;
  try {
    const res = await fetch(url, {
      headers: { 'user-agent': 'EAR-OS-telemetry-persistence' },
      signal: ctrl.signal,
      cache: 'no-store',
    });
    http = res.status;
    body = await res.text();
  } catch (error) {
    log(`SIN_EVIDENCIA: la sonda remota no respondió (${error instanceof Error ? error.message : String(error)}).`);
    return 2;
  } finally {
    clearTimeout(timer);
  }

  let json;
  try {
    json = JSON.parse(body);
  } catch {
    log(`SIN_EVIDENCIA: respuesta no JSON (http=${http}): ${body.slice(0, 160)}`);
    return 2;
  }

  const durable = json.persisted === true;
  const real = json.mode === 'REAL';
  const live = json.source === 'live';

  log(
    `SONDA http=${http} persisted=${String(json.persisted)} mode=${String(json.mode)} source=${String(json.source)} ` +
      `probed=${String(json.probed)} count=${String(json.count)}`,
  );
  if (typeof json.lastError === 'string' && json.lastError.length > 0) {
    log(`lastError=${json.lastError.replace(/\s+/g, ' ').slice(0, 240)}`);
  }

  if (durable && real && live) {
    log('');
    log('RESULTADO: VERIFICADO — la instancia viva de producción lee la base (persisted:true, mode:"REAL", source:"live").');
    return 0;
  }

  log('');
  log(
    'RESULTADO: SOSPECHOSO — producción NO declara persistencia duradera ' +
      `(persisted=${String(json.persisted)}, mode=${String(json.mode)}, source=${String(json.source)}).`,
  );
  log('  -> La base no está enlazada al contenedor: inyecta POSTGRES_PRISMA_URL en Coolify y redeploy ANTES de migrar.');
  return 1;
}

function log(line) {
  process.stdout.write(`${line}\n`);
}

function openClient(url) {
  const { PrismaClient } = require('@prisma/client');
  return new PrismaClient(url ? { datasources: { db: { url } }, log: [] } : { log: [] });
}

/** Lector en un PROCESO NUEVO (sin `globalThis` compartido). */
function readFromFreshProcess(url) {
  const connection =
    url === undefined
      ? 'const prisma = new PrismaClient({ log: [] });'
      : `const prisma = new PrismaClient({ datasources: { db: { url: ${JSON.stringify(url)} } }, log: [] });`;

  const source = [
    "const path = require('node:path');",
    `const root = ${JSON.stringify(ROOT)};`,
    "try { require('dotenv').config({ path: path.join(root, '.env.local'), quiet: true });",
    "      require('dotenv').config({ path: path.join(root, '.env'), quiet: true }); } catch (e) {}",
    "const { PrismaClient } = require(path.join(root, 'node_modules', '@prisma', 'client'));",
    connection,
    '(async () => {',
    '  const row = await prisma.liveTelemetryPing.findFirst({',
    `    where: { missionId: ${JSON.stringify(MISSION_ID)} },`,
    "    orderBy: { capturedAt: 'desc' },",
    '    select: { lat: true, lng: true, accuracy: true, status: true, source: true },',
    '  });',
    `  const count = await prisma.liveTelemetryPing.count({ where: { missionId: ${JSON.stringify(MISSION_ID)} } });`,
    '  await prisma.$disconnect();',
    '  process.stdout.write(JSON.stringify({ row, count }));',
    '})().catch((e) => { process.stderr.write(String(e && e.message ? e.message : e)); process.exit(1); });',
  ].join('\n');

  return spawnSync(process.execPath, ['-e', source], {
    cwd: ROOT,
    encoding: 'utf8',
    timeout: 90_000,
  });
}


async function main() {
  if (process.argv.includes('--remote')) {
    return probeRemote();
  }

  const database = await resolveVerificationDatabase();
  if (database === null) {
    log('SIN_EVIDENCIA: no hay PostgreSQL utilizable (ni declarado ni efímero).');
    return 2;
  }
  log(`BASE DE DATOS: ${database.detail}`);

  // Con el clúster efímero la URL no está en `.env`: se pasa explícitamente.
  const url = database.ephemeral ? database.url : undefined;
  let prisma;

  try {
    // --- Paso 1: el delegado existe en el cliente generado -----------------
    prisma = openClient(url);
    const delegate = prisma.liveTelemetryPing;
    if (typeof delegate === 'undefined' || typeof delegate.create !== 'function') {
      log('FAIL paso 1: el Prisma Client no expone liveTelemetryPing. Ejecuta prisma generate.');
      return 1;
    }
    log('PASS paso 1: Prisma Client expone el delegado liveTelemetryPing.');

    // --- Paso 2: la tabla existe y es consultable -------------------------
    try {
      await prisma.liveTelemetryPing.count({ where: { missionId: MISSION_ID } });
      log('PASS paso 2: tabla "LiveTelemetryPing" consultable.');
    } catch (reason) {
      const message = String(reason && reason.message ? reason.message : reason);
      if (/P1001|ECONNREFUSED|Can't reach database|does not exist/i.test(message)) {
        log(`SIN_EVIDENCIA paso 2: PostgreSQL no alcanzable (${message.slice(0, 160)}).`);
        return 2;
      }
      log(`FAIL paso 2: la tabla no existe o no es consultable (${message.slice(0, 200)}).`);
      log('  -> Aplica la migración 20261109190000_add_live_telemetry_ping.');
      return 1;
    }

    // --- Paso 3: escritura del ping sintético ----------------------------
    await prisma.liveTelemetryPing.deleteMany({ where: { missionId: MISSION_ID } });
    await prisma.liveTelemetryPing.create({
      data: {
        missionId: MISSION_ID,
        lat: PROBE.lat,
        lng: PROBE.lng,
        accuracy: PROBE.accuracy,
        status: PROBE.status,
        source: 'verify',
      },
    });
    log('PASS paso 3: ping sintético insertado (source="verify").');
  } finally {
    // El proceso que escribe pierde su `globalThis`: ahí muere la caché.
    if (prisma) await prisma.$disconnect().catch(() => undefined);
  }

  try {
    // --- Paso 4: SIMULACIÓN DE REDEPLOY (proceso lector independiente) ---
    const child = readFromFreshProcess(url);
    if (child.status !== 0) {
      log(`FAIL paso 4: el lector independiente falló (${String(child.stderr || '').slice(0, 200)}).`);
      return 1;
    }

    let parsed;
    try {
      parsed = JSON.parse(String(child.stdout || '').trim());
    } catch {
      log(`FAIL paso 4: respuesta ilegible del lector (${String(child.stdout).slice(0, 160)}).`);
      return 1;
    }

    const survived = parsed.row !== null && parsed.row !== undefined && parsed.count >= 1;
    if (!survived) {
      log('FAIL paso 4: el ping NO sobrevivió al reinicio de proceso (persistencia rota).');
      return 1;
    }
    log(
      `PASS paso 4: ping recuperado desde un PROCESO NUEVO (lat=${parsed.row.lat}, lng=${parsed.row.lng}, status=${parsed.row.status}, filas=${parsed.count}).`,
    );

    // --- Paso 5: limpieza de datos sintéticos ---------------------------
    const cleanup = openClient(url);
    const deleted = await cleanup.liveTelemetryPing.deleteMany({ where: { missionId: MISSION_ID } });
    await cleanup.$disconnect();
    log(`PASS paso 5: ${deleted.count} fila(s) sintética(s) eliminada(s); 0 datos de cliente tocados.`);
  } finally {
    await database.stop();
  }

  log('');
  log('RESULTADO: VERIFICADO — la telemetría persiste fuera de globalThis.');
  return 0;
}

main()
  .then((code) => {
    process.exitCode = code;
  })
  .catch((reason) => {
    log(`FAIL inesperado: ${reason instanceof Error ? reason.message : String(reason)}`);
    process.exitCode = 1;
  });
