const fs = require('fs');
const path = require('path');
const http = require('http');

const PROJECT_ROOT = process.cwd();
const REPORT_FILE = path.join(PROJECT_ROOT, 'AUDIT_FORENSIC_REPORT.md');

const CRITICAL_ROUTES = [
  { path: '/', name: 'Raiz / Portada Principal' },
  { path: '/eventos', name: 'Navegacion de Eventos' },
  { path: '/mobile-fusion', name: 'Mobile Fusion PWA' },
  { path: '/checkout/presupuesto', name: 'Checkout Presupuesto' },
  { path: '/admin/mobile-studio', name: 'Admin Studio' }
];

function scanSourceCode() {
  const issues = [];
  const srcDir = path.join(PROJECT_ROOT, 'src');

  function walkDir(dir) {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        if (!file.includes('node_modules') && !file.includes('.next') && !file.includes('adn_vault_staging')) {
          walkDir(fullPath);
        }
      } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        const content = fs.readFileSync(fullPath, 'utf8');
        if (content.includes('href="#"') || content.includes("href=''") || content.includes('href=""')) {
          issues.push({ file: path.relative(PROJECT_ROOT, fullPath), type: 'LINK_MUERTO', detail: 'Uso de enlace vacio detectado.' });
        }
        if (content.includes('NeuralTunnel') && !content.includes('isOpen') && !content.includes('show')) {
          issues.push({ file: path.relative(PROJECT_ROOT, fullPath), type: 'TUNEL_NEURAL_SIN_ESTADO', detail: 'Tunel montado sin control de estado reactivo global.' });
        }
        if (fullPath.includes('eventos') && !content.includes('searchParams') && !content.includes('useParams') && !content.includes('useState')) {
          issues.push({ file: path.relative(PROJECT_ROOT, fullPath), type: 'EVENTOS_ESTATICO', detail: 'Pagina de eventos no gestiona parametros de navegacion ni estado.' });
        }
      }
    }
  }
  walkDir(srcDir);
  return issues;
}

function auditRouteHttp(route) {
  return new Promise((resolve) => {
    const startTime = Date.now();
    const url = 'http://localhost:3007' + route.path;
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          path: route.path,
          status: res.statusCode,
          latency: (Date.now() - startTime) + ' ms',
          hasNeuralElement: data.includes('neural') || data.includes('Neural'),
          hasInteractiveElements: data.includes('dropdown') || data.includes('select') || data.includes('menu')
        });
      });
    }).on('error', () => resolve({ path: route.path, status: 'ERROR', latency: 'N/A', hasNeuralElement: false, hasInteractiveElements: false }));
  });
}

async function runForensicAudit() {
  console.log('\n🔍 INICIANDO AUDITORIA FORENSE...');
  const codeIssues = scanSourceCode();
  const httpResults = [];
  for (const route of CRITICAL_ROUTES) {
    httpResults.push(await auditRouteHttp(route));
  }
  let markdown = '# INFORME DE AUDITORIA FORENSE DE NAVEGACION Y ARQUITECTURA DE UX\n\n';
  markdown += '**Fecha:** ' + new Date().toISOString() + '\n';
  markdown += '**Entorno:** Localhost (Puerto 3007)\n\n';
  markdown += '## 1. RESUMEN EJECUTIVO DE ROTURAS DE NAVEGACION\n\n';
  markdown += '| Ruta | Estado HTTP | Latencia | Deteccion Tunel Neural | Deteccion Menu Dinamico |\n';
  markdown += '| :--- | :---: | :---: | :---: | :---: |\n';
  for (const r of httpResults) {
    markdown += '| `' + r.path + '` | **' + r.status + '** | ' + r.latency + ' | ' + (r.hasNeuralElement ? 'PASSED' : 'FAILED') + ' | ' + (r.hasInteractiveElements ? 'PASSED' : 'WARNING') + ' |\n';
  }
  markdown += '\n## 2. HALLAZGOS FORENSES EN CODIGO FUENTE (PRODUCCION ACTIVA)\n\n';
  if (codeIssues.length === 0) {
    markdown += 'PASSED: No se encontraron anomalias graves en el codigo activo de produccion.\n';
  } else {
    markdown += '| Tipo de Anomalia | Archivo Afectado | Detalle Tactico |\n| :--- | :--- | :--- |\n';
    for (const issue of codeIssues) {
      markdown += '| **' + issue.type + '** | `' + issue.file + '` | ' + issue.detail + ' |\n';
    }
  }
  markdown += '\n## 3. PLAN DE REPARACION DETERMINISTA\n\n1. Sincronizacion Tunel Neural mediante Layout Global.\n2. Navegacion Reactiva de Eventos mediante searchParams.\n3. Eliminacion de Handlers Ciegos.\n';
  fs.writeFileSync(REPORT_FILE, markdown, 'utf8');
  console.log('✅ AUDITORIA FINALIZADA. Informe guardado en: AUDIT_FORENSIC_REPORT.md\n');
}
runForensicAudit();
