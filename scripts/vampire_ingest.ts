// Ruta: scripts/vampire_ingest.ts
import fs from 'fs';
import path from 'path';
import * as cheerio from 'cheerio';
import { prisma } from '@/lib/prisma';
import dotenv from 'dotenv'; 

// 1. Cargar credenciales de producción para que Prisma pueda conectar con PostgreSQL
if (fs.existsSync('.env.production.local')) {
  dotenv.config({ path: '.env.production.local' });
}
if (fs.existsSync('.env.local')) {
  dotenv.config({ path: '.env.local' });
}
if (!process.env.POSTGRES_PRISMA_URL && process.env.DATABASE_URL) {
  process.env.POSTGRES_PRISMA_URL = process.env.DATABASE_URL;
}
if (!process.env.POSTGRES_URL_NON_POOLING && process.env.DATABASE_URL) {
  process.env.POSTGRES_URL_NON_POOLING = process.env.DATABASE_URL;
}

const LOCAL_BACKUP_PATH = `L:\\COPIA DE SEGURIDAD DE PROVEEDORES BODAS\\prueba obsidian html`;

export async function processHtmlIngestion() {
  console.log('⚡ [VAMPIRE INGEST] Iniciando escaneo de materia oscura en disco local...');
  console.log(`📍 Ruta objetivo: ${LOCAL_BACKUP_PATH}`);
  
  if (!fs.existsSync(LOCAL_BACKUP_PATH)) {
    console.warn(`⚠️ Ruta no encontrada en disco local: ${LOCAL_BACKUP_PATH}`);
    console.log('💡 Consejo: Configura VAMPIRE_BACKUP_PATH en .env si la unidad L: tiene una letra diferente.');
    return { success: false, reason: 'PATH_NOT_FOUND', processedCount: 0 };
  }

  const files = fs.readdirSync(LOCAL_BACKUP_PATH).filter(f => f.endsWith('.htm') || f.endsWith('.html'));
  console.log(`📂 Detectados ${files.length} archivos para extracción...`);

  const extractedProfiles: any[] = [];
  let count = 0;

  for (const file of files) {
      try {
        const filePath = path.join(LOCAL_BACKUP_PATH, file);
        const htmlContent = fs.readFileSync(filePath, 'utf-8');
        const $ = cheerio.load(htmlContent);

        // 1. Extracción de JSON-LD y Microdatos
        const metaTitle = $('title').text().replace(/ - Bodas\.net| - Fander/gi, '').trim() || path.basename(file, path.extname(file));
        const metaDesc = $('meta[name="description"]').attr('content') || $('p').first().text().substring(0, 300) || '';
        
        // 2. Extracción de imágenes en alta resolución
        const rawImages: string[] = [];
        $('img').each((_, el) => {
          const src = $(el).attr('src') || $(el).attr('data-src');
          if (src && (src.includes('/cat/') || src.includes('/emp/') || src.includes('http'))) {
            rawImages.push(src);
          }
        });

        // 3. Normalización del Perfil Sombra
        const slug = path.basename(file, path.extname(file))
          .toLowerCase()
          .replace(/[^a-z0-9]/g, '-')
          .replace(/-+/g, '-')
          .replace(/^-|-$/g, '');

        if (!slug) continue;

        const claimToken = `CLAIM_${Math.random().toString(36).substring(2, 10).toUpperCase()}`;

        const profileData = {
          slug,
          rawName: metaTitle,
          description: metaDesc,
          extractedImages: rawImages,
          claimToken,
          isClaimed: false,
          sourceOrigin: 'PARSED_LOCAL',
        };

        extractedProfiles.push(profileData);

        // Intentar guardar en Prisma si la conexión está disponible
        try {
          await prisma.vendorShadowProfile.upsert({
            where: { slug },
            update: {
              rawName: metaTitle,
              description: metaDesc,
              extractedImages: rawImages,
              sourceOrigin: 'PARSED_LOCAL',
            },
            create: profileData
          });
          count++;
        } catch (dbErr: any) {
          // Si la DB falla en local, se almacena en el inventario JSON local
          // console.warn(`⚠️ [DB OFFLINE] Guardando en buffer para ${slug}`);
        }
      } catch (err) {
        console.error(`❌ Error procesando ${file}:`, err);
      }
    }

    // Exportar Backup de Materia Oscura a JSON local
    const outputJsonPath = path.join(process.cwd(), 'scripts', 'vampire_shadow_profiles_extracted.json');
    fs.writeFileSync(outputJsonPath, JSON.stringify(extractedProfiles, null, 2), 'utf-8');
    console.log(`💾 [LOCAL REPOSITORY] Exportados ${extractedProfiles.length} perfiles a ${outputJsonPath}`);


  console.log(`✅ Ingesta finalizada. ${count} Perfiles Sombra cargados en PostgreSQL.`);
  return { success: true, processedCount: count };
}

// 4. Ejecución directa si se invoca con ts-node / npx tsx
if (require.main === module) {
  processHtmlIngestion()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('❌ Error fatal en Vampire Ingest:', err);
      process.exit(1);
    });
}