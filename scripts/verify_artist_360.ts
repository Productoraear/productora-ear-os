/**
 * ════════════════════════════════════════════════════════════════════════════
 * VERIFY_ARTIST_360.TS — TEST DE CONTRATO Y BLINDAJE ARTISTA 360 (W49_T04)
 * ════════════════════════════════════════════════════════════════════════════
 * 1) Valida cálculo de presupuestos respetando suelo Edwin Agudelo (350 €).
 * 2) Valida que el Split 80/10/10 no pierde ni un céntimo en rounding.
 * 3) Valida códigos ISRC correctos y rechazo de códigos fraudulentos.
 * ════════════════════════════════════════════════════════════════════════════
 */

import {
  calculateArtistQuote,
  settleArtistSplit,
  validateIsrc,
  generateCanonicalIsrc,
  EDWIN_AGUDELO_PROFILE_360,
  MIN_CACHE_BY_FORMAT,
} from '../src/lib/artists/artist-360-contract';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ ASSERTION FAILED: ${message}`);
    process.exit(1);
  }
}

console.log('🧪 Iniciando verificación de Artista 360 Sovereign Contract...\n');

// 1. Suelo inmutable Edwin Agudelo
const solistaQuote = calculateArtistQuote({
  format: 'SOLISTA',
  distanceKm: 40, // Dentro de los 50 km exentos
  endHour24: 1, // Antes de las 3:00 AM
  customBaseCacheEur: 200, // Intento de devaluación por debajo de 350 €
});

assert(solistaQuote.baseCacheEur === 350, 'El caché base debe mantenerse en el suelo de 350 €');
assert(solistaQuote.logisticsTotalEur === 0, 'Km dentro de los 50 km exentos no generan cargo logístico');
assert(solistaQuote.hotelSupplementEur === 0, 'No requiere hotel si fin < 3:00 y distancia <= 200 km');
assert(solistaQuote.totalEventEur === 350, 'Total evento solista base debe ser 350 €');
assert(solistaQuote.pendingFinalSettlementEur === 250, 'Liquidación pendiente debe ser 350 - 100 = 250 €');
console.log('✅ Suelo de Edwin Agudelo (350 €) blindado contra devaluaciones');

// 2. Logística y hotel
const mariachiQuote = calculateArtistQuote({
  format: 'MARIACHI',
  distanceKm: 250, // 200 km facturables tras 50 km exentos
  endHour24: 4, // Después de las 3:00 AM -> Hotel 120 €
});

assert(mariachiQuote.baseCacheEur === MIN_CACHE_BY_FORMAT.MARIACHI, 'Caché mariachi respetado');
assert(mariachiQuote.chargeableKm === 200, '250 km - 50 km exentos = 200 km');
assert(mariachiQuote.logisticsTotalEur === 300, '200 km * 1.50 €/km = 300 €');
assert(mariachiQuote.hotelSupplementEur === 120, 'Distancia > 200 km y hora >= 3:00 activa hotel de 120 €');
assert(mariachiQuote.totalEventEur === 650 + 300 + 120, 'Cálculo total evento exacto');
console.log('✅ Logística (1,50 €/km > 50 km) y Hotel (120 €) verificados');

// 3. Split Soberano 80/10/10 sin pérdida de céntimos
const split = settleArtistSplit(1070);
assert(split.artistAmountEur === 856.0, '80% de 1070 € = 856.0 €');
assert(split.earOsAmountEur === 107.0, '10% de 1070 € = 107.0 €');
assert(split.vimumeAmountEur === 107.0, '10% de 1070 € = 107.0 €');
assert(split.artistAmountEur + split.earOsAmountEur + split.vimumeAmountEur === 1070.0, 'La suma del split debe ser exactamente 1070.0 €');
console.log('✅ Split 80/10/10 matemático exacto');

// 4. Validación ISRC
const validIsrc = validateIsrc('ES-EAR-26-00042');
assert(validIsrc.valid === true, 'ES-EAR-26-00042 debe ser válido');
assert(validIsrc.country === 'ES', 'País ES');
assert(validIsrc.registrant === 'EAR', 'Registrante EAR');

const invalidIsrc = validateIsrc('US-XYZ-99-12345');
assert(invalidIsrc.valid === false, 'Debe rechazar ISRC sin prefijo ES-EAR');

const generated = generateCanonicalIsrc(26, 7);
assert(generated === 'ES-EAR-26-00007', 'Generador debe formatear con padding de 5 dígitos');
console.log('✅ Auditor y Generador ISRC (ISO 3901) verificados');

console.log('\n🏆 TODOS LOS TESTS DE ARTISTA 360 HAN PASADO EXITOSAMENTE (EXIT CODE 0)');

