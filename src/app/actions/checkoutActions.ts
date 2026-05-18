"use server";

import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/payments";
import { calculateGeoPricing } from "@/lib/services/pricing/geo-pricer";

export interface EliteCheckoutInput {
  artistId: string;    // ID del ArtistProfile o ProviderProfile verificado
  clientId?: string | null;    // ID del usuario comprador/cliente
  origin: string;      // Dirección del evento o base de origen (e.g. "Madrid, España")
  destination: string; // Dirección del destino (e.g. "Barcelona, España")
  eventDate: string;   // Fecha seleccionada
}

/**
 * 💳 S-CLASS SERVER ACTION: SECURE ELITE CHECKOUT
 * Valida la legitimidad del perfil, calcula la distancia física real y genera la sesión de
 * Stripe Checkout garantizando que perfiles no autorizados u huérfanos nunca toquen Stripe.
 */
export async function createEliteCheckout(input: EliteCheckoutInput) {
  const { artistId, clientId, origin, destination, eventDate } = input;

  console.log(`💳 [ELITE_CHECKOUT] Procesando sesión para artista/proveedor ID: ${artistId}, cliente ID: ${clientId}`);

  // 1. Resolver el cliente de forma limpia sin fallbacks ficticios de usuarios aleatorios (Fase 1: Fallback Cero)
  let resolvedClientId: string | null = null;
  if (clientId && clientId !== "undefined" && clientId !== "null" && clientId !== "GUEST") {
    const clientUser = await prisma.user.findUnique({
      where: { id: clientId },
      select: { id: true }
    });
    if (clientUser) {
      resolvedClientId = clientUser.id;
    }
  }

  // 2. Validar perfil y verificar estatus oficial o de verificación S-Class
  let isAuthorized = false;
  let artistName = "";
  let baseFee = 1200; // Tarifa base estándar del Roster de Élite

  // A. Intentar buscar en el Roster de Artistas (Edwin Agudelo y Co.)
  // Todos los artistas que poseen un perfil asociado en ArtistProfile son considerados parte del Roster Oficial.
  const artist = await prisma.artistProfile.findUnique({
    where: { id: artistId },
    select: { id: true, displayName: true }
  });

  if (artist) {
    isAuthorized = true;
    artistName = artist.displayName;
  } else {
    // B. Si no está en el roster de artistas, buscar en perfiles de proveedores verificados
    const provider = await prisma.providerProfile.findFirst({
      where: {
        OR: [
          { id: artistId },
          { slug: artistId }
        ]
      },
      select: { id: true, name: true, isVerified: true, roiGuaranteeScore: true }
    });

    if (provider && provider.isVerified) {
      isAuthorized = true;
      artistName = provider.name;
      baseFee = provider.roiGuaranteeScore > 0 ? Math.round(provider.roiGuaranteeScore * 200) : 1000;
    }
  }

  // 🚨 GUARDRAIL DE SEGURIDAD ABSOLUTO S-CLASS (VETO DE ORPHANS)
  // Ningún perfil huérfano, no verificado o sin verificar puede inicializar una sesión de cobros Stripe
  if (!isAuthorized) {
    console.error(`🚨 [VETO_SECURITY_VIOLATION] Intento de facturación para perfil no verificado ID: ${artistId}`);
    throw new Error("VETO ESTRATÉGICO ACTIVADO: Operación financiera no autorizada. Este perfil no cuenta con la verificación o suscripción Stripe Connect activa.");
  }

  // 3. Geocodificación y cálculo de distancia/precios en entorno seguro (Server-Side)
  // Previene alteración de payloads por interceptores de red en el cliente
  const pricing = await calculateGeoPricing({
    artistId,
    origin,
    destination,
    baseFee,
    costPerKm: 0.75, // Costo de transporte por KM de instrumentación/caballos
    depositMode: "fixed",
    depositValue: 150 // Garantía mínima
  });

  console.log(`🎯 [ELITE_CHECKOUT] Distancia calculada: ${pricing.distanceKm} km. Total calculado: ${pricing.totalAmount}€.`);

  // 4. Creación de la sesión de Stripe Checkout con metadatos enriquecidos de geolocalización
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
      destination: destination
    },
    success_url: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3007"}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3007"}/contacto`,
  });

  return {
    sessionId: session.id,
    url: session.url,
    totalAmount: pricing.totalAmount,
    distanceKm: pricing.distanceKm
  };
}
