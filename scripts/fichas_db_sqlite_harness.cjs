#!/usr/bin/env node
/**
 * ════════════════════════════════════════════════════════════════════════════
 * ARNÉS RELACIONAL DE IDEMPOTENCIA — `node:sqlite` (W44)
 * ════════════════════════════════════════════════════════════════════════════
 * QUÉ ES: un motor SQL REAL, embebido y determinista, que ejecuta el MISMO
 * patrón de escritura que usa el sincronizador de PostgreSQL:
 *   INSERT ... ON CONFLICT ("key") DO UPDATE SET ...   (upsert por PK natural)
 * dentro de transacciones, más una prueba de atomicidad con ROLLBACK.
 *
 * QUÉ NO ES: no es PostgreSQL 16. No prueba el comportamiento del motor
 * remoto (MVCC, WAL, aislamiento SERIALIZABLE, tipos `TEXT[]`). Es evidencia
 * de que el PLAN DE ESCRITURA es idempotente y atómico; la evidencia de
 * PostgreSQL 16 sólo la produce `scripts/verify_fichas_db.ts` contra una base
 * viva. Etiquetarlo como PG16 sería una fachada, y aquí no se firman fachadas.
 *
 * DERIVA CERO: la tabla se genera leyendo `prisma/schema.prisma` en tiempo de
 * ejecución. Si alguien añade una columna al modelo y olvida la lista del
 * contrato (o al revés), el arnés lo canta en `aliasCoverage`.
 * ════════════════════════════════════════════════════════════════════════════
 */
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { DatabaseSync } = require('node:sqlite');

const { PROVIDER_FICHA_COLUMNS, fingerprintRows, upsertArgs } = require('./fichas_db_rows.cjs');

const ROOT = path.resolve(__dirname, '..');
const SCHEMA_PATH = path.join(ROOT, 'prisma', 'schema.prisma');
const MODEL_NAME = 'ProviderFicha';

const SQLITE_AFFINITY = Object.freeze({
  String: 'TEXT',
  Boolean: 'INTEGER',
  Int: 'INTEGER',
  Float: 'REAL',
  DateTime: 'TEXT',
  Json: 'TEXT',
});

/**
 * Extrae los campos escalares del modelo desde el esquema Prisma real.
 * @returns {{ name: string, type: string, list: boolean, optional: boolean, isId: boolean }[]}
 */
function parseModelFields(schemaSource) {
  const block = new RegExp(`model\\s+${MODEL_NAME}\\s*\\{([\\s\\S]*?)\\n\\}`).exec(schemaSource);
  if (block === null) throw new Error(`[fichas:harness] modelo ${MODEL_NAME} ausente en el esquema.`);
  const fields = [];
  for (const rawLine of block[1].split(/\r?\n/)) {
    const line = rawLine.trim();
    if (line.length === 0 || line.startsWith('//') || line.startsWith('@@')) continue;
    const match = /^([A-Za-z_][A-Za-z0-9_]*)\s+([A-Za-z_][A-Za-z0-9_]*)(\[\])?(\?)?\s*(.*)$/.exec(line);
    if (match === null) continue;
    const field = {
      name: match[1],
      type: match[2],
      list: match[3] === '[]',
      optional: match[4] === '?',
      isId: /@id\b/.test(match[5]),
    };
    fields.push(field);
  }
  if (fields.length === 0) throw new Error(`[fichas:harness] modelo ${MODEL_NAME} sin campos escalares.`);
  return fields;
}

/** DDL equivalente en SQLite (afinidades documentadas, no finge ser PG). */
function buildTableDdl(fields) {
  const columns = fields.map((field) => {
    const affinity = field.list ? 'TEXT' : SQLITE_AFFINITY[field.type] || 'TEXT';
    const parts = [`"${field.name}"`, affinity];
    if (field.isId) parts.push('NOT NULL');
    else if (!field.optional) parts.push('NOT NULL');
    if (field.type === 'DateTime' && !field.optional) parts.push('DEFAULT CURRENT_TIMESTAMP');
    return parts.join(' ');
  });
  const primary = fields.filter((field) => field.isId).map((field) => `"${field.name}"`);
  if (primary.length !== 1) throw new Error('[fichas:harness] se exige exactamente una PK simple (@id).');
  return `CREATE TABLE "${MODEL_NAME}" (${columns.join(', ')}, PRIMARY KEY (${primary[0]}))`;
}

/** SQL de upsert por clave natural: el mismo contrato que Prisma `upsert`. */
function buildUpsertSql(columns) {
  const quoted = columns.map((column) => `"${column}"`).join(', ');
  const placeholders = columns.map(() => '?').join(', ');
  const updates = columns
    .filter((column) => column !== 'key')
    .map((column) => `"${column}" = excluded."${column}"`)
    .join(', ');
  return `INSERT INTO "${MODEL_NAME}" (${quoted}) VALUES (${placeholders}) ON CONFLICT ("key") DO UPDATE SET ${updates}`;
}

/** Valor de fila -> parámetro SQLite (booleano 0/1, array JSON, resto tal cual). */
function toSqliteValue(column, value) {
  if (value === undefined || value === null) return null;
  if (Array.isArray(value)) return JSON.stringify(value);
  if (typeof value === 'boolean') return value ? 1 : 0;
  return value;
}

/** Fila SQLite -> fila canónica (restaura listas y booleanos). */

/**
 * Ejecuta el arnés completo sobre una base SQLite en memoria.
 * Sincrónico a propósito: `DatabaseSync` no deja cabos sueltos ni carreras.
 * @param {readonly Record<string, unknown>[]} rows filas del plan (ya validadas)
 * @param {{ passes?: number, schemaPath?: string }} [options]
 */
function runRelationalHarness(rows, options = {}) {
  const passes = typeof options.passes === 'number' && options.passes >= 2 ? Math.trunc(options.passes) : 2;
  const schemaPath = typeof options.schemaPath === 'string' ? options.schemaPath : SCHEMA_PATH;
  const schemaSource = fs.readFileSync(schemaPath, 'utf8');
  const fields = parseModelFields(schemaSource);
  const listSet = new Set(fields.filter((field) => field.list).map((field) => field.name));

  const schemaColumns = fields.map((field) => field.name);
  const declared = [...PROVIDER_FICHA_COLUMNS];
  const missingInSchema = declared.filter((column) => !schemaColumns.includes(column));
  const extraInSchema = schemaColumns.filter(
    (column) => !declared.includes(column) && column !== 'syncedAt' && column !== 'updatedAt',
  );

  const assertions = [];
  const failures = [];
  const record = (name, ok, detail) => {
    assertions.push({ name, ok, detail });
    if (!ok) failures.push(`${name}: ${detail}`);
  };

  const result = {
    engine: 'sqlite (motor relacional embebido · NO es PostgreSQL 16)',
    sqliteVersion: 'unknown',
    schemaColumns,
    aliasCoverage: { missingInSchema, extraInSchema },
    passes,
    rowsPerPass: rows.length,
    countAfterFirstPass: 0,
    countAfterSecondPass: 0,
    fingerprintPlan: '',
    fingerprintFirst: '',
    fingerprintSecond: '',
    duplicateKeys: [],
    rollback: { inserted: 0, countAfterRollback: -1 },
    assertions,
    failures,
    ok: false,
  };

  const db = new DatabaseSync(':memory:');
  try {
    const versionRow = db.prepare('SELECT sqlite_version() AS version').get();
    result.sqliteVersion = String(versionRow.version);
    result.engine = `sqlite ${result.sqliteVersion} (motor relacional embebido · NO es PostgreSQL 16)`;

    db.exec(buildTableDdl(fields));
    const upsert = db.prepare(buildUpsertSql(declared));
    const fingerprintPlan = fingerprintRows(rows);
    result.fingerprintPlan = fingerprintPlan;
    const bind = (row) => declared.map((column) => toSqliteValue(column, row[column]));

    record(
      'cobertura-esquema',
      missingInSchema.length === 0 && extraInSchema.length === 0,
      `declaradas=${declared.length} · esquema=${schemaColumns.length} · faltan=${JSON.stringify(missingInSchema)} · sobran=${JSON.stringify(extraInSchema)}`,
    );

    // ─── 1. Atomicidad: N inserts en transacción revertida => 0 filas ────────
    db.exec('BEGIN');
    for (const row of rows) upsert.run(...bind(row));
    const insideTransaction = Number(db.prepare(`SELECT COUNT(*) AS total FROM "${MODEL_NAME}"`).get().total);
    db.exec('ROLLBACK');
    const afterRollback = Number(db.prepare(`SELECT COUNT(*) AS total FROM "${MODEL_NAME}"`).get().total);
    result.rollback = { inserted: insideTransaction, countAfterRollback: afterRollback };
    record(
      'atomicidad-rollback',
      insideTransaction === rows.length && afterRollback === 0,
      `dentro=${insideTransaction}/${rows.length} · tras ROLLBACK=${afterRollback}`,
    );

    // ─── 2. N pasadas idénticas del upsert => N filas y misma huella ─────────
    for (let pass = 1; pass <= passes; pass += 1) {
      db.exec('BEGIN');
      for (const row of rows) upsert.run(...bind(row));
      db.exec('COMMIT');
      const persisted = readBack(db, declared, listSet);
      const fingerprint = fingerprintRows(persisted);
      if (pass === 1) {
        result.countAfterFirstPass = persisted.length;
        result.fingerprintFirst = fingerprint;
      }
      if (pass === passes) {
        result.countAfterSecondPass = persisted.length;
        result.fingerprintSecond = fingerprint;
      }
      record(
        `pasada-${pass}-filas`,
        persisted.length === rows.length,
        `persistidas=${persisted.length} esperadas=${rows.length}`,
      );
      record(`pasada-${pass}-huella`, fingerprint === fingerprintPlan, `huella=${fingerprint.slice(0, 16)}…`);
    }

    // ─── 3. Claves duplicadas (la PK debe impedirlo por diseño) ──────────────
    const duplicates = db
      .prepare(`SELECT "key" AS k, COUNT(*) AS c FROM "${MODEL_NAME}" GROUP BY "key" HAVING COUNT(*) > 1`)
      .all();
    result.duplicateKeys = duplicates.map((row) => String(row.k));
    record('claves-unicas', result.duplicateKeys.length === 0, `duplicadas=${result.duplicateKeys.length}`);

    result.ok = failures.length === 0;
    return result;
  } finally {
    db.close();
  }
}

/** Lectura completa del estado persistido, restaurada a filas canónicas. */
function readBack(db, columns, listSet) {
  const raw = db.prepare(`SELECT ${columns.map((column) => `"${column}"`).join(', ')} FROM "${MODEL_NAME}"`).all();
  const rows = [];
  for (const item of raw) {
    const row = {};
    for (const column of columns) {
      const value = item[column];
      if (listSet.has(column)) row[column] = typeof value === 'string' ? JSON.parse(value) : [];
      else if (column === 'verified') row[column] = value === 1 || value === true;
      else row[column] = value === undefined ? null : value;
    }
    rows.push(row);
  }
  return rows;
}

module.exports = {
  MODEL_NAME,
  SCHEMA_PATH,
  buildTableDdl,
  buildUpsertSql,
  parseModelFields,
  runRelationalHarness,
};
