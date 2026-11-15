#!/usr/bin/env node
/**
 * AUDITOR DE COBERTURA DE INTENCIÓN — LECTURA ÍNTEGRA (ZTLM: 0 tokens, 100% local)
 * ----------------------------------------------------------------------------
 * Recorre los sitemaps (índice -> hijos) en streaming, descarga el HTML COMPLETO de
 * cada URL (no solo título/primeras líneas), extrae el texto visible y puntúa si el
 * slug responde a las 4 capas de intención de búsqueda de EAR OS:
 *   1. ESPACIO   (finca, restaurante, salón, lugar, espacio...)
 *   2. LUGAR     (municipio INE de src/data/geo/spain-8131-municipalities.json)
 *   3. OCASIÓN   (boda, cumpleaños, aniversario, comunión, bautizo, corporativo...)
 *   4. NECESIDAD (dj, mobiliario, catering, música en directo, sonido, fotografía...)
 * + señales de conversión: CTA, precio visible, teléfono centralita, schema.org.
 *
 * Uso:
 *   node scripts/audit_intent_coverage_full.cjs --base=http://127.0.0.1:3007 --limit=500
 *   node scripts/audit_intent_coverage_full.cjs --base=https://productoraear.com --concurrency=4 --delay=250
 * Flags: --limit=N --offset=N --concurrency=N (def 4) --delay=ms (def 200) --resume
 * Salida: reports/intent_coverage/results.jsonl (1 línea/URL) + summary.json
 * Cortesía: concurrencia baja + pausa; solo auditar el propio dominio.
 */
const fs = require('fs');
const path = require('path');

const arg = (k, d) => {
  const hit = process.argv.find((a) => a.startsWith(`--${k}=`));
  return hit ? hit.split('=').slice(1).join('=') : d;
};
const BASE = arg('base', 'http://127.0.0.1:3007').replace(/\/$/, '');
const LIMIT = parseInt(arg('limit', '0'), 10) || Infinity;
const OFFSET = parseInt(arg('offset', '0'), 10) || 0;
const CONC = Math.max(1, Math.min(16, parseInt(arg('concurrency', '4'), 10) || 4));
const DELAY = parseInt(arg('delay', '200'), 10) || 0;
const RESUME = process.argv.includes('--resume');
const OUT_DIR = path.join(__dirname, '..', 'reports', 'intent_coverage');
const OUT = path.join(OUT_DIR, 'results.jsonl');
const CENTRALITA = '693693048';

const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

const LAYERS = {
  espacio: ['finca', 'restaurante', 'salon', 'lugar', 'espacio', 'castillo', 'hacienda', 'masia', 'cortijo', 'jardin', 'recinto', 'hotel'],
  ocasion: ['boda', 'cumpleanos', 'aniversario', 'comunion', 'bautizo', 'corporativo', 'despedida', 'graduacion', 'fiesta', 'evento', 'cena de empresa', 'quinceanera', 'fiestas patronales'],
  necesidad: ['dj', 'mobiliario', 'catering', 'musica en directo', 'mariachi', 'sonido', 'iluminacion', 'fotografo', 'fotografia', 'video', 'decoracion', 'floristeria', 'pantalla led', 'orquesta', 'carpa'],
};

function loadMunicipalities() {
  try {
    const f = path.join(__dirname, '..', 'src', 'data', 'geo', 'spain-8131-municipalities.json');
    return JSON.parse(fs.readFileSync(f, 'utf8')).map((m) => norm(m.name).replace(/[^a-z0-9 ]/g, ' ').trim()).filter((n) => n.length > 3);
  } catch { return []; }
}
const MUNI = loadMunicipalities();
const MUNI_SET = new Set(MUNI);

async function get(url, ms = 20000) {
  const ctl = new AbortController();
  const t = setTimeout(() => ctl.abort(), ms);
  try {
    const r = await fetch(url, { signal: ctl.signal, redirect: 'follow', headers: { 'user-agent': 'EAR-OS-IntentAuditor/1.0 (self-audit)' } });
    return { status: r.status, text: await r.text() };
  } catch (e) { return { status: 0, text: '', error: String(e.message || e) }; }
  finally { clearTimeout(t); }
}

async function collectUrls(sitemapUrl, seen = new Set(), out = []) {
  if (seen.has(sitemapUrl)) return out;
  seen.add(sitemapUrl);
  const { status, text } = await get(sitemapUrl, 60000);
  if (status !== 200) { console.error(`[sitemap] ${status} ${sitemapUrl}`); return out; }
  const locs = [...text.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map((m) => m[1].replace(/&amp;/g, '&'));
  if (/<sitemapindex/i.test(text)) {
    for (const l of locs) await collectUrls(l, seen, out);
  } else {
    for (const l of locs) out.push(l);
  }
  return out;
}

function visibleText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ').trim();
}

function layerHits(words, hay) {
  return words.filter((w) => new RegExp(`(^|[^a-z0-9])${w}`).test(hay));
}

function analyze(url, html) {
  const slugText = norm(decodeURIComponent(new URL(url).pathname).replace(/[-_/]+/g, ' '));
  const body = norm(visibleText(html));
  const h1 = norm((html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i) || [, ''])[1].replace(/<[^>]+>/g, ' '));
  const slugLayers = {}; const bodyLayers = {}; const missing = [];
  for (const [k, words] of Object.entries(LAYERS)) {
    slugLayers[k] = layerHits(words, slugText);
    bodyLayers[k] = layerHits(words, body);
    if (slugLayers[k].length && !bodyLayers[k].length) missing.push(`${k}:prometido-en-slug-no-en-contenido`);
  }
  const slugMuni = MUNI.find((m) => slugText.includes(m) && MUNI_SET.has(m));
  const bodyMuni = slugMuni ? (body.split(slugMuni).length - 1) : 0;
  if (slugMuni && bodyMuni < 2) missing.push('lugar:municipio-del-slug-apenas-aparece');
  const words = body.split(' ').length;
  const signals = {
    h1: h1.length > 3,
    cta: /(reservar|solicitar|cotizar|presupuesto|bloquear|consultar|whatsapp)/.test(body),
    price: /\d[\d.,]*\s?(€|eur)/.test(body),
    phone: body.replace(/\D/g, '').includes(CENTRALITA),
    schema: /application\/ld\+json/.test(html),
    canonical: /rel=["']canonical["']/.test(html),
  };
  if (words < 250) missing.push('contenido:fino(<250 palabras)');
  if (!signals.cta) missing.push('conversion:sin-CTA');
  const layerScore = Object.keys(LAYERS).filter((k) => bodyLayers[k].length).length + (slugMuni && bodyMuni >= 2 ? 1 : 0);
  const sigScore = Object.values(signals).filter(Boolean).length;
  const score = Math.round(((layerScore / 4) * 0.7 + (sigScore / 6) * 0.3) * 100);
  return { url, words, score, slugMuni: slugMuni || null, slugLayers, bodyLayers, signals, missing };
}

(async () => {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const done = new Set();
  if (RESUME && fs.existsSync(OUT)) {
    for (const l of fs.readFileSync(OUT, 'utf8').split('\n')) { try { done.add(JSON.parse(l).url); } catch {} }
  } else fs.writeFileSync(OUT, '');
  console.log(`[audit] base=${BASE} municipios=${MUNI.length} conc=${CONC}`);
  const all = await collectUrls(`${BASE}/sitemap.xml`);
  const urls = all.slice(OFFSET, OFFSET + (Number.isFinite(LIMIT) ? LIMIT : all.length)).filter((u) => !done.has(u));
  console.log(`[audit] urls en sitemap=${all.length} · a auditar=${urls.length}`);
  const stream = fs.createWriteStream(OUT, { flags: 'a' });
  const agg = { total: 0, http_error: 0, avg_score: 0, thin: 0, no_cta: 0, weak_urls: [] };
  let i = 0;
  const worker = async () => {
    while (i < urls.length) {
      const u = urls[i++];
      const r = await get(u);
      const rec = r.status === 200 ? analyze(u, r.text) : { url: u, http: r.status, error: r.error || null, score: 0, missing: ['http-error'] };
      stream.write(JSON.stringify(rec) + '\n');
      agg.total++; agg.avg_score += rec.score;
      if (r.status !== 200) agg.http_error++;
      if (rec.missing.includes('contenido:fino(<250 palabras)')) agg.thin++;
      if (rec.missing.includes('conversion:sin-CTA')) agg.no_cta++;
      if (rec.score < 50 && agg.weak_urls.length < 200) agg.weak_urls.push({ url: u, score: rec.score, missing: rec.missing });
      if (agg.total % 50 === 0) console.log(`[audit] ${agg.total}/${urls.length}`);
      if (DELAY) await new Promise((r2) => setTimeout(r2, DELAY));
    }
  };
  await Promise.all(Array.from({ length: CONC }, worker));
  stream.end();
  agg.avg_score = agg.total ? Math.round(agg.avg_score / agg.total) : 0;
  fs.writeFileSync(path.join(OUT_DIR, 'summary.json'), JSON.stringify({ base: BASE, at: new Date().toISOString(), ...agg }, null, 2));
  console.log(`[audit] FIN total=${agg.total} score_medio=${agg.avg_score} http_err=${agg.http_error} finas=${agg.thin} sinCTA=${agg.no_cta}`);
  console.log(`[audit] -> ${OUT}`);
})();
