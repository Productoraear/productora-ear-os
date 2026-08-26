const fs = require('fs');
const path = require('path');
const http = require('http');

const PROJECT_ROOT = process.cwd();
const REPORT_FILE = path.join(PROJECT_ROOT, 'AUDIT_FORENSIC_REPORT.md');

const CRITICAL_ROUTES = [
  { path: '/', name: 'Raíz / Portada Principal' },
  { path: '/eventos', name: 'Navegación de Eventos' },
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
        if (!file.includes('node_modules') && !file.includes('.next')) walkDir(fullPath);
      } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        const content = fs.readFileSync(fullPath, 'utf8');
        
        // Detección estricta y segura
        if (content.includes('href="#"') || content.includes('href=""') || content.includes("href=''")) {
          issues.push({ file: path.relative(PROJECT_ROOT, fullPath), type: 'LINK_MUERTO', detail: 'Uso de href="#" o vacío detectado.' });
        }
        
        if (content.includes('NeuralTunnel') && !content.includes('isOpen') && !content.includes('show')) {
          issues.push({ file: path.relative(PROJECT_ROOT, fullPath), type: 'TUNEL_NEURAL_SIN_ESTADO', detail: 'Túnel montado sin control de estado reactivo global.' });
        }

        if (fullPath.includes('eventos') && !content.includes('searchParams') && !content.includes('useParams') && !content.includes('useState')) {
          issues.push({ file: path.relative(PROJECT_ROOT, fullPath), type: 'EVENTOS_ESTATICO', detail: 'Página de eventos no gestiona parámetros de navegación ni estado.' });
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
        const latency = Date.now() - startTime;
        const hasNeural = data.includes('neural') || data.includes('Neural');
        const hasDropdown = data.includes('dropdown') || data.includes('select') || data.includes('menu');
        
        resolve({
          path: route.path,
          status: res.statusCode,
          latency: latency + ' ms',
          hasNeuralElement: hasNeural,
          hasInteractiveElements: hasDropdown
        });
      });
    }).on('error', (err) => {
      resolve({
        path: route.path,
        status: 'ERROR (Servidor Inactivo)',
        latency: 'N/A',
        hasNeuralElement: false,
        hasInteractiveElements: false
      });
    });
  });
}

async function runForensicAudit() {
  console.log('\n🔍 INICIANDO AUDITORÍA FORENSE DE NAVEGACIÓN Y UX...');
  
  const codeIssues = scanSourceCode();
  const httpResults = [];
  
  for (const route of CRITICAL_ROUTES) {
    httpResults.push(await auditRouteHttp(route));
  }

  let markdown = '# INFORME DE AUDITORÍA FORENSE DE NAVEGACIÓN Y ARQUITECTURA DE UX\n\n';
  markdown += '**Fecha:** ' + new Date().toISOString() + '\n';
  markdown += '**Entorno:** Localhost (Puerto 3007)\n\n';

  markdown += '## 1. RESUMEN EJECUTIVO DE ROTURAS DE NAVEGACIÓN\n\n';
  markdown += '| Ruta | Estado HTTP | Latencia | Detección Túnel Neural | Detección Menú Dinámico |\n';
  markdown += '| :--- | :---: | :---: | :---: | :---: |\n';
  
  for (const r of httpResults) {
    const neuralStatus = r.hasNeuralElement ? '✅ Detectado' : '❌ Ausente';
    const menuStatus = r.hasInteractiveElements ? '✅ Presente' : '⚠️ Revisar State';
    markdown += '| `' + r.path + '` | **' + r.status + '** | ' + r.latency + ' | ' + neuralStatus + ' | ' + menuStatus + ' |\n';
  }

  markdown += '\n## 2. HALLAZGOS FORENSES EN CÓDIGO FUENTE\n\n';
  if (codeIssues.length === 0) {
    markdown += '✅ No se encontraron anomalías graves.\n';
  } else {
    markdown += '| Tipo de Anomalía | Archivo Afectado | Detalle Táctico |\n';
    markdown += '| :--- | :--- | :--- |\n';
    for (const issue of codeIssues) {
      markdown += '| **' + issue.type + '** | `' + issue.file + '` | ' + issue.detail + ' |\n';
    }
  }

  markdown += '\n## 3. PLAN DE REPARACIÓN DETERMINISTA\n\n';
  markdown += '1. **Sincronización del Túnel Neural:** Requerimos un Hook global (`useNeuralTunnelStore`) para controlar la apertura desde cualquier botón.\n';
  markdown += '2. **Eventos Multi-Opción:** Convertir `/eventos` a cliente o usar `searchParams` para activar menús reales en lugar de páginas estáticas.\n';
  markdown += '3. **Eliminar Enlaces Ciegos:** Reemplazar enlaces vacíos por botones con eventos de navegación reales.\n';

  fs.writeFileSync(REPORT_FILE, markdown, 'utf8');
  console.log('✅ AUDITORÍA FINALIZADA. Informe guardado en: AUDIT_FORENSIC_REPORT.md\n');
}

runForensicAudit();