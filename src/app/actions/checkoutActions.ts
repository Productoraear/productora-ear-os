"use server";

import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/payments";
import { calculateGeoPricing } from "@/lib/services/pricing/geo-pricer";
import type { GeoCoordinates } from "@/lib/services/geo/geocoder";
import { headers, cookies } from "next/headers";
import { isRateLimited } from "@/lib/security/shield";
import { logger } from "@/lib/logger";
import { z } from "zod";
import { calculateSovereignQuote, basePriceForFormat, COSTE_KM, DEPOSITO_STRIPE } from "@/lib/pricing/sovereign-pricing";
import { verifyAndSignStripeSession } from "@/lib/pricing/price-lock-verifier";
import {
  LogisticsOriginError,
  NETWORK_FRANCHISE_KM,
  resolveLogisticsOrigin,
} from "@/lib/pricing/logistics-origin";
import type { LogisticsOrigin, LogisticsOriginSubject } from "@/lib/pricing/logistics-origin";
import type { SovereignQuoteInput, FormatType } from "@/lib/pricing/sovereign-pricing";

export interface EliteCheckoutInput {
  artistId: string;    // ID del ArtistProfile o ProviderProfile verificado
  clientId?: string | null;    // ID del usuario comprador/cliente
  origin: string;      // Dirección del evento o base de origen (e.g. "Madrid, España")
  destination: string; // Dirección del destino (e.g. "Barcelona, España")
  eventDate: string;   // Fecha seleccionada
  formation?: 'solista' | 'duo' | 'cuarteto' | 'gran_show';
}

// 🛡️ SCHEMA DE VALIDACIÓN ESTRICTO CON ZOD
const EliteCheckoutSchema = z.object({
  artistId: z.string().min(1, "El ID del artista es obligatorio"),
  clientId: z.string().nullable().optional(),
  origin: z.string().min(1, "El origen es obligatorio"),
  destination: z.string().min(1, "El destino es obligatorio"),
  eventDate: z.string().min(1, "La fecha de evento es obligatoria"),
  formation: z.enum(['solista', 'duo', 'cuarteto', 'gran_show']).optional().default('solista'),
});

type CheckoutFormation = NonNullable<EliteCheckoutInput["formation"]>;

/**
 * Formaciones comerciales del checkout -> formatos canónicos del SSOT.
 * `gran_show` NO está canonizado en el SSOT (>5 músicos): se aplica el suelo
 * del quinteto canónico y se exige cotización manual para no facturar por
 * debajo de la tarifa sancionada.
 */
const FORMATION_TO_SOVEREIGN_FORMAT: Readonly<Record<CheckoutFormation, FormatType>> = Object.freeze({
  solista: 'solista',
  duo: 'trio',
  cuarteto: 'quinteto',
  gran_show: 'quinteto',
});

/**
 * Tarifas del roster externo: NO son la tarifa de Edwin Agudelo y no están
 * canonizadas en el SSOT sellado. Se centralizan aquí para que cualquier
 * cambio de precio del roster sea auditable en un único punto.
 */
const ROSTER_BASE_FEE_EUR = 1200;
const PROVIDER_SCORE_FEE_FACTOR_EUR = 200;
const PROVIDER_MIN_BASE_FEE_EUR = 1000;

/**
 * Tolerancia de deriva entre el motor geográfico (distancia a 2 decimales) y el
 * motor soberano (distancia normalizada a 1 decimal). Superarla es divergencia.
 */
const DISTANCE_DRIFT_TOLERANCE_KM = 0.1;

/**
 * 💳 S-CLASS SERVER ACTION: SECURE ELITE CHECKOUT
 * Valida la legitimidad del perfil, calcula la distancia física real y genera la sesión de
 * Stripe Checkout garantizando que perfiles no autorizados u huérfanos nunca toquen Stripe.
 * Endurecido con Zod, structured JSON logs y Rate Limiting perimetral.
 */
export async function createEliteCheckout(input: EliteCheckoutInput) {
  // 1. IP Rate Limiting Check en Borde
  const headersList = await headers();
  const ip = headersList.get("x-forwarded-for")?.split(",")[0].trim() || "127.0.0.1";

  if (isRateLimited(ip, 5, 60000)) {
    logger.warn({ event: "CHECKOUT_RATE_LIMIT_EXCEEDED", ip, artistId: input.artistId });
    throw new Error("RATE_LIMIT_EXCEEDED: Has excedido el límite de 5 intentos por minuto. Por favor, espere.");
  }

  // 2. Parse estricto de entrada con Zod
  const parsed = EliteCheckoutSchema.safeParse(input);
  if (!parsed.success) {
    logger.error({ event: "CHECKOUT_VALIDATION_FAILED", errors: parsed.error.format(), ip });
    throw new Error(`VALIDATION_ERROR: ${parsed.error.issues.map((e) => e.message).join(", ")}`);
  }

  const { artistId, clientId, origin, destination, eventDate } = parsed.data;
  const formation: CheckoutFormation = parsed.data.formation;
  const sovereignFormat: FormatType = FORMATION_TO_SOVEREIGN_FORMAT[formation];

  if (formation === 'gran_show') {
    logger.warn({
      event: "GRAN_SHOW_REQUIRES_MANUAL_QUOTE",
      detail: "El SSOT sellado no canoniza formatos superiores al quinteto (5 músicos): se aplica el suelo del quinteto y se exige cotización manual.",
      artistId,
      ip,
    });
  }

  logger.info({ event: "CHECKOUT_INIT", artistId, clientId, ip });

  // 3. Resolver el cliente de forma limpia sin fallbacks ficticios
  let resolvedClientId: string | null = null;
  if (clientId) {
    const clientUser = await prisma.user.findUnique({
      where: { id: clientId },
      select: { id: true },
    });
    if (clientUser) {
      resolvedClientId = clientUser.id;
    }
  }

  // 4. Validar perfil y verificar estatus oficial o de verificación S-Class
  let isAuthorized = false;
  let artistName = "";
  let baseFee: number = ROSTER_BASE_FEE_EUR; // Roster externo (no canonizado en SSOT)
  let costPerKm: number = COSTE_KM; // SSOT logístico (1,50 €/km)

  /**
   * Sujeto que despacha. Se rellena SOLO desde el perfil resuelto en servidor:
   * el payload del cliente jamás decide la base física ni la franquicia.
   */
  let subject: LogisticsOriginSubject | null = null;

  // A. Buscar en el Roster de Artistas (Edwin Agudelo y Co.)
  const artist = await prisma.artistProfile.findUnique({
    where: { id: artistId },
    select: { id: true, displayName: true, stageName: true, slug: true },
  });

  if (artist) {
    isAuthorized = true;
    artistName = artist.displayName ?? "";
    subject = {
      id: artist.id,
      slug: artist.slug,
      name: artist.displayName ?? artist.stageName,
      city: null,
      province: null,
      location: null,
    };

    // FORENSIC STRIPE REVENUE SEAL: Edwin Agudelo Pricing Engine
    if (artist.slug === "edwin-agudelo" || artistName.toLowerCase().includes("edwin agudelo")) {
      // Tarifa base y logística derivadas 1:1 del SSOT sellado (1,50 €/km).
      // La franquicia (50 km) NO se fija aquí: la decide `resolveLogisticsOrigin`.
      costPerKm = COSTE_KM;
      baseFee = basePriceForFormat(sovereignFormat);
    }
  } else {
    // B. Buscar en perfiles de proveedores verificados
    const provider = await prisma.providerProfile.findFirst({
      where: {
        OR: [
          { id: artistId },
          { slug: artistId },
        ],
      },
      select: {
        id: true,
        slug: true,
        name: true,
        isVerified: true,
        roiGuaranteeScore: true,
        city: true,
        province: true,
        location: true,
      },
    });

    if (provider && provider.isVerified) {
      isAuthorized = true;
      artistName = provider.name ?? "";
      const roiScore: number = provider.roiGuaranteeScore ?? 0;
      baseFee = roiScore > 0 ? Math.round(roiScore * PROVIDER_SCORE_FEE_FACTOR_EUR) : PROVIDER_MIN_BASE_FEE_EUR;
      // Base fiscal real del proveedor (Red Nacional). Sin base declarada, no
      // hay franquicia posible: se factura desde el km 0 y se marca la incidencia.
      subject = {
        id: provider.id,
        slug: provider.slug,
        name: provider.name,
        city: provider.city,
        province: provider.province,
        location: provider.location,
      };
    }
  }

  // 🚨 GUARDRAIL DE SEGURIDAD ABSOLUTO S-CLASS (VETO DE ORPHANS)
  if (!isAuthorized) {
    logger.error({ event: "VETO_SECURITY_VIOLATION", artistId, ip });
    throw new Error("VETO ESTRATÉGICO ACTIVADO: Operación financiera no autorizada. Este perfil no cuenta con la verificación o suscripción Stripe Connect activa.");
  }

  // 5. Resolución SERVER-SIDE de la base física facturable (multi-origen).
  //    La franquicia de Méntrida NO se hereda: la dicta el sujeto que despacha.
  let logisticsOrigin: LogisticsOrigin | null = null;
  if (subject) {
    try {
      logisticsOrigin = resolveLogisticsOrigin(subject);
    } catch (error) {
      const reason: string = error instanceof LogisticsOriginError ? error.message : String(error);
      logger.warn({
        event: "LOGISTICS_ORIGIN_UNRESOLVED",
        artistId,
        reason,
        detail: "Se factura sin franquicia (km 0) hasta que el perfil declare city/province/location.",
        ip,
      });
    }
  }

  const franchiseKm: number = logisticsOrigin ? logisticsOrigin.franchiseKm : NETWORK_FRANCHISE_KM;
  // Origen del Hub y base fiscal del proveedor vienen del SERVIDOR: el cliente
  // no puede declarar un origen que le regale kilómetros de franquicia.
  const originForPricing: GeoCoordinates | string = logisticsOrigin ? logisticsOrigin.coordinates : origin;
  const originLabel: string = logisticsOrigin ? logisticsOrigin.label : origin;

  // 5 bis. Geocodificación y cálculo de distancia en entorno seguro (Server-Side).
  //    El importe facturable NO se toma de aquí: nace del motor soberano (SSOT).
  const pricing = await calculateGeoPricing({
    artistId,
    origin: originForPricing,
    destination,
    baseFee,
    costPerKm, // SSOT: 1,50 €/km (nunca una tarifa duplicada)
    franchiseKm, // Hub Méntrida: 50 km · Red Nacional: 0 km (sin herencia)
    depositMode: "fixed",
    depositValue: DEPOSITO_STRIPE, // Price-Lock inmutable (100 €), deducible del total
    strictGeocoding: true, // Fail-closed: prohibido facturar sobre el fallback de Madrid
  });

  logger.info({
    event: "CHECKOUT_PRICING_CALCULATED",
    distanceKm: pricing.distanceKm,
    billableKm: pricing.billableKm,
    franchiseKm: pricing.franchiseKm,
    logisticsOrigin: logisticsOrigin?.label ?? "UNRESOLVED",
    travelCost: pricing.travelCost,
    totalAmount: pricing.totalAmount,
    formation,
    sovereignFormat,
    ip,
  });

  // 6. FIRMADO CRIPTOGRÁFICO PRICE-LOCK SHA-256 (SSOT: verifyAndSignStripeSession)
  //    La franquicia entra en la firma: Hub (50 km) y Red (0 km) no comparten hash.
  const sovereignInput: SovereignQuoteInput = {
    format: sovereignFormat,
    distanceKm: pricing.distanceKm,
    soundRider: 'standard',
    franchiseKm: pricing.franchiseKm,
  };
  const sovereignQuote = calculateSovereignQuote(sovereignInput);
  const priceLock = verifyAndSignStripeSession({
    input: sovereignInput,
    clientHash: sovereignQuote.priceLockHash,
    issuedAtTimestamp: Date.now(),
    artistSlug: artist?.slug ?? artistId,
  });

  if (!priceLock.isValid) {
    logger.error({ event: "PRICE_LOCK_VERIFICATION_FAILED", status: priceLock.status, artistId, ip });
    throw new Error(`PRICE_LOCK_REJECTED: ${priceLock.status}. La sesión no puede firmarse sin verificación criptográfica válida.`);
  }

  const { stripeMetadata } = priceLock;

  // 6 bis. INVARIANTES DE CERO DIVERGENCIA (fail-closed: nada llega a Stripe si falla)
  if (sovereignQuote.logistics.franchiseKm !== pricing.franchiseKm) {
    logger.error({
      event: "ENGINE_DIVERGENCE_FRANCHISE",
      geoFranchiseKm: pricing.franchiseKm,
      sovereignFranchiseKm: sovereignQuote.logistics.franchiseKm,
      artistId,
      ip,
    });
    throw new Error("PRICE_LOCK_REJECTED: ENGINE_DIVERGENCE. La franquicia del motor geográfico y la del motor soberano no coinciden (Hub 50 km / Red 0 km).");
  }

  const distanceDriftKm: number = Math.abs(pricing.distanceKm - sovereignQuote.logistics.distanceKm);
  if (distanceDriftKm > DISTANCE_DRIFT_TOLERANCE_KM) {
    logger.error({ event: "ENGINE_DIVERGENCE_DISTANCE", distanceDriftKm, artistId, ip });
    throw new Error(`PRICE_LOCK_REJECTED: ENGINE_DIVERGENCE. Deriva de distancia de ${distanceDriftKm} km entre el motor geográfico y el motor soberano.`);
  }

  if (sovereignQuote.depositRequired !== DEPOSITO_STRIPE || stripeMetadata.depositAmount !== DEPOSITO_STRIPE) {
    logger.error({ event: "ENGINE_DIVERGENCE_DEPOSIT", depositRequired: sovereignQuote.depositRequired, ip });
    throw new Error("PRICE_LOCK_REJECTED: ENGINE_DIVERGENCE. El depósito firmado no coincide con el Price-Lock inmutable del SSOT (100,00 €).");
  }

  if (stripeMetadata.totalBudget !== sovereignQuote.totalBudget) {
    logger.error({ event: "ENGINE_DIVERGENCE_TOTAL", signedTotal: stripeMetadata.totalBudget, sovereignTotal: sovereignQuote.totalBudget, ip });
    throw new Error("PRICE_LOCK_REJECTED: ENGINE_DIVERGENCE. El total firmado no coincide con el recálculo soberano server-side.");
  }

  // 7. Creación de la sesión de Stripe Checkout con metadatos firmados SHA-256
  const cookieStore = await cookies();
  const affiliateCode = cookieStore.get('ear_affiliate_code')?.value;

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "eur",
          product_data: {
            name: `Reserva Roster Oficial Elite - ${artistName}`,
            description: `Actuación oficial programada para el ${eventDate}. Base: ${originLabel} -> ${destination} (${pricing.distanceKm} km · franquicia ${pricing.franchiseKm} km)`,
          },
          unit_amount: Math.round(stripeMetadata.totalBudget * 100), // Stripe procesa en céntimos
        },
        quantity: 1,
      },
    ],
    metadata: {
      artistId: artistId,
      clientId: resolvedClientId || "GUEST",
      calculatedDistance: String(pricing.distanceKm),
      billableDistance: String(pricing.billableKm),
      franchiseKm: String(pricing.franchiseKm),
      logisticsOrigin: logisticsOrigin?.kind ?? "UNRESOLVED",
      logisticsOriginLabel: originLabel,
      totalAmount: String(stripeMetadata.totalBudget),
      eventDate: eventDate,
      origin: originLabel,
      destination: destination,
      priceLockHash: stripeMetadata.priceLockHash,
      artistSplit: String(stripeMetadata.artistSplit),
      earOsSplit: String(stripeMetadata.earOsSplit),
      vimumeSplit: String(stripeMetadata.vimumeSplit),
      depositAmount: String(stripeMetadata.depositAmount),
      verifiedAt: String(stripeMetadata.verifiedAt),
      ...(affiliateCode ? { affiliateCode } : {})
    },
    success_url: `${process.env.NEXT_PUBLIC_BASE_URL || "https://productoraear.com"}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || "https://productoraear.com"}/contacto`,
  });

  logger.info({ event: "CHECKOUT_SESSION_CREATED", sessionId: session.id, priceLockHash: stripeMetadata.priceLockHash, ip });

  return {
    sessionId: session.id,
    url: session.url,
    totalAmount: stripeMetadata.totalBudget,
    distanceKm: pricing.distanceKm,
    billableKm: pricing.billableKm,
    franchiseKm: pricing.franchiseKm,
    logisticsOrigin: logisticsOrigin?.kind ?? "UNRESOLVED",
    priceLockHash: stripeMetadata.priceLockHash,
    depositAmount: stripeMetadata.depositAmount,
  };
}
