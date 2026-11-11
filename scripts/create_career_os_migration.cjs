/**
 * ════════════════════════════════════════════════════════════════════════════
 * W53_T01 · MATERIALIZACIÓN DE LA MIGRACIÓN SQL FÍSICA DEL CAREER MANIFEST
 * ════════════════════════════════════════════════════════════════════════════
 * Hueco declarado por el ejecutor en el acta 20:55 (10/11/2026):
 *   prisma/migrations/ no contenía carpeta para W53: el DDL del Career Manifest
 *   existía en schema.prisma pero NO en disco como migración aplicable.
 *
 * POR QUÉ ESTE SCRIPT Y NO `prisma migrate dev --create-only`:
 *   `migrate dev` exige una base ALCANZABLE en POSTGRES_PRISMA_URL y un shadow
 *   database. En la estación local .env apunta a `localhost:5432` (sin daemon) y
 *   aborta con P1001 antes de escribir el SQL. Transcribir DDL a mano sería
 *   introducir drift sin prueba.
 *
 * ESTRATEGIA (evidencia reproducible, cero transcripción manual):
 *   1. Se extrae del schema.prisma REAL el bloque Career Manifest (desde el
 *      comentario `// CAREER OS — W53_T01` hasta EOF) y las definiciones base
 *      de `artistProfile` y `MediaAsset` (destinos de las nuevas FKs).
 *   2. `prisma migrate diff --from-empty --to-schema-datamodel <tmp> --script`
 *      emite el DDL de máquina.
 *   3. Se re-envuelve idempotente (IF NOT EXISTS / DO $$ EXCEPTION) igual que
 *      la migración F-6 (20261109190000) para redespliegues en Coolify.
 *
 * Uso:
 *   node scripts/create_career_os_migration.cjs           (escribe la migración)
 *   node scripts/create_career_os_migration.cjs --check   (sólo verifica)
 *
 * Exit codes: 0 = migración presente/generada · 1 = no se pudo generar · 2 = entorno ilegible.
 * ════════════════════════════════════════════════════════════════════════════
 */
'use strict';

const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const ROOT = path.resolve(__dirname, '..');
const SCHEMA = path.join(ROOT, 'prisma', 'schema.prisma');
const MIGRATIONS_DIR = path.join(ROOT, 'prisma', 'migrations');
const MIGRATION_NAME = '20261110195500_add_career_os_models';
const MIGRATION_DIR = path.join(MIGRATIONS_DIR, MIGRATION_NAME);
const MIGRATION_SQL = path.join(MIGRATION_DIR, 'migration.sql');

/** Modelos cuyo DDL exige esta migración (contrato W53_T01). */
const REQUIRED_TABLES = [
  'career_artist_profile',
  'PlatformConnection',
  'MetricSnapshot',
  'Release',
  'Track',
  'MediaAsset',
  'TeamMember',
  'Gig',
  'Contract',
  'RoyaltyStatement',
  'Campaign',
  'FanContact',
  'ContentPost',
];

function prismaCli() {
  const bin = path.join(ROOT, 'node_modules', 'prisma', 'build', 'index.js');
  if (!fs.existsSync(bin)) {
    console.error('ENTORNO_ILEGIBLE: node_modules/prisma/build/index.js no existe.');
    process.exit(2);
  }
  return bin;
}

/**
 * Relaciones inversas que el bloque Career necesita del bloque base del schema.
 * Se declaran explícitamente: si el schema base renombra el modelo, el diff
 * falla y el script aborta en vez de inventar una relación.
 */
/** Relaciones inversas necesarias para validar las FK que sí aportan DDL nuevo. */
const DERIVED_FIELDS = [
  '  careerProfile         ArtistProfile?         @relation("CareerArtistIdentity")',
  '  platformLinks         PlatformConnection[]',
  '  releases              Release[]',
  '  gigs                  Gig[]',
  '  contracts             Contract[]',
  '  royaltyStmts          RoyaltyStatement[]',
  '  campaigns             Campaign[]',
  '  fanContacts           FanContact[]',
  '  contentPosts          ContentPost[]',
  '  teamMembers           TeamMember[]',
  '  metricSnapshots       MetricSnapshot[]      @relation("ArtistMetricSnapshots")',
];

/** Relación inversa que el `MediaAsset` real ya declara (tracks + posts). */
const MEDIA_DERIVED_FIELDS = ['  careerTracks          Track[]', '  careerPosts           ContentPost[]'];

function extractModel(schema, model) {
  const re = new RegExp(`model ${model} \\{[\\s\\S]*?\\n\\}`);
  const match = schema.match(re);
  if (match === null) {
    throw new Error(`No se localizó \`model ${model}\` en prisma/schema.prisma.`);
  }
  return match[0];
}

/**
 * Busca el final de un bloque `model X { ... }` respetando comentarios y
 * atributos multilínea: `migrate diff` exige el modelo sintácticamente cerrado.
 */
function findBlockEnd(source, startIndex) {
  let depth = 0;
  for (let i = startIndex; i < source.length; i += 1) {
    const ch = source[i];
    if (ch === '{') depth += 1;
    else if (ch === '}') {
      depth -= 1;
      if (depth === 0) return i + 1;
    }
  }
  return -1;
}

/** Modelo base reducido exactamente a columnas escalares (sin relaciones). */
function extractScalarOnlyModel(schema, model, options = {}) {
  const header = `model ${model} {`;
  const start = schema.indexOf(header);
  if (start === -1) throw new Error(`No se localizó \`${header}\` en prisma/schema.prisma.`);
  const end = findBlockEnd(schema, start);
  if (end === -1) throw new Error(`El bloque \`${header}\` no cierra.`);

  const body = schema
    .slice(start + header.length, end - 1)
    .split('\n')
    .filter((line) => {
      const clean = line.replace(/\/\/.*$/, '').trim();
      if (clean.length === 0) return false;
      if (clean.startsWith('@@') || clean.startsWith('///')) return false;
      // columnas escalares: `nombre Tipo...` donde el tipo no es una relación
      return /^[A-Za-z_]\w*\s+(String|Int|Float|Boolean|DateTime|Json|BigInt|Decimal|Bytes)\b/.test(clean);
    })
    .map((line) => `  ${line.replace(/\/\/.*$/, '').trim()}`);

  if (body.length === 0) throw new Error(`\`${model}\` no expone columnas escalares.`);
  const derived = options.derivedFields ?? DERIVED_FIELDS;
  return [`${header}`, ...body, ...derived, '}'].join('\n');
}

function buildTempDatamodel(schema) {
  const generatorMatch = schema.match(/generator\s+client\s*\{[\s\S]*?\n\}/);
  if (generatorMatch === null) {
    throw new Error('No se localizó el bloque `generator client` en prisma/schema.prisma.');
  }

  const careerStart = schema.indexOf('// CAREER OS — W53_T01');
  if (careerStart === -1) {
    throw new Error('No se localizó el bloque "// CAREER OS — W53_T01" en el schema.');
  }
  const careerBlock = schema.slice(careerStart);
  const baseSchema = schema.slice(0, careerStart);

  // `artistProfile` = destino de la FK en reposo (relación 1:1 por PK). El modelo
  // base NO se renombra: su tabla física ya es `career_artist_profile` (baseline
  // 0_baseline). El `artist` del schema real se declara MANUAL más abajo.
  const artistOrigin = extractScalarOnlyModel(baseSchema, 'artistProfile');
  // `MediaAsset` es el destino de la FK de `Track` (se presta, no se duplica).
  // `MediaAsset` es el destino de la FK de `Track` (se presta, no se duplica).
  // Ya declara sus relaciones inversas en el schema real; sólo se filtran sus
  // columnas escalares para que el datamodel temporal sea cerrado.
  const mediaOrigin = extractScalarOnlyModel(baseSchema, 'MediaAsset', {
    derivedFields: MEDIA_DERIVED_FIELDS,
  });

  return [
    generatorMatch[0],
    '',
    'datasource db {',
    '  provider = "postgresql"',
    '  url      = env("POSTGRES_PRISMA_URL")',
    '}',
    '',
    '// ── Origen base (columnas escalares literales del schema real) ──',
    artistOrigin,
    '',
    mediaOrigin,
    '',
    '// ── Career Manifest (bloque literal del schema real) ──',
    careerBlock,
    '',
  ].join('\n');
}

function runDiff(datamodelPath) {
  const res = spawnSync(
    process.execPath,
    [prismaCli(), 'migrate', 'diff', '--from-empty', '--to-schema-datamodel', datamodelPath, '--script'],
    { cwd: ROOT, encoding: 'utf8', shell: false, timeout: 180000 },
  );
  return {
    exit: res.status === null ? 1 : res.status,
    stdout: res.stdout ?? '',
    stderr: res.stderr ?? '',
  };
}

/** Origen base: NO se crea, ya existe (migración 0_baseline). */
const PRE_EXISTING_TABLES = ['artistProfile', 'MediaAsset'];

/** Vuelve idempotente el DDL (relanzable sobre la misma base, como F-6). */
function makeIdempotent(sql) {
  // Las tablas del origen base ya existen por `0_baseline`: su CREATE TABLE se
  // descarta íntegro (incluidos índices y FKs propias) para no redefinir nada.
  let out = sql;
  for (const table of PRE_EXISTING_TABLES) {
    out = out.replace(
      new RegExp(`CREATE TABLE "${table}" \\([\\s\\S]*?\\n\\);\\n`, 'g'),
      `-- "${table}" ya existe (0_baseline): sin CREATE en esta migración.\n`,
    ).replace(
      new RegExp(`ALTER TABLE "${table}" ADD CONSTRAINT[\\s\\S]*?;\\n`, 'g'),
      '',
    );
  }
  return out
    // `CREATE TABLE IF NOT EXISTS\"X\"` sin espacio rompe el parsing de PostgreSQL.
    .replace(/CREATE TABLE IF NOT EXISTS"/g, 'CREATE TABLE IF NOT EXISTS "')
    .replace(/CREATE TABLE (?!IF NOT EXISTS)/g, 'CREATE TABLE IF NOT EXISTS ')
    .replace(/CREATE UNIQUE INDEX (?!IF NOT EXISTS)/g, 'CREATE UNIQUE INDEX IF NOT EXISTS')
    .replace(/CREATE INDEX (?!IF NOT EXISTS)/g, 'CREATE INDEX IF NOT EXISTS')
    // `ALTER TABLE ... ADD CONSTRAINT` no admite IF NOT EXISTS en PostgreSQL: se
    // envuelve en DO $$ con captura de duplicate_object.
    .replace(
      /ALTER TABLE "(\w+)" ADD CONSTRAINT "(\w+)"([\s\S]*?);\n/g,
      (_m, table, constraint, body) =>
        `DO $$\nBEGIN\n  ALTER TABLE "${table}" ADD CONSTRAINT "${constraint}"${body};\nEXCEPTION\n  WHEN duplicate_object THEN NULL;\nEND $$;\n`,
    );
}

const MIGRATION_HEADER = [
  '-- W53_T01 - CAREER MANIFEST (PostgreSQL 16) - DDL EMITIDO POR MAQUINA',
  '--',
  '-- Fuente del DDL (NO transcrito a mano):',
  '--   node scripts/create_career_os_migration.cjs',
  '--   -> node ./node_modules/prisma/build/index.js migrate diff \\',
  '--        --from-empty --to-schema-datamodel <tmp> --script',
  '-- El datamodel temporal se ensambla del propio prisma/schema.prisma:',
  '--   · bloque `// CAREER OS — W53_T01` (12 modelos + 10 enums),',
  '--   · `model artistProfile` base + relacion inversa careerProfile,',
  '--   · `model MediaAsset` base (destino de la FK de Track).',
  '--',
  '-- POR QUE NO HAY DROP: la identidad del artista sigue en `artistProfile`.',
  '-- `ArtistProfile` es una extension 1:1 mapeada a `career_artist_profile`',
  '-- (@@map) y su PK es el id de artistProfile (FK ON DELETE CASCADE).',
  '-- `MediaAsset` solo recibe una columna nullable + indice: cero destruccion.',
  '--',
  '-- Idempotencia (Coolify reejecuta migraciones en contenedores recreados):',
  '--   CREATE TABLE/INDEX -> IF NOT EXISTS · ADD CONSTRAINT -> DO $$ EXCEPTION',
  '--   duplicate_object THEN NULL.',
  '',
].join('\n');

function verifyMigrationFile() {
  const ok = fs.existsSync(MIGRATION_SQL);
  console.log(`[${ok ? 'PASS' : 'FAIL'}] migración presente -> ${path.relative(ROOT, MIGRATION_SQL)}`);
  if (!ok) return 1;
  const sql = fs.readFileSync(MIGRATION_SQL, 'utf8');
  const missing = REQUIRED_TABLES.filter((t) => !sql.includes(`"${t}"`));
  if (missing.length > 0) {
    console.log(`[FAIL] tablas ausentes en el SQL: ${missing.join(', ')}`);
    return 1;
  }
  const drops = /^\s*(DROP|TRUNCATE)\b/im.test(sql);
  console.log(`[${drops ? 'FAIL' : 'PASS'}] cero DROP/TRUNCATE en el DDL`);
  if (drops) return 1;
  console.log(`[PASS] ${REQUIRED_TABLES.length}/${REQUIRED_TABLES.length} tablas del contrato en el SQL`);
  return 0;
}

function generateMigration() {
  if (!fs.existsSync(SCHEMA)) {
    console.error(`ENTORNO_ILEGIBLE: ${path.relative(ROOT, SCHEMA)} no existe.`);
    return 2;
  }

  const schema = fs.readFileSync(SCHEMA, 'utf8');
  let datamodel;
  try {
    datamodel = buildTempDatamodel(schema);
  } catch (error) {
    console.error(`[FAIL] extractor: ${error instanceof Error ? error.message : String(error)}`);
    return 1;
  }

  const tmpPath = path.join(os.tmpdir(), `ear_career_os_${process.pid}.prisma`);
  fs.writeFileSync(tmpPath, datamodel, 'utf8');
  const diff = runDiff(tmpPath);
  fs.rmSync(tmpPath, { force: true });

  if (diff.exit !== 0 || diff.stdout.trim().length === 0) {
    console.error(`[FAIL] prisma migrate diff -> exit ${diff.exit}`);
    console.error(`${diff.stderr}${diff.stdout}`.slice(0, 2000));
    return 1;
  }

  const idempotent = makeIdempotent(diff.stdout.trimEnd());
  const missing = REQUIRED_TABLES.filter((t) => !idempotent.includes(`"${t}"`));
  if (missing.length > 0) {
    console.error(`[FAIL] el DDL emitido no contiene: ${missing.join(', ')}`);
    return 1;
  }

  fs.mkdirSync(MIGRATION_DIR, { recursive: true });
  fs.writeFileSync(MIGRATION_SQL, `${MIGRATION_HEADER}${idempotent}\n`, 'utf8');

  console.log(`[PASS] prisma migrate diff -> exit ${diff.exit}`);
  console.log(`[PASS] ${REQUIRED_TABLES.length}/${REQUIRED_TABLES.length} tablas del contrato en el DDL`);
  console.log(
    `[PASS] escrito ${path.relative(ROOT, MIGRATION_SQL)} (${fs.statSync(MIGRATION_SQL).size} bytes)`,
  );
  console.log('CAREER_OS_MIGRATION=WRITTEN');
  return 0;
}

/**
 * Ejecuta un script SQL sentencia a sentencia. Respeta los bloques `DO $$ ... $$;`
 * (que contienen `;` internos) y descarta líneas de comentario.
 */
async function executeSqlScript(client, script, label) {
  const statements = [];
  let buffer = '';
  let inDollarBlock = false;

  for (const rawLine of script.split('\n')) {
    const line = rawLine.replace(/\r$/, '');
    const trimmed = line.trim();
    if (trimmed.startsWith('--')) continue;
    buffer += `${line}\n`;
    if (trimmed.includes('$$')) {
      // `DO $$` abre y `END $$;` cierra: se cuenta para no partir el bloque.
      const openCount = (trimmed.match(/\$\$/g) ?? []).length;
      if (openCount === 1) inDollarBlock = !inDollarBlock;
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
      // Redeploy: los objetos ya existen (PostgreSQL no admite IF NOT EXISTS en
      // CREATE TYPE / ADD CONSTRAINT). Es el comportamiento esperado de la 2ª pasada.
      if (!/already exists|duplicate/i.test(message)) {
        throw new Error(`[${label}] ${message.slice(0, 400)} :: ${statement.slice(0, 200)}`);
      }
    }
  }
  return applied;
}

/**
 * PUERTA DE APLICACIÓN REAL (2 fases, fiel al deploy de Coolify):
 *   FASE 1 · `0_baseline/migration.sql` — crea las 43 tablas históricas.
 *   FASE 2 · la migración W53 — crea las 12 tablas Career + FK a `artistProfile`.
 * Se aplica contra el PostgreSQL EFÍMERO del arnés (F-6), se comprueba por SQL
 * que las 13 tablas del contrato existen y que una segunda pasada (redeploy) no
 * rompe. Sin PostgreSQL alcanzable se declara SIN_EVIDENCIA (AF-5).
 */
async function applyMigrationToEphemeral() {
  if (!fs.existsSync(MIGRATION_SQL)) {
    console.error('[FAIL] no existe la migración; ejecuta sin --apply primero.');
    return 1;
  }
  const baselineSql = path.join(MIGRATIONS_DIR, '0_baseline', 'migration.sql');
  if (!fs.existsSync(baselineSql)) {
    console.error('ENTORNO_ILEGIBLE: falta prisma/migrations/0_baseline/migration.sql.');
    return 2;
  }

  const { resolveVerificationDatabase } = require('./lib/ephemeral-postgres.cjs');
  const db = await resolveVerificationDatabase();
  if (db === null) {
    console.error('SIN_EVIDENCIA: no hay PostgreSQL alcanzable (declarado ni efímero).');
    return 2;
  }
  console.log(`PostgreSQL: ${db.detail}`);

  // Herramienta de aislamiento: un esquema dedicado por ejecución evita depender
  // del estado residual del clúster efímero (que es cacheado entre arneses).
  const schemaName = `career_verify_${process.pid}`;
  const { PrismaClient } = require('@prisma/client');
  const client = new PrismaClient({
    datasources: { db: { url: db.url } },
    log: [],
  });
  try {
    await client.$executeRawUnsafe(`CREATE SCHEMA IF NOT EXISTS "${schemaName}"`);
    await client.$executeRawUnsafe(`SET search_path TO "${schemaName}"`);
    const baselineApplied = await executeSqlScript(client, fs.readFileSync(baselineSql, 'utf8'), '0_baseline');
    console.log(`[PASS] 0_baseline aplicado (${baselineApplied} sentencias)`);
    const worldApplied = await executeSqlScript(client, fs.readFileSync(MIGRATION_SQL, 'utf8'), 'W53');
    console.log(`[PASS] migración W53 aplicada (${worldApplied} sentencias)`);

    const rows = await client.$queryRawUnsafe(
      `SELECT table_name FROM information_schema.tables WHERE table_schema = '${schemaName}'`,
    );
    const present = new Set(rows.map((r) => r.table_name));
    const missing = REQUIRED_TABLES.filter((t) => !present.has(t));
    if (missing.length > 0) {
      console.error(`[FAIL] tablas ausentes tras aplicar: ${missing.join(', ')}`);
      return 1;
    }
    console.log(`[PASS] ${REQUIRED_TABLES.length}/${REQUIRED_TABLES.length} tablas del contrato visibles por SQL`);

    // Idempotencia: segunda pasada = redeploy de Coolify sobre base viva.
    const replay = await executeSqlScript(client, fs.readFileSync(MIGRATION_SQL, 'utf8'), 'W53 replay');
    console.log(`[PASS] reaplicación idempotente Exit 0 (${replay} sentencias, redeploy Coolify)`);
    console.log('CAREER_OS_MIGRATION=APPLIED');
    return 0;
  } catch (error) {
    console.error(`[FAIL] aplicación SQL: ${error instanceof Error ? error.message : String(error)}`);
    return 1;
  } finally {
    await client.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schemaName}" CASCADE`).catch(() => undefined);
    await client.$disconnect().catch(() => undefined);
    await db.stop().catch(() => undefined);
  }
}

function main() {
  const args = process.argv.slice(2);
  console.log(`── W53_T01 · MIGRACIÓN CAREER OS → prisma/migrations/${MIGRATION_NAME} ──`);
  if (args.includes('--check')) return verifyMigrationFile();
  if (args.includes('--apply')) {
    applyMigrationToEphemeral()
      .then((code) => process.exit(code))
      .catch((error) => {
        console.error(`[FAIL] ${error instanceof Error ? error.message : String(error)}`);
        process.exit(1);
      });
    return undefined;
  }
  return generateMigration();
}

const exitCode = main();
if (typeof exitCode === 'number') process.exit(exitCode);
