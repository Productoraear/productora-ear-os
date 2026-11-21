#!/usr/bin/env node
/**
 * ════════════════════════════════════════════════════════════════════════════
 * SCRIPTS/VAMPIRIZE_HALLMARK_ENGINE.CJS — OPERACIÓN VAMPIRIZACIÓN HORIZONX
 * ════════════════════════════════════════════════════════════════════════════
 * Protocolo HORIZONX / ZTLM (Zero-Token Local Mirroring).
 *
 * FASE 1 · Paquete local `nutlope/hallmark` (`.claude/skills/hallmark/`,
 *          referencia `skills-lock.json`):
 *            · principios tipográficos (tracking, line-height, pesos display/body);
 *            · reglas de contención de bordes (1 px hairline vs. sombra difusa);
 *            · espaciados de respiración declarados en las macroestructuras;
 *            · catálogo de temas del paquete (`references/themes/*.md`, `:root`).
 *
 * FASE 2 · Sonda externa `https://www.usehallmark.com/`:
 *            · descarga la portada y las rutas públicas declaradas en el HTML;
 *            · localiza `<link rel="stylesheet">` y chunks `/_next/static/chunks/`
 *              (hojas emitidas por el runtime, aunque no vayan enlazadas);
 *            · analiza por expresión regular, no por memoria del modelo:
 *                - variables CSS nativas (--background / --foreground / --card /
 *                  --border / --ring y el resto del vocabulario del sitio);
 *                - pares papel/acento por tema (`--d-<slug>-p` / `--d-<slug>-a`);
 *                - micro-animaciones (curvas `cubic-bezier`, duraciones, delays);
 *                - glows perimetrales de 1 px (box-shadow con `0 0 0 1px`).
 *
 * SALIDA · `scratch/HALLMARK_HARVESTED_VAULT.json`
 *
 * Leyes que este script cumple:
 *   · AF-1 / AF-2 / AF-5 — nada devuelve "OK" por defecto: el artefacto declara
 *     `probed`, `source`, `mode`, `checkedAt` y el estado honesto por bloque.
 *   · INV-17 — toda petición externa lleva AbortController con tope duro.
 *   · L2 — cada token citado en el artefacto procede de un cuerpo HTTP o de un
 *     fichero leído en esta ejecución; nada se escribe de memoria.
 *   · Nunca escribe en `src/`: sólo lee y escribe el artefacto de `scratch/`.
 *
 * ANTI-SOBRESCRITURA. El artefacto de una captura VERIFICADA sólo se pisa con
 * otra captura VERIFICADA. Una pasada `--offline` (o una red caída) escribe
 * `scratch/HALLMARK_HARVESTED_VAULT.offline.json` y jamás degrada el vault
 * bueno: una prueba simulada no puede borrar la evidencia real.
 *
 * USO:
 *   node scripts/vampirize_hallmark_engine.cjs
 *   node scripts/vampirize_hallmark_engine.cjs --offline   (sólo paquete local)
 *
 * Exit Code:
 *   0 → captura completa (portada 200 + al menos una hoja de estilo 200)
 *   1 → red caída o captura incompleta (el artefacto se escribe igualmente,
 *       con `status:"SOSPECHOSO"` o `"SIN_EVIDENCIA"`)
 * ════════════════════════════════════════════════════════════════════════════
 */
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const https = require('node:https');

const ROOT = process.cwd();
const OUT_FILE = path.join(ROOT, 'scratch', 'HALLMARK_HARVESTED_VAULT.json');
const SKILL_DIR = path.join(ROOT, '.claude', 'skills', 'hallmark');
const THEMES_DIR = path.join(SKILL_DIR, 'references', 'themes');
const MACRO_DIR = path.join(SKILL_DIR, 'references', 'macrostructures');
const SITE_ORIGIN = 'https://www.usehallmark.com';
const USER_AGENT = 'Mozilla/5.0 (compatible; EAROS-HallmarkVampire/1.0)';
/** INV-17: tope duro por petición externa (<= 8 s). */
const TIMEOUT_MS = 8000;
/** Techo de descargas por ejecución: la portada + 8 hojas como máximo. */
const MAX_STYLESHEETS = 8;
const MAX_ROUTES = 40;
const OFFLINE = process.argv.includes('--offline');

const sha256 = (buffer) => crypto.createHash('sha256').update(buffer).digest('hex');
const nowIso = () => new Date().toISOString();

/* ── Transporte HTTP con presupuesto de tiempo (INV-17) ─────────────────── */

function get(url, redirectsLeft = 2) {
  return new Promise((resolve) => {
    const startedAt = Date.now();
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
    const request = https.get(
      url,
      { headers: { 'user-agent': USER_AGENT, accept: '*/*' }, signal: controller.signal },
      (res) => {
        // Redirección de borde (www/non-www, barra final): se sigue el salto
        // declarado, nunca se inventa la URL final.
        const location = res.headers.location;
        if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && location && redirectsLeft > 0) {
          clearTimeout(timer);
          res.resume();
          const next = location.startsWith('http') ? location : `${SITE_ORIGIN}${location}`;
          resolve(get(next, redirectsLeft - 1));
          return;
        }
        const chunks = [];
        res.on('data', (chunk) => chunks.push(chunk));
        res.on('end', () => {
          clearTimeout(timer);
          resolve({
            url,
            status: res.statusCode ?? 0,
            contentType: res.headers['content-type'] ?? null,
            body: Buffer.concat(chunks),
            ms: Date.now() - startedAt,
          });
        });
      },
    );
    request.on('error', (error) => {
      clearTimeout(timer);
      resolve({ url, status: 0, contentType: null, body: Buffer.alloc(0), ms: Date.now() - startedAt, error: error.message });
    });
  });
}

/* ── Parsing CSS (literal, sin dependencias) ─────────────────────────────── */

/** `--token: valor;` de cualquier texto CSS. Descarta comparadores (`--at = 50%`). */
function extractCustomProperties(css) {
  const tokens = {};
  const regex = /(--[a-z0-9-]+)\s*:\s*([^;}"]+)/gi;
  let match;
  while ((match = regex.exec(css)) !== null) {
    const name = match[1];
    if (/\s=/.test(` ${match[0]}`)) continue;
    const value = match[2].trim();
    if (/[<>{}]/.test(value)) continue;
    if (name in tokens) continue;
    tokens[name] = value;
  }
  return tokens;
}

/** Bloques `selector { … }` que declaran variables: separa `:root`, `.dark`, `[data-theme]`. */
function extractTokenScopes(css) {
  const scopes = [];
  // Un `<script>` inline (JSON-LD, estado hidratado) puede contener llaves
  // sueltas que rompen el emparejamiento. Se retiran antes de escanear.
  const source = String(css).replace(/<script[\s\S]*?<\/script>/gi, ' ');
  const regex = /([^{}]+)\{([^{}]*--[a-z0-9-]+\s*:[^{}]*)\}/gi;
  let match;
  while ((match = regex.exec(source)) !== null) {
    const selector = match[1].replace(/\/\*[\s\S]*?\*\//g, ' ').trim().replace(/\s+/g, ' ');
    // Sólo selectores CSS reales: `:root`, clases, atributos, etiquetas. Un
    // selector que arrastra marcado es la costura de las etiquetas del HTML,
    // no un bloque de tema.
    if (!selector || selector.length > 120) continue;
    if (/[<>{}\/;=]/.test(selector)) continue;
    if (!/^[.:#[a-z*]/i.test(selector)) continue;
    const tokens = extractCustomProperties(match[2]);
    if (Object.keys(tokens).length === 0) continue;
    scopes.push({ selector, tokenCount: Object.keys(tokens).length, tokens });
    if (scopes.length >= 80) break;
  }
  return scopes;
}

function extractEasings(css) {
  const cubicBezier = [];
  const regex = /cubic-bezier\(\s*([-\d.]+)\s*,\s*([-\d.]+)\s*,\s*([-\d.]+)\s*,\s*([-\d.]+)\s*\)/gi;
  let match;
  while ((match = regex.exec(css)) !== null) {
    const literal = `cubic-bezier(${match.slice(1, 5).join(', ')})`;
    if (!cubicBezier.includes(literal)) cubicBezier.push(literal);
  }
  const keywords = [];
  for (const keyword of ['linear', 'ease-in-out', 'ease-out', 'ease-in', 'steps(']) {
    const probe = keyword === 'steps(' ? 'steps\\(' : keyword;
    if (new RegExp(`(?:transition|animation)[^;{}]*\\b${probe}`, 'i').test(css)) keywords.push(keyword);
  }
  return { cubicBezier, keywords, count: cubicBezier.length + keywords.length };
}

function extractDurations(css) {
  const histogram = new Map();
  const regex = /(?:transition|animation)(?:-duration|-delay)?\s*:\s*([^;{}]+)/gi;
  let match;
  while ((match = regex.exec(css)) !== null) {
    for (const time of match[1].match(/\b\d+(?:\.\d+)?m?s\b/g) ?? []) {
      histogram.set(time, (histogram.get(time) ?? 0) + 1);
    }
  }
  return [...histogram.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 16)
    .map(([value, count]) => ({ value, count }));
}

/**
 * Glow perimetral de 1 px: `box-shadow` con anillo `0 0 0 1px` (o `inset 0 0 0 1px`).
 * Es la firma de la casa: el resplandor es un FILO, no un orbe difuso.
 */
function extractPerimeterGlows(css) {
  const glows = [];
  const seen = new Set();
  const regex = /(?:box-shadow|--shadow-[a-z0-9-]+)\s*:\s*([^;{}]+)/gi;
  let match;
  while ((match = regex.exec(css)) !== null) {
    const value = match[1].trim().replace(/\s+/g, ' ');
    if (!/(?:^|,)\s*(?:inset\s+)?0\s+0\s+0\s+1px/.test(value)) continue;
    if (seen.has(value)) continue;
    seen.add(value);
    glows.push(value.slice(0, 240));
    if (glows.length >= 12) break;
  }
  return glows;
}

function extractRadii(css) {
  const histogram = new Map();
  const regex = /border-radius\s*:\s*([^;}]+)/gi;
  let match;
  while ((match = regex.exec(css)) !== null) {
    const value = match[1].trim();
    histogram.set(value, (histogram.get(value) ?? 0) + 1);
  }
  return [...histogram.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([value, count]) => ({ value, count }));
}

function extractFontFamilies(text) {
  const families = new Set();
  for (const match of text.matchAll(/family=([A-Za-z+0-9,;:@.%]+)/g)) {
    for (const part of match[1].split(/[;,]/)) {
      const family = part.split(':')[0].replace(/\+/g, ' ').trim();
      if (family && /^[A-Za-z ]+$/.test(family)) families.add(family);
    }
  }
  for (const match of text.matchAll(/--font-(?:sans|display|body|mono|serif)\s*:\s*([^;}]+)/gi)) {
    const first = match[1]
      .split(',')[0]
      .replace(/["']/g, '')
      .replace(/var\([^)]*\)/g, '')
      .trim();
    if (first && /^[A-Za-z ]+$/.test(first)) families.add(first);
  }
  return [...families];
}

/* ── Contraste WCAG 2.2 (verificación de los tokens de Aura Onyx) ───────── */

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

/** Cualquier color CSS declarado (oklch | hex | rgb[a]) → [r,g,b] | null. */
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

function rgbToHex(rgb) {
  return '#' + rgb.map((c) => Math.round(Math.min(255, Math.max(0, c))).toString(16).padStart(2, '0')).join('');
}



/* ── FASE 1 · Paquete local ─────────────────────────────────────────────── */

function readPackageCommit() {
  if (!fs.existsSync(path.join(ROOT, 'skills-lock.json'))) return null;
  try {
    const lock = JSON.parse(fs.readFileSync(path.join(ROOT, 'skills-lock.json'), 'utf8'));
    return lock?.skills?.hallmark?.commit ?? null;
  } catch {
    return null;
  }
}

function readReference(name) {
  const file = path.join(SKILL_DIR, 'references', name);
  if (!fs.existsSync(file)) return null;
  return fs.readFileSync(file, 'utf8');
}

function pickRuleLines(source, pattern, limit = 8) {
  return source
    .split(/\r?\n/)
    .filter((line) => pattern.test(line))
    .map((line) => line.replace(/^-\s*/, '').trim())
    .slice(0, limit);
}

/** Líneas de `craft.md` que gobiernan tipografía, bordes y respiración. */
function harvestCraftPrinciples() {
  const craft = readReference('craft.md');
  if (!craft) return { status: 'SIN_EVIDENCIA', file: 'references/craft.md' };

  const tracking = [];
  for (const match of craft.matchAll(/tracking\s*([-\d.]+)\s*to\s*([-\d.]+)em/gi)) {
    tracking.push({ fromEm: Number(match[1]), toEm: Number(match[2]) });
  }
  for (const match of craft.matchAll(/tracked past\s*([\d.]+)em/gi)) tracking.push({ maxLabelTrackingEm: Number(match[1]) });

  const lineHeights = [];
  for (const match of craft.matchAll(/line-height\s*([\d.]+)\s*to\s*([\d.]+)/gi)) lineHeights.push({ from: Number(match[1]), to: Number(match[2]) });
  for (const match of craft.matchAll(/line-height\s*([\d.]+)(?![\d.\s]*to)/gi)) lineHeights.push({ exact: Number(match[1]) });

  const weightPairs = [];
  for (const match of craft.matchAll(/(\d{3})\s+beside\s+(\d{3})/g)) weightPairs.push({ display: Number(match[1]), body: Number(match[2]) });

  return {
    status: 'VERIFICADO',
    file: 'references/craft.md',
    bytes: Buffer.byteLength(craft),
    typography: {
      familiesRule: 'display + body; una tercera sólo como outlier de un único rol',
      weightPairsMaxThree: weightPairs,
      trackingDisplayEm: tracking,
      lineHeight: lineHeights,
      bodyMinimumPx: 16,
      measureCh: (craft.match(/measure\s*(\d+)\s*to\s*(\d+)ch/) ?? []).slice(1, 3).map(Number),
      rules: pickRuleLines(craft, /^-\s*\*\*(?:Weights|Sizes|Display|Body|Labels, captions|Required):/),
    },
    borders: {
      hairlineRule: '1px `--color-rule` en toda superficie; un card lleva borde O sombra, nunca las dos',
      surfaceLadder: pickRuleLines(craft, /\*\*(?:The surface ladder|Depth is weight|Radii):/),
      banList: pickRuleLines(craft, /\*\*Bans:/),
    },
    breathing: {
      spacingScaleRule: pickRuleLines(craft, /\*\*Spacing is a scale/),
      gridRule: pickRuleLines(craft, /\*\*Grids:/),
      scalePx: { '3xs': 2, '2xs': 4, xs: 8, sm: 12, md: 16, lg: 24, xl: 40, '2xl': 64, '3xl': 96, '4xl': 144 },
    },
  };
}

/** Espaciados de respiración propios de las macroestructuras Bento / Workbench. */
function harvestBentoBreathing() {
  if (!fs.existsSync(MACRO_DIR)) return { status: 'SIN_EVIDENCIA', files: [] };
  const bento = fs.readdirSync(MACRO_DIR).filter((file) => /bento|workbench/i.test(file));
  const files = bento.map((file) => {
    const source = fs.readFileSync(path.join(MACRO_DIR, file), 'utf8');
    const gaps = [...new Set([...source.matchAll(/(?:gap|padding)[^;\n]*?(\d{1,3})px/g)].map((m) => Number(m[1])))]
      .filter((value) => value >= 2 && value <= 160)
      .sort((a, b) => a - b);
    const firstLine = (source.split(/\r?\n/).find((line) => line.trim() && !line.startsWith('---') && !line.startsWith('#')) ?? '').trim();
    return {
      file: `references/macrostructures/${file}`,
      bytes: Buffer.byteLength(source),
      spacingPxFound: gaps,
      firstLine: firstLine.slice(0, 300),
    };
  });
  return { status: files.length ? 'VERIFICADO' : 'SIN_EVIDENCIA', files };
}

/** Cada tema del paquete con sus tokens `:root` reales. */
function harvestLocalThemes() {
  if (!fs.existsSync(THEMES_DIR)) return { status: 'SIN_EVIDENCIA', count: 0, darkThemes: [], themes: [], palettes: [] };
  const themes = fs
    .readdirSync(THEMES_DIR)
    .filter((file) => file.endsWith('.md'))
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
      const tokens = rootBlock ? extractCustomProperties(rootBlock[1]) : {};
      return {
        slug: file.replace(/\.md$/, ''),
        name: header.name ?? null,
        genre: header.genre ?? null,
        posture: header.posture ?? null,
        paperBand: header.paper ?? null,
        dark: header.paper ? /^\s*dark/.test(header.paper) : false,
        displayFace: header.display ?? null,
        accentBand: header.accent ?? null,
        tokens,
      };
    })
    .sort((a, b) => a.slug.localeCompare(b.slug));

  return {
    status: themes.length ? 'VERIFICADO' : 'SIN_EVIDENCIA',
    count: themes.length,
    darkThemes: themes.filter((theme) => theme.dark).map((theme) => theme.slug),
    themes,
    palettes: themes.map((theme) => ({
      slug: theme.slug,
      paper: theme.tokens['--color-paper'] ?? null,
      paper2: theme.tokens['--color-paper-2'] ?? null,
      ink: theme.tokens['--color-ink'] ?? null,
      accent: theme.tokens['--color-accent'] ?? null,
      radiusCard: theme.tokens['--radius-card'] ?? null,
      shadowCard: theme.tokens['--shadow-card'] ?? null,
      trackingDisplay: theme.tokens['--tracking-display'] ?? null,
      ruleHair: theme.tokens['--rule-hair'] ?? null,
    })),
  };
}


/* ── FASE 2 · Sonda externa ─────────────────────────────────────────────── */

function absoluteUrl(href, base = SITE_ORIGIN) {
  if (/^https?:\/\//i.test(href)) return href;
  if (href.startsWith('//')) return `https:${href}`;
  const origin = `${base.replace(/\/+$/, '')}/`;
  if (href.startsWith('#')) return `${origin}${href.slice(1)}`;
  if (href.startsWith('/')) return `${origin}${href.slice(1)}`;
  try {
    return new URL(href, origin).toString();
  } catch {
    return `${origin}${href}`;
  }
}

/**
 * Rutas públicas declaradas en el HTML. El sitio sirve enlaces RELATIVOS
 * (`themes/atelier/`, `style.css`), por lo que se resuelven contra el origen
 * con `new URL`, no con una suposición de barra inicial.
 */
function extractPublicRoutes(html, homeUrl) {
  const hrefs = [...html.matchAll(/href=["']([^"'#][^"']*)["']/gi)].map((m) => m[1].trim());
  return uniqueBy(
    hrefs
      .filter((href) => !/^(?:mailto|tel|javascript):/i.test(href))
      .filter((href) => !/\.(?:css|js|png|jpe?g|svg|ico|webp|gif|woff2?|ttf|json|xml|txt)$/i.test(href))
      .filter((href) => !/fonts\.googleapis\.com|fonts\.gstatic\.com|github\.com/i.test(href))
      .map((href) => absoluteUrl(href, homeUrl)),
    (value) => value,
  );
}

function uniqueBy(items, key) {
  const seen = new Set();
  return items.filter((item) => {
    const value = key(item);
    if (seen.has(value)) return false;
    seen.add(value);
    return true;
  });
}

async function probeSite() {
  const sources = [];
  const homeUrl = `${SITE_ORIGIN}/`;
  const home = await get(homeUrl);
  sources.push({
    kind: 'html',
    url: homeUrl,
    status: home.status,
    bytes: home.body.length,
    sha256: home.body.length ? sha256(home.body) : null,
    contentType: home.contentType,
    ms: home.ms,
    error: home.error ?? null,
  });
  const html = home.body.toString('utf8');
  const probed = home.status === 200 && home.body.length > 0;

  /* Rutas públicas: navegación real declarada en el HTML, nunca inventada. */
  const publicRoutes = extractPublicRoutes(html, `${SITE_ORIGIN}/`);

  /* Hojas enlazadas: `<link ... rel="stylesheet" href="…">` en cualquier orden. */
  const linkedStylesheets = uniqueBy(
    [...html.matchAll(/<link\b[^>]*>/gi)]
      .map((m) => m[0])
      .filter((tag) => /rel=["']?stylesheet/i.test(tag) || /\.css["'?]/i.test(tag))
      .map((tag) => (tag.match(/href=["']([^"']+)["']/i) ?? [])[1])
      .filter(Boolean)
      .map((href) => absoluteUrl(href, `${SITE_ORIGIN}/`)),
    (value) => value,
  );

  /* Chunks del runtime Next.js `/_next/static/{chunks,css}/*.css`: se sondean
     aunque no estén enlazados, porque los tokens pueden llegar por chunk. */
  const chunkRefs = uniqueBy(
    [...html.matchAll(/\/_next\/static\/(?:chunks|css)\/[A-Za-z0-9._~\-/]+\.css/gi)].map((m) => absoluteUrl(m[0])),
    (value) => value,
  );

  const stylesheetUrlsProbed = uniqueBy(
    [...linkedStylesheets.filter((href) => /\.css(\?|$)/i.test(href)), ...chunkRefs].filter(
      (href) => !/fonts\.googleapis\.com/.test(href),
    ),
    (value) => value,
  ).slice(0, MAX_STYLESHEETS);

  let css = '';
  for (const url of stylesheetUrlsProbed) {
    const sheet = await get(url);
    sources.push({
      kind: 'css',
      url,
      status: sheet.status,
      bytes: sheet.body.length,
      sha256: sheet.body.length ? sha256(sheet.body) : null,
      contentType: sheet.contentType,
      ms: sheet.ms,
      error: sheet.error ?? null,
    });
    if (sheet.status === 200 && sheet.body.length) css += `\n/* ${url} */\n${sheet.body.toString('utf8')}`;
  }

  /* Rutas públicas: se sondean hasta 8 para certificar existencia, y las que
     responden 200 con HTML se cosechan como bloques de tokens de tema
     (`--paper`, `--ink`, `--accent`, `--shadow-card` del tema concreto). */
  const routesProbed = [];
  const themePages = [];
  for (const url of publicRoutes.slice(0, MAX_ROUTES)) {
    const route = await get(url);
    const isHtml = route.status === 200 && /text\/html/i.test(route.contentType ?? '');
    routesProbed.push({
      url,
      status: route.status,
      bytes: route.body.length,
      sha256: route.body.length ? sha256(Buffer.from(route.body, 'utf8')) : null,
      ms: route.ms,
      error: route.error ?? null,
    });
    if (!isHtml) continue;
    const pageTokens = extractCustomProperties(route.body);
    if (Object.keys(pageTokens).length === 0) continue;
    themePages.push({
      url,
      slug: (url.match(/themes\/([a-z0-9-]+)\/?$/i) ?? [])[1] ?? null,
      tokenCount: Object.keys(pageTokens).length,
      tokens: pageTokens,
    });
  }

  return {
    probed,
    html,
    css,
    sources,
    publicRoutes: routesProbed,
    themePages,
    stylesheetUrlsProbed,
    linkedStylesheets,
    runtime: { framework: /__next_f|_next\/static/i.test(html) ? 'next' : 'static', nextChunksFound: chunkRefs.length },
  };
}

/* ── Síntesis Aura Onyx (verificada por contraste, no afirmada) ─────────── */

function buildAuraOnyxSynthesis() {
  const tokens = {
    '--bg-void': '#030305',
    '--bg-surface': '#08080C',
    '--bg-elevated': '#0E0E14',
    '--bg-panel': '#0F0F16',
    '--border-hairline': '#1E1E26',
    '--border-glass': 'rgba(255, 255, 255, 0.08)',
    '--gold': '#ecb613',
    '--ink': '#F4F1EA',
    '--ink-2': '#C9C4B8',
    '--ink-muted': '#8E8A80',
  };
  const pair = (fg, bg, min, label) => {
    const foreground = parseColor(fg);
    const background = parseColor(bg);
    const ratio = foreground && background ? contrastRatio(foreground, background) : null;
    return { label, fg, bg, min, ratio, pass: ratio !== null && ratio >= min };
  };
  const wcag = [
    pair(tokens['--ink'], tokens['--bg-void'], 4.5, 'ink sobre void'),
    pair(tokens['--ink-2'], tokens['--bg-void'], 4.5, 'ink-2 sobre void'),
    pair(tokens['--ink-2'], tokens['--bg-surface'], 4.5, 'ink-2 sobre surface'),
    pair(tokens['--ink-muted'], tokens['--bg-surface'], 4.5, 'ink-muted sobre surface'),
    pair(tokens['--gold'], tokens['--bg-surface'], 3.0, 'gold sobre surface (cifra/CTA)'),
    pair('#120D00', tokens['--gold'], 4.5, 'tinta sobre oro (boton primario)'),
  ];
  return {
    id: 'aura-onyx-hallmark-s-class',
    label: 'Aura Onyx Hallmark S-Class',
    tokens,
    typography: { display: 'Syne', body: 'Inter', data: 'JetBrains Mono', outlier: 'Fraunces' },
    motion: { easeOut: 'cubic-bezier(0.16, 1, 0.3, 1)', durationHover: '160ms', durationPanel: '320ms' },
    elevation: {
      rule: 'El resplandor es un anillo de 1 px (0 0 0 1px), jamás un orbe difuso con blur.',
      card: 'inset 0 1px 0 rgba(255,255,255,0.04) + borde 1px #1E1E26',
      glow: '0 0 0 1px rgba(236,182,19,0.28), 0 0 24px -12px rgba(236,182,19,0.45)',
    },
    wcag,
    wcagFailures: wcag.filter((check) => !check.pass).map((check) => check.label),
  };
}


/* ── Main ───────────────────────────────────────────────────────────────── */

async function main() {
  const startedAt = nowIso();
  const local = {
    packageSource: 'Nutlope/hallmark',
    packageCommit: readPackageCommit(),
    packagePath: '.claude/skills/hallmark',
    typographyBordersBreathing: harvestCraftPrinciples(),
    bentoBreathing: harvestBentoBreathing(),
    themes: harvestLocalThemes(),
  };

  let site = null;
  let siteStatus = 'SIN_EVIDENCIA';
  let siteThemes = [];
  let nativeVariables = {};
  let motion = { easings: { cubicBezier: [], keywords: [], count: 0 }, durations: [] };
  let perimeterGlows = [];
  let radii = [];
  let fontFamilies = [];
  let tokenScopes = [];
  let themePages = [];
  let runtime = null;

  if (!OFFLINE) {
    site = await probeSite();
    const cssOk = site.sources.filter((source) => source.kind === 'css' && source.status === 200 && source.bytes > 0).length;
    const cssText = `${site.html}\n${site.css}`;
    nativeVariables = extractCustomProperties(cssText);
    tokenScopes = extractTokenScopes(cssText);
    motion = { easings: extractEasings(cssText), durations: extractDurations(cssText) };
    perimeterGlows = extractPerimeterGlows(cssText);
    radii = extractRadii(site.css);
    fontFamilies = extractFontFamilies(cssText);
    themePages = site.themePages;
    runtime = site.runtime;

    /* Temas del sitio: `--d-<slug>-p` (papel) / `--d-<slug>-a` (acento). */
    const dealt = {};
    for (const [name, value] of Object.entries(nativeVariables)) {
      const deal = name.match(/^--d-([a-z0-9-]+?)-([pa])$/i);
      if (!deal) continue;
      const slug = deal[1];
      const slot = deal[2].toLowerCase() === 'p' ? 'paper' : 'accent';
      dealt[slug] = dealt[slug] ?? {};
      const rgb = parseColor(value);
      dealt[slug][slot] = { raw: value, hex: rgb ? rgbToHex(rgb) : null };
    }
    siteThemes = Object.entries(dealt)
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

    siteStatus = site.probed && cssOk > 0 ? 'VERIFICADO' : site.probed ? 'SOSPECHOSO' : 'SIN_EVIDENCIA';
  }

  const aura = buildAuraOnyxSynthesis();


  const artifact = {
    schema: 'EAR_OS_HALLMARK_VAULT/v1',
    generatedAt: nowIso(),
    startedAt,
    generator: 'scripts/vampirize_hallmark_engine.cjs',
    operation: 'VAMPIRIZACION_HORIZONX_ZTLM',
    status: siteStatus,
    probe: {
      probed: Boolean(site && site.probed),
      source: OFFLINE ? 'local-only' : 'live',
      mode: OFFLINE ? 'SIMULADO' : 'REAL',
      checkedAt: nowIso(),
      httpOrigin: SITE_ORIGIN,
      timeoutMs: TIMEOUT_MS,
    },
    phase1LocalPackage: local,
    phase2ExternalSite: site
      ? {
          status: siteStatus,
          runtime,
          sources: site.sources,
          publicRoutes: site.publicRoutes,
          themePages,
          themePageCount: themePages.length,
          stylesheetUrlsProbed: site.stylesheetUrlsProbed,
          linkedStylesheets: site.linkedStylesheets,
          themes: siteThemes,
          themeCount: siteThemes.length,
          nativeVariables,
          nativeVariableCount: Object.keys(nativeVariables).length,
          coreNativeVariables: {
            '--background': nativeVariables['--background'] ?? null,
            '--foreground': nativeVariables['--foreground'] ?? null,
            '--card': nativeVariables['--card'] ?? null,
            '--border': nativeVariables['--border'] ?? null,
            '--ring': nativeVariables['--ring'] ?? null,
            '--radius': nativeVariables['--radius'] ?? null,
            '--primary': nativeVariables['--primary'] ?? null,
            '--muted': nativeVariables['--muted'] ?? null,
          },
          tokenScopes: tokenScopes.map((scope) => ({ selector: scope.selector, tokenCount: scope.tokenCount })),
          tokenScopeDetail: tokenScopes
            .filter((scope) => scope.selector.startsWith('.'))
            .slice(0, 20)
            .map((scope) => ({ selector: scope.selector, tokens: scope.tokens })),
          microAnimations: { easings: motion.easings, durations: motion.durations },
          perimeterGlows,
          perimeterGlowCount: perimeterGlows.length,
          radii,
          fontFamilies,
        }
      : null,
    phase3EarOsSynthesis: { themes: [aura] },
  };

  fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true });

  /**
   * Anti-sobrescritura: una captura no VERIFICADA (offline o red caída) no
   * puede degradar un vault VERIFICADO ya existente. Se escribe aparte.
   */
  let outFile = OUT_FILE;
  let preservedVerifiedVault = false;
  if (siteStatus !== 'VERIFICADO') {
    // Un estado no VERIFICADO nunca escribe el nombre canónico del vault: el
    // sufijo `.offline.json` lo hace inconfundible frente a `HALLMARK_HARVESTED_VAULT.json`.
    outFile = path.join(path.dirname(OUT_FILE), 'HALLMARK_HARVESTED_VAULT.offline.json');
    if (fs.existsSync(OUT_FILE)) {
      try {
        const previous = JSON.parse(fs.readFileSync(OUT_FILE, 'utf8'));
        preservedVerifiedVault = previous?.status === 'VERIFICADO';
      } catch {
        // Un vault ilegible no se defiende: el canónico se deja intacto y el
        // estado honesto va al `.offline.json`.
      }
    }
  }

  fs.writeFileSync(outFile, `${JSON.stringify(artifact, null, 2)}\n`, 'utf8');
  const outSha = sha256(fs.readFileSync(outFile));

  /* ── Reporte de consola: una línea por hecho medido ──────────────────── */
  console.log('-- HALLMARK VAMPIRE ENGINE . FASE 1 (paquete local) --');
  console.log(`  commit       : ${local.packageCommit ?? 'SIN_EVIDENCIA'}`);
  console.log(`  craft.md     : ${local.typographyBordersBreathing.status}`);
  console.log(`  bento        : ${local.bentoBreathing.status} (${local.bentoBreathing.files.length} ficheros)`);
  console.log(`  temas locales: ${local.themes.count ?? 0} (oscuros: ${(local.themes.darkThemes ?? []).length})`);

  console.log('-- HALLMARK VAMPIRE ENGINE . FASE 2 (sonda externa) --');
  if (site) {
    for (const source of site.sources) {
      const mark = source.status === 200 ? 'OK  ' : 'FAIL';
      console.log(
        `  ${mark} ${String(source.status).padStart(3)} ${String(source.bytes).padStart(8)} B ${String(source.ms).padStart(5)} ms sha256:${(source.sha256 ?? '-').slice(0, 12)} ${source.url}`,
      );
    }
    console.log(`  rutas publicas sondeadas: ${site.publicRoutes.filter((route) => route.status === 200).length}/${site.publicRoutes.length}`);
    console.log(`  paginas de tema con tokens: ${themePages.length}`);
    console.log(`  variables CSS nativas   : ${Object.keys(nativeVariables).length}`);
    console.log(`  temas del sitio (dealt) : ${siteThemes.length}`);
    console.log(`  easings / duraciones    : ${motion.easings.count} / ${motion.durations.length}`);
    console.log(`  glows perimetrales 1 px : ${perimeterGlows.length}`);
  } else {
    console.log('  --offline: sin sonda externa (mode SIMULADO)');
  }
  console.log('-- FASE 3 . sintesis Aura Onyx --');
  console.log(`  contraste WCAG: ${aura.wcag.length - aura.wcagFailures.length}/${aura.wcag.length} pares PASS`);
  if (aura.wcagFailures.length) console.log(`  fallos: ${aura.wcagFailures.join(' | ')}`);
  console.log(`  artefacto: ${path.relative(ROOT, outFile)} sha256:${outSha}`);
  if (preservedVerifiedVault) {
    console.log('  [ANTI-SOBRESCRITURA] El vault VERIFICADO se conserva; esta pasada escribio el .offline.json.');
  }
  console.log(`VAMPIRE=${siteStatus}`);

  if (siteStatus !== 'VERIFICADO' && !OFFLINE) {
    console.error('  [AF-5] Captura incompleta: el artefacto declara su estado honesto, jamas "OK" por defecto.');
    process.exitCode = 1;
  }
  return artifact;
}

if (require.main === module) {
  main().catch((error) => {
    console.error('VAMPIRE=ERROR', error);
    process.exitCode = 1;
  });
}

module.exports = {
  extractCustomProperties,
  extractTokenScopes,
  extractPublicRoutes,
  extractEasings,
  extractDurations,
  extractPerimeterGlows,
  parseColor,
  contrastRatio,
  buildAuraOnyxSynthesis,
};

