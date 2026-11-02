/**
 * ════════════════════════════════════════════════════════════════════════════
 * VERIFICADOR DE INTEGRIDAD DE SITEMAP Y COBERTURA PSEO (W42_T07)
 * ════════════════════════════════════════════════════════════════════════════
 * Certifica que:
 * 1. entries.length >= 1500 && entries.length <= 50000 (norma Google Search Console).
 * 2. 100% de las URLs comienzan por https://www.productoraear.com (cero apex no-www).
 * 3. 0 URLs duplicadas.
 * 4. 0 URLs con doble barra '//' o caracteres RFC 3986 inválidos.
 * 5. Incluye rutas críticas: /confianza, /reservar/solista, /otzarreta, /arsenal, /centralita-mariachis.
 * ════════════════════════════════════════════════════════════════════════════
 */

import sitemap from '../src/app/sitemap';

async function runSitemapAudit() {
  console.log('── INICIANDO AUDITORÍA DE INTEGRIDAD DE SITEMAP (W42_T07) ──');

  const entries = await sitemap();
  console.log(`Total URLs en sitemap principal: ${entries.length}`);

  if (entries.length < 1500) {
    throw new Error(`FAIL: entries.length (${entries.length}) < 1500 requeridas.`);
  }

  if (entries.length > 50000) {
    throw new Error(`FAIL: entries.length (${entries.length}) excede el límite de 50.000 URLs.`);
  }

  const CANONICAL_ORIGIN = 'https://www.productoraear.com';
  const seen = new Set<string>();
  const invalidOrigin: string[] = [];
  const duplicates: string[] = [];
  const malformed: string[] = [];

  for (const entry of entries) {
    const url = entry.url;

    if (!url.startsWith(CANONICAL_ORIGIN)) {
      invalidOrigin.push(url);
    }

    if (seen.has(url)) {
      duplicates.push(url);
    }
    seen.add(url);

    // Comprobar dobles barras tras el origin
    const pathPart = url.replace(CANONICAL_ORIGIN, '');
    if (pathPart.includes('//') || /[\s<>"{}]/.test(url)) {
      malformed.push(url);
    }
  }

  if (invalidOrigin.length > 0) {
    throw new Error(`FAIL: ${invalidOrigin.length} URLs no usan el host canónico www.productoraear.com. Ej: ${invalidOrigin[0]}`);
  }

  if (duplicates.length > 0) {
    throw new Error(`FAIL: ${duplicates.length} URLs duplicadas encontradas. Ej: ${duplicates[0]}`);
  }

  if (malformed.length > 0) {
    throw new Error(`FAIL: ${malformed.length} URLs malformadas encontradas. Ej: ${malformed[0]}`);
  }

  const requiredCrucialRoutes = [
    `${CANONICAL_ORIGIN}/confianza`,
    `${CANONICAL_ORIGIN}/reservar/solista`,
    `${CANONICAL_ORIGIN}/otzarreta`,
    `${CANONICAL_ORIGIN}/arsenal`,
    `${CANONICAL_ORIGIN}/centralita-mariachis`,
    `${CANONICAL_ORIGIN}/productora-ear`
  ];

  for (const route of requiredCrucialRoutes) {
    if (!seen.has(route)) {
      throw new Error(`FAIL: Ruta crucial no encontrada en sitemap: ${route}`);
    }
  }

  console.log(`✅ 100% de las ${entries.length} URLs usan https://www.productoraear.com`);
  console.log(`✅ 0 URLs duplicadas`);
  console.log(`✅ 0 URLs malformadas`);
  console.log(`✅ Todas las rutas CORE incluidas`);
  console.log('══════════════════════════════════════════════════════════════════════════════');
  console.log('VEREDICTO: PASS (W42_T07 VERIFICADO EXIT CODE 0)');
  console.log('══════════════════════════════════════════════════════════════════════════════');
}

runSitemapAudit().catch(err => {
  console.error('\n❌ ERROR EN SITEMAP AUDIT:', err.message);
  process.exit(1);
});

