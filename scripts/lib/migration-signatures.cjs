#!/usr/bin/env node
/**
 * Mapa de firmas por migración: qué objeto crea cada `migration.sql`.
 * Sirve para decidir, sin ejecutar DDL, si una migración YA está aplicada en una
 * base existente (producción creada a mano) y por tanto puede marcarse como
 * aplicada en el historial de Prisma.
 */
'use strict';

const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..', '..');
const MIGRATIONS_DIR = path.join(ROOT, 'prisma', 'migrations');

function signaturesOf(sql) {
  const tables = [...sql.matchAll(/CREATE TABLE\s+(?:IF NOT EXISTS\s+)?"([^"]+)"/gi)].map((m) => m[1]);
  const types = [...sql.matchAll(/CREATE TYPE\s+"([^"]+)"/gi)].map((m) => m[1]);
  return { tables, types };
}

function listMigrations() {
  return fs
    .readdirSync(MIGRATIONS_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .filter((entry) => fs.existsSync(path.join(MIGRATIONS_DIR, entry.name, 'migration.sql')))
    .map((entry) => {
      const sql = fs.readFileSync(path.join(MIGRATIONS_DIR, entry.name, 'migration.sql'), 'utf8');
      return { name: entry.name, ...signaturesOf(sql) };
    })
    .sort((a, b) => a.name.localeCompare(b.name));
}

module.exports = { listMigrations, signaturesOf };

if (require.main === module) {
  for (const migration of listMigrations()) {
    console.log(
      `${migration.name} tables=[${migration.tables.join(',')}] types=[${migration.types.join(',')}]`,
    );
  }
}
