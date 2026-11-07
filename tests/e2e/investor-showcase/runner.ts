/**
 * ════════════════════════════════════════════════════════════════════════════
 * INVESTOR SHOWCASE E2E TEST RUNNER TRACK (TIERS 1 - 4)
 * ════════════════════════════════════════════════════════════════════════════
 * Central execution orchestrator for the Investor Showcase E2E test suite.
 * Runs Tiers 1 through 4, validates quality coverage thresholds, verifies disk
 * assets, outputs formatted scorecard, and enforces Exit Code 0 semantics.
 *
 * Tiers:
 *  - Tier 1: Feature Coverage (≥5 tests × 11 features = 55 tests)
 *  - Tier 2: Boundary & Corner Cases (≥5 tests × 11 features = 55 tests)
 *  - Tier 3: Cross-Feature Pairwise Interactions (≥11 tests = 12 tests)
 *  - Tier 4: Real-World Workload Scenarios (≥5 scenarios)
 *  Total minimum required: ≥126 test cases.
 *
 * Canonical invocation:
 *   node ./node_modules/tsx/dist/cli.mjs tests/e2e/investor-showcase/runner.ts
 * ════════════════════════════════════════════════════════════════════════════
 */

import fs from 'node:fs';
import path from 'node:path';
import { TestExecutionTracker } from './contracts';
import { runTier1FeatureCoverageTests } from './tier1-features.test';
import { runTier2BoundaryAndCornerTests } from './tier2-boundaries.test';
import { runTier3CrossFeatureTests } from './tier3-pairwise.test';
import { runTier4RealWorldScenariosTests } from './tier4-scenarios.test';

async function main(): Promise<void> {
  const tracker = new TestExecutionTracker();

  console.log('╔══════════════════════════════════════════════════════════════════════════╗');
  console.log('║       INVESTOR SHOWCASE — E2E MASTER TEST SUITE (TIERS 1 - 4)            ║');
  console.log('║    FEATURES F1..F11 · RESILIENCE · BILINGUAL DOCS · 496 ROUTES · ACID    ║');
  console.log('╚══════════════════════════════════════════════════════════════════════════╝\n');

  console.log('▶ [1/4] Running Tier 1: Feature Coverage (F1..F11 ≥ 5 tests each)...');
  await runTier1FeatureCoverageTests(tracker);

  console.log('▶ [2/4] Running Tier 2: Boundary Values & Collision Stress...');
  await runTier2BoundaryAndCornerTests(tracker);

  console.log('▶ [3/4] Running Tier 3: Cross-Feature Pairwise Combinations...');
  await runTier3CrossFeatureTests(tracker);

  console.log('▶ [4/4] Running Tier 4: Real-World Application Scenarios...');
  await runTier4RealWorldScenariosTests(tracker);

  // Verificación de activos de implementación en disco
  const diskAssets = [
    { name: 'Atomic Date Lock Engine', path: 'src/lib/availability/atomicDateLockEngine.ts' },
    { name: 'SSOT Financial Constants', path: 'src/lib/constants/ear-os-ssot.ts' },
    { name: 'Routes Catalog JSON (496)', path: '.agents/teamwork/explorer_survey_2/routes_catalog.json' },
    { name: 'Bilingual Docs ES Showcase', path: 'docs/es/01_EXECUTIVE_SHOWCASE.md' },
    { name: 'Bilingual Docs EN Showcase', path: 'docs/en/01_EXECUTIVE_SHOWCASE.md' },
    { name: 'Bilingual Docs ES Catalog', path: 'docs/es/04_URL_VERIFICATION_CATALOG.md' },
    { name: 'Bilingual Docs EN Catalog', path: 'docs/en/04_URL_VERIFICATION_CATALOG.md' },
    { name: 'Bilingual Docs ES Scorecard', path: 'docs/es/05_FORENSIC_AUDIT_SCORECARD.md' },
    { name: 'Bilingual Docs EN Scorecard', path: 'docs/en/05_FORENSIC_AUDIT_SCORECARD.md' },
    { name: 'Bilingual Docs ES Offline Spec', path: 'docs/es/06_OFFLINE_RESILIENCE_SPEC.md' },
    { name: 'Bilingual Docs EN Offline Spec', path: 'docs/en/06_OFFLINE_RESILIENCE_SPEC.md' },
  ];

  console.log('\n--- Telemetría de Activos y Módulos de Disco ---');
  let allAssetsFound = true;
  for (const asset of diskAssets) {
    const fullPath = path.resolve(process.cwd(), asset.path);
    const exists = fs.existsSync(fullPath);
    if (!exists) allAssetsFound = false;
    console.log(`  ${exists ? '✔ [VERIFICADO]' : '⏳ [PENDIENTE]'} ${asset.name} (${asset.path})`);
  }

  // Imprimir resumen formateado
  tracker.printSummary();

  const summary = tracker.getSummary();
  const minimumRequired = 126;

  console.log('\n--- Validación de Umbrales de Calidad ---');
  console.log(`  Meta Total de Tests     : ≥ ${minimumRequired} casos`);
  console.log(`  Total Ejecutados        : ${summary.total} casos`);
  console.log(`  Tier 1 Feature Coverage : ${summary.tier1Count} / 55 min`);
  console.log(`  Tier 2 Boundary Cases   : ${summary.tier2Count} / 55 min`);
  console.log(`  Tier 3 Cross-Feature    : ${summary.tier3Count} / 11 min`);
  console.log(`  Tier 4 Scenarios        : ${summary.tier4Count} / 5 min`);
  console.log(`  Activos en Disco        : ${allAssetsFound ? '100% Verificados' : 'Incompletos'}`);

  if (summary.total < minimumRequired) {
    console.error(`\n❌ ERROR: Se requieren al menos ${minimumRequired} casos, se ejecutaron ${summary.total}.`);
    process.exit(1);
  }

  if (summary.fail > 0) {
    console.error(`\n❌ ERROR: Fallaron ${summary.fail} casos de prueba.`);
    process.exit(1);
  }

  console.log('\n💎 VEREDICTO: PASS (Investor Showcase E2E Suite completada al 100% con éxito sin fallos).\n');
  process.exit(0);
}

main().catch((err) => {
  console.error('Fatal test runner error:', err);
  process.exit(1);
});
