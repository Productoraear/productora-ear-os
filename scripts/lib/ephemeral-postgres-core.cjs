const fs = require('node:fs');
const net = require('node:net');
const path = require('node:path');
const { fileURLToPath } = require('node:url');

const HERE = __dirname;
const ROOT = path.resolve(HERE, '..', '..');
const CACHE_DIR = path.join(ROOT, 'node_modules', '.cache', 'ear-ephemeral-pg');
const DDL_FILE = path.join(
  ROOT,
  'prisma',
  'migrations',
  '20261109190000_add_live_telemetry_ping',
  'migration.sql',
);
const VERIFY_DB = 'ear_os_verify';
const EPHEMERAL_PORT = Number(process.env.EAR_EPHEMERAL_PG_PORT ?? 55_432);
const EPHEMERAL_URL = `postgresql://ear_verify:ear_verify_local_only@127.0.0.1:${EPHEMERAL_PORT}/${VERIFY_DB}`;

module.exports = { ROOT, CACHE_DIR, DDL_FILE, VERIFY_DB, EPHEMERAL_PORT, EPHEMERAL_URL };
