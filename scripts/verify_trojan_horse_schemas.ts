/**
 * ════════════════════════════════════════════════════════════════════════════
 * ARNES DE VERIFICACIÓN FORMAL — PACK CABALLO DE TROYA (v1.0 S-CLASS)
 * ════════════════════════════════════════════════════════════════════════════
 * Ejecuta validaciones matemáticas y de contratos de datos sin mockups ni fachadas:
 *   1. Algoritmos de validación formal DNI, NIE y CIF societario (módulo 23 y control).
 *   2. Validador bancario internacional IBAN ISO 13616 (MOD-97-10 con BigInt).
 *   3. Paridad taxonómica y completitud de 380 campos en las 8 categorías del Caballo de Troya.
 *   4. Restricciones del Seating Planner (2 a 12 comensales) y recuento de dietas/alérgenos.
 *   5. Doctrina del Contact-Gate y cláusula anti-fraude con literal estricto.
 *
 * Salida: Exit Code 0 si todas las aserciones pasan. Exit Code 1 ante cualquier fallo.
 * ════════════════════════════════════════════════════════════════════════════
 */

import {
  ProviderProfileCategoryEnum,
  ProviderProfileFieldSchema,
  ProviderTrojanOnboardingSchema,
  validateCifNif,
  validateIbanIso13616,
  formatContactGatePhone,
  mapTrojanCategoryToCatalog,
  getCategoryFields,
  type ProviderProfileCategory,
} from '../src/lib/providers/trojan-horse-schema';

import {
  clampSeats,
  tableSeatRange,
  seatCapacity,
  tallyDietary,
  tallyDietaryByTable,
  addGuest,
  seatGuest,
  buildDefaultPlan,
  type SeatingPlan,
  type DietaryTag,
} from '../src/lib/seating/seating-plan';

import { CENTRALITA_EAR_OS } from '../src/lib/constants/ear-os-ssot';

let assertionsRun = 0;

function assert(condition: boolean, message: string): void {
  assertionsRun++;
  if (!condition) {
    console.error(`❌ [FALLO DE ASERCIÓN]: ${message}`);
    process.exit(1);
  }
}

console.log('═'.repeat(78));
console.log('🔍 INICIANDO AUDITORÍA FORENSE — PACK CABALLO DE TROYA');
console.log('═'.repeat(78));

// ─────────────────────────────────────────────────────────────────────────────
// 1. VALIDACIÓN FORMAL CIF / NIF / NIE (MÓDULO 23 Y CONTROL SOCIETARIO)
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n[BLOQUE 1/5] Verificando algoritmos formales DNI / NIE / CIF...');

// 1.1 DNI Válidos e Inválidos
assert(validateCifNif('12345678Z'), 'DNI 12345678Z debe ser válido');
assert(validateCifNif('00000000T'), 'DNI 00000000T debe ser válido');
assert(validateCifNif('44444444A'), 'DNI 44444444A debe ser válido');
assert(!validateCifNif('12345678A'), 'DNI 12345678A debe ser rechazado (letra incorrecta)');
assert(!validateCifNif('1234567Z'), 'DNI corto debe ser rechazado');
assert(!validateCifNif('123456789Z'), 'DNI largo debe ser rechazado');
assert(!validateCifNif('ABCDEFGHZ'), 'DNI no numérico debe ser rechazado');

// 1.2 NIE Válidos e Inválidos
assert(validateCifNif('X1234567L'), 'NIE X1234567L debe ser válido');
assert(validateCifNif('Y1234567X'), 'NIE Y1234567X debe ser válido');
assert(validateCifNif('Z1234567R'), 'NIE Z1234567R debe ser válido');
assert(!validateCifNif('X1234567A'), 'NIE X1234567A debe ser rechazado (letra incorrecta)');
assert(!validateCifNif('W1234567L'), 'NIE con prefijo inválido W debe ser rechazado');

// 1.3 CIF Societario Válidos e Inválidos
assert(validateCifNif('A58818501'), 'CIF Sociedad Anónima A58818501 debe ser válido');
assert(validateCifNif('B12345674'), 'CIF Sociedad Limitada B12345674 debe ser válido');
assert(validateCifNif('P0000000J'), 'CIF Organismo Público P0000000J debe ser válido');
assert(!validateCifNif('A58818509'), 'CIF A58818509 con control erróneo debe ser rechazado');
assert(!validateCifNif('B12345679'), 'CIF B12345679 con control erróneo debe ser rechazado');
assert(!validateCifNif('P00000001'), 'CIF P00000001 debe exigir letra de control');
assert(!validateCifNif(''), 'CIF vacío debe ser rechazado');

console.log('  ✅ DNI, NIE y CIF validados con algoritmos matemáticos formales.');

// ─────────────────────────────────────────────────────────────────────────────
// 2. VALIDACIÓN BANCARIA INTERNACIONAL IBAN ISO 13616 (MOD-97 CON BIGINT)
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n[BLOQUE 2/5] Verificando validador bancario ISO 13616 con BigInt...');

// Función auxiliar determinista para generar IBAN válido según ISO 13616
function generateValidSpanishIban(bban: string): string {
  const rearranged = bban + '142800'; // ES = 14 28, 00
  const rem = BigInt(rearranged) % 97n;
  const check = 98n - rem;
  const checkStr = String(check).padStart(2, '0');
  return `ES${checkStr}${bban}`;
}

const validIban1 = generateValidSpanishIban('00491500051234567892');
const validIban2 = generateValidSpanishIban('21000418450200051332');

assert(validateIbanIso13616(validIban1), `IBAN generado ${validIban1} debe ser válido según MOD-97`);
assert(validateIbanIso13616(validIban2), `IBAN generado ${validIban2} debe ser válido según MOD-97`);

// Comprobación de espacios y guiones permitidos
assert(validateIbanIso13616(`  ${validIban1.slice(0, 4)} ${validIban1.slice(4, 8)} ${validIban1.slice(8)}  `), 'IBAN con espacios debe ser normalizado');

// Comprobación de IBAN internacional alfanumérico válido (Francia con carácter M en RIB)
assert(validateIbanIso13616('FR1420041010050500013M02606'), 'IBAN internacional francés alfanumérico válido debe ser aceptado');

// Inválidos
const corruptedIban = validIban1.slice(0, 2) + (validIban1.slice(2, 4) === '12' ? '13' : '12') + validIban1.slice(4);
assert(!validateIbanIso13616(corruptedIban), 'IBAN con dígito de control corrupto debe ser rechazado');
assert(!validateIbanIso13616('ES1234567890'), 'IBAN español de menos de 24 caracteres debe ser rechazado');
assert(!validateIbanIso13616('ES1234567890123456789012345'), 'IBAN español de más de 24 caracteres debe ser rechazado');
assert(!validateIbanIso13616('FR1420041010050500013M02699'), 'IBAN con caracteres o mod97 inconsistente debe ser verificado estrictamente');

console.log('  ✅ Validación bancaria ISO 13616 (MOD-97-10) verificada con BigInt.');

// ─────────────────────────────────────────────────────────────────────────────
// 3. COMPLETITUD Y PARIDAD TAXONÓMICA: 380 CAMPOS EN LAS 8 CATEGORÍAS
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n[BLOQUE 3/5] Verificando exactitud de 380 campos en las 8 categorías...');

const categories = ProviderProfileCategoryEnum.options;
assert(categories.length === 8, 'Deben existir exactamente 8 categorías en ProviderProfileCategoryEnum');

for (const cat of categories) {
  const fields = getCategoryFields(cat);
  assert(
    fields.length === 380,
    `Categoría ${cat} debe ensamblar exactamente 380 campos (obtenidos: ${fields.length})`,
  );

  // Comprobar ausencia de duplicados
  const keys = new Set<string>();
  for (const f of fields) {
    assert(!keys.has(f.key), `Clave duplicada ${f.key} detectada en categoría ${cat}`);
    keys.add(f.key);

    // Fail-closed check: ningún campo sensible puede ser público
    if (f.sensitive === true) {
      assert(f.publicVisible !== true, `Campo sensible ${f.key} en ${cat} no puede tener publicVisible: true`);
    }
  }

  // Comprobar mapeo a catálogo
  const catalogKey = mapTrojanCategoryToCatalog(cat);
  assert(catalogKey.length > 0, `Mapeo a clave de catálogo para ${cat} no puede ser vacío`);
  console.log(`    · ${cat.padEnd(26)} -> catálogo: ${catalogKey.padEnd(12)} (${fields.length} campos tipados)`);
}

console.log('  ✅ Las 8 categorías del Caballo de Troya cumplen exactamente 380 campos con 0 duplicados.');

// ─────────────────────────────────────────────────────────────────────────────
// 4. SEATING PLANNER PULPETTI: DIETAS, ALÉRGENOS Y RESTRICCIÓN 2–12 PLAZAS
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n[BLOQUE 4/5] Verificando Seating Planner (Estándar Pulpetti), tallies y límites 2-12...');

// 4.1 Inviolabilidad de las 2 a 12 plazas
assert(clampSeats('round', 1) === 2, 'clampSeats(round, 1) debe elevar a mínimo 2 plazas');
assert(clampSeats('round', 15) === 12, 'clampSeats(round, 15) debe acotar a máximo 12 plazas');
assert(clampSeats('rectangular', 0) === 2, 'clampSeats(rectangular, 0) debe elevar a 2 plazas');
assert(clampSeats('rectangular', 20) === 10, 'clampSeats(rectangular, 20) debe acotar a máximo 10 plazas');
assert(clampSeats('presidential', 99) === 12, 'clampSeats(presidential, 99) debe respetar el tope de 12 plazas');

const rangeRound = tableSeatRange('round');
assert(rangeRound.min === 2 && rangeRound.max === 12, 'tableSeatRange(round) debe ser exactamente [2, 12]');
assert(seatCapacity('presidential') <= 12, 'seatCapacity(presidential) no debe superar el límite constitucional de 12 plazas');
assert(seatCapacity('presidential') === 12, 'seatCapacity(presidential) debe ser exactamente 12 plazas');

// 4.2 Desglose de Dietas y Alérgenos de Cocina
let plan: SeatingPlan = buildDefaultPlan({ pax: 80, eventName: 'Banquete Test Alérgenos' });

// Añadir invitados con dietas específicas
plan = addGuest(plan, {
  name: 'Comensal Celíaco 1',
  tag: 'amigos',
  dietary: ['celiaco', 'sin-lactosa'],
});
plan = addGuest(plan, {
  name: 'Comensal Vegano 2',
  tag: 'amigos',
  dietary: ['vegano'],
});
plan = addGuest(plan, {
  name: 'Comensal Celíaco 3',
  tag: 'amigos',
  dietary: ['celiaco'],
});
plan = addGuest(plan, {
  name: 'Comensal Alergia Marisco 4',
  tag: 'amigos',
  dietary: ['alergia-marisco'],
});
plan = addGuest(plan, {
  name: 'Comensal Estándar 5',
  tag: 'amigos',
});

const tally = tallyDietary(plan);
assert(tally.celiaco === 2, `Conteo de celíacos debe ser 2 (obtenido: ${tally.celiaco})`);
assert(tally.vegano === 1, `Conteo de veganos debe ser 1 (obtenido: ${tally.vegano})`);
assert(tally['sin-lactosa'] === 1, `Conteo de sin-lactosa debe ser 1 (obtenido: ${tally['sin-lactosa']})`);
assert(tally['alergia-marisco'] === 1, `Conteo de alergia marisco debe ser 1`);
assert(tally.vegetariano === 0, `Conteo de vegetarianos debe ser 0`);

// Sentar en mesas y verificar tallyDietaryByTable
const guestCeliaco1 = plan.guests.find((g) => g.name === 'Comensal Celíaco 1')!;
const guestVegano2 = plan.guests.find((g) => g.name === 'Comensal Vegano 2')!;
const firstTableId = plan.tables[0].id;
const secondTableId = plan.tables[1].id;

plan = seatGuest(plan, guestCeliaco1.id, firstTableId, 0);
plan = seatGuest(plan, guestVegano2.id, secondTableId, 0);

const byTable = tallyDietaryByTable(plan);
assert(byTable[firstTableId].celiaco === 1, 'Mesa 1 debe registrar 1 comensal celíaco');
assert(byTable[secondTableId].vegano === 1, 'Mesa 2 debe registrar 1 comensal vegano');

console.log('  ✅ Seating Planner: Restricciones 2-12 validadas y desglose de dietas verificado.');

// ─────────────────────────────────────────────────────────────────────────────
// 5. CONTACT-GATE Y POLÍTICA ANTI-FRAUDE CON LITERAL ESTRICTO
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n[BLOQUE 5/5] Verificando Contact-Gate y esquema Zod de Onboarding...');

// 5.1 Enmascaramiento de teléfono en DIRECTORY_UNCLAIMED
assert(
  formatContactGatePhone('666112233', 'DIRECTORY_UNCLAIMED') === CENTRALITA_EAR_OS,
  'En DIRECTORY_UNCLAIMED el teléfono debe ser siempre la Centralita Oficial',
);
assert(
  formatContactGatePhone('666112233', 'CLAIMED_PRO') === '+34 666 112 233',
  'En CLAIMED_PRO el teléfono debe formatearse con prefijo internacional +34',
);

// 5.2 Esquema Zod de Onboarding con literal true obligatorio
const validOnboardingData = {
  providerSlug: 'restaurante-otzarreta',
  businessName: 'Restaurante Otzarreta',
  cifNif: 'B12345674',
  contactPhone: '+34693693048',
  billingIban: validIban1,
  membershipTier: 'CLAIMED_PRO' as const,
  acceptsAntiFraudPolicy: true as const,
  fields: [
    {
      key: 'identidad_nombre_comercial',
      category: 'RESTAURANTE_BODA' as const,
      publicVisible: true,
      sensitive: false,
      label: 'Nombre Comercial',
      value: 'Restaurante Otzarreta',
      verifiedByAdmin: true,
      updatedAt: new Date().toISOString(),
    },
  ],
};

const parsedSuccess = ProviderTrojanOnboardingSchema.safeParse(validOnboardingData);
assert(parsedSuccess.success, 'El esquema de onboarding válido debe parsear correctamente');

const fraudAttemptData = {
  ...validOnboardingData,
  acceptsAntiFraudPolicy: false, // Intento de omitir la política anti-fraude
};
const parsedFraud = ProviderTrojanOnboardingSchema.safeParse(fraudAttemptData);
assert(!parsedFraud.success, 'Onboarding que no acepte la política anti-fraude con true literal debe fallar');

console.log('  ✅ Contact-Gate protegido y política anti-fraude certificada.');

// ─────────────────────────────────────────────────────────────────────────────
// RESUMEN AUDITORÍA
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n' + '═'.repeat(78));
console.log(`🎯 AUDITORÍA COMPLETADA CON ÉXITO: ${assertionsRun} ASERCIONES VERIFICADAS.`);
console.log('EXIT CODE: 0 (CERTIFICACIÓN CONSTITUCIONAL OK)');
console.log('═'.repeat(78));
process.exit(0);
