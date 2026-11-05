'use strict';
// ============================================================================
// scripts/vampirize_ezkertza_assets.cjs — VAMPIRO S-CLASS
// Descarga el HTML crudo de las paginas del venue (ezkertzaberria.com) y de
// candidatos de marketplace (bodas.net + buscadores) y extrae HASTA EL ULTIMO
// BIT multimedia: iframes, tour 360 (Matterport), videos (mp4/webm/youtube/
// vimeo), imagenes de galeria y enlaces internos para re-rastreo BFS (prof. 1).
// Escribe .antigravity/ezkertza_assets.json (ignorado por git).
// Ejecucion: node scripts/vampirize_ezkertza_assets.cjs  (o VAMPIRIZAR_EZKERTZA.bat)
// ============================================================================
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, '.antigravity', 'ezkertza_assets.json');
const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';

const SEEDS = [
  'https://www.ezkertzaberria.com/',
  'https://www.ezkertzaberria.com/instalaciones/',
  'https://html.duckduckgo.com/html/?q=bodas.net+ezkertza+berria+derio',
  'https://www.bing.com/search?q=bodas.net+ezkertza+berria+derio',
  'https://www.bodas.net/restaurantes/bizkaia',
  'https://www.bodas.net/restaurantes/derio',
  'https://www.bodas.net/restaurantes/ezkertza-berria',
  'https://www.bodas.net/restaurantes/ezkertza-berria-derio',
];

const seen = new Set();
const pages = [];
const buckets = {
  iframes: new Set(),
  videos: new Set(),
  images: new Set(),
  youtube: new Set(),
  vimeo: new Set(),
  matterport: new Set(),
  tourLinks: new Set(),
  internalLinks: new Set(),
  links: new Set(),
};

async function get(url) {
  const res = await fetch(url, {
    headers: { 'User-Agent': UA, Accept: 'text/html,application/xhtml+xml' },
    redirect: 'follow',
    signal: AbortSignal.timeout(30000),
  });
  const html = await res.text();
  return { status: res.status, finalUrl: res.url, html };
}

function norm(raw, baseUrl) {
  let u = (raw || '').trim();
  if (!u || u.startsWith('data:') || u.startsWith('#') || u.startsWith('mailto:')) return null;
  if (u.startsWith('//')) u = 'https:' + u;
  try { return new URL(u, baseUrl).href; } catch { return null; }
}

function harvest(html, baseUrl) {
  const push = (set, u) => { if (u) set.add(u); };
  for (const m of html.matchAll(/(?:src|href|content)\s*=\s*["']([^"']+)["']/gi)) {
    const u = norm(m[1], baseUrl);
    if (!u) continue;
    push(buckets.links, u);
    if (u.includes('matterport')) push(buckets.matterport, u);
    if (/youtube\.com\/(embed|watch)|youtu\.be\//i.test(u)) push(buckets.youtube, u);
    if (/player\.vimeo\.com|vimeo\.com\/\d+/i.test(u)) push(buckets.vimeo, u);
    if (/\.(mp4|webm|ogv|mov)(\?|#|$)/i.test(u)) push(buckets.videos, u);
    if (/\.(jpe?g|png|webp|gif)(\?|#|$)/i.test(u)) push(buckets.images, u);
    if (/360|tour[-_]?virtual|virtual[-_]?tour|recorrido/i.test(u)) push(buckets.tourLinks, u);
    if (u.startsWith('https://www.ezkertzaberria.com/')) push(buckets.internalLinks, u);
  }
  for (const m of html.matchAll(/<iframe[^>]*src\s*=\s*["']([^"']+)["']/gi)) {
    const u = norm(m[1], baseUrl);
    push(buckets.iframes, u);
  }
  for (const m of html.matchAll(/https?:\/\/[^"'\s)]*(?:matterport|youtube\.com|youtu\.be|vimeo\.com|\.mp4|\.webm)[^"'\s)]*/gi)) {
    push(buckets.tourLinks, m[0]);
  }
}

(async () => {
  const queue = [...SEEDS];
  while (queue.length > 0 && pages.length < 30) {
    const url = queue.shift();
    if (seen.has(url)) continue;
    seen.add(url);
    let status = 'ERR', finalUrl = url, html = '';
    try {
      const r = await get(url);
      status = r.status; finalUrl = r.finalUrl; html = r.html;
    } catch (e) {
      status = 'FETCH_FAIL:' + e.name;
    }
    pages.push({ url, status, finalUrl, bytes: Buffer.byteLength(html) });
    console.log(`[${status}] ${url} -> ${Buffer.byteLength(html)} B`);
    if (html) {
      harvest(html, finalUrl);
      if (url.startsWith('https://www.ezkertzaberria.com/')) {
        for (const link of buckets.internalLinks) {
          if (!seen.has(link) && queue.length < 30 && !/\.(jpe?g|png|webp|gif|pdf|mp4|webm)/i.test(link)) {
            queue.push(link);
          }
        }
      }
    }
  }
  const bodasnetCandidates = [...buckets.links].filter((u) => u.includes('bodas.net'));
  const report = {
    generatedAt: new Date().toISOString(),
    pages,
    assets: {
      matterport: [...buckets.matterport],
      iframes: [...buckets.iframes],
      youtube: [...buckets.youtube],
      vimeo: [...buckets.vimeo],
      videos: [...buckets.videos],
      tourLinks: [...buckets.tourLinks],
      images: [...buckets.images],
    },
    bodasnetCandidates,
  };
  fs.writeFileSync(OUT, JSON.stringify(report, null, 2));
  const a = report.assets;
  console.log('RESUMEN: matterport=' + a.matterport.length + ' iframes=' + a.iframes.length +
    ' youtube=' + a.youtube.length + ' vimeo=' + a.vimeo.length + ' videos=' + a.videos.length +
    ' images=' + a.images.length + ' bodasnetCandidates=' + bodasnetCandidates.length);
  console.log('ESCRITO: ' + OUT);
})().catch((e) => { console.error('FATAL', e); process.exit(1); });
