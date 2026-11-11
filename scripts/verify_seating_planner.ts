#!/usr/bin/env node
/**
 * ════════════════════════════════════════════════════════════════════════════
 * VERIFY SEATING PLANNER — ARNÉS FALSABLE DEL LEAD MAGNET (FASE 2)
 * ════════════════════════════════════════════════════════════════════════════
 * Rol Pez Dorado: no lee la intención del código, sólo su comportamiento.
 * Ejecuta los módulos REALES (`src/lib/seating/*.ts`) vía `tsx` y comprueba:
 *   1. Aforo determinista: mismo input ⇒ mismo plano (enlace compartible).
 *   2. Round-trip del códec: encode → decode ⇒ plano idéntico.
 *   3. Token corrupto ⇒ SeatingPlanError (nunca un plano a medias).
 *   4. Validación de aforo: faltantes, exceso de aforo del espacio.
 *   5. Tope por tipología (nunca más asientos de los que caben).
 *   6. Query hostil (`?pax=abc`, `?pax=-5`, `?pax=99999`) ⇒ null.
 *
 * Exit 0 = todas las aserciones pasan. Exit 1 = alguna falla (se imprimen).
 * Sin red, sin BD, sin escrituras.
 * ════════════════════════════════════════════════════════════════════════════
 */

import {
  MAX_SEATS_BY_SHAPE,
  SeatingPlanError,
  buildDefaultPlan,
  seatCapacity,
  totalSeats,
  validatePlan,
} from '../src/lib/seating/seating-plan.ts';
import { decodePlan, encodePlan, readPaxFromQuery, readTokenFromHash } from '../src/lib/seating/seating-codec.ts';

let passed = 0;
const failures: string[] = [];

function assert(condition: boolean, label: string): void {
  if (condition) {
    passed += 1;
    return;
  }
  failures.push(label);
}

function expectThrow(label: string, action: () => unknown): void {
  try {
    action();
    failures.push(`${label} (no lanzó)`);
  } catch (error) {
    assert(error instanceof SeatingPlanError, `${label} (error no tipado: ${String(error)})`);
  }
}

/* 1 · Determinismo */
const a = buildDefaultPlan({ pax: 120, venueCapacity: 150, eventName: 'Boda' });
const b = buildDefaultPlan({ pax: 120, venueCapacity: 150, eventName: 'Boda' });
assert(encodePlan(a) === encodePlan(b), 'determinismo: mismo input ⇒ mismo token');
assert(totalSeats(a) >= 120, 'aforo: el plano por defecto cubre los 120 pax');
assert(a.tables.length === Math.ceil(120 / seatCapacity('round')), 'aforo: número de mesas = ceil(pax / capacidad)');

/* 2 · Round-trip */
const roundTrip = decodePlan(encodePlan(a));
assert(roundTrip.pax === a.pax, 'round-trip: pax');
assert(roundTrip.eventName === a.eventName, 'round-trip: nombre de evento');
assert(roundTrip.venueCapacity === a.venueCapacity, 'round-trip: aforo del espacio');
assert(roundTrip.tables.length === a.tables.length, 'round-trip: número de mesas');
assert(
  roundTrip.tables.every((table, index) => {
    const source = a.tables[index];
    return (
      source !== undefined &&
      table.label === source.label &&
      table.shape === source.shape &&
      table.seats === source.seats &&
      table.x === source.x &&
      table.y === source.y
    );
  }),
  'round-trip: cada mesa conserva etiqueta, tipo, asientos y posición',
);

/* 3 · Tokens corruptos */
expectThrow('token vacío', () => decodePlan(''));
expectThrow('token sin estructura', () => decodePlan('basura'));
expectThrow('token con referencia inexistente', () => decodePlan('z,80,0|Boda|0,r,10,1.5,1.5'));
expectThrow('token con tipología desconocida', () => decodePlan('0,80,0|Boda|0,X,10,1.5,1.5'));
expectThrow('token con aforo 0', () => decodePlan('0,0,0|Boda|'));

/* 4 · Validación de aforo */
const tight = buildDefaultPlan({ pax: 30 });
const trimmed = { ...tight, tables: tight.tables.slice(0, 1) };
const trimmedValidation = validatePlan(trimmed);
assert(trimmedValidation.ok === false, 'validación: plano recortado no cubre el aforo');
assert(trimmedValidation.missingSeats > 0, 'validación: calcula los asientos que faltan');

const overflow = buildDefaultPlan({ pax: 30, venueCapacity: 10 });
const overflowValidation = validatePlan(overflow);
assert(overflowValidation.exceedsVenue === true, 'validación: detecta exceso sobre el aforo del espacio');
assert(overflowValidation.overflow > 0, 'validación: cuantifica el exceso');

/* 5 · Topes por tipología */
for (const shape of ['round', 'rectangular', 'presidential'] as const) {
  const capacity = seatCapacity(shape);
  assert(capacity >= 2 && capacity <= MAX_SEATS_BY_SHAPE[shape], `capacidad ${shape} dentro de rango`);
}

/* 6 · Query y hash hostiles */
assert(readPaxFromQuery('abc') === null, 'query: pax no numérico rechazado');
assert(readPaxFromQuery('-5') === null, 'query: pax negativo rechazado');
assert(readPaxFromQuery('99999') === null, 'query: pax fuera de rango rechazado');
assert(readPaxFromQuery('140') === 140, 'query: pax válido aceptado');
assert(readTokenFromHash('') === null, 'hash: sin prefijo ⇒ null');
assert(readTokenFromHash('#otra-cosa') === null, 'hash: prefijo ajeno ⇒ null');
assert(readTokenFromHash(`#plan=${encodeURIComponent(encodePlan(a))}`) === encodePlan(a), 'hash: token recuperado');

/* 7 · Separadores hostiles en valores libres (regresión cazada por este arnés) */
const hostile = buildDefaultPlan({ pax: 12, eventName: 'Boda · Finca | Mesa 1.2, ~x; y' });
const hostileBack = decodePlan(encodePlan(hostile));
assert(hostileBack.tables.length === hostile.tables.length, 'hostil: el número de mesas se conserva');
assert(
  hostileBack.tables.every((table, index) => hostile.tables[index]?.x === table.x && hostile.tables[index]?.y === table.y),
  'hostil: las coordenadas decimales sobreviven al viaje',
);

/* Informe */
if (failures.length > 0) {
  console.error(`SEATING_PLANNER_VERIFY=FAIL passed=${passed} failed=${failures.length}`);
  for (const failure of failures) console.error(`  ❌ ${failure}`);
  process.exit(1);
}

console.log(`SEATING_PLANNER_VERIFY=PASS assertions=${passed}`);
console.log(`  mesas=${a.tables.length} pax=${a.pax} token_chars=${encodePlan(a).length}`);
process.exit(0);
