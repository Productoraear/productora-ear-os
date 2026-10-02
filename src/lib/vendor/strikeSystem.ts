import { prisma } from '@/lib/prisma';

/**
 * MOTOR DE STRIKES Y BANEO AUTOMÁTICO
 * Regla SSOT: Si un proveedor acumula 3 strikes, se marca su status como 'BANNED'
 * y se emite una alerta crítica en el sistema.
 */

export const MAX_STRIKES_BEFORE_BAN = 3;

export async function addStrike(vendorProfileId: string, reason: string) {
    // 1. Obtener el perfil actual
    const vendor = await prisma.vendorProfile.findUnique({
        where: { id: vendorProfileId }
    });

    if (!vendor) {
        throw new Error(`VendorProfile con ID ${vendorProfileId} no encontrado.`);
    }

    const currentStatus = vendor.status;

    if (currentStatus === 'BANNED') {
        throw new Error(`El proveedor ya se encuentra BANNED. No se pueden añadir más strikes.`);
    }

    // 2. Incrementar strikes
    const newStrikes = vendor.strikes + 1;
    const isBanned = newStrikes >= MAX_STRIKES_BEFORE_BAN;
    const newStatus = isBanned ? 'BANNED' : currentStatus;

    // 3. Actualizar la base de datos
    const updatedVendor = await prisma.vendorProfile.update({
        where: { id: vendorProfileId },
        data: {
            strikes: newStrikes,
            status: newStatus,
        }
    });

    // 4. Emitir alerta crítica si fue baneado
    if (isBanned) {
        emitCriticalBanAlert(vendorProfileId, reason, newStrikes);
    }

    return {
        success: true,
        strikes: updatedVendor.strikes,
        status: updatedVendor.status,
        bannedNow: isBanned,
    };
}

function emitCriticalBanAlert(vendorProfileId: string, reason: string, strikes: number) {
    // En un sistema real, esto conectaría con un bus de eventos (Kafka, Redis, Inngest, o un Webhook a Slack)
    console.error(`🚨 [CRITICAL ALERT] VENDOR BANNED 🚨`);
    console.error(`VendorProfileID: ${vendorProfileId}`);
    console.error(`Motivo del Strike #3: ${reason}`);
    console.error(`Total Strikes: ${strikes}`);
    console.error(`El proveedor ha sido desactivado permanentemente de la plataforma EAR OS.`);
}
