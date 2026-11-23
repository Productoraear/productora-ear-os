/**
 * VERIFICACIÓN CANÓNICA RAG OTZARRETA (TASK-003) - CJS RUNNER
 */
'use strict';

const { execSync } = require('node:child_process');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const TSX = path.join(ROOT, 'node_modules', 'tsx', 'dist', 'cli.mjs');
const TARGET = path.join(ROOT, 'scripts', 'verify_concierge_otzarreta.cjs');

try {
  const out = execSync(`node "${TSX}" "${TARGET}"`, {
    cwd: ROOT,
    encoding: 'utf8',
    stdio: 'pipe',
  });
  process.stdout.write(out);
  process.exit(0);
} catch (err) {
  process.stderr.write(err.stdout || err.message);
  process.exit(err.status || 1);
}
