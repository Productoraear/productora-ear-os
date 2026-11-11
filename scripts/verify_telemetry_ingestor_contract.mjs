#!/usr/bin/env node
/**
 * F-6 · CONTRATO DEL INGESTOR DE TELEMETRÍA (caso negativo primero, SEC-1)
 * ---------------------------------------------------------------------------
 * Ejecuta el POST/GET REALES de `src/app/api/telemetry/[id]/route.ts`,
 * transpilado al vuelo por el TypeScript stripper nativo de Node 24 (sin mocks
 * del handler: se prueba el código de producción, no una copia).
 *
 * Por qué existe: `scripts/verify_telemetry_persistence.cjs` demuestra que el
 * dato sobrevive a la muerte del proceso, pero NO que el ingestor acepte el
 * ping con `TELEMETRY_PROVIDER_TOKEN` configurado. Sin este arnés, «F-6
 * cerrado» sería una afirmación sin prueba sobre el boundary HTTP.
 *
 * GATES (en orden, caso negativo primero):
 *   1. 503 telemetry_disabled → sin la variable (fail-closed, SEC-1)
 *   2. 401 unauthorized       → cabecera ausente y token erróneo
 *   3. 422                    → payload inválido y JSON ilegible
 *   4. 202 + persisted:true   → camino feliz con el token correcto
 *   5. GET desde OTRO PROCESO → el dato no vive en `globalThis`
 *   6. Limpieza de filas sintéticas (0 datos de cliente tocados)
 *
 * Base de datos: la declarada en el entorno si responde SQL; si no, PostgreSQL
 * EFÍMERO (`scripts/lib/ephemeral-postgres.cjs`). Nunca SQLite (ver AF-5).
 * Un socket TCP abierto NO es un oráculo suficiente (postmaster muerto o
 * `CREATE INDEX` esperando lock): por eso `resolveVerificationDatabase` devuelve
 * `sqlReady = false` y el arnés firma SIN_EVIDENCIA en vez de un FAIL a ciegas
 * contra una base que nunca respondió.
 *
 * Uso:
 *   node --import ./scripts/lib/ts-alias-loader.mjs scripts/verify_telemetry_ingestor_contract.mjs
 *   (o `npm run verify:telemetry-contract`)
 *
 * Exit codes: 0 = VERIFICADO · 1 = SOSPECHOSO · 2 = SIN_EVIDENCIA (sin PostgreSQL)
 */
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import {
  ROOT,
  resolveVerificationDatabase,
} from './lib/ephemeral-postgres.cjs';

const ROUTE_TS = path.join(ROOT, 'src', 'app', 'api', 'telemetry', '[id]', 'route.ts');
const ALIAS_LOADER = path.join(ROOT, 'scripts', 'lib', 'ts-alias-loader.mjs');
const MISSION_ID = 'EXP-CONTRACT-F6';
const VALID_PING = { lat: 40.2369, lng: -4.0561, accuracy: 7.5, status: 'EN_RUTA' };

const failures = [];

function log(line) {
  process.stdout.write(`${line}\n`);
}

function check(label, actual, expected) {
  const ok = actual === expected;
  log(`${ok ? 'PASS' : 'FAIL'} ${label}: esperado ${String(expected)}, obtenido ${String(actual)}`);
  if (!ok) failures.push(label);
}

function makeRequest({ method, body, headerToken, withHeader = true, withBody = true }) {
  const headers = new Headers();
  if (withHeader) headers.set('x-ear-provider-token', headerToken);
  if (withBody) headers.set('content-type', 'application/json');
  return new Request(`http://127.0.0.1:3007/api/telemetry/${MISSION_ID}`, {
    method,
    headers,
    body: withBody ? JSON.stringify(body) : undefined,
  });
}

async function withClient(work) {
  const { PrismaClient } = await import('@prisma/client');
  const override = process.env.EAR_VERIFY_DATABASE_URL;
  const client = new PrismaClient(
    override ? { datasources: { db: { url: override } }, log: [] } : { log: [] },
  );
  try {
    return await work(client);
  } finally {
    await client.$disconnect().catch(() => undefined);
  }
}

const params = Promise.resolve({ id: MISSION_ID });
const routeUrl = pathToFileURL(ROUTE_TS).href;


/** Lectura GET en un proceso NUEVO: pool y `globalThis` distintos. */
function readFromFreshProcess() {
  const source = [
    'const route = await import(process.env.EAR_ROUTE_URL);',
    `const res = await route.GET(new Request('http://127.0.0.1:3007/api/telemetry/${MISSION_ID}'), { params: Promise.resolve({ id: '${MISSION_ID}' }) });`,
    'const body = await res.json();',
    'process.stdout.write(JSON.stringify({ status: res.status, count: body.count, persisted: body.persisted, source: body.source }));',
  ].join('\n');

  return spawnSync(
    process.execPath,
    ['--experimental-loader', pathToFileURL(ALIAS_LOADER).href, '--input-type=module', '-e', source],
    {
      cwd: ROOT,
      encoding: 'utf8',
      timeout: 90_000,
      env: { ...process.env, EAR_ROUTE_URL: routeUrl },
    },
  );
}

async function main() {
  const database = await resolveVerificationDatabase();
  if (database === null) {
    log('SIN_EVIDENCIA: no hay PostgreSQL utilizable (ni declarado ni efímero).');
    return 2;
  }

  const token = process.env.TELEMETRY_PROVIDER_TOKEN;
  if (!token) {
    log('SIN_EVIDENCIA: TELEMETRY_PROVIDER_TOKEN no está definido en el entorno.');
    await database.stop();
    return 2;
  }

  log(`BASE DE DATOS: ${database.detail}`);
  if (database.sqlReady === false) {
    log('SIN_EVIDENCIA: la base declarada no admite SQL utilizable (postmaster muerto, lock o credenciales).');
    log('Diagnóstico: verificar el puerto (netstat) antes de firmar un FAIL del producto.');
    await database.stop();
    return 2;
  }

  // El handler importa `prisma` del singleton, que resuelve la URL del entorno:
  // se apunta al clúster bajo prueba ANTES de importar el módulo.
  process.env.POSTGRES_PRISMA_URL = database.url;
  process.env.DATABASE_URL = database.url;
  process.env.EAR_VERIFY_DATABASE_URL = database.url;

  try {
    await withClient((client) =>
      client.liveTelemetryPing.deleteMany({ where: { missionId: MISSION_ID } }),
    );

    // ── Gate 1 · fail-closed sin variable ──────────────────────────────────
    delete process.env.TELEMETRY_PROVIDER_TOKEN;
    {
      const route = await import(routeUrl);
      const res = await route.POST(
        makeRequest({ method: 'POST', body: VALID_PING, headerToken: token }),
        { params },
      );
      check('gate 1a (503 sin variable)', res.status, 503);
      check('gate 1b body.error', (await res.json()).error, 'telemetry_disabled');
    }

    // ── Gate 2 · autorización ──────────────────────────────────────────────
    process.env.TELEMETRY_PROVIDER_TOKEN = token;
    {
      const route = await import(routeUrl);
      const noHeader = await route.POST(
        makeRequest({ method: 'POST', body: VALID_PING, withHeader: false }),
        { params },
      );
      check('gate 2a (401 sin cabecera)', noHeader.status, 401);
      const wrongToken = await route.POST(
        makeRequest({ method: 'POST', body: VALID_PING, headerToken: `${token}-wrong` }),
        { params },
      );
      check('gate 2b (401 token erróneo)', wrongToken.status, 401);
    }

    // ── Gate 3 · validación de payload ─────────────────────────────────────
    {
      const route = await import(routeUrl);
      const badLat = await route.POST(
        makeRequest({ method: 'POST', body: { ...VALID_PING, lat: 999 }, headerToken: token }),
        { params },
      );
      check('gate 3a (422 lat fuera de rango)', badLat.status, 422);

      const unreadable = {
        method: 'POST',
        headers: new Headers({ 'x-ear-provider-token': token, 'content-type': 'application/json' }),
        json: async () => {
          throw new SyntaxError('JSON ilegible');
        },
      };
      check('gate 3b (422 JSON ilegible)', (await route.POST(unreadable, { params })).status, 422);
    }

    // ── Gate 4 · camino feliz ──────────────────────────────────────────────
    {
      const route = await import(routeUrl);
      const res = await route.POST(
        makeRequest({ method: 'POST', body: VALID_PING, headerToken: token }),
        { params },
      );
      check('gate 4a (202 aceptado)', res.status, 202);
      const body = await res.json();
      check('gate 4b persisted', body.persisted, true);
      check('gate 4c source', body.source, 'live');
      check('gate 4d mode', body.mode, 'REAL');
      check('gate 4e status', body.status, 'EN_RUTA');
    }

    // ── Gate 5 · persistencia real fuera de globalThis ─────────────────────
    const rows = await withClient((client) =>
      client.liveTelemetryPing.count({ where: { missionId: MISSION_ID } }),
    );
    check('gate 5a filas persistidas >= 1', rows >= 1, true);

    const reader = readFromFreshProcess();
    if (reader.status !== 0) {
      const stderr = String(reader.stderr || '').trim().slice(0, 220);
      log(`FAIL gate 5b: lector independiente (${stderr}).`);
      failures.push('gate 5b lector independiente');
    } else {
      const parsed = JSON.parse(String(reader.stdout || '').trim() || '{}');
      check('gate 5b count desde proceso nuevo >= 1', parsed.count >= 1, true);
      check('gate 5c persisted', parsed.persisted, true);
      check('gate 5d source', parsed.source, 'live');
    }

    // ── Gate 6 · limpieza ──────────────────────────────────────────────────
    const deleted = await withClient((client) =>
      client.liveTelemetryPing.deleteMany({ where: { missionId: MISSION_ID } }),
    );
    log(`PASS gate 6: ${deleted.count} fila(s) sintética(s) eliminada(s); 0 datos de cliente tocados.`);
  } finally {
    await database.stop();
  }

  if (failures.length > 0) {
    log('');
    log(`RESULTADO: SOSPECHOSO — fallan ${failures.length} gate(s): ${failures.join(', ')}.`);
    return 1;
  }

  log('');
  log(
    'RESULTADO: VERIFICADO — el ingestor acepta pings con TELEMETRY_PROVIDER_TOKEN y persiste en PostgreSQL.',
  );
  return 0;
}

main()
  .then((code) => process.exit(code))
  .catch((reason) => {
    log(`FAIL inesperado: ${reason instanceof Error ? reason.message : String(reason)}`);
    process.exit(1);
  });
