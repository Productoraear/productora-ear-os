/**
 * AUDITORÍA FORENSE DE CONTRASTE WCAG 2.2 — NAVEGADOR REAL (Chrome headless)
 * ---------------------------------------------------------------------------
 * Sin autoexcusas: NO ignora botones con gradiente, NO ignora textos largos y
 * NO asume que el fondo es opaco. Compone TODAS las capas de fondo (color +
 * paradas de gradiente) y evalúa el PEOR CASO posible bajo el texto.
 *
 * Uso:
 *   node scripts/audit_wcag_contrast_live.cjs
 *   node scripts/audit_wcag_contrast_live.cjs --routes=/,/proveedores
 *   node scripts/audit_wcag_contrast_live.cjs --base=http://localhost:3007 --shots=1
 *
 * Salida:
 *   reports/contrast/wcag_report.json   (detalle por ruta)
 *   reports/contrast/<ruta>/shot-*.png  (capturas reales de Chrome)
 */
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');
const net = require('net');
const puppeteer = require('puppeteer-core');

const CHROME =
  process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ROOT = path.resolve(__dirname, '..');
const OUT_DIR = path.join(ROOT, 'reports', 'contrast');

const args = process.argv.slice(2);
const getArg = (name, fallback) => {
  const hit = args.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.slice(name.length + 3) : fallback;
};

// `let`, no `const`: el preflight puede repuntar el objetivo al servidor
// standalone que arranca él mismo cuando el servidor objetivo está caído.
let BASE = getArg('base', 'http://localhost:3007').replace(/\/$/, '');
const SHOTS = getArg('shots', '1') === '1';
const ONLY_FAILING = getArg('failing', '0') === '1';
const ROUTES = getArg('routes', '/,/proveedores,/otzarreta,/encargos,/reservar/solista')
  .split(',')
  .map((r) => r.trim())
  .filter(Boolean);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/* ───────────────────────────────────────────────────────────────────────────
 * PREFLIGHT ANTI-FALSO-VERDE (AF-1 · AF-5)
 * Un informe de contraste sin servidor vivo es SIN_EVIDENCIA, no un verde.
 * Si el objetivo no responde y existe el build standalone, lo arranca este
 * script y lo mata al terminar: la medición se hace contra algo que responde.
 * ─────────────────────────────────────────────────────────────────────────── */
const STANDALONE_SERVER = path.join(ROOT, '.next', 'standalone', 'server.js');
const STANDALONE_STATIC = path.join(ROOT, '.next', 'standalone', '.next', 'static');
const STATIC_SOURCE = path.join(ROOT, '.next', 'static');
// 15 s no bastan en un host cargado: medido hoy, el mismo comando abrió TCP en
// ~1 s en una corrida y no abrió en otra (gate:prepush rojo por arranque, no por
// contraste). Presupuesto mayor + reintento en puerto limpio convierten una
// intermitencia en un resultado determinista, sin relajar ninguna aserción.
const PREFLIGHT_TIMEOUT_MS = 30000;
const PREFLIGHT_ATTEMPTS = 2;
// Flag de diagnóstico (`--autostart=0`): reproduce el caso sin servidor para
// probar que el guard falla cerrado. En el gate siempre vale 1 (por defecto).
const AUTOSTART = getArg('autostart', '1');

let standaloneChild = null;
// Sin capturar stderr, un fallo de arranque queda mudo y el guard se vuelve
// ciego justo cuando más información necesita (AF-1: la telemetría no opina).
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

/**
 * Liveness de bajo nivel: 1 si algo escucha en host:puerto, 0 si no.
 * Se usa un handshake TCP y no una petición HTTP porque el cliente HTTP de
 * Node quedó colgado sin respuesta ni error mientras un cliente externo
 * recibía 200 del mismo servidor (medido en esta sesión). El preflight sólo
 * necesita responder a una pregunta: ¿hay alguien escuchando?
 */
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

/**
 * Sin `.next/static` el servidor standalone sirve la página sin CSS y mediría
 * un fallo de contraste que no existe en producción. Sincronización idempotente.
 */
function syncStaticAssets() {
  if (!fs.existsSync(STATIC_SOURCE)) return 'MISSING .next/static';
  if (fs.existsSync(STANDALONE_STATIC)) return 'PRESENT';
  fs.cpSync(STATIC_SOURCE, STANDALONE_STATIC, { recursive: true });
  return 'COPIED';
}

/**
 * Garantiza un objetivo medible. Contrato AF-1/AF-5: devuelve siempre
 * `probed`, `source`, `mode` y `checkedAt`; nunca asume verde sin sondear.
 */
async function ensureTarget() {
  const checkedAt = new Date().toISOString();
  const alive = await probeAny(BASE);
  if (alive.status > 0) {
    BASE = alive.base;
    console.log(
      `[PREFLIGHT] ${BASE} responde (TCP abierto) · probed=true · source=live · mode=REAL`
    );
    return { base: BASE, probed: true, source: 'live', mode: 'REAL', checkedAt, autoStarted: false };
  }
  console.log(`[PREFLIGHT] ${BASE} NO responde (TCP cerrado o timeout) · probed=false`);

  if (!fs.existsSync(STANDALONE_SERVER)) {
    console.log(
      `[PREFLIGHT] SIN_EVIDENCIA: no existe ${path
        .relative(ROOT, STANDALONE_SERVER)
        .replace(/\\/g, '/')}`
    );
    return { base: BASE, probed: false, source: 'static', mode: 'SIMULADO', checkedAt, autoStarted: false };
  }

  const parsed = new URL(BASE);
  const preferred = Number(parsed.port) || (parsed.protocol === 'https:' ? 443 : 80);
  const assets = syncStaticAssets();

  if (AUTOSTART !== '1') {
    console.log('[PREFLIGHT] autostart desactivado (--autostart=0): no se arranca servidor');
    return { base: BASE, probed: false, source: 'static', mode: 'SIMULADO', checkedAt, autoStarted: false };
  }

  for (let attempt = 1; attempt <= PREFLIGHT_ATTEMPTS; attempt += 1) {
    // El primer intento respeta el puerto pedido; el reintento usa uno efímero
    // para esquivar un socket que quedó en estado raro en el puerto original.
    const port = attempt === 1 ? await pickPort(preferred) : await pickPort(0);
    const booted = await bootStandalone(port, assets, attempt);
    if (booted) {
      console.log(
        `[PREFLIGHT] Servidor propio vivo en ${booted} (TCP abierto) · probed=true · source=live · mode=REAL`
      );
      BASE = booted;
      return { base: booted, probed: true, source: 'live', mode: 'REAL', checkedAt, autoStarted: true };
    }
  }

  console.log('[PREFLIGHT] SIN_EVIDENCIA: ningún intento de arranque abrió TCP');
  return { base: BASE, probed: false, source: 'static', mode: 'SIMULADO', checkedAt, autoStarted: false };
}

/**
 * Un intento de arranque. Devuelve la base viva o `null`, y deja SIEMPRE en el
 * log el código de salida y el stderr del hijo: un fallo mudo es indistinguible
 * de una mentira (AF-1: la telemetría no opina, mide).
 */
async function bootStandalone(port, assets, attempt) {
  console.log(
    `[PREFLIGHT] Auto-arranque ${attempt}/${PREFLIGHT_ATTEMPTS}: node .next/standalone/server.js · PORT=${port} · static=${assets}`
  );
  standaloneDiag = '';

  standaloneChild = spawn(process.execPath, [STANDALONE_SERVER], {
    cwd: path.dirname(STANDALONE_SERVER),
    env: {
      ...process.env,
      PORT: String(port),
      HOSTNAME: '127.0.0.1',
      NODE_ENV: 'production',
      NEXT_TELEMETRY_DISABLED: '1',
    },
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
    const tcpAlive = await probe(base, 1500);
    if (tcpAlive > 0) return base;
    if (!standaloneChild || standaloneChild.exitCode !== null) break;
  }

  const exitCode = standaloneChild ? standaloneChild.exitCode : 'spawn-error';
  console.log(`[PREFLIGHT] Intento ${attempt} sin TCP: childExit=${exitCode}`);
  console.log('[PREFLIGHT] stderr del servidor standalone:');
  console.log(standaloneDiag.trim() || '(vacío: el proceso quedó vivo sin escuchar)');
  stopStandalone();
  return null;
}

/** Algoritmo de contraste WCAG 2.2 ejecutado DENTRO del navegador. */
function auditInPage() {
  const parseColor = (str) => {
    if (!str || typeof str !== 'string') return null;
    const m = str.match(
      /rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)(?:[,\s/]+([\d.]+)(%?))?\s*\)/i
    );
    if (!m) return null;
    let a = m[4] !== undefined ? parseFloat(m[4]) : 1;
    if (m[5] === '%') a = a / 100;
    return { r: Number(m[1]), g: Number(m[2]), b: Number(m[3]), a: Math.min(1, Math.max(0, a)) };
  };

  const parseStops = (bgImage) => {
    if (!bgImage || bgImage === 'none') return [];
    const tokens = bgImage.match(/rgba?\([^()]*\)/gi) || [];
    return tokens.map(parseColor).filter(Boolean);
  };

  const lum = (c) => {
    const ch = [c.r, c.g, c.b].map((v) => {
      const s = v / 255;
      return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
    });
    return ch[0] * 0.2126 + ch[1] * 0.7152 + ch[2] * 0.0722;
  };

  const ratio = (a, b) => {
    const l1 = lum(a);
    const l2 = lum(b);
    return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
  };

  const over = (fg, bg) => ({
    r: fg.r * fg.a + bg.r * (1 - fg.a),
    g: fg.g * fg.a + bg.g * (1 - fg.a),
    b: fg.b * fg.a + bg.b * (1 - fg.a),
    a: 1,
  });

  const keyOf = (c) => `${Math.round(c.r)},${Math.round(c.g)},${Math.round(c.b)}`;

  const capCandidates = (list) => {
    const map = new Map();
    for (const c of list) map.set(keyOf(c), c);
    const uniq = [...map.values()];
    if (uniq.length <= 10) return uniq;
    uniq.sort((x, y) => lum(x) - lum(y));
    const picked = [];
    const step = (uniq.length - 1) / 9;
    for (let i = 0; i < 10; i += 1) picked.push(uniq[Math.round(i * step)]);
    return picked;
  };

  const hasOwnText = (el) => {
    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT') {
      return true;
    }
    for (const node of el.childNodes) {
      if (node.nodeType === 3 && node.textContent && node.textContent.trim().length > 0) return true;
    }
    return false;
  };

  const isHidden = (el, st) => {
    if (st.display === 'none' || st.visibility === 'hidden' || parseFloat(st.opacity) < 0.05) return true;
    if (el.getAttribute('aria-hidden') === 'true') return true;
    if (el.closest('.sr-only')) return true;
    const rect = el.getBoundingClientRect();
    if (rect.width < 2 || rect.height < 2) return true;
    if (rect.bottom < 0 || rect.right < 0) return true;
    return false;
  };

  const describe = (el) => {
    const cls = typeof el.className === 'string' ? el.className : '';
    const id = el.id ? `#${el.id}` : '';
    return `${el.tagName.toLowerCase()}${id}${
      cls ? `.${cls.trim().split(/\s+/).slice(0, 6).join('.')}` : ''
    }`;
  };

  const text = (el) => {
    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') return el.placeholder || el.value || '';
    if (el.tagName === 'SELECT') {
      return el.options[el.selectedIndex] ? el.options[el.selectedIndex].text : '';
    }
    return Array.from(el.childNodes)
      .filter((n) => n.nodeType === 3)
      .map((n) => n.textContent)
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim();
  };

  const results = { failures: [], indeterminate: [], scanned: 0 };

  const all = document.querySelectorAll('body *');
  for (const el of all) {
    const st = window.getComputedStyle(el);
    if (isHidden(el, st)) continue;
    if (!hasOwnText(el)) continue;
    const label = text(el);
    if (!label) continue;

    const fgBase = parseColor(st.color);
    if (!fgBase) continue;
    const fgAlpha = Math.min(1, fgBase.a * parseFloat(st.opacity || '1'));
    const gradientText = st.webkitBackgroundClip === 'text' || st.backgroundClip === 'text';
    if (fgAlpha < 0.03 && !gradientText) continue;

    results.scanned += 1;

    const chain = [];
    for (let cur = el; cur; cur = cur.parentElement) chain.push(cur);
    chain.reverse();

    let cands = [{ r: 255, g: 255, b: 255, a: 1 }];
    let sawImage = false;
    let sawBlend = false;
    const elRect = el.getBoundingClientRect();

    for (const node of chain) {
      const ns = window.getComputedStyle(node);
      if (ns.mixBlendMode && ns.mixBlendMode !== 'normal') sawBlend = true;
      // background-clip:text => el gradiente es el RELLENO del texto, no un fondo
      if (gradientText && node === el) continue;
      const bg = parseColor(ns.backgroundColor);
      if (bg && bg.a > 0.001) cands = cands.map((c) => over(bg, c));
      if (ns.backgroundImage && ns.backgroundImage !== 'none') {
        const stops = parseStops(ns.backgroundImage);
        if (stops.length === 0 && /url\(/i.test(ns.backgroundImage)) sawImage = true;
        if (stops.length > 0) {
          const next = [];
          for (const c of cands) for (const s of stops) next.push(over(s, c));
          cands = capCandidates(next);
        }
      }
    }

    // Medios (<img>/<video>/<canvas>) pintados detrás del texto: fuera del cómputo CSS
    if (!sawImage) {
      for (const media of document.querySelectorAll('img, video, canvas')) {
        if (media.contains(el)) continue;
        const mr = media.getBoundingClientRect();
        if (mr.width < 40 || mr.height < 40) continue;
        const ix = Math.min(mr.right, elRect.right) - Math.max(mr.left, elRect.left);
        const iy = Math.min(mr.bottom, elRect.bottom) - Math.max(mr.top, elRect.top);
        if (ix > 0 && iy > 0 && ix * iy > 0.55 * Math.max(1, elRect.width * elRect.height)) {
          sawImage = true;
          break;
        }
      }
    }

    const size = parseFloat(st.fontSize) || 16;
    const weight = parseInt(st.fontWeight, 10) || 400;
    const isLarge = size >= 24 || (size >= 18.66 && weight >= 700);
    const required = isLarge ? 3 : 4.5;

    const fgColors = gradientText ? parseStops(st.backgroundImage) : [{ ...fgBase, a: fgAlpha }];
    if (fgColors.length === 0) continue;

    let worst = null;
    for (const bgc of cands) {
      for (const fgc of fgColors) {
        const rendered = over({ ...fgc, a: gradientText ? fgc.a : fgAlpha }, bgc);
        const r = ratio(rendered, bgc);
        if (!worst || r < worst.ratio) worst = { ratio: r, bg: bgc };
      }
    }
    if (!worst) continue;

    const rect = el.getBoundingClientRect();
    const entry = {
      selector: describe(el),
      text: label.slice(0, 80),
      color: st.color,
      background: `rgb(${Math.round(worst.bg.r)}, ${Math.round(worst.bg.g)}, ${Math.round(worst.bg.b)})`,
      ratio: Number(worst.ratio.toFixed(2)),
      required,
      fontSize: size,
      fontWeight: weight,
      gradientText,
      onImage: sawImage,
      blend: sawBlend,
      box: {
        x: Math.round(rect.x),
        y: Math.round(rect.y + window.scrollY),
        w: Math.round(rect.width),
        h: Math.round(rect.height),
      },
      route: location.pathname,
    };

    if (sawImage || sawBlend) {
      if (worst.ratio < required) results.indeterminate.push(entry);
      continue;
    }
    if (worst.ratio < required) results.failures.push(entry);
  }

  results.failures.sort((a, b) => a.ratio - b.ratio);
  results.indeterminate.sort((a, b) => a.ratio - b.ratio);
  return results;
}

const slugOf = (route) =>
  route === '/' ? 'home' : route.replace(/[^a-z0-9]+/gi, '-').replace(/^-+|-+$/g, '');

async function main() {
  if (!fs.existsSync(CHROME)) throw new Error(`Chrome no encontrado en: ${CHROME}`);
  fs.mkdirSync(OUT_DIR, { recursive: true });

  // Preflight ANTES de lanzar Chrome: si no hay servidor, no hay medición (AF-5).
  const preflight = await ensureTarget();

  // INTEGRIDAD DE EVIDENCIA: una corrida sin servidor probado no debe gastar
  // 10 peticiones fallidas NI sobrescribir la última medición real de
  // reports/contrast/wcag_report.json (hoy el gate rojo la destruyó).
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
    ],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });

  const report = { base: BASE, generatedAt: new Date().toISOString(), routes: {} };
  let totalFailures = 0;
  let totalIndeterminate = 0;

  for (const route of ROUTES) {
    const url = BASE + route;
    const slug = slugOf(route);
    const dir = path.join(OUT_DIR, slug);
    fs.mkdirSync(dir, { recursive: true });
    console.log(`\n=== AUDITANDO ${url}`);

    let status = 0;
    let failures = [];
    let indeterminate = [];
    let scanned = 0;
    const shots = [];

    try {
      const res = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 90000 });
      status = res ? res.status() : 0;
      await sleep(4000);
      // Esperar hidratación de datos reales (tarjetas, listados, calendarios)
      await page
        .waitForFunction(
          () => {
            const spinning = document.querySelector('[class*="animate-spin"], [class*="animate-pulse"]');
            const cards = document.querySelectorAll('article, [class*="Vendor"], [class*="vendor"]');
            return cards.length > 0 || !spinning;
          },
          { timeout: 12000 }
        )
        .catch(() => {});
      await sleep(1500);

      const total = await page.evaluate(() => document.documentElement.scrollHeight);
      const steps = Math.min(9, Math.max(1, Math.ceil(total / 850)));
      for (let i = 0; i < steps; i += 1) {
        await page.evaluate((y) => window.scrollTo(0, y), i * 850);
        await sleep(SHOTS ? 750 : 450);
        if (SHOTS) {
          const file = path.join(dir, `shot-${String(i).padStart(2, '0')}.png`);
          await page.screenshot({ path: file });
          shots.push(path.relative(ROOT, file).replace(/\\/g, '/'));
        }
      }
      await page.evaluate(() => window.scrollTo(0, 0));
      await sleep(800);

      const result = await page.evaluate(auditInPage);
      failures = result.failures;
      indeterminate = result.indeterminate;
      scanned = result.scanned;

      if (SHOTS && failures.length > 0) {
        const worst = failures.slice(0, 5);
        let idx = 0;
        for (const f of worst) {
          idx += 1;
          const clip = {
            x: Math.max(0, f.box.x - 40),
            y: Math.max(0, f.box.y - 30),
            width: Math.max(80, Math.min(1400, f.box.w + 80)),
            height: Math.max(48, Math.min(700, f.box.h + 60)),
          };
          if (clip.y > total) continue;
          try {
            await page.evaluate((y) => window.scrollTo(0, Math.max(0, y - 300)), f.box.y);
            await sleep(300);
            const shifted = await page.evaluate((v) => v - window.scrollY, f.box.y);
            await page.screenshot({
              path: path.join(dir, `fail-${String(idx).padStart(2, '0')}.png`),
              clip: { ...clip, y: Math.max(0, shifted - 30) },
            });
          } catch (e) {
            /* crop opcional */
          }
        }
        await page.evaluate(() => window.scrollTo(0, 0));
      }
    } catch (err) {
      console.log(`  ! ERROR: ${err.message}`);
    }

    totalFailures += failures.length;
    totalIndeterminate += indeterminate.length;

    report.routes[route] = {
      url,
      status,
      scanned,
      failures,
      indeterminate,
      screenshots: shots,
    };

    console.log(`  HTTP ${status} · nodos de texto: ${scanned}`);
    console.log(`  FALLOS AA REALES: ${failures.length} · SOBRE IMAGEN/BLEND (dudoso): ${indeterminate.length}`);
    for (const f of failures.slice(0, 14)) {
      console.log(
        `   [${f.ratio}:1 < ${f.required}] ${f.selector} :: "${f.text}" (fg ${f.color} / bg ${f.background} / ${f.fontSize}px ${f.fontWeight})`
      );
    }
  }

  await browser.close();
  stopStandalone();

  const routesWithZeroScan = Object.values(report.routes).filter(
    (route) => route.scanned === 0 || route.status === 0
  ).length;
  report.preflight = preflight;

  const jsonPath = path.join(OUT_DIR, 'wcag_report.json');
  fs.writeFileSync(jsonPath, JSON.stringify(report, null, 2), 'utf8');

  console.log('\n================ SUMMARY ================');
  for (const [route, data] of Object.entries(report.routes)) {
    console.log(`${route} -> fallos: ${data.failures.length} (scan ${data.scanned})`);
  }
  console.log(`TOTAL_FALLOS=${totalFailures}`);
  console.log(`TOTAL_INDETERMINATE=${totalIndeterminate}`);
  console.log(`REPORT=${path.relative(ROOT, jsonPath).replace(/\\/g, '/')}`);
  console.log(`ROUTES_SIN_EVIDENCIA=${routesWithZeroScan}`);
  if (routesWithZeroScan > 0) {
    console.log(
      `SIN_EVIDENCIA: ${routesWithZeroScan} ruta(s) con 0 elementos medidos (AF-5 prohíbe verde sin medir)`
    );
  }
  if (!preflight.probed) {
    console.log(
      `SIN_EVIDENCIA: preflight probed=false (source=${preflight.source}); no se midió un servidor real`
    );
  }

  const measurable = preflight.probed && routesWithZeroScan === 0;
  if (ONLY_FAILING && totalFailures === 0 && measurable) {
    console.log('GATE: PASS (0 fallos AA deterministas sobre medición real)');
  }
  console.log(`VERDICT=${measurable && totalFailures === 0 ? 'PASS' : 'BLOCKED'}`);
  process.exitCode = measurable && totalFailures === 0 ? 0 : 1;
}

main().catch((err) => {
  console.error('FATAL:', err);
  stopStandalone();
  process.exit(1);
});
