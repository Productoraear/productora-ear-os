#!/usr/bin/env node
/**
 * scripts/sync_gsc_and_clarity_insights.cjs
 * ════════════════════════════════════════════════════════════════════════════
 * CRUCE ANALÍTICO GSC + MICROSOFT CLARITY — "Oportunidad de Oro"
 * ════════════════════════════════════════════════════════════════════════════
 * Regla de Oportunidad de Oro (CEO):
 *   Páginas con Impresiones > 50 AND CTR < 5% AND Posición < 20.
 *   Se correlacionan con las consultas reales que teclean novios y empresas.
 *
 * Entradas (búsqueda en cascada, cero dependencias):
 *   · GSC Páginas  : knowledge/ · data/gsc/ · docs/performance_search_* ·
 *                    scratch/gsc_* · docs/gsc/ · data/
 *   · GSC Consultas: ídem.
 *   · Clarity CSV  : Clarity_Productora_EAR_Panel_11-27-2026_10_12.csv (o *Clarity*.csv).
 *     Si no existe el CSV, se usa src/data/telemetry/clarity-performance-data.json
 *     como contexto GLOBAL (nunca se inventan sesiones por página).
 *
 * Salida:
 *   .antigravity/reports/gsc_high_opportunity.json
 *
 * Uso:
 *   node scripts/sync_gsc_and_clarity_insights.cjs
 *   node scripts/sync_gsc_and_clarity_insights.cjs --json   # sólo JSON a stdout
 *
 * Exit codes: 0 = informe generado · 1 = sin Páginas.csv de GSC.
 * ════════════════════════════════════════════════════════════════════════════
 */
'use strict';

const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const REPORT_DIR = path.join(ROOT, '.antigravity', 'reports');
const OUT_JSON = path.join(REPORT_DIR, 'gsc_high_opportunity.json');
const JSON_ONLY = process.argv.includes('--json');
const TIMING = process.env.SYNC_TIMING === '1';

function time(label, fn) {
  if (!TIMING) return fn();
  const start = process.hrtime.bigint();
  const result = fn();
  const ms = Number(process.hrtime.bigint() - start) / 1e6;
  console.error(`[TIMING] ${label} ${ms.toFixed(1)}ms`);
  return result;
}

const CANDIDATE_DIRS = [
  path.join(ROOT, 'knowledge'),
  path.join(ROOT, 'data', 'gsc'),
  path.join(ROOT, 'docs', 'performance_search_2026_09_11'),
  path.join(ROOT, 'scratch', 'gsc_2026_10_24'),
  path.join(ROOT, 'docs', 'gsc'),
  path.join(ROOT, 'data'),
  path.join(ROOT, 'docs'),
];

const PAGES_NAMES = ['Páginas.csv', 'Paginas.csv', 'Pages.csv', 'pages.csv'];
const QUERIES_NAMES = ['Consultas.csv', 'Queries.csv', 'queries.csv'];
const CLARITY_NAMES = [
  'Clarity_Productora_EAR_Panel_11-27-2026_10_12.csv',
  'Clarity_Productora_EAR_Panel_11-27-2026 10 12.csv',
  'Clarity_Productora_EAR_Panel.csv',
  'Clarity.csv',
  'clarity.csv',
];

function findFile(names) {
  for (const dir of CANDIDATE_DIRS) {
    for (const name of names) {
      const candidate = path.join(dir, name);
      if (fs.existsSync(candidate)) return candidate;
    }
  }
  return null;
}

/** Parser CSV mínimo con soporte de comillas dobles. */
function unquote(value) {
  if (value.length >= 2 && value.charCodeAt(0) === 34 && value.charCodeAt(value.length - 1) === 34) {
    return value.slice(1, -1).replace(/""/g, '"');
  }
  return value;
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let inQuotes = false;
  let fieldStart = 0;
  const len = text.length;
  for (let i = 0; i < len; i += 1) {
    const ch = text.charCodeAt(i);
    if (inQuotes) {
      if (ch === 34) {
        if (text.charCodeAt(i + 1) === 34) {
          i += 1;
        } else {
          inQuotes = false;
        }
      }
      continue;
    }
    if (ch === 34) {
      inQuotes = true;
    } else if (ch === 44) {
      row.push(unquote(text.slice(fieldStart, i)));
      fieldStart = i + 1;
    } else if (ch === 10) {
      const end = i > 0 && text.charCodeAt(i - 1) === 13 ? i - 1 : i;
      row.push(unquote(text.slice(fieldStart, end)));
      fieldStart = i + 1;
      if (row.some((cell) => cell.trim() !== '')) rows.push(row);
      row = [];
    }
  }
  if (fieldStart < len) {
    const end = text.charCodeAt(len - 1) === 13 ? len - 1 : len;
    row.push(unquote(text.slice(fieldStart, end)));
    if (row.some((cell) => cell.trim() !== '')) rows.push(row);
  }
  return rows;
}

function normalizeHeader(value) {
  return String(value).replace(/^\uFEFF/, '').trim().toLowerCase();
}

function findHeader(headers, candidates) {
  for (let i = 0; i < headers.length; i += 1) {
    if (candidates.includes(headers[i])) return i;
  }
  return -1;
}

function toNumber(value) {
  if (value === undefined || value === null) return 0;
  const cleaned = String(value).replace(/[^\d.,-]/g, '').replace(',', '.');
  const n = Number.parseFloat(cleaned);
  return Number.isFinite(n) ? n : 0;
}

function toCtr(value) {
  if (value === undefined || value === null) return 0;
  const cleaned = String(value).replace('%', '').replace(',', '.').trim();
  const n = Number.parseFloat(cleaned);
  return Number.isFinite(n) ? n : 0;
}

function stem(token) {
  return token.replace(/s$/, '');
}

const STOP_TOKENS = new Set([
  'www', 'http', 'https', 'com', 'net', 'org', 'es',
  'productoraear', 'productora', 'ear',
]);

function tokenize(value) {
  return String(value)
    .toLowerCase()
    .split(/[^a-z0-9áéíóúüñ]+/i)
    .map((token) => token.trim())
    .filter((token) => token.length > 2 && !STOP_TOKENS.has(token))
    .map(stem);
}

function loadGscPages(file) {
  const rows = parseCsv(fs.readFileSync(file, 'utf8'));
  if (rows.length === 0) return [];
  const headers = rows[0].map(normalizeHeader);
  const pageIdx = findHeader(headers, ['páginas principales', 'paginas principales', 'pages', 'page', 'url']);
  const clicksIdx = findHeader(headers, ['clics', 'clicks']);
  const impressionsIdx = findHeader(headers, ['impresiones', 'impressions']);
  const ctrIdx = findHeader(headers, ['ctr']);
  const positionIdx = findHeader(headers, ['posición', 'posicion', 'position', 'average position']);
  if (pageIdx === -1) return [];
  const out = [];
  for (let i = 1; i < rows.length; i += 1) {
    const row = rows[i];
    const page = row[pageIdx] ? row[pageIdx].trim() : '';
    if (!page) continue;
    out.push({
      page,
      clicks: toNumber(row[clicksIdx]),
      impressions: toNumber(row[impressionsIdx]),
      ctr: toCtr(row[ctrIdx]),
      position: toNumber(row[positionIdx]),
    });
  }
  return out;
}

function loadGscQueries(file) {
  const rows = parseCsv(fs.readFileSync(file, 'utf8'));
  if (rows.length === 0) return [];
  const headers = rows[0].map(normalizeHeader);
  const queryIdx = findHeader(headers, ['consultas principales', 'queries', 'query', 'search query']);
  const clicksIdx = findHeader(headers, ['clics', 'clicks']);
  const impressionsIdx = findHeader(headers, ['impresiones', 'impressions']);
  const ctrIdx = findHeader(headers, ['ctr']);
  const positionIdx = findHeader(headers, ['posición', 'posicion', 'position', 'average position']);
  if (queryIdx === -1) return [];
  const out = [];
  for (let i = 1; i < rows.length; i += 1) {
    const row = rows[i];
    const query = row[queryIdx] ? row[queryIdx].trim() : '';
    if (!query) continue;
    out.push({
      query,
      clicks: toNumber(row[clicksIdx]),
      impressions: toNumber(row[impressionsIdx]),
      ctr: toCtr(row[ctrIdx]),
      position: toNumber(row[positionIdx]),
    });
  }
  return out;
}

function normalizePath(value) {
  try {
    const url = new URL(String(value));
    const pathname = url.pathname.replace(/\/+$/, '');
    return pathname === '' ? '/' : pathname;
  } catch {
    const stripped = String(value).replace(/^https?:\/\/[^/]+/i, '').replace(/\/+$/, '');
    return stripped === '' ? '/' : stripped;
  }
}

function claritySessionsFor(pageUrl, clarityPages) {
  if (!clarityPages || clarityPages.length === 0) return null;
  const target = normalizePath(pageUrl);
  let exact = null;
  let prefix = null;
  for (const candidate of clarityPages) {
    const candidatePath = normalizePath(candidate.url);
    if (candidatePath === target) {
      exact = candidate;
      break;
    }
    if (target.startsWith(`${candidatePath}/`) || candidatePath.startsWith(`${target}/`)) {
      if (!prefix || candidate.sessions > prefix.sessions) prefix = candidate;
    }
  }
  if (exact) return { ...exact, matchType: 'exact' };
  if (prefix) return { ...prefix, matchType: 'prefix' };
  return null;
}

/**
 * Parser del panel de Microsoft Clarity (formato "Métricas" + secciones).
 * Extrae sesiones, usuarios, ideas, exploradores, páginas principales, eventos,
 * referrers, errores JS, rendimiento y bots sin dependencias externas.
 */
function parseClarityPanel(file) {
  const rows = parseCsv(fs.readFileSync(file, 'utf8'));
  const panel = {
    meta: {},
    sessions: {},
    engagement: {},
    users: {},
    insights: [],
    browsers: [],
    pages: [],
    smartEvents: [],
    referrers: [],
    jsErrors: [],
    jsErrorsTotal: null,
    performance: {},
    bots: {},
  };
  let section = null;
  for (const row of rows) {
    const cells = row.map((cell) => String(cell).trim());
    if (cells.length === 0) continue;
    if (cells[0] === 'Nombre del proyecto') { panel.meta.project = cells[1] || null; continue; }
    if (cells[0] === 'Intervalo de fechas') { panel.meta.range = cells[1] || null; continue; }
    if (cells[0] === 'Métricas') { section = cells[1] || null; continue; }
    if (!section) continue;

    if (section === 'Sesiones') {
      if (cells[1] === 'Total de sesiones') panel.sessions.total = toNumber(cells[2]);
      else if (cells[1] === 'Sesiones de bot') panel.sessions.bot = toNumber(cells[2]);
    } else if (section === 'Páginas por sesión') {
      if (cells[1] === 'Promedio') panel.engagement.pagesPerSession = toNumber(cells[2]);
    } else if (section === 'Profundidad de desplazamiento') {
      if (cells[1] === 'Promedio') panel.engagement.scrollDepth = toNumber(cells[2]);
    } else if (section === 'Tiempo activo empleado') {
      if (cells[1] === 'Tiempo activo') panel.engagement.activeTime = toNumber(cells[2]);
      else if (cells[1] === 'Tiempo total') panel.engagement.totalTime = toNumber(cells[2]);
    } else if (section === 'Información general de los usuarios') {
      if (cells[1] === 'Usuarios únicos') panel.users.unique = toNumber(cells[2]);
      else if (cells[1] === 'Sesiones con nuevos usuarios') panel.users.newSessions = toNumber(cells[2]);
      else if (cells[1] === 'Sesiones con usuarios recurrentes') panel.users.returningSessions = toNumber(cells[2]);
    } else if (section === 'Ideas') {
      if (cells[1]) panel.insights.push({ name: cells[1], sessions: toNumber(cells[2]), pct: cells[3] || null });
    } else if (section === 'Exploradores') {
      if (cells[1]) panel.browsers.push({ name: cells[1], sessions: toNumber(cells[2]), pct: cells[3] || null });
    } else if (section === 'Páginas principales') {
      if (cells[1] && /^https?:\/\//i.test(cells[1])) panel.pages.push({ url: cells[1], sessions: toNumber(cells[2]) });
    } else if (section === 'Eventos inteligentes') {
      if (cells[1]) panel.smartEvents.push({ name: cells[1], sessions: toNumber(cells[2]), pct: cells[3] || null });
    } else if (section === 'Origen de referencia') {
      if (cells[1]) panel.referrers.push({ source: cells[1], sessions: toNumber(cells[2]) });
    } else if (section === 'Errores de JavaScript') {
      if (cells[1] && /total de errores/i.test(cells[1])) {
        panel.jsErrorsTotal = toNumber(cells[2]);
      } else if (cells[1] && cells[2] && cells[2] !== 'Nro. de sesiones') {
        panel.jsErrors.push({ error: cells[1], sessions: toNumber(cells[2]), pct: cells[3] || null });
      }
    } else if (section === 'Información general del rendimiento') {
      if (cells[1] === 'Puntuación') panel.performance.score = toNumber(cells[2]);
      else if (cells[1] && cells[1].startsWith('LCP')) panel.performance.lcp = cells[2] || null;
      else if (cells[1] && cells[1].startsWith('INP')) panel.performance.inp = cells[2] || null;
      else if (cells[1] && cells[1].startsWith('CLS')) panel.performance.cls = cells[2] || null;
    } else if (section === 'Tráfico de bots') {
      if (cells[0]) panel.bots[cells[0]] = toNumber(cells[1]);
    }
  }
  return panel;
}

function loadClarityFallback() {
  const jsonPath = path.join(ROOT, 'src', 'data', 'telemetry', 'clarity-performance-data.json');
  if (!fs.existsSync(jsonPath)) return null;
  const json = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  return {
    source: path.relative(ROOT, jsonPath).split(path.sep).join('/'),
    mode: 'GLOBAL_ONLY',
    meta: json.meta || null,
    traffic: json.traffic || null,
    userFriction: json.userFriction || null,
    coreWebVitals: json.coreWebVitals || null,
    smartEvents: json.smartEvents || [],
  };
}

function correlateQueries(page, queriesWithTokens) {
  const pageSet = new Set(tokenize(page.page));
  return queriesWithTokens
    .filter((q) => q.tokens.some((token) => pageSet.has(token)))
    .sort((a, b) => b.impressions - a.impressions)
    .slice(0, 5)
    .map(({ tokens, ...rest }) => rest);
}

function unmappedQueries(queriesWithTokens, pageTokenSet) {
  return queriesWithTokens
    .filter((q) => q.tokens.length > 0 && !q.tokens.some((token) => pageTokenSet.has(token)))
    .sort((a, b) => b.impressions - a.impressions)
    .slice(0, 25)
    .map(({ tokens, ...rest }) => rest);
}

const pagesPath = findFile(PAGES_NAMES);
const queriesPath = findFile(QUERIES_NAMES);
const clarityPath = findFile(CLARITY_NAMES);

if (!pagesPath) {
  console.error('ERROR: no se encontró Páginas.csv de GSC en las rutas candidatas.');
  console.error(`Rutas: ${CANDIDATE_DIRS.map((dir) => path.relative(ROOT, dir)).join(' · ')}`);
  process.exit(1);
}

const pages = time('loadGscPages', () => loadGscPages(pagesPath));
const queries = queriesPath ? time('loadGscQueries', () => loadGscQueries(queriesPath)) : [];
const queriesWithTokens = time('tokenizeQueries', () => queries.map((query) => ({ ...query, tokens: tokenize(query.query) })));
const pageTokenSet = time('tokenizePages', () => {
  const set = new Set();
  for (const page of pages) {
    for (const token of tokenize(page.page)) set.add(token);
  }
  return set;
});
const unmapped = time('unmappedQueries', () => unmappedQueries(queriesWithTokens, pageTokenSet));

const clarity = time('parseClarityPanel', () => (clarityPath
  ? {
      source: path.relative(ROOT, clarityPath).split(path.sep).join('/'),
      mode: 'PAGE_LEVEL_CSV',
      panel: parseClarityPanel(clarityPath),
    }
  : loadClarityFallback()));

const clarityPages = clarity && clarity.mode === 'PAGE_LEVEL_CSV' ? clarity.panel.pages : [];

const opportunities = time('opportunities', () => pages
  .filter((page) => page.impressions > 50 && page.ctr < 5 && page.position < 20)
  .sort((a, b) => b.impressions - a.impressions)
  .map((page) => ({
    ...page,
    correlatedQueries: correlateQueries(page, queriesWithTokens),
    clarity: claritySessionsFor(page.page, clarityPages),
  })));

const report = {
  generatedAt: new Date().toISOString(),
  doctrine: 'GOLDEN_OPPORTUNITY: Impresiones > 50 AND CTR < 5% AND Posición < 20',
  sources: {
    gscPages: path.relative(ROOT, pagesPath).split(path.sep).join('/'),
    gscQueries: queriesPath ? path.relative(ROOT, queriesPath).split(path.sep).join('/') : null,
    clarity: clarity ? clarity.source : null,
    clarityMode: clarity ? clarity.mode : 'SIN_EVIDENCIA',
  },
  totals: {
    gscPages: pages.length,
    gscQueries: queries.length,
    opportunities: opportunities.length,
    unmappedQueries: unmapped.length,
    clarityPages: clarityPages.length,
    claritySessions: clarity && clarity.panel ? clarity.panel.sessions.total : null,
  },
  evidence: {
    gscPages: 'VERIFICADO',
    gscQueries: queriesPath ? 'VERIFICADO' : 'SIN_EVIDENCIA',
    clarityCsv: clarityPath ? 'VERIFICADO' : 'SIN_EVIDENCIA',
    clarityFallback: clarity && !clarityPath ? 'VERIFICADO' : 'SIN_EVIDENCIA',
  },
  opportunities,
  unmappedQueries: unmapped,
  topQueries: queries.slice(0, 20),
  clarity,
};

fs.mkdirSync(REPORT_DIR, { recursive: true });
const json = time('stringify', () => JSON.stringify(report, null, 2));
time('writeFile', () => fs.writeFileSync(OUT_JSON, json, 'utf8'));

if (JSON_ONLY) {
  console.log(JSON.stringify(report, null, 2));
} else {
  console.log('GSC + CLARITY · OPORTUNIDAD DE ORO');
  console.log(`GSC páginas      : ${pages.length} (${report.sources.gscPages})`);
  console.log(`GSC consultas    : ${queries.length} (${report.sources.gscQueries || 'SIN_EVIDENCIA'})`);
  console.log(`Clarity          : ${clarity ? `${clarity.mode} · ${clarity.source}` : 'SIN_EVIDENCIA'}`);
  if (clarity && clarity.panel) {
    console.log(`Clarity páginas  : ${clarity.panel.pages.length} · sesiones=${clarity.panel.sessions.total ?? 'n/d'} · usuarios=${clarity.panel.users.unique ?? 'n/d'}`);
  }
  console.log(`Oportunidades    : ${opportunities.length}`);
  console.log(`Consultas huérfanas: ${report.totals.unmappedQueries}`);
  console.log(`Informe          : ${path.relative(ROOT, OUT_JSON)}`);
}
