const fs = require('fs');
const http = require('http');

let routes = ['/eventos', '/ocasiones/ayuntamientos', '/artistas/edwin-agudelo', '/catering-brasas', '/alquiler-equipos-sonido-audiovisuales', '/admin/nexus'];

try {
  const sitemap = fs.readFileSync('src/app/sitemap.ts', 'utf8');
  const matches = sitemap.match(/path:\s*['"]([^'"]+)['"]/g) || sitemap.match(/url:\s*['"]([^'"]+)['"]/g);
  if (matches) {
    routes = Array.from(new Set(matches.map(m => m.replace(/path:\s*['"]|url:\s*['"]|['"]/g, ''))));
  }
} catch (e) {
  console.log('Usando lista de rutas base para chequeo.');
}

async function checkRoute(route) {
  return new Promise(resolve => {
    http.get(`http://localhost:3007${route}`, res => {
      resolve({ route, status: res.statusCode });
    }).on('error', err => {
      resolve({ route, status: err.code || 'ERROR' });
    });
  });
}

async function main() {
  const results = {};
  for (const r of routes) {
    results[r] = await checkRoute(r);
  }
  fs.writeFileSync('scripts/reports/route-audit.json', JSON.stringify(results, null, 2));
  console.log('Auditoría de rutas completada.');
}

main();
