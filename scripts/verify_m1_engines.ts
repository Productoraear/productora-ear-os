/**
 * ════════════════════════════════════════════════════════════════════════════
 * VERIFICATION SUITE — MILESTONE 1: SSOT & MOTORES DE CÁLCULO
 * ════════════════════════════════════════════════════════════════════════════
 * Verifica la exactitud matemática y el cumplimiento de invariantes de negocio:
 * 1. Catálogo SSOT Menús 2026 y Complementos (`fincaMenus2026Catalog.ts`)
 * 2. Motor Financiero de Menús y Reparto 80/10/10 (`fincaMenuPricingEngine.ts`)
 * 3. Métricas B2B, Pacto 100 Fundadores y 0% Fuga (`fincaMetricsEngine.ts`)
 * ════════════════════════════════════════════════════════════════════════════
 */

import assert from 'node:assert/strict';

import {
  FINCA_BODA_MENUS_2026,
  FINCA_EXTRAS_2026,
  ALL_FINCA_MENUS_2026,
  getFincaMenuById,
  getFincaExtraById,
  isFincaBodaMenuId,
  isFincaMenuId,
  isFincaExtraId,
  validateFincaCatalogIntegrity,
} from '../src/lib/fincas/fincaMenus2026Catalog';

import {
  calculateFincaEventPricing,
  distributeSplitSoberano,
  isHotelRequired,
  normalizeAffiliateRate,
  resolveAcousticSystem,
  eurToCents,
  centsToEur,
  formatCentsEur,
  FincaPricingEngineError,
} from '../src/lib/fincas/fincaMenuPricingEngine';

import {
  PACTO_100_FUNDADORES_SSOT,
  buildComparativaBodasNetVsEarOs,
  calculateFounderFeeMatch,
  calculateLifetimePortalSavings,
  buildExecutiveDashboard,
  costeLogisticaMentrida,
} from '../src/lib/fincas/fincaMetricsEngine';

import { TARIFA_BASE_SOLISTA_EUR } from '../src/lib/constants/ear-os-ssot';

console.log('════════════════════════════════════════════════════════════════════');
console.log('EJECUTANDO ARNÉS DE VERIFICACIÓN DE MILESTONE 1 (SSOT & MOTORES)');
console.log('════════════════════════════════════════════════════════════════════\n');

// ── 1. VERIFICACIÓN DEL CATÁLOGO CANÓNICO 2026 ──────────────────────────────
console.log('[BLOQUE 1] Verificando Catálogo Canónico Fincas 2026...');

const catalogAudit = validateFincaCatalogIntegrity();
assert.equal(catalogAudit.isValid, true, `El catálogo debe ser válido. Errores: ${catalogAudit.errors.join(', ')}`);
assert.equal(catalogAudit.errors.length, 0, 'No debe haber errores de integridad');
assert.equal(catalogAudit.extraCount, 16, 'Deben existir exactamente 16 extras canónicos');
assert.equal(FINCA_BODA_MENUS_2026.length, 7, 'Deben existir exactamente 7 menús de boda oficiales');
assert.equal(ALL_FINCA_MENUS_2026.length, 13, 'Deben existir 13 menús totales (7 bodas, 4 comuniones, 2 grupos)');

// Comprobar que Solista Edwin Agudelo vale exactamente TARIFA_BASE_SOLISTA_EUR
const solista = getFincaExtraById('solista-edwin');
assert.ok(solista, 'Extra solista-edwin debe existir');
assert.equal(solista.priceEur, TARIFA_BASE_SOLISTA_EUR, `Tarifa solista debe ser ${TARIFA_BASE_SOLISTA_EUR}`);
assert.equal(solista.priceCents, 35000, 'Tarifa solista en céntimos debe ser 35000');
assert.equal(solista.isPerPax, false, 'Solista es tarifa fija, no perPax');

// Type guards
assert.equal(isFincaBodaMenuId('boda-cantabrico'), true);
assert.equal(isFincaBodaMenuId('boda-vasco'), true);
assert.equal(isFincaBodaMenuId('comunion-paloma'), false);
assert.equal(isFincaMenuId('comunion-paloma'), true);
assert.equal(isFincaMenuId('menu-inexistente'), false);
assert.equal(isFincaExtraId('barra-libre-extra'), true);
assert.equal(isFincaExtraId('extra-falso'), false);

console.log('✅ BLOQUE 1 COMPLETADO: Catálogo 2026 verificado al 100% (7 bodas, 16 extras, integer cents exactos).\n');

// ── 2. VERIFICACIÓN DEL MOTOR DE PRICING Y REPARTO 80/10/10 ─────────────────
console.log('[BLOQUE 2] Verificando Motor de Pricing y Reparto 80/10/10...');

// 2.1 Reglas de Suplemento Hotelero
assert.equal(isHotelRequired(40, '22:00'), false, '40 km a las 22:00 no requiere hotel');
assert.equal(isHotelRequired(150, '01:30'), false, '150 km a las 01:30 no requiere hotel');
assert.equal(isHotelRequired(201, '21:00'), true, '201 km (>200 km) requiere hotel');
assert.equal(isHotelRequired(80, '03:00'), true, 'Fin a las 03:00 AM requiere hotel');
assert.equal(isHotelRequired(80, '04:30'), true, 'Fin a las 04:30 AM requiere hotel');
assert.equal(isHotelRequired(80, '14:00'), false, 'Fin a las 14:00 PM no requiere hotel');

// 2.2 Split Soberano Hare-Niemeyer (Invariante suma exacta)
const edgeAmountsCents = [
  0, 1, 2, 3, 4, 7, 10, 33, 99, 100, 101, 350, 999, 1000, 1001,
  12345, 1581500, 3800000, 9999999,
];
for (const cents of edgeAmountsCents) {
  const split = distributeSplitSoberano(cents);
  const sum = split.artistaCents + split.earOsCents + split.vimumeCents;
  assert.equal(
    sum,
    cents,
    `Fallo en invariante Split 80/10/10: sum(${sum}) !== total(${cents}) para ${cents} céntimos`,
  );
  assert.ok(split.artistaCents >= 0, 'Artista cents no puede ser negativo');
  assert.ok(split.earOsCents >= 0, 'EAR OS cents no puede ser negativo');
  assert.ok(split.vimumeCents >= 0, 'VIMUME cents no puede ser negativo');
}

// 2.3 Rango de comisión de afiliados (10% a 15%)
assert.equal(normalizeAffiliateRate(undefined), 0.10);
assert.equal(normalizeAffiliateRate(0.05), 0.10);
assert.equal(normalizeAffiliateRate(0.20), 0.15);
assert.equal(normalizeAffiliateRate(12), 0.12);
assert.equal(normalizeAffiliateRate(15), 0.15);

// 2.4 Sistemas acústicos por potencia RMS
assert.equal(resolveAcousticSystem(500), 'Bose S1 Pro System (Compacto / Directo Acústico / Batería)');
assert.equal(resolveAcousticSystem(1200), 'Bose F1 Model 812 Dual Column (Array Flexible 1.000W RMS)');
assert.equal(resolveAcousticSystem(3000), 'Bose F1 Quad Array + Subwoofers + Limitador Cesva Homologado LRF');

// 2.5 Simulación integral de evento
// Evento: Menú Vasco (138 €/pax = 13.800 cents), 100 invitados, 80 km de distancia, fin a las 04:30 AM
// Extras: Solista Edwin (350 € = 35.000 cents fijo) + Barra Libre (15 € * 100 = 150.000 cents perPax)
const pricingResult = calculateFincaEventPricing({
  menuId: 'boda-vasco',
  guestCount: 100,
  selectedExtraIds: ['solista-edwin', 'barra-libre-extra'],
  distanceKm: 80,
  eventEndTime: '04:30',
  affiliateCommissionPct: 0.12,
});

// Comprobaciones matemáticas deterministas:
// Menú: 100 * 13800 = 1.380.000 céntimos (13.800,00 €)
assert.equal(pricingResult.menuTotalCents, 1380000);

// Extras: 35000 + (1500 * 100) = 185.000 céntimos (1.850,00 €)
assert.equal(pricingResult.extrasTotalCents, 185000);

// Logística km: (80 - 50) * 150 = 4.500 céntimos (45,00 €)
assert.equal(pricingResult.logisticsKmCents, 4500);

// Logística Hotel: 12.000 céntimos (120,00 € por fin a las 04:30 AM)
assert.equal(pricingResult.logisticsHotelCents, 12000);

// Subtotal neto: 1380000 + 185000 + 4500 + 12000 = 1.581.500 céntimos (15.815,00 €)
assert.equal(pricingResult.subtotalCents, 1581500);

// IVA 21%: 1581500 * 0.21 = 332.115 céntimos (3.321,15 €)
assert.equal(pricingResult.ivaCents, 332115);

// Total con IVA: 1581500 + 332115 = 1.913.615 céntimos (19.136,15 €)
assert.equal(pricingResult.totalWithIvaCents, 1913615);

// Split Soberano:
// Artista (80%): 1581500 * 0.8 = 1.265.200 céntimos
// EAR OS (10%): 1581500 * 0.1 = 158.150 céntimos
// VIMUME (10%): 1581500 * 0.1 = 158.150 céntimos
assert.equal(pricingResult.split.artistaCents, 1265200);
assert.equal(pricingResult.split.earOsCents, 158150);
assert.equal(pricingResult.split.vimumeCents, 158150);
assert.equal(
  pricingResult.split.artistaCents + pricingResult.split.earOsCents + pricingResult.split.vimumeCents,
  pricingResult.subtotalCents,
);

// Comisión Afiliado Finca: 12% sobre los 158.150 céntimos de EAR OS = 18.978 céntimos (189,78 €)
assert.equal(pricingResult.affiliateCommissionCents, 18978);
assert.equal(
  pricingResult.metadata.earOsNetAfterCommissionCents,
  158150 - 18978,
  'El margen neto de EAR OS se deduce correctamente',
);

// Rider acústico: 100 pax * 12 W = 1.200 W RMS, límite 75 dB SPL, cumple Ley 37/2003
assert.equal(pricingResult.acousticRider.recommendedWatts, 1200);
assert.equal(pricingResult.acousticRider.maxDbSpl, 75);
assert.equal(pricingResult.acousticRider.isCompliant, true);

// Depósito de 100,00 € deducible
assert.equal(pricingResult.depositDeductibleCents, 10000);
assert.equal(pricingResult.metadata.pendingBalanceWithIvaCents, 1913615 - 10000);

// Manejo de errores
assert.throws(
  () => calculateFincaEventPricing({ menuId: 'boda-vasco', guestCount: 0, selectedExtraIds: [], distanceKm: 10 }),
  (err: unknown) => err instanceof FincaPricingEngineError && err.code === 'INVALID_GUEST_COUNT',
);
assert.throws(
  () => calculateFincaEventPricing({ menuId: 'menu-inexistente', guestCount: 50, selectedExtraIds: [], distanceKm: 10 }),
  (err: unknown) => err instanceof FincaPricingEngineError && err.code === 'MENU_NOT_FOUND',
);

// 2.6 Verificación de los 4 Casos Límite Financieros (Challenger Audit Remediation)
console.log('[BLOQUE 2.6] Verificando casos límite financieros (Float pax, NaN affiliate, deduplicación extras)...');

// Caso Límite A: Float Pax < 1.0 (0.5 pax) debe lanzar INVALID_GUEST_COUNT
assert.throws(
  () => calculateFincaEventPricing({ menuId: 'boda-vasco', guestCount: 0.5, selectedExtraIds: [], distanceKm: 10 }),
  (err: unknown) => err instanceof FincaPricingEngineError && err.code === 'INVALID_GUEST_COUNT',
  'Float pax 0.5 debe lanzar INVALID_GUEST_COUNT',
);

// Float pax > 1.0 se trunca con Math.floor (100.9 pax -> 100 pax)
const resFloatTrunc = calculateFincaEventPricing({
  menuId: 'boda-vasco',
  guestCount: 100.9,
  selectedExtraIds: [],
  distanceKm: 10,
});
assert.equal(resFloatTrunc.metadata.guestCount, 100, 'guestCount 100.9 debe truncarse a 100');

// Caso Límite B: NaN en affiliateCommissionPct debe normalizarse a 0.10 de forma segura
assert.equal(normalizeAffiliateRate(NaN), 0.10, 'normalizeAffiliateRate(NaN) debe devolver 0.10');
const resNaN = calculateFincaEventPricing({
  menuId: 'boda-vasco',
  guestCount: 100,
  selectedExtraIds: [],
  distanceKm: 10,
  affiliateCommissionPct: NaN,
});
assert.ok(Number.isFinite(resNaN.affiliateCommissionCents), 'affiliateCommissionCents debe ser finito con NaN');
assert.equal(resNaN.affiliateCommissionCents, Math.round(resNaN.split.earOsCents * 0.10));

// Caso Límite C: Deduplicación atómica de selectedExtraIds
const resDupExtras = calculateFincaEventPricing({
  menuId: 'boda-vasco',
  guestCount: 100,
  selectedExtraIds: ['solista-edwin', 'solista-edwin', 'barra-libre-extra', 'barra-libre-extra'],
  distanceKm: 10,
});
// 35000 (solista fijo) + 150000 (barra libre 1500 * 100) = 185000 céntimos
assert.equal(resDupExtras.extrasTotalCents, 185000, 'Extras duplicados deben cobrarse una sola vez');
assert.equal(resDupExtras.metadata.extrasBreakdown.length, 2, 'Desglose debe contener solo 2 extras tras deduplicación');

console.log('✅ BLOQUE 2 COMPLETADO: Motor de Pricing verificado (Split 80/10/10, céntimos exactos, logística, comisiones y acústica).\n');

// ── 3. VERIFICACIÓN DEL MOTOR DE MÉTRICAS Y PACTO 100 FUNDADORES ────────────
console.log('[BLOQUE 3] Verificando Motor de Métricas y Pacto de 100 Fundadores...');

// 3.1 Comparativa BodasNet vs EAR OS
const comparativa = buildComparativaBodasNetVsEarOs();
assert.equal(comparativa.length, 7, 'La comparativa debe incluir exactamente 7 filas');
const fugaRow = comparativa.find((r) => r.concepto === '0% Fuga publicitaria a competidores');
assert.ok(fugaRow, 'Fila "0% Fuga publicitaria a competidores" debe existir');
assert.equal(fugaRow.ventaja, 'EAR');
assert.equal(fugaRow.ahorroAnualEstimado, PACTO_100_FUNDADORES_SSOT.VALOR_LEAD_PERDIDO_ESTIMADO_EUR);
assert.equal(fugaRow.ahorroAnualEstimado, 3800);

// 3.2 Founder Fee Match (Price-Match cuota portal anterior)
const match42 = calculateFounderFeeMatch(250, { currentFoundersEnrolled: 42 });
assert.equal(match42.eligibleForFounderPact, true);
assert.equal(match42.founderSlotNumber, 43);
assert.equal(match42.remainingSlots, 58);
assert.equal(match42.previousMonthlyFeeEur, 250);
assert.equal(match42.previousAnnualFeeEur, 3000);
assert.equal(match42.matchedMonthlyFeeCents, 25000);
assert.equal(match42.matchedAnnualFeeCents, 300000);
assert.equal(match42.lifetimePriceLock, true);
assert.equal(match42.guarantees.zeroAdLeakage, true);
assert.equal(match42.guarantees.depositDeductibleEur, 100);

// Comprobar cupo agotado (100 plazas)
const match100 = calculateFounderFeeMatch(300, { currentFoundersEnrolled: 100 });
assert.equal(match100.eligibleForFounderPact, false);
assert.equal(match100.founderSlotNumber, null);
assert.equal(match100.remainingSlots, 0);
assert.equal(match100.lifetimePriceLock, false);

// 3.3 Ahorro acumulado vitalicio (calculateLifetimePortalSavings)
const savings5y = calculateLifetimePortalSavings({
  previousFeeMonthlyEur: 250,
  horizonYears: 5,
  annualWeddings: 20,
  averageWeddingTicketEur: 3800,
});
assert.equal(savings5y.horizonYears, 5);
assert.equal(savings5y.breakdownByYear.length, 5);
assert.ok(savings5y.totalFeeSavingsEur > 0, 'Debe haber ahorro por inflación no aplicada en EAR OS');
assert.ok(savings5y.totalFugaRetentionSavingsEur === 3800 * 5, '5 años reteniendo 1 boda perdida = 19.000 €');
assert.ok(savings5y.totalAffiliateEarningsEur > 0, 'Comisiones de afiliación por logística');
assert.ok(savings5y.netLifetimeAdvantageEur > 20000, 'Ventaja acumulada > 20.000 €');
assert.ok(savings5y.roiMultiplier > 1, 'ROI multiplicador positivo');

// 3.4 Dashboard Ejecutivo
const execDash = buildExecutiveDashboard();
assert.equal(execDash.comparativa.length, 7);
assert.ok(execDash.totalFincasHomologadas > 0);
assert.ok(execDash.blindajeAcustico.length > 0);

// 3.5 Verificación del Suelo Canónico de 50 € en Pacto de Fundadores y Reloj 24h
console.log('[BLOQUE 3.5] Verificando Suelo Canónico 50 €/mes y Reloj 24h Logística...');

// Suelo de 50 € ante cuotas bajas o adversarias
const match1Eur = calculateFounderFeeMatch(1.0);
assert.equal(match1Eur.matchedMonthlyFeeEur, 50, '1 € debe elevarse a 50 €/mes (suelo canónico)');
assert.equal(match1Eur.matchedMonthlyFeeCents, 5000, '50 € = 5000 céntimos');

const match49Eur = calculateFounderFeeMatch(49.99);
assert.equal(match49Eur.matchedMonthlyFeeEur, 50, '49,99 € debe elevarse a 50 €/mes');

const match50Eur = calculateFounderFeeMatch(50.0);
assert.equal(match50Eur.matchedMonthlyFeeEur, 50, '50,00 € exactos se mantiene en 50 €/mes');

const match150Eur = calculateFounderFeeMatch(150.0);
assert.equal(match150Eur.matchedMonthlyFeeEur, 150, '150,00 € se respeta íntegro');

// Corrección del reloj de 24h en costeLogisticaMentrida
assert.equal(costeLogisticaMentrida(20), 0, '20 km con horaFin por defecto (23h) no debe cobrar hotel');
assert.equal(costeLogisticaMentrida(20, 23), 0, '20 km a las 23:00 no debe cobrar hotel');
assert.equal(costeLogisticaMentrida(20, 2), 0, '20 km a las 02:00 AM no debe cobrar hotel');
assert.equal(costeLogisticaMentrida(20, 3), 120, '20 km a las 03:00 AM sí debe cobrar hotel 120 €');
assert.equal(costeLogisticaMentrida(20, 4), 120, '20 km a las 04:00 AM sí debe cobrar hotel 120 €');
assert.equal(costeLogisticaMentrida(201, 21), 347, '201 km (> 200 km) debe cobrar kilometraje (227 €) + hotel (120 €) = 347 €');

console.log('✅ BLOQUE 3 COMPLETADO: Métricas, Pacto 100 Fundadores y 0% Fuga verificados.\n');

console.log('════════════════════════════════════════════════════════════════════');
console.log('🎉 TODAS LAS VERIFICACIONES DE MILESTONE 1 HAN PASADO CON ÉXITO');
console.log('════════════════════════════════════════════════════════════════════');
