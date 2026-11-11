/**
 * F-9 · Ejecuta el arnés de persistencia contra la base declarada en `.env.local`
 * (Supabase pooler), exportándola como `EAR_VERIFY_DATABASE_URL` para que
 * `resolveVerificationDatabase()` la use en lugar del PostgreSQL efímero local.
 * Existe porque el clúster efímero puede quedar bloqueado por un postmaster
 * huérfano (ver scripts/ledger_append_claim.cjs:106-130) y el producto no debe
 * salir SOSPECHOSO por un zombie del arnés. No imprime la URL (INV-14).
 */
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const ROOT = path.resolve(__dirname, '..');
const line = fs
  .readFileSync(path.join(ROOT, '.env.local'), 'utf8')
  .split(/\r?\n/)
  .find((l) => l.startsWith('POSTGRES_PRISMA_URL='));

if (!line) {
  console.error('SIN_EVIDENCIA: POSTGRES_PRISMA_URL no declarada en .env.local');
  process.exit(2);
}

const url = line.slice('POSTGRES_PRISMA_URL='.length).trim().replace(/^["']|["']$/g, '');
const result = spawnSync(process.execPath, ['scripts/verify_telemetry_persistence.cjs'], {
  cwd: ROOT,
  encoding: 'utf8',
  env: { ...process.env, EAR_VERIFY_DATABASE_URL: url },
  timeout: 180_000,
});

process.stdout.write(result.stdout || '');
process.stderr.write(result.stderr || '');
process.exit(typeof result.status === 'number' ? result.status : 1);
