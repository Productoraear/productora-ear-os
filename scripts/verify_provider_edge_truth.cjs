#!/usr/bin/env node
/**
 * ════════════════════════════════════════════════════════════════════════════════
 * VERIFY_PROVIDER_EDGE_TRUTH.CJS — GUARDIÁN DE INTEGRIDAD DEL ESCAPARATE
 * ════════════════════════════════════════════════════════════════════════════════
 * Valida la doctrina CERO FACHADAS sobre las particiones publicadas:
 *   1. Cada chunk < 1 MB y con JSON válido.
 *   2. Los conteos del manifest coinciden con los archivos reales.
 *   3. `verified:true` SOLO con teléfono real, no centralita y no premium.
 *   4. Ningún teléfono publicado es la centralita (+34 693 693 048).
 *   5. Ningún teléfono duplicado entre proveedores distintos.
 *   6. Coordenadas GPS dentro del bounding box de España.
 *   7. IDs y slugs únicos en todo el escaparate.
 *   8. `rating` con evidencia declarada (JSON-LD).
 *
 * Exit Code 0 = escaparate blindado. Exit Code 1 = fachada detectada.
 * ════════════════════════════════════════════════════════════════════════════════
 */

'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const EDGE_DIR = path.join(ROOT, 'public', 'data', 'providers');
const MANIFEST = path.join(EDGE_DIR, 'manifest.json');
const CENTRALITA = '693693048';

const SPAIN_REGIONS = [
    { name: 'Peninsula', minLat: 35.9, maxLat: 44.0, minLng: -9.6, maxLng: 4.6 },
    { name: 'Baleares', minLat: 38.5, maxLat: 40.2, minLng: 1.0, maxLng: 4.6 },
    { name: 'Canarias', minLat: 27.5, maxLat: 29.6, minLng: -18.3, maxLng: -13.3 },
    { name: 'CeutaMelilla', minLat: 34.8, maxLat: 36.0, minLng: -5.6, maxLng: -1.0 }
];
const PREMIUM_PREFIXES = ['700', '703', '704', '705', '706', '707', '708', '709', '803', '806', '807', '901', '902', '905', '909'];

const MARKETPLACE_HOSTS = [
    'bodas.net', 'bodas.com', 'zankyou.es', 'zankyou.com', 'matrimonio.com',
    'google.com', 'google.es', 'bing.com', 'facebook.com', 'instagram.com',
    'tiktok.com', 'youtube.com', 'linkedin.com', 'twitter.com', 'x.com',
    'pinterest.com', 'whatsapp.com', 'wa.me', 'tripadvisor.es', 'tripadvisor.com',
    'yelp.es', 'yelp.com', 'paginasamarillas.es', 'axesor.es', 'einforma.com',
    'infoisinfo.es', 'guiaempresas.es', 'foursquare.com', 'booking.com',
    'airbnb.es', 'airbnb.com', 'expedia.es', 'trivago.es', 'idealista.com',
    'fotocasa.es', 'milanuncios.com', 'wallapop.com', 'amazon.es'
];

function hostOf(value) {
    try {
        const url = new URL(String(value));
        if (!/^https?:$/.test(url.protocol)) return '';
        return url.hostname.toLowerCase().replace(/^www\./, '');
    } catch (err) {
        return '';
    }
}

function isMarketplaceHost(host) {
    return MARKETPLACE_HOSTS.some((entry) => host === entry || host.endsWith(`.${entry}`));
}

function isInsideSpain(lat, lng) {
    return SPAIN_REGIONS.some((r) => lat >= r.minLat && lat <= r.maxLat && lng >= r.minLng && lng <= r.maxLng);
}

function normPhone(value) {
    return String(value == null ? '' : value).replace(/[^0-9]/g, '');
}

function isRealPhone(value) {
    const n = normPhone(value);
    return n.length >= 9 && n !== CENTRALITA;
}

function isPremiumPhone(value) {
    let n = normPhone(value);
    if (n.startsWith('34') && n.length > 9) n = n.slice(2);
    return PREMIUM_PREFIXES.includes(n.slice(0, 3));
}

function verifyRecord(record, fileName, seenIds, seenSlugs, phoneOwners, errors, warnings) {
    const label = `${fileName}#${record.id || record.name || '?'}`;

    if (!record.name) errors.push(`${label}: sin nombre`);
    if (!record.category) errors.push(`${label}: sin categoría`);

    if (record.id) {
        if (seenIds.has(record.id)) errors.push(`${label}: id duplicado (${seenIds.get(record.id)})`);
        else seenIds.set(record.id, fileName);
    }
    if (record.slug) {
        if (seenSlugs.has(record.slug)) errors.push(`${label}: slug duplicado (${seenSlugs.get(record.slug)})`);
        else seenSlugs.set(record.slug, fileName);
    }

    const phone = record.phone || record.telephone || '';
    if (phone && normPhone(phone) === CENTRALITA) {
        errors.push(`${label}: publica la centralita como teléfono de proveedor`);
    }
    if (phone && isPremiumPhone(phone)) {
        warnings.push(`${label}: numeración de tarificación especial (${phone})`);
    }
    if (phone && !isRealPhone(phone)) {
        errors.push(`${label}: teléfono no válido (${phone})`);
    }
    if (record.verified === true) {
        if (!phone) errors.push(`${label}: verified:true SIN teléfono`);
        if (phone && isPremiumPhone(phone)) errors.push(`${label}: verified:true con numeración premium`);
    }
    if (phone) {
        const n = normPhone(phone);
        if (!phoneOwners.has(n)) phoneOwners.set(n, new Set());
        phoneOwners.get(n).add(record.id || record.slug || label);
    }

    if (typeof record.lat === 'number' || typeof record.lng === 'number') {
        const lat = Number(record.lat);
        const lng = Number(record.lng);
        if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
            errors.push(`${label}: coordenadas no numéricas`);
        } else if (!isInsideSpain(lat, lng)) {
            errors.push(`${label}: coordenadas fuera de España (${lat}, ${lng})`);
        }
    }

    if (record.rating !== undefined) {
        const rating = Number(record.rating);
        if (!Number.isFinite(rating) || rating < 0 || rating > 5) {
            errors.push(`${label}: rating inválido (${record.rating})`);
        }
        if (!record.rating_evidence) warnings.push(`${label}: rating sin evidencia declarada`);
    }

    if (record.phone && record.phone_disputed === true) {
        errors.push(`${label}: publica un teléfono marcado como disputado`);
    }
    if (record.email && !/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i.test(String(record.email))) {
        errors.push(`${label}: email inválido (${record.email})`);
    }
    if (record.web) {
        const host = hostOf(record.web);
        if (!host) errors.push(`${label}: web no es URL http(s) válida (${record.web})`);
        else if (isMarketplaceHost(host)) errors.push(`${label}: web apunta a un marketplace (${host})`);
    }

    const source = String(record.source || '');
    const evidence = record.enrichment_evidence;
    if (source.includes('overture')) {
        if (!evidence || !evidence.dataset || !evidence.matched_id) {
            errors.push(`${label}: fuente overture sin evidencia (dataset/matched_id)`);
        } else if (record.verified === true && evidence.phone_verified === true && Number(evidence.confidence) < 0.95) {
            errors.push(`${label}: verified:true con confianza ${evidence.confidence} < 0.95`);
        }
    }
    if (String(record.geo_evidence || '').startsWith('overture:') && typeof record.lat !== 'number') {
        errors.push(`${label}: geo_evidence Overture sin coordenadas`);
    }
}

function main() {
    const errors = [];
    const warnings = [];

    if (!fs.existsSync(MANIFEST)) {
        console.error('❌ manifest.json no existe. Ejecuta scripts/build_lean_verified_edge.cjs');
        process.exit(1);
    }
    const manifest = JSON.parse(fs.readFileSync(MANIFEST, 'utf8'));

    const seenIds = new Map();
    const seenSlugs = new Map();
    const phoneOwners = new Map();
    let totalRecords = 0;
    let totalBytes = 0;
    let files = 0;
    let enriched = 0;
    let webs = 0;
    let emails = 0;

    for (const [category, entry] of Object.entries(manifest)) {
        if (category.startsWith('_')) continue;
        if (!entry || typeof entry !== 'object' || !Array.isArray(entry.chunks)) continue;
        if (!Object.prototype.hasOwnProperty.call(entry, 'count')) continue;

        let counted = 0;
        for (const fileName of entry.chunks) {
            const file = path.join(EDGE_DIR, fileName);
            if (!fs.existsSync(file)) {
                errors.push(`Chunk ausente: ${fileName}`);
                continue;
            }
            const size = fs.statSync(file).size;
            totalBytes += size;
            files++;
            if (size > 1024 * 1024) errors.push(`Chunk > 1 MB: ${fileName} (${(size / 1024).toFixed(1)} KB)`);

            let list;
            try {
                list = JSON.parse(fs.readFileSync(file, 'utf8'));
            } catch (err) {
                errors.push(`JSON inválido en ${fileName}: ${err.message}`);
                continue;
            }
            if (!Array.isArray(list)) {
                errors.push(`Chunk no es array: ${fileName}`);
                continue;
            }

            for (const record of list) {
                totalRecords++;
                counted++;
                if (record.enrichment_evidence) enriched++;
                if (record.web) webs++;
                if (record.email) emails++;
                verifyRecord(record, fileName, seenIds, seenSlugs, phoneOwners, errors, warnings);
            }
        }

        if (counted !== entry.count) {
            errors.push(`Manifest declara ${entry.count} en ${category} pero los chunks suman ${counted}`);
        }
    }

    for (const [phone, owners] of phoneOwners.entries()) {
        if (owners.size > 1) {
            errors.push(`Teléfono ${phone} atribuido a ${owners.size} proveedores distintos`);
        }
    }

    const resumen = {
        archivos: files,
        registros: totalRecords,
        pesoTotalMB: Number((totalBytes / 1048576).toFixed(2)),
        idsUnicos: seenIds.size,
        telefonosPublicados: phoneOwners.size,
        registrosEnriquecidos: enriched,
        websPublicadas: webs,
        emailsPublicados: emails,
        errores: errors.length,
        avisos: warnings.length
    };

    console.log(JSON.stringify(resumen, null, 2));
    if (warnings.length > 0) {
        console.log('\n⚠️  AVISOS (primeros 10):');
        warnings.slice(0, 10).forEach((w) => console.log(`  - ${w}`));
    }
    if (errors.length > 0) {
        console.error('\n❌ FACHADAS DETECTADAS (primeras 25):');
        errors.slice(0, 25).forEach((e) => console.error(`  - ${e}`));
        process.exit(1);
    }
    console.log('\n✅ EDGE VERAZ: 0 fachadas, 0 placeholders, 0 teléfonos duplicados.');
}

main();
