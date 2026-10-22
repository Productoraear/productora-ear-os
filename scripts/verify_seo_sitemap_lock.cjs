/**
 * ════════════════════════════════════════════════════════════════════════════
 * EAR OS — VERIFICADOR DE SITEMAP CANÓNICO Y TEMPERATURA SEO (W30_T02)
 * ════════════════════════════════════════════════════════════════════════════
 */

const fs = require('fs');
const path = require('path');

let passed = 0;
let failed = 0;

function assert(condition, message) {
    if (condition) {
        console.log(`  [PASS] ${message}`);
        passed++;
    } else {
        console.error(`  [FAIL] ${message}`);
        failed++;
    }
}

console.log('--- AUDITORÍA FORENSE W30_T02: SITEMAP SEO Y RUTAS CANÓNICAS ---');

const sitemapPath = path.join(__dirname, '..', 'src', 'app', 'sitemap.ts');
assert(fs.existsSync(sitemapPath), 'sitemap.ts existe en filesystem');

const content = fs.readFileSync(sitemapPath, 'utf8');
assert(!content.includes(': any'), 'sitemap.ts tiene 0 ": any"');
assert(content.includes('MetadataRoute.Sitemap'), 'sitemap.ts implementa MetadataRoute.Sitemap canónico');

// Comprobar presencia de URLs clave de venta y reservas
const essentialRoutes = [
    '/reservar/solista',
    '/reservar/contrato',
    '/reservar/aceptar',
    '/panel/reservas',
    '/fincas',
    '/artistas',
    '/proveedores',
    '/vimume',
    '/calculadora',
    '/bodas',
    '/mariachis',
];

essentialRoutes.forEach((route) => {
    assert(content.includes(`path: '${route}'`), `sitemap.ts incluye ruta canónica: ${route}`);
});

// Comprobar dominio base canónico
assert(content.includes('https://productoraear.com'), 'sitemap.ts define https://productoraear.com');

// Comprobar provincias y sub-landings
assert(content.includes('PROVINCIAS_52_GRAPH'), 'sitemap.ts itera las 52 provincias del SSOT');
assert(content.includes('MARIACHI_LANDINGS'), 'sitemap.ts itera landings transaccionales de mariachi');

console.log(`\nRESUMEN: ${passed} verificaciones OK, ${failed} fallos.`);
if (failed > 0) {
    process.exit(1);
} else {
    process.exit(0);
}
