const fs = require('fs');
const path = require('path');

const prerenderManifestPath = path.join(process.cwd(), '.next', 'prerender-manifest.json');
const routesManifestPath = path.join(process.cwd(), '.next', 'routes-manifest.json');

if (!fs.existsSync(prerenderManifestPath) || !fs.existsSync(routesManifestPath)) {
  console.error("❌ Error: No se encontraron los manifiestos de Next.js. Ejecuta 'npm run build' primero.");
  process.exit(1);
}

const prerenderManifest = JSON.parse(fs.readFileSync(prerenderManifestPath, 'utf8'));
const routesManifest = JSON.parse(fs.readFileSync(routesManifestPath, 'utf8'));

const staticRoutes = Object.keys(prerenderManifest.routes);
const dynamicRouteRegexes = routesManifest.dynamicRoutes.map(r => new RegExp(r.regex));

console.log(`📊 [AUDITORÍA DE RUTAS]`);
console.log(`- Rutas prerenderizadas (SSG/Estáticas): ${staticRoutes.length}`);
console.log(`- Patrones dinámicos configurados: ${routesManifest.dynamicRoutes.length}`);

// Verificación de endpoints críticos
const criticalRoutes = ['/', '/cotizador', '/presupuesto', '/vimume', '/artistas', '/artistas/edwin-agudelo', '/blog/b2g', '/empresarios', '/dossier'];
console.log(`\n🔍 [VERIFICACIÓN DE RUTAS CRÍTICAS]`);
criticalRoutes.forEach(route => {
  const isCompiled = staticRoutes.includes(route) || staticRoutes.includes(route + '/');
  console.log(`${isCompiled ? '✅' : '⚠️'} Ruta '${route}': ${isCompiled ? 'Compilada y Lista' : 'Dynamic / SSR'}`);
});
