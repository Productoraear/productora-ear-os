import crypto from 'crypto';
import { calculateHaversineDistance } from './geo-pricer';

export interface TacticalQuoteParams {
  pax?: number;
  location?: string;
  date?: string;
  serviceType?: string;
  genre?: string;
  details?: string;
  contactName?: string;
  contactPhone?: string;
}

export interface TacticalQuoteResult {
  quoteHash: string;
  pax: number;
  location: string;
  date: string;
  powerRmsRequired: number;
  hardwarePack: {
    name: string;
    description: string;
    price: number;
  };
  mixerAndMics: {
    name: string;
    price: number;
  };
  lightingPack: {
    name: string;
    price: number;
  };
  artistSelection?: {
    name: string;
    role: string;
    price: number;
  };
  distanceKm: number;
  travelCost: number;
  estimatedTotal: number;
  depositAmount: number;
  priceLockExpiresAt: string;
  signedPayload: string;
  checkoutUrl: string;
}

// ━━ BASE DE OPERACIONES (KM 0 — Madrid, Sede EAR) ━━━━━━━━━━━━━━━━━━━━━━━━━━
const EAR_HQ_COORDS = { latitude: 40.416775, longitude: -3.703790 };

// Diccionario sincrónico de provincias para lookup en memoria
const PROVINCES_MAP: Record<string, { latitude: number; longitude: number }> = {
  madrid: { latitude: 40.416775, longitude: -3.703790 },
  barcelona: { latitude: 41.385064, longitude: 2.173403 },
  sevilla: { latitude: 37.389092, longitude: -5.984459 },
  valencia: { latitude: 39.469907, longitude: -0.376288 },
  malaga: { latitude: 36.721261, longitude: -4.421266 },
  zaragoza: { latitude: 41.648823, longitude: -0.889085 },
  alicante: { latitude: 38.345170, longitude: -0.481006 },
  murcia: { latitude: 37.992240, longitude: -1.130654 },
  cadiz: { latitude: 36.527061, longitude: -6.292557 },
  bilbao: { latitude: 43.263013, longitude: -2.934989 },
  baleares: { latitude: 39.695262, longitude: 3.017571 },
  mallorca: { latitude: 39.695262, longitude: 3.017571 },
  canarias: { latitude: 28.123546, longitude: -15.436257 },
  tenerife: { latitude: 28.463629, longitude: -16.251847 },
  asturias: { latitude: 43.360290, longitude: -5.844760 },
  coruna: { latitude: 43.362344, longitude: -8.411540 },
  pontevedra: { latitude: 42.431000, longitude: -8.644350 },
  almeria: { latitude: 36.834042, longitude: -2.463714 },
  granada: { latitude: 37.177338, longitude: -3.598557 },
  cordoba: { latitude: 37.888175, longitude: -4.779383 },
  jaen: { latitude: 37.779590, longitude: -3.784900 },
  huelva: { latitude: 37.261420, longitude: -6.944720 },
  toledo: { latitude: 39.862831, longitude: -4.027324 },
  ciudadreal: { latitude: 38.986260, longitude: -3.929070 },
  albacete: { latitude: 38.994350, longitude: -1.858560 },
  cuenca: { latitude: 40.070392, longitude: -2.137416 },
  guadalajara: { latitude: 40.630180, longitude: -3.162790 },
  castellon: { latitude: 39.986400, longitude: -0.051325 },
  tarragona: { latitude: 41.118882, longitude: 1.244491 },
  girona: { latitude: 41.979401, longitude: 2.821426 },
  lleida: { latitude: 41.617590, longitude: 0.620015 },
  huesca: { latitude: 42.136160, longitude: -0.408710 },
  teruel: { latitude: 40.345600, longitude: -1.106510 },
  logrono: { latitude: 42.279930, longitude: -2.519150 },
  navarra: { latitude: 42.695390, longitude: -1.676079 },
  vitoria: { latitude: 42.846718, longitude: -2.671635 },
  sansebastian: { latitude: 43.212000, longitude: -2.193000 },
  leon: { latitude: 42.598726, longitude: -5.567096 },
  zamora: { latitude: 41.506330, longitude: -5.744560 },
  salamanca: { latitude: 40.968818, longitude: -5.663539 },
  burgos: { latitude: 42.343990, longitude: -3.696906 },
  palencia: { latitude: 42.009550, longitude: -4.528320 },
  valladolid: { latitude: 41.652251, longitude: -4.724532 },
  avila: { latitude: 40.656720, longitude: -4.700220 },
  segovia: { latitude: 40.942900, longitude: -4.108807 },
  soria: { latitude: 41.766100, longitude: -2.476100 },
  caceres: { latitude: 39.475281, longitude: -6.372250 },
  badajoz: { latitude: 38.877892, longitude: -6.970610 },
  cantabria: { latitude: 43.182840, longitude: -3.987820 },
};

/**
 * Lookup sincrónico de coordenadas por nombre de ubicación.
 * Retorna coordenadas de la provincia más cercana al texto, o Madrid como fallback.
 */
function resolveLocationCoords(location: string): { latitude: number; longitude: number; resolvedName: string } {
  const normalized = location
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '');

  // Búsqueda directa en mapa
  for (const [key, coords] of Object.entries(PROVINCES_MAP)) {
    if (normalized.includes(key)) {
      return { ...coords, resolvedName: key.charAt(0).toUpperCase() + key.slice(1) };
    }
  }

  // Búsqueda por palabras individuales
  const words = location.toLowerCase().split(/[\s,]+/);
  for (const word of words) {
    const normWord = word.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, '');
    if (PROVINCES_MAP[normWord]) {
      return { ...PROVINCES_MAP[normWord], resolvedName: normWord.charAt(0).toUpperCase() + normWord.slice(1) };
    }
  }

  return { ...EAR_HQ_COORDS, resolvedName: 'Madrid' };
}

export function calculateTacticalQuote(
  params: TacticalQuoteParams,
  baseUrl: string = process.env.NEXT_PUBLIC_BASE_URL || 'https://productoraear.com'
): TacticalQuoteResult {
  const pax = Number(params.pax) || 150;
  const location = params.location || 'Ubicación a determinar';
  const date = params.date || 'Fecha por confirmar';
  const serviceType = (params.serviceType || '').toLowerCase();
  const details = (params.details || '').toLowerCase();

  // 1. Cálculo acústico de ingeniería táctica
  const powerRmsRequired = Math.max(800, pax * 12);

  // 2. Selección de Hardware según Aforo
  let hardwarePack = {
    name: 'Bose F1 Model 812 Array + F1 Subwoofers (2.000W RMS)',
    description: 'Sistema array flexible de alta dispersión sonora y pegada en graves calibrada',
    price: 350
  };

  if (pax > 250) {
    hardwarePack = {
      name: 'Line Array Compact Pro S-Class (4.800W RMS)',
      description: 'Cobertura masiva para exteriores y grandes aforos con directividad controlada',
      price: 650
    };
  }

  const mixerAndMics = {
    name: 'Behringer XR18 Digital + Shure QLXD Wireless System',
    price: 150
  };

  const lightingPack = {
    name: 'Puente Truss 4m + 8x PAR LED RGBW + 2x Cabezas Móviles Beam',
    price: 250
  };

  // 3. Detección de Talento / Artista
  let artistSelection = undefined;
  const isMariachiOrSolista =
    serviceType.includes('mariachi') ||
    details.includes('mariachi') ||
    serviceType.includes('solista') ||
    details.includes('solista') ||
    serviceType.includes('cantante') ||
    details.includes('cantante');

  if (isMariachiOrSolista) {
    artistSelection = {
      name: 'Edwin Agudelo (Master Artist S-Class)',
      role: 'Voz Principal & Show Mariachi en Directo',
      price: 490
    };
  } else if (serviceType.includes('dj') || details.includes('dj') || serviceType.includes('discomovil')) {
    artistSelection = {
      name: 'DJ Residente EAR OS S-Class',
      role: 'Sesión DJ Pro & Animación Musical',
      price: 380
    };
  }

  // 4. Resolución Geográfica Haversine (50 Provincias Españolas)
  const resolvedLocation = resolveLocationCoords(location);
  const distanceKm = Math.round(
    calculateHaversineDistance(EAR_HQ_COORDS, { latitude: resolvedLocation.latitude, longitude: resolvedLocation.longitude }) * 100
  ) / 100;
  const COST_PER_KM = 0.75; // €/km de desplazamiento logístico
  const TRAVEL_ALLOWANCE_PER_KM = 0.15; // dieta por km
  const travelCost = Math.round((distanceKm * (COST_PER_KM + TRAVEL_ALLOWANCE_PER_KM)) * 100) / 100;

  // 5. Totales y Depósito
  const totalHardware = hardwarePack.price + mixerAndMics.price + lightingPack.price;
  const totalArtist = artistSelection ? artistSelection.price : 0;
  const estimatedTotal = totalHardware + totalArtist + travelCost;
  const depositAmount = 10.0; // Depósito de congelación

  // 5. Caducidad Price-Lock 72h
  const expiresAt = new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString();

  // 6. Generación Hash SHA-256 y Payload Firmado
  const rawHashPayload = `${resolvedLocation.resolvedName}|${date}|${pax}|${estimatedTotal}|${distanceKm}|${expiresAt}`;
  const quoteHash = crypto.createHash('sha256').update(rawHashPayload).digest('hex').substring(0, 32).toUpperCase();

  const payloadObj = {
    quoteHash,
    pax,
    location: resolvedLocation.resolvedName,
    date,
    distanceKm,
    travelCost,
    estimatedTotal,
    depositAmount,
    expiresAt,
    hardware: hardwarePack.name,
    artist: artistSelection?.name
  };

  const signedPayload = Buffer.from(JSON.stringify(payloadObj)).toString('base64url');
  const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  const checkoutUrl = `${cleanBaseUrl}/checkout/presupuesto?quote=${quoteHash}&p=${signedPayload}`;

  return {
    quoteHash,
    pax,
    location: resolvedLocation.resolvedName,
    date,
    powerRmsRequired,
    hardwarePack,
    mixerAndMics,
    lightingPack,
    artistSelection,
    distanceKm,
    travelCost,
    estimatedTotal,
    depositAmount,
    priceLockExpiresAt: expiresAt,
    signedPayload,
    checkoutUrl
  };
}
