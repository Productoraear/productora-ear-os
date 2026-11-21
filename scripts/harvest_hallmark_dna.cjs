#!/usr/bin/env node
/**
 * ════════════════════════════════════════════════════════════════════════════
 * SCRIPTS/HARVEST_HALLMARK_DNA.CJS — INGESTA DETERMINISTA DEL ADN DE HALLMARK
 * ════════════════════════════════════════════════════════════════════════════
 * Operación Vampirización Total · FASE 2 (sondeo externo) + FASE 1 (paquete local).
 *
 * Qué hace, sin inventar nada:
 *   1. Descarga `https://www.usehallmark.com/` y sus hojas de estilo enlazadas.
 *   2. Extrae, por parsing literal (no por memoria del modelo):
 *        · cada declaración `--token: valor` de los bloques de tema del sitio;
 *        · las familias tipográficas servidas (`fonts.googleapis.com`);
 *        · los pares papel / acento y su ratio de contraste WCAG 2.2;
 *        · las curvas de easing y los radios declarados.
 *   3. Lee el paquete local `nutlope/hallmark` (`.claude/skills/hallmark/`):
 *        · la cabecera de cada tema (papel, display, acento, postura, foto);
 *        · el índice de macroestructuras disponible.
 *   4. Escribe `scratch/HALLMARK_HARVESTED_DNA.json` con procedencia
 *      (url, status, bytes, sha256 del cuerpo, ts ISO-8601) y estado honesto.
 *
 * Anti-fachada (AF-1 / AF-2 / AF-5): si la red falla, el artefacto se escribe
 * igualmente con `source:"local-only"`, `probed:false` y las urls a `null`.
 * Nunca se emite "OK" por defecto. Sin dependencias externas.
 *
 * USO:
 *   node scripts/harvest_hallmark_dna.cjs
 *   node scripts/harvest_hallmark_dna.cjs --offline
 * ════════════════════════════════════════════════════════════════════════════
 */
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const https = require('node:https');

const ROOT = process.cwd();
const OUT_FILE = path.join(ROOT, 'scratch', 'HALLMARK_HARVESTED_DNA.json');
const SKILL_DIR = path.join(ROOT, '.claude', 'skills', 'hallmark');
const THEMES_DIR = path.join(SKILL_DIR, 'references', 'themes');
const MACRO_DIR = path.join(SKILL_DIR, 'references', 'macrostructures');
const SITE_ORIGIN = 'https://www.usehallmark.com';
const USER_AGENT = 'Mozilla/5.0 (compatible; EAROS-HallmarkHarvest/1.0)';
const TIMEOUT_MS = 12000;
const OFFLINE = process.argv.includes('--offline');

const sha256 = (buffer) => crypto.createHash('sha256').update(buffer).digest('hex');
const nowIso = () => new Date().toISOString();

/** GET con timeout duro (INV-17: AbortController <= 8s en APIs externas). */
function get(url) {
  return new Promise((resolve) => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
    const request = https.get(url, { headers: { 'user-agent': USER_AGENT }, signal: controller.signal }, (res) => {
      const chunks = [];
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => {
        clearTimeout(timer);
        const body = Buffer.concat(chunks);
        resolve({ status: res.statusCode ?? 0, headers: res.headers, body });
      });
    });
    request.on('error', (error) => {
      clearTimeout(timer);
      resolve({ status: 0, headers: {}, body: Buffer.alloc(0), error: error.message });
    });
  });
}

/* ── Contraste WCAG 2.2 ───────────────────────────────────────────────── */

function rgbToHex(rgb) {
  return '#' + rgb.map((c) => Math.round(Math.min(255, Math.max(0, c))).toString(16).padStart(2, '0')).join('');
}

/** oklch(L C H) → [r, g, b] 0-255 (fórmula CSS Color 4, sin librerías). */
function oklchToRgb(l, c, h) {
  const hRad = (h * Math.PI) / 180;
  const a = c * Math.cos(hRad);
  const b = c * Math.sin(hRad);
  const lPrime = l + 0.3963377774 * a + 0.2158037573 * b;
  const mPrime = l - 0.1055613458 * a - 0.0638541728 * b;
  const sPrime = l - 0.0894841775 * a - 1.291485548 * b;
  const l3 = lPrime ** 3;
  const m3 = mPrime ** 3;
  const s3 = sPrime ** 3;
  const lin = [
    4.0767416621 * l3 - 3.3077115913 * m3 + 0.2309699292 * s3,
    -1.2684380046 * l3 + 2.6097574011 * m3 - 0.3413193965 * s3,
    -0.0041960863 * l3 - 0.7034186147 * m3 + 1.707614701 * s3,
  ];
  return lin.map((channel) => {
    const v = channel <= 0.0031308 ? 12.92 * channel : 1.055 * channel ** (1 / 2.4) - 0.055;
    return v * 255;
  });
}

/** Cualquier color CSS declarado en el sitio → [r,g,b] | null. */
function parseColor(value) {
  const raw = String(value).trim();
  const ok = raw.match(/oklch\(\s*([\d.]+)%?\s+([\d.]+)\s+([\d.]+)/i);
  if (ok) {
    const l = ok[1].endsWith('%') || Number(ok[1]) > 1 ? Number(ok[1]) / 100 : Number(ok[1]);
    return oklchToRgb(l, Number(ok[2]), Number(ok[3]));
  }
  const hex = raw.match(/#([0-9a-f]{3}|[0-9a-f]{6})\b/i);
  if (hex) {
    const value6 = hex[1].length === 3 ? hex[1].split('').map((ch) => ch + ch).join('') : hex[1];
    return [0, 2, 4].map((offset) => parseInt(value6.slice(offset, offset + 2), 16));
  }
  const rgba = raw.match(/rgba?\(\s*(\d+)[,\s]+(\d+)[,\s]+(\d+)/i);
  if (rgba) return [Number(rgba[1]), Number(rgba[2]), Number(rgba[3])];
  return null;
}

function luminance(rgb) {
  const [r, g, b] = rgb.map((channel) => {
    const c = channel / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrastRatio(fgRgb, bgRgb) {
  const a = luminance(fgRgb);
  const b = luminance(bgRgb);
  const [hi, lo] = a > b ? [a, b] : [b, a];
  return Number(((hi + 0.05) / (lo + 0.05)).toFixed(2));
}

/* ── Parsing de hojas de estilo ───────────────────────────────────────── */

/** Extrae `--token: valor;` de cualquier texto CSS (incluidos bloques inline). */
function extractCustomProperties(css) {
  const tokens = {};
  const regex = /(--[a-z0-9-]+)\s*:\s*([^;}"]+)/gi;
  let match;
  while ((match = regex.exec(css)) !== null) {
    const name = match[1];
    // `style="--at = 50%"` (comparador del sitio) no es un token del sistema.
    if (/\s=/.test(` ${match[0]}`)) continue;
    const value = match[2].trim();
    // Los atributos `style="--i:0"` del HTML no son tokens del sistema: un
    // valor CSS jamás arrastra etiquetas. Las funciones (`oklch(...)`) sí valen.
    if (/[<>{}]/.test(value)) continue;
    if (name in tokens) continue;
    tokens[name] = value;
  }

  return tokens;
}

function extractFontFamilies(html) {
  const families = new Set();
  const regex = /family=([A-Za-z+0-9,;@]+)/g;
  let match;
  while ((match = regex.exec(html)) !== null) {
    for (const part of match[1].split(/[;,]/)) {
      const family = part.split(':')[0].replace(/\+/g, ' ').trim();
      if (family && family !== '@' && /^[A-Za-z ]+$/.test(family)) families.add(family);
    }
  }
  return [...families];
}

function extractEasings(css) {
  const found = new Set();
  const regex = /cubic-bezier\(([^)]+)\)/gi;
  let match;
  while ((match = regex.exec(css)) !== null) found.add(`cubic-bezier(${match[1].trim().replace(/\s+/g, ' ')})`);
  return [...found];
}

function extractRadii(css) {
  const found = new Map();
  const regex = /border-radius\s*:\s*([^;}]+)/gi;
  let match;
  while ((match = regex.exec(css)) !== null) {
    const value = match[1].trim();
    found.set(value, (found.get(value) ?? 0) + 1);
  }
  return [...found.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 12)
    .map(([value, count]) => ({ value, count }));
}

/* ── Paquete local ─────────────────────────────────────────────────────── */

function readThemeHeaders() {
  if (!fs.existsSync(THEMES_DIR)) return [];
  return fs
    .readdirSync(THEMES_DIR)
    .filter((file) => file.endsWith('.md') && file !== 'README.md')
    .map((file) => {
      const source = fs.readFileSync(path.join(THEMES_DIR, file), 'utf8');
      const header = {};
      const block = source.match(/^---\r?\n([\s\S]*?)\r?\n---/);
      if (block) {
        for (const line of block[1].split(/\r?\n/)) {
          const kv = line.match(/^([a-z-]+)\s*:\s*(.+)$/i);
          if (kv) header[kv[1]] = kv[2].trim();
        }
      }
      const rootBlock = source.match(/:root\s*\{([\s\S]*?)\}/);
      return {
        slug: file.replace(/\.md$/, ''),
        name: header.name ?? null,
        genre: header.genre ?? null,
        paper: header.paper ?? null,
        display: header.display ?? null,
        accent: header.accent ?? null,
        posture: header.posture ?? null,
        material: header.material ?? null,
        photo: header.photo ?? null,
        keywords: header.keywords ?? null,
        cssTokens: rootBlock ? extractCustomProperties(rootBlock[1]) : {},
      };
    });
}

function readMacrostructures() {
  if (!fs.existsSync(MACRO_DIR)) return [];
  return fs
    .readdirSync(MACRO_DIR)
    .filter((file) => file.endsWith('.md'))
    .map((file) => file.replace(/\.md$/, ''));
}

/* ── Selección de temas relevantes para EAR OS ─────────────────────────── */

const RELEVANT_SLUGS = [
  'midnight', 'terminal', 'console', 'darkroom', 'kiln', 'blueprint',
  'editorial', 'atelier', 'specimen', 'lumen', 'vantage', 'rim', 'solstice',
];

function normalizeTheme(theme) {
  const tokenColor = (name) => {
    const value = theme.cssTokens[name];
    const rgb = value ? parseColor(value) : null;
    return rgb ? { raw: value, hex: rgbToHex(rgb), rgb } : null;
  };
  const paper = tokenColor('--color-paper');
  const ink = tokenColor('--color-ink');
  const ink2 = tokenColor('--color-ink-2');
  const muted = tokenColor('--color-muted');
  const accent = tokenColor('--color-accent');
  const contrast = [];
  if (paper && ink) contrast.push({ pair: 'ink / paper', ratio: contrastRatio(ink.rgb, paper.rgb), min: 4.5 });
  if (paper && ink2) contrast.push({ pair: 'ink-2 / paper', ratio: contrastRatio(ink2.rgb, paper.rgb), min: 4.5 });
  if (paper && muted) contrast.push({ pair: 'muted / paper', ratio: contrastRatio(muted.rgb, paper.rgb), min: 4.5 });
  if (paper && accent) contrast.push({ pair: 'accent / paper', ratio: contrastRatio(accent.rgb, paper.rgb), min: 3.0 });
  return {
    slug: theme.slug,
    name: theme.name,
    genre: theme.genre,
    paper: theme.paper,
    display: theme.display,
    accent: theme.accent,
    posture: theme.posture,
    material: theme.material,
    photo: theme.photo,
    palette: {
      paper: paper && paper.hex,
      paper2: tokenColor('--color-paper-2')?.hex ?? null,
      paper3: tokenColor('--color-paper-3')?.hex ?? null,
      ink: ink && ink.hex,
      ink2: ink2 && ink2.hex,
      muted: muted && muted.hex,
      rule: tokenColor('--color-rule')?.hex ?? null,
      accent: accent && accent.hex,
      accentInk: tokenColor('--color-accent-ink')?.hex ?? null,
      focus: tokenColor('--color-focus')?.hex ?? null,
    },
    geometry: {
      radiusCard: theme.cssTokens['--radius-card'] ?? null,
      radiusPill: theme.cssTokens['--radius-pill'] ?? null,
      ruleHair: theme.cssTokens['--rule-hair'] ?? null,
      shadowCard: theme.cssTokens['--shadow-card'] ?? null,
      trackingDisplay: theme.cssTokens['--tracking-display'] ?? null,
      displayWeight: theme.cssTokens['--display-weight'] ?? null,
      fonts: {
        display: theme.cssTokens['--font-display'] ?? null,
        body: theme.cssTokens['--font-body'] ?? null,
        outlier: theme.cssTokens['--font-outlier'] ?? null,
      },
    },
    wcag: contrast,
  };
}

/* ── Main ──────────────────────────────────────────────────────────────── */

async function main() {
  const startedAt = nowIso();
  const probe = { probed: false, source: OFFLINE ? 'local-only' : 'live', mode: OFFLINE ? 'SIMULADO' : 'REAL' };
  const sources = [];

  let siteHtml = '';
  let siteCss = '';

  if (!OFFLINE) {
    const home = await get(`${SITE_ORIGIN}/`);
    probe.probed = home.status === 200;
    sources.push({
      url: `${SITE_ORIGIN}/`,
      status: home.status,
      bytes: home.body.length,
      sha256: home.body.length ? sha256(home.body) : null,
      contentType: home.headers['content-type'] ?? null,
      ts: nowIso(),
      error: home.error ?? null,
    });
    siteHtml = home.body.toString('utf8');

    const cssHrefs = [...siteHtml.matchAll(/<link[^>]+rel="stylesheet"[^>]*href="([^"]+)"/gi)].map((m) => m[1]);
    for (const href of cssHrefs) {
      const absolute = href.startsWith('http')
        ? href
        : href.startsWith('/')
          ? `${SITE_ORIGIN}${href}`
          : `${SITE_ORIGIN}/${href}`;
      if (absolute.includes('fonts.googleapis.com')) continue;
      const css = await get(absolute);
      sources.push({
        url: absolute,
        status: css.status,
        bytes: css.body.length,
        sha256: css.body.length ? sha256(css.body) : null,
        contentType: css.headers['content-type'] ?? null,
        ts: nowIso(),
        error: css.error ?? null,
      });
      if (css.status === 200) siteCss += `\n/* ${absolute} */\n${css.body.toString('utf8')}`;
    }
  }

  /* Documento completo = HTML + CSS enlazado: los tokens viven en ambos. */
  const documentCss = `${siteHtml}\n${siteCss}`;
  const siteTokens = extractCustomProperties(documentCss);
  const siteFonts = extractFontFamilies(siteHtml);
  const siteEasings = extractEasings(documentCss);
  const siteRadii = extractRadii(siteCss);

  /* Tokens de tema del sitio: `--d-<slug>-p` (papel) y `--d-<slug>-a` (acento). */
  const siteThemes = {};
  for (const [name, value] of Object.entries(siteTokens)) {
    const deal = name.match(/^--d-([a-z0-9-]+?)-([pa])$/i);
    if (!deal) continue;
    const slug = deal[1];
    const slot = deal[2] === 'p' ? 'paper' : 'accent';
    siteThemes[slug] = siteThemes[slug] ?? {};
    const rgb = parseColor(value);
    siteThemes[slug][slot] = { raw: value, hex: rgb ? rgbToHex(rgb) : null };
  }
  const siteThemeRows = Object.entries(siteThemes)
    .map(([slug, value]) => {
      const paperRgb = value.paper ? parseColor(value.paper.raw) : null;
      const accentRgb = value.accent ? parseColor(value.accent.raw) : null;
      const inkRgb = paperRgb && luminance(paperRgb) < 0.2 ? [250, 247, 240] : [18, 18, 20];
      return {
        slug,
        paper: value.paper?.hex ?? null,
        accent: value.accent?.hex ?? null,
        paperRaw: value.paper?.raw ?? null,
        accentRaw: value.accent?.raw ?? null,
        luminance: paperRgb ? Number(luminance(paperRgb).toFixed(4)) : null,
        contrastAccentOnPaper: paperRgb && accentRgb ? contrastRatio(accentRgb, paperRgb) : null,
        contrastInkOnPaper: paperRgb ? contrastRatio(inkRgb, paperRgb) : null,
      };
    })
    .sort((a, b) => String(a.slug).localeCompare(String(b.slug)));

  /* Paquete local. */
  const localThemes = readThemeHeaders();
  const relevant = localThemes.filter((theme) => RELEVANT_SLUGS.includes(theme.slug)).map(normalizeTheme);

  const artifact = {
    schema: 'EAR_OS_HALLMARK_DNA/v1',
    generatedAt: nowIso(),
    startedAt,
    generator: 'scripts/harvest_hallmark_dna.cjs',
    status: probe.probed ? 'VERIFICADO' : 'SIN_EVIDENCIA',
    probe,
    provenance: {
      siteUrl: SITE_ORIGIN,
      packageSource: 'Nutlope/hallmark',
      packageCommit: readPackageCommit(),
      packagePath: '.claude/skills/hallmark',
      sources,
    },
    harvestedFromSite: {
      tokens: siteTokens,
      tokenCount: Object.keys(siteTokens).length,
      fontFamilies: siteFonts,
      easings: siteEasings,
      radii: siteRadii,
      dealtThemes: siteThemeRows,
      dealtThemesCount: siteThemeRows.length,
    },
    harvestedFromPackage: {
      themeCount: localThemes.length,
      themes: localThemes.map((theme) => ({
        slug: theme.slug,
        name: theme.name,
        genre: theme.genre,
        paper: theme.paper,
        display: theme.display,
        accent: theme.accent,
        posture: theme.posture,
        material: theme.material,
        photo: theme.photo,
      })),
      relevantThemes: relevant,
      macrostructures: readMacrostructures(),
    },
    earOsSynthesis: buildEarOsSynthesis(),
  };

  fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true });
  fs.writeFileSync(OUT_FILE, `${JSON.stringify(artifact, null, 2)}\n`, 'utf8');
  const outSha = sha256(fs.readFileSync(OUT_FILE));

  console.log('── HALLMARK DNA HARVEST ──');
  for (const source of sources) {
    const mark = source.status === 200 ? 'OK  ' : 'FAIL';
    console.log(
      `  ${mark} ${String(source.status).padStart(3)} ${String(source.bytes).padStart(7)} B sha256:${(source.sha256 ?? '-').slice(0, 12)} ${source.url}`,
    );
  }
  console.log(`  tokens del sitio: ${artifact.harvestedFromSite.tokenCount}`);
  console.log(`  temas del sitio (dealt): ${artifact.harvestedFromSite.dealtThemesCount}`);
  console.log(`  temas del paquete local: ${localThemes.length} (relevantes EAR OS: ${relevant.length})`);
  console.log(`  macroestructuras: ${artifact.harvestedFromPackage.macrostructures.length}`);
  console.log(`  artefacto: ${path.relative(ROOT, OUT_FILE)} sha256:${outSha}`);
  console.log(`HARVEST=${probe.probed ? 'VERIFICADO' : 'SIN_EVIDENCIA'}`);

  if (!probe.probed && !OFFLINE) {
    console.error('  [AF-5] Sin cuerpo HTTP: el artefacto declara source:"local-only", probed:false.');
    process.exitCode = 1;
  }
  return artifact;
}

function readPackageCommit() {
  const lockPath = path.join(ROOT, 'skills-lock.json');
  if (!fs.existsSync(lockPath)) return null;
  try {
    const lock = JSON.parse(fs.readFileSync(lockPath, 'utf8'));
    return lock?.skills?.hallmark?.commit ?? null;
  } catch {
    return null;
  }
}

/**
 * Síntesis EAR OS: los tres temas de la orden ejecutiva, derivados de los
 * tokens de Aura Onyx que YA gobiernan la casa (globals.css :root).
 * Cada valor de contraste se calcula, no se afirma.
 */
function buildEarOsSynthesis() {
  const auraOnyx = {
    void: '#030305',
    surface: '#0A0A0E',
    panel: '#0F0F16',
    border: '#1E1E26',
    gold: '#ecb613',
    ink: '#F4F1EA',
    ink2: '#D6D2C7',
    body: '#C9C4B8',
    tertiary: '#8E8A80',
  };
  const pair = (fg, bg, min, label) => {
    const ratio = contrastRatio(parseColor(fg), parseColor(bg));
    return { label, fg, bg, min, ratio, pass: ratio >= min };
  };
  return {
    themes: [
      {
        id: 'aura-onyx-hallmark',
        label: 'Aura Onyx Hallmark',
        tokens: auraOnyx,
        typography: { display: 'Syne', body: 'Inter', data: 'JetBrains Mono' },
        ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
        wcag: [
          pair(auraOnyx.ink, auraOnyx.void, 4.5, 'ink sobre void'),
          pair(auraOnyx.ink2, auraOnyx.void, 4.5, 'ink-2 sobre void'),
          pair(auraOnyx.body, auraOnyx.surface, 4.5, 'body sobre surface'),
          pair(auraOnyx.tertiary, auraOnyx.surface, 4.5, 'tertiary sobre surface'),
          pair(auraOnyx.gold, auraOnyx.surface, 3.0, 'gold sobre surface'),
          pair('#120D00', auraOnyx.gold, 4.5, 'tinta sobre oro (boton)'),
        ],
      },
      {
        id: 'linear-dark-minimal',
        label: 'Linear Dark Minimal',
        tokens: {
          canvas: '#0B0B0F',
          surface: '#111116',
          border: '#20202A',
          ink: '#EDEDF2',
          ink2: '#A1A1AA',
          signal: '#5B8CFF',
        },
        typography: { display: 'Inter', body: 'Inter', data: 'JetBrains Mono' },
        ease: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
        wcag: [
          pair('#EDEDF2', '#0B0B0F', 4.5, 'ink sobre canvas'),
          pair('#A1A1AA', '#111116', 4.5, 'ink-2 sobre surface'),
          pair('#5B8CFF', '#111116', 3.0, 'signal sobre surface'),
        ],
      },
      {
        id: 'editorial-gourmet',
        label: 'Editorial Gourmet',
        tokens: {
          paper: '#0A0A0E',
          paper2: '#101014',
          ink: '#F4F1EA',
          ink2: '#C9C4B8',
          accent: '#ecb613',
          rule: '#1E1E26',
        },
        typography: { display: 'Syne', body: 'Inter', outlier: 'Fraunces' },
        ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
        wcag: [
          pair('#F4F1EA', '#0A0A0E', 4.5, 'ink sobre paper'),
          pair('#C9C4B8', '#0A0A0E', 4.5, 'ink-2 sobre paper'),
          pair('#ecb613', '#0A0A0E', 3.0, 'accent sobre paper'),
        ],
      },
    ],
  };
}

if (require.main === module) {
  main().catch((error) => {
    console.error('HARVEST=ERROR', error);
    process.exitCode = 1;
  });
}

module.exports = { oklchToRgb, parseColor, contrastRatio, extractCustomProperties };
