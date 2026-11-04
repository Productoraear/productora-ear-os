import assert from 'node:assert/strict';
import {
  calculateFoundersParity,
  MAX_FOUNDERS_SLOTS,
  MARKET_REFERENCE_TIERS,
} from '../src/lib/founders/founders-parity-engine';
import {
  simulateUniversalProviderQuote,
} from '../src/lib/providers/universal-provider-simulator';

function run(): void {
  // 1. Cupo estricto de 100 Fundadores
  assert.equal(MAX_FOUNDERS_SLOTS, 100, 'MAX_FOUNDERS_SLOTS debe ser exactamente 100');

  // 2. Modalidad Paridad Fundador Vitalicio (iguala cuota al céntimo)
  const paritySilver = calculateFoundersParity({
    providerName: 'Finca El Olivar',
    category: 'Finca Nupcial',
    province: 'Madrid',
    mode: 'PARIDAD_FUNDADOR_VITALICIO',
    referenceTierId: 'tier_plata_212',
    competitorsShownOnOldProfile: 5,
    averageBookingTicketEur: 12000,
    estimatedBookingsPerYear: 15,
    confirmedFoundersCount: 12,
  });

  assert.equal(paritySilver.frozenMonthlyFeeCents, 21250);
  assert.equal(paritySilver.frozenMonthlyFeeEur, 212.5);
  assert.equal(paritySilver.frozenAnnualFeeEur, 2550);
  assert.equal(paritySilver.remainingFoundersSlots, 88);
  assert.ok(paritySilver.certificateCode.startsWith('EAR-FND100-'));

  // 3. Modalidad Puente Split 80/10/10 (0 €/mes de cuota fija)
  const splitMode = calculateFoundersParity({
    providerName: 'Catering Real',
    category: 'Catering',
    province: 'Toledo',
    mode: 'PUENTE_SPLIT_CERO_CUOTA',
    referenceTierId: 'tier_oro_271',
    competitorsShownOnOldProfile: 4,
    averageBookingTicketEur: 10000,
    estimatedBookingsPerYear: 10,
  });

  assert.equal(splitMode.frozenMonthlyFeeCents, 0);
  assert.equal(splitMode.frozenAnnualFeeEur, 0);
  assert.equal(splitMode.splitSimulationPerBooking.providerNet80Eur, 8000);
  assert.equal(splitMode.splitSimulationPerBooking.earOs10Eur, 1000);
  assert.equal(splitMode.splitSimulationPerBooking.vimumeSocial10Eur, 1000);
  assert.equal(splitMode.splitSimulationPerBooking.clientDepositLockEur, 100);

  // 4. Simulador Universal (Finca + Música + Tolerancia Elástica)
  const fincaSim = simulateUniversalProviderQuote({
    provider: {
      slug: 'finca-prueba',
      name: 'Finca Prueba',
      category: 'Finca para bodas',
      province: 'Madrid',
      basePriceEur: 110,
    },
    guestsPax: 100,
    coupleTotalBudgetEur: 22000,
    tolerancePct: 10,
  });

  assert.equal(fincaSim.archetype, 'banquete_finca');
  assert.equal(fincaSim.totalEstimatedEur, 11000);
  assert.equal(fincaSim.depositLockEur, 100);
  assert.equal(fincaSim.elasticFit.verdict, 'ENCAJE_EXACTO');

  console.log(
    JSON.stringify(
      {
        suite: 'verify_founders_parity_and_universal_simulator',
        tiersChecked: MARKET_REFERENCE_TIERS.length,
        verdict: 'PASS',
      },
      null,
      2,
    ),
  );
}

run();
