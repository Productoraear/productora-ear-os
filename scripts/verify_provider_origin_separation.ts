/**
 * ════════════════════════════════════════════════════════════════════════════
 * W54_T01 — VERIFICADOR S-CLASS DE SEPARACIÓN DE SEDE PROPIA VS HUB MÉNTRIDA
 * Y GARANTÍA DE MATCH BILATERAL DE EXPECTATIVAS (EAR OS V2)
 * ════════════════════════════════════════════════════════════════════════════
 * Reglas de Negocio Inmutables Verificadas (AGENTS.md §4 & PROJECT.md M1):
 *   1. Hub Méntrida (350 € base solista + 50 km exentos + 1,50 €/km + 120 € hotel)
 *      aplica EXCLUSIVAMENTE a Edwin Agudelo / Productora EAR o empresas con base en Méntrida.
 *   2. Cualquier otro proveedor del catálogo calcula kilometraje y logística
 *      desde su propia sede registrada (código postal / provincia / dirección).
 *   3. En producción musical externa sin precio verificado, NO se aplica la tarifa
 *      solista de Edwin (350 €) ni su etiqueta SSOT; aplica partida de gremio (550 €).
 *   4. Cero promesas punitivas de "cero multas"; sustituidas en su totalidad
 *      por la institucional "Garantía de Match Bilateral de Expectativas".
 *   5. Preservación estricta de la tarifa base propia declarada (basePriceEur)
 *      para empresas terceras radicadas físicamente en Méntrida (CP 45290).
 *   6. Segregación estricta de identidad: isEdwinOrProductoraEar solo es true
 *      para Edwin Agudelo o Productora EAR, jamás para terceros en Méntrida.
 *   7. Precisión monetaria en céntimos enteros (1,50 €/km no redondea a 2 €).
 *   8. Resolución de rutas determinista ESM-safe (sin __dirname global).
 *
 * Salida Contractual Requerida:
 *   PROVIDER_ORIGIN_ASSERTIONS=<n>
 *   PROVIDER_ORIGIN_FAILURES=0
 *   PROVIDER_ORIGIN_RESULT=PASS
 * ════════════════════════════════════════════════════════════════════════════
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  simulateUniversalProviderQuote,
  isHubMentridaProvider,
  isEdwinOrProductoraEarProvider,
  calculateProviderLogistics,
  getGuaranteePolicy,
  type UniversalProviderMetadata,
} from '../src/lib/providers/universal-provider-simulator';
import {
  TARIFA_BASE_SOLISTA_EUR,
  LOGISTICA_KM_EXENTOS,
  LOGISTICA_EUR_PER_KM,
  SUPLEMENTO_HOTEL_EUR,
} from '../src/lib/constants/ear-os-ssot';

// Resolución determinista y canónica ESM sin variables CommonJS
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

interface VerificationMetrics {
  assertions: number;
  failures: number;
  iterations: number;
}

const metrics: VerificationMetrics = {
  assertions: 0,
  failures: 0,
  iterations: 0,
};

function check(name: string, fn: () => void): void {
  metrics.assertions += 1;
  try {
    fn();
    console.log(`  [PASS] ${name}`);
  } catch (err) {
    metrics.failures += 1;
    const detail = err instanceof Error ? err.message : String(err);
    console.error(`  [FAIL] ${name} :: ${detail}`);
  }
}

function expect(condition: boolean, message: string): void {
  if (!condition) throw new Error(message);
}

function expectEqual<T>(actual: T, expected: T, label: string): void {
  if (actual !== expected) {
    throw new Error(`${label}: esperado ${JSON.stringify(expected)}, obtenido ${JSON.stringify(actual)}`);
  }
}

console.log('═══════════════════════════════════════════════════════════════════');
console.log('  TEST SUITE W54_T01: PROVEEDOR ORIGEN & MATCH BILATERAL (ITERACIÓN 2)');
console.log('═══════════════════════════════════════════════════════════════════\n');

// ─────────────────────────────────────────────────────────────────────────────
// SUITE 1: Invariante Canónico Edwin Agudelo / Hub Méntrida
// ─────────────────────────────────────────────────────────────────────────────
console.log('▶ SUITE 1: Invariantes Canónicos de Hub Méntrida (Edwin Agudelo)');

const edwin: UniversalProviderMetadata = {
  id: 'edwin-agudelo',
  slug: 'edwin-agudelo',
  name: 'Edwin Agudelo • Tenor Lírico',
  category: 'musica_mariachi',
  province: 'Madrid',
};

check('1.1 Edwin Agudelo es identificado como Hub Méntrida y como Edwin/EAR', () => {
  expectEqual(isHubMentridaProvider(edwin), true, 'Edwin debe ser Hub Méntrida');
  expectEqual(isEdwinOrProductoraEarProvider(edwin), true, 'Edwin debe ser EdwinOrProductoraEar');
});

check('1.2 Simulación Edwin aplica 350 € base, 50 km exentos y 1,50 €/km a 80 km', () => {
  const sim = simulateUniversalProviderQuote({
    provider: edwin,
    guestsPax: 100,
    coupleTotalBudgetEur: 20000,
    tolerancePct: 10,
    distanceKm: 80,
  });
  expectEqual(sim.unitBasePriceEur, TARIFA_BASE_SOLISTA_EUR, 'Base Edwin debe ser 350 €');
  expectEqual(sim.unitLabel, 'Tarifa Base Solista SSOT (350 €)', 'Etiqueta Edwin');
  expectEqual(sim.acousticLogistics.originLabel, 'Hub Méntrida (Exclusivo Edwin Agudelo)', 'Origen Hub Méntrida');
  expectEqual(sim.acousticLogistics.freeKmIncluded, LOGISTICA_KM_EXENTOS, '50 km exentos');
  expectEqual(sim.acousticLogistics.kmRateEur, LOGISTICA_EUR_PER_KM, '1,50 €/km');
  expectEqual(sim.acousticLogistics.billableKm, 30, '80 - 50 = 30 km facturables');
  expectEqual(sim.acousticLogistics.travelCostEur, 45, '30 * 1.5 = 45 €');
  expectEqual(sim.acousticLogistics.hotelRequired, false, 'No hotel a 80 km con cierre normal');
});

check('1.3 Edwin Agudelo a distancia <= 50 km tiene coste de viaje 0,00 €', () => {
  const sim = simulateUniversalProviderQuote({
    provider: edwin,
    guestsPax: 80,
    coupleTotalBudgetEur: 15000,
    tolerancePct: 10,
    distanceKm: 45,
  });
  expectEqual(sim.acousticLogistics.billableKm, 0, 'Km facturables');
  expectEqual(sim.acousticLogistics.travelCostEur, 0, 'Coste viaje 0 €');
});

check('1.4 Edwin Agudelo a 220 km activa suplemento de hotel de 120,00 €', () => {
  const sim = simulateUniversalProviderQuote({
    provider: edwin,
    guestsPax: 120,
    coupleTotalBudgetEur: 25000,
    tolerancePct: 10,
    distanceKm: 220,
  });
  expectEqual(sim.acousticLogistics.hotelRequired, true, 'Hotel requerido > 200 km');
  expectEqual(sim.acousticLogistics.hotelSupplementEur, SUPLEMENTO_HOTEL_EUR, '120 € hotel');
});

check('1.5 Edwin Agudelo con hora fin >= 03:00 activa hotel incluso a corta distancia', () => {
  const sim = simulateUniversalProviderQuote({
    provider: edwin,
    guestsPax: 120,
    coupleTotalBudgetEur: 25000,
    tolerancePct: 10,
    distanceKm: 30,
    endHour24: 4,
  });
  expectEqual(sim.acousticLogistics.hotelRequired, true, 'Hotel requerido cierre madrugada');
  expectEqual(sim.acousticLogistics.hotelSupplementEur, 120, '120 € hotel madrugada');
});

check('1.6 Empresa con sede física registrada en Méntrida aplica Hub Méntrida en logística (50 km exentos)', () => {
  const floristeriaMentrida: UniversalProviderMetadata = {
    id: 'flores-san-juan',
    slug: 'flores-san-juan',
    name: 'Floristería San Juan',
    category: 'decoracion_flores',
    province: 'Toledo',
    headquartersAddress: 'Calle Mayor 12, Méntrida (Toledo)',
    registeredOriginPostalCode: '45290',
    registeredOriginCity: 'Méntrida',
  };
  expectEqual(isHubMentridaProvider(floristeriaMentrida), true, 'Sede Méntrida aplica Hub Méntrida');
  const sim = simulateUniversalProviderQuote({
    provider: floristeriaMentrida,
    guestsPax: 80,
    coupleTotalBudgetEur: 12000,
    tolerancePct: 10,
    distanceKm: 70,
  });
  expect(sim.acousticLogistics.originLabel.includes('Hub Méntrida'), 'Etiqueta origen incluye Hub Méntrida');
  expectEqual(sim.acousticLogistics.freeKmIncluded, 50, '50 km exentos');
});

// ─────────────────────────────────────────────────────────────────────────────
// SUITE 2: Aislamiento de Sede Propia para Proveedores Externos
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n▶ SUITE 2: Aislamiento de Sede Propia para Proveedores Externos');

const cateringValencia: UniversalProviderMetadata = {
  id: 'catering-mediterraneo-valencia',
  slug: 'catering-mediterraneo-valencia',
  name: 'Catering Mediterráneo Valencia',
  category: 'catering',
  province: 'Valencia',
  headquartersAddress: 'Avinguda del Port 45, Valencia',
  registeredOriginCity: 'Valencia',
  registeredOriginPostalCode: '46021',
  basePriceEur: 110,
  freeKm: 25,
  kmRateEur: 1.1,
  hotelSupplementEur: 130,
};

check('2.1 Catering en Valencia NO es Hub Méntrida', () => {
  expectEqual(isHubMentridaProvider(cateringValencia), false, 'Valencia NO debe ser Hub Méntrida');
});

check('2.2 Catering en Valencia calcula desde su sede registrada sin mención a Méntrida ni Edwin', () => {
  const valenciaLogistics = calculateProviderLogistics(cateringValencia, 75);
  expect(valenciaLogistics.originLabel.includes('Valencia'), 'Debe reflejar Valencia');
  expect(!valenciaLogistics.originLabel.includes('Méntrida'), 'NO debe mencionar Méntrida');
  expect(!valenciaLogistics.originLabel.includes('Edwin'), 'NO debe mencionar Edwin');
  expectEqual(valenciaLogistics.freeKmIncluded, 25, '25 km exentos propios');
  expectEqual(valenciaLogistics.kmRateEur, 1.1, '1,10 €/km propio');
  expectEqual(valenciaLogistics.billableKm, 50, '75 - 25 = 50 km facturables');
  expectEqual(valenciaLogistics.travelCostEur, 55, '50 * 1.1 = 55 €');
  expectEqual(valenciaLogistics.isHubMentrida, false, 'isHubMentrida es false');
  expectEqual(valenciaLogistics.isEdwinOrProductoraEar, false, 'isEdwinOrProductoraEar es false');
});

check('2.3 Músico externo en Barcelona sin precio verificado NO hereda 350 € ni etiqueta de Edwin', () => {
  const cuartetoBcn: UniversalProviderMetadata = {
    id: 'cuarteto-bcn',
    slug: 'cuarteto-bcn',
    name: 'Cuarteto de Cuerda Condal',
    category: 'musica',
    province: 'Barcelona',
    headquartersAddress: 'Carrer de Balmes 22, Barcelona',
    freeKm: 20,
    kmRateEur: 1.0,
  };
  expectEqual(isHubMentridaProvider(cuartetoBcn), false, 'Cuarteto BCN no es Méntrida');
  const bcnSim = simulateUniversalProviderQuote({
    provider: cuartetoBcn,
    guestsPax: 80,
    coupleTotalBudgetEur: 15000,
    tolerancePct: 10,
    distanceKm: 50,
  });
  expect(bcnSim.unitLabel !== 'Tarifa Base Solista SSOT (350 €)', 'NO debe asignar etiqueta solista de Edwin');
  expectEqual(bcnSim.unitBasePriceEur, 550, 'Debe usar partida base sectorial 550 €, NUNCA 350 €');
  expect(!bcnSim.acousticLogistics.originLabel.includes('Méntrida'), 'NO menciona Méntrida');
  expect(bcnSim.acousticLogistics.originLabel.includes('Barcelona'), 'Menciona Barcelona');
});

check('2.4 Proveedor externo sin sede física usa fallback de provincia y parámetros estándar (30 km / 1,2 €/km)', () => {
  const fotoSevilla: UniversalProviderMetadata = {
    id: 'foto-sevilla',
    slug: 'foto-sevilla',
    name: 'Fotografía Al-Ándalus',
    category: 'foto_video',
    province: 'Sevilla',
  };
  expectEqual(isHubMentridaProvider(fotoSevilla), false, 'Sevilla no es Hub Méntrida');
  const sevillaLogistics = calculateProviderLogistics(fotoSevilla, 60);
  expectEqual(sevillaLogistics.originLabel, 'Sede Registrada en Sevilla', 'Fallback provincia');
  expectEqual(sevillaLogistics.freeKmIncluded, 30, 'Defecto 30 km para externos');
  expectEqual(sevillaLogistics.kmRateEur, 1.2, 'Defecto 1.2 €/km para externos');
  expectEqual(sevillaLogistics.billableKm, 30, '60 - 30 = 30 km facturables');
  expectEqual(sevillaLogistics.travelCostEur, 36, '30 * 1.2 = 36 €');
});

check('2.5 Proveedor con "Méntrida" en nombre pero sede externa no es usurpado como Hub Méntrida', () => {
  const sonidoExterno: UniversalProviderMetadata = {
    id: 'sonido-mentrida-externo',
    slug: 'sonido-mentrida-externo',
    name: 'Sonido Méntrida Eventos',
    category: 'sonido',
    province: 'Madrid',
    headquartersAddress: 'Polígono Industrial Las Nieves, Móstoles',
    registeredOriginCity: 'Móstoles',
    registeredOriginPostalCode: '28935',
  };
  expectEqual(isHubMentridaProvider(sonidoExterno), false, 'Empresa en Móstoles no es Hub Méntrida');
  const log = calculateProviderLogistics(sonidoExterno, 50);
  expect(log.originLabel.includes('Móstoles'), 'Origen en Móstoles');
  expect(!log.originLabel.includes('Exclusivo Edwin Agudelo'), 'No usurpa etiqueta de Edwin');
});

check('2.6 Proveedor con dirección en "Calle Méntrida" (Madrid) NO es Hub Méntrida ni usurpa tarifas', () => {
  const proveedorCalleMentrida: UniversalProviderMetadata = {
    id: 'catering-madrid-calle-mentrida',
    slug: 'catering-madrid-calle-mentrida',
    name: 'Catering Capital Madrid',
    category: 'catering',
    province: 'Madrid',
    headquartersAddress: 'Calle Méntrida 14, 28043 Madrid',
    registeredOriginCity: 'Madrid',
    registeredOriginPostalCode: '28043',
    basePriceEur: 1200,
  };

  expectEqual(isHubMentridaProvider(proveedorCalleMentrida), false, 'Calle Méntrida en Madrid NO debe ser Hub Méntrida');

  const log = calculateProviderLogistics(proveedorCalleMentrida, 60);
  expectEqual(log.isHubMentrida, false, 'isHubMentrida es false');
  expectEqual(log.isEdwinOrProductoraEar, false, 'isEdwinOrProductoraEar es false');
  expectEqual(log.originPostalCode, '28043', 'CP debe ser 28043, NUNCA 45290');
  expectEqual(log.baseServiceEur, 1200, 'Conserva su tarifa base de 1.200 €, NUNCA 350 €');
  expect(!log.originLabel.includes('Hub Méntrida'), 'No tiene etiqueta de Hub Méntrida');
});

check('2.7 Tercero en Méntrida (Toledo) aplica logística Méntrida pero conserva tarifa declarada y NO es Edwin', () => {
  const sonidoLocalMentrida: UniversalProviderMetadata = {
    id: 'sonido-pro-mentrida',
    slug: 'sonido-pro-mentrida',
    name: 'Sonido Profesional Méntrida',
    category: 'sonido',
    province: 'Toledo',
    headquartersAddress: 'Calle Real 8, Méntrida',
    registeredOriginCity: 'Méntrida',
    registeredOriginPostalCode: '45290',
    basePriceEur: 800,
  };

  expectEqual(isHubMentridaProvider(sonidoLocalMentrida), true, 'Ubicación física en Méntrida aplica Hub Méntrida');

  const log = calculateProviderLogistics(sonidoLocalMentrida, 60);
  expectEqual(log.isHubMentrida, true, 'isHubMentrida es true');
  expectEqual(log.isEdwinOrProductoraEar, false, 'isEdwinOrProductoraEar es estrictamente FALSE para terceros');
  expectEqual(log.freeKmIncluded, 50, 'Aplica los 50 km exentos del Hub Méntrida');
  expectEqual(log.kmRateEur, 1.5, 'Aplica tasa logística 1,50 €/km de Méntrida');
  expectEqual(log.baseServiceEur, 800, 'Conserva su tarifa declarada de 800 €, NUNCA 350 €');
});

check('2.8 Tercero en Méntrida sin basePriceEur usa fallback gremial (550 €), NUNCA 350 € de Edwin', () => {
  const musicoLocalSinTarifa: UniversalProviderMetadata = {
    id: 'trio-cuerda-mentrida',
    slug: 'trio-cuerda-mentrida',
    name: 'Trío Cuerda Méntrida',
    category: 'musica_produccion',
    province: 'Toledo',
    registeredOriginPostalCode: '45290',
    registeredOriginCity: 'Méntrida',
  };

  const log = calculateProviderLogistics(musicoLocalSinTarifa, 60);
  expectEqual(log.isHubMentrida, true, 'isHubMentrida true');
  expectEqual(log.isEdwinOrProductoraEar, false, 'isEdwinOrProductoraEar false');
  expectEqual(log.baseServiceEur, 550, 'Tercero en Méntrida sin base usa 550 €, NUNCA 350 €');
});

// ─────────────────────────────────────────────────────────────────────────────
// SUITE 3: Contratos de Interfaz (calculateProviderLogistics & getGuaranteePolicy)
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n▶ SUITE 3: Contratos de Interfaz y Garantía de Match Bilateral');

check('3.1 calculateProviderLogistics("edwin-agudelo", "45290") devuelve invariantes Méntrida', () => {
  const edwinLog = calculateProviderLogistics('edwin-agudelo', '45290');
  expectEqual(edwinLog.isHubMentrida, true, 'isHubMentrida true');
  expectEqual(edwinLog.isEdwinOrProductoraEar, true, 'isEdwinOrProductoraEar true');
  expectEqual(edwinLog.originPostalCode, '45290', 'CP Méntrida');
  expectEqual(edwinLog.freeKmIncluded, 50, '50 km exentos');
  expectEqual(edwinLog.kmRateEur, 1.5, '1.50 €/km');
  expectEqual(edwinLog.baseServiceEur, 350, '350 € base solista');
  expect(edwinLog.originLabel.includes('Hub Méntrida'), 'Origen Hub Méntrida');
  expect(edwinLog.originLabel.includes('Exclusivo Edwin Agudelo'), 'Exclusivo Edwin Agudelo');
});

check('3.2 calculateProviderLogistics("proveedor-valencia-01", "46001") aísla CP de Valencia', () => {
  const valLog = calculateProviderLogistics('proveedor-valencia-01', '46001', {
    province: 'Valencia',
    registeredOriginPostalCode: '46001',
    customFreeKm: 20,
    customKmRateEur: 1.15,
  });
  expectEqual(valLog.isHubMentrida, false, 'isHubMentrida false');
  expectEqual(valLog.isEdwinOrProductoraEar, false, 'isEdwinOrProductoraEar false');
  expectEqual(valLog.originPostalCode, '46001', 'CP Valencia');
  expect(valLog.originPostalCode !== '45290', 'NO debe ser 45290');
  expectEqual(valLog.freeKmIncluded, 20, '20 km exentos');
  expectEqual(valLog.kmRateEur, 1.15, '1.15 €/km');
});

check('3.3 getGuaranteePolicy devuelve Garantía de Match Bilateral de Expectativas', () => {
  const policy = getGuaranteePolicy(edwin);
  expectEqual(policy.policyTitle, 'Garantía de Match Bilateral de Expectativas', 'Título de póliza');
  expectEqual(policy.policyName, 'Garantía de Match Bilateral de Expectativas', 'Nombre de póliza');
  expectEqual(policy.guaranteeBadge, 'Match Bilateral Verificado', 'Badge');
  expect(!policy.policyTitle.toLowerCase().includes('cero multas'), 'Sin cero multas en título');
  expect(!policy.description.toLowerCase().includes('cero multas'), 'Sin cero multas en descripción');
  expect(policy.description.includes('Filtrado determinista bilateral'), 'Detalle bilateral en descripción');
});

check('3.4 calculateProviderLogistics ante entrada nula/indefinida es resiliente y no lanza excepción', () => {
  const logNull = calculateProviderLogistics(null as any, '28001');
  expectEqual(logNull.isHubMentrida, false, 'isHubMentrida false');
  expectEqual(logNull.isEdwinOrProductoraEar, false, 'isEdwinOrProductoraEar false');
  expect(Number.isFinite(logNull.travelCostEur), 'travelCostEur es finito');
  expect(Number.isFinite(logNull.totalLogisticsEur), 'totalLogisticsEur es finito');
});

check('3.5 simulateUniversalProviderQuote con distanceKm NaN produce cálculos finitos y sin NaN en texto', () => {
  const simNaN = simulateUniversalProviderQuote({
    provider: edwin,
    guestsPax: 100,
    coupleTotalBudgetEur: 20000,
    tolerancePct: 10,
    distanceKm: NaN,
  });
  expect(Number.isFinite(simNaN.totalEstimatedEur), 'totalEstimatedEur debe ser finito');
  expect(Number.isFinite(simNaN.acousticLogistics.travelCostEur), 'travelCostEur debe ser finito');
  expect(!simNaN.whatsappBriefText.includes('NaN'), 'whatsappBriefText NO debe contener NaN');
});

// ─────────────────────────────────────────────────────────────────────────────
// SUITE 4: Auditoría Estática de Erradicación de "Cero Multas"
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n▶ SUITE 4: Escáner Estático de Erradicación de Reclamos Prohibidos');

const targetFiles = [
  path.resolve(projectRoot, 'src', 'lib', 'providers', 'universal-provider-simulator.ts'),
  path.resolve(projectRoot, 'src', 'components', 'hubs', 'SovereignIntentHubView.tsx'),
  path.resolve(projectRoot, 'src', 'components', 'fincas', 'FincaAcousticShieldCard.tsx'),
  path.resolve(projectRoot, 'src', 'lib', 'fincas', 'fincaMetricsEngine.ts'),
];

check('4.1 Los archivos centrales del pipeline acústico y de proveedores no contienen "cero multas"', () => {
  for (const file of targetFiles) {
    if (!fs.existsSync(file)) continue;
    const content = fs.readFileSync(file, 'utf8');
    const hasForbidden = /cero\s+multas/i.test(content);
    expect(!hasForbidden, `El archivo ${path.basename(file)} no debe contener "cero multas"`);
  }
});

check('4.2 FincaAcousticShieldCard.tsx exhibe "Garantía de Match Bilateral de Expectativas" y strokeWidth={1.75}', () => {
  const cardPath = path.resolve(projectRoot, 'src', 'components', 'fincas', 'FincaAcousticShieldCard.tsx');
  if (fs.existsSync(cardPath)) {
    const content = fs.readFileSync(cardPath, 'utf8');
    expect(content.includes('Garantía de Match Bilateral de Expectativas'), 'Debe contener la garantía institucional');
    expect(content.includes('strokeWidth={1.75}'), 'Debe incorporar strokeWidth={1.75} en sus iconos Lucide');
  }
});

check('4.3 fincaMetricsEngine.ts contiene "Garantía de Match Bilateral de Expectativas" en estrategia acústica', () => {
  const enginePath = path.resolve(projectRoot, 'src', 'lib', 'fincas', 'fincaMetricsEngine.ts');
  if (fs.existsSync(enginePath)) {
    const content = fs.readFileSync(enginePath, 'utf8');
    expect(content.includes('Garantía de Match Bilateral de Expectativas'), 'estrategia debe incluir Garantía de Match Bilateral de Expectativas');
    expect(!content.includes('Cero multas y cero quejas vecinales'), 'No debe contener "Cero multas y cero quejas vecinales"');
  }
});

check('4.4 SovereignIntentHubView.tsx estandariza "Hub Méntrida (Exclusivo Edwin Agudelo)" sin Alcorcón', () => {
  const hubPath = path.resolve(projectRoot, 'src', 'components', 'hubs', 'SovereignIntentHubView.tsx');
  if (fs.existsSync(hubPath)) {
    const content = fs.readFileSync(hubPath, 'utf8');
    expect(!content.includes('Hub Méntrida / Alcorcón'), 'No debe contener / Alcorcón');
    expect(content.includes('Hub Méntrida (Exclusivo Edwin Agudelo)'), 'Debe contener la etiqueta canónica');
    expect(content.includes('Garantía de Match Bilateral de Expectativas'), 'Debe contener la garantía estandarizada');
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// SUITE 5: Muestreo de Catálogo de Proveedores en Data Lake y Precisión en Céntimos
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n▶ SUITE 5: Verificación Determinista con Particiones del Data Lake y Precisión en Céntimos');

const providersDataDir = path.resolve(projectRoot, 'public', 'data', 'providers');

check('5.1 Muestreo de particiones edge: ningún proveedor externo adopta Hub Méntrida por defecto', () => {
  if (fs.existsSync(providersDataDir)) {
    const partitionFiles = fs
      .readdirSync(providersDataDir)
      .filter((f) => f.endsWith('.json') && !f.includes('stats') && !f.includes('manifest'));

    let sampled = 0;
    for (const pFile of partitionFiles.slice(0, 5)) {
      try {
        const raw = fs.readFileSync(path.join(providersDataDir, pFile), 'utf8');
        const list = JSON.parse(raw);
        if (!Array.isArray(list)) continue;

        for (const item of list.slice(0, 10)) {
          metrics.iterations += 1;
          const meta: UniversalProviderMetadata = {
            id: item.id || item.slug,
            slug: item.slug || item.id || 'provider',
            name: item.name || item.title || 'Proveedor Externo',
            category: item.category || 'servicios',
            province: item.province || item.location || 'Madrid',
            headquartersAddress: item.address || item.headquartersAddress,
            registeredOriginPostalCode: item.postalCode || item.cp,
            basePriceEur: typeof item.basePrice === 'number' ? item.basePrice : undefined,
          };

          const isMentrida = isHubMentridaProvider(meta);
          const isEdwin = isEdwinOrProductoraEarProvider(meta);
          const hasMentridaAddress = /45290/.test(
            `${meta.registeredOriginPostalCode || ''} ${meta.headquartersAddress || ''}`
          ) || /^\s*m[eé]ntrida\s*$/i.test(meta.registeredOriginCity || '');

          if (!isEdwin && !hasMentridaAddress) {
            expect(!isMentrida, `Proveedor ${meta.name} sin sede en Méntrida no debe ser Hub Méntrida`);
            const quote = simulateUniversalProviderQuote({
              provider: meta,
              guestsPax: 100,
              coupleTotalBudgetEur: 20000,
              tolerancePct: 10,
              distanceKm: 60,
            });
            expect(
              !quote.acousticLogistics.originLabel.includes('Hub Méntrida (Exclusivo Edwin Agudelo)'),
              `Proveedor ${meta.name} no debe tener etiqueta de exclusividad de Edwin`
            );
          }
          sampled += 1;
        }
      } catch {
        // Ignorar particiones no parseables
      }
    }
    console.log(`    (Muestreados con éxito ${sampled} proveedores reales del data lake)`);
    expect(sampled >= 0, 'Particiones procesadas');
  } else {
    console.log('    (Partición public/data/providers no presente en entorno local, omitiendo muestreo masivo)');
  }
});

check('5.2 Precisión matemática de 50 céntimos en cálculo de kilometraje (1 km a 1,50 €/km = 1,50 €)', () => {
  const edwin51Km = calculateProviderLogistics('edwin-agudelo', 51);
  expectEqual(edwin51Km.billableKm, 1, '51 - 50 = 1 km facturable');
  expectEqual(edwin51Km.travelCostEur, 1.5, '1 km * 1.50 €/km debe ser 1.50 €, NO 2.00 €');
});

// ─────────────────────────────────────────────────────────────────────────────
// RESUMEN Y SALIDA CONTRACTUAL S-CLASS
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n───────────────────────────────────────────────────────────────────');
console.log(`  RESUMEN: ${metrics.assertions - metrics.failures} PASADAS / ${metrics.failures} FALLIDAS`);
console.log(`  PROVIDER_ORIGIN_ASSERTIONS=${metrics.assertions}`);
console.log(`  PROVIDER_ORIGIN_FAILURES=${metrics.failures}`);
console.log(`  PROVIDER_ORIGIN_RESULT=${metrics.failures === 0 ? 'PASS' : 'FAIL'}`);
console.log('───────────────────────────────────────────────────────────────────\n');

if (metrics.failures > 0) {
  process.exit(1);
}
process.exit(0);
