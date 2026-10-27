import { createHash } from 'crypto';
import {
  DEPOSITO_STRIPE_EUR,
  VAT_RATE,
  SPLIT_SOBERANO as SSOT_SPLIT_RATIOS,
} from '@/lib/constants/ear-os-ssot';
import {
  MARIACHI_FORMATS,
  type MariachiFormat,
  type MariachiFormatId,
} from './mariachi-formats';
import {
  calculateHaversineDistance,
  calculateLogisticsFee,
  LogisticsCostBreakdown,
} from '@/features/search/utils/mentridaDistanceEngine';

/**
 * ════════════════════════════════════════════════════════════════════════════
 * EAR OS — CATÁLOGO CANÓNICO MARIACHI (MOTOR DE DINERO SSOT-DRIVEN)
 * ════════════════════════════════════════════════════════════════════════════
 * Fuente ÚNICA de verdad para los formatos mariachi y su cotización.
 * Los precios nacen del SSOT (Tarifa Solista 350 €, Depósito 100 €, IVA 21 %,
 * Split Soberano 80/10/10). Prohibido duplicar valores en componentes.
 *
 * Split Soberano aplica sobre la base imponible (pre-IVA) de la actuación.
 * ════════════════════════════════════════════════════════════════════════════
 */

/**
 * Catálogo canónico movido a `./mariachi-formats` (capa pura, sin dependencias
 * de Node) para que el configurador cliente `/reservar/solista` y los
 * guardianes puedan leer los precios del SSOT sin arrastrar `crypto`.
 * Este módulo los re-exporta para no romper a ningún consumidor histórico.
 */
export * from './mariachi-formats';

export interface SongRepertoireItem {
  id: string;
  title: string;
  originalArtist: string;
  category: 'ranchera' | 'bolero' | 'huapango' | 'clasico' | 'popular';
  audioPreviewUrl?: string;
  isFavorite?: boolean;
}

export const MARIACHI_REPERTOIRE_MASTER: readonly SongRepertoireItem[] = [
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
  { id: '24', title: 'Guadalajara', originalArtist: 'Pepe Guízar', category: 'popular' },
] as const;

export interface MariachiHubBase {
  id: string;
  name: string;
  city: string;
  province: string;
  lat: number;
  lng: number;
  isCentralHub: boolean;
}

export const MARIACHI_DISPATCH_HUBS: readonly MariachiHubBase[] = [
  { id: 'madrid-eliptica', name: 'Hub Central Plaza Elíptica', city: 'Madrid', province: 'Madrid', lat: 40.3847, lng: -3.7183, isCentralHub: true },
  { id: 'toledo-mentrida', name: 'Hub S-Class Méntrida', city: 'Méntrida', province: 'Toledo', lat: 40.2383, lng: -4.1956, isCentralHub: false },
  { id: 'barcelona-hub', name: 'Sede Federada Barcelona', city: 'Barcelona', province: 'Barcelona', lat: 41.3851, lng: 2.1734, isCentralHub: false },
  { id: 'valencia-hub', name: 'Sede Federada Valencia', city: 'Valencia', province: 'Valencia', lat: 39.4699, lng: -0.3763, isCentralHub: false },
  { id: 'sevilla-hub', name: 'Sede Federada Andalucía Sur', city: 'Sevilla', province: 'Sevilla', lat: 37.3891, lng: -5.9845, isCentralHub: false },
  { id: 'bilbao-hub', name: 'Sede Federada Norte', city: 'Bilbao', province: 'Bizkaia', lat: 43.263, lng: -2.935, isCentralHub: false },
  { id: 'milan-hub', name: 'Sede Internacional Europa 01', city: 'Milán', province: 'Lombardía (Italia)', lat: 45.4642, lng: 9.19, isCentralHub: false },
  { id: 'cdmx-hub', name: 'Sede Matriz América Latina', city: 'Ciudad de México', province: 'CDMX (México)', lat: 19.4326, lng: -99.1332, isCentralHub: false },
] as const;

export interface MariachiSplitBreakdown {
  artist80: number;
  earOs10: number;
  vimume10: number;
}

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
  split: MariachiSplitBreakdown;
  priceLockHash: string;
}

/**
 * Calcula la cotización mariachi de forma determinista (SSOT).
 * El Split Soberano 80/10/10 se aplica sobre la base imponible (pre-IVA).
 */
export function calculateMariachiQuote(
  formatId: MariachiFormatId,
  destinationCoords: { lat: number; lng: number },
  destinationName: string,
  endHour: number = 2,
  overrideHubId?: string,
): MariachiQuoteCalculation {
  const format = MARIACHI_FORMATS.find((f) => f.id === formatId) ?? MARIACHI_FORMATS[0];

  // Buscar el hub más cercano si no se especifica uno.
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
    selectedHub.lng,
  );

  const logistics = calculateLogisticsFee(distanceKm, endHour);
  const basePrice = format.basePrice;
  const subtotal = basePrice + logistics.totalLogisticsFee;
  const vatAmount = Math.round(subtotal * VAT_RATE);
  const totalGrossPrice = subtotal + vatAmount;
  const depositRequired = format.depositAmount; // 100 € (SSOT)
  const balanceOnVenue = Math.max(0, totalGrossPrice - depositRequired);

  // Split Soberano 80/10/10 sobre base imponible (pre-IVA).
  const artist80 = Math.round(subtotal * SSOT_SPLIT_RATIOS.artista);
  const earOs10 = Math.round(subtotal * SSOT_SPLIT_RATIOS.earOs);
  const vimume10 = subtotal - artist80 - earOs10;

  // Price-Lock SHA-256 real (determinista, verificable server-side).
  const payloadToHash = `${format.id}|${Math.round(distanceKm)}|${subtotal}|${DEPOSITO_STRIPE_EUR}|${endHour}`;
  const priceLockHash = createHash('sha256').update(payloadToHash).digest('hex');

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
    balanceOnVenue,
    split: { artist80, earOs10, vimume10 },
    priceLockHash,
  };
}