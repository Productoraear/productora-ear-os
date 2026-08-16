// src/lib/pricing-engine.ts
import { PRICING_CATALOG } from './constants/pricing-catalog';

export interface EventParams {
  formatId: string;
  pax: number;
  distanceKm: number;
  urgency: 'STANDARD' | 'PRIORITY' | 'EXPRESS';
}

export interface SClassQuote {
  basePrice: number;
  acousticSurcharge: number;
  logisticCost: number;
  urgencyMultiplier: number;
  finalTotal: number;
  depositAmount: number;
  split: {
    artist: number;
    platform: number;
    vimume: number;
  };
  technicalSpecs: string[];
  sha256Token: string;
}

export class SClassPricingEngine {
  // Fórmula: 12 Watts por persona para presión sonora óptima
  private static readonly WATTS_PER_PAX = 12;
  private static readonly COST_PER_KM = 1.5;

  public static async generateQuote(params: EventParams): Promise<SClassQuote> {
    const format = PRICING_CATALOG[params.formatId];
    if (!format) throw new Error("Formato no reconocido en el catálogo maestro.");

    let basePrice = format.basePrice;
    let acousticSurcharge = 0;
    const technicalSpecs = [
      `Formación S-Class: ${format.members} integrantes`,
      `Duración: ${format.duration}`
    ];

    // 1. Cálculo Acústico (Reconocimiento Matemático de Libertad)
    const requiredWatts = params.pax * this.WATTS_PER_PAX;
    technicalSpecs.push(`Presión Sonora Auditada: ${requiredWatts}W Requeridos`);

    if (requiredWatts > 3000) {
      acousticSurcharge = 450; // Inyección de Subgraves 18" + Ingeniero de RF
      technicalSpecs.push(`+ Upgrade Automático: Subwoofers 18" y Shure Axient RF (Aforo > 250 pax)`);
    } else {
      technicalSpecs.push(`+ Infraestructura: Line Array Bose F1 Model 812 (Redundancia N+1)`);
    }

    // 2. Logística Forense
    const logisticCost = params.distanceKm > 50 ? (params.distanceKm - 50) * this.COST_PER_KM : 0;
    
    // 3. Multiplicador de Urgencia
    const urgencyRates = { STANDARD: 1, PRIORITY: 1.15, EXPRESS: 1.30 };
    const multiplier = urgencyRates[params.urgency];

    // 4. Liquidación Total
    const subtotal = basePrice + acousticSurcharge + logisticCost;
    const finalTotal = subtotal * multiplier;

    // 5. Split Soberano (80/10/10)
    const split = {
      artist: parseFloat((finalTotal * 0.80).toFixed(2)),
      platform: parseFloat((finalTotal * 0.10).toFixed(2)),
      vimume: parseFloat((finalTotal * 0.10).toFixed(2)),
    };

    // 6. Firma Criptográfica SHA-256 (Generada en cliente/edge vía Web Crypto API)
    const rawString = `${format.id}-${finalTotal}-${Date.now()}-EAROS`;
    const encoder = new TextEncoder();
    const data = encoder.encode(rawString);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const sha256Token = hashArray.map(b => b.toString(16).padStart(2, '0')).join('').substring(0, 16).toUpperCase();

    return {
      basePrice,
      acousticSurcharge,
      logisticCost,
      urgencyMultiplier: multiplier,
      finalTotal: parseFloat(finalTotal.toFixed(2)),
      depositAmount: 10, // Garantía unitaria inmutable
      split,
      technicalSpecs,
      sha256Token
    };
  }
}

// --- LEGACY EXPORTS FOR BOOKING CALCULATOR COMPATIBILITY ---
export interface BookingParams {
  distanciaKm: number;
  horaFin: number;
  esPremium: boolean;
}

export interface RateDetails {
  subtotal: number;
  iva: number;
  total: number;
  detalles: {
    tarifaBase: number;
    kmExtra: number;
    hotel: number;
  };
}

export function calculateMariachiRate(params: BookingParams): RateDetails {
  const tarifaBase = params.esPremium ? 350 : 250;
  const kmExtra = params.distanciaKm > 50 ? (params.distanciaKm - 50) * 1.5 : 0;
  const hotel = params.horaFin >= 3 || params.distanciaKm > 200 ? 120 : 0;
  const subtotal = tarifaBase + kmExtra + hotel;
  const iva = subtotal * 0.21;
  const total = subtotal + iva;
  return { subtotal, iva, total, detalles: { tarifaBase, kmExtra, hotel } };
}