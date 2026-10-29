#!/usr/bin/env node
/**
 * ════════════════════════════════════════════════════════════════════════════
 * BUILD PROVIDER FICHAS — CIMIENTO DEL GROUNDING REAL (W43 S-CLASS)
 * ════════════════════════════════════════════════════════════════════════════
 * Funde el índice HTML (`CATALOGO_PROVEEDORES_HTML_INDEX.json`) con el registro
 * canónico (`providers_canonical.json`) y emite DOS artefactos:
 *
 *   public/data/fichas/fichas_gold.json           → fichas publicables (SSOT)
 *   public/data/fichas/fichas_audit_report.json   → trazabilidad del join
 *
 * DOCTRINA DEL DATO VERIFICADO (§4bis):
 *   `verified:true` SOLO con teléfono real publicable (≥9 dígitos, nunca la
 *   centralita +34 693 693 048, nunca placeholder). El teléfono jamás se
 *   incluye si no es publicable (`phone: null`).
 *
 * DETERMINISMO (Ω-DIAMANTE §17):
 *   Sin timestamps. Orden estable por `key`. `provenanceHash` = SHA-256 del
 *   contenido propio. `--check` compara byte a byte contra el artefacto en
 *   disco: si el repo cambia sin re-ejecutar el build, la puerta ABORTA.
 *
 * USO:
 *   node scripts/build_provider_fichas.cjs            # escribe artefactos
 *   node scripts/build_provider_fichas.cjs --check    # gate (Exit 0/1/2)
 *   node scripts/build_provider_fichas.cjs --stats    # diagnóstico JSON
 * ════════════════════════════════════════════════════════════════════════════
 */
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { createHash } = require('node:crypto');

const ROOT = path.resolve(__dirname, '..');
const CATALOG_PATH = path.join(ROOT, 'vault', 'proveedores_html_indexados', 'CATALOGO_PROVEEDORES_HTML_INDEX.json');
const CANONICAL_PATH = path.join(ROOT, 'public', 'data', 'providers', 'providers_canonical.json');
const OUT_DIR = path.join(ROOT, 'public', 'data', 'fichas');
const GOLD_PATH = path.join(OUT_DIR, 'fichas_gold.json');
const INDEX_PATH = path.join(OUT_DIR, 'fichas_index.json');
const REPORT_PATH = path.join(OUT_DIR, 'fichas_audit_report.json');

const SCHEMA_VERSION = 'ear.fichas.v1';
/** Umbral de ficha dorada: publicable (§4bis) + ficha comercialmente completa. */
const GOLD_MIN_COMPLETENESS = 90;
const MAX_DESCRIPTION_CHARS = 280;
const MAX_FIELD_CHARS = 160;

/** Centralita soberana: JAMÁS es teléfono de proveedor publicable. */
const CENTRALITA_DIGITS = Object.freeze(['693693048', '34693693048']);

/**
 * Pesos de completitud (suman 100). Un campo ausente aporta 0: la ficha con
 * huecos NO se disfraza de completa.
 */
const WEIGHTS = Object.freeze({
  name: 18,
  category: 10,
  province: 8,
  municipality: 8,
  phone: 18,
  price: 14,
  rating: 8,
  description: 8,
  image: 4,
  profileUrl: 4,
});

// ─── Utilidades puras ───────────────────────────────────────────────────────

function digitsOf(value) {
  return String(value === null || value === undefined ? '' : value).replace(/\D/g, '');
}

function truncate(value, maxLength) {
  if (typeof value !== 'string') return '';
  let clean = '';
  for (const char of value) {
    const code = char.codePointAt(0) || 0;
    clean += code < 32 || code === 127 ? ' ' : char;
  }
  clean = clean.replace(/\s+/g, ' ').trim();
  return clean.length > maxLength ? `${clean.slice(0, maxLength - 1).trimEnd()}…` : clean;
}

function toFiniteNumber(value) {
  const parsed = typeof value === 'number' ? value : typeof value === 'string' && value.trim() !== '' ? Number(value) : Number.NaN;
  return Number.isFinite(parsed) ? parsed : null;
}

function positiveOrNull(value) {
  const numeric = toFiniteNumber(value);
  return numeric !== null && numeric > 0 ? numeric : null;
}

/**
 * Normaliza a dígitos y descarta placeholders (repetidos, secuencias obvias).
 * Devuelve `null` si el número no es publicable.
 */
function normalizePhone(raw) {
  const digits = digitsOf(raw);
  if (digits.length < 9 || digits.length > 15) return null;
  if (/^(\d)\1+$/.test(digits)) return null;
  if (digits.includes('000000000')) return null;
  const illegal = ['123456789', '987654321', '1234567890', '000000000', '111111111'];
  if (illegal.includes(digits)) return null;
  return digits;
}

function isCentralita(digits) {
  return CENTRALITA_DIGITS.includes(digits);
}

/** Regla §4bis: sólo un número real, no la centralita, es publicable. */
function isPublishablePhone(raw) {
  const digits = normalizePhone(raw);
  if (digits === null) return false;
  if (isCentralita(digits)) return false;
  return true;
}

function slugify(value) {
  return String(value === null || value === undefined ? '' : value)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const VENDOR_ID_PATTERNS = Object.freeze([/--e(\d{3,})/i, /\/vendor\/(\d+)/i, /[?&]id=(\d{4,})/i]);
const NUMERIC_ID_RE = /(\d{3,})/;

/** Extrae el id numérico del proveedor desde su URL de perfil (sólo lectura). */
function extractVendorId(raw) {
  const value = String(raw === null || raw === undefined ? '' : raw);
  for (const pattern of VENDOR_ID_PATTERNS) {
    const match = pattern.exec(value);
    if (match) return match[1];
  }
  return null;
}

function numericIdOf(rawId) {
  const match = NUMERIC_ID_RE.exec(String(rawId === null || rawId === undefined ? '' : rawId));
  return match ? match[1] : null;
}

function readJson(filePath, label) {
  if (!fs.existsSync(filePath)) {
    const error = new Error(`[fichas] Falta la fuente obligatoria (${label}): ${filePath}`);
    error.code = 'ENOENT_INPUT';
    throw error;
  }
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}


// ─── Índices del registro canónico ──────────────────────────────────────────

function buildCanonicalIndexes(canonical) {
  const byNumericId = new Map();
  const bySlug = new Map();
  const byName = new Map();

  for (const entry of canonical) {
    if (entry === null || typeof entry !== 'object') continue;
    const numeric = numericIdOf(entry.id);
    if (numeric !== null && !byNumericId.has(numeric)) byNumericId.set(numeric, entry);
    const slug = slugify(entry.slug);
    if (slug && !bySlug.has(slug)) bySlug.set(slug, entry);
    const name = slugify(entry.name);
    if (name && !byName.has(name)) byName.set(name, entry);
  }

  return { byNumericId, bySlug, byName };
}

/**
 * Resuelve la contraparte canónica de una entrada HTML.
 * Prioridad determinista: id numérico de la URL → slug normalizado → nombre.
 */
function matchCanonical(catalogEntry, indexes) {
  const fromProfile = extractVendorId(catalogEntry.profile_url);
  if (fromProfile !== null) {
    const hit = indexes.byNumericId.get(fromProfile);
    if (hit) return { entry: hit, mode: 'vendorId', vendorId: fromProfile };
  }

  const fromId = numericIdOf(catalogEntry.id);
  if (fromId !== null) {
    const hit = indexes.byNumericId.get(fromId);
    if (hit) return { entry: hit, mode: 'vendorId', vendorId: fromId };
  }

  const slug = slugify(catalogEntry.slug) || slugify(catalogEntry.name);
  if (slug) {
    const hit = indexes.bySlug.get(slug);
    if (hit) return { entry: hit, mode: 'slug', vendorId: fromProfile || fromId };
  }

  const name = slugify(catalogEntry.name);
  if (name) {
    const hit = indexes.byName.get(name);
    if (hit) return { entry: hit, mode: 'name', vendorId: fromProfile || fromId };
  }

  return { entry: null, mode: 'unmatched', vendorId: fromProfile || fromId };
}

// ─── Completitud ────────────────────────────────────────────────────────────

function computeCompleteness(ficha) {
  let score = 0;
  if (ficha.name) score += WEIGHTS.name;
  if (ficha.category) score += WEIGHTS.category;
  if (ficha.province) score += WEIGHTS.province;
  if (ficha.municipality) score += WEIGHTS.municipality;
  if (ficha.phone) score += WEIGHTS.phone;
  if (ficha.priceEur !== null || ficha.priceRange) score += WEIGHTS.price;
  if (ficha.rating !== null) score += WEIGHTS.rating;
  if (ficha.description) score += WEIGHTS.description;
  if (ficha.image) score += WEIGHTS.image;
  if (ficha.profileUrl) score += WEIGHTS.profileUrl;
  return score;
}

/** SHA-256 del contenido propio de la ficha (sin el propio hash). */
function computeProvenanceHash(ficha) {
  const payload = [
    ficha.key,
    ficha.name,
    ficha.category,
    ficha.province,
    ficha.municipality,
    ficha.phone,
    ficha.priceEur,
    ficha.priceRange,
    ficha.rating,
    ficha.reviewsCount,
    ficha.description,
    ficha.sources.join('+'),
  ].join('|');
  return createHash('sha256').update(payload, 'utf8').digest('hex');
}


// ─── Construcción de una ficha ──────────────────────────────────────────────

function pickPublishablePhone(catalog, canonical) {
  if (isPublishablePhone(catalog.phone)) return digitsOf(catalog.phone);
  if (isPublishablePhone(canonical.telephone)) return digitsOf(canonical.telephone);
  return null;
}

// ─── Saneado de metadatos de origen (cero basura en el prompt) ──────────────
// El índice HTML arrastra artefactos de scraping ("foto", códigos ISO sueltos,
// provincias en minúsculas). Doctrina §4bis: un dato ilegible se declara
// AUSENTE antes que publicarse mal delante del cliente.

const CATEGORY_JUNK = new Set([
  'foto', 'fotos', 'galeria', 'galerías', 'video', 'videos', 'ver', 'mas', 'mapa',
  'web', 'webs', 'opiniones', 'contacto', 'telefono', 'precios', 'inicio', 'home',
]);

const PROVINCE_NAMES = [
  'A Coruña', 'Álava', 'Albacete', 'Alicante', 'Almería', 'Asturias', 'Ávila', 'Badajoz',
  'Baleares', 'Barcelona', 'Burgos', 'Cáceres', 'Cádiz', 'Cantabria', 'Castellón', 'Ceuta',
  'Ciudad Real', 'Córdoba', 'Cuenca', 'Gerona', 'Granada', 'Guadalajara', 'Guipúzcoa', 'Huelva',
  'Huesca', 'Jaén', 'La Rioja', 'Las Palmas', 'León', 'Lérida', 'Lugo', 'Madrid',
  'Málaga', 'Melilla', 'Murcia', 'Navarra', 'Orense', 'Palencia', 'Pontevedra', 'Salamanca',
  'Santa Cruz de Tenerife', 'Segovia', 'Sevilla', 'Soria', 'Tarragona', 'Teruel', 'Toledo', 'Valencia',
  'Valladolid', 'Vizcaya', 'Zamora', 'Zaragoza',
];

// Códigos ISO 3166-2:ES de PROVINCIA (+ regiones uniprovinciales inequívocas).
// Las regiones pluriprovinciales (AN, EX, CL, CT, CN, CM, AR, GA, PV, VC) se
// descartan: mapearlas a una provincia sería inventar.
const PROVINCE_CODES = {
  A: 'Alicante', AB: 'Albacete', AL: 'Almería', AV: 'Ávila', B: 'Barcelona', BA: 'Badajoz',
  BI: 'Vizcaya', BU: 'Burgos', C: 'A Coruña', CA: 'Cádiz', CC: 'Cáceres', CE: 'Ceuta',
  CO: 'Córdoba', CR: 'Ciudad Real', CS: 'Castellón', CU: 'Cuenca', GC: 'Las Palmas', GI: 'Gerona',
  GR: 'Granada', GU: 'Guadalajara', H: 'Huelva', HU: 'Huesca', J: 'Jaén', L: 'Lérida',
  LE: 'León', LO: 'La Rioja', LU: 'Lugo', M: 'Madrid', MA: 'Málaga', ML: 'Melilla',
  MU: 'Murcia', NA: 'Navarra', O: 'Asturias', OR: 'Orense', P: 'Palencia', PM: 'Baleares',
  PO: 'Pontevedra', S: 'Cantabria', SA: 'Salamanca', SE: 'Sevilla', SG: 'Segovia', SO: 'Soria',
  SS: 'Guipúzcoa', T: 'Tarragona', TE: 'Teruel', TF: 'Santa Cruz de Tenerife', TO: 'Toledo',
  V: 'Valencia', VA: 'Valladolid', VI: 'Álava', Z: 'Zaragoza', ZA: 'Zamora',
  // Regiones uniprovinciales: el código regional ES la provincia.
  AS: 'Asturias', CB: 'Cantabria', IB: 'Baleares', MC: 'Murcia', MD: 'Madrid', NC: 'Navarra', RI: 'La Rioja',
};

const PROVINCE_ALIASES = {
  'la coruna': 'A Coruña',
  coruna: 'A Coruña',
  ourense: 'Orense',
  girona: 'Gerona',
  lleida: 'Lérida',
  gipuzkoa: 'Guipúzcoa',
  bizkaia: 'Vizcaya',
  araba: 'Álava',
  'illes balears': 'Baleares',
  'islas baleares': 'Baleares',
  'comunidad de madrid': 'Madrid',
  'region de murcia': 'Murcia',
  'principado de asturias': 'Asturias',
  'comunidad foral de navarra': 'Navarra',
  'santa cruz de tenerife': 'Santa Cruz de Tenerife',
};

function foldText(value) {
  return String(value === null || value === undefined ? '' : value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

const PROVINCE_LOOKUP = new Map();
for (const name of PROVINCE_NAMES) PROVINCE_LOOKUP.set(foldText(name), name);
for (const alias of Object.keys(PROVINCE_ALIASES)) PROVINCE_LOOKUP.set(foldText(alias), PROVINCE_ALIASES[alias]);

/** Provincia canónica o cadena vacía (nunca un código suelto en la ficha). */
function normalizeProvince(value) {
  const raw = String(value === null || value === undefined ? '' : value).trim();
  if (raw.length === 0 || raw.length > 60) return '';
  const upper = raw.toUpperCase();
  if (Object.prototype.hasOwnProperty.call(PROVINCE_CODES, upper)) return PROVINCE_CODES[upper];
  const known = PROVINCE_LOOKUP.get(foldText(raw));
  return known === undefined ? '' : known;
}

/** Categoría legible o cadena vacía: los artefactos de scraping no se publican. */
function normalizeCategory(value) {
  const raw = String(value === null || value === undefined ? '' : value).replace(/\s+/g, ' ').trim();
  const folded = foldText(raw);
  if (folded.length < 3 || folded.length > 40) return '';
  if (CATEGORY_JUNK.has(folded)) return '';
  if (!/^[a-z][a-z -]+$/.test(folded)) return '';
  return raw;
}

/** Invariante: la categoría publicada es legible (no basura de scraping). */
function isCanonicalCategory(value) {
  return normalizeCategory(value) === String(value === null || value === undefined ? '' : value);
}

/** Invariante: la provincia publicada pertenece a la lista canónica de 52. */
function isCanonicalProvince(value) {
  return PROVINCE_NAMES.includes(String(value === null || value === undefined ? '' : value));
}


function buildFicha(catalogEntry, canonicalEntry, vendorId, matchMode, index) {
  const catalog = catalogEntry && typeof catalogEntry === 'object' ? catalogEntry : {};
  const canonical = canonicalEntry && typeof canonicalEntry === 'object' ? canonicalEntry : {};
  const phone = pickPublishablePhone(catalog, canonical);

  const name = truncate(canonical.name || catalog.name, MAX_FIELD_CHARS);
  const slug = slugify(canonical.slug) || slugify(catalog.slug) || slugify(name);
  const key = vendorId !== null && vendorId !== undefined ? `v-${vendorId}` : canonical.id ? String(canonical.id) : `cat-${slug || index}`;

  const sources = ['catalogo_html'];
  if (canonicalEntry !== null && canonicalEntry !== undefined) sources.push('providers_canonical');

  const imageUrls = Array.isArray(canonical.imageUrls) ? canonical.imageUrls : [];
  const basePrice = positiveOrNull(canonical.basePrice);
  const catalogPrice = positiveOrNull(catalog.price);
  const canonicalRating = positiveOrNull(canonical.rating);
  const catalogRating = positiveOrNull(catalog.rating);
  const canonicalReviews = positiveOrNull(canonical.reviewsCount);
  const catalogReviews = positiveOrNull(catalog.reviews);

  const ficha = {
    key,
    vendorId: vendorId !== null && vendorId !== undefined ? String(vendorId) : null,
    slug,
    name,
    category: truncate(normalizeCategory(canonical.category || catalog.category), MAX_FIELD_CHARS),
    province: truncate(normalizeProvince(canonical.province || catalog.province), MAX_FIELD_CHARS),
    municipality: truncate(canonical.municipality || catalog.city, MAX_FIELD_CHARS),
    phone,
    priceEur: basePrice !== null ? basePrice : catalogPrice,
    priceRange: truncate(canonical.priceRange, 40),
    rating: canonicalRating !== null ? canonicalRating : catalogRating,
    reviewsCount: canonicalReviews !== null ? Math.round(canonicalReviews) : catalogReviews !== null ? Math.round(catalogReviews) : null,
    description: truncate(canonical.description || catalog.pitch_hook, MAX_DESCRIPTION_CHARS),
    image: truncate(canonical.img || imageUrls[0] || catalog.img, 400),
    profileUrl: truncate(catalog.profile_url, 400),
    web: truncate(canonical.web, 400),
    lat: toFiniteNumber(canonical.lat),
    lng: toFiniteNumber(canonical.lng),
    sources,
    matchMode,
    verified: phone !== null,
    completeness: 0,
    provenanceHash: '',
  };

  ficha.completeness = computeCompleteness(ficha);
  ficha.provenanceHash = computeProvenanceHash(ficha);

  return ficha;
}

/**
 * Una ficha es "groundable" si el Concierge puede citarla con hechos reales:
 * nombre + al menos dos atributos comerciales. El teléfono nunca se cita si
 * no es publicable (§4bis).
 */
function isGroundable(ficha) {
  if (!ficha.name) return false;
  let attributes = 0;
  if (ficha.category) attributes += 1;
  if (ficha.province) attributes += 1;
  if (ficha.municipality) attributes += 1;
  if (ficha.priceEur !== null || ficha.priceRange) attributes += 1;
  if (ficha.rating !== null) attributes += 1;
  if (ficha.description) attributes += 1;
  return attributes >= 2;
}

function isGold(ficha) {
  return ficha.verified === true && ficha.completeness >= GOLD_MIN_COMPLETENESS && ficha.name.length > 1;
}

function stableSort(fichas) {
  return fichas.slice().sort((a, b) => (a.key < b.key ? -1 : a.key > b.key ? 1 : 0));
}

/**
 * Entrada compacta del índice (presupuesto < 1 MB): sólo lo que el Concierge
 * necesita para localizar y citar la ficha. El detalle completo vive en
 * `fichas_gold.json`. `ph` es el prefijo del provenanceHash (puntero, no hash).
 */
function toIndexEntry(ficha) {
  return {
    key: ficha.key,
    slug: ficha.slug,
    name: ficha.name,
    category: ficha.category,
    province: ficha.province,
    municipality: ficha.municipality,
    phone: ficha.phone,
    priceEur: ficha.priceEur,
    rating: ficha.rating,
    verified: ficha.verified,
    completeness: ficha.completeness,
    ph: ficha.provenanceHash.slice(0, 16),
  };
}

function sha256OfFile(filePath) {
  return createHash('sha256').update(fs.readFileSync(filePath)).digest('hex');
}

// ─── Procedencia del HTML fuente (W44 · sello `htmlSha256`) ──────────────────
// El catálogo apunta a `original_html` (basename). El corpus vive en 11 gremios
// bajo `vault/proveedores_html_indexados/<Gremio>/<slug>--e<id>.html`.
// Si el HTML no está en disco, el hash es `null`: se declara AUSENTE (§4bis),
// jamás se inventa un hash de relleno.

const HTML_DIR = path.join(ROOT, 'vault', 'proveedores_html_indexados');
const HTML_HASH_CACHE = new Map();

/** Índice basename (minúsculas) → ruta absoluta del HTML absorbido. */
function buildHtmlSourceIndex() {
  const index = new Map();
  if (!fs.existsSync(HTML_DIR)) return index;
  for (const dir of fs.readdirSync(HTML_DIR, { withFileTypes: true })) {
    if (!dir.isDirectory()) continue;
    const dirPath = path.join(HTML_DIR, dir.name);
    for (const file of fs.readdirSync(dirPath)) {
      if (!/\.html?$/i.test(file)) continue;
      index.set(file.toLowerCase(), path.join(dirPath, file));
    }
  }
  return index;
}

/**
 * Procedencia del HTML que originó la ficha.
 * @returns {{ htmlFile: string | null, htmlSha256: string | null }}
 */
function resolveHtmlSource(htmlIndex, catalogEntry) {
  const absent = { htmlFile: null, htmlSha256: null };
  if (htmlIndex === null) return absent;
  const originalHtml =
    catalogEntry !== null && typeof catalogEntry === 'object' && typeof catalogEntry.original_html === 'string'
      ? catalogEntry.original_html
      : '';
  const basename = path.basename(originalHtml).toLowerCase();
  if (basename.length === 0) return absent;
  const absPath = htmlIndex.get(basename);
  if (absPath === undefined) return absent;
  let digest = HTML_HASH_CACHE.get(absPath);
  if (digest === undefined) {
    digest = sha256OfFile(absPath);
    HTML_HASH_CACHE.set(absPath, digest);
  }
  return { htmlFile: path.relative(ROOT, absPath).split(path.sep).join('/'), htmlSha256: digest };
}


// ─── Pipeline completo (puro: sólo lee las fuentes, nunca escribe) ──────────

/**
 * @param {{ withSourceHtml?: boolean }} [options]
 *   `withSourceHtml:true` añade el mapa `sourceHtml` (key → HTML fuente + su
 *   SHA-256). Es opt-in porque hashear 2.150 HTML cuesta ~615 MB de lectura y
 *   la puerta `--check` no lo necesita. Los artefactos serializados NO cambian.
 */
function buildArtifacts(options = {}) {
  const withSourceHtml = options !== null && typeof options === 'object' && options.withSourceHtml === true;
  const catalog = readJson(CATALOG_PATH, 'CATALOGO_PROVEEDORES_HTML_INDEX.json');
  const canonical = readJson(CANONICAL_PATH, 'providers_canonical.json');

  if (!Array.isArray(catalog)) throw new Error('[fichas] El catálogo HTML no es un array.');
  if (!Array.isArray(canonical)) throw new Error('[fichas] providers_canonical.json no es un array.');

  const indexes = buildCanonicalIndexes(canonical);
  const htmlIndex = withSourceHtml ? buildHtmlSourceIndex() : null;
  const sourceHtml = withSourceHtml ? new Map() : null;
  const byKey = new Map();
  const joinModes = { vendorId: 0, slug: 0, name: 0, unmatched: 0 };
  let duplicatesMerged = 0;

  catalog.forEach((entry, index) => {
    if (entry === null || typeof entry !== 'object') return;
    const match = matchCanonical(entry, indexes);
    joinModes[match.mode] = (joinModes[match.mode] || 0) + 1;
    const ficha = buildFicha(entry, match.entry, match.vendorId, match.mode, index);

    const existing = byKey.get(ficha.key);
    if (existing) {
      duplicatesMerged += 1;
      // Fusión por máximo: gana la ficha con mayor completitud (desempate: primera).
      if (ficha.completeness > existing.completeness) {
        byKey.set(ficha.key, ficha);
        if (sourceHtml !== null) sourceHtml.set(ficha.key, resolveHtmlSource(htmlIndex, entry));
      }
      return;
    }
    byKey.set(ficha.key, ficha);
    if (sourceHtml !== null) sourceHtml.set(ficha.key, resolveHtmlSource(htmlIndex, entry));
  });

  const all = stableSort(Array.from(byKey.values()));
  const gold = all.filter(isGold);
  const groundable = all.filter(isGroundable);

  const catalogoSource = {
    path: 'vault/proveedores_html_indexados/CATALOGO_PROVEEDORES_HTML_INDEX.json',
    sha256: sha256OfFile(CATALOG_PATH),
    entries: catalog.length,
  };
  const canonicalSource = {
    path: 'public/data/providers/providers_canonical.json',
    sha256: sha256OfFile(CANONICAL_PATH),
    entries: canonical.length,
  };

  const counts = {
    catalogEntries: catalog.length,
    canonicalEntries: canonical.length,
    fichas: all.length,
    gold: gold.length,
    groundable: groundable.length,
    verified: all.filter((ficha) => ficha.verified).length,
    duplicatesMerged,
    joinModes,
  };

  const goldFile = {
    schemaVersion: SCHEMA_VERSION,
    thresholds: { goldMinCompleteness: GOLD_MIN_COMPLETENESS },
    sources: { catalogoHtml: catalogoSource, canonical: canonicalSource },
    counts,
    fichas: gold,
  };

  const indexFile = {
    schemaVersion: `${SCHEMA_VERSION}.index`,
    counts: { entries: all.length, gold: gold.length, verified: counts.verified, groundable: groundable.length },
    entries: all.map(toIndexEntry),
  };

  const report = {
    schemaVersion: `${SCHEMA_VERSION}.audit`,
    inputs: { catalogoHtml: catalogoSource, canonical: canonicalSource },
    join: joinModes,
    duplicatesMerged,
    counts,
    goldKeys: gold.map((ficha) => ficha.key),
    goldCriteria: `verified === true (teléfono real publicable, §4bis) && completeness >= ${GOLD_MIN_COMPLETENESS} && name.length > 1`,
    distribution: {
      verifiedCompleteness: all
        .filter((ficha) => ficha.verified)
        .reduce((buckets, ficha) => {
          const bucket = String(Math.floor(ficha.completeness / 10) * 10);
          buckets[bucket] = (buckets[bucket] || 0) + 1;
          return buckets;
        }, {}),
      verifiedWithPrice: all.filter((ficha) => ficha.verified && (ficha.priceEur !== null || ficha.priceRange)).length,
      verifiedWithRating: all.filter((ficha) => ficha.verified && ficha.rating !== null).length,
      verifiedWithDescription: all.filter((ficha) => ficha.verified && Boolean(ficha.description)).length,
      verifiedWithImage: all.filter((ficha) => ficha.verified && Boolean(ficha.image)).length,
      groundableWithoutPhone: all.filter((ficha) => isGroundable(ficha) && !ficha.verified).length,
    },
    invariants: {
      centralitaPublished: all.filter((ficha) => ficha.phone !== null && isCentralita(ficha.phone)).length,
      verifiedWithoutPhone: all.filter((ficha) => ficha.verified && !ficha.phone).length,
      placeholderPhones: all.filter((ficha) => ficha.phone !== null && !isPublishablePhone(ficha.phone)).length,
      emptyNames: all.filter((ficha) => ficha.name.length < 2).length,
      duplicateKeys: all.length - new Set(all.map((ficha) => ficha.key)).size,
      // Saneado de metadatos: 0 categorías de scraping y 0 provincias no canónicas.
      junkCategories: all.filter((ficha) => ficha.category.length > 0 && !isCanonicalCategory(ficha.category)).length,
      nonCanonicalProvinces: all.filter((ficha) => ficha.province.length > 0 && !isCanonicalProvince(ficha.province)).length,
    },
  };

  return { goldFile, indexFile, report, fichas: all, sourceHtml };
}


// ─── CLI ────────────────────────────────────────────────────────────────────

function fail(message, exitCode) {
  console.error(`[fichas] ✗ ${message}`);
  process.exit(exitCode);
}

/** Puerta `--check`: invariantes + sincronía byte a byte con el disco. */
function runCheck(goldFile, indexFile, report) {
  const violations = [];
  const invariants = report.invariants;

  if (invariants.centralitaPublished > 0) violations.push(`Centralita publicada como teléfono de proveedor: ${invariants.centralitaPublished}`);
  if (invariants.verifiedWithoutPhone > 0) violations.push(`Fichas verified:true sin teléfono: ${invariants.verifiedWithoutPhone}`);
  if (invariants.placeholderPhones > 0) violations.push(`Teléfonos placeholder publicados: ${invariants.placeholderPhones}`);
  if (invariants.emptyNames > 0) violations.push(`Fichas sin nombre: ${invariants.emptyNames}`);
  if (invariants.duplicateKeys > 0) violations.push(`Claves duplicadas: ${invariants.duplicateKeys}`);
  if (invariants.junkCategories > 0) violations.push(`Categorías de scraping publicadas: ${invariants.junkCategories}`);
  if (invariants.nonCanonicalProvinces > 0) violations.push(`Provincias no canónicas publicadas: ${invariants.nonCanonicalProvinces}`);
  if (report.counts.gold < 1) violations.push('Cero fichas doradas: el grounding sería una fachada vacía.');
  if (report.counts.groundable < 1) violations.push('Cero fichas citables: el Concierge seguiría ciego.');
  if (goldFile.fichas.length !== goldFile.counts.gold) violations.push('El array dorado no cuadra con counts.gold.');
  if (indexFile.entries.length !== goldFile.counts.fichas) violations.push('El índice no cubre todas las fichas construidas.');

  for (const ficha of goldFile.fichas) {
    if (computeProvenanceHash(ficha) !== ficha.provenanceHash) {
      violations.push(`provenanceHash corrupto en ${ficha.key}`);
      break;
    }
  }

  for (const entry of indexFile.entries) {
    if (entry.verified && !entry.phone) {
      violations.push(`Índice: ${entry.key} verificado sin teléfono (fachada).`);
      break;
    }
  }

  if (!fs.existsSync(GOLD_PATH) || !fs.existsSync(INDEX_PATH) || !fs.existsSync(REPORT_PATH)) {
    violations.push('Faltan artefactos en disco: ejecuta el build sin --check.');
  } else {
    if (fs.readFileSync(GOLD_PATH, 'utf8') !== serialize(goldFile)) violations.push('fichas_gold.json DESINCRONIZADO: re-ejecuta el build.');
    if (fs.readFileSync(INDEX_PATH, 'utf8') !== serialize(indexFile)) violations.push('fichas_index.json DESINCRONIZADO: re-ejecuta el build.');
    if (fs.readFileSync(REPORT_PATH, 'utf8') !== serialize(report)) violations.push('fichas_audit_report.json DESINCRONIZADO: re-ejecuta el build.');
  }

  const indexBytes = fs.existsSync(INDEX_PATH) ? fs.statSync(INDEX_PATH).size : 0;
  const goldBytes = fs.existsSync(GOLD_PATH) ? fs.statSync(GOLD_PATH).size : 0;
  if (indexBytes > 1_000_000) violations.push(`fichas_index.json supera 1 MB (${indexBytes} bytes): rompe el presupuesto de rendimiento.`);
  if (goldBytes > 1_000_000) violations.push(`fichas_gold.json supera 1 MB (${goldBytes} bytes): rompe el presupuesto de rendimiento.`);

  if (violations.length > 0) {
    for (const violation of violations) console.error(`[fichas] ✗ ${violation}`);
    process.exit(1);
  }

  console.log(
    `[fichas] ✓ check OK · fichas=${goldFile.counts.fichas} · doradas=${goldFile.counts.gold} · citables=${goldFile.counts.groundable} · verificadas=${goldFile.counts.verified} · index=${(indexBytes / 1024).toFixed(1)}KB · gold=${(goldBytes / 1024).toFixed(1)}KB · join=${JSON.stringify(report.join)}`,
  );
  process.exit(0);
}

function main() {
  const args = new Set(process.argv.slice(2));
  const isCheck = args.has('--check');
  const isStats = args.has('--stats');

  let artifacts;
  try {
    artifacts = buildArtifacts();
  } catch (error) {
    if (error && error.code === 'ENOENT_INPUT') fail(error.message, 2);
    throw error;
  }

  if (isStats) {
    console.log(JSON.stringify(artifacts.report, null, 2));
    process.exit(0);
  }

  if (isCheck) {
    runCheck(artifacts.goldFile, artifacts.indexFile, artifacts.report);
    return;
  }

  fs.mkdirSync(OUT_DIR, { recursive: true });
  const goldText = serialize(artifacts.goldFile);
  const indexText = serialize(artifacts.indexFile);
  fs.writeFileSync(GOLD_PATH, goldText, 'utf8');
  fs.writeFileSync(INDEX_PATH, indexText, 'utf8');
  fs.writeFileSync(REPORT_PATH, serialize(artifacts.report), 'utf8');
  const goldKb = (Buffer.byteLength(goldText, 'utf8') / 1024).toFixed(1);
  const indexKb = (Buffer.byteLength(indexText, 'utf8') / 1024).toFixed(1);
  console.log(
    `[fichas] ✓ fichas=${artifacts.goldFile.counts.fichas} · doradas=${artifacts.goldFile.counts.gold} · citables=${artifacts.goldFile.counts.groundable} · gold=${goldKb}KB · index=${indexKb}KB`,
  );
}

if (require.main === module) main();

module.exports = {
  SCHEMA_VERSION,
  GOLD_MIN_COMPLETENESS,
  CENTRALITA_DIGITS,
  WEIGHTS,
  isPublishablePhone,
  isCentralita,
  normalizePhone,
  slugify,
  extractVendorId,
  computeCompleteness,
  computeProvenanceHash,
  buildArtifacts,
  buildHtmlSourceIndex,
  resolveHtmlSource,
  isGroundable,
  isGold,
  normalizeProvince,
  normalizeCategory,
  isCanonicalProvince,
  isCanonicalCategory,
  foldText,
  serialize,
};

function serialize(value) {
  return `${JSON.stringify(value, null, 2)}\n`;
}
