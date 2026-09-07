/**
 * ══════════════════════════════════════════════════════════════════════
 * EAR OS — AUDITORÍA VISUAL COMPLETA DEL SITIO (Puppeteer Local)
 * ══════════════════════════════════════════════════════════════════════
 * 
 * Ejecutor: Cline + Qwen 3.8 Local (Zero API Quota)
 * Dependencia: puppeteer (npm i -D puppeteer)
 * 
 * Captura screenshots de TODAS las rutas críticas del sitio en:
 *   scripts/reports/visual_audit/
 * 
 * Después, Cline puede abrir cada PNG y evaluar con su modelo local.
 * ══════════════════════════════════════════════════════════════════════
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const BASE_URL = process.env.AUDIT_URL || 'http://localhost:3007';
const OUTPUT_DIR = path.join(__dirname, 'reports', 'visual_audit');

// ━━━ RUTAS CRÍTICAS A AUDITAR ━━━
const ROUTES = [
  // P0 — Revenue (Checkout & Conversión)
  { path: '/', name: '00_home', wait: 3000 },
  { path: '/reservar/solista', name: '01_reservar_solista', wait: 2000 },
  { path: '/vimume/propuesta', name: '02_vimume_propuesta', wait: 2000 },
  { path: '/arroces', name: '03_arroces_landing', wait: 3000 },
  { path: '/catering-brasas', name: '04_catering_brasas', wait: 2000 },
  
  // P1 — Estructurales
  { path: '/artistas', name: '05_artistas_directorio', wait: 2000 },
  { path: '/artistas/edwin-agudelo', name: '06_edwin_agudelo', wait: 2000 },
  { path: '/bodas', name: '07_bodas', wait: 2000 },
  { path: '/eventos', name: '08_eventos', wait: 2000 },
  { path: '/vimume', name: '09_vimume_home', wait: 2000 },
  { path: '/b2g', name: '10_b2g', wait: 2000 },
  
  // P2 — Territoriales
  { path: '/bodas/madrid', name: '11_bodas_madrid', wait: 2000 },
  { path: '/bodas/toledo', name: '12_bodas_toledo', wait: 2000 },
  { path: '/bodas/barcelona', name: '13_bodas_barcelona', wait: 2000 },
  
  // P3 — Arsenal & Catálogo
  { path: '/arsenal', name: '14_arsenal', wait: 2000 },
  { path: '/arsenal/luces-navidad', name: '15_luces_navidad', wait: 3000 },
  { path: '/alquiler-equipos-sonido-audiovisuales', name: '16_alquiler_equipos', wait: 2000 },
  { path: '/alquiler-pantallas-led-madrid', name: '17_pantallas_led', wait: 2000 },
  
  // P4 — Institucional
  { path: '/artistas/representacion', name: '18_representacion', wait: 2000 },
  { path: '/eventos/municipales', name: '19_eventos_municipales', wait: 2000 },
  { path: '/instituciones/catalogo-360', name: '20_instituciones_catalogo', wait: 2000 },
  { path: '/vimume/archivo-clinico', name: '21_vimume_archivo', wait: 2000 },
  
  // P5 — Proveedores
  { path: '/proveedores', name: '22_proveedores_directorio', wait: 2000 },
  { path: '/proveedores?search=arroces', name: '23_proveedores_search_arroces', wait: 2000 },
  { path: '/proveedores?search=dj', name: '24_proveedores_search_dj', wait: 2000 },
  
  // P6 — Blog & Contenido
  { path: '/blog', name: '25_blog', wait: 2000 },
  { path: '/academia', name: '26_academia', wait: 2000 },
  { path: '/calculadora', name: '27_calculadora', wait: 2000 },
  { path: '/cotizador', name: '28_cotizador', wait: 2000 },
  
  // P7 — Herramientas
  { path: '/soberania-tecnica', name: '29_soberania_tecnica', wait: 2000 },
  { path: '/estudio-diseno', name: '30_estudio_diseno', wait: 2000 },
  { path: '/contacto', name: '31_contacto', wait: 2000 },
  { path: '/fincas', name: '32_fincas', wait: 2000 },
  
  // P8 — Legal
  { path: '/aviso-legal', name: '33_aviso_legal', wait: 1500 },
  { path: '/privacidad', name: '34_privacidad', wait: 1500 },
  
  // P9 — Redirect Tests
  { path: '/proveedores/arroces', name: '35_redirect_arroces', wait: 3000 },
  { path: '/proveedores/edwin-agudelo', name: '36_redirect_edwin', wait: 3000 },
  
  // P10 — Sitemap
  { path: '/sitemap.xml', name: '37_sitemap_xml', wait: 2000 },
];

// ━━━ VIEWPORTS ━━━
const VIEWPORTS = [
  { width: 1920, height: 1080, label: 'desktop' },
  { width: 390, height: 844, label: 'mobile' },
];

async function runAudit() {
  // Crear directorio de salida
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  console.log('═══════════════════════════════════════════════════════');
  console.log('  EAR OS — AUDITORÍA VISUAL COMPLETA');
  console.log(`  Base URL: ${BASE_URL}`);
  console.log(`  Rutas: ${ROUTES.length}`);
  console.log(`  Viewports: ${VIEWPORTS.map(v => v.label).join(', ')}`);
  console.log(`  Total screenshots: ${ROUTES.length * VIEWPORTS.length}`);
  console.log(`  Output: ${OUTPUT_DIR}`);
  console.log('═══════════════════════════════════════════════════════');

  const browser = await puppeteer.launch({
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--window-size=1920,1080'
    ]
  });

  const results = [];
  let errCount = 0;

  for (const route of ROUTES) {
    for (const viewport of VIEWPORTS) {
      const page = await browser.newPage();
      await page.setViewport({ width: viewport.width, height: viewport.height });

      const filename = `${route.name}_${viewport.label}.png`;
      const filepath = path.join(OUTPUT_DIR, filename);
      const fullUrl = `${BASE_URL}${route.path}`;

      try {
        console.log(`📸 [${viewport.label}] ${route.path}`);
        
        const response = await page.goto(fullUrl, { 
          waitUntil: 'networkidle2', 
          timeout: 30000 
        });
        
        const status = response?.status() || 0;
        
        // Esperar renderizado
        await new Promise(r => setTimeout(r, route.wait || 2000));
        
        // Scroll completo para lazy-load
        await page.evaluate(async () => {
          await new Promise((resolve) => {
            let totalHeight = 0;
            const distance = 400;
            const timer = setInterval(() => {
              const scrollHeight = document.body.scrollHeight;
              window.scrollBy(0, distance);
              totalHeight += distance;
              if (totalHeight >= scrollHeight) {
                clearInterval(timer);
                window.scrollTo(0, 0);
                resolve(undefined);
              }
            }, 100);
          });
        });
        
        // Esperar después del scroll
        await new Promise(r => setTimeout(r, 1000));
        
        // Screenshot full page
        await page.screenshot({ 
          path: filepath, 
          fullPage: true,
          type: 'png'
        });

        // Extraer métricas de la página
        const metrics = await page.evaluate(() => {
          const h1 = document.querySelector('h1')?.textContent?.trim() || 'N/A';
          const title = document.title || 'N/A';
          const imgCount = document.querySelectorAll('img').length;
          const brokenImgs = Array.from(document.querySelectorAll('img')).filter(
            img => img.naturalWidth === 0 && img.src && !img.src.startsWith('data:')
          ).length;
          const links = document.querySelectorAll('a[href]').length;
          const forms = document.querySelectorAll('form').length;
          const buttons = document.querySelectorAll('button').length;
          const bodyHeight = document.body.scrollHeight;
          const hasOverflowX = document.body.scrollWidth > window.innerWidth;
          
          return { h1, title, imgCount, brokenImgs, links, forms, buttons, bodyHeight, hasOverflowX };
        });

        results.push({
          route: route.path,
          viewport: viewport.label,
          status,
          screenshot: filename,
          ...metrics,
          error: null
        });

        if (metrics.hasOverflowX) {
          console.log(`  ⚠️ OVERFLOW-X DETECTADO en ${route.path} (${viewport.label})`);
        }
        if (metrics.brokenImgs > 0) {
          console.log(`  ⚠️ ${metrics.brokenImgs} IMÁGENES ROTAS en ${route.path}`);
        }
        if (status >= 400) {
          console.log(`  ❌ HTTP ${status} en ${route.path}`);
          errCount++;
        }
        
      } catch (err) {
        console.error(`  ❌ ERROR en ${route.path}: ${err.message}`);
        results.push({
          route: route.path,
          viewport: viewport.label,
          status: 0,
          screenshot: null,
          error: err.message
        });
        errCount++;
      }
      
      await page.close();
    }
  }

  await browser.close();

  // ━━━ GENERAR REPORTE JSON ━━━
  const report = {
    generated_at: new Date().toISOString(),
    base_url: BASE_URL,
    total_routes: ROUTES.length,
    total_screenshots: results.filter(r => r.screenshot).length,
    errors: errCount,
    overflow_x_issues: results.filter(r => r.hasOverflowX).length,
    broken_images_total: results.reduce((sum, r) => sum + (r.brokenImgs || 0), 0),
    results
  };

  const reportPath = path.join(OUTPUT_DIR, 'visual_audit_report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

  console.log('\n═══════════════════════════════════════════════════════');
  console.log('  AUDITORÍA COMPLETA');
  console.log(`  Screenshots: ${report.total_screenshots}/${ROUTES.length * VIEWPORTS.length}`);
  console.log(`  Errores: ${errCount}`);
  console.log(`  Overflow-X: ${report.overflow_x_issues}`);
  console.log(`  Imágenes rotas: ${report.broken_images_total}`);
  console.log(`  Reporte: ${reportPath}`);
  console.log('═══════════════════════════════════════════════════════');

  // Exit con error si hay issues críticos
  if (errCount > 5 || report.overflow_x_issues > 3) {
    process.exit(1);
  }
}

runAudit().catch(err => {
  console.error('FATAL:', err);
  process.exit(1);
});
