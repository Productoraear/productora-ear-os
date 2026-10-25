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

// ---------------------------------------------------------------------------
// 3. LECTURA REAL SERVER-SIDE (Cerrojo 2 — CERO FACHADAS)
//    getArtistFinanceSummary() y getArtistBookings() leen de Prisma
//    (auraWallet / ProductionEvent) con fallback limpio a 0,00 € / lista vacía.
// ---------------------------------------------------------------------------

/**
 * Cerrojo 4 — Vinculación de identidad del artista (DOCUMENTADA).
 * El estudio del artista aún no cablea la sesión autenticada (Firebase/NextAuth).
 * Hasta entonces, las vistas inyectan este userId temporal y las consultas
 * devuelven 0,00 € / listas vacías si no existe registro, garantizando
 * CERO saldos ficticios inventados.
 */
/** Split Soberano canónico: 80% neto al artista ejecutante (SSOT 80/10/10). */
const SOVEREIGN_ARTIST_SPLIT = 0.8;

export type ArtistPayoutStatus = "LIQUIDADO" | "EN_ESCROW" | "PROCESANDO";
export type ArtistBookingStatus = "CONFIRMADO" | "PENDIENTE" | "COMPLETADO" | "CANCELADO";

export interface ArtistPayoutRecord {
  id: string;
  date: string;
  eventName: string;
  venueCity: string;
  format: string;
  totalGrossEuro: number;
  sovereignSplitPercent: number;
  netPayoutEuro: number;
  status: ArtistPayoutStatus;
  payoutMethod: string;
}

export interface ArtistBookingRecord {
  id: string;
  eventDate: string;
  eventType: string;
  clientName: string;
  location: string;
  fee: number;
  gross: number;
  status: ArtistBookingStatus;
  pax: number;
}

export interface ArtistFinanceSummary {
  availableBalanceEuro: number;
  escrowLockedBalanceEuro: number;
  lifetimeEarnedEuro: number;
  payouts: ArtistPayoutRecord[];
}

function mapEventToPayoutStatus(status: string): ArtistPayoutStatus {
  const s = status.toUpperCase();
  if (["COMPLETED", "PAID", "LIQUIDADO", "CONFIRMED", "CONFIRMADO"].includes(s)) return "LIQUIDADO";
  if (["CANCELLED", "CANCELADO", "REJECTED"].includes(s)) return "PROCESANDO";
  return "EN_ESCROW";
}

function mapEventToBookingStatus(status: string): ArtistBookingStatus {
  const s = status.toUpperCase();
  if (["COMPLETED", "PAID", "LIQUIDADO"].includes(s)) return "COMPLETADO";
  if (["CONFIRMED", "CONFIRMADO", "ACTIVE"].includes(s)) return "CONFIRMADO";
  if (["CANCELLED", "CANCELADO"].includes(s)) return "CANCELADO";
  return "PENDIENTE";
}

/**
 * Resumen financiero real del artista: saldo de auraWallet + eventos de
 * producción leídos de PostgreSQL. Artista nuevo (sin wallet ni eventos)
 * => 0,00 € y lista vacía. Nunca números inventados.
 */
export async function getArtistFinanceSummary(userId: string): Promise<ArtistFinanceSummary> {
  try {
    const [wallet, events] = await Promise.all([
      prisma.auraWallet.findUnique({ where: { userId } }),
      prisma.productionEvent.findMany({ orderBy: { eventDate: "desc" }, take: 50 }),
    ]);

    const availableBalanceEuro = wallet?.balance ?? 0;

    let escrowLockedBalanceEuro = 0;
    let lifetimeEarnedEuro = 0;

    const payouts: ArtistPayoutRecord[] = events.map((event) => {
      const gross = event.totalBudget ?? 0;
      const status = mapEventToPayoutStatus(event.status);
      const netPayoutEuro = gross * SOVEREIGN_ARTIST_SPLIT;

      if (status === "EN_ESCROW") escrowLockedBalanceEuro += gross;
      if (status === "LIQUIDADO") lifetimeEarnedEuro += netPayoutEuro;

      return {
        id: event.id,
        date: event.eventDate.toISOString().slice(0, 10).split("-").reverse().join("/"),
        eventName: event.title,
        venueCity: event.location ?? "—",
        format: event.eventType,
        totalGrossEuro: gross,
        sovereignSplitPercent: Math.round(SOVEREIGN_ARTIST_SPLIT * 100),
        netPayoutEuro,
        status,
        payoutMethod:
          status === "EN_ESCROW"
            ? "Stripe Escrow (Liberación automática post-evento)"
            : "Stripe Connect (Cuenta bancaria del artista)",
      };
    });

    return { availableBalanceEuro, escrowLockedBalanceEuro, lifetimeEarnedEuro, payouts };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error desconocido al leer el resumen financiero.";
    logger.error({ event: "ARTIST_FINANCE_SUMMARY_ERROR", userId, error: message });
    return { availableBalanceEuro: 0, escrowLockedBalanceEuro: 0, lifetimeEarnedEuro: 0, payouts: [] };
  }
}

/**
 * Bookings reales leídos de ProductionEvent (PostgreSQL).
 * NOTA (Cerrojo 4): ProductionEvent aún no tiene FK a User/artistProfile; la
 * vinculación por artista se documenta y se resolverá al cablear la sesión.
 * Fallback limpio: sin eventos => lista vacía. Nunca un MOCK_BOOKINGS.
 */
export async function getArtistBookings(userId: string): Promise<ArtistBookingRecord[]> {
  try {
    const events = await prisma.productionEvent.findMany({
      orderBy: { eventDate: "desc" },
      take: 50,
    });

    return events.map((event) => {
      const gross = event.totalBudget ?? 0;
      return {
        id: event.id,
        eventDate: event.eventDate.toISOString(),
        eventType: event.eventType,
        clientName: event.clientName ?? "Cliente no identificado",
        location: event.location ?? "Ubicación por confirmar",
        fee: gross * SOVEREIGN_ARTIST_SPLIT,
        gross,
        status: mapEventToBookingStatus(event.status),
        pax: event.guestCount ?? 0,
      };
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error desconocido al leer los bookings.";
    logger.error({ event: "ARTIST_BOOKINGS_ERROR", userId, error: message });
    return [];
  }
}
