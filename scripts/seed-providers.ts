import fs from 'fs';
import path from 'path';
import { prisma } from '@/lib/prisma';
import dotenv from 'dotenv';

if (fs.existsSync('.env.production.local')) dotenv.config({ path: '.env.production.local' });
if (fs.existsSync('.env.local')) dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

export interface LegacyProviderData {
  id?: string;
  slug?: string;
  rawName?: string;
  nombre?: string;
  categoria?: string;
  category?: string;
  description?: string;
  extractedImages?: string[];
  legacyFilePath?: string;
  [key: string]: any;
}

/**
 * 🧹 SANITIZADOR DE PROVEEDORES
 * Elimina rutas absolutas de disco local (L:\...) y normaliza a CDN / rutas relativas /media/providers/
 */
export function sanitizeProviderData(legacyData: LegacyProviderData[]) {
  return legacyData.map((provider) => {
    const slug = provider.slug || 
      (provider.nombre || provider.rawName || 'proveedor')
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');

    const cleanImages = (provider.extractedImages || []).map((imgUrl) => {
      // Si la imagen es una ruta de disco local, normalizar a /media/providers/[slug]/
      if (imgUrl.includes('\\') || imgUrl.startsWith('L:') || imgUrl.startsWith('C:')) {
        const fileName = path.basename(imgUrl);
        return `/media/providers/${slug}/${fileName}`;
      }
      return imgUrl;
    });

    return {
      slug,
      rawName: provider.rawName || provider.nombre || 'Proveedor Ecosistema',
      description: provider.description || 'Proveedor verificado en el Ecosistema EAR OS V2.',
      extractedImages: cleanImages,
      claimToken: `CLAIM_${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
      isClaimed: false,
      sourceOrigin: 'SANITIZED_SEED',
    };
  });
}

/**
 * 🚀 SEEDING LIMPIO DE PROVEEDORES
 */
export async function seedCleanProviders() {
  console.log('🌱 [SEED PROVIDERS] Iniciando poblamiento y saneamiento del directorio...');

  const extractedJsonPath = path.join(process.cwd(), 'scripts', 'vampire_shadow_profiles_extracted.json');
  if (!fs.existsSync(extractedJsonPath)) {
    console.error(`❌ No se encontró el archivo de perfiles extraídos: ${extractedJsonPath}`);
    return;
  }

  const rawData = JSON.parse(fs.readFileSync(extractedJsonPath, 'utf-8'));
  const sanitizedProfiles = sanitizeProviderData(rawData);
  console.log(`📦 Saneados ${sanitizedProfiles.length} perfiles de proveedores libres de rutas locales.`);

  let loaded = 0;
  for (const p of sanitizedProfiles) {
    try {
      await prisma.vendorShadowProfile.upsert({
        where: { slug: p.slug },
        update: {
          rawName: p.rawName,
          description: p.description,
          extractedImages: p.extractedImages,
          sourceOrigin: p.sourceOrigin,
        },
        create: p,
      });
      loaded++;
    } catch (err: any) {
      // Ignorar fallos de conexión a DB local si no hay credentials
    }
  }

  // Guardar versión sanitizada lista para CDN
  const cleanJsonPath = path.join(process.cwd(), 'scripts', 'vampire_shadow_profiles_sanitized.json');
  fs.writeFileSync(cleanJsonPath, JSON.stringify(sanitizedProfiles, null, 2), 'utf-8');
  console.log(`💾 [SEED COMPLETE] ${sanitizedProfiles.length} perfiles saneados guardados en ${cleanJsonPath}`);
  console.log(`✅ [POSTGRESQL] ${loaded}/${sanitizedProfiles.length} perfiles sincronizados en base de datos.`);
}

if (require.main === module) {
  seedCleanProviders()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('❌ Error en seeding de proveedores:', err);
      process.exit(1);
    });
}
