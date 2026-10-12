"use server";

import { z } from "zod";
import { headers } from "next/headers";
import { isRateLimited } from "@/lib/security/shield";
import { logger } from "@/lib/logger";
import { createCheckoutSession } from "@/lib/payments";
import {
    calculateMariachiQuote,
    MARIACHI_FORMATS,
    MariachiFormatId,
} from "@/lib/mariachi/mariachiDispatchCore";
import {
    DEPOSITO_STRIPE_EUR,
    SPLIT_SOBERANO as SSOT_SPLIT_RATIOS,
} from "@/lib/constants/ear-os-ssot";

/**
 * ════════════════════════════════════════════════════════════════════════════
 * EAR OS — CHECKOUT MARIACHI S-CLASS (STRIPE REAL + PRICE-LOCK SHA-256)
 * ════════════════════════════════════════════════════════════════════════════
 * Server Actions que reemplazan la antigua fachada `/api/payments/checkout`.
 * Cada depósito se recalcula y verifica server-side contra el SSOT:
 *   - Tarifa base mínima 350 € (Solista Edwin Agudelo).
 *   - Depósito inmutable 100 € (Price-Lock).
 *   - Split Soberano 80/10/10 exacto sobre base imponible.
 *   - Hash SHA-256 determinista (integridad anti-manipulación).
 * ════════════════════════════════════════════════════════════════════════════
 */

const DEPOSIT_LOCK_WINDOW_MS = 86_400_000; // 24 h

const DepositSchema = z.object({
    formatId: z.enum(["solista", "cuarteto", "gala", "monumental"]),
    destinationLat: z.number().finite(),
    destinationLng: z.number().finite(),
    destinationName: z.string().min(1).max(200),
    endHour: z.number().int().min(0).max(6).default(2),
    overrideHubId: z.string().optional(),
    repertoireSongs: z.number().int().min(0).max(40).default(0),
    clientHash: z
        .string()
        .regex(/^[a-f0-9]{64}$/, "El hash Price-Lock debe ser un SHA-256 válido"),
    issuedAt: z.number().int().positive(),
});

const AuthorProductSchema = z.object({
    productId: z.enum(["cancion_estudio_180", "video_dedicatoria_120"]),
    amount: z.number().positive().int(),
});

export type MariachiDepositResult =
    | {
        ok: true;
        url: string;
        sessionId: string;
        priceLockHash: string;
        totalGrossPrice: number;
        depositAmount: number;
    }
    | { ok: false; error: string };

export type MariachiAuthorProductResult =
    | { ok: true; url: string; sessionId: string }
    | { ok: false; error: string };

async function resolveClientIp(): Promise<string> {
    const headersList = await headers();
    return headersList.get("x-forwarded-for")?.split(",")[0]!.trim() || "127.0.0.1";
}

/**
 * Checkout del depósito Price-Lock (100 €) para cualquier formato mariachi.
 * Recalcula la cotización en servidor, verifica el hash SHA-256 emitido en
 * cliente y firma la sesión de Stripe con el split soberano 80/10/10.
 */
export async function checkoutMariachiDeposit(
    input: unknown,
): Promise<MariachiDepositResult> {
    const ip = await resolveClientIp();

    if (isRateLimited(ip, 5, 60000)) {
        logger.warn({ event: "MARIACHI_CHECKOUT_RATE_LIMIT", ip });
        return { ok: false, error: "RATE_LIMIT_EXCEEDED: Límite de 5 intentos por minuto." };
    }

    const parsed = DepositSchema.safeParse(input);
    if (!parsed.success) {
        logger.error({ event: "MARIACHI_CHECKOUT_VALIDATION_FAILED", ip });
        return { ok: false, error: "VALIDATION_ERROR: Datos de reserva inválidos." };
    }

    const {
        formatId,
        destinationLat,
        destinationLng,
        destinationName,
        endHour,
        overrideHubId,
        repertoireSongs,
        clientHash,
        issuedAt,
    } = parsed.data;

    // Ventana temporal Price-Lock (24 h).
    if (Date.now() - issuedAt > DEPOSIT_LOCK_WINDOW_MS) {
        return { ok: false, error: "PRICE_LOCK_EXPIRED: La cotización ha caducado. Recalcula la reserva." };
    }

    // Recalcular en servidor (SSOT) — fuente autoritativa del precio.
    const quote = calculateMariachiQuote(
        formatId as MariachiFormatId,
        { lat: destinationLat, lng: destinationLng },
        destinationName,
        endHour,
        overrideHubId,
    );

    // Integridad criptográfica: el hash del cliente debe coincidir exactamente.
    if (clientHash !== quote.priceLockHash) {
        logger.error({ event: "MARIACHI_PRICE_LOCK_HASH_MISMATCH", ip, formatId });
        return { ok: false, error: "PRICE_LOCK_REJECTED: Hash de integridad no coincide." };
    }

    const showcaseFormat =
        MARIACHI_FORMATS.find((f) => f.id === formatId) ?? MARIACHI_FORMATS[0];

    const split = quote.split;
    const splitInvariantOk =
        split.artist80 + split.earOs10 + split.vimume10 === quote.subtotal;

    if (!splitInvariantOk) {
        logger.error({ event: "MARIACHI_SPLIT_INVARIANT_VIOLATION", ip, formatId });
        return { ok: false, error: "SPLIT_INVARIANT_VIOLATION: El desglose 80/10/10 no cuadra." };
    }

    try {
        const session = await createCheckoutSession({
            amount: quote.depositRequired, // 100 € (SSOT)
            concept: `Price-Lock Mariachi EAR OS — ${showcaseFormat.name} (${destinationName})`,
            metadata: {
                type: "RESERVA_MARIACHI",
                artistName: "Edwin Agudelo (Mariachi Imperial)",
                formatId,
                formatName: showcaseFormat.name,
                members: String(showcaseFormat.members),
                destination: destinationName,
                distanceKm: String(Math.round(quote.distanceKm)),
                totalGrossPrice: String(quote.totalGrossPrice),
                subtotal: String(quote.subtotal),
                depositAmount: String(quote.depositRequired),
                repertoireSongs: String(repertoireSongs),
                priceLockHash: quote.priceLockHash,
                artistSplit: String(split.artist80),
                earOsSplit: String(split.earOs10),
                vimumeSplit: String(split.vimume10),
            },
        });

        logger.info({
            event: "MARIACHI_CHECKOUT_SESSION_CREATED",
            sessionId: session.id,
            priceLockHash: quote.priceLockHash,
            ip,
        });

        return {
            ok: true,
            url: session.url,
            sessionId: session.id,
            priceLockHash: quote.priceLockHash,
            totalGrossPrice: quote.totalGrossPrice,
            depositAmount: quote.depositRequired,
        };
    } catch (err) {
        const message = err instanceof Error ? err.message : "Error desconocido";
        logger.error({ event: "MARIACHI_STRIPE_FAILED", error: message, ip });
        return { ok: false, error: `STRIPE_ERROR: ${message}` };
    }
}

/**
 * Checkout para productos de autor (canción ranchera 180 € / vídeo 120 €).
 * Usa Stripe real; no son parte del split soberano de actuación.
 */
export async function checkoutMariachiAuthorProduct(
    input: unknown,
): Promise<MariachiAuthorProductResult> {
    const ip = await resolveClientIp();

    if (isRateLimited(ip, 5, 60000)) {
        logger.warn({ event: "MARIACHI_AUTHOR_PRODUCT_RATE_LIMIT", ip });
        return { ok: false, error: "RATE_LIMIT_EXCEEDED: Límite de 5 intentos por minuto." };
    }

    const parsed = AuthorProductSchema.safeParse(input);
    if (!parsed.success) {
        return { ok: false, error: "VALIDATION_ERROR: Producto inválido." };
    }

    const { productId, amount } = parsed.data;

    const productNames = {
        cancion_estudio_180: "Canción Ranchera Personalizada de Estudio — Edwin Agudelo",
        video_dedicatoria_120: "Vídeo Dedicatoria Cinematográfica — Edwin Agudelo",
    } as const;

    const productName = productNames[productId];

    try {
        const session = await createCheckoutSession({
            amount,
            concept: productName,
            metadata: {
                type: "PRODUCTO_AUTOR_MARIACHI",
                productId,
                productName,
                artistName: "Edwin Agudelo (Mariachi Imperial)",
                amount: String(amount),
                currency: "eur",
            },
        });

        logger.info({
            event: "MARIACHI_AUTHOR_PRODUCT_SESSION_CREATED",
            sessionId: session.id,
            productId,
        });

        return { ok: true, url: session.url, sessionId: session.id };
    } catch (err) {
        const message = err instanceof Error ? err.message : "Error desconocido";
        logger.error({ event: "MARIACHI_AUTHOR_PRODUCT_STRIPE_FAILED", error: message, ip });
        return { ok: false, error: `STRIPE_ERROR: ${message}` };
    }
}