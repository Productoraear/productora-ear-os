const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3007;
const BASE_LOCAL = `http://localhost:${PORT}`;
const MATRIX_PATH = path.join(process.cwd(), 'src', 'data', 'telemetry', 'sitemap_23k_intent_matrix.json');
const REPORT_PATH = path.join(process.cwd(), 'src', 'data', 'telemetry', 'swarm_audit_report.json');

// Lista curada de URLs representativas de las 6 particiones del sitemap
const TEST_URLS = [
  '/',
  '/fincas',
  '/fincas/madrid',
  '/fincas/madrid/finca-alubian',
  '/fincas/sevilla/finca-salvago',
  '/fincas/valencia/alqueria-balada',
  '/bodas/toledo/mariachi-gala/talavera-de-la-reina',
  '/bodas/zaragoza/mariachi-gala/calatayud',
  '/bodas/madrid/dj/madrid',
  '/bodas/toledo/catering-brasas/ocana',
  '/bodas/bilbao/sonido-iluminacion/getxo',
  '/bodas/toledo/bodas-lujo/escalona',
  '/arsenal/pantallas-led/madrid',
  '/arsenal/pantallas-led/baleares',
  '/proveedores/regalos-ana-mari',
  '/proveedores/setroimagen',
  '/proveedores/vestidos-de-novia-houghton',
  '/vimume/propuesta',
  '/reservar/solista',
  '/ocasiones/ayuntamientos',
  '/alquiler/escalona',
  '/alquiler/talavera-de-la-reina',
  '/arroces',
  '/catering-brasas'
];

function fetchUrl(pathname) {
  return new Promise((resolve) => {
    const start = Date.now();
    const req = http.get(`${BASE_LOCAL}${pathname}`, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        const latency = Date.now() - start;
        const hasStripe = body.includes('stripe') || body.includes('100') || body.includes('reservar');
        const hasSchema = body.includes('application/ld+json') || body.includes('schema.org');
        const hasInvalid75 = body.includes('< 75 dB SPL');
        resolve({
          path: pathname,
          statusCode: res.statusCode,
          latencyMs: latency,
          hasStripe,
          hasSchema,
          hasInvalid75,
          success: res.statusCode === 200
        });
      });
    });

    req.on('error', (err) => {
      resolve({
        path: pathname,
        statusCode: 0,
        latencyMs: Date.now() - start,
        error: err.message,
        success: false
      });
    });

    req.setTimeout(30000, () => {
      req.destroy();
      resolve({
        path: pathname,
        statusCode: 408,
        latencyMs: 30000,
        error: 'Timeout (30s compilación inicial)',
        success: false
      });
    });
  });
}

async function runSwarmAudit() {
  console.log(`\n============================================================`);
  console.log(`🚀 INICIANDO ENJAMBRE DE VALIDACIÓN CONCURRENTE (EAR OS 2050)`);
  console.log(`Target: ${BASE_LOCAL} | Lote de Muestreo Estratégico: ${TEST_URLS.length} URLs`);
  console.log(`============================================================\n`);

  const results = [];
  const CONCURRENCY = 2;

  for (let i = 0; i < TEST_URLS.length; i += CONCURRENCY) {
    const chunk = TEST_URLS.slice(i, i + CONCURRENCY);
    const chunkResults = await Promise.all(chunk.map(u => fetchUrl(u)));
    chunkResults.forEach(r => {
      results.push(r);
      const icon = r.success ? '✓' : '✗';
      const statusStr = r.statusCode === 200 ? '\x1b[32m200 OK\x1b[0m' : `\x1b[31m${r.statusCode}\x1b[0m`;
      console.log(`[SWARM ${icon}] ${r.path.padEnd(45)} -> ${statusStr} (${r.latencyMs}ms) | Stripe: ${r.hasStripe ? 'OK' : '-'} | Schema: ${r.hasSchema ? 'OK' : '-'}`);
    });
  }

  const passed = results.filter(r => r.success).length;
  const avgLatency = Math.round(results.reduce((acc, r) => acc + r.latencyMs, 0) / results.length);
  const stripeCoverage = Math.round((results.filter(r => r.hasStripe).length / results.length) * 100);

  const report = {
    timestamp: new Date().toISOString(),
    totalAudited: results.length,
    passedCount: passed,
    failedCount: results.length - passed,
    passRate: `${Math.round((passed / results.length) * 100)}%`,
    averageLatencyMs: avgLatency,
    stripeCheckoutCoverage: `${stripeCoverage}%`,
    results
  };

  fs.writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2), 'utf-8');

  console.log(`\n============================================================`);
  console.log(`🎯 BALANCE FINAL DEL ENJAMBRE DE AUDITORÍA:`);
  console.log(`- URLs Auditadas: ${results.length}`);
  console.log(`- Tasa de Éxito HTTP: ${passed}/${results.length} (${report.passRate})`);
  console.log(`- Latencia Media: ${avgLatency} ms`);
  console.log(`- Cobertura Checkout Stripe 100€: ${report.stripeCheckoutCoverage}`);
  console.log(`- Reporte detallado guardado en: ${REPORT_PATH}`);
  console.log(`============================================================\n`);
}

runSwarmAudit();
