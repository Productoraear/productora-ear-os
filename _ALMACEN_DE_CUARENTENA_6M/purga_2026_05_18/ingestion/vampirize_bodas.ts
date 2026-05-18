import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

/**
 * 🧛 VAMPIRIZE BODAS (SEEDING MASIVO V121)
 * Consume el JSON de 56MB y puebla el Marketplace Soberano.
 */
async function main() {
  const filePath = path.join(process.cwd(), 'src/lib/NUCLEO_DATA/bodas_clean.json');
  
  if (!fs.existsSync(filePath)) {
    console.error("❌ ERROR: bodas_clean.json no encontrado.");
    process.exit(1);
  }

  console.log("📦 Cargando repositorio de datos maestros (56MB)...");
  const rawData = fs.readFileSync(filePath, 'utf8');
  const providers = JSON.parse(rawData);

  console.log(`🧛 Iniciando Seeding Masivo de ${providers.length} proveedores...`);

  // Precargar provincias para eficiencia
  const provinces = await prisma.province.findMany();
  const provinceMap = new Map(provinces.map(p => [p.id, p.priceMultiplier]));

  let successCount = 0;
  let batch: any[] = [];
  const BATCH_SIZE = 100;

  for (const p of providers) {
    // Normalización de Provincia
    // El JSON usa 'category' para la provincia en muchos casos
    let provinceId = p.category?.toUpperCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Eliminar acentos
      .replace(/\s/g, "") || "MADRID";
    
    // Mapeos específicos si fallan
    if (provinceId === "CORUNA") provinceId = "CORUNA";
    if (!provinceMap.has(provinceId)) provinceId = "MADRID";

    const multiplier = provinceMap.get(provinceId) || 1.0;
    const marketPrice = typeof p.price === 'number' ? p.price : 0;
    const earPrice = marketPrice * multiplier;

    batch.push({
      name: p.name,
      description: p.description?.substring(0, 1000),
      category: p.category || "GENERAL",
      marketAveragePrice: marketPrice,
      earDynamicPrice: earPrice,
      provinceGeoId: provinceId,
      competitorTrace: { source: "Bodas.net", raw_id: p.id },
      lastVampirized: new Date()
    });

    if (batch.length >= BATCH_SIZE) {
      await prisma.marketService.createMany({
        data: batch,
        skipDuplicates: true
      });
      successCount += batch.length;
      console.log(`⚡ Sincronizados ${successCount} nodos de mercado...`);
      batch = [];
    }
    
    // Límite de seguridad para la primera fase de ignición
    if (successCount >= 10000) break;
  }

  // Insertar resto
  if (batch.length > 0) {
    await prisma.marketService.createMany({ data: batch, skipDuplicates: true });
    successCount += batch.length;
  }

  console.log(`✅ TRASPLANTE TOTAL COMPLETADO. ${successCount} proveedores vampirizados.`);
}

main()
  .catch(e => console.error("❌ FALLO EN LA VAMPIRIZACIÓN:", e))
  .finally(() => prisma.$disconnect());
