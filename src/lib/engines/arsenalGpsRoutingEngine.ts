/**
 * ARSENAL GPS ROUTING ENGINE // MULTIORIGIN CONVOY DISPATCH
 * 
 * Permite trackear en tiempo real y calcular logística multiorigen
 * para cualquier proveedor o lote de equipos del Arsenal (Sonido, Luces, Artistas, Catering)
 * desde sus naves o bases territoriales nativas (Valencia, Sevilla, Toledo, Madrid, etc.)
 * convergiendo en la misma finca con ETAs sincronizados.
 */

import { calculateHaversineDistance, calculateLogisticsFee } from '@/features/search/utils/mentridaDistanceEngine';

export interface ArsenalWarehouseBase {
  id: string;
  providerName: string;
  equipmentCategory: 'SONIDO_ILUMINACION' | 'PANTALLAS_LED' | 'CATERING_BRASAS' | 'MARIACHIS' | 'ESCENARIOS' | 'DECORACION';
  city: string;
  province: string;
  address: string;
  lat: number;
  lng: number;
  convoyVehicle: string;
  driverContactPhone: string;
}

export interface ConvoyRouteLeg {
  id: string;
  originBase: ArsenalWarehouseBase;
  destinationVenue: string;
  destinationCoords: { lat: number; lng: number };
  distanceKm: number;
  estimatedTransitMinutes: number;
  suggestedDepartureTime: string;
  targetArrivalTime: string;
  logisticsCost: number;
  status: 'EN_NAVE' | 'EN_TRANSITO' | 'DESCARGANDO' | 'OPERATIVO';
}

export interface MultiOriginProductionConvoy {
  productionEventId: string;
  eventTitle: string;
  destinationVenue: string;
  destinationCoords: { lat: number; lng: number };
  requiredSoundcheckTime: string; // ej. "17:00"
  eventStartTime: string; // ej. "19:00"
  legs: ConvoyRouteLeg[];
  totalLogisticsFee: number;
  synchronizedMaxDistanceKm: number;
  criticalPathOrigin: string; // El origen más lejano que marca la hora límite de salida
}

// Catálogo maestro de Naves y Bases del Arsenal en España
export const ARSENAL_WAREHOUSE_NETWORK: ArsenalWarehouseBase[] = [
  {
    id: 'base-valencia-led',
    providerName: 'División Pantallas LED & Rigging Levante',
    equipmentCategory: 'PANTALLAS_LED',
    city: 'València',
    province: 'Valencia',
    address: 'Polígono Industrial Vara de Quart, Carrer dels Gremis 14, 46014 València',
    lat: 39.4601,
    lng: -0.4072,
    convoyVehicle: 'Camión Carrozado 7.5T (4102-LPT)',
    driverContactPhone: '+34 620 44 81 90'
  },
  {
    id: 'base-toledo-sonido',
    providerName: 'Logística Técnica S-Class Toledo // Méntrida Hub',
    equipmentCategory: 'SONIDO_ILUMINACION',
    city: 'Méntrida',
    province: 'Toledo',
    address: 'Camino de Madrid s/n, 45180 Méntrida, Toledo',
    lat: 40.2383,
    lng: -4.1956,
    convoyVehicle: 'Furgón Taller Iveco Daily (7820-KXZ)',
    driverContactPhone: '+34 693 693 048'
  },
  {
    id: 'base-madrid-mariachis',
    providerName: 'Base Central Mariachis Madrid',
    equipmentCategory: 'MARIACHIS',
    city: 'Madrid',
    province: 'Madrid',
    address: 'Plaza Elíptica Hub, 28025 Madrid',
    lat: 40.3847,
    lng: -3.7183,
    convoyVehicle: 'Mercedes-Benz Clase V VIP (8491-LMR)',
    driverContactPhone: '+34 689 33 11 05'
  },
  {
    id: 'base-sevilla-escenarios',
    providerName: 'Estructuras y Tarimas Sur',
    equipmentCategory: 'ESCENARIOS',
    city: 'Sevilla',
    province: 'Sevilla',
    address: 'Polígono La Negrilla, Calle Imprenta 8, 41016 Sevilla',
    lat: 37.3782,
    lng: -5.9321,
    convoyVehicle: 'Tráiler Plataforma Scania (5190-MBR)',
    driverContactPhone: '+34 633 12 77 44'
  }
];

/**
 * Planifica y sincroniza un convoy multiorigen convergente
 */
export function planMultiOriginConvoy(params: {
  productionEventId: string;
  eventTitle: string;
  destinationVenue: string;
  destinationCoords: { lat: number; lng: number };
  requiredSoundcheckTime: string; // ej. "17:00"
  eventStartTime: string;
  selectedBaseIds: string[];
}): MultiOriginProductionConvoy {
  const selectedBases = ARSENAL_WAREHOUSE_NETWORK.filter(b => params.selectedBaseIds.includes(b.id));

  let totalLogisticsFee = 0;
  let maxTransitMinutes = 0;
  let criticalPathOrigin = '';

  const legs: ConvoyRouteLeg[] = selectedBases.map(base => {
    const distanceKm = calculateHaversineDistance(
      base.lat, 
      base.lng, 
      params.destinationCoords.lat, 
      params.destinationCoords.lng
    );

    // Estimación realista: 80 km/h media convoy + 30 min margen maniobra/descarga
    const transitMinutes = Math.round((distanceKm / 80) * 60) + 30;
    const logistics = calculateLogisticsFee(distanceKm, 2);

    totalLogisticsFee += logistics.totalLogisticsFee;

    if (transitMinutes > maxTransitMinutes) {
      maxTransitMinutes = transitMinutes;
      criticalPathOrigin = `${base.providerName} (${base.city}) - ${distanceKm} km`;
    }

    // Calcular hora de salida sugerida restando tiempo a la prueba de sonido
    const [soundcheckHours, soundcheckMinutes] = params.requiredSoundcheckTime.split(':').map(Number);
    const soundcheckTotalMinutes = (soundcheckHours * 60) + soundcheckMinutes;
    const departureTotalMinutes = Math.max(0, soundcheckTotalMinutes - transitMinutes);
    const depHours = Math.floor(departureTotalMinutes / 60).toString().padStart(2, '0');
    const depMinutes = (departureTotalMinutes % 60).toString().padStart(2, '0');
    const suggestedDepartureTime = `${depHours}:${depMinutes}`;

    return {
      id: `leg-${base.id}-${Date.now()}`,
      originBase: base,
      destinationVenue: params.destinationVenue,
      destinationCoords: params.destinationCoords,
      distanceKm,
      estimatedTransitMinutes: transitMinutes,
      suggestedDepartureTime,
      targetArrivalTime: params.requiredSoundcheckTime,
      logisticsCost: logistics.totalLogisticsFee,
      status: 'EN_TRANSITO'
    };
  });

  const maxDist = Math.max(...legs.map(l => l.distanceKm), 0);

  return {
    productionEventId: params.productionEventId,
    eventTitle: params.eventTitle,
    destinationVenue: params.destinationVenue,
    destinationCoords: params.destinationCoords,
    requiredSoundcheckTime: params.requiredSoundcheckTime,
    eventStartTime: params.eventStartTime,
    legs,
    totalLogisticsFee,
    synchronizedMaxDistanceKm: maxDist,
    criticalPathOrigin
  };
}
