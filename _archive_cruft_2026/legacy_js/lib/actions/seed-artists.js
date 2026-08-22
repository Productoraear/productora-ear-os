"use server";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";
import { revalidatePath } from "next/cache";
/**
 * 🏛️ ARTIST EDWIN AGUDELO SYSTEM SEEDER (S-CLASS INTEGRITY)
 * Programmatically initializes the frontend-backend database structure for Master Artist Edwin Agudelo.
 */
export async function seedArtistEdwin() {
    try {
        console.log("🚀 [SEED_ARTIST] Iniciando inicialización de estructura para Edwin Agudelo...");
        // 1. Obtener o crear el Usuario Master (productoraear@gmail.com)
        const user = await prisma.user.upsert({
            where: { email: "productoraear@gmail.com" },
            update: {
                role: Role.ADMIN,
                rank: "NIVEL_4_COMANDANTE",
                isPacienteCero: true,
                displayName: "Edwin Agudelo",
                phone: "+34600000000",
            },
            create: {
                email: "productoraear@gmail.com",
                role: Role.ADMIN,
                rank: "NIVEL_4_COMANDANTE",
                isPacienteCero: true,
                displayName: "Edwin Agudelo",
                phone: "+34600000000",
            },
        });
        console.log(`✅ [SEED_ARTIST] Usuario Master configurado (ID: ${user.id})`);
        // 2. Crear o actualizar el Perfil de Artista (ArtistProfile)
        const artistProfile = await prisma.artistProfile.upsert({
            where: { slug: "edwin-agudelo" },
            update: {
                userId: user.id,
                displayName: "Edwin Agudelo",
                bio: "CEO de Productora EAR y Orquestador de EAR OS. Creador de la metodología VIMUME y el sistema de transformación '61 y 99 Días Haciendo Clic'. El compositor de la igualdad que transforma la tradición en un mensaje de soberanía internacional.",
                genres: ["EAR 360", "Mariachi XXI", "S-Class Strategy"],
                status: "PUBLISHED",
                homeBase: "Madrid Sede Global",
                latitude: 40.4168,
                longitude: -3.7038,
            },
            create: {
                userId: user.id,
                slug: "edwin-agudelo",
                displayName: "Edwin Agudelo",
                bio: "CEO de Productora EAR y Orquestador de EAR OS. Creador de la metodología VIMUME y el sistema de transformación '61 y 99 Días Haciendo Clic'. El compositor de la igualdad que transforma la tradición en un mensaje de soberanía internacional.",
                genres: ["EAR 360", "Mariachi XXI", "S-Class Strategy"],
                status: "PUBLISHED",
                homeBase: "Madrid Sede Global",
                latitude: 40.4168,
                longitude: -3.7038,
            },
        });
        console.log(`✅ [SEED_ARTIST] Perfil de Artista configurado (ID: ${artistProfile.id})`);
        // 3. Inicializar su AuraWallet Soberana
        const wallet = await prisma.auraWallet.upsert({
            where: { userId: user.id },
            update: {
                balance: 99000.0, // Balance de demostración S-Class
                walletAddress: "0xEAR_OMEGA_SOVEREIGN_EDWIN_ADDRESS",
            },
            create: {
                userId: user.id,
                balance: 99000.0,
                currency: "EUR",
                walletAddress: "0xEAR_OMEGA_SOVEREIGN_EDWIN_ADDRESS",
            },
        });
        console.log(`✅ [SEED_ARTIST] Aura Wallet configurada (Address: ${wallet.walletAddress})`);
        // 4. Asegurar Technical Rider Inicial (Versión 1)
        const rider = await prisma.technicalRider.upsert({
            where: {
                artistId_version: {
                    artistId: artistProfile.id,
                    version: 1,
                },
            },
            update: {
                title: "Rider Técnico de Gala V1 - Edwin Agudelo",
            },
            create: {
                artistId: artistProfile.id,
                version: 1,
                title: "Rider Técnico de Gala V1 - Edwin Agudelo",
            },
        });
        console.log(`✅ [SEED_ARTIST] Rider Técnico configurado (Versión: ${rider.version})`);
        // 5. Crear un Bloque de Calendario inicial para pruebas
        const now = new Date();
        const startsAt = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 10, 18, 0);
        const endsAt = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 10, 21, 0);
        const calendarBlock = await prisma.calendarBlock.create({
            data: {
                artistId: artistProfile.id,
                startsAt,
                endsAt,
                label: "Gala de Apertura EAR OS V2",
                status: "BLOCKED",
            },
        });
        console.log(`✅ [SEED_ARTIST] Bloque de Calendario inicial configurado`);
        // 6. Validar caché de rutas
        revalidatePath("/artistas/edwin-agudelo");
        revalidatePath("/admin/command");
        return {
            success: true,
            userId: user.id,
            artistProfileId: artistProfile.id,
            walletAddress: wallet.walletAddress,
        };
    }
    catch (error) {
        console.error("🛑 [SEED_ARTIST_ERROR] Fallo al inicializar estructura de Edwin Agudelo:", error);
        return { success: false, error: error.message };
    }
}
