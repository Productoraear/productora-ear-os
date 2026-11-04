/**
 * EAR OS V2 — Motor de Despacho Directo 24/7 (Edwin Agudelo & Productora EAR)
 * -----------------------------------------------------------------------------------
 * Sistema de despacho instantáneo y cotización dinámica para Mariachis en toda España:
 * - Formatos: Solista (Edwin Agudelo 350€), Dúo, Trío, Cuarteto, Quinteto, Mariachi Imperial.
 * - Conserjería 24/7: Serenatas express, bodas y eventos corporativos.
 * - Split Soberano: 80% Artistas / 10% Productora EAR / 10% Fondo VIMUME.
 * - Blindaje Criptográfico: Price-Lock SHA-256 y depósito Stripe de 100 € (100% deducible).
 */

import { createHash } from 'crypto';
import {
  DEPOSITO_STRIPE,
  computeSovereignLogistics,
} from '../pricing/sovereign-pricing';

/* ------------------------------------------------------------------ */
/* Constantes de Negocio y Tarifas Homologadas                         */
/* ------------------------------------------------------------------ */

export const TARIFAS_MARIACHI = {
  solista_edwin: 350,       // Tarifa Base Inmutable Solista Edwin Agudelo
  duo_acustico: 480,        // Dúo Guitarra + Trompeta/Voz
  trio_clasico: 600,        // Trío Guitarra, Vihuela, Trompeta
  cuarteto_tradicional: 750,// Cuarteto con Guitarrón
  quinteto_gala: 900,       // Quinteto Completo de Gala
  mariachi_imperial: 1400,  // Mariachi Imperial 7-9 Músicos (Escenario / Fiestas)
};

export const RECARGO_URGENCIA_24_7 = 120; // Serenatas con aviso < 3 horas o nocturnidad (23:00 - 07:00)

/* ------------------------------------------------------------------ */
/* Tipos e Interfaces                                                 */
/* ------------------------------------------------------------------ */

export type MariachiFormat =
  | 'solista_edwin'
  | 'duo_acustico'
  | 'trio_clasico'
  | 'cuarteto_tradicional'
  | 'quinteto_gala'
  | 'mariachi_imperial';

export type ServiceUrgency = 'estandar' | 'express_hoy' | 'urgencia_nocturna_24_7';

export interface MariachiOrderInput {
  format: MariachiFormat;
  serviceType: 'serenata_domicilio' | 'boda_nupcial' | 'cumpleanos_sorpresa' | 'fiesta_patronal';
  urgency: ServiceUrgency;
  locationCity: string;
  distanceKm: number;
  clientPhone: string;
  specialSongRequest?: string;
  eventDate?: string;
  startTime?: string;
  durationHours?: number;
  venueName?: string;
  pax?: number;
  clientName?: string;
}

export interface MariachiDispatchResult {
  orderId: string;
  formatName: string;
  totalPriceEur: number;
  depositAmountEur: number;
  remainingOnArrivalEur: number;
  split: {
    musicians80: number;
    earOs10: number;
    vimume10: number;
  };
  priceLockHash: string;
  whatsappConfirmationCopy: string;
  estimatedArrivalMinutes: number;
  isImmediateDispatch: boolean;
}

/* ------------------------------------------------------------------ */
/* Motor de Cálculo y Despacho                                         */
/* ------------------------------------------------------------------ */

export function calculateMariachiDispatch(input: MariachiOrderInput): MariachiDispatchResult {
  const basePrice = TARIFAS_MARIACHI[input.format] || TARIFAS_MARIACHI.solista_edwin;
  // Logística canónica SSOT: franquicia de 50 km desde Méntrida + hotel si procede.
  const logistics = computeSovereignLogistics(input.distanceKm);
  const travelCost = logistics.totalLogistics;
  const urgencyFee = (input.urgency === 'express_hoy' || input.urgency === 'urgencia_nocturna_24_7')
    ? RECARGO_URGENCIA_24_7
    : 0;

  const totalPriceEur = basePrice + travelCost + urgencyFee;
  const depositAmountEur = DEPOSITO_STRIPE;
  const remainingOnArrivalEur = totalPriceEur - depositAmountEur;

  const musicians80 = Math.round(totalPriceEur * 0.8);
  const earOs10 = Math.round(totalPriceEur * 0.1);
  const vimume10 = totalPriceEur - musicians80 - earOs10;

  // Generación de Hash Price-Lock SHA-256 (0 marcas de terceros)
  const payloadToHash = `MARIACHI_DISPATCH|${input.format}|${logistics.distanceKm}|${totalPriceEur}|${depositAmountEur}|${input.urgency}`;
  const priceLockHash = createHash('sha256').update(payloadToHash).digest('hex');

  const orderId = `EAR-MCH-${Date.now().toString(36).toUpperCase()}-${priceLockHash.substring(0, 6).toUpperCase()}`;

  let estimatedArrivalMinutes = 45;
  if (input.distanceKm > 30) estimatedArrivalMinutes = 60 + Math.round(input.distanceKm * 0.8);

  const formatLabels: Record<MariachiFormat, string> = {
    solista_edwin: 'Solista Premium (Edwin Agudelo)',
    duo_acustico: 'Dúo Acústico Mexicano',
    trio_clasico: 'Trío Clásico de Gala',
    cuarteto_tradicional: 'Cuarteto Tradicional con Guitarrón',
    quinteto_gala: 'Quinteto Imperial de Gala',
    mariachi_imperial: 'Gran Mariachi Imperial (Orquesta Completa)',
  };

  const serviceLabels: Record<MariachiOrderInput['serviceType'], string> = {
    serenata_domicilio: 'Serenata a domicilio',
    boda_nupcial: 'Boda · Ceremonia / Cóctel',
    cumpleanos_sorpresa: 'Aniversario / Celebración privada',
    fiesta_patronal: 'Evento / Festejo popular',
  };

  const formatName = formatLabels[input.format];
  const serviceLabel = serviceLabels[input.serviceType];
  const paxCount = input.pax && input.pax > 0 ? input.pax : 80;
  const wattsRequired = paxCount * 12;
  const dateLabel = input.eventDate ? input.eventDate : 'Pendiente de confirmar fecha exacta';
  const timeLabel = input.startTime ? `Inicio ${input.startTime}` : 'Horario a concretar en ficha';
  const venueLabel = input.venueName ? `${input.venueName} · ${input.locationCity}` : input.locationCity;
  const clientLabel = input.clientName ? `${input.clientName} · ${input.clientPhone}` : input.clientPhone;
  const riderNote = input.specialSongRequest ? input.specialSongRequest : 'Repertorio de gala según ficha del evento';

  // Ficha Operativa de 8 Bloques (Cero paja comercial, precisión milimétrica, ventana de 2h)
  const whatsappConfirmationCopy = [
    `📋 *FICHA DE SERVICIO · ${orderId}*`,
    `⏳ *ESTADO:* Pendiente de depósito (${depositAmountEur},00 € deducibles · ventana máxima 2 h para firma de contrato)`,
    '',
    '*1 · CUÁNDO*',
    `${dateLabel} · ${timeLabel}`,
    'Montaje: 60 min antes del inicio',
    '',
    '*2 · DÓNDE*',
    `${venueLabel} (${input.distanceKm} km desde base)`,
    '',
    '*3 · QUÉ Y PARA QUÉ*',
    `${serviceLabel}`,
    `Formato contratado: ${formatName}`,
    '',
    '*4 · QUIÉN SOLICITA*',
    `${clientLabel}`,
    '',
    '*5 · INVITADOS Y PRESIÓN SONORA*',
    `${paxCount} invitados estimados · ${wattsRequired} W (12 W/pax) · límite < 75 dB SPL (Ley 37/2003)`,
    '',
    '*6 · RIDER Y NECESIDADES*',
    `${riderNote}`,
    '',
    '*7 · DESGLOSE ECONÓMICO (SSOT)*',
    `• Tarifa base formato: ${basePrice},00 €`,
    `• Logística (${input.distanceKm} km): ${travelCost},00 €`,
    urgencyFee > 0 ? `• Suplemento nocturnidad/urgencia: ${urgencyFee},00 €` : '',
    `• *TOTAL SERVICIO: ${totalPriceEur},00 €*`,
    `• Depósito Stripe Price-Lock (100% deducible): ${depositAmountEur},00 €`,
    `• Liquidación restante en el evento: ${remainingOnArrivalEur},00 €`,
    '',
    '*8 · PASO ÚNICO DE BLOQUEO Y CONTRATO*',
    'El contrato firmado del proveedor se emite automáticamente al validar el depósito dentro de las próximas 2 h:',
    `https://www.productoraear.com/reservar/solista?ref=${orderId}&hash=${priceLockHash.substring(0, 16)}`,
    'Conserjería Oficial 24/7: +34 693 693 048'
  ].filter(Boolean).join('\n');

  return {
    orderId,
    formatName,
    totalPriceEur,
    depositAmountEur,
    remainingOnArrivalEur,
    split: {
      musicians80,
      earOs10,
      vimume10,
    },
    priceLockHash,
    whatsappConfirmationCopy,
    estimatedArrivalMinutes,
    isImmediateDispatch: input.urgency !== 'estandar',
  };
}

/* ------------------------------------------------------------------ */
/* Suite de Auto-Diagnóstico                                          */
/* ------------------------------------------------------------------ */

export function runMariachiDispatchDiagnostics(): boolean {
  const case1 = calculateMariachiDispatch({
    format: 'duo_acustico',
    serviceType: 'serenata_domicilio',
    urgency: 'urgencia_nocturna_24_7',
    locationCity: 'Madrid Centro',
    distanceKm: 15,
    clientPhone: '+34600000000',
  });

  const expectedTotalCase1 = 480 + computeSovereignLogistics(15).totalLogistics + 120;
  const case1Valid = case1.totalPriceEur === expectedTotalCase1 && case1.isImmediateDispatch;

  const case2 = calculateMariachiDispatch({
    format: 'mariachi_imperial',
    serviceType: 'boda_nupcial',
    urgency: 'estandar',
    locationCity: 'Toledo',
    distanceKm: 80,
    clientPhone: '+34600000001',
  });

  const expectedTotalCase2 = 1400 + computeSovereignLogistics(80).totalLogistics;
  const case2Valid = case2.totalPriceEur === expectedTotalCase2 && !case2.isImmediateDispatch;

  return case1Valid && case2Valid;
}
