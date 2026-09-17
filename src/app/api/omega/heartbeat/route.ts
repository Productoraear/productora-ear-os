import { NextResponse } from "next/server";
import { getOmegaSystemStatus } from "@/lib/omega/omegaOmniOrchestrator";
import { consumeRateLimit } from "@/lib/security/rateLimitGuard";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  // Rate limit: 20 req/min por IP (token-bucket en memoria).
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    null;

  const guard = consumeRateLimit(ip);
  if (!guard.allowed) {
    return NextResponse.json(
      {
        success: false,
        error: "Límite de peticiones alcanzado. Espera un momento y reintenta.",
        retryAfterMs: guard.retryAfterMs,
      },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.ceil(guard.retryAfterMs / 1000)),
          "Cache-Control": "no-store",
        },
      },
    );
  }

  const matrix = await getOmegaSystemStatus();

  return NextResponse.json(
    {
      success: true,
      rateLimit: {
        remaining: guard.remaining,
      },
      ...matrix,
    },
    {
      status: 200,
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    },
  );
}