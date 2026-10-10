import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getActiveWhitelist, toggleProviderVisibility } from '@/lib/providers/visibility';
import { requireAdmin } from '@/lib/security/adminGuard';

export const dynamic = 'force-dynamic';

const SECURITY_HEADERS: Record<string, string> = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
  'Pragma': 'no-cache',
  'Expires': '0',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'no-referrer',
};

const ToggleVisibilitySchema = z
  .object({
    id: z.string().trim().min(1).max(128).optional(),
    slug: z.string().trim().min(1).max(128).optional(),
    active: z.boolean().optional(),
  })
  .refine((data) => Boolean(data.id) || Boolean(data.slug), {
    message: 'Se requiere id o slug del proveedor',
    path: ['id'],
  });

type ToggleVisibilityInput = z.infer<typeof ToggleVisibilitySchema>;

interface WhitelistResponse {
  success: true;
  data: unknown;
}

interface ToggleResponse {
  success: boolean;
  active?: boolean;
  providerId: string;
  active_ids?: unknown;
}

interface ErrorResponse {
  success: false;
  error: string;
  details?: unknown;
}

function jsonResponse<T>(body: T, status = 200): NextResponse<T> {
  return NextResponse.json<T>(body, {
    status,
    headers: SECURITY_HEADERS,
  });
}

function extractErrorMessage(err: unknown, fallback: string): string {
  if (err instanceof Error && err.message) return err.message;
  if (typeof err === 'string' && err.length > 0) return err;
  return fallback;
}

export async function GET(request: Request): Promise<NextResponse> {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

  try {
    const whitelist = getActiveWhitelist();
    const payload: WhitelistResponse = {
      success: true,
      data: whitelist,
    };
    return jsonResponse(payload, 200);
  } catch (err: unknown) {
    const payload: ErrorResponse = {
      success: false,
      error: extractErrorMessage(err, 'Error al obtener la whitelist de proveedores'),
    };
    return jsonResponse(payload, 500);
  }
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const auth = await requireAdmin(req);
  if (!auth.ok) return auth.response;

  try {
    let rawBody: unknown;
    try {
      rawBody = await req.json();
    } catch {
      const payload: ErrorResponse = {
        success: false,
        error: 'JSON inválido en el cuerpo de la solicitud',
      };
      return jsonResponse(payload, 400);
    }

    const parsed = ToggleVisibilitySchema.safeParse(rawBody);
    if (!parsed.success) {
      const payload: ErrorResponse = {
        success: false,
        error: 'Payload inválido',
        details: parsed.error.flatten(),
      };
      return jsonResponse(payload, 400);
    }

    const { id, slug, active }: ToggleVisibilityInput = parsed.data;
    const targetId = id ?? slug;

    if (!targetId) {
      const payload: ErrorResponse = {
        success: false,
        error: 'Se requiere id o slug del proveedor',
      };
      return jsonResponse(payload, 400);
    }

    const result = toggleProviderVisibility(targetId, slug, active);

    const payload: ToggleResponse = {
      success: result.success,
      active: result.active,
      providerId: targetId,
      active_ids: result.active_ids,
    };

    return jsonResponse(payload, result.success ? 200 : 400);
  } catch (err: unknown) {
    const payload: ErrorResponse = {
      success: false,
      error: extractErrorMessage(err, 'Error al actualizar visibilidad'),
    };
    return jsonResponse(payload, 500);
  }
}