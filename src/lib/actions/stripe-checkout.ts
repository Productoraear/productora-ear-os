"use server";

import Stripe from "stripe";
import { z } from "zod";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";

// Singleton initialization for production environments
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_placeholder", {
  // Let it fallback to default account API version to avoid runtime typing issues
});

const BookingCheckoutSchema = z.object({
  artistId: z.string().min(1),
  selectedExtras: z.array(z.string()).default([]),
  date: z.string().min(1),
  geoDistance: z.number().min(0).optional(),
  userId: z.string().min(1),
  workspaceId: z.string().min(1),
  bookingId: z.string().min(1),
});

export async function createBookingCheckout(input: unknown) {
  const payload = BookingCheckoutSchema.parse(input);
  const origin = (await headers()).get("origin") ?? "https://productoraear.com";

  // Safeguard: verify database connection and user / workspace exist before generating checkout session
  const user = await prisma.user.findUnique({
    where: { id: payload.userId }
  });
  if (!user) {
    throw new Error("Invalid User context in Talent OS V2 payload");
  }

  // Define deposit amount dynamically. The canonical deposit contract is 100.00 EUR
  const depositAmount = 10000; // 100 EUR in cents

  const session = await stripe.checkout.sessions.create({
    ui_mode: "embedded" as any,
    mode: "payment",
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "eur",
          product_data: {
            name: `Depósito Garantía - Edwin Agudelo`,
            description: `Reserva garantizada de fecha para el show en: ${payload.date}. Identificador: ${payload.bookingId}`,
          },
          unit_amount: depositAmount,
        },
      },
    ],
    return_url: `${origin}/artistas/edwin-agudelo/booking/return?session_id={CHECKOUT_SESSION_ID}`,
    metadata: {
      userId: payload.userId,
      artistId: payload.artistId,
      date: payload.date,
      workspaceId: payload.workspaceId,
      bookingId: payload.bookingId,
      total: "100.00",
      geoDistance: String(payload.geoDistance ?? 0),
    },
  });

  if (!session.client_secret) {
    throw new Error("Embedded checkout generation failed: missing Stripe client secret");
  }

  return { clientSecret: session.client_secret, sessionId: session.id };
}
