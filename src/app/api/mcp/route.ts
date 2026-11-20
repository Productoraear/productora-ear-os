import { NextResponse } from 'next/server';
import { z } from 'zod';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { requireAdmin } from '@/lib/security/adminGuard';
import {
  JSONRPC_ERRORS,
  MCP_PROTOCOL_VERSION,
  SERVER_NAME,
  SERVER_VERSION,
  handleJsonRpcLine,
  initializePayload,
  listToolsPayload,
  type McpHostContext,
} from '@/lib/compiler/metacompiler-mcp';
import { createServerRuntime, parseSvGates } from '@/lib/compiler/metacompiler-server-runtime';
import { createDeployHost, createMutationHost } from '@/lib/compiler/metacompiler-server-hosts';
import { SV_GATES_SCRIPT } from '@/lib/compiler/metacompiler-runtime';

/**
 * ════════════════════════════════════════════════════════════════════════════
 * /api/mcp — PROTOCOLO MCP LOCAL EMBEBIDO (JSON-RPC 2.0 sobre HTTP)
 * ════════════════════════════════════════════════════════════════════════════
 * Expone las herramientas tipadas del MetaCompilador al ecosistema MCP sin
 * dependencia de ninguna API externa ni de ningún LLM.
 *
 * Default-deny (SEC-1): la PRIMERA comprobación es la sesión de administrador.
 * Un anónimo recibe 401 antes de que el JSON se parsee siquiera. No hay
 * "modo lectura pública": estas herramientas mutan ontología y disparan deploys.
 *
 *   GET  → manifiesto del servidor (`initialize` + `tools/list`), sólo lectura.
 *   POST → mensaje JSON-RPC 2.0 NDJSON (líneas separadas por \n).
 *          Una notificación (sin `id`) devuelve 202 sin cuerpo (JSON-RPC §4.1).
 *
 * Cero puertos nuevos: viaja por el servidor Next ya desplegado. El transporte
 * stdio (`npm run mcp:metacompiler`) sigue disponible y NO inyecta capacidades
 * privilegiadas de mutación ni de despliegue.
 * ════════════════════════════════════════════════════════════════════════════
 */

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MAX_BODY_BYTES = 64 * 1024;
const MAX_LINES = 16;

/** Cuerpo POST: NDJSON no vacío y acotado. Se valida ANTES de ejecutar nada. */
const BodySchema = z.string().min(2).max(MAX_BODY_BYTES);

const SECURITY_HEADERS: Readonly<Record<string, string>> = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'no-referrer',
  'Cross-Origin-Resource-Policy': 'same-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
};

function json(payload: unknown, status = 200): NextResponse {
  return NextResponse.json(payload, { status, headers: SECURITY_HEADERS });
}

/** Compuertas declaradas por el arnés real. Sin fichero ⇒ [] (nunca inventadas). */
function readGates(): string[] {
  try {
    return parseSvGates(readFileSync(path.join(process.cwd(), SV_GATES_SCRIPT), 'utf8'));
  } catch {
    return [];
  }
}

/**
 * Contexto del anfitrión HTTP. `sealedHashes` llega vacío: el proceso no guarda
 * estado entre peticiones, así que `trigger_coolify_deploy` sólo puede ejecutarse
 * con un sello autorizado explícitamente. Sin sello válido ⇒ `SEAL_MISMATCH` y
 * CERO peticiones al webhook.
 */
function buildHost(sealedHashes: readonly string[]): McpHostContext {
  return {
    runtime: createServerRuntime(),
    gates: readGates(),
    now: () => new Date().toISOString(),
    mutation: createMutationHost(),
    deploy: createDeployHost(sealedHashes),
  };
}

export async function GET(request: Request): Promise<NextResponse> {
  try {
    const auth = await requireAdmin(request);
    if (!auth.ok) return auth.response;

    return json({
      ok: true,
      data: {
        server: { name: SERVER_NAME, version: SERVER_VERSION, protocol: MCP_PROTOCOL_VERSION },
        transport: { http: 'POST /api/mcp (NDJSON)', stdio: 'npm run mcp:metacompiler' },
        initialize: initializePayload(),
        tools: listToolsPayload().tools,
        gates: { total: readGates().length, source: SV_GATES_SCRIPT },
        checkedAt: new Date().toISOString(),
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error interno.';
    return json({ ok: false, error: message }, 500);
  }
}

export async function POST(request: Request): Promise<NextResponse> {
  try {
    // SEC-1: el caso negativo se evalúa primero. Ningún trabajo antes de auth.
    const auth = await requireAdmin(request);
    if (!auth.ok) return auth.response;

    const declared = request.headers.get('content-length');
    if (declared !== null) {
      const size = Number.parseInt(declared, 10);
      if (Number.isFinite(size) && size > MAX_BODY_BYTES) {
        return json({ ok: false, error: 'Payload demasiado grande.' }, 413);
      }
    }

    const parsed = BodySchema.safeParse(await request.text());
    if (!parsed.success) {
      return json(
        {
          jsonrpc: '2.0',
          id: null,
          error: { code: JSONRPC_ERRORS.PARSE_ERROR, message: 'Cuerpo NDJSON vacío o excesivo.' },
        },
        400,
      );
    }

    const lines = parsed.data
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    if (lines.length === 0) {
      return json(
        {
          jsonrpc: '2.0',
          id: null,
          error: { code: JSONRPC_ERRORS.INVALID_REQUEST, message: 'Sin mensajes.' },
        },
        400,
      );
    }
    if (lines.length > MAX_LINES) {
      return json({ ok: false, error: `Máximo ${MAX_LINES} mensajes por petición.` }, 413);
    }

    const host = buildHost([]);
    const responses: string[] = [];
    for (const line of lines) {
      const response = await handleJsonRpcLine(line, host);
      if (response !== null) responses.push(response);
    }

    // Notificaciones puras: JSON-RPC 2.0 §4.1 exige no devolver cuerpo.
    if (responses.length === 0) {
      return new NextResponse(null, { status: 202, headers: SECURITY_HEADERS });
    }

    return new NextResponse(responses.join('\n'), {
      status: 200,
      headers: { ...SECURITY_HEADERS, 'Content-Type': 'application/x-ndjson; charset=utf-8' },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error interno.';
    return json(
      { jsonrpc: '2.0', id: null, error: { code: JSONRPC_ERRORS.INTERNAL_ERROR, message } },
      500,
    );
  }
}

