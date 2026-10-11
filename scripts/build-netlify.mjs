/**
 * build-netlify.mjs
 * ─────────────────────────────────────────────────────────────────────────────
 * Wrapper de build S-Class inmune a Netlify CI (Exit Code 2).
 *
 * Problema raíz: el script `build` original era `prisma generate && next build`.
 * En Netlify, `prisma generate` aborta el build (Exit Code 2) cuando las
 * variables POSTGRES_PRISMA_URL / POSTGRES_URL_NON_POOLING no están presentes
 * en el entorno de build, aunque el cliente Prisma ya esté generado.
 *
 * Solución: ejecutar `prisma generate` de forma NO bloqueante. Si falla, se
 * registra un warning y se continúa con `next build` (el cliente Prisma ya
 * existe en node_modules/.prisma o se regenera en runtime).
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { spawnSync } from 'node:child_process';

function run(label, command) {
  console.log(`\n▶ ${label}: ${command}`);
  const result = spawnSync(command, {
    stdio: 'inherit',
    shell: true,
    env: process.env,
  });
  return result.status ?? 1;
}

// ── 1. Prisma generate (NO bloqueante) ───────────────────────────────────────
const prismaStatus = run('Prisma generate', 'npx prisma generate');
if (prismaStatus !== 0) {
  console.warn(
    '\n⚠ [build-netlify] prisma generate falló (probable ausencia de POSTGRES_PRISMA_URL en CI).',
  );
  console.warn('⚠ [build-netlify] Continuando con next build usando el cliente Prisma existente.\n');
}

// ── 2. Next build (bloqueante) ───────────────────────────────────────────────
// En entornos de CI / VPS con recursos limitados (1 vCPU / 4GB RAM), Webpack garantiza compilación determinista y sin memory stalls de Turbopack.
const useWebpack = process.env.NEXT_TURBOPACK !== '1';
const buildCmd = useWebpack ? 'npx next build --webpack --no-lint' : 'npx next build --no-lint';
const nextStatus = run('Next build', buildCmd);
if (nextStatus !== 0) {
  console.error(`\n✗ [build-netlify] next build falló con Exit Code ${nextStatus}.`);
  process.exit(nextStatus);
}

console.log('\n✓ [build-netlify] Build completado con Exit Code 0.');
process.exit(0);
