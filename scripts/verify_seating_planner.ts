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
  FIXTURE_SPEC,
  GUEST_TAGS,
  MAX_ELEMENT_SCALE,
  MAX_SEATS_BY_SHAPE,
  MAX_TABLE_SEATS,
  MIN_ELEMENT_SCALE,
  MIN_TABLE_SEATS,
  SeatingPlanError,
  addFixture,
  addGuest,
  autoSeatGuests,
  buildDefaultPlan,
  effectiveMetrics,
  fixtureMetrics,
  guestAtSeat,
  guestsOfTable,
  nudgeTableSeats,
  removeFixture,
  removeTable,
  rotateElement,
  rotatedBounds,
  scaleElement,
  seatCapacity,
  seatGuest,
  setTableSeats,
  setTableShape,
  tableSeatRange,
  tallyGuests,
  totalSeats,
  unseatGuest,
  unseatedGuests,
  updateGuest,
  validatePlan,
} from '../src/lib/seating/seating-plan.ts';
import {
  buildBudgetHrefWithPlan,
  decodePlan,
  encodePlan,
  hashSeatingIntent,
  hashSeatingPlan,
  isSeatingPlanHash,
  readPaxFromQuery,
  readTokenFromHash,
} from '../src/lib/seating/seating-codec.ts';
import {
  DEFAULT_PRINT_OPTIONS,
  DEFAULT_SEATING_TARIFF,
  auditPlanElements,
  formatCents,
  hashValuation,
  pitchUtilisation,
  valuateSeating,
  type SeatingTariff,
} from '../src/lib/seating/seating-pricing.ts';

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

/**
 * Igual que `expectThrow`, pero admite cualquier error TIPADO.
 * El motor de valor rechaza tarifas inválidas con `RangeError` (es un fallo de
 * rango, no de esquema del plano), así que exigir `SeatingPlanError` sería
 * falsear la naturaleza del error para contentar al test.
 */
function expectTypedThrow(label: string, action: () => unknown): void {
  try {
    action();
    failures.push(`${label} (no lanzó)`);
  } catch (error) {
    assert(
      error instanceof RangeError || error instanceof TypeError || error instanceof SeatingPlanError,
      `${label} (error no tipado: ${String(error)})`,
    );
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

/* 8 · MOTOR DE VALOR: enteros en céntimos, cero flotantes */
const moneyPlan = buildDefaultPlan({ pax: 60, venueCapacity: 200, eventName: 'Boda' });
const moneyBase = valuateSeating({
  plan: moneyPlan,
  print: DEFAULT_PRINT_OPTIONS,
  tariff: DEFAULT_SEATING_TARIFF,
  payer: 'included',
});

assert(moneyBase.tables === moneyPlan.tables.length, 'valor: el número de mesas del desglose cuadra con el plano');
assert(moneyBase.seats === totalSeats(moneyPlan), 'valor: los asientos del desglose cuadran con el plano');
assert(
  Number.isInteger(moneyBase.breakdown.totalCents),
  'valor: el total es un entero de céntimos (cero coma flotante en dinero)',
);
assert(
  moneyBase.breakdown.totalCents === moneyBase.breakdown.subtotalCents - moneyBase.breakdown.discountCents,
  'valor: total = subtotal − descuento (identidad contable)',
);
assert(
  moneyBase.breakdown.subtotalCents === moneyBase.breakdown.lines.reduce((acc, line) => acc + line.amountCents, 0),
  'valor: el subtotal es la suma exacta de las líneas',
);
assert(
  moneyBase.breakdown.lines.every((line) => line.amountCents === line.unitCents * line.quantity),
  'valor: cada línea cumple unitario × cantidad = importe',
);

/* 9 · Palanca comercial: incluido con depósito ⇒ no se factura la herramienta */
assert(
  moneyBase.breakdown.lines.every((line) => line.key !== 'planner-tool'),
  'valor: con depósito el plano no genera línea de herramienta (INV-03: no hay segundo cobro)',
);
const moneyClient = valuateSeating({
  plan: moneyPlan,
  print: DEFAULT_PRINT_OPTIONS,
  tariff: DEFAULT_SEATING_TARIFF,
  payer: 'client',
});
assert(
  moneyClient.breakdown.lines.some((line) => line.key === 'planner-tool'),
  'valor: sin depósito la herramienta sí se factura',
);
assert(
  moneyClient.breakdown.totalCents === moneyBase.breakdown.totalCents + DEFAULT_SEATING_TARIFF.plannerToolCents,
  'valor: la diferencia entre ambas rutas es exactamente el precio de la herramienta',
);

/* 10 · Impresión: cantidad derivada del plano, nunca de un input libre */
const withCards = valuateSeating({
  plan: moneyPlan,
  print: { seatCards: true, tableCards: true },
  tariff: DEFAULT_SEATING_TARIFF,
  payer: 'included',
});
const seatLine = withCards.breakdown.lines.find((line) => line.key === 'seat-cards');
const tableLine = withCards.breakdown.lines.find((line) => line.key === 'table-cards');
assert(seatLine?.quantity === moneyBase.seats, 'valor: las etiquetas de sitio son 1 por asiento montado');
assert(tableLine?.quantity === moneyBase.tables, 'valor: los carteles son 1 por mesa');

/* 11 · Descuento por volumen: umbral exacto y redondeo a favor del cliente */
const highThreshold: SeatingTariff = { ...DEFAULT_SEATING_TARIFF, volumeThresholdTables: 100 };
const noDiscount = valuateSeating({
  plan: moneyPlan,
  print: DEFAULT_PRINT_OPTIONS,
  tariff: highThreshold,
  payer: 'included',
});
assert(noDiscount.breakdown.discountApplied === false, 'valor: sin llegar al umbral no hay descuento');
assert(noDiscount.breakdown.discountCents === 0, 'valor: descuento cero cuando no aplica');
assert(
  moneyBase.breakdown.discountApplied === (moneyBase.breakdown.lines.length > 0 &&
    moneyBase.tables >= DEFAULT_SEATING_TARIFF.volumeThresholdTables),
  'valor: el descuento se aplica exactamente al alcanzar el umbral de mesas',
);
if (moneyBase.breakdown.discountApplied) {
  const expected = Math.floor((moneyBase.breakdown.subtotalCents * DEFAULT_SEATING_TARIFF.volumeDiscountPct) / 100);
  assert(moneyBase.breakdown.discountCents === expected, 'valor: el descuento redondea hacia abajo (a favor del cliente)');
}

/* 12 · Aforo excedido: se cobra gestión extra, no se oculta */
const tightVenue = buildDefaultPlan({ pax: 120, venueCapacity: 20 });
const oversold = valuateSeating({
  plan: tightVenue,
  print: DEFAULT_PRINT_OPTIONS,
  tariff: DEFAULT_SEATING_TARIFF,
  payer: 'included',
});
assert(oversold.exceedsVenue === true, 'valor: detecta plano por encima del aforo del espacio');
assert(oversold.overflowGuests === totalSeats(tightVenue) - 20, 'valor: cuantifica los comensales sobre aforo');
assert(
  oversold.breakdown.lines.some((line) => line.key === 'overflow-guest'),
  'valor: el exceso de aforo genera su propia línea (no se regala)',
);
const noVenue = buildDefaultPlan({ pax: 120, venueCapacity: 0 });
assert(
  valuateSeating({ plan: noVenue, print: DEFAULT_PRINT_OPTIONS, tariff: DEFAULT_SEATING_TARIFF, payer: 'included' })
    .overflowGuests === 0,
  'valor: aforo 0 (sin declarar) no genera recargo',
);

/* 13 · Hash de cobro: determinista y sensible al dinero */
const moneyRepeat = valuateSeating({
  plan: moneyPlan,
  print: DEFAULT_PRINT_OPTIONS,
  tariff: DEFAULT_SEATING_TARIFF,
  payer: 'included',
});
assert(hashValuation(moneyBase) === hashValuation(moneyRepeat), 'hash: mismo plano ⇒ misma huella de cobro');
assert(hashValuation(moneyBase) !== hashValuation(moneyClient), 'hash: la huella cambia si cambia lo que se cobra');

/* 14 · Tarifario hostil: ningún negativo ni fracción entra al cobro */
expectTypedThrow('tarifa negativa', () =>
  valuateSeating({
    plan: moneyPlan,
    print: DEFAULT_PRINT_OPTIONS,
    tariff: { ...DEFAULT_SEATING_TARIFF, perTableCents: -100 },
    payer: 'included',
  }),
);
expectTypedThrow('tarifa fraccionaria', () =>
  valuateSeating({
    plan: moneyPlan,
    print: DEFAULT_PRINT_OPTIONS,
    tariff: { ...DEFAULT_SEATING_TARIFF, perTableCents: 18.5 },
    payer: 'included',
  }),
);
expectTypedThrow('descuento fuera de rango', () =>
  valuateSeating({
    plan: moneyPlan,
    print: DEFAULT_PRINT_OPTIONS,
    tariff: { ...DEFAULT_SEATING_TARIFF, volumeDiscountPct: 140 },
    payer: 'included',
  }),
);

/* 15 · Control total por elemento */
assert(auditPlanElements(moneyPlan).length === 0, 'elementos: un plano por defecto está limpio');
const firstTable = moneyPlan.tables[0]!;
const tampered = {
  ...moneyPlan,
  tables: [
    { ...firstTable, id: 'mesa-a', seats: MAX_SEATS_BY_SHAPE.round + 5 },
    { ...firstTable, id: 'mesa-b', x: -3 },
    { ...firstTable, id: 'mesa-c', label: '   ' },
  ],
};
const tamperedIssues = auditPlanElements(tampered);
assert(tamperedIssues.length === 3, 'elementos: detecta los tres defectos a la vez (no se detiene en el primero)');
assert(
  tamperedIssues.some((issue) => issue.code === 'SEATS_EXCEED_GEOMETRY'),
  'elementos: caza asientos por encima de la geometría',
);
assert(tamperedIssues.some((issue) => issue.code === 'NEGATIVE_COORDINATE'), 'elementos: caza coordenadas negativas');
assert(tamperedIssues.some((issue) => issue.code === 'EMPTY_LABEL'), 'elementos: caza mesas sin etiqueta');
assert(pitchUtilisation('round', 1) === 1, 'elementos: la mesa mínima reporta utilización plena sin exceso');
assert(pitchUtilisation('round', MAX_SEATS_BY_SHAPE.round) <= 1, 'elementos: la utilización nunca supera 1');

/* 16 · Formato monetario español */
assert(formatCents(35000) === '350,00', 'formato: 35000 céntimos ⇒ 350,00');
assert(formatCents(0) === '0,00', 'formato: el cero conserva los decimales');

/* ═══════════════════════════════════════════════════════════════════════════
 * 17 · CONTROL INDIVIDUAL DEL ELEMENTO (rotación, escala, plazas)
 * ═══════════════════════════════════════════════════════════════════════════ */
const base = buildDefaultPlan({ pax: 24, venueCapacity: 60, eventName: 'Boda' });
const firstId = base.tables[0]!.id;

const rotated = rotateElement(base, firstId, 90);
assert(rotated.tables[0]!.rotation === 90, 'rotación: fija 90° en la mesa objetivo');
assert(rotateElement(base, firstId, 450).tables[0]!.rotation === 90, 'rotación: normaliza 450° ⇒ 90°');
assert(rotateElement(base, firstId, -45).tables[0]!.rotation === 315, 'rotación: normaliza −45° ⇒ 315°');
assert(rotateElement(base, firstId, 0) === base, 'rotación: girar a la misma posición no muta (idempotencia)');
assert(rotateElement(base, 'inexistente', 90) === base, 'rotación: id desconocido no rompe el plano');

const scaledUp = scaleElement(base, firstId, 1.5);
assert(scaledUp.tables[0]!.scale === 1.5, 'escala: aplica 1,5 sobre la mesa');
assert(scaleElement(base, firstId, 99).tables[0]!.scale === MAX_ELEMENT_SCALE, 'escala: acota el techo');
assert(scaleElement(base, firstId, 0.01).tables[0]!.scale === MIN_ELEMENT_SCALE, 'escala: acota el suelo');
assert(scaleElement(base, firstId, 1) === base, 'escala: 100 % sobre 100 % no muta');

const bumped = nudgeTableSeats(base, firstId, 1);
assert(bumped.tables[0]!.seats === base.tables[0]!.seats + 1, 'plazas: +1 sube un asiento');
assert(
  nudgeTableSeats(base, firstId, 99).tables[0]!.seats === MAX_TABLE_SEATS,
  'plazas: el techo operativo es 12 en cualquier tipología',
);
assert(
  nudgeTableSeats(base, firstId, -99).tables[0]!.seats === MIN_TABLE_SEATS,
  'plazas: el suelo operativo es 2 (nunca una mesa sin plazas)',
);
for (const shape of ['round', 'rectangular', 'presidential'] as const) {
  const range = tableSeatRange(shape);
  assert(range.min === 2 && range.max <= 12, `plazas: rango 2–12 en ${shape}`);
}

/* El cambio de tipología conserva las plazas que la nueva geometría admite. */
const wide = setTableShape(base, firstId, 'presidential');
assert(wide.tables[0]!.shape === 'presidential', 'tipología: cambia a presidencial');
assert(wide.tables[0]!.seats <= MAX_TABLE_SEATS, 'tipología: recorta al techo operativo');

/* ═══════════════════════════════════════════════════════════════════════════
 * 18 · MOBILIARIO Y ZONAS DE EVENTO
 * ═══════════════════════════════════════════════════════════════════════════ */
const withFloor = addFixture(base, 'dancefloor');
assert(withFloor.fixtures.length === 1, 'mobiliario: añade la pista de baile');
assert(withFloor.fixtures[0]!.kind === 'dancefloor', 'mobiliario: conserva el tipo');
const withStage = addFixture(withFloor, 'stage');
assert(withStage.fixtures.length === 2, 'mobiliario: admite varios objetos');
assert(withStage.fixtures[1]!.id !== withStage.fixtures[0]!.id, 'mobiliario: ids únicos');
assert(removeFixture(withStage, withStage.fixtures[0]!.id).fixtures.length === 1, 'mobiliario: elimina por id');
assert(removeFixture(withStage, 'inexistente') === withStage, 'mobiliario: borrar id desconocido es idempotente');
for (const kind of ['dancefloor', 'cakeTable', 'bar', 'stage'] as const) {
  const spec = FIXTURE_SPEC[kind];
  assert(spec.width > 0 && spec.height > 0 && spec.label.length > 0, `mobiliario: ${kind} tiene huella y nombre`);
}

/* Rotación y escala también aplican al mobiliario (mismo operador). */
assert(rotateElement(withFloor, withFloor.fixtures[0]!.id, 45).fixtures[0]!.rotation === 45, 'mobiliario: rota');
assert(scaleElement(withFloor, withFloor.fixtures[0]!.id, 1.2).fixtures[0]!.scale === 1.2, 'mobiliario: escala');

/* ═══════════════════════════════════════════════════════════════════════════
 * 19 · INVITADOS: ALTA, ASIGNACIÓN, COLISIÓN Y DESALOJO
 * ═══════════════════════════════════════════════════════════════════════════ */
const withGuests = addGuest(addGuest(base, { name: 'Ana', tag: 'novia' }), { name: 'Luis', tag: 'novio' });
assert(withGuests.guests.length === 2, 'invitados: se añaden dos');
assert(addGuest(withGuests, { name: 'Ana', tag: 'amigos' }) === withGuests, 'invitados: rechaza duplicado exacto');
assert(addGuest(withGuests, { name: '   ', tag: 'amigos' }) === withGuests, 'invitados: rechaza nombre vacío');
assert(withGuests.guests.every((guest) => guest.tableId === null), 'invitados: recién alta sin asiento');

const guestA = withGuests.guests[0]!.id;
const guestB = withGuests.guests[1]!.id;
const seatedA = seatGuest(withGuests, guestA, firstId, 0);
assert(seatedA.guests[0]!.tableId === firstId && seatedA.guests[0]!.seatIndex === 0, 'invitados: sienta en el asiento 0');
assert(seatGuest(seatedA, guestA, firstId, 0) === seatedA, 'invitados: sentar en la misma silla es idempotente');

const collided = seatGuest(seatedA, guestB, firstId, 0);
assert(collided.guests[1]!.tableId === firstId, 'invitados: el segundo ocupa la silla');
assert(collided.guests[0]!.tableId === null, 'invitados: el desalojado vuelve a la lista (nunca dos en una silla)');

assert(seatGuest(withGuests, guestA, firstId, 99) === withGuests, 'invitados: rechaza un asiento que no existe');
assert(seatGuest(withGuests, guestA, 'mesa-inexistente', 0) === withGuests, 'invitados: rechaza una mesa inexistente');

const backToList = unseatGuest(seatedA, guestA);
assert(backToList.guests[0]!.tableId === null, 'invitados: liberar silla los devuelve a la lista');
assert(unseatGuest(backToList, guestA) === backToList, 'invitados: liberar dos veces es idempotente');

/* RSVP y etiquetas. */
const confirmed = updateGuest(withGuests, guestA, { rsvp: 'confirmed' });
assert(confirmed.guests[0]!.rsvp === 'confirmed', 'invitados: marca RSVP confirmado');
assert(updateGuest(confirmed, guestA, { rsvp: 'confirmed' }) === confirmed, 'invitados: RSVP idempotente');
assert(GUEST_TAGS.length === 5, 'invitados: las cinco etiquetas de la directiva');

/* Bajar plazas NO borra invitados: los deja en la lista sin mesa. */
const fullTable = seatGuest(seatGuest(withGuests, guestA, firstId, 0), guestB, firstId, 1);
const shrunk = setTableSeats(fullTable, firstId, MIN_TABLE_SEATS);
assert(shrunk.guests.length === 2, 'plazas: recortar la mesa no borra ningún invitado');
assert(
  shrunk.guests.filter((guest) => guest.tableId === firstId).length <= MIN_TABLE_SEATS,
  'plazas: ningún invitado queda en un asiento que ya no existe',
);

/* Borrar la mesa libera a sus comensales en lugar de perderlos. */
const dropped = removeTable(fullTable, firstId);
assert(dropped.guests.length === 2, 'mesa: eliminarla conserva a los invitados');
assert(dropped.guests.every((guest) => guest.tableId === null), 'mesa: eliminarla los devuelve a la lista');

/* ═══════════════════════════════════════════════════════════════════════════
 * 20 · CONTADOR DE AFORO EN VIVO
 * ═══════════════════════════════════════════════════════════════════════════ */
const tally = tallyGuests(seatedA);
assert(tally.listed === 2, 'contador: cuenta los anotados');
assert(tally.seated === 1, 'contador: cuenta los sentados');
assert(tally.freeSeats === totalSeats(seatedA) - 1, 'contador: libres = asientos montados − sentados');
assert(
  validatePlan(seatedA).unseatedGuests === 1,
  'contador: validatePlan declara cuántos invitados siguen sin asiento',
);

/* ═══════════════════════════════════════════════════════════════════════════
 * 21 · AUTO-COLOCACIÓN DETERMINISTA
 * ═══════════════════════════════════════════════════════════════════════════ */
const autoPlan = autoSeatGuests(withGuests);
assert(autoPlan.guests.every((guest) => guest.tableId !== null), 'auto-sentado: coloca a todos si hay sitio');
assert(encodePlan(autoSeatGuests(withGuests)) === encodePlan(autoPlan), 'auto-sentado: determinista (mismo token)');
assert(autoSeatGuests(autoPlan) === autoPlan, 'auto-sentado: sin pendientes no muta');

const crowded = {
  ...buildDefaultPlan({ pax: 8 }),
  guests: Array.from({ length: 40 }, (_unused, index) => ({
    id: `invitado-${index + 1}`,
    name: `Invitado ${index + 1}`,
    tag: 'amigos' as const,
    rsvp: 'pending' as const,
    tableId: null,
    seatIndex: null,
  })),
};
const forced = autoSeatGuests(crowded);
assert(
  forced.guests.filter((guest) => guest.tableId !== null).length === totalSeats(crowded),
  'auto-sentado: sin sitio, sólo coloca hasta el aforo (los demás siguen en la lista)',
);

/* ═══════════════════════════════════════════════════════════════════════════
 * 22 · GEOMETRÍA EFECTIVA Y CAJA ROTADA (INV-18)
 * ═══════════════════════════════════════════════════════════════════════════ */
assert(effectiveMetrics(scaledUp.tables[0]!).width === 2.7, 'geometría: escala 1,5 sobre 1,8 m ⇒ 2,7 m');
assert(fixtureMetrics(withFloor.fixtures[0]!).width === 5, 'geometría: la pista mide 5 m de ancho nominal');
const box = { width: 2, height: 1 };
assert(rotatedBounds(box, 90).width === 1 && rotatedBounds(box, 90).height === 2, 'geometría: 90° intercambia ancho y alto');
assert(rotatedBounds(box, 0).width === 2 && rotatedBounds(box, 0).height === 1, 'geometría: sin giro conserva la caja');
assert(rotatedBounds(box, 45).width > 2, 'geometría: a 45° la caja crece (no se recorta)');

/* Consultas de presentación: quién está en cada silla. */
assert(guestAtSeat(seatedA, firstId, 0)?.name === 'Ana', 'presentación: devuelve el ocupante del asiento');
assert(guestAtSeat(seatedA, firstId, 1) === null, 'presentación: asiento libre ⇒ null');
assert(guestsOfTable(seatedA, firstId).length === 1, 'presentación: lista los sentados de una mesa');
assert(unseatedGuests(seatedA).length === 1, 'presentación: lista los pendientes de mesa');

/* ═══════════════════════════════════════════════════════════════════════════
 * 23 · CÓDEC v2: MOBILIARIO, INVITADOS Y ROTACIÓN SOBREVIVEN AL VIAJE
 * ═══════════════════════════════════════════════════════════════════════════ */
const rich = autoSeatGuests(addFixture(rotateElement(withGuests, firstId, 90), 'bar'));
const richRoundTrip = decodePlan(encodePlan(rich));
assert(richRoundTrip.fixtures.length === 1, 'códec v2: conserva el mobiliario');
assert(richRoundTrip.fixtures[0]!.kind === 'bar', 'códec v2: conserva el tipo de mobiliario');
assert(richRoundTrip.guests.length === 2, 'códec v2: conserva los invitados');
assert(
  richRoundTrip.guests.every((guest) => guest.tableId !== null && guest.seatIndex !== null),
  'códec v2: conserva la asignación de asiento',
);
assert(richRoundTrip.tables[0]!.rotation === 90, 'códec v2: conserva la rotación');
assert(richRoundTrip.tables[0]!.scale === rich.tables[0]!.scale, 'códec v2: conserva la escala');
assert(
  encodePlan(decodePlan(encodePlan(rich))) === encodePlan(rich),
  'códec v2: encode→decode→encode es estable (idempotencia del token)',
);

/* Un token v1 (cabecera de 3 celdas, filas de 5) sigue leyéndose. */
const legacyToken = decodePlan('0,80,0|Boda|0,r,10,1.5,1.5');
assert(legacyToken.tables.length === 1, 'códec v1: lee un enlace antiguo');
assert(legacyToken.tables[0]!.rotation === 0 && legacyToken.tables[0]!.scale === 1, 'códec v1: rotación 0 y escala 1 por defecto');
assert(legacyToken.fixtures.length === 0 && legacyToken.guests.length === 0, 'códec v1: sin mobiliario ni invitados');

/* Una etiqueta desconocida en el token es un esquema inválido, no un invitado. */
expectTypedThrow('códec v2: rechaza un invitado con etiqueta desconocida', () =>
  decodePlan('0,10,0,2|Boda|0,r,4,1,1,0,1||0,Z,0,-,-'),
);

/* ═══════════════════════════════════════════════════════════════════════════
 * 24 · SUTURA TRANSACCIONAL: HASH ESTABLE Y SIN DATOS EN CLARO (INV-14)
 * ═══════════════════════════════════════════════════════════════════════════ */
assert(
  hashSeatingPlan(base) === hashSeatingPlan(buildDefaultPlan({ pax: 24, venueCapacity: 60, eventName: 'Boda' })),
  'hash: mismo plano ⇒ mismo hash (idempotencia)',
);
assert(hashSeatingPlan(base) !== hashSeatingPlan(rotated), 'hash: girar una mesa cambia el plano');
assert(hashSeatingPlan(base) !== hashSeatingPlan(withGuests), 'hash: añadir invitados cambia el plano');
assert(
  hashSeatingIntent(base) === hashSeatingIntent(rotated),
  'intención: girar no cambia la huella operativa (mismo negocio)',
);
assert(hashSeatingIntent(base) !== hashSeatingIntent(withGuests), 'intención: cambiar invitados sí cambia la huella');

const href = buildBudgetHrefWithPlan(rich);
assert(href.startsWith('/presupuesto?'), 'sutura: aterriza en /presupuesto');
assert(href.includes('seatingPlan='), 'sutura: lleva el hash del plano');
assert(href.includes('leadMagnet=true'), 'sutura: marca el lead magnet');
assert(href.includes('seatingIntent='), 'sutura: lleva la huella operativa');
assert(!href.includes('Ana') && !href.includes('Luis'), 'sutura: NINGÚN nombre de invitado viaja en la URL (INV-14)');
const hashParam = new URLSearchParams(href.split('?')[1]).get('seatingPlan');
assert(isSeatingPlanHash(hashParam), 'sutura: el hash tiene forma válida');
assert(!isSeatingPlanHash('<script>'), 'sutura: rechaza una query manipulada');

/* Informe */
if (failures.length > 0) {
  console.error(`SEATING_PLANNER_VERIFY=FAIL passed=${passed} failed=${failures.length}`);
  for (const failure of failures) console.error(`  ❌ ${failure}`);
  process.exit(1);
}

console.log(`SEATING_PLANNER_VERIFY=PASS assertions=${passed}`);
console.log(`  mesas=${a.tables.length} pax=${a.pax} token_chars=${encodePlan(a).length}`);
process.exit(0);
