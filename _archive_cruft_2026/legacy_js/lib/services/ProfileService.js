import { prisma } from '@/lib/prisma';
import { Role } from '@prisma/client';
export class ProfileService {
    /**
     * Creates an Artist Profile and upgrades the user's role.
     * Ensures both operations succeed or fail together using a transaction.
     * @param userId The ID of the user to create the profile for.
     * @param data The data for the new artist profile.
     */
    static async createArtistProfile(userId, data) {
        try {
            // First, check if a profile already exists for this user to prevent duplicates
            const existingProfile = await prisma.artistProfile.findUnique({
                where: { userId },
            });
            if (existingProfile) {
                throw new Error('Artist profile already exists for this user.');
            }
            // Also check if the slug is already taken
            const existingSlug = await prisma.artistProfile.findUnique({
                where: { slug: data.slug },
            });
            if (existingSlug) {
                throw new Error('This unique URL (slug) is already taken.');
            }
            const [_, user] = await prisma.$transaction([
                prisma.artistProfile.create({
                    data: {
                        userId,
                        slug: data.slug,
                        displayName: data.displayName,
                        bio: data.bio,
                        genres: data.genres,
                        status: 'ACTIVE', // Set a default active status
                    },
                }),
                prisma.user.update({
                    where: { id: userId },
                    data: { role: Role.ARTIST },
                }),
            ]);
            return user;
        }
        catch (error) {
            console.error('🛑 [PROFILE_SERVICE] Failed to create artist profile:', error);
            // Re-throw the original error to be handled by the API layer
            throw error;
        }
    }
}
