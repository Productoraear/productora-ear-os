/**
 * Motor de Cálculo Logístico y Distancias S-Class
 * - Edwin Agudelo ➔ Méntrida, Toledo (40.2383, -4.1956)
 * - Mariachis ➔ Plaza Elíptica, Madrid (40.3847, -3.7183)
 * - Resto de Proveedores ➔ Coordenadas GPS de la App / Ciudad de Residencia
 */

export interface BaseOriginConfig {
  name: string;
  lat: number;
  lng: number;
}

export const BASE_HUBS = {
  EDWIN_AGUDELO: { name: 'Méntrida, Toledo (Zona Cero Edwin)', lat: 40.2383, lng: -4.1956 },
  MARIACHIS: { name: 'Plaza Elíptica, Madrid (Base Mariachis)', lat: 40.3847, lng: -3.7183 }
};

// Coordenadas aproximadas de referencia para las 52 Provincias de España
export const PROVINCE_COORDINATES: Record<string, { lat: number; lng: number; defaultKmFromMentrida: number }> = {
  'Madrid': { lat: 40.4168, lng: -3.7038, defaultKmFromMentrida: 54 },
  'Toledo': { lat: 39.8628, lng: -4.0273, defaultKmFromMentrida: 52 },
  'Guadalajara': { lat: 40.6327, lng: -3.1669, defaultKmFromMentrida: 120 },
  'Cuenca': { lat: 40.0704, lng: -2.1374, defaultKmFromMentrida: 215 },
  'Ciudad Real': { lat: 38.9863, lng: -3.9271, defaultKmFromMentrida: 180 },
  'Avila': { lat: 40.6565, lng: -4.6818, defaultKmFromMentrida: 95 },
  'Ávila': { lat: 40.6565, lng: -4.6818, defaultKmFromMentrida: 95 },
  'Segovia': { lat: 40.9429, lng: -4.1088, defaultKmFromMentrida: 110 },
  'Salamanca': { lat: 40.9701, lng: -5.6635, defaultKmFromMentrida: 210 },
  'Valladolid': { lat: 41.6523, lng: -4.7245, defaultKmFromMentrida: 215 },
  'Zamora': { lat: 41.5063, lng: -5.7446, defaultKmFromMentrida: 250 },
  'León': { lat: 42.5987, lng: -5.5671, defaultKmFromMentrida: 350 },
  'Palencia': { lat: 42.0096, lng: -4.5288, defaultKmFromMentrida: 270 },
  'Burgos': { lat: 42.344, lng: -3.6969, defaultKmFromMentrida: 290 },
  'Soria': { lat: 41.7666, lng: -2.4688, defaultKmFromMentrida: 260 },
  'Cáceres': { lat: 39.4753, lng: -6.3724, defaultKmFromMentrida: 250 },
  'Badajoz': { lat: 38.8794, lng: -6.9707, defaultKmFromMentrida: 370 },
  'Sevilla': { lat: 37.3891, lng: -5.9845, defaultKmFromMentrida: 500 },
  'Córdoba': { lat: 37.8882, lng: -4.7794, defaultKmFromMentrida: 360 },
  'Málaga': { lat: 36.7213, lng: -4.4214, defaultKmFromMentrida: 510 },
  'Granada': { lat: 37.1773, lng: -3.5986, defaultKmFromMentrida: 420 },
  'Cádiz': { lat: 36.5271, lng: -6.2886, defaultKmFromMentrida: 590 },
  'Almería': { lat: 36.834, lng: -2.4637, defaultKmFromMentrida: 530 },
  'Jaén': { lat: 37.7796, lng: -3.7849, defaultKmFromMentrida: 320 },
  'Huelva': { lat: 37.2614, lng: -6.9447, defaultKmFromMentrida: 560 },
  'Valencia': { lat: 39.4699, lng: -0.3763, defaultKmFromMentrida: 365 },
  'Alicante': { lat: 38.3452, lng: -0.481, defaultKmFromMentrida: 430 },
  'Castellón': { lat: 39.9864, lng: -0.0513, defaultKmFromMentrida: 410 },
  'Murcia': { lat: 37.9922, lng: -1.1307, defaultKmFromMentrida: 410 },
  'Barcelona': { lat: 41.3851, lng: 2.1734, defaultKmFromMentrida: 640 },
  'Girona': { lat: 41.9794, lng: 2.8214, defaultKmFromMentrida: 740 },
  'Lleida': { lat: 41.6176, lng: 0.62, defaultKmFromMentrida: 490 },
  'Tarragona': { lat: 41.1189, lng: 1.2445, defaultKmFromMentrida: 560 },
  'Zaragoza': { lat: 41.6488, lng: -0.8891, defaultKmFromMentrida: 340 },
  'Huesca': { lat: 42.1361, lng: -0.4087, defaultKmFromMentrida: 410 },
  'Teruel': { lat: 40.3456, lng: -1.1072, defaultKmFromMentrida: 310 },
  'Asturias': { lat: 43.3614, lng: -5.8593, defaultKmFromMentrida: 460 },
  'Cantabria': { lat: 43.4623, lng: -3.8099, defaultKmFromMentrida: 430 },
  'A Coruña': { lat: 43.3623, lng: -8.4115, defaultKmFromMentrida: 590 },
  'Pontevedra': { lat: 42.431, lng: -8.6444, defaultKmFromMentrida: 580 },
  'Lugo': { lat: 43.012, lng: -7.5558, defaultKmFromMentrida: 490 },
  'Ourense': { lat: 42.3358, lng: -7.8639, defaultKmFromMentrida: 480 },
  'Navarra': { lat: 42.8125, lng: -1.6458, defaultKmFromMentrida: 410 },
  'La Rioja': { lat: 42.2871, lng: -2.5396, defaultKmFromMentrida: 330 },
  'Araba/Álava': { lat: 42.8467, lng: -2.6716, defaultKmFromMentrida: 360 },
  'Gipuzkoa': { lat: 43.3183, lng: -1.9812, defaultKmFromMentrida: 460 },
  'Bizkaia': { lat: 43.263, lng: -2.935, defaultKmFromMentrida: 410 },
  'Baleares': { lat: 39.5696, lng: 2.6502, defaultKmFromMentrida: 600 },
  'Las Palmas': { lat: 28.1235, lng: -15.4363, defaultKmFromMentrida: 1800 },
  'Santa Cruz de Tenerife': { lat: 28.4636, lng: -16.2518, defaultKmFromMentrida: 1850 },
};

/**
 * Determina la base oficial de salida de un proveedor (SSOT):
 * - Edwin Agudelo ➔ Méntrida, Toledo
 * - Mariachis ➔ Plaza Elíptica, Madrid
 * - Resto de Proveedores ➔ Sus coordenadas GPS / Ciudad de la App
 */
export function getVendorBaseOrigin(provider?: { id?: string; name?: string; category?: string; baseCoords?: { lat: number; lng: number }; province?: string; municipality?: string }): BaseOriginConfig {
  if (!provider) return BASE_HUBS.EDWIN_AGUDELO;
  
  const name = (provider.name || '').toLowerCase();
  const cat = (provider.category || '').toLowerCase();
  const id = (provider.id || '').toLowerCase();

  // 1. Edwin Agudelo ➔ Méntrida (Toledo)
  if (id.includes('edwin') || name.includes('edwin agudelo') || name.includes('productora ear')) {
    return BASE_HUBS.EDWIN_AGUDELO;
  }

  // 2. Mariachis ➔ Plaza Elíptica (Madrid)
  if (cat.includes('mariachi') || name.includes('mariachi')) {
    return BASE_HUBS.MARIACHIS;
  }

  // 3. Proveedor General ➔ Coordenadas GPS propias / Ciudad
  if (provider.baseCoords && provider.baseCoords.lat && provider.baseCoords.lng) {
    return {
      name: provider.municipality || provider.province || 'Base Proveedor App',
      lat: provider.baseCoords.lat,
      lng: provider.baseCoords.lng
    };
  }

  const provKey = provider.province || 'Madrid';
  const provCoords = PROVINCE_COORDINATES[provKey] || PROVINCE_COORDINATES['Madrid'];
  return {
    name: `${provKey} (Base Local)`,
    lat: provCoords.lat,
    lng: provCoords.lng
  };
}

/**
 * Fórmula de Haversine para calcular distancia en km entre dos puntos GPS
 */
export function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number = BASE_HUBS.EDWIN_AGUDELO.lat,
  lon2: number = BASE_HUBS.EDWIN_AGUDELO.lng
): number {
  const R = 6371; // Radio de la Tierra en km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

/**
 * Retorna la distancia en km considerando la base origen adecuada del proveedor
 */
export function getDistanceKmFromMentrida(
  province?: string, 
  gpsCoords?: { lat: number; lng: number } | null,
  provider?: { id?: string; name?: string; category?: string }
): number {
  const origin = getVendorBaseOrigin(provider);

  if (gpsCoords && gpsCoords.lat && gpsCoords.lng) {
    return calculateHaversineDistance(gpsCoords.lat, gpsCoords.lng, origin.lat, origin.lng);
  }
  
  if (province && PROVINCE_COORDINATES[province]) {
    const pCoords = PROVINCE_COORDINATES[province];
    return calculateHaversineDistance(pCoords.lat, pCoords.lng, origin.lat, origin.lng);
  }

  return 54; // Default
}

export interface LogisticsCostBreakdown {
  billableKm: number;
  kmCost: number;
  requiresLodging: boolean;
  lodgingCost: number;
  totalLogisticsFee: number;
}

/**
 * Calcula la tarifa oficial de logística S-Class:
 * - 1,50 €/km a partir del km 50 desde la base oficial del proveedor
 * - +120,00 € hotel si fin >= 3:00 AM o km > 200
 */
export function calculateLogisticsFee(distanceKm: number, endHour: number = 2): LogisticsCostBreakdown {
  const billableKm = Math.max(0, distanceKm - 50);
  const kmCost = Math.round(billableKm * 1.5);
  const requiresLodging = endHour >= 3 || distanceKm > 200;
  const lodgingCost = requiresLodging ? 120 : 0;
  const totalLogisticsFee = kmCost + lodgingCost;

  return {
    billableKm,
    kmCost,
    requiresLodging,
    lodgingCost,
    totalLogisticsFee
  };
}

/**
 * Cálculo del Diagnóstico Acústico (12 W/pax)
 */
export function calculateAcousticRequirements(pax: number) {
  const safePax = Math.max(10, pax);
  const wattsRms = safePax * 12;
  let setupDescription = 'Bose S1 Pro / Compact Solo';
  
  if (wattsRms > 4000) {
    setupDescription = 'Array Lineal Bose F1 812 + Subwoofers F1 Sub (4.000W+ RMS)';
  } else if (wattsRms > 2000) {
    setupDescription = 'Bose F1 812 Twin System + Shure Beta 87A Wireless';
  } else if (wattsRms > 1000) {
    setupDescription = 'Bose L1 Pro16 / Bose F1 Single + Shure Microphones';
  }

  return {
    pax: safePax,
    wattsRms,
    setupDescription
  };
}
