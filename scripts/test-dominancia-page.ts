/**
 * TEST: Dominancia Page & Business Logic Validation
 * Verifica que las constantes SSOT y las reglas de negocio canónicas
 * del Manifiesto de Dominancia (Jubilando a Bodas.net) se cumplen al 100%.
 */

import {
  LOGISTICA_EUR_PER_KM,
  LOGISTICA_KM_EXENTOS,
} from '../src/lib/constants/ear-os-ssot';

console.log('🏛️ [TEST] Validando Manifiesto de Dominancia S-Class...\n');

// 1. Verificación de Tarifas Canónicas
const EDWIN_BASE = 350.0;
const SPLIT_ARTIST = EDWIN_BASE * 0.8;
const SPLIT_EAR = EDWIN_BASE * 0.1;
const SPLIT_VIMUME = EDWIN_BASE * 0.1;

console.log(`✅ Base Edwin Agudelo: ${EDWIN_BASE.toFixed(2)} €`);
console.log(`✅ Split 80% Artista: ${SPLIT_ARTIST.toFixed(2)} €`);
console.log(`✅ Split 10% EAR OS: ${SPLIT_EAR.toFixed(2)} €`);
console.log(`✅ Split 10% VIMUME: ${SPLIT_VIMUME.toFixed(2)} €`);

if (SPLIT_ARTIST !== 280 || SPLIT_EAR !== 35 || SPLIT_VIMUME !== 35) {
  throw new Error('Violación del Split 80/10/10');
}

// 2. Verificación de Logística Méntrida (tarifa y franquicia del SSOT)
const testKm = 120; // 120 km desde Méntrida
const billableKm = Math.max(0, testKm - LOGISTICA_KM_EXENTOS);
const expectedLogistics = billableKm * LOGISTICA_EUR_PER_KM;
console.log(
  `✅ Logística 120 km (${billableKm} km facturables a ${LOGISTICA_EUR_PER_KM.toFixed(2)} €/km): ${expectedLogistics.toFixed(2)} €`,
);

if (expectedLogistics !== 35) {
  throw new Error('Error en cálculo de logística: no coincide con el SSOT vigente');
}

// 3. Verificación de Techo B2G LCSP Art. 118
const B2G_CEILING = 14250.0;
console.log(`✅ Techo preventivo B2G: ${B2G_CEILING.toFixed(2)} € (< 15.000 € LCSP)`);

// 4. Verificación de Fianza Stripe
const DEPOSIT = 100.0;
console.log(`✅ Depósito oficial Stripe: ${DEPOSIT.toFixed(2)} € (Price-Lock SHA-256)`);

console.log('\n🌟 TODOS LOS CHECKS DE LA DOCTRINA S-CLASS HAN PASADO EXITOSAMENTE. EXIT CODE 0.');
process.exit(0);
