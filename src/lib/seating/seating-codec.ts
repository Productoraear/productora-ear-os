/**
 * ════════════════════════════════════════════════════════════════════════════
 * SEATING PLAN CODEC — SERIALIZACIÓN DETERMINISTA Y ENLACE COMPARTIBLE
 * ════════════════════════════════════════════════════════════════════════════
 * Decisión ratificada por el CEO (2026-11-11): modelo HÍBRIDO SIN BASE DE DATOS.
 *   · Autoguardado en `localStorage` (clave versionada).
 *   · Enlace compartible: el plano comprimido viaja en el hash (`#plan=`), así
 *     que NO toca el servidor, NO viaja en analytics y NO deja datos personales
 *     en logs ni URLs de CDN (INV-14). El hash nunca se envía al backend.
 *
 * Por qué no `lz-string` ni una dependencia nueva (§7.3 ASK FIRST):
 *   · El estado es una lista corta de mesas. Un RLE propio de dos fases
 *     (diccionario de valores + códigos de una letra) da la misma garantía sin
 *     añadir peso al bundle ni tocar `package-lock.json`.
 *
 * Formato: `cabecera|valores|filas`, separadores `.` (celdas), `~` (valores)
 * y `;` (filas). Todo ASCII; el resultado se pasa por `encodeURIComponent`.
 * ════════════════════════════════════════════════════════════════════════════
 */

import {
  GUEST_TAGS,
  FIXTURE_KINDS,
  normalizeRotation,
  clampScale,
  isGuestSeated,
  type FixtureKind,
  type GuestTag,
  type RsvpState,
  type SeatingFixture,
  type SeatingGuest,
  type SeatingPlan,
  type SeatingTable,
  type TableShape,
} from './seating-plan';
import { SeatingPlanError } from './seating-plan';

export const STORAGE_KEY = 'ear-os:seating-planner:v2';
/** Clave heredada: se MIGRA al cargar, y se deja de escribir (no se duplica). */
export const LEGACY_STORAGE_KEY = 'ear-os:seating-planner:v1';
export const URL_HASH_PREFIX = '#plan=';

const SHAPES: readonly TableShape[] = ['round', 'rectangular', 'presidential'];
const SHAPE_CODE: Readonly<Record<TableShape, string>> = Object.freeze({
  round: 'r',
  rectangular: 't',
  presidential: 'p',
});

/** Códigos de una letra por etiqueta y por estado RSVP (token corto). */
const TAG_CODE: Readonly<Record<GuestTag, string>> = Object.freeze({
  novia: 'n',
  novio: 'o',
  amigos: 'a',
  ninos: 'i',
  vip: 'v',
});
const RSVP_CODE: Readonly<Record<RsvpState, string>> = Object.freeze({ pending: '0', confirmed: '1' });

const MAX_HASH_LENGTH = 24000;
const MAX_TABLES = 200;
const MAX_GUESTS = 500;
const MAX_FIXTURES = 40;

/**
 * Formato v2 del token:
 *
 *   cabecera | valores | mesas ; mobiliario ; invitados
 *
 *   cabecera   = <eventNameIdx>,<pax>,<venueCapacity>,2
 *   mesa       = <labelIdx>,<shapeCode>,<seats>,<x>,<y>,<rotation>,<scale>
 *   mobiliario = <kindIdx>,<labelIdx>,<x>,<y>,<rotation>,<scale>
 *   invitado   = <nameIdx>,<tagCode>,<rsvpCode>,<tableIdx|->,<seatIndex|->
 *
 * El último bloque de la cabecera es el discriminante de esquema. Un token v1
 * (cabecera de 3 celdas, filas de 5) sigue leyéndose: los enlaces que un cliente
 * ya compartió por WhatsApp no pueden morir porque añadamos rotación.
 */

/**
 * El separador de celdas es la COMA, no el punto.
 *
 * El arnés lo cazó: `String(1.5)` es `"1.5"`, así que usar el punto como
 * separador partía las coordenadas en dos celdas y el plano se rechazaba.
 * La coma nunca aparece en `String(number)` de JS, y los valores libres siguen
 * protegidos porque una coma dentro de una etiqueta se sustituye aquí.
 */
const VALUE_UNSAFE = /[|~;,]/g;

function sanitizeValue(value: string): string {
  return value.replace(VALUE_UNSAFE, '/');
}

/** Estado de decodificación: tabla de valores y posición de la fila. */
interface DecodeContext {
  readonly values: readonly string[];
  readonly position: number;
}

function readValue(context: DecodeContext, code: string): string {
  const index = Number.parseInt(code, 36);
  const value = context.values[index];
  if (value === undefined) {
    throw new SeatingPlanError('UNKNOWN_SCHEMA', `referencia de valor inexistente: ${code}`);
  }
  return value;
}

/** Número finito a partir de una celda; `NaN` si la celda es basura. */
function cellNumber(cell: string | undefined): number {
  const parsed = Number.parseFloat(cell ?? '');
  return Number.isFinite(parsed) ? parsed : Number.NaN;
}

/** Celda opcional numérica con respaldo (usada por rotación y escala). */
function optionalNumber(cell: string | undefined, fallback: number): number {
  const parsed = cellNumber(cell);
  return Number.isFinite(parsed) ? parsed : fallback;
}

/**
 * Una fila = una mesa. Función aislada a propósito: el auditor CISQ §5.4 exige
 * CC <= 15 por función, y el parseo de una fila tiene 4 ramas independientes.
 *
 * Admite las DOS anchuras: 5 celdas (v1, sin rotación ni escala) y 7 (v2). El
 * esquema lo decide la cabecera, pero aceptar ambas anchuras aquí es lo que
 * permite que un token viejo no reviente.
 */
function decodeRow(row: string, context: DecodeContext): SeatingTable {
  const cells = row.split(',');
  if (cells.length !== 5 && cells.length !== 7) {
    throw new SeatingPlanError('UNKNOWN_SCHEMA', `fila ${context.position + 1} inválida`);
  }
  const shapeCode = cells[1];
  const shape = SHAPES.find((candidate) => SHAPE_CODE[candidate] === shapeCode);
  if (shape === undefined) {
    throw new SeatingPlanError('UNKNOWN_SCHEMA', `tipología desconocida: ${shapeCode}`);
  }
  const seats = Number.parseInt(cells[2] ?? '', 10);
  const x = cellNumber(cells[3]);
  const y = cellNumber(cells[4]);
  if (!Number.isFinite(seats) || seats < 0) {
    throw new SeatingPlanError('INVALID_SEATS', `asientos no válidos en fila ${context.position + 1}`);
  }
  if (!Number.isFinite(x) || !Number.isFinite(y)) {
    throw new SeatingPlanError('UNKNOWN_SCHEMA', `coordenadas no válidas en fila ${context.position + 1}`);
  }
  return {
    id: `mesa-${context.position + 1}`,
    label: readValue(context, cells[0] ?? '').slice(0, 40),
    shape,
    seats,
    x,
    y,
    rotation: normalizeRotation(optionalNumber(cells[5], 0)),
    scale: clampScale(optionalNumber(cells[6], 1)),
  };
}

/** Una fila de mobiliario: `<kindIdx>,<labelIdx>,<x>,<y>,<rotation>,<scale>`. */
function decodeFixtureRow(row: string, context: DecodeContext): SeatingFixture {
  const cells = row.split(',');
  if (cells.length !== 6) {
    throw new SeatingPlanError('UNKNOWN_SCHEMA', `mobiliario ${context.position + 1} inválido`);
  }
  const kindIndex = Number.parseInt(cells[0] ?? '', 10);
  const kind: FixtureKind | undefined = FIXTURE_KINDS[kindIndex];
  if (kind === undefined) {
    throw new SeatingPlanError('UNKNOWN_SCHEMA', `tipo de mobiliario desconocido: ${String(cells[0])}`);
  }
  const x = cellNumber(cells[2]);
  const y = cellNumber(cells[3]);
  if (!Number.isFinite(x) || !Number.isFinite(y)) {
    throw new SeatingPlanError('UNKNOWN_SCHEMA', `coordenadas de mobiliario no válidas (${context.position + 1})`);
  }
  return {
    id: `mobiliario-${context.position + 1}`,
    kind,
    label: readValue(context, cells[1] ?? '').slice(0, 40),
    x,
    y,
    rotation: normalizeRotation(optionalNumber(cells[4], 0)),
    scale: clampScale(optionalNumber(cells[5], 1)),
  };
}

/**
 * Una fila de invitado: `<nameIdx>,<tagCode>,<rsvpCode>,<tableIdx|->,<seat|->`.
 *
 * El asiento se referencia por ÍNDICE de mesa (no por id) para que el token no
 * repita cadenas: `mesa-7` ocupa 6 caracteres en cada invitado sentado.
 */
function decodeGuestRow(row: string, context: DecodeContext, tables: readonly SeatingTable[]): SeatingGuest {
  const cells = row.split(',');
  if (cells.length !== 5) {
    throw new SeatingPlanError('UNKNOWN_SCHEMA', `invitado ${context.position + 1} inválido`);
  }
  const tag = GUEST_TAGS.find((candidate) => TAG_CODE[candidate] === cells[1]);
  if (tag === undefined) {
    throw new SeatingPlanError('UNKNOWN_SCHEMA', `etiqueta desconocida: ${String(cells[1])}`);
  }
  const rsvp: RsvpState = cells[2] === RSVP_CODE.confirmed ? 'confirmed' : 'pending';
  const tableCell = cells[3] ?? '-';
  const seatCell = cells[4] ?? '-';

  let tableId: string | null = null;
  let seatIndex: number | null = null;
  if (tableCell !== '-' && seatCell !== '-') {
    const tableIndex = Number.parseInt(tableCell, 36);
    const seat = Number.parseInt(seatCell, 10);
    const table = tables[tableIndex];
    // Asiento huérfano (mesa borrada o plaza recortada): el invitado se conserva
    // en la lista SIN asiento. Perder una persona es peor que perder una silla.
    if (table !== undefined && Number.isFinite(seat) && seat >= 0 && seat < table.seats) {
      tableId = table.id;
      seatIndex = seat;
    }
  }

  return {
    id: `invitado-${context.position + 1}`,
    name: readValue(context, cells[0] ?? '').slice(0, 40),
    tag,
    rsvp,
    tableId,
    seatIndex,
  };
}

/** Serializa el plano a un token ASCII corto. Función pura. */
export function encodePlan(plan: SeatingPlan): string {
  const values: string[] = [];
  /**
   * Los valores libres (nombre del evento, etiqueta de mesa e invitado) pueden
   * contener los separadores del formato. El arnés lo detectó con una etiqueta
   * `Mesa 1.2`: el token se partía y el plano se rechazaba. Se sustituyen por
   * `/`, que NO es separador del formato.
   */
  const indexOf = (value: string): string => {
    const safe = sanitizeValue(value);
    let index = values.indexOf(safe);
    if (index === -1) {
      values.push(safe);
      index = values.length - 1;
    }
    return index.toString(36);
  };

  /** Índice de mesa en el array, para que el invitado no repita su id. */
  const tableIndexById = new Map<string, number>();
  plan.tables.forEach((table, index) => tableIndexById.set(table.id, index));

  const header = [
    indexOf(plan.eventName),
    String(plan.pax),
    String(plan.venueCapacity),
    String(SCHEMA_VERSION),
  ].join(',');

  const rows = plan.tables.map((table) =>
    [
      indexOf(table.label),
      SHAPE_CODE[table.shape],
      String(table.seats),
      String(table.x),
      String(table.y),
      String(table.rotation),
      String(table.scale),
    ].join(','),
  );

  const fixtureRows = plan.fixtures.map((fixture) =>
    [
      String(FIXTURE_KINDS.indexOf(fixture.kind)),
      indexOf(fixture.label),
      String(fixture.x),
      String(fixture.y),
      String(fixture.rotation),
      String(fixture.scale),
    ].join(','),
  );

  const guestRows = plan.guests.map((guest) => {
    const tableSpot = isGuestSeated(guest) ? tableIndexById.get(guest.tableId ?? '') : undefined;
    const seatRef =
      tableSpot === undefined || guest.seatIndex === null ? '-' : tableSpot.toString(36);
    const seatNumber = tableSpot === undefined || guest.seatIndex === null ? '-' : String(guest.seatIndex);
    return [indexOf(guest.name), TAG_CODE[guest.tag], RSVP_CODE[guest.rsvp], seatRef, seatNumber].join(',');
  });

  // Los bloques vacíos se emiten como cadena vacía: `a|b||` es más corto que `a|b|-|-`.
  return [header, values.join('~'), [rows.join(';'), fixtureRows.join(';'), guestRows.join(';')].join('|')].join(
    '|',
  );
}

/** Discriminante de esquema en la cabecera. */
const SCHEMA_VERSION = 2;

/**
 * Deserializa un token. Lanza `SeatingPlanError` ante cualquier anomalía.
 *
 * Acepta las DOS estructuras:
 *   · v1 → `cabecera(3) | valores | mesas` (3 partes).
 *   · v2 → `cabecera(4) | valores | mesas | mobiliario | invitados` (5 partes).
 */
export function decodePlan(token: string): SeatingPlan {
  if (typeof token !== 'string' || token.length === 0 || token.length > MAX_HASH_LENGTH) {
    throw new SeatingPlanError('UNKNOWN_SCHEMA', 'token vacío o de longitud no admitida');
  }

  const parts = token.split('|');
  if (parts.length !== 3 && parts.length !== 5) {
    throw new SeatingPlanError('UNKNOWN_SCHEMA', 'estructura de token inválida');
  }

  const [headerRaw, valuesRaw] = parts;
  const values = (valuesRaw ?? '').length === 0 ? [] : (valuesRaw ?? '').split('~');

  const header = headerRaw.split(',');
  const isV2 = header.length === 4 && header[3] === String(SCHEMA_VERSION);
  if (!isV2 && header.length !== 3) {
    throw new SeatingPlanError('UNKNOWN_SCHEMA', 'cabecera inválida');
  }

  const pax = Number.parseInt(header[1] ?? '', 10);
  const venueCapacity = Number.parseInt(header[2] ?? '', 10);
  if (!Number.isFinite(pax) || pax < 1) {
    throw new SeatingPlanError('INVALID_PAX', `aforo no válido en token: ${String(header[1])}`);
  }

  // v1: un solo bloque de mesas. v2: mesas | mobiliario | invitados.
  const tableRows = splitRows(parts[2] ?? '');
  const fixtureRows = splitRows(parts[3] ?? '');
  const guestRows = splitRows(parts[4] ?? '');

  if (tableRows.length > MAX_TABLES) {
    throw new SeatingPlanError('PLAN_OVERFLOW', `token con ${tableRows.length} mesas (máximo ${MAX_TABLES})`);
  }
  if (fixtureRows.length > MAX_FIXTURES) {
    throw new SeatingPlanError('PLAN_OVERFLOW', `token con ${fixtureRows.length} objetos (máximo ${MAX_FIXTURES})`);
  }
  if (guestRows.length > MAX_GUESTS) {
    throw new SeatingPlanError('PLAN_OVERFLOW', `token con ${guestRows.length} invitados (máximo ${MAX_GUESTS})`);
  }

  const tables = tableRows.map((_row, index) => decodeRow(tableRows[index] ?? '', { values, position: index }));
  const fixtures = fixtureRows.map((_row, index) =>
    decodeFixtureRow(fixtureRows[index] ?? '', { values, position: index }),
  );
  const guests = guestRows.map((_row, index) =>
    decodeGuestRow(guestRows[index] ?? '', { values, position: index }, tables),
  );

  return {
    version: 1,
    eventName: readValue({ values, position: 0 }, header[0] ?? '').slice(0, 80),
    pax,
    venueCapacity: Number.isFinite(venueCapacity) ? Math.max(0, venueCapacity) : 0,
    tables,
    fixtures,
    guests,
  };
}

/** Bloque de filas → array de filas (cadena vacía ⇒ cero filas). */
function splitRows(block: string): string[] {
  return block.length === 0 ? [] : block.split(';');
}

/** Enlace absoluto compartible. `origin` se inyecta para no leer `window` aquí. */
export function buildShareUrl(origin: string, pathname: string, plan: SeatingPlan): string {
  return `${origin}${pathname}${URL_HASH_PREFIX}${encodeURIComponent(encodePlan(plan))}`;
}

/** Extrae el token del hash de una URL; `null` si no hay plano embebido. */
export function readTokenFromHash(hash: string): string | null {
  if (!hash.startsWith(URL_HASH_PREFIX)) return null;
  const raw = hash.slice(URL_HASH_PREFIX.length);
  if (raw.length === 0) return null;
  try {
    return decodeURIComponent(raw);
  } catch {
    throw new SeatingPlanError('UNKNOWN_SCHEMA', 'hash no decodificable');
  }
}

/** Aforo desde la query (`?pax=`): se acota para no admitir basura de URL. */
export function readPaxFromQuery(value: string | null): number | null {
  if (value === null) return null;
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed < 1 || parsed > 2000) return null;
  return parsed;
}

/**
 * ── HASH DETERMINISTA DEL PLANO (SUTURA SEATING → PRESUPUESTO) ──────────────
 *
 * El plano viaja al cotizador como `?seatingPlan=<hash>`. Ese hash debe ser:
 *   · ESTABLE: el mismo plano produce siempre el mismo token (idempotencia).
 *   · COMPACTO: cabe cómodamente en una URL y no revienta límites de proxy.
 *   · SIN DATOS PERSONALES: el hash no puede ser el plano en claro. Llevar los
 *     nombres de los invitados a una URL de analítica sería INV-14 roto.
 *
 * Implementación: FNV-1a de 32 bits con mezcla final (avalancha) sobre el token
 * canónico de `encodePlan`. Sin `crypto.subtle` porque ese API es asíncrono y
 * obligaría a `await` en el handler del clic; FNV-1a es síncrono y determinista.
 *
 * Se emiten DOS palabras de 32 bits (64 bits de espacio) en base36 para que la
 * colisión sea despreciable: `"<hi><lo>"` en minúsculas.
 *
 * LÍMITE DECLARADO (AF-2): el destino `/presupuesto` ve el hash, no el plano.
 * Ese hash PRUEBA que el plano existía y es estable, pero no es reversible por
 * diseño (nombres fuera de la URL). El plano completo viaja en el `localStorage`
 * del cliente bajo `STORAGE_KEY`, que es lo que el plumero comercial lee.
 */
function fnv1a32(input: string, seed: number): number {
  let hash = seed >>> 0;
  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index);
    // Multiplicación FNV prime (16777619) con aritmética de 32 bits segura.
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  // Mezcla final (avalancha) para repartir diferencias de 1 bit.
  hash ^= hash >>> 16;
  hash = Math.imul(hash, 0x21f0aaad) >>> 0;
  hash ^= hash >>> 15;
  hash = Math.imul(hash, 0x735a2d97) >>> 0;
  hash ^= hash >>> 15;
  return hash >>> 0;
}

/**
 * Hash serializado del plano para la sutura transaccional.
 * Determinista: mismo `SeatingPlan` ⇒ mismo hash, en cualquier ejecución.
 */
export function hashSeatingPlan(plan: SeatingPlan): string {
  const canonical = encodePlan(plan);
  const high = fnv1a32(canonical, 0x811c9dc5);
  const low = fnv1a32(canonical, 0x01000193);
  return `${high.toString(36)}${low.toString(36)}`;
}

/**
 * Hash del plano REDUCIDO a su huella operativa: mesas, plazas, invitados y
 * RSVP. Dos planos que sólo difieren en un arrastre, un giro o una escala
 * comparten huella, porque el negocio que se cierra es el mismo: se monta el
 * mismo número de mesas y se sienta a las mismas personas. Lo que sí cambia la
 * huella es alquilar otra mesa o mover a un invitado.
 */
export function hashSeatingIntent(plan: SeatingPlan): string {
  const canonical = [
    plan.pax,
    plan.venueCapacity,
    plan.tables.map((table) => `${table.id}|${table.shape}|${table.seats}`).join(';'),
    plan.fixtures.map((fixture) => fixture.kind).sort().join(';'),
    plan.guests
      .map((guest) => `${guest.name}|${guest.tag}|${guest.rsvp}|${guest.tableId}|${guest.seatIndex}`)
      .join(';'),
  ].join('~');
  return `${fnv1a32(canonical, 0x811c9dc5).toString(36)}${fnv1a32(canonical, 0x01000193).toString(36)}`;
}

/** `true` si el valor tiene la forma de un hash emitido por `hashSeatingPlan`. */
export function isSeatingPlanHash(value: string | null): boolean {
  if (value === null) return false;
  return /^[0-9a-z]{1,14}$/.test(value);
}

/** Ruta de aterrizaje en el cotizador con el plano adjunto (sutura Bloque 3). */
export function buildBudgetHrefWithPlan(plan: SeatingPlan): string {
  const params = new URLSearchParams();
  params.set('seatingPlan', hashSeatingPlan(plan));
  params.set('leadMagnet', 'true');
  params.set('pax', String(plan.pax));
  if (plan.venueCapacity > 0) params.set('aforo', String(plan.venueCapacity));
  // Huella operativa: permite al comercial verificar que el expediente que abrió
  // es el mismo que el cliente bloqueó, sin exponer un solo nombre en la URL.
  params.set('seatingIntent', hashSeatingIntent(plan));
  return `/presupuesto?${params.toString()}`;
}

/** Guarda de tipo pública: la query `?tipo=` no puede colar un valor ajeno. */
export function isTableShapeValue(value: string): value is TableShape {
  return (SHAPES as readonly string[]).includes(value);
}
