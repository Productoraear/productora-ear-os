'use strict';
// ============================================================================
// scripts/vampirize_ezkertza_v2.cjs — VAMPIRO S-CLASS v2
// Enumera el sitio del venue via WP REST API (paginas + media), rastrea las
// paginas reales, ataca el listado movil de bodas.net y decodifica wrappers
// de buscadores (DDG uddg=, Bing u=). Extrae TODO: matterport, iframes,
// videos (mp4/webm/youtube/vimeo), imagenes de galeria (/uploads/, /photo/).
// Escribe .antigravity/ezkertza_assets.json (ignorado por git).
// ============================================================================
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, '.antigravity', 'ezkertza_assets.json');
const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';

const SEEDS = [
  'https://www.ezkertzaberria.com/',
  'https://www.ezkertzaberria.com/wp-json/wp/v2/pages?per_page=100&_fields=id,slug,link,title',
  'https://www.ezkertzaberria.com/wp-json/wp/v2/media?per_page=100&_fields=id,source_url,mime_type,link',
  'https://m.bodas.net/restaurantes/ezkertza-berria',
  'https://m.bodas.net/restaurantes/ezkertza-berria-derio',
];

const seen = new Set();
const pages = [];
const B = {
  matterport: new Set(),
  iframes: new Set(),
  videos: new Set(),
  youtube: new Set(),
  vimeo: new Set(),
  tourLinks: new Set(),
  images: new Set(),
  internalPages: new Set(),
  bodasnetPages: new Set(),
};

const JUNK = /(\.css|\.js|\/feed\/|width=|noindex|elementor\/|fonts|emoji|oembed|\.ico|favicon|\.xml|\.txt|\.woff)/i;

function norm(raw, base) {
  let u = (raw || '').trim();
  if (!u || u.startsWith('data:') || u.startsWith('#') || u.startsWith('mailto:') || u.startsWith('javascript:')) return null;
  if (u.startsWith('//')) u = 'https:' + u;
  try { return new URL(u, base).href; } catch { return null; }
}

function push(set, u) { if (u) set.add(u); }

function classify(u, base) {
  const url = norm(u, base);
  if (!url || JUNK.test(url)) return;
  if (url.includes('matterport')) push(B.matterport, url);
  if (/youtube\.com\/(embed|watch)|youtu\.be\//i.test(url)) push(B.youtube, url);
  if (/player\.vimeo\.com|vimeo\.com\/\d+/i.test(url)) push(B.vimeo, url);
  if (/\.(mp4|webm|ogv|mov)(\?|#|$)/i.test(url)) push(B.videos, url);
  if (/\.(jpe?g|png|webp|gif)(\?|#|$)/i.test(url) && /wp-content\/uploads|cdn[0-9]?\.bodas\.net\/photo|\/photo\//i.test(url)) push(B.images, url);
  if (/360|tour[-_]?virtual|virtual[-_]?tour|recorrido/i.test(url)) push(B.tourLinks, url);
  if (url.startsWith('https://www.ezkertzaberria.com/') && !/\.(jpe?g|png|webp|gif|css|js|pdf|mp4|webm)/i.test(url)) push(B.internalPages, url);
  if (url.includes('bodas.net/restaurantes/') && !/\.(jpe?g|png|webp|gif|css|js)/i.test(url)) push(B.bodasnetPages, url);
}

function decodeWrappers(html) {
  const out = [];
  for (const m of html.matchAll(/uddg=([^&"']+)/gi)) {
    try { out.push(decodeURIComponent(m[1])); } catch { /* wrapper invalido */ }
  }
  for (const m of html.matchAll(/[?&]u=(a1[a-zA-Z0-9_=-]{20,})/g)) {
    try {
      const b64 = m[1].replace(/-/g, '+').replace(/_/g, '/');
      out.push(Buffer.from(b64 + '='.repeat((4 - (b64.length % 4)) % 4), 'base64').toString('utf8'));
    } catch { /* wrapper invalido */ }
  }
  return out;
}

function harvest(html, base) {
  // 1) atributos tipicos de medios (incluye srcset y lazy-load)
  for (const m of html.matchAll(/(?:src|href|content|srcset|data-src|data-lazy|data-original|data-bg)\s*=\s*["']([^"']+)["']/gi)) {
    for (const piece of m[1].split(',')) {
      classify(piece.split(/\s+/)[0], base);
    }
  }
  // 2) iframes
  for (const m of html.matchAll(/<iframe[^>]*src\s*=\s*["']([^"']+)["']/gi)) {
    push(B.iframes, norm(m[1], base));
    classify(m[1], base);
  }
  // 3) campos JSON de la API WP (source_url)
  for (const m of html.matchAll(/"source_url"\s*:\s*"([^"]+)"/g)) classify(m[1], base);
  // 4) barrido crudo: URLs multimedia embebidas en JSON/JS
  for (const m of html.matchAll(/https?:\/\/[^"'\s)\\<>]*(?:matterport|youtube\.com\/watch|youtu\.be\/|player\.vimeo\.com|\.mp4|\.webm)[^"'\s)\\<>]*/gi)) {
    const u = m[0].replace(/[),.;]+$/, '');
    if (u.includes('matterport')) push(B.matterport, u);
    if (/youtube|youtu\.be/i.test(u)) push(B.youtube, u);
    if (/vimeo/i.test(u)) push(B.vimeo, u);
    if (/\.(mp4|webm)/i.test(u)) push(B.videos, u);
  }
  // 5) fotos del CDN de bodas.net en cualquier atributo/JSON
  for (const m of html.matchAll(/https?:\/\/[^"'\s)\\<>]*cdn[0-9]?[^"'\s)\\<>]*bodas\.net[^"'\s)\\<>]*(?:photo|foto)[^"'\s)\\<>]*\.(?:jpe?g|png|webp)/gi)) {
    push(B.images, m[0]);
  }
  // 6) wrappers de buscadores (DDG/Bing) hacia la ficha real
  for (const u of decodeWrappers(html)) {
    if (u.includes('bodas.net') || u.toLowerCase().includes('ezkertza')) classify(u, base);
  }
}

async function get(url) {
  const res = await fetch(url, {
    headers: { 'User-Agent': UA, Accept: '*/*' },
    redirect: 'follow',
    signal: AbortSignal.timeout(30000),
  });
  const text = await res.text();
  return { status: res.status, finalUrl: res.url, text };
}

(async () => {
  const queue = [...SEEDS];
  while (queue.length && pages.length < 40) {
    const url = queue.shift();
    if (seen.has(url)) continue;
    seen.add(url);
    let status = 'ERR', finalUrl = url, text = '';
    try {
      const r = await get(url);
      status = r.status; finalUrl = r.finalUrl; text = r.text;
    } catch (e) {
      status = 'FETCH_FAIL:' + e.name;
    }
    pages.push({ url, status, finalUrl, bytes: Buffer.byteLength(text) });
    console.log(`[${status}] ${url} -> ${Buffer.byteLength(text)} B`);
    if (text) {
      harvest(text, finalUrl);
      if (url.startsWith('https://www.ezkertzaberria.com/')) {
        for (const p of B.internalPages) {
          if (!seen.has(p) && queue.length < 40) queue.push(p);
        }
      }
    }
  }
  const report = {
    generatedAt: new Date().toISOString(),
    pages,
    assets: {
      matterport: [...B.matterport],
      iframes: [...B.iframes],
      youtube: [...B.youtube],
      vimeo: [...B.vimeo],
      videos: [...B.videos],
      tourLinks: [...B.tourLinks],
      images: [...B.images],
    },
    bodasnetPages: [...B.bodasnetPages],
  };
  fs.writeFileSync(OUT, JSON.stringify(report, null, 2));
  const a = report.assets;
  console.log('RESUMEN: matterport=' + a.matterport.length + ' iframes=' + a.iframes.length +
    ' youtube=' + a.youtube.length + ' vimeo=' + a.vimeo.length + ' videos=' + a.videos.length +
    ' images=' + a.images.length + ' bodasnetPages=' + report.bodasnetPages.length);
  console.log('ESCRITO: ' + OUT);
})().catch((e) => { console.error('FATAL', e); process.exit(1); });

