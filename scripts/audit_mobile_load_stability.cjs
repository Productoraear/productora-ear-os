#!/usr/bin/env node
/**
 * ════════════════════════════════════════════════════════════════════════════
 * W56 · SONDA DE ESTABILIDAD DE PRIMERA CARGA EN VIEWPORT MÓVIL (360/390)
 * ════════════════════════════════════════════════════════════════════════════
 * Cierra el hueco que `scripts/audit_cls_budget.cjs` declara por diseño
 * (`estimatedCls:null`, `mode:"SIMULADO_LAB"`) midiendo en Chrome real:
 *   - Ventana de hidratación (main thread libre de tareas largas).
 *   - `scrollWidth` / `bodyScrollWidth` vs `innerWidth` (scroll parásito).
 *   - CLS observado en primera carga (layout-shift sin hadRecentInput).
 *
 * AF-1/AF-2/AF-5: sin servidor vivo no se escribe informe (SIN_EVIDENCIA);
 * todo JSON declara probed/source/mode/checkedAt; el CLS observado se etiqueta
 * `LAB_OBSERVED` y NO sustituye al p75 de campo (CrUX/RUM).
 *
 * Uso:
 *   node scripts/audit_mobile_load_stability.cjs --base=http://127.0.0.1:3007
 *   node scripts/audit_mobile_load_stability.cjs --strict
 * ════════════════════════════════════════════════════════════════════════════
 */
'use strict';

const fs = require('node:fs');
const net = require('node:net');
const path = require('node:path');
const crypto = require('node:crypto');
const puppeteer = require('puppeteer-core');

const ROOT = path.resolve(__dirname, '..');
const REPORT_DIR = path.join(ROOT, 'reports', 'mobile_load');
const REPORT_JSON = path.join(REPORT_DIR, 'mobile_load_report.json');

const CHROME =
  process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const args = process.argv.slice(2);
const getArg = (name, fallback) => {
  const hit = args.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.slice(name.length + 3) : fallback;
};
const hasFlag = (name) => args.includes(`--${name}`);

const BASE = getArg('base', 'http://127.0.0.1:3007').replace(/\/$/, '');
const STRICT = hasFlag('strict');
const CLS_BUDGET = 0.05;

const ROUTES = getArg(
  'routes',
  '/otzarreta,/calendario/catering/restaurante-otzarreta,/reservar/solista'
)
  .split(',')
  .map((r) => r.trim())
  .filter(Boolean);

const VIEWPORTS = [
  { id: 'mobile-360', width: 360, height: 740, dpr: 3 },
  { id: 'mobile-390', width: 390, height: 844, dpr: 3 },
];

/** Huella del build servido: vincula la medición al artefacto real. */
function buildFingerprint() {
  const idPath = path.join(ROOT, '.next', 'BUILD_ID');
  const serverPath = path.join(ROOT, '.next', 'standalone', 'server.js');
  return {
    buildId: fs.existsSync(idPath) ? fs.readFileSync(idPath, 'utf8').trim() : null,
    standaloneServerMtime: fs.existsSync(serverPath)
      ? fs.statSync(serverPath).mtime.toISOString()
      : null,
  };
}

function probeTcp(urlStr, timeoutMs = 2500) {
  const parsed = new URL(urlStr);
  const port = Number(parsed.port) || (parsed.protocol === 'https:' ? 443 : 80);
  return new Promise((resolve) => {
    const socket = net.connect({ port, host: parsed.hostname });
    let settled = false;
    const finish = (v) => {
      if (settled) return;
      settled = true;
      socket.destroy();
      resolve(v);
    };
    socket.setTimeout(timeoutMs);
    socket.once('connect', () => finish(true));
    socket.once('timeout', () => finish(false));
    socket.once('error', () => finish(false));
  });
}


/**
 * Se ejecuta DENTRO de Chrome. Autocontenida (sin cierres sobre Node).
 * Devuelve geometría cruda + métricas de carga observadas, serializables.
 */
function measureInPage(cfg) {
  return new Promise((resolve) => {
    const timeOrigin = performance.timeOrigin;
    const longTasks = [];
    let cls = 0;
    const shiftSources = [];

    try {
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          longTasks.push({
            start: Math.round(entry.startTime),
            duration: Math.round(entry.duration),
          });
        }
      }).observe({ type: 'longtask', buffered: true });
    } catch {
      /* motor sin longtask: se declara en el informe */
    }

    try {
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.hadRecentInput) continue;
          cls += entry.value;
          const src = entry.sources && entry.sources[0];
          if (entry.value > 0 && shiftSources.length < 6) {
            shiftSources.push({
              value: Math.round(entry.value * 10000) / 10000,
              start: Math.round(entry.startTime),
              node: src && src.node ? src.node.nodeName : null,
            });
          }
        }
      }).observe({ type: 'layout-shift', buffered: true });
    } catch {
      /* motor sin layout-shift: se declara en el informe */
    }

    const snapshot = () => {
      const de = document.documentElement;
      const body = document.body;
      return {
        innerWidth: window.innerWidth,
        clientWidth: de.clientWidth,
        scrollWidth: de.scrollWidth,
        bodyScrollWidth: body ? body.scrollWidth : 0,
        horizontalScrollPx: Math.max(0, de.scrollWidth - window.innerWidth),
        bodyHorizontalScrollPx: body ? Math.max(0, body.scrollWidth - window.innerWidth) : 0,
        htmlOverflowX: getComputedStyle(de).overflowX,
        bodyOverflowX: body ? getComputedStyle(body).overflowX : '',
        scrollHeight: de.scrollHeight,
        readyState: document.readyState,
        atMs: Math.round(performance.now()),
      };
    };

    const atFirstPaint = snapshot();
    const settleDeadline = Date.now() + cfg.hydrationWindowMs;

    const tick = () => {
      const lastLongEnd = longTasks.reduce((m, t) => Math.max(m, t.start + t.duration), 0);
      const now = Math.round(performance.now());
      const calm = now - lastLongEnd;
      const settled = Date.now() >= settleDeadline || (calm >= cfg.quietGapMs && now > 800);
      if (!settled) {
        setTimeout(tick, 120);
        return;
      }
      const nav = performance.getEntriesByType('navigation')[0] || null;
      resolve({
        probed: true,
        source: 'live',
        mode: 'LAB_OBSERVED',
        checkedAt: new Date().toISOString(),
        readyStateAtMeasure: document.readyState,
        firstPaint: atFirstPaint,
        settled: snapshot(),
        hydration: {
          longTaskCount: longTasks.length,
          longTaskMaxMs: longTasks.reduce((m, t) => Math.max(m, t.duration), 0),
          lastLongTaskEndMs: lastLongEnd,
          mainThreadFreeAtMs: lastLongEnd + cfg.quietGapMs,
          measuredAtMs: now,
          quietGapMs: cfg.quietGapMs,
          longTasks: longTasks.slice(0, 12),
        },
        cls: {
          observed: Math.round(cls * 10000) / 10000,
          budget: cfg.clsBudget,
          withinBudget: cls <= cfg.clsBudget,
          hadRecentInputFiltered: true,
          sources: shiftSources,
        },
        navigation: nav
          ? {
              domContentLoadedMs: Math.round(nav.domContentLoadedEventEnd),
              loadEventMs: Math.round(nav.loadEventEnd),
              transferBytes: nav.transferSize,
            }
          : null,
        timeOriginIso: new Date(timeOrigin).toISOString(),
      });
    };
    setTimeout(tick, 400);
  });
}

async function main() {
  if (!fs.existsSync(CHROME)) {
    console.error(`FATAL: Chrome no encontrado en ${CHROME} (define CHROME_PATH).`);
    process.exit(2);
  }

  const checkedAt = new Date().toISOString();
  if (!(await probeTcp(BASE))) {
    console.log(
      JSON.stringify(
        {
          probed: false,
          source: 'static',
          mode: 'SIMULADO',
          checkedAt,
          base: BASE,
          verdict: 'SIN_EVIDENCIA',
          note: 'Objetivo sin TCP: no se lanza Chrome ni se escribe informe (AF-1/AF-5).',
        },
        null,
        2
      )
    );
    process.exitCode = 1;
    return;
  }

  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--hide-scrollbars',
      '--force-color-profile=srgb',
    ],
  });

  const report = {
    probed: true,
    source: 'live',
    mode: 'LAB_OBSERVED',
    checkedAt,
    base: BASE,
    build: buildFingerprint(),
    clsBudget: CLS_BUDGET,
    disclaimer:
      'CLS observado en laboratorio sobre primera carga (hadRecentInput descartado). NO es el p75 de campo: el p75 exige RUM/CrUX con tráfico real.',
    viewports: VIEWPORTS,
    routes: {},
    totals: { routes: 0, rows: 0, rowsWithError: 0, rowsOverBudget: 0, maxObservedCls: 0 },
  };

  for (const route of ROUTES) {
    const entry = { url: BASE + route, viewports: {} };
    for (const vp of VIEWPORTS) {
      const page = await browser.newPage();
      const row = { viewport: vp.id, width: vp.width, height: vp.height, status: 0 };
      try {
        await page.setViewport({
          width: vp.width,
          height: vp.height,
          deviceScaleFactor: vp.dpr,
          isMobile: true,
          hasTouch: true,
        });
        const res = await page.goto(BASE + route, {
          waitUntil: 'domcontentloaded',
          timeout: 120000,
        });
        row.status = res ? res.status() : 0;
        Object.assign(
          row,
          await page.evaluate(measureInPage, {
            quietGapMs: 200,
            hydrationWindowMs: 9000,
            clsBudget: CLS_BUDGET,
          })
        );
        report.totals.rows += 1;
        report.totals.maxObservedCls = Math.max(report.totals.maxObservedCls, row.cls.observed);
        if (!row.cls.withinBudget) report.totals.rowsOverBudget += 1;
        console.log(
          `${route} · ${vp.id} · HTTP ${row.status} · innerWidth=${row.settled.innerWidth} ` +
            `scrollWidth=${row.settled.scrollWidth} bodyScrollWidth=${row.settled.bodyScrollWidth} ` +
            `hScroll=${row.settled.horizontalScrollPx}px · CLS=${row.cls.observed} ` +
            `(${row.cls.withinBudget ? 'PASS' : 'FAIL'}<=${CLS_BUDGET}) · ` +
            `mainThreadFree@${row.hydration.mainThreadFreeAtMs}ms · readyState=${row.readyStateAtMeasure}`
        );
      } catch (err) {
        row.error = err && err.message ? err.message : String(err);
        report.totals.rowsWithError += 1;
        console.log(`${route} · ${vp.id} · ERROR ${row.error}`);
      } finally {
        await page.close().catch(() => {});
      }
      entry.viewports[vp.id] = row;
    }
    report.routes[route] = entry;
    report.totals.routes += 1;
  }

  await browser.close();

  const body = JSON.stringify(report, null, 2);
  report.sha256 = crypto.createHash('sha256').update(body, 'utf8').digest('hex');
  fs.mkdirSync(REPORT_DIR, { recursive: true });
  fs.writeFileSync(REPORT_JSON, JSON.stringify(report, null, 2), 'utf8');

  const horizontalLeak = (v) =>
    !v.error && (v.settled.horizontalScrollPx > 1 || v.settled.bodyHorizontalScrollPx > 1);
  const blocked =
    report.totals.rowsWithError > 0 ||
    report.totals.rowsOverBudget > 0 ||
    (STRICT &&
      Object.values(report.routes).some((r) => Object.values(r.viewports).some(horizontalLeak)));

  console.log('');
  console.log(`ROWS=${report.totals.rows} ROWS_WITH_ERROR=${report.totals.rowsWithError}`);
  console.log(`MAX_OBSERVED_CLS=${report.totals.maxObservedCls} BUDGET=${CLS_BUDGET}`);
  console.log(`ROWS_OVER_BUDGET=${report.totals.rowsOverBudget}`);
  console.log(`REPORT=${path.relative(ROOT, REPORT_JSON).replace(/\\/g, '/')}`);
  console.log(
    `CLAIM{mobile_load_stability} :: cmd="node scripts/audit_mobile_load_stability.cjs" :: exit=${
      blocked ? 1 : 0
    } :: url="${BASE}${ROUTES[0]}" :: sha256=${report.sha256} :: ts=${new Date().toISOString()}`
  );
  console.log(`VERDICT=${blocked ? 'BLOCKED' : 'PASS'}`);
  process.exitCode = blocked ? 1 : 0;
}

main().catch((err) => {
  console.error('FATAL:', err && err.message ? err.message : err);
  process.exit(1);
});
