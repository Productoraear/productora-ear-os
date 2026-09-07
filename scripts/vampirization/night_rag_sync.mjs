import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const ENRICHED_FILE = path.join(process.cwd(), 'src', 'data', 'vendors-enriched-night.json');
const RAG_FILE = path.join(process.cwd(), 'src', 'data', 'ear-rag-database.json');
const ALL_PROVIDERS_FILE = path.join(process.cwd(), 'src', 'data', 'all_providers_database.json');

function main() {
  console.log('[START] Sincronización RAG y Base de Datos (Night Vampire)...');

  const enriched = JSON.parse(fs.readFileSync(ENRICHED_FILE, 'utf-8'));
  console.log(`[SYNC] Proveedores enriquecidos a procesar: ${enriched.length}`);

  // 1. Sincronizar ALL_PROVIDERS
  let allProviders = [];
  if (fs.existsSync(ALL_PROVIDERS_FILE)) {
    allProviders = JSON.parse(fs.readFileSync(ALL_PROVIDERS_FILE, 'utf-8'));
  }
  
  let newCount = 0;
  let updatedCount = 0;
  
  for (const prov of enriched) {
    const slug = prov.slug || prov.id || prov.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const existingIndex = allProviders.findIndex(p => (p.slug || p.id) === slug);
    
    // Convertir al schema canonico
    const canonicalProv = {
      id: slug,
      slug: slug,
      name: prov.name,
      category: prov.category,
      province: prov.provincia || prov.location?.province,
      address: prov.address || `${prov.location?.city || ''}, ${prov.location?.province || ''}`,
      telephone: prov.phone || prov.telephone,
      rating: prov.metrics?.rating || prov.rating || 5.0,
      reviews: prov.metrics?.reviewCount || prov.reviews?.length || 0,
      description: prov.description_full || prov.description,
      gallery: prov.images || (prov.media?.coverImage ? [prov.media.coverImage] : []),
      basePrice: (() => {
        const p = prov.pricing?.rentalBasePrice || prov.prices?.[0];
        if (typeof p === 'number') return p;
        if (p) {
          const match = String(p).match(/\d+/);
          return match ? parseInt(match[0], 10) : 900;
        }
        return 900;
      })(),
      services_list: prov.services || [],
      updated_at: new Date().toISOString()
    };

    if (existingIndex >= 0) {
      allProviders[existingIndex] = { ...allProviders[existingIndex], ...canonicalProv };
      updatedCount++;
    } else {
      allProviders.push(canonicalProv);
      newCount++;
    }
  }

  fs.writeFileSync(ALL_PROVIDERS_FILE, JSON.stringify(allProviders, null, 2));
  console.log(`[SYNC] all_providers_database actualizado. Nuevos: ${newCount}, Actualizados: ${updatedCount}`);

  // 2. Sincronizar RAG Database
  let ragDb = [];
  if (fs.existsSync(RAG_FILE)) {
    ragDb = JSON.parse(fs.readFileSync(RAG_FILE, 'utf-8'));
  }
  
  let ragAdded = 0;
  for (const prov of enriched) {
    const slug = prov.slug || prov.id || prov.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const hash = crypto.createHash('sha256').update(JSON.stringify(prov)).digest('hex');
    const ragId = `RAG-PROV-${slug.toUpperCase().substring(0, 20)}-${hash.substring(0, 8)}`;
    
    // Evitar duplicados exactos por slug
    if (!ragDb.find(r => r.id.includes(slug.toUpperCase().substring(0, 20)))) {
      ragDb.push({
        id: ragId,
        tipo: "NODO_CANONICO_PROVEEDOR",
        categoria: prov.category?.toUpperCase().replace(/[^A-Z]/g, '_') || "PROVEEDOR",
        titulo: `[PROVEEDOR] ${prov.name} - ${prov.category}`,
        resumen_semantico: prov.description_full || prov.description || `Proveedor de ${prov.category}`,
        metadata: {
          slug: slug,
          province: prov.provincia || prov.location?.province,
          services: prov.services
        },
        sha256: hash,
        fecha_destilacion: new Date().toISOString().split('T')[0]
      });
      ragAdded++;
    }
  }

  fs.writeFileSync(RAG_FILE, JSON.stringify(ragDb, null, 2));
  console.log(`[SYNC] ear-rag-database actualizado. Nodos RAG añadidos: ${ragAdded}`);
  console.log('[DONE] TAREA_34 completada.');
}

main();
