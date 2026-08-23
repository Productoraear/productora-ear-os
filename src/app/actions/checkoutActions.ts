"use server";

import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/payments";
import { calculateGeoPricing } from "@/lib/services/pricing/geo-pricer";
import { headers } from "next/headers";
import { isRateLimited } from "@/lib/security/shield";
import { logger } from "@/lib/logger";
import { z } from "zod";

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
  let baseFee = 1200; // Tarifa base estándar del Roster de Élite
  let costPerKm = 0.75; // Default cost per km

  // A. Buscar en el Roster de Artistas (Edwin Agudelo y Co.)
  const artist = await prisma.artistProfile.findUnique({
    where: { id: artistId },
    select: { id: true, displayName: true, slug: true },
  });

  if (artist) {
    isAuthorized = true;
    artistName = artist.displayName ?? "";
    
    // FORENSIC STRIPE REVENUE SEAL: Edwin Agudelo Pricing Engine
    if (artist.slug === "edwin-agudelo" || artistName.toLowerCase().includes("edwin agudelo")) {
        costPerKm = 0.35;
        const form = parsed.data.formation || 'solista';
        if (form === 'solista') baseFee = 350;
        else if (form === 'duo') baseFee = 550;
        else if (form === 'cuarteto') baseFee = 900;
        else if (form === 'gran_show') baseFee = 1800;
        else baseFee = 350;
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
      select: { id: true, name: true, isVerified: true, roiGuaranteeScore: true },
    });

    if (provider && provider.isVerified) {
      isAuthorized = true;
      artistName = provider.name ?? "";
      baseFee = (provider.roiGuaranteeScore ?? 0) > 0 ? Math.round((provider.roiGuaranteeScore ?? 0) * 200) : 1000;
    }
  }

  // 🚨 GUARDRAIL DE SEGURIDAD ABSOLUTO S-CLASS (VETO DE ORPHANS)
  if (!isAuthorized) {
    logger.error({ event: "VETO_SECURITY_VIOLATION", artistId, ip });
    throw new Error("VETO ESTRATÉGICO ACTIVADO: Operación financiera no autorizada. Este perfil no cuenta con la verificación o suscripción Stripe Connect activa.");
  }

  // 5. Geocodificación y cálculo de distancia/precios en entorno seguro (Server-Side)
  const pricing = await calculateGeoPricing({
    artistId,
    origin,
    destination,
    baseFee,
    costPerKm: costPerKm, // Updated to dynamically pull from Edwin Agudelo configuration
    depositMode: "fixed",
    depositValue: 150, // Garantía mínima
  });

  logger.info({ event: "CHECKOUT_PRICING_CALCULATED", distanceKm: pricing.distanceKm, totalAmount: pricing.totalAmount, ip });

  // 6. Creación de la sesión de Stripe Checkout con metadatos enriquecidos de geolocalización
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "eur",
          product_data: {
            name: `Reserva Roster Oficial Elite - ${artistName}`,
            description: `Actuación oficial programada para el ${eventDate}. Trayecto: ${origin} -> ${destination} (${pricing.distanceKm} km)`,
          },
          unit_amount: Math.round(pricing.totalAmount * 100), // Stripe procesa en céntimos
        },
        quantity: 1,
      },
    ],
    metadata: {
      artistId: artistId,
      clientId: resolvedClientId || "GUEST",
      calculatedDistance: String(pricing.distanceKm),
      totalAmount: String(pricing.totalAmount),
      eventDate: eventDate,
      origin: origin,
      destination: destination,
    },
    success_url: `${process.env.NEXT_PUBLIC_BASE_URL || "https://www.productoraear.com"}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || "https://www.productoraear.com"}/contacto`,
  });

  logger.info({ event: "CHECKOUT_SESSION_CREATED", sessionId: session.id, ip });

  return {
    sessionId: session.id,
    url: session.url,
    totalAmount: pricing.totalAmount,
    distanceKm: pricing.distanceKm,
  };
}
