/**
 * CAREER OS · OAuth CALLBACK (W53_T04) — ruta canónica.
 * GET /api/artist/career/callback/[provider]?code=...&state=...
 *
 * Orden de ejecución (SEC-1 default-deny):
 *   1. `error` del proveedor → rechazo SIN canjear código.
 *   2. `state` firmado (HMAC + TTL 10 min) → 400 si está manipulado o caducado.
 *   3. `code` ausente → 400.
 *   4. Canje + cifrado con el vault + upsert `live`.
 *
 * Toda salida de error es un 302 AL PANEL con un código CERRADO
 * (`error=state_bad_signature`): ni tokens, ni mensajes del proveedor, ni trazas.
 * La respuesta de error también valida el proveedor; si está fuera del SSOT se
 * responde JSON 404 sin redirección (no se redirige a un panel ajeno al flujo).
 */
import { NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';
import {
  buildResultRedirect,
  processCallback,
  resolvePublicBaseUrl,
  toOAuthFlowError,
  type OAuthPersistHandle,
  type OAuthProviderAdapter,
} from '@/lib/career/oauth-flow';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/** Registro de adaptadores OAuth (ver connect/[provider]/route.ts). */
const OAUTH_ADAPTERS = new Map<string, OAuthProviderAdapter>();

function resolveAdapter(platformId: string): OAuthProviderAdapter | null {
  return OAUTH_ADAPTERS.get(platformId) ?? null;
}

function prismaHandle(): OAuthPersistHandle {
  return {
    platformConnection: {
      upsert: (args) =>
        prisma.platformConnection.upsert({
          where: args.where,
          create: args.create,
          update: args.update,
          select: args.select,
        }),
    },
  };
}

export async function GET(
  request: Request,
  ctx: { params: Promise<{ provider: string }> },
): Promise<NextResponse> {
  const { provider } = await ctx.params;
  const params = new URL(request.url).searchParams;

  try {
    const result = await processCallback(provider, {
      code: params.get('code'),
      state: params.get('state'),
      providerError: params.get('error'),
      requestUrl: request.url,
      deps: { adapters: resolveAdapter, client: prismaHandle() },
    });
    return NextResponse.redirect(result.location, {
      status: 302,
      headers: { 'Cache-Control': 'no-store', 'Referrer-Policy': 'no-referrer' },
    });
  } catch (error) {
    const flowError = toOAuthFlowError(error);
    // 404/400 de proveedor desconocido o no-OAuth: no existe panel coherente al
    // que volver, se responde JSON cerrado. El resto vuelve al panel con código.
    if (flowError.code === 'PROVIDER_UNKNOWN' || flowError.code === 'PROVIDER_NOT_OAUTH') {
      return NextResponse.json(
        { status: 'error', code: flowError.code, checkedAt: new Date().toISOString() },
        { status: flowError.httpStatus, headers: { 'Cache-Control': 'no-store' } },
      );
    }
    const baseUrl = resolvePublicBaseUrl(request.url);
    return NextResponse.redirect(
      buildResultRedirect(baseUrl, provider, { status: 'error', error: flowError.code }),
      {
        status: 302,
        headers: { 'Cache-Control': 'no-store', 'Referrer-Policy': 'no-referrer' },
      },
    );
  }
}

export function POST(): NextResponse {
  return NextResponse.json(
    { status: 'error', code: 'METHOD_NOT_ALLOWED' },
    { status: 405, headers: { Allow: 'GET' } },
  );
}
