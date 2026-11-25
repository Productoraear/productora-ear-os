/**
 * 🛰️ GEO DATA & MOTOR LOGÍSTICO DETERMINISTA — S-CLASS v15.0
 * ----------------------------------------------------------------------------
 * Fuente canónica de coordenadas y enrutamiento logístico:
 * - Hub Méntrida (Km 0): Base operativa de Edwin Agudelo (Paciente Cero e78903).
 * - Enrutamiento BuyBox desacoplado:
 *   * Distancia <= 150 km: Paquetizado integrado con flota Méntrida (1 solo porte).
 *   * Distancia > 150 km: Desacoplamiento obligatorio al proveedor local homologado.
 * ----------------------------------------------------------------------------
 */

export interface GeoCoordinates {
  readonly latitude: number;
  readonly longitude: number;
}

/**
 * Coordenadas canónicas exactas de Edwin Agudelo (Hub Méntrida Km 0).
 * Sede: Calle de la Tórtola 5, Urbanización Encinasola, 45214 Méntrida (Toledo).
 */
export const HUB_MENTRIDA_COORDINATES: GeoCoordinates = Object.freeze({
  latitude: 40.2378,
  longitude: -4.1953,
});

export const HUB_MENTRIDA_ADDRESS = Object.freeze({
  street: 'Calle de la Tórtola 5',
  urbanization: 'Urbanización Encinasola',
  postalCode: '45214',
  municipality: 'Méntrida',
  province: 'Toledo',
  country: 'España',
  gps: '40.2378, -4.1953',
});

/** Umbral de distancia para despacho integrado vs desacoplado. */
export const INTEGRATED_DISPATCH_THRESHOLD_KM: number = 150;

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
  ['bilbao', 440],
  ['derio', 445],
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

export type LogisticsDispatchMode = 'INTEGRATED_MENTRIDA_FLEET' | 'DECOUPLED_LOCAL_BUYBOX';

export interface LogisticsRoutingPlan {
  readonly destination: string;
  readonly distanceToMentridaKm: number;
  readonly dispatchMode: LogisticsDispatchMode;
  readonly soloArtistFromMentrida: boolean;
  readonly technicalSoundFromMentrida: boolean;
  readonly reason: string;
}

/**
 * Resuelve el despacho logístico dual S-Class:
 * - Edwin Agudelo (1P Solista) SIEMPRE viaja desde Hub Méntrida con su cálculo canónico.
 * - El equipamiento técnico (sonido/iluminación) viaja desde Méntrida si <= 150 km,
 *   o se desacopla hacia el proveedor homologado más próximo si > 150 km.
 */
export function planLogisticsDispatch(
  destinationText: string,
  explicitDistanceKm?: number
): LogisticsRoutingPlan {
  const resolved = resolveCityDistance(destinationText.toLowerCase());
  const distance = explicitDistanceKm !== undefined && explicitDistanceKm >= 0
    ? explicitDistanceKm
    : (resolved?.distanceKm ?? DEFAULT_DISTANCE_KM);
  const city = resolved?.city ?? destinationText;

  const isIntegrated = distance <= INTEGRATED_DISPATCH_THRESHOLD_KM;

  return {
    destination: city,
    distanceToMentridaKm: distance,
    dispatchMode: isIntegrated ? 'INTEGRATED_MENTRIDA_FLEET' : 'DECOUPLED_LOCAL_BUYBOX',
    soloArtistFromMentrida: true,
    technicalSoundFromMentrida: isIntegrated,
    reason: isIntegrated
      ? `Distancia ${distance} km <= ${INTEGRATED_DISPATCH_THRESHOLD_KM} km: porte único paquetizado desde Hub Méntrida.`
      : `Distancia ${distance} km > ${INTEGRATED_DISPATCH_THRESHOLD_KM} km: artista desde Méntrida y dotación técnica desacoplada al proveedor local más cercano en ${city}.`,
  };
}
