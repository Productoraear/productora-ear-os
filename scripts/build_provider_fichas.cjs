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
const MANIFEST_PATH = path.join(ROOT, 'public', 'data', 'providers', 'manifest.json');
const MUNICIPALITIES_PATH = path.join(ROOT, 'src', 'data', 'geo', 'spain-8131-municipalities.json');
const OUT_DIR = path.join(ROOT, 'public', 'data', 'fichas');
const GOLD_PATH = path.join(OUT_DIR, 'fichas_gold.json');
const INDEX_PATH = path.join(OUT_DIR, 'fichas_index.json');
const REPORT_PATH = path.join(OUT_DIR, 'fichas_audit_report.json');

// ─── W43/W49 · Semilla de escaparate homologado (opt-in) ─────────────────────
// El JSON canónico lo produce `scripts/ingest_competitor_showcase.cjs`. Sólo se
// consume si existe: la puerta `--check` de HEAD no lo necesita y su ausencia no
// puede romper el build (fail-open de entrada, fail-closed de contenido).
const SHOWCASE_SEED_PATH = path.join(ROOT, 'public', 'data', 'providers', 'showcase_seed_canonical.json');
/** Estándar mínimo de conversión: 6 claves con dato real para homologar. */
const SHOWCASE_MIN_CONVERSION_KEYS = Object.freeze([
  'ident.nombre_comercial',
  'ident.descripcion_larga',
  'ubic.direccion',
  'esc.rating',
  'rep.testimonios',
  'faq.1.pregunta',
]);


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

function pickPublishablePhone(catalog, canonical, chunk) {
  if (catalog && isPublishablePhone(catalog.phone)) return digitsOf(catalog.phone);
  if (canonical && isPublishablePhone(canonical.telephone)) return digitsOf(canonical.telephone);
  if (chunk) {
    if (isPublishablePhone(chunk.telephone)) return digitsOf(chunk.telephone);
    if (isPublishablePhone(chunk.phone)) return digitsOf(chunk.phone);
  }
  return null;
}

// ─── Saneado de metadatos de origen (cero basura en el prompt) ──────────────
// El índice HTML arrastra artefactos de scraping ("foto", códigos ISO sueltos,
// provincias en minúsculas). Doctrina §4bis: un dato ilegible se declara
// AUSENTE antes que publicarse mal delante del cliente.

const CATEGORY_JUNK = new Set([
  'galeria', 'galerías', 'ver', 'mas', 'mapa',
  'web', 'webs', 'opiniones', 'contacto', 'telefono', 'precios', 'inicio', 'home',
]);

const CANONICAL_VERTICALS = Object.freeze([
  'finca',
  'catering',
  'musica',
  'sonido',
  'fotografia',
  'decoracion',
  'transporte',
  'servicios',
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

const POSTAL_PREFIX_TO_PROVINCE = {
  '01': 'Álava', '02': 'Albacete', '03': 'Alicante', '04': 'Almería', '05': 'Ávila',
  '06': 'Badajoz', '07': 'Baleares', '08': 'Barcelona', '09': 'Burgos', '10': 'Cáceres',
  '11': 'Cádiz', '12': 'Castellón', '13': 'Ciudad Real', '14': 'Córdoba', '15': 'A Coruña',
  '16': 'Cuenca', '17': 'Gerona', '18': 'Granada', '19': 'Guadalajara', '20': 'Guipúzcoa',
  '21': 'Huelva', '22': 'Huesca', '23': 'Jaén', '24': 'León', '25': 'Lérida',
  '26': 'La Rioja', '27': 'Lugo', '28': 'Madrid', '29': 'Málaga', '30': 'Murcia',
  '31': 'Navarra', '32': 'Orense', '33': 'Asturias', '34': 'Palencia', '35': 'Las Palmas',
  '36': 'Pontevedra', '37': 'Salamanca', '38': 'Santa Cruz de Tenerife', '39': 'Cantabria', '40': 'Segovia',
  '41': 'Sevilla', '42': 'Soria', '43': 'Tarragona', '44': 'Teruel', '45': 'Toledo',
  '46': 'Valencia', '47': 'Valladolid', '48': 'Vizcaya', '49': 'Zamora', '50': 'Zaragoza',
  '51': 'Ceuta', '52': 'Melilla',
};

const REGIONAL_CODES = new Set(['AN', 'CL', 'EX', 'GA', 'CT', 'PV', 'CN', 'CM', 'AR', 'VC']);

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

let MUNICIPALITY_LOOKUP = null;

function getMunicipalityLookup() {
  if (MUNICIPALITY_LOOKUP !== null) return MUNICIPALITY_LOOKUP;
  const lookup = new Map();
  if (fs.existsSync(MUNICIPALITIES_PATH)) {
    try {
      const munis = JSON.parse(fs.readFileSync(MUNICIPALITIES_PATH, 'utf8'));
      for (const m of munis) {
        const provNorm = PROVINCE_LOOKUP.get(foldText(m.province));
        if (!provNorm) continue;
        const nameClean = foldText(m.name);
        lookup.set(nameClean, provNorm);
        if (m.slug) lookup.set(foldText(m.slug), provNorm);
        if (m.name.includes('/')) {
          for (const part of m.name.split('/')) lookup.set(foldText(part), provNorm);
        }
        if (m.name.includes(',')) {
          const [main, art] = m.name.split(',');
          lookup.set(foldText(`${art} ${main}`), provNorm);
          lookup.set(foldText(main), provNorm);
        }
      }
    } catch {
      // fail-open
    }
  }
  const EXTRA_MAPPING = {
    'javea': 'Alicante', 'xabia': 'Alicante', 'alacanti': 'Alicante', 'elx': 'Alicante', 'elche': 'Alicante',
    'alcoi': 'Alicante', 'alcoy': 'Alicante', 'san vicente del raspeig': 'Alicante', 'san vicente': 'Alicante',
    'gasteiz': 'Álava', 'vitoria': 'Álava', 'vitoria gasteiz': 'Álava', 'renteria': 'Guipúzcoa',
    'errenteria': 'Guipúzcoa', 'donostia': 'Guipúzcoa', 'san sebastian': 'Guipúzcoa', 'bilbao': 'Vizcaya',
    'bilbo': 'Vizcaya', 'tarragones': 'Tarragona', 'plana baixa': 'Castellón', 'plana alta': 'Castellón',
    'girones': 'Gerona', 'ribera baixa': 'Valencia', 'ribera alta': 'Valencia', 'guadix': 'Granada',
    'partido judicial de guadix': 'Granada', 'loja': 'Granada', 'partido judicial de loja': 'Granada',
    'partido judicial de granada': 'Granada', 'ronda': 'Málaga', 'serrania de ronda': 'Málaga',
    'axarquia': 'Málaga', 'la axarquia': 'Málaga', 'matarranya': 'Teruel', 'matarrana': 'Teruel',
    'ainsa': 'Huesca', 'ainsa sobrarbe': 'Huesca',
  };
  for (const [k, v] of Object.entries(EXTRA_MAPPING)) {
    lookup.set(foldText(k), v);
  }
  for (const p of PROVINCE_NAMES) {
    lookup.set(foldText(p), p);
  }
  MUNICIPALITY_LOOKUP = lookup;
  return MUNICIPALITY_LOOKUP;
}

/** Provincia canónica o cadena vacía (nunca un código suelto en la ficha). */
function normalizeProvince(value, municipality, address) {
  const raw = String(value === null || value === undefined ? '' : value).trim();
  if (raw.length === 0 || raw.length > 60) return '';
  const upper = raw.toUpperCase();
  if (Object.prototype.hasOwnProperty.call(PROVINCE_CODES, upper) && !REGIONAL_CODES.has(upper)) {
    return PROVINCE_CODES[upper];
  }
  const direct = PROVINCE_LOOKUP.get(foldText(raw));
  if (direct && !REGIONAL_CODES.has(upper)) return direct;

  // Rescate: código postal en texto de municipio o dirección
  const textToScan = `${municipality || ''} ${address || ''}`;
  const postalMatch = textToScan.match(/\b(0[1-9]|[1-4][0-9]|5[0-2])\d{3}\b/);
  if (postalMatch && POSTAL_PREFIX_TO_PROVINCE[postalMatch[1]]) {
    return POSTAL_PREFIX_TO_PROVINCE[postalMatch[1]];
  }

  // Rescate: resolución por municipio
  const muniLookup = getMunicipalityLookup();
  if (municipality) {
    const foldedMuni = foldText(municipality);
    if (muniLookup.has(foldedMuni)) return muniLookup.get(foldedMuni);
    const stripped = foldedMuni.replace(/^(el|la|los|las|l'|l )\s*/i, '').trim();
    if (muniLookup.has(stripped)) return muniLookup.get(stripped);
  }

  // Rescate: palabras de la dirección coincidentes con municipio
  if (address) {
    const foldedAddr = foldText(address);
    for (const [mName, p] of muniLookup.entries()) {
      if (mName.length >= 5 && foldedAddr.includes(mName)) return p;
    }
  }

  return direct || '';
}

/** Categoría canónica (una de las 8 verticales oficiales). */
function normalizeCategory(value) {
  const raw = String(value === null || value === undefined ? '' : value).replace(/\s+/g, ' ').trim();
  const folded = foldText(raw);
  if (folded.length < 3) return '';
  if (CATEGORY_JUNK.has(folded)) return '';

  if (folded.includes('finca') || folded.includes('espacio') || folded.includes('hotel') || folded.includes('masia') || folded.includes('pazo') || folded.includes('salon') || folded.includes('cortijo') || folded.includes('castillo') || folded.includes('bodega')) return 'finca';
  if (folded.includes('cater') || folded.includes('banquet') || folded.includes('gastro') || folded.includes('comida') || folded.includes('dulce') || folded.includes('tarta')) return 'catering';
  if (folded.includes('music') || folded.includes('dj') || folded.includes('animac') || folded.includes('espectacul') || folded.includes('mariachi') || folded.includes('orquest') || folded.includes('banda') || folded.includes('coro') || folded.includes('solista')) return 'musica';
  if (folded.includes('sonid') || folded.includes('iluminac') || folded.includes('audiovis') || folded.includes('luces') || folded.includes('efecto') || folded.includes('carpa') || folded.includes('escenario')) return 'sonido';
  if (folded.includes('foto') || folded.includes('video') || folded.includes('cinema') || folded.includes('drone') || folded.includes('fotomat')) return 'fotografia';
  if (folded.includes('decorac') || folded.includes('flor') || folded.includes('mobiliari') || folded.includes('ambientac')) return 'decoracion';
  if (folded.includes('transport') || folded.includes('coche') || folded.includes('autobus') || folded.includes('limusin') || folded.includes('vehicul')) return 'transporte';
  if (folded.includes('servic') || folded.includes('moda') || folded.includes('belleza') || folded.includes('vestid') || folded.includes('traje') || folded.includes('joy') || folded.includes('wedding') || folded.includes('invitac') || folded.includes('detalle') || folded.includes('senior') || folded.includes('cuidado') || folded.includes('organizac')) return 'servicios';

  if (CANONICAL_VERTICALS.includes(folded)) return folded;
  return 'servicios';
}

/** Invariante: la categoría publicada es legible (no basura de scraping). */
function isCanonicalCategory(value) {
  return normalizeCategory(value) === String(value === null || value === undefined ? '' : value);
}

/** Invariante: la provincia publicada pertenece a la lista canónica de 52. */
function isCanonicalProvince(value) {
  return PROVINCE_NAMES.includes(String(value === null || value === undefined ? '' : value));
}

/** Identificador universal inmutable EAR_ASIN_ID (Doctrina Bezos). */
function resolveEarAsinForFicha(category, vendorId, slug, key) {
  let catCode = 'GEN';
  const cat = String(category || '').toLowerCase();
  if (cat.includes('finca')) catCode = 'FNC';
  else if (cat.includes('cater')) catCode = 'CAT';
  else if (cat.includes('music')) catCode = 'ART';
  else if (cat.includes('sonid')) catCode = 'TEC';
  else if (cat.includes('foto')) catCode = 'FOT';

  const cleanSlug = String(slug || '').toUpperCase().replace(/[^A-Z0-9_-]/g, '');
  if (cleanSlug.includes('E78903') || cleanSlug.includes('EDWIN')) return 'EAR-ASIN-ART-E78903';
  if (cleanSlug.includes('OTZARRETA')) return 'EAR-ASIN-FNC-OTZARRETA';
  if (cleanSlug.includes('LUCES') || cleanSlug.includes('NAVIDAD')) return 'EAR-ASIN-TEC-LUCES2026';

  let rawId = String(vendorId || key || slug || 'UNKNOWN')
    .toUpperCase().replace(/^V-/, '').replace(/^CAT-/, '').replace(/[^A-Z0-9_-]/g, '').slice(0, 32);
  if (rawId.length < 3) rawId = rawId.padStart(3, '0');
  return `EAR-ASIN-${catCode}-${rawId}`;
}

function buildFicha(catalogEntry, canonicalEntry, chunkEntry, vendorId, matchMode, index) {
  const catalog = catalogEntry && typeof catalogEntry === 'object' ? catalogEntry : {};
  const canonical = canonicalEntry && typeof canonicalEntry === 'object' ? canonicalEntry : {};
  const chunk = chunkEntry && typeof chunkEntry === 'object' ? chunkEntry : {};
  const phone = pickPublishablePhone(catalog, canonical, chunk);

  const name = truncate(canonical.name || chunk.name || catalog.name, MAX_FIELD_CHARS);
  const slug = slugify(canonical.slug) || slugify(chunk.slug) || slugify(catalog.slug) || slugify(name);
  const rawVendorId = vendorId !== null && vendorId !== undefined ? String(vendorId) : chunk.vendorId ? String(chunk.vendorId) : null;
  const resolvedVendorId = rawVendorId && /^\d{3,}$/.test(rawVendorId) ? rawVendorId : null;
  const key = resolvedVendorId
    ? `v-${resolvedVendorId}`
    : (canonical.id && String(canonical.id).startsWith('v-') && /^\d{3,}$/.test(String(canonical.id).slice(2)))
      ? String(canonical.id)
      : `cat-${slug || index}`;

  const sources = [];
  if (catalogEntry) sources.push('catalogo_html');
  if (canonicalEntry) sources.push('providers_canonical');
  if (chunkEntry) sources.push('manifest_chunk');
  if (sources.length === 0) sources.push('manifest_chunk');

  const imageUrls = Array.isArray(canonical.imageUrls) ? canonical.imageUrls : Array.isArray(chunk.imageUrls) ? chunk.imageUrls : [];
  const basePrice = positiveOrNull(canonical.basePrice || chunk.basePrice || chunk.price_eur);
  const catalogPrice = positiveOrNull(catalog.price);
  const canonicalRating = positiveOrNull(canonical.rating || chunk.rating);
  const catalogRating = positiveOrNull(catalog.rating);
  const canonicalReviews = positiveOrNull(canonical.reviewsCount || chunk.reviews);
  const catalogReviews = positiveOrNull(catalog.reviews);

  const rawCategory = canonical.category || chunk.category || catalog.category;
  const category = truncate(normalizeCategory(rawCategory), MAX_FIELD_CHARS);
  const rawProvince = canonical.province || chunk.province || catalog.province;
  const municipality = truncate(canonical.municipality || chunk.municipality || chunk.city || catalog.city || '', MAX_FIELD_CHARS);
  const address = chunk.address || catalog.address || '';
  const province = truncate(normalizeProvince(rawProvince, municipality, address), MAX_FIELD_CHARS);
  const asin = resolveEarAsinForFicha(category, resolvedVendorId, slug, key);

  const ficha = {
    key,
    asin,
    vendorId: resolvedVendorId,
    slug,
    name,
    category,
    province,
    municipality,
    phone,
    priceEur: basePrice !== null ? basePrice : catalogPrice,
    priceRange: truncate(canonical.priceRange || chunk.priceRange, 40),
    rating: canonicalRating !== null ? canonicalRating : catalogRating,
    reviewsCount: canonicalReviews !== null ? Math.round(canonicalReviews) : catalogReviews !== null ? Math.round(catalogReviews) : null,
    description: truncate(canonical.description || chunk.description || catalog.pitch_hook, MAX_DESCRIPTION_CHARS),
    image: truncate(canonical.img || chunk.img || imageUrls[0] || catalog.img, 400),
    profileUrl: truncate(catalog.profile_url || chunk.profile_url, 400),
    web: truncate(canonical.web || chunk.web, 400),
    lat: toFiniteNumber(canonical.lat !== undefined ? canonical.lat : chunk.lat),
    lng: toFiniteNumber(canonical.lng !== undefined ? canonical.lng : chunk.lng),
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

// ─── W43/W49 · Homologación por semilla de escaparate ───────────────────────

/**
 * Lee la semilla canónica del escaparate y devuelve, o `null`, o un objeto con
 * la valoración de conversión. NUNCA lanza: un JSON corrupto degrada a `null`
 * y se declara en el reporte (AF-5: el build no puede morir por un dato opcional).
 *
 * REGLA DE ORO: aquí no se publica ni un teléfono. La semilla declara
 * `exposePhone:false` por doctrina (contact-gate + depósito 100 € del SSOT) y
 * este módulo lo verifica antes de aceptar nada.
 */
function readShowcaseSeed(seedPath = SHOWCASE_SEED_PATH) {
  if (!fs.existsSync(seedPath)) {
    return { present: false, reason: 'semilla ausente en disco', seed: null, conversion: null };
  }
  let seed;
  try {
    seed = JSON.parse(fs.readFileSync(seedPath, 'utf8'));
  } catch (error) {
    const detail = error && error.message ? error.message : String(error);
    return { present: false, reason: `semilla ilegible: ${detail}`, seed: null, conversion: null };
  }
  if (seed === null || typeof seed !== 'object' || Array.isArray(seed)) {
    return { present: false, reason: 'semilla sin estructura de objeto', seed: null, conversion: null };
  }

  const doctrine = seed.doctrine !== null && typeof seed.doctrine === 'object' ? seed.doctrine : {};
  const values =
    seed.providerFields !== null && typeof seed.providerFields === 'object' && seed.providerFields.values !== null && typeof seed.providerFields.values === 'object'
      ? seed.providerFields.values
      : {};

  const presentKeys = SHOWCASE_MIN_CONVERSION_KEYS.filter(
    (key) => typeof values[key] === 'string' && values[key].trim().length > 0,
  );
  const faqPairs = Array.isArray(seed.faq)
    ? seed.faq.filter(
        (pair) =>
          pair !== null &&
          typeof pair === 'object' &&
          typeof pair.question === 'string' &&
          pair.question.trim().length > 0 &&
          typeof pair.answer === 'string' &&
          pair.answer.trim().length > 0,
      ).length
    : 0;

  const conversion = {
    /** Estándar mínimo cumplido: las 6 claves de conversión con dato real. */
    homologated: presentKeys.length === SHOWCASE_MIN_CONVERSION_KEYS.length,
    requiredKeys: SHOWCASE_MIN_CONVERSION_KEYS.length,
    presentKeys: presentKeys.length,
    missingKeys: SHOWCASE_MIN_CONVERSION_KEYS.filter((key) => !presentKeys.includes(key)),
    faqPairs,
    /** Bloque de paquetes: el portal declara formatos; sin dato queda `null`. */
    packagesDocumented: Array.isArray(seed.packages) && seed.packages.length > 0,
    score: typeof seed.completeness === 'object' && seed.completeness !== null ? seed.completeness.score : null,
    gaps: typeof seed.completeness === 'object' && seed.completeness !== null && Array.isArray(seed.completeness.gaps)
      ? seed.completeness.gaps.map((gap) => (gap && typeof gap.bloque === 'string' ? gap.bloque : 'desconocido'))
      : [],
    exposePhone: doctrine.exposePhone === false,
    contactGate: doctrine.contactGate === true,
    selfHash: typeof seed.selfHash === 'string' ? seed.selfHash : null,
    slug: typeof seed.identity === 'object' && seed.identity !== null && typeof seed.identity.nombre_comercial === 'string'
      ? slugify(seed.identity.nombre_comercial)
      : null,
  };

  return { present: true, reason: null, seed, conversion };
}


/**
 * Entrada compacta del índice (presupuesto < 1 MB): sólo lo que el Concierge
 * necesita para localizar y citar la ficha. El detalle completo vive en
 * `fichas_gold.json`. `ph` es el prefijo del provenanceHash (puntero, no hash).
 */
function toIndexEntry(ficha) {
  return {
    key: ficha.key,
    asin: ficha.asin,
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

  // 1. Ingesta del Data Lake completo desde public/data/providers/manifest.json
  let manifestSource = null;
  let chunkEntriesCount = 0;
  if (fs.existsSync(MANIFEST_PATH)) {
    const manifest = readJson(MANIFEST_PATH, 'manifest.json');
    for (const [categoryName, categoryMeta] of Object.entries(manifest)) {
      if (!categoryMeta || !Array.isArray(categoryMeta.chunks)) continue;
      for (const chunkFile of categoryMeta.chunks) {
        const chunkFilePath = path.join(ROOT, 'public', 'data', 'providers', chunkFile);
        if (!fs.existsSync(chunkFilePath)) continue;
        const chunkData = readJson(chunkFilePath, chunkFile);
        if (!Array.isArray(chunkData)) continue;
        chunkEntriesCount += chunkData.length;
        chunkData.forEach((entry, index) => {
          if (entry === null || typeof entry !== 'object') return;
          const match = matchCanonical(entry, indexes);
          joinModes[match.mode] = (joinModes[match.mode] || 0) + 1;
          const ficha = buildFicha(null, match.entry, entry, match.vendorId, match.mode, index);

          const existing = byKey.get(ficha.key);
          if (existing) {
            duplicatesMerged += 1;
            if (ficha.completeness > existing.completeness) {
              byKey.set(ficha.key, ficha);
            }
            return;
          }
          byKey.set(ficha.key, ficha);
        });
      }
    }
    manifestSource = {
      path: 'public/data/providers/manifest.json',
      sha256: sha256OfFile(MANIFEST_PATH),
      entries: chunkEntriesCount,
    };
  }

  // 2. Ingesta y enriquecimiento con el catálogo HTML
  catalog.forEach((entry, index) => {
    if (entry === null || typeof entry !== 'object') return;
    const match = matchCanonical(entry, indexes);
    const ficha = buildFicha(entry, match.entry, null, match.vendorId, match.mode, index);

    const existing = byKey.get(ficha.key);
    if (existing) {
      duplicatesMerged += 1;
      const mergedSources = Array.from(new Set([...existing.sources, 'catalogo_html']));
      if (ficha.completeness > existing.completeness) {
        ficha.sources = mergedSources;
        ficha.provenanceHash = computeProvenanceHash(ficha);
        byKey.set(ficha.key, ficha);
        if (sourceHtml !== null) sourceHtml.set(ficha.key, resolveHtmlSource(htmlIndex, entry));
      } else {
        existing.sources = mergedSources;
        if (!existing.profileUrl && ficha.profileUrl) existing.profileUrl = ficha.profileUrl;
        existing.provenanceHash = computeProvenanceHash(existing);
        if (sourceHtml !== null) sourceHtml.set(ficha.key, resolveHtmlSource(htmlIndex, entry));
      }
      return;
    }
    joinModes[match.mode] = (joinModes[match.mode] || 0) + 1;
    byKey.set(ficha.key, ficha);
    if (sourceHtml !== null) sourceHtml.set(ficha.key, resolveHtmlSource(htmlIndex, entry));
  });

  const all = stableSort(Array.from(byKey.values()));
  const gold = all.filter(isGold);
  const groundable = all.filter(isGroundable);

  // W43/W49 · ESTÁNDAR MÍNIMO DE CONVERSIÓN (§4bis ampliado).
  // La semilla del escaparate homologado describe la anatomía de conversión que
  // debe alcanzar toda ficha. NO añade fichas ni altera su completitud: marca
  // qué fichas cumplen ya ese estándar y deja el hueco declarado en el reporte.
  const showcase = readShowcaseSeed();
  const showcaseStandard = showcase.conversion;
  const homologatedKeys = [];
  const conversionGaps = [];
  if (showcaseStandard !== null && showcaseStandard.slug !== null) {
    for (const ficha of all) {
      if (ficha.slug !== showcaseStandard.slug) continue;
      if (showcaseStandard.homologated) homologatedKeys.push(ficha.key);
      else {
        conversionGaps.push({
          key: ficha.key,
          missing: showcaseStandard.missingKeys,
          faqPairs: showcaseStandard.faqPairs,
          packagesDocumented: showcaseStandard.packagesDocumented,
        });
      }
    }
  }

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
    manifestEntries: chunkEntriesCount,
    fichas: all.length,
    gold: gold.length,
    groundable: groundable.length,
    verified: all.filter((ficha) => ficha.verified).length,
    duplicatesMerged,
    joinModes,
  };

  const goldFileSources = { catalogoHtml: catalogoSource, canonical: canonicalSource };
  if (manifestSource) goldFileSources.manifest = manifestSource;

  const goldFile = {
    schemaVersion: SCHEMA_VERSION,
    thresholds: { goldMinCompleteness: GOLD_MIN_COMPLETENESS },
    sources: goldFileSources,
    counts,
    fichas: gold,
  };

  const indexFile = {
    schemaVersion: `${SCHEMA_VERSION}.index`,
    counts: { entries: all.length, gold: gold.length, verified: counts.verified, groundable: groundable.length },
    entries: all.map(toIndexEntry),
  };

  const reportInputs = { catalogoHtml: catalogoSource, canonical: canonicalSource };
  if (manifestSource) reportInputs.manifest = manifestSource;

  const report = {
    schemaVersion: `${SCHEMA_VERSION}.audit`,
    inputs: reportInputs,
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
    // W43/W49 · Trazabilidad del estándar de conversión del escaparate.
    // `present:false` declara que la semilla no está en disco: el build sigue
    // siendo válido, pero el estándar no se aplica (no se finge homologación).
    showcaseStandard: {
      present: showcase.present,
      reason: showcase.reason,
      selfHash: showcaseStandard !== null ? showcaseStandard.selfHash : null,
      exposePhone: showcaseStandard !== null ? showcaseStandard.exposePhone : null,
      contactGate: showcaseStandard !== null ? showcaseStandard.contactGate : null,
      homologated: showcaseStandard !== null ? showcaseStandard.homologated : false,
      requiredKeys: SHOWCASE_MIN_CONVERSION_KEYS.slice(),
      presentKeys: showcaseStandard !== null ? showcaseStandard.presentKeys : 0,
      missingKeys: showcaseStandard !== null ? showcaseStandard.missingKeys : SHOWCASE_MIN_CONVERSION_KEYS.slice(),
      faqPairs: showcaseStandard !== null ? showcaseStandard.faqPairs : 0,
      packagesDocumented: showcaseStandard !== null ? showcaseStandard.packagesDocumented : false,
      completenessScore: showcaseStandard !== null ? showcaseStandard.score : null,
      completenessGaps: showcaseStandard !== null ? showcaseStandard.gaps : [],
      matchedFichas: homologatedKeys.length + conversionGaps.length,
      homologatedKeys,
      conversionGaps,
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

  // W43/W49 · Si la semilla del escaparate está presente, la doctrina es
  // innegociable: `exposePhone:false` y contact-gate activo. Una semilla que
  // abra el teléfono directo rompe la puerta (INV-06/INV-12).
  const showcaseStandard = report.showcaseStandard;
  if (showcaseStandard !== null && typeof showcaseStandard === 'object' && showcaseStandard.present === true) {
    if (showcaseStandard.exposePhone !== true) {
      violations.push('Semilla de escaparate con exposePhone distinto de false (INV-06/INV-12).');
    }
    if (showcaseStandard.contactGate !== true) {
      violations.push('Semilla de escaparate sin contact-gate activo.');
    }
    if (typeof showcaseStandard.selfHash !== 'string' || showcaseStandard.selfHash.length !== 64) {
      violations.push('Semilla de escaparate sin selfHash SHA-256 verificable (AF-3).');
    }
    if (showcaseStandard.homologated === true && showcaseStandard.faqPairs < 1) {
      violations.push('Semilla homologada sin pares de FAQ reales: estándar de conversión vacío.');
    }
  }

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
  if (indexBytes > 6_000_000) violations.push(`fichas_index.json supera 6 MB (${indexBytes} bytes): rompe el presupuesto de rendimiento.`);
  if (goldBytes > 6_000_000) violations.push(`fichas_gold.json supera 6 MB (${goldBytes} bytes): rompe el presupuesto de rendimiento.`);

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
  // W43/W49 · estándar de conversión del escaparate homologado.
  SHOWCASE_SEED_PATH,
  SHOWCASE_MIN_CONVERSION_KEYS,
  readShowcaseSeed,
};

function serialize(value) {
  return `${JSON.stringify(value, null, 2)}\n`;
}
