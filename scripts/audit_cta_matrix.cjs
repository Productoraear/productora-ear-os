/**
 * ════════════════════════════════════════════════════════════════════════════
 * AUDITOR SRE P0 — MATRIZ DE CTAs EN RUTAS PÚBLICAS & PURGA /celebraciones
 * ════════════════════════════════════════════════════════════════════════════
 * Verifica determinísticamente:
 * 1. Cero enlaces rotos o href="#" vacíos en Home, Seating Planner, Otzarreta y Presupuesto.
 * 2. Purga y redirección 301 canónica de /celebraciones en next.config.ts.
 * 3. Todo botón de cotización apunta a /presupuesto.
 * 4. Todo botón de reserva apunta a /reservar/solista o fianza deducible.
 * ════════════════════════════════════════════════════════════════════════════
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const REPO_ROOT = path.resolve(__dirname, '..');

let totalChecks = 0;
let passedChecks = 0;
const failures = [];

function check(label, condition, detail = '') {
  totalChecks++;
  if (condition) {
    passedChecks++;
    console.log(`  [PASS] ${label}`);
  } else {
    failures.push({ label, detail });
    console.error(`  [FAIL] ${label}: ${detail}`);
  }
}

console.log('════════════════════════════════════════════════════════════════════════════');
console.log('🏛️ AUDITORÍA SRE P0: SANEAMIENTO /celebraciones Y MATRIZ DE CTAs PÚBLICAS');
console.log('════════════════════════════════════════════════════════════════════════════');

// 1. Verificación de next.config.ts
const nextConfigPath = path.join(REPO_ROOT, 'next.config.ts');
const nextConfigContent = fs.readFileSync(nextConfigPath, 'utf8');

check(
  'next.config.ts declara redirección canónica 301 de /celebraciones a /',
  nextConfigContent.includes('source: "/celebraciones"') &&
  nextConfigContent.includes('destination: "/"') &&
  nextConfigContent.includes('permanent: true'),
  'Falta redirección 301 permanente en next.config.ts'
);

check(
  'next.config.ts declara redirección canónica 301 de /reservar a /reservar/solista',
  nextConfigContent.includes('source: "/reservar"') &&
  nextConfigContent.includes('destination: "/reservar/solista"'),
  'Falta redirección de /reservar a /reservar/solista'
);

// 2. Verificación de página /celebraciones
const celebracionesPagePath = path.join(REPO_ROOT, 'src', 'app', '(public)', 'celebraciones', 'page.tsx');
if (fs.existsSync(celebracionesPagePath)) {
  const celebracionesContent = fs.readFileSync(celebracionesPagePath, 'utf8');
  check(
    'src/app/(public)/celebraciones/page.tsx ejecuta permanentRedirect("/")',
    celebracionesContent.includes("permanentRedirect('/')"),
    'La página /celebraciones no redirige permanentemente a la raíz'
  );
  check(
    'src/app/(public)/celebraciones/page.tsx no expone botones ni componentes huérfanos',
    !celebracionesContent.includes('<JourneyPage') && !celebracionesContent.includes('Empezar el recorrido'),
    'La página /celebraciones mantiene componentes del recorrido obsoleto'
  );
} else {
  check('Ruta física /celebraciones eliminada o redirigida', true);
}

// 3. Verificación de inventario de puertas (ecosystem-ontology.ts)
const ontologyPath = path.join(REPO_ROOT, 'src', 'lib', 'catalog', 'ecosystem-ontology.ts');
const ontologyContent = fs.readFileSync(ontologyPath, 'utf8');
check(
  'ecosystem-ontology.ts no enlaza a /celebraciones en el menú',
  !ontologyContent.includes("href: '/celebraciones'") && !ontologyContent.includes("href: '/celebraciones#"),
  'Quedan enlaces a /celebraciones en ecosystem-ontology.ts'
);

// 4. Verificación de Home (SovereignScrollytellingStage.tsx)
const homeStagePath = path.join(REPO_ROOT, 'src', 'components', 'spatial', 'SovereignScrollytellingStage.tsx');
const homeStageContent = fs.readFileSync(homeStagePath, 'utf8');
check(
  'Home no contiene enlaces muertos href="#"',
  !homeStageContent.includes('href="#"'),
  'Se detectó href="#" en SovereignScrollytellingStage'
);
check(
  'Botón de fianza en Home apunta canónicamente a /reservar/solista',
  homeStageContent.includes("href: '/reservar/solista'"),
  'El botón de fianza en Home no apunta a /reservar/solista'
);
check(
  'Botón de cotización/presupuesto en Home apunta a /presupuesto',
  homeStageContent.includes("href: '/presupuesto'"),
  'Falta enlace a /presupuesto en Home'
);

// 5. Verificación de Seating Planner
const seatingPath = path.join(REPO_ROOT, 'src', 'app', '(public)', 'seating-planner', 'page.tsx');
const seatingContent = fs.readFileSync(seatingPath, 'utf8');
check(
  'Seating Planner no contiene href="#" huérfano',
  !seatingContent.includes('href="#"'),
  'Se detectó href="#" en seating-planner/page.tsx'
);
check(
  'Seating Planner enlaza a /presupuesto',
  seatingContent.includes("href=\"/presupuesto\""),
  'Seating Planner no enlaza a /presupuesto'
);

// 6. Verificación de Otzarreta
const otzarretaPath = path.join(REPO_ROOT, 'src', 'app', '(public)', 'otzarreta', 'page.tsx');
const otzarretaContent = fs.readFileSync(otzarretaPath, 'utf8');
check(
  'Otzarreta no contiene href="#" huérfano',
  !otzarretaContent.includes('href="#"'),
  'Se detectó href="#" en otzarreta/page.tsx'
);
check(
  'Otzarreta utiliza resolveProviderCalendarHref para bloqueo de fecha',
  otzarretaContent.includes('resolveProviderCalendarHref(OTZARRETA_CTA_SOURCE'),
  'Otzarreta no usa el motor canónico de calendario'
);

// 7. Verificación de Presupuesto
const presupuestoPath = path.join(REPO_ROOT, 'src', 'app', '(public)', 'presupuesto', 'page.tsx');
const presupuestoContent = fs.readFileSync(presupuestoPath, 'utf8');
check(
  'Presupuesto no contiene href="#" huérfano',
  !presupuestoContent.includes('href="#"'),
  'Se detectó href="#" en presupuesto/page.tsx'
);

// 8. Ejecución de la Matriz General de Trazabilidad de CTAs
console.log('\n── Ejecutando Matriz General de Trazabilidad (audit_cta_trace_matrix.ts) ──');
try {
  const result = execSync('node ./node_modules/tsx/dist/cli.mjs scripts/audit_cta_trace_matrix.ts', {
    cwd: REPO_ROOT,
    encoding: 'utf8',
  });
  console.log(result.split('\n').slice(-10).join('\n'));
  check('Matriz General de Trazabilidad de CTAs exitosa', result.includes('VEREDICTO: PASS'));
} catch (e) {
  check('Matriz General de Trazabilidad de CTAs exitosa', false, e.message);
}

console.log('────────────────────────────────────────────────────────────────────────────');
console.log(`[RESULTADO] ${passedChecks}/${totalChecks} compuertas superadas`);

if (failures.length > 0) {
  console.error('\n❌ COMPUERTAS FALLIDAS:');
  failures.forEach((f) => console.error(`  - ${f.label}: ${f.detail}`));
  process.exit(1);
} else {
  console.log('✅ TODAS LAS COMPUERTAS DE AUDITORÍA DE CTAs HAN SIDO SUPERADAS (EXIT 0)');
  process.exit(0);
}
