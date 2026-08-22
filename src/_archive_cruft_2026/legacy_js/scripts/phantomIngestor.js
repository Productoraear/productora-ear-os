import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.production' });
// Validación para asegurar que DATABASE_URL está cargada correctamente
if (!process.env.DATABASE_URL) {
    console.error('ERROR: DATABASE_URL no está definida en las variables de entorno.');
    process.exit(1);
}
import fs from 'fs';
import path from 'path';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
// Algoritmo S-Class para calcular proyecciones basadas en datos scrapeados
function calculateAuraLevel(vendor) {
    const reviews = vendor.reviews || 0;
    const rating = vendor.rating || 0;
    const baseAura = (rating / 5) * 4 + (Math.min(reviews, 100) / 100) * 6; // Max 10
    return Number(baseAura.toFixed(2));
}
function calculateRoiProjected(vendor) {
    const priceTier = vendor.price_tier || 1;
    const aura = calculateAuraLevel(vendor);
    // Simulación predictiva de ROI: Aura alta y precio premium = mayor ROI
    const baseRoi = 1500 * priceTier * (aura / 10);
    return Number(baseRoi.toFixed(2));
}
function calculateTechnicalReliability(vendor) {
    const rating = vendor.rating || 0;
    // Fiabilidad basada fuertemente en rating (si es 5 estrellas = 99.9%)
    const rel = (rating / 5) * 99.9;
    return Number(rel.toFixed(2));
}
async function main() {
    console.log('🌌 INICIANDO AGUJERO NEGRO (THE INGESTOR) - DIRECTIVA OMEGA V13');
    const filePath = path.join(process.cwd(), 'src/lib/NUCLEO_DATA/bodas_full.json');
    if (!fs.existsSync(filePath)) {
        console.error(`[ERROR CRÍTICO] Archivo no encontrado: ${filePath}`);
        process.exit(1);
    }
    console.log('📦 Leyendo repositorio de datos maestros...');
    const data = fs.readFileSync(filePath, 'utf8');
    let vendors = JSON.parse(data);
    // Limitar a los primeros 500 para esta fase de ignición
    vendors = vendors.slice(0, 500);
    console.log(`🚀 Asimilando ${vendors.length} registros en el núcleo...`);
    let successCount = 0;
    let errorCount = 0;
    // Lógica de UPSERT MASIVO en batches para no ahogar la conexión
    const batchSize = 100;
    for (let i = 0; i < vendors.length; i += batchSize) {
        const batch = vendors.slice(i, i + batchSize);
        await Promise.all(batch.map(async (vendor) => {
            try {
                if (!vendor.name)
                    return; // Skip si no hay nombre
                const auraLevel = calculateAuraLevel(vendor);
                const roiProjected = calculateRoiProjected(vendor);
                const technicalReliability = calculateTechnicalReliability(vendor);
                // Creamos proveedores "Huérfanos" (DataOwnership nulo inicialmente o por defecto)
                await prisma.providerProfile.upsert({
                    where: { name: vendor.name },
                    update: {
                        auraLevel,
                        roiProjected,
                        technicalReliability,
                        roi_guarantee_score: technicalReliability / 10,
                    },
                    create: {
                        name: vendor.name,
                        auraLevel,
                        roiProjected,
                        technicalReliability,
                        roi_guarantee_score: technicalReliability / 10,
                    }
                });
                successCount++;
            }
            catch (error) {
                if (errorCount < 5) {
                    console.error(`[FALLO EN NODO] ${vendor.name}:`, error);
                }
                errorCount++;
            }
        }));
        if (i % 1000 === 0 && i > 0) {
            console.log(`⚡ Sincronizados ${i}/${vendors.length} nodos...`);
        }
    }
    console.log('✅ TRASPLANTE TOTAL COMPLETADO.');
    console.log(`📊 Éxito: ${successCount} | Fallos: ${errorCount}`);
}
main()
    .catch(e => {
    console.error('[ERROR FATAL EN EL NÚCLEO]', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
