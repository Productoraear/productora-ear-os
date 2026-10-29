#!/usr/bin/env node
/**
 * ════════════════════════════════════════════════════════════════════════════
 * FICHAS DB ROWS — MÓDULO DE CONTRATO ÚNICO (W44)
 * ════════════════════════════════════════════════════════════════════════════
 * Convierte los artefactos sellados de W43 (`fichas_index.json`,
 * `fichas_gold.json`) + el SHA-256 del HTML fuente absorbido en filas
 * inmutables listas para `ProviderFicha`. Lo consumen:
 *   · `scripts/sync_fichas_to_db.cjs`   (escritura real en PostgreSQL 16)
 *   · `scripts/verify_fichas_db.ts`     (aserción de idempotencia ACID)
 * Un solo lugar define columnas, doctrina y payload: si la doctrina se relaja
 * aquí, la relajan los dos. Cero duplicación = cero deriva.
 *
 * DOCTRINA QUE ESTE MÓDULO HACE CUMPLIR (no declara: verifica y aborta)
 *   · `key` única -> N upserts de la misma ficha = 1 fila (§19 idempotencia).
 *   · `verified:true` SÓLO con teléfono real publicable (§4bis). Centralita
 *     `+34 693 693 048`, placeholder o vacío => excepción, no fila.
 *   · `provenanceHash` y `htmlSha256` son SHA-256 hex de 64 caracteres o NULOS
 *     declarados: jamás un hash de relleno (§17 provenance).
 *   · `completeness` entero 0..100.
 * ════════════════════════════════════════════════════════════════════════════
 */
'use strict';

const { createHash } = require('node:crypto');
const {
  buildArtifacts,
  isPublishablePhone,
  isCentralita,
  CENTRALITA_DIGITS,
} = require('./build_provider_fichas.cjs');

/** Columnas de contenido escritas en cada upsert (orden canónico del checksum). */
const PROVIDER_FICHA_COLUMNS = Object.freeze([
  'key',
  'vendorId',
  'slug',
  'name',
  'category',
  'province',
  'municipality',
  'phone',
  'priceEur',
  'rating',
  'verified',
  'completeness',
  'provenanceHash',
  'htmlSha256',
  'sources',
  'matchMode',
]);

/** Columnas gestionadas por Prisma/PostgreSQL: nunca entran en el checksum. */
const MANAGED_COLUMNS = Object.freeze(['syncedAt', 'updatedAt']);

const HEX64 = /^[0-9a-f]{64}$/;
const ABSENT_HTML = Object.freeze({ htmlFile: null, htmlSha256: null });

/**
 * Invariantes de una fila. Lanza si la doctrina se rompe: es preferible un
 * pipeline detenido a una fila mentirosa en producción.
 * @param {Record<string, unknown>} row
 */
function assertRowDoctrine(row) {
  const key = row.key;
  if (typeof key !== 'string' || key.length === 0) {
    throw new Error('[fichas:db] fila sin clave natural.');
  }
  const name = row.name;
  if (typeof name !== 'string' || name.trim().length < 2) {
    throw new Error(`[fichas:db] ${key}: nombre inválido.`);
  }
  const phone = row.phone;
  if (phone !== null) {
    if (typeof phone !== 'string') throw new Error(`[fichas:db] ${key}: teléfono no textual.`);
    if (isCentralita(phone)) {
      throw new Error(`[fichas:db] ${key}: teléfono = centralita (${CENTRALITA_DIGITS.join('/')}).`);
    }
    if (!isPublishablePhone(phone)) {
      throw new Error(`[fichas:db] ${key}: teléfono no publicable (${phone}).`);
    }
  }
  if (row.verified === true && phone === null) {
    throw new Error(`[fichas:db] ${key}: verified:true sin teléfono real.`);
  }
  if (typeof row.provenanceHash !== 'string' || !HEX64.test(row.provenanceHash)) {
    throw new Error(`[fichas:db] ${key}: provenanceHash no es SHA-256 hex64.`);
  }
  if (row.htmlSha256 !== null && (typeof row.htmlSha256 !== 'string' || !HEX64.test(row.htmlSha256))) {
    throw new Error(`[fichas:db] ${key}: htmlSha256 no es SHA-256 hex64.`);
  }
  const completeness = row.completeness;
  if (typeof completeness !== 'number' || !Number.isInteger(completeness) || completeness < 0 || completeness > 100) {
    throw new Error(`[fichas:db] ${key}: completeness fuera de 0..100.`);
  }
  if (!Array.isArray(row.sources) || row.sources.length === 0) {
    throw new Error(`[fichas:db] ${key}: sin fuentes de procedencia.`);
  }
}

/** Texto vacío -> NULL (PostgreSQL no distingue matices vacíos). */
function nullableText(value) {
  return typeof value === 'string' && value.trim().length > 0 ? value : null;
}

/** Número finito -> número; cualquier otra cosa -> NULL (cero invención). */
function nullableNumber(value) {
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

/**
 * Proyecta una ficha sellada + su procedencia HTML a una fila de `ProviderFicha`.
 * @param {Record<string, any>} ficha
 * @param {{ htmlFile: string | null, htmlSha256: string | null }} source
 * @returns {{ row: Record<string, unknown>, htmlFile: string | null }}
 */
function toRow(ficha, source) {
  const html = source === undefined || source === null ? ABSENT_HTML : source;
  const row = {
    key: ficha.key,
    vendorId: nullableText(ficha.vendorId),
    slug: nullableText(ficha.slug),
    name: ficha.name,
    category: nullableText(ficha.category),
    province: nullableText(ficha.province),
    municipality: nullableText(ficha.municipality),
    phone: nullableText(ficha.phone),
    priceEur: nullableNumber(ficha.priceEur),
    rating: nullableNumber(ficha.rating),
    verified: ficha.verified === true,
    completeness: ficha.completeness,
    provenanceHash: ficha.provenanceHash,
    htmlSha256: typeof html.htmlSha256 === 'string' ? html.htmlSha256 : null,
    sources: Array.isArray(ficha.sources) ? [...ficha.sources] : [],
    matchMode: nullableText(ficha.matchMode),
  };
  return { row, htmlFile: typeof html.htmlFile === 'string' ? html.htmlFile : null };
}


/** Representación canónica de una fila (orden fijo, sin timestamps). */
function canonicalRow(row) {
  return JSON.stringify(PROVIDER_FICHA_COLUMNS.map((column) => (row[column] === undefined ? null : row[column])));
}

/**
 * Huella SHA-256 del contenido lógico del plan de escritura. Es la prueba de
 * que dos ejecuciones del sincronizador producen EXACTAMENTE el mismo estado:
 * cualquier diferencia (ficha ausente, hash movido, verified invertido) cambia
 * la huella y aborta la verificación.
 * @param {readonly Record<string, unknown>[]} rows
 */
function fingerprintRows(rows) {
  const hash = createHash('sha256');
  for (const line of rows.map(canonicalRow).sort()) {
    hash.update(line);
    hash.update('\n');
  }
  return hash.digest('hex');
}

/**
 * Construye las filas definitivas desde las fuentes selladas.
 * @param {{ limit?: number }} [options] `limit` recorta el lote (humo, no producción).
 */
function buildRows(options = {}) {
  const artifacts = buildArtifacts({ withSourceHtml: true });
  const requested = options !== null && typeof options === 'object' ? options.limit : undefined;
  const limit = typeof requested === 'number' && Number.isInteger(requested) && requested > 0 ? requested : null;
  const selected = limit === null ? artifacts.fichas : artifacts.fichas.slice(0, limit);
  const sourceHtml = artifacts.sourceHtml === null ? new Map() : artifacts.sourceHtml;

  const rows = [];
  const seen = new Set();
  const htmlFiles = new Map();

  for (const ficha of selected) {
    const { row, htmlFile } = toRow(ficha, sourceHtml.get(ficha.key));
    if (seen.has(row.key)) throw new Error(`[fichas:db] clave duplicada en el plan: ${row.key}`);
    seen.add(row.key);
    assertRowDoctrine(row);
    if (htmlFile !== null) htmlFiles.set(row.key, htmlFile);
    rows.push(row);
  }

  return { rows, stats: summarise(rows, artifacts), htmlFiles };
}

/**
 * @param {readonly Record<string, unknown>[]} rows
 * @param {{ fichas: readonly unknown[] }} artifacts
 */
function summarise(rows, artifacts) {
  let verificadas = 0;
  let sinTelefono = 0;
  let htmlSelladas = 0;
  let htmlAusentes = 0;
  let clavesVendor = 0;
  let clavesCatalogo = 0;
  let completenessTotal = 0;
  const provenance = new Set();
  const htmlDigests = new Set();

  for (const row of rows) {
    if (row.verified === true) verificadas += 1;
    if (row.phone === null) sinTelefono += 1;
    if (row.htmlSha256 === null) htmlAusentes += 1;
    else {
      htmlSelladas += 1;
      htmlDigests.add(row.htmlSha256);
    }
    if (String(row.key).startsWith('v-')) clavesVendor += 1;
    else if (String(row.key).startsWith('cat-')) clavesCatalogo += 1;
    completenessTotal += Number(row.completeness);
    provenance.add(row.provenanceHash);
  }

  const fichas = rows.length;
  return {
    fichas,
    planFichas: artifacts.fichas.length,
    htmlSelladas,
    htmlAusentes,
    htmlDigestsUnicos: htmlDigests.size,
    verificadas,
    sinTelefono,
    clavesVendor,
    clavesCatalogo,
    provenanceUnicos: provenance.size,
    completenessMedia: fichas === 0 ? 0 : Math.round((completenessTotal / fichas) * 100) / 100,
  };
}

/**
 * Argumentos de `providerFicha.upsert` para una fila. `syncedAt`/`updatedAt` se
 * excluyen a propósito: los gobierna la base (default now() / @updatedAt).
 * @param {Record<string, unknown>} row
 */
function upsertArgs(row) {
  const data = {};
  for (const column of PROVIDER_FICHA_COLUMNS) {
    if (column === 'key') continue;
    data[column] = row[column] === undefined ? null : row[column];
  }
  return {
    where: { key: row.key },
    create: { key: row.key, ...data },
    update: data,
  };
}

/** Descriptor seguro (sin credenciales) del destino de escritura. */
function describeDbTarget(rawUrl) {
  if (typeof rawUrl !== 'string' || rawUrl.length === 0) return null;
  try {
    const parsed = new URL(rawUrl);
    const database = decodeURIComponent(parsed.pathname.replace(/^\//, ''));
    return {
      host: parsed.hostname,
      port: parsed.port === '' ? 'default' : parsed.port,
      database: database.length === 0 ? null : database,
      user: decodeURIComponent(parsed.username),
    };
  } catch {
    return null;
  }
}

module.exports = {
  PROVIDER_FICHA_COLUMNS,
  MANAGED_COLUMNS,
  assertRowDoctrine,
  buildRows,
  canonicalRow,
  describeDbTarget,
  fingerprintRows,
  toRow,
  upsertArgs,
};
