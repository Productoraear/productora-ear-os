/**
 * ═════════════════════════════════════════════════════════════════════════════
 * VERIFICACIÓN DEL Ω-SPATIAL KERNEL — aserciones ejecutables
 * ═════════════════════════════════════════════════════════════════════════════
 * No es documentación: si alguna aserción falla, Exit Code 1 y el bloque cae.
 *
 * USO: npx tsx scripts/verify_spatial_budget.ts
 * ─────────────────────────────────────────────────────────────────────────────
 */

import {
  budgetsEqual,
  effectiveDevicePixelRatio,
  resolveSpatialBudget,
  scaledParticleCount,
  SSR_SIGNALS,
  STATIC_BUDGET,
  type SpatialBudget,
  type SpatialSignals,
} from '../src/lib/spatial/gpuCapability';

interface Case {
  readonly name: string;
  readonly signals: SpatialSignals;
  readonly expectTier: SpatialBudget['tier'];
  readonly expectRender: boolean;
}

const base: SpatialSignals = {
  webgl1: true,
  webgl2: true,
  reducedMotion: false,
  saveData: false,
  deviceMemoryGb: 16,
  hardwareConcurrency: 16,
  viewportWidth: 1920,
};

const cases: ReadonlyArray<Case> = [
  {
    name: 'workstation 16GB/16c/1920 → TIER_S',
    signals: base,
    expectTier: 'TIER_S',
    expectRender: true,
  },
  {
    name: 'portátil 4GB/4c/1280 → TIER_A',
    signals: { ...base, deviceMemoryGb: 4, hardwareConcurrency: 4, viewportWidth: 1280 },
    expectTier: 'TIER_A',
    expectRender: true,
  },
  {
    name: 'móvil 2GB/4c/390 → TIER_B',
    signals: { ...base, deviceMemoryGb: 2, hardwareConcurrency: 4, viewportWidth: 390 },
    expectTier: 'TIER_B',
    expectRender: true,
  },
  {
    name: 'sin WebGL → STATIC',
    signals: { ...base, webgl1: false, webgl2: false },
    expectTier: 'TIER_STATIC',
    expectRender: false,
  },
  {
    name: 'prefers-reduced-motion gana a la potencia',
    signals: { ...base, reducedMotion: true },
    expectTier: 'TIER_STATIC',
    expectRender: false,
  },
  {
    name: 'save-data gana a la potencia',
    signals: { ...base, saveData: true },
    expectTier: 'TIER_STATIC',
    expectRender: false,
  },
];

const failures: string[] = [];

for (const testCase of cases) {
  const budget = resolveSpatialBudget(testCase.signals);
  if (budget.tier !== testCase.expectTier) {
    failures.push(`${testCase.name}: tier ${budget.tier} ≠ ${testCase.expectTier}`);
  }
  if (budget.allowRender !== testCase.expectRender) {
    failures.push(`${testCase.name}: allowRender ${String(budget.allowRender)}`);
  }
}

// SSR determinista: el servidor NUNCA concede render.
const ssrBudget = resolveSpatialBudget(SSR_SIGNALS);
if (ssrBudget.tier !== 'TIER_STATIC' || ssrBudget.allowRender) {
  failures.push('SSR debe resolverse siempre a TIER_STATIC sin render');
}
if (ssrBudget.reason !== STATIC_BUDGET.reason) {
  failures.push('SSR debe conservar el motivo canónico de STATIC_BUDGET');
}

// DPR: un móvil 3x JAMÁS debe renderizar a 3x.
const tierS = resolveSpatialBudget(base);
const dprS = effectiveDevicePixelRatio(tierS, 3);
if (dprS !== tierS.maxDevicePixelRatio) {
  failures.push(`DPR S sin recorte: ${dprS} ≠ ${tierS.maxDevicePixelRatio}`);
}
const tierB = resolveSpatialBudget({ ...base, deviceMemoryGb: 2, viewportWidth: 390 });
if (effectiveDevicePixelRatio(tierB, 3) !== 1) {
  failures.push('DPR B debe recortarse a 1');
}
if (effectiveDevicePixelRatio(tierS, 0) !== 1) {
  failures.push('DPR inválido (0) debe degradar a 1');
}

// Partículas: móvil degrada, pero nunca por debajo del suelo de 60.
const mobileParticles = scaledParticleCount(tierS, 390);
if (mobileParticles >= tierS.maxParticles) {
  failures.push('Partículas en móvil no degradan');
}
if (mobileParticles < 60) {
  failures.push('Partículas por debajo del suelo de 60');
}
if (scaledParticleCount(STATIC_BUDGET, 1920) !== 0) {
  failures.push('TIER_STATIC no debe instanciar partículas');
}

// Igualdad de presupuestos (evita re-render en resize).
if (!budgetsEqual(tierS, resolveSpatialBudget(base))) {
  failures.push('budgetsEqual debe reconocer dos resoluciones idénticas');
}
if (budgetsEqual(tierS, tierB)) {
  failures.push('budgetsEqual no debe confundir TIER_S con TIER_B');
}

const report = {
  veredicto: failures.length === 0 ? 'PASS' : 'FAIL',
  casos: cases.length,
  fallos: failures,
  tiers: {
    S: tierS.maxDevicePixelRatio,
    B: tierB.maxDevicePixelRatio,
    static: STATIC_BUDGET.reason,
  },
};

console.log(JSON.stringify(report, null, 2));

if (failures.length > 0) {
  for (const failure of failures) console.error(`[X] ${failure}`);
  process.exit(1);
}

console.log('[OK] Omega-Spatial Kernel verificado: 6 casos + DPR + partículas + SSR');
