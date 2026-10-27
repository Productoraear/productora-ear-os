// src/lib/actions/stripe-checkout.ts
"use server";

import Stripe from "stripe";
import { z } from "zod";
import { headers } from "next/headers";
import { calculateGeoPricing } from "@/lib/services/pricing/geo-pricer";
import {
  BASE_SOLISTA,
  COSTE_KM,
  DEPOSITO_STRIPE,
  KM_EXENTOS,
  calculateSovereignQuote,
} from "@/lib/pricing/sovereign-pricing";
import { prisma } from "@/lib/prisma";

const StripeCheckoutSchema = z.object({
  artistId: z.string().min(1),
  clientId: z.string().min(1),
  eventDate: z.string().min(1),
  originLat: z.number(),
  originLng: z.number(),
  destinationLat: z.number(),
  destinationLng: z.number(),
  originLabel: z.string().min(1).optional(),
  destinationLabel: z.string().min(1).optional(),
  workspaceId: z.string().min(1),
  bookingId: z.string().min(1),
});

export type StripeCheckoutInput = z.infer<typeof StripeCheckoutSchema>;

export interface StripeCheckoutResult {
  clientSecret: string;
  sessionId: string;
  totalAmount: number;
  depositAmount: number;
  distanceKm: number;
}

const STRIPE_API_VERSION = "2026-04-22.dahlia" as Stripe.LatestApiVersion;
const DEFAULT_ORIGIN = "https://productoraear.com";

export async function createBookingCheckout(
  input: unknown,
): Promise<StripeCheckoutResult> {
  const stripeSecret = process.env.STRIPE_SECRET_KEY;
  if (!stripeSecret) {
    throw new Error("Missing STRIPE_SECRET_KEY in production server environment");
  }

  const stripe = new Stripe(stripeSecret, {
    apiVersion: STRIPE_API_VERSION,
  });

  const payload = StripeCheckoutSchema.parse(input);
  const origin = (await headers()).get("origin") ?? DEFAULT_ORIGIN;

  const user = await prisma.user.findUnique({
    where: { id: payload.clientId },
    select: { id: true },
  });
  if (!user) throw new Error("Invalid client context");

  const pricing = await calculateGeoPricing({
    artistId: payload.artistId,
    origin: { lat: payload.originLat, lng: payload.originLng },
    destination: { lat: payload.destinationLat, lng: payload.destinationLng },
    baseFee: BASE_SOLISTA, // SSOT: 350 € (flujo embebido del Solista Premium)
    costPerKm: COSTE_KM, // SSOT: 1,50 €/km
    franchiseKm: KM_EXENTOS, // SSOT: franquicia de 50 km
    depositMode: "fixed",
    depositValue: DEPOSITO_STRIPE, // SSOT: Price-Lock inmutable de 100 €
  });

  // El importe firmado nace SIEMPRE del motor soberano (cero matemáticas paralelas).
  const sovereignQuote = calculateSovereignQuote({
    format: "solista",
    distanceKm: pricing.distanceKm,
    soundRider: "standard",
  });

  const session = await stripe.checkout.sessions.create({
    ui_mode: "embedded",
    mode: "payment",
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "eur",
          product_data: {
            name: "Depósito Garantía - Productora EAR",
            description: `Reserva para ${payload.eventDate}`,
          },
          unit_amount: Math.round(sovereignQuote.depositRequired * 100),
        },
      },
    ],
    return_url: `${origin}/artistas/edwin-agudelo/booking/return?session_id={CHECKOUT_SESSION_ID}`,
    metadata: {
      artistId: payload.artistId,
      clientId: payload.clientId,
      eventDate: payload.eventDate,
      originLat: String(payload.originLat),
      originLng: String(payload.originLng),
      destinationLat: String(payload.destinationLat),
      destinationLng: String(payload.destinationLng),
      totalAmountCalculated: String(sovereignQuote.totalBudget),
      depositAmount: String(sovereignQuote.depositRequired),
      distanceKm: String(pricing.distanceKm),
      priceLockHash: sovereignQuote.priceLockHash,
      workspaceId: payload.workspaceId,
      bookingId: payload.bookingId,
    },
  });

  if (!session.client_secret) throw new Error("Missing Stripe client secret");

  return {
    clientSecret: session.client_secret,
    sessionId: session.id,
    totalAmount: sovereignQuote.totalBudget,
    depositAmount: sovereignQuote.depositRequired,
    distanceKm: pricing.distanceKm,
  };
}