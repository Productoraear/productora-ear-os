/**
 * TEST: B2G ARSENAL TENDER RADAR
 * Valida el motor de radar de licitaciones municipales y generador de oferta en 1 clic.
 * Simula 3 licitaciones: Ayuntamiento de Toledo, Torrijos e Illescas.
 */

import {
  generateB2GArsenalBidPackage,
  SAFE_LCSP_CEILING,
  SPL_LIMIT_DB,
  type B2GTenderOpportunity
} from '../src/lib/vimume/b2gArsenalTenderRadar';

console.log('🚀 [TEST] Verificando Radar B2G Arsenal Tender (<15.000€ Art. 118 LCSP)...\n');

const startTime = Date.now();

const tenders: B2GTenderOpportunity[] = [
  {
    expedienteId: 'EXP-TOL-2026-001',
    entityName: 'Ayuntamiento de Toledo',
    department: 'Concejalía de Festejos y Cultura',
    cif: 'P4516800A',
    dir3Code: 'L01451680',
    category: 'FESTEJOS_PATRONALES',
    baseBudget: 12000,
    venueName: 'Plaza del Ayuntamiento de Toledo',
    venueCoords: { lat: 39.8628, lng: -4.0273 },
    province: 'Toledo',
    eventDate: '2026-09-20',
    eventStartTime: '20:00',
    eventEndHour: 2,
    expectedPax: 800,
    isSensitiveZone: false,
    selectedBaseIds: ['base-toledo-sonido', 'base-madrid-mariachis']
  },
  {
    expedienteId: 'EXP-TOR-2026-002',
    entityName: 'Ayuntamiento de Torrijos',
    department: 'Concejalía de Bienestar Social y Tercera Edad',
    cif: 'P4517300B',
    dir3Code: 'L01451730',
    category: 'TERCERA_EDAD_VIMUME',
    baseBudget: 4200,
    venueName: 'Centro de Mayores de Torrijos',
    venueCoords: { lat: 39.9817, lng: -4.2814 },
    province: 'Toledo',
    eventDate: '2026-10-05',
    eventStartTime: '17:00',
    eventEndHour: 19,
    expectedPax: 120,
    isSensitiveZone: true,
    selectedBaseIds: ['base-toledo-sonido']
  },
  {
    expedienteId: 'EXP-ILL-2026-003',
    entityName: 'Ayuntamiento de Illescas',
    department: 'Concejalía de Juventud y Festejos',
    cif: 'P4508100C',
    dir3Code: 'L01450810',
    category: 'JUVENTUD_FESTIVAL',
    baseBudget: 18000, // Supera el techo → debe bifurcar en lotes
    venueName: 'Recinto Ferial de Illescas',
    venueCoords: { lat: 40.1236, lng: -3.8472 },
    province: 'Toledo',
    eventDate: '2026-09-27',
    eventStartTime: '22:00',
    eventEndHour: 4, // Fin >= 3:00 AM → hotel
    expectedPax: 1500,
    isSensitiveZone: false,
    selectedBaseIds: ['base-valencia-led', 'base-toledo-sonido', 'base-madrid-mariachis']
  }
];

let testsPassed = 0;
const totalTests = 3;

tenders.forEach((tender, i) => {
  const bid = generateB2GArsenalBidPackage(tender);

  console.log(`\n--- LICITACIÓN #${i + 1}: ${bid.entityName} ---`);
  console.log(`   Expediente: ${bid.expedienteId}`);
  console.log(`   Categoría: ${bid.category}`);
  console.log(`   Presupuesto Base: ${bid.financialSummary.baseBudget.toLocaleString('es-ES')} €`);
  console.log(`   IVA (21%): ${bid.financialSummary.vatAmount.toLocaleString('es-ES')} €`);
  console.log(`   Total: ${bid.financialSummary.totalBudget.toLocaleString('es-ES')} €`);
  console.log(`   LCSP Compliant: ${bid.financialSummary.isLCSPCompliant}`);
  console.log(`   Bifurcación Lotes: ${bid.financialSummary.requiresLotBifurcation}`);
  console.log(`   Rider Acústico: ${bid.acousticRider.profile} (${bid.acousticRider.wattsPerPax} W/pax, ${bid.acousticRider.totalWattsRms} W RMS)`);
  console.log(`   SPL Límite: < ${bid.acousticRider.splLimitDb} dB (Compliant: ${bid.acousticRider.isSplCompliant})`);
  console.log(`   Distancia: ${bid.logistics.distanceKm} km | Logística: ${bid.logistics.totalLogisticsFee} €`);
  console.log(`   Split 80/10/10: ${bid.financialSummary.splitDistribution.artistNet80} / ${bid.financialSummary.splitDistribution.earOs10} / ${bid.financialSummary.splitDistribution.vimume10} €`);
  console.log(`   SHA-256: ${bid.sha256Hash.substring(0, 24)}...`);
  console.log(`   Convoy Arsenal: ${bid.logistics.convoy ? `${bid.logistics.convoy.legs.length} vías` : 'N/A'}`);

  // Validaciones
  const splitOk =
    bid.financialSummary.splitDistribution.artistNet80 === Number((bid.financialSummary.baseBudget * 0.8).toFixed(2)) &&
    bid.financialSummary.splitDistribution.earOs10 === Number((bid.financialSummary.baseBudget * 0.1).toFixed(2)) &&
    bid.financialSummary.splitDistribution.vimume10 === Number((bid.financialSummary.baseBudget * 0.1).toFixed(2));

  const hashOk = bid.sha256Hash.length === 64;
  const splOk = bid.acousticRider.splLimitDb <= SPL_LIMIT_DB;

  if (splitOk && hashOk && splOk) {
    testsPassed++;
    console.log(`   ✅ LICITACIÓN #${i + 1} VALIDADA (Split + SHA-256 + SPL OK)`);
  } else {
    console.error(`   ❌ LICITACIÓN #${i + 1} FALLÓ (split:${splitOk} hash:${hashOk} spl:${splOk})`);
  }
});

// Validación específica del techo LCSP
const illescasBid = generateB2GArsenalBidPackage(tenders[2]);
const ceilingOk =
  illescasBid.financialSummary.baseBudget === SAFE_LCSP_CEILING &&
  illescasBid.financialSummary.adjustedCeilingApplied &&
  illescasBid.financialSummary.requiresLotBifurcation;

const elapsed = Date.now() - startTime;

console.log(`\n⏱️ Tiempo total de generación: ${elapsed} ms`);

if (testsPassed === totalTests && ceilingOk && elapsed < 3000) {
  console.log('\n✅ TEST PASSED: Radar B2G Arsenal Tender validado con éxito. Exit Code 0.');
  process.exit(0);
} else {
  console.error(`\n❌ TEST FAILED: ${testsPassed}/${totalTests} licitaciones OK. Techo LCSP: ${ceilingOk}.`);
  process.exit(1);
}
