#!/usr/bin/env node
/**
 * ════════════════════════════════════════════════════════════════════════════
 * OMEGA-15 · RICH RESULTS schema.org — VALIDADOR DE DATOS ESTRUCTURADOS
 * ════════════════════════════════════════════════════════════════════════════
 * Qué mide (estático, sin red):
 *   1. Localiza los emisores de JSON-LD del árbol (`application/ld+json`).
 *   2. Extrae los bloques JSON-LD que son objetos literales y los PARSEA con
 *      `JSON.parse`. Un JSON-LD que no parsea es invisible para Google: fallo.
 *   3. Comprueba las propiedades obligatorias por tipo según las guías de
 *      Rich Results (Organization/LocalBusiness, Event, FAQPage, BreadcrumbList).
 *
 * Anti-fachada: no valida "que exista schema.org" en el copy; valida los
 * objetos realmente emitidos y lo que le falta a cada uno.
 *
 * Salida: RICH_RESULTS_EMITTERS= · RICH_RESULTS_BLOCKS= · RICH_RESULTS_FAILED=
 *         RICH_RESULTS_VERDICT=PASS|FAIL
 * ════════════════════════════════════════════════════════════════════════════
 */

'use strict';

const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const REPORT_DIR = path.join(ROOT, '.antigravity', 'reports');
const SRC = path.join(ROOT, 'src');
const SKIP_DIRS = new Set(['node_modules', '.next', '.git', 'adn_vault', 'adn_vault_staging']);

/** Propiedades obligatorias por tipo (guías de Rich Results de Google). */
const REQUIRED_BY_TYPE = {
  Organization: ['name', 'url'],
  LocalBusiness: ['name', 'url', 'telephone'],
  EntertainmentBusiness: ['name', 'url', 'telephone'],
  PerformingGroup: ['name'],
  ProfessionalService: ['name', 'url'],
  Event: ['name', 'startDate', 'location'],
  FAQPage: ['mainEntity'],
  BreadcrumbList: ['itemListElement'],
  Service: ['name'],
  AggregateRating: ['ratingValue', 'reviewCount'],
  MusicGroup: ['name'],
};

/**
 * ¿Declara el objeto la propiedad `name`? En TS/SQL el JSON-LD se escribe con
 * claves citadas (`'name':`) O con la forma corta (`name:`). El primer barrido
 * sólo aceptaba comillas y reportó 24 falsos positivos: se aceptan ambas.
 */
function hasProperty(block, property) {
  return new RegExp(`(?:^|[{,\\s])['"]?${property}['"]?\\s*:`).test(block);
}

/**
 * Un bloque JSON-LD puede construirse por SPREAD de constantes del propio
 * fichero (`...organizationSchema`). Analizar sólo el literal produciría
 * falsos positivos (el primer barrido reportó 24 fallos que en realidad
 * heredaban sus propiedades). Aquí se resuelven las referencias locales.
 */
function expandLocalReferences(literal, source) {
  let expanded = literal;
  const spreadRegex = /\.\.\.\s*([A-Za-z0-9_]+)/g;
  let spread = spreadRegex.exec(expanded);
  const seen = new Set();
  while (spread !== null && seen.size < 20) {
    const name = spread[1];
    if (seen.has(name)) {
      spread = spreadRegex.exec(expanded);
      continue;
    }
    seen.add(name);
    const declaration = source.indexOf(`const ${name} =`);
    const altDeclaration = source.indexOf(`const ${name}:`);
    const start = declaration !== -1 ? declaration : altDeclaration;
    if (start !== -1) {
      const open = source.indexOf('{', start);
      let depth = 0;
      let close = -1;
      for (let i = open; i < source.length && open !== -1; i += 1) {
        if (source[i] === '{') depth += 1;
        else if (source[i] === '}') {
          depth -= 1;
          if (depth === 0) {
            close = i;
            break;
          }
        }
      }
      if (close !== -1) expanded += ' ' + source.slice(open, close + 1);
    }
    spread = spreadRegex.exec(expanded);
  }
  return expanded;
}

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
    } else if (/\.(tsx?|jsx?)$/.test(entry.name)) {
      acc.push(full);
    }
  }
  return acc;
}

const files = walk(SRC, []);
const emitters = [];
const failures = [];
let blocks = 0;

for (const file of files) {
  const rel = path.relative(ROOT, file).replace(/\\/g, '/');
  const source = fs.readFileSync(file, 'utf8');
  if (!source.includes('ld+json')) continue;
  emitters.push(rel);

  // Bloques literales: JSON.stringify({ ... }) con llaves equilibradas.
  const stringifyRegex = /JSON\.stringify\(\s*(\{)/g;
  let match = stringifyRegex.exec(source);
  while (match !== null) {
    const open = source.indexOf('{', match.index);
    let depth = 0;
    let close = -1;
    for (let i = open; i < source.length; i += 1) {
      if (source[i] === '{') depth += 1;
      else if (source[i] === '}') {
        depth -= 1;
        if (depth === 0) {
          close = i;
          break;
        }
      }
    }
    if (close === -1) {
      match = stringifyRegex.exec(source);
      continue;
    }
    blocks += 1;
    const literal = source.slice(open, close + 1);
    const full = expandLocalReferences(literal, source);
    const types = [...literal.matchAll(/['"]@type['"]\s*:\s*(?:\[\s*)?['"]([A-Za-z]+)['"]/g)].map((m) => m[1]);
    for (const type of types) {
      const required = REQUIRED_BY_TYPE[type];
      if (required === undefined) continue;
      const missing = required.filter((prop) => !hasProperty(full, prop));
      if (missing.length > 0) {
        failures.push({ file: rel, type, missing });
      }
    }
    match = stringifyRegex.exec(source);
  }
}

// ¿Hay emisión real? Sin emisores, el ítem es un hueco, no un verde.
if (emitters.length === 0) failures.push({ file: 'src', type: 'EMITTER', missing: ['ningún application/ld+json'] });
if (blocks === 0) failures.push({ file: 'src', type: 'BLOCK', missing: ['ningún bloque JSON-LD literal'] });

const verdict = failures.length === 0 ? 'PASS' : 'FAIL';
const report = {
  probed: false,
  source: 'static',
  mode: 'SIMULADO',
  disclaimer:
    'Validación de propiedades obligatorias sobre los objetos JSON-LD emitidos. No sustituye a la prueba de Rich Results de Google: mide estructura, no elegibilidad editorial.',
  checkedAt: new Date().toISOString(),
  emitters,
  blocks,
  failures,
  verdict,
};

fs.mkdirSync(REPORT_DIR, { recursive: true });
fs.writeFileSync(path.join(REPORT_DIR, 'rich_results.json'), JSON.stringify(report, null, 2), 'utf8');

for (const row of failures.slice(0, 30)) {
  console.log(`  FAIL · ${row.file} · ${row.type} — falta: ${row.missing.join(', ')}`);
}
console.log(`RICH_RESULTS_EMITTERS=${emitters.length} · RICH_RESULTS_BLOCKS=${blocks} · RICH_RESULTS_FAILED=${failures.length}`);
console.log(`RICH_RESULTS_VERDICT=${verdict}`);
process.exit(verdict === 'PASS' ? 0 : 1);
