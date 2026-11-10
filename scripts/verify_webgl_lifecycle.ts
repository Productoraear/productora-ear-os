/**
 * ═════════════════════════════════════════════════════════════════════════════
 * VERIFICACIÓN DEL CICLO DE VIDA WEBGL (hallazgo F-4) — aserciones ejecutables
 * ═════════════════════════════════════════════════════════════════════════════
 * No es documentación: si una aserción falla, Exit Code 1 y el bloque cae.
 *
 * Cubre las DOS garantías exigidas por la orden F-4:
 *   A. `prefers-reduced-motion` ⇒ alternativa estática, 0 contexto WebGL.
 *   B. Fuera de viewport ⇒ bucle rAF detenido (0% CPU/GPU), contexto conservado.
 *
 * Además audita el hero REAL `PrismaDiamondHero3D.tsx` en disco: el bug de
 * origen era que el componente ignoraba las tres garantías aunque los hooks ya
 * existieran. Un verificador que sólo prueba la función pura certificaría una
 * librería que nadie usa (falso verde AF-5).
 *
 * USO: node ./node_modules/tsx/dist/cli.mjs scripts/verify_webgl_lifecycle.ts
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  describeWebglLifecycle,
  resolveWebglLifecycle,
  shouldRenderFrame,
  type WebglLifecycleReason,
  type WebglLifecycleSignals,
  type WebglLifecycleState,
} from '../src/lib/spatial/webglLifecycle';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const HERO_PATH = join(ROOT, 'src', 'components', 'sclass', 'PrismaDiamondHero3D.tsx');

const failures: string[] = [];
let assertions = 0;

function check(condition: boolean, message: string): void {
  assertions += 1;
  if (!condition) failures.push(message);
}

interface LifecycleCase {
  readonly name: string;
  readonly signals: WebglLifecycleSignals;
  readonly expectState: WebglLifecycleState;
  readonly expectReason: WebglLifecycleReason;
  readonly expectMount: boolean;
  readonly expectAnimate: boolean;
  readonly expectStaticAlternative: boolean;
}

const running: WebglLifecycleSignals = {
  allowRender: true,
  budgetReason: 'webgl2+high-memory',
  staticFallback: false,
  inViewport: true,
  documentVisible: true,
};

const cases: ReadonlyArray<LifecycleCase> = [
  {
    name: 'TIER_S en viewport y pestana visible -> running',
    signals: running,
    expectState: 'running',
    expectReason: 'running',
    expectMount: true,
    expectAnimate: true,
    expectStaticAlternative: false,
  },
  {
    // GARANTIA B: salir de viewport debe detener el bucle, conservando contexto.
    name: 'fuera de viewport -> paused (rAF detenido, contexto conservado)',
    signals: { ...running, inViewport: false },
    expectState: 'paused',
    expectReason: 'paused-out-of-viewport',
    expectMount: true,
    expectAnimate: false,
    expectStaticAlternative: false,
  },
  {
    name: 'pestana oculta -> paused',
    signals: { ...running, documentVisible: false },
    expectState: 'paused',
    expectReason: 'paused-document-hidden',
    expectMount: true,
    expectAnimate: false,
    expectStaticAlternative: false,
  },
  {
    // GARANTIA A: la preferencia del usuario gana a la potencia del equipo.
    name: 'prefers-reduced-motion en workstation TIER_S -> static',
    signals: { ...running, allowRender: false, budgetReason: 'prefers-reduced-motion' },
    expectState: 'static',
    expectReason: 'static-reduced-motion',
    expectMount: false,
    expectAnimate: false,
    expectStaticAlternative: true,
  },
  {
    name: 'prefers-reduced-motion gana aunque este fuera de viewport',
    signals: {
      ...running,
      allowRender: false,
      budgetReason: 'prefers-reduced-motion',
      inViewport: false,
      documentVisible: false,
    },
    expectState: 'static',
    expectReason: 'static-reduced-motion',
    expectMount: false,
    expectAnimate: false,
    expectStaticAlternative: true,
  },
  {
    name: 'SSR (sin senales de dispositivo) -> static',
    signals: { ...running, allowRender: false, budgetReason: 'ssr-no-device-signals' },
    expectState: 'static',
    expectReason: 'static-ssr',
    expectMount: false,
    expectAnimate: false,
    expectStaticAlternative: true,
  },
  {
    name: 'sin contexto WebGL -> static',
    signals: { ...running, allowRender: false, budgetReason: 'no-webgl-context' },
    expectState: 'static',
    expectReason: 'static-no-webgl',
    expectMount: false,
    expectAnimate: false,
    expectStaticAlternative: true,
  },
  {
    name: 'save-data -> static',
    signals: { ...running, allowRender: false, budgetReason: 'save-data-enabled' },
    expectState: 'static',
    expectReason: 'static-save-data',
    expectMount: false,
    expectAnimate: false,
    expectStaticAlternative: true,
  },
  {
    name: 'alternativa estatica solicitada -> static (sin crear canvas)',
    signals: { ...running, staticFallback: true },
    expectState: 'static',
    expectReason: 'static-fallback-requested',
    expectMount: false,
    expectAnimate: false,
    expectStaticAlternative: true,
  },
  {
    name: 'budget denegado por motivo desconocido -> static-budget',
    signals: { ...running, allowRender: false, budgetReason: 'unknown-budget-reason' },
    expectState: 'static',
    expectReason: 'static-budget',
    expectMount: false,
    expectAnimate: false,
    expectStaticAlternative: true,
  },
  {
    name: 'TIER_B en movil dentro de viewport -> running',
    signals: { ...running, budgetReason: 'low-end-conservative' },
    expectState: 'running',
    expectReason: 'running',
    expectMount: true,
    expectAnimate: true,
    expectStaticAlternative: false,
  },
];

for (const testCase of cases) {
  const decision = resolveWebglLifecycle(testCase.signals);
  check(
    decision.state === testCase.expectState,
    `${testCase.name}: estado ${decision.state} != ${testCase.expectState}`,
  );
  check(
    decision.reason === testCase.expectReason,
    `${testCase.name}: motivo ${decision.reason} != ${testCase.expectReason}`,
  );
  check(
    decision.shouldMountCanvas === testCase.expectMount,
    `${testCase.name}: shouldMountCanvas ${String(decision.shouldMountCanvas)}`,
  );
  check(
    decision.shouldAnimate === testCase.expectAnimate,
    `${testCase.name}: shouldAnimate ${String(decision.shouldAnimate)}`,
  );
  check(
    decision.shouldRenderStaticAlternative === testCase.expectStaticAlternative,
    `${testCase.name}: shouldRenderStaticAlternative ${String(decision.shouldRenderStaticAlternative)}`,
  );

  // INVARIANTE DURO: 'static' JAMAS crea contexto WebGL ni anima.
  if (decision.state === 'static') {
    check(!decision.shouldMountCanvas, `${testCase.name}: 'static' no puede crear contexto WebGL`);
    check(!decision.shouldAnimate, `${testCase.name}: 'static' no puede animar`);
  }

  // INVARIANTE DURO: solo 'running' anima (claim de 0% CPU fuera de viewport).
  check(
    decision.shouldAnimate === (decision.state === 'running'),
    `${testCase.name}: shouldAnimate debe equivaler a state==='running'`,
  );
}

// Etiqueta de telemetria estable (contrato con el DOM / Playwright).
check(
  describeWebglLifecycle(resolveWebglLifecycle(running)) === 'running:running',
  'describeWebglLifecycle debe emitir "running:running"',
);
check(
  describeWebglLifecycle(resolveWebglLifecycle({ ...running, inViewport: false })) ===
    'paused:paused-out-of-viewport',
  'describeWebglLifecycle debe emitir "paused:paused-out-of-viewport"',
);

// Presupuesto de frames: TIER_B no debe pintar a 60 fps.
check(shouldRenderFrame(16.7, 60) === true, 'shouldRenderFrame: 16.7 ms a 60 fps debe pintar');
check(shouldRenderFrame(10, 60) === false, 'shouldRenderFrame: 10 ms a 60 fps NO debe pintar');
check(shouldRenderFrame(20, 30) === false, 'shouldRenderFrame: 20 ms a 30 fps NO debe pintar');
check(shouldRenderFrame(40, 30) === true, 'shouldRenderFrame: 40 ms a 30 fps debe pintar');
check(shouldRenderFrame(16.7, 0) === false, 'shouldRenderFrame: targetFps 0 (estatico) nunca pinta');

// ── Auditoria en disco del hero REAL ────────────────────────────────────────
let heroSource = '';
try {
  heroSource = readFileSync(HERO_PATH, 'utf8');
} catch {
  failures.push(`No se pudo leer el hero 3D en ${HERO_PATH}`);
}

if (heroSource.length > 0) {
  check(
    heroSource.includes('useWebglLifecycle'),
    'PrismaDiamondHero3D debe consumir useWebglLifecycle (F-4)',
  );
  check(
    heroSource.includes('shouldAnimate'),
    'PrismaDiamondHero3D debe gobernar el bucle por `shouldAnimate`',
  );
  check(
    /cancelAnimationFrame\s*\(\s*animationFrameId\s*\)/.test(heroSource),
    'PrismaDiamondHero3D debe cancelar el rAF al pausarse (si no, el bucle zombi sigue)',
  );
  check(
    heroSource.includes('data-webgl-state'),
    'PrismaDiamondHero3D debe publicar `data-webgl-state` para telemetria de campo',
  );
  check(
    heroSource.includes('shouldMountCanvas'),
    'El renderer WebGL no puede crearse sin la guarda `shouldMountCanvas`',
  );
  check(
    heroSource.includes('shouldRenderStaticAlternative'),
    'El hero debe pintar la alternativa estatica sin inicializar el canvas WebGL',
  );
}

const report = {
  veredicto: failures.length === 0 ? 'PASS' : 'FAIL',
  casos: cases.length,
  aserciones: assertions,
  hero: 'src/components/sclass/PrismaDiamondHero3D.tsx',
  fallos: failures,
};

console.log(JSON.stringify(report, null, 2));

if (failures.length > 0) {
  for (const failure of failures) console.error(`[X] ${failure}`);
  process.exit(1);
}

console.log(
  `[OK] WebGL lifecycle verificado: ${cases.length} casos, ${assertions} aserciones, hero F-4 cableado`,
);
