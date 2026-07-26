const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  try {
    console.log("🚀 [LOCAL_SEED] Iniciando inicialización de estructura local para Edwin Agudelo...");

    // 1. Obtener o crear el Usuario Master (productoraear@gmail.com)
    const user = await prisma.user.upsert({
      where: { email: "productoraear@gmail.com" },
      update: {
        role: "ADMIN",
        rank: "NIVEL_4_COMANDANTE",
        isPacienteCero: true,
        displayName: "Edwin Agudelo",
        phone: "+34600000000",
      },
      create: {
        email: "productoraear@gmail.com",
        role: "ADMIN",
        rank: "NIVEL_4_COMANDANTE",
        isPacienteCero: true,
        displayName: "Edwin Agudelo",
        phone: "+34600000000",
      },
    });
    console.log(`✅ [LOCAL_SEED] Usuario Master configurado (ID: ${user.id})`);

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
    console.log(`✅ [LOCAL_SEED] Perfil de Artista configurado (ID: ${artistProfile.id})`);

    // 3. Inicializar su AuraWallet Soberana
    const wallet = await prisma.auraWallet.upsert({
      where: { userId: user.id },
      update: {
        balance: 99000.0,
        walletAddress: "0xEAR_OMEGA_SOVEREIGN_EDWIN_ADDRESS",
      },
      create: {
        userId: user.id,
        balance: 99000.0,
        currency: "EUR",
        walletAddress: "0xEAR_OMEGA_SOVEREIGN_EDWIN_ADDRESS",
      },
    });
    console.log(`✅ [LOCAL_SEED] Aura Wallet configurada (Address: ${wallet.walletAddress})`);

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
    console.log(`✅ [LOCAL_SEED] Rider Técnico configurado (Versión: ${rider.version})`);

    // 5. Crear un Bloque de Calendario inicial para pruebas
    const now = new Date();
    const startsAt = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 10, 18, 0);
    const endsAt = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 10, 21, 0);

    // Delete existing to prevent duplicate errors if run again
    await prisma.calendarBlock.deleteMany({
      where: { artistId: artistProfile.id }
    });

    const calendarBlock = await prisma.calendarBlock.create({
      data: {
        artistId: artistProfile.id,
        startsAt,
        endsAt,
        label: "Gala de Apertura EAR OS V2",
        status: "BLOCKED",
      },
    });
    console.log(`✅ [LOCAL_SEED] Bloque de Calendario inicial configurado`);
    console.log(`🎉 [LOCAL_SEED] Estructura de Edwin Agudelo sembrada con éxito en base de datos local!`);

  } catch (error) {
    console.error("🛑 [LOCAL_SEED_ERROR] Fallo al sembrar base de datos local:", error);
  } finally {
    await prisma.$disconnect();
  }
}

run();
