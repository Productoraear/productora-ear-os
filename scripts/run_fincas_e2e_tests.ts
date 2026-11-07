/**
 * ════════════════════════════════════════════════════════════════════════════
 * FINCAS B2B ESCAPARATE — E2E TEST RUNNER TRACK (TIERS 1 - 4)
 * ════════════════════════════════════════════════════════════════════════════
 * Ejecutor principal y orquestador de pruebas de extremo a extremo para las
 * 19 características del escaparate B2B y Pacto de los 100 Fundadores.
 *
 * Ejecución:
 *   npx tsx scripts/run_fincas_e2e_tests.ts
 * o
 *   node ./node_modules/tsx/dist/cli.mjs scripts/run_fincas_e2e_tests.ts
 * ════════════════════════════════════════════════════════════════════════════
 */

import fs from 'node:fs';
import path from 'node:path';
import { TestExecutionTracker } from '../tests/fincas/fincas_test_contracts';
import { runTier1FeatureCoverageTests } from '../tests/fincas/tier1_feature_coverage.test';
import { runTier2BoundaryAndCornerTests } from '../tests/fincas/tier2_boundary_corner.test';
import { runTier3CrossFeatureCombinationsTests } from '../tests/fincas/tier3_cross_feature_combinations.test';
import { runTier4RealWorldScenariosTests } from '../tests/fincas/tier4_real_world_scenarios.test';

async function main(): Promise<void> {
  const tracker = new TestExecutionTracker();

  console.log('╔══════════════════════════════════════════════════════════════════════╗');
  console.log('║       FINCAS B2B ESCAPARATE — E2E TEST SUITE (TIERS 1 - 4)           ║');
  console.log('║       19 FEATURES · SSOT INVARIANTS · INTEGER CENTS · ZERO-LEAK      ║');
  console.log('╚══════════════════════════════════════════════════════════════════════╝\n');

  console.log('▶ [1/4] Ejecutando Tier 1: Feature Coverage (19 Características)...');
  await runTier1FeatureCoverageTests(tracker);

  console.log('▶ [2/4] Ejecutando Tier 2: Boundary & Corner Cases (1.000 iteraciones LCG)...');
  await runTier2BoundaryAndCornerTests(tracker);

  console.log('▶ [3/4] Ejecutando Tier 3: Cross-Feature Combinations (Flujos cruzados)...');
  await runTier3CrossFeatureCombinationsTests(tracker);

  console.log('▶ [4/4] Ejecutando Tier 4: Real-World Scenarios (Simulaciones completas)...');
  await runTier4RealWorldScenariosTests(tracker);

  // Verificación dinámica de módulos implementados en disco
  const implementationModules = [
    { name: 'SSOT Menús 2026', path: 'src/lib/fincas/fincaMenus2026Catalog.ts' },
    { name: 'Motor Financiero Céntimos', path: 'src/lib/fincas/fincaMenuPricingEngine.ts' },
    { name: 'Esquema Territorial JSON-LD', path: 'src/lib/fincas/fincaTerritorialSchema.ts' },
    { name: 'Endpoint Visit Lock Stripe', path: 'src/app/api/fincas/visit-lock/route.ts' },
    { name: 'Server Action Logística 1-Clic', path: 'src/app/actions/fincaLogisticsActions.ts' },
    { name: 'Simulador UI Menús 2026', path: 'src/components/fincas/FincaMenuSimulator2026.tsx' },
  ];

  console.log('\n--- Telemetría de Módulos de Implementación ---');
  for (const mod of implementationModules) {
    const fullPath = path.resolve(process.cwd(), mod.path);
    const exists = fs.existsSync(fullPath);
    console.log(`  ${exists ? '✔ [INSTALADO]' : '⏳ [PENDIENTE_IMPLEMENTACIÓN]'} ${mod.name} (${mod.path})`);
  }

  // Reporte de resultados
  const summary = tracker.getScoreSummary();
  const results = tracker.getResults();

  console.log('\n╔══════════════════════════════════════════════════════════════════════╗');
  console.log('║                      RESUMEN DE EJECUCIÓN E2E                       ║');
  console.log('╚══════════════════════════════════════════════════════════════════════╝');
  console.log(`  Total Casos de Prueba : ${summary.total}`);
  console.log(`  Aprobados (PASS)       : ${summary.pass}`);
  console.log(`  Fallidos (FAIL)        : ${summary.fail}`);
  console.log(`  Pendientes (PENDING)   : ${summary.pending}`);
  console.log(`  Tasa de Éxito          : ${summary.passRatePct}%`);
  console.log(`  Tiempo Total           : ${summary.durationMs} ms\n`);

  console.log('Detalle de casos:');
  for (const r of results) {
    const mark = r.passed ? '✔ PASS' : '✖ FAIL';
    console.log(`  [T${r.tier}] ${mark.padEnd(8)} ${r.testName} (${r.durationMs}ms)`);
    if (r.error) {
      console.error(`      └─ ERROR: ${r.error}`);
    }
  }

  if (summary.fail > 0) {
    console.error(`\n❌ CIERRE CON ERROR: Se detectaron ${summary.fail} pruebas fallidas.`);
    process.exit(1);
  } else {
    console.log('\n💎 VEREDICTO: PASS (Suite E2E completada con éxito sin errores).');
    process.exit(0);
  }
}

main().catch((err) => {
  console.error('FATAL UNCAUGHT RUNNER ERROR:', err);
  process.exit(1);
});
