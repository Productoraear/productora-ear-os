#!/usr/bin/env node
/**
 * ════════════════════════════════════════════════════════════════════════════
 * AUDITOR DE CONTRASTE WCAG · PALETA HALLMARK OTZARRETA / SEATING PLANNER
 * ════════════════════════════════════════════════════════════════════════════
 * Comprobación NUMÉRICA de los pares texto/fondo realmente usados en:
 *   · src/app/(public)/otzarreta/page.tsx + src/components/otzarreta/BentoMenuSection.tsx
 *   · src/app/(public)/seating-planner/page.tsx + src/components/seating/*
 *   · src/components/concierge/SovereignConciergeWidget.tsx
 *
 * Umbrales (WCAG 2.2 AA): cuerpo 4.5:1 · texto grande (>= 18.66px bold o
 * 24px) 3:1 · componentes/iconos 3:1.
 *
 * Sin dependencias. `npm run audit:contrast:hallmark`.
 * ════════════════════════════════════════════════════════════════════════════
 */

function hexToRgb(hex) {
  const value = hex.replace('#', '');
  return [0, 2, 4].map((offset) => parseInt(value.slice(offset, offset + 2), 16));
}

function relativeLuminance(hex) {
  const [r, g, b] = hexToRgb(hex).map((channel) => {
    const c = channel / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(foreground, background) {
  const a = relativeLuminance(foreground);
  const b = relativeLuminance(background);
  const [light, dark] = a > b ? [a, b] : [b, a];
  return (light + 0.05) / (dark + 0.05);
}

/** Superficies del sistema. */
const CANVAS = '#030305';
const CARD = '#0A0A0E';
const PANEL = '#0F0F16';
const POPOVER = '#08080C';
const ACCENT = '#ecb613';

/** Pares [texto, fondo, mínimo, descripción]. */
const PAIRS = [
  // Otzarreta · hero y Bento
  ['#F4F1EA', CANVAS, 4.5, 'Titular display sobre lienzo Aura Onyx'],
  ['#C9C4B8', CANVAS, 4.5, 'Párrafo secundario sobre lienzo'],
  ['#D6D2C7', CANVAS, 4.5, 'Lede del hero sobre lienzo'],
  ['#8E8A80', CANVAS, 4.5, 'Texto terciario (dt, notas legales)'],
  ['#F4F1EA', CARD, 4.5, 'Título de menú sobre tarjeta #0A0A0E'],
  ['#C9C4B8', CARD, 4.5, 'Descripción de menú sobre tarjeta'],
  ['#8E8A80', CARD, 4.5, 'Nota de complementos sobre tarjeta'],
  ['#D6D2C7', CARD, 4.5, 'Chip de complemento sobre tarjeta'],
  ['#ecb613', CARD, 3.0, 'Importe del menú (cifra grande) sobre tarjeta'],
  ['#120D00', ACCENT, 4.5, 'Texto del botón primario sobre oro'],
  ['#EDEAE2', '#101018', 4.5, 'Píldora de gala (texto sobre cristal)'],

  // Seating Planner · blueprint
  ['#F4F1EA', PANEL, 4.5, 'Titular de la herramienta sobre panel blueprint'],
  ['#C9C4B8', PANEL, 4.5, 'Cuerpo sobre panel blueprint'],
  ['#8E8A80', PANEL, 4.5, 'Rótulo de escala sobre panel blueprint'],
  ['#F4F1EA', CARD, 4.5, 'Cifra de aforo sobre tarjeta'],
  ['#57d99a', CARD, 4.5, 'Estado correcto sobre tarjeta'],
  ['#FF2B44', CARD, 4.5, 'Estado de error sobre tarjeta'],
  ['#ecb613', PANEL, 3.0, 'Acento sobre panel blueprint (números de mesa)'],

  // Concierge · Maître de Sala
  ['#F4F1EA', POPOVER, 4.5, 'Título del Maître sobre popover'],
  ['#8E8A80', POPOVER, 4.5, 'Estado de línea sobre popover'],
  ['#EDEAE2', PANEL, 4.5, 'Burbuja del asistente sobre #0F0F16'],
  ['#EAF6EF', '#141C18', 4.5, 'Burbuja del usuario'],
  ['#C9C4B8', POPOVER, 4.5, 'Chip de sugerencia sobre popover'],
  ['#ecb613', POPOVER, 3.0, 'Firma del Maître sobre popover'],
  ['#6F6B62', POPOVER, 3.0, 'Marca de tiempo (texto grande/apoyo) sobre popover'],
  // AF-1: el indicador de canal es un anillo de oro estático, no un punto verde
  // de presencia no sondeada. Se audita el token que la UI pinta de verdad.
  ['#ecb613', POPOVER, 3.0, 'Indicador de canal (anillo oro) sobre popover'],

  // Ficha de impresión A4: papel blanco
  ['#18181b', '#ffffff', 4.5, 'Tinta de plano impreso sobre papel'],
  ['#262626', '#ffffff', 4.5, 'Texto secundario impreso sobre papel'],
];

const failures = [];
const rows = PAIRS.map(([fg, bg, min, label]) => {
  const ratio = contrast(fg, bg);
  const pass = ratio >= min;
  if (!pass) failures.push(`${label}: ${fg} sobre ${bg} = ${ratio.toFixed(2)}:1 (< ${min}:1)`);
  return { label, fg, bg, min, ratio: Number(ratio.toFixed(2)), pass };
});

console.log('── CONTRASTE WCAG 2.2 · PALETA HALLMARK OTZARRETA ──');
for (const row of rows) {
  const mark = row.pass ? 'OK  ' : 'FAIL';
  console.log(
    `${mark} ${String(row.ratio).padStart(6)}:1 (min ${row.min}) ${row.label} [${row.fg} / ${row.bg}]`,
  );
}

const worst = rows.reduce((lowest, row) => (row.ratio < lowest.ratio ? row : lowest), rows[0]);
console.log(`\nPares evaluados: ${rows.length} · aprobados: ${rows.filter((r) => r.pass).length}`);
console.log(`Peor par: ${worst.ratio}:1 — ${worst.label}`);

if (failures.length > 0) {
  console.error(`\nCONTRAST_AUDIT=FAIL (${failures.length})`);
  for (const failure of failures) console.error(`  - ${failure}`);
  process.exit(1);
}

console.log('CONTRAST_AUDIT=PASS');
