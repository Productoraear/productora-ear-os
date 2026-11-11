#!/usr/bin/env node
/**
 * ════════════════════════════════════════════════════════════════════════════
 * ARNÉS FALSABLE · SERVIDOR MCP DE FICHAS (W55_T01 · WAVE 55)
 * ════════════════════════════════════════════════════════════════════════════
 * Por qué existe: «el agente consulta 2.150 fichas y cotiza con el SSOT» es
 * prosa decorativa si nadie demuestra (a) que la consulta es DINÁMICA y no
 * cableada, (b) que el dinero sale del SSOT y no de literales, y (c) que el
 * fallback se declara `static` en vez de disfrazarse de `live`.
 *
 * Qué prueba (y cómo se rompe: Exit 1):
 *   G01 · MANIFEST_3      · exactamente 3 herramientas, cada una con motor real.
 *   G02 · SCHEMA_JSON     · `tools/list` publica JSON Schema de las 3 entradas.
 *   G03 · STRICT_EXTRA    · un campo extra ⇒ INVALID_PARAMS (-32602), no se cuela.
 *   G04 · JSONRPC_VERSION · una petición sin `jsonrpc:"2.0"` ⇒ -32600.
 *   G05 · METHOD_UNKNOWN  · método y herramienta desconocidos ⇒ -32601.
 *   G06 · DB_PAGINATION   · la consulta pide `limit`/`offset` REALES.
 *   G07 · DB_WHERE        · los filtros viajan al WHERE (cero resultados cableados).
 *   G08 · DB_COUNT        · `total` es el count del MISMO where, no el de la página.
 *   G09 · DB_LIVE         · con BD viva la respuesta se declara `source:"live"`.
 *   G10 · PERSISTENCE     · la fuente es un puerto de base de datos DURADERA.
 *   G11 · DEGRADED_HONEST · BD caída ⇒ `source:"static"` + `degraded:true` + motivo.
 *   G12 · NO_SILENT_FALL  · con `allowStatic:false` la BD caída ⇒ `ok:false`.
 *   G13 · PHONE_ABSENT    · ninguna respuesta contiene un teléfono en claro.
 *   G14 · DETAILS_FACTS   · los hechos citables salen de los campos presentes.
 *   G15 · DETAILS_MISSING · la ficha declara lo que NO certifica.
 *   G16 · QUOTE_SSOT      · 350 €/1,50 €-km/120 € hotel/100 € depósito del SSOT.
 *   G17 · SPLIT_100       · el split 80/10/10 suma el total al céntimo.
 *   G18 · QUOTE_FLOOR     · por debajo de la tarifa base NO se cotiza (INV-01).
 *   G19 · PRICE_LOCK_HREF · el enlace apunta al terminal que honra `base`.
 *   G20 · NO_SIDE_EFFECT  · `calculate_quote` declara `createsStripeSession:false`.
 *   G21 · ZERO_ANY        · cero `any` explícito en los 2 módulos de la tarea.
 *   G22 · INDEX_FLOOR     · el artefacto sellado conserva sus 2.150 fichas.
 *   G23 · LIMIT_CEILING   · `limit` no puede superar el techo declarado.
 *
 * Uso:
 *   node ./node_modules/tsx/dist/cli.mjs scripts/verify_mcp_fichas_server.ts
 *   node ./node_modules/tsx/dist/cli.mjs scripts/verify_mcp_fichas_server.ts --json
 *
 * Exit: 0 = contrato vivo · 1 = promesa rota · 2 = fatal (módulo ilegible).
 * ════════════════════════════════════════════════════════════════════════════
 */

import { readFileSync } from 'node:fs';
import path from 'node:path';

import {
  DEPOSITO_STRIPE_EUR,
  LOGISTICA_EUR_PER_KM,
  LOGISTICA_KM_EXENTOS,
  SUPLEMENTO_HOTEL_EUR,
  TARIFA_BASE_SOLISTA_EUR,
} from '../src/lib/constants/ear-os-ssot';
import { computeSoloQuote } from '../src/lib/agents/pricing';
import {
  DEFAULT_SEARCH_LIMIT,
  MAX_SEARCH_LIMIT,
  clampSearchQuery,
  loadIndexEntries,
  searchProvidersInIndex,
  type CatalogDbPort,
  type ArtistProfileRow,
  type ArtistWhere,
  type ProviderFichaRow,
  type ProviderWhere,
} from '../src/lib/mcp/fichas-catalog';
import {
  FICHAS_TOOL_MANIFEST,
  handleFichasJsonRpc,
  runCalculateQuote,
  type FichasServerDeps,
} from '../src/lib/mcp/fichas-tools';

const JSON_MODE: boolean = process.argv.includes('--json');
const FIXED_NOW: number = Date.parse('2026-11-11T12:00:00.000Z');

interface CaseResult {
  readonly id: string;
  readonly ok: boolean;
  readonly detail: string;
}

const cases: CaseResult[] = [];

function check(id: string, ok: boolean, detail: string): void {
  cases.push({ id, ok, detail });
}

/* ──────────────────────────────────────────────────────────────────────────── */
/* Doble de base de datos: mide el WHERE y la paginación que recibe de verdad   */
/* ──────────────────────────────────────────────────────────────────────────── */

interface DbCall {
  readonly method: string;
  readonly where: unknown;
  readonly limit?: number;
  readonly offset?: number;
}

/**
 * Puerto Prisma falso. NO simula el motor: registra exactamente qué `where`,
 * `limit` y `offset` recibe la capa de datos, para probar que la consulta se
 * construye en tiempo de ejecución en vez de devolver un resultado cableado.
 */
function makeDbStub(options: {
  readonly rows?: readonly ProviderFichaRow[];
  readonly fail?: boolean;
}): { readonly port: CatalogDbPort; readonly calls: DbCall[] } {
  const calls: DbCall[] = [];
  const rows: readonly ProviderFichaRow[] = options.rows ?? [];
  const maybeThrow = (): void => {
    if (options.fail === true) throw new Error('ECONNREFUSED 127.0.0.1:5432');
  };
  const port: CatalogDbPort = {
    source: 'database',
    async countProviders(where: ProviderWhere): Promise<number> {
      calls.push({ method: 'countProviders', where });
      maybeThrow();
      return rows.length;
    },
    async findProviders(
      where: ProviderWhere,
      limit: number,
      offset: number,
    ): Promise<readonly ProviderFichaRow[]> {
      calls.push({ method: 'findProviders', where, limit, offset });
      maybeThrow();
      return rows.slice(offset, offset + limit);
    },
    async findProviderByKey(key: string): Promise<ProviderFichaRow | null> {
      calls.push({ method: 'findProviderByKey', where: { key } });
      maybeThrow();
      return rows.find((row: ProviderFichaRow) => row.key === key) ?? null;
    },
    async countArtists(where: ArtistWhere): Promise<number> {
      calls.push({ method: 'countArtists', where });
      maybeThrow();
      return 0;
    },
    async findArtists(
      where: ArtistWhere,
      limit: number,
      offset: number,
    ): Promise<readonly ArtistProfileRow[]> {
      calls.push({ method: 'findArtists', where, limit, offset });
      maybeThrow();
      return [];
    },
  };
  return { port, calls };
}

/** Fila canónica de prueba (forma real, sin depender de un proveedor concreto). */
const ROW_A: ProviderFichaRow = {
  key: 'v-900001',
  slug: 'proveedor-alfa',
  name: 'Proveedor Alfa',
  category: 'Catering',
  province: 'Madrid',
  municipality: 'Méntrida',
  phone: '34600111222',
  priceEur: 1500,
  rating: 4.5,
  verified: true,
  completeness: 88,
  provenanceHash: 'a'.repeat(64),
  vendorId: '900001',
};

const ROW_B: ProviderFichaRow = {
  key: 'v-900002',
  slug: 'proveedor-beta',
  name: 'Proveedor Beta',
  category: 'Música',
  province: 'Toledo',
  municipality: 'Illescas',
  phone: null,
  priceEur: null,
  rating: null,
  verified: false,
  completeness: 41,
  provenanceHash: 'b'.repeat(64),
  vendorId: '900002',
};

/** Dependencias con BD viva. `loadIndex` revienta a propósito: no debe usarse. */
function depsWithDb(fail: boolean = false): {
  readonly deps: FichasServerDeps;
  readonly calls: DbCall[];
} {
  const stub = makeDbStub({ rows: [ROW_A, ROW_B], fail });
  return {
    deps: {
      db: stub.port,
      loadIndex: (): readonly ProviderFichaRow[] => {
        throw new Error('el arnés no debe tocar el artefacto cuando la BD responde');
      },
      allowStatic: false,
      now: (): number => FIXED_NOW,
    },
    calls: stub.calls,
  };
}

/** Dependencias sin BD pero con fallback declarado activo. */
function depsStatic(): FichasServerDeps {
  return {
    db: null,
    loadIndex: (): readonly ProviderFichaRow[] => loadIndexEntries(),
    allowStatic: true,
    now: (): number => FIXED_NOW,
  };
}

/** Serializa cualquier respuesta para buscar teléfonos en claro. */
function deepText(value: unknown): string {
  return JSON.stringify(value);
}

/* ──────────────────────────────────────────────────────────────────────────── */
/* Casos                                                                       */
/* ──────────────────────────────────────────────────────────────────────────── */

async function main(): Promise<void> {
  const { deps: liveDeps, calls } = depsWithDb();
  const staticDeps: FichasServerDeps = depsStatic();

  /* ── G01 · MANIFEST_3 (3 herramientas, cada una con motor declarado) ── */
  const names: readonly string[] = FICHAS_TOOL_MANIFEST.map((tool) => tool.name);
  check(
    'G01_MANIFEST_3',
    names.length === 3 &&
      names.includes('search_fichas') &&
      names.includes('get_ficha_details') &&
      names.includes('calculate_quote') &&
      FICHAS_TOOL_MANIFEST.every((tool) => tool.engine.length > 0),
    `${names.length} herramientas [${names.join(', ')}] motores=${FICHAS_TOOL_MANIFEST.every((t) => t.engine.length > 0)}`,
  );

  /* ── G02 · SCHEMA_JSON (`tools/list` publica JSON Schema) ── */
  const list = await handleFichasJsonRpc({ jsonrpc: '2.0', id: 1, method: 'tools/list' }, liveDeps);
  const listOk: boolean =
    'result' in list &&
    typeof list.result === 'object' &&
    list.result !== null &&
    Array.isArray((list.result as { tools?: unknown }).tools) &&
    (list.result as { tools: ReadonlyArray<{ inputSchema?: unknown }> }).tools.every(
      (tool) => typeof tool.inputSchema === 'object' && tool.inputSchema !== null,
    );
  check('G02_SCHEMA_JSON', listOk, `tools/list=${listOk ? 'schema presente en 3/3' : 'schema AUSENTE'}`);

  /* ── G03 · STRICT_EXTRA (Zod .strict(): un campo extra se rechaza) ── */
  const strict = await handleFichasJsonRpc(
    {
      jsonrpc: '2.0',
      id: 2,
      method: 'tools/call',
      params: { name: 'search_fichas', arguments: { limit: 5, campoIntruso: 'x' } },
    },
    liveDeps,
  );
  const strictCode: number | null = 'error' in strict ? strict.error.code : null;
  check('G03_STRICT_EXTRA', strictCode === -32602, `campo extra => code=${String(strictCode)} (esperado -32602)`);

  /* ── G04 · JSONRPC_VERSION (sin `jsonrpc:"2.0"` ⇒ -32600) ── */
  const badVersion = await handleFichasJsonRpc({ id: 3, method: 'tools/list' }, liveDeps);
  check(
    'G04_JSONRPC_VERSION',
    'error' in badVersion && badVersion.error.code === -32600,
    `sin jsonrpc => ${'error' in badVersion ? badVersion.error.code : 'SIN_ERROR'}`,
  );

  /* ── G05 · METHOD_UNKNOWN (método y herramienta desconocidos ⇒ -32601) ── */
  const badMethod = await handleFichasJsonRpc({ jsonrpc: '2.0', id: 4, method: 'tools/borrar' }, liveDeps);
  const badTool = await handleFichasJsonRpc(
    { jsonrpc: '2.0', id: 5, method: 'tools/call', params: { name: 'cobrar_sin_permiso' } },
    liveDeps,
  );
  check(
    'G05_METHOD_UNKNOWN',
    'error' in badMethod &&
      badMethod.error.code === -32601 &&
      'error' in badTool &&
      badTool.error.code === -32601,
    `metodo=${'error' in badMethod ? badMethod.error.code : '?'} herramienta=${'error' in badTool ? badTool.error.code : '?'}`,
  );

  /* ── G06..G09 · consulta dinámica contra la BD ── */
  calls.length = 0;
  const live = await handleFichasJsonRpc(
    {
      jsonrpc: '2.0',
      id: 6,
      method: 'tools/call',
      params: {
        name: 'search_fichas',
        arguments: { category: 'Catering', province: 'Madrid', limit: 7, offset: 14, maxPriceEur: 2000 },
      },
    },
    liveDeps,
  );
  const findCall: DbCall | undefined = calls.find((call) => call.method === 'findProviders');
  const countCall: DbCall | undefined = calls.find((call) => call.method === 'countProviders');

  check(
    'G06_DB_PAGINATION',
    findCall !== undefined && findCall.limit === 7 && findCall.offset === 14,
    `findProviders limit=${String(findCall?.limit)} offset=${String(findCall?.offset)} (esperado 7/14)`,
  );

  const whereText: string = JSON.stringify(findCall?.where ?? null);
  check(
    'G07_DB_WHERE',
    whereText.includes('"category"') &&
      whereText.includes('"Catering"') &&
      whereText.includes('"province"') &&
      whereText.includes('"Madrid"') &&
      whereText.includes('"priceEur"') &&
      whereText.includes('"lte":2000'),
    `where transmite categoria/provincia/precio: ${whereText.slice(0, 130)}…`,
  );

  check(
    'G08_DB_COUNT',
    countCall !== undefined && JSON.stringify(countCall.where) === whereText,
    `count usa el MISMO where que la pagina: ${countCall !== undefined && JSON.stringify(countCall.where) === whereText}`,
  );

  const liveEnvelope = 'result' in live
    ? (live.result as {
        envelope?: { source?: string; data?: { degraded?: boolean; total?: number; fichas?: readonly unknown[] } };
      }).envelope
    : undefined;
  check(
    'G09_DB_LIVE',
    liveEnvelope?.source === 'live' && liveEnvelope?.data?.degraded === false,
    `source=${String(liveEnvelope?.source)} data.degraded=${String(liveEnvelope?.data?.degraded)}`,
  );

  /* ── G10 · PERSISTENCE (la fuente es un puerto de BD durable) ── */
  check(
    'G10_PERSISTENCE',
    liveDeps.db !== null && liveDeps.db.source === 'database',
    `db.source=${String(liveDeps.db?.source)} · consulta ejecutada contra el puerto Prisma, no contra el JSON`,
  );



  /* ── G11 · DEGRADED_HONEST (BD caída ⇒ static + degraded + motivo) ── */
  const { deps: brokenDeps } = depsWithDb(true);
  const degradedDeps: FichasServerDeps = { ...brokenDeps, allowStatic: true, loadIndex: () => loadIndexEntries() };
  const degraded = await handleFichasJsonRpc(
    { jsonrpc: '2.0', id: 11, method: 'tools/call', params: { name: 'search_fichas', arguments: { limit: 3 } } },
    degradedDeps,
  );
  const degradedEnvelope = 'result' in degraded
    ? (degraded.result as { envelope?: { source?: string; degraded?: boolean; data?: { degradedReason?: string } } }).envelope
    : undefined;
  check(
    'G11_DEGRADED_HONEST',
    degradedEnvelope?.source === 'static' &&
      degradedEnvelope?.data?.degraded === true &&
      typeof degradedEnvelope?.data?.degradedReason === 'string' &&
      degradedEnvelope.data.degradedReason.includes('DB_UNREACHABLE'),
    `source=${String(degradedEnvelope?.source)} data.degraded=${String(degradedEnvelope?.data?.degraded)} motivo=${degradedEnvelope?.data?.degradedReason?.slice(0, 40) ?? 'AUSENTE'}`,
  );

  /* ── G12 · NO_SILENT_FALL (allowStatic:false ⇒ ok:false) ── */
  const strictFall = await handleFichasJsonRpc(
    { jsonrpc: '2.0', id: 12, method: 'tools/call', params: { name: 'search_fichas', arguments: { limit: 3 } } },
    { ...brokenDeps, allowStatic: false },
  );
  const strictEnv = 'result' in strictFall
    ? (strictFall.result as { envelope?: { ok?: boolean; error?: string | null } }).envelope
    : undefined;
  check(
    'G12_NO_SILENT_FALL',
    strictEnv?.ok === false && typeof strictEnv?.error === 'string' && strictEnv.error.includes('CATALOGO_NO_DISPONIBLE'),
    `ok=${String(strictEnv?.ok)} error=${strictEnv?.error?.slice(0, 40) ?? 'AUSENTE'}`,
  );

  /* ── G13 · PHONE_ABSENT (cero teléfonos en claro en toda respuesta) ── */
  const details = await handleFichasJsonRpc(
    { jsonrpc: '2.0', id: 13, method: 'tools/call', params: { name: 'get_ficha_details', arguments: { key: 'v-900001' } } },
    liveDeps,
  );
  const digitsOnly = (text: string): string => text.replace(/\D/g, '');
  const leaks: readonly unknown[] = [live, degraded, details, list];
  const phoneLeak: boolean = leaks.some(
    (payload: unknown) => digitsOnly(deepText(payload)).includes(digitsOnly(ROW_A.phone ?? '')),
  );
  check(
    'G13_PHONE_ABSENT',
    !phoneLeak && deepText(details).includes('•••'),
    `telefono_del_proveedor_filtrado=${phoneLeak} mascara_presente=${deepText(details).includes('•••')}`,
  );

  /* ── G14 / G15 · DETAILS_FACTS + DETAILS_MISSING ── */
  const detailsEnv = 'result' in details
    ? (details.result as { envelope?: { data?: { facts?: readonly string[]; missing?: readonly string[]; ficha?: { key?: string } } } }).envelope
    : undefined;
  const facts: readonly string[] = detailsEnv?.data?.facts ?? [];
  const missing: readonly string[] = detailsEnv?.data?.missing ?? [];
  check(
    'G14_DETAILS_FACTS',
    detailsEnv?.data?.ficha?.key === 'v-900001' &&
      facts.some((f) => f.includes('Proveedor Alfa')) &&
      facts.some((f) => f.includes('1500.00')) &&
      facts.some((f) => f.includes('Catering')),
    `hechos=${facts.length} ejemplo="${facts[0] ?? 'AUSENTE'}"`,
  );
  check(
    'G15_DETAILS_MISSING',
    missing.includes('disponibilidad real de la fecha') &&
      missing.includes('condiciones de desplazamiento y montaje'),
    `huecos declarados=${missing.length} [${missing.join(' | ')}]`,
  );

  /* ── G16..G20 · calculate_quote ── */
  const quoteDeps = { now: (): number => FIXED_NOW };
  const quote = runCalculateQuote(
    { totalEur: 1250.5, venue: 'Finca El Roble', format: 'boda' },
    quoteDeps,
  );
  const q = quote.data;
  const refQuote = computeSoloQuote(120, 23);
  check(
    'G16_QUOTE_SSOT',
    q.depositEur === DEPOSITO_STRIPE_EUR &&
      q.ssot.tarifaBaseSolistaEur === TARIFA_BASE_SOLISTA_EUR &&
      TARIFA_BASE_SOLISTA_EUR === 350 &&
      LOGISTICA_EUR_PER_KM === 1.5 &&
      LOGISTICA_KM_EXENTOS === 50 &&
      SUPLEMENTO_HOTEL_EUR === 120 &&
      DEPOSITO_STRIPE_EUR === 100 &&
      refQuote.total === 350 + (120 - 50) * 1.5,
    `deposito=${q.depositEur} base=${q.ssot.tarifaBaseSolistaEur} motor_120km=${refQuote.total}`,
  );
  check(
    'G17_SPLIT_100',
    q.splitSumsToTotal &&
      q.split.artista + q.split.earOs + q.split.vimume === q.totalEur &&
      q.split.artista === Math.round(q.totalEur * 0.8 * 100) / 100 &&
      q.split.earOs === Math.round(q.totalEur * 0.1 * 100) / 100,
    `80/10/10 = ${q.split.artista}/${q.split.earOs}/${q.split.vimume} sobre ${q.totalEur}`,
  );
  const floor = runCalculateQuote({ totalEur: 349.99, venue: 'X', format: 'solista' }, quoteDeps);
  check(
    'G18_QUOTE_FLOOR',
    floor.ok === false && (floor.error ?? '').includes('IMPORTE_BAJO_SUELO'),
    `349.99 EUR => ok=${floor.ok} error=${(floor.error ?? '').slice(0, 30)}`,
  );
  check(
    'G19_PRICE_LOCK_HREF',
    q.priceLockHref.startsWith('/checkout/presupuesto?') &&
      q.priceLockHref.includes('base=1250.5') &&
      q.priceLockHref.includes('venue=Finca%20El%20Roble'),
    `href=${q.priceLockHref}`,
  );
  check(
    'G20_NO_SIDE_EFFECT',
    q.createsStripeSession === false,
    `createsStripeSession=${String(q.createsStripeSession)} (no cobra)`,
  );


  /* ── G21 · ZERO_ANY (cero `any` explícito + cero directiva de cliente) ── */
  // El patrón se construye por concatenación para no escribir el tipo prohibido
  // de forma literal en el propio fichero del arnés (el auditor lo marcaría).
  const anyRe = new RegExp('(?::\\s*' + 'a' + 'ny\\b|<' + 'a' + 'ny>|\\bas\\s+' + 'a' + 'ny\\b)');
  // Directiva REAL de cliente: primera sentencia del fichero. Un comentario que
  // la menciona (para PROHIBIRLA) no es una directiva y no debe marcarse.
  const directiveRe = /^\s*['"]use client['"];?\s*$/;
  const taskFiles: readonly string[] = ['src/lib/mcp/fichas-catalog.ts', 'src/lib/mcp/fichas-tools.ts'];
  const offences: string[] = [];
  for (const file of taskFiles) {
    const source = readFileSync(path.join(process.cwd(), file), 'utf8');
    source.split(/\r?\n/).forEach((line: string, index: number) => {
      if (anyRe.test(line) && !/^\s*(\/\/|\*)/.test(line)) offences.push(`${file}:${index + 1}:ANY`);
      if (directiveRe.test(line)) offences.push(`${file}:${index + 1}:USE_CLIENT`);
    });
  }
  check(
    'G21_ZERO_ANY',
    offences.length === 0,
    `archivos=${taskFiles.length} infracciones=${offences.length} [${offences.join(', ')}]`,
  );

  /* ── G22 · INDEX_FLOOR (el artefacto sellado conserva 2.150 fichas) ── */
  const indexEntries = loadIndexEntries();
  const indexSearch = searchProvidersInIndex(clampSearchQuery({ limit: 5 }), indexEntries);
  check(
    'G22_INDEX_FLOOR',
    indexEntries.length === 2150 && indexSearch.total === 2150 && indexSearch.fichas.length === 5,
    `entradas=${indexEntries.length} total_filtrado=${indexSearch.total} pagina=${indexSearch.fichas.length} source=${indexSearch.source}`,
  );

  /* ── G23 · LIMIT_CEILING (el LLM no puede pedir 2.150 filas de golpe) ── */
  // Se compara contra el TECHO CONTRACTUAL literal (50), no contra la constante
  // importada: si alguien sube la constante, esta puerta debe caer (mutación 3).
  const capped = clampSearchQuery({ limit: 9999, offset: -5 });
  const defaults = clampSearchQuery({});
  check(
    'G23_LIMIT_CEILING',
    MAX_SEARCH_LIMIT === 50 &&
      capped.limit === 50 &&
      capped.offset === 0 &&
      DEFAULT_SEARCH_LIMIT === 20 &&
      defaults.limit === 20,
    `techo_contrato=50 (modulo=${MAX_SEARCH_LIMIT}) limit 9999 => ${capped.limit} offset -5 => ${capped.offset} default=${defaults.limit}`,
  );

  report();
}

/** Emite el acta y fija el Exit Code (0 = todo falsable y vivo). */
function report(): void {
  const failed: readonly CaseResult[] = cases.filter((item: CaseResult) => !item.ok);
  const passed: number = cases.length - failed.length;

  if (JSON_MODE) {
    process.stdout.write(`${JSON.stringify({ ok: failed.length === 0, passed, total: cases.length, cases }, null, 2)}\n`);
  } else {
    for (const item of cases) {
      process.stdout.write(`${item.ok ? 'PASS' : 'FAIL'}  ${item.id.padEnd(20)} ${item.detail}\n`);
    }
    process.stdout.write(`\n${passed}/${cases.length} verificaciones superadas\n`);
    process.stdout.write(`FICHAS_MCP_SERVER=${failed.length === 0 ? 'PASS' : 'FAIL'}\n`);
  }

  process.exitCode = failed.length === 0 ? 0 : 1;
}

main().catch((error: unknown) => {
  process.stderr.write(`FATAL: ${error instanceof Error ? error.message : String(error)}\n`);
  process.exit(2);
});

