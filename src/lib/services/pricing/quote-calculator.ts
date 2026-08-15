import crypto from 'crypto';

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
  estimatedTotal: number;
  depositAmount: number;
  priceLockExpiresAt: string;
  signedPayload: string;
  checkoutUrl: string;
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

  // 4. Totales y Depósito
  const totalHardware = hardwarePack.price + mixerAndMics.price + lightingPack.price;
  const totalArtist = artistSelection ? artistSelection.price : 0;
  const estimatedTotal = totalHardware + totalArtist;
  const depositAmount = 10.0; // Depósito de congelación

  // 5. Caducidad Price-Lock 72h
  const expiresAt = new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString();

  // 6. Generación Hash SHA-256 y Payload Firmado
  const rawHashPayload = `${location}|${date}|${pax}|${estimatedTotal}|${expiresAt}`;
  const quoteHash = crypto.createHash('sha256').update(rawHashPayload).digest('hex').substring(0, 32).toUpperCase();

  const payloadObj = {
    quoteHash,
    pax,
    location,
    date,
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
    location,
    date,
    powerRmsRequired,
    hardwarePack,
    mixerAndMics,
    lightingPack,
    artistSelection,
    estimatedTotal,
    depositAmount,
    priceLockExpiresAt: expiresAt,
    signedPayload,
    checkoutUrl
  };
}
