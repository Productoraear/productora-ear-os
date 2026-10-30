#!/usr/bin/env node
/**
 * ════════════════════════════════════════════════════════════════════════════
 * AUDITOR VISUAL DE PROTOTIPOS · RENDER REAL EN CHROME · MULTI-VIEWPORT
 * ════════════════════════════════════════════════════════════════════════════
 * Ley del Auditor Real (§9 .clinerules): un ítem del scorecard sin comando en
 * disco vale 0 puntos. Este script ES el comando.
 * Ley Anti-Fachada (AF-1/AF-5): sin preflight probado no hay verde posible;
 * un informe sin servidor vivo se declara SIN_EVIDENCIA y no se escribe.
 *
 * Renderiza cada prototipo en Chrome real (no jsdom, no happy-dom), a 7
 * viewports, y mide los defectos de maquetación que a ojo no se auditan:
 *
 *   V01 OVERFLOW_X         P0  scroll horizontal (scrollWidth > viewport)
 *   V02 EDGE_CLIP          P1  elemento visible cortado por el borde (icono/nodo)
 *   V03 CLIPPED_TEXT       P0  texto recortado (precio, teléfono, fecha, CTA)
 *   V04 DOCK_OVERLAP       P0  dock fijo tapando contenido (móvil)
 *   V05 TAP_TARGET_SMALL   P1  objetivo táctil < 44×44 px (móvil)
 *   V06 TEXT_TOO_SMALL     P1  microcopy < 11 px (ilegible en móvil real)
 *   V07 SERIF_FALLBACK     P0  token de fuente muerto → cae al serif del UA
 *   V08 VERTICAL_GAP       P2  hueco muerto > 140 px entre secciones
 *   V09 H1_AUDIT           P1  cero o varios <h1>, o interlineado colapsado
 *
 * Uso
 *   node scripts/visual_prototype_audit.cjs
 *   node scripts/visual_prototype_audit.cjs --routes=/,/reservar/solista
 *   node scripts/visual_prototype_audit.cjs --base=http://localhost:3007 --shots=full
 *   node scripts/visual_prototype_audit.cjs --strict   # cualquier P1/P2 rompe
 *
 * Salida
 *   reports/prototype_audit/visual_audit_report.json
 *   reports/prototype_audit/SUMMARY.md
 *   reports/prototype_audit/<ruta>/<viewport>.png        (captura de Chrome)
 *   reports/prototype_audit/<ruta>/<viewport>-full.png   (página completa)
 *   reports/prototype_audit/<ruta>/fail-NN.png           (recorte del defecto P0)
 * ════════════════════════════════════════════════════════════════════════════
 */
const path = require('path');
const fs = require('fs');
const net = require('net');
const crypto = require('crypto');
const { spawn } = require('child_process');
const puppeteer = require('puppeteer-core');

const ROOT = path.resolve(__dirname, '..');
const OUT_DIR = path.join(ROOT, 'reports', 'prototype_audit');
const CHROME =
  process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const args = process.argv.slice(2);
const getArg = (name, fallback) => {
  const hit = args.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.slice(name.length + 3) : fallback;
};
const hasFlag = (name) => args.includes(`--${name}`);

// `let`: el preflight puede repuntar el objetivo al servidor que arranca él mismo.
let BASE = getArg('base', 'http://localhost:3007').replace(/\/$/, '');
// key = 3 viewports representativos · full = los 7 · 0 = sin capturas (solo medición)
const SHOTS_MODE = getArg('shots', 'key');
const STRICT = hasFlag('strict');
const AUTOSTART = getArg('autostart', '1');

const ROUTES = getArg(
  'routes',
  '/,/reservar/solista,/calculadora,/confianza,/proveedores'
)
  .split(',')
  .map((r) => r.trim())
  .filter(Boolean);

/**
 * Viewports con cuota real de mercado: un defecto que solo existe a 360 px es
 * un defecto que se cobra en el 30 % de las visitas móviles españolas.
 */
const VIEWPORTS = [
  { id: 'mobile-360', width: 360, height: 740, dpr: 3, touch: true },
  { id: 'mobile-390', width: 390, height: 844, dpr: 3, touch: true },
  { id: 'tablet-768', width: 768, height: 1024, dpr: 2, touch: true },
  { id: 'laptop-1024', width: 1024, height: 768, dpr: 1, touch: false },
  { id: 'laptop-1366', width: 1366, height: 768, dpr: 1, touch: false },
  { id: 'desktop-1440', width: 1440, height: 900, dpr: 1, touch: false },
  { id: 'desktop-1920', width: 1920, height: 1080, dpr: 1, touch: false },
];

const SHOT_IDS = {
  key: ['mobile-390', 'tablet-768', 'desktop-1440'],
  full: VIEWPORTS.map((v) => v.id),
  '0': [],
};
const SHOT_VIEWPORTS = SHOT_IDS[SHOTS_MODE] || SHOT_IDS.key;

/**
 * Umbrales. No son gusto: cada número tiene dueño.
 *  - minFontPx 11 : por debajo, el microcopy deja de leerse en un móvil real.
 *  - tapMin 44    : WCAG 2.2 AA (2.5.8) / Apple HIG.
 *  - gapMobile 140: hueco muerto = scroll vacío = fuga de conversión.
 */
const THRESH = {
  minFontPx: 11,
  tapMin: 44,
  gapMobile: 140,
  gapDesktop: 180,
  h1MinRatio: 1.02,
  dockTolerance: 1,
};

const SERIF_FAMILIES = [
  'times new roman',
  'times',
  'georgia',
  'garamond',
  'cambria',
  'serif',
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/* ───────────────────────────────────────────────────────────────────────────
 * PREFLIGHT ANTI-FALSO-VERDE (AF-1 · AF-5)
 * Una captura sin servidor vivo es SIN_EVIDENCIA, no una auditoría. Si el
 * objetivo no responde y existe el build standalone, lo arranca este script y
 * lo mata al terminar: se mide contra algo que responde de verdad.
 * ─────────────────────────────────────────────────────────────────────────── */
const STANDALONE_SERVER = path.join(ROOT, '.next', 'standalone', 'server.js');
const STANDALONE_STATIC = path.join(ROOT, '.next', 'standalone', '.next', 'static');
const STATIC_SOURCE = path.join(ROOT, '.next', 'static');
const PREFLIGHT_TIMEOUT_MS = 30000;
const PREFLIGHT_ATTEMPTS = 2;

let standaloneChild = null;
let standaloneDiag = '';

function stopStandalone() {
  if (!standaloneChild) return;
  const child = standaloneChild;
  standaloneChild = null;
  try {
    child.kill();
  } catch {
    /* el proceso ya terminó */
  }
}
process.on('exit', stopStandalone);

/** Liveness de bajo nivel (handshake TCP): ¿hay alguien escuchando? */
function probe(urlStr, timeoutMs = 2000) {
  return new Promise((resolve) => {
    let parsed;
    try {
      parsed = new URL(urlStr);
    } catch {
      resolve(0);
      return;
    }
    const port = Number(parsed.port) || (parsed.protocol === 'https:' ? 443 : 80);
    const host = parsed.hostname.replace(/^\[|\]$/g, '');
    const socket = net.connect({ port, host });
    let settled = false;
    const finish = (value) => {
      if (settled) return;
      settled = true;
      socket.destroy();
      resolve(value);
    };
    socket.setTimeout(timeoutMs);
    socket.once('connect', () => finish(1));
    socket.once('timeout', () => finish(0));
    socket.once('error', () => finish(0));
  });
}

/** `localhost` puede resolver a ::1 mientras el servidor escucha en IPv4. */
function hostVariants(parsed) {
  const port = parsed.port || (parsed.protocol === 'https:' ? '443' : '80');
  const hosts = [parsed.hostname];
  if (parsed.hostname === 'localhost') hosts.push('127.0.0.1');
  else if (parsed.hostname === '127.0.0.1') hosts.push('localhost');
  return [...new Set(hosts.map((h) => `${parsed.protocol}//${h}:${port}`))];
}

async function probeAny(baseStr, timeoutMs = 2000) {
  let parsed;
  try {
    parsed = new URL(baseStr);
  } catch {
    return { status: 0, base: baseStr };
  }
  for (const candidate of hostVariants(parsed)) {
    const status = await probe(candidate, timeoutMs);
    if (status > 0) return { status, base: candidate };
  }
  return { status: 0, base: baseStr };
}

function portBusy(port) {
  return new Promise((resolve) => {
    const srv = net.createServer();
    srv.once('error', () => resolve(true));
    srv.once('listening', () => srv.close(() => resolve(false)));
    srv.listen(port, '127.0.0.1');
  });
}

async function pickPort(preferred) {
  if (preferred > 0 && !(await portBusy(preferred))) return preferred;
  return new Promise((resolve, reject) => {
    const srv = net.createServer();
    srv.once('error', reject);
    srv.listen(0, '127.0.0.1', () => {
      const { port } = srv.address();
      srv.close(() => resolve(port));
    });
  });
}

/** Sin `.next/static` el standalone sirve la página sin CSS y mediría un fallo irreal. */
function syncStaticAssets() {
  if (!fs.existsSync(STATIC_SOURCE)) return 'MISSING .next/static';
  if (fs.existsSync(STANDALONE_STATIC)) return 'PRESENT';
  fs.cpSync(STATIC_SOURCE, STANDALONE_STATIC, { recursive: true });
  return 'COPIED';
}

async function bootStandalone(port, assets, attempt) {
  console.log(
    `[PREFLIGHT] Auto-arranque ${attempt}/${PREFLIGHT_ATTEMPTS}: node .next/standalone/server.js · PORT=${port} · static=${assets}`
  );
  standaloneDiag = '';
  standaloneChild = spawn(process.execPath, [STANDALONE_SERVER], {
    cwd: path.dirname(STANDALONE_SERVER),
    env: { ...process.env, PORT: String(port), HOSTNAME: '127.0.0.1', NODE_ENV: 'production' },
    stdio: ['ignore', 'ignore', 'pipe'],
    windowsHide: true,
  });
  standaloneChild.stderr.on('data', (chunk) => {
    standaloneDiag = (standaloneDiag + chunk.toString()).slice(-4000);
  });
  standaloneChild.on('error', (err) => {
    standaloneDiag += `\nSPAWN_ERROR: ${err.message}`;
  });

  const base = `http://127.0.0.1:${port}`;
  const deadline = Date.now() + PREFLIGHT_TIMEOUT_MS;
  while (Date.now() < deadline) {
    await sleep(500);
    if ((await probe(base, 1500)) > 0) return base;
    if (!standaloneChild || standaloneChild.exitCode !== null) break;
  }
  const exitCode = standaloneChild ? standaloneChild.exitCode : 'spawn-error';
  console.log(`[PREFLIGHT] Intento ${attempt} sin TCP: childExit=${exitCode}`);
  console.log(standaloneDiag.trim() || '(stderr vacío: el proceso quedó vivo sin escuchar)');
  stopStandalone();
  return null;
}

/**
 * Contrato AF-1/AF-5: devuelve siempre `probed`, `source`, `mode`, `checkedAt`.
 * Nunca asume verde sin sondear.
 */
async function ensureTarget() {
  const checkedAt = new Date().toISOString();
  const alive = await probeAny(BASE);
  if (alive.status > 0) {
    BASE = alive.base;
    console.log(`[PREFLIGHT] ${BASE} responde (TCP abierto) · probed=true · source=live · mode=REAL`);
    return { base: BASE, probed: true, source: 'live', mode: 'REAL', checkedAt, autoStarted: false };
  }
  console.log(`[PREFLIGHT] ${BASE} NO responde (TCP cerrado o timeout) · probed=false`);

  if (AUTOSTART !== '1' || !fs.existsSync(STANDALONE_SERVER)) {
    console.log(
      AUTOSTART !== '1'
        ? '[PREFLIGHT] autostart desactivado (--autostart=0)'
        : `[PREFLIGHT] SIN_EVIDENCIA: no existe ${path
            .relative(ROOT, STANDALONE_SERVER)
            .replace(/\\/g, '/')} (falta \`npm run build\`)`
    );
    return { base: BASE, probed: false, source: 'static', mode: 'SIMULADO', checkedAt, autoStarted: false };
  }

  const parsed = new URL(BASE);
  const preferred = Number(parsed.port) || 3007;
  const assets = syncStaticAssets();
  for (let attempt = 1; attempt <= PREFLIGHT_ATTEMPTS; attempt += 1) {
    const port = attempt === 1 ? await pickPort(preferred) : await pickPort(0);
    const booted = await bootStandalone(port, assets, attempt);
    if (booted) {
      BASE = booted;
      console.log(
        `[PREFLIGHT] Servidor propio vivo en ${booted} · probed=true · source=live · mode=REAL`
      );
      return { base: booted, probed: true, source: 'live', mode: 'REAL', checkedAt, autoStarted: true };
    }
  }
  console.log('[PREFLIGHT] SIN_EVIDENCIA: ningún intento de arranque abrió TCP');
  return { base: BASE, probed: false, source: 'static', mode: 'SIMULADO', checkedAt, autoStarted: false };
}

/**
 * Algoritmo de auditoría visual ejecutado DENTRO de Chrome. Puppeteer serializa
 * esta función: es autocontenida a propósito (cero dependencias, cero cierres
 * sobre el módulo Node). Devuelve SOLO datos planos serializables.
 */
function auditInPage(cfg) {
  const out = {
    viewport: { w: window.innerWidth, h: window.innerHeight, dpr: window.devicePixelRatio },
    doc: {},
    fonts: {},
    typography: {},
    checks: {},
  };
  const round = (n) => Math.round(n * 10) / 10;
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  const selectorOf = (el) => {
    const parts = [];
    let cur = el;
    let depth = 0;
    while (cur && cur.nodeType === 1 && depth < 4) {
      let part = cur.tagName.toLowerCase();
      if (cur.id) {
        parts.unshift(`${part}#${cur.id}`);
        break;
      }
      const cls = (cur.getAttribute('class') || '')
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 3);
      if (cls.length) part += `.${cls.join('.')}`;
      parts.unshift(part);
      cur = cur.parentElement;
      depth += 1;
    }
    return parts.join(' > ');
  };

  const ownText = (el) => {
    let acc = '';
    for (const node of el.childNodes) {
      if (node.nodeType === 3) acc += node.textContent || '';
    }
    return acc.replace(/\s+/g, ' ').trim();
  };

  const INTERACTIVE_TAGS = { A: 1, BUTTON: 1, INPUT: 1, SELECT: 1, TEXTAREA: 1, SUMMARY: 1 };
  const isInteractive = (el) =>
    Boolean(INTERACTIVE_TAGS[el.tagName]) ||
    el.getAttribute('role') === 'button' ||
    el.getAttribute('role') === 'link' ||
    el.getAttribute('role') === 'tab' ||
    el.hasAttribute('onclick');

  const isHidden = (el, st) => {
    if (st.display === 'none' || st.visibility === 'hidden') return true;
    if (parseFloat(st.opacity) < 0.05) return true;
    if (el.getAttribute('aria-hidden') === 'true') return true;
    if (el.closest('.sr-only, [hidden]')) return true;
    return false;
  };

  /** Carruseles y scrollers horizontales: sus hijos sobresalen POR DISEÑO. */
  const inHorizontalScroller = (el) => {
    let cur = el.parentElement;
    let depth = 0;
    while (cur && depth < 8) {
      const ox = getComputedStyle(cur).overflowX;
      if (ox === 'auto' || ox === 'scroll') return true;
      cur = cur.parentElement;
      depth += 1;
    }
    return false;
  };

  const bodyStyle = getComputedStyle(document.body);
  const htmlStyle = getComputedStyle(document.documentElement);
  out.doc = {
    scrollWidth: document.documentElement.scrollWidth,
    bodyScrollWidth: document.body.scrollWidth,
    scrollHeight: document.documentElement.scrollHeight,
    overflowX: Math.max(0, document.documentElement.scrollWidth - vw),
    bodyPaddingBottom: parseFloat(bodyStyle.paddingBottom) || 0,
    htmlOverflowX: htmlStyle.overflowX,
    bodyFontFamily: bodyStyle.fontFamily,
  };

  const items = [];
  for (const el of Array.from(document.querySelectorAll('body *'))) {
    const st = getComputedStyle(el);
    if (isHidden(el, st)) continue;
    const r = el.getBoundingClientRect();
    if (r.width < 1 || r.height < 1) continue;
    const text = ownText(el);
    items.push({
      el,
      rect: r,
      tag: el.tagName.toLowerCase(),
      cls: (el.getAttribute('class') || '').slice(0, 180),
      selector: selectorOf(el),
      fontSize: parseFloat(st.fontSize) || 0,
      lineHeight: st.lineHeight === 'normal' ? (parseFloat(st.fontSize) || 0) * 1.2 : parseFloat(st.lineHeight) || 0,
      fontFamily: st.fontFamily || '',
      overflowX: st.overflowX,
      textOverflow: st.textOverflow,
      whiteSpace: st.whiteSpace,
      position: st.position,
      text: text.slice(0, 90),
      hasText: text.length > 0,
      interactive: isInteractive(el),
      scrollW: el.scrollWidth,
      clientW: el.clientWidth,
      box: {
        x: round(r.left + window.scrollX),
        y: round(r.top + window.scrollY),
        w: round(r.width),
        h: round(r.height),
      },
    });
  }
  out.scanned = items.length;

  const firstFamily = (ff) => (ff || '').split(',')[0].replace(/["']/g, '').trim().toLowerCase();
  const CRITICAL_TEXT = /(\d+[.,]\d{2}\s*€|€\s*\d|\+34|\b\d{9}\b|\b\d{2}[/-]\d{2}[/-]\d{2,4}\b|@[a-z0-9-]+\.)/i;

  /**
   * V01 · OVERFLOW_X (P0)
   * Solo se declara desbordamiento si el usuario PUEDE arrastrar la página de lado:
   * si `html`/`body` recortan en X, el bleed decorativo (blobs, glows) no es un
   * defecto de scroll sino contenido enmascarado, y eso lo miden V02/V03 con texto.
   * Se publica también el valor crudo para que nadie confunda silencio con verde.
   */
  const overRight = (it) => Math.max(0, it.rect.right - vw);
  const overLeft = (it) => Math.max(0, -it.rect.left);
  const bleed = items.filter(
    (it) => (overRight(it) > 1 || overLeft(it) > 1) && !inHorizontalScroller(it.el)
  );
  const rawOverflow = Math.max(
    out.doc.scrollWidth,
    out.doc.bodyScrollWidth,
    vw + Math.round(bleed.reduce((m, it) => Math.max(m, overRight(it)), 0))
  ) - vw;
  const rootClipsX =
    htmlStyle.overflowX === 'hidden' ||
    htmlStyle.overflowX === 'clip' ||
    bodyStyle.overflowX === 'hidden' ||
    bodyStyle.overflowX === 'clip';
  const scrollOverflow = rootClipsX ? 0 : rawOverflow;
  out.checks.OVERFLOW_X = {
    severity: 'P0',
    ok: scrollOverflow <= 1,
    overflowPx: round(Math.max(0, scrollOverflow)),
    rawOverflowPx: round(Math.max(0, rawOverflow)),
    // P-2 (2026-10-30): `globals.css` fuerza `overflow-x: hidden` en html Y body
    // (líneas 193-195 y 231), así que `rootClipsX` es true en todas las rutas y
    // `scrollOverflow` vale 0 siempre → V01 nunca podía fallar. No se cambia el
    // gating (no hay scroll real, no hay defecto de scroll), pero se publica el
    // desbordamiento enmascarado para que el silencio no se lea como verde (AF-5).
    maskedOverflowPx: rootClipsX ? round(Math.max(0, rawOverflow)) : 0,
    masked: rootClipsX && rawOverflow > 40,
    rootClipsX,
    htmlOverflowX: out.doc.htmlOverflowX,
    bodyOverflowX: bodyStyle.overflowX,
    offenders: bleed
      .slice()
      .sort((a, b) => Math.max(overRight(b), overLeft(b)) - Math.max(overRight(a), overLeft(a)))
      .slice(0, 8)
      .map((it) => ({
        selector: it.selector,
        tag: it.tag,
        text: it.text,
        overRight: round(overRight(it)),
        overLeft: round(overLeft(it)),
        box: it.box,
      })),
  };

  /* ── V02 · EDGE_CLIP (P1) — el icono/nodo cortado por el borde ─────────── */
  const clippedEdges = bleed.filter((it) => it.hasText || it.interactive);
  out.checks.EDGE_CLIP = {
    severity: 'P1',
    ok: clippedEdges.length === 0,
    withContent: clippedEdges.length,
    decorative: bleed.length - clippedEdges.length,
    offenders: clippedEdges.slice(0, 8).map((it) => ({
      selector: it.selector,
      tag: it.tag,
      text: it.text,
      overRight: round(overRight(it)),
      overLeft: round(overLeft(it)),
      box: it.box,
    })),
  };

  /* ── V03 · CLIPPED_TEXT (P0 si recorta precio/teléfono/fecha) ──────────── */
  const clippedText = [];
  const seenClip = new Set();
  for (const it of items) {
    if (!it.hasText || it.text.length < 2) continue;
    if (it.overflowX !== 'hidden' && it.overflowX !== 'clip') continue;
    if (it.scrollW <= it.clientW + 2) continue;
    if (it.rect.h > it.fontSize * 2.2) continue; // multilínea: no hay recorte forzado
    const key = `${it.text}|${Math.round(it.fontSize)}|${it.cls.slice(0, 40)}`;
    if (seenClip.has(key)) continue;
    seenClip.add(key);
    clippedText.push({
      selector: it.selector,
      text: it.text,
      fontSize: round(it.fontSize),
      overflowPx: round(it.scrollW - it.clientW),
      textOverflow: it.textOverflow,
      whiteSpace: it.whiteSpace,
      critical: CRITICAL_TEXT.test(it.text),
      box: it.box,
    });
  }
  const criticalClips = clippedText.filter((c) => c.critical);
  out.checks.CLIPPED_TEXT = {
    severity: 'P0',
    ok: criticalClips.length === 0,
    critical: criticalClips.length,
    minor: clippedText.length - criticalClips.length,
    offenders: clippedText.slice(0, 10),
  };

  /* ── V04 · DOCK_OVERLAP (P0) — el dock fijo tapando contenido ──────────── */
  const bottomChrome = items.filter(
    (it) =>
      it.position === 'fixed' &&
      it.rect.bottom >= vh - 2 &&
      it.rect.width >= vw * 0.8 &&
      it.rect.height > 8 &&
      it.rect.height <= 260
  );
  const dockHeight = bottomChrome.reduce((m, it) => Math.max(m, it.rect.height), 0);
  const bodyPadding = out.doc.bodyPaddingBottom;
  const shortfall = Math.max(0, dockHeight - bodyPadding - cfg.dockTolerance);
  out.checks.DOCK_OVERLAP = {
    severity: 'P0',
    ok: dockHeight === 0 || shortfall <= 0,
    dockDetected: bottomChrome.length > 0,
    dockHeight: round(dockHeight),
    bodyPaddingBottom: round(bodyPadding),
    reserveShortfall: round(shortfall),
    dockSelectors: bottomChrome.slice(0, 4).map((it) => it.selector),
  };

  /* ── V05 · TAP_TARGET_SMALL (P1) — solo en viewports táctiles ──────────── */
  if (cfg.touch) {
    const small = items.filter(
      (it) =>
        it.interactive &&
        (it.rect.width < cfg.tapMin - 0.5 || it.rect.height < cfg.tapMin - 0.5)
    );
    out.checks.TAP_TARGET_SMALL = {
      severity: 'P1',
      ok: small.length === 0,
      total: small.length,
      offenders: small
        .slice()
        .sort((a, b) => a.rect.width * a.rect.height - b.rect.width * b.rect.height)
        .slice(0, 10)
        .map((it) => ({
          selector: it.selector,
          tag: it.tag,
          label:
            it.text ||
            it.el.getAttribute('aria-label') ||
            it.el.getAttribute('title') ||
            it.el.getAttribute('href') ||
            '',
          w: round(it.rect.width),
          h: round(it.rect.height),
          box: it.box,
        })),
    };
  } else {
    out.checks.TAP_TARGET_SMALL = { severity: 'P1', ok: true, skipped: 'viewport sin puntero táctil' };
  }

  /* ── V06 · TEXT_TOO_SMALL (P1) — microcopy por debajo del suelo legible ── */
  const tiny = [];
  const seenTiny = new Set();
  for (const it of items) {
    if (!it.hasText || it.fontSize <= 0 || it.fontSize >= cfg.minFontPx) continue;
    const key = `${it.text}|${it.fontSize}`;
    if (seenTiny.has(key)) continue;
    seenTiny.add(key);
    tiny.push({
      selector: it.selector,
      text: it.text,
      fontSize: round(it.fontSize),
      box: it.box,
    });
  }
  out.checks.TEXT_TOO_SMALL = {
    severity: 'P1',
    ok: tiny.length === 0,
    floorPx: cfg.minFontPx,
    total: tiny.length,
    offenders: tiny.slice(0, 10),
  };

  /* ── Evidencia de fuentes: qué familia se está pintando DE VERDAD ──────── */
  const SERIF = new Set(cfg.serifFamilies);
  const serifFallback = items.filter((it) => it.hasText && SERIF.has(firstFamily(it.fontFamily)));
  const h1s = items.filter((it) => it.tag === 'h1');
  const h1 = h1s.find((it) => it.hasText) || h1s[0] || null;
  /* ── P-3 (2026-10-30) · VERDAD POR FAMILIA: declarada / descargada / pinta ──
   *
   * Defecto medido: `document.fonts.check('16px "Fraunces"')` devuelve `true`
   * para una familia que NO está declarada. No es un bug del navegador: el
   * método responde "no hay descarga pendiente", y sin @font-face el UA resuelve
   * al sistema. Resultado: la auditoría publicaba `available:true` para Fraunces
   * mientras el píxel pintado era Georgia. Eso es exactamente el "verde por
   * defecto" que prohíbe AF-5, y el motivo por el que un informe podía afirmar
   * que la tipografía editorial estaba en vigor cuando no lo estaba.
   *
   * Ahora se publican tres verdades separadas y ninguna se infiere de otra:
   *   declared → existe un @font-face en `document.fonts` (webfont declarada)
   *   loaded   → esa webfont ya se descargó (`status === 'loaded'`)
   *   renders  → aporta glifos propios: el ancho de una cadena cambia al
   *              anteponer la familia a tres pilas base distintas
   *              (monospace / serif / sans-serif). Si no cambia con ninguna,
   *              no hay glifos: se está pintando el fallback del sistema.
   *
   * `available` se conserva como alias de `loaded` para no romper consumidores,
   * pero ya no puede mentir. El gating de V07 SERIF_FALLBACK NO se toca.
   */
  const faceList = Array.from(document.fonts).map((f) => ({
    family: f.family,
    status: f.status,
  }));
  const declaredFamilySet = new Set(faceList.map((f) => f.family).filter(Boolean));
  const loadedFamilySet = new Set(
    faceList
      .filter((f) => f.status === 'loaded')
      .map((f) => f.family)
      .filter(Boolean)
  );

  const RENDER_PROBE = 'mmmmmmmmmmlliWWWQ@#0123456789';
  const widthCache = new Map();
  const widthOf = (stack) => {
    if (widthCache.has(stack)) return widthCache.get(stack);
    let w = 0;
    try {
      const ctx = document.createElement('canvas').getContext('2d');
      if (ctx) {
        ctx.font = `72px ${stack}`;
        // Si el navegador rechaza la pila, `ctx.font` conserva su valor previo y
        // mediría con OTRA fuente: sería un falso positivo. Se detecta y se
        // devuelve -1 para que el llamante descarte la muestra.
        const head = stack.split(',')[0].replace(/["']/g, '').trim();
        if (!ctx.font || ctx.font.indexOf(head) === -1) w = -1;
        else w = ctx.measureText(RENDER_PROBE).width;
      }
    } catch (e) {
      w = 0;
    }
    widthCache.set(stack, w);
    return w;
  };
  const hasOwnGlyphs = (family) => {
    let measured = false;
    let own = false;
    try {
      for (const base of ['monospace', 'serif', 'sans-serif']) {
        const withFamily = widthOf(`"${family}", ${base}`);
        const plain = widthOf(base);
        if (withFamily < 0 || plain < 0) continue;
        measured = true;
        if (Math.abs(withFamily - plain) > 0.5) own = true;
      }
    } catch (e) {
      return false;
    }
    return measured ? own : false;
  };
  const familyTruth = (family) => ({
    declared: declaredFamilySet.has(family),
    loaded: loadedFamilySet.has(family),
    renders: hasOwnGlyphs(family),
  });

  const usedFamiliesMap = new Map();
  for (const it of items) {
    if (!it.hasText) continue;
    const raw = (it.fontFamily || '').split(',')[0].replace(/["']/g, '').trim();
    if (!raw) continue;
    usedFamiliesMap.set(raw, (usedFamiliesMap.get(raw) || 0) + 1);
  }
  out.fonts = {
    bodyFamily: bodyStyle.fontFamily,
    headingFamily: h1 ? h1.fontFamily : '',
    // Sin truncar a 12: el corte anterior ocultaba familias y su ausencia no
    // probaba nada (una lista cortada no es una lista vacía).
    loadedFaceCount: faceList.length,
    declaredFamilies: Array.from(declaredFamilySet).slice(0, 40),
    loadedFamilies: Array.from(loadedFamilySet).slice(0, 40),
    loadedFaces: Array.from(declaredFamilySet).slice(0, 40),
    usedFamilies: Array.from(usedFamiliesMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([family, nodes]) => {
        const truth = familyTruth(family);
        // `available` se mantiene como alias de `loaded` (compatibilidad de
        // consumidores). Ya no es `document.fonts.check`, que respondía "true"
        // incluso a familias inexistentes.
        return { family, nodes, available: truth.loaded, ...truth };
      }),
    serifFallbackCount: serifFallback.length,
    /* Lectura obligatoria del campo anterior: si `usedFamilies[i].renders` es
     * false, el nodo NO está pintando la familia declarada, sino el fallback
     * del sistema. Publicarlo evita que "sin infracciones" se lea como "la
     * tipografía prometida está en vigor". */
    fontTruthNote:
      'renders=false ⇒ se pinta el fallback del sistema, no la familia declarada. declared=false ⇒ la webfont no está montada (next/font no expone su variable).',
  };

  /* ── V07 · SERIF_FALLBACK (P0) — token de fuente muerto ────────────────── */
  out.checks.SERIF_FALLBACK = {
    severity: 'P0',
    ok: serifFallback.length === 0,
    total: serifFallback.length,
    offenders: serifFallback.slice(0, 8).map((it) => ({
      selector: it.selector,
      text: it.text,
      fontFamily: it.fontFamily,
      box: it.box,
    })),
  };

  /* ── V08 · VERTICAL_GAP (P2) — desierto de scroll entre secciones ──────── */
  const gapHost = document.querySelector('main') || document.body;
  const blocks = Array.from(gapHost.children).filter((el) => {
    const st = getComputedStyle(el);
    if (st.display === 'none') return false;
    if (st.position === 'fixed' || st.position === 'absolute') return false;
    const r = el.getBoundingClientRect();
    return r.height > 24 && r.width > vw * 0.4;
  });
  const gaps = [];
  for (let i = 1; i < blocks.length; i += 1) {
    const prev = blocks[i - 1].getBoundingClientRect();
    const cur = blocks[i].getBoundingClientRect();
    const gap = Math.round(cur.top - prev.bottom);
    if (gap > cfg.bigGap) {
      gaps.push({
        from: selectorOf(blocks[i - 1]),
        to: selectorOf(blocks[i]),
        gapPx: gap,
      });
    }
  }
  out.checks.VERTICAL_GAP = {
    severity: 'P2',
    ok: gaps.length === 0,
    thresholdPx: cfg.bigGap,
    total: gaps.length,
    offenders: gaps.slice(0, 6),
  };

  /* ── V09 · H1_AUDIT (P1) — jerarquía e interlineado del titular ────────── */
  const h1Ratio = h1 && h1.fontSize ? round(h1.lineHeight / h1.fontSize) : 0;
  out.typography = {
    h1Count: h1s.length,
    h1Text: h1 ? h1.text.slice(0, 90) : '',
    h1FontSize: h1 ? round(h1.fontSize) : 0,
    h1LineHeight: h1 ? round(h1.lineHeight) : 0,
    h1LineRatio: h1Ratio,
  };
  const h1Ok = h1s.length === 1 && (h1Ratio === 0 || h1Ratio >= cfg.h1MinRatio);
  out.checks.H1_AUDIT = {
    severity: 'P1',
    ok: h1Ok,
    h1Count: h1s.length,
    lineRatio: h1Ratio,
    minRatio: cfg.h1MinRatio,
    note:
      h1s.length === 0
        ? 'sin <h1>: el titular no existe para SEO ni para lectores de pantalla'
        : h1s.length > 1
          ? `${h1s.length} <h1>: jerarquía rota`
          : h1Ratio > 0 && h1Ratio < cfg.h1MinRatio
            ? `interlineado colapsado (${h1Ratio}) → riesgo de colisión de descendentes`
            : 'ok',
  };

  /* ── Resumen derivado (P0 bloquea, P1/P2 informan salvo --strict) ──────── */
  out.summary = { p0: 0, p1: 0, p2: 0, failed: [] };
  for (const [id, check] of Object.entries(out.checks)) {
    if (check.ok) continue;
    const sev = String(check.severity || 'P2').toLowerCase();
    out.summary[sev] = (out.summary[sev] || 0) + 1;
    out.summary.failed.push(id);
  }
  return out;
}

const slugOf = (route) =>
  route === '/' ? 'home' : route.replace(/[^a-z0-9]+/gi, '-').replace(/^-+|-+$/g, '');

/**
 * Deja la página en un estado medible: fuentes resueltas, IntersectionObserver
 * disparado (revelados/lazy) y scroll de vuelta arriba. Sin esto se audita un
 * esqueleto y se reportan defectos que el usuario nunca ve.
 */
async function settle(page) {
  await page
    .evaluate(() => (document.fonts && document.fonts.ready ? document.fonts.ready : null))
    .catch(() => {});
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  const steps = Math.min(8, Math.max(1, Math.ceil(height / 900)));
  for (let i = 0; i < steps; i += 1) {
    await page.evaluate((y) => window.scrollTo(0, y), i * 900);
    await sleep(220);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await sleep(450);
}

/** Recorte de un defecto concreto: la prueba gráfica que se puede mirar. */
async function shootOffender(page, dir, vpId, index, box, label) {
  try {
    const clip = {
      x: Math.max(0, box.x - 24),
      y: Math.max(0, box.y - 24),
      width: Math.max(120, Math.min(1600, box.w + 48)),
      height: Math.max(80, Math.min(900, box.h + 48)),
    };
    await page.evaluate((y) => window.scrollTo(0, Math.max(0, y - 220)), box.y);
    await sleep(280);
    const shifted = await page.evaluate((y) => y - window.scrollY, box.y);
    const file = path.join(dir, `${vpId}-fail-${String(index).padStart(2, '0')}-${label}.png`);
    await page.screenshot({ path: file, clip: { ...clip, y: Math.max(0, shifted - 24) } });
    await page.evaluate(() => window.scrollTo(0, 0));
    return path.relative(ROOT, file).replace(/\\/g, '/');
  } catch {
    return null;
  }
}

/**
 * Mide UNA ruta en UN viewport y devuelve el bloque de evidencia.
 * Cada viewport usa una pestaña nueva: los estilos computados no se contaminan.
 */
async function measureAt(browser, url, vp, dir, cfg) {
  const page = await browser.newPage();
  const evidence = { viewport: vp.id, width: vp.width, height: vp.height, dpr: vp.dpr, status: 0, screenshots: [] };
  try {
    await page.setViewport({
      width: vp.width,
      height: vp.height,
      deviceScaleFactor: vp.dpr,
      isMobile: vp.touch,
      hasTouch: vp.touch,
    });
    const res = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 90000 });
    evidence.status = res ? res.status() : 0;
    await settle(page);

    const result = await page.evaluate(auditInPage, cfg);
    Object.assign(evidence, result);
    // `result.viewport` es {w,h,dpr}: se conserva aparte para no pisar el id de la fila.
    evidence.viewportMetrics = result.viewport || null;
    evidence.viewport = vp.id;

    if (SHOT_VIEWPORTS.includes(vp.id)) {
      const shot = path.join(dir, `${vp.id}.png`);
      await page.screenshot({ path: shot });
      evidence.screenshots.push(path.relative(ROOT, shot).replace(/\\/g, '/'));
      const full = path.join(dir, `${vp.id}-full.png`);
      await page.screenshot({ path: full, fullPage: true });
      evidence.screenshots.push(path.relative(ROOT, full).replace(/\\/g, '/'));

      // Evidencia del dock: el pie de página con el dock presente encima.
      if (vp.touch) {
        await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
        await sleep(500);
        const bottom = path.join(dir, `${vp.id}-bottom.png`);
        await page.screenshot({ path: bottom });
        evidence.screenshots.push(path.relative(ROOT, bottom).replace(/\\/g, '/'));
        await page.evaluate(() => window.scrollTo(0, 0));
        await sleep(200);
      }

      // Prueba gráfica de los defectos P0 con caja conocida.
      const p0Sources = ['CLIPPED_TEXT', 'OVERFLOW_X', 'EDGE_CLIP', 'SERIF_FALLBACK'];
      let idx = 0;
      for (const id of p0Sources) {
        const check = evidence.checks && evidence.checks[id];
        if (!check || check.ok) continue;
        for (const off of (check.offenders || []).slice(0, 2)) {
          if (!off.box) continue;
          idx += 1;
          const file = await shootOffender(page, dir, vp.id, idx, off.box, id.toLowerCase());
          if (file) evidence.screenshots.push(file);
        }
      }
    }
  } catch (err) {
    evidence.error = err.message;
  } finally {
    await page.close().catch(() => {});
  }
  return evidence;
}

/* ───────────────────────────────────────────────────────────────────────────
 * Informe: consola + JSON + Markdown. El Markdown es lo que mira el CEO; el
 * JSON es lo que consume el gate.
 * ─────────────────────────────────────────────────────────────────────────── */
function describeFailures(ev) {
  const c = ev.checks || {};
  const lines = [];
  if (c.OVERFLOW_X && !c.OVERFLOW_X.ok) {
    const top = (c.OVERFLOW_X.offenders || [])[0];
    lines.push(
      `OVERFLOW_X ${c.OVERFLOW_X.overflowPx}px` + (top ? ` (${top.tag} "${top.text}" → +${top.overRight}px)` : '')
    );
  }
  if (c.SERIF_FALLBACK && !c.SERIF_FALLBACK.ok) {
    const top = (c.SERIF_FALLBACK.offenders || [])[0];
    lines.push(
      `SERIF_FALLBACK ${c.SERIF_FALLBACK.total} nodos` + (top ? ` ("${top.text}" en ${top.fontFamily})` : '')
    );
  }
  if (c.CLIPPED_TEXT && !c.CLIPPED_TEXT.ok) {
    const top = (c.CLIPPED_TEXT.offenders || []).find((o) => o.critical);
    lines.push(`CLIPPED_TEXT ${c.CLIPPED_TEXT.critical} críticos` + (top ? ` ("${top.text}" −${top.overflowPx}px)` : ''));
  }
  if (c.DOCK_OVERLAP && !c.DOCK_OVERLAP.ok) {
    lines.push(
      `DOCK_OVERLAP dock=${c.DOCK_OVERLAP.dockHeight}px reserva=${c.DOCK_OVERLAP.bodyPaddingBottom}px falta=${c.DOCK_OVERLAP.reserveShortfall}px`
    );
  }
  if (c.EDGE_CLIP && !c.EDGE_CLIP.ok) {
    const top = (c.EDGE_CLIP.offenders || [])[0];
    lines.push(
      `EDGE_CLIP ${c.EDGE_CLIP.withContent} cortes` + (top ? ` ("${top.text || top.tag}" L${top.overLeft}/R${top.overRight})` : '')
    );
  }
  if (c.TAP_TARGET_SMALL && !c.TAP_TARGET_SMALL.ok) lines.push(`TAP_TARGET_SMALL ${c.TAP_TARGET_SMALL.total}`);
  if (c.TEXT_TOO_SMALL && !c.TEXT_TOO_SMALL.ok) {
    const top = (c.TEXT_TOO_SMALL.offenders || [])[0];
    lines.push(`TEXT_TOO_SMALL ${c.TEXT_TOO_SMALL.total} nodos <${c.TEXT_TOO_SMALL.floorPx}px` + (top ? ` ("${top.text}" ${top.fontSize}px)` : ''));
  }
  if (c.VERTICAL_GAP && !c.VERTICAL_GAP.ok) lines.push(`VERTICAL_GAP ${c.VERTICAL_GAP.total} huecos >${c.VERTICAL_GAP.thresholdPx}px`);
  if (c.H1_AUDIT && !c.H1_AUDIT.ok) lines.push(`H1_AUDIT ${c.H1_AUDIT.note}`);
  return lines;
}

function cellOf(ev) {
  if (!ev) return '—';
  if (ev.error) return 'ERROR';
  const s = ev.summary || { p0: 0, p1: 0, p2: 0 };
  if (s.p0 > 0) return `**P0·${s.p0}**`;
  if (s.p1 > 0) return `P1·${s.p1}`;
  if (s.p2 > 0) return `P2·${s.p2}`;
  return 'OK';
}

function buildMarkdown(report) {
  const L = [];
  L.push('# Auditoría visual de prototipos · Chrome real · multi-viewport');
  L.push('');
  L.push(`- **Generado**: \`${report.generatedAt}\``);
  L.push(
    `- **Objetivo**: \`${report.base}\` · probed=${report.preflight.probed} · source=${report.preflight.source} · mode=${report.preflight.mode}`
  );
  L.push(
    `- **Viewports**: ${report.viewports.map((v) => `${v.id} (${v.width}×${v.height}@${v.dpr}x)`).join(' · ')}`
  );
  L.push(
    `- **Umbrales**: texto ≥ ${report.thresholds.minFontPx}px · táctil ≥ ${report.thresholds.tapMin}px · hueco > ${report.thresholds.gapMobile}px (móvil) / ${report.thresholds.gapDesktop}px (escritorio) · h1 ratio ≥ ${report.thresholds.h1MinRatio}`
  );
  L.push('');
  L.push(
    `**Totales**: P0=${report.totals.p0} · P1=${report.totals.p1} · P2=${report.totals.p2} · filas medidas=${report.totals.rows} · filas con error=${report.totals.rowsWithError}`
  );
  L.push('');
  L.push('## Matriz ruta × viewport');
  L.push('');
  L.push(`| Ruta | ${report.viewports.map((v) => v.id).join(' | ')} |`);
  L.push(`|---|${report.viewports.map(() => '---').join('|')}|`);
  for (const [route, entry] of Object.entries(report.routes)) {
    const cells = report.viewports.map((vp) => cellOf(entry.viewports[vp.id]));
    L.push(`| \`${route}\` | ${cells.join(' | ')} |`);
  }
  L.push('');
  L.push('## Defectos por fila');
  L.push('');
  let anyDefect = false;
  for (const [route, entry] of Object.entries(report.routes)) {
    for (const [vpId, ev] of Object.entries(entry.viewports)) {
      const lines = ev.error ? [`ERROR: ${ev.error}`] : describeFailures(ev);
      if (lines.length === 0) continue;
      anyDefect = true;
      L.push(`### \`${route}\` · ${vpId} · HTTP ${ev.status}`);
      for (const line of lines) L.push(`- ${line}`);
      const shots = (ev.screenshots || []).filter((s) => s.includes('-fail-') || s.includes('-bottom'));
      for (const s of shots) L.push(`  - \`${s}\``);
      L.push('');
    }
  }
  if (!anyDefect) {
    L.push('Sin defectos por encima de los umbrales en esta corrida.');
    L.push('');
  }
  L.push('## Evidencia tipográfica (qué familia se pinta de verdad)');
  L.push('');
  for (const [route, entry] of Object.entries(report.routes)) {
    const first = entry.viewports['mobile-390'] || Object.values(entry.viewports)[0];
    if (!first || !first.fonts) continue;
    L.push(`- \`${route}\`: body=\`${first.fonts.bodyFamily}\` · h1=\`${first.fonts.headingFamily}\``);
    const used = (first.fonts.usedFamilies || [])
      .map((u) => {
        // P-3: tres estados distintos no caben en un booleano. Se nombran.
        const flags = [];
        if (u.declared === false) flags.push('webfont no declarada');
        else if (u.loaded === false) flags.push('webfont no descargada');
        if (u.renders === false) flags.push('pinta fallback del sistema');
        return `\`${u.family}\`${flags.length ? ` ⚠️ ${flags.join(' / ')}` : ''} (${u.nodes})`;
      })
      .join(' · ');
    if (used) L.push(`  - familias usadas: ${used}`);
  }
  L.push('');
  L.push('## Capturas');
  L.push('');
  for (const [route, entry] of Object.entries(report.routes)) {
    for (const [vpId, ev] of Object.entries(entry.viewports)) {
      const shots = (ev.screenshots || []).filter((s) => !s.includes('-fail-'));
      if (shots.length) L.push(`- \`${route}\` · ${vpId}: ${shots.map((s) => `\`${s}\``).join(' · ')}`);
    }
  }
  L.push('');
  L.push('---');
  L.push('');
  L.push(
    'Gate: **P0 bloquea** (texto crítico recortado, dock tapando contenido, serif del sistema, overflow horizontal). P1/P2 informan salvo `--strict`.'
  );
  L.push('Un informe sin `probed=true` es `SIN_EVIDENCIA` y este script no lo escribe (AF-5).');
  L.push('');
  return L.join('\n');
}

async function main() {
  if (!fs.existsSync(CHROME)) {
    throw new Error(
      `Chrome no encontrado en: ${CHROME}\nDefine CHROME_PATH si está instalado en otra ruta (p. ej. Chrome for Testing).`
    );
  }
  fs.mkdirSync(OUT_DIR, { recursive: true });

  // Preflight ANTES de lanzar Chrome: sin servidor no hay medición (AF-1/AF-5).
  const preflight = await ensureTarget();
  if (!preflight.probed) {
    console.log('SIN_EVIDENCIA: preflight probed=false; no se lanza Chrome ni se escribe informe');
    console.log('VERDICT=BLOCKED');
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
      '--font-render-hinting=none',
    ],
  });

  const cfgBase = {
    minFontPx: THRESH.minFontPx,
    tapMin: THRESH.tapMin,
    h1MinRatio: THRESH.h1MinRatio,
    dockTolerance: THRESH.dockTolerance,
    serifFamilies: SERIF_FAMILIES,
  };

  const report = {
    generatedAt: new Date().toISOString(),
    base: BASE,
    preflight,
    shotsMode: SHOTS_MODE,
    thresholds: THRESH,
    viewports: VIEWPORTS,
    routes: {},
    totals: { p0: 0, p1: 0, p2: 0, rows: 0, rowsWithError: 0 },
  };

  for (const route of ROUTES) {
    const url = BASE + route;
    const dir = path.join(OUT_DIR, slugOf(route));
    fs.mkdirSync(dir, { recursive: true });
    console.log(`\n=== ${url}`);
    const entry = { url, status: 0, viewports: {} };
    for (const vp of VIEWPORTS) {
      // `touch` es OBLIGATORIO: sin él, V05 TAP_TARGET_SMALL se auto-inhabilita y
      // el informe diría "ok" sin haber medido nada (falso verde).
      const cfg = { ...cfgBase, touch: vp.touch, bigGap: vp.touch ? THRESH.gapMobile : THRESH.gapDesktop };
      const ev = await measureAt(browser, url, vp, dir, cfg);
      entry.viewports[vp.id] = ev;
      if (!entry.status) entry.status = ev.status;

      report.totals.rows += 1;
      const s = ev.summary || { p0: 0, p1: 0, p2: 0, failed: [] };
      report.totals.p0 += s.p0;
      report.totals.p1 += s.p1;
      report.totals.p2 += s.p2;
      if (ev.error) report.totals.rowsWithError += 1;

      const mark = ev.error ? 'ERROR' : s.p0 > 0 ? 'P0' : s.p1 > 0 ? 'P1' : s.p2 > 0 ? 'P2' : 'OK';
      console.log(
        `  ${vp.id.padEnd(13)} HTTP ${String(ev.status).padEnd(3)} ${mark.padEnd(5)} P0=${s.p0} P1=${s.p1} P2=${s.p2}` +
          (s.failed.length ? ` · ${s.failed.join(',')}` : '') +
          (ev.error ? ` · ${ev.error}` : '')
      );
      for (const line of describeFailures(ev).slice(0, 4)) console.log(`      ↳ ${line}`);
    }
    report.routes[route] = entry;
  }

  await browser.close();
  stopStandalone();

  const json = JSON.stringify(report, null, 2);
  const jsonPath = path.join(OUT_DIR, 'visual_audit_report.json');
  fs.writeFileSync(jsonPath, json, 'utf8');
  const mdPath = path.join(OUT_DIR, 'SUMMARY.md');
  fs.writeFileSync(mdPath, buildMarkdown(report), 'utf8');

  const sha256 = crypto.createHash('sha256').update(json, 'utf8').digest('hex');
  const ts = new Date().toISOString();

  console.log('\n================ SUMMARY ================');
  for (const [route, entry] of Object.entries(report.routes)) {
    const p0 = Object.values(entry.viewports).reduce((m, ev) => m + ((ev.summary && ev.summary.p0) || 0), 0);
    const p1 = Object.values(entry.viewports).reduce((m, ev) => m + ((ev.summary && ev.summary.p1) || 0), 0);
    console.log(`${route} -> P0=${p0} P1=${p1}`);
  }
  console.log(`TOTAL_P0=${report.totals.p0}`);
  console.log(`TOTAL_P1=${report.totals.p1}`);
  console.log(`TOTAL_P2=${report.totals.p2}`);
  console.log(`ROWS=${report.totals.rows} ROWS_WITH_ERROR=${report.totals.rowsWithError}`);
  console.log(`REPORT=${path.relative(ROOT, jsonPath).replace(/\\/g, '/')}`);
  console.log(`SUMMARY=${path.relative(ROOT, mdPath).replace(/\\/g, '/')}`);

  const blocked = report.totals.p0 > 0 || report.totals.rowsWithError > 0 || (STRICT && (report.totals.p1 > 0 || report.totals.p2 > 0));
  console.log(
    `CLAIM{visual_audit} :: cmd="node scripts/visual_prototype_audit.cjs" :: exit=${blocked ? 1 : 0} :: url="${BASE}${ROUTES[0]}" :: sha256=${sha256} :: ts=${ts}`
  );
  console.log(`VERDICT=${blocked ? 'BLOCKED' : 'PASS'}`);
  process.exitCode = blocked ? 1 : 0;
}

main().catch((err) => {
  console.error('FATAL:', err && err.message ? err.message : err);
  stopStandalone();
  process.exit(1);
});
