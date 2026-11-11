#!/usr/bin/env node
/**
 * ════════════════════════════════════════════════════════════════════════════
 * OMEGA-10 · ISO/IEC 5055 (CISQ) — AUDITOR ESTRUCTURAL
 * ════════════════════════════════════════════════════════════════════════════
 * Qué mide (estático, sin red, sin dependencias):
 *   1. Complejidad ciclomática aproximada por función (puntos de decisión
 *      `if/for/while/case/catch/&&/||/??/?`), sobre el texto SIN comentarios.
 *      Umbral de fallo: > 15 (directiva §5.4).
 *   2. Dependencia unidireccional: la Zona Cero (`ear-os-ssot.ts`) debe ser
 *      HOJA del grafo de imports. Si importara negocio habría ciclo conceptual
 *      y el hash de INV-05 dejaría de ser fiable.
 *   3. Presupuesto de líneas por función (200).
 *
 * Honestidad (AF-1): métrica estática aproximada, NO un certificado CISQ.
 * Se declara `mode: "SIMULADO"` con su disclaimer.
 *
 * Salida: CISQ_FILES= · CISQ_FUNCTIONS= · CISQ_MAX_CC= · CISQ_VIOLATIONS=
 *         CISQ_VERDICT=PASS|FAIL
 * ════════════════════════════════════════════════════════════════════════════
 */

'use strict';

const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const REPORT_DIR = path.join(ROOT, '.antigravity', 'reports');
const MAX_CC = 15;
const MAX_FUNCTION_LINES = 200;

const SCAN_ROOTS = ['src/lib', 'src/app/api', 'src/components/seating'];
const SKIP_DIRS = new Set(['node_modules', '.next', '.git', 'adn_vault', 'adn_vault_staging']);
const EXT = /\.(ts|tsx)$/;

function walk(dir, acc) {
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return acc;
  }
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name)) continue;
      walk(full, acc);
    } else if (EXT.test(entry.name) && !entry.name.endsWith('.d.ts')) {
      acc.push(full);
    }
  }
  return acc;
}

/** Elimina comentarios preservando saltos de línea (no altera numeración). */
function stripComments(source) {
  return source
    .replace(/\/\*[\s\S]*?\*\//g, (match) => match.replace(/[^\n]/g, ' '))
    .replace(/(^|[^:])\/\/[^\n]*/g, (_match, prefix) => prefix);
}

/**
 * Extrae funciones por firma NOMBRADA y cuenta puntos de decisión hasta la
 * llave de cierre equilibrada.
 *
 * Hallazgo del propio instrumento: la primera versión también capturaba
 * `const x = (` (llamadas) y fusionaba cuerpos enteros, inventando un CC=206.
 * Ahora sólo entran declaraciones con cuerpo de función: `function nombre(`,
 * `export function nombre(` y métodos `nombre(...) {`.
 */
function measureFunctions(source) {
  const clean = stripComments(source);
  const functions = [];
  const signature = /\b(?:export\s+)?(?:async\s+)?function\s+([A-Za-z0-9_]+)\s*(?:<[^>]*>)?\s*\(/g;

  let match = signature.exec(clean);
  while (match !== null) {
    const name = match[1] ?? 'anónima';
    // Llave del CUERPO: primera `{` tras cerrar la lista de parámetros.
    let paramDepth = 0;
    let parenIndex = clean.indexOf('(', match.index);
    let scan = parenIndex;
    for (; scan < clean.length; scan += 1) {
      if (clean[scan] === '(') paramDepth += 1;
      else if (clean[scan] === ')') {
        paramDepth -= 1;
        if (paramDepth === 0) break;
      }
    }
    const braceIndex = clean.indexOf('{', scan);
    if (braceIndex === -1) {
      match = signature.exec(clean);
      continue;
    }
    let depth = 0;
    let endIndex = braceIndex;
    for (let i = braceIndex; i < clean.length; i += 1) {
      if (clean[i] === '{') depth += 1;
      else if (clean[i] === '}') {
        depth -= 1;
        if (depth === 0) {
          endIndex = i;
          break;
        }
      }
    }
    void parenIndex;
    const body = clean.slice(braceIndex, endIndex + 1);
    const decisions = (body.match(/\b(?:if|for|while|case|catch)\b|&&|\|\||\?\?|\?(?![.:])/g) ?? []).length;
    const startLine = clean.slice(0, match.index).split('\n').length;
    const endLine = clean.slice(0, endIndex).split('\n').length;
    functions.push({ name, line: startLine, lines: endLine - startLine + 1, complexity: decisions + 1 });
    match = signature.exec(clean);
  }
  return functions;
}

const violations = [];
const files = [];
for (const root of SCAN_ROOTS) {
  for (const file of walk(path.join(ROOT, root), [])) files.push(file);
}

let functionCount = 0;
let maxCc = 0;
let worst = null;

for (const file of files) {
  const rel = path.relative(ROOT, file).replace(/\\/g, '/');
  const source = fs.readFileSync(file, 'utf8');
  const measured = measureFunctions(source);
  functionCount += measured.length;

  for (const fn of measured) {
    if (fn.complexity > maxCc) {
      maxCc = fn.complexity;
      worst = `${rel}:${fn.line} ${fn.name}`;
    }
    if (fn.complexity > MAX_CC) {
      violations.push({ code: 'CC_EXCEEDED', file: rel, line: fn.line, detail: `${fn.name} CC=${fn.complexity}` });
    }
    if (fn.lines > MAX_FUNCTION_LINES) {
      violations.push({ code: 'FUNCTION_TOO_LONG', file: rel, line: fn.line, detail: `${fn.name} ${fn.lines} líneas` });
    }
  }

  // Zona Cero: hoja del grafo (cero imports).
  if (rel === 'src/lib/constants/ear-os-ssot.ts') {
    const imports = source.match(/^\s*import\s.+from\s+['"].+['"]/gm) ?? [];
    if (imports.length > 0) {
      violations.push({
        code: 'SSOT_HAS_IMPORTS',
        file: rel,
        line: 1,
        detail: `el SSOT debe ser hoja: ${imports.length} imports`,
      });
    }
  }
}

const report = {
  probed: false,
  source: 'static',
  mode: 'SIMULADO',
  disclaimer:
    'Complejidad ciclomática aproximada por densidad de ramificación. No sustituye a un certificado CISQ: mide el presupuesto que exige la directiva §5.4.',
  checkedAt: new Date().toISOString(),
  thresholds: { maxCyclomaticComplexity: MAX_CC, maxFunctionLines: MAX_FUNCTION_LINES },
  files: files.length,
  functions: functionCount,
  maxComplexity: maxCc,
  worstFunction: worst,
  violations,
  verdict: violations.length === 0 ? 'PASS' : 'FAIL',
};

fs.mkdirSync(REPORT_DIR, { recursive: true });
fs.writeFileSync(path.join(REPORT_DIR, 'cisq_structural.json'), JSON.stringify(report, null, 2), 'utf8');

for (const row of violations.slice(0, 40)) {
  console.log(`  FAIL · ${row.code} ${row.file}:${row.line} — ${row.detail}`);
}
console.log(
  `CISQ_FILES=${files.length} · CISQ_FUNCTIONS=${functionCount} · CISQ_MAX_CC=${maxCc} · CISQ_VIOLATIONS=${violations.length}`,
);
console.log(`CISQ_VERDICT=${report.verdict}`);
process.exit(report.verdict === 'PASS' ? 0 : 1);
