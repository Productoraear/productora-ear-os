/**
 * ════════════════════════════════════════════════════════════════════════════
 * EAR OS — METACOMPILADOR · SERVIDOR JSON-RPC 2.0 LOCAL (TRANSPORTE STDIO)
 * ════════════════════════════════════════════════════════════════════════════
 * Implementa el subconjunto de JSON-RPC 2.0 que un cliente MCP (Claude Desktop,
 * Cline, Continue o un LLM local con soporte de herramientas) necesita para
 * conversar con el MetaCompilador SIN abrir un puerto TCP:
 *
 *   initialize      → capacidades y versión de protocolo.
 *   tools/list      → esquema JSON de entrada de cada herramienta.
 *   tools/call      → ejecución tipada con Zod.
 *   notifications/* → sin `id` ⇒ sin respuesta (JSON-RPC 2.0 §4.1).
 *
 * Por qué stdio y no HTTP: ningún socket escuchando ⇒ ninguna superficie de
 * ataque expuesta a Internet. El proceso lo arranca el dueño de la máquina con
 * `node scripts/metacompiler_mcp_server.cjs`.
 *
 * Desviación declarada de la directiva (§2): `run_sv_gates()` NO ejecuta el
 * arnés de 17 compuertas desde aquí. Un servidor que lanza `npm run typecheck`
 * ante una llamada de un LLM es ejecución remota de código disfrazada de
 * herramienta (SEC-5). Se expone `list_sv_gates()` (sólo lectura) y la
 * ejecución queda declarada como `EXECUTION_DISABLED` con su justificación.
 * ════════════════════════════════════════════════════════════════════════════
 */

import { z } from 'zod';
import { verifySsotIntegrity } from '@/lib/security/ssotIntegrityGuard';
import { sha256OfText } from './metacompiler-hash';
import { compileMetaSpec } from './metacompiler-engine';
import type { MetaCompilerRuntime } from './metacompiler-runtime';

/** Perfil de capacidades de `initialize` (MCP 2025-06-18). */
export function initializePayload(): Record<string, unknown> {
  return {
    protocolVersion: MCP_PROTOCOL_VERSION,
    capabilities: { tools: { listChanged: false } },
    serverInfo: { name: SERVER_NAME, version: SERVER_VERSION },
    instructions:
      'MetaCompilador local EAR OS. Toda herramienta devuelve evidencia con hash SHA-256. Ningun SEALED se declara sin evidencia real (AF-5).',
  };
}

export const JSONRPC_VERSION = '2.0' as const;
export const MCP_PROTOCOL_VERSION = '2025-06-18' as const;
export const SERVER_NAME = 'ear-os-metacompiler' as const;
export const SERVER_VERSION = '1.0.0' as const;

export type JsonRpcId = string | number | null;

export interface JsonRpcSuccess {
  readonly jsonrpc: typeof JSONRPC_VERSION;
  readonly id: JsonRpcId;
  readonly result: unknown;
}

export interface JsonRpcFailure {
  readonly jsonrpc: typeof JSONRPC_VERSION;
  readonly id: JsonRpcId;
  readonly error: { readonly code: number; readonly message: string; readonly data?: unknown };
}

export type JsonRpcResponse = JsonRpcSuccess | JsonRpcFailure;

/** Códigos JSON-RPC 2.0 + MCP. Vocabulario cerrado. */
export const JSONRPC_ERRORS = Object.freeze({
  PARSE_ERROR: -32700,
  INVALID_REQUEST: -32600,
  METHOD_NOT_FOUND: -32601,
  INVALID_PARAMS: -32602,
  INTERNAL_ERROR: -32603,
  TOOL_EXECUTION: -32000,
} as const);

export type ToolName =
  | 'verify_ssot_hash'
  | 'audit_ssot_integrity'
  | 'verify_spec_invariants'
  | 'list_sv_gates'
  | 'run_sv_gates'
  | 'execute_isolated_gates'
  | 'mutate_ontology_node'
  | 'inject_ontology_node'
  | 'emit_artifact'
  | 'trigger_coolify_deploy';


export interface ToolDefinition {
  readonly name: ToolName;
  readonly title: string;
  readonly description: string;
  /** `true` sólo si la herramienta modifica estado del repositorio o de la DB. */
  readonly mutating: boolean;
  readonly inputSchema: Record<string, unknown>;
  readonly input: z.ZodType;
}

const emptyInput = z.object({}).strict();

const nodeInput = z
  .object({
    id: z.string().trim().min(3).max(96).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    label: z.string().trim().min(2).max(80),
    kind: z.enum(['SURFACE', 'ENGINE', 'CONNECTOR']),
    parentKey: z.string().trim().max(120).optional(),
  })
  .strict();

const emitInput = z
  .object({
    spec: z.unknown(),
    seedOntology: z.boolean().optional(),
  })
  .strict();

/**
 * Entrada de `mutate_ontology_node`. El id se restringe por gramática (sin `/`,
 * sin `..`, sin espacios) para que el traversal sea imposible ANTES de tocar el
 * AST: la primera barrera es Zod, no el mutador.
 */
const mutateInput = z
  .object({
    id: z.string().trim().min(3).max(64).regex(/^[A-Z][A-Z0-9]*(?:-[A-Z0-9]+)*$/),
    label: z.string().trim().min(2).max(80),
    href: z.string().trim().min(1).max(120).regex(/^\/[^/]/),
    sector: z.enum(['PUBLICO', 'HOSTELERIA', 'ARTISTICO', 'TECNICO', 'COMPLEMENTARIO']),
    dryRun: z.boolean().optional(),
  })
  .strict();

const deployInput = z
  .object({
    /** Confirmación explícita: sin ella no se dispara ningún webhook. */
    confirm: z.literal(true),
    /** SHA-256 del sello del MetaCompilador que autoriza el despliegue. */
    sealHash: z.string().regex(/^[a-f0-9]{64}$/),
  })
  .strict();


/**
 * Catálogo de herramientas. `inputSchema` es el JSON Schema que recibe el LLM;
 * `input` es el validador real. Se declaran juntos para que no puedan divergir
 * sin que se note en revisión. `additionalProperties: false` en todos.
 */
export const MCP_TOOLS: readonly ToolDefinition[] = Object.freeze([
  {
    name: 'verify_ssot_hash',
    title: 'Verificar hash SHA-256 de Zona Cero',
    description:
      'Calcula el SHA-256 canónico de ear-os-ssot.ts, lo compara con el hash de referencia y valida los invariantes 80/10/10, fianza 100 EUR y techo B2G 14.250 EUR. Sólo lectura.',
    mutating: false,
    inputSchema: { type: 'object', properties: {}, additionalProperties: false },
    input: emptyInput,
  },
  {
    name: 'verify_spec_invariants',
    title: 'Verificar precondición, postcondición y paridad SSOT',
    description:
      'Compila una MetaCompilerSpec en seco (sin sembrar ontología) y devuelve los tres juicios contractuales más el artefacto emitido con su SHA-256.',
    mutating: false,
    inputSchema: {
      type: 'object',
      properties: { spec: { type: 'object', description: 'MetaCompilerSpec completa.' } },
      required: ['spec'],
      additionalProperties: false,
    },
    input: z.object({ spec: z.unknown() }).strict(),
  },
  {
    name: 'list_sv_gates',
    title: 'Listar compuertas del arnés',
    description:
      'Devuelve las compuertas del arnés SV declaradas en scripts/run_sv_protocol_15_gates.cjs. NO las ejecuta: la ejecución pertenece al pipeline de CI.',
    mutating: false,
    inputSchema: { type: 'object', properties: {}, additionalProperties: false },
    input: emptyInput,
  },
  {
    name: 'run_sv_gates',
    title: 'Ejecutar compuertas (DESHABILITADO por diseño)',
    description:
      'EXECUTION_DISABLED: ejecutar comandos arbitrarios desde una conversación con un LLM es ejecución remota de código. La certificación se hace con node scripts/run_sv_protocol_15_gates.cjs en la máquina del operador.',
    mutating: false,
    inputSchema: { type: 'object', properties: {}, additionalProperties: false },
    input: emptyInput,
  },
  {
    name: 'inject_ontology_node',
    title: 'Insertar nodo de ontología (idempotente)',
    description:
      'Siembra un nodo en el ecosistema a través del runtime inyectado. Repetir la llamada N veces produce 1 nodo (INV-08) y nunca resucita un nodo dado de baja.',
    mutating: true,
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'string', pattern: '^[a-z0-9]+(?:-[a-z0-9]+)*$' },
        label: { type: 'string', minLength: 2, maxLength: 80 },
        kind: { type: 'string', enum: ['SURFACE', 'ENGINE', 'CONNECTOR'] },
        parentKey: { type: 'string' },
      },
      required: ['id', 'label', 'kind'],
      additionalProperties: false,
    },
    input: nodeInput,
  },
  {
    name: 'emit_artifact',
    title: 'Compilar especificación completa',
    description:
      'Recorre la FSM completa (HASH_VERIF, TYPE_CHECK, LINT_AST, GATE_EVAL) y devuelve evidencia, traza y sello determinista. Debe llegar a SEALED para firmarse.',
    mutating: true,
    inputSchema: {
      type: 'object',
      properties: {
        spec: { type: 'object' },
        seedOntology: { type: 'boolean', default: false },
      },
      required: ['spec'],
      additionalProperties: false,
    },
    input: emitInput,
  },
  // ── Herramientas exigidas por la directiva §3 (MCP local embebido) ────────
  {
    name: 'audit_ssot_integrity',
    title: 'Auditar integridad SHA-256 de Zona Cero',
    description:
      'Alias nombrado en la directiva de `verify_ssot_hash`: recalcula el SHA-256 canónico de ear-os-ssot.ts, lo compara con el hash de referencia inmutable y evalúa los invariantes 80/10/10, fianza 100 EUR y techo B2G 14.250 EUR. Sólo lectura, cero efectos.',
    mutating: false,
    inputSchema: { type: 'object', properties: {}, additionalProperties: false },
    input: emptyInput,
  },
  {
    name: 'execute_isolated_gates',
    title: 'Ejecutar compuertas en sandbox (DESHABILITADO por diseño)',
    description:
      'EXECUTION_DISABLED: lanzar `npm run typecheck` o el arnés de 17 compuertas desde una conversación con un LLM es ejecución remota de código (SEC-5). Devuelve el comando exacto que debe ejecutar el operador y el motivo del bloqueo.',
    mutating: false,
    inputSchema: { type: 'object', properties: {}, additionalProperties: false },
    input: emptyInput,
  },
  {
    name: 'mutate_ontology_node',
    title: 'Mutar ontología por AST determinista',
    description:
      'Aplica una mutación ESTRUCTURAL (API del compilador de TypeScript, no regex) sobre ecosystem-ontology.ts para añadir una categoría a un sector. Devuelve el SHA-256 antes/después y los rechazos. Con `dryRun:true` no escribe en disco; sin runtime de mutación devuelve SIN_EVIDENCIA.',
    mutating: true,
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'string', pattern: '^[A-Z][A-Z0-9]*(?:-[A-Z0-9]+)*$' },
        label: { type: 'string', minLength: 2, maxLength: 80 },
        href: { type: 'string', pattern: '^/[^/]' },
        sector: {
          type: 'string',
          enum: ['PUBLICO', 'HOSTELERIA', 'ARTISTICO', 'TECNICO', 'COMPLEMENTARIO'],
        },
        dryRun: { type: 'boolean' },
      },
      required: ['id', 'label', 'href', 'sector'],
      additionalProperties: false,
    },
    input: mutateInput,
  },
  {
    name: 'trigger_coolify_deploy',
    title: 'Disparar despliegue en Coolify (default-deny)',
    description:
      'Sólo dispara el webhook de producción si existe `COOLIFY_DEPLOY_WEBHOOK`, si `confirm === true` y si el `sealHash` corresponde a un sellado SEALED real de esta sesión. Sin webhook devuelve DEPLOY_NOT_CONFIGURED: nunca simula un despliegue.',
    mutating: true,
    inputSchema: {
      type: 'object',
      properties: {
        confirm: { type: 'boolean', enum: [true] },
        sealHash: { type: 'string', pattern: '^[a-f0-9]{64}$' },
      },
      required: ['confirm', 'sealHash'],
      additionalProperties: false,
    },
    input: deployInput,
  },
]);


export function findTool(name: string): ToolDefinition | null {
  return MCP_TOOLS.find((tool) => tool.name === name) ?? null;
}

/** Listado MCP (formato `tools/list`). */
export function listToolsPayload(): { tools: readonly Record<string, unknown>[] } {
  return {
    tools: MCP_TOOLS.map((tool) => ({
      name: tool.name,
      title: tool.title,
      description: tool.description,
      inputSchema: tool.inputSchema,
      annotations: { readOnlyHint: !tool.mutating, destructiveHint: false },
    })),
  };
}

/** Respuesta de `initialize` con el perfil de capacidades. */
/**
 * Contexto de ejecución: el servidor MCP NO abre PostgreSQL ni toca git.
 * Todo efecto real pasa por `runtime`, inyectado por el anfitrión.
 */
export interface McpHostContext {
  readonly runtime: MetaCompilerRuntime;
  /** Lista de compuertas declarada por el anfitrión (sólo lectura). */
  readonly gates: readonly string[];
  /** Timestamp inyectado: mantiene la paridad de resultados entre ejecuciones. */
  readonly now: () => string;
  /**
   * Capacidad OPCIONAL de mutación AST. Sólo el anfitrión de servidor la
   * inyecta (necesita `node:fs` + `typescript`). Si falta, `mutate_ontology_node`
   * responde `SIN_EVIDENCIA` en vez de fingir que mutó algo.
   */
  readonly mutation?: MetaMutationHost | null;
  /**
   * Capacidad OPCIONAL de despliegue. `null` ⇒ `trigger_coolify_deploy` responde
   * `DEPLOY_NOT_CONFIGURED`. El transporte stdio NUNCA la inyecta.
   */
  readonly deploy?: MetaDeployHost | null;
}

export interface MetaMutationHost {
  /** Ruta relativa del fichero que se va a mutar (sólo informativa). */
  readonly file: string;
  /** Aplica (o simula) la mutación y devuelve evidencia con hashes. */
  mutate(input: {
    readonly id: string;
    readonly label: string;
    readonly href: string;
    readonly sector: string;
    readonly dryRun: boolean;
  }): Promise<{
    readonly ok: boolean;
    readonly changed: boolean;
    readonly wrote: boolean;
    readonly sourceSha256: string;
    readonly mutatedSha256: string;
    readonly applied: readonly string[];
    readonly rejected: readonly string[];
    readonly syntaxErrors: readonly string[];
  }>;
}

export interface MetaDeployHost {
  /** ¿Existe webhook configurado? Sin él no hay despliegue, sólo honestidad. */
  readonly configured: boolean;
  /** ¿El sello corresponde a un SEALED real de esta sesión? */
  isSealed(sealHash: string): boolean;
  /** Dispara el despliegue y devuelve su evidencia. */
  trigger(): Promise<{ readonly dispatched: boolean; readonly detail: string }>;
}


export type ToolCallOutcome = {
  readonly ok: boolean;
  readonly isError: boolean;
  readonly payload: Record<string, unknown>;
};

export const RUN_GATES_REFUSAL = Object.freeze({
  status: 'EXECUTION_DISABLED',
  reason:
    'Ejecutar comandos de shell desde una conversacion con un LLM es ejecucion remota de codigo (SEC-5).',
  operatorCommand: 'node scripts/run_sv_protocol_15_gates.cjs',
  evidencePolicy:
    'La certificacion real se firma con el Exit Code de ese comando, ejecutado por el operador en su maquina.',
});

/** Ejecuta una herramienta con parámetros validados por Zod. */
export async function callTool(
  name: string,
  args: unknown,
  host: McpHostContext,
): Promise<ToolCallOutcome> {
  const tool = findTool(name);
  if (tool === null) {
    return {
      ok: false,
      isError: true,
      payload: { status: 'UNKNOWN_TOOL', tool: name, available: MCP_TOOLS.map((t) => t.name) },
    };
  }

  const parsed = tool.input.safeParse(args ?? {});
  if (!parsed.success) {
    return {
      ok: false,
      isError: true,
      payload: {
        status: 'INVALID_PARAMS',
        tool: tool.name,
        issues: parsed.error.issues.map((issue) => `${issue.path.join('.') || 'args'}: ${issue.message}`),
      },
    };
  }

  return dispatch(tool.name, parsed.data, host);
}

async function dispatch(name: ToolName, data: unknown, host: McpHostContext): Promise<ToolCallOutcome> {
  switch (name) {
    case 'verify_ssot_hash':
    case 'audit_ssot_integrity': {
      // Misma sonda para los dos nombres: la directiva pide
      // `audit_ssot_integrity`; el contrato ya publicado expone
      // `verify_ssot_hash`. Una sola implementación, dos etiquetas.
      const ssot = readSsotReport();
      return {
        ok: ssot.intact,
        isError: !ssot.intact,
        payload: {
          status: ssot.intact ? 'VERIFICADO' : 'SOSPECHOSO',
          tool: name,
          ...ssot,
          probed: true,
          source: 'live',
          mode: 'REAL',
          checkedAt: host.now(),
        },
      };
    }
    case 'execute_isolated_gates': {
      return { ok: false, isError: true, payload: { ...RUN_GATES_REFUSAL, tool: name } };
    }
    case 'mutate_ontology_node': {
      const input = data as {
        id: string;
        label: string;
        href: string;
        sector: string;
        dryRun?: boolean;
      };
      if (host.mutation === undefined || host.mutation === null) {
        return {
          ok: false,
          isError: true,
          payload: {
            status: 'SIN_EVIDENCIA',
            tool: name,
            detail:
              'Este anfitrion no inyecta capacidad de mutacion AST (transporte stdio). Usa el panel /admin/compiler.',
          },
        };
      }
      const outcome = await host.mutation.mutate({
        id: input.id,
        label: input.label,
        href: input.href,
        sector: input.sector,
        dryRun: input.dryRun === true,
      });
      return {
        ok: outcome.ok,
        isError: !outcome.ok,
        payload: {
          status: outcome.ok ? 'VERIFICADO' : 'RECHAZADO',
          tool: name,
          file: host.mutation.file,
          dryRun: input.dryRun === true,
          ...outcome,
          checkedAt: host.now(),
        },
      };
    }
    case 'trigger_coolify_deploy': {
      const input = data as { confirm: true; sealHash: string };
      if (host.deploy === undefined || host.deploy === null || !host.deploy.configured) {
        return {
          ok: false,
          isError: true,
          payload: {
            status: 'DEPLOY_NOT_CONFIGURED',
            tool: name,
            detail:
              'No existe COOLIFY_DEPLOY_WEBHOOK en el entorno: no hay despliegue que disparar y no se simula ninguno.',
            checkedAt: host.now(),
          },
        };
      }
      if (!host.deploy.isSealed(input.sealHash)) {
        return {
          ok: false,
          isError: true,
          payload: {
            status: 'SEAL_MISMATCH',
            tool: name,
            detail: 'El sealHash no corresponde a un sellado SEALED de esta sesion (FETCH_NEVER_SENT).',
            checkedAt: host.now(),
          },
        };
      }
      const result = await host.deploy.trigger();
      return {
        ok: result.dispatched,
        isError: !result.dispatched,
        payload: {
          status: result.dispatched ? 'DISPATCHED' : 'SIN_EVIDENCIA',
          tool: name,
          sealHash: input.sealHash,
          ...result,
          checkedAt: host.now(),
        },
      };
    }
    case 'verify_spec_invariants': {
      const input = data as { spec: unknown };
      const result = await compileMetaSpec(input.spec, {
        now: host.now(),
        runtime: host.runtime,
        seedOntology: false,
      });
      return {
        ok: result.state === 'SEALED',
        isError: result.state !== 'SEALED',
        payload: {
          status: result.state === 'SEALED' ? 'VERIFICADO' : 'RECHAZADO',
          state: result.state,
          abortReason: result.abortReason,
          design: result.design,
          artifactSha256: result.artifact === null ? null : sha256OfText(result.artifact.artifact),
          sealHash: result.sealHash,
          evidence: result.evidence,
        },
      };
    }
    case 'list_sv_gates': {
      return {
        ok: host.gates.length > 0,
        isError: host.gates.length === 0,
        payload: {
          status: host.gates.length > 0 ? 'VERIFICADO' : 'SIN_EVIDENCIA',
          total: host.gates.length,
          gates: host.gates,
          executed: false,
          executedNote: 'Este listado NO certifica ejecucion: declara el arnes que existe en disco.',
          checkedAt: host.now(),
        },
      };
    }
    case 'run_sv_gates': {
      return { ok: false, isError: true, payload: { ...RUN_GATES_REFUSAL, tool: name } };
    }
    case 'inject_ontology_node': {
      const node = data as { id: string; label: string; kind: 'SURFACE' | 'ENGINE' | 'CONNECTOR' };
      try {
        const seeded = await host.runtime.seedOntology([{ id: node.id, label: node.label, kind: node.kind }]);
        return {
          ok: true,
          isError: false,
          payload: {
            status: seeded.inserted === 0 ? 'YA_EXISTE' : 'INSERTADO',
            node,
            idempotent: seeded.inserted === 0,
            total: seeded.total,
            checkedAt: host.now(),
          },
        };
      } catch {
        return {
          ok: false,
          isError: true,
          payload: {
            status: 'SIN_EVIDENCIA',
            detail: 'El runtime inyectado no soporta sembrado de ontologia.',
          },
        };
      }
    }
    case 'emit_artifact': {
      const input = data as { spec: unknown; seedOntology?: boolean };
      const result = await compileMetaSpec(input.spec, {
        now: host.now(),
        runtime: host.runtime,
        seedOntology: input.seedOntology === true,
      });
      return {
        ok: result.state === 'SEALED',
        isError: result.state !== 'SEALED',
        payload: {
          status: result.state === 'SEALED' ? 'VERIFICADO' : 'RECHAZADO',
          state: result.state,
          abortReason: result.abortReason,
          trace: result.trace,
          evidence: result.evidence,
          stats: result.stats,
          sealHash: result.sealHash,
          artifact: result.artifact === null ? null : result.artifact.artifact,
        },
      };
    }
    default:
      return { ok: false, isError: true, payload: { status: 'UNKNOWN_TOOL', tool: name } };
  }
}

function readSsotReport(): {
  computedHash: string;
  referenceHash: string;
  intact: boolean;
  invariantsOk: boolean;
  violations: readonly string[];
} {
  const report = verifySsotIntegrity();
  return {
    computedHash: report.computedHash,
    referenceHash: report.referenceHash,
    intact: report.intact,
    invariantsOk: report.invariantsOk,
    violations: report.violatedInvariants,
  };
}

/** `tools/call` con sobre MCP (`content` textual + `isError`). */
export async function handleToolCall(
  params: unknown,
  host: McpHostContext,
): Promise<{
  readonly content: { readonly type: 'text'; readonly text: string }[];
  readonly isError: boolean;
  readonly structuredContent: Record<string, unknown>;
}> {
  const envelope = (params ?? {}) as { name?: unknown; arguments?: unknown };
  const name = typeof envelope.name === 'string' ? envelope.name : '';
  const outcome = await callTool(name, envelope.arguments, host);
  return {
    content: [{ type: 'text', text: JSON.stringify(outcome.payload, null, 2) }],
    isError: outcome.isError,
    structuredContent: outcome.payload,
  };
}

function success(id: JsonRpcId, result: unknown): JsonRpcSuccess {
  return { jsonrpc: JSONRPC_VERSION, id, result };
}

function failure(id: JsonRpcId, code: number, message: string, data?: unknown): JsonRpcFailure {
  return data === undefined
    ? { jsonrpc: JSONRPC_VERSION, id, error: { code, message } }
    : { jsonrpc: JSONRPC_VERSION, id, error: { code, message, data } };
}

function parseRequest(raw: unknown): { id: JsonRpcId; method: string; params: unknown } | null {
  if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) return null;
  const record = raw as Record<string, unknown>;
  if (record.jsonrpc !== JSONRPC_VERSION) return null;
  if (typeof record.method !== 'string' || record.method.length === 0) return null;
  const id = record.id;
  if (typeof id === 'string' || typeof id === 'number' || id === null || id === undefined) {
    return { id: id ?? null, method: record.method, params: record.params ?? {} };
  }
  return null;
}

/**
 * Router JSON-RPC puro: recibe un mensaje ya parseado y devuelve la respuesta.
 * Devuelve `null` para notificaciones (sin `id`), tal como exige el §4.1.
 */
export async function routeJsonRpc(message: unknown, host: McpHostContext): Promise<JsonRpcResponse | null> {
  const request = parseRequest(message);
  if (request === null) {
    return failure(null, JSONRPC_ERRORS.INVALID_REQUEST, 'Solicitud JSON-RPC 2.0 inválida.');
  }

  const isNotification = (message as Record<string, unknown>).id === undefined;

  switch (request.method) {
    case 'initialize':
      return isNotification ? null : success(request.id, initializePayload());
    case 'notifications/initialized':
    case 'notifications/cancelled':
      return null;
    case 'ping':
      return isNotification ? null : success(request.id, {});
    case 'tools/list':
      return isNotification ? null : success(request.id, listToolsPayload());
    case 'tools/call':
      if (isNotification) {
        await handleToolCall(request.params, host);
        return null;
      }
      return success(request.id, await handleToolCall(request.params, host));
    default:
      return isNotification
        ? null
        : failure(request.id, JSONRPC_ERRORS.METHOD_NOT_FOUND, `Método no soportado: ${request.method}`);
  }
}

/**
 * Decodifica una línea NDJSON de un transporte stdio y produce la línea de
 * respuesta (o `null` si no hay nada que responder).
 */
export async function handleJsonRpcLine(line: string, host: McpHostContext): Promise<string | null> {
  const trimmed = line.trim();
  if (trimmed.length === 0) return null;
  let parsed: unknown;
  try {
    parsed = JSON.parse(trimmed);
  } catch {
    return JSON.stringify(failure(null, JSONRPC_ERRORS.PARSE_ERROR, 'JSON inválido.'));
  }
  const response = await routeJsonRpc(parsed, host);
  return response === null ? null : JSON.stringify(response);
}



