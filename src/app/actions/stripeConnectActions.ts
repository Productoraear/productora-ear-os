"use server";

import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/payments";
import { headers } from "next/headers";
import { isRateLimited } from "@/lib/security/shield";
import { logger } from "@/lib/logger";
import { z } from "zod";

const OnboardingSchema = z.object({
  providerId: z.string().uuid("El ID del proveedor debe ser un UUID válido"),
  userId: z.string().min(1, "Se requiere un usuario autenticado"),
});

/**
 * 🏦 STRIPE CONNECT EXPRESS — AUTOMATED ASSIMILATION ENGINE (V206)
 *
 * Creates or reuses a Stripe Express account for a ProviderProfile,
 * generates an Account Link for hosted onboarding, and returns the URL.
 *
 * Firebase acts as session proof-of-identity; Stripe closes the real
 * fiscal verification via its hosted KYC flow. isVerified is NEVER
 * set by this action — only the account.updated webhook can do that.
 */
export async function createConnectOnboardingLink(input: {
  providerId: string;
  userId: string;
}) {
  // 1. Rate Limiting
  const headersList = await headers();
  const ip =
    headersList.get("x-forwarded-for")?.split(",")[0].trim() || "127.0.0.1";

  if (isRateLimited(ip, 3, 60000)) {
    logger.warn({ event: "CONNECT_ONBOARDING_RATE_LIMITED", ip });
    throw new Error("RATE_LIMIT_EXCEEDED");
  }

  // 2. Zod validation
  const parsed = OnboardingSchema.safeParse(input);
  if (!parsed.success) {
    logger.error({
      event: "CONNECT_ONBOARDING_VALIDATION_FAILED",
      errors: parsed.error.format(),
      ip,
    });
    throw new Error(
      `VALIDATION_ERROR: ${parsed.error.issues.map((e) => e.message).join(", ")}`
    );
  }

  const { providerId, userId } = parsed.data;

  // 3. Verify the caller owns this provider profile
  const provider = await prisma.providerProfile.findUnique({
    where: { id: providerId },
    select: {
      id: true,
      userId: true,
      name: true,
      stripeAccountId: true,
      stripeConnected: true,
      isVerified: true,
    },
  });

  if (!provider) {
    logger.error({ event: "CONNECT_ONBOARDING_PROVIDER_NOT_FOUND", providerId, ip });
    throw new Error("PROVIDER_NOT_FOUND");
  }

  if (provider.userId !== userId) {
    logger.error({
      event: "CONNECT_ONBOARDING_OWNERSHIP_MISMATCH",
      providerId,
      claimedUserId: userId,
      actualUserId: provider.userId,
      ip,
    });
    throw new Error("OWNERSHIP_MISMATCH: No tienes permiso sobre este perfil.");
  }

  // 4. Create or reuse Stripe Express account
  let stripeAccountId = provider.stripeAccountId;

  if (!stripeAccountId) {
    const account = await stripe.accounts.create({
      type: "express",
      country: "ES",
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
      metadata: {
        earProviderId: providerId,
        earUserId: userId,
      },
    });

    stripeAccountId = account.id;

    await prisma.providerProfile.update({
      where: { id: providerId },
      data: { stripeAccountId },
    });

    logger.info({
      event: "CONNECT_ACCOUNT_CREATED",
      stripeAccountId,
      providerId,
    });
  }

  // 5. Generate Account Link for hosted onboarding
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3007";

  const accountLink = await stripe.accountLinks.create({
    account: stripeAccountId,
    refresh_url: `${baseUrl}/studio/artist?onboarding=refresh`,
    return_url: `${baseUrl}/studio/artist?onboarding=complete`,
    type: "account_onboarding",
  });

  logger.info({
    event: "CONNECT_ONBOARDING_LINK_GENERATED",
    providerId,
    stripeAccountId,
  });

  return { url: accountLink.url };
}
