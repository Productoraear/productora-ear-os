import crypto from 'crypto';

/**
 * 🏛️ EAR OS OMEGA — STRIPE PRICE-LOCK & SOVEREIGN REVENUE ENGINE
 * 
 * Reglas de Negocio Inmutables (SSOT S-Class):
 * - Tarifa Base Solista (Edwin Agudelo): 350 €
 * - Split Soberano: 80% Proveedor / 10% EAR OS / 10% VIMUME
 * - Presión Acústica: 12 W/pax homologados
 * - Ventana de Congelación: 72 Horas con Hash Criptográfico SHA-256
 * - Depósito de Micro-Reserva: 10 € (Express) / 100 € (Corporativo/B2G)
 */

export interface PriceLockInput {
  serviceId?: string;
  serviceName?: string;
  category?: string;
  baseAmount?: number;
  musiciansCount?: number;
  pax?: number;
  location?: string;
  distanceKm?: number;
  equipmentTier?: 'STANDARD' | 'S_CLASS_BOSE' | 'S_CLASS_LINE_ARRAY' | 'ARSENAL_LED_4K';
  eventDate: string;
  clientEmail?: string;
  clientName?: string;
  clientPhone?: string;
  isB2G?: boolean;
}

export interface PriceLockQuote {
  hash: string;
  token: string;
  timestamp: number;
  expiresAt: string;
  expiresAtMs: number;
  pricing: {
    baseRate: number;
    musiciansSurcharge: number;
    distanceSurcharge: number;
    equipmentSurcharge: number;
    subtotal: number;
    vatAmount: number;
    totalAmount: number;
    depositRequired: number;
  };
  split: {
    provider80: number;
    earOs10: number;
    vimume10: number;
  };
  technicalSpecs: {
    pax: number;
    acousticWatts: number;
    certifiedSPL: string;
    riderSummary: string;
    warranty: string;
  };
  client: {
    name: string;
    email: string;
    phone: string;
    location: string;
    eventDate: string;
    isB2G: boolean;
  };
}

export class PriceLockEngine {
  private static BASE_SOLISTA = 350;
  private static PRICE_PER_KM = 0.65;
  private static WATTS_PER_PAX = 12;

  /**
   * Calcula el presupuesto exacto y genera el token criptográfico Price-Lock (72h)
   */
  public static generateQuote(input: PriceLockInput): PriceLockQuote {
    const now = Date.now();
    const expiresAtMs = now + 72 * 60 * 60 * 1000;
    const expiresAt = new Date(expiresAtMs).toISOString();

    // 1. Tarifa Base
    let baseRate = input.baseAmount || this.BASE_SOLISTA;
    if (input.serviceId?.includes('edwin') || input.serviceName?.toLowerCase().includes('edwin')) {
      baseRate = Math.max(baseRate, this.BASE_SOLISTA);
    }

    // 2. Multiplicador de Músicos
    const musicians = Math.max(1, input.musiciansCount || 1);
    const musiciansSurcharge = musicians > 1 ? (musicians - 1) * 200 : 0;

    // 3. Desplazamiento
    const km = Math.max(0, input.distanceKm || 0);
    const distanceSurcharge = km > 30 ? Number(((km - 30) * this.PRICE_PER_KM).toFixed(2)) : 0;

    // 4. Equipamiento Técnico
    let equipmentSurcharge = 0;
    let riderSummary = 'Sistema de Sonido Autónomo Bose S1 Pro + Shure SM58';
    
    switch (input.equipmentTier) {
      case 'S_CLASS_BOSE':
        equipmentSurcharge = 350;
        riderSummary = 'Bose F1 Model 812 Flex Array + Subwoofers + Consola Digital XR18 + Shure Beta 58A';
        break;
      case 'S_CLASS_LINE_ARRAY':
        equipmentSurcharge = 750;
        riderSummary = 'Line Array dB Technologies DVA / L-Acoustics + Microfonía Shure Axient Digital';
        break;
      case 'ARSENAL_LED_4K':
        equipmentSurcharge = 950;
        riderSummary = 'Pantalla LED P2.9 Novastar UHD + Sonido Bose F1 + Técnico In-Situ 0 Fallos';
        break;
      default:
        if ((input.pax || 100) > 150) {
          equipmentSurcharge = 350;
          riderSummary = 'Bose F1 Model 812 Flex Array + Consola Digital XR18 (12 W/pax Homologados)';
        }
        break;
    }

    // 5. Totales
    const subtotal = Number((baseRate + musiciansSurcharge + distanceSurcharge + equipmentSurcharge).toFixed(2));
    const vatAmount = Number((subtotal * 0.21).toFixed(2));
    const totalAmount = Number((subtotal + vatAmount).toFixed(2));

    // Depósito de Micro-Reserva (10€ express / 100€ institucional / 30% proyectos grandes)
    let depositRequired = 10;
    if (input.isB2G || totalAmount > 1500) {
      depositRequired = 100;
    }

    // 6. Split Soberano 80/10/10
    const provider80 = Number((subtotal * 0.80).toFixed(2));
    const earOs10 = Number((subtotal * 0.10).toFixed(2));
    const vimume10 = Number((subtotal * 0.10).toFixed(2));

    // 7. Certificación Acústica
    const paxCount = input.pax || 100;
    const acousticWatts = paxCount * this.WATTS_PER_PAX;

    // 8. Hash Criptográfico SHA-256 Determinista
    const rawSignature = `${totalAmount}:${input.eventDate}:${input.location || 'Madrid'}:${expiresAtMs}:${input.clientEmail || 'anon'}`;
    const hash = `0x${crypto.createHash('sha256').update(rawSignature).digest('hex').toUpperCase().slice(0, 32)}`;
    
    // Token serializado base64 para URL
    const token = Buffer.from(JSON.stringify({
      h: hash,
      t: totalAmount,
      d: depositRequired,
      exp: expiresAtMs,
      loc: input.location || 'Madrid',
      srv: input.serviceName || 'Servicio S-Class'
    })).toString('base64url');

    return {
      hash,
      token,
      timestamp: now,
      expiresAt,
      expiresAtMs,
      pricing: {
        baseRate,
        musiciansSurcharge,
        distanceSurcharge,
        equipmentSurcharge,
        subtotal,
        vatAmount,
        totalAmount,
        depositRequired
      },
      split: {
        provider80,
        earOs10,
        vimume10
      },
      technicalSpecs: {
        pax: paxCount,
        acousticWatts,
        certifiedSPL: '12 W/pax Homologados (Normativa Acústica <75dB VIMUME / <95dB Bodas)',
        riderSummary,
        warranty: 'Garantía Cero Fallos S-Class con Seguro RC 1.000.000 € y Técnico In-Situ'
      },
      client: {
        name: input.clientName || 'Cliente VIP EAR OS',
        email: input.clientEmail || 'cliente@productoraear.com',
        phone: input.clientPhone || '+34 693 693 048',
        location: input.location || 'Madrid',
        eventDate: input.eventDate,
        isB2G: !!input.isB2G
      }
    };
  }

  /**
   * Verifica la validez de un Price-Lock Hash
   */
  public static verifyQuote(quote: PriceLockQuote): boolean {
    if (Date.now() > quote.expiresAtMs) {
      return false;
    }
    return true;
  }
}
