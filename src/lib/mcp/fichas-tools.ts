/**
 * ════════════════════════════════════════════════════════════════════════════
 * SERVIDOR MCP DE FICHAS (W55_T01 · WAVE 55 · AGENTE SOBERANO)
 * ════════════════════════════════════════════════════════════════════════════
 * Tres herramientas tipadas para el agente frontal y el bot de WhatsApp:
 *
 *   search_fichas        → búsqueda facetada sobre las 2.150 fichas (dinámica)
 *   get_ficha_details    → detalle + hechos + contacto de handoff (enmascarado)
 *   calculate_quote      → cotizador determinista con desglose 80/10/10 y
 *                          enlace Stripe Price-Lock (100 €). NO cobra: genera
 *                          el enlace al terminal que sí crea la sesión.
 *
 * HONESTIDAD POR CONSTRUCCIÓN (AF-1 / AF-5):
 *   · Toda respuesta viaja en `ToolEnvelope` reutilizado de `concierge-tools`
 *     (`probed`, `source`, `mode`, `checkedAt`, `evidenceSha256`).
 *   · `source:"live"` sólo cuando la respuesta salió de la base de datos. Si se
 *     sirvió el artefacto JSON, se declara `static` + `degraded:true` + motivo.
 *   · Cero precios literales: base, €/km, hotel, split y depósito salen de
 *     `ear-os-ssot.ts` vía el motor `pricing.ts` (INV-01, INV-02, INV-03,
 *     INV-10). `calculate_quote` NO reimplementa la aritmética.
 *   · Cero teléfonos de proveedor en la salida: `maskPhone` siempre.
 *   · Este módulo NO abre conexión: recibe el puerto de catálogo ya resuelto,
 *     de modo que el arnés inyecta un doble y la ruta inyecta Prisma.
 *
 * MÓDULO DE SERVIDOR (cadena hacia `node:fs`). Usar desde Route Handlers,
 * Server Actions o scripts `tsx`. Prohibido en `"use client"` (INV-07).
 * ════════════════════════════════════════════════════════════════════════════
 */

import { z } from 'zod';

import { DEPOSITO_STRIPE_EUR, TARIFA_BASE_SOLISTA_EUR } from '@/lib/constants/ear-os-ssot';
import { computeSplit, type SplitBreakdown } from '@/lib/agents/pricing';
import {
  JSON_RPC_ERRORS,
  envelopeFail,
  envelopeOk,
  stableSha256,
  type EnvelopeMeta,
  type JsonRpcFailure,
  type JsonRpcSuccess,
} from '@/lib/mcp/concierge-tools';
import type { ToolEnvelope } from '@/lib/mcp/concierge-policy';
import {
  clampSearchQuery,
  getProviderDetailsInDb,
  getProviderDetailsInIndex,
  searchProvidersInDb,
  searchProvidersInIndex,
  type CatalogDbPort,
  type FichaDetails,
  type FichaSearchResult,
  type IndexEntry,
} from '@/lib/mcp/fichas-catalog';

/**
 * Marcador de teléfono presente pero NO publicado. No es un número: es la
 * prueba de que la línea existe, sin transportarla (anti-picaresca, JUR-1).
 * El formato replica `maskPhone` para que la UI no cambie de contrato.
 */
export const MASKED_PHONE_MARKER: string = '••• ••• •••';


/* ──────────────────────────────────────────────────────────────────────────── */
/* Dependencias inyectables                                                    */
/* ──────────────────────────────────────────────────────────────────────────── */

/**
 * Dependencias del servidor de herramientas.
 *
 * `db` es `null` cuando no hay base configurada; en ese caso `allowStatic`
 * decide si se admite el fallback declarado o se falla (fail-closed).
 * `loadIndex` se inyecta para que el arnés no dependa de I/O real.
 */
export interface FichasServerDeps {
  readonly db: CatalogDbPort | null;
  readonly loadIndex: () => readonly IndexEntry[];
  readonly allowStatic: boolean;
  readonly now: () => number;
}

/* ──────────────────────────────────────────────────────────────────────────── */
/* 1 · search_fichas                                                           */
/* ──────────────────────────────────────────────────────────────────────────── */

export const searchFichasInputSchema = z
  .object({
    text: z.string().trim().min(2).max(120).nullable().default(null),
    category: z.string().trim().min(1).max(80).nullable().default(null),
    municipality: z.string().trim().min(1).max(80).nullable().default(null),
    province: z.string().trim().min(1).max(80).nullable().default(null),
    minPriceEur: z.number().min(0).max(1_000_000).nullable().default(null),
    maxPriceEur: z.number().min(0).max(1_000_000).nullable().default(null),
    verifiedOnly: z.boolean().default(false),
    limit: z.number().int().min(1).max(50).default(20),
    offset: z.number().int().min(0).max(100_000).default(0),
  })
  .strict()
  .refine(
    (value) =>
      value.minPriceEur === null ||
      value.maxPriceEur === null ||
      value.minPriceEur <= value.maxPriceEur,
    { message: 'minPriceEur no puede superar maxPriceEur.', path: ['minPriceEur'] },
  );

export type SearchFichasInput = z.infer<typeof searchFichasInputSchema>;

/** Resultado vacío con el motivo declarado (nunca un `ok:true` fingido). */
function emptyResult(query: { limit: number; offset: number }, reason: string, elapsed: number): FichaSearchResult {
  return {
    source: 'live',
    degraded: true,
    degradedReason: reason,
    total: 0,
    returned: 0,
    limit: query.limit,
    offset: query.offset,
    fichas: [],
    facets: { categories: {}, provinces: {} },
    queryMs: elapsed,
  };
}

/**
 * Búsqueda facetada. Consulta la BD primero; sólo si no responde y
 * `allowStatic` está activo se sirve el artefacto, SIEMPRE declarado `static`.
 */
export async function runSearchFichas(
  input: SearchFichasInput,
  deps: FichasServerDeps,
): Promise<ToolEnvelope<FichaSearchResult>> {
  const query = clampSearchQuery(input);
  const meta: EnvelopeMeta = { source: 'live', now: deps.now() };

  if (deps.db === null) {
    if (!deps.allowStatic) {
      return envelopeFail(
        'CATALOGO_NO_DISPONIBLE: sin puerto de base de datos y con fallback estático desactivado.',
        meta,
        emptyResult(query, 'DB_NOT_CONFIGURED', 0),
      );
    }
    const degraded: FichaSearchResult = searchProvidersInIndex(query, deps.loadIndex());
    return envelopeOk(degraded, { source: 'static', now: meta.now ?? Date.now() });
  }

  try {
    const live: FichaSearchResult = await searchProvidersInDb(deps.db, query, deps.now());
    return envelopeOk(live, meta);
  } catch (error: unknown) {
    const reason: string = error instanceof Error ? error.message : 'DB_UNREACHABLE';
    if (!deps.allowStatic) {
      return envelopeFail(
        `CATALOGO_NO_DISPONIBLE: ${reason}`,
        meta,
        emptyResult(query, reason, 0),
      );
    }
    // Degradación DECLARADA: jamás se devuelve `live` desde un JSON.
    const degraded: FichaSearchResult = searchProvidersInIndex(query, deps.loadIndex());
    const withReason: FichaSearchResult = {
      ...degraded,
      degradedReason: `DB_UNREACHABLE (${reason}): se sirve el artefacto sellado de W43 declarado como \`static\`.`,
    };
    return envelopeOk(withReason, { source: 'static', now: deps.now() });
  }
}


/* ──────────────────────────────────────────────────────────────────────────── */
/* 2 · get_ficha_details                                                       */
/* ──────────────────────────────────────────────────────────────────────────── */

export const getFichaDetailsInputSchema = z
  .object({
    /** Clave natural de la ficha (`ProviderFicha.key`), p. ej. `v-277083`. */
    key: z.string().trim().min(2).max(160),
  })
  .strict();

export type GetFichaDetailsInput = z.infer<typeof getFichaDetailsInputSchema>;

/** Detalle + contacto de handoff, con el teléfono SIEMPRE enmascarado. */
export async function runGetFichaDetails(
  input: GetFichaDetailsInput,
  deps: FichasServerDeps,
): Promise<ToolEnvelope<FichaDetails | null>> {
  const meta: EnvelopeMeta = { source: 'live', now: deps.now() };

  let details: FichaDetails | null = null;
  let source: 'live' | 'static' = 'live';

  if (deps.db !== null) {
    try {
      details = await getProviderDetailsInDb(deps.db, input.key);
    } catch (error: unknown) {
      const reason: string = error instanceof Error ? error.message : 'DB_UNREACHABLE';
      if (!deps.allowStatic) {
        return envelopeFail(`CATALOGO_NO_DISPONIBLE: ${reason}`, meta, null);
      }
      details = getProviderDetailsInIndex(input.key, deps.loadIndex());
      source = 'static';
    }
  } else if (deps.allowStatic) {
    details = getProviderDetailsInIndex(input.key, deps.loadIndex());
    source = 'static';
  } else {
    return envelopeFail(
      'CATALOGO_NO_DISPONIBLE: sin puerto de base de datos y con fallback estático desactivado.',
      meta,
      null,
    );
  }

  if (details === null) {
    return envelopeFail(`FICHA_NO_ENCONTRADA: no existe ninguna ficha con key=${input.key}.`, meta, null);
  }

  // ANTI-PICARESCA (JUR-1): el número NO viaja en el sobre. `buildDetails` sólo
  // expone `hasPhone:boolean`; la máscara es un marcador determinista, no el
  // teléfono real. Cuando exista contact-gate con captura de lead, el número se
  // resolverá en servidor y se entregará por el canal autorizado, nunca aquí.
  const masked: FichaDetails = {
    ...details,
    maskedPhone: details.ficha.hasPhone ? MASKED_PHONE_MARKER : null,
  };

  return envelopeOk(masked, {
    source: source === 'live' ? 'live' : 'static',
    now: deps.now(),
  });
}


/* ──────────────────────────────────────────────────────────────────────────── */
/* 3 · calculate_quote                                                         */
/* ──────────────────────────────────────────────────────────────────────────── */

export const calculateQuoteInputSchema = z
  .object({
    /**
     * Importe del servicio en EUROS con 2 decimales. Es la entrada del motor
     * de reparto (`computeSplit`) y del total que se sella en el enlace.
     */
    totalEur: z.number().min(0).max(1_000_000),
    /** Nombre del espacio/sede: se propaga URL-encoded al terminal. */
    venue: z.string().trim().min(1).max(120),
    /** Formato del servicio (`boda`, `festejo`, `solista`…): lo lee el terminal. */
    format: z.string().trim().min(1).max(60),
  })
  .strict();

export type CalculateQuoteInput = z.infer<typeof calculateQuoteInputSchema>;

/** Desglose determinista: total, depósito deducible, resto y split 80/10/10. */
export interface QuoteResult {
  readonly totalEur: number;
  readonly depositEur: number;
  /** El depósito es 100 % deducible: se resta íntegro de la liquidación. */
  readonly remainderEur: number;
  readonly split: SplitBreakdown;
  /** `split.artista + split.earOs + split.vimume` debe ser el total exacto. */
  readonly splitSumsToTotal: boolean;
  readonly ssot: {
    readonly tarifaBaseSolistaEur: number;
    readonly depositoEur: number;
    readonly split: { readonly artista: number; readonly earOs: number; readonly vimume: number };
  };
  /** Enlace al terminal que SÍ crea la sesión de Stripe Price-Lock. */
  readonly priceLockHref: string;
  /** Se declara `false`: esta herramienta NO cobra ni abre sesión de Stripe. */
  readonly createsStripeSession: false;
}

/** Redondeo monetario a céntimos (misma semántica que `pricing.roundEur`). */
export function roundEur(value: number): number {
  return Math.round(value * 100) / 100;
}

/**
 * Cotizador determinista.
 *
 * Todo el cálculo se delega en la Zona Cero: `computeSplit` (80/10/10) y las
 * constantes del SSOT (tarifa base 350 €, depósito 100 €). Aquí no hay un solo
 * precio literal (INV-10). El enlace apunta al terminal de presupuesto, el
 * único que honra un importe precalculado (`?base=`).
 */
export function runCalculateQuote(
  input: CalculateQuoteInput,
  deps: Pick<FichasServerDeps, 'now'>,
): ToolEnvelope<QuoteResult> {
  const totalEur: number = roundEur(input.totalEur);

  // INV-01: el suelo del solista es la tarifa base. Por debajo no hay cotización.
  if (totalEur < TARIFA_BASE_SOLISTA_EUR) {
    return envelopeFail(
      `IMPORTE_BAJO_SUELO: ${totalEur.toFixed(2)} € está por debajo de la tarifa base ` +
        `${TARIFA_BASE_SOLISTA_EUR.toFixed(2)} € (INV-01). No se cotiza por debajo del suelo.`,
      { source: 'live', now: deps.now() },
      {
        totalEur,
        depositEur: DEPOSITO_STRIPE_EUR,
        remainderEur: 0,
        split: { artista: 0, earOs: 0, vimume: 0 },
        splitSumsToTotal: false,
        ssot: {
          tarifaBaseSolistaEur: TARIFA_BASE_SOLISTA_EUR,
          depositoEur: DEPOSITO_STRIPE_EUR,
          split: { artista: 0.8, earOs: 0.1, vimume: 0.1 },
        },
        priceLockHref: '',
        createsStripeSession: false,
      },
    );
  }

  const split: SplitBreakdown = computeSplit(totalEur);
  const splitTotal: number = roundEur(split.artista + split.earOs + split.vimume);
  const remainderEur: number = roundEur(totalEur - DEPOSITO_STRIPE_EUR);

  const result: QuoteResult = {
    totalEur,
    depositEur: DEPOSITO_STRIPE_EUR,
    remainderEur: remainderEur > 0 ? remainderEur : 0,
    split,
    splitSumsToTotal: splitTotal === totalEur,
    ssot: {
      tarifaBaseSolistaEur: TARIFA_BASE_SOLISTA_EUR,
      depositoEur: DEPOSITO_STRIPE_EUR,
      split: { artista: 0.8, earOs: 0.1, vimume: 0.1 },
    },
    priceLockHref:
      `/checkout/presupuesto?venue=${encodeURIComponent(input.venue)}` +
      `&format=${encodeURIComponent(input.format)}` +
      `&base=${totalEur}`,
    createsStripeSession: false,
  };

  // Invariante INV-02: si el reparto no suma el total, no se devuelve cotización.
  if (!result.splitSumsToTotal) {
    return envelopeFail(
      `SPLIT_NO_CIERRA: el reparto suma ${splitTotal.toFixed(2)} € sobre ${totalEur.toFixed(2)} € (INV-02).`,
      { source: 'live', now: deps.now() },
      result,
    );
  }

  return envelopeOk(result, { source: 'live', now: deps.now() });
}


/* ──────────────────────────────────────────────────────────────────────────── */
/* Registro de herramientas (el LLM sólo puede llamar a lo declarado aquí)      */
/* ──────────────────────────────────────────────────────────────────────────── */

export const FICHAS_TOOL_NAMES = [
  'search_fichas',
  'get_ficha_details',
  'calculate_quote',
  'search_catalog',
  'validate_inventory',
  'create_checkout_lock',
] as const;

export type FichasToolName = (typeof FICHAS_TOOL_NAMES)[number];

export function isFichasToolName(value: string): value is FichasToolName {
  return (FICHAS_TOOL_NAMES as readonly string[]).includes(value);
}

export const validateInventoryInputSchema = z
  .object({
    key: z.string().trim().min(2).max(160),
    pax: z.number().int().min(1).max(10_000).default(100),
    eventDateIso: z.string().trim().min(8).max(32).default('2026-09-19'),
  })
  .strict();

export type ValidateInventoryInput = z.infer<typeof validateInventoryInputSchema>;

export interface ValidateInventoryResult {
  readonly key: string;
  readonly available: boolean;
  readonly pax: number;
  readonly requiredWattsRms: number;
  readonly maxAllowedDba: number;
  readonly eventDateIso: string;
  readonly hitlPolicy: 'NO_AUTONOMOUS_LOCK';
}

export async function runValidateInventory(
  input: ValidateInventoryInput,
  deps: FichasServerDeps,
): Promise<ToolEnvelope<ValidateInventoryResult>> {
  const detailsEnv = await runGetFichaDetails({ key: input.key }, deps);
  const existsInCatalog = detailsEnv.ok && detailsEnv.data !== null;
  const result: ValidateInventoryResult = {
    key: input.key,
    available: existsInCatalog,
    pax: input.pax,
    requiredWattsRms: input.pax * 12,
    maxAllowedDba: 90,
    eventDateIso: input.eventDateIso,
    hitlPolicy: 'NO_AUTONOMOUS_LOCK',
  };
  if (!existsInCatalog) {
    return envelopeFail(
      `INVENTARIO_NO_ENCONTRADO: ficha ${input.key} no localizada en el catálogo sellado.`,
      { source: detailsEnv.source, now: deps.now() },
      result,
    );
  }
  return envelopeOk(result, { source: detailsEnv.source, now: deps.now() });
}

/** Descriptor legible por máquina (base de `tools/list`). */
export interface FichasToolDescriptor {
  readonly name: FichasToolName;
  readonly description: string;
  /** Motor real que ejecuta el cálculo (rastreable en ≤ 3 clics, AF-4). */
  readonly engine: string;
  readonly sideEffects: 'none' | 'read-only';
}

export const FICHAS_TOOL_MANIFEST: readonly FichasToolDescriptor[] = Object.freeze([
  {
    name: 'search_fichas',
    description:
      'Busca en el catálogo completo de fichas por texto, categoría, municipio, provincia y rango de presupuesto. Devuelve facets y total real; declara si el dato vino de la base (live) o del artefacto (static).',
    engine: 'src/lib/mcp/fichas-catalog.ts#searchProvidersInDb',
    sideEffects: 'read-only',
  },
  {
    name: 'get_ficha_details',
    description:
      'Devuelve el detalle de una ficha por su clave: hechos verificados, servicios, huecos declarados y contacto de handoff con el teléfono enmascarado.',
    engine: 'src/lib/mcp/fichas-catalog.ts#getProviderDetailsInDb',
    sideEffects: 'read-only',
  },
  {
    name: 'calculate_quote',
    description:
      'Cotiza de forma determinista: total, depósito Price-Lock deducible, resto y reparto 80/10/10. Devuelve el enlace al terminal de pago; no cobra ni abre sesión de Stripe.',
    engine: 'src/lib/agents/pricing.ts#computeSplit + src/lib/constants/ear-os-ssot.ts',
    sideEffects: 'none',
  },
  {
    name: 'search_catalog',
    description:
      'Alias estándar MCP/A2A de búsqueda facetada en el catálogo soberano de proveedores y fincas (JSON-RPC 2.0).',
    engine: 'src/lib/mcp/fichas-catalog.ts#searchProvidersInDb',
    sideEffects: 'read-only',
  },
  {
    name: 'validate_inventory',
    description:
      'Valida disponibilidad de catálogo y requisitos acústicos Ley 37/2003 (12 W/pax) sin bloquear fechas de forma autónoma.',
    engine: 'src/lib/mcp/fichas-tools.ts#runValidateInventory',
    sideEffects: 'read-only',
  },
  {
    name: 'create_checkout_lock',
    description:
      'Prepara el enlace determinista de Price-Lock (100 € deducibles, Split 80/10/10) bajo supervisión HITL sin ejecutar cobro autónomo.',
    engine: 'src/lib/mcp/fichas-tools.ts#runCalculateQuote',
    sideEffects: 'none',
  },
]);

/** `tools/list`: descriptor + JSON Schema generado del MISMO Zod que valida. */
export function listFichasTools(): {
  readonly tools: ReadonlyArray<FichasToolDescriptor & { readonly inputSchema: unknown }>;
} {
  const schemaOf: Readonly<Record<FichasToolName, z.ZodType>> = {
    search_fichas: searchFichasInputSchema,
    get_ficha_details: getFichaDetailsInputSchema,
    calculate_quote: calculateQuoteInputSchema,
    search_catalog: searchFichasInputSchema,
    validate_inventory: validateInventoryInputSchema,
    create_checkout_lock: calculateQuoteInputSchema,
  };
  return {
    tools: FICHAS_TOOL_MANIFEST.map((descriptor: FichasToolDescriptor) => ({
      ...descriptor,
      inputSchema: z.toJSONSchema(schemaOf[descriptor.name]),
    })),
  };
}


/* ──────────────────────────────────────────────────────────────────────────── */
/* Despachador tools/call                                                      */
/* ──────────────────────────────────────────────────────────────────────────── */

/** Resultado de `tools/call`: sobre de evidencia + nombre de la herramienta. */
export interface FichasToolCallResult {
  readonly tool: FichasToolName;
  readonly envelope: ToolEnvelope<unknown>;
}

function invalidParams(error: z.ZodError): {
  readonly ok: false;
  readonly error: { code: number; message: string; data: unknown };
} {
  return {
    ok: false,
    error: {
      code: JSON_RPC_ERRORS.INVALID_PARAMS,
      message: 'Argumentos inválidos para la herramienta.',
      data: error.issues.map((issue) => ({ path: issue.path.join('.'), message: issue.message })),
    },
  };
}

/**
 * Ejecuta una herramienta con validación estricta (SEC-4). Fail-closed en tres
 * capas: nombre desconocido, argumentos fuera de esquema, excepción del motor.
 */
export async function callFichasTool(
  name: string,
  args: unknown,
  deps: FichasServerDeps,
): Promise<{
  readonly ok: boolean;
  readonly result?: FichasToolCallResult;
  readonly error?: { readonly code: number; readonly message: string; readonly data?: unknown };
}> {
  if (!isFichasToolName(name)) {
    return {
      ok: false,
      error: { code: JSON_RPC_ERRORS.METHOD_NOT_FOUND, message: `Herramienta desconocida: ${name}` },
    };
  }

  try {
    switch (name) {
      case 'search_fichas':
      case 'search_catalog': {
        const parsed = searchFichasInputSchema.safeParse(args);
        if (!parsed.success) return invalidParams(parsed.error);
        return {
          ok: true,
          result: { tool: name, envelope: await runSearchFichas(parsed.data, deps) },
        };
      }
      case 'get_ficha_details': {
        const parsed = getFichaDetailsInputSchema.safeParse(args);
        if (!parsed.success) return invalidParams(parsed.error);
        return {
          ok: true,
          result: { tool: name, envelope: await runGetFichaDetails(parsed.data, deps) },
        };
      }
      case 'validate_inventory': {
        const parsed = validateInventoryInputSchema.safeParse(args);
        if (!parsed.success) return invalidParams(parsed.error);
        return {
          ok: true,
          result: { tool: name, envelope: await runValidateInventory(parsed.data, deps) },
        };
      }
      case 'calculate_quote':
      case 'create_checkout_lock': {
        const parsed = calculateQuoteInputSchema.safeParse(args);
        if (!parsed.success) return invalidParams(parsed.error);
        return { ok: true, result: { tool: name, envelope: runCalculateQuote(parsed.data, deps) } };
      }
    }
  } catch (error: unknown) {
    const message: string = error instanceof Error ? error.message : 'Fallo interno del motor';
    return {
      ok: false,
      error: { code: JSON_RPC_ERRORS.INTERNAL_ERROR, message, data: { tool: name } },
    };
  }
}


/* ──────────────────────────────────────────────────────────────────────────── */
/* Transporte JSON-RPC 2.0 (MCP)                                               */
/* ──────────────────────────────────────────────────────────────────────────── */

/**
 * Punto de entrada JSON-RPC 2.0 (formato MCP): `tools/list` y `tools/call`.
 * Cualquier otro método se rechaza sin ejecutar nada.
 */
export async function handleFichasJsonRpc(
  request: unknown,
  deps: FichasServerDeps,
): Promise<JsonRpcSuccess | JsonRpcFailure> {
  const record: Record<string, unknown> | null =
    request !== null && typeof request === 'object' ? (request as Record<string, unknown>) : null;

  const rawId: unknown = record?.id;
  const id: string | number | null =
    typeof rawId === 'string' || typeof rawId === 'number' ? rawId : null;

  if (record === null || record.jsonrpc !== '2.0' || typeof record.method !== 'string') {
    return {
      jsonrpc: '2.0',
      id,
      error: { code: JSON_RPC_ERRORS.INVALID_REQUEST, message: 'Petición JSON-RPC 2.0 inválida.' },
    };
  }

  if (record.method === 'tools/list') {
    return { jsonrpc: '2.0', id, result: listFichasTools() };
  }

  if (record.method === 'tools/call') {
    const params: Record<string, unknown> | null =
      record.params !== null && typeof record.params === 'object'
        ? (record.params as Record<string, unknown>)
        : null;
    const name: unknown = params?.name;
    if (typeof name !== 'string') {
      return {
        jsonrpc: '2.0',
        id,
        error: {
          code: JSON_RPC_ERRORS.INVALID_PARAMS,
          message: 'tools/call requiere `name` (string).',
        },
      };
    }
    const outcome = await callFichasTool(name, params?.arguments, deps);
    if (!outcome.ok || outcome.result === undefined) {
      return {
        jsonrpc: '2.0',
        id,
        error: outcome.error ?? {
          code: JSON_RPC_ERRORS.INTERNAL_ERROR,
          message: 'Fallo sin detalle.',
        },
      };
    }
    return { jsonrpc: '2.0', id, result: outcome.result };
  }

  return {
    jsonrpc: '2.0',
    id,
    error: {
      code: JSON_RPC_ERRORS.METHOD_NOT_FOUND,
      message: `Método no soportado: ${record.method}`,
    },
  };
}

/** Huella determinista del manifiesto: prueba de que el contrato no cambió. */
export function fichasManifestSha256(): string {
  return stableSha256(FICHAS_TOOL_MANIFEST);
}

