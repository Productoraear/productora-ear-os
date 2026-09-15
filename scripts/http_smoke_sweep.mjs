import fs from 'fs';
import path from 'path';
import http from 'http';

const BASE_URL = 'http://127.0.0.1:3007';

// Rutas críticas esenciales del núcleo tetra-modal y comercial a sondear
const CRITICAL_ROUTES = [
  '/',
  '/encargos',
  '/vimume',
  '/contratacion/ayuntamientos',
  '/arsenal/luces-navidad',
  '/admin',
  '/admin/sourcing',
  '/admin/telemetria',
  '/admin/licitaciones',
  '/admin/oraculo/entrenamiento',
  '/api/admin/cockpit/summary',
  '/api/omni-drive/search?query=test',
  '/api/b2g/placsp-bids',
  '/sitemap.xml'
];

async function checkUrl(urlPath) {
  return new Promise((resolve) => {
    const fullUrl = `${BASE_URL}${urlPath}`;
    const req = http.get(fullUrl, (res) => {
      resolve({
        path: urlPath,
        status: res.statusCode,
        ok: res.statusCode >= 200 && res.statusCode < 400
      });
      res.resume(); // Consumir datos para liberar memoria
    });

    req.on('error', (err) => {
      resolve({
        path: urlPath,
        status: 0,
        ok: false,
        error: err.message
      });
    });

    req.setTimeout(5000, () => {
      req.destroy();
      resolve({
        path: urlPath,
        status: 408,
        ok: false,
        error: 'Timeout (5s)'
      });
    });
  });
}

async function runSmokeSweep() {
  console.log("══════════════════════════════════════════════════════════════");
  console.log(`INICIANDO SONDEO HTTP MASIVO SOBRE: ${BASE_URL}`);
  console.log("══════════════════════════════════════════════════════════════\n");

  let successCount = 0;
  let failCount = 0;

  for (const route of CRITICAL_ROUTES) {
    const result = await checkUrl(route);
    if (result.ok) {
      console.log(`[PASS] HTTP ${result.status} -> ${result.path}`);
      successCount++;
    } else {
      console.error(`[FAIL] HTTP ${result.status} -> ${result.path} (${result.error || 'Respuesta no válida'})`);
      failCount++;
    }
  }

  console.log("\n══════════════════════════════════════════════════════════════");
  console.log(`RESULTADO SONDEO HTTP: ${successCount} EXITOSOS / ${failCount} FALLOS`);
  console.log("══════════════════════════════════════════════════════════════");

  if (failCount > 0) {
    process.exit(1);
  }
}

runSmokeSweep();
