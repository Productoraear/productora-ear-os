/**
 * ════════════════════════════════════════════════════════════════════════════
 * PROPERTY-BASED TESTING — IBAN ISO 13616 / MOD-97-10 (BigInt)
 * ════════════════════════════════════════════════════════════════════════════
 * Arnés formal con `fast-check` (1.000 iteraciones por propiedad):
 *
 *   P1. Idoneidad: todo IBAN construido con DC correctos se acepta → `true`.
 *   P2. Corrección: adulterar UN dígito (BBAN o DC) rompe el MOD-97 → `false`
 *       el 100% de las veces.
 *   P3. Longitud estricta: alterar la longitud del registro del país ⇒ `false`
 *       siempre (España = 24).
 *   P4. Totalidad: ninguna entrada arbitraria (basura, Unicode, control) puede
 *       lanzar excepción; la función SIEMPRE devuelve boolean.
 *   P5. Idempotencia del saneado: espacios, guiones y minúsculas no cambian el
 *       veredicto.
 *
 * Ejecución: npx tsx src/lib/finance/__tests__/iban-iso13616.test.ts
 * Salida: Exit Code 0 si todas las propiedades se cumplen; 1 en caso contrario.
 * ════════════════════════════════════════════════════════════════════════════
 */

import assert from 'node:assert/strict';
import fc from 'fast-check';
import {
  IBAN_MAX_LENGTH,
  IBAN_MIN_LENGTH,
  IbanSchema,
  computeIbanCheckDigits,
  expectedIbanLength,
  formatIban,
  isValidIBAN,
  normalizeIban,
} from '../iban-iso13616';

/** Presupuesto de iteraciones por propiedad (orden: ≥ 1.000). */
const RUNS = 1000;

const DIGITS = '0123456789';

/** Países con longitud registrada en ISO 13616 (muestra SEPA + Europa). */
const REGISTERED_COUNTRIES: readonly string[] = [
  'ES', 'DE', 'FR', 'IT', 'PT', 'NL', 'BE', 'AT', 'IE', 'LU', 'CH', 'GB',
  'PL', 'SE', 'DK', 'FI', 'NO', 'CZ', 'GR', 'RO', 'HU', 'BG', 'HR', 'SK',
  'SI', 'LT', 'LV', 'EE', 'MT', 'CY',
];

/** IBANs canónicos de referencia (registro público SWIFT). */
const KNOWN_VALID_IBANS: readonly string[] = [
  'ES9121000418450200051332',
  'ES7921000813610123456789',
  'DE89370400440532013000',
  'GB82WEST12345698765432',
  'FR1420041010050500013M02606',
  'IT60X0542811101000000123456',
  'NL91ABNA0417164300',
  'BE68539007547034',
  'PT50000201231234567890154',
  'AT611904300234573201',
];

/** IBANs adulterados o mal formados: deben rechazarse. */
const KNOWN_INVALID_IBANS: readonly string[] = [
  'ES9121000418450200051333',
  'DE89370400440532013001',
  'GB82WEST12345698765433',
  'ES912100041845020005133',
  'ES91210004184502000513322',
  'ES91-2100-0418-4502-0005-133X',
  '',
  'NOT-AN-IBAN',
];

let passed = 0;
let failed = 0;

function check(label: string, fn: () => void): void {
  try {
    fn();
    passed += 1;
    console.log(`  [OK] ${label}`);
  } catch (error) {
    failed += 1;
    const message = error instanceof Error ? error.message : String(error);
    console.error(`  [FAIL] ${label}\n         ${message}`);
  }
}

/** Construye un IBAN sintácticamente válido con dígitos de control correctos. */
function buildValidIban(countryCode: string, bban: string): string {
  const checkDigits = computeIbanCheckDigits(countryCode, bban);
  assert.notEqual(checkDigits, null, `No se pudieron calcular DC para ${countryCode}${bban}`);
  return `${countryCode}${checkDigits as string}${bban}`;
}

console.log('IBAN ISO 13616 — Property-Based Testing (fast-check)');
console.log(`Iteraciones por propiedad: ${RUNS}`);

// ── Casos semilla (regresión conocida) ─────────────────────────────────────
check('IBANs reales del registro SWIFT se aceptan', () => {
  for (const iban of KNOWN_VALID_IBANS) {
    assert.equal(isValidIBAN(iban), true, `Debe aceptar ${iban}`);
  }
});

check('IBANs adulterados y mal formados se rechazan', () => {
  for (const iban of KNOWN_INVALID_IBANS) {
    assert.equal(isValidIBAN(iban), false, `Debe rechazar "${iban}"`);
  }
});

check('España exige exactamente 24 caracteres', () => {
  assert.equal(expectedIbanLength('ES'), 24);
  assert.equal(isValidIBAN(KNOWN_VALID_IBANS[0]), true);
  assert.equal(isValidIBAN(`${KNOWN_VALID_IBANS[0]}0`), false);
});

check('formatIban devuelve null si el IBAN no es conforme', () => {
  assert.equal(formatIban('ES00INVALIDO'), null);
  assert.equal(formatIban(KNOWN_VALID_IBANS[0]), 'ES91 2100 0418 4502 0005 1332');
});

check('normalizeIban elimina separadores visuales y normaliza caja', () => {
  assert.equal(normalizeIban(' es91-2100 0418.4502 0005 1332 '), 'ES9121000418450200051332');
});

check('IbanSchema acepta válidos y rechaza inválidos', () => {
  assert.equal(IbanSchema.safeParse(KNOWN_VALID_IBANS[0]).success, true);
  assert.equal(IbanSchema.safeParse('ES91 2100 0418 4502 0005 1332').success, true);
  assert.equal(IbanSchema.safeParse(KNOWN_INVALID_IBANS[0]).success, false);
});

check('computeIbanCheckDigits reconstruye el DC de IBANs reales', () => {
  assert.equal(computeIbanCheckDigits('ES', '21000418450200051332'), '91');
  assert.equal(computeIbanCheckDigits('DE', '370400440532013000'), '89');
  assert.equal(computeIbanCheckDigits('ES', 'mal!'), null);
});

// ── P1 · Idoneidad: IBAN bien construido ⇒ siempre true ────────────────────
check('P1 idoneidad (países del registro): DC correcto ⇒ true (100%)', () => {
  const caseArb = fc
    .tuple(
      fc.constantFrom(...REGISTERED_COUNTRIES),
      fc.stringMatching(/^[A-Z0-9]{1,30}$/),
    )
    .filter(([country, bban]) => {
      const registered = expectedIbanLength(country);
      return registered !== null && country.length + 2 + bban.length === registered;
    });

  fc.assert(
    fc.property(caseArb, ([country, bban]) => {
      const iban = buildValidIban(country, bban);
      assert.equal(iban.length, expectedIbanLength(country), `Longitud inesperada en ${iban}`);
      return isValidIBAN(iban);
    }),
    { numRuns: RUNS },
  );
});

// ── P1b · Idoneidad sobre el dominio español (BBAN de 20 caracteres) ───────
check('P1b idoneidad ES: BBAN de 20 alfanuméricos ⇒ true (100%)', () => {
  fc.assert(
    fc.property(fc.stringMatching(/^[A-Z0-9]{20}$/), (bban) => {
      const iban = buildValidIban('ES', bban);
      return iban.length === 24 && isValidIBAN(iban);
    }),
    { numRuns: RUNS },
  );
});

// ── P2 · Corrección: alterar 1 dígito del BBAN ⇒ siempre false ─────────────
check('P2 corrección: alterar un dígito del BBAN ⇒ false (100%)', () => {
  const mutationArb = fc.record({
    country: fc.constantFrom(...REGISTERED_COUNTRIES),
    bban: fc.stringMatching(/^[A-Z0-9]{1,30}$/),
    index: fc.nat(),
    replacement: fc.constantFrom(...DIGITS.split('')),
  });

  fc.assert(
    fc.property(mutationArb, ({ country, bban, index, replacement }) => {
      const registered = expectedIbanLength(country);
      if (registered === null) return true;
      if (country.length + 2 + bban.length !== registered) return true;

      const valid = buildValidIban(country, bban);
      if (!isValidIBAN(valid)) return false; // La base debe ser válida.

      // Mutación hostil: se altera un dígito del BBAN (nunca el DC).
      const digitPositions: number[] = [];
      for (let i = country.length + 2; i < valid.length; i += 1) {
        if (/[0-9]/.test(valid[i])) digitPositions.push(i);
      }
      if (digitPositions.length === 0) return true;

      const targetPos = digitPositions[index % digitPositions.length];
      const current = valid[targetPos];
      const mutated = current !== replacement
        ? replacement
        : ((Number(current) + 1) % 10).toString();
      const hostile = valid.slice(0, targetPos) + mutated + valid.slice(targetPos + 1);

      return isValidIBAN(hostile) === false;
    }),
    { numRuns: RUNS },
  );
});

// ── P2b · Corrección: alterar un dígito de control ⇒ siempre false ─────────
check('P2b corrección: alterar un dígito de control ⇒ false (100%)', () => {
  fc.assert(
    fc.property(
      fc.record({
        bban: fc.stringMatching(/^[0-9A-Z]{20}$/),
        which: fc.integer({ min: 0, max: 1 }),
      }),
      ({ bban, which }) => {
        const valid = buildValidIban('ES', bban);
        assert.equal(isValidIBAN(valid), true, `Base inválida: ${valid}`);
        const position = 2 + which;
        const next = (Number(valid[position]) + 1) % 10;
        const hostile = valid.slice(0, position) + next + valid.slice(position + 1);
        return isValidIBAN(hostile) === false;
      },
    ),
    { numRuns: RUNS },
  );
});

// ── P3 · Longitud estricta por país ───────────────────────────────────────
check('P3 longitud: añadir o quitar 1 carácter a un ES ⇒ false (100%)', () => {
  fc.assert(
    fc.property(fc.stringMatching(/^[A-Z0-9]{20}$/), (bban) => {
      const valid = buildValidIban('ES', bban);
      const longer = `${valid}0`;
      const shorter = valid.slice(0, -1);
      return isValidIBAN(longer) === false && isValidIBAN(shorter) === false;
    }),
    { numRuns: RUNS },
  );
});

// ── P4 · Totalidad: nunca lanza, siempre devuelve boolean ─────────────────
check('P4 totalidad: entrada arbitraria ⇒ boolean, sin excepción (100%)', () => {
  fc.assert(
    fc.property(fc.string({ maxLength: 64 }), (garbage) => {
      const result = isValidIBAN(garbage);
      return typeof result === 'boolean';
    }),
    { numRuns: RUNS },
  );
  assert.equal(isValidIBAN('ES91\u0000\uD83D\uDE00'), false);
});

check('P4b totalidad: ventana de longitud ISO respetada (100%)', () => {
  fc.assert(
    fc.property(fc.stringMatching(/^[A-Z0-9]{0,60}$/), (garbage) => {
      if (!isValidIBAN(garbage)) return true;
      const length = normalizeIban(garbage).length;
      return length >= IBAN_MIN_LENGTH && length <= IBAN_MAX_LENGTH;
    }),
    { numRuns: RUNS },
  );
});

// ── P5 · Idempotencia del saneado ────────────────────────────────────────
check('P5 saneado: separadores y minúsculas no alteran el veredicto (100%)', () => {
  fc.assert(
    fc.property(fc.stringMatching(/^[0-9A-Z]{20}$/), (bban) => {
      const valid = buildValidIban('ES', bban);
      const decorated = `  ${valid.slice(0, 4).toLowerCase()}-${valid.slice(4, 8)} ${valid.slice(8)}  `;
      return isValidIBAN(decorated) === isValidIBAN(valid);
    }),
    { numRuns: RUNS },
  );
});

// ── Resumen ──────────────────────────────────────────────────────────────
console.log('');
console.log('='.repeat(70));
console.log(`Propiedades verificadas: ${passed} · Fallos: ${failed}`);
console.log('='.repeat(70));

if (failed > 0) {
  console.error(`EXIT CODE: 1 (${failed} propiedad(es) incumplida(s))`);
  process.exit(1);
}

console.log('EXIT CODE: 0 (ISO 13616 certificado por propiedad)');
process.exit(0);

