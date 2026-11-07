/**
 * ════════════════════════════════════════════════════════════════════════════
 * ADVERSARIAL STRESS TEST HARNESS — MILESTONE 3 (UI B2B ESCAPARATE & SIMULADOR)
 * ════════════════════════════════════════════════════════════════════════════
 * Challenger: `challenger_m3_2`
 * Reference: `ORIGINAL_REQUEST.md` (R1, R2, R3, R5) · `AGENTS.md` (§4, §5, §6)
 *
 * Test Suites:
 *  1. Contact-Gate & Phone Sanitization (maskPhone edge cases & Centralita unmasked).
 *  2. 0% Competitor Ad Leak Verification (absence of NeuralNavigation and rival ads).
 *  3. B2B Portal & Pacto 100 Fundadores Price-Match Stress (floor 50€, 3.800€/yr, 42+58=100).
 *  4. Technical Visit Lock Contract (Zod schema validation on all 12 fincas & failure modes).
 *  5. Menu Simulator 2026 & Integer-Cents Financial Invariants (80/10/10, 12 W/pax, 100€).
 *  6. Pure OLED Layout Compliance (zero w-screen, overflow-x-hidden present).
 * ════════════════════════════════════════════════════════════════════════════
 */

import fs from 'node:fs';
import path from 'node:path';
import { maskPhone } from '../src/features/bodas/ui/FincasCatalogExplorer';
import { CENTRALITA } from '../src/lib/phone-constants';
import {
  CENTRALITA_EAR_OS,
  DEPOSITO_STRIPE_EUR,
  TARIFA_BASE_SOLISTA_EUR,
  SPLIT_SOBERANO,
} from '../src/lib/constants/ear-os-ssot';
import {
  calculateFounderFeeMatch,
  calculateLifetimePortalSavings,
  PACTO_100_FUNDADORES_SSOT,
} from '../src/lib/fincas/fincaMetricsEngine';
import { SCLASS_12_FINCAS_HOMOLOGADAS } from '../src/lib/constants/fincas-catalog';
import { FincaVisitLockRequestSchema } from '../src/app/api/fincas/visit-lock/route';
import { calculateFincaEventPricing } from '../src/lib/fincas/fincaMenuPricingEngine';

const ROOT = process.cwd();

interface StressAssertion {
  suite: string;
  name: string;
  passed: boolean;
  error?: string;
}

const assertions: StressAssertion[] = [];

function assert(suite: string, condition: boolean, name: string, errorDetail?: string) {
  if (condition) {
    assertions.push({ suite, name, passed: true });
    console.log(`  \x1b[32m✓\x1b[0m [${suite}] ${name}`);
  } else {
    assertions.push({ suite, name, passed: false, error: errorDetail || 'Assertion failed' });
    console.error(`  \x1b[31m✗\x1b[0m [${suite}] ${name}`);
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

console.log('\n\x1b[1m\x1b[35m═══════════════════════════════════════════════════════════════════════════════\x1b[0m');
console.log('\x1b[1m\x1b[35m  ADVERSARIAL STRESS TEST SUITE — CHALLENGER M3.2 (EMPIRICAL VERIFICATION)   \x1b[0m');
console.log('\x1b[1m\x1b[35m═══════════════════════════════════════════════════════════════════════════════\x1b[0m\n');

// ─────────────────────────────────────────────────────────────────────────────
// SUITE 1: CONTACT-GATE & PHONE SANITIZATION
// ─────────────────────────────────────────────────────────────────────────────
console.log('\x1b[1m\x1b[36m━━━ SUITE 1: CONTACT-GATE & PHONE SANITIZATION ━━━\x1b[0m');

// 1.1 Formatos variados de teléfonos
const testCases: Array<{ input: any; label: string; mustContain: string; mustNotContain?: string[] }> = [
  {
    input: '+34 925 123 456',
    label: 'Prefijo +34 con espacios estándar',
    mustContain: '•••',
    mustNotContain: ['123', '456'],
  },
  {
    input: '+34 600 000 000',
    label: 'Móvil +34 con espacios estándar',
    mustContain: '•••',
    mustNotContain: ['000 000', '000000'],
  },
  {
    input: '912345678',
    label: 'Número nacional 9 dígitos sin prefijo',
    mustContain: '•••',
    mustNotContain: ['45678', '345678'],
  },
  {
    input: null,
    label: 'Valor null defensivo',
    mustContain: '••• ••• •••',
  },
  {
    input: undefined,
    label: 'Valor undefined defensivo',
    mustContain: '••• ••• •••',
  },
  {
    input: '',
    label: 'Cadena vacía',
    mustContain: '••• ••• •••',
  },
  {
    input: '   ',
    label: 'Cadena de espacios en blanco',
    mustContain: '•••',
  },
  {
    input: '+1 555 123 4567',
    label: 'Formato internacional USA (+1)',
    mustContain: '•••',
    mustNotContain: ['123 4567', '4567'],
  },
  {
    input: '+44 20 7946 0919',
    label: 'Formato internacional UK (+44)',
    mustContain: '•••',
    mustNotContain: ['7946 0919', '0919'],
  },
];

for (const tc of testCases) {
  const result = maskPhone(tc.input);
  assert(
    'Contact-Gate',
    result.includes(tc.mustContain),
    `maskPhone(${tc.label}) contiene máscara "${tc.mustContain}" -> "${result}"`
  );

  if (tc.mustNotContain) {
    for (const forbidden of tc.mustNotContain) {
      assert(
        'Contact-Gate',
        !result.includes(forbidden),
        `maskPhone(${tc.label}) NO fuga dígitos privados "${forbidden}" -> resultado: "${result}"`
      );
    }
  }
}

// 1.2 Verificación sobre las 12 fincas homologadas reales
for (const finca of SCLASS_12_FINCAS_HOMOLOGADAS) {
  const rawPhone = finca.directorioContacto.telefono;
  const masked = maskPhone(rawPhone);
  const cleanDigits = rawPhone.replace(/\D/g, '');
  const last4 = cleanDigits.slice(-4);

  assert(
    'Contact-Gate',
    masked !== rawPhone,
    `Finca ${finca.id}: teléfono enmascarado "${masked}" difiere del original "${rawPhone}"`
  );
  assert(
    'Contact-Gate',
    !masked.includes(last4),
    `Finca ${finca.id}: últimos 4 dígitos (${last4}) están bloqueados en la máscara "${masked}"`
  );
}

// 1.3 Verificación de Centralita Oficial unmasked
assert(
  'Contact-Gate',
  CENTRALITA.display === '+34 693 693 048',
  `Centralita oficial en phone-constants es canónica (+34 693 693 048): "${CENTRALITA.display}"`
);
assert(
  'Contact-Gate',
  CENTRALITA_EAR_OS === '+34 693 693 048',
  `Centralita oficial en ear-os-ssot es canónica (+34 693 693 048): "${CENTRALITA_EAR_OS}"`
);

const catalogExplorerCode = readFile('src/features/bodas/ui/FincasCatalogExplorer.tsx');
assert(
  'Contact-Gate',
  catalogExplorerCode.includes('{CENTRALITA.display}'),
  'FincasCatalogExplorer muestra Centralita Oficial unmasked como canal de soporte'
);
assert(
  'Contact-Gate',
  !catalogExplorerCode.includes('maskPhone(CENTRALITA'),
  'FincasCatalogExplorer NUNCA enmascara la Centralita Oficial'
);

// ─────────────────────────────────────────────────────────────────────────────
// SUITE 2: 0% COMPETITOR AD LEAK VERIFICATION
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n\x1b[1m\x1b[36m━━━ SUITE 2: 0% COMPETITOR AD LEAK VERIFICATION ━━━\x1b[0m');

const targetFiles = [
  'src/features/bodas/ui/FincasCatalogExplorer.tsx',
  'src/app/(public)/fincas/page.tsx',
  'src/components/fincas/FincasB2BPortal.tsx',
  'src/components/fincas/FincaMenuSimulator2026.tsx',
];

for (const file of targetFiles) {
  const content = readFile(file);
  assert(
    'Zero-Ad-Leak',
    !content.includes('NeuralNavigation'),
    `${file}: Erradicación total de NeuralNavigation (cero recomendaciones de competidores)`
  );
}

assert(
  'Zero-Ad-Leak',
  !catalogExplorerCode.includes('otras fincas') && !catalogExplorerCode.includes('espacios recomendados'),
  'FincasCatalogExplorer: Ausencia total de carruseles de recomendación competidora'
);
assert(
  'Zero-Ad-Leak',
  catalogExplorerCode.includes('0% Fuga a Competidores') || catalogExplorerCode.includes('Garantía Contractual 0% Fuga'),
  'FincasCatalogExplorer: Exhibe la Garantía Contractual de Exclusividad y 0% Fuga'
);

// ─────────────────────────────────────────────────────────────────────────────
// SUITE 3: B2B PORTAL & PACTO 100 FUNDADORES PRICE-MATCH STRESS
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n\x1b[1m\x1b[36m━━━ SUITE 3: B2B PORTAL & PACTO 100 FUNDADORES PRICE-MATCH STRESS ━━━\x1b[0m');

// 3.1 Pruebas de simulación de cuota anterior (Price-Match)
const feeStressCases = [
  { inputFee: 0, expectedFee: 250, label: '0 € (sin cuota previa -> aplica defecto de portal 250 €)' },
  { inputFee: 30, expectedFee: 50, label: '30 € (por debajo del suelo de 50 € -> aplica suelo 50 €)' },
  { inputFee: 50, expectedFee: 50, label: '50 € (exactamente el suelo -> iguala 50 €)' },
  { inputFee: 120, expectedFee: 120, label: '120 €/mes -> iguala 120 €/mes' },
  { inputFee: 350, expectedFee: 350, label: '350 €/mes -> iguala 350 €/mes' },
  { inputFee: 1200, expectedFee: 1200, label: '1.200 €/mes -> iguala 1.200 €/mes' },
  { inputFee: 5000, expectedFee: 5000, label: '5.000 €/mes -> iguala 5.000 €/mes' },
];

for (const sc of feeStressCases) {
  const matchResult = calculateFounderFeeMatch(sc.inputFee, { currentFoundersEnrolled: 42 });
  assert(
    'Price-Match',
    matchResult.matchedMonthlyFeeEur === sc.expectedFee,
    `Price-Match: ${sc.label} -> matchedMonthlyFeeEur = ${matchResult.matchedMonthlyFeeEur} €`
  );
  assert(
    'Price-Match',
    matchResult.matchedAnnualFeeEur === sc.expectedFee * 12,
    `Price-Match: Cuota anual = ${sc.expectedFee * 12} € (12 meses sin IPC)`
  );
  assert(
    'Price-Match',
    matchResult.lifetimePriceLock === true,
    `Price-Match: Cláusula de blindaje vitalicio activa para cuota ${sc.inputFee} €`
  );
}

// 3.2 Valor de Lead Retenido (3.800 €/año) y Ahorro Acumulado
const lifetimeResult = calculateFounderFeeMatch(250, {
  currentFoundersEnrolled: 42,
  horizonYears: 5,
  projectedAnnualWeddings: 20,
  averageWeddingTicketEur: 3800,
});

assert(
  'Price-Match',
  PACTO_100_FUNDADORES_SSOT.VALOR_LEAD_PERDIDO_ESTIMADO_EUR === 3800,
  'SSOT: Valor del lead retenido fijado en 3.800 €/año'
);
assert(
  'Price-Match',
  lifetimeResult.summaryLifetimeSavingsEur.totalFugaRetentionSavingsEur === 5 * 3800,
  `Ahorro total por retención de leads a 5 años = 19.000 € (obtenido: ${lifetimeResult.summaryLifetimeSavingsEur.totalFugaRetentionSavingsEur} €)`
);
assert(
  'Price-Match',
  lifetimeResult.summaryLifetimeSavingsEur.totalFeeInflationSavingsEur > 0,
  `Ahorro por congelación de IPC > 0 € (obtenido: ${lifetimeResult.summaryLifetimeSavingsEur.totalFeeInflationSavingsEur} €)`
);

// 3.3 Gestión de Cupo (100 plazas de Fundadores)
const slotTest42 = calculateFounderFeeMatch(250, { currentFoundersEnrolled: 42 });
assert(
  'Price-Match',
  slotTest42.eligibleForFounderPact === true,
  'Cupo actual: 42 inscritas es elegible para Fundador'
);
assert(
  'Price-Match',
  slotTest42.founderSlotNumber === 43,
  'Cupo actual: Próxima plaza a asignar es la #43'
);
assert(
  'Price-Match',
  slotTest42.remainingSlots === 58,
  'Cupo actual: 58 plazas disponibles restantes (42 + 58 = 100)'
);
assert(
  'Price-Match',
  42 + slotTest42.remainingSlots === 100,
  'Cupo invariante: Total inscritas (42) + disponibles (58) === 100 plazas totales'
);

// Casos límite de cupo agotado
const slotTest100 = calculateFounderFeeMatch(250, { currentFoundersEnrolled: 100 });
assert(
  'Price-Match',
  slotTest100.eligibleForFounderPact === false,
  'Cupo 100 inscritas: eligibleForFounderPact es FALSE (cupo agotado)'
);
assert(
  'Price-Match',
  slotTest100.remainingSlots === 0,
  'Cupo 100 inscritas: 0 plazas restantes'
);
assert(
  'Price-Match',
  slotTest100.founderSlotNumber === null,
  'Cupo 100 inscritas: founderSlotNumber es null'
);

// ─────────────────────────────────────────────────────────────────────────────
// SUITE 4: TECHNICAL VISIT LOCK CONTRACT (ZOD VALIDATION)
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n\x1b[1m\x1b[36m━━━ SUITE 4: TECHNICAL VISIT LOCK CONTRACT ━━━\x1b[0m');

// 4.1 Validar que los payloads generados para TODAS las 12 fincas homologadas cumplen el contrato
for (const finca of SCLASS_12_FINCAS_HOMOLOGADAS) {
  const modalPayload = {
    fincaId: finca.id,
    fincaName: finca.name,
    contactName: 'Elena Martínez',
    contactEmail: 'elena.martinez@ejemplo.com',
    contactPhone: '+34 612 345 678',
    desiredVisitDate: '2026-06-25',
    timeSlot: 'MORNING' as const,
    locationAddress: finca.location,
    municipio: finca.location.split('(')[0]?.trim() || finca.location,
    provincia: finca.provincia,
    distanceHubKm: finca.distanciaHubMentridaKm,
    notes: 'Revisión técnica de sonido exterior y límites acústicos.',
  };

  const parseResult = FincaVisitLockRequestSchema.safeParse(modalPayload);
  assert(
    'Visit-Lock-Contract',
    parseResult.success,
    `Payload para finca "${finca.id}" cumple FincaVisitLockRequestSchema (Zod)`
  );
}

// 4.2 Adversarial stress cases para el endpoint POST /api/fincas/visit-lock
const invalidCases: Array<{ payload: any; expectedField: string; label: string }> = [
  {
    payload: {
      fincaId: '',
      fincaName: 'Finca Test',
      contactName: 'Juan',
      contactEmail: 'juan@test.com',
      contactPhone: '600123456',
      desiredVisitDate: '2026-07-01',
      locationAddress: 'Madrid',
      municipio: 'Madrid',
      provincia: 'Madrid',
    },
    expectedField: 'fincaId',
    label: 'fincaId vacío',
  },
  {
    payload: {
      fincaId: 'finca-1',
      fincaName: 'Finca Test',
      contactName: '',
      contactEmail: 'juan@test.com',
      contactPhone: '600123456',
      desiredVisitDate: '2026-07-01',
      locationAddress: 'Madrid',
      municipio: 'Madrid',
      provincia: 'Madrid',
    },
    expectedField: 'contactName',
    label: 'contactName vacío',
  },
  {
    payload: {
      fincaId: 'finca-1',
      fincaName: 'Finca Test',
      contactName: 'Juan',
      contactEmail: 'correo_invalido_sin_arroba',
      contactPhone: '600123456',
      desiredVisitDate: '2026-07-01',
      locationAddress: 'Madrid',
      municipio: 'Madrid',
      provincia: 'Madrid',
    },
    expectedField: 'contactEmail',
    label: 'contactEmail mal formado',
  },
  {
    payload: {
      fincaId: 'finca-1',
      fincaName: 'Finca Test',
      contactName: 'Juan',
      contactEmail: 'juan@test.com',
      contactPhone: '12345', // Menos de 9 dígitos
      desiredVisitDate: '2026-07-01',
      locationAddress: 'Madrid',
      municipio: 'Madrid',
      provincia: 'Madrid',
    },
    expectedField: 'contactPhone',
    label: 'contactPhone con menos de 9 dígitos',
  },
  {
    payload: {
      fincaId: 'finca-1',
      fincaName: 'Finca Test',
      contactName: 'Juan',
      contactEmail: 'juan@test.com',
      contactPhone: '600123456',
      desiredVisitDate: '01-07-2026', // Formato no YYYY-MM-DD
      locationAddress: 'Madrid',
      municipio: 'Madrid',
      provincia: 'Madrid',
    },
    expectedField: 'desiredVisitDate',
    label: 'desiredVisitDate con formato erróneo (no YYYY-MM-DD)',
  },
  {
    payload: {
      fincaId: 'finca-1',
      fincaName: 'Finca Test',
      contactName: 'Juan',
      contactEmail: 'juan@test.com',
      contactPhone: '600123456',
      desiredVisitDate: '2026-07-01',
      locationAddress: 'Madrid',
      municipio: 'Madrid',
      provincia: 'Madrid',
      distanceHubKm: -15, // Negativo
    },
    expectedField: 'distanceHubKm',
    label: 'distanceHubKm negativo',
  },
];

for (const ic of invalidCases) {
  const result = FincaVisitLockRequestSchema.safeParse(ic.payload);
  assert(
    'Visit-Lock-Contract',
    !result.success,
    `Rechazo esperado en payload inválido: ${ic.label}`
  );
  if (!result.success) {
    const errorPaths = result.error.issues.map((i) => i.path.join('.'));
    assert(
      'Visit-Lock-Contract',
      errorPaths.includes(ic.expectedField),
      `El campo erróneo reportado contiene "${ic.expectedField}"`
    );
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// SUITE 5: MENU SIMULATOR 2026 & INTEGER-CENTS FINANCIAL INVARIANTS
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n\x1b[1m\x1b[36m━━━ SUITE 5: MENU SIMULATOR 2026 & FINANCIAL INVARIANTS ━━━\x1b[0m');

// 5.1 Tarifa Solista SSOT (350 €)
assert(
  'Invariants',
  TARIFA_BASE_SOLISTA_EUR === 350,
  `Tarifa Base Solista canónica = 350,00 € (obtenido: ${TARIFA_BASE_SOLISTA_EUR} €)`
);

// 5.2 Depósito Stripe SSOT (100 €)
assert(
  'Invariants',
  DEPOSITO_STRIPE_EUR === 100,
  `Depósito Stripe Price-Lock canónico = 100,00 € (obtenido: ${DEPOSITO_STRIPE_EUR} €)`
);

// 5.3 Split Soberano 80/10/10
assert(
  'Invariants',
  SPLIT_SOBERANO.artistaPct === 0.8 &&
    SPLIT_SOBERANO.earOsPct === 0.1 &&
    SPLIT_SOBERANO.vimumePct === 0.1,
  'Split Soberano inmutable: 80% Artista / 10% EAR OS / 10% VIMUME'
);

// 5.4 Test de estrés del motor de pricing para aforos extremos y distancias
const pricingStressInputs = [
  { guests: 20, km: 0, time: '22:00', label: 'Evento íntimo 20 pax local' },
  { guests: 120, km: 45, time: '02:00', label: 'Boda típica 120 pax km 45 (sin hotel ni km facturable)' },
  { guests: 250, km: 90, time: '02:00', label: 'Boda 250 pax km 90 (40 km facturables a 1.50 €/km = 60 €)' },
  { guests: 300, km: 220, time: '04:00', label: 'Gran evento 300 pax km 220 fin 04:00 (hotel + km facturables)' },
];

for (const psi of pricingStressInputs) {
  const pResult = calculateFincaEventPricing({
    menuId: 'boda-cantabrico',
    guestCount: psi.guests,
    selectedExtraIds: ['solista-edwin'],
    distanceKm: psi.km,
    eventEndTime: psi.time,
    affiliateCommissionPct: 0.12,
  });

  assert(
    'PricingEngine',
    Number.isInteger(pResult.subtotalCents),
    `${psi.label}: Subtotal es céntimo entero exacto (${pResult.subtotalCents} cts)`
  );
  assert(
    'PricingEngine',
    Number.isInteger(pResult.totalWithIvaCents),
    `${psi.label}: Total con IVA es céntimo entero exacto (${pResult.totalWithIvaCents} cts)`
  );
  assert(
    'PricingEngine',
    pResult.acousticRider.recommendedWatts === psi.guests * 12,
    `${psi.label}: Rider acústico = ${psi.guests * 12} W (12 W/pax exacto)`
  );
  assert(
    'PricingEngine',
    pResult.acousticRider.isCompliantWithHealthStandard === true,
    `${psi.label}: Cumple estándar de salud pública (< 75 dB SPL)`
  );
  assert(
    'PricingEngine',
    pResult.depositDeductibleCents === 10000,
    `${psi.label}: Fianza deducible = 100,00 € (10.000 cts)`
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SUITE 6: PURE OLED LAYOUT COMPLIANCE (NO W-SCREEN)
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n\x1b[1m\x1b[36m━━━ SUITE 6: PURE OLED LAYOUT COMPLIANCE ━━━\x1b[0m');

for (const file of targetFiles) {
  const content = readFile(file);
  assert(
    'Layout-OLED',
    !/\bw-screen\b/.test(content),
    `${file}: Cero ocurrencias de clase \`w-screen\` (prohibida por provocar horizontal scroll)`
  );
  assert(
    'Layout-OLED',
    /\boverflow-x-hidden\b/.test(content),
    `${file}: Contenedor con \`overflow-x-hidden\` para control de viewport estricto`
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// RESUMEN FINAL DE LA AUDITORÍA DE ESTRÉS
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n\x1b[1m\x1b[35m═══════════════════════════════════════════════════════════════════════════════\x1b[0m');
console.log('\x1b[1m\x1b[35m  RESUMEN FINAL DE PRUEBAS ADVERSARIALES (CHALLENGER M3.2)                     \x1b[0m');
console.log('\x1b[1m\x1b[35m═══════════════════════════════════════════════════════════════════════════════\x1b[0m');

const total = assertions.length;
const passed = assertions.filter((a) => a.passed).length;
const failed = total - passed;

console.log(`\nTotal Aserciones de Estrés: ${total}`);
console.log(`\x1b[32mExitosas: ${passed}\x1b[0m`);

if (failed > 0) {
  console.log(`\x1b[31mFallidas: ${failed}\x1b[0m\n`);
  process.exit(1);
} else {
  console.log(`\x1b[32m\x1b[1m¡TODAS LAS PRUEBAS ADVERSARIALES DE ESTRÉS PASARON CON ÉXITO! (VEREDICTO: APROBADO)\x1b[0m\n`);
  process.exit(0);
}
