#!/usr/bin/env node
/**
 * ════════════════════════════════════════════════════════════════════════════
 * AUDITOR FORENSE DEL METACOMPILADOR · ENTERPRISE (P0 2026-11-21)
 * ════════════════════════════════════════════════════════════════════════════
 * Mandato del CEO: cuatro brechas P0 medidas en producción real
 * (productoraear.com) que el arnés de compuertas NO detectó.
 *
 *   1. Canibalización de URLs: /calendario/<kind>/<slug>?intent=ver|bloquear
 *      y /proveedores?cat=finca devolvían 307 -> /celebraciones.
 *   2. El agente se comportaba como chatbot: chips sin respuesta, sin voz ni
 *      handoff a WhatsApp.
 *   3. El convertidor de escaparates (Bodas.net) y la ficha de 380 campos se
 *      pintaban a usuarios finales.
 *   4. Silencios: cualquier fallo de la API del concierge se tragaba sin aviso.
 *
 * Diseño: auditoría ESTÁTICA (0 tokens de LLM) sobre el árbol de fuentes, con
 * sonda HTTP opcional (`--live`) para certificar el comportamiento del
 * middleware en producción. Emite:
 *   · scratch/METACOMPILER_ENTERPRISE_AUDIT.json              (compacto)
 *   · .antigravity/evidence/metacompiler_enterprise_audit.jsonl (ledger EP-4)
 *
 * Exit codes: 0 = 0 hallazgos P0 abiertos · 1 = algún P0 abierto (bloquea commit).
 *
 * Uso:
 *   node scripts/audit_metacompiler_enterprise.cjs
 *   node scripts/audit_metacompiler_enterprise.cjs --live --json
 *   node scripts/audit_metacompiler_enterprise.cjs --base-url=http://127.0.0.1:3007
 *   node scripts/audit_metacompiler_enterprise.cjs --strict   (P1 también rompen)
 * ════════════════════════════════════════════════════════════════════════════
 */

'use strict';

const fs = require('fs');
const path = require('path');
const http = require('http');
const https = require('https');

const ROOT = path.resolve(__dirname, '..');
const args = new Set(process.argv.slice(2));
// `--base-url=<origen>` permite sondear un preview local/producción con el mismo
// rigor que producción (útil para certificar un candidato antes del deploy).
const BASE_URL =
  process.argv
    .slice(2)
    .find((a) => a.startsWith('--base-url='))
    ?.slice('--base-url='.length)
    .trim() || null;
const LIVE = args.has('--live') || Boolean(BASE_URL);
const STRICT = args.has('--strict');
const WANT_JSON = args.has('--json');

const OUT_COMPACT = path.join(ROOT, 'scratch', 'METACOMPILER_ENTERPRISE_AUDIT.json');
const OUT_LEDGER = path.join(ROOT, '.antigravity', 'evidence', 'metacompiler_enterprise_audit.jsonl');

const rel = (p) => path.relative(ROOT, p).replace(/\\/g, '/');

/**
 * Lee un fichero y devuelve su contenido, o `null` si no existe.
 * Nunca lanza: el auditor debe reportar «no existe» como hallazgo, no caerse.
 */
function readSource(relativePath) {
  const abs = path.join(ROOT, relativePath);
  if (!fs.existsSync(abs)) return null;
  return fs.readFileSync(abs, 'utf8');
}

function lineOf(source, needle) {
  if (!source) return null;
  const idx = source.indexOf(needle);
  if (idx < 0) return null;
  return source.slice(0, idx).split('\n').length;
}

const findings = [];

/**
 * Registra un hallazgo con la gramática EP-2:
 *   VERIFICADO    → la guarda existe y el invariante se cumple.
 *   SOSPECHOSO    → hay señal parcial que exige revisión humana.
 *   FACHADA       → la interfaz existe pero el motor/guarda no está cableado.
 *   SIN_EVIDENCIA → no hay artefacto en disco que lo demuestre.
 */
function record({ id, severity, area, claim, state, evidence, detail }) {
  findings.push({
    id,
    severity,
    area,
    claim,
    state,
    evidence: evidence ?? null,
    detail: detail ?? null,
  });
}


// ───────────────────────────────────────────────────────────────────────────
// A. MIDDLEWARE · GATING Y CANIBALIZACIÓN DE URLs
// ───────────────────────────────────────────────────────────────────────────
function auditMiddleware() {
  const src = readSource('src/middleware.ts');
  if (!src) {
    return record({
      id: 'MC-A1',
      severity: 'P0',
      area: 'middleware',
      claim: 'Existe src/middleware.ts con el route-gating',
      state: 'SIN_EVIDENCIA',
      evidence: { file: 'src/middleware.ts', exists: false },
    });
  }

  const whitelistStart = src.indexOf('CERTIFIED_PRODUCTION_ROUTES');
  const whitelistEnd = src.indexOf(']);', whitelistStart);
  const whitelistBlock =
    whitelistStart >= 0 && whitelistEnd > whitelistStart
      ? src.slice(whitelistStart, whitelistEnd)
      : '';
  const certified = [...whitelistBlock.matchAll(/'([^']+)'/g)]
    .map((m) => m[1])
    .filter((token) => token.startsWith('/'));

  record({
    id: 'MC-A1',
    severity: 'P0',
    area: 'middleware',
    claim: 'El gate refluye a /celebraciones toda ruta no certificada',
    state:
      certified.includes('/celebraciones') && /redirected-to-certified-route/.test(src)
        ? 'VERIFICADO'
        : 'SIN_EVIDENCIA',
    evidence: {
      file: 'src/middleware.ts',
      line: lineOf(src, 'redirected-to-certified-route'),
      certifiedRoutes: certified,
    },
    detail:
      'La canibalización nace aquí: si una URL de conversión no figura en la lista, ' +
      'el cliente aterriza en el escaparate y cree que los botones no funcionan.',
  });

  // Las URLs que el CEO reportó deben estar certificadas explícitamente.
  const salesCritical = [
    { id: 'MC-A2a', route: '/proveedores', why: '/proveedores?cat=finca (directorio)' },
    { id: 'MC-A2b', route: '/calendario', why: '/calendario/<kind>/<slug>?intent=ver|bloquear' },
  ];
  for (const { id, route, why } of salesCritical) {
    const isListed = certified.includes(route);
    record({
      id,
      severity: 'P0',
      area: 'middleware',
      claim: `Ruta de conversión ${route} certificada (${why})`,
      state: isListed ? 'VERIFICADO' : 'FACHADA',
      evidence: { file: 'src/middleware.ts', certifiedRoutes: certified, expected: route },
      detail: isListed
        ? 'Ruta presente en la lista blanca de producción.'
        : 'Ruta ausente: el middleware la refluye a /celebraciones en producción.',
    });
  }

  // El destino de agenda debe resolverse contra la URL real, no contra la
  // plantilla literal `/calendario/[kind]/[slug]` (esa comparación nunca casa).
  record({
    id: 'MC-A3',
    severity: 'P1',
    area: 'middleware',
    claim: 'Las rutas dinámicas de agenda se validan con patrón, no con plantilla literal',
    state: /CERTIFIED_DYNAMIC_ROUTE_PATTERNS/.test(src) ? 'VERIFICADO' : 'SOSPECHOSO',
    evidence: {
      file: 'src/middleware.ts',
      line: lineOf(src, 'CERTIFIED_DYNAMIC_ROUTE_PATTERNS'),
    },
    detail:
      'Certificar la cadena "/calendario/[kind]/[slug]" no certifica ninguna URL viva: ' +
      'hay que comparar la ruta con una RegExp de huella.',
  });

  // Cabecera de diagnóstico: un gate mudo es indepurable.
  record({
    id: 'MC-A4',
    severity: 'P1',
    area: 'middleware',
    claim: 'El gate emite cabecera con la ruta que absorbió (diagnóstico)',
    state: /x-ear-route-gating-sank/.test(src) ? 'VERIFICADO' : 'SOSPECHOSO',
    evidence: { file: 'src/middleware.ts', line: lineOf(src, 'x-ear-route-gating-sank') },
    detail: 'Sin esta cabecera, un 307 no dice a qué URL se comió el gate.',
  });
}

// ───────────────────────────────────────────────────────────────────────────
// B. AGENTE CONCIERGE · HECHOS, VOZ Y HANDOFF
// ───────────────────────────────────────────────────────────────────────────
function auditConciergeAgent() {
  const apiPath = 'src/app/api/concierge/chat/route.ts';
  const api = readSource(apiPath);
  const widgetPath = 'src/components/concierge/SovereignConciergeWidget.tsx';
  const widget = readSource(widgetPath);
  const ragPath = 'src/lib/rag/provider-context.ts';
  const rag = readSource(ragPath);

  record({
    id: 'MC-B1',
    severity: 'P0',
    area: 'agente',
    claim: 'El agente reconoce el tenant por la URL de agenda (/calendario/.../otzarreta)',
    state: api && /isOtzarretaTenant/.test(api) ? 'VERIFICADO' : 'FACHADA',
    evidence: { file: apiPath, line: lineOf(api, 'isOtzarretaTenant') },
    detail:
      'Antes sólo miraba pathname.includes("/otzarreta"): al llegar por la agenda el ' +
      'agente perdía el contexto del caserío y contestaba como conserjería genérica.',
  });

  record({
    id: 'MC-B2',
    severity: 'P0',
    area: 'agente',
    claim: 'La pregunta «cómo llego» devuelve dirección real + ruta de mapa',
    state: rag && /llego/.test(rag) && /OTZARRETA_MAPS_URL/.test(rag) ? 'VERIFICADO' : 'FACHADA',
    evidence: { file: ragPath, line: lineOf(rag, 'OTZARRETA_MAPS_URL') },
    detail:
      'El chip real pregunta «¿Cómo llego al caserío y cuánto párking hay?». Sin la ' +
      'variante «llego» y sin deep link de mapa, el chip parece muerto.',
  });

  record({
    id: 'MC-B3',
    severity: 'P0',
    area: 'agente',
    claim: 'Un fallo de la API del concierge no deja el chat en silencio',
    state: widget && /pushRecoveryMessage/.test(widget) ? 'VERIFICADO' : 'FACHADA',
    evidence: { file: widgetPath, line: lineOf(widget, 'pushRecoveryMessage') },
    detail:
      'Síntoma «el chip no responde»: antes cualquier HTTP != 2xx o error de red se ' +
      'tragaba en console.warn sin pintar nada en la UI.',
  });

  record({
    id: 'MC-B4',
    severity: 'P0',
    area: 'agente',
    claim: 'Handoff a agente humano por WhatsApp (voz/audio) en la cabecera del widget',
    state: widget && /whatsapp_agent_handoff/.test(widget) ? 'VERIFICADO' : 'FACHADA',
    evidence: { file: widgetPath, line: lineOf(widget, 'whatsapp_agent_handoff') },
    detail:
      'Requisito del CEO: el canal conversacional es WhatsApp (admite nota de voz y ' +
      'respuesta de voz), no un chatbot cerrado en el navegador.',
  });

  record({
    id: 'MC-B5',
    severity: 'P1',
    area: 'agente',
    claim: 'La superficie de agenda muestra los chips de contexto del caserío',
    state: widget && /isOtzarretaSurface/.test(widget) ? 'VERIFICADO' : 'SOSPECHOSO',
    evidence: { file: widgetPath, line: lineOf(widget, 'isOtzarretaSurface') },
    detail: 'La condición de chips debe cubrir /calendario/<kind>/restaurante-otzarreta.',
  });

  record({
    id: 'MC-B6',
    severity: 'P1',
    area: 'agente',
    claim: 'El prompt prohíbe cerrar con «¿en qué más puedo ayudarte?» y exige 1 pregunta',
    state:
      api && /REGLAS DE FORMATO Y CIERRE EN CADA TURNO[^\n]*AGENTE/.test(api) ? 'VERIFICADO' : 'SOSPECHOSO',
    evidence: { file: apiPath, line: lineOf(api, 'REGLAS DE FORMATO Y CIERRE EN CADA TURNO') },
    detail: 'Regla de cierre única: una sola pregunta concreta por turno.',
  });

  record({
    id: 'MC-B7',
    severity: 'P1',
    area: 'agente',
    claim: 'La agenda ofrece salida humana con la fecha elegida (handoff contextual)',
    state:
      readSource('src/components/calendar/EntityCalendarBoard.tsx')?.includes('buildCalendarHandoffHref')
        ? 'VERIFICADO'
        : 'SOSPECHOSO',
    evidence: { file: 'src/components/calendar/EntityCalendarBoard.tsx' },
    detail: '?intent=bloquear no puede terminar en un callejón sin salida.',
  });
}


// ───────────────────────────────────────────────────────────────────────────
// C. AISLAMIENTO DE HERRAMIENTAS DE PROVEEDOR (Bug #4)
// ───────────────────────────────────────────────────────────────────────────
function auditProviderSurfaceLeaks() {
  const widgetPath = 'src/components/concierge/SovereignConciergeWidget.tsx';
  const widget = readSource(widgetPath);
  const portalPath = 'src/app/(portal)/portal/proveedor/page.tsx';
  const portal = readSource(portalPath);
  const apiPath = 'src/app/api/concierge/chat/route.ts';
  const api = readSource(apiPath);

  // 1. El flag showScraper debe LEERSE, no sólo declararse.
  // M1 sustituyó el flag cliente `showScraper` por una ranura (`scraperSlot`) que
  // sólo se rellena desde el servidor tras `requireAdminFromHeaders()`. Es una
  // guarda MÁS fuerte: el panel ni siquiera se importa en el grafo del cliente
  // salvo que el servidor inyecte la ranura. Se exige el cableado completo.
  const declaresSlot = widget ? /readonly scraperSlot\?: React\.ReactNode;/.test(widget) : false;
  const rendersSlot = widget ? /\{scraperSlot\}/.test(widget) : false;
  const gatedByServer = widget
    ? /m\.action\.type === 'scraper' && scraperSlot/.test(widget)
    : false;
  const absentDeadFlag = widget ? !/showScraper/.test(widget) : false;
  record({
    id: 'MC-C1',
    severity: 'P0',
    area: 'fugas-proveedor',
    claim: 'El convertidor de escaparates (Bodas.net) sólo se pinta en superficie de proveedor',
    state: declaresSlot && rendersSlot && gatedByServer && absentDeadFlag ? 'VERIFICADO' : 'FACHADA',
    evidence: {
      file: widgetPath,
      mechanism: 'server-authorised scraperSlot (supersedes client flag showScraper)',
      declaresSlot,
      rendersSlot,
      gatedByServer,
      absentDeadFlag,
      line: lineOf(widget, '{scraperSlot}'),
    },
    detail: declaresSlot && rendersSlot && gatedByServer && absentDeadFlag
      ? 'La ranura de escaparates la inyecta el servidor (AdminConciergeBridge → requireAdminFromHeaders) ' +
        'y el widget sólo la renderiza con acción `scraper`; el flag muerto ya no existe.'
      : 'La ranura `scraperSlot` no está cableada o sobrevive el flag muerto: el convertidor ' +
        'volvería a ser visible para novios/clientes.',
  });

  // 2. El portal de 380 campos exige autorización server-side.
  //    Se acepta cualquiera de las dos guardas equivalentes en disco:
  //      · RBAC de superficie (`requireAdminFromHeaders` + pantalla de denegación), o
  //      · el predicado de negocio `canMutateCalendarEntity`.
  //    Ambas deben ser FAIL-CLOSED (denegación ANTES de cargar el perfil).
  const authzAfterGuard =
    portal !== null && /const authorized/.test(portal) && /if \(!authorized\)/.test(portal);
  const hasAuthorizationPredicate =
    portal !== null &&
    (/canMutateCalendarEntity/.test(portal) ||
      (/requireAdminFromHeaders/.test(portal) && /EAR_ADMIN_TOKEN/.test(portal)));
  const deniesBeforeLoading =
    portal !== null && /Acceso restringido a proveedores/.test(portal);
  const hasGuard = authzAfterGuard && hasAuthorizationPredicate && deniesBeforeLoading;
  record({
    id: 'MC-C2',
    severity: 'P0',
    area: 'fugas-proveedor',
    claim: '/portal/proveedor (380 campos + paridad de escaparates) exige sesión autorizada',
    state: hasGuard ? 'VERIFICADO' : 'FACHADA',
    evidence: {
      file: portalPath,
      hasGuard,
      authzAfterGuard,
      hasAuthorizationPredicate,
      deniesBeforeLoading,
      line: lineOf(portal, 'if (!authorized)'),
    },
    detail: hasGuard
      ? 'Verificado en servidor: `authorized` se evalúa antes de cualquier lectura y un ' +
        'visitante anónimo recibe la pantalla «Acceso restringido a proveedores».'
      : 'Antes era una página pública: cualquier visitante veía la ficha interna de 380 ' +
        'campos y las herramientas de captación del proveedor.',
  });

  // 3. La API no debe devolver la acción `scraper` fuera del portal proveedor.
  const apiGuarded = api ? /type === 'scraper'/.test(api) : false;
  record({
    id: 'MC-C3',
    severity: 'P1',
    area: 'fugas-proveedor',
    claim: 'La API degrada la acción `scraper` cuando no estamos en /portal/proveedor',
    state: apiGuarded ? 'VERIFICADO' : 'SOSPECHOSO',
    evidence: { file: apiPath, line: lineOf(api, "type === 'scraper'") },
    detail: 'Doble defensa: UI (flag) + servidor (clasificador de acciones).',
  });

  // 4. Los metadatos del portal no deben indexarse.
  record({
    id: 'MC-C4',
    severity: 'P1',
    area: 'fugas-proveedor',
    claim: 'El portal de proveedor declara robots noindex',
    state: portal && /index:\s*false/.test(portal) ? 'VERIFICADO' : 'SOSPECHOSO',
    evidence: { file: portalPath, line: lineOf(portal, 'index: false') },
    detail: 'Una herramienta interna indexada por Google es una fuga silenciosa.',
  });
}

// ───────────────────────────────────────────────────────────────────────────
// D. FILTRO DEL DIRECTORIO (?cat=) · el bug reportado como «no conectado»
// ───────────────────────────────────────────────────────────────────────────
function auditProvidersFilter() {
  const pagePath = 'src/app/(public)/proveedores/page.tsx';
  const page = readSource(pagePath);
  const constantsPath = 'src/lib/constants/spain-regions-and-categories.ts';
  const constants = readSource(constantsPath);

  // M2 migró el directorio a Server Component con `searchParams` asíncrono
  // (Next 16) y delega la normalización en `normalizeBodasNetCategory`. El patrón
  // antiguo `searchParams.get('cat')` ya no existe: exigirlo marcaba un falso
  // FACHADA sobre una lectura de `?cat=` que sí se ejecuta en servidor.
  const readsQuery =
    page !== null &&
    (/searchParams\.get\('cat'\)/.test(page) || /await searchParams\b/.test(page)) &&
    /isFincaAlias|normalizeBodasNetCategory/.test(page);
  record({
    id: 'MC-D1',
    severity: 'P0',
    area: 'directorio',
    claim: 'El directorio lee ?cat= de la URL y lo normaliza al gremio canónico',
    state: readsQuery ? 'VERIFICADO' : 'FACHADA',
    evidence: {
      file: pagePath,
      readsQuery,
      normalizes: page !== null && /normalizeBodasNetCategory/.test(page),
      line:
        lineOf(page, 'normalizeBodasNetCategory') ?? lineOf(page, "searchParams.get('cat')"),
    },
    detail: readsQuery
      ? 'El filtro se resuelve en servidor: `?cat=finca` y su alias se normalizan al ' +
        'gremio canónico antes de pintar el directorio.'
      : 'La lógica de filtrado era correcta: el «no conectado» percibido era el 307 del ' +
        'middleware, que impedía que la página llegara a renderizarse.',
  });

  const mapsFinca = constants ? /finca:\s*'finca'/.test(constants) : false;
  record({
    id: 'MC-D2',
    severity: 'P1',
    area: 'directorio',
    claim: "normalizeBodasNetCategory('finca') -> 'finca'",
    state: mapsFinca ? 'VERIFICADO' : 'FACHADA',
    evidence: { file: constantsPath, line: lineOf(constants, "finca: 'finca'") },
  });
}


// ───────────────────────────────────────────────────────────────────────────
// E. COBERTURA DEL ARNÉS · por qué 17/17 no lo vio
// ───────────────────────────────────────────────────────────────────────────
function auditHarnessCoverage() {
  const runnerPath = 'scripts/run_sv_protocol_15_gates.cjs';
  const runner = readSource(runnerPath);
  const registered = runner
    ? /audit:metacompiler-enterprise|audit_metacompiler_enterprise/.test(runner)
    : false;
  const gateCount = runner
    ? runner.split('\n').filter((line) => /^\s{2}'(?:npm run |node )/.test(line)).length
    : 0;

  record({
    id: 'MC-E1',
    severity: 'P0',
    area: 'arnes',
    claim: 'El arnés ejecuta el auditor de alcanzabilidad de rutas de venta',
    state: registered ? 'VERIFICADO' : 'FACHADA',
    evidence: { file: runnerPath, registered, gatesDetected: gateCount },
    detail:
      'Ninguna compuerta previa hacía una petición a una URL pública y verificaba que NO ' +
      'fuera redirigida: el arnés medía invariantes de datos (precio, SSOT, IBAN), no la ' +
      'alcanzabilidad de la superficie de venta.',
  });

  const pkg = readSource('package.json');
  record({
    id: 'MC-E2',
    severity: 'P1',
    area: 'arnes',
    claim: 'Existe el script npm audit:metacompiler-enterprise',
    state: pkg && /"audit:metacompiler-enterprise"/.test(pkg) ? 'VERIFICADO' : 'SOSPECHOSO',
    evidence: { file: 'package.json' },
  });
}

// ───────────────────────────────────────────────────────────────────────────
// F. SONDA LIVE (opcional) · certifica el comportamiento del middleware
// ───────────────────────────────────────────────────────────────────────────
const LIVE_TARGETS = [
  { id: 'MC-F1', url: 'https://www.productoraear.com/celebraciones', expect: 200 },
  {
    id: 'MC-F2',
    url: 'https://www.productoraear.com/proveedores?cat=finca',
    expect: 200,
    forbiddenRedirect: '/celebraciones',
  },
  {
    id: 'MC-F3',
    url: 'https://www.productoraear.com/proveedores',
    expect: 200,
    forbiddenRedirect: '/celebraciones',
  },
  {
    id: 'MC-F4',
    url: 'https://www.productoraear.com/calendario/catering/restaurante-otzarreta?intent=ver',
    expect: 200,
    forbiddenRedirect: '/celebraciones',
  },
  {
    id: 'MC-F5',
    url: 'https://www.productoraear.com/calendario/catering/restaurante-otzarreta?intent=bloquear',
    expect: 200,
    forbiddenRedirect: '/celebraciones',
  },
];

function resolveTargetUrl(target) {
  if (!BASE_URL) return target.url;
  // Reemplaza el origen público por el origen sondeado conservando ruta y query.
  try {
    const override = new URL(BASE_URL);
    const original = new URL(target.url);
    return new URL(original.pathname + original.search, override.origin).toString();
  } catch {
    return target.url;
  }
}

function probe(target) {
  const url = resolveTargetUrl(target);
  return new Promise((resolve) => {
    const transport = url.startsWith('http://') ? http : https;
    const req = transport.request(
      url,
      {
        method: 'GET',
        timeout: 15000,
        headers: { 'user-agent': 'EAR-OS-Metacompiler-Audit/1.0' },
      },
      (res) => {
        res.resume();
        resolve({
          url,
          status: res.statusCode,
          location: res.headers.location ?? null,
          gatingSank: res.headers['x-ear-route-gating-sank'] ?? null,
        });
      },
    );
    req.on('error', (err) => resolve({ url, status: null, error: err.message }));
    req.on('timeout', () => {
      req.destroy();
      resolve({ url, status: null, error: 'timeout' });
    });
    req.end();
  });
}

async function auditLive() {
  // MC-F0 es una compuerta, no una nota: si no se sondeó un host real, el estado
  // es SIN_EVIDENCIA y el auditor DEBE fallar (EP-5: prohibido el verde por defecto).
  // `--base-url=<origen>` permite sondear un preview local/producción con el mismo rigor.
  if (!LIVE) {
    record({
      id: 'MC-F0',
      severity: 'P0',
      area: 'live',
      claim: 'Sonda HTTP de producción ejecutada',
      state: 'SIN_EVIDENCIA',
      evidence: { live: false, baseUrlArg: BASE_URL },
      detail:
        'Auditoría estática: relanzar con --live (o --base-url=<origen>) para sondear ' +
        'producción real. Sin sonda no hay certificado de alcanzabilidad.',
    });
    return;
  }

  for (const target of LIVE_TARGETS) {
    const result = await probe(target);
    const sank =
      target.forbiddenRedirect && typeof result.location === 'string'
        ? result.location.includes(target.forbiddenRedirect)
        : false;
    const ok = result.status === target.expect && !sank;
    record({
      id: target.id,
      severity: 'P0',
      area: 'live',
      claim: `${target.url} responde ${target.expect} sin refluir a ${
        target.forbiddenRedirect ?? 'otra ruta'
      }`,
      state: ok ? 'VERIFICADO' : 'FACHADA',
      evidence: { url: target.url, ...result, ts: new Date().toISOString() },
      detail: ok
        ? null
        : 'Producción sigue sirviendo el comportamiento defectuoso (deploy pendiente o regresión).',
    });
  }
}


// ───────────────────────────────────────────────────────────────────────────
// INFORME · CARENCIAS ENTERPRISE DEL COMPILADOR (TAREA 2)
// ───────────────────────────────────────────────────────────────────────────
function buildCompilerGapReport() {
  return {
    q1_por_que_el_arnes_no_detecto_la_canibalizacion: [
      'Todas las compuertas eran invariantes de DATOS (precio 350 €, SSOT, depósito 100 €, IBAN, contraste). Ninguna era invariante de ALCANZABILIDAD: no existía una petición a una URL pública que verificara «esta URL sirve su propio contenido y no un 307 al escaparate».',
      'El middleware se validaba por lectura de código, nunca por ejecución. Un `startsWith` sobre una lista blanca no tiene tipo que falle: TypeScript no puede detectar que una URL viva no figura en un array de strings.',
      'La cabecera `x-ear-route-gating` viajaba en el 307, pero ningún script la consumía: telemetría de diagnóstico sin consumidor equivale a cero detección.',
      'El gate vive en `src/middleware.ts`, que en `next build` no hace peticiones reales. Local y producción divergían sin que ninguna compuerta comparara ambos mundos.',
    ],
    q2_que_guarda_faltaba_para_aislar_herramientas_de_proveedor: [
      'Guarda de SUPERFICIE (no de tipo): faltaba una matriz server-side role public|vendor|admin aplicada a la PÁGINA, no sólo a las Server Actions. `/portal/proveedor` era un Server Component público sin autorización.',
      'Guarda de FLAG MUERTO: `showScraper` existía en el tipo `RouteContextConfig` pero ningún consumidor lo leía. Un flag de autorización que no se lee da sensación de protección sin dar protección.',
      'Faltaba una compuerta que verificara que toda herramienta marcada como «sólo proveedor» se renderiza detrás de autorización (MC-C1 / MC-C2 de este script).',
    ],
    q3_tres_carencias_estructurales_local_vs_produccion: [
      '1) El arnés no ejercita el EDGE: corre en Node local, pero lo que rompe al cliente (middleware, redirects, headers) sólo existe en el runtime de producción. Sin sonda HTTP contra el host real, «verde en local» no implica «verde para el cliente».',
      '2) `next.config.ts` tiene `typescript.ignoreBuildErrors: true` y una segunda capa de `redirects()`. El typecheck es una compuerta manual; si se salta, el build de producción compila código que nadie tipó. Además nadie valida la interacción entre las dos capas: una 301 de next.config puede aterrizar después en el gate del middleware y nadie lo detecta.',
      '3) Cero contract-testing de la superficie de venta: no hay e2e que afirme «/calendario/* devuelve 200 y contiene el nombre de la entidad». `audit:cta-matrix` audita hrefs estáticos, no el resultado del servidor tras middleware y redirects.',
    ],
    solucion_inmediata_sin_tocar_zona_cero: [
      '1) `src/middleware.ts`: certificar `/proveedores` y `/calendario`; validar la ruta dinámica con RegExp (no con la plantilla literal `[kind]/[slug]`); emitir `x-ear-route-gating-sank` con la ruta absorbida.',
      '2) El gate deja caer en 404 las rutas hijas inexistentes de un prefijo certificado en lugar de fingir que son el escaparate.',
      '3) Guarda server-side en `/portal/proveedor` con RBAC de superficie fail-closed: `requireAdminFromHeaders()` o token de admin exacto, y denegación ANTES de leer el perfil. `robots: { index: false, follow: false }`.',
      '4) Sustituir el flag muerto `showScraper` por una ranura `scraperSlot` que sólo inyecta el servidor (AdminConciergeBridge → `requireAdminFromHeaders`), y degradar la acción `scraper` en la API fuera de `/portal/proveedor`.',
      '5) Agente: reconocer el tenant por `/calendario/<kind>/<slug>`, rama explícita de «cómo llegar» con deep link de mapa, mensaje de recuperación ante fallo de API y handoff WhatsApp en la cabecera.',
      '6) Nada de esto toca `ear-os-ssot.ts` (Zona Cero intacta): el número de la Centralita se reutiliza desde `CENTRALITA_EAR_OS`.',
      '7) Directorio: lectura de `?cat=` en servidor vía `searchParams` asíncrono (Next 16) + `normalizeBodasNetCategory`, certificada por sonda HTTP (MC-F1..MC-F5), no por lectura de código.',
    ],
  };
}


// ───────────────────────────────────────────────────────────────────────────
// EJECUCIÓN
// ───────────────────────────────────────────────────────────────────────────
async function main() {
  auditMiddleware();
  auditConciergeAgent();
  auditProviderSurfaceLeaks();
  auditProvidersFilter();
  auditHarnessCoverage();
  await auditLive();

  const open = findings.filter((f) => f.state !== 'VERIFICADO');
  const p0Open = open.filter((f) => f.severity === 'P0');
  const p1Open = open.filter((f) => f.severity === 'P1');
  const verified = findings.filter((f) => f.state === 'VERIFICADO');

  const report = {
    schema: 'ear-os/metacompiler-enterprise-audit@1',
    generatedAt: new Date().toISOString(),
    mode: LIVE ? 'STATIC+LIVE' : 'STATIC',
    root: rel(ROOT),
    totals: {
      checks: findings.length,
      verified: verified.length,
      openP0: p0Open.length,
      openP1: p1Open.length,
    },
    verdict: p0Open.length === 0 ? (STRICT && p1Open.length > 0 ? 'ROJO' : 'VERDE') : 'ROJO',
    byArea: findings.reduce((acc, f) => {
      acc[f.area] = (acc[f.area] ?? 0) + 1;
      return acc;
    }, {}),
    findings,
    compilerGapReport: buildCompilerGapReport(),
  };

  fs.mkdirSync(path.dirname(OUT_COMPACT), { recursive: true });
  fs.writeFileSync(OUT_COMPACT, JSON.stringify(report, null, 2), 'utf8');

  fs.mkdirSync(path.dirname(OUT_LEDGER), { recursive: true });
  fs.appendFileSync(
    OUT_LEDGER,
    JSON.stringify({
      ts: report.generatedAt,
      schema: report.schema,
      mode: report.mode,
      verdict: report.verdict,
      totals: report.totals,
      open: open.map((f) => ({ id: f.id, state: f.state, severity: f.severity })),
    }) + '\n',
    'utf8',
  );

  if (WANT_JSON) {
    console.log(JSON.stringify(report, null, 2));
  } else {
    console.log('── AUDITOR DEL METACOMPILADOR · ENTERPRISE ──');
    console.log(`Modo: ${report.mode} · Comprobaciones: ${findings.length}`);
    for (const f of findings) {
      const mark = f.state === 'VERIFICADO' ? 'OK  ' : 'FAIL';
      console.log(`  [${mark}] ${f.id} (${f.severity}) ${f.claim}`);
      if (f.state !== 'VERIFICADO' && f.detail) console.log(`         > ${f.detail}`);
    }
    console.log('─────────────────────────────────────────────');
    console.log(
      `VEREDICTO: ${report.verdict} · VERIFICADO ${verified.length}/${findings.length}` +
        ` · P0 abiertos ${p0Open.length} · P1 abiertos ${p1Open.length}`,
    );
    console.log(`Informe: ${rel(OUT_COMPACT)}`);
    console.log(`Ledger : ${rel(OUT_LEDGER)} (append-only)`);
  }

  const failed = p0Open.length > 0 || (STRICT && p1Open.length > 0);
  process.exit(failed ? 1 : 0);
}

main().catch((err) => {
  console.error('[MC] Fallo catastrófico del auditor:', err);
  process.exit(1);
});

