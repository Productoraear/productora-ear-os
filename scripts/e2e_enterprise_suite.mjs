#!/usr/bin/env node
/**
 * EAR_OS_V2 — Independent Opaque-Box 4-Tier Enterprise E2E Suite
 *
 * Pure Node ESM using built-in modules ONLY (zero src/ imports, zero npm deps).
 * Implements 102 requirement-driven tests across Tiers 1–4 for F1–F7 + R6.
 *
 * CLI:
 *   node scripts/e2e_enterprise_suite.mjs --mode=live|offline --base-url=http://127.0.0.1:3007 --tier=1|2|3|4|all --timeout=10000 [--json]
 */

import http from 'node:http';
import https from 'node:https';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, '..');

// ---------------------------------------------------------------------------
// Authoritative Canonical Constants (from ORIGINAL_REQUEST.md / PROJECT.md)
// ---------------------------------------------------------------------------

const EXPECTED_RAW_SSOT_SHA256 =
  '81C7E7B45538426D49B20453B91FBDF4CC8323CCFA5C648673AFFEE7469458BD';
const EXPECTED_CANONICAL_SSOT_SHA256 =
  'cefa76c2c6a3f92f57acf74f654932c02bf66774502102cb4f932520aaa64b2b';

const CANONICAL_17_KEYS = [
  'TARIFA_BASE_SOLISTA_EUR',
  'TARIFA_ESTANDAR_SOLISTA_EUR',
  'SOLISTA_KM_INCLUIDOS',
  'RESERVA_BLOQUEO_PCT',
  'LOGISTICA_EUR_PER_KM',
  'LOGISTICA_KM_EXENTOS',
  'LOGISTICA_KM_HOTEL',
  'SUPLEMENTO_HOTEL_EUR',
  'HORA_FIN_HOTEL',
  'DEPOSITO_STRIPE_EUR',
  'LIMITE_B2G_LCSP_EUR',
  'SAFE_LCSP_CEILING_EUR',
  'LIMITE_SPL_DB',
  'WATTS_PER_PAX',
  'VAT_RATE',
  'CENTRALITA_EAR_OS',
  'SPLIT_SOBERANO',
];

const SSOT_COMPANION_EXPORTS = [
  'SOLISTA_TARIFA_ETIQUETA',
  'DEPOSITO_RESERVA_EUR',
  'DEPOSITO_URGENCIA_MENOS_7_DIAS_PCT',
  'COBRO_PREVIO_AL_EVENTO_PCT',
  'AJUSTE_PREVENTIVO_B2G_EUR',
  'MAX_TOTAL_ESTIMADO_EUR',
];

// 24 exact F6 leakage markers (never matching bare "380 campos" on /portal/proveedor denied copy)
const BANNED_SCRAPER_MARKERS = [
  'Convertidor de escaparate (Bodas.net)',
  'Traslado Soberano · Migración Asistida 1-Clic',
  'Traslado Soberano de Escaparate (1-Clic)',
  'Equivalencia de campos de Bodas.net',
  'Alta e Ingesta de Proveedor S-Class',
  'BODAS.NET / DIRECTO',
  'productora-ear--e78903',
  'sovereign_showcase_migration',
  'scraper_link_analyzed',
  'handleScrapeSimulate',
  'handlePatientZeroPreset',
  'handleAbsorbUrl',
  'TrojanOnboardingModal',
  'TrojanOnboardingFormSchema',
  'ConciergeScraperPanel',
  'Abrir convertidor de escaparate 1-Clic',
];

const BANNED_COCKPIT_MARKERS = [
  'ProviderUniversalCockpit',
  'savePortalProviderProfileAction',
  'buildProviderFieldSet',
  'Guardar Ficha',
  'Dato sensible protegido por Contact-Gate',
  'ident.cif_nif',
  'cont.email_facturacion',
  'OmniAgentConsoleModal',
];

const ALL_BANNED_F6_MARKERS = [...BANNED_SCRAPER_MARKERS, ...BANNED_COCKPIT_MARKERS];

const BANNED_PHONE_PATTERNS = [
  '659116376',
  '693048440',
  'tel:+34600000000',
  '34600000000',
  '703831064',
  '721056835',
  '999999999',
  '727272727',
  'tel:tel:',
];

const BANNED_API_PHONE_DIGITS = [
  '659116376',
  '693048440',
  '600000000',
  '703831064',
  '721056835',
  '999999999',
  '727272727',
];

const SPINNER_FALLBACK_MARKERS = [
  'Cargando Directorio Homologado S-Class',
  'Sincronizando directorio homologado S-Class',
];

const DEROGATED_OTZARRETA_2026_MARKERS = [
  '7 menús',
  'desde 100 €',
  '123,40 €',
  '142,50 €',
  '173 €',
  'Zarautz',
];

const PUBLIC_SCAN_ROUTES = [
  '/',
  '/celebraciones',
  '/proveedores',
  '/proveedores?cat=finca',
  '/otzarreta',
  '/portal/proveedor',
];

// ---------------------------------------------------------------------------
// CLI Argument Parser
// ---------------------------------------------------------------------------

function parseArgs(argv) {
  const config = {
    mode: 'live',
    baseUrl: 'http://127.0.0.1:3007',
    tier: 'all',
    timeoutMs: 10000,
    json: false,
  };

  for (const arg of argv) {
    if (arg === '--json') {
      config.json = true;
    } else if (arg.startsWith('--mode=')) {
      config.mode = arg.slice('--mode='.length).trim().toLowerCase();
    } else if (arg.startsWith('--base-url=')) {
      config.baseUrl = arg.slice('--base-url='.length).trim().replace(/\/+$/, '');
    } else if (arg.startsWith('--tier=')) {
      config.tier = arg.slice('--tier='.length).trim().toLowerCase();
    } else if (arg.startsWith('--timeout=')) {
      const parsed = Number.parseInt(arg.slice('--timeout='.length), 10);
      if (!Number.isFinite(parsed) || parsed <= 0) {
        throw new Error(`Invalid --timeout value: ${arg}`);
      }
      config.timeoutMs = parsed;
    } else if (arg === '--help' || arg === '-h') {
      console.log(
        'Usage: node scripts/e2e_enterprise_suite.mjs [--mode=live|offline] [--base-url=http://127.0.0.1:3007] [--tier=1|2|3|4|all] [--timeout=10000] [--json]'
      );
      process.exit(0);
    } else {
      throw new Error(`Unknown CLI argument: ${arg}`);
    }
  }

  if (config.mode !== 'live' && config.mode !== 'offline') {
    throw new Error(`Invalid --mode="${config.mode}". Expected "live" or "offline".`);
  }
  if (!['1', '2', '3', '4', 'all'].includes(config.tier)) {
    throw new Error(`Invalid --tier="${config.tier}". Expected 1, 2, 3, 4, or all.`);
  }

  return config;
}

// ---------------------------------------------------------------------------
// Assertion & Detection Helpers
// ---------------------------------------------------------------------------

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function stripHtmlComments(html) {
  return String(html || '').replace(/<!--[\s\S]*?-->/g, '');
}

function htmlContainsRawOrVisible(html, token) {
  return html.includes(token) || stripHtmlComments(html).includes(token);
}

function decodeHtmlEntities(input) {
  return String(input || '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'");
}

function extractWaMeLinks(html) {
  const matches = html.match(/https?:\/\/wa\.me\/34693693048[^"'\s<>]*/gi) || [];
  return matches.map((raw) => {
    const htmlDecoded = decodeHtmlEntities(raw);
    let uriDecoded = htmlDecoded;
    try {
      uriDecoded = decodeURIComponent(htmlDecoded);
    } catch {
      // keep htmlDecoded if partial encoding
    }
    return { raw, htmlDecoded, uriDecoded };
  });
}

function findBannedMarkers(text, markers) {
  const found = [];
  for (const marker of markers) {
    if (text.includes(marker)) {
      found.push(marker);
    }
  }
  return found;
}

function findBannedMarkersInHtml(html, markers) {
  const rawHits = findBannedMarkers(html, markers);
  const visibleHits = findBannedMarkers(stripHtmlComments(html), markers);
  return [...new Set([...rawHits, ...visibleHits])];
}

function findBannedPhoneOccurrences(text) {
  const found = [];
  const lower = text.toLowerCase();
  for (const pattern of BANNED_PHONE_PATTERNS) {
    if (lower.includes(pattern.toLowerCase())) {
      found.push(pattern);
    }
  }
  return found;
}

function findBannedPhonesInHtml(html) {
  const rawHits = findBannedPhoneOccurrences(html);
  const visibleHits = findBannedPhoneOccurrences(stripHtmlComments(html));
  return [...new Set([...rawHits, ...visibleHits])];
}

function hasGooglePhoneSearchLink(html) {
  return /google\.com\/search\?q=[^"'\s<>]*telefono/i.test(html) ||
    /google\.com\/search\?q=[^"'\s<>]*telefono/i.test(stripHtmlComments(html));
}

function parseJsonSafe(body, label = 'JSON response') {
  try {
    return JSON.parse(body);
  } catch (err) {
    throw new Error(`${label} is not valid JSON (${err.message}). Body snippet: ${body.slice(0, 200)}`);
  }
}

// ---------------------------------------------------------------------------
// Raw HTTP Helper (node:http / node:https — NEVER fetch())
// ---------------------------------------------------------------------------

function rawRequest({ baseUrl, path: reqPath, method = 'GET', headers = {}, body = null, timeoutMs = 10000 }) {
  return new Promise((resolve, reject) => {
    const target = new URL(reqPath, baseUrl);
    const isHttps = target.protocol === 'https:';
    const transport = isHttps ? https : http;

    const normalizedHeaders = {};
    let hasHostHeader = false;
    for (const [k, v] of Object.entries(headers)) {
      if (v !== undefined && v !== null) {
        normalizedHeaders[k] = v;
        if (k.toLowerCase() === 'host') {
          hasHostHeader = true;
        }
      }
    }
    if (!hasHostHeader) {
      normalizedHeaders.Host = target.host;
    }

    let payloadBuffer = null;
    if (body !== null && body !== undefined) {
      payloadBuffer = Buffer.isBuffer(body) ? body : Buffer.from(String(body), 'utf8');
      if (!Object.keys(normalizedHeaders).some((k) => k.toLowerCase() === 'content-length')) {
        normalizedHeaders['Content-Length'] = String(payloadBuffer.length);
      }
    }

    const startNs = process.hrtime.bigint();
    const req = transport.request(
      {
        hostname: target.hostname,
        port: target.port ? Number(target.port) : isHttps ? 443 : 80,
        path: `${target.pathname}${target.search}`,
        method,
        headers: normalizedHeaders,
      },
      (res) => {
        const chunks = [];
        res.on('data', (chunk) => chunks.push(chunk));
        res.on('end', () => {
          const durationMs = Number(process.hrtime.bigint() - startNs) / 1e6;
          const resHeaders = {};
          for (const [hk, hv] of Object.entries(res.headers)) {
            resHeaders[hk.toLowerCase()] = hv;
          }
          resolve({
            status: res.statusCode ?? 0,
            headers: resHeaders,
            body: Buffer.concat(chunks).toString('utf8'),
            durationMs: Math.round(durationMs * 100) / 100,
          });
        });
      }
    );

    req.setTimeout(timeoutMs, () => {
      req.destroy(new Error(`Request timeout after ${timeoutMs}ms: ${method} ${target.toString()}`));
    });

    req.on('error', (err) => {
      reject(err);
    });

    if (payloadBuffer) {
      req.write(payloadBuffer);
    }
    req.end();
  });
}

async function postJson(ctx, reqPath, payloadObj, extraHeaders = {}) {
  return rawRequest({
    baseUrl: ctx.baseUrl,
    path: reqPath,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...extraHeaders,
    },
    body: JSON.stringify(payloadObj),
    timeoutMs: ctx.timeoutMs,
  });
}

// ---------------------------------------------------------------------------
// Bundle Chunk Crawler Helper
// ---------------------------------------------------------------------------

function extractChunkPaths(html) {
  const normalized = html.replace(/\\\/_next\\\/static\\\//g, '/_next/static/');
  const matches = normalized.match(/\/_next\/static\/[^"'\s\\<>()]+\.js(?:\?[^"'\s\\<>()]*)?/g) || [];
  return [...new Set(matches)];
}

async function crawlNextChunks({ baseUrl, html, headers = {}, chunkCache, timeoutMs = 10000 }) {
  const chunkPaths = extractChunkPaths(html);
  assert(
    chunkPaths.length >= 1,
    'Bundle crawler discovered 0 /_next/static/.../*.js chunks in HTML (cannot pass vacuously).'
  );

  const hostKey = headers.Host || headers.host || new URL(baseUrl).host;
  const fetched = [];
  for (const chunkPath of chunkPaths) {
    const cacheKey = `${hostKey}|${chunkPath}`;
    if (!chunkCache.has(cacheKey)) {
      const res = await rawRequest({
        baseUrl,
        path: chunkPath,
        method: 'GET',
        headers,
        timeoutMs,
      });
      assert(
        res.status === 200,
        `Failed to fetch JS chunk ${chunkPath} (Host: ${hostKey}): HTTP ${res.status}`
      );
      assert(res.body.length > 0, `JS chunk ${chunkPath} is empty (0 bytes).`);
      chunkCache.set(cacheKey, res.body);
    }
    fetched.push(chunkCache.get(cacheKey));
  }

  assert(
    fetched.length >= 1,
    'Bundle crawler fetched 0 non-empty JS chunks.'
  );

  return {
    chunkPaths,
    chunkCount: fetched.length,
    combinedJs: fetched.join('\n'),
  };
}

// ---------------------------------------------------------------------------
// Independent R6 SSOT Disk Verifier (Zero src/ Imports)
// ---------------------------------------------------------------------------

function extractNumericConst(source, name) {
  const re = new RegExp(`export\\s+const\\s+${name}(?:\\s*:\\s*number)?\\s*=\\s*([^;]+);`);
  const m = source.match(re);
  assert(m, `Missing numeric export ${name} in ear-os-ssot.ts`);
  const rawExpr = m[1].trim();
  if (/^[+-]?\d+(?:\.\d+)?$/.test(rawExpr)) {
    return Number(rawExpr);
  }
  // Handle alias like SAFE_LCSP_CEILING_EUR = AJUSTE_PREVENTIVO_B2G_EUR
  if (/^[A-Z0-9_]+$/.test(rawExpr)) {
    return extractNumericConst(source, rawExpr);
  }
  throw new Error(`Unsupported expression for ${name}: ${rawExpr}`);
}

function extractStringConst(source, name) {
  const re = new RegExp(`export\\s+const\\s+${name}(?:\\s*:\\s*string)?\\s*=\\s*(['"])(.*?)\\1\\s*;`);
  const m = source.match(re);
  assert(m, `Missing string export ${name} in ear-os-ssot.ts`);
  return m[2];
}

function extractSplitSoberano(source) {
  const blockMatch = source.match(
    /export\s+const\s+SPLIT_SOBERANO\s*=\s*Object\.freeze\(\{([\s\S]*?)\}\s*(?:as\s+const)?\);/
  );
  assert(blockMatch, 'Missing SPLIT_SOBERANO Object.freeze block in ear-os-ssot.ts');
  const block = blockMatch[1];
  const getField = (k) => {
    const fm = block.match(new RegExp(`${k}\\s*:\\s*([+-]?\\d+(?:\\.\\d+)?)`));
    assert(fm, `Missing SPLIT_SOBERANO.${k}`);
    return Number(fm[1]);
  };
  return {
    artista: getField('artista'),
    earOs: getField('earOs'),
    vimume: getField('vimume'),
  };
}

function buildCanonicalSsotString(values) {
  const entries = CANONICAL_17_KEYS.map((key) => {
    if (key === 'SPLIT_SOBERANO') {
      const split = values.SPLIT_SOBERANO;
      const sortedSplit = Object.keys(split)
        .sort()
        .map((k) => `${k}:${split[k].toFixed(4)}`)
        .join(',');
      return `${key}:{${sortedSplit}}`;
    }
    const v = values[key];
    if (typeof v === 'number') {
      return `${key}:${v.toFixed(2)}`;
    }
    return `${key}:${String(v)}`;
  });
  return entries.sort().join('|');
}

function computeCanonicalHashFromValues(values) {
  const canonical = buildCanonicalSsotString(values);
  return {
    canonical,
    hash: crypto.createHash('sha256').update(canonical, 'utf8').digest('hex'),
  };
}

function validateCanonicalInvariants(v) {
  const violations = [];
  const splitSum = v.SPLIT_SOBERANO.artista + v.SPLIT_SOBERANO.earOs + v.SPLIT_SOBERANO.vimume;
  if (Math.abs(splitSum - 1) > 0.0001) {
    violations.push(`SPLIT_SOBERANO sum ${splitSum} != 1`);
  }
  if (Math.abs(v.SAFE_LCSP_CEILING_EUR - v.LIMITE_B2G_LCSP_EUR * 0.95) > 0.01) {
    violations.push('SAFE_LCSP_CEILING_EUR != 95% of LIMITE_B2G_LCSP_EUR');
  }
  if (v.DEPOSITO_STRIPE_EUR !== 100) {
    violations.push(`DEPOSITO_STRIPE_EUR ${v.DEPOSITO_STRIPE_EUR} !== 100`);
  }
  if (v.TARIFA_BASE_SOLISTA_EUR !== 350) {
    violations.push(`TARIFA_BASE_SOLISTA_EUR ${v.TARIFA_BASE_SOLISTA_EUR} !== 350`);
  }
  if (v.TARIFA_ESTANDAR_SOLISTA_EUR !== 550 || v.TARIFA_ESTANDAR_SOLISTA_EUR <= v.TARIFA_BASE_SOLISTA_EUR) {
    violations.push(`TARIFA_ESTANDAR_SOLISTA_EUR ${v.TARIFA_ESTANDAR_SOLISTA_EUR} invalid`);
  }
  if (v.SOLISTA_KM_INCLUIDOS !== 100) {
    violations.push(`SOLISTA_KM_INCLUIDOS ${v.SOLISTA_KM_INCLUIDOS} !== 100`);
  }
  if (v.RESERVA_BLOQUEO_PCT !== 0.5) {
    violations.push(`RESERVA_BLOQUEO_PCT ${v.RESERVA_BLOQUEO_PCT} !== 0.5`);
  }
  if (v.LIMITE_SPL_DB !== 75 || v.WATTS_PER_PAX !== 12) {
    violations.push('Acoustic limits !== 75 dB / 12 W-pax');
  }
  if (v.LOGISTICA_EUR_PER_KM !== 1.5 || v.LOGISTICA_KM_EXENTOS !== 50) {
    violations.push('Logistics !== 1.5 EUR/km / 50 km exempt');
  }
  if (v.SUPLEMENTO_HOTEL_EUR !== 120 || v.LOGISTICA_KM_HOTEL !== 200 || v.HORA_FIN_HOTEL !== 3) {
    violations.push('Hotel supplement !== 120 EUR / 200 km / 3 AM');
  }
  if (v.VAT_RATE !== 0.21) {
    violations.push(`VAT_RATE ${v.VAT_RATE} !== 0.21`);
  }
  if (v.CENTRALITA_EAR_OS !== '+34 693 693 048') {
    violations.push(`CENTRALITA_EAR_OS ${v.CENTRALITA_EAR_OS} !== '+34 693 693 048'`);
  }
  return violations;
}

function readSsotDiskSnapshot() {
  const ssotPath = path.join(REPO_ROOT, 'src', 'lib', 'constants', 'ear-os-ssot.ts');
  const guardPath = path.join(REPO_ROOT, 'src', 'lib', 'security', 'ssotIntegrityGuard.ts');

  const rawBytes = fs.readFileSync(ssotPath);
  const rawText = rawBytes.toString('utf8');
  const rawSha256 = crypto.createHash('sha256').update(rawBytes).digest('hex').toUpperCase();

  const values = {
    TARIFA_BASE_SOLISTA_EUR: extractNumericConst(rawText, 'TARIFA_BASE_SOLISTA_EUR'),
    TARIFA_ESTANDAR_SOLISTA_EUR: extractNumericConst(rawText, 'TARIFA_ESTANDAR_SOLISTA_EUR'),
    SOLISTA_KM_INCLUIDOS: extractNumericConst(rawText, 'SOLISTA_KM_INCLUIDOS'),
    RESERVA_BLOQUEO_PCT: extractNumericConst(rawText, 'RESERVA_BLOQUEO_PCT'),
    LOGISTICA_EUR_PER_KM: extractNumericConst(rawText, 'LOGISTICA_EUR_PER_KM'),
    LOGISTICA_KM_EXENTOS: extractNumericConst(rawText, 'LOGISTICA_KM_EXENTOS'),
    LOGISTICA_KM_HOTEL: extractNumericConst(rawText, 'LOGISTICA_KM_HOTEL'),
    SUPLEMENTO_HOTEL_EUR: extractNumericConst(rawText, 'SUPLEMENTO_HOTEL_EUR'),
    HORA_FIN_HOTEL: extractNumericConst(rawText, 'HORA_FIN_HOTEL'),
    DEPOSITO_STRIPE_EUR: extractNumericConst(rawText, 'DEPOSITO_STRIPE_EUR'),
    LIMITE_B2G_LCSP_EUR: extractNumericConst(rawText, 'LIMITE_B2G_LCSP_EUR'),
    SAFE_LCSP_CEILING_EUR: extractNumericConst(rawText, 'SAFE_LCSP_CEILING_EUR'),
    LIMITE_SPL_DB: extractNumericConst(rawText, 'LIMITE_SPL_DB'),
    WATTS_PER_PAX: extractNumericConst(rawText, 'WATTS_PER_PAX'),
    VAT_RATE: extractNumericConst(rawText, 'VAT_RATE'),
    CENTRALITA_EAR_OS: extractStringConst(rawText, 'CENTRALITA_EAR_OS'),
    SPLIT_SOBERANO: extractSplitSoberano(rawText),
  };

  const { canonical, hash: canonicalSha256 } = computeCanonicalHashFromValues(values);
  const guardText = fs.readFileSync(guardPath, 'utf8');

  return {
    ssotPath,
    guardPath,
    rawBytes,
    rawText,
    rawSha256,
    values,
    canonical,
    canonicalSha256,
    guardText,
  };
}

// ---------------------------------------------------------------------------
// 102 Opaque-Box E2E Tests (Tiers 1–4)
// ---------------------------------------------------------------------------

const SUITE_TESTS = [
  // =========================================================================
  // TIER 1 — FEATURE COVERAGE (42 tests, >=5 per feature F1–F7, R6)
  // =========================================================================

  // --- F1 (6 tests) ---
  {
    id: 'F1-T1-01',
    tier: 1,
    feature: 'F1',
    title: 'www.productoraear.com preserves /calendario/catering/restaurante-otzarreta?intent=bloquear (HTTP 200)',
    run: async (ctx) => {
      const res = await rawRequest({
        baseUrl: ctx.baseUrl,
        path: '/calendario/catering/restaurante-otzarreta?intent=bloquear',
        headers: { Host: 'www.productoraear.com' },
        timeoutMs: ctx.timeoutMs,
      });
      assert(res.status === 200, `Expected 200, got ${res.status} (location=${res.headers.location || ''})`);
      assert(!res.headers['x-ear-route-gating'], `Unexpected route-gating header: ${res.headers['x-ear-route-gating']}`);
      const visible = stripHtmlComments(res.body);
      assert(/restaurante otzarreta/i.test(visible), 'HTML missing Restaurante Otzarreta heading/content');
      return 'HTTP 200 without /celebraciones sink';
    },
  },
  {
    id: 'F1-T1-02',
    tier: 1,
    feature: 'F1',
    title: 'www.productoraear.com preserves /calendario/catering/restaurante-otzarreta?intent=ver (HTTP 200)',
    run: async (ctx) => {
      const res = await rawRequest({
        baseUrl: ctx.baseUrl,
        path: '/calendario/catering/restaurante-otzarreta?intent=ver',
        headers: { Host: 'www.productoraear.com' },
        timeoutMs: ctx.timeoutMs,
      });
      assert(res.status === 200, `Expected 200, got ${res.status}`);
      assert(res.headers['x-ear-vertical'] === 'productoraear', `Expected x-ear-vertical=productoraear, got ${res.headers['x-ear-vertical']}`);
      return 'HTTP 200 on productoraear vertical';
    },
  },
  {
    id: 'F1-T1-03',
    tier: 1,
    feature: 'F1',
    title: 'Host fincasparaboda.com permits /calendario/catering/restaurante-otzarreta?intent=bloquear without vertical redirect',
    run: async (ctx) => {
      const res = await rawRequest({
        baseUrl: ctx.baseUrl,
        path: '/calendario/catering/restaurante-otzarreta?intent=bloquear',
        headers: { Host: 'fincasparaboda.com' },
        timeoutMs: ctx.timeoutMs,
      });
      assert(res.status === 200, `Expected 200 on fincasparaboda.com, got ${res.status} (location=${res.headers.location || ''})`);
      assert(res.headers['x-ear-vertical'] === 'fincasparaboda', `Expected x-ear-vertical=fincasparaboda, got ${res.headers['x-ear-vertical']}`);
      assert(!res.headers['x-ear-vertical-redirected'], `Unexpected vertical redirect header: ${res.headers['x-ear-vertical-redirected']}`);
      return 'fincasparaboda.com HTTP 200';
    },
  },
  {
    id: 'F1-T1-04',
    tier: 1,
    feature: 'F1',
    title: 'Host artistaseuropa.com permits /calendario/artista/edwin-agudelo?intent=ver without vertical redirect',
    run: async (ctx) => {
      const res = await rawRequest({
        baseUrl: ctx.baseUrl,
        path: '/calendario/artista/edwin-agudelo?intent=ver',
        headers: { Host: 'artistaseuropa.com' },
        timeoutMs: ctx.timeoutMs,
      });
      assert(res.status === 200, `Expected 200 on artistaseuropa.com, got ${res.status} (location=${res.headers.location || ''})`);
      assert(res.headers['x-ear-vertical'] === 'artistaseuropa', `Expected x-ear-vertical=artistaseuropa, got ${res.headers['x-ear-vertical']}`);
      assert(!res.headers['x-ear-vertical-redirected'], `Unexpected vertical redirect header: ${res.headers['x-ear-vertical-redirected']}`);
      return 'artistaseuropa.com HTTP 200';
    },
  },
  {
    id: 'F1-T1-05',
    tier: 1,
    feature: 'F1',
    title: '/otzarreta exposes canonical calendar links and /restaurante-otzarreta redirects 307 to /otzarreta',
    run: async (ctx) => {
      const otz = await rawRequest({
        baseUrl: ctx.baseUrl,
        path: '/otzarreta',
        headers: { Host: 'www.productoraear.com' },
        timeoutMs: ctx.timeoutMs,
      });
      assert(otz.status === 200, `GET /otzarreta expected 200, got ${otz.status}`);
      assert(
        otz.body.includes('/calendario/catering/restaurante-otzarreta?intent=bloquear') &&
          otz.body.includes('/calendario/catering/restaurante-otzarreta?intent=ver'),
        '/otzarreta missing canonical intent=bloquear and intent=ver links'
      );

      const alias = await rawRequest({
        baseUrl: ctx.baseUrl,
        path: '/restaurante-otzarreta',
        headers: { Host: 'www.productoraear.com' },
        timeoutMs: ctx.timeoutMs,
      });
      assert(alias.status === 307 || alias.status === 308, `GET /restaurante-otzarreta expected 307/308, got ${alias.status}`);
      const loc = alias.headers.location || '';
      assert(loc.endsWith('/otzarreta'), `Expected redirect to /otzarreta, got ${loc}`);
      return '/otzarreta CTAs + /restaurante-otzarreta -> /otzarreta';
    },
  },
  {
    id: 'F1-T1-06',
    tier: 1,
    feature: 'F1',
    title: '/celebraciones returns HTTP 200 on fincasparaboda.com and artistaseuropa.com',
    run: async (ctx) => {
      for (const host of ['fincasparaboda.com', 'artistaseuropa.com']) {
        const res = await rawRequest({
          baseUrl: ctx.baseUrl,
          path: '/celebraciones',
          headers: { Host: host },
          timeoutMs: ctx.timeoutMs,
        });
        assert(res.status === 200, `${host} /celebraciones expected 200, got ${res.status} (location=${res.headers.location || ''})`);
        assert(!res.headers['x-ear-vertical-redirected'], `${host} unexpectedly set x-ear-vertical-redirected`);
      }
      return 'Both secondary celebration/artist hosts serve /celebraciones (200)';
    },
  },

  // --- F2 (5 tests) ---
  {
    id: 'F2-T1-01',
    tier: 1,
    feature: 'F2',
    title: 'Unauthenticated ?intent=bloquear renders Modo bloqueo without owner banner',
    run: async (ctx) => {
      const res = await rawRequest({
        baseUrl: ctx.baseUrl,
        path: '/calendario/catering/restaurante-otzarreta?intent=bloquear',
        timeoutMs: ctx.timeoutMs,
      });
      assert(res.status === 200, `Expected 200, got ${res.status}`);
      const visible = stripHtmlComments(res.body);
      assert(visible.includes('Modo bloqueo'), 'Expected "Modo bloqueo" banner for intent=bloquear');
      assert(
        !htmlContainsRawOrVisible(res.body, 'Eres el titular de esta agenda'),
        'Fail-closed violation: unauthenticated request rendered owner mutation banner'
      );
      return 'Public Modo bloqueo active, owner mode withheld';
    },
  },
  {
    id: 'F2-T1-02',
    tier: 1,
    feature: 'F2',
    title: 'Unauthenticated ?intent=ver renders public availability without Modo bloqueo or owner banner',
    run: async (ctx) => {
      const res = await rawRequest({
        baseUrl: ctx.baseUrl,
        path: '/calendario/catering/restaurante-otzarreta?intent=ver',
        timeoutMs: ctx.timeoutMs,
      });
      assert(res.status === 200, `Expected 200, got ${res.status}`);
      const visible = stripHtmlComments(res.body);
      assert(visible.includes('Disponibilidad pública en vivo'), 'Expected "Disponibilidad pública en vivo"');
      assert(!htmlContainsRawOrVisible(res.body, 'Modo bloqueo'), 'intent=ver must not render Modo bloqueo');
      assert(!htmlContainsRawOrVisible(res.body, 'Eres el titular de esta agenda'), 'Owner banner leaked to unauthenticated visitor');
      return 'Public intent=ver verified';
    },
  },
  {
    id: 'F2-T1-03',
    tier: 1,
    feature: 'F2',
    title: 'Missing intent query defaults deterministically without Modo bloqueo or owner banner',
    run: async (ctx) => {
      const res = await rawRequest({
        baseUrl: ctx.baseUrl,
        path: '/calendario/catering/restaurante-otzarreta',
        timeoutMs: ctx.timeoutMs,
      });
      assert(res.status === 200, `Expected 200, got ${res.status}`);
      assert(!htmlContainsRawOrVisible(res.body, 'Modo bloqueo'), 'Default route without intent must not activate Modo bloqueo');
      assert(!htmlContainsRawOrVisible(res.body, 'Eres el titular de esta agenda'), 'Owner banner leaked on default route');
      return 'Deterministic null intent default verified';
    },
  },
  {
    id: 'F2-T1-04',
    tier: 1,
    feature: 'F2',
    title: 'Calendar ?intent=bloquear exposes "Bloquear Fecha con 100 €" CTA & decoded wa.me/34693693048 handoff with kind',
    run: async (ctx) => {
      const res = await rawRequest({
        baseUrl: ctx.baseUrl,
        path: '/calendario/catering/restaurante-otzarreta?intent=bloquear',
        timeoutMs: ctx.timeoutMs,
      });
      assert(res.status === 200, `Expected 200, got ${res.status}`);
      const visible = stripHtmlComments(res.body);
      assert(
        visible.includes('Bloquear Fecha con 100 €') || visible.includes('Bloquear Fecha con 100&nbsp;€'),
        'Missing "Bloquear Fecha con 100 €" CTA in calendar DOM'
      );
      const waLinks = extractWaMeLinks(res.body);
      assert(waLinks.length > 0, 'Missing wa.me/34693693048 handoff link');
      assert(
        waLinks.some((l) => l.uriDecoded.includes('/calendario/catering/restaurante-otzarreta')),
        `Decoded WhatsApp handoff missing /calendario/catering/restaurante-otzarreta (found: ${waLinks.map((l) => l.uriDecoded).join('; ')})`
      );
      return '100 € CTA + decoded WhatsApp handoff with kind verified';
    },
  },
  {
    id: 'F2-T1-05',
    tier: 1,
    feature: 'F2',
    title: 'Calendar GET API and /ical feed return valid entity JSON and BEGIN:VCALENDAR',
    run: async (ctx) => {
      const api = await rawRequest({
        baseUrl: ctx.baseUrl,
        path: '/api/calendar/catering/restaurante-otzarreta',
        timeoutMs: ctx.timeoutMs,
      });
      assert(api.status === 200, `Expected 200 on calendar GET API, got ${api.status}`);
      const json = parseJsonSafe(api.body, 'Calendar GET API');
      assert(json.ok === true, 'Calendar GET API expected ok: true');
      assert(json.entity?.kind === 'catering', `Expected entity.kind=catering, got ${json.entity?.kind}`);
      assert(json.entity?.slug === 'restaurante-otzarreta', `Expected entity.slug=restaurante-otzarreta, got ${json.entity?.slug}`);

      const ical = await rawRequest({
        baseUrl: ctx.baseUrl,
        path: '/api/calendar/catering/restaurante-otzarreta/ical',
        timeoutMs: ctx.timeoutMs,
      });
      assert(ical.status === 200, `Expected 200 on iCal feed, got ${ical.status}`);
      assert(
        String(ical.headers['content-type'] || '').includes('text/calendar'),
        `Expected text/calendar content-type, got ${ical.headers['content-type']}`
      );
      assert(ical.body.trimStart().startsWith('BEGIN:VCALENDAR'), 'iCal body does not start with BEGIN:VCALENDAR');
      return 'JSON entity + text/calendar BEGIN:VCALENDAR verified';
    },
  },

  // --- F3 (5 tests) ---
  {
    id: 'F3-T1-01',
    tier: 1,
    feature: 'F3',
    title: 'POST /api/calendar/catering/restaurante-otzarreta/deposit fail-closed 503 or valid 10000-cent Stripe Checkout',
    run: async (ctx) => {
      const res = await postJson(ctx, '/api/calendar/catering/restaurante-otzarreta/deposit', {
        eventDate: '2027-08-21',
        timeSlot: '14:00',
        clientName: 'Test E2E',
        clientEmail: 'e2e@productoraear.com',
        intent: 'bloquear',
        idempotencyKey: 'e2e_key_12345678',
      });
      assert(res.status !== 500 && res.status !== 404, `Unexpected HTTP ${res.status} from deposit endpoint`);
      if (res.status === 503) {
        const json = parseJsonSafe(res.body, 'Deposit 503 response');
        assert(json.ok === false || Boolean(json.error), 'Expected structured error payload on fail-closed 503');
        return 'Fail-closed HTTP 503 (Stripe/HMAC secrets absent)';
      }
      assert(res.status === 200 || res.status === 201, `Expected 503 or 200/201, got ${res.status}: ${res.body.slice(0, 200)}`);
      const json = parseJsonSafe(res.body, 'Deposit 200/201 response');
      const serialized = JSON.stringify(json);
      assert(
        serialized.includes('stripe.com') && (json.amountCents === 10000 || serialized.includes('10000')),
        `Expected Stripe checkout URL and 10000 cents, got: ${serialized.slice(0, 250)}`
      );
      return `HTTP ${res.status} with Stripe Checkout + 10000 cents`;
    },
  },
  {
    id: 'F3-T1-02',
    tier: 1,
    feature: 'F3',
    title: 'Deposit idempotencyKey replay behaves deterministically without 500 or duplicate conflict',
    run: async (ctx) => {
      const payload = {
        eventDate: '2027-09-18',
        timeSlot: '13:30',
        clientName: 'Idempotency Probe',
        clientEmail: 'idempotency@productoraear.com',
        intent: 'bloquear',
        idempotencyKey: 'e2e_idem_replay_987654',
      };
      const first = await postJson(ctx, '/api/calendar/catering/restaurante-otzarreta/deposit', payload);
      const second = await postJson(ctx, '/api/calendar/catering/restaurante-otzarreta/deposit', payload);
      assert(first.status !== 500 && second.status !== 500, `500 error on idempotency replay (${first.status}, ${second.status})`);
      assert(first.status === second.status, `Inconsistent replay status: ${first.status} vs ${second.status}`);
      if (first.status === 200 || first.status === 201) {
        const j1 = parseJsonSafe(first.body, 'First replay JSON');
        const j2 = parseJsonSafe(second.body, 'Second replay JSON');
        if (j1.priceLockHash && j2.priceLockHash) {
          assert(j1.priceLockHash === j2.priceLockHash, 'priceLockHash diverged across identical idempotencyKey');
        }
      } else {
        assert(first.status === 503, `Expected 503 or 200/201 on replay, got ${first.status}`);
      }
      return `Deterministic replay status ${first.status} == ${second.status}`;
    },
  },
  {
    id: 'F3-T1-03',
    tier: 1,
    feature: 'F3',
    title: '/reservar/contrato?proveedor=restaurante-otzarreta displays 100.00 € deposit & 80/10/10 split',
    run: async (ctx) => {
      const res = await rawRequest({
        baseUrl: ctx.baseUrl,
        path: '/reservar/contrato?proveedor=restaurante-otzarreta',
        timeoutMs: ctx.timeoutMs,
      });
      assert(res.status === 200, `Expected 200 on /reservar/contrato, got ${res.status}`);
      const visible = stripHtmlComments(res.body);
      assert(visible.includes('100.00 €'), 'Contract page missing 100.00 € SSOT deposit');
      assert(visible.includes('80/10/10') && visible.includes('(80%)'), 'Contract page missing 80/10/10 Sovereign Split');
      return 'Contract page renders 100.00 € + 80/10/10';
    },
  },
  {
    id: 'F3-T1-04',
    tier: 1,
    feature: 'F3',
    title: 'POST /api/stripe/webhook rejects missing stripe-signature (400/503, never 200)',
    run: async (ctx) => {
      const res = await postJson(ctx, '/api/stripe/webhook', {
        type: 'checkout.session.completed',
        data: { object: { metadata: { tipo: 'CALENDAR_ENTITY_DEPOSIT_100' } } },
      });
      assert(res.status === 400 || res.status === 503, `Expected 400 or 503 without signature, got ${res.status}`);
      return `Fail-closed webhook status ${res.status}`;
    },
  },
  {
    id: 'F3-T1-05',
    tier: 1,
    feature: 'F3',
    title: 'Deposit API Zod validation JSON contract & disk SSOT/HMAC compliance',
    run: async (ctx) => {
      const emptyPost = await postJson(ctx, '/api/calendar/catering/restaurante-otzarreta/deposit', {});
      assert(emptyPost.status === 400, `Empty deposit POST expected 400, got ${emptyPost.status}`);
      assert(
        String(emptyPost.headers['content-type'] || '').includes('application/json'),
        `Expected JSON error response, got ${emptyPost.headers['content-type']}`
      );
      const getNotAllowed = await rawRequest({
        baseUrl: ctx.baseUrl,
        path: '/api/calendar/catering/restaurante-otzarreta/deposit',
        method: 'GET',
        timeoutMs: ctx.timeoutMs,
      });
      assert(getNotAllowed.status === 405 || getNotAllowed.status === 400 || getNotAllowed.status === 404, `Unexpected GET status ${getNotAllowed.status} on POST-only deposit route`);

      const depositPath = path.join(REPO_ROOT, 'src', 'app', 'api', 'calendar', '[kind]', '[slug]', 'deposit', 'route.ts');
      assert(fs.existsSync(depositPath), 'Missing src/app/api/calendar/[kind]/[slug]/deposit/route.ts');
      const depositSrc = fs.readFileSync(depositPath, 'utf8');
      assert(depositSrc.includes('DEPOSITO_STRIPE_EUR'), 'Deposit route must import DEPOSITO_STRIPE_EUR from SSOT');
      assert(
        depositSrc.includes('PRICE_LOCK_HMAC_SECRET') || depositSrc.includes('STRIPE_SECRET_KEY'),
        'Deposit route missing fail-closed HMAC secret resolution'
      );

      const webhookPath = path.join(REPO_ROOT, 'src', 'app', 'api', 'stripe', 'webhook', 'route.ts');
      const webhookSrc = fs.readFileSync(webhookPath, 'utf8');
      assert(webhookSrc.includes('CALENDAR_ENTITY_DEPOSIT_100'), 'Webhook missing CALENDAR_ENTITY_DEPOSIT_100 handler');
      return 'Live Zod/405 + SSOT/HMAC/Webhook contracts verified';
    },
  },

  // --- F4 (5 tests) ---
  {
    id: 'F4-T1-01',
    tier: 1,
    feature: 'F4',
    title: 'phone-constants.ts & ear-os-ssot.ts match canonical +34 693 693 048',
    run: async () => {
      const phoneSrc = fs.readFileSync(path.join(REPO_ROOT, 'src', 'lib', 'phone-constants.ts'), 'utf8');
      assert(phoneSrc.includes('"+34693693048"') || phoneSrc.includes("'+34693693048'"), 'Missing +34693693048');
      assert(phoneSrc.includes('"+34 693 693 048"') || phoneSrc.includes("'+34 693 693 048'"), 'Missing +34 693 693 048');
      assert(phoneSrc.includes('"34693693048"') || phoneSrc.includes("'34693693048'"), 'Missing raw 34693693048');
      assert(phoneSrc.includes('tel:+34693693048'), 'Missing tel:+34693693048');
      assert(phoneSrc.includes('https://wa.me/34693693048'), 'Missing https://wa.me/34693693048');
      const ssot = readSsotDiskSnapshot();
      assert(ssot.values.CENTRALITA_EAR_OS === '+34 693 693 048', 'CENTRALITA_EAR_OS mismatch');
      return 'Canonical Centralita SSOT verified';
    },
  },
  {
    id: 'F4-T1-02',
    tier: 1,
    feature: 'F4',
    title: 'Public SSR pages expose canonical +34 693 693 048 / 34693693048',
    run: async (ctx) => {
      const routes = ['/', '/celebraciones', '/proveedores', '/otzarreta', '/calendario/catering/restaurante-otzarreta'];
      for (const route of routes) {
        const res = await rawRequest({ baseUrl: ctx.baseUrl, path: route, timeoutMs: ctx.timeoutMs });
        assert(res.status === 200, `${route} expected 200, got ${res.status}`);
        const visible = stripHtmlComments(res.body);
        assert(
          visible.includes('+34 693 693 048') || visible.includes('34693693048'),
          `${route} missing canonical Centralita phone`
        );
      }
      return `Canonical Centralita verified across ${routes.length} public pages`;
    },
  },
  {
    id: 'F4-T1-03',
    tier: 1,
    feature: 'F4',
    title: '/otzarreta and /celebraciones link WhatsApp to wa.me/34693693048',
    run: async (ctx) => {
      for (const route of ['/otzarreta', '/celebraciones']) {
        const res = await rawRequest({ baseUrl: ctx.baseUrl, path: route, timeoutMs: ctx.timeoutMs });
        assert(res.status === 200, `${route} expected 200, got ${res.status}`);
        assert(htmlContainsRawOrVisible(res.body, 'wa.me/34693693048'), `${route} missing wa.me/34693693048`);
      }
      return '/otzarreta & /celebraciones point to wa.me/34693693048';
    },
  },
  {
    id: 'F4-T1-04',
    tier: 1,
    feature: 'F4',
    title: 'GET /api/profiles/search?category=finca&limit=24 masks unclaimed phones (phone===null, telephone===null)',
    run: async (ctx) => {
      const res = await rawRequest({
        baseUrl: ctx.baseUrl,
        path: '/api/profiles/search?category=finca&limit=24',
        timeoutMs: ctx.timeoutMs,
      });
      assert(res.status === 200, `Expected 200, got ${res.status}`);
      const json = parseJsonSafe(res.body, 'Profiles search finca');
      assert(json.success === true, 'Expected success: true');
      const items = json.providers || json.items || [];
      assert(items.length > 0, 'Expected non-empty finca results');
      for (const item of items) {
        if (item.has_real_phone !== true) {
          assert(item.phone === null, `Unclaimed provider ${item.slug || item.name} leaked phone=${item.phone}`);
          assert(item.telephone === null, `Unclaimed provider ${item.slug || item.name} leaked telephone=${item.telephone}`);
        }
      }
      return `Verified phone masking on ${items.length} finca records`;
    },
  },
  {
    id: 'F4-T1-05',
    tier: 1,
    feature: 'F4',
    title: 'Zero malformed tel:tel: URIs across public SSR pages',
    run: async (ctx) => {
      const routes = ['/', '/celebraciones', '/proveedores', '/proveedores?cat=finca', '/otzarreta', '/calendario/catering/restaurante-otzarreta'];
      for (const route of routes) {
        const res = await rawRequest({ baseUrl: ctx.baseUrl, path: route, timeoutMs: ctx.timeoutMs });
        assert(res.status === 200, `${route} expected 200, got ${res.status}`);
        assert(!/tel:tel:/i.test(res.body) && !/tel:tel:/i.test(stripHtmlComments(res.body)), `Malformed tel:tel: detected in ${route}`);
      }
      return `Zero tel:tel: across ${routes.length} routes`;
    },
  },

  // --- F5 (5 tests) ---
  {
    id: 'F5-T1-01',
    tier: 1,
    feature: 'F5',
    title: 'Category aliases normalize finca/fincas -> finca and /proveedores/page.tsx is SSR Server Component',
    run: async () => {
      const catSrc = fs.readFileSync(
        path.join(REPO_ROOT, 'src', 'lib', 'constants', 'spain-regions-and-categories.ts'),
        'utf8'
      );
      assert(catSrc.includes("finca: 'finca'") && catSrc.includes("fincas: 'finca'"), 'Missing finca/fincas aliases');
      assert(catSrc.includes("return 'servicios';"), 'Missing unknown -> servicios fallback');
      const pageSrc = fs.readFileSync(
        path.join(REPO_ROOT, 'src', 'app', '(public)', 'proveedores', 'page.tsx'),
        'utf8'
      );
      assert(!/^\s*['"]use client['"]/.test(pageSrc), 'proveedores/page.tsx must not be a "use client" page');
      assert(pageSrc.includes('searchParams'), 'proveedores/page.tsx must read searchParams on server');
      return 'Server Component + finca/fincas alias config verified';
    },
  },
  {
    id: 'F5-T1-02',
    tier: 1,
    feature: 'F5',
    title: 'GET /proveedores?cat=finca returns HTTP 200 with SSR-hydrated finca catalog listings',
    run: async (ctx) => {
      const res = await rawRequest({
        baseUrl: ctx.baseUrl,
        path: '/proveedores?cat=finca',
        timeoutMs: ctx.timeoutMs,
      });
      assert(res.status === 200, `Expected 200, got ${res.status}`);
      const visible = stripHtmlComments(res.body);
      assert(
        visible.includes('Fincas') || visible.includes('finca') || visible.includes('Otzarreta'),
        'SSR HTML missing finca directory content'
      );
      assert(
        visible.includes('Ver agenda') || visible.includes('Solicitar') || res.body.includes('/proveedores/'),
        'SSR HTML missing hydrated provider card actions'
      );
      return 'SSR /proveedores?cat=finca hydrated';
    },
  },
  {
    id: 'F5-T1-03',
    tier: 1,
    feature: 'F5',
    title: 'GET /proveedores?cat=fincas normalizes alias identically to cat=finca on SSR',
    run: async (ctx) => {
      const res = await rawRequest({
        baseUrl: ctx.baseUrl,
        path: '/proveedores?cat=fincas',
        timeoutMs: ctx.timeoutMs,
      });
      assert(res.status === 200, `Expected 200, got ${res.status}`);
      const spinners = findBannedMarkersInHtml(res.body, SPINNER_FALLBACK_MARKERS);
      assert(spinners.length === 0, `Alias route rendered loading spinner: ${spinners.join(', ')}`);
      const visible = stripHtmlComments(res.body);
      assert(
        visible.includes('Fincas') || visible.includes('Otzarreta') || res.body.includes('/proveedores/'),
        'Alias ?cat=fincas did not render finca listings'
      );
      return 'SSR /proveedores?cat=fincas alias hydrated';
    },
  },
  {
    id: 'F5-T1-04',
    tier: 1,
    feature: 'F5',
    title: 'GET /api/profiles/search?category=finca&limit=10 returns success:true and total>0',
    run: async (ctx) => {
      const res = await rawRequest({
        baseUrl: ctx.baseUrl,
        path: '/api/profiles/search?category=finca&limit=10',
        timeoutMs: ctx.timeoutMs,
      });
      assert(res.status === 200, `Expected 200, got ${res.status}`);
      const json = parseJsonSafe(res.body, 'Search category=finca');
      assert(json.success === true, 'Expected success: true');
      assert(typeof json.total === 'number' && json.total > 0, `Expected total > 0, got ${json.total}`);
      assert(Array.isArray(json.providers) && json.providers.length > 0, 'Expected non-empty providers array');
      return `total=${json.total}, returned=${json.providers.length}`;
    },
  },
  {
    id: 'F5-T1-05',
    tier: 1,
    feature: 'F5',
    title: 'GET /api/profiles/search?cat=finca&limit=10 honors cat param contract',
    run: async (ctx) => {
      const res = await rawRequest({
        baseUrl: ctx.baseUrl,
        path: '/api/profiles/search?cat=finca&limit=10',
        timeoutMs: ctx.timeoutMs,
      });
      assert(res.status === 200, `Expected 200, got ${res.status}`);
      const json = parseJsonSafe(res.body, 'Search cat=finca');
      assert(json.success === true, 'Expected success: true');
      assert(typeof json.total === 'number' && json.total > 0, `Expected total > 0, got ${json.total}`);
      assert(Array.isArray(json.providers) && json.providers.length > 0, 'Expected non-empty providers array');
      return `cat=finca total=${json.total}, returned=${json.providers.length}`;
    },
  },

  // --- F6 (6 tests) ---
  {
    id: 'F6-T1-01',
    tier: 1,
    feature: 'F6',
    title: 'Unauthenticated GET /portal/proveedor renders restricted notice or 307 /login',
    run: async (ctx) => {
      const res = await rawRequest({
        baseUrl: ctx.baseUrl,
        path: '/portal/proveedor',
        timeoutMs: ctx.timeoutMs,
      });
      if (res.status === 307 || res.status === 308) {
        assert((res.headers.location || '').includes('/login'), `Expected /login redirect, got ${res.headers.location}`);
        return `HTTP ${res.status} -> ${res.headers.location}`;
      }
      assert(res.status === 200, `Expected 200 or 307, got ${res.status}`);
      const visible = stripHtmlComments(res.body);
      assert(visible.includes('Acceso restringido a proveedores'), 'Missing restricted provider notice');
      assert(visible.includes('Iniciar sesión como proveedor'), 'Missing login CTA in restricted screen');
      return 'Restricted provider screen rendered cleanly';
    },
  },
  {
    id: 'F6-T1-02',
    tier: 1,
    feature: 'F6',
    title: 'Unauthenticated GET /admin redirects 307 -> /login (never 200)',
    run: async (ctx) => {
      const res = await rawRequest({
        baseUrl: ctx.baseUrl,
        path: '/admin',
        timeoutMs: ctx.timeoutMs,
      });
      assert(res.status === 307 || res.status === 308, `Expected 307/308 on /admin, got ${res.status}`);
      assert((res.headers.location || '').includes('/login'), `Expected /login location, got ${res.headers.location}`);
      return `HTTP ${res.status} -> ${res.headers.location}`;
    },
  },
  {
    id: 'F6-T1-03',
    tier: 1,
    feature: 'F6',
    title: 'Zero-byte Bodas.net scraper leakage across public HTML & all /_next/static chunks',
    run: async (ctx) => {
      let totalChunks = 0;
      for (const route of ['/', '/celebraciones', '/proveedores', '/otzarreta', '/portal/proveedor']) {
        const res = await rawRequest({ baseUrl: ctx.baseUrl, path: route, timeoutMs: ctx.timeoutMs });
        if (res.status === 307 || res.status === 308) continue;
        assert(res.status === 200, `${route} expected 200, got ${res.status}`);
        const htmlHits = findBannedMarkersInHtml(res.body, BANNED_SCRAPER_MARKERS);
        assert(htmlHits.length === 0, `Scraper tokens leaked in ${route} HTML: ${htmlHits.join(', ')}`);

        const { chunkCount, combinedJs } = await crawlNextChunks({
          baseUrl: ctx.baseUrl,
          html: res.body,
          chunkCache: ctx.chunkCache,
          timeoutMs: ctx.timeoutMs,
        });
        totalChunks += chunkCount;
        const jsHits = findBannedMarkers(combinedJs, BANNED_SCRAPER_MARKERS);
        assert(jsHits.length === 0, `Scraper tokens leaked in ${route} JS bundles: ${jsHits.join(', ')}`);
      }
      assert(totalChunks >= 1, 'No JS chunks scanned');
      return `0 scraper hits across HTML + ${totalChunks} chunk evaluations`;
    },
  },
  {
    id: 'F6-T1-04',
    tier: 1,
    feature: 'F6',
    title: 'Zero-byte 380-field cockpit & OmniAgentConsoleModal leakage across public HTML & JS chunks',
    run: async (ctx) => {
      let totalChunks = 0;
      for (const route of ['/', '/celebraciones', '/proveedores', '/otzarreta', '/portal/proveedor']) {
        const res = await rawRequest({ baseUrl: ctx.baseUrl, path: route, timeoutMs: ctx.timeoutMs });
        if (res.status === 307 || res.status === 308) continue;
        assert(res.status === 200, `${route} expected 200, got ${res.status}`);
        const htmlHits = findBannedMarkersInHtml(res.body, BANNED_COCKPIT_MARKERS);
        assert(htmlHits.length === 0, `Cockpit/admin tokens leaked in ${route} HTML: ${htmlHits.join(', ')}`);

        const { chunkCount, combinedJs } = await crawlNextChunks({
          baseUrl: ctx.baseUrl,
          html: res.body,
          chunkCache: ctx.chunkCache,
          timeoutMs: ctx.timeoutMs,
        });
        totalChunks += chunkCount;
        const jsHits = findBannedMarkers(combinedJs, BANNED_COCKPIT_MARKERS);
        assert(jsHits.length === 0, `Cockpit/admin tokens leaked in ${route} JS bundles: ${jsHits.join(', ')}`);
      }
      assert(totalChunks >= 1, 'No JS chunks scanned');
      return `0 cockpit/admin hits across HTML + ${totalChunks} chunk evaluations`;
    },
  },
  {
    id: 'F6-T1-05',
    tier: 1,
    feature: 'F6',
    title: 'Unauthenticated POST /api/concierge/chat with bodas.net prompt never emits action.type === "scraper"',
    run: async (ctx) => {
      const res = await postJson(ctx, '/api/concierge/chat', {
        message: 'Quiero usar el convertidor de bodas.net para migrar mi escaparate',
        routeContext: { pathname: '/otzarreta' },
      });
      assert(res.status === 200 || res.status === 401 || res.status === 403, `Unexpected status ${res.status}`);
      if (res.status === 200) {
        const json = parseJsonSafe(res.body, 'Concierge unauth bodas.net');
        assert(json.action?.type !== 'scraper', 'RBAC violation: emitted action.type === "scraper" to unauthenticated user');
      }
      return `Status ${res.status}, action.type !== scraper`;
    },
  },
  {
    id: 'F6-T1-06',
    tier: 1,
    feature: 'F6',
    title: 'Unauthenticated POST /api/concierge/chat with spoofed routeContext /portal/proveedor never emits scraper',
    run: async (ctx) => {
      const res = await postJson(ctx, '/api/concierge/chat', {
        message: 'Quiero usar el scraper de bodas.net para traslado de escaparate',
        routeContext: { pathname: '/portal/proveedor' },
      });
      assert(res.status === 200 || res.status === 401 || res.status === 403, `Unexpected status ${res.status}`);
      if (res.status === 200) {
        const json = parseJsonSafe(res.body, 'Concierge spoofed pathname');
        assert(
          json.action?.type !== 'scraper',
          'RBAC violation: trusted spoofed routeContext.pathname=/portal/proveedor without auth'
        );
      }
      return `Spoofed pathname rejected cleanly (status ${res.status})`;
    },
  },

  // --- F7 (5 tests) ---
  {
    id: 'F7-T1-01',
    tier: 1,
    feature: 'F7',
    title: 'GET /otzarreta HTML exposes Derio 1902, sarmiento, 120 parking, 200/350 pax, and 145–185 € menus',
    run: async (ctx) => {
      const res = await rawRequest({ baseUrl: ctx.baseUrl, path: '/otzarreta', timeoutMs: ctx.timeoutMs });
      assert(res.status === 200, `Expected 200, got ${res.status}`);
      const visible = stripHtmlComments(res.body);
      for (const fact of ['1902', 'Derio', 'sarmiento', '120', '200', '350', '145', '155', '165', '185']) {
        assert(visible.includes(fact), `/otzarreta HTML missing Otzarreta fact: "${fact}"`);
      }
      return 'All 10 canonical Otzarreta facts present in /otzarreta HTML';
    },
  },
  {
    id: 'F7-T1-02',
    tier: 1,
    feature: 'F7',
    title: 'POST /api/concierge/chat (/otzarreta) menu query returns 145–185 € 4-menu dataset',
    run: async (ctx) => {
      const res = await postJson(ctx, '/api/concierge/chat', {
        message: '¿Qué precios tienen los menús de boda de Otzarreta?',
        providerSlug: 'otzarreta',
        routeContext: { pathname: '/otzarreta' },
      });
      assert(res.status === 200, `Expected 200, got ${res.status}`);
      const json = parseJsonSafe(res.body, 'Concierge menu query');
      assert(json.success === true, 'Expected success: true');
      const reply = String(json.reply || '');
      for (const price of ['145', '155', '165', '185']) {
        assert(reply.includes(price), `Concierge menu reply missing "${price}" €: ${reply.slice(0, 200)}`);
      }
      return 'Concierge menu reply aligned to 145/155/165/185 €';
    },
  },
  {
    id: 'F7-T1-03',
    tier: 1,
    feature: 'F7',
    title: 'POST /api/concierge/chat (/otzarreta) parrilla/history query returns carbón & sarmiento',
    run: async (ctx) => {
      const res = await postJson(ctx, '/api/concierge/chat', {
        message: 'Cuéntame sobre la historia del caserío y la parrilla de brasa',
        providerSlug: 'otzarreta',
        routeContext: { pathname: '/otzarreta' },
      });
      assert(res.status === 200, `Expected 200, got ${res.status}`);
      const json = parseJsonSafe(res.body, 'Concierge parrilla query');
      assert(json.success === true, 'Expected success: true');
      const lower = String(json.reply || '').toLowerCase();
      assert(lower.includes('carbón') || lower.includes('carbon'), `Missing carbón in reply: ${lower.slice(0, 200)}`);
      assert(lower.includes('sarmiento'), `Missing sarmiento in reply: ${lower.slice(0, 200)}`);
      return 'Parrilla reply includes carbón & sarmiento';
    },
  },
  {
    id: 'F7-T1-04',
    tier: 1,
    feature: 'F7',
    title: 'POST /api/concierge/chat (/otzarreta) capacity/parking (200/350/120) & directions (Derio/Maps) queries',
    run: async (ctx) => {
      // Call 1: capacity & parking
      const capRes = await postJson(ctx, '/api/concierge/chat', {
        message: '¿Cuál es el aforo del salón interior y jardín exterior y cuántas plazas de parking tenéis?',
        providerSlug: 'otzarreta',
        routeContext: { pathname: '/otzarreta' },
      });
      assert(capRes.status === 200, `Capacity/parking query expected 200, got ${capRes.status}`);
      const capJson = parseJsonSafe(capRes.body, 'Concierge capacity/parking query');
      assert(capJson.success === true, 'Expected success: true on capacity/parking query');
      assert(capJson.action?.type !== 'scraper', 'RBAC violation: capacity/parking query emitted scraper action');
      const capReply = String(capJson.reply || '');
      for (const token of ['200', '350', '120']) {
        assert(capReply.includes(token), `Concierge capacity/parking reply missing "${token}": ${capReply.slice(0, 220)}`);
      }
      assert(
        capReply.includes('Derio') || capReply.includes('Otzarreta'),
        `Concierge capacity/parking reply missing Derio/Otzarreta: ${capReply.slice(0, 220)}`
      );

      // Call 2: directions
      const dirRes = await postJson(ctx, '/api/concierge/chat', {
        message: '¿Cómo llegar al caserío en Derio?',
        providerSlug: 'otzarreta',
        routeContext: { pathname: '/otzarreta' },
      });
      assert(dirRes.status === 200, `Directions query expected 200, got ${dirRes.status}`);
      const dirJson = parseJsonSafe(dirRes.body, 'Concierge directions query');
      assert(dirJson.success === true, 'Expected success: true on directions query');
      assert(dirJson.action?.type !== 'scraper', 'RBAC violation: directions query emitted scraper action');
      const dirCombined = `${dirJson.reply || ''} ${JSON.stringify(dirJson.action || {})}`;
      for (const token of ['Derio', '120']) {
        assert(dirCombined.includes(token), `Concierge directions reply missing "${token}": ${dirCombined.slice(0, 220)}`);
      }
      assert(
        dirCombined.includes('google.com/maps') || dirCombined.includes('wa.me/34693693048'),
        `Concierge directions response missing Google Maps or WhatsApp link: ${dirCombined.slice(0, 220)}`
      );
      return 'Capacity/parking (200/350/120) + Directions (Derio/120/Maps) verified across 2 calls';
    },
  },
  {
    id: 'F7-T1-05',
    tier: 1,
    feature: 'F7',
    title: 'Public JS chunks referenced by /otzarreta & /celebraciones include es-ES Web Speech API & wa.me/34693693048',
    run: async (ctx) => {
      let combinedAll = '';
      for (const route of ['/otzarreta', '/celebraciones']) {
        const res = await rawRequest({ baseUrl: ctx.baseUrl, path: route, timeoutMs: ctx.timeoutMs });
        assert(res.status === 200, `${route} expected 200, got ${res.status}`);
        const { combinedJs } = await crawlNextChunks({
          baseUrl: ctx.baseUrl,
          html: res.body,
          chunkCache: ctx.chunkCache,
          timeoutMs: ctx.timeoutMs,
        });
        combinedAll += `\n${combinedJs}`;
      }
      assert(combinedAll.includes('speechSynthesis'), 'JS chunks missing speechSynthesis');
      assert(combinedAll.includes('SpeechSynthesisUtterance'), 'JS chunks missing SpeechSynthesisUtterance');
      assert(combinedAll.includes('SpeechRecognition'), 'JS chunks missing SpeechRecognition');
      assert(combinedAll.includes('es-ES'), 'JS chunks missing es-ES locale');
      assert(combinedAll.includes('wa.me/') && combinedAll.includes('34693693048'), 'JS chunks missing wa.me/34693693048');
      return 'Web Speech API (es-ES) + WhatsApp handoff verified in live JS chunks';
    },
  },

  // --- R6 (5 tests) ---
  {
    id: 'R6-T1-01',
    tier: 1,
    feature: 'R6',
    title: 'Raw disk SHA-256 of ear-os-ssot.ts equals 81C7E7B4...458BD',
    run: async () => {
      const ssot = readSsotDiskSnapshot();
      assert(
        ssot.rawSha256 === EXPECTED_RAW_SSOT_SHA256,
        `Raw SHA-256 mismatch: expected ${EXPECTED_RAW_SSOT_SHA256}, got ${ssot.rawSha256}`
      );
      return `Raw SHA-256 ${ssot.rawSha256}`;
    },
  },
  {
    id: 'R6-T1-02',
    tier: 1,
    feature: 'R6',
    title: 'Independent 17-key canonical SHA-256 of ear-os-ssot.ts equals cefa76c2...',
    run: async () => {
      const ssot = readSsotDiskSnapshot();
      assert(
        ssot.canonicalSha256 === EXPECTED_CANONICAL_SSOT_SHA256,
        `Canonical SHA-256 mismatch: expected ${EXPECTED_CANONICAL_SSOT_SHA256}, got ${ssot.canonicalSha256}`
      );
      return `Canonical SHA-256 ${ssot.canonicalSha256}`;
    },
  },
  {
    id: 'R6-T1-03',
    tier: 1,
    feature: 'R6',
    title: 'ssotIntegrityGuard.ts retains KNOWN_GOOD_SSOT_HASH = cefa76c2...',
    run: async () => {
      const ssot = readSsotDiskSnapshot();
      const m = ssot.guardText.match(/KNOWN_GOOD_SSOT_HASH\s*=\s*['"]([0-9a-f]{64})['"]/i);
      assert(m, 'KNOWN_GOOD_SSOT_HASH constant not found in ssotIntegrityGuard.ts');
      assert(m[1] === EXPECTED_CANONICAL_SSOT_SHA256, `Guard hash mismatch: ${m[1]}`);
      return `Guard hash intact (${m[1].slice(0, 12)}...)`;
    },
  },
  {
    id: 'R6-T1-04',
    tier: 1,
    feature: 'R6',
    title: 'All 11+ relational SSOT business invariants pass on ear-os-ssot.ts',
    run: async () => {
      const ssot = readSsotDiskSnapshot();
      const violations = validateCanonicalInvariants(ssot.values);
      assert(violations.length === 0, `SSOT invariant violations: ${violations.join('; ')}`);
      return 'All relational SSOT invariants satisfied';
    },
  },
  {
    id: 'R6-T1-05',
    tier: 1,
    feature: 'R6',
    title: 'Live surfaces (/otzarreta, /calendario/..., /reservar/contrato) expose 100 € & +34 693 693 048',
    run: async (ctx) => {
      const routes = [
        '/otzarreta',
        '/calendario/catering/restaurante-otzarreta?intent=bloquear',
        '/reservar/contrato?proveedor=restaurante-otzarreta',
      ];
      for (const route of routes) {
        const res = await rawRequest({ baseUrl: ctx.baseUrl, path: route, timeoutMs: ctx.timeoutMs });
        assert(res.status === 200, `${route} expected 200, got ${res.status}`);
        const visible = stripHtmlComments(res.body);
        assert(visible.includes('100') && visible.includes('€'), `${route} missing 100 € SSOT deposit`);
        assert(
          visible.includes('+34 693 693 048') || visible.includes('34693693048'),
          `${route} missing +34 693 693 048`
        );
      }
      return 'Live runtime surfaces consistent with Zona Cero SSOT';
    },
  },

  // =========================================================================
  // TIER 2 — BOUNDARY & CORNER CASES (44 tests, >=5 per feature F1–F7, R6)
  // =========================================================================

  // --- F1 (6 tests) ---
  {
    id: 'F1-T2-01',
    tier: 2,
    feature: 'F1',
    title: 'Non-certified /sandbox/ruta-en-taller redirects 307 to /celebraciones with route-gating headers',
    run: async (ctx) => {
      const res = await rawRequest({
        baseUrl: ctx.baseUrl,
        path: '/sandbox/ruta-en-taller',
        headers: { Host: 'www.productoraear.com' },
        timeoutMs: ctx.timeoutMs,
      });
      assert(res.status === 307, `Expected 307, got ${res.status}`);
      assert((res.headers.location || '').endsWith('/celebraciones'), `Expected /celebraciones, got ${res.headers.location}`);
      assert(res.headers['x-ear-route-gating'] === 'redirected-to-certified-route', 'Missing x-ear-route-gating');
      assert(res.headers['x-ear-route-gating-sank'] === '/sandbox/ruta-en-taller', 'Missing x-ear-route-gating-sank');
      return '307 -> /celebraciones with sank header';
    },
  },
  {
    id: 'F1-T2-02',
    tier: 2,
    feature: 'F1',
    title: 'Segmented prefix traps /presupuesto-oculto and /calendario-falso redirect 307 to /celebraciones',
    run: async (ctx) => {
      for (const trap of ['/presupuesto-oculto', '/calendario-falso']) {
        const res = await rawRequest({
          baseUrl: ctx.baseUrl,
          path: trap,
          headers: { Host: 'www.productoraear.com' },
          timeoutMs: ctx.timeoutMs,
        });
        assert(res.status === 307, `${trap} expected 307, got ${res.status}`);
        assert((res.headers.location || '').endsWith('/celebraciones'), `${trap} expected /celebraciones, got ${res.headers.location}`);
        assert(res.headers['x-ear-route-gating'] === 'redirected-to-certified-route', `${trap} missing route-gating header`);
      }
      return 'Prefix boundary traps contained via 307';
    },
  },
  {
    id: 'F1-T2-03',
    tier: 2,
    feature: 'F1',
    title: 'Host fincasparaboda.com blocks /vimume (307, never 200)',
    run: async (ctx) => {
      const res = await rawRequest({
        baseUrl: ctx.baseUrl,
        path: '/vimume',
        headers: { Host: 'fincasparaboda.com' },
        timeoutMs: ctx.timeoutMs,
      });
      assert(res.status === 307, `Expected 307 on fincasparaboda.com /vimume, got ${res.status}`);
      return `307 -> ${res.headers.location}`;
    },
  },
  {
    id: 'F1-T2-04',
    tier: 2,
    feature: 'F1',
    title: 'Host viajemusicalporlamemoria.com blocks /fincas and /artistas (307, x-ear-vertical=vimume)',
    run: async (ctx) => {
      for (const p of ['/fincas', '/artistas']) {
        const res = await rawRequest({
          baseUrl: ctx.baseUrl,
          path: p,
          headers: { Host: 'viajemusicalporlamemoria.com' },
          timeoutMs: ctx.timeoutMs,
        });
        assert(res.status === 307, `${p} on vimume expected 307, got ${res.status}`);
        assert(res.headers['x-ear-vertical'] === 'vimume', `${p} expected x-ear-vertical=vimume, got ${res.headers['x-ear-vertical']}`);
      }
      return 'vimume vertical isolation enforced';
    },
  },
  {
    id: 'F1-T2-05',
    tier: 2,
    feature: 'F1',
    title: 'Invalid calendar segment depth (/calendario/catering, .../extra) never returns 200 or 500',
    run: async (ctx) => {
      for (const badPath of ['/calendario/catering', '/calendario/catering/restaurante-otzarreta/extra']) {
        const res = await rawRequest({
          baseUrl: ctx.baseUrl,
          path: badPath,
          headers: { Host: 'www.productoraear.com' },
          timeoutMs: ctx.timeoutMs,
        });
        assert(res.status !== 200 && res.status !== 500, `${badPath} returned disallowed HTTP ${res.status}`);
      }
      return 'Invalid segment depths handled safely (non-200/non-500)';
    },
  },
  {
    id: 'F1-T2-06',
    tier: 2,
    feature: 'F1',
    title: 'Apex productoraear.com 308 -> https://www.productoraear.com/... & /api/calendar bypasses across verticals',
    run: async (ctx) => {
      const apex = await rawRequest({
        baseUrl: ctx.baseUrl,
        path: '/calendario/catering/restaurante-otzarreta',
        headers: { Host: 'productoraear.com' },
        timeoutMs: ctx.timeoutMs,
      });
      assert(apex.status === 308 || apex.status === 301, `Apex host expected 308/301, got ${apex.status}`);
      assert(
        (apex.headers.location || '').startsWith('https://www.productoraear.com/'),
        `Expected location https://www.productoraear.com/..., got ${apex.headers.location}`
      );

      for (const host of ['fincasparaboda.com', 'viajemusicalporlamemoria.com']) {
        const api = await rawRequest({
          baseUrl: ctx.baseUrl,
          path: '/api/calendar/catering/restaurante-otzarreta',
          headers: { Host: host },
          timeoutMs: ctx.timeoutMs,
        });
        assert(api.status === 200, `${host} API bypass expected 200, got ${api.status}`);
        const json = parseJsonSafe(api.body, `API bypass ${host}`);
        assert(json.ok === true, `${host} API expected ok: true`);
      }
      return 'Apex 308 + API bypass verified';
    },
  },

  // --- F2 (6 tests) ---
  {
    id: 'F2-T2-01',
    tier: 2,
    feature: 'F2',
    title: 'Repeated/XSS intent params (?intent=hack&intent=<script>...) ignored without Modo bloqueo or raw reflection',
    run: async (ctx) => {
      const res = await rawRequest({
        baseUrl: ctx.baseUrl,
        path: '/calendario/catering/restaurante-otzarreta?intent=hack&intent=%3Cscript%3Ealert(1)%3C%2Fscript%3E',
        timeoutMs: ctx.timeoutMs,
      });
      assert(res.status === 200, `Expected 200, got ${res.status}`);
      assert(!htmlContainsRawOrVisible(res.body, 'Modo bloqueo'), 'Invalid/XSS intent triggered Modo bloqueo');
      assert(!htmlContainsRawOrVisible(res.body, '<script>alert(1)</script>'), 'Unescaped XSS script reflected in HTML');
      return 'XSS/invalid intent sanitized deterministically';
    },
  },
  {
    id: 'F2-T2-02',
    tier: 2,
    feature: 'F2',
    title: 'Anonymous POST /api/calendar/catering/restaurante-otzarreta returns 403 fail-closed',
    run: async (ctx) => {
      const res = await postJson(ctx, '/api/calendar/catering/restaurante-otzarreta', {
        action: 'block',
        date: '2027-06-15',
      });
      assert(res.status === 403, `Expected 403 on anonymous calendar mutation, got ${res.status}`);
      return 'HTTP 403 fail-closed enforced';
    },
  },
  {
    id: 'F2-T2-03',
    tier: 2,
    feature: 'F2',
    title: 'Cross-tenant cookie ear_vendor_session={"vendorSlug":"otro-proveedor"} returns 403',
    run: async (ctx) => {
      const res = await postJson(
        ctx,
        '/api/calendar/catering/restaurante-otzarreta',
        { action: 'block', date: '2027-06-15' },
        { Cookie: 'ear_vendor_session={"vendorSlug":"otro-proveedor"}' }
      );
      assert(res.status === 403, `Expected 403 for cross-tenant vendor cookie, got ${res.status}`);
      return 'Cross-tenant cookie rejected (403)';
    },
  },
  {
    id: 'F2-T2-04',
    tier: 2,
    feature: 'F2',
    title: 'Invalid entity kind rejected (404 page, 400 API)',
    run: async (ctx) => {
      const page = await rawRequest({
        baseUrl: ctx.baseUrl,
        path: '/calendario/invalid-kind-xyz/restaurante-otzarreta',
        timeoutMs: ctx.timeoutMs,
      });
      assert(page.status === 404, `Invalid kind page expected 404, got ${page.status}`);

      const api = await rawRequest({
        baseUrl: ctx.baseUrl,
        path: '/api/calendar/invalid-kind-xyz/restaurante-otzarreta',
        timeoutMs: ctx.timeoutMs,
      });
      assert(api.status === 400, `Invalid kind API expected 400, got ${api.status}`);
      return 'Invalid kind -> 404 page / 400 API';
    },
  },
  {
    id: 'F2-T2-05',
    tier: 2,
    feature: 'F2',
    title: 'Path traversal and unsafe slugs rejected cleanly (400 / non-200 / non-500)',
    run: async (ctx) => {
      const badSlug = await rawRequest({
        baseUrl: ctx.baseUrl,
        path: '/api/calendar/catering/slug_con_espacios!',
        timeoutMs: ctx.timeoutMs,
      });
      assert(badSlug.status === 400, `Unsafe slug expected 400, got ${badSlug.status}`);

      const trav = await rawRequest({
        baseUrl: ctx.baseUrl,
        path: '/api/calendar/catering/..%2F..%2Fetc',
        timeoutMs: ctx.timeoutMs,
      });
      assert(trav.status === 400 || trav.status === 404, `Traversal slug expected 400/404, got ${trav.status}`);
      return 'Unsafe slug & traversal rejected';
    },
  },
  {
    id: 'F2-T2-06',
    tier: 2,
    feature: 'F2',
    title: 'Malformed date/slot/intent query params degrade gracefully to HTTP 200 without 500',
    run: async (ctx) => {
      const res = await rawRequest({
        baseUrl: ctx.baseUrl,
        path: '/calendario/catering/restaurante-otzarreta?date=not-a-date&slot=99:99&intent=unknown',
        timeoutMs: ctx.timeoutMs,
      });
      assert(res.status === 200, `Expected 200 safe fallback, got ${res.status}`);
      assert(!htmlContainsRawOrVisible(res.body, 'Modo bloqueo'), 'Unknown intent activated Modo bloqueo');
      assert(!htmlContainsRawOrVisible(res.body, '__next_error__'), 'SSR error boundary triggered');
      return 'Malformed query tolerated safely (HTTP 200)';
    },
  },

  // --- F3 (6 tests) ---
  {
    id: 'F3-T2-01',
    tier: 2,
    feature: 'F3',
    title: 'Deposit POST with malformed JSON returns 400 (never 500)',
    run: async (ctx) => {
      const res = await rawRequest({
        baseUrl: ctx.baseUrl,
        path: '/api/calendar/catering/restaurante-otzarreta/deposit',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: '{bad json',
        timeoutMs: ctx.timeoutMs,
      });
      assert(res.status === 400, `Expected 400 on malformed JSON, got ${res.status}`);
      return 'Malformed JSON -> 400';
    },
  },
  {
    id: 'F3-T2-02',
    tier: 2,
    feature: 'F3',
    title: 'Deposit POST with invalid calendar eventDate (2027-02-31, 21-08-2027) returns 400',
    run: async (ctx) => {
      for (const badDate of ['2027-02-31', '21-08-2027']) {
        const res = await postJson(ctx, '/api/calendar/catering/restaurante-otzarreta/deposit', {
          eventDate: badDate,
          clientName: 'Test E2E',
          clientEmail: 'e2e@productoraear.com',
          idempotencyKey: 'e2e_key_12345678',
        });
        assert(res.status === 400, `eventDate=${badDate} expected 400, got ${res.status}`);
      }
      return 'Invalid dates -> 400';
    },
  },
  {
    id: 'F3-T2-03',
    tier: 2,
    feature: 'F3',
    title: 'Deposit POST with invalid clientEmail returns 400',
    run: async (ctx) => {
      const res = await postJson(ctx, '/api/calendar/catering/restaurante-otzarreta/deposit', {
        eventDate: '2027-08-21',
        clientName: 'Test E2E',
        clientEmail: 'not-an-email',
        idempotencyKey: 'e2e_key_12345678',
      });
      assert(res.status === 400, `Invalid email expected 400, got ${res.status}`);
      return 'Invalid email -> 400';
    },
  },
  {
    id: 'F3-T2-04',
    tier: 2,
    feature: 'F3',
    title: 'Deposit POST idempotencyKey length boundary (<8 and >128) returns 400',
    run: async (ctx) => {
      for (const badKey of ['short', 'x'.repeat(129)]) {
        const res = await postJson(ctx, '/api/calendar/catering/restaurante-otzarreta/deposit', {
          eventDate: '2027-08-21',
          clientName: 'Test E2E',
          clientEmail: 'e2e@productoraear.com',
          idempotencyKey: badKey,
        });
        assert(res.status === 400, `idempotencyKey len=${badKey.length} expected 400, got ${res.status}`);
      }
      return 'idempotencyKey boundary lengths -> 400';
    },
  },
  {
    id: 'F3-T2-05',
    tier: 2,
    feature: 'F3',
    title: 'Deposit POST rejects invalid kind, invalid timeSlot (25:99), and invalid intent with 400',
    run: async (ctx) => {
      const badKind = await postJson(ctx, '/api/calendar/invalid/restaurante-otzarreta/deposit', {
        eventDate: '2027-08-21',
        clientName: 'Test E2E',
        clientEmail: 'e2e@productoraear.com',
        idempotencyKey: 'e2e_key_12345678',
      });
      assert(badKind.status === 400, `Invalid kind deposit expected 400, got ${badKind.status}`);

      const badSlot = await postJson(ctx, '/api/calendar/catering/restaurante-otzarreta/deposit', {
        eventDate: '2027-08-21',
        timeSlot: '25:99',
        clientName: 'Test E2E',
        clientEmail: 'e2e@productoraear.com',
        idempotencyKey: 'e2e_key_12345678',
      });
      assert(badSlot.status === 400, `Invalid timeSlot expected 400, got ${badSlot.status}`);

      const badIntent = await postJson(ctx, '/api/calendar/catering/restaurante-otzarreta/deposit', {
        eventDate: '2027-08-21',
        intent: 'invalid',
        clientName: 'Test E2E',
        clientEmail: 'e2e@productoraear.com',
        idempotencyKey: 'e2e_key_12345678',
      });
      assert(badIntent.status === 400, `Invalid intent expected 400, got ${badIntent.status}`);
      return 'Invalid kind/timeSlot/intent -> 400';
    },
  },
  {
    id: 'F3-T2-06',
    tier: 2,
    feature: 'F3',
    title: 'POST /api/stripe/webhook rejects forged stripe-signature (400 or 503, never 200)',
    run: async (ctx) => {
      const res = await postJson(
        ctx,
        '/api/stripe/webhook',
        {
          id: 'evt_forged_123',
          type: 'checkout.session.completed',
          data: { object: { metadata: { tipo: 'CALENDAR_ENTITY_DEPOSIT_100' } } },
        },
        { 'stripe-signature': 't=1700000000,v1=deadbeefdeadbeefdeadbeefdeadbeef' }
      );
      assert(res.status === 400 || res.status === 503, `Forged webhook signature expected 400/503, got ${res.status}`);
      return `Forged signature rejected (${res.status})`;
    },
  },

  // --- F4 (5 tests) ---
  {
    id: 'F4-T2-01',
    tier: 2,
    feature: 'F4',
    title: 'Zero banned/personal/typo/dummy phone numbers across public SSR HTML pages',
    run: async (ctx) => {
      const routes = ['/', '/celebraciones', '/proveedores', '/proveedores?cat=finca', '/otzarreta', '/calendario/catering/restaurante-otzarreta'];
      for (const route of routes) {
        const res = await rawRequest({ baseUrl: ctx.baseUrl, path: route, timeoutMs: ctx.timeoutMs });
        assert(res.status === 200, `${route} expected 200, got ${res.status}`);
        const hits = findBannedPhonesInHtml(res.body);
        assert(hits.length === 0, `Banned phone pattern(s) in ${route}: ${hits.join(', ')}`);
      }
      return `0 banned phones across ${routes.length} public pages`;
    },
  },
  {
    id: 'F4-T2-02',
    tier: 2,
    feature: 'F4',
    title: 'Zero google.com/search?q=...telefono bypass links in public DOM',
    run: async (ctx) => {
      const routes = ['/', '/celebraciones', '/proveedores', '/proveedores?cat=finca', '/otzarreta'];
      for (const route of routes) {
        const res = await rawRequest({ baseUrl: ctx.baseUrl, path: route, timeoutMs: ctx.timeoutMs });
        assert(res.status === 200, `${route} expected 200, got ${res.status}`);
        assert(!hasGooglePhoneSearchLink(res.body), `Found google.com/search telefono bypass link in ${route}`);
      }
      return 'Zero Google phone-search bypass links in public DOM';
    },
  },
  {
    id: 'F4-T2-03',
    tier: 2,
    feature: 'F4',
    title: 'GET /api/profiles/search?category=musica&limit=24 contains zero banned phone numbers',
    run: async (ctx) => {
      const res = await rawRequest({
        baseUrl: ctx.baseUrl,
        path: '/api/profiles/search?category=musica&limit=24',
        timeoutMs: ctx.timeoutMs,
      });
      assert(res.status === 200, `Expected 200, got ${res.status}`);
      const json = parseJsonSafe(res.body, 'Search musica');
      const items = json.providers || json.items || [];
      for (const item of items) {
        const phoneStr = `${item.phone || ''} ${item.telephone || ''}`;
        for (const digits of BANNED_API_PHONE_DIGITS) {
          assert(!phoneStr.includes(digits), `Banned digits ${digits} in musica API item ${item.slug || item.name}`);
        }
      }
      return `Checked ${items.length} musica API records`;
    },
  },
  {
    id: 'F4-T2-04',
    tier: 2,
    feature: 'F4',
    title: 'POST /api/concierge/chat responses contain zero banned/dummy phone numbers',
    run: async (ctx) => {
      const res = await postJson(ctx, '/api/concierge/chat', {
        message: '¿Cuál es el teléfono de contacto oficial para contratar?',
        routeContext: { pathname: '/celebraciones' },
      });
      assert(res.status === 200, `Expected 200, got ${res.status}`);
      const serialized = res.body;
      const hits = findBannedPhoneOccurrences(serialized);
      assert(hits.length === 0, `Banned phone in concierge response: ${hits.join(', ')}`);
      return 'Concierge response phone hygiene verified';
    },
  },
  {
    id: 'F4-T2-05',
    tier: 2,
    feature: 'F4',
    title: 'Alternate public routes (/gobiernos, /profesionales) enforce phone hygiene',
    run: async (ctx) => {
      for (const route of ['/gobiernos', '/profesionales']) {
        const res = await rawRequest({ baseUrl: ctx.baseUrl, path: route, timeoutMs: ctx.timeoutMs });
        assert(res.status === 200, `${route} expected 200, got ${res.status}`);
        const hits = findBannedPhonesInHtml(res.body);
        assert(hits.length === 0, `Banned phone in ${route}: ${hits.join(', ')}`);
      }
      return '/gobiernos & /profesionales phone hygiene verified';
    },
  },

  // --- F5 (5 tests) ---
  {
    id: 'F5-T2-01',
    tier: 2,
    feature: 'F5',
    title: '/proveedores?cat=finca and ?cat=fincas omit client-only loading spinner fallbacks',
    run: async (ctx) => {
      for (const route of ['/proveedores?cat=finca', '/proveedores?cat=fincas']) {
        const res = await rawRequest({ baseUrl: ctx.baseUrl, path: route, timeoutMs: ctx.timeoutMs });
        assert(res.status === 200, `${route} expected 200, got ${res.status}`);
        const spinners = findBannedMarkersInHtml(res.body, SPINNER_FALLBACK_MARKERS);
        assert(spinners.length === 0, `${route} rendered client loading fallback: ${spinners.join(', ')}`);
      }
      return 'Zero-CLS SSR confirmed (0 spinner fallbacks)';
    },
  },
  {
    id: 'F5-T2-02',
    tier: 2,
    feature: 'F5',
    title: '/proveedores?cat=finca enforces catalog isolation (no Edwin Agudelo / e78903 leakage)',
    run: async (ctx) => {
      const res = await rawRequest({
        baseUrl: ctx.baseUrl,
        path: '/proveedores?cat=finca',
        timeoutMs: ctx.timeoutMs,
      });
      assert(res.status === 200, `Expected 200, got ${res.status}`);
      for (const token of ['Edwin Agudelo', 'prov-ear-sovereign-01', 'e78903']) {
        assert(!htmlContainsRawOrVisible(res.body, token), `Catalog isolation violation: ${token} appeared in /proveedores?cat=finca`);
      }
      return 'Catalog isolation verified for cat=finca';
    },
  },
  {
    id: 'F5-T2-03',
    tier: 2,
    feature: 'F5',
    title: 'GET /proveedores?cat=unknown returns HTTP 200 gracefully without crash or spinner',
    run: async (ctx) => {
      const res = await rawRequest({
        baseUrl: ctx.baseUrl,
        path: '/proveedores?cat=unknown',
        timeoutMs: ctx.timeoutMs,
      });
      assert(res.status === 200, `Expected 200 on unknown cat, got ${res.status}`);
      assert(!htmlContainsRawOrVisible(res.body, 'Application error'), 'Application error found in unknown cat HTML');
      assert(!htmlContainsRawOrVisible(res.body, '__next_error__'), '__next_error__ found in unknown cat HTML');
      const spinners = findBannedMarkersInHtml(res.body, SPINNER_FALLBACK_MARKERS);
      assert(spinners.length === 0, `Spinner fallback found on unknown cat: ${spinners.join(', ')}`);
      return 'Graceful HTTP 200 on ?cat=unknown';
    },
  },
  {
    id: 'F5-T2-04',
    tier: 2,
    feature: 'F5',
    title: 'GET /api/profiles/search?category=unknown&limit=10 returns 200 JSON success:true',
    run: async (ctx) => {
      const res = await rawRequest({
        baseUrl: ctx.baseUrl,
        path: '/api/profiles/search?category=unknown&limit=10',
        timeoutMs: ctx.timeoutMs,
      });
      assert(res.status === 200, `Expected 200, got ${res.status}`);
      const json = parseJsonSafe(res.body, 'Search category=unknown');
      assert(json.success === true, 'Expected success: true');
      assert(Array.isArray(json.providers), 'Expected providers array');
      return `HTTP 200 JSON (providers=${json.providers.length})`;
    },
  },
  {
    id: 'F5-T2-05',
    tier: 2,
    feature: 'F5',
    title: 'GET /proveedores?cat=finca&provincia=Bizkaia filters cleanly without 500 or spinner',
    run: async (ctx) => {
      const res = await rawRequest({
        baseUrl: ctx.baseUrl,
        path: '/proveedores?cat=finca&provincia=Bizkaia',
        timeoutMs: ctx.timeoutMs,
      });
      assert(res.status === 200, `Expected 200, got ${res.status}`);
      assert(!htmlContainsRawOrVisible(res.body, '__next_error__'), 'SSR error boundary triggered on Bizkaia filter');
      const spinners = findBannedMarkersInHtml(res.body, SPINNER_FALLBACK_MARKERS);
      assert(spinners.length === 0, `Spinner fallback rendered on Bizkaia filter: ${spinners.join(', ')}`);
      return 'SSR Bizkaia province filter clean';
    },
  },

  // --- F6 (6 tests) ---
  {
    id: 'F6-T2-01',
    tier: 2,
    feature: 'F6',
    title: 'Forged Authorization Bearer & __session cookie rejected across /admin, /portal/proveedor, /api/concierge/chat',
    run: async (ctx) => {
      const forgedHeaders = {
        Authorization: 'Bearer forged-jwt-token',
        Cookie: '__session=forged-session-value',
      };
      const admin = await rawRequest({ baseUrl: ctx.baseUrl, path: '/admin', headers: forgedHeaders, timeoutMs: ctx.timeoutMs });
      assert(admin.status === 307 || admin.status === 308, `/admin accepted forged Bearer/__session (${admin.status})`);

      const portal = await rawRequest({ baseUrl: ctx.baseUrl, path: '/portal/proveedor', headers: forgedHeaders, timeoutMs: ctx.timeoutMs });
      assert(
        portal.status === 200 || portal.status === 307 || portal.status === 308,
        `/portal/proveedor unexpected status ${portal.status} with forged Bearer/__session`
      );
      if (portal.status === 200) {
        const portalVisible = stripHtmlComments(portal.body);
        assert(portalVisible.includes('Acceso restringido a proveedores'), 'Portal bypassed with forged Bearer/__session');
        assert(findBannedMarkersInHtml(portal.body, ALL_BANNED_F6_MARKERS).length === 0, 'Portal leaked cockpit markers');
      }

      const chat = await postJson(
        ctx,
        '/api/concierge/chat',
        { message: 'bodas.net scraper traslado', routeContext: { pathname: '/portal/proveedor' } },
        forgedHeaders
      );
      assert(
        chat.status === 200 || chat.status === 401 || chat.status === 403,
        `/api/concierge/chat unexpected status ${chat.status} with forged Bearer/__session`
      );
      if (chat.status === 200) {
        const json = parseJsonSafe(chat.body, 'Forged Bearer chat');
        assert(json.action?.type !== 'scraper', 'Chat emitted scraper with forged Bearer/__session');
      }
      return 'Forged Bearer/__session rejected across all surfaces';
    },
  },
  {
    id: 'F6-T2-02',
    tier: 2,
    feature: 'F6',
    title: 'Forged spoofing headers (x-ear-admin, x-forwarded-user, x-ear-role) rejected',
    run: async (ctx) => {
      const spoofHeaders = {
        'x-ear-admin': 'true',
        'x-forwarded-user': 'admin',
        'x-ear-role': 'admin',
      };
      const admin = await rawRequest({ baseUrl: ctx.baseUrl, path: '/admin', headers: spoofHeaders, timeoutMs: ctx.timeoutMs });
      assert(admin.status === 307 || admin.status === 308, `/admin trusted spoofed headers (${admin.status})`);

      const portal = await rawRequest({ baseUrl: ctx.baseUrl, path: '/portal/proveedor', headers: spoofHeaders, timeoutMs: ctx.timeoutMs });
      assert(
        portal.status === 200 || portal.status === 307 || portal.status === 308,
        `/portal/proveedor unexpected status ${portal.status} with spoofed headers`
      );
      if (portal.status === 200) {
        const portalVisible = stripHtmlComments(portal.body);
        assert(portalVisible.includes('Acceso restringido a proveedores'), 'Portal trusted spoofed x-ear-* headers');
        assert(findBannedMarkersInHtml(portal.body, ALL_BANNED_F6_MARKERS).length === 0, 'Portal leaked cockpit on spoofed headers');
      }

      const chat = await postJson(
        ctx,
        '/api/concierge/chat',
        { message: 'bodas.net scraper escaparate', routeContext: { pathname: '/portal/proveedor' } },
        spoofHeaders
      );
      assert(
        chat.status === 200 || chat.status === 401 || chat.status === 403,
        `/api/concierge/chat unexpected status ${chat.status} with spoofed headers`
      );
      if (chat.status === 200) {
        const json = parseJsonSafe(chat.body, 'Spoofed header chat');
        assert(json.action?.type !== 'scraper', 'Chat emitted scraper on spoofed x-ear-admin header');
      }
      return 'Spoofed admin headers rejected';
    },
  },
  {
    id: 'F6-T2-03',
    tier: 2,
    feature: 'F6',
    title: 'Forged ear_admin_token=forged-token cookie without valid server token rejected',
    run: async (ctx) => {
      const hdrs = { Cookie: 'ear_admin_token=forged-token-123' };
      const admin = await rawRequest({ baseUrl: ctx.baseUrl, path: '/admin', headers: hdrs, timeoutMs: ctx.timeoutMs });
      assert(admin.status === 307 || admin.status === 308, `/admin accepted forged ear_admin_token (${admin.status})`);

      const portal = await rawRequest({ baseUrl: ctx.baseUrl, path: '/portal/proveedor', headers: hdrs, timeoutMs: ctx.timeoutMs });
      assert(
        portal.status === 200 || portal.status === 307 || portal.status === 308,
        `/portal/proveedor unexpected status ${portal.status} with forged ear_admin_token`
      );
      if (portal.status === 200) {
        const portalVisible = stripHtmlComments(portal.body);
        assert(portalVisible.includes('Acceso restringido a proveedores'), 'Portal accepted forged ear_admin_token');
        assert(findBannedMarkersInHtml(portal.body, ALL_BANNED_F6_MARKERS).length === 0, 'Portal leaked cockpit on forged ear_admin_token');
      }

      const chat = await postJson(
        ctx,
        '/api/concierge/chat',
        { message: 'bodas.net scraper traslado', routeContext: { pathname: '/portal/proveedor' } },
        hdrs
      );
      assert(
        chat.status === 200 || chat.status === 401 || chat.status === 403,
        `/api/concierge/chat unexpected status ${chat.status} with forged ear_admin_token`
      );
      if (chat.status === 200) {
        const json = parseJsonSafe(chat.body, 'Forged ear_admin_token chat');
        assert(json.action?.type !== 'scraper', 'Chat emitted scraper on forged ear_admin_token');
      }
      return 'Forged ear_admin_token rejected';
    },
  },
  {
    id: 'F6-T2-04',
    tier: 2,
    feature: 'F6',
    title: 'Forged unsigned ear_vendor_session={"vendorSlug":"eduardo-martinez"} rejected on /portal/proveedor & chat',
    run: async (ctx) => {
      const hdrs = { Cookie: 'ear_vendor_session={"vendorSlug":"eduardo-martinez"}' };
      const portal = await rawRequest({ baseUrl: ctx.baseUrl, path: '/portal/proveedor', headers: hdrs, timeoutMs: ctx.timeoutMs });
      assert(
        portal.status === 200 || portal.status === 307 || portal.status === 308,
        `/portal/proveedor unexpected status ${portal.status} with unsigned vendor cookie`
      );
      if (portal.status === 200) {
        const portalVisible = stripHtmlComments(portal.body);
        assert(portalVisible.includes('Acceso restringido a proveedores'), 'Portal accepted unsigned ear_vendor_session');
        assert(findBannedMarkersInHtml(portal.body, ALL_BANNED_F6_MARKERS).length === 0, 'Portal leaked cockpit on unsigned vendor cookie');
      }
      const chat = await postJson(
        ctx,
        '/api/concierge/chat',
        { message: 'bodas.net scraper traslado', routeContext: { pathname: '/portal/proveedor' } },
        hdrs
      );
      assert(
        chat.status === 200 || chat.status === 401 || chat.status === 403,
        `/api/concierge/chat unexpected status ${chat.status} with unsigned vendor cookie`
      );
      if (chat.status === 200) {
        const json = parseJsonSafe(chat.body, 'Unsigned vendor cookie chat');
        assert(json.action?.type !== 'scraper', 'Chat emitted scraper on unsigned vendor cookie');
      }
      return 'Unsigned vendor session rejected';
    },
  },
  {
    id: 'F6-T2-05',
    tier: 2,
    feature: 'F6',
    title: 'Malformed Cookie header & oversized message body on /api/concierge/chat fail cleanly (non-500, non-scraper)',
    run: async (ctx) => {
      const oversized = await postJson(
        ctx,
        '/api/concierge/chat',
        { message: 'a'.repeat(25000), routeContext: { pathname: '/portal/proveedor' } },
        { Cookie: ';;;malformed==cookie;;;' }
      );
      assert(
        [200, 400, 401, 403, 413, 422].includes(oversized.status),
        `Concierge returned disallowed status ${oversized.status} on oversized/malformed cookie request`
      );
      if (oversized.status === 200) {
        const json = parseJsonSafe(oversized.body, 'Oversized chat');
        assert(json.action?.type !== 'scraper', 'Oversized chat emitted scraper');
      }
      return `Clean status ${oversized.status}`;
    },
  },
  {
    id: 'F6-T2-06',
    tier: 2,
    feature: 'F6',
    title: 'Unauthenticated /admin/command-center redirects 307 and never leaks OmniAgentConsoleModal or cockpit',
    run: async (ctx) => {
      const res = await rawRequest({
        baseUrl: ctx.baseUrl,
        path: '/admin/command-center',
        timeoutMs: ctx.timeoutMs,
      });
      assert(res.status === 307 || res.status === 308, `/admin/command-center expected 307/308, got ${res.status}`);
      assert((res.headers.location || '').includes('/login'), `Expected /login redirect, got ${res.headers.location}`);
      assert(findBannedMarkersInHtml(res.body, ALL_BANNED_F6_MARKERS).length === 0, 'Redirect body leaked banned markers');
      return `HTTP ${res.status} -> ${res.headers.location}`;
    },
  },

  // --- F7 (5 tests) ---
  {
    id: 'F7-T2-01',
    tier: 2,
    feature: 'F7',
    title: 'GET /otzarreta omits derogated 2026 copy (7 menús, desde 100 €, 123,40 €, 142,50 €, 173 €) & Zarautz',
    run: async (ctx) => {
      const res = await rawRequest({ baseUrl: ctx.baseUrl, path: '/otzarreta', timeoutMs: ctx.timeoutMs });
      assert(res.status === 200, `Expected 200, got ${res.status}`);
      const hits = findBannedMarkersInHtml(res.body, DEROGATED_OTZARRETA_2026_MARKERS);
      assert(hits.length === 0, `Derogated copy in /otzarreta: ${hits.join(', ')}`);
      return 'Zero derogated 2026 copy or Zarautz in /otzarreta';
    },
  },
  {
    id: 'F7-T2-02',
    tier: 2,
    feature: 'F7',
    title: 'POST /api/concierge/chat Otzarreta menu query omits derogated 2026 prices & Edwin Agudelo',
    run: async (ctx) => {
      const res = await postJson(ctx, '/api/concierge/chat', {
        message: 'Dame la lista de menús de gala de Otzarreta',
        providerSlug: 'otzarreta',
        routeContext: { pathname: '/otzarreta' },
      });
      assert(res.status === 200, `Expected 200, got ${res.status}`);
      const json = parseJsonSafe(res.body, 'Concierge Otzarreta menu negative');
      const reply = String(json.reply || '');
      const hits = findBannedMarkers(reply, DEROGATED_OTZARRETA_2026_MARKERS);
      assert(hits.length === 0, `Derogated copy in concierge reply: ${hits.join(', ')}`);
      assert(!reply.includes('Edwin Agudelo'), `Tenant isolation violation: Edwin Agudelo mentioned in Otzarreta menu reply`);
      return 'Concierge reply clean of 2026 copy & Edwin leakage';
    },
  },
  {
    id: 'F7-T2-03',
    tier: 2,
    feature: 'F7',
    title: 'POST /api/concierge/chat rejects empty {} and empty message "" with HTTP 400',
    run: async (ctx) => {
      for (const badBody of [{}, { message: '' }]) {
        const res = await postJson(ctx, '/api/concierge/chat', badBody);
        assert(res.status === 400, `Expected 400 for ${JSON.stringify(badBody)}, got ${res.status}`);
        const json = parseJsonSafe(res.body, 'Concierge 400');
        assert(json.success === false, 'Expected success: false on 400');
      }
      return 'Empty payload & message rejected with 400';
    },
  },
  {
    id: 'F7-T2-04',
    tier: 2,
    feature: 'F7',
    title: 'POST /api/concierge/chat rejects malformed JSON with HTTP 400 (never 500)',
    run: async (ctx) => {
      const res = await rawRequest({
        baseUrl: ctx.baseUrl,
        path: '/api/concierge/chat',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: '{malformed json',
        timeoutMs: ctx.timeoutMs,
      });
      assert(res.status === 400 || res.status === 422, `Expected 400 on malformed JSON, got ${res.status}`);
      return `Malformed JSON -> ${res.status}`;
    },
  },
  {
    id: 'F7-T2-05',
    tier: 2,
    feature: 'F7',
    title: 'POST /api/concierge/chat Otzarreta greeting/booking context produces wa.me/34693693048 without scraper',
    run: async (ctx) => {
      const res = await postJson(ctx, '/api/concierge/chat', {
        message: 'Hola, quiero hablar con alguien para consultar fecha en Otzarreta',
        providerSlug: 'otzarreta',
        routeContext: { pathname: '/otzarreta' },
      });
      assert(res.status === 200, `Expected 200, got ${res.status}`);
      const json = parseJsonSafe(res.body, 'Concierge greeting');
      assert(json.action?.type !== 'scraper', 'Unexpected scraper action on greeting');
      const serialized = JSON.stringify(json);
      assert(
        serialized.includes('wa.me/34693693048') || serialized.includes('/calendario/catering/restaurante-otzarreta') || serialized.includes('/otzarreta'),
        'Expected WhatsApp or Otzarreta booking action'
      );
      return `Action type=${json.action?.type || 'none'}`;
    },
  },

  // --- R6 (5 tests) ---
  {
    id: 'R6-T2-01',
    tier: 2,
    feature: 'R6',
    title: 'Tamper detection: mutating DEPOSITO_STRIPE_EUR (100 -> 99.99) invalidates canonical hash',
    run: async () => {
      const ssot = readSsotDiskSnapshot();
      const mutated = { ...ssot.values, DEPOSITO_STRIPE_EUR: 99.99 };
      const { hash } = computeCanonicalHashFromValues(mutated);
      assert(hash !== EXPECTED_CANONICAL_SSOT_SHA256, 'Tamper check failed: mutated deposit produced identical hash');
      const violations = validateCanonicalInvariants(mutated);
      assert(violations.length > 0, 'Invariant check failed to detect mutated deposit');
      return `Tamper detected (hash=${hash.slice(0, 12)}..., violations=${violations.length})`;
    },
  },
  {
    id: 'R6-T2-02',
    tier: 2,
    feature: 'R6',
    title: 'Tamper detection: mutating SPLIT_SOBERANO.artista or CENTRALITA_EAR_OS invalidates hash & invariants',
    run: async () => {
      const ssot = readSsotDiskSnapshot();
      const mutatedSplitHash = {
        ...ssot.values,
        SPLIT_SOBERANO: { ...ssot.values.SPLIT_SOBERANO, artista: 0.7999 },
      };
      assert(computeCanonicalHashFromValues(mutatedSplitHash).hash !== EXPECTED_CANONICAL_SSOT_SHA256, 'Split 0.7999 hash tamper undetected');

      const mutatedSplitInvariant = {
        ...ssot.values,
        SPLIT_SOBERANO: { ...ssot.values.SPLIT_SOBERANO, artista: 0.799 },
      };
      assert(validateCanonicalInvariants(mutatedSplitInvariant).length > 0, 'Split invariant failed to flag 0.799');

      const mutatedPhone = { ...ssot.values, CENTRALITA_EAR_OS: '+34 693 693 049' };
      assert(computeCanonicalHashFromValues(mutatedPhone).hash !== EXPECTED_CANONICAL_SSOT_SHA256, 'Phone tamper undetected');
      assert(validateCanonicalInvariants(mutatedPhone).length > 0, 'Phone invariant failed to flag +34 693 693 049');
      return 'Split & phone tamper sensitivity verified';
    },
  },
  {
    id: 'R6-T2-03',
    tier: 2,
    feature: 'R6',
    title: 'Raw byte tamper detection: appending 1 byte (\\n) changes SHA-256 != 81C7E7B4...',
    run: async () => {
      const ssot = readSsotDiskSnapshot();
      const tamperedBytes = Buffer.concat([ssot.rawBytes, Buffer.from('\n', 'utf8')]);
      const tamperedHash = crypto.createHash('sha256').update(tamperedBytes).digest('hex').toUpperCase();
      assert(tamperedHash !== EXPECTED_RAW_SSOT_SHA256, 'Raw byte tamper sensitivity failed');
      return `Appended newline shifted raw SHA-256 to ${tamperedHash.slice(0, 12)}...`;
    },
  },
  {
    id: 'R6-T2-04',
    tier: 2,
    feature: 'R6',
    title: 'ear-os-ssot.ts exports all 17 canonical + 6 companion keys and guard uses real SHA-256',
    run: async () => {
      const ssot = readSsotDiskSnapshot();
      for (const k of [...CANONICAL_17_KEYS, ...SSOT_COMPANION_EXPORTS]) {
        assert(ssot.rawText.includes(k), `ear-os-ssot.ts missing expected export ${k}`);
      }
      assert(!/00000000|placeholder|dummy|changeme/i.test(ssot.guardText), 'ssotIntegrityGuard.ts contains placeholder hash string');
      return 'All 23 SSOT symbols + non-placeholder guard verified';
    },
  },
  {
    id: 'R6-T2-05',
    tier: 2,
    feature: 'R6',
    title: 'ssotIntegrityGuard.ts canonicalizeSsot key set matches independent 17-key SHA-256 computation',
    run: async () => {
      const ssot = readSsotDiskSnapshot();
      for (const k of CANONICAL_17_KEYS) {
        assert(ssot.guardText.includes(`${k}:`), `ssotIntegrityGuard.ts missing canonical key ${k}`);
      }
      assert(ssot.canonicalSha256 === EXPECTED_CANONICAL_SSOT_SHA256, 'Canonical hash mismatch');
      return 'Independent canonicalizer matches ssotIntegrityGuard.ts';
    },
  },

  // =========================================================================
  // TIER 3 — CROSS-FEATURE PAIRWISE COMBINATIONS (10 tests)
  // =========================================================================

  {
    id: 'T3-01',
    tier: 3,
    feature: 'F1×F2',
    title: 'T3-01 (F1×F2): Host fincasparaboda.com on /calendario/catering/restaurante-otzarreta?intent=bloquear renders public Modo bloqueo + 100 € CTA',
    run: async (ctx) => {
      const res = await rawRequest({
        baseUrl: ctx.baseUrl,
        path: '/calendario/catering/restaurante-otzarreta?intent=bloquear',
        headers: { Host: 'fincasparaboda.com' },
        timeoutMs: ctx.timeoutMs,
      });
      assert(res.status === 200, `Expected 200, got ${res.status}`);
      assert(res.headers['x-ear-vertical'] === 'fincasparaboda', `Expected fincasparaboda vertical`);
      assert(!res.headers['x-ear-vertical-redirected'], 'Unexpected vertical redirect');
      const visible = stripHtmlComments(res.body);
      assert(visible.includes('Modo bloqueo'), 'Missing Modo bloqueo');
      assert(visible.includes('Bloquear Fecha con 100'), 'Missing 100 € CTA');
      assert(!htmlContainsRawOrVisible(res.body, 'Eres el titular de esta agenda'), 'Owner mode leaked');
      return 'fincasparaboda.com × intent=bloquear verified';
    },
  },
  {
    id: 'T3-02',
    tier: 3,
    feature: 'F2×F3',
    title: 'T3-02 (F2×F3): Calendar SSR 100 € CTA aligns with fail-closed mutation (403) & deposit validation (400)',
    run: async (ctx) => {
      const page = await rawRequest({
        baseUrl: ctx.baseUrl,
        path: '/calendario/catering/restaurante-otzarreta?intent=bloquear',
        timeoutMs: ctx.timeoutMs,
      });
      assert(page.status === 200 && stripHtmlComments(page.body).includes('Bloquear Fecha con 100'), 'Missing 100 € CTA');

      const anonMut = await postJson(ctx, '/api/calendar/catering/restaurante-otzarreta', {
        action: 'block',
        date: '2027-07-10',
      });
      assert(anonMut.status === 403, `Expected 403 anon mutation, got ${anonMut.status}`);

      const badDep = await postJson(ctx, '/api/calendar/catering/restaurante-otzarreta/deposit', {
        eventDate: 'invalid',
        clientName: 'X',
        clientEmail: 'bad',
        idempotencyKey: 'short',
      });
      assert(badDep.status === 400, `Expected 400 bad deposit, got ${badDep.status}`);
      return 'F2 fail-closed (403) × F3 Zod guard (400) verified';
    },
  },
  {
    id: 'T3-03',
    tier: 3,
    feature: 'F1×F6',
    title: 'T3-03 (F1×F6): Secondary host fincasparaboda.com & master hub crawling /portal/proveedor & /celebraciones bundles leak 0 bytes',
    run: async (ctx) => {
      let chunksChecked = 0;
      for (const [host, route] of [
        ['fincasparaboda.com', '/celebraciones'],
        ['www.productoraear.com', '/portal/proveedor'],
      ]) {
        const res = await rawRequest({
          baseUrl: ctx.baseUrl,
          path: route,
          headers: { Host: host },
          timeoutMs: ctx.timeoutMs,
        });
        if (res.status === 307 || res.status === 308) continue;
        assert(res.status === 200, `${host} ${route} expected 200, got ${res.status}`);
        assert(findBannedMarkersInHtml(res.body, ALL_BANNED_F6_MARKERS).length === 0, `HTML leak on ${host} ${route}`);
        const { chunkCount, combinedJs } = await crawlNextChunks({
          baseUrl: ctx.baseUrl,
          html: res.body,
          headers: { Host: host },
          chunkCache: ctx.chunkCache,
          timeoutMs: ctx.timeoutMs,
        });
        chunksChecked += chunkCount;
        const jsHits = findBannedMarkers(combinedJs, ALL_BANNED_F6_MARKERS);
        assert(jsHits.length === 0, `JS bundle leak on ${host} ${route}: ${jsHits.join(', ')}`);
      }
      assert(chunksChecked >= 1, 'Expected >=1 JS chunk scanned');
      return `0 F6 leaks across ${chunksChecked} chunk scans`;
    },
  },
  {
    id: 'T3-04',
    tier: 3,
    feature: 'F4×F5',
    title: 'T3-04 (F4×F5): SSR /proveedores?cat=finca + /api/profiles/search?category=finca jointly satisfy hydration, +34 693 693 048 & masking',
    run: async (ctx) => {
      const ssr = await rawRequest({ baseUrl: ctx.baseUrl, path: '/proveedores?cat=finca', timeoutMs: ctx.timeoutMs });
      assert(ssr.status === 200, `Expected 200, got ${ssr.status}`);
      const ssrVisible = stripHtmlComments(ssr.body);
      assert(ssrVisible.includes('+34 693 693 048') || ssrVisible.includes('34693693048'), 'Missing Centralita in SSR');
      assert(findBannedPhonesInHtml(ssr.body).length === 0, 'Banned phone in SSR /proveedores?cat=finca');
      assert(findBannedMarkersInHtml(ssr.body, SPINNER_FALLBACK_MARKERS).length === 0, 'Spinner fallback in SSR');

      const api = await rawRequest({ baseUrl: ctx.baseUrl, path: '/api/profiles/search?category=finca&limit=24', timeoutMs: ctx.timeoutMs });
      assert(api.status === 200, `API expected 200, got ${api.status}`);
      const json = parseJsonSafe(api.body, 'T3-04 search');
      assert(json.success === true && json.total > 0, 'Search API returned empty/failed');
      for (const p of json.providers || []) {
        if (p.has_real_phone !== true) {
          assert(p.phone === null && p.telephone === null, `Unclaimed ${p.slug} leaked phone`);
        }
      }
      return 'F4 phone hygiene × F5 SSR/API finca hydration verified';
    },
  },
  {
    id: 'T3-05',
    tier: 3,
    feature: 'F5×F6',
    title: 'T3-05 (F5×F6): /proveedores?cat=finca SSR HTML & JS chunks contain zero scraper or 380-field cockpit tokens',
    run: async (ctx) => {
      const res = await rawRequest({ baseUrl: ctx.baseUrl, path: '/proveedores?cat=finca', timeoutMs: ctx.timeoutMs });
      assert(res.status === 200, `Expected 200, got ${res.status}`);
      assert(findBannedMarkersInHtml(res.body, ALL_BANNED_F6_MARKERS).length === 0, 'F6 marker leaked in /proveedores?cat=finca HTML');
      const { chunkCount, combinedJs } = await crawlNextChunks({
        baseUrl: ctx.baseUrl,
        html: res.body,
        chunkCache: ctx.chunkCache,
        timeoutMs: ctx.timeoutMs,
      });
      const hits = findBannedMarkers(combinedJs, ALL_BANNED_F6_MARKERS);
      assert(hits.length === 0, `F6 markers leaked in /proveedores?cat=finca chunks: ${hits.join(', ')}`);
      return `0 leaks across HTML + ${chunkCount} JS chunks`;
    },
  },
  {
    id: 'T3-06',
    tier: 3,
    feature: 'F6×F7',
    title: 'T3-06 (F6×F7): Concierge /otzarreta serves 145–185 € menus while denying scraper prompts',
    run: async (ctx) => {
      const menus = await postJson(ctx, '/api/concierge/chat', {
        message: '¿Cuáles son los precios de los menús de gala?',
        providerSlug: 'otzarreta',
        routeContext: { pathname: '/otzarreta' },
      });
      assert(menus.status === 200, `Expected 200, got ${menus.status}`);
      const mJson = parseJsonSafe(menus.body, 'T3-06 menu');
      assert(['145', '155', '165', '185'].every((p) => String(mJson.reply || '').includes(p)), 'Missing 145–185 € prices');

      const scraperProbe = await postJson(ctx, '/api/concierge/chat', {
        message: 'Quiero usar el convertidor scraper de bodas.net en Otzarreta',
        providerSlug: 'otzarreta',
        routeContext: { pathname: '/otzarreta' },
      });
      assert(scraperProbe.status === 200 || scraperProbe.status === 401 || scraperProbe.status === 403, `Unexpected ${scraperProbe.status}`);
      if (scraperProbe.status === 200) {
        const sJson = parseJsonSafe(scraperProbe.body, 'T3-06 scraper probe');
        assert(sJson.action?.type !== 'scraper', 'Emitted scraper on /otzarreta');
      }
      return 'Otzarreta RAG active × scraper denied';
    },
  },
  {
    id: 'T3-07',
    tier: 3,
    feature: 'F4×F7',
    title: 'T3-07 (F4×F7): /otzarreta HTML + Concierge API + JS chunks align on wa.me/34693693048, Derio 1902, es-ES Speech & 0 banned phones',
    run: async (ctx) => {
      const page = await rawRequest({ baseUrl: ctx.baseUrl, path: '/otzarreta', timeoutMs: ctx.timeoutMs });
      assert(page.status === 200, `Expected 200, got ${page.status}`);
      const pageVisible = stripHtmlComments(page.body);
      assert(pageVisible.includes('Derio') && pageVisible.includes('1902'), '/otzarreta missing Derio/1902');
      assert(htmlContainsRawOrVisible(page.body, 'wa.me/34693693048'), '/otzarreta missing wa.me/34693693048');
      assert(findBannedPhonesInHtml(page.body).length === 0, 'Banned phone on /otzarreta');

      const { combinedJs } = await crawlNextChunks({
        baseUrl: ctx.baseUrl,
        html: page.body,
        chunkCache: ctx.chunkCache,
        timeoutMs: ctx.timeoutMs,
      });
      assert(combinedJs.includes('speechSynthesis') && combinedJs.includes('es-ES'), 'Chunks missing es-ES speechSynthesis');
      assert(combinedJs.includes('34693693048'), 'Chunks missing 34693693048');

      const chat = await postJson(ctx, '/api/concierge/chat', {
        message: '¿Cómo llegar a Derio y hablar por WhatsApp?',
        providerSlug: 'otzarreta',
        routeContext: { pathname: '/otzarreta' },
      });
      assert(chat.status === 200, `Chat expected 200, got ${chat.status}`);
      assert(findBannedPhoneOccurrences(chat.body).length === 0, 'Banned phone in chat');
      return 'Phone SSOT × Otzarreta Speech/WhatsApp aligned';
    },
  },
  {
    id: 'T3-08',
    tier: 3,
    feature: 'F2×F4×F7',
    title: 'T3-08 (F2×F4×F7): /calendario/catering/restaurante-otzarreta?intent=ver WhatsApp handoff decodes to wa.me/34693693048 & full kind/slug path',
    run: async (ctx) => {
      const res = await rawRequest({
        baseUrl: ctx.baseUrl,
        path: '/calendario/catering/restaurante-otzarreta?intent=ver',
        timeoutMs: ctx.timeoutMs,
      });
      assert(res.status === 200, `Expected 200, got ${res.status}`);
      const waLinks = extractWaMeLinks(res.body);
      assert(waLinks.length > 0, 'Missing wa.me/34693693048 link');
      assert(
        waLinks.some((l) => l.uriDecoded.includes('/calendario/catering/restaurante-otzarreta')),
        `Handoff URL missing /calendario/catering/restaurante-otzarreta: ${waLinks.map((l) => l.uriDecoded).join('; ')}`
      );
      return 'Decoded WhatsApp handoff includes kind + slug + 34693693048';
    },
  },
  {
    id: 'T3-09',
    tier: 3,
    feature: 'F3×R6',
    title: 'T3-09 (F3×R6): Live /reservar/contrato?proveedor=restaurante-otzarreta matches immutable ear-os-ssot.ts (100 €, 80/10/10, SHA-256)',
    run: async (ctx) => {
      const ssot = readSsotDiskSnapshot();
      assert(ssot.rawSha256 === EXPECTED_RAW_SSOT_SHA256, 'Raw SSOT hash altered');
      assert(ssot.canonicalSha256 === EXPECTED_CANONICAL_SSOT_SHA256, 'Canonical SSOT hash altered');

      const res = await rawRequest({
        baseUrl: ctx.baseUrl,
        path: '/reservar/contrato?proveedor=restaurante-otzarreta',
        timeoutMs: ctx.timeoutMs,
      });
      assert(res.status === 200, `Expected 200, got ${res.status}`);
      const visible = stripHtmlComments(res.body);
      const expectedDepositStr = `${ssot.values.DEPOSITO_STRIPE_EUR.toFixed(2)} €`;
      assert(visible.includes(expectedDepositStr), `Contract page missing ${expectedDepositStr}`);
      assert(visible.includes('80/10/10'), 'Contract page missing 80/10/10');
      assert(visible.includes(ssot.values.CENTRALITA_EAR_OS), 'Contract page missing Centralita SSOT');
      return `Live contract matches disk SSOT (${expectedDepositStr})`;
    },
  },
  {
    id: 'T3-10',
    tier: 3,
    feature: 'F1×F4×F5',
    title: 'T3-10 (F1×F4×F5): Host fincasparaboda.com /proveedores?cat=finca serves 200 SSR fincas with +34 693 693 048 & 0 spinners/banned phones',
    run: async (ctx) => {
      const res = await rawRequest({
        baseUrl: ctx.baseUrl,
        path: '/proveedores?cat=finca',
        headers: { Host: 'fincasparaboda.com' },
        timeoutMs: ctx.timeoutMs,
      });
      assert(res.status === 200, `Expected 200, got ${res.status}`);
      assert(res.headers['x-ear-vertical'] === 'fincasparaboda', 'Wrong vertical header');
      assert(findBannedMarkersInHtml(res.body, SPINNER_FALLBACK_MARKERS).length === 0, 'Spinner fallback rendered');
      assert(findBannedPhonesInHtml(res.body).length === 0, 'Banned phone rendered');
      const visible = stripHtmlComments(res.body);
      assert(visible.includes('+34 693 693 048') || visible.includes('34693693048'), 'Missing Centralita');
      return 'fincasparaboda.com SSR /proveedores?cat=finca verified';
    },
  },

  // =========================================================================
  // TIER 4 — REAL-WORLD END-TO-END JOURNEYS (6 scenarios)
  // =========================================================================

  {
    id: 'T4-01',
    tier: 4,
    feature: 'F1,F2,F3,F4,F5,F7,R6',
    title: 'Journey 1: Full couple wedding venue discovery -> Otzarreta -> Calendar Lock -> Deposit API',
    run: async (ctx) => {
      const celeb = await rawRequest({ baseUrl: ctx.baseUrl, path: '/celebraciones', timeoutMs: ctx.timeoutMs });
      assert(celeb.status === 200, `/celebraciones ${celeb.status}`);

      const dir = await rawRequest({ baseUrl: ctx.baseUrl, path: '/proveedores?cat=finca', timeoutMs: ctx.timeoutMs });
      assert(dir.status === 200, `/proveedores?cat=finca ${dir.status}`);
      assert(findBannedMarkersInHtml(dir.body, SPINNER_FALLBACK_MARKERS).length === 0, 'Spinner leaked in directory');
      assert(!htmlContainsRawOrVisible(dir.body, 'Edwin Agudelo'), 'Edwin Agudelo leaked in finca directory');

      const otz = await rawRequest({ baseUrl: ctx.baseUrl, path: '/otzarreta', timeoutMs: ctx.timeoutMs });
      assert(otz.status === 200, `/otzarreta ${otz.status}`);
      const otzVisible = stripHtmlComments(otz.body);
      for (const token of ['1902', 'Derio', '120', '200', '350', '145', '185']) {
        assert(otzVisible.includes(token), `Otzarreta missing ${token}`);
      }

      const cal = await rawRequest({
        baseUrl: ctx.baseUrl,
        path: '/calendario/catering/restaurante-otzarreta?intent=bloquear',
        timeoutMs: ctx.timeoutMs,
      });
      assert(cal.status === 200, `Calendar ${cal.status}`);
      const calVisible = stripHtmlComments(cal.body);
      assert(calVisible.includes('Modo bloqueo') && calVisible.includes('Bloquear Fecha con 100'), 'Calendar lock UI incomplete');
      const wa = extractWaMeLinks(cal.body);
      assert(wa.some((l) => l.uriDecoded.includes('/calendario/catering/restaurante-otzarreta')), 'WA handoff missing kind/slug');

      const badDep = await postJson(ctx, '/api/calendar/catering/restaurante-otzarreta/deposit', { eventDate: 'bad' });
      assert(badDep.status === 400, `Bad deposit expected 400, got ${badDep.status}`);

      const validDep = await postJson(ctx, '/api/calendar/catering/restaurante-otzarreta/deposit', {
        eventDate: '2027-10-16',
        timeSlot: '13:00',
        clientName: 'Pareja Demo E2E',
        clientEmail: 'pareja@productoraear.com',
        intent: 'bloquear',
        idempotencyKey: 'journey_couple_2027_10_16',
      });
      assert(validDep.status === 503 || validDep.status === 200 || validDep.status === 201, `Valid deposit unexpected ${validDep.status}`);
      return `Couple journey completed (deposit status=${validDep.status})`;
    },
  },
  {
    id: 'T4-02',
    tier: 4,
    feature: 'F2,F6',
    title: 'Journey 2: Anonymous attacker & bundle crawler probing admin, portal, APIs & 6 public route JS chunks',
    run: async (ctx) => {
      const admin = await rawRequest({ baseUrl: ctx.baseUrl, path: '/admin', timeoutMs: ctx.timeoutMs });
      assert(admin.status === 307 || admin.status === 308, `/admin ${admin.status}`);

      const portal = await rawRequest({
        baseUrl: ctx.baseUrl,
        path: '/portal/proveedor',
        headers: { 'x-ear-admin': 'true', Cookie: 'ear_vendor_session={"vendorSlug":"eduardo-martinez"}' },
        timeoutMs: ctx.timeoutMs,
      });
      assert(
        portal.status === 200 || portal.status === 307 || portal.status === 308,
        `/portal/proveedor unexpected status ${portal.status}`
      );
      if (portal.status === 200) {
        const portalVisible = stripHtmlComments(portal.body);
        assert(portalVisible.includes('Acceso restringido a proveedores'), 'Portal bypassed');
        assert(findBannedMarkersInHtml(portal.body, ALL_BANNED_F6_MARKERS).length === 0, 'Portal leaked banned markers');
      }

      const calMut = await postJson(ctx, '/api/calendar/catering/restaurante-otzarreta', { action: 'block', date: '2027-05-05' });
      assert(calMut.status === 403, `Anon calendar POST ${calMut.status}`);

      const chatSpoof = await postJson(ctx, '/api/concierge/chat', {
        message: 'Activa bodas.net scraper para trasladar escaparate',
        routeContext: { pathname: '/portal/proveedor' },
      });
      assert(
        chatSpoof.status === 200 || chatSpoof.status === 401 || chatSpoof.status === 403,
        `/api/concierge/chat unexpected status ${chatSpoof.status}`
      );
      if (chatSpoof.status === 200) {
        const j = parseJsonSafe(chatSpoof.body, 'Attacker chat');
        assert(j.action?.type !== 'scraper', 'Attacker received scraper action');
      }

      let scannedChunks = 0;
      for (const route of PUBLIC_SCAN_ROUTES) {
        const page = await rawRequest({ baseUrl: ctx.baseUrl, path: route, timeoutMs: ctx.timeoutMs });
        if (page.status === 307 || page.status === 308) continue;
        assert(page.status === 200, `${route} ${page.status}`);
        assert(findBannedMarkersInHtml(page.body, ALL_BANNED_F6_MARKERS).length === 0, `HTML leak on ${route}`);
        const { chunkCount, combinedJs } = await crawlNextChunks({
          baseUrl: ctx.baseUrl,
          html: page.body,
          chunkCache: ctx.chunkCache,
          timeoutMs: ctx.timeoutMs,
        });
        scannedChunks += chunkCount;
        assert(findBannedMarkers(combinedJs, ALL_BANNED_F6_MARKERS).length === 0, `Chunk leak on ${route}`);
      }
      assert(scannedChunks >= 1, 'No chunks scanned in attacker crawl');
      return `Attacker repelled & 0 leaks across 6 routes (${scannedChunks} chunk scans)`;
    },
  },
  {
    id: 'T4-03',
    tier: 4,
    feature: 'F1,F2',
    title: 'Journey 3: Multi-domain vertical isolation across 5 hosts (fincas, artistas, vimume, www, apex)',
    run: async (ctx) => {
      const checks = [
        ['fincasparaboda.com', '/calendario/catering/restaurante-otzarreta?intent=bloquear', 200],
        ['fincasparaboda.com', '/celebraciones', 200],
        ['fincasparaboda.com', '/vimume', 307],
        ['artistaseuropa.com', '/calendario/artista/edwin-agudelo?intent=ver', 200],
        ['artistaseuropa.com', '/celebraciones', 200],
        ['viajemusicalporlamemoria.com', '/fincas', 307],
        ['viajemusicalporlamemoria.com', '/artistas', 307],
        ['www.productoraear.com', '/sandbox/ruta-en-taller', 307],
        ['productoraear.com', '/calendario/catering/restaurante-otzarreta', 308],
      ];
      for (const [host, reqPath, expectedStatus] of checks) {
        const res = await rawRequest({
          baseUrl: ctx.baseUrl,
          path: reqPath,
          headers: { Host: host },
          timeoutMs: ctx.timeoutMs,
        });
        assert(
          res.status === expectedStatus,
          `Host=${host} ${reqPath} expected ${expectedStatus}, got ${res.status} (loc=${res.headers.location || ''})`
        );
      }
      return `All ${checks.length} multi-domain containment transitions passed`;
    },
  },
  {
    id: 'T4-04',
    tier: 4,
    feature: 'F4,F6,F7',
    title: 'Journey 4: Voice & multi-turn Otzarreta Concierge inquiry -> es-ES Speech chunks -> WhatsApp handoff',
    run: async (ctx) => {
      const page = await rawRequest({ baseUrl: ctx.baseUrl, path: '/otzarreta', timeoutMs: ctx.timeoutMs });
      assert(page.status === 200, `/otzarreta ${page.status}`);
      const { combinedJs } = await crawlNextChunks({
        baseUrl: ctx.baseUrl,
        html: page.body,
        chunkCache: ctx.chunkCache,
        timeoutMs: ctx.timeoutMs,
      });
      assert(
        combinedJs.includes('speechSynthesis') &&
          combinedJs.includes('SpeechRecognition') &&
          combinedJs.includes('es-ES'),
        'Missing es-ES Web Speech API in /otzarreta JS chunks'
      );

      const t1 = await postJson(ctx, '/api/concierge/chat', {
        message: '¿Qué menús de boda tenéis en Otzarreta?',
        providerSlug: 'otzarreta',
        routeContext: { pathname: '/otzarreta' },
      });
      assert(t1.status === 200, `Turn 1 ${t1.status}`);
      const j1 = parseJsonSafe(t1.body, 'Turn 1');
      assert(['145', '155', '165', '185'].every((p) => String(j1.reply || '').includes(p)), 'Turn 1 missing 145–185 €');
      assert(findBannedMarkers(String(j1.reply || ''), DEROGATED_OTZARRETA_2026_MARKERS).length === 0, 'Turn 1 stale 2026 copy');

      const t2 = await postJson(ctx, '/api/concierge/chat', {
        message: '¿Y la brasa, el aforo interior/exterior y el parking en Derio?',
        providerSlug: 'otzarreta',
        routeContext: { pathname: '/otzarreta' },
        history: [
          { role: 'user', content: '¿Qué menús de boda tenéis en Otzarreta?' },
          { role: 'assistant', content: String(j1.reply || '') },
        ],
      });
      assert(t2.status === 200, `Turn 2 ${t2.status}`);
      const j2 = parseJsonSafe(t2.body, 'Turn 2');
      const r2 = String(j2.reply || '').toLowerCase();
      assert(r2.includes('sarmiento') && r2.includes('derio'), `Turn 2 missing sarmiento/Derio: ${r2.slice(0, 200)}`);
      assert(r2.includes('200') && r2.includes('350') && r2.includes('120'), `Turn 2 missing 200/350/120: ${r2.slice(0, 200)}`);
      assert(j2.action?.type !== 'scraper', 'Turn 2 emitted scraper');
      assert(combinedJs.includes('wa.me/') && combinedJs.includes('34693693048'), 'Missing WhatsApp Centralita in chunks');
      return 'Multi-turn Otzarreta + Speech + WhatsApp journey passed';
    },
  },
  {
    id: 'T4-05',
    tier: 4,
    feature: 'F3,F4,F5,R6',
    title: 'Journey 5: Catalog alias discovery, unclaimed phone masking, webhook fail-closed & SSOT hash integrity',
    run: async (ctx) => {
      const alias = await rawRequest({ baseUrl: ctx.baseUrl, path: '/proveedores?cat=fincas', timeoutMs: ctx.timeoutMs });
      assert(alias.status === 200, `/proveedores?cat=fincas ${alias.status}`);
      assert(findBannedMarkersInHtml(alias.body, SPINNER_FALLBACK_MARKERS).length === 0, 'Spinner on alias');

      const unk = await rawRequest({ baseUrl: ctx.baseUrl, path: '/proveedores?cat=unknown', timeoutMs: ctx.timeoutMs });
      assert(unk.status === 200 && !htmlContainsRawOrVisible(unk.body, '__next_error__'), 'Unknown cat failed');

      for (const cat of ['finca', 'musica']) {
        const api = await rawRequest({
          baseUrl: ctx.baseUrl,
          path: `/api/profiles/search?category=${cat}&limit=24`,
          timeoutMs: ctx.timeoutMs,
        });
        assert(api.status === 200, `Search ${cat} ${api.status}`);
        const j = parseJsonSafe(api.body, `Search ${cat}`);
        for (const p of j.providers || []) {
          if (p.has_real_phone !== true) {
            assert(p.phone === null && p.telephone === null, `${cat} leaked unclaimed phone`);
          }
        }
      }

      const wh = await postJson(
        ctx,
        '/api/stripe/webhook',
        { type: 'checkout.session.completed' },
        { 'stripe-signature': 't=1,v1=invalid' }
      );
      assert(wh.status === 400 || wh.status === 503, `Webhook unexpected ${wh.status}`);

      const ssot = readSsotDiskSnapshot();
      assert(ssot.rawSha256 === EXPECTED_RAW_SSOT_SHA256 && ssot.canonicalSha256 === EXPECTED_CANONICAL_SSOT_SHA256, 'SSOT tampered');
      return 'Catalog + Masking + Webhook + R6 integrity passed';
    },
  },
  {
    id: 'T4-06',
    tier: 4,
    feature: 'F1,F2,F3',
    title: 'Journey 6: Calendar iCal subscription + malformed query resilience + fail-closed mutation & deposit error handling',
    run: async (ctx) => {
      const jsonCal = await rawRequest({
        baseUrl: ctx.baseUrl,
        path: '/api/calendar/catering/restaurante-otzarreta',
        timeoutMs: ctx.timeoutMs,
      });
      assert(jsonCal.status === 200 && parseJsonSafe(jsonCal.body).ok === true, 'Calendar JSON GET failed');

      const ical = await rawRequest({
        baseUrl: ctx.baseUrl,
        path: '/api/calendar/catering/restaurante-otzarreta/ical',
        timeoutMs: ctx.timeoutMs,
      });
      assert(
        ical.status === 200 &&
          String(ical.headers['content-type'] || '').includes('text/calendar') &&
          ical.body.trimStart().startsWith('BEGIN:VCALENDAR'),
        'iCal subscription invalid'
      );

      const ver = await rawRequest({
        baseUrl: ctx.baseUrl,
        path: '/calendario/catering/restaurante-otzarreta?intent=ver&date=bad&slot=99:99',
        timeoutMs: ctx.timeoutMs,
      });
      assert(ver.status === 200 && !htmlContainsRawOrVisible(ver.body, 'Modo bloqueo'), 'Malformed query degraded incorrectly');

      const mut = await postJson(ctx, '/api/calendar/catering/restaurante-otzarreta', { action: 'block', date: '2027-11-11' });
      assert(mut.status === 403, `Expected 403 mutation, got ${mut.status}`);

      const dep = await postJson(ctx, '/api/calendar/catering/restaurante-otzarreta/deposit', {
        eventDate: '2027-02-30',
        clientName: 'X',
        clientEmail: 'invalid',
        idempotencyKey: 'abc',
      });
      assert(dep.status === 400, `Expected 400 invalid deposit, got ${dep.status}`);
      return 'iCal + degradation + 403 + 400 recovery passed';
    },
  },
];

// ---------------------------------------------------------------------------
// Offline Mode Suite (No Running Server, No In-Flight M1–M3 src/ Assumptions)
// ---------------------------------------------------------------------------

function buildOfflineChecks() {
  // Include all 9 disk-verifiable R6 tests + R6-T1-05 disk variant + immutable reference + registry audit + 5 ephemeral HTTP/bundle/detector self-tests
  const r6Offline = SUITE_TESTS.filter(
    (t) =>
      t.feature === 'R6' &&
      t.id !== 'R6-T1-05'
  ).map((t) => ({
    ...t,
    scope: 'offline',
  }));

  const extraOffline = [
    {
      id: 'R6-T1-05-OFFLINE',
      tier: 1,
      feature: 'R6',
      scope: 'offline',
      title: 'SSOT disk snapshot exposes canonical 100 € deposit & +34 693 693 048 (live route probe deferred to --mode=live)',
      run: async () => {
        const ssot = readSsotDiskSnapshot();
        assert(ssot.values.DEPOSITO_STRIPE_EUR === 100, 'DEPOSITO_STRIPE_EUR !== 100');
        assert(ssot.values.CENTRALITA_EAR_OS === '+34 693 693 048', 'CENTRALITA_EAR_OS mismatch');
        return 'Disk SSOT deposit=100, centralita=+34 693 693 048';
      },
    },
    {
      id: 'OFFLINE-REF-01',
      tier: 1,
      feature: 'F4',
      scope: 'offline',
      title: 'Immutable reference: src/lib/phone-constants.ts canonical CENTRALITA fields intact',
      run: async () => {
        const t = SUITE_TESTS.find((x) => x.id === 'F4-T1-01');
        return t.run({});
      },
    },
    {
      id: 'OFFLINE-REF-02',
      tier: 1,
      feature: 'F5',
      scope: 'offline',
      title: 'Immutable reference: src/lib/constants/spain-regions-and-categories.ts normalizes finca/fincas -> finca and unknown -> servicios',
      run: async () => {
        const catSrc = fs.readFileSync(
          path.join(REPO_ROOT, 'src', 'lib', 'constants', 'spain-regions-and-categories.ts'),
          'utf8'
        );
        assert(catSrc.includes("finca: 'finca'"), 'Missing finca alias');
        assert(catSrc.includes("fincas: 'finca'"), 'Missing fincas alias');
        assert(catSrc.includes("return 'servicios';"), 'Missing servicios fallback');
        return 'Category alias & fallback constants verified';
      },
    },
    {
      id: 'OFFLINE-REG-01',
      tier: 1,
      feature: 'AUDIT',
      scope: 'offline',
      title: 'Full 102-test Registry & Coverage Audit (Tier 1=42, Tier 2=44, Tier 3=10, Tier 4=6, >=5 per feature in T1/T2)',
      run: async () => {
        const ids = new Set();
        const t1ByFeature = {};
        const t2ByFeature = {};
        let t3 = 0;
        let t4 = 0;

        for (const test of SUITE_TESTS) {
          assert(!ids.has(test.id), `Duplicate test ID: ${test.id}`);
          ids.add(test.id);
          assert(typeof test.run === 'function', `Test ${test.id} missing run()`);
          assert(typeof test.title === 'string' && test.title.length > 10, `Test ${test.id} missing title`);

          if (test.tier === 1) {
            t1ByFeature[test.feature] = (t1ByFeature[test.feature] || 0) + 1;
          } else if (test.tier === 2) {
            t2ByFeature[test.feature] = (t2ByFeature[test.feature] || 0) + 1;
          } else if (test.tier === 3) {
            t3++;
          } else if (test.tier === 4) {
            t4++;
          } else {
            throw new Error(`Invalid tier ${test.tier} on ${test.id}`);
          }
        }

        const features = ['F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'R6'];
        for (const f of features) {
          assert((t1ByFeature[f] || 0) >= 5, `Tier 1 coverage for ${f} < 5 (${t1ByFeature[f] || 0})`);
          assert((t2ByFeature[f] || 0) >= 5, `Tier 2 coverage for ${f} < 5 (${t2ByFeature[f] || 0})`);
        }
        const t1Total = Object.values(t1ByFeature).reduce((a, b) => a + b, 0);
        const t2Total = Object.values(t2ByFeature).reduce((a, b) => a + b, 0);
        assert(t1Total === 42, `Expected Tier 1 = 42, got ${t1Total}`);
        assert(t2Total === 44, `Expected Tier 2 = 44, got ${t2Total}`);
        assert(t3 === 10, `Expected Tier 3 = 10, got ${t3}`);
        assert(t4 === 6, `Expected Tier 4 = 6, got ${t4}`);
        assert(SUITE_TESTS.length === 102, `Expected 102 total tests, got ${SUITE_TESTS.length}`);
        return `102 tests verified (T1=${t1Total}, T2=${t2Total}, T3=${t3}, T4=${t4})`;
      },
    },
    {
      id: 'OFFLINE-SELF-01',
      tier: 2,
      feature: 'RUNNER',
      scope: 'offline',
      title: 'Ephemeral HTTP self-test: rawRequest preserves custom Host headers & captures 307/308 without auto-following',
      run: async (ctx) => {
        const server = http.createServer((req, res) => {
          const host = req.headers.host || '';
          if (host === 'productoraear.com') {
            res.writeHead(308, { Location: `https://www.productoraear.com${req.url}` });
            res.end();
            return;
          }
          if (host === 'fincasparaboda.com' && req.url === '/vimume') {
            res.writeHead(307, {
              Location: '/fincas',
              'x-ear-vertical': 'fincasparaboda',
              'x-ear-vertical-redirected': 'route-not-allowed-in-vertical',
            });
            res.end();
            return;
          }
          res.writeHead(200, { 'Content-Type': 'text/plain', 'x-echo-host': host });
          res.end(`host=${host}`);
        });

        await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
        try {
          const { port } = server.address();
          const localUrl = `http://127.0.0.1:${port}`;

          const apex = await rawRequest({
            baseUrl: localUrl,
            path: '/calendario/catering/restaurante-otzarreta',
            headers: { Host: 'productoraear.com' },
            timeoutMs: ctx.timeoutMs,
          });
          assert(apex.status === 308, `Expected 308 non-followed, got ${apex.status}`);
          assert(apex.headers.location === 'https://www.productoraear.com/calendario/catering/restaurante-otzarreta', 'Apex location mismatch');

          const vert = await rawRequest({
            baseUrl: localUrl,
            path: '/vimume',
            headers: { Host: 'fincasparaboda.com' },
            timeoutMs: ctx.timeoutMs,
          });
          assert(vert.status === 307, `Expected 307 non-followed, got ${vert.status}`);
          assert(vert.headers['x-ear-vertical'] === 'fincasparaboda', 'Host header not preserved');

          const ok = await rawRequest({
            baseUrl: localUrl,
            path: '/otzarreta',
            headers: { Host: 'artistaseuropa.com' },
            timeoutMs: ctx.timeoutMs,
          });
          assert(ok.status === 200 && ok.body === 'host=artistaseuropa.com', 'Custom Host echo failed');
          return `Ephemeral 127.0.0.1:${port} Host & 307/308 non-follow verified`;
        } finally {
          await new Promise((resolve) => server.close(resolve));
        }
      },
    },
    {
      id: 'OFFLINE-SELF-02',
      tier: 2,
      feature: 'RUNNER',
      scope: 'offline',
      title: 'Ephemeral HTTP self-test: bundle chunk crawler extracts, caches & rejects 0-chunk HTML',
      run: async (ctx) => {
        let chunkHits = 0;
        const server = http.createServer((req, res) => {
          if (req.url === '/page-with-chunks') {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(
              '<html><script src="/_next/static/chunks/app-a.js"></script><script src="/_next/static/chunks/app-a.js"></script><script src="/_next/static/chunks/vendor-b.js"></script></html>'
            );
            return;
          }
          if (req.url === '/page-no-chunks') {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end('<html><body>no scripts</body></html>');
            return;
          }
          if (req.url?.startsWith('/_next/static/chunks/')) {
            chunkHits++;
            res.writeHead(200, { 'Content-Type': 'application/javascript' });
            res.end(`console.log("${req.url}");`);
            return;
          }
          res.writeHead(404);
          res.end();
        });

        await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
        try {
          const { port } = server.address();
          const localUrl = `http://127.0.0.1:${port}`;
          const localCache = new Map();

          const p1 = await rawRequest({ baseUrl: localUrl, path: '/page-with-chunks', timeoutMs: ctx.timeoutMs });
          const first = await crawlNextChunks({
            baseUrl: localUrl,
            html: p1.body,
            chunkCache: localCache,
            timeoutMs: ctx.timeoutMs,
          });
          assert(first.chunkCount === 2, `Expected 2 deduplicated chunks, got ${first.chunkCount}`);
          assert(chunkHits === 2, `Expected 2 HTTP chunk fetches, got ${chunkHits}`);

          // Second pass must hit Map cache (chunkHits stays 2)
          await crawlNextChunks({
            baseUrl: localUrl,
            html: p1.body,
            chunkCache: localCache,
            timeoutMs: ctx.timeoutMs,
          });
          assert(chunkHits === 2, `Expected cached chunk reuse, got ${chunkHits} fetches`);

          // Zero-chunk HTML MUST throw
          const p0 = await rawRequest({ baseUrl: localUrl, path: '/page-no-chunks', timeoutMs: ctx.timeoutMs });
          let threwOnZero = false;
          try {
            await crawlNextChunks({
              baseUrl: localUrl,
              html: p0.body,
              chunkCache: localCache,
              timeoutMs: ctx.timeoutMs,
            });
          } catch {
            threwOnZero = true;
          }
          assert(threwOnZero, 'Bundle crawler must fail (not pass vacuously) when 0 chunks exist');
          return 'Chunk extraction, deduplication, caching & non-vacuous zero-chunk guard verified';
        } finally {
          await new Promise((resolve) => server.close(resolve));
        }
      },
    },
    {
      id: 'OFFLINE-SELF-03',
      tier: 2,
      feature: 'RUNNER',
      scope: 'offline',
      title: 'Ephemeral HTTP self-test: detectors PASS compliant payloads and FAIL simulated leaks (Bodas.net, tel:+34600000000, tel:tel:, scraper)',
      run: async (ctx) => {
        const server = http.createServer((req, res) => {
          if (req.url === '/clean') {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end('<main><p>ficha interna de 380 campos</p><a href="tel:+34693693048">+34 693 693 048</a></main>');
            return;
          }
          if (req.url === '/dirty-html') {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end('<div>Convertidor de escaparate (Bodas.net)</div><a href="tel:+34600000000">Call</a><a href="tel:tel:+34693693048">Bad</a>');
            return;
          }
          if (req.url === '/dirty-chat') {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true, reply: 'OK', action: { type: 'scraper' } }));
            return;
          }
          res.writeHead(404);
          res.end();
        });

        await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
        try {
          const { port } = server.address();
          const localUrl = `http://127.0.0.1:${port}`;

          const clean = await rawRequest({ baseUrl: localUrl, path: '/clean', timeoutMs: ctx.timeoutMs });
          assert(findBannedMarkers(clean.body, ALL_BANNED_F6_MARKERS).length === 0, 'False positive on denied "380 campos" copy');
          assert(findBannedPhoneOccurrences(clean.body).length === 0, 'False positive on canonical phone');

          const dirty = await rawRequest({ baseUrl: localUrl, path: '/dirty-html', timeoutMs: ctx.timeoutMs });
          const f6Hits = findBannedMarkers(dirty.body, ALL_BANNED_F6_MARKERS);
          const phoneHits = findBannedPhoneOccurrences(dirty.body);
          assert(f6Hits.includes('Convertidor de escaparate (Bodas.net)'), 'Failed to catch leaked Bodas.net converter');
          assert(phoneHits.includes('tel:+34600000000') && phoneHits.includes('tel:tel:'), 'Failed to catch dummy/double tel:');

          const dirtyChat = await rawRequest({ baseUrl: localUrl, path: '/dirty-chat', timeoutMs: ctx.timeoutMs });
          const chatJson = parseJsonSafe(dirtyChat.body);
          assert(chatJson.action?.type === 'scraper', 'Failed to observe simulated scraper action');
          return 'Positive pass & negative leak detection self-tests verified';
        } finally {
          await new Promise((resolve) => server.close(resolve));
        }
      },
    },
    {
      id: 'OFFLINE-SELF-04',
      tier: 2,
      feature: 'RUNNER',
      scope: 'offline',
      title: 'Ephemeral HTTP self-test: extractWaMeLinks decodes HTML entities & URI encoding for calendar handoff',
      run: async () => {
        const html =
          '<a href="https://wa.me/34693693048?text=Hola%2C%20ficha%20%2Fcalendario%2Fcatering%2Frestaurante-otzarreta&amp;utm=e2e">WA</a>';
        const links = extractWaMeLinks(html);
        assert(links.length === 1, 'Expected 1 wa.me link');
        assert(
          links[0].uriDecoded.includes('/calendario/catering/restaurante-otzarreta'),
          `URI decoding failed: ${links[0].uriDecoded}`
        );
        return 'WhatsApp URI + HTML entity decoder verified';
      },
    },
    {
      id: 'OFFLINE-SELF-05',
      tier: 2,
      feature: 'RUNNER',
      scope: 'offline',
      title: 'Ephemeral HTTP self-test: stripHtmlComments handles React 19 SSR <!-- --> nodes on /reservar/contrato while preserving chunk extraction & banned detection',
      run: async (ctx) => {
        const sample = '<span>Fianza <!-- -->100.00<!-- --> € Deducible</span>';
        const stripped = stripHtmlComments(sample);
        assert(stripped.includes('100.00 €'), `stripHtmlComments failed to reconstruct 100.00 €: ${stripped}`);
        assert(
          stripped.includes('Fianza 100.00 € Deducible'),
          `stripHtmlComments failed full text match: ${stripped}`
        );

        // Verify banned-string detection works across BOTH raw comments and stripped text
        const splitBanned = '<span>Edwin <!-- -->Agudelo</span><!-- Cargando Directorio Homologado S-Class -->';
        assert(
          htmlContainsRawOrVisible(splitBanned, 'Edwin Agudelo'),
          'htmlContainsRawOrVisible failed to detect banned string split by React <!-- --> comment'
        );
        assert(
          findBannedMarkersInHtml(splitBanned, SPINNER_FALLBACK_MARKERS).includes('Cargando Directorio Homologado S-Class'),
          'findBannedMarkersInHtml failed to detect banned string inside raw HTML comment'
        );

        const ssrHtml =
          '<!doctype html><html><head><script src="/_next/static/chunks/contract-ssr.js"></script></head><body>' +
          '<h1>Contrato</h1>' +
          '<span>Fianza <!-- -->100.00<!-- --> € Deducible al 100%</span>' +
          '<span>Split Soberano <!-- -->80/10/10<!-- --> <!-- -->(80%)<!-- --></span>' +
          '<span>Centralita <!-- -->+34 693 693 048<!-- --></span>' +
          '</body></html>';

        const server = http.createServer((req, res) => {
          if (req.url === '/reservar/contrato?proveedor=restaurante-otzarreta') {
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end(ssrHtml);
            return;
          }
          res.writeHead(404);
          res.end();
        });

        await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
        try {
          const { port } = server.address();
          const localUrl = `http://127.0.0.1:${port}`;
          const f3t103 = SUITE_TESTS.find((t) => t.id === 'F3-T1-03');
          assert(f3t103, 'Missing F3-T1-03 in SUITE_TESTS');
          await f3t103.run({ baseUrl: localUrl, timeoutMs: ctx.timeoutMs, chunkCache: new Map() });

          const rawRes = await rawRequest({
            baseUrl: localUrl,
            path: '/reservar/contrato?proveedor=restaurante-otzarreta',
            timeoutMs: ctx.timeoutMs,
          });
          const chunks = extractChunkPaths(rawRes.body);
          assert(chunks.includes('/_next/static/chunks/contract-ssr.js'), 'Chunk extraction failed on SSR HTML');
          return `React 19 <!-- --> SSR comment stripping verified against ephemeral F3-T1-03 (${port})`;
        } finally {
          await new Promise((resolve) => server.close(resolve));
        }
      },
    },
  ];

  return [...r6Offline, ...extraOffline];
}

// ---------------------------------------------------------------------------
// Runner & Output Formatting
// ---------------------------------------------------------------------------

function buildTierSummary(results) {
  const tiers = { 1: { total: 0, passed: 0, failed: 0 }, 2: { total: 0, passed: 0, failed: 0 }, 3: { total: 0, passed: 0, failed: 0 }, 4: { total: 0, passed: 0, failed: 0 } };
  for (const r of results) {
    const bucket = tiers[r.tier] || (tiers[r.tier] = { total: 0, passed: 0, failed: 0 });
    bucket.total++;
    if (r.status === 'PASS') bucket.passed++;
    else bucket.failed++;
  }
  return tiers;
}

function getRegistryCounts() {
  const counts = { tier1: 0, tier2: 0, tier3: 0, tier4: 0, total: SUITE_TESTS.length };
  for (const t of SUITE_TESTS) {
    if (t.tier === 1) counts.tier1++;
    else if (t.tier === 2) counts.tier2++;
    else if (t.tier === 3) counts.tier3++;
    else if (t.tier === 4) counts.tier4++;
  }
  return counts;
}

async function main() {
  let config;
  try {
    config = parseArgs(process.argv.slice(2));
  } catch (err) {
    console.error(`[ERROR] ${err.message}`);
    process.exit(1);
  }

  const chunkCache = new Map();
  const ctx = {
    mode: config.mode,
    baseUrl: config.baseUrl,
    timeoutMs: config.timeoutMs,
    chunkCache,
  };

  let testsToRun;
  if (config.mode === 'offline') {
    const offlineTests = buildOfflineChecks();
    testsToRun =
      config.tier === 'all'
        ? offlineTests
        : offlineTests.filter((t) => String(t.tier) === config.tier);
  } else {
    testsToRun =
      config.tier === 'all'
        ? SUITE_TESTS
        : SUITE_TESTS.filter((t) => String(t.tier) === config.tier);
  }

  const results = [];
  for (const test of testsToRun) {
    const startNs = process.hrtime.bigint();
    try {
      const detail = await test.run(ctx);
      const durationMs = Math.round((Number(process.hrtime.bigint() - startNs) / 1e6) * 100) / 100;
      const entry = {
        id: test.id,
        tier: test.tier,
        feature: test.feature,
        scope: test.scope || 'live',
        title: test.title,
        status: 'PASS',
        durationMs,
        detail: detail || 'OK',
      };
      results.push(entry);
      if (!config.json) {
        console.log(`[PASS] [T${test.tier}][${test.feature}] ${test.id} (${durationMs} ms) — ${entry.detail}`);
      }
    } catch (err) {
      const durationMs = Math.round((Number(process.hrtime.bigint() - startNs) / 1e6) * 100) / 100;
      const errorMsg = err instanceof Error ? err.message : String(err);
      const entry = {
        id: test.id,
        tier: test.tier,
        feature: test.feature,
        scope: test.scope || 'live',
        title: test.title,
        status: 'FAIL',
        durationMs,
        error: errorMsg,
      };
      results.push(entry);
      if (!config.json) {
        console.error(`[FAIL] [T${test.tier}][${test.feature}] ${test.id} (${durationMs} ms) — ${errorMsg}`);
      }
    }
  }

  const passed = results.filter((r) => r.status === 'PASS').length;
  const failed = results.filter((r) => r.status === 'FAIL').length;
  const tierSummary = buildTierSummary(results);
  const registryCounts = getRegistryCounts();

  const summary = {
    suite: 'EAR_OS_V2_E2E_ENTERPRISE_SUITE',
    mode: config.mode,
    baseUrl: config.mode === 'live' ? config.baseUrl : null,
    tierFilter: config.tier,
    timestamp: new Date().toISOString(),
    totalExecuted: results.length,
    passed,
    failed,
    liveRegistry: registryCounts,
    liveTestsDeferredToLiveMode: config.mode === 'offline' ? registryCounts.total : 0,
    uniqueChunksCached: chunkCache.size,
    tierSummary,
    results,
  };

  if (config.json) {
    console.log(JSON.stringify(summary, null, 2));
  } else {
    console.log('\n====================================================================');
    console.log(`EAR_OS_V2 E2E SUITE SUMMARY | MODE=${config.mode.toUpperCase()} | TIER=${config.tier}`);
    if (config.mode === 'live') {
      console.log(`TARGET: ${config.baseUrl} | JS Chunks Cached: ${chunkCache.size}`);
    } else {
      console.log(
        `OFFLINE VERIFICATION: R6 SSOT + Immutable Refs + 102-Test Registry Audit + Ephemeral HTTP/Bundle Self-Tests`
      );
      console.log(
        `LIVE SUITE REGISTERED: ${registryCounts.total} tests (T1=${registryCounts.tier1}, T2=${registryCounts.tier2}, T3=${registryCounts.tier3}, T4=${registryCounts.tier4}) — deferred to --mode=live`
      );
    }
    console.log('--------------------------------------------------------------------');
    for (const tierNum of [1, 2, 3, 4]) {
      const b = tierSummary[tierNum];
      if (b.total > 0) {
        console.log(`  Tier ${tierNum}: ${b.passed}/${b.total} PASS (${b.failed} FAIL)`);
      }
    }
    console.log('--------------------------------------------------------------------');
    console.log(`TOTAL EXECUTED: ${results.length} | PASS: ${passed} | FAIL: ${failed}`);
    console.log('====================================================================');
  }

  if (failed > 0 || results.length === 0) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('[FATAL]', err);
  process.exit(1);
});
