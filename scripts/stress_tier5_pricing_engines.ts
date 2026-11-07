/**
 * ════════════════════════════════════════════════════════════════════════════
 * FINCAS B2B ESCAPARATE — TIER 5 ADVERSARIAL COVERAGE HARDENING & STRESS SUITE
 * ════════════════════════════════════════════════════════════════════════════
 * White-box adversarial testing suite targeting:
 *  - fincaMenuPricingEngine.ts
 *  - fincaMenus2026Catalog.ts
 *  - fincaMetricsEngine.ts
 *  - fincaTerritorialSchema.ts
 *
 * Attack Vectors & Stress Probes:
 *  1. Numerical safety: NaN, Infinity, -Infinity, negative, float decimals, zero, overflows.
 *  2. Boundary conditions: guest count (0, 1, 150, 2000, 100000), km (0, 49, 50, 51, 200, 201).
 *  3. Closing hours & hotel threshold: early morning (03:00, 04:00) vs normal hours vs edge values.
 *  4. Duplicate / bogus extras, non-existent menu IDs, malformed inputs.
 *  5. Integer cents preservation & Split Soberano 80/10/10 exact cent conservation across 10,000 values.
 *  6. Affiliate commission range clamping [0.10, 0.15] and isolation to EAR OS margin.
 *  7. Acoustic rider power scaling (12 W/pax) and hardware tier resolution.
 *  8. Spanish phone verification, E.164 normalization, and Contact-Gate privacy masking.
 *  9. Territorial hub routing (Méntrida Hub vs Red Nacional) & schema.org JSON-LD integrity.
 *
 * Canonic Execution:
 *   npx tsx scripts/stress_tier5_pricing_engines.ts
 * ════════════════════════════════════════════════════════════════════════════
 */

import {
  calculateFincaEventPricing,
  distributeSplitSoberano,
  eurToCents,
  centsToEur,
  formatCentsEur,
  isHotelRequired,
  normalizeAffiliateRate,
  resolveAcousticSystem,
  FincaPricingEngineError,
  type FincaMenuPricingInput,
} from '../src/lib/fincas/fincaMenuPricingEngine';

import {
  FINCA_BODA_MENUS_2026,
  FINCA_EXTRAS_2026,
  ALL_FINCA_MENUS_2026,
  getFincaMenuById,
  getFincaExtraById,
  validateFincaCatalogIntegrity,
  isFincaBodaMenuId,
  isFincaMenuId,
  isFincaExtraId,
} from '../src/lib/fincas/fincaMenus2026Catalog';

import {
  calculateFounderFeeMatch,
  calculateLifetimePortalSavings,
  costeLogisticaMentrida,
  calcularRiderAcustico,
  PACTO_100_FUNDADORES_SSOT,
} from '../src/lib/fincas/fincaMetricsEngine';

import {
  isVerifiableSpanishPhone,
  verifyVenueTelephone,
  maskPhoneForContactGate,
  isHubMentridaTerritory,
  formatTerritorialDeclaration,
  resolveTerritorialLogistics,
  generateFincaEventVenueSchema,
  generateFincasCatalogItemListSchema,
  generateFincasLandingSchema,
  serializeSchemaToJsonLd,
} from '../src/lib/fincas/fincaTerritorialSchema';

import { SCLASS_12_FINCAS_HOMOLOGADAS } from '../src/lib/constants/fincas-catalog';
import { CENTRALITA_EAR_OS, TARIFA_BASE_SOLISTA_EUR } from '../src/lib/constants/ear-os-ssot';

// ── UTILITIES DE ASERCIÓN Y TRACKING ─────────────────────────────────────────

interface StressTestResult {
  section: string;
  name: string;
  passed: boolean;
  assertions: number;
  durationMs: number;
  error?: string;
}

class StressHarness {
  private results: StressTestResult[] = [];
  private currentSection = '';
  private currentName = '';
  private assertionCount = 0;
  private startTime = 0;

  startSection(section: string): void {
    this.currentSection = section;
    console.log(`\n── ${section} ──`);
  }

  test(name: string, fn: () => void): void {
    this.currentName = name;
    this.assertionCount = 0;
    this.startTime = Date.now();
    try {
      fn();
      const durationMs = Date.now() - this.startTime;
      this.results.push({
        section: this.currentSection,
        name,
        passed: true,
        assertions: this.assertionCount,
        durationMs,
      });
      console.log(`  ✔ [PASS] ${name} (${this.assertionCount} assertions, ${durationMs}ms)`);
    } catch (err: unknown) {
      const durationMs = Date.now() - this.startTime;
      const errorMsg = err instanceof Error ? err.stack || err.message : String(err);
      this.results.push({
        section: this.currentSection,
        name,
        passed: false,
        assertions: this.assertionCount,
        durationMs,
        error: errorMsg,
      });
      console.error(`  ✖ [FAIL] ${name} (${this.assertionCount} assertions, ${durationMs}ms)`);
      console.error(`      └─ ${errorMsg}`);
    }
  }

  assert(condition: boolean, message: string): void {
    this.assertionCount++;
    if (!condition) {
      throw new Error(`Assertion failed: ${message}`);
    }
  }

  assertEqual<T>(actual: T, expected: T, message: string): void {
    this.assertionCount++;
    if (actual !== expected) {
      throw new Error(`Expected ${String(expected)}, got ${String(actual)}: ${message}`);
    }
  }

  assertThrows(fn: () => void, expectedCodeOrType?: string | RegExp): void {
    this.assertionCount++;
    let threw = false;
    try {
      fn();
    } catch (err: unknown) {
      threw = true;
      if (expectedCodeOrType && err instanceof FincaPricingEngineError) {
        if (typeof expectedCodeOrType === 'string' && err.code !== expectedCodeOrType) {
          throw new Error(`Expected error code ${expectedCodeOrType}, got ${err.code}`);
        }
      } else if (expectedCodeOrType instanceof RegExp && err instanceof Error) {
        if (!expectedCodeOrType.test(err.message)) {
          throw new Error(`Error message "${err.message}" did not match pattern ${expectedCodeOrType}`);
        }
      }
    }
    if (!threw) {
      throw new Error(`Expected function to throw, but it returned normally.`);
    }
  }

  getSummary(): { total: number; pass: number; fail: number; totalAssertions: number; durationMs: number } {
    const total = this.results.length;
    const pass = this.results.filter((r) => r.passed).length;
    const fail = total - pass;
    const totalAssertions = this.results.reduce((acc, r) => acc + r.assertions, 0);
    const durationMs = this.results.reduce((acc, r) => acc + r.durationMs, 0);
    return { total, pass, fail, totalAssertions, durationMs };
  }
}

// ── EJECUCIÓN DEL ARNÉS ADVERSARIAL TIER 5 ───────────────────────────────────

export function runTier5StressTests(): { pass: boolean; summary: ReturnType<StressHarness['getSummary']> } {
  const h = new StressHarness();

  console.log('╔══════════════════════════════════════════════════════════════════════╗');
  console.log('║       TIER 5 ADVERSARIAL STRESS SUITE: CORE ENGINES & SCHEMAS        ║');
  console.log('║       WHITE-BOX ATTACK VECTORS · INVARIANTS · NUMERICAL HARDENING    ║');
  console.log('╚══════════════════════════════════════════════════════════════════════╝');

  // ───────────────────────────────────────────────────────────────────────────
  // CATEGORÍA 1: CATÁLOGO SSOT & INTEGRIDAD FINANCIERA (ZONA CERO)
  // ───────────────────────────────────────────────────────────────────────────
  h.startSection('1. SSOT Catalog Integrity & Immutability Probes');

  h.test('Validación estricta del catálogo canónico 2026', () => {
    const report = validateFincaCatalogIntegrity();
    h.assert(report.isValid, `Catálogo inválido con errores: ${report.errors.join(', ')}`);
    h.assertEqual(report.menuCount, 13, 'Debe haber 13 menús totales en catálogo');
    h.assertEqual(report.extraCount, 16, 'Debe haber exactamente 16 extras');
    h.assertEqual(FINCA_BODA_MENUS_2026.length, 7, 'Exactamente 7 menús de boda');
  });

  h.test('Invariante canónico: Tarifa Base Solista Edwin Agudelo = 350.00 €', () => {
    const solistaExtra = getFincaExtraById('solista-edwin');
    h.assert(solistaExtra !== undefined, 'solista-edwin debe existir');
    h.assertEqual(solistaExtra!.priceEur, TARIFA_BASE_SOLISTA_EUR, 'priceEur debe ser 350.00 €');
    h.assertEqual(solistaExtra!.priceCents, 35000, 'priceCents debe ser 35.000 céntimos');
    h.assertEqual(solistaExtra!.isPerPax, false, 'Tarifa del solista es precio fijo, no por comensal');
  });

  h.test('Type guards y mapas O(1) de búsqueda', () => {
    h.assert(isFincaBodaMenuId('boda-cantabrico'), 'boda-cantabrico es boda');
    h.assert(isFincaBodaMenuId('boda-caserio-beko'), 'boda-caserio-beko es boda');
    h.assert(!isFincaBodaMenuId('comunion-paloma'), 'comunion-paloma no es boda');
    h.assert(!isFincaBodaMenuId('fake-id'), 'fake-id no es boda');

    h.assert(isFincaMenuId('comunion-gorbea'), 'comunion-gorbea es menú');
    h.assert(isFincaMenuId('grupo-menu1'), 'grupo-menu1 es menú');
    h.assert(!isFincaMenuId('non-existent-menu'), 'non-existent-menu no es menú');

    h.assert(isFincaExtraId('barra-libre-extra'), 'barra-libre-extra es extra');
    h.assert(isFincaExtraId('photocall'), 'photocall es extra');
    h.assert(!isFincaExtraId('extra-fantasma'), 'extra-fantasma no es extra');
  });

  // ───────────────────────────────────────────────────────────────────────────
  // CATEGORÍA 2: MOTOR FINANCIERO — INYECCIÓN DE VALORES EXTREMOS Y NAN/INFINITY
  // ───────────────────────────────────────────────────────────────────────────
  h.startSection('2. Adversarial Numerical Injections (NaN, Infinity, Negatives, Floats)');

  h.test('eurToCents rechaza NaN, Infinity, -Infinity y valores negativos', () => {
    h.assertThrows(() => eurToCents(NaN), 'INVALID_COMMISSION_RATE');
    h.assertThrows(() => eurToCents(Infinity), 'INVALID_COMMISSION_RATE');
    h.assertThrows(() => eurToCents(-Infinity), 'INVALID_COMMISSION_RATE');
    h.assertThrows(() => eurToCents(-10), 'INVALID_COMMISSION_RATE');
    h.assertThrows(() => eurToCents(-0.01), 'INVALID_COMMISSION_RATE');

    h.assertEqual(eurToCents(0), 0, '0 € -> 0 céntimos');
    h.assertEqual(eurToCents(100), 10000, '100 € -> 10.000 céntimos');
    h.assertEqual(eurToCents(123.45), 12345, '123.45 € -> 12.345 céntimos');
    h.assertEqual(eurToCents(123.456), 12346, 'Redondeo banquero al céntimo más cercano');
  });

  h.test('calculateFincaEventPricing rechaza guestCount inválido (NaN, Infinity, <= 0, floats < 1)', () => {
    const baseInput: FincaMenuPricingInput = {
      menuId: 'boda-cantabrico',
      guestCount: 100,
      selectedExtraIds: [],
      distanceKm: 0,
    };

    h.assertThrows(() => calculateFincaEventPricing({ ...baseInput, guestCount: NaN }), 'INVALID_GUEST_COUNT');
    h.assertThrows(() => calculateFincaEventPricing({ ...baseInput, guestCount: Infinity }), 'INVALID_GUEST_COUNT');
    h.assertThrows(() => calculateFincaEventPricing({ ...baseInput, guestCount: -Infinity }), 'INVALID_GUEST_COUNT');
    h.assertThrows(() => calculateFincaEventPricing({ ...baseInput, guestCount: 0 }), 'INVALID_GUEST_COUNT');
    h.assertThrows(() => calculateFincaEventPricing({ ...baseInput, guestCount: -50 }), 'INVALID_GUEST_COUNT');
    h.assertThrows(() => calculateFincaEventPricing({ ...baseInput, guestCount: 0.99 }), 'INVALID_GUEST_COUNT');

    // Mínimo comensal válido = 1
    const res1 = calculateFincaEventPricing({ ...baseInput, guestCount: 1 });
    h.assertEqual(res1.metadata.guestCount, 1, 'guestCount = 1 debe ser admitido');
    h.assertEqual(res1.menuTotalCents, 10000, '1 comensal * 100.00 € = 10.000 céntimos');

    // Flotante válido > 1 (e.g. 150.7 se trunca a 150)
    const resFloat = calculateFincaEventPricing({ ...baseInput, guestCount: 150.7 });
    h.assertEqual(resFloat.metadata.guestCount, 150, '150.7 se trunca a 150 comensales');
  });

  h.test('calculateFincaEventPricing normaliza distancias hostiles (NaN, Infinity, negativos)', () => {
    const baseInput: FincaMenuPricingInput = {
      menuId: 'boda-cantabrico',
      guestCount: 100,
      selectedExtraIds: [],
      distanceKm: 0,
    };

    // NaN en distancia debe normalizarse a 0 sin romper el cálculo
    const resNaN = calculateFincaEventPricing({ ...baseInput, distanceKm: NaN });
    h.assertEqual(resNaN.metadata.billableKm, 0, 'NaN distancia -> 0 billable km');
    h.assertEqual(resNaN.logisticsKmCents, 0, '0 km de coste logístico');

    // Negativo en distancia se normaliza a 0
    const resNeg = calculateFincaEventPricing({ ...baseInput, distanceKm: -150 });
    h.assertEqual(resNeg.metadata.billableKm, 0, 'Distancia negativa -> 0 billable km');
    h.assertEqual(resNeg.logisticsKmCents, 0, '0 km de coste');

    // Infinity en distancia se normaliza a 0 de forma segura
    const resInf = calculateFincaEventPricing({ ...baseInput, distanceKm: Infinity });
    h.assertEqual(resInf.metadata.billableKm, 0, 'Infinity normalizado a 0');
  });

  h.test('calculateFincaEventPricing rechaza IDs de menú inexistentes o maliciosos', () => {
    const baseInput: FincaMenuPricingInput = {
      menuId: 'boda-cantabrico',
      guestCount: 100,
      selectedExtraIds: [],
      distanceKm: 0,
    };

    h.assertThrows(() => calculateFincaEventPricing({ ...baseInput, menuId: '' }), 'MENU_NOT_FOUND');
    h.assertThrows(() => calculateFincaEventPricing({ ...baseInput, menuId: 'fake-menu-id' }), 'MENU_NOT_FOUND');
    h.assertThrows(() => calculateFincaEventPricing({ ...baseInput, menuId: '__proto__' }), 'MENU_NOT_FOUND');
    h.assertThrows(() => calculateFincaEventPricing({ ...baseInput, menuId: 'null' }), 'MENU_NOT_FOUND');
    h.assertThrows(() => calculateFincaEventPricing({ ...baseInput, menuId: 'DROP TABLE MENUS;' }), 'MENU_NOT_FOUND');
  });

  // ───────────────────────────────────────────────────────────────────────────
  // CATEGORÍA 3: UMBRALES DE LOGÍSTICA, KM EXENTOS Y SUPLEMENTO HOTELERO
  // ───────────────────────────────────────────────────────────────────────────
  h.startSection('3. Logistics Thresholds & Boundary Probes (Km, Hotel & Hours)');

  h.test('Límites exactos de km exentos (0, 49, 50, 51 km)', () => {
    const runAtDistance = (km: number) =>
      calculateFincaEventPricing({
        menuId: 'boda-cantabrico',
        guestCount: 10,
        selectedExtraIds: [],
        distanceKm: km,
      });

    // 0 km: 0 facturables
    const r0 = runAtDistance(0);
    h.assertEqual(r0.metadata.billableKm, 0, '0 km -> 0 facturables');
    h.assertEqual(r0.logisticsKmCents, 0, '0 céntimos');

    // 49 km: dentro del radio exento de 50 km
    const r49 = runAtDistance(49);
    h.assertEqual(r49.metadata.billableKm, 0, '49 km -> 0 facturables');
    h.assertEqual(r49.logisticsKmCents, 0, '0 céntimos');

    // 50 km: límite exacto exento
    const r50 = runAtDistance(50);
    h.assertEqual(r50.metadata.billableKm, 0, '50 km -> 0 facturables');
    h.assertEqual(r50.logisticsKmCents, 0, '0 céntimos');

    // 51 km: 1 km facturable a 1,50 € (150 céntimos)
    const r51 = runAtDistance(51);
    h.assertEqual(r51.metadata.billableKm, 1, '51 km -> 1 km facturable');
    h.assertEqual(r51.logisticsKmCents, 150, '150 céntimos de logística');

    // 100 km: 50 km facturables a 1,50 € = 75,00 € (7.500 céntimos)
    const r100 = runAtDistance(100);
    h.assertEqual(r100.metadata.billableKm, 50, '100 km -> 50 km facturables');
    h.assertEqual(r100.logisticsKmCents, 7500, '7.500 céntimos de logística');
  });

  h.test('Límites de suplemento de hotel por distancia (200 km vs 201 km)', () => {
    // 200 km: exactamente en el umbral, NO requiere hotel
    h.assert(!isHotelRequired(200), '200 km exactos no requiere hotel');
    const r200 = calculateFincaEventPricing({
      menuId: 'boda-cantabrico',
      guestCount: 50,
      selectedExtraIds: [],
      distanceKm: 200,
    });
    h.assertEqual(r200.metadata.hotelRequired, false, 'hotelRequired false a 200 km');
    h.assertEqual(r200.logisticsHotelCents, 0, '0 céntimos de hotel');

    // 201 km: supera los 200 km, REQUIERE hotel (120,00 € = 12.000 céntimos)
    h.assert(isHotelRequired(201), '201 km requiere hotel');
    const r201 = calculateFincaEventPricing({
      menuId: 'boda-cantabrico',
      guestCount: 50,
      selectedExtraIds: [],
      distanceKm: 201,
    });
    h.assertEqual(r201.metadata.hotelRequired, true, 'hotelRequired true a 201 km');
    h.assertEqual(r201.logisticsHotelCents, 12000, '12.000 céntimos de hotel');
  });

  h.test('Límites de suplemento de hotel por hora de finalización (02:59, 03:00, 04:30, 12:00, 23:00)', () => {
    // 02:59 AM -> NO hotel
    h.assert(!isHotelRequired(100, '02:59'), '02:59 no requiere hotel');

    // 03:00 AM -> SÍ hotel (madrugada HORA_FIN_HOTEL = 3)
    h.assert(isHotelRequired(100, '03:00'), '03:00 requiere hotel');

    // 04:30 AM -> SÍ hotel
    h.assert(isHotelRequired(100, '04:30'), '04:30 requiere hotel');

    // 06:00 AM -> SÍ hotel
    h.assert(isHotelRequired(100, '06:00'), '06:00 requiere hotel');

    // 12:00 PM (mediodía) -> NO hotel
    h.assert(!isHotelRequired(100, '12:00'), '12:00 no requiere hotel');

    // 23:00 (noche normal) -> NO hotel
    h.assert(!isHotelRequired(100, '23:00'), '23:00 no requiere hotel');

    // Malformaciones de formato de hora: maneja con resiliencia sin lanzar excepción
    h.assert(!isHotelRequired(100, 'not-a-time'), 'Texto no horario no lanza error');
    h.assert(!isHotelRequired(100, ''), 'Hora vacía no lanza error');
    h.assert(isHotelRequired(100, ' 03:30 '), 'Hora con espacios se procesa limpiamente');
  });

  // ───────────────────────────────────────────────────────────────────────────
  // CATEGORÍA 4: COMPLEMENTOS — DEDUPLICACIÓN, PER-PAX VS FIJOS, ID HOSTILES
  // ───────────────────────────────────────────────────────────────────────────
  h.startSection('4. Extras & Complementos Deduplication and Pricing Semantics');

  h.test('Deduplicación atómica de extras idénticos', () => {
    // Si el usuario envía el mismo ID 5 veces, solo debe contabilizarse una vez
    const res = calculateFincaEventPricing({
      menuId: 'boda-cantabrico',
      guestCount: 100,
      selectedExtraIds: [
        'barra-libre-extra',
        'barra-libre-extra',
        'barra-libre-extra',
        'solista-edwin',
        'solista-edwin',
      ],
      distanceKm: 0,
    });

    h.assertEqual(res.metadata.extrasBreakdown.length, 2, 'Deben existir solo 2 extras desglosados');

    // barra-libre-extra: 15 € * 100 pax = 1.500 € = 150.000 céntimos
    // solista-edwin: 350 € fijo = 35.000 céntimos
    // Total extras = 185.000 céntimos
    h.assertEqual(res.extrasTotalCents, 185000, 'Total extras sin duplicación = 185.000 céntimos');
  });

  h.test('Omisión transparente de IDs de extra desconocidos sin corromper el cálculo', () => {
    const res = calculateFincaEventPricing({
      menuId: 'boda-cantabrico',
      guestCount: 100,
      selectedExtraIds: ['extra-inventado-1', 'solista-edwin', 'hack-extra-2'],
      distanceKm: 0,
    });

    h.assertEqual(res.metadata.extrasBreakdown.length, 1, 'Solo 1 extra válido reconocido');
    h.assertEqual(res.extrasTotalCents, 35000, 'Coste exacto de solista-edwin');
  });

  h.test('Selección masiva de los 16 extras simultáneos (Stress combinatorio)', () => {
    const allExtraIds = FINCA_EXTRAS_2026.map((e) => e.id);
    const guests = 150;

    const res = calculateFincaEventPricing({
      menuId: 'boda-vasco',
      guestCount: guests,
      selectedExtraIds: allExtraIds,
      distanceKm: 250, // Requiere hotel y km
      eventEndTime: '04:00',
    });

    // Validar suma analítica de extras
    let expectedExtrasCents = 0;
    for (const extra of FINCA_EXTRAS_2026) {
      expectedExtrasCents += extra.isPerPax ? extra.priceCents * guests : extra.priceCents;
    }

    h.assertEqual(res.extrasTotalCents, expectedExtrasCents, 'Suma de 16 extras exacta');
    h.assertEqual(res.metadata.extrasBreakdown.length, 16, '16 extras desglosados');
    h.assert(res.subtotalCents > res.menuTotalCents, 'Subtotal coherente');
    h.assertEqual(
      res.totalWithIvaCents,
      res.subtotalCents + res.ivaCents,
      'totalWithIvaCents = subtotal + IVA',
    );
  });

  // ───────────────────────────────────────────────────────────────────────────
  // CATEGORÍA 5: REPARTO SPLIT SOBERANO 80/10/10 — CONSERVACIÓN ESTOCÁSTICA DE CÉNTIMOS
  // ───────────────────────────────────────────────────────────────────────────
  h.startSection('5. Sovereign Split 80/10/10 Largest-Remainder Cent Invariance');

  h.test('Conservación exacta al céntimo en rango continuo [1 .. 10.000 céntimos] (10.000 iteraciones)', () => {
    for (let c = 1; c <= 10000; c++) {
      const split = distributeSplitSoberano(c);
      const sum = split.artistaCents + split.earOsCents + split.vimumeCents;
      if (sum !== c) {
        h.assert(false, `Fallo de conservación en ${c} céntimos: suma = ${sum}`);
      }

      // Comprobar tolerancias del 80%, 10%, 10%
      const minArtista = Math.floor(c * 0.8);
      const maxArtista = Math.ceil(c * 0.8);
      if (split.artistaCents < minArtista || split.artistaCents > maxArtista) {
        h.assert(false, `Artista fuera de rango en ${c} céntimos: ${split.artistaCents}`);
      }
    }
    h.assert(true, '10.000 iteraciones deterministas consecutivas verificadas sin pérdida de céntimo');
  });

  h.test('Conservación en 5.000 subtotales pseudo-aleatorios LCG (hasta 500.000 €)', () => {
    // Generador congruencial lineal con semilla fija para determinismo estricto
    let seed = 42;
    const lcg = () => {
      seed = (seed * 1664525 + 1013904223) % 4294967296;
      return seed / 4294967296;
    };

    for (let i = 0; i < 5000; i++) {
      // Subtotales entre 10 € (1.000 céntimos) y 500.000 € (50.000.000 céntimos)
      const randomCents = Math.floor(lcg() * 50000000) + 1000;
      const split = distributeSplitSoberano(randomCents);
      const sum = split.artistaCents + split.earOsCents + split.vimumeCents;
      if (sum !== randomCents) {
        h.assert(false, `Fallo de conservación en randomCents ${randomCents}: suma = ${sum}`);
      }
    }
    h.assert(true, '5.000 muestras aleatorias grandes conservan la suma exacta al céntimo');
  });

  h.test('Blindaje del 80% del Artista y 10% de VIMUME frente a comisiones de afiliado', () => {
    const res = calculateFincaEventPricing({
      menuId: 'boda-imperial',
      guestCount: 150,
      selectedExtraIds: ['solista-edwin'],
      distanceKm: 80,
      affiliateCommissionPct: 0.15, // Máxima comisión (15%)
    });

    // Invariante de negocio SSOT §4:
    // La comisión de afiliado se detrae EXCLUSIVAMENTE del 10% de EAR OS (split.earOsCents).
    // El artista (80%) y VIMUME (10%) permanecen íntegros e inalterables.
    const split = res.split;
    h.assertEqual(
      split.artistaCents + split.earOsCents + split.vimumeCents,
      res.subtotalCents,
      'Split suma exacto al subtotal',
    );

    // La comisión de afiliado es el 15% de split.earOsCents
    const expectedCommission = Math.round(split.earOsCents * 0.15);
    h.assertEqual(res.affiliateCommissionCents, expectedCommission, 'Comisión calculada sobre cuota EAR OS');

    // Margen neto de EAR OS
    h.assertEqual(
      res.metadata.earOsNetAfterCommissionCents,
      split.earOsCents - res.affiliateCommissionCents,
      'Margen neto EAR OS = margen bruto - comisión',
    );
    h.assert(res.metadata.earOsNetAfterCommissionCents > 0, 'EAR OS mantiene margen positivo');
  });

  // ───────────────────────────────────────────────────────────────────────────
  // CATEGORÍA 6: NORMALIZACIÓN DE COMISIONES DE AFILIADO
  // ───────────────────────────────────────────────────────────────────────────
  h.startSection('6. Affiliate Commission Rate Normalization & Clamping Probes');

  h.test('Clamping estricto de porcentaje de comisión en rango [0.10, 0.15]', () => {
    // Indefinidos o NaN devuelven mínimo 0.10
    h.assertEqual(normalizeAffiliateRate(undefined), 0.10, 'undefined -> 0.10');
    h.assertEqual(normalizeAffiliateRate(NaN), 0.10, 'NaN -> 0.10');
    h.assertEqual(normalizeAffiliateRate(Infinity), 0.10, 'Infinity -> 0.10');

    // Por debajo del mínimo (0.10)
    h.assertEqual(normalizeAffiliateRate(-0.5), 0.10, 'Negativo -> 0.10');
    h.assertEqual(normalizeAffiliateRate(0.0), 0.10, '0% -> 0.10');
    h.assertEqual(normalizeAffiliateRate(0.05), 0.10, '5% -> 0.10');

    // Dentro del rango válido en formato decimal
    h.assertEqual(normalizeAffiliateRate(0.10), 0.10, '0.10 exacto');
    h.assertEqual(normalizeAffiliateRate(0.125), 0.125, '0.125 intermedio');
    h.assertEqual(normalizeAffiliateRate(0.15), 0.15, '0.15 exacto');

    // Por encima del máximo (0.15)
    h.assertEqual(normalizeAffiliateRate(0.20), 0.15, '20% -> 0.15');
    h.assertEqual(normalizeAffiliateRate(0.50), 0.15, '50% -> 0.15');

    // Formato porcentaje entero (10 a 15)
    h.assertEqual(normalizeAffiliateRate(10), 0.10, '10% entero -> 0.10');
    h.assertEqual(normalizeAffiliateRate(12), 0.12, '12% entero -> 0.12');
    h.assertEqual(normalizeAffiliateRate(15), 0.15, '15% entero -> 0.15');
    h.assertEqual(normalizeAffiliateRate(25), 0.15, '25% entero -> 0.15');
  });

  // ───────────────────────────────────────────────────────────────────────────
  // CATEGORÍA 7: RIDER ACÚSTICO Y POTENCIA RMS LEY 37/2003
  // ───────────────────────────────────────────────────────────────────────────
  h.startSection('7. Acoustic Shielding & RMS System Sizing Probes');

  h.test('Escalado de potencia RMS (12 W/pax) y límites de salud pública (<= 75 dB SPL)', () => {
    // 50 pax -> 600W -> Bose S1 Pro
    const r50 = calculateFincaEventPricing({
      menuId: 'boda-cantabrico',
      guestCount: 50,
      selectedExtraIds: [],
      distanceKm: 10,
    });
    h.assertEqual(r50.acousticRider.recommendedWatts, 600, '50 pax * 12 W = 600 W');
    h.assertEqual(r50.acousticRider.maxDbSpl, 75, 'Límite legal 75 dB');
    h.assert(r50.acousticRider.isCompliant, 'Cumple normativa de salud pública');
    h.assert(r50.acousticRider.systemRecommended.includes('Bose S1 Pro'), 'Bose S1 Pro asignado');

    // 150 pax -> 1.800W -> Bose F1 Model 812 Dual Column
    const r150 = calculateFincaEventPricing({
      menuId: 'boda-cantabrico',
      guestCount: 150,
      selectedExtraIds: [],
      distanceKm: 10,
    });
    h.assertEqual(r150.acousticRider.recommendedWatts, 1800, '150 pax * 12 W = 1.800 W');
    h.assert(r150.acousticRider.systemRecommended.includes('Bose F1 Model 812'), 'Bose F1 Model 812 asignado');

    // 250 pax -> 3.000W -> Bose F1 Quad Array + Limitador Cesva
    const r250 = calculateFincaEventPricing({
      menuId: 'boda-cantabrico',
      guestCount: 250,
      selectedExtraIds: [],
      distanceKm: 10,
    });
    h.assertEqual(r250.acousticRider.recommendedWatts, 3000, '250 pax * 12 W = 3.000 W');
    h.assert(r250.acousticRider.systemRecommended.includes('Cesva'), 'Limitador Cesva asignado');
  });

  // ───────────────────────────────────────────────────────────────────────────
  // CATEGORÍA 8: FINCAMETRICSEngine — PACTO 100 FUNDADORES Y SIMULADOR LIFETIME
  // ───────────────────────────────────────────────────────────────────────────
  h.startSection('8. FincaMetricsEngine: Founder Fee Match & Lifetime Savings');

  h.test('Pacto de los 100 Fundadores: gestión de cupo [0 .. 100] y Price-Match', () => {
    // Finca con cuota anterior 200 €/mes y 42 fundadores inscritos
    const match42 = calculateFounderFeeMatch(200, { currentFoundersEnrolled: 42 });
    h.assertEqual(match42.eligibleForFounderPact, true, 'Elegible con 42 inscritos');
    h.assertEqual(match42.founderSlotNumber, 43, 'Plaza asignada nº 43');
    h.assertEqual(match42.remainingSlots, 58, '58 plazas restantes');
    h.assertEqual(match42.matchedMonthlyFeeEur, 200, 'Price-match mensual 200 €');
    h.assertEqual(match42.matchedAnnualFeeEur, 2400, 'Price-match anual 2.400 €');
    h.assertEqual(match42.matchedMonthlyFeeCents, 20000, '20.000 céntimos mensuales');
    h.assertEqual(match42.lifetimePriceLock, true, 'Blindaje vitalicio');

    // Cupo agotado (100 fundadores inscritos)
    const match100 = calculateFounderFeeMatch(200, { currentFoundersEnrolled: 100 });
    h.assertEqual(match100.eligibleForFounderPact, false, 'No elegible: cupo lleno');
    h.assertEqual(match100.founderSlotNumber, null, 'Sin plaza asignada');
    h.assertEqual(match100.remainingSlots, 0, '0 plazas restantes');
    h.assertEqual(match100.lifetimePriceLock, false, 'Sin blindaje vitalicio');

    // Cuota anterior <= 0 se normaliza al defecto (250 €)
    const matchZero = calculateFounderFeeMatch(0);
    h.assertEqual(matchZero.matchedMonthlyFeeEur, PACTO_100_FUNDADORES_SSOT.CUOTA_MENSUAL_DEFECTO_PORTAL_EUR, 'Defecto 250 €');

    // Cuota menor a 50 € se eleva al mínimo canónico (50 €)
    const matchLow = calculateFounderFeeMatch(20);
    h.assertEqual(matchLow.matchedMonthlyFeeEur, PACTO_100_FUNDADORES_SSOT.CUOTA_MENSUAL_MINIMA_MATCH_EUR, 'Mínimo 50 €');
  });

  h.test('Simulación de ahorros vitalicios a 5 años sin inflación en EAR OS vs 6% anual en portales', () => {
    const savings = calculateLifetimePortalSavings({
      previousFeeMonthlyEur: 250,
      horizonYears: 5,
      annualWeddings: 20,
    });

    h.assertEqual(savings.horizonYears, 5, 'Horizonte 5 años');
    h.assertEqual(savings.breakdownByYear.length, 5, '5 desgloses anuales');

    // En año 1: tarifa competidor = 250*12 = 3.000 €; EAR OS = 3.000 €; ahorro inflación = 0 €
    const y1 = savings.breakdownByYear[0];
    h.assertEqual(y1.year, 1, 'Año 1');
    h.assertEqual(y1.competitorFeeEur, 3000, 'Tarifa competidor año 1 = 3.000 €');
    h.assertEqual(y1.earOsFounderFeeEur, 3000, 'Tarifa EAR OS año 1 = 3.000 €');
    h.assertEqual(y1.inflationSavingsEur, 0, 'Ahorro inflación año 1 = 0 €');

    // En año 2: competidor sube un 6% -> 3.180 €; EAR OS se mantiene en 3.000 €; ahorro = 180 €
    const y2 = savings.breakdownByYear[1];
    h.assertEqual(y2.year, 2, 'Año 2');
    h.assertEqual(y2.competitorFeeEur, 3180, 'Tarifa competidor año 2 = 3.180 €');
    h.assertEqual(y2.earOsFounderFeeEur, 3000, 'Tarifa EAR OS inmutable');
    h.assertEqual(y2.inflationSavingsEur, 180, 'Ahorro inflación año 2 = 180 €');

    // En año 5: competidor sigue subiendo, EAR OS congelado
    const y5 = savings.breakdownByYear[4];
    h.assert(y5.competitorFeeEur > 3700, 'Tarifa competidor acumulada año 5 > 3.700 €');
    h.assertEqual(y5.earOsFounderFeeEur, 3000, 'Tarifa EAR OS congelada a perpetuidad');

    // Ventaja acumulada neta debe ser estrictamente positiva
    h.assert(savings.netLifetimeAdvantageEur > 0, 'Ventaja neta positiva');
    h.assert(Number.isFinite(savings.roiMultiplier), 'ROI es un número finito');
    h.assert(savings.roiMultiplier > 1, 'ROI multiplicador > 1x');
  });

  // ───────────────────────────────────────────────────────────────────────────
  // CATEGORÍA 9: ESQUEMAS TERRITORIALES, TELÉFONOS VERÍDICOS Y CONTACT-GATE
  // ───────────────────────────────────────────────────────────────────────────
  h.startSection('9. Territorial Schema, Phone Verification & Contact-Gate Privacy');

  h.test('Verificación de formato telefónico español (Regex estricta)', () => {
    // Teléfonos españoles válidos (móviles y fijos con y sin prefijo +34)
    const validPhones = [
      '+34 693 693 048',
      '+34693693048',
      '693693048',
      '693 693 048',
      '+34 912 345 678',
      '912 345 678',
      '944 123 456',
      '+34 822 123 456',
      '+34 712 345 678',
      '712345678',
    ];

    for (const phone of validPhones) {
      h.assert(isVerifiableSpanishPhone(phone), `Debe ser válido: ${phone}`);
      const ver = verifyVenueTelephone(phone);
      h.assertEqual(ver.isVerified, true, `Debe verificar: ${phone}`);
      h.assertEqual(ver.cleanDigits.length, 9, `9 dígitos limpios para ${phone}`);
    }

    // Teléfonos no españoles, inventados o con prefijos no asignados
    const invalidPhones = [
      '123 456 789', // Empieza por 1
      '555 123 456', // Empieza por 5 (ficticio)
      '+1 555 123 4567', // USA
      '+44 20 7946 0958', // UK
      '012 345 678', // Empieza por 0
      'abcdefghijk', // No numérico
      '693 693', // Incompleto
      '693 693 048 999', // Demasiados dígitos
      '', // Vacío
    ];

    for (const phone of invalidPhones) {
      h.assert(!isVerifiableSpanishPhone(phone), `Debe ser inválido: ${phone}`);
      const ver = verifyVenueTelephone(phone);
      h.assertEqual(ver.isVerified, false, `No debe verificar: ${phone}`);
      h.assert(ver.error !== undefined, 'Debe contener mensaje explicativo de error');
    }
  });

  h.test('Contact-Gate: Enmascaramiento de teléfonos de proveedores protegiendo Centralita', () => {
    // 1. La Centralita Oficial EAR OS (+34 693 693 048) JAMÁS debe enmascararse
    const maskedCentralita = maskPhoneForContactGate(CENTRALITA_EAR_OS);
    h.assertEqual(maskedCentralita, CENTRALITA_EAR_OS, 'Centralita EAR OS se mantiene pública');

    // 2. Teléfonos de fincas y proveedores deben enmascararse para blindar contra bypass comercial
    const maskedProvider = maskPhoneForContactGate('+34 944 123 456');
    h.assertEqual(maskedProvider, '+34 944 ••• •••', 'Teléfono de proveedor enmascarado');

    const maskedProviderRaw = maskPhoneForContactGate('611223344');
    h.assertEqual(maskedProviderRaw, '+34 611 ••• •••', 'Formato sin prefijo enmascarado con +34');

    // Strings vacíos o nulos
    h.assertEqual(maskPhoneForContactGate(''), '••• ••• •••', 'Teléfono vacío enmascarado por defecto');
  });

  h.test('Clasificación territorial: Méntrida Hub vs Red Nacional', () => {
    // Madrid y Toledo dentro de 100 km -> HUB_MENTRIDA
    h.assert(isHubMentridaTerritory('Madrid', 45), 'Madrid 45 km -> Hub Méntrida');
    h.assert(isHubMentridaTerritory('Toledo', 25), 'Toledo 25 km -> Hub Méntrida');
    h.assert(isHubMentridaTerritory('Toledo', 0), '0 km Méntrida -> Hub Méntrida');

    // Cualquier provincia a <= 50 km (radio exento) -> HUB_MENTRIDA
    h.assert(isHubMentridaTerritory('Guadalajara', 30), 'Guadalajara 30 km -> Hub Méntrida');

    // Provincias lejanas -> RED_NACIONAL
    h.assert(!isHubMentridaTerritory('Bizkaia', 400), 'Bizkaia 400 km -> Red Nacional');
    h.assert(!isHubMentridaTerritory('Barcelona', 600), 'Barcelona 600 km -> Red Nacional');
    h.assert(!isHubMentridaTerritory('Sevilla', 500), 'Sevilla 500 km -> Red Nacional');
  });

  h.test('Generación de esquema JSON-LD EventVenue y serialización segura', () => {
    const fincaTest = SCLASS_12_FINCAS_HOMOLOGADAS[0];
    const schema = generateFincaEventVenueSchema(fincaTest, { siteUrl: 'https://productoraear.com' });

    h.assertEqual(schema['@context'], 'https://schema.org', 'Contexto schema.org');
    h.assertEqual(schema['@type'], 'EventVenue', 'Tipo EventVenue');
    h.assertEqual(schema.offers['@type'], 'Offer', 'Oferta de fianza vinculada');
    h.assertEqual(schema.offers.price, '100.00', 'Fianza de 100,00 € Stripe Price-Lock');
    h.assertEqual(schema.offers.priceCurrency, 'EUR', 'Divisa EUR');
    h.assertEqual(schema.maximumAttendeeCapacity, fincaTest.capacidadMaxPax, 'Aforo máximo verídico');

    // Serialización a string JSON válido
    const jsonStr = serializeSchemaToJsonLd(schema);
    h.assert(typeof jsonStr === 'string' && jsonStr.length > 100, 'JSON-LD serializado como texto');
    const parsed = JSON.parse(jsonStr);
    h.assertEqual(parsed['@type'], 'EventVenue', 'JSON parseado con éxito');
  });

  h.test('Generación de esquemas completos para Landing B2B e ItemList', () => {
    const landingSchemas = generateFincasLandingSchema({ siteUrl: 'https://productoraear.com' });

    h.assertEqual(landingSchemas.productSchema['@type'], 'Product', 'Product schema generado');
    h.assertEqual(landingSchemas.productSchema.offers.price, '100.00', 'Oferta 100.00 € en producto');

    h.assertEqual(landingSchemas.itemListSchema['@type'], 'ItemList', 'ItemList generado');
    h.assertEqual(
      landingSchemas.itemListSchema.numberOfItems,
      SCLASS_12_FINCAS_HOMOLOGADAS.length,
      'Contiene las 12 fincas homologadas',
    );
  });

  // ───────────────────────────────────────────────────────────────────────────
  // RESUMEN FINAL
  // ───────────────────────────────────────────────────────────────────────────
  const summary = h.getSummary();
  console.log('\n╔══════════════════════════════════════════════════════════════════════╗');
  console.log('║               RESUMEN DE EJECUCIÓN TIER 5 STRESS SUITE               ║');
  console.log('╚══════════════════════════════════════════════════════════════════════╝');
  console.log(`  Total Pruebas Ejecutadas : ${summary.total}`);
  console.log(`  Aprobadas (PASS)         : ${summary.pass}`);
  console.log(`  Fallidas (FAIL)          : ${summary.fail}`);
  console.log(`  Total Aserciones         : ${summary.totalAssertions}`);
  console.log(`  Tiempo Total             : ${summary.durationMs} ms\n`);

  return { pass: summary.fail === 0, summary };
}

// Auto-ejecución si se invoca directamente desde CLI
if (typeof require !== 'undefined' && require.main === module) {
  const { pass } = runTier5StressTests();
  process.exit(pass ? 0 : 1);
}
