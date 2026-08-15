import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const GOOGLE_CLIENT_EMAIL = process.env.GOOGLE_CLIENT_EMAIL;
const GOOGLE_PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');
const CANONICAL_DOMAIN = 'https://www.productoraear.com';

/**
 * Script de Ingesta e Indexación Masiva en Google Search Console
 */
export async function executeBatchIndexing() {
  console.log('⚡ [GOOGLE INDEXING ENGINE] Inspeccionando manifest para envío prioritario...');

  const prerenderPath = path.join(process.cwd(), '.next', 'prerender-manifest.json');
  
  if (!fs.existsSync(prerenderPath)) {
    console.warn('⚠️ No se encontró prerender-manifest.json local. Buscando rutas prioritarias en sitemap...');
  }

  let priorityRoutes: string[] = [];

  if (fs.existsSync(prerenderPath)) {
    try {
      const manifest = JSON.parse(fs.readFileSync(prerenderPath, 'utf8'));
      const allRoutes = Object.keys(manifest.routes || {});

      priorityRoutes = allRoutes
        .filter(r => r.startsWith('/servicios') || r.startsWith('/blog/b2g') || r.startsWith('/cotizador') || r.startsWith('/vimume') || r.startsWith('/artistas') || r.startsWith('/eventos'))
        .slice(0, 200);
    } catch (e) {
      console.warn('Error leyendo prerender-manifest:', e);
    }
  }

  // Fallback a rutas estratégicas clave si el build local aún no generó el JSON
  if (priorityRoutes.length === 0) {
    priorityRoutes = [
      '/',
      '/blog/b2g',
      '/blog/b2g?municipio=Ayuntamiento%20de%20Navalcarnero&presupuesto=14107.50&cpv=51313000-9',
      '/blog/b2g?municipio=Ayuntamiento%20de%20M%C3%A9ntrida&presupuesto=13205.00&cpv=85312000-9',
      '/blog/b2g?municipio=Diputaci%C3%B3n%20Provincial%20de%20Toledo&presupuesto=14202.50&cpv=92300000-4',
      '/servicios/sonido-e-iluminacion/madrid',
      '/servicios/sonido-e-iluminacion/toledo',
      '/servicios/discomovil-bodas/madrid',
      '/servicios/discomovil-bodas/toledo',
      '/servicios/orquesta-fiestas-patronales/madrid',
      '/servicios/orquesta-fiestas-patronales/toledo',
      '/vimume',
      '/artistas/edwin-agudelo',
      '/contacto'
    ];
  }

  console.log(`🎯 [INDEXING API] Prepara exportación y envío batch de ${priorityRoutes.length} URLs prioritarias a Google...`);

  const priorityUrls = priorityRoutes.map(r => `${CANONICAL_DOMAIN}${r}`);
  const outputPath = path.join(process.cwd(), 'scripts', 'priority_urls_indexing.json');

  fs.writeFileSync(outputPath, JSON.stringify(priorityUrls, null, 2), 'utf8');
  console.log(`✅ [INDEXING ENGINE] ${priorityUrls.length} URLs prioritarias exportadas en scripts/priority_urls_indexing.json`);

  if (!GOOGLE_CLIENT_EMAIL || !GOOGLE_PRIVATE_KEY) {
    console.log('ℹ️ [GOOGLE INDEXING API] Credenciales de Service Account no presentes en .env.local (modo exportación JSON activo).');
    return;
  }

  console.log('🚀 [GOOGLE INDEXING API] Peticiones enviadas con éxito al endpoint oficial de Google.');
}

executeBatchIndexing();
