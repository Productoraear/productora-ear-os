import { NextResponse } from "next/server";
import crypto from "node:crypto";

export const runtime = "nodejs";

type SongTier = "standard_49" | "cinematic_99";

const TIER_PRICING: Record<SongTier, { amountCents: number; currency: string; label: string }> = {
  standard_49: {
    amountCents: 4900,
    currency: "eur",
    label: "Canción Personalizada Estándar",
  },
  cinematic_99: {
    amountCents: 9900,
    currency: "eur",
    label: "Canción + Videoclip Cinemático",
  },
};

function buildPriceLock(tier: SongTier, timestamp: string): string {
  const payload = `${tier}:${TIER_PRICING[tier].amountCents}:${timestamp}`;
  return crypto.createHash("sha256").update(payload).digest("hex");
}

export async function POST(request: Request) {
  let body: { songTier?: unknown; details?: unknown };

  try {
    body = (await request.json()) as { songTier?: unknown; details?: unknown };
  } catch {
    return NextResponse.json(
      { error: "Cuerpo JSON inválido. Envía { songTier, details }." },
      { status: 400 }
    );
  }

  const { songTier, details = {} } = body;

  if (songTier !== "standard_49" && songTier !== "cinematic_99") {
    return NextResponse.json(
      { error: "songTier inválido. Usa 'standard_49' o 'cinematic_99'." },
      { status: 422 }
    );
  }

  const tier = songTier;
  const timestamp = new Date().toISOString();
  const paymentIntentId = `pi_${crypto.randomBytes(12).toString("hex")}`;
  const priceLock = buildPriceLock(tier, timestamp);

  // Respuesta segura: nunca exponemos STRIPE_SECRET_KEY al cliente.
  return NextResponse.json({
    ok: true,
    checkout: {
      clientSecret: paymentIntentId,
      amountCents: TIER_PRICING[tier].amountCents,
      amountEur: TIER_PRICING[tier].amountCents / 100,
      currency: TIER_PRICING[tier].currency,
      label: TIER_PRICING[tier].label,
      songTier: tier,
      priceLock,
      validFrom: timestamp,
      validThrough: new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString(),
      depositPriceLockEur: 100,
      splitSoberano: { artista: "80%", earOs: "10%", vimume: "10%" },
      details,
    },
  });
}