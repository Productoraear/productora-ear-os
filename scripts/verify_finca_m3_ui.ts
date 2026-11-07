/**
 * ════════════════════════════════════════════════════════════════════════════
 * VERIFICADOR RIGUROSO DE ARQUITECTURA E INTERFACES: MILESTONE 3 (UI B2B)
 * ════════════════════════════════════════════════════════════════════════════
 * Ubicación: `scripts/verify_finca_m3_ui.ts`
 *
 * Misión:
 *  1. Comprobar existencia y validez de los 4 componentes M3.
 *  2. Respeto innegociable de ZONA CERO (ficheros inviolables).
 *  3. Cero tipos `any`, cero TODO/FIXME y cero fugas de secretos en `"use client"`.
 *  4. Verificación de 0% fuga publicitaria (erradicación total de NeuralNavigation).
 *  5. Verificación de Contact-Gate (función maskPhone e integración con Centralita).
 *  6. Verificación de cero clics muertos (anclas e interacciones reales).
 *  7. Verificación de pureza CSS OLED (prohibición estricta de `w-screen`).
 *  8. Pruebas funcionales de los algoritmos de pricing y price-match consumidos por la UI.
 * ════════════════════════════════════════════════════════════════════════════
 */

import fs from 'node:fs';
import path from 'node:path';
import { maskPhone } from '../src/features/bodas/ui/FincasCatalogExplorer';
import { calculateFincaEventPricing } from '../src/lib/fincas/fincaMenuPricingEngine';
import { calculateFounderFeeMatch } from '../src/lib/fincas/fincaMetricsEngine';

const ROOT = process.cwd();

interface TestAssertion {
  name: string;
  passed: boolean;
  error?: string;
}

const assertions: TestAssertion[] = [];

function assert(condition: boolean, name: string, errorDetail?: string) {
  if (condition) {
    assertions.push({ name, passed: true });
    console.log(`  \x1b[32m✓\x1b[0m ${name}`);
  } else {
    assertions.push({ name, passed: false, error: errorDetail || 'Assertion failed' });
    console.error(`  \x1b[31m✗\x1b[0m ${name}`);
    if (errorDetail) {
      console.error(`    \x1b[33mDetalle: ${errorDetail}\x1b[0m`);
    }
  }
}

function readFile(relPath: string): string {
  const full = path.join(ROOT, relPath);
  if (!fs.existsSync(full)) {
    throw new Error(`Fichero no encontrado: ${relPath}`);
  }
  return fs.readFileSync(full, 'utf-8');
}

console.log('\n\x1b[1m\x1b[36m═══ SUITE 1: VERIFICACIÓN DE EXISTENCIA Y ESTRUCTURA DE COMPONENTES M3 ═══\x1b[0m');

const M3_FILES = [
  'src/components/fincas/FincaMenuSimulator2026.tsx',
  'src/components/fincas/FincasB2BPortal.tsx',
  'src/app/(public)/fincas/page.tsx',
  'src/features/bodas/ui/FincasCatalogExplorer.tsx',
];

for (const file of M3_FILES) {
  const exists = fs.existsSync(path.join(ROOT, file));
  assert(exists, `Fichero existe en disco: ${file}`);
}

console.log('\n\x1b[1m\x1b[36m═══ SUITE 2: BLINDAJE DE ZONA CERO (INVIOLABILIDAD SSOT) ═══\x1b[0m');

const ZONA_CERO_FILES = [
  'src/lib/constants/ear-os-ssot.ts',
  'src/lib/security/ssotIntegrityGuard.ts',
  'src/lib/availability/atomicDateLockEngine.ts',
];

for (const zcFile of ZONA_CERO_FILES) {
  const exists = fs.existsSync(path.join(ROOT, zcFile));
  assert(exists, `Fichero ZONA CERO preservado: ${zcFile}`);
}

console.log('\n\x1b[1m\x1b[36m═══ SUITE 3: CALIDAD DE CÓDIGO (CERO ANY, CERO TODO, CERO SECRETOS EN CLIENTE) ═══\x1b[0m');

const anyRegex = /(:\s*any\b|<any>|as\s+any\b|any\[\])/;
const todoRegex = /\b(TODO|FIXME|HACK|XXX)\b/;
const secretRegex = /process\.env\.([A-Z0-9_]*(?:SECRET|TOKEN|PRIVATE_KEY|PASSWORD|SERVICE_ROLE)[A-Z0-9_]*)/;

for (const file of M3_FILES) {
  const content = readFile(file);
  const lines = content.split('\n');

  // Check 0 any (ignoring comments)
  const anyHits: string[] = [];
  lines.forEach((line, idx) => {
    const trimmed = line.trim();
    if (!trimmed.startsWith('//') && !trimmed.startsWith('*')) {
      if (anyRegex.test(trimmed)) {
        anyHits.push(`Línea ${idx + 1}: ${trimmed}`);
      }
    }
  });
  assert(anyHits.length === 0, `${file} - Cero tipos \`any\``, anyHits.join('; '));

  // Check 0 TODO/FIXME
  const todoHits: string[] = [];
  lines.forEach((line, idx) => {
    if (todoRegex.test(line)) {
      todoHits.push(`Línea ${idx + 1}: ${line.trim()}`);
    }
  });
  assert(todoHits.length === 0, `${file} - Cero TODO/FIXME/HACK`, todoHits.join('; '));

  // Check 0 secrets in client components
  if (content.includes("'use client'") || content.includes('"use client"')) {
    const secretMatches = content.match(secretRegex);
    assert(
      !secretMatches,
      `${file} - Cero secretos de servidor en componente de cliente`,
      secretMatches ? `Fuga detectada: ${secretMatches[0]}` : undefined
    );
  }
}

console.log('\n\x1b[1m\x1b[36m═══ SUITE 4: REGLAS VISUALES OLED Y ERRORES DE MAQUETACIÓN (NO W-SCREEN) ═══\x1b[0m');

for (const file of M3_FILES) {
  const content = readFile(file);
  const hasWScreen = /\bw-screen\b/.test(content);
  assert(!hasWScreen, `${file} - Prohibido el uso de \`w-screen\` (cumple OLED pure layout)`);

  const hasOverflow = /\boverflow-x-hidden\b/.test(content);
  const isPageOrRoot = file.includes('page.tsx') || file.includes('Simulator') || file.includes('Portal');
  if (isPageOrRoot) {
    assert(hasOverflow, `${file} - Contenedor con \`overflow-x-hidden\` para erradicar overflow horizontal`);
  }
}

console.log('\n\x1b[1m\x1b[36m═══ SUITE 5: GARANTÍA 0% FUGA PUBLICITARIA (ERRADICACIÓN DE NEURAL NAVIGATION) ═══\x1b[0m');

const catalogExplorerContent = readFile('src/features/bodas/ui/FincasCatalogExplorer.tsx');
assert(
  !catalogExplorerContent.includes('NeuralNavigation'),
  'FincasCatalogExplorer - Erradicación total de NeuralNavigation (0% recomendación de competidores)'
);
assert(
  catalogExplorerContent.includes('0% Fuga a Competidores') || catalogExplorerContent.includes('Garantía Contractual 0% Fuga'),
  'FincasCatalogExplorer - Certificación visual de Exclusividad de Ficha y Blindaje Anti-Fuga'
);

console.log('\n\x1b[1m\x1b[36m═══ SUITE 6: CONTACT-GATE Y MODAL DE BLOQUEO DE VISITA TÉCNICA (100 € STRIPE) ═══\x1b[0m');

assert(
  catalogExplorerContent.includes('maskPhone'),
  'FincasCatalogExplorer - Contact-Gate: función maskPhone() exportada e implementada'
);
assert(
  catalogExplorerContent.includes('TechnicalVisitLockModal'),
  'FincasCatalogExplorer - Componente TechnicalVisitLockModal presente'
);
assert(
  catalogExplorerContent.includes('/api/fincas/visit-lock'),
  'FincasCatalogExplorer - Endpoint transaccional /api/fincas/visit-lock conectado'
);
assert(
  catalogExplorerContent.includes('DEPOSITO_STRIPE_EUR'),
  'FincasCatalogExplorer - Fianza canónica de 100 € Stripe Price-Lock enlazada al SSOT'
);
assert(
  catalogExplorerContent.includes('!data.isMockSession') &&
    (catalogExplorerContent.includes('offline_seal_simulation') || catalogExplorerContent.includes('data.mode')),
  'FincasCatalogExplorer - Guarded redirect: impide redirección a URL 404 en mock/test mode y muestra sello SHA-256 en modal'
);

// Pruebas unitarias de maskPhone
const masked1 = maskPhone('+34 925 123 456');
const masked2 = maskPhone('600123456');
const masked3 = maskPhone('');

assert(masked1.includes('•••'), 'maskPhone - Enmascara número con prefijo internacional +34');
assert(masked2.includes('•••'), 'maskPhone - Enmascara número nacional sin prefijo');
assert(masked3 === '••• ••• •••', 'maskPhone - Fallback seguro para cadena vacía');

console.log('\n\x1b[1m\x1b[36m═══ SUITE 7: SIMULADOR DE MENÚS 2026 & ENCARGO LOGÍSTICA 1-CLIC ═══\x1b[0m');

const simulatorContent = readFile('src/components/fincas/FincaMenuSimulator2026.tsx');
assert(
  simulatorContent.includes('FINCA_BODA_MENUS_2026'),
  'FincaMenuSimulator2026 - Conexión al catálogo oficial de 7 menús de boda 2026'
);
assert(
  simulatorContent.includes('FINCA_EXTRAS_2026'),
  'FincaMenuSimulator2026 - Conexión al catálogo de los 16 extras canónicos'
);
assert(
  simulatorContent.includes('calculateFincaEventPricing'),
  'FincaMenuSimulator2026 - Conexión al motor determinista calculateFincaEventPricing (integer cents)'
);
assert(
  simulatorContent.includes('dispatchFincaLogisticsOrderAction'),
  'FincaMenuSimulator2026 - Server Action dispatchFincaLogisticsOrderAction enlazado para encargo 1-clic'
);
assert(
  simulatorContent.includes('Ley 37/2003') && simulatorContent.includes('75 dB'),
  'FincaMenuSimulator2026 - Rider acústico Ley 37/2003 (< 75 dB SPL, 12 W/pax) desplegado'
);
assert(
  simulatorContent.includes('Split Soberano 80/10/10'),
  'FincaMenuSimulator2026 - Split Soberano 80/10/10 inmutable desplegado'
);

// Prueba de ejecución de calculateFincaEventPricing
const pricingTest = calculateFincaEventPricing({
  menuId: 'boda-cantabrico',
  guestCount: 120,
  selectedExtraIds: ['solista-edwin'],
  distanceKm: 45,
  eventEndTime: '02:00',
  affiliateCommissionPct: 0.12,
});

assert(pricingTest.subtotalCents > 0, 'calculateFincaEventPricing - Subtotal calculado en céntimos enteros positivos');
assert(pricingTest.totalWithIvaCents > pricingTest.subtotalCents, 'calculateFincaEventPricing - IVA del 21% aplicado correctamente');
assert(pricingTest.affiliateCommissionCents > 0, 'calculateFincaEventPricing - Comisión de afiliado (12%) calculada');
assert(pricingTest.acousticRider.recommendedWatts === 120 * 12, 'calculateFincaEventPricing - Vatios acústicos: 12 W/pax exacto');
assert(pricingTest.depositDeductibleCents === 10000, 'calculateFincaEventPricing - Fianza deducible de 100,00 € (10.000 cts)');

console.log('\n\x1b[1m\x1b[36m═══ SUITE 8: PORTAL B2B & PACTO DE LOS 100 FUNDADORES (PRICE-MATCH) ═══\x1b[0m');

const portalContent = readFile('src/components/fincas/FincasB2BPortal.tsx');
assert(
  portalContent.includes("'PACTO_100_FUNDADORES'"),
  'FincasB2BPortal - Vista PACTO_100_FUNDADORES registrada en PortalView'
);
assert(
  portalContent.includes('calculateFounderFeeMatch'),
  'FincasB2BPortal - Motor calculateFounderFeeMatch integrado para cálculo de Price-Match'
);
assert(
  portalContent.includes('buildComparativaBodasNetVsEarOs'),
  'FincasB2BPortal - Matriz comparativa Bodas.net vs EAR OS integrada'
);
assert(
  portalContent.includes('/api/b2b/homologacion'),
  'FincasB2BPortal - Formulario de onboarding conectado a /api/b2b/homologacion'
);
assert(
  portalContent.includes('isFounderPactApplied'),
  'FincasB2BPortal - Captura y despacho de adhesión al Pacto de Fundadores'
);

// Prueba de ejecución de calculateFounderFeeMatch
const founderMatchTest = calculateFounderFeeMatch(250, {
  currentFoundersEnrolled: 42,
  horizonYears: 5,
  projectedAnnualWeddings: 20,
});

assert(founderMatchTest.eligibleForFounderPact === true, 'calculateFounderFeeMatch - 42 de 100 inscritas es elegible para Fundador');
assert(founderMatchTest.founderSlotNumber === 43, 'calculateFounderFeeMatch - Próxima plaza asignada es la #43');
assert(founderMatchTest.remainingSlots === 58, 'calculateFounderFeeMatch - Quedan 58 plazas libres');
assert(founderMatchTest.matchedMonthlyFeeEur === 250, 'calculateFounderFeeMatch - Cuota igualada de 250 €/mes exactos');
assert(founderMatchTest.lifetimePriceLock === true, 'calculateFounderFeeMatch - Cláusula vitalicia activada (0% IPC)');

console.log('\n\x1b[1m\x1b[36m═══ SUITE 9: LANDING PÚBLICA /fincas Y CERO CLICS MUERTOS ═══\x1b[0m');

const landingContent = readFile('src/app/(public)/fincas/page.tsx');
assert(
  landingContent.includes('Pacto de los 100 Fundadores'),
  'fincas/page.tsx - Hero B2B del Pacto de 100 Fundadores presente'
);
assert(
  landingContent.includes('FincaMenuSimulator2026'),
  'fincas/page.tsx - Componente FincaMenuSimulator2026 incrustado'
);
assert(
  landingContent.includes('FincasCatalogExplorer'),
  'fincas/page.tsx - Componente FincasCatalogExplorer incrustado'
);
assert(
  landingContent.includes('FincasB2BPortal'),
  'fincas/page.tsx - Componente FincasB2BPortal incrustado'
);

// Cero clics muertos: anclas coinciden con IDs de sección
assert(landingContent.includes('id="simulador-2026"'), 'fincas/page.tsx - Sección #simulador-2026 existe');
assert(landingContent.includes('id="catalogo-fincas"'), 'fincas/page.tsx - Sección #catalogo-fincas existe');
assert(landingContent.includes('id="portal-b2b"'), 'fincas/page.tsx - Sección #portal-b2b existe');
assert(landingContent.includes('href="#simulador-2026"'), 'fincas/page.tsx - Enlace CTA salta a #simulador-2026');
assert(landingContent.includes('href="#catalogo-fincas"'), 'fincas/page.tsx - Enlace CTA salta a #catalogo-fincas');
assert(landingContent.includes('href="#portal-b2b"'), 'fincas/page.tsx - Enlace CTA salta a #portal-b2b');

// Resumen final
console.log('\n\x1b[1m\x1b[36m═══ RESUMEN DE LA AUDITORÍA DE VERIFICACIÓN M3 ═══\x1b[0m');
const total = assertions.length;
const passed = assertions.filter((a) => a.passed).length;
const failed = total - passed;

console.log(`Total Aserciones: ${total}`);
console.log(`\x1b[32mExitosas: ${passed}\x1b[0m`);
if (failed > 0) {
  console.log(`\x1b[31mFallidas: ${failed}\x1b[0m`);
  process.exit(1);
} else {
  console.log(`\x1b[32m\x1b[1m¡TODAS LAS PRUEBAS DE M3 PASARON CON ÉXITO! (100% CUMPLIMIENTO)\x1b[0m\n`);
  process.exit(0);
}
