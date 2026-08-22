'use server';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
/**
 * Server Action: claimProfile
 * 🏛️ Directiva Omega V200.A - Secure Profile Claim Engine
 *
 * Re-binds a pre-seeded, unclaimed Artist or Provider profile to a newly authenticated user.
 * - Ensures single ownership (1-to-1 unique mapping constraint).
 * - Deletes ghost users left behind by bulk background ingestion.
 * - Updates user roles within database transaction blocks.
 */
export async function claimProfile(profileId, userId, profileType) {
    if (!profileId || !userId) {
        return { success: false, error: 'Faltan parámetros críticos de identificación (profileId o userId).' };
    }
    try {
        const result = await prisma.$transaction(async (tx) => {
            // 1. Verify destination User presence
            const targetUser = await tx.user.findUnique({
                where: { id: userId }
            });
            if (!targetUser) {
                return { success: false, error: `El usuario destino ${userId} no existe en el sistema.` };
            }
            if (profileType === 'PROVIDER') {
                // --- PROVIDER CLAIMS ---
                const provider = await tx.providerProfile.findUnique({
                    where: { id: profileId }
                });
                if (!provider) {
                    return { success: false, error: 'El perfil de proveedor especificado no existe.' };
                }
                if (provider.isVerified || provider.userId) {
                    return { success: false, error: 'Este perfil de proveedor ya ha sido verificado o reclamado.' };
                }
                // Check if user already owns a provider profile
                const existingUserProvider = await tx.providerProfile.findUnique({
                    where: { userId }
                });
                if (existingUserProvider) {
                    return { success: false, error: 'El usuario ya posee un perfil de proveedor vinculado.' };
                }
                // Link provider to user and set verified flag
                const updatedProvider = await tx.providerProfile.update({
                    where: { id: profileId },
                    data: {
                        userId: userId,
                        isVerified: true
                    }
                });
                // Upgrade database User role to PROVIDER
                await tx.user.update({
                    where: { id: userId },
                    data: { role: 'PROVIDER' }
                });
                console.log(`[CLAIM ENGINE] Provider Profile "${updatedProvider.name}" successfully claimed by User ${userId}`);
                return {
                    success: true,
                    message: 'Perfil de proveedor vinculado y verificado con éxito.',
                    profile: updatedProvider,
                    roleClaim: 'PROVIDER'
                };
            }
            else {
                // --- ARTIST CLAIMS ---
                const artist = await tx.artistProfile.findUnique({
                    where: { id: profileId }
                });
                if (!artist) {
                    return { success: false, error: 'El perfil de artista especificado no existe.' };
                }
                if (artist.status === 'PUBLISHED') {
                    return { success: false, error: 'Este perfil de artista ya se encuentra publicado y reclamado.' };
                }
                // Check if user already owns an artist profile
                const existingUserArtist = await tx.artistProfile.findUnique({
                    where: { userId }
                });
                if (existingUserArtist) {
                    return { success: false, error: 'El usuario ya posee un perfil de artista vinculado.' };
                }
                const oldGhostUserId = artist.userId;
                // Link profile to new actual User and set status to PUBLISHED
                const updatedArtist = await tx.artistProfile.update({
                    where: { id: profileId },
                    data: {
                        userId: userId,
                        status: 'PUBLISHED'
                    }
                });
                // Clean up redundant placeholder ghost user account
                const oldGhostUser = await tx.user.findUnique({
                    where: { id: oldGhostUserId }
                });
                if (oldGhostUser && oldGhostUser.email.endsWith('@productoraear.com') && oldGhostUserId !== userId) {
                    // Relink and delete
                    await tx.user.delete({
                        where: { id: oldGhostUserId }
                    });
                    console.log(`[CLAIM ENGINE] Purged legacy ghost user: ${oldGhostUser.email}`);
                }
                // Upgrade database User role to ARTIST
                await tx.user.update({
                    where: { id: userId },
                    data: { role: 'ARTIST' }
                });
                console.log(`[CLAIM ENGINE] Artist Profile "${updatedArtist.displayName}" successfully claimed by User ${userId}`);
                return {
                    success: true,
                    message: 'Perfil de artista vinculado y publicado con éxito.',
                    profile: updatedArtist,
                    roleClaim: 'ARTIST'
                };
            }
        });
        if (result.success) {
            revalidatePath('/artistas');
            revalidatePath(`/artistas/${result.profile?.slug}`);
        }
        return result;
    }
    catch (error) {
        console.error('[CLAIM ENGINE] Critical error:', error);
        return { success: false, error: `Error interno en el motor de reclamos: ${error.message}` };
    }
}
