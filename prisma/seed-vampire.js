import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
const prisma = new PrismaClient();
function generateSlug(name) {
    return name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Remove accents
        .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric with hyphens
        .replace(/(^-|-$)+/g, ''); // Trim leading/trailing hyphens
}
async function main() {
    console.log('🏛️ INICIANDO MOTOR DE INGESTIÓN VAMPÍRICA S-CLASS (V200.B)...');
    // 1. Asegurar Workspace Unificado Principal
    let workspace = await prisma.workspace.findFirst({
        where: { slug: 'productora-ear' }
    });
    if (!workspace) {
        console.log('⚡ Creando Workspace Principal unificado...');
        workspace = await prisma.workspace.create({
            data: {
                name: 'Productora EAR Global OS',
                slug: 'productora-ear',
                description: 'Ecosistema unificado de logística, artistas y proveedores premium.',
                isActive: true,
            }
        });
    }
    console.log(`✅ Workspace Activo: "${workspace.name}" (ID: ${workspace.id})`);
    // 2. Cargar perfiles existentes en memoria para evitar colisiones
    const existingProfiles = await prisma.providerProfile.findMany({
        select: { name: true, slug: true }
    });
    const seenNames = new Set();
    const seenSlugs = new Set();
    for (const prof of existingProfiles) {
        if (prof.name)
            seenNames.add(prof.name.toLowerCase().trim());
        if (prof.slug)
            seenSlugs.add(prof.slug.toLowerCase().trim());
    }
    console.log(`📊 Base de datos inicial: ${existingProfiles.length} perfiles cargados en memoria.`);
    const paths = {
        fincas: 'c:/EAR_OS_V2/data_vault/backups/fincas.json',
        legacy: 'c:/EAR_OS_V2/data_vault/backups/legacyproviders.json',
        completo: 'c:/EAR_OS_V2/data_vault/backups/arsenalcompleto.json',
        enriched: 'c:/EAR_OS_V2/data_vault/backups/arsenalenriched.json'
    };
    const toInsert = [];
    const processFile = (filePath, type) => {
        if (!fs.existsSync(filePath)) {
            console.log(`⚠️ Archivo no encontrado, saltando: ${filePath}`);
            return;
        }
        console.log(`📂 Procesando archivo: ${filePath}...`);
        try {
            const rawData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            if (!Array.isArray(rawData)) {
                console.log(`⚠️ El contenido de ${filePath} no es un array, saltando.`);
                return;
            }
            let count = 0;
            for (const item of rawData) {
                const name = (item.name || item.nombre || '').trim();
                if (!name)
                    continue;
                const normalizedName = name.toLowerCase();
                if (seenNames.has(normalizedName))
                    continue;
                let slug = generateSlug(name);
                let originalSlug = slug;
                let counter = 1;
                while (seenSlugs.has(slug)) {
                    slug = `${originalSlug}-${counter++}`;
                }
                seenNames.add(normalizedName);
                seenSlugs.add(slug);
                const parsedRating = parseFloat(item.rating);
                const rating = isNaN(parsedRating) ? 4.0 : parsedRating;
                // Categorización
                let category = 'VENUE';
                if (type === 'provider') {
                    category = (item.categoria || item.category || 'Sin Categoría').toUpperCase();
                }
                const location = item.provincia || item.ubicacion || item.location || 'España';
                toInsert.push({
                    workspaceId: workspace.id,
                    name: name,
                    slug: slug,
                    category: category,
                    location: location,
                    roiGuaranteeScore: rating,
                    roiProjected: Math.min(10.0, rating * 1.05),
                    auraLevel: 5.0,
                    technicalReliability: 7.0,
                    isVerified: false // 🚨 LEY MARCIAL: Todos nacen Huérfanos!
                });
                count++;
            }
            console.log(`✅ Ingesta en memoria exitosa desde ${filePath}: ${count} perfiles nuevos.`);
        }
        catch (err) {
            console.error(`❌ Error parseando ${filePath}:`, err);
        }
    };
    // Procesar secuencialmente
    processFile(paths.fincas, 'venue');
    processFile(paths.legacy, 'provider');
    processFile(paths.completo, 'provider');
    processFile(paths.enriched, 'provider');
    console.log(`🎯 Preparados para insertar en DB: ${toInsert.length} perfiles.`);
    // Inserción en lotes de 1000
    const batchSize = 1000;
    let insertedCount = 0;
    for (let i = 0; i < toInsert.length; i += batchSize) {
        const batch = toInsert.slice(i, i + batchSize);
        try {
            const result = await prisma.providerProfile.createMany({
                data: batch,
                skipDuplicates: true
            });
            insertedCount += result.count;
            console.log(`🚀 Lote transaccional [${i} - ${Math.min(toInsert.length, i + batchSize)}]: ${result.count} insertados.`);
        }
        catch (err) {
            console.error(`❌ Error insertando lote ${i}:`, err);
        }
    }
    const totalCount = await prisma.providerProfile.count();
    console.log(`✨ VAMPIRE ETL COMPLETADO CON ÉXITO.`);
    console.log(`📈 Nuevos perfiles insertados físicamente: ${insertedCount}`);
    console.log(`📊 Total acumulado en ProviderProfile: ${totalCount}`);
}
main()
    .catch((e) => {
    console.error('❌ Error crítico en ejecución del seed:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
