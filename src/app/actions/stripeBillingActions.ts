"use server";

import { stripe } from "@/lib/payments";
import { headers } from "next/headers";
import { isRateLimited } from "@/lib/security/shield";
import { logger } from "@/lib/logger";
import { z } from "zod";

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 1. ESQUEMAS ZOD DE VALIDACIÓN ESTRICTA
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const VenueSubscriptionSchema = z.object({
  venueName: z.string().min(2, "El nombre del establecimiento es obligatorio"),
  venueNif: z.string().min(5, "El CIF/NIF es obligatorio para la validez del certificado"),
  address: z.string().min(3, "La dirección es obligatoria"),
  city: z.string().default("España"),
  ownerEmail: z.string().email("Email de facturación inválido"),
  tierId: z.enum(["RESTAURANTE_LOUNGE", "FINCA_BODAS_SCLASS", "CLUB_DISCOTECA_PRO"]),
  billingCycle: z.enum(["monthly", "yearly"]).default("monthly"),
  returnPath: z.string().optional().default("/artistas/reclamar-regalias")
});

const ArtistRoyaltyTrackerSchema = z.object({
  artisticName: z.string().min(2, "El nombre artístico es obligatorio"),
  legalName: z.string().optional(),
  nifDni: z.string().min(5, "El DNI/NIF es obligatorio para la reclamación"),
  sgaeCode: z.string().optional().default("SGAE-PENDIENTE"),
  email: z.string().email("Email de contacto inválido"),
  billingCycle: z.enum(["monthly", "yearly"]).default("monthly"),
  returnPath: z.string().optional().default("/artistas/reclamar-regalias")
});

export type VenueSubscriptionInput = z.infer<typeof VenueSubscriptionSchema>;
export type ArtistRoyaltyTrackerInput = z.infer<typeof ArtistRoyaltyTrackerSchema>;

// Tiers de Tarifas Homologadas para Venues
const VENUE_TIERS = {
  RESTAURANTE_LOUNGE: {
    name: "Licencia Inmune Restaurante & Lounge",
    monthlyPrice: 49,
    yearlyPrice: 470,
    description: "Cobertura de hilo musical y eventos acústicos hasta 120 pax. Certificado SHA-256 ante SGAE/AIE.",
  },
  FINCA_BODAS_SCLASS: {
    name: "Blindaje Total Fincas de Bodas & Galas S-Class",
    monthlyPrice: 99,
    yearlyPrice: 950,
    description: "Cobertura integral para bodas y galas privadas. Universal Cue Bridge para DJs con acta forense instantánea.",
  },
  CLUB_DISCOTECA_PRO: {
    name: "Seguro Anti-Multas Macro-Discotecas & Festivales",
    monthlyPrice: 199,
    yearlyPrice: 1900,
    description: "Auditoría multi-cabina en directo hasta 1.500 pax. Reparto directo 70/20/10 y reporting legal a entidades.",
  }
};

/**
 * 🏛️ STRIPE BILLING: CHECKOUT DE SUSCRIPCIÓN PARA VENUES & FINCAS
 * Genera la sesión segura de Stripe Billing en modo 'subscription' con provisionamiento de licencia SHA-256.
 */
export async function createVenueSubscriptionCheckout(input: VenueSubscriptionInput) {
  const headersList = await headers();
  const ip = headersList.get("x-forwarded-for")?.split(",")[0].trim() || "127.0.0.1";

  if (isRateLimited(ip, 10, 60000)) {
    logger.warn({ event: "VENUE_BILLING_RATE_LIMIT", ip });
    throw new Error("Límite de solicitudes de checkout alcanzado. Por favor, inténtelo de nuevo en un minuto.");
  }

  const parsed = VenueSubscriptionSchema.safeParse(input);
  if (!parsed.success) {
    throw new Error(`Datos de suscripción inválidos: ${parsed.error.issues.map(e => e.message).join(", ")}`);
  }

  const { venueName, venueNif, address, city, ownerEmail, tierId, billingCycle, returnPath } = parsed.data;
  const tier = VENUE_TIERS[tierId];
  const unitAmount = billingCycle === "yearly" ? tier.yearlyPrice * 100 : tier.monthlyPrice * 100;
  const interval = billingCycle === "yearly" ? "year" : "month";

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://productoraear.com";

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      customer_email: ownerEmail,
      line_items: [
        {
          price_data: {
            currency: "eur",
            recurring: { interval: interval as any },
            product_data: {
              name: `🛡️ ${tier.name}`,
              description: `${tier.description} — Local: ${venueName} (CIF: ${venueNif}, ${city})`,
              images: ["https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop"],
            },
            unit_amount: unitAmount,
          },
          quantity: 1,
        },
      ],
      metadata: {
        type: "VENUE_MUSIC_LICENSE_SUBSCRIPTION",
        venueName,
        venueNif,
        address,
        city,
        ownerEmail,
        tierId,
        billingCycle,
        provisionToken: `lic_${Date.now().toString(36)}_${venueNif.toLowerCase().replace(/[^a-z0-9]/g, "")}`
      },
      success_url: `${baseUrl}${returnPath}?venue_licensed=true&venue_name=${encodeURIComponent(venueName)}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}${returnPath}?venue_licensed=false`,
    });

    if (!session.url) {
      throw new Error("No se pudo generar la sesión de pago de suscripción con Stripe.");
    }

    return { checkoutUrl: session.url, sessionId: session.id };
  } catch (err: any) {
    logger.error({ event: "VENUE_SUBSCRIPTION_CHECKOUT_FAILED", error: err.message });
    throw new Error(err.message || "Error al conectar con la pasarela de pagos de Stripe.");
  }
}

/**
 * 🎧 STRIPE BILLING: CHECKOUT "EL VENGADOR DE REGALÍAS" (10 €/mes)
 * Trazabilidad total de bolos y recuperación activa de derechos ante SGAE/AIE para artistas.
 */
export async function createArtistRoyaltyTrackerCheckout(input: ArtistRoyaltyTrackerInput) {
  const headersList = await headers();
  const ip = headersList.get("x-forwarded-for")?.split(",")[0].trim() || "127.0.0.1";

  if (isRateLimited(ip, 10, 60000)) {
    logger.warn({ event: "ARTIST_TRACKER_RATE_LIMIT", ip });
    throw new Error("Límite de solicitudes de checkout alcanzado. Por favor, inténtelo de nuevo en un minuto.");
  }

  const parsed = ArtistRoyaltyTrackerSchema.safeParse(input);
  if (!parsed.success) {
    throw new Error(`Datos de suscripción inválidos: ${parsed.error.issues.map(e => e.message).join(", ")}`);
  }

  const { artisticName, legalName, nifDni, sgaeCode, email, billingCycle, returnPath } = parsed.data;
  const unitAmount = billingCycle === "yearly" ? 9900 : 1000; // 10 €/mes o 99 €/año
  const interval = billingCycle === "yearly" ? "year" : "month";

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://productoraear.com";

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: "eur",
            recurring: { interval: interval as any },
            product_data: {
              name: `🎧 Licencia Trazabilidad Total & Reclamación SGAE (EAR OS)`,
              description: `Vigilancia de repertorio, emisión de expedientes SHA-256 e inicio de reclamación de derechos de ejecución pública para ${artisticName} (DNI: ${nifDni}).`,
              images: ["https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=800&auto=format&fit=crop"],
            },
            unit_amount: unitAmount,
          },
          quantity: 1,
        },
      ],
      metadata: {
        type: "ARTIST_ROYALTY_TRACKER_SUBSCRIPTION",
        artisticName,
        legalName: legalName || artisticName,
        nifDni,
        sgaeCode,
        email,
        billingCycle,
        claimToken: `claim_${Date.now().toString(36)}_${nifDni.toLowerCase().replace(/[^a-z0-9]/g, "")}`
      },
      success_url: `${baseUrl}${returnPath}?tracker_active=true&artist=${encodeURIComponent(artisticName)}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}${returnPath}?tracker_active=false`,
    });

    if (!session.url) {
      throw new Error("No se pudo generar la sesión de pago de suscripción con Stripe.");
    }

    return { checkoutUrl: session.url, sessionId: session.id };
  } catch (err: any) {
    logger.error({ event: "ARTIST_TRACKER_CHECKOUT_FAILED", error: err.message });
    throw new Error(err.message || "Error al conectar con la pasarela de pagos de Stripe.");
  }
}
