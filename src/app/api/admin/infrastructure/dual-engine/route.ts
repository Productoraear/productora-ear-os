import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getDualEngineSystemStatus } from '@/lib/infrastructure/hostinger-dual-engine';
import { requireAdmin } from '@/lib/security/adminGuard';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * W02-API-007 · SECURITY API HARDENING
 * Endpoint: GET /api/admin/infrastructure/dual-engine
 * - Auth: requireAdmin (Bearer / session)
 * - Input: sin query params requeridos; se rechaza cualquier query no permitida
 * - Output: respuesta tipada y sellada
 * - Headers: no-store + hardening
 */

const ALLOWED_QUERY_KEYS = new Set<string>([]);

const QuerySchema = z
  .object({})
  .strict();

type DualEngineStatusPayload = Awaited<ReturnType<typeof getDualEngineSystemStatus>>;

type SuccessResponse = {
  success: true;
  data: DualEngineStatusPayload;
  meta: {
    endpoint: string;
    timestamp: string;
  };
};

type ErrorResponse = {
  success: false;
  error: {
    code: string;
    message: string;
  };
  meta: {
    endpoint: string;
    timestamp: string;
  };
};

const SECURITY_HEADERS: Record<string, string> = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
  Pragma: 'no-cache',
  Expires: '0',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'no-referrer',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
};

const ENDPOINT = '/api/admin/infrastructure/dual-engine';

function jsonResponse<T extends SuccessResponse | ErrorResponse>(
  body: T,
  status: number,
): NextResponse<T> {
  return NextResponse.json<T>(body, {
    status,
    headers: SECURITY_HEADERS,
  });
}

function buildError(
  code: string,
  message: string,
): ErrorResponse {
  return {
    success: false,
    error: { code, message },
    meta: {
      endpoint: ENDPOINT,
      timestamp: new Date().toISOString(),
    },
  };
}

function sanitizeQuery(url: URL): { ok: true } | { ok: false; invalidKeys: string[] } {
  const invalidKeys: string[] = [];
  for (const key of url.searchParams.keys()) {
    if (!ALLOWED_QUERY_KEYS.has(key)) {
      invalidKeys.push(key);
    }
  }
  if (invalidKeys.length > 0) {
    return { ok: false, invalidKeys };
  }
  return { ok: true };
}

export async function GET(request: Request): Promise<NextResponse<SuccessResponse | ErrorResponse>> {
  try {
    // 1) Auth gate
    const auth = await requireAdmin(request);
    if (!auth.ok) {
      return auth.response as NextResponse<ErrorResponse>;
    }

    // 2) Input validation (strict: no query params allowed)
    let url: URL;
    try {
      url = new URL(request.url);
    } catch {
      return jsonResponse(
        buildError('INVALID_URL', 'URL de petición inválida.'),
        400,
      );
    }

    const queryCheck = sanitizeQuery(url);
    if (!queryCheck.ok) {
      return jsonResponse(
        buildError(
          'INVALID_QUERY',
          `Parámetros de consulta no permitidos: ${queryCheck.invalidKeys.join(', ')}`,
        ),
        400,
      );
    }

    // Zod strict validation (defensa en profundidad)
    const parsed = QuerySchema.safeParse({});
    if (!parsed.success) {
      return jsonResponse(
        buildError('INVALID_INPUT', 'Payload de consulta inválido.'),
        400,
      );
    }

    // 3) Business logic
    const status = await getDualEngineSystemStatus();

    const payload: SuccessResponse = {
      success: true,
      data: status,
      meta: {
        endpoint: ENDPOINT,
        timestamp: new Date().toISOString(),
      },
    };

    return jsonResponse(payload, 200);
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : 'Error al obtener la telemetría dual de Hostinger';

    console.error('[DUAL ENGINE API ERROR]', {
      endpoint: ENDPOINT,
      message,
      timestamp: new Date().toISOString(),
    });

    return jsonResponse(
      buildError('INTERNAL_ERROR', message),
      500,
    );
  }
}