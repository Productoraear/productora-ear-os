/**
 * ════════════════════════════════════════════════════════════════════════════
 * ZAPIER MCP ADAPTER — STREAMABLE HTTP + HITL GATE (M2)
 * ════════════════════════════════════════════════════════════════════════════
 * Server-only (`node:crypto` vía `adapter-contract`).
 * Cliente MCP Streamable HTTP (`https://mcp.zapier.com/api/v1/connect`) con
 * `Authorization: Bearer <ZAPIER_MCP_TOKEN>` exclusivamente en cabecera HTTP,
 * `AbortSignal.timeout(8000)`, `redirect: 'error'`, soporte JSON + SSE
 * `text/event-stream`, Zod `.strict()` y puerta HITL constitucional.
 * ════════════════════════════════════════════════════════════════════════════
 */

import { z } from 'zod';

import {
  ADAPTER_TIMEOUT_MS,
  type AdapterEnvelope,
  type AdapterReadiness,
  type AdapterTransport,
  type EnvSource,
  type HitlActionKind,
  type ProviderTier,
  checkEnvReadiness,
  createAdapterFetchTransport,
  effectiveAdapterSignal,
  envelopeError,
  envelopeHitlBlocked,
  envelopeOk,
  envelopeUnconfigured,
  evaluateHitlPolicyGate,
  parseStrictWithSchema,
  readEnvVar,
  validateSafeHttpsPublicUrl,
} from './adapter-contract';

export const ZAPIER_MCP_ADAPTER_ID = 'zapier-mcp' as const;
export const ZAPIER_MCP_ENDPOINT = 'https://mcp.zapier.com/api/v1/connect' as const;
export const ZAPIER_MCP_REQUIRED_ENV = ['ZAPIER_MCP_TOKEN'] as const;

export const zapierCallInputSchema = z
  .object({
    toolName: z.string().trim().min(1).max(128),
    arguments: z.record(z.string(), z.unknown()).default({}),
    actionCategory: z.enum(['read_only', 'semi_auto', 'mutating']).optional(),
    humanApproved: z.boolean().optional(),
    amountEur: z.number().nonnegative().nullable().optional(),
    distanceKm: z.number().nonnegative().nullable().optional(),
    isB2gContract: z.boolean().optional(),
    isLitigation: z.boolean().optional(),
    isEventCancellation: z.boolean().optional(),
    isVimumeClinical: z.boolean().optional(),
    isContractClose: z.boolean().optional(),
    bilateralConsentConfirmed: z.boolean().optional(),
    providerTier: z
      .enum(['SOVEREIGN', 'CLAIMED', 'DIRECTORY_UNCLAIMED', 'BLACKLISTED'])
      .nullable()
      .optional(),
    artistId: z.string().min(1).max(64).nullable().optional(),
    sessionId: z.string().min(1).max(256).optional(),
    contextSummary: z.string().max(400).optional(),
  })
  .strict();

export type ZapierCallInput = z.infer<typeof zapierCallInputSchema>;

const zapierJsonRpcErrorSchema = z
  .object({
    code: z.number().int(),
    message: z.string(),
    data: z.unknown().optional(),
  })
  .strict();

const zapierJsonRpcResponseSchema = z
  .object({
    jsonrpc: z.literal('2.0'),
    id: z.union([z.string(), z.number(), z.null()]),
    result: z.unknown().optional(),
    error: zapierJsonRpcErrorSchema.optional(),
  })
  .strict();

export const zapierToolDescriptorSchema = z
  .object({
    name: z.string().min(1),
    description: z.string().optional(),
    inputSchema: z.record(z.string(), z.unknown()).optional(),
    annotations: z
      .object({
        readOnlyHint: z.boolean().optional(),
        destructiveHint: z.boolean().optional(),
        idempotentHint: z.boolean().optional(),
        openWorldHint: z.boolean().optional(),
      })
      .strict()
      .optional(),
    _meta: z.unknown().optional(),
  })
  .strict();

export const zapierToolsListResultSchema = z
  .object({
    tools: z.array(zapierToolDescriptorSchema),
    nextCursor: z.string().optional(),
    _meta: z.unknown().optional(),
  })
  .strict();

export const zapierContentItemSchema = z
  .object({
    type: z.string().min(1),
    text: z.string().optional(),
    data: z.string().optional(),
    mimeType: z.string().optional(),
    uri: z.string().optional(),
    _meta: z.unknown().optional(),
  })
  .strict();

export const zapierToolsCallResultSchema = z
  .object({
    content: z.array(zapierContentItemSchema),
    isError: z.boolean().optional(),
    structuredContent: z.record(z.string(), z.unknown()).optional(),
    _meta: z.unknown().optional(),
  })
  .strict();

export type ZapierToolsListResult = z.infer<typeof zapierToolsListResultSchema>;
export type ZapierToolsCallResult = z.infer<typeof zapierToolsCallResultSchema>;

export interface ZapierToolsListEnvelopeData {
  readonly adapterId: typeof ZAPIER_MCP_ADAPTER_ID;
  readonly endpoint: string;
  readonly sessionId: string | null;
  readonly result: ZapierToolsListResult;
}

export interface ZapierToolCallEnvelopeData {
  readonly adapterId: typeof ZAPIER_MCP_ADAPTER_ID;
  readonly endpoint: string;
  readonly toolName: string;
  readonly sessionId: string | null;
  readonly result: ZapierToolsCallResult;
}

export interface ZapierMcpOptions {
  readonly env?: EnvSource;
  readonly transport?: AdapterTransport;
  readonly now?: () => Date;
  readonly deadline?: Date;
}

function resolveZapierEndpoint(
  env: EnvSource,
): { readonly ok: true; readonly url: string } | { readonly ok: false; readonly reason: string } {
  const override = readEnvVar(env, 'ZAPIER_MCP_URL');
  if (!override) {
    return { ok: true, url: ZAPIER_MCP_ENDPOINT };
  }
  const safeUrl = validateSafeHttpsPublicUrl(override);
  if (!safeUrl.ok) {
    return { ok: false, reason: `ZAPIER_MCP_URL inválida: ${safeUrl.reason}` };
  }
  const host = safeUrl.url.hostname.toLowerCase();
  if (host !== 'mcp.zapier.com' && !host.endsWith('.zapier.com')) {
    return {
      ok: false,
      reason: `ZAPIER_MCP_URL debe apuntar a *.zapier.com (recibido: ${host}).`,
    };
  }
  return { ok: true, url: safeUrl.url.toString() };
}

export function checkZapierMcpReadiness(
  env: EnvSource = process.env,
): AdapterReadiness {
  const base = checkEnvReadiness(ZAPIER_MCP_ADAPTER_ID, ZAPIER_MCP_REQUIRED_ENV, env);
  const endpointCheck = resolveZapierEndpoint(env);
  if (!endpointCheck.ok) {
    return {
      adapterId: ZAPIER_MCP_ADAPTER_ID,
      configured: false,
      mode: 'UNCONFIGURED',
      missingVars: base.missingVars,
      details: endpointCheck.reason,
    };
  }
  return {
    ...base,
    details: base.configured
      ? `Streamable HTTP listo (${endpointCheck.url})`
      : 'Falta ZAPIER_MCP_TOKEN en servidor.',
  };
}

function parseStreamableHttpJsonRpc(
  contentType: string | null,
  bodyText: string,
): unknown {
  const ct = (contentType ?? '').toLowerCase();
  if (ct.includes('text/event-stream')) {
    const blocks = bodyText.split(/\r?\n\r?\n/);
    let lastJsonRpcResponse: unknown = null;
    let lastJson: unknown = null;
    for (const block of blocks) {
      const dataLines = block
        .split(/\r?\n/)
        .filter((line) => line.startsWith('data:'))
        .map((line) => line.slice(5).trimStart());
      if (dataLines.length === 0) continue;
      const joined = dataLines.join('\n').trim();
      if (!joined || joined === '[DONE]') continue;
      let parsed: unknown;
      try {
        parsed = JSON.parse(joined) as unknown;
      } catch {
        continue;
      }
      lastJson = parsed;
      if (
        typeof parsed === 'object' &&
        parsed !== null &&
        'jsonrpc' in parsed &&
        ('result' in parsed || 'error' in parsed)
      ) {
        lastJsonRpcResponse = parsed;
      }
    }
    const chosen = lastJsonRpcResponse ?? lastJson;
    if (chosen === null) {
      throw new Error('Flujo SSE sin eventos JSON-RPC válidos.');
    }
    return chosen;
  }
  return JSON.parse(bodyText) as unknown;
}

function resolveHitlActionKind(input: ZapierCallInput): HitlActionKind {
  if (input.isContractClose) return 'contract_close';
  if (input.isLitigation) return 'litigation';
  if (input.isEventCancellation) return 'event_cancellation';
  if (input.isVimumeClinical) return 'vimume_clinical';
  if (input.isB2gContract) return 'b2g_contract';
  if (input.actionCategory === 'read_only') return 'read_only';
  if (input.actionCategory === 'semi_auto') return 'lead_qualification';
  return 'mutating_action';
}

async function sendZapierRpc<T>(
  method: string,
  params: Record<string, unknown>,
  resultSchema: z.ZodType<T>,
  options: ZapierMcpOptions,
  sessionId?: string,
): Promise<
  | { readonly ok: true; readonly data: T; readonly endpoint: string; readonly sessionId: string | null }
  | { readonly ok: false; readonly envelope: AdapterEnvelope<never> }
> {
  const env = options.env ?? process.env;
  const nowFn = options.now ?? (() => new Date());
  const endpointRes = resolveZapierEndpoint(env);
  if (!endpointRes.ok) {
    return {
      ok: false,
      envelope: envelopeError(400, 'ZAPIER_INVALID_ENDPOINT', endpointRes.reason),
    };
  }

  const readiness = checkZapierMcpReadiness(env);
  if (!readiness.configured) {
    return { ok: false, envelope: envelopeUnconfigured(readiness) };
  }

  const token = readEnvVar(env, 'ZAPIER_MCP_TOKEN');
  const knownSecrets = [token];
  const transport = options.transport ?? createAdapterFetchTransport();
  const rpcId = `ear-${nowFn().getTime()}`;

  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
    Accept: 'application/json, text/event-stream',
  };
  if (sessionId) {
    headers['Mcp-Session-Id'] = sessionId;
  }

  try {
    const response = await transport.send({
      url: endpointRes.url,
      method: 'POST',
      headers,
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: rpcId,
        method,
        params,
      }),
      signal: effectiveAdapterSignal(options.deadline, nowFn, ADAPTER_TIMEOUT_MS),
    });

    if (response.status === 401 || response.status === 403) {
      return {
        ok: false,
        envelope: envelopeError(
          403,
          'ZAPIER_UNAUTHORIZED',
          `Zapier MCP rechazó la credencial (HTTP ${response.status}).`,
          knownSecrets,
        ),
      };
    }
    if (response.status < 200 || response.status >= 300) {
      return {
        ok: false,
        envelope: envelopeError(
          502,
          'ZAPIER_UPSTREAM_ERROR',
          `Zapier MCP devolvió HTTP ${response.status}: ${response.text}`,
          knownSecrets,
        ),
      };
    }

    const rawRpc = parseStreamableHttpJsonRpc(
      response.headers.get('content-type'),
      response.text,
    );
    const rpcParsed = parseStrictWithSchema(zapierJsonRpcResponseSchema, rawRpc);
    if (!rpcParsed.ok) {
      return {
        ok: false,
        envelope: envelopeError(
          502,
          'ZAPIER_INVALID_PAYLOAD',
          `Respuesta JSON-RPC inválida: ${rpcParsed.error}`,
          knownSecrets,
        ),
      };
    }

    if (rpcParsed.data.error) {
      return {
        ok: false,
        envelope: envelopeError(
          502,
          'ZAPIER_RPC_ERROR',
          `Error RPC ${rpcParsed.data.error.code}: ${rpcParsed.data.error.message}`,
          knownSecrets,
        ),
      };
    }

    const innerParsed = parseStrictWithSchema(resultSchema, rpcParsed.data.result);
    if (!innerParsed.ok) {
      return {
        ok: false,
        envelope: envelopeError(
          502,
          'ZAPIER_INVALID_PAYLOAD',
          `Resultado MCP inválido: ${innerParsed.error}`,
          knownSecrets,
        ),
      };
    }

    return {
      ok: true,
      data: innerParsed.data,
      endpoint: endpointRes.url,
      sessionId: response.headers.get('mcp-session-id') ?? sessionId ?? null,
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    const code =
      err instanceof Error && (err.name === 'TimeoutError' || err.name === 'AdapterTimeoutError')
        ? 'ZAPIER_TIMEOUT'
        : 'ZAPIER_TRANSPORT_ERROR';
    return {
      ok: false,
      envelope: envelopeError(502, code, msg, knownSecrets),
    };
  }
}

export async function listZapierMcpTools(
  options: ZapierMcpOptions = {},
): Promise<AdapterEnvelope<ZapierToolsListEnvelopeData>> {
  const decision = evaluateHitlPolicyGate({
    actionKind: 'read_only',
    contextSummary: 'Zapier MCP tools/list',
  });
  if (!decision.allowed) {
    return envelopeHitlBlocked(decision);
  }

  const res = await sendZapierRpc(
    'tools/list',
    {},
    zapierToolsListResultSchema,
    options,
  );
  if (!res.ok) return res.envelope;

  return envelopeOk(
    {
      adapterId: ZAPIER_MCP_ADAPTER_ID,
      endpoint: res.endpoint,
      sessionId: res.sessionId,
      result: res.data,
    },
    {
      adapterId: ZAPIER_MCP_ADAPTER_ID,
      method: 'tools/list',
      toolCount: res.data.tools.length,
    },
  );
}

export async function callZapierMcpTool(
  rawInput: unknown,
  options: ZapierMcpOptions = {},
): Promise<AdapterEnvelope<ZapierToolCallEnvelopeData>> {
  const parsedInput = parseStrictWithSchema(zapierCallInputSchema, rawInput);
  if (!parsedInput.ok) {
    return envelopeError(400, 'ZAPIER_INVALID_INPUT', parsedInput.error);
  }
  const input = parsedInput.data;

  // Puerta HITL fail-closed ANTES de abrir conexión o revelar estado si está bloqueado por política,
  // validando primero endpoint SSRF y readiness (ambos sin llamar a red).
  const env = options.env ?? process.env;
  const endpointRes = resolveZapierEndpoint(env);
  if (!endpointRes.ok) {
    return envelopeError(400, 'ZAPIER_INVALID_ENDPOINT', endpointRes.reason);
  }
  const readiness = checkZapierMcpReadiness(env);
  if (!readiness.configured) {
    return envelopeUnconfigured(readiness);
  }

  const decision = evaluateHitlPolicyGate({
    actionKind: resolveHitlActionKind(input),
    amountEur: input.amountEur ?? null,
    distanceKm: input.distanceKm ?? null,
    artistId: input.artistId ?? null,
    providerTier: (input.providerTier ?? null) as ProviderTier | null,
    bilateralConsentConfirmed: input.bilateralConsentConfirmed,
    humanApproved: input.humanApproved,
    contextSummary: input.contextSummary ?? `Zapier MCP tool=${input.toolName}`,
  });

  if (!decision.allowed) {
    return envelopeHitlBlocked(decision);
  }

  const res = await sendZapierRpc(
    'tools/call',
    {
      name: input.toolName,
      arguments: input.arguments,
    },
    zapierToolsCallResultSchema,
    options,
    input.sessionId,
  );
  if (!res.ok) return res.envelope;

  return envelopeOk(
    {
      adapterId: ZAPIER_MCP_ADAPTER_ID,
      endpoint: res.endpoint,
      toolName: input.toolName,
      sessionId: res.sessionId,
      result: res.data,
    },
    {
      adapterId: ZAPIER_MCP_ADAPTER_ID,
      method: 'tools/call',
      toolName: input.toolName,
      isError: res.data.isError ?? false,
    },
  );
}
