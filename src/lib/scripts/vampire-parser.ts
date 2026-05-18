import { prisma } from '@/lib/prisma';
import * as fs from 'fs';
import * as path from 'path';

// Helper to clean and generate URLs
function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove accents
    .replace(/\s+/g, '-') // replace spaces with -
    .replace(/[^\w\-]+/g, '') // remove all non-word chars
    .replace(/\-\-+/g, '-') // replace multiple - with single -
    .replace(/^-+/, '') // trim - from start
    .replace(/-+$/, ''); // trim - from end
}

export async function runIngestion() {
  console.log("Initializing Directiva Omega V200.A Ingestion...");

  // Primary paths from local system backups
  const venuesPath = "H:\\00_PRODUCTORA_EAR\\BODEGA_CUARENTENA\\ear-gold\\productora-ear-app\\src\\data\\venues.json";
  const providersPath = "H:\\00_PRODUCTORA_EAR\\BODEGA_CUARENTENA\\ear-gold\\productora-ear-app\\proveedores_completo.json";

  let venuesData: any[] = [];
  let providersData: any[] = [];

  // 1. Read Backup Venues
  try {
    if (fs.existsSync(venuesPath)) {
      const raw = fs.readFileSync(venuesPath, 'utf8');
      venuesData = JSON.parse(raw);
      console.log(`[VAMPIRE] Located ${venuesData.length} records in venues.json`);
    } else {
      console.warn(`[VAMPIRE] venues.json not found at ${venuesPath}. Using empty fallback.`);
    }
  } catch (err) {
    console.error("[VAMPIRE] Failed to parse venues.json:", err);
  }

  // 2. Read Backup Providers
  try {
    if (fs.existsSync(providersPath)) {
      const raw = fs.readFileSync(providersPath, 'utf8');
      providersData = JSON.parse(raw);
      console.log(`[VAMPIRE] Located ${providersData.length} records in proveedores_completo.json`);
    }
  } catch (err) {
    console.error("[VAMPIRE] Failed to parse proveedores_completo.json:", err);
  }

  // 3. Fallback High-Density Artists (Draft Roster from Fander/Legacy)
  const fallbackArtists = [
    {
      displayName: "Edwin Agudelo",
      bio: "Edwin Agudelo es un tenor lírico de gala y director técnico de sonido, líder de Productora EAR en España.",
      genres: ["Opera", "Bolero", "Mariachi"],
      homeBase: "Madrid, España",
      mediaKitUrl: "/media/artists/edwin-agudelo.pdf"
    },
    {
      displayName: "Colibrí Symphony Project",
      bio: "Ensamble de alta fidelidad musical especializado en fusiones clásicas y contemporáneas para eventos institucionales.",
      genres: ["Classical", "Crossover", "Instrumental"],
      homeBase: "Barcelona, España",
      mediaKitUrl: "/media/artists/colibri.pdf"
    },
    {
      displayName: "Mariachi de Gala Real",
      bio: "Espectáculo acústico de rancheras y folklore mexicano tradicional con instrumentación S-Class.",
      genres: ["Mariachi", "Tradicional", "Folk"],
      homeBase: "Sevilla, España",
      mediaKitUrl: "/media/artists/mariachi.pdf"
    }
  ];

  // 4. ACID Transaction Ingestion
  try {
    const result = await prisma.$transaction(async (tx) => {
      let providersCount = 0;
      let artistsCount = 0;

      // Ingest up to 100 Premium Venues as Providers
      const selectedVenues = venuesData.slice(0, 100);
      for (const venue of selectedVenues) {
        if (!venue.nombre) continue;

        const baseSlug = slugify(venue.nombre);
        const uniqueSlug = `${baseSlug}-${Math.random().toString(36).substring(2, 6)}`;
        
        await tx.providerProfile.upsert({
          where: { name: venue.nombre },
          update: {
            category: venue.categoria || "finca",
            location: venue.provincia || "España",
            isVerified: false
          },
          create: {
            name: venue.nombre,
            slug: uniqueSlug,
            category: venue.categoria || "finca",
            location: venue.provincia || "España",
            isVerified: false,
            roiGuaranteeScore: parseFloat((Math.random() * 2 + 8).toFixed(1)),
            roiProjected: parseFloat((Math.random() * 5 + 90).toFixed(1)),
            auraLevel: parseFloat((Math.random() * 3 + 7).toFixed(1)),
            technicalReliability: parseFloat((Math.random() * 2 + 8).toFixed(1))
          }
        });
        providersCount++;
      }

      // Ingest Draft Musicians (integrity check creates required users first)
      for (const artist of fallbackArtists) {
        const slug = slugify(artist.displayName);
        const email = `${slug}@productoraear.com`;

        // Safe user creation or fetch
        const user = await tx.user.upsert({
          where: { email },
          update: {},
          create: {
            email,
            role: "ARTIST",
            displayName: artist.displayName,
            rank: "NIVEL_0_EXPLORADOR"
          }
        });

        // Safe profile creation
        await tx.artistProfile.upsert({
          where: { userId: user.id },
          update: {
            displayName: artist.displayName,
            bio: artist.bio,
            genres: artist.genres,
            status: "DRAFT",
            homeBase: artist.homeBase,
            mediaKitUrl: artist.mediaKitUrl
          },
          create: {
            userId: user.id,
            slug,
            displayName: artist.displayName,
            bio: artist.bio,
            genres: artist.genres,
            status: "DRAFT",
            homeBase: artist.homeBase,
            mediaKitUrl: artist.mediaKitUrl
          }
        });
        artistsCount++;
      }

      return { providersCount, artistsCount };
    });

    console.log(`[VAMPIRE] Ingestion successful. Ingested ${result.providersCount} providers and ${result.artistsCount} artists.`);
    return result;

  } catch (error) {
    console.error("[VAMPIRE] Ingestion transaction failed:", error);
    throw error;
  }
}
