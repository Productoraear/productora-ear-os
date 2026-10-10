import { NextResponse } from 'next/server';
import { z } from 'zod';
import { rankArtist } from '@/lib/astra-intelligence';
import { requireAdmin } from '@/lib/security/adminGuard';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const SECURITY_HEADERS: Record<string, string> = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'no-referrer',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
};

const ArtistIdSchema = z
  .string()
  .trim()
  .min(1, 'artistId is required')
  .max(128, 'artistId too long')
  .regex(/^[a-zA-Z0-9_\-:.]+$/, 'artistId contains invalid characters');

const QuerySchema = z.object({
  artistId: ArtistIdSchema.optional(),
});

type DemandMapResponse = {
  ok: true;
  data: unknown;
};

type ErrorResponse = {
  ok: false;
  error: string;
  details?: unknown;
};

function jsonResponse<T extends DemandMapResponse | ErrorResponse>(
  body: T,
  status = 200,
): NextResponse<T> {
  return NextResponse.json<T>(body, {
    status,
    headers: SECURITY_HEADERS,
  });
}

export async function GET(request: Request): Promise<NextResponse> {
  try {
    const auth = await requireAdmin(request);
    if (!auth.ok) {
      const response = auth.response;
      for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
        response.headers.set(key, value);
      }
      return response;
    }

    let rawArtistId: string | null = null;
    try {
      const url = new URL(request.url);
      rawArtistId = url.searchParams.get('artistId');
    } catch {
      return jsonResponse<ErrorResponse>(
        { ok: false, error: 'Malformed request URL' },
        400,
      );
    }

    const parsed = QuerySchema.safeParse({
      artistId: rawArtistId ?? undefined,
    });

    if (!parsed.success) {
      return jsonResponse<ErrorResponse>(
        {
          ok: false,
          error: 'Invalid query parameters',
          details: parsed.error.flatten(),
        },
        400,
      );
    }

    const artistId = parsed.data.artistId ?? 'some_artist_id';

    const demandMap = await rankArtist(artistId);

    return jsonResponse<DemandMapResponse>({ ok: true, data: demandMap }, 200);
  } catch (error) {
    console.error('[admin/demand-map] Unhandled error:', error);
    return jsonResponse<ErrorResponse>(
      { ok: false, error: 'Failed to fetch demand map' },
      500,
    );
  }
}