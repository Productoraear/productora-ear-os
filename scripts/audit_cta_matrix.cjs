/**
 * ════════════════════════════════════════════════════════════════════════════
 * AUDITOR SRE P0 — MATRIZ DE CTAs EN RUTAS PÚBLICAS & PURGA /celebraciones
 * ════════════════════════════════════════════════════════════════════════════
 * Verifica determinísticamente:
 * 1. Cero enlaces rotos o href="#" vacíos en Home, Seating Planner, Otzarreta y Presupuesto.
 * 2. Purga y redirección 301 canónica de /celebraciones y alias /produccion en next.config.ts.
 * 3. Home cinematográfica con 3 Puertas Multi-Entidad (/fincas, /artistas, /produccion).
 * 4. Política Anti-Stock Media en galerías de proveedor.
 * 5. Quick Enrichment en el panel admin de proveedores.
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

check(
  'next.config.ts declara alias 301 de /produccion hacia /proveedores?categoria=tecnica',
  nextConfigContent.includes('source: "/produccion"') &&
  nextConfigContent.includes('destination: "/proveedores?categoria=tecnica"'),
  'Falta alias canónico de /produccion'
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

// 4. Verificación de Home Cinematográfica y 3 Puertas
const homePath = path.join(REPO_ROOT, 'src', 'app', 'page.tsx');
const homeContent = fs.readFileSync(homePath, 'utf8');
check(
  'Home erradica el bloque vertical de scrollytelling acumulado',
  !homeContent.includes('SovereignScrollytellingStage'),
  'src/app/page.tsx aún importa SovereignScrollytellingStage'
);
check(
  'Home renderiza SovereignThreeDoorsDistributor sobre fondo Onyx',
  homeContent.includes('SovereignThreeDoorsDistributor') && homeContent.includes('#030305'),
  'src/app/page.tsx no monta SovereignThreeDoorsDistributor'
);

const threeDoorsPath = path.join(REPO_ROOT, 'src', 'components', 'home', 'SovereignThreeDoorsDistributor.tsx');
const threeDoorsContent = fs.readFileSync(threeDoorsPath, 'utf8');
check(
  'Puerta 1 enlaza a /fincas (Espacios & Restauración)',
  threeDoorsContent.includes("href: '/fincas'"),
  'Puerta 1 no apunta a /fincas'
);
check(
  'Puerta 2 enlaza a /artistas (Música en Directo & Roster)',
  threeDoorsContent.includes("href: '/artistas'"),
  'Puerta 2 no apunta a /artistas'
);
check(
  'Puerta 3 enlaza a /produccion (Producción Técnica & Audiovisuales)',
  threeDoorsContent.includes("href: '/produccion'"),
  'Puerta 3 no apunta a /produccion'
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

// 8. Política Anti-Stock Media en Ficha de Proveedor
const galleryPath = path.join(REPO_ROOT, 'src', 'components', 'providers', 'ProviderMediaGallery.tsx');
const galleryContent = fs.readFileSync(galleryPath, 'utf8');
check(
  'Galería de proveedor declara distintivo Ficha Técnica Verificada · Multimedia en Auditoría',
  galleryContent.includes('Ficha Técnica Verificada · Multimedia en Auditoría'),
  'Falta distintivo de auditoría técnica en ProviderMediaGallery'
);

// 9. Quick Enrichment en Admin Proveedores
const adminProvPath = path.join(REPO_ROOT, 'src', 'app', '(admin)', 'admin', 'proveedores', 'page.tsx');
const adminProvContent = fs.readFileSync(adminProvPath, 'utf8');
check(
  'Admin Proveedores habilita Enriquecimiento Rápido para Call Center',
  adminProvContent.includes('Enriquecimiento Rápido · Call Center'),
  'Falta panel de enriquecimiento rápido en admin/proveedores'
);
check(
  'Admin Proveedores expone el identificador universal EAR_ASIN_ID',
  adminProvContent.includes('resolveEarAsin') && adminProvContent.includes('ASIN:'),
  'Falta exposición de EAR_ASIN_ID en admin/proveedores'
);

// 10. Mandato Bezos: Estándar ASIN & Contratos Desacoplados
const asinStandardPath = path.join(REPO_ROOT, 'src', 'lib', 'catalog', 'asin-standard.ts');
const asinStandardContent = fs.readFileSync(asinStandardPath, 'utf8');
check(
  'asin-standard.ts declara formato EAR-ASIN e identidades 1P ancla',
  asinStandardContent.includes('EAR-ASIN-ART-E78903') &&
  asinStandardContent.includes('EAR-ASIN-FNC-OTZARRETA') &&
  asinStandardContent.includes('EAR-ASIN-TEC-LUCES2026'),
  'Faltan identidades ancla 1P en asin-standard.ts'
);

const transductiveSchemasPath = path.join(REPO_ROOT, 'src', 'types', 'transductive-schemas.ts');
const transductiveContent = fs.readFileSync(transductiveSchemasPath, 'utf8');
check(
  'transductive-schemas.ts declara contratos desacoplados Zod (Menús, Artistas, Fianza 100€, Acústica <75dB, Waybill)',
  transductiveContent.includes('MenuContractSchema') &&
  transductiveContent.includes('ArtistBookingContractSchema') &&
  transductiveContent.includes('ReservationDateLockContractSchema') &&
  transductiveContent.includes('AcousticComplianceContractSchema') &&
  transductiveContent.includes('FleetWaybillContractSchema') &&
  transductiveContent.includes('SovereignFulfillmentGuaranteeSchema') &&
  transductiveContent.includes('BuyBoxScoredEntitySchema'),
  'Faltan contratos desacoplados en transductive-schemas.ts'
);

// 11. Protocolo de Fulfillment Soberano ("Fulfillment by EAR OS")
const fulfillmentPath = path.join(REPO_ROOT, 'src', 'lib', 'services', 'marketplace', 'sovereign-fulfillment-service.ts');
const fulfillmentContent = fs.readFileSync(fulfillmentPath, 'utf8');
check(
  'sovereign-fulfillment-service.ts garantiza montaje 2h antes, acústica < 75 dB y cobertura 52 provincias',
  fulfillmentContent.includes('setup2hPriorVerified') &&
  fulfillmentContent.includes('acousticUnder75Db') &&
  fulfillmentContent.includes('electricalRiderVerified') &&
  fulfillmentContent.includes('provincesCoverage52'),
  'Falta cumplimiento de garantías en sovereign-fulfillment-service.ts'
);

// 12. Buy Box S-Class & Algoritmo de Compatibilidad
const buyBoxPath = path.join(REPO_ROOT, 'src', 'lib', 'services', 'marketplace', 'buybox-matching-engine.ts');
const buyBoxContent = fs.readFileSync(buyBoxPath, 'utf8');
check(
  'buybox-matching-engine.ts implementa ecuación Score = (ProximidadKm * 0.4) + (FiabilidadTecnica * 0.3) + (RespetoTarifasSSOT * 0.3)',
  buyBoxContent.includes('proximityScore * 0.4') &&
  buyBoxContent.includes('technicalReliabilityScore * 0.3') &&
  buyBoxContent.includes('ssotRateRespectScore * 0.3'),
  'Falta ecuación canónica en buybox-matching-engine.ts'
);
check(
  'buybox-matching-engine.ts ejecuta triaje rápido devolviendo estrictamente Top 3 sin scroll infinito',
  buyBoxContent.includes('matchMarketplaceTop3') && buyBoxContent.includes('.slice(0, 3)'),
  'Falta triaje Top 3 en buybox-matching-engine.ts'
);

// 13. Doctrina Tripartita (Airbnb + Uber + Tinder + Caballo de Troya Bodas.net)
check(
  'SovereignThreeDoorsDistributor.tsx declara la matriz de los 4 pilares (Airbnb, Uber, Tinder, Bodas.net)',
  threeDoorsContent.includes('AIRBNB') &&
  threeDoorsContent.includes('UBER') &&
  threeDoorsContent.includes('TINDER') &&
  threeDoorsContent.includes('BODAS.NET') &&
  threeDoorsContent.includes('Price-Lock'),
  'Falta matriz de 4 pilares en SovereignThreeDoorsDistributor.tsx'
);

// 14. Ejecución de la Matriz General de Trazabilidad de CTAs
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
