/**
 * ════════════════════════════════════════════════════════════════════════════
 * PROPERTY-BASED TESTING & ADVERSARIAL STRESS: CART SPLIT & HARE-NIEMEYER
 * ════════════════════════════════════════════════════════════════════════════
 * Challenger: challenger_1 (teamwork_challenger)
 * Target: src/components/checkout/CartContext.tsx (`calculateHareNiemeyerSplit`)
 *
 * Requirements:
 *  1. Property-based testing over 100,000 random cent values [1 to 10,000,000 cents] (100.000 €).
 *  2. Invariant: 100% of cases satisfy `providersTotalCents + earOsCents + vimumeCents === totalCents`.
 *  3. Invariant: 100,00 € deposit deduction holds across all positive balances.
 *  4. Invariant: Largest-remainder bounds (|allocated - quota| < 1.0) strictly maintained.
 *  5. Multi-provider item breakdowns sum exactly to `providersTotalCents`.
 *  6. Price-Lock SHA-256 seal is deterministically 64 hex characters.
 * ════════════════════════════════════════════════════════════════════════════
 */

import { calculateHareNiemeyerSplit } from '../src/components/checkout/CartContext';
import {
  TARIFA_BASE_SOLISTA_EUR,
  DEPOSITO_STRIPE_EUR,
  AJUSTE_PREVENTIVO_B2G_EUR,
  LIMITE_B2G_LCSP_EUR,
} from '../src/lib/constants/ear-os-ssot';

interface SplitTestSummary {
  name: string;
  passed: boolean;
  durationMs: number;
  iterations: number;
  details?: string;
}

const report: SplitTestSummary[] = [];

function assert(cond: boolean, msg: string): void {
  if (!cond) {
    throw new Error(`[ASSERTION_FAILURE] ${msg}`);
  }
}

function runSuite(
  name: string,
  iterations: number,
  fn: (iter: number) => void
): void {
  const t0 = performance.now();
  try {
    for (let i = 0; i < iterations; i++) {
      fn(i);
    }
    const durationMs = performance.now() - t0;
    report.push({ name, passed: true, durationMs, iterations });
    console.log(
      `  ✅ [PASS] ${name} (${iterations.toLocaleString()} iterations in ${durationMs.toFixed(2)}ms)`
    );
  } catch (err) {
    const durationMs = performance.now() - t0;
    const msg = err instanceof Error ? err.message : String(err);
    report.push({ name, passed: false, durationMs, iterations, details: msg });
    console.error(
      `  ❌ [FAIL] ${name} (${iterations.toLocaleString()} iterations in ${durationMs.toFixed(2)}ms): ${msg}`
    );
  }
}

async function main(): Promise<void> {
  console.log('════════════════════════════════════════════════════════════════════════');
  console.log('⚔️  PROPERTY-BASED ADVERSARIAL STRESS TEST: HARE-NIEMEYER CART SPLIT');
  console.log('    100,000 Samples // Integer Cents Invariant // 100 € Deposit Lock');
  console.log('════════════════════════════════════════════════════════════════════════\n');

  /* -------------------------------------------------------------------------- */
  /* SUITE 1: CANONICAL BOUNDARY & EDGE CASES                                    */
  /* -------------------------------------------------------------------------- */
  const edgeCases = [
    { cents: 1, label: '1 cent (0.01 €)' },
    { cents: 2, label: '2 cents (0.02 €)' },
    { cents: 3, label: '3 cents (0.03 €)' },
    { cents: 4, label: '4 cents (0.04 €)' },
    { cents: 5, label: '5 cents (0.05 €)' },
    { cents: 7, label: '7 cents (0.07 €)' },
    { cents: 9, label: '9 cents (0.09 €)' },
    { cents: 10, label: '10 cents (0.10 €)' },
    { cents: 99, label: '99 cents (0.99 €)' },
    { cents: 100, label: '100 cents (1.00 €)' },
    { cents: 9999, label: '9,999 cents (99.99 € - 1c below deposit)' },
    { cents: 10000, label: '10,000 cents (100.00 € - exact deposit)' },
    { cents: 10001, label: '10,001 cents (100.01 € - 1c above deposit)' },
    { cents: Math.round(TARIFA_BASE_SOLISTA_EUR * 100), label: '35,000 cents (350.00 € Solista Base)' },
    { cents: 35001, label: '35,001 cents (350.01 € Odd Cent Remainder)' },
    { cents: 589000, label: '589,000 cents (5,890.00 € Showcase Bundle)' },
    { cents: Math.round(AJUSTE_PREVENTIVO_B2G_EUR * 100), label: '1,425,000 cents (14,250.00 € LCSP Safe Floor)' },
    { cents: Math.round(LIMITE_B2G_LCSP_EUR * 100), label: '1,500,000 cents (15,000.00 € LCSP Ceiling)' },
    { cents: 10000000, label: '10,000,000 cents (100,000.00 € Upper Bound)' },
  ];

  runSuite('Canonical boundary edge cases verification', edgeCases.length, (idx) => {
    const { cents, label } = edgeCases[idx];
    const split = calculateHareNiemeyerSplit(cents);

    // Invariante 1: Suma exacta
    const sum = split.providersTotalCents + split.earOsCents + split.vimumeCents;
    assert(
      sum === cents,
      `[${label}] Sum of split components (${sum}) does NOT match totalCents (${cents})`
    );

    // Invariante 2: Enteros no negativos
    assert(Number.isInteger(split.providersTotalCents) && split.providersTotalCents >= 0, `[${label}] providersTotalCents must be non-negative integer`);
    assert(Number.isInteger(split.earOsCents) && split.earOsCents >= 0, `[${label}] earOsCents must be non-negative integer`);
    assert(Number.isInteger(split.vimumeCents) && split.vimumeCents >= 0, `[${label}] vimumeCents must be non-negative integer`);

    // Invariante 3: Cota de Hare-Niemeyer (|k - quota| < 1.0)
    const qProv = cents * 0.8;
    const qEar = cents * 0.1;
    const qVim = cents * 0.1;
    assert(Math.abs(split.providersTotalCents - qProv) < 1.0, `[${label}] Provider split violates Hare-Niemeyer quota bound`);
    assert(Math.abs(split.earOsCents - qEar) < 1.0, `[${label}] EAR OS split violates Hare-Niemeyer quota bound`);
    assert(Math.abs(split.vimumeCents - qVim) < 1.0, `[${label}] VIMUME split violates Hare-Niemeyer quota bound`);

    // Invariante 4: Depósito 100,00 € (10.000 cts)
    const expectedDeposit = Math.min(cents, 10000);
    const expectedPending = cents - expectedDeposit;
    assert(
      split.depositDeductedCents === expectedDeposit,
      `[${label}] depositDeductedCents ${split.depositDeductedCents} !== expected ${expectedDeposit}`
    );
    assert(
      split.pendingFinalSettlementCents === expectedPending,
      `[${label}] pendingFinalSettlementCents ${split.pendingFinalSettlementCents} !== expected ${expectedPending}`
    );
    assert(
      split.depositDeductedCents + split.pendingFinalSettlementCents === cents,
      `[${label}] deposit + pending must equal totalCents`
    );

    // Sello criptográfico SHA-256
    assert(
      /^[0-9a-f]{64}$/.test(split.priceLockSha256),
      `[${label}] priceLockSha256 must be valid 64-hex SHA-256 string`
    );
  });

  /* -------------------------------------------------------------------------- */
  /* SUITE 2: 100,000 RANDOM PROPERTY-BASED TRIALS (1c TO 10,000,000c)          */
  /* -------------------------------------------------------------------------- */
  const PROPERTY_TEST_COUNT = 100_000;

  // Generador pseudoaleatorio determinista LCG (seed 0xDEADBEEF) para reproducibilidad
  let lcgState = 0xdeadbeef;
  function lcgRandom(): number {
    lcgState = (Math.imul(1664525, lcgState) + 1013904223) >>> 0;
    return lcgState / 4294967296;
  }

  runSuite(
    `Property-based testing: 100,000 random inputs [1 to 10,000,000 cents]`,
    PROPERTY_TEST_COUNT,
    (iter) => {
      // Valor aleatorio entre 1 y 10,000,000 céntimos
      const randomCents = Math.floor(lcgRandom() * 10_000_000) + 1;

      const split = calculateHareNiemeyerSplit(randomCents);

      // Invariante 1: CERO céntimos ganados o perdidos
      const sum = split.providersTotalCents + split.earOsCents + split.vimumeCents;
      if (sum !== randomCents) {
        throw new Error(
          `Iteration ${iter}: INVARIANT_VIOLATION! total=${randomCents}, sum=${sum}, diff=${sum - randomCents}`
        );
      }

      // Invariante 2: Todos son enteros
      if (
        !Number.isInteger(split.providersTotalCents) ||
        !Number.isInteger(split.earOsCents) ||
        !Number.isInteger(split.vimumeCents)
      ) {
        throw new Error(`Iteration ${iter}: NON_INTEGER_CENTS detected for total=${randomCents}`);
      }

      // Invariante 3: Desviación con cuota < 1.0 (propiedad fundamental del mayor resto)
      const qProv = randomCents * 0.8;
      const qEar = randomCents * 0.1;
      const qVim = randomCents * 0.1;

      if (
        Math.abs(split.providersTotalCents - qProv) >= 1.0 ||
        Math.abs(split.earOsCents - qEar) >= 1.0 ||
        Math.abs(split.vimumeCents - qVim) >= 1.0
      ) {
        throw new Error(`Iteration ${iter}: QUOTA_VIOLATION for total=${randomCents}`);
      }

      // Invariante 4: Depósito 100,00 € (10.000 cts) deducible sin balance negativo
      const expectedDeposit = Math.min(randomCents, 10000);
      const expectedPending = randomCents - expectedDeposit;
      if (
        split.depositDeductedCents !== expectedDeposit ||
        split.pendingFinalSettlementCents !== expectedPending ||
        split.depositDeductedCents + split.pendingFinalSettlementCents !== randomCents
      ) {
        throw new Error(`Iteration ${iter}: DEPOSIT_INVARIANT_VIOLATION for total=${randomCents}`);
      }
    }
  );

  /* -------------------------------------------------------------------------- */
  /* SUITE 3: MULTI-PROVIDER CART BREAKDOWN AGGREGATION & CONSERVATION         */
  /* -------------------------------------------------------------------------- */
  runSuite('Multi-provider cart items breakdown conservation', 1000, (iter) => {
    // Generar un carrito con entre 2 y 6 proveedores de distintas categorías
    const categories = ['ARTISTA', 'FINCA', 'SONIDO', 'FLORES', 'CATERING', 'COORDINACION'];
    const numProviders = Math.floor(lcgRandom() * 5) + 2; // 2..6

    const items: Array<{ id: string; name: string; category: string; cents: number }> = [];
    let cartTotalCents = 0;

    for (let p = 0; p < numProviders; p++) {
      const itemCents = Math.floor(lcgRandom() * 250_000) + 1000; // 10.00 € a 2.500.00 €
      cartTotalCents += itemCents;
      items.push({
        id: `prov-${iter}-${p}`,
        name: `Proveedor ${p + 1}`,
        category: categories[p % categories.length],
        cents: itemCents,
      });
    }

    const split = calculateHareNiemeyerSplit(cartTotalCents, 10000, items);

    // Suma global del split
    assert(
      split.providersTotalCents + split.earOsCents + split.vimumeCents === cartTotalCents,
      `Multi-provider global sum must match cart total`
    );

    // Suma individual de los pagos netos a proveedores debe igualar providersTotalCents
    const sumNetPayouts = split.providersBreakdown.reduce((acc, pb) => acc + pb.netPayoutCents, 0);
    assert(
      sumNetPayouts === split.providersTotalCents,
      `Sum of individual provider net payouts (${sumNetPayouts}) must equal providersTotalCents (${split.providersTotalCents})`
    );
  });

  /* -------------------------------------------------------------------------- */
  /* SUITE 4: CUSTOM DEPOSIT BOUNDARIES & RESILIENCE                            */
  /* -------------------------------------------------------------------------- */
  runSuite('Custom deposit boundaries (0 €, 50 €, 120 €, 500 €, total)', 500, (iter) => {
    const totalCents = Math.floor(lcgRandom() * 500_000) + 5000;
    const testDeposits = [
      0, // 0 €
      5000, // 50 €
      10000, // 100 €
      12000, // 120 €
      totalCents, // 100% deposit
      totalCents + 5000, // Exceeding deposit
    ];

    for (const dep of testDeposits) {
      const split = calculateHareNiemeyerSplit(totalCents, dep);
      const expectedDep = Math.min(totalCents, Math.max(0, dep));
      assert(
        split.depositDeductedCents === expectedDep,
        `Deposit must be clamped to [0, totalCents]`
      );
      assert(
        split.pendingFinalSettlementCents === totalCents - expectedDep,
        `Pending settlement must equal total - clamped deposit`
      );
      assert(
        split.depositDeductedCents + split.pendingFinalSettlementCents === totalCents,
        `Deposit + pending must conserve totalCents`
      );
    }
  });

  /* -------------------------------------------------------------------------- */
  /* SUMMARY REPORT                                                             */
  /* -------------------------------------------------------------------------- */
  console.log('\n════════════════════════════════════════════════════════════════════════');
  console.log('📊 RESULTS SUMMARY: CART SPLIT PROPERTY-BASED ADVERSARIAL TEST');
  console.log('════════════════════════════════════════════════════════════════════════');

  const totalSuites = report.length;
  const passedSuites = report.filter((r) => r.passed).length;
  const failedSuites = report.filter((r) => !r.passed).length;
  const totalIterations = report.reduce((acc, r) => acc + r.iterations, 0);

  for (const r of report) {
    console.log(
      `  ${r.passed ? '✅' : '❌'} ${r.name} — ${r.iterations.toLocaleString()} checks in ${r.durationMs.toFixed(2)}ms`
    );
    if (r.details) {
      console.log(`     Error details: ${r.details}`);
    }
  }

  console.log(
    `\nTotal suites: ${totalSuites} | Passed: ${passedSuites} | Failed: ${failedSuites} | Total checks executed: ${totalIterations.toLocaleString()}`
  );

  if (failedSuites === 0) {
    console.log(
      '\n🏆 [EXIT 0] Mathematical proof & empirical verification complete: 0 cents lost or gained across 100,000+ random inputs.'
    );
    process.exit(0);
  } else {
    console.error(`\n💥 [EXIT 1] ${failedSuites} test suites failed.`);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('💥 Fatal error in cart split test harness:', err);
  process.exit(1);
});
