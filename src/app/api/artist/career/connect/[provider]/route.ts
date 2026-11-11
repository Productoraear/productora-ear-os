/**
 * CAREER OS · OAuth CONNECT (W53_T04) — ruta canónica.
 * GET /api/artist/career/connect/[provider]?artist=<artistId>
 *
 * Cáscara delgada: toda la seguridad (state HMAC + TTL 10 min) vive en
 * `src/lib/career/oauth-flow.ts`. Esta ruta solo traduce HTTP ↔ motor.
 *
 * Respuestas honestas (default-deny, SEC-1):
 *   302 → proveedor (URL https con `state` firmado)
 *   400 → proveedor fuera de OAuth o parámetros inválidos (JSON, sin redirect)
 *   404 → plataforma fuera del SSOT
 *   501 → plataforma OAuth sin conector registrado todavía (W53_T07..W53_T11)
 *   503 → sin `CAREER_OAUTH_STATE_SECRET`: no se firma nada
 */
import { NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';
import {
  OAuthFlowError,
  startConnect,
  toOAuthFlowError,
  type OAuthPersistHandle,
  type OAuthProviderAdapter,
} from '@/lib/career/oauth-flow';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * Registro de adaptadores OAuth disponibles hoy. VACÍO a propósito: los
 * conectores reales llegan en W53_T07..W53_T11. Una plataforma sin adaptador
 * responde 501 — nunca un redirect a un proveedor que no está cableado (AF-2).
 */
const OAUTH_ADAPTERS = new Map<string, OAuthProviderAdapter>();

function resolveAdapter(platformId: string): OAuthProviderAdapter | null {
  return OAUTH_ADAPTERS.get(platformId) ?? null;
}

/** Handle de persistencia sobre el cliente Prisma canónico (select quirúrgico). */
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
  const artistId = new URL(request.url).searchParams.get('artist') ?? '';

  try {
    const result = startConnect(provider, artistId, {
      requestUrl: request.url,
      deps: { adapters: resolveAdapter, client: prismaHandle() },
    });
    // 302 con Cache-Control no-store: un state no se sirve jamás desde caché.
    return NextResponse.redirect(result.location, {
      status: 302,
      headers: { 'Cache-Control': 'no-store', 'Referrer-Policy': 'no-referrer' },
    });
  } catch (error) {
    const flowError: OAuthFlowError = toOAuthFlowError(error);
    return NextResponse.json(
      {
        status: 'error',
        code: flowError.code,
        platformId: provider,
        checkedAt: new Date().toISOString(),
      },
      { status: flowError.httpStatus, headers: { 'Cache-Control': 'no-store' } },
    );
  }
}

export function POST(): NextResponse {
  return NextResponse.json(
    { status: 'error', code: 'METHOD_NOT_ALLOWED' },
    { status: 405, headers: { Allow: 'GET' } },
  );
}

export { OAuthFlowError };
