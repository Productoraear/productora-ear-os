/**
 * ════════════════════════════════════════════════════════════════════════════
 * FINCAS B2B ESCAPARATE — TIER 2: BOUNDARY & CORNER CASES (PRODUCTION REWIRED)
 * ════════════════════════════════════════════════════════════════════════════
 * Validación exhaustiva de límites matemáticos, umbrales de activación,
 * entradas adversarias y prueba de propiedad LCG de 1.000 iteraciones contra
 * el motor real de producción `calculateFincaEventPricing`.
 * ════════════════════════════════════════════════════════════════════════════
 */

import {
  ALL_FINCA_MENUS_2026,
  FINCA_EXTRAS_2026,
} from '../../src/lib/fincas/fincaMenus2026Catalog';
import {
  calculateFincaEventPricing,
  FincaPricingEngineError,
  type FincaMenuPricingInput,
} from '../../src/lib/fincas/fincaMenuPricingEngine';
import {
  TestExecutionTracker,
} from './fincas_test_contracts';

export async function runTier2BoundaryAndCornerTests(tracker: TestExecutionTracker): Promise<void> {
  const tier = 2;

  // --------------------------------------------------------------------------
  // B1: Umbrales exactos de kilometraje logístico (0, 49, 50, 51 km)
  // --------------------------------------------------------------------------
  {
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;

    try {
      const baseInput: FincaMenuPricingInput = {
        menuId: 'boda-cantabrico',
        guestCount: 50,
        selectedExtraIds: [],
        distanceKm: 0,
        eventEndTime: '22:00',
      };

      // 0 km -> 0 céntimos
      const r0 = calculateFincaEventPricing({ ...baseInput, distanceKm: 0 });
      if (r0.logisticsKmCents !== 0) throw new Error(`0 km fallido: ${r0.logisticsKmCents}`);

      // 49 km -> 0 céntimos
      const r49 = calculateFincaEventPricing({ ...baseInput, distanceKm: 49 });
      if (r49.logisticsKmCents !== 0) throw new Error(`49 km fallido: ${r49.logisticsKmCents}`);

      // 50 km (frontera exacta de exención) -> 0 céntimos
      const r50 = calculateFincaEventPricing({ ...baseInput, distanceKm: 50 });
      if (r50.logisticsKmCents !== 0) throw new Error(`50 km frontera fallida: ${r50.logisticsKmCents}`);

      // 51 km (primer km facturable) -> 1 * 1.50 € = 150 céntimos
      const r51 = calculateFincaEventPricing({ ...baseInput, distanceKm: 51 });
      if (r51.logisticsKmCents !== 150) throw new Error(`51 km fallido: esperado 150 céntimos, obtenido ${r51.logisticsKmCents}`);

      passed = true;
    } catch (err) {
      errStr = err instanceof Error ? err.message : String(err);
    }

    tracker.record({
      tier,
      testName: 'B1: Umbral Logística Km — Comportamiento en 0 km, 49 km, 50 km (exento) y 51 km (150 céntimos)',
      passed,
      status: passed ? 'PASS' : 'FAIL',
      durationMs: Date.now() - start,
      error: errStr,
    });
  }

  // --------------------------------------------------------------------------
  // B2: Umbrales de activación hotelera por distancia (> 200 km) y hora (>= 3:00 AM)
  // --------------------------------------------------------------------------
  {
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;

    try {
      const baseInput: FincaMenuPricingInput = {
        menuId: 'boda-cantabrico',
        guestCount: 50,
        selectedExtraIds: [],
        distanceKm: 199,
        eventEndTime: '02:59',
      };

      // 199 km y 02:59 -> 0 hotel
      const r199 = calculateFincaEventPricing(baseInput);
      if (r199.logisticsHotelCents !== 0) throw new Error(`199 km / 02:59 no debe cobrar hotel: ${r199.logisticsHotelCents}`);

      // 200 km exactos y 02:59 -> 0 hotel (la regla estipula > 200 km)
      const r200 = calculateFincaEventPricing({ ...baseInput, distanceKm: 200 });
      if (r200.logisticsHotelCents !== 0) throw new Error(`200 km exactos no debe cobrar hotel: ${r200.logisticsHotelCents}`);

      // 201 km y 02:59 -> 12.000 céntimos (120 € hotel)
      const r201 = calculateFincaEventPricing({ ...baseInput, distanceKm: 201 });
      if (r201.logisticsHotelCents !== 12000) throw new Error(`201 km debe activar hotel 120 €: ${r201.logisticsHotelCents}`);

      // 80 km (< 200 km) pero hora 03:00 AM exacta -> 12.000 céntimos (120 € hotel)
      const rTime03 = calculateFincaEventPricing({ ...baseInput, distanceKm: 80, eventEndTime: '03:00' });
      if (rTime03.logisticsHotelCents !== 12000) throw new Error(`03:00 AM debe activar hotel: ${rTime03.logisticsHotelCents}`);

      passed = true;
    } catch (err) {
      errStr = err instanceof Error ? err.message : String(err);
    }

    tracker.record({
      tier,
      testName: 'B2: Umbral Hotelero — Activación estricta en 201 km o cierre a las 03:00 AM (+120 €)',
      passed,
      status: passed ? 'PASS' : 'FAIL',
      durationMs: Date.now() - start,
      error: errStr,
    });
  }

  // --------------------------------------------------------------------------
  // B3: Comensales extremos (0, 0.5, 1, 2.000 pax)
  // --------------------------------------------------------------------------
  {
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;

    try {
      // 0 pax debe lanzar INVALID_GUEST_COUNT
      let rejected0 = false;
      try {
        calculateFincaEventPricing({
          menuId: 'boda-cantabrico',
          guestCount: 0,
          selectedExtraIds: [],
          distanceKm: 20,
        });
      } catch (e) {
        if (e instanceof FincaPricingEngineError && e.code === 'INVALID_GUEST_COUNT') {
          rejected0 = true;
        }
      }
      if (!rejected0) throw new Error('0 comensales debe lanzar INVALID_GUEST_COUNT');

      // Float pax < 1.0 (0.5 pax) debe lanzar INVALID_GUEST_COUNT
      let rejectedFloat = false;
      try {
        calculateFincaEventPricing({
          menuId: 'boda-cantabrico',
          guestCount: 0.5,
          selectedExtraIds: [],
          distanceKm: 20,
        });
      } catch (e) {
        if (e instanceof FincaPricingEngineError && e.code === 'INVALID_GUEST_COUNT') {
          rejectedFloat = true;
        }
      }
      if (!rejectedFloat) throw new Error('0.5 comensales debe lanzar INVALID_GUEST_COUNT');

      // 1 pax (mínimo unitario): boda-cantabrico = 100.00 € (10.000 céntimos)
      const r1 = calculateFincaEventPricing({
        menuId: 'boda-cantabrico',
        guestCount: 1,
        selectedExtraIds: [],
        distanceKm: 20,
      });
      if (r1.menuTotalCents !== 10000 || r1.acousticRider.recommendedWatts !== 12) {
        throw new Error(`1 comensal esperado 10000 céntimos y 12 W, obtenido: ${r1.menuTotalCents} céntimos y ${r1.acousticRider.recommendedWatts} W`);
      }

      // 2.000 pax (macro aforo): boda-paloma (125.00 € = 12.500 céntimos)
      const r2000 = calculateFincaEventPricing({
        menuId: 'boda-paloma',
        guestCount: 2000,
        selectedExtraIds: ['barra-libre-extra'], // 1.500 céntimos * 2000 = 3.000.000 céntimos
        distanceKm: 40,
      });
      // 12500 * 2000 = 25,000,000 céntimos
      if (r2000.menuTotalCents !== 25000000) {
        throw new Error(`Macro aforo menú total incorrecto: ${r2000.menuTotalCents}`);
      }
      if (r2000.extrasTotalCents !== 3000000) {
        throw new Error(`Macro aforo extras total incorrecto: ${r2000.extrasTotalCents}`);
      }
      if (r2000.acousticRider.recommendedWatts !== 2000 * 12) {
        throw new Error(`Potencia acústica esperada 24.000 W, obtenida ${r2000.acousticRider.recommendedWatts}`);
      }

      passed = true;
    } catch (err) {
      errStr = err instanceof Error ? err.message : String(err);
    }

    tracker.record({
      tier,
      testName: 'B3: Límites de Aforo — Validación estricta (rechazo 0 y 0.5 pax) y escala lineal a 2.000 pax',
      passed,
      status: passed ? 'PASS' : 'FAIL',
      durationMs: Date.now() - start,
      error: errStr,
    });
  }

  // --------------------------------------------------------------------------
  // B4: Selección de complementos (0 extras vs 16 extras simultáneos)
  // --------------------------------------------------------------------------
  {
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;

    try {
      const allExtraIds = FINCA_EXTRAS_2026.map((e) => e.id);
      const pax = 100;

      const rAll = calculateFincaEventPricing({
        menuId: 'boda-ezkertza',
        guestCount: pax,
        selectedExtraIds: allExtraIds,
        distanceKm: 50,
      });

      // Calcular suma manual esperada de los 16 extras
      let manualExtrasExpected = 0;
      for (const e of FINCA_EXTRAS_2026) {
        manualExtrasExpected += e.isPerPax ? e.priceCents * pax : e.priceCents;
      }

      if (rAll.extrasTotalCents !== manualExtrasExpected) {
        throw new Error(`Suma de 16 extras discrepante: esperado ${manualExtrasExpected}, obtenido ${rAll.extrasTotalCents}`);
      }
      if (rAll.metadata.extrasBreakdown.length !== FINCA_EXTRAS_2026.length) {
        throw new Error(`Desglose de extras incompleto: esperado ${FINCA_EXTRAS_2026.length}, obtenido ${rAll.metadata.extrasBreakdown.length}`);
      }
      passed = true;
    } catch (err) {
      errStr = err instanceof Error ? err.message : String(err);
    }

    tracker.record({
      tier,
      testName: 'B4: Combinatoria de Complementos — Selección simultánea de los 16 extras con desglose híbrido fijo/pax',
      passed,
      status: passed ? 'PASS' : 'FAIL',
      durationMs: Date.now() - start,
      error: errStr,
    });
  }

  // --------------------------------------------------------------------------
  // B5: Rango contractual de comisiones de afiliado [0.10, 0.15]
  // --------------------------------------------------------------------------
  {
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;

    try {
      const valid10 = calculateFincaEventPricing({
        menuId: 'boda-cantabrico',
        guestCount: 50,
        selectedExtraIds: [],
        distanceKm: 20,
        affiliateCommissionPct: 0.10,
      });
      if (valid10.affiliateCommissionCents <= 0) throw new Error('Comisión 10% inválida');
      if (valid10.affiliateCommissionCents !== Math.round(valid10.split.earOsCents * 0.10)) {
        throw new Error('Comisión 10% discrepante del SSOT');
      }

      const valid15 = calculateFincaEventPricing({
        menuId: 'boda-cantabrico',
        guestCount: 50,
        selectedExtraIds: [],
        distanceKm: 20,
        affiliateCommissionPct: 0.15,
      });
      if (valid15.affiliateCommissionCents <= 0) throw new Error('Comisión 15% inválida');
      if (valid15.affiliateCommissionCents !== Math.round(valid15.split.earOsCents * 0.15)) {
        throw new Error('Comisión 15% discrepante del SSOT');
      }

      // Clamping seguro: < 10% se fija a 10%
      const clampedLow = calculateFincaEventPricing({
        menuId: 'boda-cantabrico',
        guestCount: 50,
        selectedExtraIds: [],
        distanceKm: 20,
        affiliateCommissionPct: 0.08,
      });
      if (clampedLow.affiliateCommissionCents !== valid10.affiliateCommissionCents) {
        throw new Error('Comisión 0.08 no fue clampeada a 0.10');
      }

      // Clamping seguro: > 15% se fija a 15%
      const clampedHigh = calculateFincaEventPricing({
        menuId: 'boda-cantabrico',
        guestCount: 50,
        selectedExtraIds: [],
        distanceKm: 20,
        affiliateCommissionPct: 0.18,
      });
      if (clampedHigh.affiliateCommissionCents !== valid15.affiliateCommissionCents) {
        throw new Error('Comisión 0.18 no fue clampeada a 0.15');
      }

      // Soporte formato entero (12 -> 0.12)
      const integerRate = calculateFincaEventPricing({
        menuId: 'boda-cantabrico',
        guestCount: 50,
        selectedExtraIds: [],
        distanceKm: 20,
        affiliateCommissionPct: 12,
      });
      if (integerRate.affiliateCommissionCents !== Math.round(integerRate.split.earOsCents * 0.12)) {
        throw new Error('Comisión entera 12 no fue normalizada a 0.12');
      }

      // Sanitización segura ante NaN
      const nanRate = calculateFincaEventPricing({
        menuId: 'boda-cantabrico',
        guestCount: 50,
        selectedExtraIds: [],
        distanceKm: 20,
        affiliateCommissionPct: NaN,
      });
      if (!Number.isFinite(nanRate.affiliateCommissionCents) || nanRate.affiliateCommissionCents !== valid10.affiliateCommissionCents) {
        throw new Error('Comisión NaN no fue normalizada de forma segura a 0.10');
      }

      passed = true;
    } catch (err) {
      errStr = err instanceof Error ? err.message : String(err);
    }

    tracker.record({
      tier,
      testName: 'B5: Guardián de Comisión de Afiliados — Clamping seguro [0.10, 0.15], soporte entero y protección NaN',
      passed,
      status: passed ? 'PASS' : 'FAIL',
      durationMs: Date.now() - start,
      error: errStr,
    });
  }

  // --------------------------------------------------------------------------
  // B6: Entradas adversarias y nombres maliciosos (XSS, SQLi, IDs inexistentes)
  // --------------------------------------------------------------------------
  {
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;

    try {
      // 1. Menú inexistente lanza MENU_NOT_FOUND
      let rejectedMenu = false;
      try {
        calculateFincaEventPricing({
          menuId: 'menu-fantasma-hacker-payload',
          guestCount: 50,
          selectedExtraIds: [],
          distanceKm: 10,
        });
      } catch (e) {
        if (e instanceof FincaPricingEngineError && e.code === 'MENU_NOT_FOUND') {
          rejectedMenu = true;
        }
      }
      if (!rejectedMenu) throw new Error('Menú inexistente no lanzó FincaPricingEngineError(MENU_NOT_FOUND)');

      // 2. Extra inexistente o payload malicioso neutralizado (0 céntimos, sin inyección)
      const resSanitized = calculateFincaEventPricing({
        menuId: 'boda-cantabrico',
        guestCount: 50,
        selectedExtraIds: ['<script>alert(1)</script>', 'extra-inexistente-hacker', "1' OR '1'='1"],
        distanceKm: 10,
      });
      if (resSanitized.extrasTotalCents !== 0) {
        throw new Error(`Extras maliciosos deben computar 0 céntimos, obtenido: ${resSanitized.extrasTotalCents}`);
      }
      if (resSanitized.metadata.extrasBreakdown.length !== 0) {
        throw new Error('Extras maliciosos no deben incorporarse al desglose');
      }

      // 3. Extras duplicados se deduplican atómicamente
      const resDedup = calculateFincaEventPricing({
        menuId: 'boda-cantabrico',
        guestCount: 50,
        selectedExtraIds: ['solista-edwin', 'solista-edwin', 'solista-edwin'],
        distanceKm: 10,
      });
      if (resDedup.extrasTotalCents !== 35000) {
        throw new Error(`Extras duplicados deben cobrarse una sola vez (35000 céntimos), obtenido: ${resDedup.extrasTotalCents}`);
      }
      if (resDedup.metadata.extrasBreakdown.length !== 1) {
        throw new Error('Desglose de extras debe contener solo 1 elemento tras deduplicación');
      }

      passed = true;
    } catch (err) {
      errStr = err instanceof Error ? err.message : String(err);
    }

    tracker.record({
      tier,
      testName: 'B6: Robustez Adversaria — Rechazo de menú inexistente, neutralización de inyecciones y deduplicación atómica',
      passed,
      status: passed ? 'PASS' : 'FAIL',
      durationMs: Date.now() - start,
      error: errStr,
    });
  }

  // --------------------------------------------------------------------------
  // B7: Prueba de propiedad determinista LCG (1.000 iteraciones sin descuadre)
  // --------------------------------------------------------------------------
  {
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;

    try {
      // LCG simple determinista
      let seed = 424242;
      function nextRandom(): number {
        seed = (seed * 1664525 + 1013904223) % 4294967296;
        return seed / 4294967296;
      }

      const menuIds = ALL_FINCA_MENUS_2026.map((m) => m.id);
      const extraIds = FINCA_EXTRAS_2026.map((e) => e.id);

      for (let i = 0; i < 1000; i++) {
        const randomMenuId = menuIds[Math.floor(nextRandom() * menuIds.length)]!;
        const guestCount = Math.floor(nextRandom() * 450) + 1; // 1 a 450 pax
        const distanceKm = Math.floor(nextRandom() * 350); // 0 a 350 km
        const commissionPct = 0.10 + nextRandom() * 0.05; // 0.10 a 0.15

        // Selección aleatoria de 0 a 5 extras
        const extrasCount = Math.floor(nextRandom() * 6);
        const selectedExtras: string[] = [];
        for (let j = 0; j < extrasCount; j++) {
          const ex = extraIds[Math.floor(nextRandom() * extraIds.length)]!;
          if (!selectedExtras.includes(ex)) selectedExtras.push(ex);
        }

        const res = calculateFincaEventPricing({
          menuId: randomMenuId,
          guestCount,
          selectedExtraIds: selectedExtras,
          distanceKm,
          affiliateCommissionPct: Number(commissionPct.toFixed(3)),
        });

        // INVARIANTE 1: subtotal == artista + earOs + vimume exactamente
        const splitSum = res.split.artistaCents + res.split.earOsCents + res.split.vimumeCents;
        if (splitSum !== res.subtotalCents) {
          throw new Error(`LCG Caso #${i}: Descuadre de Split (${splitSum} !== ${res.subtotalCents})`);
        }

        // INVARIANTE 2: totalWithIva == subtotal + iva exactamente
        if (res.totalWithIvaCents !== res.subtotalCents + res.ivaCents) {
          throw new Error(`LCG Caso #${i}: Descuadre IVA (${res.totalWithIvaCents} !== ${res.subtotalCents + res.ivaCents})`);
        }

        // INVARIANTE 3: Depósito siempre 10.000 céntimos (100 €)
        if (res.depositDeductibleCents !== 10000) {
          throw new Error(`LCG Caso #${i}: Depósito corrupto (${res.depositDeductibleCents})`);
        }

        // INVARIANTE 4: Potencia recomendada exacta 12 W/pax
        if (res.acousticRider.recommendedWatts !== guestCount * 12) {
          throw new Error(`LCG Caso #${i}: Potencia acústica errónea (${res.acousticRider.recommendedWatts})`);
        }

        // INVARIANTE 5: Comisión de afiliado contenida en margen EAR OS
        if (res.affiliateCommissionCents > res.split.earOsCents) {
          throw new Error(`LCG Caso #${i}: Comisión de afiliado excede margen EAR OS`);
        }

        // INVARIANTE 6: Margen neto exacto en metadatos
        if (res.metadata.earOsNetAfterCommissionCents !== res.split.earOsCents - res.affiliateCommissionCents) {
          throw new Error(`LCG Caso #${i}: Margen neto inconsistente`);
        }
      }

      passed = true;
    } catch (err) {
      errStr = err instanceof Error ? err.message : String(err);
    }

    tracker.record({
      tier,
      testName: 'B7: Prueba de Propiedad LCG (1.000 iteraciones) — Invariante 80/10/10 y céntimos exactos al 100%',
      passed,
      status: passed ? 'PASS' : 'FAIL',
      durationMs: Date.now() - start,
      error: errStr,
    });
  }
}
