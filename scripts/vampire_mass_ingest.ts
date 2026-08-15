import fs from 'fs';
import path from 'path';
import * as cheerio from 'cheerio';
import dotenv from 'dotenv';

// 1. Cargar variables de entorno
if (fs.existsSync('.env.production.local')) dotenv.config({ path: '.env.production.local' });
if (fs.existsSync('.env.local')) dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

// Fallback de URL de base de datos
if (!process.env.POSTGRES_PRISMA_URL && process.env.DATABASE_URL) {
  process.env.POSTGRES_PRISMA_URL = process.env.DATABASE_URL;
}
if (!process.env.POSTGRES_URL_NON_POOLING && process.env.DATABASE_URL) {
  process.env.POSTGRES_URL_NON_POOLING = process.env.DATABASE_URL;
}

const ROOT_BACKUP_PATH = process.env.VAMPIRE_MASS_PATH || `L:\\COPIA DE SEGURIDAD DE PROVEEDORES BODAS`;
const CHUNK_SIZE = 50; // Ingesta en bloques para estabilidad de conexion

function getAllHtmlFiles(dirPath: string, arrayOfFiles: string[] = []): string[] {
  if (!fs.existsSync(dirPath)) return arrayOfFiles;

  try {
    const files = fs.readdirSync(dirPath);

    files.forEach((file) => {
      const fullPath = path.join(dirPath, file);
      try {
        if (fs.statSync(fullPath).isDirectory()) {
          arrayOfFiles = getAllHtmlFiles(fullPath, arrayOfFiles);
        } else if (file.endsWith('.htm') || file.endsWith('.html')) {
          arrayOfFiles.push(fullPath);
        }
      } catch {
        // Omitir archivos bloqueados o sin permisos
      }
    });
  } catch (err) {
    console.warn(`⚠️ Error accediendo a directorio: ${dirPath}`);
  }

  return arrayOfFiles;
}

export async function processMassIngestion() {
  console.log('⚡ [MASS VAMPIRE INGEST] Iniciando escaneo recursivo en raíz local...');
  console.log(`📍 Raíz objetivo: ${ROOT_BACKUP_PATH}`);

  const allFiles = getAllHtmlFiles(ROOT_BACKUP_PATH);
  console.log(`📂 Total de archivos HTML detectados en el disco: ${allFiles.length}`);

  if (allFiles.length === 0) {
    console.warn('⚠️ No se encontraron archivos HTML en la ruta especificada.');
    return;
  }

  // Carga dinámica de Prisma (anti-hoisting y path relativo)
  const { prisma } = await import('../src/lib/prisma');
  let successCount = 0;
  let errorCount = 0;
  const allExtracted: any[] = [];

  for (let i = 0; i < allFiles.length; i += CHUNK_SIZE) {
    const chunk = allFiles.slice(i, i + CHUNK_SIZE);

    await Promise.all(
      chunk.map(async (filePath) => {
        try {
          const htmlContent = fs.readFileSync(filePath, 'utf-8');
          const $ = cheerio.load(htmlContent);

          const metaTitle = $('title').text().replace(/ - Bodas\.net| - Fander/gi, '').trim() || path.basename(filePath, path.extname(filePath));
          const metaDesc = $('meta[name="description"]').attr('content') || $('p').first().text().substring(0, 300) || '';

          const rawImages: string[] = [];
          $('img').each((_, el) => {
            const src = $(el).attr('src') || $(el).attr('data-src');
            if (src && (src.includes('/cat/') || src.includes('/emp/') || src.includes('http'))) {
              rawImages.push(src);
            }
          });

          const slug = path.basename(filePath, path.extname(filePath))
            .toLowerCase()
            .replace(/[^a-z0-9]/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '');

          if (!slug) return;

          const claimToken = `CLAIM_${Math.random().toString(36).substring(2, 10).toUpperCase()}`;

          const itemData = {
            slug,
            rawName: metaTitle,
            description: metaDesc,
            extractedImages: rawImages,
            claimToken,
            isClaimed: false,
            sourceOrigin: 'PARSED_LOCAL_MASS',
          };

          allExtracted.push(itemData);

          try {
            await prisma.vendorShadowProfile.upsert({
              where: { slug },
              update: {
                rawName: metaTitle,
                description: metaDesc,
                extractedImages: rawImages,
                sourceOrigin: 'PARSED_LOCAL_MASS',
              },
              create: itemData,
            });
            successCount++;
          } catch {
            errorCount++;
          }
        } catch {
          errorCount++;
        }
      })
    );

    console.log(`⏳ Progresión: ${Math.min(i + CHUNK_SIZE, allFiles.length)}/${allFiles.length} procesados | Éxitos DB: ${successCount} | Fallos DB: ${errorCount}`);
  }

  // Backup seguro local en JSON
  const outputJsonPath = path.join(process.cwd(), 'scripts', 'vampire_mass_extracted.json');
  fs.writeFileSync(outputJsonPath, JSON.stringify(allExtracted, null, 2), 'utf-8');
  console.log(`💾 [BACKUP LOCAL] ${allExtracted.length} perfiles respaldados en ${outputJsonPath}`);
  console.log(`✅ INGESTA MASIVA FINALIZADA. ${successCount} perfiles actualizados/creados en PostgreSQL.`);
}

if (require.main === module) {
  processMassIngestion()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('❌ Error crítico en Ingesta Masiva:', err);
      process.exit(1);
    });
}
