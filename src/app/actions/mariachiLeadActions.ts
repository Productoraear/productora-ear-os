"use server";

import { createHash } from "crypto";
import { z } from "zod";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";
import { isRateLimited } from "@/lib/security/shield";
import { createCheckoutSession } from "@/lib/payments";
import { listActiveAffiliateCoupons } from "@/lib/affiliate/affiliate-registry";
import {
  buildMariachiWhatsAppExpressUrl,
  CENTRALITA_TEL_HREF,
  evaluateExpressMariachiQuote,
} from "@/lib/mariachi/centralita-call-to-cash";

/**
 * ════════════════════════════════════════════════════════════════════════════
 * EAR OS — AUTOMATIZACIÓN DE LEADS MARIACHI & CIERRE ATÓMICO (DIRECTIVA v5 PASO 3)
 * ════════════════════════════════════════════════════════════════════════════
 * En cuanto el cliente envía una solicitud de mariachi o inicia llamada/WhatsApp:
 *  1. Genera registro determinista en PostgreSQL (`leads_mariachi` / `MariachiLead`)
 *     con timestamp, teléfono, municipio, formato y reparto 80/10/10 en céntimos.
 *  2. Dispara alerta instantánea al móvil de operaciones/CEO vía webhook n8n
 *     (`call-center-intake`) + notificación de consola admin con el lead en caliente.
 *  3. Para Edwin Agudelo (Mariachi Solista Premium — 550 € base / 100 km incluidos /
 *     suelo cupón 350 €), permite bloquear la fecha con el 50% vía Stripe Checkout.
 * ════════════════════════════════════════════════════════════════════════════
 */

const N8N_HOT_LEAD_WEBHOOK =
  process.env.N8N_CALL_CENTER_INTAKE_URL ??
  "https://n8n.productoraear.com/webhook/call-center-intake";

const ExpressFormatEnum = z.enum([
  "solista_edwin",
  "trio",
  "cuarteto",
  "agrupacion_completa",
]);

const LeadChannelEnum = z.enum([
  "CALL",
  "WHATSAPP",
  "COTIZACION_ASISTIDA",
  "STRIPE_RESERVA_50",
]);

const LeadInputSchema = z.object({
  phone: z.string().trim().max(32).optional().default(""),
  municipality: z.string().trim().min(1).max(120).default("Madrid"),
  format: ExpressFormatEnum.default("solista_edwin"),
  eventDate: z.string().trim().max(32).optional().default("a convenir"),
  eventTime: z.string().trim().max(16).optional().default("21:00"),
  distanceKm: z.number().finite().min(0).max(2000).optional().default(0),
  endHour: z.number().int().min(0).max(23).optional().default(2),
  couponCode: z.string().trim().max(40).optional().default(""),
  channel: LeadChannelEnum.default("WHATSAPP"),
  forceAssistedQuote: z.boolean().optional().default(false),
});

export type MariachiCallToCashLeadResult =
  | {
      readonly ok: true;
      readonly leadId: string;
      readonly leadHash: string;
      readonly persistedInPostgres: boolean;
      readonly alertDispatched: boolean;
      readonly whatsappExpressUrl: string;
      readonly centralitaTelHref: string;
      readonly timestamp: string;
    }
  | {
      readonly ok: false;
      readonly error: string;
    };

export type EdwinSolista50PctCheckoutResult =
  | {
      readonly ok: true;
      readonly url: string;
      readonly sessionId: string;
      readonly leadId: string;
      readonly totalEur: number;
      readonly deposit50PctEur: number;
      readonly couponApplied: string | null;
    }
  | {
      readonly ok: false;
      readonly error: string;
    };

async function resolveClientIp(): Promise<string> {
  try {
    const h = await headers();
    return (
      h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      h.get("x-real-ip") ||
      "127.0.0.1"
    );
  } catch {
    return "127.0.0.1";
  }
}

function sanitizeText(raw: string): string {
  return raw.replace(/[\u0000-\u001F\u007F<>]/g, " ").replace(/\s+/g, " ").trim();
}

function computeDeterministicLeadHash(params: {
  phone: string;
  municipality: string;
  format: string;
  eventDate: string;
  eventTime: string;
  channel: string;
  minuteBucket: number;
}): string {
  const canonical = [
    params.phone.toLowerCase(),
    params.municipality.toLowerCase(),
    params.format,
    params.eventDate,
    params.eventTime,
    params.channel,
    String(params.minuteBucket),
  ].join("|");
  return createHash("sha256").update(canonical).digest("hex");
}

async function dispatchCeoMobileHotLeadAlert(
  payload: Record<string, unknown>,
): Promise<boolean> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 4_000);
  try {
    const res = await fetch(N8N_HOT_LEAD_WEBHOOK, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal,
      cache: "no-store",
    });
    return res.ok;
  } catch (err: unknown) {
    logger.warn({
      event: "MARIACHI_HOT_LEAD_WEBHOOK_TIMEOUT_OR_OFFLINE",
      error: String(err),
    });
    return false;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Registra de forma determinista el lead en PostgreSQL (`leads_mariachi`) y
 * dispara la alerta instantánea al móvil de Operaciones/CEO.
 */
export async function registerMariachiCallToCashLead(
  rawInput: unknown,
): Promise<MariachiCallToCashLeadResult> {
  const ip = await resolveClientIp();

  if (isRateLimited(ip, 15, 60_000)) {
    return {
      ok: false,
      error: "RATE_LIMIT_EXCEEDED: Demasiadas solicitudes en un minuto.",
    };
  }

  const parsed = LeadInputSchema.safeParse(rawInput);
  if (!parsed.success) {
    return {
      ok: false,
      error: "VALIDATION_ERROR: Datos de solicitud de mariachi inválidos.",
    };
  }

  const data = parsed.data;
  const municipality = sanitizeText(data.municipality) || "Madrid";
  const phone = sanitizeText(data.phone) || `CLICK_TRACK_${ip}`;
  const eventDate = sanitizeText(data.eventDate) || "a convenir";
  const eventTime = sanitizeText(data.eventTime) || "21:00";

  const affiliates = listActiveAffiliateCoupons();
  const quote = evaluateExpressMariachiQuote({
    formatId: data.format,
    distanceKm: data.distanceKm,
    endHour: data.endHour,
    municipality,
    dateDdMm: eventDate,
    timeHhMm: eventTime,
    couponCode: data.couponCode,
    affiliates,
    forceAssistedQuote: data.forceAssistedQuote,
  });

  const now = new Date();
  const minuteBucket = Math.floor(now.getTime() / 60_000);
  const leadHash = computeDeterministicLeadHash({
    phone,
    municipality,
    format: data.format,
    eventDate: quote.dateDdMm,
    eventTime: quote.timeHhMm,
    channel: data.channel,
    minuteBucket,
  });

  let leadId = `mlead_${leadHash.slice(0, 12)}`;
  let persistedInPostgres = false;

  const alertPayload = {
    event: "MARIACHI_HOT_LEAD_CALL_TO_CASH",
    timestamp: now.toISOString(),
    leadHash,
    channel: data.channel,
    phone,
    municipality,
    formatId: data.format,
    formatTitle: quote.format.title,
    pricingMode: quote.pricingMode,
    isEdwinSoloist: quote.isEdwinSoloist,
    hasClosedPrice: quote.hasClosedPrice,
    eventDate: quote.dateDdMm,
    eventTime: quote.timeHhMm,
    distanceKm: quote.distanceKm,
    totalEur: quote.totalEur,
    depositEur: quote.depositEur,
    splitSoberano: {
      artist80Eur: quote.split.artist80Eur,
      earOs10Eur: quote.split.earOs10Eur,
      vimume10Eur: quote.split.vimume10Eur,
    },
    couponApplied: quote.couponApplied,
    centralitaPhone: "+34 693 693 048",
    whatsappExpressUrl: quote.whatsappExpressUrl,
  };

  const alertDispatched = await dispatchCeoMobileHotLeadAlert(alertPayload);

  try {
    const record = await prisma.mariachiLead.upsert({
      where: { leadHash },
      update: {
        alertDispatched,
        updatedAt: now,
      },
      create: {
        leadHash,
        phone,
        municipality,
        format: data.format,
        eventDate: quote.dateDdMm,
        eventTime: quote.timeHhMm,
        channel: data.channel,
        isEdwinSoloist: quote.isEdwinSoloist,
        hasClosedPrice: quote.hasClosedPrice,
        totalCents: quote.totalCents,
        depositCents: quote.depositCents,
        splitArtistCents: quote.split.artist80Cents,
        splitEarOsCents: quote.split.earOs10Cents,
        splitVimumeCents: quote.split.vimume10Cents,
        couponCode: quote.couponApplied,
        alertDispatched,
      },
      select: { id: true },
    });
    leadId = record.id;
    persistedInPostgres = true;

    await prisma.adminNotification.create({
      data: {
        message: `[LEAD MARIACHI · ${data.channel}] ${quote.format.shortLabel} en ${municipality} (${quote.dateDdMm} ${quote.timeHhMm}) · Tel: ${phone} · Total: ${quote.totalEur !== null ? `${quote.totalEur} €` : "Cotización Asistida"}`,
      },
      select: { id: true },
    });
  } catch (err: unknown) {
    logger.warn({
      event: "MARIACHI_LEAD_POSTGRES_FALLBACK",
      leadHash,
      error: String(err),
    });
  }

  return {
    ok: true,
    leadId,
    leadHash,
    persistedInPostgres,
    alertDispatched,
    whatsappExpressUrl: buildMariachiWhatsAppExpressUrl({
      municipality,
      dateDdMm: quote.dateDdMm,
      timeHhMm: quote.timeHhMm,
    }),
    centralitaTelHref: CENTRALITA_TEL_HREF,
    timestamp: now.toISOString(),
  };
}

/**
 * Reserva inmediata del 50% vía Stripe Checkout para Edwin Agudelo (Mariachi Solista Premium):
 *  - Tarifa base: 550,00 € con 100 km incluidos (1,50 €/km adicional).
 *  - Suelo con cupón de afiliado válido: 350,00 €.
 *  - Señal de bloqueo en Stripe: 50% del total presupuestado (`quote.depositEur`).
 */
export async function checkoutEdwinMariachiSolista50Pct(
  rawInput: unknown,
): Promise<EdwinSolista50PctCheckoutResult> {
  const ip = await resolveClientIp();

  if (isRateLimited(ip, 5, 60_000)) {
    return {
      ok: false,
      error: "RATE_LIMIT_EXCEEDED: Límite de 5 intentos por minuto.",
    };
  }

  const parsed = LeadInputSchema.safeParse(rawInput);
  if (!parsed.success) {
    return {
      ok: false,
      error: "VALIDATION_ERROR: Revisa los datos de ubicación, fecha y formato.",
    };
  }

  const data = parsed.data;
  const municipality = sanitizeText(data.municipality) || "Madrid";
  const affiliates = listActiveAffiliateCoupons();

  const quote = evaluateExpressMariachiQuote({
    formatId: "solista_edwin",
    distanceKm: data.distanceKm,
    endHour: data.endHour,
    municipality,
    dateDdMm: data.eventDate,
    timeHhMm: data.eventTime,
    couponCode: data.couponCode,
    affiliates,
  });

  if (quote.totalEur === null || quote.depositEur <= 0) {
    return {
      ok: false,
      error: "QUOTE_ERROR: No se pudo calcular la reserva del 50% para Solista.",
    };
  }

  // Registrar el lead determinista en `leads_mariachi` + alerta al CEO antes de abrir Stripe
  const leadReg = await registerMariachiCallToCashLead({
    ...data,
    format: "solista_edwin",
    channel: "STRIPE_RESERVA_50",
  });

  const leadId = leadReg.ok ? leadReg.leadId : `mlead_stripe_${Date.now()}`;

  try {
    const session = await createCheckoutSession({
      amount: quote.depositEur,
      concept: `Reserva 50% Mariachi Solista Premium (Edwin Agudelo) — ${municipality} (${quote.dateDdMm} ${quote.timeHhMm})`,
      metadata: {
        type: "RESERVA_MARIACHI_SOLISTA_50PCT",
        artistName: "Edwin Agudelo (Mariachi Solista Premium)",
        leadId,
        municipality,
        eventDate: quote.dateDdMm,
        eventTime: quote.timeHhMm,
        distanceKm: String(quote.distanceKm),
        includedKm: String(quote.includedKm),
        billableKm: String(quote.billableKm),
        basePriceEur: String(quote.basePriceEur),
        couponApplied: quote.couponApplied ?? "",
        totalEur: String(quote.totalEur),
        deposit50PctEur: String(quote.depositEur),
        balanceEur: String(quote.balanceEur),
        splitArtist80Eur: String(quote.split.artist80Eur),
        splitEarOs10Eur: String(quote.split.earOs10Eur),
        splitVimume10Eur: String(quote.split.vimume10Eur),
      },
    });

    return {
      ok: true,
      url: session.url,
      sessionId: session.id,
      leadId,
      totalEur: quote.totalEur,
      deposit50PctEur: quote.depositEur,
      couponApplied: quote.couponApplied,
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Error desconocido en Stripe";
    logger.error({ event: "EDWIN_SOLISTA_50PCT_STRIPE_ERROR", error: msg, ip });
    return {
      ok: false,
      error: `STRIPE_ERROR: ${msg}`,
    };
  }
}

