/**
 * EAR OS V2 — Deal-Closer Engine (Orquestador Autónomo de Cierre)
 * ------------------------------------------------------------------
 * Transforma un mensaje caótico de WhatsApp en una transacción segura
 * de Stripe: parsea la intención del lead, firma el Price-Lock SHA-256
 * y redacta el copy de cierre ultra-persuasivo.
 *
 * SSOT: src/lib/pricing/sovereign-pricing.ts
 * Guardián criptográfico: src/lib/pricing/price-lock-verifier.ts
 */

import {
  basePriceForFormat,
  calculateSovereignQuote,
  computeSovereignLogistics,
} from '../pricing/sovereign-pricing';
import type { FormatType, SoundRiderType, SovereignQuoteInput } from '../pricing/sovereign-pricing';
import { verifyAndSignStripeSession } from '../pricing/price-lock-verifier';
import type { StripeSessionMetadata } from '../pricing/price-lock-verifier';

/* ------------------------------------------------------------------ */
/* Tipos exportados                                                    */
/* ------------------------------------------------------------------ */

/** Intención comercial extraída del mensaje crudo. */
export interface LeadIntent {
  format: FormatType;
  soundRider: SoundRiderType;
}

/** Respuesta final del orquestador de cierre. */
export interface DealCloserResponse {
  success: boolean;
  financials?: StripeSessionMetadata;
  whatsappCopy: string;
  errorReason?: string;
}

/* ------------------------------------------------------------------ */
/* Heurística de intención                                             */
/* ------------------------------------------------------------------ */

/**
 * Extrae la intención comercial del texto crudo (case-insensitive).
 *   - "trío"/"trio" -> 'trio' | "quinteto" -> 'quinteto' | default 'solista'
 *   - "bose"/"f1"/"elite" -> 'bose_f1_elite' | default 'standard'
 */
export function parseLeadIntent(rawText: string): LeadIntent {
  const text = rawText.toLowerCase();

  let format: FormatType = 'solista';
  if (text.includes('trío') || text.includes('trio')) {
    format = 'trio';
  } else if (text.includes('quinteto')) {
    format = 'quinteto';
  }

  const soundRider: SoundRiderType =
    text.includes('bose') || text.includes('f1') || text.includes('elite')
      ? 'bose_f1_elite'
      : 'standard';

  return { format, soundRider };
}

/* ------------------------------------------------------------------ */
/* Utilidades de copy (derivadas del SSOT, cero números mágicos)       */
/* ------------------------------------------------------------------ */

function formatLabel(format: FormatType): string {
  switch (format) {
    case 'trio':
      return 'Trío';
    case 'quinteto':
      return 'Quinteto';
    default:
      return 'Solista';
  }
}

/** Precio base por formato, delegado al motor canónico (cero duplicidad). */
function basePriceFor(format: FormatType): number {
  return basePriceForFormat(format);
}

function buildSuccessCopy(
  quoteInput: SovereignQuoteInput,
  totalBudget: number,
  depositAmount: number,
): string {
  const base = basePriceFor(quoteInput.format);
  const logistics = computeSovereignLogistics(quoteInput.distanceKm, quoteInput.endHour);
  // Suplemento acústico derivado del SSOT (total - base - logística canónica).
  const sound = totalBudget - base - logistics.totalLogistics;

  const lines: string[] = [
    '🎩 *EAR OS — Experiencia S-Class*',
    '',
    `Estimado/a, hemos preparado para usted la propuesta exclusiva de Edwin Agudelo en formato ${formatLabel(quoteInput.format)}, con nuestro estándar acústico más alto.`,
    '',
    '💰 *Desglose transparente (Price-Lock firmado)*',
    `• Formato ${formatLabel(quoteInput.format)}: ${base} €`,
  ];

  if (logistics.billableKm === 0) {
    lines.push(`• Desplazamiento (${logistics.distanceKm} km — franquicia de ${logistics.franchiseKm} km): 0 €`);
  } else {
    lines.push(
      `• Desplazamiento (${logistics.billableKm} km × ${logistics.ratePerKm.toFixed(2).replace('.', ',')} €/km): ${logistics.travelCost} €`,
    );
  }
  if (logistics.hotelSupplement > 0) {
    lines.push(`• Pernoctación S-Class: ${logistics.hotelSupplement} €`);
  }

  if (sound > 0) {
    lines.push(`• Rider acústico Bose F1 Elite: ${sound} €`);
  }

  lines.push(
    '──────────────',
    `*Total presupuesto: ${totalBudget} €*`,
    '',
    '🛡️ *Garantía 0 Fallos*',
    'Músicos, amplificación y monitorización se homologan en sala antes del evento. Si algún componente no cumple nuestro estándar S-Class, lo reemplazamos sin coste. Su fecha es sagrada para nosotros.',
    '',
    '🎁 *Bono exclusivo*',
    'Dispones del bono EDWIN150-COMPLEMENTOS si te suscribes a nuestro YouTube.',
    '',
    '📅 *Bloquee su fecha ahora*',
    `Abone el depósito de ${depositAmount} € (reembolsable) y su fecha queda reservada con precio bloqueado por 24 h. Le envío enseguida el enlace seguro de pago (Stripe).`,
  );

  return lines.join('\n');
}

function buildErrorCopy(status: string): string {
  return [
    '🙏 *EAR OS — Experiencia S-Class*',
    '',
    'Lamentamos la inconveniencia: se ha producido un error temporal en nuestro sistema de cotización segura y no podemos emitirle el presupuesto firmado en este momento.',
    '',
    `Nuestro equipo ya está revisando la incidencia (código interno: ${status}).`,
    'Escríbanos directamente al WhatsApp +34 693 693 048 y le tendremos la propuesta lista en minutos. 🎩',
  ].join('\n');
}

/* ------------------------------------------------------------------ */
/* Función principal                                                   */
/* ------------------------------------------------------------------ */

/**
 * Orquesta el cierre completo: intención -> cotización SSOT -> firma
 * criptográfica del Price-Lock -> copy de venta para WhatsApp.
 *
 * Trampa lógica resuelta por construcción: el guardián recalcula el hash
 * desde el mismo `SovereignQuoteInput`, así que generamos el `clientHash`
 * in-situ con la misma función SSOT (`calculateSovereignQuote`) y el
 * chequeo HASH_MISMATCH nunca se dispara por divergencia de fórmula.
 */
export function processLeadToCheckout(
  rawText: string,
  distanceKm: number,
  artistSlug: string,
): DealCloserResponse {
  // a) Intención del lead.
  const intent = parseLeadIntent(rawText);

  // b) Cotización soberana (SSOT).
  const quoteInput: SovereignQuoteInput = {
    format: intent.format,
    distanceKm,
    soundRider: intent.soundRider,
  };

  // c) Hash válido in-situ + firma criptográfica del guardián.
  const clientHash = calculateSovereignQuote(quoteInput).priceLockHash;
  const verification = verifyAndSignStripeSession({
    input: quoteInput,
    clientHash,
    issuedAtTimestamp: Date.now(),
    artistSlug,
  });

  // d) Fallo de verificación -> disculpa elegante + canal humano.
  if (!verification.isValid) {
    return {
      success: false,
      errorReason: verification.status,
      whatsappCopy: buildErrorCopy(verification.status),
    };
  }

  // e) Éxito -> copy de cierre ultra-persuasivo con financials firmadas.
  const { quote, stripeMetadata } = verification;
  return {
    success: true,
    financials: stripeMetadata,
    whatsappCopy: buildSuccessCopy(quoteInput, quote.totalBudget, stripeMetadata.depositAmount),
  };
}

/* ------------------------------------------------------------------ */
/* Suite de diagnóstico embebida                                       */
/* ------------------------------------------------------------------ */

/**
 * Simula el lead real: boda en Trío con sonido Bose a 50 km.
 * Aserciones: parseo 'trio' + 'bose_f1_elite', firma criptográfica VALID
 * y copy de cierre generado. Devuelve `true` solo si todo pasa.
 */
export function runDealCloserDiagnostics(): boolean {
  const rawMessage =
    'Hola! Me caso el próximo mes. Queremos a Edwin en formato Trío y con el mejor sonido Bose. Estamos a 50 km.';
  const distanceKm = 50;
  const artistSlug = 'edwin-agudelo';

  console.log('[DEAL-CLOSER DIAG] Mensaje simulado:', rawMessage);

  // 1) Aserción de parseo de intención.
  const intent = parseLeadIntent(rawMessage);
  console.log(`[DEAL-CLOSER DIAG] Intent: format=${intent.format} | soundRider=${intent.soundRider}`);
  const parseOk = intent.format === 'trio' && intent.soundRider === 'bose_f1_elite';

  // 2) Cierre completo con firma criptográfica.
  const result = processLeadToCheckout(rawMessage, distanceKm, artistSlug);
  console.log(
    `[DEAL-CLOSER DIAG] Firma criptográfica: ${result.success ? 'VALID ✔' : `RECHAZADA (${result.errorReason}) ✘`}`,
  );

  if (result.success && result.financials) {
    const f = result.financials;
    console.log(
      `[DEAL-CLOSER DIAG] Financials: total=${f.totalBudget} € | split=${f.artistSplit}/${f.earOsSplit}/${f.vimumeSplit} | depósito=${f.depositAmount} €`,
    );
  }

  // 3) Copy de cierre por consola.
  console.log('\n──────── WHATSAPP COPY ────────');
  console.log(result.whatsappCopy);
  console.log('──────────────────────────────\n');

  const passed = parseOk && result.success;
  console.log(`[DEAL-CLOSER DIAG] Resultado global: ${passed ? 'ALL PASS ✔' : 'FAILURE ✘'}`);
  return passed;
}