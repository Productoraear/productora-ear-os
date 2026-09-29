const fs = require('fs');
const path = require('path');

async function auditAndPackageSitemaps() {
  const baseUrl = 'http://127.0.0.1:3007';
  console.log('📡 [SITEMAP AUDIT] Conectando con servidor local en', baseUrl, '...');

  const partitions = [0, 1, 2, 3, 4, 5];
  const results = [];

  // 1. Verificar Master Sitemap Index
  try {
    const t0 = Date.now();
    const res = await fetch(`${baseUrl}/sitemap.xml`);
    const timeMs = Date.now() - t0;
    const text = await res.text();
    const subSitemaps = (text.match(/<loc>/g) || []).length;
    console.log(`✅ [MASTER SITEMAP INDEX] Status: ${res.status} | Sub-sitemaps: ${subSitemaps} (${timeMs}ms)`);
  } catch (err) {
    console.error('❌ [ERROR MASTER SITEMAP]:', err.message);
  }

  // 2. Auditar cada partición
  let totalUrls = 0;
  let villaFound = false;
  let villaPriority = null;

  for (const id of partitions) {
    try {
      const t0 = Date.now();
      const res = await fetch(`${baseUrl}/sitemap/${id}.xml`);
      const timeMs = Date.now() - t0;
      const text = await res.text();
      const urlCount = (text.match(/<url>/g) || []).length;
      totalUrls += urlCount;

      if (id === 0 && text.includes('villa-escorial-park')) {
        villaFound = true;
        const match = text.match(/<loc>([^<]+villa-escorial-park)<\/loc>[\s\S]*?<priority>([^<]+)<\/priority>/);
        if (match) {
          villaPriority = match[2];
        }
      }

      results.push({
        partition: id,
        status: res.status,
        urlCount,
        responseTimeMs: timeMs
      });
      console.log(`   ├─ Partición ${id}: ${urlCount} URLs [HTTP ${res.status}] en ${timeMs}ms`);
    } catch (err) {
      console.error(`   ├─ Partición ${id}: ERROR - ${err.message}`);
    }
  }

  console.log('\n======================================================');
  console.log(`🏆 TOTAL URLS ACTIVAS EN SITEMAP: ${totalUrls.toLocaleString('es-ES')}`);
  console.log(`🏰 VILLA ESCORIAL PARK EN SITEMAP: ${villaFound ? 'SÍ (Prioridad ' + villaPriority + ')' : 'NO'}`);
  console.log('======================================================\n');
}

auditAndPackageSitemaps();
