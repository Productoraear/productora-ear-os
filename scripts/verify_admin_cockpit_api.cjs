#!/usr/bin/env node
/**
 * scripts/verify_admin_cockpit_api.cjs — Verifica el contrato del BFF (W48_T04)
 * ─────────────────────────────────────────────────────────────────────────────
 * Casos:
 *   1) GET sin sesión       -> 401 + { ok:false, error:'unauthorized' }  (SEC-1)
 *   2) GET con sesión admin -> 200 + snapshot tipado (o 503 fail-closed si DB caída)
 *   3) Forma del snapshot   -> probed/source/mode/checkedAt + dinero en céntimos enteros
 *
 * Uso: node scripts/verify_admin_cockpit_api.cjs [baseUrl]
 */

const BASE = process.argv[2] || process.env.ADMIN_COCKPIT_BASE_URL || 'http://localhost:3007';
const ENDPOINT = `${String(BASE).replace(/\/$/, '')}/api/admin/cockpit`;

function fail(msg) {
  console.error(`  ✗ ${msg}`);
  process.exitCode = 1;
}
function ok(msg) {
  console.log(`  ✓ ${msg}`);
}
function isInteger(n) {
  return typeof n === 'number' && Number.isInteger(n);
}

async function main() {
  console.log(`\nVerificando ${ENDPOINT}\n`);

  // ── Caso 1: sin sesión -> 401 ────────────────────────────────────────────
  const noSession = await fetch(ENDPOINT, { method: 'GET' });
  const noSessionBody = await noSession.json().catch(() => null);
  if (noSession.status !== 401) {
    fail(`esperaba 401 sin sesión, obtuve ${noSession.status}`);
  } else if (!noSessionBody || noSessionBody.ok !== false || noSessionBody.error !== 'unauthorized') {
    fail('401 sin el contrato { ok:false, error:"unauthorized" }');
  } else {
    ok('401 sin sesión + contrato de error correcto (SEC-1)');
  }

  // ── Caso 2: con sesión admin -> 200 / 503 ────────────────────────────────
  const admin = await fetch(ENDPOINT, {
    method: 'GET',
    headers: { cookie: 'ear_admin_token=verify-session; ear_role=admin' },
  });
  const adminBody = await admin.json().catch(() => null);

  if (admin.status === 401) {
    fail('con sesión admin la ruta sigue cerrada (401 inesperado)');
  } else if (admin.status === 503) {
    ok(`503 fail-closed con sesión admin (DB caída): ${adminBody && adminBody.error ? adminBody.error : 'sin error'}`);
  } else if (admin.status === 200) {
    ok('200 con sesión admin');
    if (!adminBody || adminBody.ok !== true || !adminBody.data) {
      fail('falta { ok:true, data } en la respuesta 200');
    } else {
      const d = adminBody.data;
      const checks = [
        ['probed===true', d.probed === true],
        ['source live|static', d.source === 'live' || d.source === 'static'],
        ['mode REAL|SIMULADO', d.mode === 'REAL' || d.mode === 'SIMULADO'],
        ['checkedAt string', typeof d.checkedAt === 'string' && d.checkedAt.length > 0],
        ['totalRevenueCents entero', isInteger(d.totalRevenueCents)],
        ['stripeCustodyCents entero', isInteger(d.stripeCustodyCents)],
        ['b2gTotalCents entero', isInteger(d.b2gTotalCents)],
        ['b2gCeilingCents entero', isInteger(d.b2gCeilingCents)],
        ['splitCents.artista entero', isInteger(d.splitCents && d.splitCents.artista)],
        ['splitCents.earOs entero', isInteger(d.splitCents && d.splitCents.earOs)],
        ['splitCents.vimume entero', isInteger(d.splitCents && d.splitCents.vimume)],
      ];
      for (const [label, passed] of checks) {
        passed ? ok(`snapshot: ${label}`) : fail(`snapshot: ${label}`);
      }
    }
  } else {
    fail(`estado inesperado con sesión admin: ${admin.status}`);
  }

  console.log(process.exitCode === 1 ? '\nVEREDICTO: FAIL\n' : '\nVEREDICTO: PASS\n');
}

main().catch((err) => {
  console.error(`  ✗ excepción: ${err && err.message ? err.message : err}`);
  process.exit(1);
});
