/**
 * Resumen compacto del informe de contraste (no escribe nada, solo lee).
 * Uso: node .antigravity/summarize_contrast_report.cjs
 */
'use strict';

const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const FILE = path.join(ROOT, 'reports', 'contrast', 'wcag_report.json');

if (!fs.existsSync(FILE)) {
  console.log('SIN_EVIDENCIA: no existe reports/contrast/wcag_report.json');
  process.exit(2);
}

const report = JSON.parse(fs.readFileSync(FILE, 'utf8'));
console.log(`generatedAt=${report.generatedAt}`);
console.log(`base=${report.base}`);
console.log(`preflight=${JSON.stringify(report.preflight || null)}`);
let totalF = 0;
let totalI = 0;
for (const [route, data] of Object.entries(report.routes || {})) {
  const failures = Array.isArray(data.failures) ? data.failures.length : 0;
  const indet = Array.isArray(data.indeterminate) ? data.indeterminate.length : 0;
  totalF += failures;
  totalI += indet;
  console.log(`route=${route} status=${data.status} scanned=${data.scanned} failures=${failures} indeterminate=${indet}`);
}
console.log(`TOTAL_FAILURES=${totalF}`);
console.log(`TOTAL_INDETERMINATE=${totalI}`);

// Desglose por token: un fallo de contraste se arregla por causa (color/tamaño),
// no elemento a elemento. Agrupa para saber cuántos toca cambiar de verdad.
const groups = new Map();
for (const data of Object.values(report.routes || {})) {
  for (const f of data.failures || []) {
    const key = `${f.color} on ${f.background} @${f.fontSize}px/${f.fontWeight} (${f.ratio}:1 < ${f.required}:1)`;
    const hit = groups.get(key) || { count: 0, sample: f.text };
    hit.count += 1;
    groups.set(key, hit);
  }
}
for (const [key, hit] of groups) {
  console.log(`TOKEN ${key} x${hit.count} :: "${String(hit.sample).slice(0, 60)}"`);
}
process.exit(0);
