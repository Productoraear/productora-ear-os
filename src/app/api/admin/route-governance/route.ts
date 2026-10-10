import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { z } from 'zod';
import routeGovernance from '@/data/governance/route_visibility.json';
import { requireAdmin } from '@/lib/security/adminGuard';

/**
 * 🛡️ API HANDLER: GET / POST /api/admin/route-governance
 * Permite al Administrador consultar y alternar en caliente qué URLs
 * son accesibles para el público y cuáles quedan blindadas en exclusiva para el Administrador.
 *
 * S-Class Hardening:
 *  - Validación estricta de inputs con Zod (path + isPublic).
 *  - try/catch global en ambos handlers.
 *  - Headers de seguridad (no-store, nosniff, DENY).
 *  - Respuestas tipadas (ApiResponse<T>) sin `any`.
 */

// ─────────────────────────────────────────────────────────────
// Tipos estrictos
// ─────────────────────────────────────────────────────────────

interface GovernanceRoute {
  path: string;
  isPublic: boolean;
  [key: string]: unknown;
}

interface GovernanceMeta {
  updatedAt: string;
  [key: string]: unknown;
}

interface GovernanceCatalog {
  routes: GovernanceRoute[];
  governance: GovernanceMeta;
  [key: string]: unknown;
}

type ApiSuccess<T> = {
  success: true;
  data?: T;
  message?: string;
  updatedRoute?: T;
};

type ApiFailure = {
  success: false;
  error: string;
  details?: unknown;
};

type ApiResponse<T> = ApiSuccess<T> | ApiFailure;

// ─────────────────────────────────────────────────────────────
// Esquema de validación
// ─────────────────────────────────────────────────────────────

const RouteGovernanceUpdateSchema = z.object({
  path: z
    .string({ message: 'El campo "path" es obligatorio y debe ser string.' })
    .trim()
    .min(1, 'El campo "path" no puede estar vacío.')
    .max(512, 'El campo "path" excede la longitud máxima permitida.')
    .refine((value) => value.startsWith('/'), {
      message: 'El campo "path" debe comenzar con "/".',
    }),
  isPublic: z.boolean({
    message: 'El campo "isPublic" es obligatorio y debe ser boolean.',
  }),
});

type RouteGovernanceUpdateInput = z.infer<typeof RouteGovernanceUpdateSchema>;

// ─────────────────────────────────────────────────────────────
// Headers de seguridad
// ─────────────────────────────────────────────────────────────

const SECURITY_HEADERS: Record<string, string> = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'no-referrer',
};

function jsonResponse<T>(
  payload: ApiResponse<T>,
  status = 200
): NextResponse<ApiResponse<T>> {
  return NextResponse.json<ApiResponse<T>>(payload, {
    status,
    headers: SECURITY_HEADERS,
  }) as NextResponse<ApiResponse<T>>;
}

// ─────────────────────────────────────────────────────────────
// Handlers
// ─────────────────────────────────────────────────────────────

export async function GET(
  request: NextRequest
): Promise<NextResponse<ApiResponse<GovernanceCatalog>>> {
  try {
    const auth = await requireAdmin(request);
    if (!auth.ok) {
      return auth.response as unknown as NextResponse<
        ApiResponse<GovernanceCatalog>
      >;
    }

    const catalog = routeGovernance as unknown as GovernanceCatalog;

    return jsonResponse<GovernanceCatalog>({
      success: true,
      data: catalog,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : 'Error al consultar la gobernanza de rutas.';

    return jsonResponse<GovernanceCatalog>(
      { success: false, error: message },
      500
    );
  }
}

export async function POST(
  request: NextRequest
): Promise<NextResponse<ApiResponse<GovernanceRoute>>> {
  try {
    const auth = await requireAdmin(request);
    if (!auth.ok) {
      return auth.response as unknown as NextResponse<
        ApiResponse<GovernanceRoute>
      >;
    }

    // ── Parseo seguro del body ────────────────────────────────
    let rawBody: unknown;
    try {
      rawBody = await request.json();
    } catch {
      return jsonResponse<GovernanceRoute>(
        { success: false, error: 'Body JSON inválido o malformado.' },
        400
      );
    }

    // ── Validación estricta con Zod ───────────────────────────
    const parsed = RouteGovernanceUpdateSchema.safeParse(rawBody);
    if (!parsed.success) {
      return jsonResponse<GovernanceRoute>(
        {
          success: false,
          error:
            'Parámetros inválidos. Se requiere path (string que inicie con "/") e isPublic (boolean).',
          details: parsed.error.flatten(),
        },
        400
      );
    }

    const { path, isPublic }: RouteGovernanceUpdateInput = parsed.data;

    // ── Localizar la ruta en el catálogo ──────────────────────
    const catalog = routeGovernance as unknown as GovernanceCatalog;
    const routeIndex = catalog.routes.findIndex((r) => r.path === path);

    if (routeIndex === -1) {
      return jsonResponse<GovernanceRoute>(
        {
          success: false,
          error: `La ruta ${path} no está registrada en el catálogo de gobernanza.`,
        },
        404
      );
    }

    // ── Actualización en memoria ──────────────────────────────
    catalog.routes[routeIndex].isPublic = isPublic;
    catalog.governance.updatedAt = new Date().toISOString();

    const updatedRoute = catalog.routes[routeIndex];

    return jsonResponse<GovernanceRoute>({
      success: true,
      message: `Visibilidad de ${path} actualizada a: ${
        isPublic ? 'PÚBLICA' : 'SOLO_ADMINISTRADOR'
      }`,
      updatedRoute,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : 'Error al actualizar gobernanza de rutas.';

    return jsonResponse<GovernanceRoute>(
      { success: false, error: message },
      500
    );
  }
}