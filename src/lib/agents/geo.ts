/**
 * 🛰️ GEO DATA — RED HOMOLOGADA S-CLASS (fuente única de datos geo).
 * ----------------------------------------------------------------------------
 * Datos geográficos de la red de fincas homologadas y la matriz de distancias
 * desde el Hub Méntrida (km 0). Centralizados aquí para cumplir la doctrina
 * anti-hardcode: la ruta de dinero (chat/reservas) no debe incrustar arrays.
 * ----------------------------------------------------------------------------
 */

/** Fincas / recintos homologados de la red S-CLASS (Ley 37/2003 + CETAC 32A). */
export const KNOWN_FINCAS: readonly string[] = [
  'Villa Escorial Park',
  'Finca La Chopera',
  'Soto de Mozanaque',
  'Finca El Regajal',
  'Finca Aldea Santillana',
  'La Casona de Torrelodones',
  'Finca Las Tenadas',
  'Cigarral del Ángel',
  'Finca Los Enebrales',
  'La Quinta de Jarama',
  'Castillo de Viñuelas',
  'Finca Valduerna',
  'Dehesa de Valbueno',
] as const;

/** Matriz de distancia (km) desde el Hub Méntrida hacia poblaciones de la red. */
export const CITY_KM_FROM_MENTRIDA: readonly (readonly [string, number])[] = [
  ['alacuas', 365],
  ['alaquas', 365],
  ['alaquàs', 365],
  ['valencia', 360],
  ['valència', 360],
  ['madrid', 60],
  ['toledo', 45],
  ['mentrida', 0],
  ['méntrida', 0],
  ['sevilla', 530],
  ['barcelona', 620],
  ['albacete', 260],
  ['cuenca', 190],
  ['guadalajara', 110],
  ['ciudad real', 140],
  ['talavera', 75],
  ['aranjuez', 55],
  ['san lorenzo de el escorial', 58],
  ['escorial', 58],
] as const;

/** Distancia (km) por defecto cuando no se detecta población ni contexto. */
export const DEFAULT_DISTANCE_KM: number = 80;

/** Distancia (km) por defecto para contextos de finca homologada. */
export const FINCA_DISTANCE_KM: number = 58;

/** Distancia (km) para Toledo (referencia canónica de la red). */
export const TOLEDO_DISTANCE_KM: number = 45;

/**
 * Resuelve la población detectada y su distancia al Hub Méntrida.
 * Devuelve `null` si no se reconoce ninguna población en el texto.
 */
export function resolveCityDistance(
  lowerMessage: string,
): { city: string; distanceKm: number } | null {
  const hit = CITY_KM_FROM_MENTRIDA.find(([city]) => lowerMessage.includes(city));
  if (hit) {
    return { city: hit[0].charAt(0).toUpperCase() + hit[0].slice(1), distanceKm: hit[1] };
  }
  return null;
}
