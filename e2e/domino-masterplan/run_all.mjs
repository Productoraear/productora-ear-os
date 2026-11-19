/**
 * ════════════════════════════════════════════════════════════════════════════
 * EAR OS — OPAQUE-BOX E2E SUITE ENTRYPOINT (71 TESTS ACROSS TIERS 1–4)
 * ════════════════════════════════════════════════════════════════════════════
 * Usage: node e2e/domino-masterplan/run_all.mjs
 * Exits 0 iff all 71 tests pass (failed === 0); exits 1 otherwise.
 * ════════════════════════════════════════════════════════════════════════════
 */

import { runTier1 } from './tier1_features.mjs';
import { runTier2 } from './tier2_boundaries.mjs';
import { runTier3 } from './tier3_pairwise.mjs';
import { runTier4 } from './tier4_scenarios.mjs';

function summarizeBy(items, keyFn) {
  const map = new Map();
  for (const item of items) {
    for (const key of keyFn(item)) {
      if (!map.has(key)) map.set(key, { total: 0, passed: 0, failed: 0 });
      const bucket = map.get(key);
      bucket.total += 1;
      if (item.status === 'PASS') bucket.passed += 1;
      else bucket.failed += 1;
    }
  }
  return map;
}

function printTierResults(label, items) {
  console.log(`--- ${label} (${items.length} tests) ---`);
  for (const r of items) {
    const tag = r.status === 'PASS' ? '[PASS]' : '[FAIL]';
    const detail = r.status === 'PASS' ? '' : ` :: ${r.reason}`;
    console.log(`${tag} ${r.id} (${r.tier} | ${r.area}) ${r.title} [${r.durationMs}ms]${detail}`);
  }
  console.log('');
}

async function main() {
  const startedAt = Date.now();
  console.log('========================================================================');
  console.log(' EAR OS — DOMINO MASTER PLAN OPAQUE-BOX E2E SUITE (TIERS 1-4 · 71 TESTS)');
  console.log('========================================================================\n');

  const t1 = await runTier1();
  printTierResults('TIER 1 — FEATURE COVERAGE', t1);

  const t2 = await runTier2();
  printTierResults('TIER 2 — BOUNDARY & CORNER CASES', t2);

  const t3 = await runTier3();
  printTierResults('TIER 3 — CROSS-FEATURE PAIRWISE', t3);

  const t4 = await runTier4();
  printTierResults('TIER 4 — REAL-WORLD SCENARIOS', t4);

  const all = [...t1, ...t2, ...t3, ...t4];

  const passed = all.filter((r) => r.status === 'PASS').length;
  const failed = all.length - passed;
  const elapsedMs = Date.now() - startedAt;

  console.log('\n------------------------------------------------------------------------');
  console.log(' TIER SUMMARY');
  console.log('------------------------------------------------------------------------');
  const byTier = summarizeBy(all, (r) => [r.tier]);
  for (const tier of ['T1', 'T2', 'T3', 'T4']) {
    const b = byTier.get(tier) || { total: 0, passed: 0, failed: 0 };
    console.log(`  ${tier}: ${b.passed}/${b.total} PASS (${b.failed} FAIL)`);
  }

  console.log('\n------------------------------------------------------------------------');
  console.log(' REQUIREMENT COVERAGE SUMMARY (R1-R5)');
  console.log('------------------------------------------------------------------------');
  const byReq = summarizeBy(all, (r) => r.area.split(/[,x]/).map((s) => s.trim()));
  for (const req of ['R1', 'R2', 'R3', 'R4', 'R5']) {
    const b = byReq.get(req) || { total: 0, passed: 0, failed: 0 };
    console.log(`  ${req}: ${b.passed}/${b.total} PASS (${b.failed} FAIL)`);
  }

  console.log('\n========================================================================');
  console.log(` TOTAL: ${passed}/${all.length} PASS | ${failed} FAIL | ${elapsedMs}ms`);
  console.log('========================================================================');

  process.exitCode = failed === 0 && all.length === 71 ? 0 : 1;
}

main().catch((err) => {
  console.error('FATAL RUNNER ERROR:', err);
  process.exitCode = 1;
});
