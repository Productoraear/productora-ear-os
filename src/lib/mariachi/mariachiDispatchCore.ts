import { calculateHaversineDistance, calculateLogisticsFee, LogisticsCostBreakdown } from '@/features/search/utils/mentridaDistanceEngine';

export interface MariachiFormat {
  id: 'trio' | 'cuarteto' | 'gala' | 'monumental';
  name: string;
  members: number;
  basePrice: number; // En euros
  description: string;
  recommendedFor: string;
  depositAmount: number; // Siempre 100€ SSOT
  repertoireCount: number;
}

export const MARIACHI_FORMATS: MariachiFormat[] = [
  {
    id: 'trio',
    name: 'Trío Serenata Íntimo',
    members: 3,
    basePrice: 450,
    description: 'Voz principal, vihuela y guitarrón. Serenatas a domicilio, pedidas de mano y aniversarios íntimos.',
    recommendedFor: 'Serenatas y eventos hasta 40 pax',
    depositAmount: 100,
    repertoireCount: 12
  },
  {
    id: 'cuarteto',
    name: 'Cuarteto Clásico Ranchero',
    members: 4,
    basePrice: 600,
    description: 'Trompeta solista, vihuela, guitarrón y violín. El equilibrio perfecto para cócteles y fiestas familiares.',
    recommendedFor: 'Cócteles de boda y cumpleaños (hasta 90 pax)',
    depositAmount: 100,
    repertoireCount: 18
  },
  {
    id: 'gala',
    name: 'Ensemble de Gala',
    members: 6,
    basePrice: 900,
    description: '2 trompetas, 2 violines, vihuela y guitarrón. Traje de charro de gala, show interactivo y máxima potencia.',
    recommendedFor: 'Bodas en finca, banquetes y convenciones (hasta 200 pax)',
    depositAmount: 100,
    repertoireCount: 26
  },
  {
    id: 'monumental',
    name: 'Mariachi Monumental S-Class',
    members: 8,
    basePrice: 1300,
    description: 'Agrupación sinfónica completa: 3 violines, 2 trompetas, vihuela, guitarrón y guitarra española. Acústica 12 W/pax.',
    recommendedFor: 'Fiestas patronales B2G, grandes auditorios y eventos VIP',
    depositAmount: 100,
    repertoireCount: 35
  }
];

export interface SongRepertoireItem {
  id: string;
  title: string;
  originalArtist: string;
  category: 'ranchera' | 'bolero' | 'huapango' | 'clasico' | 'popular';
  audioPreviewUrl?: string;
  isFavorite?: boolean;
}

export const MARIACHI_REPERTOIRE_MASTER: SongRepertoireItem[] = [
  { id: '1', title: 'Si Nos Dejan', originalArtist: 'José Alfredo Jiménez', category: 'bolero', isFavorite: true },
  { id: '2', title: 'El Rey', originalArtist: 'José Alfredo Jiménez / Vicente Fernández', category: 'ranchera', isFavorite: true },
  { id: '3', title: 'Las Mañanitas', originalArtist: 'Tradicional Mexicana', category: 'clasico', isFavorite: true },
  { id: '4', title: 'Volver, Volver', originalArtist: 'Vicente Fernández', category: 'ranchera', isFavorite: true },
  { id: '5', title: 'Cielito Lindo', originalArtist: 'Quirino Mendoza', category: 'popular', isFavorite: true },
  { id: '6', title: 'Bésame Mucho', originalArtist: 'Consuelo Velázquez', category: 'bolero' },
  { id: '7', title: 'La Media Vuelta', originalArtist: 'José Alfredo Jiménez', category: 'bolero' },
  { id: '8', title: 'Sabor a Mí', originalArtist: 'Álvaro Carrillo', category: 'bolero' },
  { id: '9', title: 'México Lindo y Querido', originalArtist: 'Chucho Monge / Jorge Negrete', category: 'ranchera' },
  { id: '10', title: 'Cucurrucucú Paloma', originalArtist: 'Tomás Méndez', category: 'huapango' },
  { id: '11', title: 'La Malagueña', originalArtist: 'Elpidio Ramírez', category: 'huapango' },
  { id: '12', title: 'La Bikina', originalArtist: 'Rubén Fuentes', category: 'popular' },
  { id: '13', title: 'Serenata Huasteca', originalArtist: 'José Alfredo Jiménez', category: 'huapango' },
  { id: '14', title: 'Sombras Nada Más', originalArtist: 'Javier Solís', category: 'bolero' },
  { id: '15', title: 'Fallaste Corazón', originalArtist: 'Cuco Sánchez', category: 'ranchera' },
  { id: '16', title: 'El Jinete', originalArtist: 'José Alfredo Jiménez', category: 'ranchera' },
  { id: '17', title: 'La Enorme Distancia', originalArtist: 'José Alfredo Jiménez', category: 'ranchera' },
  { id: '18', title: 'Gema', originalArtist: 'Güicho Cisneros', category: 'bolero' },
  { id: '19', title: 'Motivos', originalArtist: 'Italo Pizzolante', category: 'bolero' },
  { id: '20', title: 'Hermoso Cariño', originalArtist: 'Vicente Fernández', category: 'ranchera' },
  { id: '21', title: 'Mala Suerte', originalArtist: 'Tradicional Ranchera', category: 'ranchera' },
  { id: '22', title: 'No Me Amenaces', originalArtist: 'José Alfredo Jiménez', category: 'ranchera' },
  { id: '23', title: 'Paloma Negra', originalArtist: 'Tomás Méndez', category: 'ranchera' },
  { id: '24', title: 'Guadalajara', originalArtist: 'Pepe Guízar', category: 'popular' }
];

export interface MariachiHubBase {
  id: string;
  name: string;
  city: string;
  province: string;
  lat: number;
  lng: number;
  isCentralHub: boolean;
}

export const MARIACHI_DISPATCH_HUBS: MariachiHubBase[] = [
  { id: 'madrid-eliptica', name: 'Hub Central Plaza Elíptica', city: 'Madrid', province: 'Madrid', lat: 40.3847, lng: -3.7183, isCentralHub: true },
  { id: 'toledo-mentrida', name: 'Hub S-Class Méntrida', city: 'Méntrida', province: 'Toledo', lat: 40.2383, lng: -4.1956, isCentralHub: false },
  { id: 'barcelona-hub', name: 'Sede Federada Barcelona', city: 'Barcelona', province: 'Barcelona', lat: 41.3851, lng: 2.1734, isCentralHub: false },
  { id: 'valencia-hub', name: 'Sede Federada Valencia', city: 'Valencia', province: 'Valencia', lat: 39.4699, lng: -0.3763, isCentralHub: false },
  { id: 'sevilla-hub', name: 'Sede Federada Andalucía Sur', city: 'Sevilla', province: 'Sevilla', lat: 37.3891, lng: -5.9845, isCentralHub: false },
  { id: 'bilbao-hub', name: 'Sede Federada Norte', city: 'Bilbao', province: 'Bizkaia', lat: 43.263, lng: -2.935, isCentralHub: false },
  { id: 'milan-hub', name: 'Sede Internacional Europa 01', city: 'Milán', province: 'Lombardía (Italia)', lat: 45.4642, lng: 9.19, isCentralHub: false },
  { id: 'cdmx-hub', name: 'Sede Matriz América Latina', city: 'Ciudad de México', province: 'CDMX (México)', lat: 19.4326, lng: -99.1332, isCentralHub: false }
];

export interface MariachiQuoteCalculation {
  format: MariachiFormat;
  hub: MariachiHubBase;
  destinationName: string;
  distanceKm: number;
  logistics: LogisticsCostBreakdown;
  basePrice: number;
  subtotal: number;
  vatAmount: number;
  totalGrossPrice: number;
  depositRequired: number;
  balanceOnVenue: number;
}

export function calculateMariachiQuote(
  formatId: MariachiFormat['id'],
  destinationCoords: { lat: number; lng: number },
  destinationName: string,
  endHour: number = 2,
  overrideHubId?: string
): MariachiQuoteCalculation {
  const format = MARIACHI_FORMATS.find((f) => f.id === formatId) || MARIACHI_FORMATS[1];
  
  // Buscar el hub más cercano si no se especifica uno
  let selectedHub = MARIACHI_DISPATCH_HUBS[0];
  if (overrideHubId) {
    const found = MARIACHI_DISPATCH_HUBS.find((h) => h.id === overrideHubId);
    if (found) selectedHub = found;
  } else {
    let minDistance = Infinity;
    for (const hub of MARIACHI_DISPATCH_HUBS) {
      const d = calculateHaversineDistance(destinationCoords.lat, destinationCoords.lng, hub.lat, hub.lng);
      if (d < minDistance) {
        minDistance = d;
        selectedHub = hub;
      }
    }
  }

  const distanceKm = calculateHaversineDistance(
    destinationCoords.lat,
    destinationCoords.lng,
    selectedHub.lat,
    selectedHub.lng
  );

  const logistics = calculateLogisticsFee(distanceKm, endHour);
  const basePrice = format.basePrice;
  const subtotal = basePrice + logistics.totalLogisticsFee;
  const vatAmount = Math.round(subtotal * 0.21);
  const totalGrossPrice = subtotal + vatAmount;
  const depositRequired = format.depositAmount; // 100€
  const balanceOnVenue = Math.max(0, totalGrossPrice - depositRequired);

  return {
    format,
    hub: selectedHub,
    destinationName,
    distanceKm,
    logistics,
    basePrice,
    subtotal,
    vatAmount,
    totalGrossPrice,
    depositRequired,
    balanceOnVenue
  };
}
