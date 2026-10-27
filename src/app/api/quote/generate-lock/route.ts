/**
 * EAR OS — GENERATE PRICE-LOCK (SHA-256) · W23_T02 (omega n8n)
 * ==================================================================
 * Genera el cierre hermético Price-Lock SHA-256 (depósito Stripe 100 €,
 * deducible 100%) y dispara en FIRE-AND-FORGET el webhook n8n
 * `b2b-quote` con el payload enriquecido (lead + referencia + sello),
 * garantizando que NINGÚN lead quede huérfano (Scorecard Ω 20/20).
 */

import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { ACG_ARTIST_OFFERS } from '@/lib/acg/acgDecisionEngine';
import { fireAndForgetN8n } from '@/lib/services/n8n-dispatcher';
import { computeSovereignLogistics, DEPOSITO_STRIPE } from '@/lib/pricing/sovereign-pricing';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * EAR OS — PRICE-LOCK SHA-256 (INMUTABLE)
 * ==================================================================
 * Firma canónica del depósito de 100 €. Reglas inmutables:
 * - Formato: catálogo ACG_SSOT (solista-edwin-agudelo 350 € / dúo 480 € /
 *   quinteto 750 €). NUNCA fallback silencioso a un índice por accidente.
 * - Logística: 1,50 €/km desde Méntrida a partir del km 50 (motor canónico
 *   `computeSovereignLogistics`).
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

    // 2. Cálculo SSOT alineado con el motor canónico de logística (franquicia 50 km + hotel).
    const logistics = computeSovereignLogistics(distanceKm, endHour);
    const kmLogisticsCost = logistics.travelCost;
    const hotelSurcharge = logistics.hotelSupplement;
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

    // Despacho fire-and-forget a n8n para no dejar leads huérfanos (Scorecard Ω 20/20)
    fireAndForgetN8n('b2b-quote', {
      formatId: currentFormat.id,
      formatName: currentFormat.name,
      distanceKm,
      endHour,
      eventDate,
      totalPrice: totalBaseBeforeVat,
      depositAmount: DEPOSITO_STRIPE,
      priceLockHash,
      timestamp: new Date().toISOString(),
    });

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