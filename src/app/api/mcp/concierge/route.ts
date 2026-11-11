/**
 * ════════════════════════════════════════════════════════════════════════════
 * MCP CONCIERGE · ESTADO DEL FORMULARIO EN TIEMPO REAL (ORDEN 2026-11-11 §3)
 * ════════════════════════════════════════════════════════════════════════════
 * Por qué existe: el asistente decía «no puedo ver las casillas» porque el
 * estado del formulario nunca cruzaba la frontera. Aquí SÍ cruza: el cliente
 * envía su `FormSnapshot` (casillas marcadas, candados y total) y el agente
 * cotiza sobre ESE estado, sin perder el desglose.
 *
 * CONTRATO (JSON-RPC 2.0 sobre HTTP, el que habla MCP):
 *   POST /api/mcp/concierge
 *   { "jsonrpc":"2.0", "id":1, "method":"tools/list" }
 *   { "jsonrpc":"2.0", "id":2, "method":"tools/call",
 *     "params": { "name":"calculate_quote",
 *                 "arguments": { "form": { …FormSnapshot… } } } }
 *
 * HERRAMIENTAS:
 *   · calculate_quote        → cotiza el estado REAL del formulario (céntimos,
 *                              candados, split 80/10/10 y enlace Price-Lock).
 *   · set_selected_services  → marca/desmarca casillas y recalcula.
 *   · list_macro_partidas    → las 5 macro-partidas canónicas con su peso.
 *
 * HONESTIDAD (AF-1):
 *   · Cualquier violación de céntimos o candado viaja declarada en `violations`.
 *   · `createsStripeSession:false`: este endpoint NO cobra.
 *   · Cero llamadas a red: función determinista, sin I/O externa.
 *
 * SEC-1 (default-deny): sólo POST; el resto de verbos responde 405.
 * ════════════════════════════════════════════════════════════════════════════
 */

import { NextResponse } from 'next/server';
import { z } from 'zod';

import { DEPOSITO_STRIPE_EUR, TARIFA_BASE_SOLISTA_EUR } from '@/lib/constants/ear-os-ssot';
import { computeSplit, type SplitBreakdown } from '@/lib/agents/pricing';
import {
  BUDGET_CATEGORIES,
  BUDGET_ENGINE_SSOT,
  isBudgetCategoryId,
  type BudgetCategoryId,
} from '@/lib/budget/budget-allocator-engine';
import {
  aggregateServiceTree,
  centsToEurExact,
  type ServiceNode,
  type ServiceTreeResult,
} from '@/lib/budget/service-tree-engine';
import { selectedServicesCents, type FormSnapshot } from '@/lib/budget/form-bridge';
import { JSON_RPC_ERRORS } from '@/lib/mcp/concierge-tools';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/* ──────────────────────────────────────────────────────────────────────────── */
/* Esquemas Zod estrictos (SEC-4): el cliente no cuela campos                  */
/* ──────────────────────────────────────────────────────────────────────────── */

const formItemSchema = z
  .object({
    id: z.string().min(1).max(120),
    label: z.string().min(1).max(160),
    category: z.string().min(1).max(60),
    unitPriceCents: z.number().int().min(0).max(1_000_000_000),
    quantity: z.number().int().min(1).max(100_000),
    selected: z.boolean(),
    providerId: z.string().max(120).nullable().default(null),
  })
  .strict();

const formSnapshotSchema = z
  .object({
    totalCents: z.number().int().min(0).max(100_000_000_000),
    selectedServices: z.array(formItemSchema).max(500).default([]),
    lockedCategories: z.array(z.string().max(60)).max(10).default([]),
    providerId: z.string().max(120).nullable().default(null),
  })
  .strict();

/** Traduce la instantánea del formulario al árbol del motor (sin inventar). */
export function snapshotToNodes(
  form: FormSnapshot,
  fallback: BudgetCategoryId,
): readonly ServiceNode[] {
  return form.selectedServices.map((item) => ({
    id: item.id,
    category: isBudgetCategoryId(item.category) ? item.category : fallback,
    label: item.label,
    unitPriceCents: item.unitPriceCents,
    quantity: item.quantity,
    providerId: item.providerId,
    providerSlug: item.providerId,
    selected: item.selected,
  }));
}

/** Resultado de la cotización sobre el estado real del formulario. */
export interface FormQuoteResult {
  readonly tree: ServiceTreeResult;
  readonly split: SplitBreakdown;
  readonly splitSumsToTotal: boolean;
  readonly depositoEur: number;
  readonly remainderEur: number;
  readonly totalEur: number;
  readonly priceLockHref: string;
  readonly createsStripeSession: false;
  readonly ssot: {
    readonly tarifaBaseSolistaEur: number;
    readonly depositoEur: number;
    readonly weightTotal: number;
  };
}

/**
 * Cotiza una instantánea del formulario.
 *
 * `totalCents` es el importe tecleado por el usuario; si es 0 se usa la suma de
 * las casillas marcadas (las casillas mueven el total). El reparto NUNCA se
 * inventa: lo hace `aggregateServiceTree` → motor de Zona Cero.
 */
export function quoteForm(form: FormSnapshot): FormQuoteResult {
  const markedCents: number = selectedServicesCents(form);
  const totalCents: number = form.totalCents > 0 ? form.totalCents : markedCents;

  const locked: readonly BudgetCategoryId[] = form.lockedCategories.filter(
    (id: string): id is BudgetCategoryId => isBudgetCategoryId(id),
  );

  const nodes: readonly ServiceNode[] = snapshotToNodes(form, 'musica_produccion');
  const tree: ServiceTreeResult = aggregateServiceTree(nodes, { totalCents, locked });

  const totalEur: number = centsToEurExact(totalCents);
  const split: SplitBreakdown = computeSplit(totalEur);
  const splitCents: number =
    Math.round(split.artista * 100) + Math.round(split.earOs * 100) + Math.round(split.vimume * 100);

  return {
    tree,
    split,
    splitSumsToTotal: splitCents === totalCents,
    depositoEur: DEPOSITO_STRIPE_EUR,
    remainderEur: centsToEurExact(Math.max(0, totalCents - BUDGET_ENGINE_SSOT.depositoStripeCents)),
    totalEur,
    priceLockHref: `/checkout/presupuesto?format=presupuesto&venue=EAR&base=${String(totalEur)}`,
    createsStripeSession: false,
    ssot: {
      tarifaBaseSolistaEur: TARIFA_BASE_SOLISTA_EUR,
      depositoEur: DEPOSITO_STRIPE_EUR,
      weightTotal: 100,
    },
  };
}

/* ──────────────────────────────────────────────────────────────────────────── */
/* Manifiesto de herramientas                                                  */
/* ──────────────────────────────────────────────────────────────────────────── */

export const MCP_CONCIERGE_TOOLS = [
  {
    name: 'calculate_quote',
    description:
      'Cotiza el estado REAL del formulario: macro-partidas con candados, N sub-servicios, split 80/10/10 y enlace Stripe Price-Lock. No cobra.',
    engine: 'src/lib/budget/service-tree-engine.ts#aggregateServiceTree',
    sideEffects: 'none',
  },
  {
    name: 'set_selected_services',
    description:
      'Marca o desmarca casillas del formulario y devuelve la cotización recalculada sin perder el desglose.',
    engine: 'src/lib/budget/service-tree-engine.ts#aggregateServiceTree',
    sideEffects: 'none',
  },
  {
    name: 'list_macro_partidas',
    description: 'Lista las cinco macro-partidas canónicas con su peso sobre 100 (Zona Cero).',
    engine: 'src/lib/budget/budget-allocator-engine.ts#BUDGET_CATEGORIES',
    sideEffects: 'none',
  },
] as const;

export const MCP_CONCIERGE_TOOL_NAMES = [
  'calculate_quote',
  'set_selected_services',
  'list_macro_partidas',
] as const;

export type McpConciergeToolName = (typeof MCP_CONCIERGE_TOOL_NAMES)[number];


const calculateArgsSchema = z.object({ form: formSnapshotSchema }).strict();
const setServicesArgsSchema = z
  .object({
    form: formSnapshotSchema,
    mark: z.array(z.string().min(1).max(120)).max(500).default([]),
    unmark: z.array(z.string().min(1).max(120)).max(500).default([]),
  })
  .strict();

/** Aplica marcas/desmarcas sobre la instantánea (determinista, sin mutar la entrada). */
export function applySelection(
  form: FormSnapshot,
  mark: readonly string[],
  unmark: readonly string[],
): FormSnapshot {
  const markSet: ReadonlySet<string> = new Set<string>(mark);
  const unmarkSet: ReadonlySet<string> = new Set<string>(unmark);
  return {
    ...form,
    selectedServices: form.selectedServices.map((item) => {
      if (unmarkSet.has(item.id)) return { ...item, selected: false };
      if (markSet.has(item.id)) return { ...item, selected: true };
      return item;
    }),
  };
}

/** Vocabulario cerrado de fallos del endpoint. */
interface RpcFailure {
  readonly code: number;
  readonly message: string;
  readonly data?: unknown;
}

/** Envuelve el resultado en el sobre de honestidad de la casa (AF-1). */
function envelope<T>(data: T): {
  readonly mode: 'REAL';
  readonly source: 'live';
  readonly persisted: false;
  readonly checkedAt: string;
  readonly data: T;
} {
  return {
    mode: 'REAL',
    source: 'live',
    persisted: false,
    checkedAt: new Date().toISOString(),
    data,
  };
}

/**
 * Despacha una herramienta. Fail-closed: nombre desconocido, argumentos fuera
 * de esquema o excepción del motor producen un error tipado, nunca silencio.
 */
export async function callConciergeTool(
  name: string,
  args: unknown,
): Promise<{ readonly result?: unknown; readonly error?: RpcFailure }> {
  if (!(MCP_CONCIERGE_TOOL_NAMES as readonly string[]).includes(name)) {
    return {
      error: { code: JSON_RPC_ERRORS.METHOD_NOT_FOUND, message: `Herramienta desconocida: ${name}` },
    };
  }

  try {
    if (name === 'calculate_quote') {
      const parsed = calculateArgsSchema.safeParse(args);
      if (!parsed.success) {
        return {
          error: {
            code: JSON_RPC_ERRORS.INVALID_PARAMS,
            message: 'Argumentos inválidos para calculate_quote.',
            data: parsed.error.issues.map((issue) => ({ path: issue.path.join('.'), message: issue.message })),
          },
        };
      }
      return { result: { tool: name, quote: envelope(quoteForm(parsed.data.form)) } };
    }

    if (name === 'set_selected_services') {
      const parsed = setServicesArgsSchema.safeParse(args);
      if (!parsed.success) {
        return {
          error: {
            code: JSON_RPC_ERRORS.INVALID_PARAMS,
            message: 'Argumentos inválidos para set_selected_services.',
            data: parsed.error.issues.map((issue) => ({ path: issue.path.join('.'), message: issue.message })),
          },
        };
      }
      const next: FormSnapshot = applySelection(parsed.data.form, parsed.data.mark, parsed.data.unmark);
      return {
        result: {
          tool: name,
          form: envelope(next),
          quote: envelope(quoteForm(next)),
        },
      };
    }

    return {
      result: {
        tool: name,
        partidas: envelope(
          BUDGET_CATEGORIES.map((rule) => ({ id: rule.id, label: rule.label, weight: rule.weight })),
        ),
      },
    };
  } catch (error: unknown) {
    const message: string = error instanceof Error ? error.message : 'Fallo interno del motor';
    return { error: { code: JSON_RPC_ERRORS.INTERNAL_ERROR, message, data: { tool: name } } };
  }
}


/* ──────────────────────────────────────────────────────────────────────────── */
/* Transporte HTTP (JSON-RPC 2.0)                                              */
/* ──────────────────────────────────────────────────────────────────────────── */

/** `tools/list`: descriptor + JSON Schema generado del Zod que valida (MCP). */
export function listConciergeTools(): { readonly tools: readonly unknown[] } {
  const schemaOf: Readonly<Record<McpConciergeToolName, z.ZodType>> = {
    calculate_quote: calculateArgsSchema,
    set_selected_services: setServicesArgsSchema,
    list_macro_partidas: z.object({}).strict(),
  };
  return {
    tools: MCP_CONCIERGE_TOOLS.map((tool) => ({
      ...tool,
      inputSchema: z.toJSONSchema(schemaOf[tool.name]),
    })),
  };
}

export async function POST(request: Request): Promise<NextResponse> {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { jsonrpc: '2.0', id: null, error: { code: JSON_RPC_ERRORS.INVALID_REQUEST, message: 'JSON ilegible.' } },
      { status: 400, headers: { 'Cache-Control': 'no-store' } },
    );
  }

  const record: Record<string, unknown> | null =
    payload !== null && typeof payload === 'object' ? (payload as Record<string, unknown>) : null;
  const rawId: unknown = record?.id;
  const id: string | number | null = typeof rawId === 'string' || typeof rawId === 'number' ? rawId : null;

  if (record === null || record.jsonrpc !== '2.0' || typeof record.method !== 'string') {
    return NextResponse.json(
      {
        jsonrpc: '2.0',
        id,
        error: { code: JSON_RPC_ERRORS.INVALID_REQUEST, message: 'Petición JSON-RPC 2.0 inválida.' },
      },
      { status: 400, headers: { 'Cache-Control': 'no-store' } },
    );
  }

  if (record.method === 'tools/list') {
    return NextResponse.json(
      { jsonrpc: '2.0', id, result: listConciergeTools() },
      { headers: { 'Cache-Control': 'no-store' } },
    );
  }

  if (record.method === 'tools/call') {
    const params: Record<string, unknown> | null =
      record.params !== null && typeof record.params === 'object'
        ? (record.params as Record<string, unknown>)
        : null;
    const name: unknown = params?.name;
    if (typeof name !== 'string') {
      return NextResponse.json(
        {
          jsonrpc: '2.0',
          id,
          error: { code: JSON_RPC_ERRORS.INVALID_PARAMS, message: 'tools/call requiere `name` (string).' },
        },
        { status: 400, headers: { 'Cache-Control': 'no-store' } },
      );
    }
    const outcome = await callConciergeTool(name, params?.arguments);
    if (outcome.error !== undefined) {
      return NextResponse.json(
        { jsonrpc: '2.0', id, error: outcome.error },
        { headers: { 'Cache-Control': 'no-store' } },
      );
    }
    return NextResponse.json(
      { jsonrpc: '2.0', id, result: outcome.result },
      { headers: { 'Cache-Control': 'no-store' } },
    );
  }

  return NextResponse.json(
    {
      jsonrpc: '2.0',
      id,
      error: { code: JSON_RPC_ERRORS.METHOD_NOT_FOUND, message: `Método no soportado: ${record.method}` },
    },
    { headers: { 'Cache-Control': 'no-store' } },
  );
}

/** SEC-1 default-deny: el endpoint sólo habla POST. */
export function GET(): NextResponse {
  return NextResponse.json(
    { status: 'error', code: 'METHOD_NOT_ALLOWED' },
    { status: 405, headers: { Allow: 'POST' } },
  );
}

export const PUT = GET;
export const DELETE = GET;
export const PATCH = GET;

