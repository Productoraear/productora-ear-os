import { NextResponse } from "next/server";
import {
  EAR_BASE,
  buildRescueQuote,
  type GeoPoint,
} from "@/lib/logistics/rescueFleetEngine";
import { consumeRateLimit } from "@/lib/security/rateLimitGuard";

export const runtime = "nodejs";

type SosDispatchBody = {
  destination?: GeoPoint;
  requiredVolumeM3?: number;
  requiredWeightKg?: number;
  extraPax?: number;
};

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function isGeoPoint(value: unknown): value is GeoPoint {
  if (!value || typeof value !== "object") return false;
  const point = value as GeoPoint;
  return (
    isFiniteNumber(point.lat) &&
    isFiniteNumber(point.lng) &&
    point.lat >= -90 &&
    point.lat <= 90 &&
    point.lng >= -180 &&
    point.lng <= 180
  );
}

export async function POST(request: Request) {
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
        headers: { "Retry-After": String(Math.ceil(guard.retryAfterMs / 1000)) },
      }
    );
  }

  let body: SosDispatchBody;
  try {
    body = (await request.json()) as SosDispatchBody;
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: "Cuerpo JSON inválido. Envía destination, requiredVolumeM3 y requiredWeightKg.",
      },
      { status: 400 }
    );
  }

  if (!isGeoPoint(body.destination)) {
    return NextResponse.json(
      {
        success: false,
        error: "destination.lat y destination.lng son obligatorios y deben ser coordenadas válidas.",
      },
      { status: 422 }
    );
  }

  if (
    !isFiniteNumber(body.requiredVolumeM3) ||
    body.requiredVolumeM3 < 0 ||
    !isFiniteNumber(body.requiredWeightKg) ||
    body.requiredWeightKg < 0
  ) {
    return NextResponse.json(
      {
        success: false,
        error: "requiredVolumeM3 y requiredWeightKg son obligatorios y no pueden ser negativos.",
      },
      { status: 422 }
    );
  }

  const quote = buildRescueQuote({
    origin: EAR_BASE,
    destination: body.destination,
    requiredVolumeM3: body.requiredVolumeM3,
    requiredWeightKg: body.requiredWeightKg,
    extraPax: isFiniteNumber(body.extraPax) ? body.extraPax : 0,
  });

  if (!quote) {
    return NextResponse.json(
      {
        success: false,
        error: "El volumen o peso solicitados exceden la flota EAR SOS disponible.",
      },
      { status: 422 }
    );
  }

  return NextResponse.json({
    success: true,
    rateLimit: {
      remaining: guard.remaining,
    },
    quote,
  });
}