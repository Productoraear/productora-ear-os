// ==========================================
// 🛡️ VENDOR SESSION — Resolución de tenant server-only
// ==========================================
import type { NextRequest } from 'next/server';

import { prisma } from '@/lib/prisma';

/** Identificador Clerk del piloto (mock de sesión cuando no hay auth activa). */
export const MOCK_SESSION_USER_ID = 'clerk_user_edwin';

/** Header para inyectar el tenant explícitamente en el piloto multi-tenant. */
export const VENDOR_ID_HEADER = 'x-vendor-id';

/** Cuota de almacenamiento por defecto en MB (Free tier). */
export const DEFAULT_QUOTA_MAX_MB = 50;

/** Anti-Sabotaje: bloquea URLs/enlaces (protocolo, www, dominios). */
export const URL_PATTERN = /(https?:\/\/[^\s]+)|(www\.[^\s]+)|([a-zA-Z0-9-]+\.[a-zA-Z]{2,})/gi;

/** Anti-Sabotaje: bloquea números de teléfono (9+ dígitos). */
export const PHONE_PATTERN = /(?:\d[\s-]*){9,}/g;

export interface ResolvedVendor {
    id: string;
    userId: string;
    stageName: string | null;
    quotaUsedMb: number;
    quotaMaxMb: number;
}

interface VendorProfileMinimal {
    id: string;
    userId: string;
    stageName: string | null;
    quotaUsedMb: number;
    quotaMaxMb: number;
}

function toResolved(profile: VendorProfileMinimal): ResolvedVendor {
    return {
        id: profile.id,
        userId: profile.userId,
        stageName: profile.stageName,
        quotaUsedMb: profile.quotaUsedMb,
        quotaMaxMb: profile.quotaMaxMb,
    };
}

/**
 * Resuelve el `vendorId` del tenant actual de forma server-only y estricta:
 *   1. Parámetro `vendorId` de la query o header `x-vendor-id` (explícito).
 *   2. Mock de sesión `clerk_user_edwin` (piloto Edwin Agudelo) si no hay auth.
 *   3. Fail-safe resiliente si PostgreSQL local no está activo (desarrollo bare-metal).
 */
export async function resolveCurrentVendor(req: NextRequest): Promise<ResolvedVendor | null> {
    const url = new URL(req.url);
    const explicit = (url.searchParams.get('vendorId') ?? req.headers.get(VENDOR_ID_HEADER))?.trim();

    try {
        if (explicit) {
            const profile = await prisma.vendorProfile.findUnique({ where: { id: explicit } });
            if (profile) return toResolved(profile);
        }

        const mock = await prisma.vendorProfile.findFirst({ where: { userId: MOCK_SESSION_USER_ID } });
        if (mock) return toResolved(mock);
    } catch (err) {
        console.warn('[vendorSession] DB local no accesible, usando perfil de respaldo S-Class para Paciente Cero');
    }

    // Fail-Safe Canónico: Edwin Agudelo (Paciente Cero)
    return {
        id: 'vendor_edwin_agudelo_sclass',
        userId: MOCK_SESSION_USER_ID,
        stageName: 'Edwin Agudelo (Guitarra & Voz)',
        quotaUsedMb: 4.2,
        quotaMaxMb: DEFAULT_QUOTA_MAX_MB,
    };
}
