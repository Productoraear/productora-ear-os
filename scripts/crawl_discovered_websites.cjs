#!/usr/bin/env node
'use strict';
/**
 * ════════════════════════════════════════════════════════════════════════════════
 * CRAWL_DISCOVERED_WEBSITES.CJS — FASE 1: DEEP WEB-CRAWL DE DOMINIOS PROPIOS
 * ════════════════════════════════════════════════════════════════════════════════
 * Sobre las webs ya descubiertas por Overture Places (reports/PROVIDER_ENRICHMENT.json)
 * extrae, sin coste y sin navegador: teléfonos (tel:/wa.me/texto), emails, redes,
 * CIF y razón social del aviso legal.
 *
 * GARANTÍAS (CERO FACHADAS):
 *   - Solo atribuye contactos de páginas que CONFIRMAN la identidad del proveedor.
 *   - Descarta dominios aparcados, en venta o con identidad ajena.
 *   - Un dominio compartido por varios proveedores NO atribuye contacto a ninguno.
 *   - Un teléfono presente en varios dominios se retira de todos (conflicto global).
 *   - Respeta robots.txt (desactivable con --no-robots) y limita el volumen.
 *   - Cada dato lleva provenance SHA-256 del HTML y la URL exacta de origen.
 *   - Reanudable: caché por dominio en reports/.webcrawl_cache (idempotente).
 *
 * USO:
 *   node scripts/crawl_discovered_websites.cjs --dry-run
 *   node scripts/crawl_discovered_websites.cjs --limit=50 --concurrency=8
 *   node scripts/crawl_discovered_websites.cjs --concurrency=24 --max-pages=4
 *   node scripts/crawl_discovered_websites.cjs --categories=foto,finca --refresh
 *   node scripts/crawl_discovered_websites.cjs --no-robots --no-tls-fallback
 *
 * SALIDAS:
 *   reports/PROVIDER_WEBCRAWL_INTEL.json
 *   reports/PROVIDER_WEBCRAWL_AUDIT.json
 *   reports/PROVIDER_WEBCRAWL_SUMMARY.md
 * ════════════════════════════════════════════════════════════════════════════════
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
const crypto = require('crypto');
const webcrawl = require('./lib/provider_webcrawl.cjs');

const ROOT = path.join(__dirname, '..');
const REPORTS = path.join(ROOT, 'reports');
const ENRICHMENT = path.join(REPORTS, 'PROVIDER_ENRICHMENT.json');
const CACHE_DIR = path.join(REPORTS, '.webcrawl_cache');
const OUT = path.join(REPORTS, 'PROVIDER_WEBCRAWL_INTEL.json');
const AUDIT = path.join(REPORTS, 'PROVIDER_WEBCRAWL_AUDIT.json');
const SUMMARY = path.join(REPORTS, 'PROVIDER_WEBCRAWL_SUMMARY.md');

const USER_AGENT = 'EAROSProviderBot/1.0 (+https://productoraear.com/proveedores; contacto comercial)';
const EXTRA_PATHS = ['/contacto', '/aviso-legal', '/donde-estamos', '/contacto/', '/aviso-legal/'];
const TLS_CODES = new Set([
    'UNABLE_TO_VERIFY_LEAF_SIGNATURE', 'SELF_SIGNED_CERT_IN_CHAIN', 'DEPTH_ZERO_SELF_SIGNED_CERT',
    'CERT_HAS_EXPIRED', 'ERR_TLS_CERT_ALTNAME_INVALID', 'UNABLE_TO_GET_ISSUER_CERT_LOCALLY'
]);

const args = process.argv.slice(2);
const has = (flag) => args.includes(flag);
const valueOf = (prefix, fallback) => {
    const found = args.find((a) => a.startsWith(prefix));
    return found ? found.slice(prefix.length) : fallback;
};

const DRY_RUN = has('--dry-run');
const REFRESH = has('--refresh');
const RESPECT_ROBOTS = !has('--no-robots');
const TLS_FALLBACK = !has('--no-tls-fallback');
const VERBOSE = has('--verbose');
const LIMIT = Number(valueOf('--limit=', '0')) || 0;
const CONCURRENCY = Math.max(1, Math.min(64, Number(valueOf('--concurrency=', '24')) || 24));
const TIMEOUT_MS = Math.max(1500, Number(valueOf('--timeout=', '6000')) || 6000);
const MAX_PAGES = Math.max(1, Math.min(8, Number(valueOf('--max-pages=', '4')) || 4));
const MAX_BYTES = Math.max(120000, Number(valueOf('--max-bytes=', '1500000')) || 1500000);
const ONLY_CATEGORIES = valueOf('--categories=', '').split(',').map((s) => s.trim()).filter(Boolean);
const OUT_PATH = path.resolve(ROOT, valueOf('--out=', OUT));

function log(...parts) {
    console.log('[WEBCRAWL]', ...parts);
}

function readJson(file) {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function ensureDir(dir) {
    fs.mkdirSync(dir, { recursive: true });
}

/* ───────────────────────────── CAPA HTTP ───────────────────────────── */

function detectCharset(buffer, contentType) {
    const head = buffer.subarray(0, 2048).toString('latin1');
    const metaMatch = /<meta[^>]+charset\s*=\s*["']?([\w-]+)/i.exec(head);
    const headerMatch = /charset\s*=\s*["']?([\w-]+)/i.exec(String(contentType || ''));
    const charset = (headerMatch ? headerMatch[1] : metaMatch ? metaMatch[1] : 'utf-8').toLowerCase();
    if (charset === 'iso-8859-1' || charset === 'latin1' || charset === 'latin-1') return 'windows-1252';
    return charset;
}

function decodeBody(buffer, contentType) {
    const charset = detectCharset(buffer, contentType);
    try {
        return { html: new TextDecoder(charset).decode(buffer), charset };
    } catch (err) {
        return { html: buffer.toString('utf8'), charset: 'utf-8' };
    }
}

function isHtmlResponse(contentType) {
    const type = String(contentType || '').toLowerCase();
    if (!type) return true;
    return type.includes('text/html') || type.includes('application/xhtml') || type.includes('text/plain');
}

function isTlsFailure(error) {
    const code = error && (error.code || (error.cause && error.cause.code));
    if (code && TLS_CODES.has(code)) return true;
    const message = String((error && error.message) || '');
    return /certificate|self signed|unable to verify/i.test(message);
}

async function readCapped(response, maxBytes) {
    const declared = Number(response.headers.get('content-length') || 0);
    if (declared > maxBytes * 3) return Buffer.alloc(0);
    const buffer = Buffer.from(await response.arrayBuffer());
    return buffer.subarray(0, maxBytes);
}

/** GET estricto (fetch nativo). El fallo TLS se propaga para decidir fallback. */
async function fetchStrict(url, timeoutMs, maxBytes) {
    const response = await fetch(url, {
        redirect: 'follow',
        signal: AbortSignal.timeout(timeoutMs),
        headers: {
            'user-agent': USER_AGENT,
            accept: 'text/html,application/xhtml+xml;q=0.9,*/*;q=0.5',
            'accept-language': 'es-ES,es;q=0.9'
        }
    });
    const contentType = response.headers.get('content-type') || '';
    if (!isHtmlResponse(contentType)) {
        return { ok: response.ok, status: response.status, url: response.url, html: '', bytes: 0, charset: '', contentType, tlsLenient: false, skipped: 'non_html' };
    }
    const buffer = await readCapped(response, maxBytes);
    const decoded = decodeBody(buffer, contentType);
    return {
        ok: response.ok,
        status: response.status,
        url: response.url,
        html: decoded.html,
        bytes: buffer.length,
        charset: decoded.charset,
        contentType,
        tlsLenient: false,
        skipped: ''
    };
}

async function fetchPage(url, stats) {
    const started = Date.now();
    try {
        const result = await fetchStrict(url, TIMEOUT_MS, MAX_BYTES);
        stats.fetched++;
        stats.msTotal += Date.now() - started;
        if (result.ok && result.html) stats.ok++;
        return result;
    } catch (error) {
        if (TLS_FALLBACK && isTlsFailure(error)) {
            try {
                const result = await httpsGetLenient(url, TIMEOUT_MS, MAX_BYTES, 0);
                stats.fetched++;
                stats.tlsFallback++;
                stats.msTotal += Date.now() - started;
                if (result.ok && result.html) stats.ok++;
                return result;
            } catch (fallbackError) {
                stats.errors++;
                return { ok: false, status: 0, url, html: '', bytes: 0, charset: '', contentType: '', tlsLenient: true, skipped: '', error: String(fallbackError.message || fallbackError).slice(0, 120) };
            }
        }
        stats.errors++;
        const code = (error && (error.code || (error.cause && error.cause.code))) || '';
        return { ok: false, status: 0, url, html: '', bytes: 0, charset: '', contentType: '', tlsLenient: false, skipped: '', error: `${code || 'fetch_error'}:${String((error && error.message) || '').slice(0, 80)}` };
    }
}

/**
 * GET tolerante usado SOLO cuando el certificado del dominio público está roto.
 * No se usa para credenciales ni APIs: únicamente HTML público de escaparate.
 */
function httpsGetLenient(url, timeoutMs, maxBytes, redirects) {
    const hops = redirects == null ? 0 : redirects;
    return new Promise((resolve, reject) => {
        if (hops > 5) {
            reject(new Error('too_many_redirects'));
            return;
        }
        let settled = false;
        let request;
        const timer = setTimeout(() => {
            if (settled) return;
            settled = true;
            if (request) {
                try { request.destroy(); } catch (_) {}
            }
            reject(new Error('timeout'));
        }, timeoutMs);

        const done = (fn, arg) => {
            if (settled) return;
            settled = true;
            clearTimeout(timer);
            fn(arg);
        };

        const client = String(url).startsWith('https:') ? https : http;
        request = client.get(url, {
            timeout: timeoutMs,
            rejectUnauthorized: false,
            headers: {
                'user-agent': USER_AGENT,
                accept: 'text/html,application/xhtml+xml;q=0.9,*/*;q=0.5',
                'accept-language': 'es-ES,es;q=0.9',
                'accept-encoding': 'identity'
            }
        }, (response) => {
            const status = response.statusCode || 0;
            const location = response.headers.location;
            if (status >= 300 && status < 400 && location) {
                response.resume();
                clearTimeout(timer);
                settled = true;
                try {
                    const next = new URL(location, url).toString();
                    httpsGetLenient(next, timeoutMs, maxBytes, hops + 1).then(resolve, reject);
                } catch (err) {
                    reject(err);
                }
                return;
            }
            const contentType = String(response.headers['content-type'] || '');
            if (!isHtmlResponse(contentType)) {
                response.resume();
                done(resolve, { ok: status >= 200 && status < 300, status, url, html: '', bytes: 0, charset: '', contentType, tlsLenient: true, skipped: 'non_html' });
                return;
            }
            const chunks = [];
            let total = 0;
            response.on('data', (chunk) => {
                total += chunk.length;
                if (total > maxBytes) {
                    response.destroy();
                    return;
                }
                chunks.push(chunk);
            });
            response.on('end', () => {
                const buffer = Buffer.concat(chunks).subarray(0, maxBytes);
                const decoded = decodeBody(buffer, contentType);
                done(resolve, { ok: status >= 200 && status < 300, status, url, html: decoded.html, bytes: buffer.length, charset: decoded.charset, contentType, tlsLenient: true, skipped: '' });
            });
            response.on('error', (err) => done(reject, err));
        });
        request.on('timeout', () => {
            if (request) {
                try { request.destroy(); } catch (_) {}
            }
            done(reject, new Error('timeout'));
        });
        request.on('error', (err) => done(reject, err));
    });
}

/* ───────────────────────────── ROBOTS.TXT ───────────────────────────── */

function parseRobots(text) {
    const groups = [];
    let current = null;
    let lastWasAgent = false;
    for (const line of String(text || '').split(/\r?\n/)) {
        const clean = line.replace(/#.*$/, '').trim();
        if (!clean) continue;
        const match = /^([A-Za-z-]+)\s*:\s*(.*)$/.exec(clean);
        if (!match) continue;
        const key = match[1].toLowerCase();
        const value = match[2].trim();
        if (key === 'user-agent') {
            if (!current || !lastWasAgent) {
                current = { agents: [], rules: [] };
                groups.push(current);
            }
            current.agents.push(value.toLowerCase());
            lastWasAgent = true;
            continue;
        }
        lastWasAgent = false;
        if ((key === 'allow' || key === 'disallow') && current && value) {
            current.rules.push({ allow: key === 'allow', path: value });
        }
    }
    const rules = [];
    for (const group of groups) {
        if (group.agents.includes('*') || group.agents.some((a) => a.includes('earos'))) {
            rules.push(...group.rules);
        }
    }
    return rules;
}

function robotsPatternToRegex(pattern) {
    const escaped = pattern.replace(/[.+^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*');
    return new RegExp(`^${escaped}`);
}

function isAllowedByRobots(rules, pathname) {
    if (!rules || rules.length === 0) return true;
    let best = null;
    for (const rule of rules) {
        if (!robotsPatternToRegex(rule.path).test(pathname)) continue;
        if (!best || rule.path.length > best.path.length) best = rule;
    }
    return best ? best.allow : true;
}

/* ───────────────────────────── OBJETIVOS Y CACHÉ ───────────────────────────── */

function buildTargets(enrichment) {
    const entries = Object.values(enrichment.providers || {});
    const byDomain = new Map();
    const stats = { providers: entries.length, withWeb: 0, unusableWeb: 0, marketplaceWeb: 0 };

    for (const entry of entries) {
        const web = webcrawl.normalizeUrl(entry.web || '');
        if (!web) continue;
        stats.withWeb++;
        const host = webcrawl.hostOf(web);
        const domain = webcrawl.registrableDomain(host);
        if (!domain || webcrawl.isMarketplaceHost(host)) {
            stats.marketplaceWeb++;
            continue;
        }
        const category = String(entry.provider_category || '');
        if (ONLY_CATEGORIES.length > 0 && !ONLY_CATEGORIES.includes(category)) continue;
        if (!entry.name) {
            stats.unusableWeb++;
            continue;
        }
        if (!byDomain.has(domain)) byDomain.set(domain, []);
        byDomain.get(domain).push({
            vendorId: String(entry.vendorId),
            name: String(entry.name),
            category,
            province: String(entry.province || ''),
            web
        });
    }

    const domains = [...byDomain.entries()]
        .map(([domain, vendors]) => ({ domain, vendors }))
        .sort((a, b) => a.domain.localeCompare(b.domain));

    return { domains, stats };
}

function cachePathFor(domain) {
    return path.join(CACHE_DIR, `${domain.replace(/[^a-z0-9.-]/g, '_')}.json`);
}

function readCache(domain) {
    const file = cachePathFor(domain);
    if (!fs.existsSync(file)) return null;
    try {
        const payload = readJson(file);
        if (!payload || payload.domain !== domain || !payload.record) return null;
        return payload.record;
    } catch (err) {
        return null;
    }
}

function writeCache(domain, record) {
    ensureDir(CACHE_DIR);
    const payload = { domain, cachedAt: new Date().toISOString(), record };
    fs.writeFileSync(cachePathFor(domain), JSON.stringify(payload), 'utf8');
}

function pagePathsFor(vendor) {
    const base = webcrawl.normalizeUrl(vendor.web);
    const origin = new URL(base).origin;
    const seen = new Set();
    const urls = [];
    const push = (raw) => {
        try {
            const url = new URL(raw);
            const key = `${url.pathname.replace(/\/+$/, '') || '/'}${url.search}`;
            if (seen.has(key)) return;
            seen.add(key);
            urls.push(url.toString());
        } catch (err) {
            /* URL inválida: se ignora. */
        }
    };
    push(base);
    for (const extra of EXTRA_PATHS) push(`${origin}${extra}`);
    return urls.slice(0, MAX_PAGES);
}

function sourceWeight(source) {
    if (source === 'tel_href') return 0;
    if (source === 'whatsapp') return 1;
    if (source === 'page_text') return 2;
    return 3;
}

/* ───────────────────────────── CRAWL POR DOMINIO ───────────────────────────── */

function emptyDomainRecord(domain, status, vendors, reason) {
    return {
        domain,
        status,
        reason: reason || '',
        vendors,
        contactsWithheld: true,
        pagesTried: 0,
        pagesOk: 0,
        robotsBlocked: 0,
        phones: [],
        whatsapp: [],
        emails: [],
        socials: {},
        cif: '',
        razonSocial: '',
        identityVerified: false,
        identityStrength: 'none',
        provinceSignal: 'unknown',
        provenance: '',
        primaryUrl: '',
        tlsLenient: false,
        updatedAt: new Date().toISOString()
    };
}

async function fetchDomainPages(target, stats) {
    const { domain, vendors } = target;
    const vendor = vendors[0];
    const origin = new URL(vendor.web).origin;
    let robotsRules = [];
    if (RESPECT_ROBOTS) {
        const robots = await fetchPage(`${origin}/robots.txt`, stats);
        if (robots.ok && robots.html) robotsRules = parseRobots(robots.html);
    }

    const pages = [];
    for (const url of pagePathsFor(vendor)) {
        let pathname = '/';
        try {
            pathname = new URL(url).pathname || '/';
        } catch (err) {
            pages.push({ url, status: 'invalid_url' });
            continue;
        }
        if (RESPECT_ROBOTS && !isAllowedByRobots(robotsRules, pathname)) {
            pages.push({ url, status: 'robots_disallowed' });
            continue;
        }
        const response = await fetchPage(url, stats);
        if (!response.ok || !response.html) {
            pages.push({ url, status: response.error || `http_${response.status}` });
            continue;
        }
        const intel = webcrawl.extractPageIntel({
            html: response.html,
            url: response.url || url,
            providerName: vendor.name,
            domain,
            province: vendor.province
        });
        pages.push({
            url,
            finalUrl: response.url || url,
            status: 'ok',
            bytes: response.bytes,
            charset: response.charset,
            tlsLenient: response.tlsLenient,
            usable: Boolean(intel.identity.confirmed && !intel.parked),
            intel
        });
    }
    return pages;
}

function summarizePages(pages) {
    return pages.map((page) => ({
        url: page.url,
        status: page.status,
        usable: page.usable === true,
        provenance: page.intel ? page.intel.provenance : '',
        textLength: page.intel ? page.intel.textLength : 0,
        phones: page.intel ? page.intel.phones.digits.length : 0,
        tlsLenient: page.tlsLenient === true
    }));
}

function mergePhones(usablePages) {
    const candidates = [];
    for (const page of usablePages) {
        const { digits, sources } = page.intel.phones;
        digits.forEach((value, index) => {
            candidates.push({
                digits: value,
                source: sources[index] || 'page_text',
                url: page.finalUrl || page.url,
                provenance: page.intel.provenance,
                provinceSignal: page.intel.provinceSignal
            });
        });
    }
    candidates.sort((a, b) => sourceWeight(a.source) - sourceWeight(b.source));
    const seen = new Set();
    const unique = [];
    for (const candidate of candidates) {
        if (seen.has(candidate.digits)) continue;
        seen.add(candidate.digits);
        unique.push(candidate);
    }
    return unique.slice(0, 3);
}

function mergeEmails(usablePages, domain) {
    const candidates = [];
    for (const page of usablePages) {
        for (const email of page.intel.emails) {
            const emailDomain = email.split('@')[1] || '';
            candidates.push({
                email,
                url: page.finalUrl || page.url,
                provenance: page.intel.provenance,
                domainMatch: emailDomain === domain || emailDomain.endsWith(`.${domain}`)
            });
        }
    }
    candidates.sort((a, b) => Number(b.domainMatch) - Number(a.domainMatch));
    const seen = new Set();
    const unique = [];
    for (const candidate of candidates) {
        if (seen.has(candidate.email)) continue;
        seen.add(candidate.email);
        unique.push(candidate);
    }
    return unique.slice(0, 2);
}

function mergeSocials(usablePages) {
    const merged = {};
    for (const page of usablePages) {
        for (const [kind, url] of Object.entries(page.intel.socials)) {
            if (!merged[kind]) merged[kind] = url;
        }
    }
    return merged;
}

function pickLegalIdentity(usablePages) {
    const legalFirst = [...usablePages].sort((a, b) => {
        const score = (page) => (/aviso-legal|legal|privacidad/i.test(page.url) ? 0 : 1);
        return score(a) - score(b);
    });
    let cif = '';
    let razonSocial = '';
    for (const page of legalFirst) {
        if (!cif && page.intel.cif) cif = page.intel.cif;
        if (!razonSocial && page.intel.razonSocial) razonSocial = page.intel.razonSocial;
    }
    return { cif, razonSocial };
}

async function crawlDomain(target, stats) {
    const { domain, vendors } = target;
    if (vendors.length > 1) {
        return emptyDomainRecord(
            domain,
            'shared_domain',
            vendors.map((v) => ({ vendorId: v.vendorId, name: v.name, category: v.category })),
            'domain_shared_by_multiple_providers'
        );
    }

    const pages = await fetchDomainPages(target, stats);
    const usablePages = pages.filter((page) => page.usable);
    const record = emptyDomainRecord(domain, 'ok', [{ vendorId: vendors[0].vendorId, name: vendors[0].name, category: vendors[0].category }], '');
    record.pagesTried = pages.length;
    record.pagesOk = pages.filter((page) => page.status === 'ok').length;
    record.robotsBlocked = pages.filter((page) => page.status === 'robots_disallowed').length;
    record.pages = summarizePages(pages);
    record.tlsLenient = pages.some((page) => page.tlsLenient === true);

    if (usablePages.length === 0) {
        const parked = pages.some((page) => page.intel && page.intel.parked);
        record.status = parked ? 'parked' : 'identity_unconfirmed';
        record.reason = parked ? 'parked_or_for_sale_domain' : 'page_does_not_confirm_provider_identity';
        return record;
    }

    const phones = mergePhones(usablePages);
    const emails = mergeEmails(usablePages, domain);
    const socials = mergeSocials(usablePages);
    const legal = pickLegalIdentity(usablePages);
    const primary = phones[0] || null;
    const whatsapp = [...new Set(usablePages.flatMap((page) => page.intel.phones.whatsapp))].slice(0, 3);

    record.contactsWithheld = false;
    record.phones = phones;
    record.whatsapp = whatsapp;
    record.emails = emails;
    record.socials = socials;
    record.cif = legal.cif;
    record.razonSocial = legal.razonSocial;
    record.identityVerified = usablePages.some((page) => page.intel.identity.nameConfirmed === true) || Boolean(legal.cif);
    record.provinceSignal = primary ? primary.provinceSignal : usablePages[0].intel.provinceSignal;
    record.provenance = primary ? primary.provenance : usablePages[0].intel.provenance;
    record.primaryUrl = primary ? primary.url : (usablePages[0].finalUrl || usablePages[0].url);
    record.identityStrength = usablePages.some((page) => page.intel.identity.strength === 'domain')
        ? 'domain'
        : usablePages.some((page) => page.intel.identity.strength === 'full') ? 'full' : 'tokens';

    if (record.identityStrength === 'tokens') {
        const corroborated = record.provinceSignal === 'match' || Boolean(record.cif);
        if (!corroborated) {
            record.phones = [];
            record.phoneWithheld = 'weak_identity_requires_province_or_cif';
            record.confidenceHint = 0;
        } else {
            record.confidenceHint = primary ? 0.94 : 0;
        }
    } else {
        record.confidenceHint = primary
            ? (primary.source === 'tel_href' ? 0.97 : primary.source === 'whatsapp' ? 0.96 : 0.95)
            : 0;
    }
    if (phones.length === 0 && emails.length === 0 && Object.keys(socials).length === 0) {
        record.status = 'ok_no_contact';
    }
    return record;
}

/* ───────────────────────────── ORQUESTACIÓN ───────────────────────────── */

let STOP_REQUESTED = false;

async function runPool(items, worker, concurrency) {
    let index = 0;
    const size = Math.min(concurrency, items.length);
    const workers = [];
    for (let slot = 0; slot < size; slot++) {
        workers.push((async () => {
            while (!STOP_REQUESTED) {
                const current = index++;
                if (current >= items.length) return;
                await worker(items[current], current);
            }
        })());
    }
    await Promise.all(workers);
}

async function processDomain(target, ctx) {
    let record;
    try {
        record = await crawlDomain(target, ctx.stats);
    } catch (error) {
        record = emptyDomainRecord(
            target.domain,
            'crawl_error',
            target.vendors.map((v) => ({ vendorId: v.vendorId, name: v.name })),
            String((error && error.message) || error).slice(0, 140)
        );
    }
    writeCache(target.domain, record);
    ctx.done++;
    if (ctx.done % 25 === 0 || ctx.done === ctx.total) {
        const elapsed = (Date.now() - ctx.startedAt) / 1000;
        const rate = ctx.done / Math.max(elapsed, 0.001);
        const eta = rate > 0 ? Math.round((ctx.total - ctx.done) / rate) : 0;
        log(`${ctx.done}/${ctx.total} dominios · ${ctx.stats.fetched} GET · ${ctx.stats.errors} errores · ${record.phones.length} tel · ETA ${eta}s`);
    }
    return record;
}

/**
 * Un teléfono presente en más de un dominio no se atribuye a nadie.
 * Devuelve el mapa de conflictos y limpia los registros afectados.
 */
function resolvePhoneConflicts(records) {
    const owners = new Map();
    for (const record of records) {
        for (const phone of record.phones || []) {
            if (!owners.has(phone.digits)) owners.set(phone.digits, []);
            if (!owners.get(phone.digits).includes(record.domain)) owners.get(phone.digits).push(record.domain);
        }
    }
    const disputed = new Map();
    for (const [digits, domains] of owners.entries()) {
        if (domains.length > 1) disputed.set(digits, domains);
    }
    if (disputed.size === 0) return disputed;

    for (const record of records) {
        const before = record.phones || [];
        const kept = before.filter((phone) => !disputed.has(phone.digits));
        if (kept.length !== before.length) {
            record.phones = kept;
            record.phoneConflict = true;
        }
    }
    return disputed;
}

function buildVendors(records) {
    const vendors = {};
    for (const record of records) {
        if (record.contactsWithheld) continue;
        if (!Array.isArray(record.vendors) || record.vendors.length !== 1) continue;
        const vendor = record.vendors[0];
        const primary = (record.phones || [])[0] || null;
        const phones = (record.phones || []).map((p) => webcrawl.formatPhone(p.digits));
        const emails = (record.emails || []).map((e) => e.email);
        const sourceUrls = [...new Set(
            (record.emails || []).map((e) => e.url).concat(record.primaryUrl ? [record.primaryUrl] : [])
        )].slice(0, 4);
        vendors[vendor.vendorId] = {
            vendorId: vendor.vendorId,
            name: vendor.name,
            domain: record.domain,
            web: `https://${record.domain}`,
            phone: primary ? webcrawl.formatPhone(primary.digits) : '',
            phone_kind: primary ? webcrawl.phoneKindOf(primary.digits) : '',
            phone_source: primary ? primary.source : '',
            phones,
            whatsapp: (record.whatsapp || []).map((value) => (/^\d{8,15}$/.test(value) ? webcrawl.formatPhone(value) : value)),
            email: emails[0] || '',
            emails,
            instagram: record.socials.instagram || '',
            facebook: record.socials.facebook || '',
            tiktok: record.socials.tiktok || '',
            youtube: record.socials.youtube || '',
            linkedin: record.socials.linkedin || '',
            cif: record.cif || '',
            razon_social: record.razonSocial || '',
            identity_verified: record.identityVerified === true,
            identity_strength: record.identityStrength || 'none',
            phone_withheld: record.phoneWithheld || '',
            province_signal: record.provinceSignal || 'unknown',
            provenance: record.provenance || '',
            source_urls: sourceUrls,
            confidence_hint: record.confidenceHint || 0,
            tls_lenient: record.tlsLenient === true,
            retrieved_at: record.updatedAt
        };
    }
    return vendors;
}

function sortObjectByKey(source) {
    const out = {};
    for (const key of Object.keys(source).sort()) out[key] = source[key];
    return out;
}

function buildCounts(records, targets, targetStats, crawlStats, disputed, vendors) {
    const statuses = {};
    for (const record of records) statuses[record.status] = (statuses[record.status] || 0) + 1;
    const vendorList = Object.values(vendors);
    return {
        providersEvaluated: targetStats.providers,
        providersWithWeb: targetStats.withWeb,
        marketplaceWebsSkipped: targetStats.marketplaceWeb,
        domainsTargeted: targets.length,
        domainsCrawled: records.length,
        domainsSharedWithheld: statuses.shared_domain || 0,
        domainsIdentityUnconfirmed: statuses.identity_unconfirmed || 0,
        domainsParked: statuses.parked || 0,
        domainsNoContact: statuses.ok_no_contact || 0,
        domainsWithContact: vendorList.filter((v) => v.phone || v.email || v.instagram || v.facebook).length,
        httpRequests: crawlStats.fetched,
        httpOk: crawlStats.ok,
        httpErrors: crawlStats.errors,
        tlsFallbackUsed: crawlStats.tlsFallback,
        phonesFound: vendorList.filter((v) => v.phone).length,
        whatsappFound: vendorList.filter((v) => v.whatsapp.length > 0).length,
        emailsFound: vendorList.filter((v) => v.email).length,
        socialsFound: vendorList.filter((v) => v.instagram || v.facebook || v.tiktok || v.youtube || v.linkedin).length,
        cifFound: vendorList.filter((v) => v.cif).length,
        razonSocialFound: vendorList.filter((v) => v.razon_social).length,
        disputedPhones: disputed.size,
        statusDistribution: statuses
    };
}

function writeSummary(meta, counts, audit) {
    const lines = [
        '# FASE 1 — Deep web-crawl de dominios propios',
        '',
        `Generado: ${meta.generatedAt}`,
        `Fuente: \`reports/PROVIDER_ENRICHMENT.json\` (${meta.dataset})`,
        '',
        '| Métrica | Valor |',
        '|---|---:|',
        `| Proveedores evaluados | ${counts.providersEvaluated} |`,
        `| Webs descubiertas | ${counts.providersWithWeb} |`,
        `| Dominios objetivo | ${counts.domainsTargeted} |`,
        `| Dominios rastreados | ${counts.domainsCrawled} |`,
        `| Dominios con contacto | ${counts.domainsWithContact} |`,
        `| **Teléfonos reales** | **${counts.phonesFound}** |`,
        `| WhatsApps | ${counts.whatsappFound} |`,
        `| Emails | ${counts.emailsFound} |`,
        `| Redes sociales | ${counts.socialsFound} |`,
        `| CIF válidos (checksum) | ${counts.cifFound} |`,
        `| Razón social | ${counts.razonSocialFound} |`,
        `| Dominios compartidos (contacto retenido) | ${counts.domainsSharedWithheld} |`,
        `| Identidad no confirmada | ${counts.domainsIdentityUnconfirmed} |`,
        `| Dominios aparcados / en venta | ${counts.domainsParked} |`,
        `| Teléfonos en conflicto (retirados) | ${counts.disputedPhones} |`,
        `| Peticiones HTTP | ${counts.httpRequests} (${counts.httpOk} OK, ${counts.httpErrors} errores) |`,
        `| Fallback TLS (cadena rota) | ${counts.tlsFallbackUsed} |`,
        '',
        '## Distribución de estados',
        '',
        ...Object.entries(audit.statusDistribution).sort((a, b) => b[1] - a[1]).map(([status, n]) => `- \`${status}\`: ${n}`),
        '',
        '## Por gremio',
        '',
        '| Gremio | Proveedores con teléfono |',
        '|---|---:|',
        ...Object.entries(audit.byCategory).sort((a, b) => (b[1].phone || 0) - (a[1].phone || 0)).map(([cat, info]) => `| ${cat} | ${info.phone || 0} / ${info.providers || 0} |`),
        '',
        '> Doctrina: solo se atribuye contacto cuando la página confirma la identidad del proveedor.',
        '> Dominios compartidos, aparcados o con identidad ajena no publican contacto. Un teléfono',
        '> presente en dos dominios se retira de ambos. Cada dato lleva `provenance` SHA-256 y URL de origen.',
        ''
    ];
    fs.writeFileSync(SUMMARY, `${lines.join('\n')}\n`, 'utf8');
}

/* ──────────────────────────────── MAIN ──────────────────────────────── */

function buildAudit(meta, counts, records, disputed) {
    const byCategory = {};
    for (const record of records) {
        if (record.contactsWithheld) continue;
        const vendor = (record.vendors || [])[0];
        if (!vendor) continue;
        const category = vendor.category || 'desconocido';
        if (!byCategory[category]) byCategory[category] = { providers: 0, phone: 0, email: 0 };
        byCategory[category].providers++;
        if ((record.phones || []).length) byCategory[category].phone++;
        if ((record.emails || []).length) byCategory[category].email++;
    }
    return {
        meta,
        counts,
        statusDistribution: counts.statusDistribution,
        byCategory,
        domainsWithPhoneConflict: records.filter((record) => record.phoneConflict === true).length,
        disputedPhones: [...disputed.entries()].slice(0, 25).map(([digits, domains]) => ({
            phone: webcrawl.formatPhone(digits),
            domains
        }))
    };
}

async function collectTargets() {
    const enrichment = readJson(ENRICHMENT);
    const { domains, stats } = buildTargets(enrichment);
    const sharedCount = domains.filter((target) => target.vendors.length > 1).length;
    log(`Proveedores: ${stats.providers} · con web: ${stats.withWeb} · dominios únicos: ${domains.length} · compartidos: ${sharedCount}`);
    if (domains.length === 0) {
        console.error('❌ Sin dominios objetivo (¿filtro de categorías demasiado estricto?).');
        process.exit(1);
    }
    return { enrichment, domains, stats, sharedCount };
}

function printDryRun(domains, stats, sharedCount) {
    const categories = {};
    for (const target of domains) {
        for (const vendor of target.vendors) {
            const key = vendor.category || 'desconocido';
            categories[key] = (categories[key] || 0) + 1;
        }
    }
    console.log(JSON.stringify({
        dryRun: true,
        domains: domains.length,
        sharedDomains: sharedCount,
        marketplaceWebsSkipped: stats.marketplaceWeb,
        categories,
        limit: LIMIT,
        concurrency: CONCURRENCY,
        maxPages: MAX_PAGES,
        timeoutMs: TIMEOUT_MS,
        respectRobots: RESPECT_ROBOTS,
        sample: domains.slice(0, 5).map((target) => ({
            domain: target.domain,
            vendorId: target.vendors[0].vendorId,
            name: target.vendors[0].name
        }))
    }, null, 2));
}

async function main() {
    if (!fs.existsSync(ENRICHMENT)) {
        console.error(`❌ No existe ${path.relative(ROOT, ENRICHMENT)}. Ejecuta antes el enriquecimiento Overture.`);
        process.exit(1);
    }

    const { enrichment, domains, stats, sharedCount } = await collectTargets();
    if (DRY_RUN) {
        printDryRun(domains, stats, sharedCount);
        return;
    }

    ensureDir(CACHE_DIR);
    ensureDir(REPORTS);

    const records = new Map();
    for (const target of domains) {
        const cached = REFRESH ? null : readCache(target.domain);
        if (cached) records.set(target.domain, cached);
    }
    const pending = domains.filter((target) => !records.has(target.domain));
    const batch = LIMIT > 0 ? pending.slice(0, LIMIT) : pending;
    log(`Caché: ${records.size} dominios · pendientes: ${pending.length} · lote actual: ${batch.length} · concurrencia: ${CONCURRENCY}`);

    const ctx = { stats: { fetched: 0, ok: 0, errors: 0, tlsFallback: 0, msTotal: 0 }, done: 0, total: batch.length, startedAt: Date.now() };
    await runPool(batch, async (target) => { await processDomain(target, ctx); }, CONCURRENCY);

    for (const target of batch) {
        const record = readCache(target.domain);
        if (record) records.set(target.domain, record);
    }

    const ordered = [...records.values()].sort((a, b) => a.domain.localeCompare(b.domain));
    const disputed = resolvePhoneConflicts(ordered);
    const vendors = sortObjectByKey(buildVendors(ordered));
    const counts = buildCounts(ordered, domains, stats, ctx.stats, disputed, vendors);
    counts.domainsFromCache = Math.max(0, records.size - batch.length);

    const meta = {
        generatedAt: new Date().toISOString(),
        source: 'reports/PROVIDER_ENRICHMENT.json',
        dataset: enrichment.dataset || 'overture',
        license: enrichment.license || 'CDLA-Permissive-2.0',
        userAgent: USER_AGENT,
        concurrency: CONCURRENCY,
        timeoutMs: TIMEOUT_MS,
        maxPagesPerDomain: MAX_PAGES,
        respectRobots: RESPECT_ROBOTS,
        tlsFallbackEnabled: TLS_FALLBACK,
        cacheDir: 'reports/.webcrawl_cache',
        doctrine: 'Contacto solo con identidad de página confirmada; dominios compartidos/aparcados y teléfonos en conflicto no publican contacto.',
        intelSha256: webcrawl.sha256(JSON.stringify(vendors))
    };
    const audit = buildAudit(meta, counts, ordered, disputed);

    fs.writeFileSync(OUT_PATH, JSON.stringify({
        meta,
        counts,
        domains: sortObjectByKey(Object.fromEntries(ordered.map((record) => [record.domain, record]))),
        vendors
    }), 'utf8');
    fs.writeFileSync(AUDIT, JSON.stringify(audit, null, 2), 'utf8');
    writeSummary(meta, counts, audit);

    console.log(JSON.stringify({
        dominios: counts.domainsCrawled,
        conContacto: counts.domainsWithContact,
        telefonos: counts.phonesFound,
        whatsapp: counts.whatsappFound,
        emails: counts.emailsFound,
        redes: counts.socialsFound,
        cif: counts.cifFound,
        compartidosRetenidos: counts.domainsSharedWithheld,
        identidadNoConfirmada: counts.domainsIdentityUnconfirmed,
        aparcados: counts.domainsParked,
        conflictosTelefono: counts.disputedPhones,
        peticiones: counts.httpRequests,
        errores: counts.httpErrors,
        fallbackTls: counts.tlsFallbackUsed,
        segundos: Math.round((Date.now() - ctx.startedAt) / 1000)
    }, null, 2));
    log(`Salida: ${path.relative(ROOT, OUT_PATH)} · ${Object.keys(vendors).length} proveedores enriquecidos`);
}

process.on('SIGINT', () => {
    if (STOP_REQUESTED) process.exit(130);
    STOP_REQUESTED = true;
    log('Interrupción solicitada: se cierra el dominio en curso y se guardan los resultados parciales...');
});

main().catch((error) => {
    console.error('❌ Error fatal en el crawler:', error && error.stack ? error.stack : error);
    process.exit(1);
});
