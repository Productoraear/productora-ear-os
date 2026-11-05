/**
 * ════════════════════════════════════════════════════════════════════════════
 * VERIFY_MUNICIPAL_FAST_TRACK.TS — TEST DE CONTRATO B2G Y SLA MARIACHIS (W50_T01)
 * ════════════════════════════════════════════════════════════════════════════
 */

import {
  generateMunicipalExpediente,
  buildMariachiRelayCascade,
  getActiveRelayProvider,
} from '../src/lib/b2g/municipal-fast-track-engine';
import {
  AJUSTE_PREVENTIVO_B2G_EUR,
  LIMITE_B2G_LCSP_EUR,
  DEPOSITO_STRIPE_EUR,
} from '../src/lib/constants/ear-os-ssot';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ ASSERTION FAILED: ${message}`);
    process.exit(1);
  }
}

console.log('🧪 Iniciando verificación de Motor B2G y Relevo SLA Mariachis...\n');

// 1. Expediente válido dentro del ajuste preventivo (14.250 €)
const validExpediente = generateMunicipalExpediente({
  municipality: 'Méntrida',
  province: 'Toledo',
  programType: 'FESTEJOS_POPULARES',
  requestedAmountEur: 12500,
  targetAudienceEstimate: 1200,
  eventDateIso: '2026-09-08',
});

assert(validExpediente.valid === true, 'Expediente <= 14.250 € debe ser válido');
assert(validExpediente.preventiveCeilingEur === AJUSTE_PREVENTIVO_B2G_EUR, 'Techo preventivo debe ser 14.250 €');
assert(validExpediente.maxLegalCeilingEur === LIMITE_B2G_LCSP_EUR, 'Techo legal debe ser 15.000 €');
assert(validExpediente.cpvCode === '92312000-1', 'CPV festejos populares exacto');
assert(validExpediente.acousticProtocol.maxDba === 102, 'Festejos populares permite hasta 102 dBA con limitador');
assert(validExpediente.socialImpactSroi.ratio === 4.85, 'SROI acreditado 4.85x');
console.log('✅ Expediente B2G Festejos Populares (< 14.250 €) verificado');

// 2. Expediente VIMUME Senior 40Hz
const vimumeExpediente = generateMunicipalExpediente({
  municipality: 'Talavera de la Reina',
  province: 'Toledo',
  programType: 'VIMUME_SENIOR_40HZ',
  requestedAmountEur: 4800,
  targetAudienceEstimate: 150,
  eventDateIso: '2026-10-15',
});

assert(vimumeExpediente.valid === true, 'Expediente VIMUME válido');
assert(vimumeExpediente.cpvCode === '85320000-8', 'CPV servicios sociales y neuroacústica');
assert(vimumeExpediente.acousticProtocol.maxDba === 75, 'Límite no invasivo <= 75 dBA en centros senior');
console.log('✅ Expediente B2G VIMUME Senior 40 Hz verificado');

// 3. Rechazo preventivo ante sobrecostes (> 14.250 €)
const invalidExpediente = generateMunicipalExpediente({
  municipality: 'Toledo Capital',
  province: 'Toledo',
  programType: 'GALA_CULTURAL',
  requestedAmountEur: 14500, // Supera 14.250 € aunque esté bajo 15.000 €
  targetAudienceEstimate: 2000,
  eventDateIso: '2026-11-20',
});

assert(invalidExpediente.valid === false, 'Debe rechazar expedientes > 14.250 € por principio preventivo');
assert(Boolean(invalidExpediente.reason), 'Debe incluir motivo de reparo preventivo');
console.log('✅ Filtro de Reparo Preventivo de Intervención (> 14.250 €) blindado');

// 4. Cascada de Relevo 15-Minutos Mariachis
const cascade = buildMariachiRelayCascade('BOOK-TEST-001', 'Madrid', [
  { id: 'm1', name: 'Mariachi A', phone: '+34 600 111 222' },
  { id: 'm2', name: 'Mariachi B', phone: '+34 600 333 444' },
  { id: 'm3', name: 'Mariachi C', phone: '+34 600 555 666' },
]);

assert(cascade.depositLockedEur === DEPOSITO_STRIPE_EUR, 'Depósito en fianza 100 €');
assert(cascade.roster.length === 3, '3 agrupaciones en la cascada');

// Minuto 5 -> Mariachi A
const activeAt5 = getActiveRelayProvider(cascade, 5);
assert(activeAt5?.id === 'm1', 'Minuto 5 debe asignar a Mariachi A (0-15 min)');

// Minuto 16 -> Relevo a Mariachi B
const activeAt16 = getActiveRelayProvider(cascade, 16);
assert(activeAt16?.id === 'm2', 'Minuto 16 debe saltar a Mariachi B (15-30 min)');

// Minuto 31 -> Relevo a Mariachi C
const activeAt31 = getActiveRelayProvider(cascade, 31);
assert(activeAt31?.id === 'm3', 'Minuto 31 debe saltar a Mariachi C (30-45 min)');

// Minuto 50 -> Expirado
const activeAt50 = getActiveRelayProvider(cascade, 50);
assert(activeAt50 === null, 'Minuto 50 ya ha agotado el roster');
console.log('✅ Cascada de Relevo Automático 15-Minutos Mariachis verificada');

console.log('\n🏆 TODOS LOS TESTS B2G Y MARIACHI SLA HAN PASADO EXITOSAMENTE (EXIT CODE 0)');

