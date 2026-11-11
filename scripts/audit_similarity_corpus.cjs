#!/usr/bin/env node
/**
 * ════════════════════════════════════════════════════════════════════════════
 * OMEGA-16 · UNICIDAD LÉXICA DEL CORPUS (JACCARD 5-GRAM + COSENO TF-IDF)
 * ════════════════════════════════════════════════════════════════════════════
 * Qué mide (estático, sin red): el riesgo de contenido duplicado entre páginas,
 * que Google penaliza como «doorway» o «thin content».
 *
 * Corpus: las páginas de `src/app/**` que declaran `metadata` con `title` +
 * `description` (el texto que realmente compite en SERP), más las landings
 * programáticas.
 *
 * Dos métricas independientes, ambas con umbral de la directiva §5.6:
 *   · Jaccard sobre 5-gramas de palabras: dos páginas distintas deben compartir
 *     MENOS del umbral del vocabulario serializado (distancia ≥ 0.65 ⇒ jaccard
 *     ≤ 0.35).
 *   · Coseno TF-IDF: similitud ≤ 0.70.
 *
 * Se declara `mode: "SIMULADO"`: mide el copy declarado en código, no el HTML
 * renderizado. Un verde aquí NO es un certificado de SEO.
 *
 * Salida: SIMILARITY_DOCS= · SIMILARITY_JACCARD_MAX= · SIMILARITY_COSINE_MAX=
 *         SIMILARITY_PAIRS=jaccard:<n>,cosine:<n> · SIMILARITY_VERDICT=
 * ════════════════════════════════════════════════════════════════════════════
 */

'use strict';

const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const REPORT_DIR = path.join(ROOT, '.antigravity', 'reports');
const APP = path.join(ROOT, 'src', 'app');
const SKIP_DIRS = new Set(['node_modules', '.next', '.git', 'api', 'components']);

const JACCARD_MAX = 0.35;
const COSINE_MAX = 0.7;
const NGRAM = 5;

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
    } else if (entry.name === 'page.tsx' || entry.name === 'page.jsx') {
      acc.push(full);
    }
  }
  return acc;
}

/** Extrae title + description de la declaración `metadata` del fichero. */
function extractCopy(source) {
  const title = source.match(/title:\s*['"`]([^'"`]+)['"`]/);
  const description = source.match(/description:\s*['"`]([^'"`]+)['"`]/);
  if (title === null && description === null) return null;
  return `${title ? title[1] : ''} ${description ? description[1] : ''}`.trim();
}

function tokenize(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9ñ\s]/g, ' ')
    .split(/\s+/)
    .filter((token) => token.length > 2);
}

function ngrams(tokens) {
  const grams = new Set();
  for (let i = 0; i + NGRAM <= tokens.length; i += 1) {
    grams.add(tokens.slice(i, i + NGRAM).join(' '));
  }
  if (grams.size === 0 && tokens.length > 0) grams.add(tokens.join(' '));
  return grams;
}

function jaccard(a, b) {
  let intersection = 0;
  for (const gram of a) if (b.has(gram)) intersection += 1;
  const union = a.size + b.size - intersection;
  return union === 0 ? 0 : intersection / union;
}

function termFrequency(tokens) {
  const tf = new Map();
  for (const token of tokens) tf.set(token, (tf.get(token) ?? 0) + 1);
  return tf;
}

function cosine(a, b, idf) {
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (const [term, count] of a) {
    const weight = count * (idf.get(term) ?? 1);
    normA += weight * weight;
    const other = b.get(term);
    if (other !== undefined) dot += weight * other * (idf.get(term) ?? 1);
  }
  for (const [term, count] of b) {
    const weight = count * (idf.get(term) ?? 1);
    normB += weight * weight;
  }
  if (normA === 0 || normB === 0) return 0;
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

/* ───────────────────────────── Corpus ───────────────────────────────────── */

const pages = walk(APP, []);
const docs = [];
for (const file of pages) {
  const copy = extractCopy(fs.readFileSync(file, 'utf8'));
  if (copy === null || copy.length < 40) continue;
  const tokens = tokenize(copy);
  if (tokens.length < NGRAM) continue;
  docs.push({
    route: `/${path.relative(APP, file).replace(/\\/g, '/').replace(/\/?page\.(tsx|jsx)$/, '')}`.replace(/\/$/, '/'),
    tokens,
    grams: ngrams(tokens),
  });
}

// IDF del corpus completo (una pasada, sin dependencias).
const documentFrequency = new Map();
for (const doc of docs) {
  for (const term of new Set(doc.tokens)) {
    documentFrequency.set(term, (documentFrequency.get(term) ?? 0) + 1);
  }
}
const idf = new Map();
for (const [term, df] of documentFrequency) {
  idf.set(term, Math.log(docs.length / (1 + df)) + 1);
}

const pairs = [];
let maxJaccard = 0;
let maxCosine = 0;
let jaccardFails = 0;
let cosineFails = 0;

for (let i = 0; i < docs.length; i += 1) {
  const left = docs[i];
  const leftTf = termFrequency(left.tokens);
  for (let j = i + 1; j < docs.length; j += 1) {
    const right = docs[j];
    const jac = jaccard(left.grams, right.grams);
    if (jac > maxJaccard) maxJaccard = jac;
    if (jac > JACCARD_MAX) jaccardFails += 1;

    const cos = cosine(leftTf, termFrequency(right.tokens), idf);
    if (cos > maxCosine) maxCosine = cos;
    if (cos > COSINE_MAX) cosineFails += 1;

    if (jac > JACCARD_MAX || cos > COSINE_MAX) {
      pairs.push({ a: left.route, b: right.route, jaccard: Number(jac.toFixed(4)), cosine: Number(cos.toFixed(4)) });
    }
  }
}

const verdict = jaccardFails === 0 && cosineFails === 0 && docs.length >= 5 ? 'PASS' : 'FAIL';
const report = {
  probed: false,
  source: 'static',
  mode: 'SIMULADO',
  disclaimer:
    'Mide el copy declarado en código (metadata). No mide el HTML renderizado ni la autoridad editorial; un verde aquí no certifica SEO.',
  checkedAt: new Date().toISOString(),
  thresholds: { jaccardMax: JACCARD_MAX, cosineMax: COSINE_MAX, ngram: NGRAM },
  documents: docs.length,
  maxJaccard: Number(maxJaccard.toFixed(4)),
  maxCosine: Number(maxCosine.toFixed(4)),
  jaccardFails,
  cosineFails,
  pairs: pairs.sort((a, b) => b.jaccard - a.jaccard).slice(0, 40),
  verdict,
};

fs.mkdirSync(REPORT_DIR, { recursive: true });
fs.writeFileSync(path.join(REPORT_DIR, 'similarity_corpus.json'), JSON.stringify(report, null, 2), 'utf8');

for (const pair of report.pairs.slice(0, 20)) {
  console.log(`  FAIL · ${pair.a} × ${pair.b} — J=${pair.jaccard} C=${pair.cosine}`);
}
console.log(
  `SIMILARITY_DOCS=${docs.length} · SIMILARITY_JACCARD_MAX=${report.maxJaccard} · SIMILARITY_COSINE_MAX=${report.maxCosine}`,
);
console.log(`SIMILARITY_PAIRS=jaccard:${jaccardFails},cosine:${cosineFails}`);
console.log(`SIMILARITY_VERDICT=${verdict}`);
process.exit(verdict === 'PASS' ? 0 : 1);
