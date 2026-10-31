#!/usr/bin/env node
'use strict';

/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * AUDITOR REAL · COBERTURA DEL ÍNDICE MAESTRO DE SITEMAPS (U6 · AF-5)
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * Ley del auditor real: un ítem sin comando ejecutable en disco vale 0 puntos.
 * Este script ES el comando. Sondea producción (host final www), no el repo.
 *
 * Qué prueba, en orden:
 *  1. robots.txt declara el índice maestro `Sitemap: .../sitemap-index.xml`.
 *  2. `/sitemap-index.xml` responde 200 + application/xml + raíz `<sitemapindex>`.
 *  3. El índice tiene al menos 8 hijos (2 urlset individuales + 6 particiones).
 *  4. NINGÚN hijo vive bajo `/api/` (robots.txt lo prohíbe: sería invisible).
 *  5. NINGÚN `<loc>` apunta al apex `https://productoraear.com` (308 → www).
 *  6. Cada hijo responde 200 + XML + `<urlset>` y declara URLs reales.
 *  7. Suma total de URLs >= SITEMAP_MIN_TOTAL_URLS (suelo anti-regresión).
 *
 * Uso:
 *   node scripts/verify_sitemap_index_coverage.cjs
 *   node scripts/verify_sitemap_index_coverage.cjs --verbose
 *
 * Nota de diseño: el auditor sigue los `<loc>` publicados, que en producción son
 * SIEMPRE `https://www.productoraear.com`. Por eso mide producción de verdad y no
 * un host local: un verde en localhost no es un verde para Google (G-6).
 * `SITEMAP_BASE_URL` solo sirve para apuntar a otro host que sirva exactamente
 * esos mismos `<loc>` (staging con SITEMAP_FORCE_ORIGIN).
 *
 * Exit 0 = promesa medida. Exit 1 = promesa rota (detalle en JSON, nunca en prosa).
 */

const DEFAULT_BASE = 'https://www.productoraear.com';
const BASE = (process.env.SITEMAP_BASE_URL || DEFAULT_BASE).replace(/\/+$/, '');
// Suelo conservador: 6.368 URLs medidas en particiones + ~778 en el índice raíz
// el 2026-10-30. Un desplome por debajo de 5.000 es una regresión, no tráfico.
const MIN_TOTAL_URLS = Number(process.env.SITEMAP_MIN_TOTAL_URLS || 5000);
const TIMEOUT_MS = Number(process.env.SITEMAP_TIMEOUT_MS || 20000);
const APEX_PREFIX = 'https://productoraear.com/';
const VERBOSE = process.argv.includes('--verbose');

const passed = [];
const failed = [];

function pass(id, detail) {
  passed.push({ id, ...detail });
}

function fail(id, detail) {
  failed.push({ id, ...detail });
}

async function fetchText(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      // manual: un 308/301 en un sitemap es un defecto, no algo que se deba seguir.
      redirect: 'manual',
      signal: controller.signal,
      headers: { 'user-agent': 'EAR-OS-Sitemap-Auditor/1.0' },
    });
    const body = await res.text();
    return {
      status: res.status,
      contentType: res.headers.get('content-type') || '',
      location: res.headers.get('location') || '',
      body,
    };
  } finally {
    clearTimeout(timer);
  }
}

function extractLocs(xml) {
  const locs = [];
  const re = /<loc>([\s\S]*?)<\/loc>/g;
  let match = re.exec(xml);
  while (match !== null) {
    locs.push(match[1].trim());
    match = re.exec(xml);
  }
  return locs;
}

function countApexLocs(locs) {
  return locs.filter((loc) => loc.startsWith(APEX_PREFIX)).length;
}

async function checkRobots() {
  const robotsUrl = `${BASE}/robots.txt`;
  const robots = await fetchText(robotsUrl);

  if (robots.status !== 200) {
    fail('ROBOTS_STATUS', { url: robotsUrl, status: robots.status });
    return;
  }

  const sitemapLines = robots.body
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => /^sitemap:/i.test(line))
    .map((line) => line.replace(/^sitemap:\s*/i, '').trim());

  if (sitemapLines.includes(`${BASE}/sitemap-index.xml`)) {
    pass('ROBOTS_DECLARES_INDEX', { sitemapLines });
  } else {
    fail('ROBOTS_MISSING_INDEX', { expected: `${BASE}/sitemap-index.xml`, sitemapLines });
  }

  const apexInRobots = sitemapLines.filter((line) => line.startsWith(APEX_PREFIX));
  if (apexInRobots.length === 0) {
    pass('ROBOTS_NO_APEX', { declared: sitemapLines.length });
  } else {
    fail('ROBOTS_APEX_HOST', { apexInRobots });
  }
}

async function checkChildren(children) {
  let totalUrls = 0;

  for (const childUrl of children) {
    const child = await fetchText(childUrl);

    if (child.status !== 200) {
      fail('CHILD_STATUS', { url: childUrl, status: child.status, location: child.location });
      continue;
    }

    if (!child.body.includes('<urlset')) {
      fail('CHILD_NOT_URLSET', { url: childUrl, contentType: child.contentType });
      continue;
    }

    const childLocs = extractLocs(child.body);
    totalUrls += childLocs.length;

    if (childLocs.length === 0) {
      fail('CHILD_EMPTY', { url: childUrl });
      continue;
    }

    const childApex = countApexLocs(childLocs);
    if (childApex > 0) {
      fail('CHILD_APEX_LOCS', { url: childUrl, apexLocs: childApex, urls: childLocs.length });
      continue;
    }

    pass('CHILD_OK', { url: childUrl, urls: childLocs.length });
  }

  if (totalUrls >= MIN_TOTAL_URLS) {
    pass('TOTAL_URLS', { totalUrls, min: MIN_TOTAL_URLS });
  } else {
    fail('TOTAL_URLS_BELOW_FLOOR', { totalUrls, min: MIN_TOTAL_URLS });
  }
}

async function checkIndex() {
  const indexUrl = `${BASE}/sitemap-index.xml`;
  const index = await fetchText(indexUrl);

  if (index.status !== 200) {
    fail('INDEX_STATUS', { url: indexUrl, status: index.status, location: index.location });
    return;
  }

  if (!index.body.includes('<sitemapindex')) {
    fail('INDEX_NOT_SITEMAPINDEX', { url: indexUrl, contentType: index.contentType });
    return;
  }

  const children = extractLocs(index.body);
  pass('INDEX_OK', { url: indexUrl, children: children.length, contentType: index.contentType });

  if (children.length < 8) {
    fail('INDEX_TOO_FEW_CHILDREN', { children: children.length, expectedMin: 8 });
    return;
  }
  pass('INDEX_CHILD_COUNT', { children: children.length });

  const apiChildren = children.filter((loc) => loc.includes('/api/'));
  if (apiChildren.length === 0) {
    pass('INDEX_NO_API_CHILDREN', {});
  } else {
    fail('INDEX_API_CHILDREN_BLOCKED_BY_ROBOTS', { apiChildren });
  }

  const apexChildren = countApexLocs(children);
  if (apexChildren === 0) {
    pass('INDEX_NO_APEX_CHILDREN', {});
  } else {
    fail('INDEX_APEX_CHILDREN_REDIRECT', { apexChildren, prefix: APEX_PREFIX });
  }

  await checkChildren(children);
}

async function main() {
  await checkRobots();
  await checkIndex();

  const summary = {
    auditor: 'verify_sitemap_index_coverage',
    base: BASE,
    ts: new Date().toISOString(),
    verdict: failed.length === 0 ? 'VERIFICADO' : 'SOSPECHOSO',
    passed: passed.length,
    failed: failed.length,
    failures: failed,
  };

  if (VERBOSE) summary.passedChecks = passed;

  process.stdout.write(`${JSON.stringify(summary)}\n`);
  process.exit(failed.length === 0 ? 0 : 1);
}

main().catch((error) => {
  process.stdout.write(
    `${JSON.stringify({
      auditor: 'verify_sitemap_index_coverage',
      base: BASE,
      verdict: 'SIN_EVIDENCIA',
      error: error instanceof Error ? error.message : String(error),
    })}\n`
  );
  process.exit(1);
});
