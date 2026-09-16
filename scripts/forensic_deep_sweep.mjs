#!/usr/bin/env node
/**
 * BARRIDO FORENSE PROFUNDO — EAR OS
 * Descubre toda la superficie (rutas de página + endpoints API) desde el
 * sistema de archivos, la sondea por HTTP en vivo y clasifica cada nodo:
 *   OK | REDIRECT | ERROR | EMPTY_FACADE | SLOW | CLIENT_ERROR
 * Detecta "fachadas vacías" (200 con contenido mínimo) y mide latencia.
 * Salida: informe JSON completo en reports/ + resumen estadístico compacto.
 */
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const APP_DIR = path.join(ROOT, 'src', 'app');
const BASE = 'http://localhost:3007';
const REPORT_DIR = path.join(ROOT, 'reports');
const SLOW_MS = 2500;
const EMPTY_FACADE_BYTES = 1200; // < 1.2KB de HTML => fachada vacía sospechosa

const results = [];
const errors = [];

// ---------- 1. DESCUBRIMIENTO DE RUTAS ----------
async function walk(dir, out = []) {
  let entries;
  try { entries = await fs.readdir(dir, { withFileTypes: true }); }
  catch { return out; }
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      // Saltar carpetas de layout interno de Next que no son rutas
      if (e.name === 'components' || e.name === 'context' || e.name === 'data' || e.name === 'actions') continue;
      await walk(full, out);
    } else if (e.name === 'page.tsx' || e.name === 'page.ts' || e.name === 'page.jsx' || e.name === 'page.js') {
      out.push({ type: 'page', dir });
    } else if (e.name === 'route.ts' || e.name === 'route.tsx' || e.name === 'route.js') {
      out.push({ type: 'api', dir });
    }
  }
  return out;
}

function dirToRoute(dir) {
  let rel = path.relative(APP_DIR, dir).replace(/\\/g, '/');
  if (rel === '') rel = '';
  // Normalizar grupos de layout (admin), (public), etc.
  rel = rel.replace(/\([^)]*\)\//g, '');
  // Rutas dinámicas: [param] -> {param}, [...slug] -> {slug}
  rel = rel.replace(/\[\.\.\.([^\]]+)\]/g, '{...$1}').replace(/\[([^\]]+)\]/g, '{$1}');
  return '/' + rel;
}

// ---------- 2. SONDEO HTTP ----------
async function probe(route, type) {
  const url = BASE + route;
  const t0 = process.hrtime.bigint();
  const rec = { route, type, url, status: null, ms: 0, bytes: 0, contentType: '', verdict: 'UNKNOWN', redirect: null };
  try {
    const res = await fetch(url, {
      method: 'GET',
      redirect: 'manual',
      headers: { 'accept': 'text/html,application/json;q=0.9,*/*;q=0.8' },
      signal: AbortSignal.timeout(15000),
    });
    const t1 = process.hrtime.bigint();
    rec.ms = Number(t1 - t0) / 1e6;
    rec.status = res.status;
    rec.contentType = (res.headers.get('content-type') || '').split(';')[0].trim();
    if (res.status >= 300 && res.status < 400) {
      rec.redirect = res.headers.get('location');
      rec.verdict = 'REDIRECT';
    } else {
      const body = await res.arrayBuffer();
      rec.bytes = body.byteLength;
      if (res.status >= 500) rec.verdict = 'ERROR';
      else if (res.status >= 400) rec.verdict = 'CLIENT_ERROR';
      else if (type === 'page' && rec.bytes < EMPTY_FACADE_BYTES) rec.verdict = 'EMPTY_FACADE';
      else rec.verdict = 'OK';
      if (rec.verdict === 'OK' && rec.ms > SLOW_MS) rec.verdict = 'SLOW';
    }
  } catch (err) {
    rec.verdict = 'ERROR';
    rec.error = String(err && err.message || err);
  }
  return rec;
}

// ---------- 3. EJECUCIÓN ----------
async function main() {
  console.log('==============================================================');
  console.log('BARRIDO FORENSE PROFUNDO — EAR OS (SUPERFICIE COMPLETA)');
  console.log('==============================================================');

  const discovered = await walk(APP_DIR);
  const pages = discovered.filter(d => d.type === 'page').map(d => ({ ...d, route: dirToRoute(d.dir) }));
  const apis = discovered.filter(d => d.type === 'api').map(d => ({ ...d, route: dirToRoute(d.dir) }));

  // Solo sondear rutas estáticas (sin parámetros dinámicos) para no disparar 404 falsos
  const isStatic = r => !r.includes('{');
  const staticPages = pages.filter(p => isStatic(p.route));
  const staticApis = apis.filter(a => isStatic(a.route));
  const dynamicPages = pages.filter(p => !isStatic(p.route));
  const dynamicApis = apis.filter(a => !isStatic(a.route));

  console.log(`\n[DESCUBRIMIENTO] Páginas: ${pages.length} (estáticas ${staticPages.length}, dinámicas ${dynamicPages.length})`);
  console.log(`[DESCUBRIMIENTO] APIs:    ${apis.length} (estáticas ${staticApis.length}, dinámicas ${dynamicApis.length})`);

  // Sondeo en paralelo limitado (concurrencia 8)
  const toProbe = [
    ...staticPages.map(p => ({ route: p.route, type: 'page' })),
    ...staticApis.map(a => ({ route: a.route, type: 'api' })),
  ];
  const CONC = 8;
  for (let i = 0; i < toProbe.length; i += CONC) {
    const batch = toProbe.slice(i, i + CONC);
    const settled = await Promise.all(batch.map(b => probe(b.route, b.type)));
    results.push(...settled);
    const done = Math.min(i + CONC, toProbe.length);
    process.stdout.write(`\r[SONDEO] ${done}/${toProbe.length} nodos...`);
  }
  process.stdout.write('\n');

  // ---------- 4. CLASIFICACIÓN Y RESUMEN ----------
  const byVerdict = {};
  for (const r of results) byVerdict[r.verdict] = (byVerdict[r.verdict] || 0) + 1;

  const pagesRes = results.filter(r => r.type === 'page');
  const apisRes = results.filter(r => r.type === 'api');
  const emptyFacades = results.filter(r => r.verdict === 'EMPTY_FACADE').map(r => r.route);
  const serverErrors = results.filter(r => r.verdict === 'ERROR').map(r => ({ route: r.route, status: r.status, err: r.error }));
  const clientErrors = results.filter(r => r.verdict === 'CLIENT_ERROR').map(r => ({ route: r.route, status: r.status }));
  const slow = results.filter(r => r.verdict === 'SLOW').map(r => ({ route: r.route, ms: Math.round(r.ms) }));
  const redirects = results.filter(r => r.verdict === 'REDIRECT').map(r => ({ route: r.route, to: r.redirect }));

  const avgMs = results.length ? Math.round(results.reduce((s, r) => s + r.ms, 0) / results.length) : 0;
  const maxMs = results.length ? Math.max(...results.map(r => r.ms)) : 0;
  const totalBytes = results.reduce((s, r) => s + r.bytes, 0);

  const report = {
    meta: {
      generated_at: new Date().toISOString(),
      base: BASE,
      thresholds: { slow_ms: SLOW_MS, empty_facade_bytes: EMPTY_FACADE_BYTES },
      discovered: { pages: pages.length, apis: apis.length, dynamic_pages: dynamicPages.length, dynamic_apis: dynamicApis.length },
    },
    summary: {
      total_probed: results.length,
      by_verdict: byVerdict,
      avg_ms: avgMs, max_ms: maxMs, total_bytes: totalBytes,
      empty_facades: emptyFacades.length,
      server_errors: serverErrors.length,
      client_errors: clientErrors.length,
      slow: slow.length,
      redirects: redirects.length,
    },
    findings: { emptyFacades, serverErrors, clientErrors, slow, redirects, dynamicPages: dynamicPages.map(p => p.route), dynamicApis: dynamicApis.map(a => a.route) },
    results,
  };

  await fs.mkdir(REPORT_DIR, { recursive: true });
  const reportPath = path.join(REPORT_DIR, 'forensic_deep_sweep.json');
  await fs.writeFile(reportPath, JSON.stringify(report, null, 2), 'utf8');

  // ---------- 5. RESUMEN COMPACTO (anti-bloat) ----------
  console.log('\n==============================================================');
  console.log('RESULTADO DEL BARRIDO FORENSE PROFUNDO');
  console.log('==============================================================');
  console.log(`Nodos sondeados:        ${results.length}`);
  console.log(`  OK:                   ${byVerdict['OK'] || 0}`);
  console.log(`  REDIRECT:             ${byVerdict['REDIRECT'] || 0}`);
  console.log(`  EMPTY_FACADE:         ${byVerdict['EMPTY_FACADE'] || 0}`);
  console.log(`  SLOW (>${SLOW_MS}ms):      ${byVerdict['SLOW'] || 0}`);
  console.log(`  CLIENT_ERROR (4xx):   ${byVerdict['CLIENT_ERROR'] || 0}`);
  console.log(`  ERROR (5xx/fail):     ${byVerdict['ERROR'] || 0}`);
  console.log(`Latencia media:         ${avgMs} ms | máx: ${Math.round(maxMs)} ms`);
  console.log(`Volumen total:          ${(totalBytes / 1024).toFixed(1)} KB`);
  console.log(`Rutas dinámicas (no sondeadas): ${dynamicPages.length + dynamicApis.length}`);
  console.log(`\nInforme completo:         reports/forensic_deep_sweep.json`);

  if (emptyFacades.length) {
    console.log('\n⚠️  FACHADAS VACÍAS (200 con contenido mínimo):');
    emptyFacades.slice(0, 25).forEach(r => console.log(`   - ${r}`));
    if (emptyFacades.length > 25) console.log(`   ... y ${emptyFacades.length - 25} más`);
  }
  if (serverErrors.length) {
    console.log('\n❌ ERRORES DE SERVIDOR (5xx / fallo):');
    serverErrors.slice(0, 25).forEach(r => console.log(`   - ${r.route} [${r.status}] ${r.err || ''}`));
  }
  if (clientErrors.length) {
    console.log('\n⚠️  ERRORES DE CLIENTE (4xx):');
    clientErrors.slice(0, 25).forEach(r => console.log(`   - ${r.route} [${r.status}]`));
  }
  if (slow.length) {
    console.log('\n🐢 RUTAS LENTAS:');
    slow.slice(0, 15).forEach(r => console.log(`   - ${r.route} (${r.ms} ms)`));
  }
  console.log('\n==============================================================');
  console.log('BARRIDO FORENSE PROFUNDO FINALIZADO');
  console.log('==============================================================');
}

main().catch(err => {
  console.error('FATAL en barrido forense:', err);
  process.exit(1);
});