import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

/**
 * 🐉 LEVIATHAN MARKET SYNC (V121)
 * Motor de Arbitraje de Mercado y Dominancia de Precios.
 */
async function main() {
  const dataPath = path.join(process.cwd(), 'src/lib/NUCLEO_DATA/bodas_clean.json');
  
  if (!fs.existsSync(dataPath)) {
    console.error("❌ ERROR: Repositorio NUCLEO_DATA no encontrado.");
    process.exit(1);
  }

  console.log("🐉 Despertando al Leviathan... Cargando sustrato de mercado.");
  const rawData = fs.readFileSync(dataPath, 'utf8');
  const providers = JSON.parse(rawData);

  console.log(`📊 Succión iniciada: ${providers.length} registros detectados.`);

  // Precargar multiplicadores de provincia
  const provinces = await prisma.province.findMany();
  const provinceMap = new Map(provinces.map(p => [p.id, p.priceMultiplier]));

  let syncCount = 0;
  let batch: any[] = [];
  const BATCH_SIZE = 250;

  for (const p of providers) {
    // Normalización de Geografía
    let provinceId = p.category?.toUpperCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/\s/g, "") || "MADRID";

    if (!provinceMap.has(provinceId)) provinceId = "MADRID";

    const multiplier = provinceMap.get(provinceId) || 1.0;
    const marketPrice = typeof p.price === 'number' ? p.price : 0;
    
    // [ALGORITMO DE PRICING OMEGA]:
    // EAR cobra el precio de mercado x Multiplicador Geográfico + Premium S-Class (15%)
    const premiumFactor = 1.15;
    const earPrice = marketPrice * multiplier * premiumFactor;

    batch.push({
      name: p.name,
      description: p.description?.substring(0, 1000),
      category: p.category || "GENERAL",
      stripeConceptId: `STRIPE_${p.id?.toUpperCase()}`, // Simulación de ID de Stripe
      marketAveragePrice: marketPrice,
      earDynamicPrice: earPrice,
      provinceGeoId: provinceId,
      competitorTrace: {
        source: "Bodas.net",
        raw_id: p.id,
        extracted_at: new Date().toISOString()
      },
      lastVampirized: new Date()
    });

    if (batch.length >= BATCH_SIZE) {
      await prisma.marketService.createMany({
        data: batch,
        skipDuplicates: true
      });
      syncCount += batch.length;
      console.log(`🌊 Leviathan ha devorado ${syncCount} nodos de mercado...`);
      batch = [];
    }

    // Limitamos a 15,000 para esta fase de expansión
    if (syncCount >= 15000) break;
  }

  if (batch.length > 0) {
    await prisma.marketService.createMany({ data: batch, skipDuplicates: true });
    syncCount += batch.length;
  }

  console.log(`✅ SINCRONIZACIÓN LEVIATHAN COMPLETADA. ${syncCount} servicios indexados en el Marketplace.`);
}

main()
  .catch(e => {
    console.error("❌ FALLO CRÍTICO DEL LEVIATHAN:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
