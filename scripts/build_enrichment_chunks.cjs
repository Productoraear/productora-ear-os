#!/usr/bin/env node
'use strict';
/**
 * BUILD_ENRICHMENT_CHUNKS.CJS — Overlay de enriquecimiento en particiones <900 KB
 * Convierte reports/PROVIDER_ENRICHMENT.json en ficheros ligeros versionables.
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = path.join(__dirname, '..');
const SOURCE = path.join(ROOT, 'reports', 'PROVIDER_ENRICHMENT.json');
const OUT_DIR = path.join(ROOT, 'src', 'data', 'provider_enrichment');
const MAX_BYTES = 850 * 1024;

const KEEP = [
    'vendorId', 'name', 'provider_category', 'source', 'dataset', 'license',
    'mode', 'confidence', 'ambiguous', 'phone', 'phone_kind', 'phone_source', 'web', 'email',
    'instagram', 'facebook', 'tiktok', 'youtube', 'linkedin', 'pinterest',
    'lat', 'lng', 'address', 'municipality', 'province', 'verified', 'disputed',
    'cif', 'razon_social'
];

function lean(entry) {
    const out = {};
    for (const key of KEEP) {
        if (entry[key] !== undefined && entry[key] !== '' && entry[key] !== null) out[key] = entry[key];
    }
    if (entry.matched) {
        out.matched = {
            id: entry.matched.id,
            name: entry.matched.name,
            category: entry.matched.category,
            province: entry.matched.province,
            locality: entry.matched.locality,
            jw: entry.matched.jw,
            geo: entry.matched.geo,
            cat: entry.matched.cat,
            domainHit: entry.matched.domainHit
        };
    }
    if (entry.evidence) {
        const webcrawl = entry.evidence.webcrawl && typeof entry.evidence.webcrawl === 'object' ? entry.evidence.webcrawl : null;
        out.evidence = {
            rule: (webcrawl && webcrawl.rule) || entry.evidence.rule,
            fields: entry.evidence.fields,
            dataset: entry.evidence.dataset,
            retrievedAt: entry.evidence.retrievedAt
        };
        if (webcrawl) {
            out.evidence.webcrawl = {
                url: webcrawl.url,
                provenance: webcrawl.provenance,
                identityStrength: webcrawl.identityStrength,
                rule: webcrawl.rule
            };
        }
        if (entry.evidence.webcrawl_email) {
            out.evidence.webcrawl_email = {
                url: entry.evidence.webcrawl_email.url,
                provenance: entry.evidence.webcrawl_email.provenance
            };
        }
    }
    return out;
}

function main() {
    if (!fs.existsSync(SOURCE)) throw new Error(`No existe ${path.relative(ROOT, SOURCE)}`);
    const payload = JSON.parse(fs.readFileSync(SOURCE, 'utf8'));
    const entries = Object.values(payload.providers || {})
        .map(lean)
        .sort((a, b) => String(a.vendorId).localeCompare(String(b.vendorId), 'es'));

    fs.mkdirSync(OUT_DIR, { recursive: true });
    for (const file of fs.readdirSync(OUT_DIR)) {
        if (/^part-\d+\.json$/.test(file)) fs.unlinkSync(path.join(OUT_DIR, file));
    }

    const parts = [];
    let bucket = [];
    let bytes = 2;
    let index = 1;
    const flush = () => {
        if (bucket.length === 0) return;
        const file = `part-${index}.json`;
        const text = JSON.stringify(bucket);
        fs.writeFileSync(path.join(OUT_DIR, file), text, 'utf8');
        parts.push({
            file,
            count: bucket.length,
            bytes: Buffer.byteLength(text, 'utf8'),
            sha256: crypto.createHash('sha256').update(text).digest('hex')
        });
        bucket = [];
        bytes = 2;
        index++;
    };

    for (const entry of entries) {
        const size = Buffer.byteLength(JSON.stringify(entry), 'utf8') + (bucket.length ? 1 : 0);
        if (bucket.length > 0 && bytes + size > MAX_BYTES) flush();
        bucket.push(entry);
        bytes += size;
    }
    flush();

    const auditPath = path.join(ROOT, 'reports', 'PROVIDER_ENRICHMENT_AUDIT.json');
    const audit = fs.existsSync(auditPath) ? JSON.parse(fs.readFileSync(auditPath, 'utf8')) : {};
    const manifest = {
        _meta: {
            version: '1.0.0-OVERTURE',
            generatedAt: new Date().toISOString(),
            dataset: payload.dataset,
            license: payload.license,
            source: 'reports/PROVIDER_ENRICHMENT.json',
            maxFileKB: Math.round(MAX_BYTES / 1024)
        },
        counts: payload.counts || {},
        audit: {
            accepted: audit.accepted,
            withPhone: audit.withPhone,
            withWeb: audit.withWeb,
            withEmail: audit.withEmail,
            withSocials: audit.withSocials,
            withGeo: audit.withGeo,
            verified: audit.verified,
            ambiguous: audit.ambiguous,
            disputedPhones: audit.disputedPhones
        },
        total: entries.length,
        parts
    };
    fs.writeFileSync(path.join(OUT_DIR, 'index.json'), JSON.stringify(manifest, null, 2), 'utf8');
    console.log(JSON.stringify({ total: entries.length, parts: parts.length, sizeMB: Number((parts.reduce((a, p) => a + p.bytes, 0) / 1048576).toFixed(2)) }, null, 2));
}

main();
