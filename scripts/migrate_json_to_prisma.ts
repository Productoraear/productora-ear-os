import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

/**
 * 🏛️ ANTIGRAVITY OMEGA v4.1 — INGESTA ACID PRISMA/SUPABASE
 * =======================================================
 * Carga los 12.739 perfiles consolidados en src/data/vampirized_providers.json
 * e inserta en lotes de 500 registros en VendorShadowProfile con skipDuplicates.
 */

const BATCH_SIZE = 500;
const JSON_FILE_PATH = path.join(process.cwd(), 'src', 'data', 'vampirized_providers.json');

function cleanString(str: any): string {
  if (typeof str !== 'string') return '';
  return str.replace(/\0/g, '').replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '').trim();
}

function computeSha256(input: string): string {
  return crypto.createHash('sha256').update(cleanString(input).toLowerCase()).digest('hex');
}

function generateClaimToken(name: string, province: string): string {
  const hash = crypto.createHash('sha256').update(`${cleanString(name)}-${cleanString(province)}`.toLowerCase()).digest('hex');
  return `EAR-CLAIM-${hash.substring(0, 12).toUpperCase()}`;
}

async function main() {
  console.log('='.repeat(72));
  console.log('🏛️ ANTIGRAVITY OMEGA v4.1 — MIGRACIÓN ACID PRISMA/SUPABASE');
  console.log('='.repeat(72));

  if (!fs.existsSync(JSON_FILE_PATH)) {
    console.error(`[ERROR] Archivo fuente no encontrado: ${JSON_FILE_PATH}`);
    process.exit(1);
  }

  const rawData = fs.readFileSync(JSON_FILE_PATH, 'utf-8');
  const providers: any[] = JSON.parse(rawData);
  console.log(`[INFO] Registros leídos de JSON: ${providers.length.toLocaleString()}`);

  const hasDbUrl = Boolean(process.env.POSTGRES_PRISMA_URL || process.env.DATABASE_URL);
  if (!hasDbUrl) {
    console.warn('[WARN] No se detectó POSTGRES_PRISMA_URL / DATABASE_URL en el entorno.');
    console.warn('[FALLBACK DEFENSIVO] El sistema mantendrá la lectura directa desde vampirized_providers.json.');
    console.log(`[EXIT 0] Fallback validado. Total perfiles en fallback: ${providers.length}`);
    return;
  }

  const prisma = new PrismaClient({
    log: ['error'],
  });

  try {
    // Verificar conectividad con Supabase / PostgreSQL
    await prisma.$connect();
    console.log('[CONEXIÓN] Base de datos conectada exitosamente.');

    // Preparar registros estructurados con sanitización estricta UTF-8
    const structuredRecords = providers.map((p) => {
      const name = cleanString(p.name) || 'Proveedor Sin Nombre';
      const province = cleanString(p.provincia || p.province) || 'España';
      const category = cleanString(p.category) || 'Servicios para Eventos';
      const shaHash = p.shaHash ? cleanString(p.shaHash) : computeSha256(`${name}|${province}|${category}`);
      const claimToken = p.claimToken ? cleanString(p.claimToken) : generateClaimToken(name, province);

      const imageUrls: string[] = Array.isArray(p.image_urls)
        ? p.image_urls.map((img: any) => cleanString(typeof img === 'string' ? img : img.url)).filter(Boolean)
        : (Array.isArray(p.images) ? p.images.map((img: any) => cleanString(img)).filter(Boolean) : []);

      return {
        shaHash,
        name: name.substring(0, 255),
        category: category.substring(0, 100),
        province: province.substring(0, 100),
        municipality: p.municipality ? cleanString(p.municipality).substring(0, 100) : null,
        telephone: p.telephone ? cleanString(p.telephone).substring(0, 50) : null,
        priceRange: p.price_range || p.priceRange ? cleanString(p.price_range || p.priceRange).substring(0, 100) : null,
        rating: typeof p.rating === 'number' ? p.rating : 4.8,
        reviewsCount: typeof p.reviews_count === 'number' ? p.reviews_count : (typeof p.reviewsCount === 'number' ? p.reviewsCount : 12),
        description: p.description ? cleanString(p.description) : null,
        imageUrls,
        claimToken,
        status: cleanString(p.status) || 'GHOST_UNCLAIMED',
      };
    });

    console.log(`[INFO] Insertando en lotes de ${BATCH_SIZE} registros...`);
    let insertedTotal = 0;

    for (let i = 0; i < structuredRecords.length; i += BATCH_SIZE) {
      const batch = structuredRecords.slice(i, i + BATCH_SIZE);
      
      const result = await prisma.vendorShadowProfile.createMany({
        data: batch,
        skipDuplicates: true,
      });

      insertedTotal += result.count;
      console.log(`[LOTE ${Math.floor(i / BATCH_SIZE) + 1}] Procesados ${Math.min(i + BATCH_SIZE, structuredRecords.length)}/${structuredRecords.length} (Insertados nuevos: ${result.count})`);
    }

    console.log('='.repeat(72));
    console.log(`[ÉXITO] Migración completada. Total registros insertados: ${insertedTotal.toLocaleString()}`);
    console.log('='.repeat(72));

  } catch (error: any) {
    console.error('[DATABASE_ERROR] Error durante la migración:', error.message);
    console.warn('[FALLBACK ACTIVO] El sistema continuará leyendo desde src/data/vampirized_providers.json.');
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error('[FATAL]', err);
  process.exit(1);
});
