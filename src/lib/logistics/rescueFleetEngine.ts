/**
 * EAR SOS RESCUE — Motor de flota de rescate logístico
 * ----------------------------------------------------
 * Matriz de cubicaje por clase de vehículo + cálculo haversine
 * para estimar distancia, tiempos y vehículo óptimo ante un
 * incidente en evento (equipo caído, refuerzo de sonido, PAX extra).
 */

export type FleetClass = "micro" | "medio" | "pesado";

export type RescueVehicle = {
  id: string;
  name: string;
  fleetClass: FleetClass;
  /** Volumen útil en m³ */
  capacityM3: number;
  /** Carga útil en kg */
  payloadKg: number;
  /** Equipamiento embarcado de serie */
  equipment: string[];
  /** Coste de movilización base (€) */
  mobilizationCostEur: number;
  /** €/km aplicable desde Méntrida a partir del km 50 */
  costPerKmEur: number;
};

export type GeoPoint = {
  lat: number;
  lng: number;
};

export type RescueRequest = {
  origin: GeoPoint;
  destination: GeoPoint;
  /** Volumen de equipo a transportar en m³ */
  requiredVolumeM3: number;
  /** Peso estimado en kg */
  requiredWeightKg: number;
  /** PAX adicionales a reforzar (opcional) */
  extraPax?: number;
};

export type RescueQuote = {
  vehicle: RescueVehicle;
  distanceKm: number;
  estimatedMinutes: number;
  logisticsCostEur: number;
  totalCostEur: number;
  departureUnavailable: boolean;
  message: string;
};

const EARTH_RADIUS_KM = 6371;

// Base logística soberana: Méntrida (Toledo)
export const EAR_BASE: GeoPoint = { lat: 40.2385, lng: -4.1762 };

// Umbral logístico canónico: 1,50 €/km a partir del km 50.
const KM_FREE_THRESHOLD = 50;
const AVG_SPEED_KMH = 75;

export const RESCUE_FLEET: RescueVehicle[] = [
  {
    id: "micro-furgoneta",
    name: "Micro Furgoneta",
    fleetClass: "micro",
    capacityM3: 6,
    payloadKg: 800,
    equipment: ["Bose S1 Pro x2", "Mesa compacta", "Cableado básico"],
    mobilizationCostEur: 90,
    costPerKmEur: 0.55,
  },
  {
    id: "medio-van",
    name: "Van Medio",
    fleetClass: "medio",
    capacityM3: 14,
    payloadKg: 1800,
    equipment: ["Bose F1 812 x2", "Shure Beta 87A x2", "Truss ligero"],
    mobilizationCostEur: 150,
    costPerKmEur: 0.75,
  },
  {
    id: "pesado-camion",
    name: "Camión Pesado",
    fleetClass: "pesado",
    capacityM3: 32,
    payloadKg: 4500,
    equipment: ["Line Array completo", "Generador", "Mesa digital 32ch"],
    mobilizationCostEur: 240,
    costPerKmEur: 1.05,
  },
];

function toRadians(deg: number): number {
  return (deg * Math.PI) / 180;
}

/**
 * Distancia ortodrómica (haversine) en kilómetros entre dos puntos.
 */
export function haversineKm(a: GeoPoint, b: GeoPoint): number {
  const dLat = toRadians(b.lat - a.lat);
  const dLng = toRadians(b.lng - a.lng);

  const sinLat = Math.sin(dLat / 2) ** 2;
  const sinLng = Math.sin(dLng / 2) ** 2;

  const h =
    sinLat +
    Math.cos(toRadians(a.lat)) * Math.cos(toRadians(b.lat)) * sinLng;

  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(h));
}

/**
 * Selecciona el vehículo más pequeño capaz de transportar el volumen
 * y peso requeridos. Devuelve `null` si excede la flota completa.
 */
export function selectOptimalVehicle(
  requiredVolumeM3: number,
  requiredWeightKg: number,
): RescueVehicle | null {
  const candidates = RESCUE_FLEET.filter(
    (v) =>
      v.capacityM3 >= requiredVolumeM3 && v.payloadKg >= requiredWeightKg,
  );

  if (candidates.length === 0) return null;

  return candidates.sort((a, b) => a.capacityM3 - b.capacityM3)[0];
}

/**
 * Calcula el coste logístico soberano:
 * - No se factura distancia hasta el km 50.
 * - A partir de ahí se aplica la tarifa por km del vehículo.
 * - Se suma la movilización base.
 */
export function calculateLogisticsCost(
  distanceKm: number,
  vehicle: RescueVehicle,
): number {
  const billableKm = Math.max(0, distanceKm - KM_FREE_THRESHOLD);
  const kmCost = billableKm * vehicle.costPerKmEur;
  return vehicle.mobilizationCostEur + kmCost;
}

/**
 * Genera una cotización completa de rescate para un incidente.
 */
export function buildRescueQuote(request: RescueRequest): RescueQuote | null {
  const vehicle = selectOptimalVehicle(
    request.requiredVolumeM3,
    request.requiredWeightKg,
  );

  if (!vehicle) {
    return null;
  }

  const distanceKm = haversineKm(request.origin, request.destination);
  const estimatedMinutes = Math.round((distanceKm / AVG_SPEED_KMH) * 60);
  const logisticsCostEur = calculateLogisticsCost(distanceKm, vehicle);

  // Si el cliente no está en distancia operativa, se marca la salida
  // como no disponible (regla conservadora ante radio > 400 km).
  const departureUnavailable = distanceKm > 400;

  return {
    vehicle,
    distanceKm: Number(distanceKm.toFixed(1)),
    estimatedMinutes,
    logisticsCostEur: Number(logisticsCostEur.toFixed(2)),
    totalCostEur: Number(logisticsCostEur.toFixed(2)),
    departureUnavailable,
    message: departureUnavailable
      ? "Fuera de radio operativo EAR SOS (máx. 400 km)"
      : "Flota disponible para despacho inmediato",
  };
}