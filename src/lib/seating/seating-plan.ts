/**
 * ════════════════════════════════════════════════════════════════════════════
 * SEATING PLANNER PRO — MOTOR DE LAYOUT (PURO, SIN DOM, SIN I/O)
 * ════════════════════════════════════════════════════════════════════════════
 * Skill rectora: `.antigravity/skills/marketing-leadmagnet-seating.md`
 *   · El plano organiza, NO cotiza (FASE 3.4). Cero importes aquí.
 *   · Se rellena con el aforo y la provincia del presupuesto sellado (FASE 3.3).
 *   · Validación de aforo contra la ficha del espacio (FASE 2).
 *
 * Leyes de implementación:
 *   1. Determinista: sin `Math.random`, sin `Date.now`. Mismo estado de entrada
 *      ⇒ mismo plano. El enlace compartible (`#plan=`) sólo es fiable así.
 *   2. Cero `any`: todo tipado, cerrado y exhaustivo.
 *   3. La capacidad de cada mesa se calcula por geometría, no por una tabla
 *      mágica: radio utilizable / radio por comensal (60 cm de ancho de servicio).
 *   4. TODA mutación del usuario es una función pura de este módulo, nunca un
 *      `setState` ad-hoc en el componente: así lo que el cliente ve, lo que
 *      imprime, lo que comparte y lo que se hashea hacia `/presupuesto` nacen
 *      del mismo cálculo y no pueden divergir.
 * ════════════════════════════════════════════════════════════════════════════
 */

/** Tipologías admitidas por la skill (FASE 2 · segmentación). */
export type TableShape = 'round' | 'rectangular' | 'presidential';

/* ─────────────────────────────────────────────────────────────────────────────
 * 1 · CONTROL INDIVIDUAL DEL ELEMENTO (rotación, escala, plazas)
 * ───────────────────────────────────────────────────────────────────────────── */

/** Pasos de rotación ofrecidos en la UI. El modelo admite giro libre 0–359. */
export const ROTATION_STEPS_DEG = Object.freeze([0, 45, 90, 135, 180, 225, 270, 315] as const);

/** Escala mínima/máxima de una mesa (proporcional a su geometría nominal). */
export const MIN_ELEMENT_SCALE = 0.6;
export const MAX_ELEMENT_SCALE = 1.8;
export const ELEMENT_SCALE_STEP = 0.1;

/** Asientos por mesa: suelo legal de banquete y techo físico del tablero. */
export const MIN_TABLE_SEATS = 2;
export const MAX_TABLE_SEATS = 12;

/**
 * Plazas admitidas por la directiva: 2 a 12 en TODAS las tipologías.
 *
 * El mapa histórico (`MAX_SEATS_BY_SHAPE`) permitía 24 en la presidencial por
 * cálculo de perímetro, pero el CEO fijó el rango operativo en 2–12 para que el
 * operador no pueda componer una mesa que el montaje real no soporta. Gana la
 * cláusula más exigente (AMD-1): se mantiene el techo geométrico Y el rango.
 */
export function tableSeatRange(shape: TableShape): { readonly min: number; readonly max: number } {
  return { min: MIN_TABLE_SEATS, max: Math.min(MAX_TABLE_SEATS, MAX_SEATS_BY_SHAPE[shape]) };
}

/** Normaliza una rotación a un entero de 0–359 grados. */
export function normalizeRotation(deg: number): number {
  if (!Number.isFinite(deg)) return 0;
  const wrapped = Math.round(deg) % 360;
  return wrapped < 0 ? wrapped + 360 : wrapped;
}

/** Acota la escala al rango operable y la redondea a 0,01 para no arrastrar flotantes. */
export function clampScale(scale: number): number {
  if (!Number.isFinite(scale)) return 1;
  const clamped = Math.min(MAX_ELEMENT_SCALE, Math.max(MIN_ELEMENT_SCALE, scale));
  return Math.round(clamped * 100) / 100;
}

/** Acota los asientos al rango del elemento. Nunca deja la mesa sin plazas. */
export function clampSeats(shape: TableShape, seats: number): number {
  const range = tableSeatRange(shape);
  if (!Number.isFinite(seats)) return range.min;
  return Math.min(range.max, Math.max(range.min, Math.trunc(seats)));
}

/* ─────────────────────────────────────────────────────────────────────────────
 * 2 · INVITADOS Y ETIQUETAS
 * ───────────────────────────────────────────────────────────────────────────── */

/** Vocabulario cerrado de etiquetas (un solo acento de color por categoría). */
export type GuestTag = 'novia' | 'novio' | 'amigos' | 'ninos' | 'vip';

export const GUEST_TAGS: readonly GuestTag[] = Object.freeze(['novia', 'novio', 'amigos', 'ninos', 'vip']);

export interface GuestTagStyle {
  readonly label: string;
  /** Hex del acento. Un solo color por categoría, sin degradados (UNSLOP). */
  readonly hex: string;
}

export const GUEST_TAG_STYLE: Readonly<Record<GuestTag, GuestTagStyle>> = Object.freeze({
  novia: { label: 'Novia', hex: '#f4a1c0' },
  novio: { label: 'Novio', hex: '#7fb2ff' },
  amigos: { label: 'Amigos', hex: '#00E5FF' },
  ninos: { label: 'Niños', hex: '#57d99a' },
  vip: { label: 'VIP / Familia directa', hex: '#ecb613' },
});

/** Estado RSVP de un invitado. `pending` = invitado sin confirmar. */
export type RsvpState = 'pending' | 'confirmed';

export interface SeatingGuest {
  readonly id: string;
  readonly name: string;
  readonly tag: GuestTag;
  readonly rsvp: RsvpState;
  /** `null` = todavía sin asiento asignado. */
  readonly tableId: string | null;
  /** Índice de asiento dentro de la mesa (0..seats-1). */
  readonly seatIndex: number | null;
}

/** `true` si el invitado ya está sentado en una mesa concreta. */
export function isGuestSeated(guest: SeatingGuest): boolean {
  return guest.tableId !== null && guest.seatIndex !== null;
}

/* ─────────────────────────────────────────────────────────────────────────────
 * 3 · MOBILIARIO Y ZONAS DE EVENTO
 * ───────────────────────────────────────────────────────────────────────────── */

export type FixtureKind = 'dancefloor' | 'cakeTable' | 'bar' | 'stage';

export const FIXTURE_KINDS: readonly FixtureKind[] = Object.freeze([
  'dancefloor',
  'cakeTable',
  'bar',
  'stage',
]);

export interface FixtureSpec {
  readonly label: string;
  /** Huella nominal en metros, ya SIN rotar (la rotación la aplica el tablero). */
  readonly width: number;
  readonly height: number;
}

export const FIXTURE_SPEC: Readonly<Record<FixtureKind, FixtureSpec>> = Object.freeze({
  dancefloor: { label: 'Pista de baile', width: 5.0, height: 4.0 },
  cakeTable: { label: 'Mesa de tarta / regalos', width: 2.0, height: 1.0 },
  bar: { label: 'Barra / cóctel', width: 3.0, height: 1.0 },
  stage: { label: 'Escenario / música en vivo', width: 5.0, height: 2.4 },
});

/** Un objeto de mobiliario: mismas coordenadas y rotación que una mesa. */
export interface SeatingFixture {
  readonly id: string;
  readonly kind: FixtureKind;
  readonly label: string;
  readonly x: number;
  readonly y: number;
  readonly rotation: number;
  readonly scale: number;
}

/** Ancho de servicio por comensal en metros (estándar de banquete). */
export const GUEST_PITCH_M = 0.6;

/** Capacidad máxima por tipología. Un aforo mayor exige dos mesas. */
export const MAX_SEATS_BY_SHAPE: Readonly<Record<TableShape, number>> = Object.freeze({
  round: 12,
  rectangular: 10,
  presidential: 24,
});

/** Dimensiones nominales en metros: `width` × `height` del rectángulo del plano. */
export const TABLE_METRICS: Readonly<Record<TableShape, { readonly width: number; readonly height: number }>> =
  Object.freeze({
    round: { width: 1.8, height: 1.8 },
    rectangular: { width: 2.4, height: 0.9 },
    presidential: { width: 4.8, height: 0.9 },
  });

export interface SeatingTable {
  readonly id: string;
  readonly label: string;
  readonly shape: TableShape;
  /** Plazas montadas (2–12). Se acota con `clampSeats`. */
  readonly seats: number;
  /** Esquina superior izquierda en metros desde el origen del plano (0,01 m). */
  readonly x: number;
  readonly y: number;
  /** Giro sobre el centro de la mesa, en grados 0–359 (sentido horario). */
  readonly rotation: number;
  /** Factor de tamaño sobre la geometría nominal (0,60–1,80). */
  readonly scale: number;
}

export interface SeatingPlan {
  /** Versión del formato: un enlace viejo no se hidrata con un esquema nuevo. */
  readonly version: 1;
  readonly eventName: string;
  readonly pax: number;
  /** Aforo declarado del espacio (0 = sin aforo declarado, sin validación). */
  readonly venueCapacity: number;
  readonly tables: readonly SeatingTable[];
  /** Mobiliario y zonas de evento (pista, tarta, barra, escenario). */
  readonly fixtures: readonly SeatingFixture[];
  /** Invitados con etiqueta y RSVP. El orden de entrada se preserva. */
  readonly guests: readonly SeatingGuest[];
}

/** Vocabulario cerrado de errores del motor. */
export type SeatingErrorCode =
  | 'INVALID_PAX'
  | 'INVALID_SEATS'
  | 'DUPLICATE_TABLE_ID'
  | 'PLAN_OVERFLOW'
  | 'UNKNOWN_SCHEMA';

export class SeatingPlanError extends Error {
  readonly code: SeatingErrorCode;

  constructor(code: SeatingErrorCode, message: string) {
    super(`[SeatingPlan/${code}] ${message}`);
    this.name = 'SeatingPlanError';
    this.code = code;
  }
}

/** Asientos que caben en una mesa según su tipología y sus metros útiles. */
export function seatCapacity(shape: TableShape): number {
  const metrics = TABLE_METRICS[shape];
  // Mesa redonda: comensales alrededor de la circunferencia.
  // Mesa rectangular/presidencial: largo por los dos lados largos + una cabecera.
  const seats =
    shape === 'round'
      ? Math.floor((Math.PI * metrics.width) / GUEST_PITCH_M)
      : Math.floor(metrics.width / GUEST_PITCH_M) * 2 + 2;
  return Math.min(MAX_SEATS_BY_SHAPE[shape], Math.max(2, seats));
}

/**
 * Rejilla determinista de mesas para un aforo.
 *
 * No hay colocación "al azar": se reparte en columnas de 4 como máximo, con
 * separación fija de 3,2 m entre centros (1,2 m de pasillo de servicio a cada
 * lado de una mesa de 2,4 m). Un plano que cambia entre recargas rompería el
 * enlace compartible.
 */
export function buildDefaultPlan(input: {
  readonly pax: number;
  readonly venueCapacity?: number;
  readonly eventName?: string;
  readonly shape?: TableShape;
}): SeatingPlan {
  const pax = Math.trunc(input.pax);
  if (!Number.isFinite(pax) || pax < 1) {
    throw new SeatingPlanError('INVALID_PAX', `aforo no válido: ${String(input.pax)}`);
  }

  const shape: TableShape = input.shape ?? 'round';
  const seatsPerTable = seatCapacity(shape);
  const tableCount = Math.ceil(pax / seatsPerTable);

  const tables: SeatingTable[] = [];
  const columns = Math.min(4, tableCount);
  for (let index = 0; index < tableCount; index += 1) {
    const column = index % columns;
    const row = Math.floor(index / columns);
    tables.push({
      id: `mesa-${index + 1}`,
      label: shape === 'presidential' && index === 0 ? 'Mesa presidencial' : `Mesa ${index + 1}`,
      shape,
      seats: seatsPerTable,
      x: round2(1.5 + column * 3.2),
      y: round2(1.5 + row * 3.2),
      rotation: 0,
      scale: 1,
    });
  }

  return Object.freeze({
    version: 1 as const,
    eventName: (input.eventName ?? '').slice(0, 80),
    pax,
    venueCapacity: Math.max(0, Math.trunc(input.venueCapacity ?? 0)),
    tables: Object.freeze(tables),
    fixtures: Object.freeze([] as SeatingFixture[]),
    guests: Object.freeze([] as SeatingGuest[]),
  });
}

/** Aforo total sentado del plano (suma de asientos). */
export function totalSeats(plan: SeatingPlan): number {
  return plan.tables.reduce((acc, table) => acc + table.seats, 0);
}

export interface PlanValidation {
  readonly ok: boolean;
  readonly seats: number;
  readonly missingSeats: number;
  /** `true` si el plano excede el aforo declarado del espacio. */
  readonly exceedsVenue: boolean;
  readonly overflow: number;
  /** Invitados anotados que aún no tienen asiento. */
  readonly unseatedGuests: number;
}

/** Valida el plano contra el aforo del evento, el espacio y la lista de invitados. */
export function validatePlan(plan: SeatingPlan): PlanValidation {
  const seats = totalSeats(plan);
  const exceedsVenue = plan.venueCapacity > 0 && seats > plan.venueCapacity;
  const tally = tallyGuests(plan);
  return {
    ok: seats >= plan.pax && !exceedsVenue && tally.listed <= seats,
    seats,
    missingSeats: Math.max(0, plan.pax - seats),
    exceedsVenue,
    overflow: exceedsVenue ? seats - plan.venueCapacity : 0,
    unseatedGuests: tally.listed - tally.seated,
  };
}

/* ─────────────────────────────────────────────────────────────────────────────
 * 4 · CONTADOR DE AFORO EN VIVO (asientos · sentados · RSVP)
 * ───────────────────────────────────────────────────────────────────────────── */

export interface GuestTally {
  /** Invitados anotados en la lista, sentados o no. */
  readonly listed: number;
  /** Invitados con asiento asignado. */
  readonly seated: number;
  /** Invitados anotados con `rsvp === 'confirmed'`. */
  readonly confirmed: number;
  /** Invitados que ya están sentados Y han confirmado. */
  readonly confirmedSeated: number;
  /** Asientos montados que siguen vacíos (nunca negativo). */
  readonly freeSeats: number;
}

/** Cuenta el estado de la lista contra los asientos montados. Función pura. */
export function tallyGuests(plan: SeatingPlan): GuestTally {
  let seated = 0;
  let confirmed = 0;
  let confirmedSeated = 0;
  for (const guest of plan.guests) {
    const isSeated = isGuestSeated(guest);
    if (isSeated) seated += 1;
    if (guest.rsvp === 'confirmed') {
      confirmed += 1;
      if (isSeated) confirmedSeated += 1;
    }
  }
  const seats = totalSeats(plan);
  return {
    listed: plan.guests.length,
    seated,
    confirmed,
    confirmedSeated,
    freeSeats: Math.max(0, seats - seated),
  };
}

/* ─────────────────────────────────────────────────────────────────────────────
 * 5 · MOTOR DE MUTACIÓN (PURO · INMUTABLE · IDEMPOTENTE)
 * ─────────────────────────────────────────────────────────────────────────────
 * Cada operador devuelve un plano NUEVO. Ningún handler de UI reescribe mesas a
 * mano: si el operador no cambia nada, devuelve el MISMO objeto por referencia y
 * React no re-renderiza (idempotencia real, no maquillada).
 * ───────────────────────────────────────────────────────────────────────────── */

/** Mapa de mesas a un nuevo array; el resto del plano se conserva. */
function mapTables(plan: SeatingPlan, mutate: (table: SeatingTable) => SeatingTable): SeatingPlan {
  let changed = false;
  const tables = plan.tables.map((table) => {
    const next = mutate(table);
    if (next !== table) changed = true;
    return next;
  });
  return changed ? { ...plan, tables } : plan;
}

/** Mueve una mesa u objeto de mobiliario (redondeo a 0,01 m, nunca negativo). */
export function moveElement(plan: SeatingPlan, id: string, x: number, y: number): SeatingPlan {
  const nx = round2(Math.max(0, x));
  const ny = round2(Math.max(0, y));
  const table = plan.tables.find((candidate) => candidate.id === id);
  if (table !== undefined) {
    if (table.x === nx && table.y === ny) return plan;
    return mapTables(plan, (candidate) => (candidate.id === id ? { ...candidate, x: nx, y: ny } : candidate));
  }
  let changed = false;
  const fixtures = plan.fixtures.map((fixture) => {
    if (fixture.id !== id || (fixture.x === nx && fixture.y === ny)) return fixture;
    changed = true;
    return { ...fixture, x: nx, y: ny };
  });
  return changed ? { ...plan, fixtures } : plan;
}

/** Rota una mesa u objeto a `deg` grados (normalizado 0–359). */
export function rotateElement(plan: SeatingPlan, id: string, deg: number): SeatingPlan {
  const rotation = normalizeRotation(deg);
  const table = plan.tables.find((candidate) => candidate.id === id);
  if (table !== undefined) {
    if (table.rotation === rotation) return plan;
    return mapTables(plan, (candidate) => (candidate.id === id ? { ...candidate, rotation } : candidate));
  }
  let changed = false;
  const fixtures = plan.fixtures.map((fixture) => {
    if (fixture.id !== id || fixture.rotation === rotation) return fixture;
    changed = true;
    return { ...fixture, rotation };
  });
  return changed ? { ...plan, fixtures } : plan;
}

/** Escala una mesa u objeto (0,60–1,80). */
export function scaleElement(plan: SeatingPlan, id: string, scale: number): SeatingPlan {
  const next = clampScale(scale);
  const table = plan.tables.find((candidate) => candidate.id === id);
  if (table !== undefined) {
    if (table.scale === next) return plan;
    return mapTables(plan, (candidate) => (candidate.id === id ? { ...candidate, scale: next } : candidate));
  }
  let changed = false;
  const fixtures = plan.fixtures.map((fixture) => {
    if (fixture.id !== id || fixture.scale === next) return fixture;
    changed = true;
    return { ...fixture, scale: next };
  });
  return changed ? { ...plan, fixtures } : plan;
}

/**
 * Ajusta las plazas de una mesa al valor absoluto `seats` (2–12).
 *
 * Al BAJAR plazas se desalojan los invitados que ocupaban asientos que dejan de
 * existir: quedan en la lista, sin mesa, con su etiqueta intacta. No se borra a
 * nadie por redimensionar (un invitado perdido es un fallo comercial).
 */
export function setTableSeats(plan: SeatingPlan, id: string, seats: number): SeatingPlan {
  const table = plan.tables.find((candidate) => candidate.id === id);
  if (table === undefined) return plan;
  const nextSeats = clampSeats(table.shape, seats);
  if (nextSeats === table.seats) return plan;

  const tables = plan.tables.map((candidate) =>
    candidate.id === id ? { ...candidate, seats: nextSeats } : candidate,
  );
  const guests = plan.guests.map((guest) =>
    guest.tableId === id && guest.seatIndex !== null && guest.seatIndex >= nextSeats
      ? { ...guest, tableId: null, seatIndex: null }
      : guest,
  );
  return { ...plan, tables, guests };
}

/** Suma o resta plazas a una mesa (el operador `+ / -` de la toolbar). */
export function nudgeTableSeats(plan: SeatingPlan, id: string, delta: number): SeatingPlan {
  const table = plan.tables.find((candidate) => candidate.id === id);
  if (table === undefined) return plan;
  return setTableSeats(plan, id, table.seats + Math.trunc(delta));
}

/**
 * Cambia la tipología respetando las plazas ya montadas: una presidencial de 10
 * que pasa a redonda conserva sus 10 asientos, y el tope de la nueva geometría
 * sólo recorta lo que el montaje no admite.
 */
export function setTableShape(plan: SeatingPlan, id: string, shape: TableShape): SeatingPlan {
  const table = plan.tables.find((candidate) => candidate.id === id);
  if (table === undefined || table.shape === shape) return plan;
  const seats = clampSeats(shape, table.seats);
  const tables = plan.tables.map((candidate) =>
    candidate.id === id ? { ...candidate, shape, seats } : candidate,
  );
  const guests = plan.guests.map((guest) =>
    guest.tableId === id && guest.seatIndex !== null && guest.seatIndex >= seats
      ? { ...guest, tableId: null, seatIndex: null }
      : guest,
  );
  return { ...plan, tables, guests };
}

/** Renombra una mesa (etiqueta saneada; 1–40 caracteres). */
export function renameTable(plan: SeatingPlan, id: string, label: string): SeatingPlan {
  const clean = label.replace(/\s+/g, ' ').trim().slice(0, 40);
  if (clean.length === 0) return plan;
  const table = plan.tables.find((candidate) => candidate.id === id);
  if (table === undefined || table.label === clean) return plan;
  return mapTables(plan, (candidate) => (candidate.id === id ? { ...candidate, label: clean } : candidate));
}

const NEW_TABLE_GAP_M = 3.2;

/** Siguiente número libre de mesa (nunca reutiliza un hueco histórico). */
function nextTableNumber(plan: SeatingPlan): number {
  const taken = new Set(plan.tables.map((table) => table.id));
  let candidate = plan.tables.length + 1;
  while (taken.has(`mesa-${candidate}`)) candidate += 1;
  return candidate;
}

/** Añade una mesa en la primera celda de la rejilla que quede libre. */
export function addTable(plan: SeatingPlan, shape: TableShape): SeatingPlan {
  const index = nextTableNumber(plan);
  const slots = plan.tables.length;
  const next: SeatingTable = {
    id: `mesa-${index}`,
    label: shape === 'presidential' ? `Presidencial ${index}` : `Mesa ${index}`,
    shape,
    seats: seatCapacity(shape),
    x: round2(1.5 + (slots % 4) * NEW_TABLE_GAP_M),
    y: round2(1.5 + Math.floor(slots / 4) * NEW_TABLE_GAP_M),
    rotation: 0,
    scale: 1,
  };
  return { ...plan, tables: [...plan.tables, next] };
}

/** Elimina una mesa y libera a sus invitados (no los borra). */
export function removeTable(plan: SeatingPlan, id: string): SeatingPlan {
  if (!plan.tables.some((table) => table.id === id)) return plan;
  return {
    ...plan,
    tables: plan.tables.filter((table) => table.id !== id),
    guests: plan.guests.map((guest) =>
      guest.tableId === id ? { ...guest, tableId: null, seatIndex: null } : guest,
    ),
  };
}

/** Añade un objeto de mobiliario. El id es `mobiliario-<n>` (determinista). */
export function addFixture(plan: SeatingPlan, kind: FixtureKind): SeatingPlan {
  const taken = new Set(plan.fixtures.map((fixture) => fixture.id));
  let index = plan.fixtures.length + 1;
  while (taken.has(`mobiliario-${index}`)) index += 1;
  const spec = FIXTURE_SPEC[kind];
  const slots = plan.fixtures.length;
  const next: SeatingFixture = {
    id: `mobiliario-${index}`,
    kind,
    label: spec.label,
    x: round2(1.5 + (slots % 3) * 6),
    y: round2(1.5 + Math.floor(slots / 3) * 5),
    rotation: 0,
    scale: 1,
  };
  return { ...plan, fixtures: [...plan.fixtures, next] };
}

/** Elimina un objeto de mobiliario por id. */
export function removeFixture(plan: SeatingPlan, id: string): SeatingPlan {
  if (!plan.fixtures.some((fixture) => fixture.id === id)) return plan;
  return { ...plan, fixtures: plan.fixtures.filter((fixture) => fixture.id !== id) };
}

const MAX_GUEST_NAME = 40;
const MAX_GUESTS = 500;

/** Siguiente id de invitado. Determinista: no usa reloj ni aleatorio. */
function nextGuestId(plan: SeatingPlan): string {
  const taken = new Set(plan.guests.map((guest) => guest.id));
  let index = plan.guests.length + 1;
  while (taken.has(`invitado-${index}`)) index += 1;
  return `invitado-${index}`;
}

/**
 * Añade un invitado a la lista (sin asiento). Devuelve el plano intacto si el
 * nombre está vacío, si es un duplicado exacto o si la lista ya está al tope.
 */
export function addGuest(
  plan: SeatingPlan,
  input: { readonly name: string; readonly tag: GuestTag; readonly rsvp?: RsvpState },
): SeatingPlan {
  const name = input.name.replace(/\s+/g, ' ').trim().slice(0, MAX_GUEST_NAME);
  if (name.length === 0 || plan.guests.length >= MAX_GUESTS) return plan;
  if (plan.guests.some((guest) => guest.name.toLowerCase() === name.toLowerCase())) return plan;
  const next: SeatingGuest = {
    id: nextGuestId(plan),
    name,
    tag: input.tag,
    rsvp: input.rsvp ?? 'pending',
    tableId: null,
    seatIndex: null,
  };
  return { ...plan, guests: [...plan.guests, next] };
}

/** Quita un invitado de la lista por id. */
export function removeGuest(plan: SeatingPlan, id: string): SeatingPlan {
  if (!plan.guests.some((guest) => guest.id === id)) return plan;
  return { ...plan, guests: plan.guests.filter((guest) => guest.id !== id) };
}

/** Cambia etiqueta y/o RSVP de un invitado. */
export function updateGuest(
  plan: SeatingPlan,
  id: string,
  patch: { readonly tag?: GuestTag; readonly rsvp?: RsvpState },
): SeatingPlan {
  const guest = plan.guests.find((candidate) => candidate.id === id);
  if (guest === undefined) return plan;
  const tag = patch.tag ?? guest.tag;
  const rsvp = patch.rsvp ?? guest.rsvp;
  if (tag === guest.tag && rsvp === guest.rsvp) return plan;
  return {
    ...plan,
    guests: plan.guests.map((candidate) => (candidate.id === id ? { ...candidate, tag, rsvp } : candidate)),
  };
}

/**
 * Sienta a un invitado en `(tableId, seatIndex)`.
 *
 * Reglas de integridad, todas verificadas aquí y no en la UI:
 *   · El asiento debe existir (0 ≤ seatIndex < seats).
 *   · Si lo ocupaba otro invitado, ése vuelve a la lista sin asiento (nunca dos
 *     personas en la misma silla).
 *   · Si el invitado ya estaba sentado, se libera su silla anterior.
 */
export function seatGuest(plan: SeatingPlan, guestId: string, tableId: string, seatIndex: number): SeatingPlan {
  const guest = plan.guests.find((candidate) => candidate.id === guestId);
  const table = plan.tables.find((candidate) => candidate.id === tableId);
  if (guest === undefined || table === undefined) return plan;
  if (!Number.isInteger(seatIndex) || seatIndex < 0 || seatIndex >= table.seats) return plan;
  if (guest.tableId === tableId && guest.seatIndex === seatIndex) return plan;

  const guests = plan.guests.map((candidate) => {
    if (candidate.id === guestId) return { ...candidate, tableId, seatIndex };
    // Desalojo por colisión: mismo destino exacto.
    if (candidate.tableId === tableId && candidate.seatIndex === seatIndex) {
      return { ...candidate, tableId: null, seatIndex: null };
    }
    return candidate;
  });
  return { ...plan, guests };
}

/** Devuelve un invitado a la lista (sin asiento). */
export function unseatGuest(plan: SeatingPlan, guestId: string): SeatingPlan {
  const guest = plan.guests.find((candidate) => candidate.id === guestId);
  if (guest === undefined || !isGuestSeated(guest)) return plan;
  return {
    ...plan,
    guests: plan.guests.map((candidate) =>
      candidate.id === guestId ? { ...candidate, tableId: null, seatIndex: null } : candidate,
    ),
  };
}

/**
 * Auto-colocación determinista: sienta a los invitados sin asiento en el primer
 * hueco libre, respetando el orden de la lista y el de las mesas. Es la acción
 * "Sentar automáticamente": sin azar, mismo plano ⇒ mismo reparto.
 */
export function autoSeatGuests(plan: SeatingPlan): SeatingPlan {
  const taken = new Map<string, Set<number>>();
  for (const guest of plan.guests) {
    if (guest.tableId !== null && guest.seatIndex !== null) {
      const bucket = taken.get(guest.tableId) ?? new Set<number>();
      bucket.add(guest.seatIndex);
      taken.set(guest.tableId, bucket);
    }
  }

  const pending = plan.guests.filter((guest) => !isGuestSeated(guest));
  if (pending.length === 0) return plan;

  const placement = new Map<string, { readonly tableId: string; readonly seatIndex: number }>();
  for (const guest of pending) {
    for (const table of plan.tables) {
      const bucket = taken.get(table.id) ?? new Set<number>();
      let free = -1;
      for (let seat = 0; seat < table.seats; seat += 1) {
        if (!bucket.has(seat)) {
          free = seat;
          break;
        }
      }
      if (free >= 0) {
        bucket.add(free);
        taken.set(table.id, bucket);
        placement.set(guest.id, { tableId: table.id, seatIndex: free });
        break;
      }
    }
  }
  if (placement.size === 0) return plan;

  return {
    ...plan,
    guests: plan.guests.map((guest) => {
      const spot = placement.get(guest.id);
      return spot === undefined ? guest : { ...guest, tableId: spot.tableId, seatIndex: spot.seatIndex };
    }),
  };
}

/* ─────────────────────────────────────────────────────────────────────────────
 * 6 · CONSULTAS DE PRESENTACIÓN (geometría efectiva tras rotar y escalar)
 * ───────────────────────────────────────────────────────────────────────────── */

/** Ancho/alto EFECTIVOS en metros de una mesa tras aplicar escala. */
export function effectiveMetrics(table: SeatingTable): { readonly width: number; readonly height: number } {
  const metrics = TABLE_METRICS[table.shape];
  return { width: round2(metrics.width * table.scale), height: round2(metrics.height * table.scale) };
}

/** Ancho/alto EFECTIVOS en metros de un objeto de mobiliario tras aplicar escala. */
export function fixtureMetrics(fixture: SeatingFixture): { readonly width: number; readonly height: number } {
  const spec = FIXTURE_SPEC[fixture.kind];
  return { width: round2(spec.width * fixture.scale), height: round2(spec.height * fixture.scale) };
}

/**
 * Caja envolvente tras rotar. Una mesa a 90° ocupa lo que antes era su alto: sin
 * esto, el tablero recortaría las mesas giradas y el drag las dejaría salirse
 * por el borde derecho.
 */
export function rotatedBounds(
  metrics: { readonly width: number; readonly height: number },
  rotationDeg: number,
): { readonly width: number; readonly height: number } {
  const radians = (normalizeRotation(rotationDeg) * Math.PI) / 180;
  const cos = Math.abs(Math.cos(radians));
  const sin = Math.abs(Math.sin(radians));
  return {
    width: round2(metrics.width * cos + metrics.height * sin),
    height: round2(metrics.width * sin + metrics.height * cos),
  };
}

/** Invitado sentado en `(tableId, seatIndex)`, si lo hay. */
export function guestAtSeat(plan: SeatingPlan, tableId: string, seatIndex: number): SeatingGuest | null {
  return plan.guests.find((guest) => guest.tableId === tableId && guest.seatIndex === seatIndex) ?? null;
}

/** Invitados sentados en una mesa, ordenados por asiento. */
export function guestsOfTable(plan: SeatingPlan, tableId: string): readonly SeatingGuest[] {
  return plan.guests
    .filter((guest) => guest.tableId === tableId && guest.seatIndex !== null)
    .sort((left, right) => (left.seatIndex ?? 0) - (right.seatIndex ?? 0));
}

/** Invitados sin asiento. */
export function unseatedGuests(plan: SeatingPlan): readonly SeatingGuest[] {
  return plan.guests.filter((guest) => !isGuestSeated(guest));
}

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}
