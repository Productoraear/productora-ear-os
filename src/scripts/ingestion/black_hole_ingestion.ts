import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

/**
 * 🏛️ BLACK HOLE INGESTION (V124)
 * Objetivo: Poblar la oferta subordinada (Vendors) para capturar el tráfico Mundial 2026.
 * Fuente: bodas_clean.json
 */
async function main() {
  const filePath = path.join(process.cwd(), 'src/lib/NUCLEO_DATA/bodas_clean.json');
  
  if (!fs.existsSync(filePath)) {
    console.error("❌ ERROR: bodas_clean.json no encontrado.");
    process.exit(1);
  }

  console.log("📦 Cargando Bóveda de Proveedores...");
  const rawData = fs.readFileSync(filePath, 'utf8');
  const providers = JSON.parse(rawData);

  console.log(`🕳️ Iniciando Ingestión de Agujero Negro: ${providers.length} proveedores...`);

  let successCount = 0;
  let batch: any[] = [];
  const BATCH_SIZE = 100;

  for (const p of providers) {
    // Solo músicos y mariachis (o similar) si es posible, pero el JSON parece ser general
    // Mapeamos a Vendor (ear_market_vendors)
    batch.push({
      name: p.name,
      category: p.category || "MUSICA",
      location: p.location || "ESPANA",
      description: p.description?.substring(0, 2000),
      original_url: p.url || null,
      is_claimed: false,
      metadata: {
        vampirized_source: "Bodas.net",
        original_id: p.id,
        price_ref: p.price
      }
    });

    if (batch.length >= BATCH_SIZE) {
      await prisma.vendor.createMany({
        data: batch,
        skipDuplicates: true
      });
      successCount += batch.length;
      console.log(`⚡ Ingeridos ${successCount} proveedores en la Bóveda...`);
      batch = [];
    }
    
    // Límite de seguridad para evitar saturación de Supabase en un solo aliento
    if (successCount >= 10000) break;
  }

  if (batch.length > 0) {
    await prisma.vendor.createMany({ data: batch, skipDuplicates: true });
    successCount += batch.length;
  }

  console.log(`✅ FUERZA LABORAL DISPONIBLE. ${successCount} proveedores en la Bóveda.`);
}

main()
  .catch(e => console.error("❌ ERROR EN BLACK HOLE INGESTION:", e))
  .finally(() => prisma.$disconnect());
