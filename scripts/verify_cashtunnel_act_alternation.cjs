#!/usr/bin/env node
/**
 * ════════════════════════════════════════════════════════════════════════════
 * VERIFY · CASH-TUNNEL ACT ALTERNATION (INV-11 · INV-18 · G-7 · G-8)
 * ════════════════════════════════════════════════════════════════════════════
 * Prueba MECÁNICA de que el copy de los 4 actos del Scrollytelling Cash-Tunnel
 * nunca se solapa en pantalla. Reproduce la interpolación lineal por tramos de
 * `framer-motion` (`useTransform` con clamp por defecto) sobre las MISMAS
 * ventanas que declara `src/components/home/ScrollytellingCashTunnel.tsx`.
 *
 * Invariantes verificadas:
 *   A1 · Alternancia estricta del COPY: en ningún punto del scroll hay dos
 *        titulares con opacidad legible simultánea (≤ 1 activo por muestra).
 *   A2 · Sin zonas muertas: el copy está presente en ≥ 99 % del recorrido.
 *   A3 · Cada ventana de opacidad queda CONFINADA en su propio tramo
 *        [start, end] = [i/4, (i+1)/4] (cero extrapolación cruzada).
 *   A4 · La PLACA VISUAL conserva cross-fade: la suma de opacidades de los
 *        backdrops es ≈ 1 en todo el track (sin flash negro).
 *   A5 · Anclaje al código: el componente declara las ventanas estrictas y ya
 *        no exporta el helper antiguo `useActOpacity`.
 *
 * Uso:  node scripts/verify_cashtunnel_act_alternation.cjs
 * Exit: 0 = contrato cumplido · 1 = defecto detectado.
 * ════════════════════════════════════════════════════════════════════════════
 */

'use strict';

const fs = require('node:fs');
const path = require('node:path');

const ACT_COUNT = 4;
const FADE = 0.07;
const SOURCE = path.join(
  __dirname,
  '..',
  'src',
  'components',
  'home',
  'ScrollytellingCashTunnel.tsx'
);

/** Interpolación lineal por tramos con clamp (semántica de `useTransform`). */
function interpolate(progress, input, output) {
  if (progress <= input[0]) return output[0];
  if (progress >= input[input.length - 1]) return output[output.length - 1];
  for (let i = 0; i < input.length - 1; i += 1) {
    const a = input[i];
    const b = input[i + 1];
    if (progress >= a && progress <= b) {
      const t = b === a ? 0 : (progress - a) / (b - a);
      return output[i] + (output[i + 1] - output[i]) * t;
    }
  }
  return output[output.length - 1];
}

function actWindow(index) {
  return { start: index / ACT_COUNT, end: (index + 1) / ACT_COUNT };
}

/** Espejo exacto de `useBackdropOpacity` del componente. */
function backdropCurve(index) {
  const { start, end } = actWindow(index);
  const isFirst = index === 0;
  const isLast = index === ACT_COUNT - 1;
  const input = isFirst
    ? [0, Math.max(end - FADE, 0.02), end + FADE]
    : isLast
      ? [start - FADE, Math.min(start + FADE, 0.98), 1]
      : [start - FADE, start + FADE, end - FADE, end + FADE];
  const output = isFirst ? [1, 1, 0] : isLast ? [0, 1, 1] : [0, 1, 1, 0];
  return { input, output };
}

/** Espejo exacto de `useCopyOpacity` del componente. */
function copyCurve(index) {
  const { start, end } = actWindow(index);
  const isFirst = index === 0;
  const isLast = index === ACT_COUNT - 1;
  const fade = Math.min(FADE, (end - start) / 2);
  const input = isFirst
    ? [0, end - fade, end]
    : isLast
      ? [start, start + fade, 1]
      : [start, start + fade, end - fade, end];
  const output = isFirst ? [1, 1, 0] : isLast ? [0, 1, 1] : [0, 1, 1, 0];
  return { input, output };
}

const COPY = Array.from({ length: ACT_COUNT }, (_, i) => copyCurve(i));
const BACKDROP = Array.from({ length: ACT_COUNT }, (_, i) => backdropCurve(i));

const failures = [];
const LEGIBLE = 0.02;
const STEPS = 4000;

let maxSimultaneous = 0;
let deadSamples = 0;
let minBackdropSum = Infinity;
let maxBackdropSum = -Infinity;

for (let s = 0; s <= STEPS; s += 1) {
  const p = s / STEPS;

  const copyOpacities = COPY.map((c) => interpolate(p, c.input, c.output));
  const legible = copyOpacities.filter((o) => o > LEGIBLE).length;
  maxSimultaneous = Math.max(maxSimultaneous, legible);
  if (legible === 0) deadSamples += 1;

  const backdropOpacities = BACKDROP.map((b) => interpolate(p, b.input, b.output));
  const sum = backdropOpacities.reduce((acc, o) => acc + o, 0);
  minBackdropSum = Math.min(minBackdropSum, sum);
  maxBackdropSum = Math.max(maxBackdropSum, sum);

  // A3 · confinamiento: fuera de su ventana, el copy de cada acto vale 0.
  for (let i = 0; i < ACT_COUNT; i += 1) {
    const { start, end } = actWindow(i);
    const outside = p < start - 1e-9 || p > end + 1e-9;
    if (outside && copyOpacities[i] > 1e-9) {
      failures.push(
        `A3 · acto ${i + 1} con opacidad ${copyOpacities[i].toFixed(4)} fuera de su ventana [${start}, ${end}] en p=${p}`
      );
    }
  }
}

const deadFraction = deadSamples / (STEPS + 1);

if (maxSimultaneous > 1) {
  failures.push(`A1 · ${maxSimultaneous} copys legibles simultáneamente (máximo permitido: 1)`);
}
if (deadFraction > 0.01) {
  failures.push(`A2 · ${(deadFraction * 100).toFixed(2)} % del track sin copy visible (máximo: 1 %)`);
}
if (minBackdropSum < 0.9) {
  failures.push(`A4 · suma de backdrops cae a ${minBackdropSum.toFixed(3)} (flash negro)`);
}

// A5 · anclaje al código fuente real.
const source = fs.readFileSync(SOURCE, 'utf8');
const anchors = [
  ['useCopyOpacity', 'falta el helper de copy estricto'],
  ['useBackdropOpacity', 'falta el helper de backdrop con cross-fade'],
  ['[start, start + fade, end - fade, end]', 'falta la ventana estricta del copy intermedio'],
  ['[0, end - fade, end]', 'falta la ventana estricta del primer acto'],
  ['[start, start + fade, 1]', 'falta la ventana estricta del último acto'],
  ['visibility: isActive', 'falta el apagado real de visibilidad'],
  ['aria-hidden={isActive', 'falta el aislamiento para lectores de pantalla'],
];
for (const [needle, reason] of anchors) {
  if (!source.includes(needle)) failures.push(`A5 · ${reason} (no aparece «${needle}»)`);
}
if (source.includes('useActOpacity')) {
  failures.push('A5 · el helper antiguo `useActOpacity` sigue en el componente');
}

console.log('CASH-TUNNEL · ALTERNANCIA DE ACTOS');
console.log(`  muestras             : ${STEPS + 1}`);
console.log(`  copys simultáneos    : ${maxSimultaneous} (máx. 1)`);
console.log(`  track sin copy       : ${(deadFraction * 100).toFixed(3)} % (máx. 1 %)`);
console.log(`  suma backdrop        : ${minBackdropSum.toFixed(3)} .. ${maxBackdropSum.toFixed(3)} (mín. 0.9)`);
console.log('  ventanas de copy     :');
for (let i = 0; i < ACT_COUNT; i += 1) {
  const { start, end } = actWindow(i);
  console.log(
    `    acto ${i + 1} · [${start.toFixed(2)}, ${end.toFixed(2)}] · input [${COPY[i].input
      .map((n) => n.toFixed(2))
      .join(', ')}]`
  );
}

if (failures.length > 0) {
  console.error('\nRESULTADO: FALLO');
  for (const failure of failures) console.error(`  - ${failure}`);
  process.exit(1);
}

console.log('\nRESULTADO: 4/4 ACTOS EN ALTERNANCIA ESTRICTA · EXIT CODE 0');
process.exit(0);
