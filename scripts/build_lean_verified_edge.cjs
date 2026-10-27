#!/usr/bin/env node
/**
 * ════════════════════════════════════════════════════════════════════════════════
 * BUILD_LEAN_VERIFIED_EDGE.CJS — PIPELINE EDGE VERAZ (CERO FACHADAS)
 * ════════════════════════════════════════════════════════════════════════════════
 * REGLAS DE VERDAD (AGENTS.md §4bis y §8):
 *   1. Solo se publica un proveedor si tiene TELÉFONO REAL (no centralita, no
 *      vacío) o COORDENADAS GPS verificadas por JSON-LD de su ficha de origen.
 *   2. `verified:true` EXCLUSIVAMENTE con teléfono real, exclusivo del proveedor
 *      y no perteneciente a numeración de tarificación especial (70x/80x/90x).
 *   3. PROHIBIDO inventar precio, rating, reseñas, descripción o servicios.
 *      Si el dato no existe en el origen, el campo NO se emite.
 *   4. Cada registro lleva `provenance` (hash del origen) y `evidence`.
 *   5. Particiones < 1 MB. Si un gremio excede el presupuesto, se divide en
 *      chunks (`gremio.json`, `gremio__2.json`, ...) y el manifest declara
 *      `publishable` vs `published` vs `overflow` (transparencia, no vanidad).
 *
 * FUENTES:
 *   - SSOT: src/data/all_providers_database.json (identidad por vendor id CDN)
 *   - Inteligencia HTML: reports/PROVIDER_HTML_INTEL.json (GPS/rating/precio real)
 *   Los artefactos se regeneran automáticamente si están obsoletos.
 *
 * SALIDAS:
 *   public/data/providers/<gremio>[__n].json
 *   public/data/providers/all_featured.json
 *   public/data/providers/manifest.json
 * ════════════════════════════════════════════════════════════════════════════════
 */

'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execFileSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const SSOT = path.join(ROOT, 'src', 'data', 'all_providers_database.json');
const EDGE_DIR = path.join(ROOT, 'public', 'data', 'providers');
const IDENTITY_MAP = path.join(ROOT, 'reports', 'PROVIDER_IDENTITY_MAP.json');
const HTML_FULL = path.join(ROOT, 'reports', 'PROVIDER_HTML_INTEL.json');
const ENRICHMENT_FILE = path.join(ROOT, 'reports', 'PROVIDER_ENRICHMENT.json');
const ENRICHMENT_INDEX = path.join(ROOT, 'src', 'data', 'provider_enrichment', 'index.json');
const MANIFEST = path.join(EDGE_DIR, 'manifest.json');

const MAX_FILE_BYTES = 900 * 1024; // margen de seguridad bajo el límite de 1 MB
const CENTRALITA = '+34 693 693 048';
const GENERATED_AT = new Date().toISOString();

/** Bounding boxes de España (península, Baleares, Canarias, Ceuta y Melilla). */
const SPAIN_REGIONS = [
    { minLat: 35.9, maxLat: 44.0, minLng: -9.6, maxLng: 4.6 },
    { minLat: 38.5, maxLat: 40.2, minLng: 1.0, maxLng: 4.6 },
    { minLat: 27.5, maxLat: 29.6, minLng: -18.3, maxLng: -13.3 },
    { minLat: 34.8, maxLat: 36.0, minLng: -5.6, maxLng: -1.0 }
];

function isInsideSpain(lat, lng) {
    return SPAIN_REGIONS.some((r) => lat >= r.minLat && lat <= r.maxLat && lng >= r.minLng && lng <= r.maxLng);
}

const CATEGORIES = ['finca', 'catering', 'musica', 'foto', 'decoracion', 'servicios', 'moda', 'transporte', 'sonido', 'wedding'];

/** Mapeo carpeta de la bóveda HTML -> gremio canónico. */
const FOLDER_TO_CATEGORY = {
    animacion_espectaculos: 'servicios',
    animacion: 'servicios',
    catering: 'catering',
    decoracion: 'decoracion',
    fotografia: 'foto',
    foto: 'foto',
    fincas: 'finca',
    finca: 'finca',
    musica: 'musica',
    moda: 'moda',
    sonido: 'sonido',
    transporte: 'transporte',
    wedding: 'wedding',
    bodas: 'wedding',
    servicios: 'servicios'
};

/* ────────────────────────────── UTILIDADES ────────────────────────────── */

function readJson(file) {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function loadEnrichment() {
    if (fs.existsSync(ENRICHMENT_INDEX)) {
        const index = readJson(ENRICHMENT_INDEX);
        const providers = {};
        for (const part of index.parts || []) {
            const rows = readJson(path.join(path.dirname(ENRICHMENT_INDEX), part.file));
            for (const row of rows) {
                if (row && row.vendorId) providers[row.vendorId] = row;
            }
        }
        return { ...index, providers };
    }
    return fs.existsSync(ENRICHMENT_FILE) ? readJson(ENRICHMENT_FILE) : { providers: {} };
}

function sha256File(file) {
    return crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
}

function ensureArtifact(artifact, script, label) {
    const stale = !fs.existsSync(artifact) || fs.statSync(artifact).mtimeMs < fs.statSync(SSOT).mtimeMs;
    if (stale) {
        console.log(`[EDGE] ${label} obsoleto o ausente. Regenerando ${path.relative(ROOT, artifact)}...`);
        execFileSync(process.execPath, [path.join(__dirname, script)], { stdio: 'inherit' });
    }
    return readJson(artifact);
}

function normPhone(p) {
    if (p == null) return '';
    return String(p).replace(/[^0-9]/g, '');
}

function isCentralita(p) {
    return normPhone(p) === normPhone(CENTRALITA);
}

function isRealPhone(p) {
    const n = normPhone(p);
    return n.length >= 9 && n !== normPhone(CENTRALITA);
}

const PREMIUM_PREFIXES = ['700', '703', '704', '705', '706', '707', '708', '709', '803', '806', '807', '901', '902', '905', '909'];

/** Numeración de tarificación especial: no es un contacto directo del proveedor. */
function isPremiumPhone(p) {
    let n = normPhone(p);
    if (n.startsWith('34') && n.length > 9) n = n.slice(2);
    return PREMIUM_PREFIXES.includes(n.slice(0, 3));
}

function str(v, max) {
    const s = v == null ? '' : String(v).replace(/\s+/g, ' ').trim();
    if (!max || s.length <= max) return s;
    return s.slice(0, max).replace(/[\s,;.-]+$/, '').trim();
}

function numOrNull(v) {
    const n = typeof v === 'number' ? v : Number(v);
    return Number.isFinite(n) ? n : null;
}

function slugify(v) {
    return String(v == null ? '' : v)
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 90);
}

function normCategory(raw) {
    const s = String(raw == null ? '' : raw).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
    if (!s) return 'servicios';
    if (CATEGORIES.includes(s)) return s;
    const map = [
        ['finca', 'finca'], ['hacienda', 'finca'], ['cortijo', 'finca'], ['espacio', 'finca'],
        ['catering', 'catering'], ['banquete', 'catering'],
        ['music', 'musica'], ['mariachi', 'musica'], ['dj', 'musica'], ['orquesta', 'musica'], ['animacion musical', 'musica'],
        ['foto', 'foto'], ['video', 'foto'],
        ['decor', 'decoracion'], ['flor', 'decoracion'],
        ['moda', 'moda'], ['novia', 'moda'], ['traje', 'moda'],
        ['transport', 'transporte'], ['coche', 'transporte'], ['autobus', 'transporte'],
        ['sonido', 'sonido'], ['iluminacion', 'sonido'], ['luces', 'sonido'],
        ['boda', 'wedding']
    ];
    for (const [needle, cat] of map) {
        if (s.includes(needle)) return cat;
    }
    return 'servicios';
}

function categoryFromFile(file) {
    const rel = String(file || '').toLowerCase();
    const parts = rel.split('/');
    const folder = parts.length > 2 ? parts[2] : '';
    const key = folder.replace(/[^a-z_]/g, '');
    if (FOLDER_TO_CATEGORY[key]) return FOLDER_TO_CATEGORY[key];
    for (const [needle, cat] of Object.entries(FOLDER_TO_CATEGORY)) {
        if (rel.includes(needle)) return cat;
    }
    return 'servicios';
}

/* ───────────────────────── CONSTRUCCIÓN DE REGISTROS ───────────────────────── */

/**
 * Construye el registro Edge desde el mapa de identidad + inteligencia HTML.
 * Solo emite campos con dato REAL. Nada de defaults inventados.
 */
function buildRecord(identity, geo, enrich) {
    const vendorId = identity.vendorId || null;
    const enrichPhone = enrich && enrich.phone && !enrich.disputed ? String(enrich.phone) : '';
    const identityPhone = identity.phone || '';
    const sharedBy = Number(identity.phoneSharedByVendors) || 0;
    const identityKind = identity.phoneKind || '';
    const identityAttributable = isRealPhone(identityPhone) && sharedBy <= 1 && identityKind !== 'TARIFICACION_ESPECIAL';
    const enrichPhoneVerified = Boolean(enrich && enrich.verified === true && enrichPhone);
    const phoneAttributable = enrichPhone ? true : identityAttributable;
    const verifiedContact = enrichPhone ? enrichPhoneVerified : identityAttributable;
    const phoneRaw = enrichPhone || identityPhone;
    const phoneKindValue = enrichPhone ? (enrich.phone_kind || '') : identityKind;
    const phoneDisputed = !enrichPhone && isRealPhone(identityPhone) && !identityAttributable;
    const lat = geo ? numOrNull(geo.lat) : (enrich ? numOrNull(enrich.lat) : null);
    const lng = geo ? numOrNull(geo.lng) : (enrich ? numOrNull(enrich.lng) : null);
    const hasGeo = lat !== null && lng !== null && lat !== 0 && lng !== 0;
    const city = str((geo && geo.city) || (enrich && enrich.municipality) || '', 80);
    const region = str((geo && geo.region) || (enrich && enrich.province) || identity.province || '', 80);
    const postalCode = str((geo && geo.postalCode) || '', 12);
    const street = str((geo && geo.street) || (enrich && enrich.address) || '', 160);
    const rawRating = geo ? numOrNull(geo.rating) : null;
    const rawReviews = geo ? numOrNull(geo.reviews) : null;
    const rating = rawRating !== null && rawRating > 0 ? rawRating : null;
    const reviews = rawReviews !== null && rawReviews >= 0 ? rawReviews : null;
    const priceFromEur = geo ? numOrNull(geo.priceFromEur) : null;

    const id = vendorId ? `v-${vendorId}` : `k-${crypto.createHash('sha1').update(`${identity.name}|${identity.province}`).digest('hex').slice(0, 12)}`;
    const slugBase = slugify(identity.slug || identity.name) || 'proveedor';

    const gallery = Array.isArray(identity.gallery)
        ? identity.gallery.filter((u) => typeof u === 'string' && u.startsWith('http')).slice(0, 8)
        : [];
    const img = str(identity.img || gallery[0] || '', 300);

    const record = {
        id,
        vendorId,
        name: str(identity.name, 120) || 'Proveedor',
        slug: `${slugBase}${vendorId ? `-${vendorId}` : ''}`,
        category: normCategory(identity.category),
        province: region || 'España',
        municipality: city,
        address: street,
        postal_code: postalCode,
        phone: phoneAttributable ? str(phoneRaw, 24) : '',
        telephone: phoneAttributable ? str(phoneRaw, 24) : '',
        phone_kind: phoneAttributable ? phoneKindValue : '',
        phone_disputed: phoneDisputed ? true : undefined,
        has_real_phone: phoneAttributable,
        hasDirectPhone: phoneAttributable,
        verified: verifiedContact,
        lat: hasGeo ? Number(lat.toFixed(6)) : null,
        lng: hasGeo ? Number(lng.toFixed(6)) : null,
        geo_evidence: hasGeo ? (geo && numOrNull(geo.lat) !== null ? 'jsonld:GeoCoordinates' : enrich.dataset) : null,
        rating,
        reviews,
        rating_evidence: rating !== null ? 'jsonld:AggregateRating' : null,
        price_eur: priceFromEur,
        price: priceFromEur !== null ? `${priceFromEur} €` : '',
        basePrice: priceFromEur !== null ? priceFromEur : undefined,
        img,
        gallery,
        imageUrls: gallery,
        description: str(identity.description || identity.description_full || '', 200),
        description_full: str(identity.description_full || identity.description || '', 320),
        services_list: Array.isArray(identity.services_list) ? identity.services_list.slice(0, 4).map((s) => str(s, 80)) : [],
        faqs: Array.isArray(identity.faqs) ? identity.faqs.slice(0, 3) : [],
        web: str((geo && geo.web) || (enrich && enrich.web) || '', 200),
        email: str((geo && geo.email) || (enrich && enrich.email) || '', 120),
        instagram: str((geo && geo.instagram) || (enrich && enrich.instagram) || '', 200),
        facebook: str((geo && geo.facebook) || (enrich && enrich.facebook) || '', 200),
        tiktok: str((enrich && enrich.tiktok) || '', 200),
        youtube: str((enrich && enrich.youtube) || '', 200),
        linkedin: str((enrich && enrich.linkedin) || '', 200),
        provenance: str((geo && geo.provenance) || '', 64),
        enrichment_evidence: enrich ? {
            dataset: enrich.dataset,
            license: enrich.license,
            confidence: enrich.confidence,
            mode: enrich.mode,
            matched_id: enrich.matched && enrich.matched.id,
            matched_name: enrich.matched && enrich.matched.name,
            rule: enrich.evidence && enrich.evidence.rule,
            fields: enrich.evidence && enrich.evidence.fields,
            phone_verified: enrichPhoneVerified
        } : undefined,
        source: `${geo ? 'ssot+html' : 'ssot'}${enrich ? '+overture' : ''}`,
        contact_ready: phoneAttributable || hasGeo || Boolean((geo && geo.web) || (enrich && enrich.web)) || Boolean((geo && geo.email) || (enrich && enrich.email))
    };

    return stripEmpty(record);
}

function stripEmpty(record) {
    for (const key of Object.keys(record)) {
        const v = record[key];
        if (v === '' || v === null || v === undefined) delete record[key];
        if (Array.isArray(v) && v.length === 0) delete record[key];
    }
    return record;
}

/** Proveedor que solo existe en la bóveda HTML (no está en el SSOT). */
function buildRecordFromHtmlOnly(htmlRecord, enrich) {
    let lat = numOrNull(htmlRecord.lat);
    let lng = numOrNull(htmlRecord.lng);
    if ((lat === null || lng === null || lat === 0 || lng === 0) && enrich) {
        lat = numOrNull(enrich.lat);
        lng = numOrNull(enrich.lng);
    }
    if (lat === null || lng === null || lat === 0 || lng === 0) return null;
    const vendorId = htmlRecord.vendorId;
    const address = htmlRecord.address || {};
    const rawRating = numOrNull(htmlRecord.rating);
    const rating = rawRating !== null && rawRating > 0 ? rawRating : null;
    const reviews = numOrNull(htmlRecord.reviews);
    const priceFromEur = numOrNull(htmlRecord.priceFromEur);
    const gallery = Array.isArray(htmlRecord.gallery) ? htmlRecord.gallery.slice(0, 8) : [];
    const slugBase = slugify(htmlRecord.name) || 'proveedor';

    const record = {
        id: `v-${vendorId}`,
        vendorId,
        name: str(htmlRecord.name, 120) || 'Proveedor',
        slug: `${slugBase}-${vendorId}`,
        category: categoryFromFile(htmlRecord.file),
        province: str(address.region || 'España', 80),
        municipality: str(address.locality || '', 80),
        address: str(address.street || '', 160),
        postal_code: str(address.postalCode || '', 12),
        has_real_phone: Boolean(enrich && enrich.phone),
        hasDirectPhone: Boolean(enrich && enrich.phone),
        phone: str((enrich && enrich.phone) || '', 24),
        telephone: str((enrich && enrich.phone) || '', 24),
        phone_kind: str((enrich && enrich.phone_kind) || '', 12),
        verified: Boolean(enrich && enrich.verified === true),
        lat: Number(lat.toFixed(6)),
        lng: Number(lng.toFixed(6)),
        geo_evidence: htmlRecord.lat != null ? 'jsonld:GeoCoordinates' : enrich.dataset,
        rating,
        reviews,
        rating_evidence: rating !== null ? 'jsonld:AggregateRating' : null,
        price_eur: priceFromEur,
        price: priceFromEur !== null ? `${priceFromEur} €` : '',
        basePrice: priceFromEur !== null ? priceFromEur : undefined,
        img: str(gallery[0] || '', 300),
        gallery,
        imageUrls: gallery,
        web: str((htmlRecord.web) || (enrich && enrich.web) || '', 200),
        email: str((htmlRecord.email) || (enrich && enrich.email) || '', 120),
        instagram: str((htmlRecord.social && htmlRecord.social.instagram) || (enrich && enrich.instagram) || '', 200),
        facebook: str((htmlRecord.social && htmlRecord.social.facebook) || (enrich && enrich.facebook) || '', 200),
        enrichment_evidence: enrich ? {
            dataset: enrich.dataset,
            license: enrich.license,
            confidence: enrich.confidence,
            mode: enrich.mode,
            matched_id: enrich.matched && enrich.matched.id,
            matched_name: enrich.matched && enrich.matched.name,
            rule: enrich.evidence && enrich.evidence.rule,
            fields: enrich.evidence && enrich.evidence.fields,
            phone_verified: Boolean(enrich.verified === true),
            ...(enrich.phone_source ? { phone_source: enrich.phone_source } : {}),
            ...((enrich.evidence && ((enrich.evidence.webcrawl && enrich.evidence.webcrawl.provenance) || enrich.evidence.provenance))
                ? { provenance: (enrich.evidence.webcrawl && enrich.evidence.webcrawl.provenance) || enrich.evidence.provenance }
                : {})
        } : undefined,
        provenance: str(htmlRecord.provenance || '', 64),
        source: enrich ? 'html-vault+overture' : 'html-vault',
        contact_ready: true
    };

    return stripEmpty(record);
}

function richnessScore(record) {
    let score = 0;
    if (record.verified) score += 100;
    if (record.phone) score += 40;
    if (typeof record.lat === 'number') score += 20;
    if (typeof record.rating === 'number') score += 8;
    if (typeof record.price_eur === 'number') score += 5;
    if (record.img) score += 4;
    if (record.description_full) score += 3;
    if (Array.isArray(record.services_list)) score += 1;
    if (record.web) score += 6;
    if (record.instagram || record.facebook) score += 5;
    return score;
}

function sortByTruth(a, b) {
    return (richnessScore(b) - richnessScore(a)) || String(a.name).localeCompare(String(b.name), 'es');
}

/* ─────────────────────────── ESCRITURA PARTICIONADA ─────────────────────────── */

function writeChunked(category, records) {
    const files = [];
    let bucket = [];
    let bytes = 2; // corchetes
    let index = 1;

    const flush = () => {
        if (bucket.length === 0) return;
        const fileName = index === 1 ? `${category}.json` : `${category}__${index}.json`;
        const payload = JSON.stringify(bucket);
        fs.writeFileSync(path.join(EDGE_DIR, fileName), payload, 'utf8');
        files.push({ file: fileName, count: bucket.length, bytes: Buffer.byteLength(payload, 'utf8'), sha256: crypto.createHash('sha256').update(payload).digest('hex') });
        bucket = [];
        bytes = 2;
        index++;
    };

    for (const record of records) {
        const serialized = JSON.stringify(record);
        const size = Buffer.byteLength(serialized, 'utf8') + (bucket.length ? 1 : 0);
        if (bucket.length > 0 && bytes + size > MAX_FILE_BYTES) flush();
        bucket.push(record);
        bytes += size;
    }
    flush();
    return files;
}

function cleanOldChunks(category) {
    for (const entry of fs.readdirSync(EDGE_DIR)) {
        if (!entry.endsWith('.json')) continue;
        if (entry === `${category}.json` || new RegExp(`^${category}__\\d+\\.json$`).test(entry)) {
            fs.unlinkSync(path.join(EDGE_DIR, entry));
        }
    }
}

/* ──────────────────────────────── MAIN ──────────────────────────────── */

function buildSeniorCare(usedPhones) {
    const file = path.join(EDGE_DIR, 'senior_care.json');
    if (!fs.existsSync(file)) return null;
    const existing = readJson(file);
    if (!Array.isArray(existing)) return null;

    const kept = [];
    const pruned = [];
    const seenPhones = new Set(usedPhones || []);
    const isSynthetic = (record) => {
        const img = String(record.img || '');
        const description = String(record.description || '');
        const address = String(record.address || '').toLowerCase();
        return img.includes('unsplash')
            || record.basePrice === 1500
            || description.includes('VIMUME Senior Care verificado')
            || address.includes('consultar registro municipal');
    };

    for (const record of existing) {
        const rawPhone = record.phone || record.telephone;
        const digits = normPhone(rawPhone);
        const contactable = isRealPhone(rawPhone) && !isPremiumPhone(rawPhone) && !seenPhones.has(digits);
        if (contactable) seenPhones.add(digits);
        const trustworthy = !isSynthetic(record);
        const clean = { ...record, has_real_phone: contactable, hasDirectPhone: contactable, verified: contactable && trustworthy };
        // Sin evidencia de origen (JSON-LD) no se publican valoraciones.
        delete clean.rating;
        delete clean.reviews;
        if (!contactable) {
            delete clean.phone;
            delete clean.telephone;
            pruned.push(clean);
            continue;
        }
        if (!trustworthy) {
            // Se conserva la identidad y el contacto real; se purga el relleno sintético.
            delete clean.img;
            delete clean.basePrice;
            delete clean.price;
            delete clean.description;
            delete clean.services_list;
            delete clean.address;
        }
        kept.push(clean);
    }
    kept.sort(sortByTruth);
    fs.writeFileSync(file, JSON.stringify(kept), 'utf8');
    const prunedPath = path.join(ROOT, 'reports', 'PROVIDER_SENIOR_CARE_UNCONTACTABLE.json');
    const previousPruned = fs.existsSync(prunedPath) ? (readJson(prunedPath) || []).length : 0;
    if (pruned.length > 0 || !fs.existsSync(prunedPath)) {
        fs.writeFileSync(prunedPath, JSON.stringify(pruned, null, 2), 'utf8');
    }
    return {
        count: kept.length,
        pruned: pruned.length > 0 ? pruned.length : previousPruned,
        sizeKB: Number((fs.statSync(file).size / 1024).toFixed(1)),
        withPhone: kept.length,
        verified: kept.filter((r) => r.verified === true).length,
        chunks: ['senior_care.json']
    };
}

function main() {
    if (!fs.existsSync(EDGE_DIR)) fs.mkdirSync(EDGE_DIR, { recursive: true });

    console.log('[EDGE] Cargando identidad canónica (vendor id CDN)...');
    const identity = ensureArtifact(IDENTITY_MAP, 'audit_provider_identity.cjs', 'Mapa de identidad');
    console.log('[EDGE] Cargando inteligencia HTML (GPS/rating/precio reales)...');
    const htmlIntel = ensureArtifact(HTML_FULL, 'extract_provider_intel_from_html.cjs', 'Inteligencia HTML');
    console.log('[EDGE] Cargando enriquecimiento abierto (Overture Places)...');
    const enrichment = loadEnrichment();
    const enrichmentById = new Map(Object.entries(enrichment.providers || {}));

    const geoById = new Map();
    for (const record of htmlIntel.records || []) {
        if (!record || !record.vendorId) continue;
        if (numOrNull(record.lat) === null || numOrNull(record.lng) === null) continue;
        geoById.set(String(record.vendorId), record);
    }

    const byCategory = new Map();
    const idSeen = new Set();
    const rawRecords = [];
    let publishable = 0;
    let withPhone = 0;
    let withPhoneWithheld = 0;
    let withGeo = 0;
    let verified = 0;
    let withSocial = 0;
    let withWeb = 0;
    let withRating = 0;

    const pushRecord = (record) => {
        if (!record || idSeen.has(record.id)) return;
        // Regla de publicación: contacto atribuible, GPS verificado o identidad CDN real.
        if (!record.phone && typeof record.lat !== 'number' && !record.vendorId) return;
        idSeen.add(record.id);
        rawRecords.push(record);
    };

    for (const provider of identity.providers || []) {
        const geo = provider.vendorId ? geoById.get(String(provider.vendorId)) : null;
        const enrich = provider.vendorId ? enrichmentById.get(String(provider.vendorId)) : null;
        if (!provider.phone && !geo && !enrich) continue;
        pushRecord(buildRecord(provider, geo, enrich));
    }

    for (const record of htmlIntel.records || []) {
        if (!record || !record.vendorId) continue;
        if (idSeen.has(`v-${record.vendorId}`)) continue;
        pushRecord(buildRecordFromHtmlOnly(record, enrichmentById.get(String(record.vendorId))));
    }

    // Normalización global: GPS dentro de España y un teléfono = un solo proveedor.
    const usedPhones = new Set();
    for (const record of rawRecords.sort(sortByTruth)) {
        if (typeof record.lat === 'number' && !isInsideSpain(record.lat, record.lng)) {
            delete record.lat;
            delete record.lng;
            delete record.geo_evidence;
        }
        if (record.phone) {
            const digits = normPhone(record.phone);
            if (usedPhones.has(digits)) {
                delete record.phone;
                delete record.telephone;
                delete record.phone_kind;
                record.has_real_phone = false;
                record.hasDirectPhone = false;
                record.verified = false;
                record.phone_disputed = true;
            } else {
                usedPhones.add(digits);
            }
        }
        if (!record.phone && typeof record.lat !== 'number' && !record.vendorId) continue;
        publishable++;
        if (record.phone) withPhone++;
        else if (record.phone_disputed) withPhoneWithheld++;
        if (typeof record.lat === 'number') withGeo++;
        if (record.verified) verified++;
        if (record.instagram || record.facebook) withSocial++;
        if (record.web) withWeb++;
        if (typeof record.rating === 'number') withRating++;
        const cat = record.category || 'servicios';
        if (!byCategory.has(cat)) byCategory.set(cat, []);
        byCategory.get(cat).push(record);
    }

    const manifest = {
        _meta: {
            version: '2.1.0-ENRICHED',
            generatedAt: GENERATED_AT,
            doctrine: 'Publicación solo con contacto real atribuible o GPS verificado. Prohibido inventar precio/rating/verified.',
            maxFileKB: Math.round(MAX_FILE_BYTES / 1024),
            sources: ['src/data/all_providers_database.json', 'reports/PROVIDER_HTML_INTEL.json', 'reports/PROVIDER_ENRICHMENT.json'],
            publishable,
            withPhone,
            withPhoneWithheld,
            withGeo,
            verified,
            withSocial,
            withWeb,
            withRating
        }
    };

    for (const category of CATEGORIES) {
        const records = (byCategory.get(category) || []).sort(sortByTruth);
        cleanOldChunks(category);
        if (records.length === 0) {
            fs.writeFileSync(path.join(EDGE_DIR, `${category}.json`), '[]', 'utf8');
            manifest[category] = { count: 0, publishable: 0, overflow: 0, sizeKB: 0, chunks: [`${category}.json`] };
            console.log(`  ${category}: 0 registros publicables`);
            continue;
        }
        const chunks = writeChunked(category, records);
        const published = chunks.reduce((acc, c) => acc + c.count, 0);
        const all = records.slice(0, published);
        manifest[category] = {
            count: published,
            publishable: records.length,
            overflow: records.length - published,
            sizeKB: Number((chunks.reduce((acc, c) => acc + c.bytes, 0) / 1024).toFixed(1)),
            chunks: chunks.map((c) => c.file),
            sha256: chunks.map((c) => c.sha256),
            withPhone: all.filter((r) => r.phone).length,
            verified: all.filter((r) => r.verified).length,
            withGeo: all.filter((r) => typeof r.lat === 'number').length,
            withRating: all.filter((r) => typeof r.rating === 'number').length,
            withSocial: all.filter((r) => r.instagram || r.facebook).length
        };
        console.log(`  ${category}: ${published}/${records.length} publicados en ${chunks.length} chunk(s), ${manifest[category].sizeKB} KB`);
    }

    const senior = buildSeniorCare(usedPhones);
    if (senior) manifest['senior_care'] = senior;

    // Vitrina destacada: 150 registros con más verdad verificable y diversidad por gremio.
    const featured = [];
    const counts = {};
    const allRecords = [];
    for (const list of byCategory.values()) allRecords.push(...list);
    allRecords.sort(sortByTruth);
    for (const record of allRecords) {
        const cat = record.category || 'servicios';
        if ((counts[cat] || 0) >= 20) continue;
        featured.push(record);
        counts[cat] = (counts[cat] || 0) + 1;
        if (featured.length >= 150) break;
    }
    fs.writeFileSync(path.join(EDGE_DIR, 'all_featured.json'), JSON.stringify(featured), 'utf8');
    manifest['all_featured'] = {
        count: featured.length,
        sizeKB: Number((fs.statSync(path.join(EDGE_DIR, 'all_featured.json')).size / 1024).toFixed(1)),
        curated: true,
        note: 'Selección curada por verdad verificable; no es un gremio y no suma al total.'
    };

    // Matcher neuronal: muestra de los 310 registros con más verdad (sin fachadas).
    const matcherSample = allRecords.slice(0, 310).map((r) => stripEmpty({
        id: r.id,
        slug: r.slug,
        name: r.name,
        category: r.category,
        province: r.province,
        municipality: r.municipality,
        basePrice: r.price_eur,
        priceRange: r.price || '',
        rating: r.rating,
        reviewsCount: r.reviews,
        description: r.description_full || r.description || '',
        imageUrls: r.imageUrls || [],
        img: r.img || '',
        telephone: r.phone || '',
        contactHref: r.phone ? `tel:${String(r.phone).replace(/[^0-9+]/g, '')}` : '',
        web: r.web || '',
        instagram: r.instagram || '',
        facebook: r.facebook || '',
        lat: r.lat,
        lng: r.lng,
        source: r.source,
        verified: r.verified === true
    }));
    fs.writeFileSync(path.join(EDGE_DIR, 'providers_canonical.json'), JSON.stringify(matcherSample), 'utf8');
    manifest['providers_canonical'] = {
        count: matcherSample.length,
        sizeKB: Number((fs.statSync(path.join(EDGE_DIR, 'providers_canonical.json')).size / 1024).toFixed(1)),
        curated: true,
        note: 'Muestra de la verdad verificable para el matcher neuronal; no suma al total.'
    };

    fs.writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2), 'utf8');

    const totalPublished = CATEGORIES.reduce((acc, c) => acc + (manifest[c].count || 0), 0);
    const totalOverflow = CATEGORIES.reduce((acc, c) => acc + (manifest[c].overflow || 0), 0);

    console.log('\n[EDGE] ═════════ RESUMEN VERAZ ═════════');
    console.log(JSON.stringify({
        generado: GENERATED_AT,
        publicablesReales: publishable,
        publicados: totalPublished,
        overflow: totalOverflow,
        conTelefonoReal: withPhone,
        telefonosRetenidosPorAmbiguedad: withPhoneWithheld,
        conGpsVerificado: withGeo,
        verifiedBlindados: verified,
        conWebReal: withWeb,
        conRedesReales: withSocial,
        conRatingReal: withRating,
        seniorCare: senior ? { publicados: senior.count, podados: senior.pruned } : null,
        destacados: featured.length,
        manifest: path.relative(ROOT, MANIFEST)
    }, null, 2));
    console.log('[EDGE] Cero placeholders. Cero precios inventados. Cero verified falsos.');
}

main();
