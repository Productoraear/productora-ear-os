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
import { CENTRALITA_EAR_OS, VAT_RATE } from '@/lib/constants/ear-os-ssot';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * EAR OS — PRICE-LOCK SHA-256 (INMUTABLE)
 * ==================================================================
 * Firma canónica del depósito de 100 €. Reglas inmutables:
 * - Formato: catálogo ACG_SSOT (solista-edwin-agudelo 350 € / dúo 480 € /
 *   quinteto 750 €). NUNCA fallback silencioso a un índice por accidente.
 * - Logística: 1,50 €/km desde Méntrida a partir del km 100 de franquicia
 *   (`LOGISTICA_KM_EXENTOS`, motor canónico `computeSovereignLogistics`).
 * - Suplemento hotelero: +120 € si hora fin >= 03:00 AM o distancia > 200 km.
 * - Secreto HMAC: exclusivamente `process.env.STRIPE_SECRET_KEY`.
 *   Sin secreto no hay firma. PROHIBIDO cualquier fallback hardcodeado.
 */
export async function POST(req: Request) {
  try {
    // ASVS L3 §5.1: el body es input NO confiable. Sin este control propio, un
    // JSON malformado escapaba al catch genérico y respondía 500 (excepción no
    // controlada). Aquí se declara 400 antes de tocar nada más.
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: 'INVALID_JSON', detail: 'El body debe ser JSON válido.' },
        { status: 400 },
      );
    }

    if (typeof body !== 'object' || body === null) {
      return NextResponse.json(
        { error: 'INVALID_BODY', detail: 'El body debe ser un objeto JSON.' },
        { status: 400 },
      );
    }

    const {
      formatId,
      distanceKm,
      eventDate,
      endHour = 2,
      clientName,
      clientPhone,
      eventType,
      location,
    }: {
      formatId: string;
      distanceKm: number;
      eventDate: string;
      endHour?: number;
      clientName?: string;
      clientPhone?: string;
      eventType?: string;
      location?: string;
    } = body as {
      formatId: string;
      distanceKm: number;
      eventDate: string;
      endHour?: number;
      clientName?: string;
      clientPhone?: string;
      eventType?: string;
      location?: string;
    };

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

    // 2. Cálculo SSOT alineado con el motor canónico de logística (franquicia 100 km + hotel).
    const logistics = computeSovereignLogistics(distanceKm, endHour);
    const kmLogisticsCost = logistics.travelCost;
    const hotelSurcharge = logistics.hotelSupplement;
    const totalBaseBeforeVat =
      Math.round((currentFormat.basePriceEur + kmLogisticsCost + hotelSurcharge) * 100) / 100;

    // 2.b Desglose fiscal SSOT: IVA general español aplicado sobre la base imponible.
    //     Misma fórmula que el terminal de presupuesto (`checkout/presupuesto`).
    const vatAmount = Math.round(totalBaseBeforeVat * VAT_RATE * 100) / 100;
    const totalWithVat = Math.round((totalBaseBeforeVat + vatAmount) * 100) / 100;

    // 2.c Identidad del lead + trazabilidad (n8n exige `quoteId` para no dejar
    //     huérfano ningún expediente). Se acuña server-side, nunca en cliente.
    const quoteId = `QL-${Date.now().toString(36).toUpperCase()}-${crypto
      .randomBytes(3)
      .toString('hex')
      .toUpperCase()}`;

    // 2.d Normalización de los campos del contrato n8n. Los emisores históricos
    //     (ACG Price-Lock / checkout) aún no los envían: se resuelven con los
    //     valores canónicos del SSOT y NUNCA con PII inventada. La atención
    //     telefónica recae en la Centralita oficial (INV-12).
    const normalizedClientName =
      typeof clientName === 'string' && clientName.trim() !== ''
        ? clientName.trim()
        : 'Cliente Directo EAR OS';
    const normalizedClientPhone =
      typeof clientPhone === 'string' && clientPhone.trim() !== ''
        ? clientPhone.trim()
        : CENTRALITA_EAR_OS;
    const normalizedEventType =
      typeof eventType === 'string' && eventType.trim() !== '' ? eventType.trim() : 'particular';
    const normalizedLocation =
      typeof location === 'string' && location.trim() !== '' ? location.trim() : 'Pendiente de confirmar';

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
    // CONTRATO CANÓNICO (7 gates): los 6 campos `required` del formateador n8n
    // (clientName, clientPhone, eventType, eventDate, location, distanceKm) más
    // `quoteId` y `totalWithVat` viajan SIEMPRE. Un solo contrato, cinco emisores.
    fireAndForgetN8n('b2b-quote', {
      // ── Contrato obligatorio del nodo Code de n8n ──────────────────────────
      clientName: normalizedClientName,
      clientPhone: normalizedClientPhone,
      eventType: normalizedEventType,
      eventDate,
      location: normalizedLocation,
      distanceKm,
      // ── Trazabilidad y desglose fiscal SSOT ───────────────────────────────
      quoteId,
      totalWithVat,
      // ── Identidad tarifaria y sello Price-Lock ────────────────────────────
      couponApplied: false,
      formatId: currentFormat.id,
      formatName: currentFormat.name,
      endHour,
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