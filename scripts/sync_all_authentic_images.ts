import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

/**
 * 🏛️ ANTIGRAVITY OMEGA — MASTER AUTHENTIC IMAGE SYNCHRONIZER
 * ==========================================================
 * Indexa imágenes 100% auténticas de:
 * 1. src/lib/NUCLEO_DATA/bodas_clean.json (4.211 perfiles con fotos HD 1920px)
 * 2. src/lib/NUCLEO_DATA/bodas_full.json (14.041 perfiles con portfolios completos)
 * 3. src/data/celebrents_providers.json (10.049 perfiles con fotos reales)
 * 4. src/data/vampirized-providers-synchronized.json (53.623 perfiles con rutas locales y remotas)
 * 5. public/assets/shadow_vendors/ (imágenes ya descargadas en disco local)
 *
 * Filtra rigurosamente:
 * - gen_logoHeader.svg y cualquier .svg
 * - default_avatar y placeholders genéricos
 * - 741e9617168a2484.jpg (hash genérico blanket)
 * - imágenes unsplash genéricas
 *
 * Actualiza:
 * - Los 12 datasets de Edge en public/data/providers/*.json
 * - La base de datos Supabase PostgreSQL (VendorShadowProfile.imageUrls)
 */

const stopWords = new Set([
  'el', 'la', 'los', 'las', 'de', 'del', 'en', 'y', 'a', 'para', 'con', 'por',
  'finca', 'espacio', 'restaurante', 'musica', 'boda', 'bodas', 'eventos',
  'grupo', 'duo', 'trio', 'cuarteto', 'orquesta', 'dj', 'catering'
]);

function cleanName(n?: string | null): string {
  return (n || '')
    .replace(/\s*-\s*Consulta disponibilidad y precios.*/i, '')
    .replace(/\s*-\s*Precios.*/i, '')
    .replace(/\s*-\s*Fotos y opiniones.*/i, '')
    .replace(/\s*•.*/i, '')
    .trim()
    .toLowerCase();
}

function tokenKey(name?: string | null): string {
  return (name || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2 && !stopWords.has(w))
    .sort()
    .join(' ');
}

function isDirty(u?: string | null): boolean {
  if (!u || typeof u !== 'string') return true;
  const lower = u.toLowerCase();
  return (
    lower.includes('.svg') ||
    lower.includes('gen_logoheader') ||
    lower.includes('default_avatar') ||
    lower.includes('placeholder') ||
    lower.includes('741e9617168a2484.jpg') ||
    lower.includes('images.unsplash.com')
  );
}

async function main() {
  console.log('='.repeat(76));
  console.log('🏛️ ANTIGRAVITY OMEGA — MASTER AUTHENTIC IMAGE SYNCHRONIZER');
  console.log('='.repeat(76));

  const authenticMap = new Map<string, string[]>();
  const tokenMap = new Map<string, string[]>();

  function registerVendor(id?: string | null, name?: string | null, shaHash?: string | null, images?: any[]) {
    if (!images || !Array.isArray(images)) return;
    const cleanImages = images
      .map((im) => (typeof im === 'string' ? im : im?.url))
      .filter((u): u is string => Boolean(u) && !isDirty(u));

    if (cleanImages.length === 0) return;

    if (shaHash) {
      const sh = shaHash.toLowerCase().trim();
      if (!authenticMap.has(sh)) authenticMap.set(sh, cleanImages);
    }
    if (id) {
      const cleanId = id.toLowerCase().trim();
      if (!authenticMap.has(cleanId)) authenticMap.set(cleanId, cleanImages);
    }

    const cName = cleanName(name);
    if (cName && !authenticMap.has(cName)) {
      authenticMap.set(cName, cleanImages);
    }

    const baseName = cName.split('-')[0].trim();
    if (baseName.length > 3 && !authenticMap.has(baseName)) {
      authenticMap.set(baseName, cleanImages);
    }

    const tKey = tokenKey(name);
    if (tKey.length >= 3 && !tokenMap.has(tKey)) {
      tokenMap.set(tKey, cleanImages);
    }
  }

  // 1. CARGA NÚCLEO BODAS CLEAN (Fotos HD 1920px)
  const cleanPath = path.join(process.cwd(), 'src', 'lib', 'NUCLEO_DATA', 'bodas_clean.json');
  if (fs.existsSync(cleanPath)) {
    console.log('[1/5] Ingestando bodas_clean.json (Fotos 1920px HD)...');
    try {
      const cleanData: any[] = JSON.parse(fs.readFileSync(cleanPath, 'utf-8'));
      cleanData.forEach((p) => registerVendor(p.id, p.name, p.shaHash, p.images));
      console.log(`      ✓ ${cleanData.length} perfiles procesados.`);
    } catch (e: any) {
      console.warn('      [WARN]', e.message);
    }
  }

  // 2. CARGA BODAS FULL (14.041 perfiles)
  const fullPath = path.join(process.cwd(), 'src', 'lib', 'NUCLEO_DATA', 'bodas_full.json');
  if (fs.existsSync(fullPath)) {
    console.log('[2/5] Ingestando bodas_full.json (Portfolios completos)...');
    try {
      const fullData: any[] = JSON.parse(fs.readFileSync(fullPath, 'utf-8'));
      fullData.forEach((p) => registerVendor(p.id, p.name, p.shaHash, p.images));
      console.log(`      ✓ ${fullData.length} perfiles procesados.`);
    } catch (e: any) {
      console.warn('      [WARN]', e.message);
    }
  }

  // 3. CARGA CELEBRENTS (10.049 perfiles)
  const celebPath = path.join(process.cwd(), 'src', 'data', 'celebrents_providers.json');
  if (fs.existsSync(celebPath)) {
    console.log('[3/5] Ingestando celebrents_providers.json (Portfolios directos)...');
    try {
      const celebData: any[] = JSON.parse(fs.readFileSync(celebPath, 'utf-8'));
      celebData.forEach((p) => registerVendor(p.id, p.name, p.shaHash, p.images || p.imageUrls || p.photos));
      console.log(`      ✓ ${celebData.length} perfiles procesados.`);
    } catch (e: any) {
      console.warn('      [WARN]', e.message);
    }
  }

  // 4. CARGA MASTER SYNC (53.623 perfiles con assets locales y sourceImageUrls)
  const syncPath = path.join(process.cwd(), 'src', 'data', 'vampirized-providers-synchronized.json');
  if (fs.existsSync(syncPath)) {
    console.log('[4/5] Ingestando vampirized-providers-synchronized.json...');
    try {
      const syncData: any[] = JSON.parse(fs.readFileSync(syncPath, 'utf-8'));
      syncData.forEach((p) => {
        const local = (p.imageUrls || []).filter((u: string) => !isDirty(u));
        const source = (p.sourceImageUrls || []).filter((u: string) => !isDirty(u));
        registerVendor(p.id, p.name, p.shaHash, [...local, ...source]);
      });
      console.log(`      ✓ ${syncData.length} perfiles procesados.`);
    } catch (e: any) {
      console.warn('      [WARN]', e.message);
    }
  }

  console.log(`\nÍndice consolidado: ${authenticMap.size} identificadores directos | ${tokenMap.size} claves semánticas tokenKey.\n`);

  function resolveAuthentic(p: { shaHash?: string | null; id?: string | null; name?: string | null }): string[] | null {
    if (p.shaHash) {
      const m = authenticMap.get(p.shaHash.toLowerCase().trim());
      if (m && m.length > 0) return m;
    }
    if (p.id) {
      const m = authenticMap.get(p.id.toLowerCase().trim());
      if (m && m.length > 0) return m;
    }
    const cName = cleanName(p.name);
    if (cName) {
      const m = authenticMap.get(cName);
      if (m && m.length > 0) return m;

      const base = cName.split('-')[0].trim();
      const mBase = authenticMap.get(base);
      if (mBase && mBase.length > 0) return mBase;
    }
    const tKey = tokenKey(p.name);
    if (tKey) {
      const mT = tokenMap.get(tKey);
      if (mT && mT.length > 0) return mT;
    }
    return null;
  }

  // 5. ENRIQUECIMIENTO DE LOS 12 DATASETS DE EDGE EN public/data/providers/
  console.log('[5/5] Enriqueciendo los 12 archivos en public/data/providers/...');
  const providersDir = path.join(process.cwd(), 'public', 'data', 'providers');
  if (fs.existsSync(providersDir)) {
    const files = fs.readdirSync(providersDir).filter((f) => f.endsWith('.json') && f !== 'manifest.json');
    for (const f of files) {
      const filePath = path.join(providersDir, f);
      try {
        const list: any[] = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        if (!Array.isArray(list)) continue;

        let enrichedCount = 0;
        let cleanedNamesCount = 0;

        for (const p of list) {
          // Limpiar nombres con sufijos comerciales innecesarios
          const beforeName = p.name;
          const cleaned = (p.name || '')
            .replace(/\s*-\s*Consulta disponibilidad y precios.*/i, '')
            .replace(/\s*-\s*Precios.*/i, '')
            .replace(/\s*-\s*Fotos y opiniones.*/i, '')
            .trim();
          if (cleaned && cleaned !== beforeName) {
            p.name = cleaned;
            cleanedNamesCount++;
          }

          const hasAuthentic = Array.isArray(p.imageUrls) && p.imageUrls.length > 0 && !p.imageUrls.some(isDirty);
          if (!hasAuthentic) {
            const match = resolveAuthentic(p);
            if (match && match.length > 0) {
              p.imageUrls = match;
              enrichedCount++;
            }
          }
        }

        fs.writeFileSync(filePath, JSON.stringify(list));
        console.log(`  -> ${f}: ${list.length} perfiles | ${enrichedCount} con fotos auténticas asignadas | ${cleanedNamesCount} nombres saneados`);
      } catch (err: any) {
        console.error(`  -> Error en ${f}:`, err.message);
      }
    }
  }

  // 6. ACTUALIZACIÓN MASIVA EN SUPABASE POSTGRESQL (VendorShadowProfile)
  const hasDb = Boolean(process.env.POSTGRES_PRISMA_URL || process.env.DATABASE_URL);
  if (hasDb) {
    console.log('\n[BD] Conectando a Supabase PostgreSQL para actualizar imágenes auténticas...');
    const prisma = new PrismaClient({ log: ['error'] });
    try {
      await prisma.$connect();
      const allProfiles = await prisma.vendorShadowProfile.findMany({
        select: {
          id: true,
          shaHash: true,
          name: true,
          imageUrls: true
        }
      });

      console.log(`  -> Perfiles en BD a auditar: ${allProfiles.length}`);

      const toUpdate: { id: string; name: string; imageUrls: string[] }[] = [];

      for (const p of allProfiles) {
        const hasAuthentic = Array.isArray(p.imageUrls) && p.imageUrls.length > 0 && !p.imageUrls.some(isDirty);
        const match = resolveAuthentic(p);

        const beforeName = p.name;
        const cleaned = (p.name || '')
          .replace(/\s*-\s*Consulta disponibilidad y precios.*/i, '')
          .replace(/\s*-\s*Precios.*/i, '')
          .replace(/\s*-\s*Fotos y opiniones.*/i, '')
          .trim();

        const needsImage = !hasAuthentic && match && match.length > 0;
        const needsName = cleaned && cleaned !== beforeName;

        if (needsImage || needsName) {
          toUpdate.push({
            id: p.id,
            name: cleaned,
            imageUrls: needsImage ? match! : p.imageUrls
          });
        }
      }

      console.log(`  -> Perfiles que requieren actualización de fotos o nombre: ${toUpdate.length}`);

      let dbUpdated = 0;
      const batchSize = 250;
      for (let i = 0; i < toUpdate.length; i += batchSize) {
        const batch = toUpdate.slice(i, i + batchSize);
        await Promise.all(
          batch.map(async (item) => {
            await prisma.vendorShadowProfile.update({
              where: { id: item.id },
              data: {
                name: item.name,
                imageUrls: item.imageUrls
              }
            });
            dbUpdated++;
          })
        );
        if ((i + batchSize) % 2500 === 0 || i + batchSize >= toUpdate.length) {
          console.log(`  -> Progreso BD: ${Math.min(i + batchSize, toUpdate.length)}/${toUpdate.length} (Actualizados: ${dbUpdated})`);
        }
      }

      console.log(`[BD] Supabase PostgreSQL actualizado exitosamente: ${dbUpdated} perfiles saneados.`);
      await prisma.$disconnect();
    } catch (dbErr: any) {
      console.warn('[BD WARN] Error en actualización de base de datos:', dbErr.message);
    }
  }

  console.log('='.repeat(76));
  console.log('✅ MASTER AUTHENTIC IMAGE SYNCHRONIZATION COMPLETADA CON ÉXITO.');
  console.log('='.repeat(76));
}

main().catch((err) => {
  console.error('❌ Error fatal en sincronización:', err);
  process.exit(1);
});
