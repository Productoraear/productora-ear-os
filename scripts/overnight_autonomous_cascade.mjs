// scripts/overnight_autonomous_cascade.mjs
// S-CLASS OVERNIGHT AUTONOMOUS CASCADE RUNNER // PRODUCTORA EAR
// Ejecución y verificación continua bit-a-bit para el obrero autónomo nocturno

import fs from 'fs';
import path from 'path';
import http from 'http';
import { execSync } from 'child_process';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3007';

console.log('═══════════════════════════════════════════════════════════════');
console.log('🌙 INICIANDO SUITE AUTÓNOMA EN CASCADA S-CLASS (NOCHE PRO)');
console.log('═══════════════════════════════════════════════════════════════\n');

// 1. VERIFICACIÓN DE COMPILACIÓN TYPESCRIPT (EXIT CODE 0)
console.log('🔍 [FASE 1] Verificando compilación TypeScript estricta...');
try {
  execSync('npx tsc --noEmit', { stdio: 'pipe', encoding: 'utf-8' });
  console.log('  ✅ npx tsc --noEmit -> Exit Code 0 (CERO ERRORES)');
} catch (err) {
  console.error('  ❌ Error en compilación TypeScript:');
  console.error(err.stdout || err.message);
  process.exit(1);
}

// 2. AUDITORÍA DE RUTAS CRÍTICAS VIVAS (200 OK)
console.log('\n🌐 [FASE 2] Verificando rutas estratégicas y estatus HTTP...');

function checkUrl(url) {
  return new Promise((resolve) => {
    const req = http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          url,
          status: res.statusCode,
          contentType: res.headers['content-type'],
          bytes: data.length
        });
      });
    });
    req.on('error', (err) => {
      resolve({ url, error: err.message, status: 500 });
    });
    req.setTimeout(5000, () => {
      req.destroy();
      resolve({ url, error: 'TIMEOUT', status: 504 });
    });
  });
}

const CRITICAL_ROUTES = [
  `${BASE_URL}/`,
  `${BASE_URL}/bodas`,
  `${BASE_URL}/bodas/dj`,
  `${BASE_URL}/bodas/madrid/dj`,
  `${BASE_URL}/bodas/toledo/mariachis`,
  `${BASE_URL}/fincas/villa-escorial-park`,
  `${BASE_URL}/alquiler-equipos-sonido-audiovisuales`,
  `${BASE_URL}/catering-brasas`,
  `${BASE_URL}/artistas/edwin-agudelo`,
  `${BASE_URL}/vimume`,
  `${BASE_URL}/b2g`,
  `${BASE_URL}/llms.txt`,
  `${BASE_URL}/llms-full.txt`,
  `${BASE_URL}/robots.txt`,
  `${BASE_URL}/sitemap.xml`,
  `${BASE_URL}/sitemap-index.xml`,
  `${BASE_URL}/sitemap/0.xml`,
  `${BASE_URL}/sitemap/1.xml`,
  `${BASE_URL}/sitemap/2.xml`,
  `${BASE_URL}/sitemap/5.xml`
];

async function auditRoutes() {
  let failed = 0;
  for (const route of CRITICAL_ROUTES) {
    const res = await checkUrl(route);
    if (res.status === 200) {
      console.log(`  ✅ [200 OK] ${route} (${res.bytes} bytes)`);
    } else {
      console.error(`  ❌ [${res.status}] ${route} - Error: ${res.error || 'Código inesperado'}`);
      failed++;
    }
  }
  return failed;
}

const failedRoutes = await auditRoutes();

// 3. AUDITORÍA Y SINCRONIZACIÓN DE LA COLA DE TAREAS (.antigravity/tasks_queue.json)
console.log('\n📋 [FASE 3] Sincronizando cola de tareas (.antigravity/tasks_queue.json)...');
const queuePath = path.join(process.cwd(), '.antigravity', 'tasks_queue.json');

if (fs.existsSync(queuePath)) {
  const queue = JSON.parse(fs.readFileSync(queuePath, 'utf-8'));
  const tasks = queue.tasks || [];
  
  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'COMPLETED').length,
    pending: tasks.filter(t => t.status === 'PENDING').length,
    queued: tasks.filter(t => t.status === 'QUEUED').length
  };

  console.log(`  📊 Progreso Actual: ${stats.completed}/${stats.total} Tareas Completadas (${((stats.completed / stats.total) * 100).toFixed(1)}%)`);
  console.log(`  ⏳ Pendientes: ${stats.pending} | En Cola: ${stats.queued}`);

  // Reporte formal a archivo
  const reportDir = path.join(process.cwd(), 'reports');
  if (!fs.existsSync(reportDir)) fs.mkdirSync(reportDir, { recursive: true });
  
  const reportPath = path.join(reportDir, 'nightly_cascade_report.json');
  fs.writeFileSync(reportPath, JSON.stringify({
    timestamp: new Date().toISOString(),
    status: failedRoutes === 0 ? 'HEALTHY' : 'DEGRADED',
    stats,
    failedRoutesCount: failedRoutes
  }, null, 2));

  console.log(`  💾 Reporte guardado en: reports/nightly_cascade_report.json`);
}

console.log('\n═══════════════════════════════════════════════════════════════');
if (failedRoutes === 0) {
  console.log('🏆 SUITE EN CASCADA COMPLETADA CON ÉXITO: SISTEMA 100% OPERATIVO');
} else {
  console.log(`⚠️ ALERTA: ${failedRoutes} rutas presentaron anomalías.`);
}
console.log('═══════════════════════════════════════════════════════════════');
