'use strict';
/**
 * ════════════════════════════════════════════════════════════════════════════════
 * WEBCRAWL_MERGE.CJS — FUSIÓN DE CONTACTO WEB PROPIO EN EL OVERLAY DE ENRIQUECIMIENTO
 * ════════════════════════════════════════════════════════════════════════════════
 * Reglas (CERO FACHADAS):
 *   1. El teléfono de Overture NUNCA se sobrescribe con el del crawl.
 *   2. Un teléfono solo se añade si no está reclamado por otro proveedor
 *      (ni en el enriquecimiento ni en las particiones Edge publicadas).
 *   3. `verified:true` SOLO con teléfono real, exclusivo, no ambiguo y con
 *      identidad de página fuerte (dominio o nombre completo).
 *   4. Cada alta deja evidencia: URL, provenance SHA-256, regla y fecha.
 *   5. Exclusividad global: un número duplicado se retira de todos sus dueños.
 *   6. Idempotente: repetir la fusión produce el mismo resultado.
 * ════════════════════════════════════════════════════════════════════════════════
 */

const fs = require('fs');
const path = require('path');
const webcrawl = require('./provider_webcrawl.cjs');

const ROOT = path.join(__dirname, '..', '..');
const DEFAULTS = {
    enrichmentPath: path.join(ROOT, 'reports', 'PROVIDER_ENRICHMENT.json'),
    crawlPath: path.join(ROOT, 'reports', 'PROVIDER_WEBCRAWL_INTEL.json'),
    edgeDir: path.join(ROOT, 'public', 'data', 'providers')
};

function digitsOf(value) {
    return webcrawl.normalizePhoneDigits(value);
}

function readJsonFile(file) {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
}

/** Universo de teléfonos ya publicados en el escaparate (exclusividad de facto). */
function loadPublishedPhones(edgeDir) {
    const claimed = new Map();
    if (!fs.existsSync(edgeDir)) return claimed;
    for (const file of fs.readdirSync(edgeDir)) {
        if (!file.endsWith('.json') || file === 'manifest.json' || file === 'html_intel.json') continue;
        let list;
        try {
            list = readJsonFile(path.join(edgeDir, file));
        } catch (err) {
            continue;
        }
        if (!Array.isArray(list)) continue;
        for (const record of list) {
            const digits = digitsOf(record.phone || record.telephone);
            if (!digits) continue;
            if (!claimed.has(digits)) {
                claimed.set(digits, { kind: 'edge', vendorId: record.vendorId ? String(record.vendorId) : '', label: `edge:${record.id || file}` });
            }
        }
    }
    return claimed;
}

function claimOwners(providers, claimed) {
    for (const [vendorId, entry] of Object.entries(providers)) {
        for (const phone of [entry.phone, ...(Array.isArray(entry.phones) ? entry.phones : [])]) {
            const digits = digitsOf(phone);
            if (!digits) continue;
            if (!claimed.has(digits)) claimed.set(digits, { kind: 'enrichment', vendorId, label: `enrichment:${vendorId}` });
        }
    }
    return claimed;
}

function isSameOwner(owner, vendorId) {
    return Boolean(owner && owner.vendorId && String(owner.vendorId) === String(vendorId));
}

function ensureEvidence(entry) {
    if (!entry.evidence || typeof entry.evidence !== 'object') {
        entry.evidence = { fields: [], dataset: 'overture', rule: 'overture' };
    }
    if (!Array.isArray(entry.evidence.fields)) entry.evidence.fields = [];
    return entry.evidence;
}

function addField(entry, field) {
    const evidence = ensureEvidence(entry);
    if (!evidence.fields.includes(field)) evidence.fields.push(field);
}

function mergeVendor(entry, intel, vendorId, claimed, stats) {
    let touched = false;
    const evidence = ensureEvidence(entry);

    if (intel.cif && !entry.cif) {
        entry.cif = String(intel.cif).toUpperCase();
        touched = true;
    }
    if (intel.razon_social && !entry.razon_social) {
        entry.razon_social = String(intel.razon_social).slice(0, 120);
        touched = true;
    }

    const crawlDigits = (Array.isArray(intel.phones) ? intel.phones : []).map(digitsOf).filter(Boolean);
    const primaryDigits = crawlDigits[0] || '';

    if (primaryDigits) {
        const existingDigits = digitsOf(entry.phone);
        if (existingDigits === primaryDigits) {
            stats.phonesAlreadyPresent++;
            if (entry.ambiguous !== true && Number(entry.confidence) >= 0.95 && !entry.disputed) {
                entry.verified = true;
            }
        } else if (existingDigits) {
            stats.phonesAlreadyPresent++;
        } else {
            const owner = claimed.get(primaryDigits);
            if (owner && !isSameOwner(owner, vendorId)) {
                stats.phonesWithheldClaimed++;
                entry.disputed = {
                    ...(entry.disputed && typeof entry.disputed === 'object' ? entry.disputed : {}),
                    webcrawl_phone: { reason: 'claimed_by_another_provider', owner: owner.label, digits: primaryDigits }
                };
            } else {
                const confidence = Number(intel.confidence_hint) || 0.95;
                const strong = intel.identity_strength === 'domain' || intel.identity_strength === 'full';
                entry.phone = intel.phone || webcrawl.formatPhone(primaryDigits);
                entry.phone_kind = intel.phone_kind || webcrawl.phoneKindOf(primaryDigits);
                entry.phones = [...new Set([entry.phone, ...(Array.isArray(intel.phones) ? intel.phones : [])])];
                entry.phone_source = 'webcrawl';
                entry.confidence = Number(Math.max(Number(entry.confidence) || 0, confidence).toFixed(3));
                entry.verified = Boolean(strong && entry.ambiguous !== true && entry.confidence >= 0.95);
                claimed.set(primaryDigits, { kind: 'enrichment', vendorId, label: `webcrawl:${vendorId}` });
                evidence.webcrawl = {
                    url: (Array.isArray(intel.source_urls) && intel.source_urls[0]) || intel.web || '',
                    provenance: intel.provenance || '',
                    identityStrength: intel.identity_strength || 'tokens',
                    provinceSignal: intel.province_signal || 'unknown',
                    retrievedAt: intel.retrieved_at || '',
                    rule: `website-direct-contact+identity-${intel.identity_strength || 'tokens'}`
                };
                addField(entry, 'phone');
                stats.phonesAdded++;
                touched = true;
            }
        }
    }

    const email = String(intel.email || '').trim().toLowerCase();
    if (email && !entry.email && !webcrawl.isBlockedEmail(email)) {
        entry.email = email;
        addField(entry, 'email');
        evidence.webcrawl_email = {
            url: (Array.isArray(intel.source_urls) && intel.source_urls[0]) || intel.web || '',
            provenance: intel.provenance || '',
            retrievedAt: intel.retrieved_at || ''
        };
        stats.emailsAdded++;
        touched = true;
    }

    for (const key of ['instagram', 'facebook', 'tiktok', 'youtube', 'linkedin']) {
        const value = String(intel[key] || '').trim();
        if (!value || entry[key]) continue;
        entry[key] = value;
        stats.socialsAdded++;
        touched = true;
    }
    return touched;
}

/** Un teléfono duplicado entre proveedores se retira de todos (exclusividad). */
function enforceExclusivity(providers) {
    const owners = new Map();
    for (const [vendorId, entry] of Object.entries(providers)) {
        const digits = digitsOf(entry.phone);
        if (!digits) continue;
        if (!owners.has(digits)) owners.set(digits, []);
        owners.get(digits).push(vendorId);
    }

    let disputed = 0;
    for (const [digits, vendorIds] of owners.entries()) {
        if (vendorIds.length <= 1) continue;
        disputed++;
        for (const vendorId of vendorIds) {
            const entry = providers[vendorId];
            entry.phone = '';
            entry.phone_kind = '';
            entry.phones = [];
            entry.verified = false;
            entry.disputed = {
                ...(entry.disputed && typeof entry.disputed === 'object' ? entry.disputed : {}),
                phone: { reason: 'shared_across_providers', owners: vendorIds.length, digits }
            };
            const evidence = ensureEvidence(entry);
            evidence.fields = evidence.fields.filter((field) => field !== 'phone');
        }
    }
    return disputed;
}

function recomputeCounts(providers) {
    const values = Object.values(providers);
    return {
        accepted: values.length,
        withPhone: values.filter((entry) => entry.phone).length,
        withWeb: values.filter((entry) => entry.web).length,
        withEmail: values.filter((entry) => entry.email).length,
        withSocials: values.filter((entry) => entry.instagram || entry.facebook || entry.tiktok || entry.youtube || entry.linkedin).length,
        withGeo: values.filter((entry) => typeof entry.lat === 'number').length,
        verified: values.filter((entry) => entry.verified === true).length,
        ambiguous: values.filter((entry) => entry.ambiguous === true).length,
        disputedPhones: new Set(
            values
                .filter((entry) => entry.disputed && entry.disputed.phone && entry.disputed.phone.digits)
                .map((entry) => entry.disputed.phone.digits)
        ).size
    };
}

/**
 * Aplica el overlay del crawl sobre el enriquecimiento Overture.
 * Devuelve estadísticas y, salvo dryRun, reescribe el overlay.
 */
function applyWebcrawlMerge(options) {
    const opts = { ...DEFAULTS, ...(options || {}) };
    if (!fs.existsSync(opts.crawlPath)) return { applied: false, reason: 'missing_crawl_intel', stats: null };
    if (!fs.existsSync(opts.enrichmentPath)) return { applied: false, reason: 'missing_enrichment', stats: null };

    const crawl = readJsonFile(opts.crawlPath);
    const payload = readJsonFile(opts.enrichmentPath);
    const providers = payload.providers && typeof payload.providers === 'object' ? payload.providers : {};

    const claimed = claimOwners(providers, loadPublishedPhones(opts.edgeDir));
    const stats = {
        crawlGeneratedAt: crawl.meta ? crawl.meta.generatedAt : '',
        vendorsConsidered: 0,
        vendorsMatched: 0,
        skippedNoVendor: 0,
        phonesAdded: 0,
        phonesAlreadyPresent: 0,
        phonesWithheldClaimed: 0,
        emailsAdded: 0,
        socialsAdded: 0,
        vendorsTouched: 0
    };

    for (const [vendorId, intel] of Object.entries(crawl.vendors || {})) {
        stats.vendorsConsidered++;
        const entry = providers[vendorId];
        if (!entry) {
            stats.skippedNoVendor++;
            continue;
        }
        stats.vendorsMatched++;
        if (mergeVendor(entry, intel, vendorId, claimed, stats)) stats.vendorsTouched++;
    }

    const verifiedBefore = Number(payload.counts && payload.counts.verified) || 0;
    const disputed = enforceExclusivity(providers);
    const counts = recomputeCounts(providers);

    payload.counts = { ...(payload.counts || {}), ...counts, disputedPhones: disputed };
    payload.meta = payload.meta && typeof payload.meta === 'object' ? payload.meta : {};
    payload.meta.webcrawl = {
        appliedAt: new Date().toISOString(),
        crawlGeneratedAt: stats.crawlGeneratedAt,
        source: path.relative(ROOT, opts.crawlPath),
        vendorsConsidered: stats.vendorsConsidered,
        vendorsMatched: stats.vendorsMatched,
        phonesAdded: stats.phonesAdded,
        phonesWithheldClaimed: stats.phonesWithheldClaimed,
        emailsAdded: stats.emailsAdded,
        socialsAdded: stats.socialsAdded,
        disputedPhones: disputed,
        verifiedBefore,
        verifiedAfter: counts.verified
    };

    if (!opts.dryRun) {
        fs.writeFileSync(opts.enrichmentPath, JSON.stringify(payload), 'utf8');
    }

    return {
        applied: true,
        written: !opts.dryRun,
        stats: { ...stats, disputedPhones: disputed, verifiedBefore, verifiedAfter: counts.verified, counts }
    };
}

module.exports = {
    applyWebcrawlMerge,
    loadPublishedPhones,
    enforceExclusivity,
    recomputeCounts,
    digitsOf
};