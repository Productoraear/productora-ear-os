"use server";

import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { isRateLimited } from "@/lib/security/shield";
import { logger } from "@/lib/logger";
import { z } from "zod";

/**
 * 🛰️ ARTIST STUDIO PERSISTENCE (W36_T02 — CERO FACHADAS)
 * Server Actions reales de escritura para el búnker del artista.
 *
 * Sustituyen los `setTimeout`/`alert()` de las vistas perfil y config por
 * persistencia real en PostgreSQL (Prisma) con validación Zod y rate limiting.
 */

// ---------------------------------------------------------------------------
// 1. PERSISTENCIA DE PERFIL ARTÍSTICO (artistProfile)
// ---------------------------------------------------------------------------

const ArtistProfileSchema = z.object({
  userId: z.string().min(1, "userId requerido").max(64),
  stageName: z.string().min(2, "Nombre artístico mínimo 2 caracteres.").max(120),
  bio: z.string().max(500, "Biografía máxima 500 caracteres."),
  genres: z.array(z.string().min(1).max(60)).max(20),
});

export type ArtistProfileSaveResult = {
  ok: boolean;
  message: string;
};

export async function saveArtistProfile(
  input: z.infer<typeof ArtistProfileSchema>
): Promise<ArtistProfileSaveResult> {
  const headersList = await headers();
  const ip =
    headersList.get("x-forwarded-for")?.split(",")[0].trim() || "127.0.0.1";

  if (isRateLimited(ip, 20, 60_000)) {
    return { ok: false, message: "RATE_LIMIT_EXCEEDED: Demasiados guardados. Espera un minuto." };
  }

  const parsed = ArtistProfileSchema.safeParse(input);
  if (!parsed.success) {
    logger.error({ event: "ARTIST_PROFILE_VALIDATION_FAILED", errors: parsed.error.format(), ip });
    return {
      ok: false,
      message: `VALIDATION_ERROR: ${parsed.error.issues.map((e) => e.message).join(", ")}`,
    };
  }

  const { userId, stageName, bio, genres } = parsed.data;

  try {
    await prisma.artistProfile.upsert({
      where: { userId },
      create: {
        userId,
        stageName,
        displayName: stageName,
        bio,
        genres,
        status: "PUBLISHED",
      },
      update: {
        stageName,
        displayName: stageName,
        bio,
        genres,
      },
    });

    logger.info({ event: "ARTIST_PROFILE_SAVED", userId, ip });
    return { ok: true, message: "Perfil guardado correctamente." };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error desconocido al guardar el perfil.";
    logger.error({ event: "ARTIST_PROFILE_SAVE_ERROR", userId, error: message, ip });
    return { ok: false, message: `DB_ERROR: ${message}` };
  }
}

// ---------------------------------------------------------------------------
// 2. PERSISTENCIA DE PREFERENCIAS DE CONFIGURACIÓN (UserSpace / preferencias)
// ---------------------------------------------------------------------------

const ArtistConfigSchema = z.object({
  userId: z.string().min(1, "userId requerido").max(64),
  notifications: z.object({
    emailBookings: z.boolean(),
    emailPayments: z.boolean(),
    whatsappAlerts: z.boolean(),
    telegramUpdates: z.boolean(),
  }),
  privacy: z.object({
    publicProfile: z.boolean(),
    showPhone: z.boolean(),
    showEmail: z.boolean(),
    allowDirectBooking: z.boolean(),
  }),
  maxBookingsPerWeek: z.number().int().min(1).max(7),
  timezone: z.string().min(1).max(64),
});

export type ArtistConfigSaveResult = {
  ok: boolean;
  message: string;
};

export async function saveArtistConfig(
  input: z.infer<typeof ArtistConfigSchema>
): Promise<ArtistConfigSaveResult> {
  const headersList = await headers();
  const ip =
    headersList.get("x-forwarded-for")?.split(",")[0].trim() || "127.0.0.1";

  if (isRateLimited(ip, 20, 60_000)) {
    return { ok: false, message: "RATE_LIMIT_EXCEEDED: Demasiados guardados. Espera un minuto." };
  }

  const parsed = ArtistConfigSchema.safeParse(input);
  if (!parsed.success) {
    logger.error({ event: "ARTIST_CONFIG_VALIDATION_FAILED", errors: parsed.error.format(), ip });
    return {
      ok: false,
      message: `VALIDATION_ERROR: ${parsed.error.issues.map((e) => e.message).join(", ")}`,
    };
  }

  const { userId, notifications, privacy, maxBookingsPerWeek, timezone } = parsed.data;

  try {
    // Persistimos en UserSpace.availability como patrón ya establecido de JSON
    // estructurado, preservando el resto de campos del espacio del usuario.
    await prisma.userSpace.upsert({
      where: { userId },
      create: {
        userId,
        availability: JSON.stringify({
          notifications,
          privacy,
          maxBookingsPerWeek,
          timezone,
        }),
      },
      update: {
        availability: JSON.stringify({
          notifications,
          privacy,
          maxBookingsPerWeek,
          timezone,
        }),
      },
    });

    logger.info({ event: "ARTIST_CONFIG_SAVED", userId, ip });
    return { ok: true, message: "Configuración guardada correctamente." };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error desconocido al guardar la configuración.";
    logger.error({ event: "ARTIST_CONFIG_SAVE_ERROR", userId, error: message, ip });
    return { ok: false, message: `DB_ERROR: ${message}` };
  }
}
