#!/usr/bin/env node
/**
 * ════════════════════════════════════════════════════════════════════════════════
 * AUDIT_PROVIDER_IDENTITY.CJS — IDENTIDAD REAL DEL CATÁLOGO (ANTI-INFLACIÓN)
 * ════════════════════════════════════════════════════════════════════════════════
 * MISIÓN:
 *   1. Extraer el vendor id REAL de las URLs CDN (`/vendor/<id>/`) de cada fila
 *      del SSOT: es la única identidad no falsificable del proveedor.
 *   2. Medir cuántas filas son el MISMO proveedor (vendor id repetido).
 *   3. Auditar la autenticidad de cada teléfono único por prefijo (6xx/7xx/8xx/9xx
 *      móvil/fijo España vs 703/803/806/807 tarificación especial = sospechoso).
 *   4. Emitir el MAPA DE IDENTIDAD canónico (1 vendor id = 1 proveedor) con la
 *      mejor fila (más campos reales) para la ingesta Edge.
 *
 * SALIDA:
 *   reports/PROVIDER_IDENTITY_MAP.json  (mapa canónico id -> registro)
 *   reports/PROVIDER_IDENTITY_AUDIT.json (cifras reales)
 * ════════════════════════════════════════════════════════════════════════════════
 */

'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SSOT = path.join(ROOT, 'src', 'data', 'all_providers_database.json');
const OUT_MAP = path.join(ROOT, 'reports', 'PROVIDER_IDENTITY_MAP.json');
const OUT_AUDIT = path.join(ROOT, 'reports', 'PROVIDER_IDENTITY_AUDIT.json');
const CENTRALITA = '+34 693 693 048';

/* ───────────────────────────── UTILIDADES ───────────────────────────── */

function normPhone(p) {
    if (p == null) return '';
    return String(p).replace(/[^0-9]/g, '');
}

function isRealPhone(p) {
    const n = normPhone(p);
    if (!n) return false;
    if (n === normPhone(CENTRALITA)) return false;
    return n.length >= 9;
}

/** Prefijo de numeración española (3 dígitos) y clasificación de autenticidad. */
function classifyPhone(p) {
    let n = normPhone(p);
    if (n.startsWith('34') && n.length > 9) n = n.slice(2);
    const prefix = n.slice(0, 3);
    const special = ['700', '703', '704', '705', '706', '707', '708', '709',
        '803', '806', '807', '901', '902', '905', '909'];
    if (special.includes(prefix)) return { prefix, kind: 'TARIFICACION_ESPECIAL' };
    if (n.startsWith('6') || n.startsWith('7')) return { prefix, kind: 'MOVIL' };
    if (n.startsWith('8') || n.startsWith('9')) return { prefix, kind: 'FIJO' };
    return { prefix, kind: 'NO_ES' };
}

/** Extrae el vendor id real de cualquier URL CDN de la ficha. */
function vendorIdFrom(value) {
    if (!value) return null;
    const s = Array.isArray(value) ? value.join(' ') : String(value);
    const m = s.match(/\/vendor\/(\d+)\//i);
    return m ? m[1] : null;
}

function imageCount(record) {
    const urls = [];
    if (Array.isArray(record.gallery)) urls.push(...record.gallery);
    if (Array.isArray(record.imageUrls)) urls.push(...record.imageUrls);
    if (record.img) urls.push(record.img);
    const cdn = urls.filter((u) => typeof u === 'string' && /^https?:\/\//i.test(u));
    return new Set(cdn).size;
}

/** Puntúa una fila por cantidad de datos REALES (no por precio inventado). */
function richness(record, vid) {
    let score = 0;
    if (isRealPhone(record.phone || record.telephone)) score += 10;
    if (vid) score += 8;
    score += Math.min(imageCount(record), 20);
    if (record.description_full && String(record.description_full).length > 120) score += 3;
    if (record.address && String(record.address).trim().length > 3) score += 2;
    if (Array.isArray(record.faqs) && record.faqs.length > 0) score += 2;
    if (Array.isArray(record.services_list) && record.services_list.length > 0) score += 1;
    return score;
}

/* ────────────────── ESCÁNER JSON POR STREAMING (sin OOM) ────────────────── */

async function scanJsonArray(file, onRecord) {
    return new Promise((resolve, reject) => {
        const stream = fs.createReadStream(file, { encoding: 'utf8', highWaterMark: 1024 * 1024 });
        let depth = 0;
        let inString = false;
        let escaped = false;
        let started = false;
        let buf = '';
        let count = 0;

        stream.on('data', (chunk) => {
            for (let i = 0; i < chunk.length; i++) {
                const ch = chunk[i];
                if (!started) {
                    if (ch === '[') { started = true; depth = 1; }
                    continue;
                }
                if (inString) {
                    buf += ch;
                    if (escaped) escaped = false;
                    else if (ch === '\\') escaped = true;
                    else if (ch === '"') inString = false;
                    continue;
                }
                if (ch === '"') { inString = true; buf += ch; continue; }
                if (ch === '{') { depth++; buf += ch; continue; }
                if (ch === '}') {
                    depth--;
                    if (depth === 1) {
                        try {
                            onRecord(JSON.parse(buf + '}'));
                            count++;
                        } catch (err) {
                            onRecord(null);
                        }
                        buf = '';
                    } else {
                        buf += ch;
                    }
                    continue;
                }
                if (ch === '[') { depth++; buf += ch; continue; }
                if (ch === ']') {
                    depth--;
                    if (depth === 0) {
                        stream.destroy();
                        resolve(count);
                        return;
                    }
                    buf += ch;
                    continue;
                }
                if (depth >= 2) buf += ch;
            }
        });
        stream.on('end', () => resolve(count));
        stream.on('error', reject);
    });
}

/* ─────────────────────────── AGREGACIÓN ─────────────────────────── */

const vendors = new Map();          // key -> { best, rows, names, phones, categories, provinces, maxImages }
const phoneOwners = new Map();      // normalizedPhone -> Set(vendorKey)
const phoneMeta = new Map();        // normalizedPhone -> { raw, kind, prefix, records }
const nameKeys = new Set();
const nameProvinceKeys = new Set();
const categoryCount = new Map();

let total = 0;
let rowsWithVendorId = 0;
let rowsWithRealPhone = 0;
let rowsWithImages = 0;
let totalCdnImages = 0;

function analyze(record) {
    total++;
    if (!record || typeof record !== 'object' || Array.isArray(record)) return;

    const vid = vendorIdFrom(record.img) || vendorIdFrom(record.gallery) || vendorIdFrom(record.imageUrls);
    const name = String(record.name || '').trim();
    const province = String(record.province || '').trim();
    const category = String(record.category || '').trim();
    const phone = record.phone || record.telephone || null;
    const real = isRealPhone(phone);
    const imgs = imageCount(record);

    if (vid) rowsWithVendorId++;
    if (real) rowsWithRealPhone++;
    if (imgs > 0) rowsWithImages++;
    totalCdnImages += imgs;

    if (name) {
        nameKeys.add(name.toLowerCase());
        if (province) nameProvinceKeys.add(`${name.toLowerCase()}|${province.toLowerCase()}`);
    }
    if (category) categoryCount.set(category, (categoryCount.get(category) || 0) + 1);

    const key = vid ? `vendor:${vid}` : `name:${name.toLowerCase()}|${province.toLowerCase()}`;

    if (real) {
        const n = normPhone(phone);
        const meta = classifyPhone(phone);
        if (!phoneMeta.has(n)) {
            phoneMeta.set(n, { raw: String(phone).trim(), kind: meta.kind, prefix: meta.prefix, records: 0 });
        }
        phoneMeta.get(n).records++;
        if (!phoneOwners.has(n)) phoneOwners.set(n, new Set());
        phoneOwners.get(n).add(key);
    }

    if (!vendors.has(key)) {
        vendors.set(key, {
            vendorId: vid,
            best: record,
            bestScore: richness(record, vid),
            rows: 0,
            names: new Set(),
            phones: new Set(),
            categories: new Set(),
            provinces: new Set(),
            maxImages: imgs
        });
    }
    const entry = vendors.get(key);
    entry.rows++;
    if (name) entry.names.add(name);
    if (real) entry.phones.add(normPhone(phone));
    if (category) entry.categories.add(category);
    if (province) entry.provinces.add(province);
    entry.maxImages = Math.max(entry.maxImages, imgs);
    const score = richness(record, vid);
    if (score > entry.bestScore) {
        entry.best = record;
        entry.bestScore = score;
    }
}

/* ─────────────────────────────── MAIN ─────────────────────────────── */

function buildCanonical() {
    const canonical = [];
    for (const [key, entry] of vendors.entries()) {
        const best = entry.best || {};
        const phone = best.phone || best.telephone || '';
        const real = isRealPhone(phone);
        const phoneKey = real ? normPhone(phone) : '';
        const phoneKind = real ? (phoneMeta.get(phoneKey) || {}).kind : 'SIN_TELEFONO';
        const sharedBy = real ? (phoneOwners.get(phoneKey) || new Set()).size : 0;
        canonical.push({
            key,
            vendorId: entry.vendorId,
            name: String(best.name || '').trim(),
            slug: String(best.slug || '').trim(),
            category: String(best.category || '').trim(),
            province: String(best.province || '').trim(),
            address: String(best.address || '').trim(),
            phone: real ? String(phone).trim() : '',
            phoneKind,
            phoneSharedByVendors: sharedBy,
            img: String(best.img || '').trim(),
            gallery: Array.isArray(best.gallery) ? best.gallery : [],
            imageCount: entry.maxImages,
            rating: typeof best.rating === 'number' ? best.rating : null,
            reviews: typeof best.reviews === 'number' ? best.reviews : null,
            basePrice: typeof best.basePrice === 'number' ? best.basePrice : null,
            price: String(best.price || '').trim(),
            description: String(best.description || '').trim(),
            description_full: String(best.description_full || '').trim(),
            services_list: Array.isArray(best.services_list) ? best.services_list : [],
            faqs: Array.isArray(best.faqs) ? best.faqs : [],
            rowsMerged: entry.rows,
            verified: Boolean(real) && sharedBy <= 1 && phoneKind !== 'TARIFICACION_ESPECIAL'
        });
    }
    return canonical;
}

async function main() {
    const started = Date.now();
    console.error('[IDENTIDAD] Escaneando SSOT por streaming...');
    await scanJsonArray(SSOT, analyze);

    const pct = (n, d) => (d === 0 ? 0 : Number(((n / d) * 100).toFixed(2)));

    const phoneKinds = {};
    let uniquePhones = 0;
    let sharedPhones = 0;
    let suspiciousPhones = 0;
    for (const [n, meta] of phoneMeta.entries()) {
        uniquePhones++;
        phoneKinds[meta.kind] = (phoneKinds[meta.kind] || 0) + 1;
        if (meta.kind === 'TARIFICACION_ESPECIAL') suspiciousPhones++;
        if ((phoneOwners.get(n) || new Set()).size > 1) sharedPhones++;
    }

    const canonical = buildCanonical();
    const verified = canonical.filter((c) => c.verified).length;
    const withPhone = canonical.filter((c) => c.phone).length;
    const withImages = canonical.filter((c) => c.imageCount > 0).length;

    const audit = {
        meta: {
            generado: new Date().toISOString(),
            fuente: path.relative(ROOT, SSOT),
            duracionSeg: Number(((Date.now() - started) / 1000).toFixed(1)),
            doctrina: 'vendor id CDN = identidad real; verified solo con teléfono real, único y no premium'
        },
        filas_ssot: total,
        filas_con_vendor_id: rowsWithVendorId,
        filas_con_telefono_real: rowsWithRealPhone,
        filas_con_imagen_cdn: rowsWithImages,
        imagenes_cdn_totales: totalCdnImages,
        proveedores_unicos: canonical.length,
        proveedores_con_telefono: withPhone,
        proveedores_verified: verified,
        proveedores_con_imagen: withImages,
        nombres_unicos: nameKeys.size,
        nombre_provincia_unicos: nameProvinceKeys.size,
        telefonos_unicos: uniquePhones,
        telefonos_compartidos_entre_proveedores: sharedPhones,
        telefonos_tarificacion_especial: suspiciousPhones,
        telefonos_por_tipo: phoneKinds,
        inflacion_por_duplicidad_filas: total > 0 ? Number(((total - canonical.length) / total * 100).toFixed(2)) : 0,
        categorias: Object.fromEntries(Array.from(categoryCount.entries()).sort((a, b) => b[1] - a[1])),
        cobertura_pct: {
            proveedores_con_telefono: pct(withPhone, canonical.length),
            proveedores_verified: pct(verified, canonical.length),
            proveedores_con_imagen: pct(withImages, canonical.length)
        }
    };

    fs.mkdirSync(path.dirname(OUT_MAP), { recursive: true });
    fs.writeFileSync(OUT_MAP, JSON.stringify({
        meta: audit.meta,
        total: canonical.length,
        providers: canonical
    }), 'utf8');
    fs.writeFileSync(OUT_AUDIT, JSON.stringify(audit, null, 2), 'utf8');

    console.log(JSON.stringify({
        filas: total,
        filasConVendorId: rowsWithVendorId,
        filasConTelefono: rowsWithRealPhone,
        proveedoresUnicos: canonical.length,
        conTelefono: `${withPhone} (${pct(withPhone, canonical.length)}%)`,
        verified: `${verified} (${pct(verified, canonical.length)}%)`,
        conImagen: `${withImages} (${pct(withImages, canonical.length)}%)`,
        telefonosUnicos: uniquePhones,
        telefonosCompartidos: sharedPhones,
        telefonosPremiumSospechosos: suspiciousPhones,
        tipos: phoneKinds,
        duracionSeg: audit.meta.duracionSeg,
        mapa: path.relative(ROOT, OUT_MAP)
    }, null, 2));
}

main().catch((err) => {
    console.error('[IDENTIDAD] ERROR FATAL:', err);
    process.exit(1);
});
