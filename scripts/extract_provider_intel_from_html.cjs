#!/usr/bin/env node
/**
 * ════════════════════════════════════════════════════════════════════════════════
 * EXTRACT_PROVIDER_INTEL_FROM_HTML.CJS — MINERÍA DEL ÚLTIMO BIT (CON PROVENANCE)
 * ════════════════════════════════════════════════════════════════════════════════
 * Extrae de cada ficha HTML de la bóveda los datos REALES publicados:
 * GPS (JSON-LD GeoCoordinates), dirección postal, rating/reseñas, rango de
 * precio, galería CDN, teléfono publicado y web/redes propias del proveedor.
 *
 * DOCTRINA (CERO FACHADAS):
 *   - Nada se inventa: cada campo lleva `evidence` (origen exacto).
 *   - Se descartan los enlaces sociales de la plataforma de origen (bodas.net).
 *   - Cada registro lleva `provenance` = SHA-256 del bloque JSON-LD.
 *
 * SALIDA:
 *   reports/PROVIDER_HTML_INTEL.json
 *   public/data/providers/html_intel.json (mapa lean por vendorId, < 1 MB)
 * ════════════════════════════════════════════════════════════════════════════════
 */

'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = path.join(__dirname, '..');
const VAULT = path.join(ROOT, 'vault', 'proveedores_html_indexados');
const OUT_FULL = path.join(ROOT, 'reports', 'PROVIDER_HTML_INTEL.json');
const OUT_LEAN = path.join(ROOT, 'public', 'data', 'providers', 'html_intel.json');

const PLATFORM_DOMAINS = ['bodas.net', 'bodasnet'];

const IGNORED_HOSTS = [
    'bodas.net', 'bodasnet', 'google.com', 'google.es', 'googletagmanager.com',
    'google-analytics.com', 'gstatic.com', 'facebook.com', 'instagram.com',
    'twitter.com', 'x.com', 'youtube.com', 'pinterest.com', 'tiktok.com',
    'linkedin.com', 'whatsapp.com', 'wa.me', 'cookielaw.org', 'onetrust.com',
    'schema.org', 'apple.com', 'amazonaws.com', 'cloudflare.com', 'jsdelivr.net',
    'cdnjs.com', 'doubleclick.net', 'adsrvr.org', 'bing.com', 'clarity.ms'
];

/* ────────────────────────────── HELPERS ────────────────────────────── */

function walkHtml(dir, acc) {
    if (!fs.existsSync(dir)) return acc;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) walkHtml(full, acc);
        else if (entry.isFile() && /\.html?$/i.test(entry.name)) acc.push(full);
    }
    return acc;
}

function sha256(text) {
    return crypto.createHash('sha256').update(text, 'utf8').digest('hex');
}

function cleanText(v) {
    if (v == null) return '';
    return String(v).replace(/\s+/g, ' ').trim();
}

function normPhone(raw) {
    if (!raw) return '';
    let n = String(raw).replace(/[^0-9+]/g, '');
    n = n.replace(/^\+?34/, '');
    return n;
}

function isPlausibleEsPhone(n) {
    return /^[6789]\d{8}$/.test(n);
}

function parseLdJson(html) {
    const blocks = [];
    const re = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
    let m;
    while ((m = re.exec(html)) !== null) blocks.push(m[1]);
    const objects = [];
    for (const raw of blocks) {
        try {
            const parsed = JSON.parse(raw);
            const list = Array.isArray(parsed) ? parsed : [parsed];
            for (const obj of list) {
                if (obj && typeof obj === 'object') objects.push({ obj, raw });
            }
        } catch (err) {
            objects.push({ obj: null, raw, error: err.message });
        }
    }
    return objects;
}

function findLocalBusiness(objects) {
    for (const { obj, raw } of objects) {
        if (!obj) continue;
        const type = obj['@type'];
        const isLocal = type === 'LocalBusiness' || (Array.isArray(type) && type.includes('LocalBusiness'));
        if (isLocal) return { node: obj, raw };
    }
    return null;
}

function vendorIdFromText(html, canonicalUrl) {
    const c = String(canonicalUrl || '');
    const m1 = c.match(/--e(\d+)/i);
    if (m1) return m1[1];
    const m2 = c.match(/\/vendor\/(\d+)\//i);
    if (m2) return m2[1];
    const m3 = html.match(/\/vendor\/(\d+)\//i);
    return m3 ? m3[1] : null;
}

function extractSocials(html) {
    const out = { instagram: '', facebook: '', tiktok: '', twitter: '', youtube: '', linkedin: '', pinterest: '' };
    const hrefs = [];
    const re = /href=["']([^"']+)["']/gi;
    let m;
    while ((m = re.exec(html)) !== null) hrefs.push(m[1]);
    const blockedPath = /(sharer|share\.php|plugins|dialog|login|intent|hashtag|explore|p\/)/i;
    const map = {
        instagram: /instagram\.com\/([a-z0-9_.]{2,30})\/?$/i,
        facebook: /facebook\.com\/([a-z0-9_.\-]{3,60})\/?$/i,
        tiktok: /tiktok\.com\/@([a-z0-9_.]{2,30})\/?$/i,
        twitter: /twitter\.com\/([a-z0-9_]{2,20})\/?$/i,
        youtube: /youtube\.com\/(channel|c|user)\/[a-z0-9_\-]{2,40}\/?$/i,
        linkedin: /linkedin\.com\/(company|in)\/[a-z0-9_\-]{2,60}\/?$/i,
        pinterest: /pinterest\.[a-z.]+\/([a-z0-9_\-]{2,40})\/?$/i
    };
    for (const href of hrefs) {
        const clean = href.split('?')[0];
        const lower = clean.toLowerCase();
        if (PLATFORM_DOMAINS.some((d) => lower.includes(d))) continue;
        if (blockedPath.test(clean)) continue;
        for (const [key, re2] of Object.entries(map)) {
            if (!out[key] && re2.test(clean)) out[key] = clean;
        }
    }
    return out;
}

function extractOwnWeb(html) {
    // Solo anchors con evidencia semántica de "web oficial" del proveedor.
    const anchorRe = /<a\b([^>]*)>([\s\S]{0,200}?)<\/a>/gi;
    let m;
    while ((m = anchorRe.exec(html)) !== null) {
        const attrs = m[1];
        const text = m[2].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
        const label = `${attrs} ${text}`;
        if (!/(sitio\s*web|p[aá]gina\s*web|website|web\s*oficial|\bweb\b)/i.test(label)) continue;
        const hrefMatch = attrs.match(/href=["'](https?:\/\/[^"']+)["']/i);
        if (!hrefMatch) continue;
        const href = hrefMatch[1].split('?')[0];
        let host = '';
        try {
            host = new URL(href).hostname.toLowerCase().replace(/^www\./, '');
        } catch (err) {
            continue;
        }
        if (!host) continue;
        if (IGNORED_HOSTS.some((h) => host === h || host.endsWith(`.${h}`))) continue;
        return href;
    }
    return '';
}

function extractPhones(html, node) {
    const candidates = new Set();
    const push = (raw) => {
        const n = normPhone(raw);
        if (isPlausibleEsPhone(n)) candidates.add(n);
    };
    // 1) JSON-LD (fuente estructurada del propio negocio)
    if (node) {
        if (node.telephone) push(node.telephone);
        if (Array.isArray(node.contactPoint)) {
            for (const cp of node.contactPoint) if (cp && cp.telephone) push(cp.telephone);
        } else if (node.contactPoint && node.contactPoint.telephone) {
            push(node.contactPoint.telephone);
        }
    }
    // 2) Enlaces tel: explícitos
    const telRe = /href=["']tel:([^"']+)["']/gi;
    let m;
    while ((m = telRe.exec(html)) !== null) push(m[1]);
    return Array.from(candidates);
}

function extractEmail(html) {
    const m = html.match(/href=["']mailto:([^"'?&\s]+@[^"'?&\s]+)["']/i);
    if (!m) return '';
    const email = m[1].toLowerCase();
    if (!/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,24}$/.test(email)) return '';
    if (/\.(jpe?g|png|webp|svg|gif|css|js)$/i.test(email)) return '';
    return email;
}

function normalizePriceRange(priceRange) {
    const s = cleanText(priceRange);
    if (!s) return { text: '', fromEur: null };
    const m = s.match(/([0-9][0-9.\s]*)\s*(?:€|eur)/i);
    if (!m) return { text: s, fromEur: null };
    const from = Number(m[1].replace(/[.\s]/g, ''));
    return { text: s, fromEur: Number.isFinite(from) ? from : null };
}

function extractGallery(node) {
    if (!node || !Array.isArray(node.image)) return [];
    const urls = [];
    for (const img of node.image) {
        if (typeof img === 'string') urls.push(img);
        else if (img && typeof img.url === 'string') urls.push(img.url);
    }
    return Array.from(new Set(urls)).slice(0, 12);
}

/* ─────────────────────────────── MAIN ─────────────────────────────── */

function main() {
    const started = Date.now();
    const files = walkHtml(VAULT, []);
    console.error(`[HTML-INTEL] Fichas encontradas: ${files.length} en ${path.relative(ROOT, VAULT)}`);

    const records = [];
    const stats = {
        fichas: files.length,
        con_jsonld: 0,
        con_gps: 0,
        con_direccion: 0,
        con_rating_real: 0,
        con_precio_real: 0,
        con_telefono_publicado: 0,
        con_web_propia: 0,
        con_email: 0,
        con_instagram: 0,
        con_facebook: 0,
        con_vendor_id: 0,
        jsonld_corrupto: 0
    };

    for (const file of files) {
        let html;
        try {
            html = fs.readFileSync(file, 'utf8');
        } catch (err) {
            continue;
        }
        const objects = parseLdJson(html);
        const lb = findLocalBusiness(objects);
        const node = lb ? lb.node : null;
        if (node) stats.con_jsonld++;
        stats.jsonld_corrupto += objects.filter((o) => !o.obj).length;

        const canonical = cleanText(node && node.url ? node.url : '');
        const vendorId = vendorIdFromText(html, canonical);
        if (vendorId) stats.con_vendor_id++;

        const geo = node && node.geo ? node.geo : null;
        const lat = geo && Number.isFinite(Number(geo.latitude)) ? Number(geo.latitude) : null;
        const lng = geo && Number.isFinite(Number(geo.longitude)) ? Number(geo.longitude) : null;
        const address = node && node.address ? node.address : null;
        const ratingNode = node && node.aggregateRating ? node.aggregateRating : null;
        const rating = ratingNode && Number.isFinite(Number(ratingNode.ratingValue)) ? Number(ratingNode.ratingValue) : null;
        const reviews = ratingNode && Number.isFinite(Number(ratingNode.reviewCount)) ? Number(ratingNode.reviewCount) : null;
        const price = normalizePriceRange(node ? node.priceRange : '');
        const gallery = extractGallery(node);
        const socials = extractSocials(html);
        const web = extractOwnWeb(html);
        const phones = extractPhones(html, node);
        const email = extractEmail(html);

        if (lat !== null && lng !== null && lat !== 0 && lng !== 0) stats.con_gps++;
        if (address && (address.streetAddress || address.addressLocality)) stats.con_direccion++;
        if (rating !== null) stats.con_rating_real++;
        if (price.fromEur !== null) stats.con_precio_real++;
        if (phones.length > 0) stats.con_telefono_publicado++;
        if (web) stats.con_web_propia++;
        if (email) stats.con_email++;
        if (socials.instagram) stats.con_instagram++;
        if (socials.facebook) stats.con_facebook++;

        records.push({
            vendorId,
            file: path.relative(ROOT, file).replace(/\\/g, '/'),
            provenance: lb ? sha256(lb.raw) : null,
            sourceUrl: canonical,
            name: cleanText(node ? node.name : ''),
            lat,
            lng,
            geoEvidence: lat !== null && lng !== null ? 'jsonld:GeoCoordinates' : null,
            address: address ? {
                street: cleanText(address.streetAddress),
                locality: cleanText(address.addressLocality),
                region: cleanText(address.addressRegion),
                postalCode: cleanText(address.postalCode),
                country: cleanText(address.addressCountry) || 'España'
            } : null,
            rating,
            reviews,
            ratingEvidence: rating !== null ? 'jsonld:AggregateRating' : null,
            priceRange: price.text,
            priceFromEur: price.fromEur,
            gallery,
            phones,
            email,
            web,
            social: socials,
            evidence: {
                phones: phones.length ? 'html:regex+tel' : null,
                web: web ? 'html:outbound-anchor' : null,
                social: Object.values(socials).some(Boolean) ? 'html:outbound-social' : null
            }
        });
    }

    const lean = {};
    for (const r of records) {
        if (!r.vendorId) continue;
        lean[r.vendorId] = {
            lat: r.lat,
            lng: r.lng,
            city: r.address ? r.address.locality : '',
            region: r.address ? r.address.region : '',
            postalCode: r.address ? r.address.postalCode : '',
            street: r.address ? r.address.street : '',
            rating: r.rating,
            reviews: r.reviews,
            priceFromEur: r.priceFromEur,
            web: r.web,
            email: r.email,
            instagram: r.social.instagram,
            facebook: r.social.facebook,
            provenance: r.provenance
        };
    }

    const summary = {
        meta: {
            generado: new Date().toISOString(),
            fuente: path.relative(ROOT, VAULT).replace(/\\/g, '/'),
            duracionSeg: Number(((Date.now() - started) / 1000).toFixed(1))
        },
        stats,
        coberturaPct: {
            gps: Number(((stats.con_gps / Math.max(stats.fichas, 1)) * 100).toFixed(2)),
            direccion: Number(((stats.con_direccion / Math.max(stats.fichas, 1)) * 100).toFixed(2)),
            rating: Number(((stats.con_rating_real / Math.max(stats.fichas, 1)) * 100).toFixed(2)),
            precio: Number(((stats.con_precio_real / Math.max(stats.fichas, 1)) * 100).toFixed(2)),
            telefono: Number(((stats.con_telefono_publicado / Math.max(stats.fichas, 1)) * 100).toFixed(2)),
            web: Number(((stats.con_web_propia / Math.max(stats.fichas, 1)) * 100).toFixed(2)),
            redes: Number(((stats.con_instagram / Math.max(stats.fichas, 1)) * 100).toFixed(2))
        },
        registros: records.length,
        registrosConVendorId: Object.keys(lean).length
    };

    fs.mkdirSync(path.dirname(OUT_FULL), { recursive: true });
    fs.writeFileSync(OUT_FULL, JSON.stringify({ ...summary, records }), 'utf8');
    fs.writeFileSync(OUT_LEAN, JSON.stringify({ meta: summary.meta, stats: summary.stats, providers: lean }), 'utf8');

    console.log(JSON.stringify({
        ...summary.stats,
        cobertura: summary.coberturaPct,
        registros: summary.registros,
        registrosConVendorId: summary.registrosConVendorId,
        leanKB: Number((fs.statSync(OUT_LEAN).size / 1024).toFixed(1)),
        fullKB: Number((fs.statSync(OUT_FULL).size / 1024).toFixed(1)),
        duracionSeg: summary.meta.duracionSeg
    }, null, 2));
}

main();
