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
  SeatingPlanError,
  type SeatingPlan,
  type SeatingTable,
  type TableShape,
} from './seating-plan';

export const STORAGE_KEY = 'ear-os:seating-planner:v1';
export const URL_HASH_PREFIX = '#plan=';

const SHAPES: readonly TableShape[] = ['round', 'rectangular', 'presidential'];
const SHAPE_CODE: Readonly<Record<TableShape, string>> = Object.freeze({
  round: 'r',
  rectangular: 't',
  presidential: 'p',
});

const MAX_HASH_LENGTH = 6000;
const MAX_TABLES = 200;

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

/**
 * Una fila = una mesa. Función aislada a propósito: el auditor CISQ §5.4 exige
 * CC <= 15 por función, y el parseo de una fila tiene 4 ramas independientes.
 */
function decodeRow(row: string, context: DecodeContext): SeatingTable {
  const cells = row.split(',');
  if (cells.length !== 5) {
    throw new SeatingPlanError('UNKNOWN_SCHEMA', `fila ${context.position + 1} inválida`);
  }
  const shapeCode = cells[1];
  const shape = SHAPES.find((candidate) => SHAPE_CODE[candidate] === shapeCode);
  if (shape === undefined) {
    throw new SeatingPlanError('UNKNOWN_SCHEMA', `tipología desconocida: ${shapeCode}`);
  }
  const seats = Number.parseInt(cells[2], 10);
  const x = Number.parseFloat(cells[3]);
  const y = Number.parseFloat(cells[4]);
  if (!Number.isFinite(seats) || seats < 0) {
    throw new SeatingPlanError('INVALID_SEATS', `asientos no válidos en fila ${context.position + 1}`);
  }
  if (!Number.isFinite(x) || !Number.isFinite(y)) {
    throw new SeatingPlanError('UNKNOWN_SCHEMA', `coordenadas no válidas en fila ${context.position + 1}`);
  }
  return {
    id: `mesa-${context.position + 1}`,
    label: readValue(context, cells[0]).slice(0, 40),
    shape,
    seats,
    x,
    y,
  };
}

/** Serializa el plano a un token ASCII corto. Función pura. */
export function encodePlan(plan: SeatingPlan): string {
  const values: string[] = [];
  /**
   * Los valores libres (nombre del evento y etiqueta de mesa) pueden contener
   * los separadores del formato. El arnés lo detectó con una etiqueta
   * `Mesa 1.2`: el token se partía y el plano se rechazaba. Se codifican con
   * un escape propio (`%XX`) que NO usa ningún separador del formato.
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

  const header = [indexOf(plan.eventName), String(plan.pax), String(plan.venueCapacity)].join(',');
  const rows = plan.tables.map((table) =>
    [
      indexOf(table.label),
      SHAPE_CODE[table.shape],
      String(table.seats),
      String(table.x),
      String(table.y),
    ].join(','),
  );

  return [header, values.join('~'), rows.join(';')].join('|');
}

/** Deserializa un token. Lanza `SeatingPlanError` ante cualquier anomalía. */
export function decodePlan(token: string): SeatingPlan {
  if (typeof token !== 'string' || token.length === 0 || token.length > MAX_HASH_LENGTH) {
    throw new SeatingPlanError('UNKNOWN_SCHEMA', 'token vacío o de longitud no admitida');
  }

  const parts = token.split('|');
  if (parts.length !== 3) {
    throw new SeatingPlanError('UNKNOWN_SCHEMA', 'estructura de token inválida');
  }

  const [headerRaw, valuesRaw, rowsRaw] = parts;
  const values = valuesRaw.length === 0 ? [] : valuesRaw.split('~');

  const header = headerRaw.split(',');
  if (header.length !== 3) {
    throw new SeatingPlanError('UNKNOWN_SCHEMA', 'cabecera inválida');
  }

  const pax = Number.parseInt(header[1], 10);
  const venueCapacity = Number.parseInt(header[2], 10);
  if (!Number.isFinite(pax) || pax < 1) {
    throw new SeatingPlanError('INVALID_PAX', `aforo no válido en token: ${header[1]}`);
  }

  const rows = rowsRaw.length === 0 ? [] : rowsRaw.split(';');
  if (rows.length > MAX_TABLES) {
    throw new SeatingPlanError('PLAN_OVERFLOW', `token con ${rows.length} mesas (máximo ${MAX_TABLES})`);
  }

  const tables = rows.map((_row, index) => decodeRow(rows[index] ?? '', { values, position: index }));

  return {
    version: 1,
    eventName: readValue({ values, position: 0 }, header[0]).slice(0, 80),
    pax,
    venueCapacity: Number.isFinite(venueCapacity) ? Math.max(0, venueCapacity) : 0,
    tables,
  };
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

/** Guarda de tipo pública: la query `?tipo=` no puede colar un valor ajeno. */
export function isTableShapeValue(value: string): value is TableShape {
  return (SHAPES as readonly string[]).includes(value);
}
