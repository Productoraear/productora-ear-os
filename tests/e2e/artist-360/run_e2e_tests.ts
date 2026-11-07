/**
 * ════════════════════════════════════════════════════════════════════════════
 * ARTIST PANEL 360 & FICHA INDIVIDUAL — E2E TEST RUNNER TRACK (TIERS 1 - 4)
 * ════════════════════════════════════════════════════════════════════════════
 * Ejecutor maestro y orquestador de pruebas de extremo a extremo para las
 * 14 características oficiales del Panel 360 y Ficha Individual del Artista.
 *
 * Tiers:
 *  - Tier 1: Feature Coverage (≥5 tests per feature = 70 tests)
 *  - Tier 2: Boundary & Corner Cases (≥5 tests per feature = 70 tests)
 *  - Tier 3: Cross-Feature Interactions (≥14 tests)
 *  - Tier 4: Real-World Workload Scenarios (≥7 scenarios)
 *  Total mínimo: ≥161 casos de prueba.
 *
 * Ejecución canónica:
 *   node ./node_modules/tsx/dist/cli.mjs tests/e2e/artist-360/run_e2e_tests.ts
 * ════════════════════════════════════════════════════════════════════════════
 */

import fs from 'node:fs';
import path from 'node:path';
import { TestExecutionTracker } from './test_contracts';
import { runTier1FeatureCoverageTests } from './tier1_feature_coverage.test';
import { runTier2BoundaryAndCornerTests } from './tier2_boundary_cases.test';
import { runTier3CrossFeatureTests } from './tier3_cross_feature.test';
import { runTier4RealWorldScenariosTests } from './tier4_workload_scenarios.test';

async function main(): Promise<void> {
  const tracker = new TestExecutionTracker();

  console.log('╔══════════════════════════════════════════════════════════════════════╗');
  console.log('║       ARTIST PANEL 360 — E2E MASTER TEST SUITE (TIERS 1 - 4)         ║');
  console.log('║   14 FEATURES · SSOT INVARIANTS · INTEGER CENTS · ZERO OFFLINE LEAK  ║');
  console.log('╚══════════════════════════════════════════════════════════════════════╝\n');

  console.log('▶ [1/4] Ejecutando Tier 1: Feature Coverage (14 Features × 5 tests = 70)...');
  await runTier1FeatureCoverageTests(tracker);

  console.log('▶ [2/4] Ejecutando Tier 2: Boundary & Corner Cases (14 Features × 5 = 70)...');
  await runTier2BoundaryAndCornerTests(tracker);

  console.log('▶ [3/4] Ejecutando Tier 3: Cross-Feature Interactions (14 Combinaciones)...');
  await runTier3CrossFeatureTests(tracker);

  console.log('▶ [4/4] Ejecutando Tier 4: Real-World Workload Scenarios (7 Escenarios)...');
  await runTier4RealWorldScenariosTests(tracker);

  // Verificación dinámica de módulos implementados en disco
  const implementationModules = [
    { name: 'Contrato SSOT Artista 360', path: 'src/lib/artists/artist-360-contract.ts' },
    { name: 'Panel 360 Interactivo UI', path: 'src/components/artists/ArtistPanel360.tsx' },
    { name: 'Ruta Universal Artistas [slug]', path: 'src/app/(public)/artistas/[slug]/page.tsx' },
    { name: 'Ruta Flagship Edwin Agudelo', path: 'src/app/(public)/artistas/edwin-agudelo/page.tsx' },
    { name: 'Pestaña Admin Cockpit Artistas', path: 'src/app/(admin)/admin/control/tabs/ArtistasTab.tsx' },
  ];

  console.log('\n--- Telemetría de Módulos de Implementación en Disco ---');
  let allModulesInstalled = true;
  for (const mod of implementationModules) {
    const fullPath = path.resolve(process.cwd(), mod.path);
    const exists = fs.existsSync(fullPath);
    if (!exists) allModulesInstalled = false;
    console.log(`  ${exists ? '✔ [INSTALADO]' : '⏳ [PENDIENTE]'} ${mod.name} (${mod.path})`);
  }

  // Resumen y scorecard
  tracker.printSummary();

  const summary = tracker.getSummary();
  const minimumRequired = 161;

  console.log('\n--- Validación de Umbrales de Calidad ---');
  console.log(`  Meta Total de Tests     : ≥ ${minimumRequired} casos`);
  console.log(`  Total Ejecutados        : ${summary.total} casos`);
  console.log(`  Tier 1 Feature Coverage : ${summary.tier1Count} / 70 min`);
  console.log(`  Tier 2 Boundary Cases   : ${summary.tier2Count} / 70 min`);
  console.log(`  Tier 3 Cross-Feature    : ${summary.tier3Count} / 14 min`);
  console.log(`  Tier 4 Scenarios        : ${summary.tier4Count} / 7 min`);
  console.log(`  Módulos en Disco        : ${allModulesInstalled ? '100% Verificados' : 'Incompletos'}`);

  if (summary.total < minimumRequired) {
    console.error(`\n❌ ERROR: Se requieren al menos ${minimumRequired} casos, se ejecutaron ${summary.total}.`);
    process.exit(1);
  }

  if (summary.fail > 0) {
    console.error(`\n❌ ERROR: Fallaron ${summary.fail} casos de prueba.`);
    process.exit(1);
  }

  console.log('\n💎 VEREDICTO: PASS (Suite E2E Artist 360 completada con éxito al 100% sin errores).\n');
  process.exit(0);
}

main().catch((err) => {
  console.error('Fatal runner error:', err);
  process.exit(1);
});
