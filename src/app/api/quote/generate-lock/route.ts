import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { ACG_ARTIST_OFFERS } from '@/lib/acg/acgDecisionEngine';

/**
 * EAR OS — PRICE-LOCK SHA-256 (INMUTABLE)
 * ==================================================================
 * Firma canónica del depósito de 100 €. Reglas inmutables:
 * - Formato: catálogo ACG_SSOT (solista-edwin-agudelo 350 € / dúo 480 € /
 *   quinteto 750 €). NUNCA fallback silencioso a un índice por accidente.
 * - Logística: 1,50 €/km desde Méntrida a partir del km 50.
 * - Suplemento hotelero: +120 € si hora fin >= 03:00 AM o distancia > 200 km.
 * - Secreto HMAC: exclusivamente `process.env.STRIPE_SECRET_KEY`.
 *   Sin secreto no hay firma. PROHIBIDO cualquier fallback hardcodeado.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      formatId,
      distanceKm,
      eventDate,
      endHour = 2,
    }: {
      formatId: string;
      distanceKm: number;
      eventDate: string;
      endHour?: number;
    } = body;

    // 1. Validación SSOT de formato (fuente única de verdad).
    const currentFormat = ACG_ARTIST_OFFERS.find((f) => f.id === formatId);
    if (!currentFormat) {
      return NextResponse.json(
        {
          error: 'FORMAT_NOT_FOUND',
          detail: `Formato "${formatId}" no existe en ACG_SSOT.`,
        },
        { status: 400 },
      );
    }

    if (typeof distanceKm !== 'number' || !Number.isFinite(distanceKm) || distanceKm < 0) {
      return NextResponse.json(
        { error: 'INVALID_DISTANCE', detail: 'distanceKm debe ser un número >= 0.' },
        { status: 400 },
      );
    }

    if (!eventDate || typeof eventDate !== 'string') {
      return NextResponse.json(
        { error: 'INVALID_EVENT_DATE', detail: 'eventDate es obligatorio (YYYY-MM-DD).' },
        { status: 400 },
      );
    }

    // 2. Cálculo SSOT alineado con acgDecisionEngine.calculateLogisticsAcg.
    const billableKm = Math.max(0, distanceKm - 50);
    const kmLogisticsCost = Math.round(billableKm * 1.5 * 100) / 100;
    const hotelSurcharge = distanceKm > 200 || endHour >= 3 ? 120 : 0;
    const totalBaseBeforeVat =
      Math.round((currentFormat.basePriceEur + kmLogisticsCost + hotelSurcharge) * 100) / 100;

    // 3. INMUTABILIDAD CRIPTOGRÁFICA: sin secreto no se emite firma.
    const secret = process.env.STRIPE_SECRET_KEY;
    if (!secret) {
      return NextResponse.json(
        { error: 'SIGNING_KEY_MISSING' },
        { status: 503 },
      );
    }

    const rawData = `${formatId}-${distanceKm}-${endHour}-${totalBaseBeforeVat}-${eventDate}`;
    const hmac = crypto
      .createHmac('sha256', secret)
      .update(rawData)
      .digest('hex')
      .toUpperCase();

    const priceLockHash = `SHA256-Ω-${hmac.substring(0, 16)}`;

    return NextResponse.json({
      priceLockHash,
      calculatedBase: totalBaseBeforeVat,
      formatId: currentFormat.id,
      status: 'SECURE',
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'UNKNOWN_ERROR';
    return NextResponse.json(
      { error: 'HASH_GENERATION_FAILED', detail: message },
      { status: 500 },
    );
  }
}