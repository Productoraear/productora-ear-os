import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import fs from 'fs/promises';
import path from 'path';
import { z } from 'zod';
import { requireAdmin } from '@/lib/security/adminGuard';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const ApprovePayloadSchema = z
  .object({
    target: z.enum(['bio', 'obj'], {
      message: 'Target no válido',
    }),
  })
  .strict();

type ApproveTarget = z.infer<typeof ApprovePayloadSchema>['target'];

interface ApproveSuccessResponse {
  success: true;
  message: string;
  target: ApproveTarget;
  timestamp: string;
}

interface ApproveErrorResponse {
  success: false;
  error: string;
  code: string;
}

const SECURITY_HEADERS: Record<string, string> = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
  Pragma: 'no-cache',
  Expires: '0',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'no-referrer',
  'X-EAR-Operation': 'oraculo-approve',
};

const TARGET_MAP: Record<ApproveTarget, { draft: string; prod: string }> = {
  bio: {
    draft: 'edwin-true-bio-ssot_draft.json',
    prod: 'edwin-true-bio-ssot.json',
  },
  obj: {
    draft: 'oraculo-300-objeciones-ssot_draft.json',
    prod: 'oraculo-300-objeciones-ssot.json',
  },
};

const REVALIDATE_PATHS: readonly string[] = [
  '/artistas/edwin-agudelo',
  '/vimume',
  '/admin/oraculo/aprobaciones',
];

function jsonResponse<T extends object>(
  body: T,
  status: number,
): NextResponse<T> {
  return NextResponse.json<T>(body, {
    status,
    headers: SECURITY_HEADERS,
  });
}

function errorResponse(
  code: string,
  error: string,
  status: number,
): NextResponse<ApproveErrorResponse> {
  return jsonResponse<ApproveErrorResponse>(
    { success: false, error, code },
    status,
  );
}

function isNodeError(value: unknown): value is NodeJS.ErrnoException {
  return (
    typeof value === 'object' &&
    value !== null &&
    'code' in value &&
    typeof (value as { code?: unknown }).code === 'string'
  );
}

export async function POST(req: Request): Promise<NextResponse> {
  try {
    const auth = await requireAdmin(req);
    if (!auth.ok) {
      return auth.response;
    }

    let rawBody: unknown;
    try {
      rawBody = await req.json();
    } catch {
      return errorResponse(
        'INVALID_JSON',
        'Payload JSON inválido o vacío.',
        400,
      );
    }

    const parsed = ApprovePayloadSchema.safeParse(rawBody);
    if (!parsed.success) {
      const firstIssue = parsed.error.issues[0];
      return errorResponse(
        'VALIDATION_ERROR',
        firstIssue?.message ?? 'Payload inválido.',
        400,
      );
    }

    const { target } = parsed.data;
    const paths = TARGET_MAP[target];
    const basePath = path.join(process.cwd(), 'src', 'data');
    const draftPath = path.join(basePath, paths.draft);
    const prodPath = path.join(basePath, paths.prod);

    try {
      await fs.access(draftPath, fs.constants.R_OK);
    } catch (accessError: unknown) {
      if (isNodeError(accessError) && accessError.code === 'ENOENT') {
        return errorResponse(
          'DRAFT_NOT_FOUND',
          'Borrador no encontrado.',
          404,
        );
      }
      return errorResponse(
        'DRAFT_ACCESS_DENIED',
        'No se pudo acceder al borrador.',
        500,
      );
    }

    let parsedData: Record<string, unknown>;
    try {
      const raw = await fs.readFile(draftPath, 'utf-8');
      const decoded: unknown = JSON.parse(raw);
      if (
        typeof decoded !== 'object' ||
        decoded === null ||
        Array.isArray(decoded)
      ) {
        return errorResponse(
          'DRAFT_MALFORMED',
          'El borrador no contiene un objeto JSON válido.',
          422,
        );
      }
      parsedData = decoded as Record<string, unknown>;
    } catch {
      return errorResponse(
        'DRAFT_PARSE_ERROR',
        'No se pudo parsear el borrador JSON.',
        422,
      );
    }

    parsedData.status = 'PRODUCTION';
    parsedData.approvedAt = new Date().toISOString();

    try {
      await fs.writeFile(
        prodPath,
        JSON.stringify(parsedData, null, 2),
        'utf-8',
      );
      await fs.unlink(draftPath);
    } catch {
      return errorResponse(
        'PROMOTION_FAILED',
        'Fallo al promover el borrador a producción.',
        500,
      );
    }

    for (const route of REVALIDATE_PATHS) {
      try {
        revalidatePath(route);
      } catch {
        // Revalidación best-effort: no bloquea la respuesta.
      }
    }

    const successBody: ApproveSuccessResponse = {
      success: true,
      message: `Borrador ${target} sellado a Producción.`,
      target,
      timestamp: new Date().toISOString(),
    };

    return jsonResponse<ApproveSuccessResponse>(successBody, 200);
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Error interno desconocido.';
    return errorResponse('INTERNAL_ERROR', message, 500);
  }
}