/**
 * EAR OS V2 — Motor Centralita "Uber del Mariachi 24/7" (Edwin Agudelo & Productora EAR)
 * -----------------------------------------------------------------------------------
 * Sistema de despacho instantáneo y cotización dinámica para Mariachis en toda España:
 * - Formatos: Solista (Edwin Agudelo 350€), Dúo, Trío, Cuarteto, Quinteto, Mariachi Imperial.
 * - Centralita 24/7: Serenatas express de última hora, bodas y eventos corporativos.
 * - Split Soberano: 80% Artistas / 10% Productora EAR / 10% Fondo VIMUME.
 * - Blindaje Criptográfico: Price-Lock SHA-256 y depósito Stripe de 100 €.
 */

import { createHash } from 'crypto';
import { BASE_SOLISTA, COSTE_KM, DEPOSITO_STRIPE } from '../pricing/sovereign-pricing';

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
  const travelCost = Math.round(input.distanceKm * COSTE_KM);
  const urgencyFee = (input.urgency === 'express_hoy' || input.urgency === 'urgencia_nocturna_24_7') 
    ? RECARGO_URGENCIA_24_7 
    : 0;

  const totalPriceEur = basePrice + travelCost + urgencyFee;
  const depositAmountEur = DEPOSITO_STRIPE;
  const remainingOnArrivalEur = totalPriceEur - depositAmountEur;

  const musicians80 = Math.round(totalPriceEur * 0.8);
  const earOs10 = Math.round(totalPriceEur * 0.1);
  const vimume10 = totalPriceEur - musicians80 - earOs10;

  // Generación de Hash Price-Lock SHA-256
  const payloadToHash = `MARIACHI_UBER|${input.format}|${input.distanceKm}|${totalPriceEur}|${depositAmountEur}|${input.urgency}`;
  const priceLockHash = createHash('sha256').update(payloadToHash).digest('hex');

  const orderId = `EAR-MCH-${Date.now().toString(36).toUpperCase()}-${priceLockHash.substring(0, 6).toUpperCase()}`;

  // Estimación de llegada para el "Uber del Mariachi"
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

  const formatName = formatLabels[input.format];

  // Redacción del WhatsApp de Cierre Inmediato 24/7
  const whatsappConfirmationCopy = [
    '🎺 *CENTRALITA UBER DEL MARIACHI 24/7 — PRODUCTORA EAR*',
    `*Referencia:* \`${orderId}\``,
    '',
    `¡Hola! Hemos recibido tu solicitud para *${formatName}* en *${input.locationCity}*.`,
    '',
    '💰 *Cotización Oficial y Transparente (Price-Lock Certificado):*',
    `• Formato seleccionado: ${basePrice} €`,
    `• Desplazamiento (${input.distanceKm} km): ${travelCost} €`,
    urgencyFee > 0 ? `• Suplemento Despacho Express 24/7: ${urgencyFee} €` : '',
    '──────────────────────────────',
    `*TOTAL SERVICIO: ${totalPriceEur} €*`,
    `• *Depósito de Bloqueo Inmediato (Stripe):* ${depositAmountEur} € (Reembolsable)`,
    `• *Restante a abonar a la llegada del Mariachi:* ${remainingOnArrivalEur} €`,
    '',
    '⏱️ *Tiempo estimado de llegada del equipo:* ' + estimatedArrivalMinutes + ' minutos.',
    '🛡️ *Garantía de Puntualidad y Ropa de Gala Homologada 0 Fallos.*',
    '🎁 *Bono Activado:* Bono EDWIN150-COMPLEMENTOS aplicable suscribiéndote a nuestro canal de YouTube.',
    '',
    '📲 *Para confirmar el despacho y bloquear la agenda, realiza el depósito de 100 € aquí:*',
    `https://www.productoraear.com/api/payments/checkout?ref=${orderId}&hash=${priceLockHash}`,
    '',
    'Centralita 24h: +34 693 693 048 | Edwin Agudelo'
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
  console.log('[MARIACHI-DISPATCH] Iniciando diagnóstico de la Centralita 24/7...');

  // Caso 1: Serenata Express de madrugada en Madrid (Dúo a 15 km con urgencia nocturna)
  const case1 = calculateMariachiDispatch({
    format: 'duo_acustico',
    serviceType: 'serenata_domicilio',
    urgency: 'urgencia_nocturna_24_7',
    locationCity: 'Madrid Centro',
    distanceKm: 15,
    clientPhone: '+34600000000',
  });

  const expectedTotalCase1 = 480 + Math.round(15 * 0.35) + 120; // 480 + 5 + 120 = 605
  const case1Valid = case1.totalPriceEur === expectedTotalCase1 && case1.isImmediateDispatch;
  console.log(`[MARIACHI-DISPATCH] Caso 1 (Serenata Express 24/7): ${case1Valid ? 'PASS ✔' : 'FAIL ✘'} (Total: ${case1.totalPriceEur}€)`);

  // Caso 2: Boda Mariachi Imperial en Toledo (80 km estándar)
  const case2 = calculateMariachiDispatch({
    format: 'mariachi_imperial',
    serviceType: 'boda_nupcial',
    urgency: 'estandar',
    locationCity: 'Toledo',
    distanceKm: 80,
    clientPhone: '+34600000001',
  });

  const expectedTotalCase2 = 1400 + Math.round(80 * 0.35); // 1400 + 28 = 1428
  const case2Valid = case2.totalPriceEur === expectedTotalCase2 && !case2.isImmediateDispatch;
  console.log(`[MARIACHI-DISPATCH] Caso 2 (Boda Mariachi Imperial): ${case2Valid ? 'PASS ✔' : 'FAIL ✘'} (Total: ${case2.totalPriceEur}€)`);

  const allPass = case1Valid && case2Valid;
  console.log(`[MARIACHI-DISPATCH] Diagnóstico Global: ${allPass ? 'ALL PASS ✔' : 'FAILURE ✘'}`);
  return allPass;
}
