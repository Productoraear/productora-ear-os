"use server";

import { getStripe } from "@/lib/payments";
import { headers } from "next/headers";
import { isRateLimited } from "@/lib/security/shield";
import { logger } from "@/lib/logger";
import { z } from "zod";

/**
 * 🚀 ARTIST SAAS STRIPE CONNECT ENGINE (W36_T02)
 * Motor real de suscripción SaaS para artistas del Puente Tecnológico EAR OS.
 *
 * Planes canónicos SSOT:
 *   - PRO_MONTHLY  : 29,00 €/mes (sin permanencia)
 *   - ELITE_ANNUAL : 290,00 €/año (2 meses gratis, RC 1M€, insignia Diamante)
 *
 * Defensa en Profundidad:
 *   1. Zod + Rate Limiting (isRateLimited) antes de tocar Stripe.
 *   2. Stripe Checkout en modo `subscription` con `price_data` recurrente.
 *   3. Cero `any`, cero secrets en cliente (Server Action exclusiva).
 */

export const ARTIST_PLANS = {
  PRO_MONTHLY: {
    id: "PRO_MONTHLY",
    label: "Plan Pro Mensual",
    priceEuro: 29,
    interval: "month" as const,
  },
  ELITE_ANNUAL: {
    id: "ELITE_ANNUAL",
    label: "Plan Élite Anual",
    priceEuro: 290,
    interval: "year" as const,
  },
} as const;

export type ArtistPlanId = keyof typeof ARTIST_PLANS;

const SubscriptionCheckoutSchema = z.object({
  plan: z.enum(["PRO_MONTHLY", "ELITE_ANNUAL"], {
    message: "Plan de suscripción no válido. Usa PRO_MONTHLY o ELITE_ANNUAL.",
  }),
  artistEmail: z.string().email("Correo profesional inválido.").min(5),
  artistName: z.string().min(2, "Nombre artístico requerido.").max(120),
});

export type ArtistSubscriptionCheckoutResult = {
  ok: true;
  checkoutUrl: string;
  sessionId: string;
  plan: ArtistPlanId;
} | {
  ok: false;
  error: string;
};

/**
 * Crea una sesión de suscripción recurrente en Stripe para el artista.
 * No escribe en BD: el ciclo de vida de la suscripción lo cierra Stripe
 * vía webhook (`customer.subscription.created` / `updated` / `deleted`).
 */
export async function createArtistSubscriptionCheckout(
  input: { plan: ArtistPlanId; artistEmail: string; artistName: string }
): Promise<ArtistSubscriptionCheckoutResult> {
  const headersList = await headers();
  const ip =
    headersList.get("x-forwarded-for")?.split(",")[0].trim() || "127.0.0.1";

  // 1. Rate limiting (5 solicitudes / min por IP) — defensa anti-spam
  if (isRateLimited(ip, 5, 60_000)) {
    logger.warn({ event: "ARTIST_SUBSCRIPTION_RATE_LIMITED", ip });
    return { ok: false, error: "RATE_LIMIT_EXCEEDED: Inténtalo de nuevo en un minuto." };
  }

  // 2. Validación Zod
  const parsed = SubscriptionCheckoutSchema.safeParse(input);
  if (!parsed.success) {
    logger.error({
      event: "ARTIST_SUBSCRIPTION_VALIDATION_FAILED",
      errors: parsed.error.format(),
      ip,
    });
    return {
      ok: false,
      error: `VALIDATION_ERROR: ${parsed.error.issues.map((e) => e.message).join(", ")}`,
    };
  }

  const { plan, artistEmail, artistName } = parsed.data;
  const planDef = ARTIST_PLANS[plan];

  try {
    const client = getStripe();
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://productoraear.com";

    // 3. Checkout en modo suscripción (precio recurrente real)
    const session = await client.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      customer_email: artistEmail,
      line_items: [
        {
          price_data: {
            currency: "eur",
            unit_amount: Math.round(planDef.priceEuro * 100), // a céntimos
            recurring: { interval: planDef.interval },
            product_data: {
              name: planDef.label,
              description:
                plan === "ELITE_ANNUAL"
                  ? "Membresía Élite Anual — Puente Tecnológico EAR OS (RC 1M€, insignia Diamante, prioridad nacional)."
                  : "Membresía Pro Mensual — Puente Tecnológico EAR OS (pasarela Stripe clientes, calendario ACID, despacho WhatsApp).",
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        earPlan: plan,
        earArtistName: artistName,
        earArtistEmail: artistEmail,
        earFlow: "artist_saas_subscription",
      },
      subscription_data: {
        metadata: {
          earPlan: plan,
          earArtistName: artistName,
          earArtistEmail: artistEmail,
        },
      },
      success_url: `${baseUrl}/studio/artist/finance?subscription=success&plan=${plan}`,
      cancel_url: `${baseUrl}/studio/artist/finance?subscription=cancelled`,
    });

    if (!session.url) {
      throw new Error("Stripe no devolvió una URL de checkout.");
    }

    logger.info({
      event: "ARTIST_SUBSCRIPTION_CHECKOUT_CREATED",
      plan,
      sessionId: session.id,
      artistEmail,
    });

    return { ok: true, checkoutUrl: session.url, sessionId: session.id, plan };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error desconocido al crear la suscripción.";
    logger.error({ event: "ARTIST_SUBSCRIPTION_STRIPE_ERROR", plan, error: message, ip });
    return { ok: false, error: `STRIPE_ERROR: ${message}` };
  }
}
