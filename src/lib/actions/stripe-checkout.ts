// src/lib/actions/stripe-checkout.ts
"use server";

import Stripe from "stripe";
import { z } from "zod";
import { headers } from "next/headers";
import { calculateGeoPricing } from "@/lib/services/pricing/geo-pricer";
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

export async function createBookingCheckout(input: unknown) {
  const stripeSecret = process.env.STRIPE_SECRET_KEY;
  if (!stripeSecret) {
    throw new Error("Missing STRIPE_SECRET_KEY in production server environment");
  }
  
  const stripe = new Stripe(stripeSecret, {
    apiVersion: '2026-04-22.dahlia' as any,
  });

  const payload = StripeCheckoutSchema.parse(input);
  const origin = (await headers()).get("origin") ?? "https://www.productoraear.com";

  const user = await prisma.user.findUnique({
    where: { id: payload.clientId },
    select: { id: true },
  });
  if (!user) throw new Error("Invalid client context");

  const pricing = await calculateGeoPricing({
    artistId: payload.artistId,
    origin: { lat: payload.originLat, lng: payload.originLng },
    destination: { lat: payload.destinationLat, lng: payload.destinationLng },
    baseFee: 0,
    costPerKm: 0.75,
    depositMode: "fixed",
    depositValue: 100,
  });

  const session = await stripe.checkout.sessions.create({
    ui_mode: "embedded" as any,
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
          unit_amount: pricing.depositAmount * 100,
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
      totalAmountCalculated: String(pricing.totalAmount),
      depositAmount: String(pricing.depositAmount),
      distanceKm: String(pricing.distanceKm),
      workspaceId: payload.workspaceId,
      bookingId: payload.bookingId,
    },
  });

  if (!session.client_secret) throw new Error("Missing Stripe client secret");

  return {
    clientSecret: session.client_secret,
    sessionId: session.id,
    totalAmount: pricing.totalAmount,
    depositAmount: pricing.depositAmount,
    distanceKm: pricing.distanceKm,
  };
}
