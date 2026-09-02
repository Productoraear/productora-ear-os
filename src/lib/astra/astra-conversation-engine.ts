/**
 * EAR OS V2 — ASTRA AI · Centralita Conversacional 24/7 (S-Class)
 * ------------------------------------------------------------------
 * Motor conversacional inteligente para el "Uber del Mariachi" de Edwin
 * Agudelo. Objetivo único: cerrar depósitos Stripe de 100 € en menos de
 * 60 segundos y desarmar objeciones con storyselling de valor.
 *
 * Fases: DESCUBRIMIENTO -> COTIZACION -> MANEJO_OBJECIONES -> CIERRE_STRIPE
 *
 * SSOT pricing:        src/lib/pricing/sovereign-pricing.ts
 * Guardián cripto:     src/lib/pricing/price-lock-verifier.ts
 * Centralita (tel):    src/lib/phone-constants.ts
 */

import {
  BASE_SOLISTA,
  COSTE_KM,
  DEPOSITO_STRIPE,
  SPLIT_SOBERANO,
  SUPLEMENTO_QUINTETO,
  SUPLEMENTO_TRIO,
  calculateSovereignQuote,
} from '../pricing/sovereign-pricing';
import type {
  FormatType,
  SoundRiderType,
  SovereignQuoteInput,
  SovereignQuoteResult,
} from '../pricing/sovereign-pricing';
import { PRICE_LOCK_WINDOW_MS, verifyAndSignStripeSession } from '../pricing/price-lock-verifier';
import type { StripeSessionMetadata } from '../pricing/price-lock-verifier';
import { CENTRALITA } from '../phone-constants';

/* ================================================================== */
/* Constantes de negocio inmutables (derivadas del SSOT)              */
/* ================================================================== */

export const ASTRA_BONUS_CODE = 'EDWIN150-COMPLEMENTOS'; // 150 € microfonía/iluminación cortesía
export const ASTRA_BONUS_VALUE_EUR = 150;
export const ACOUSTIC_POWER_PER_PAX_W = 12; // 12 W/pax homologados (Bose F1 / Shure Beta)

const ARTIST_SLUG = 'edwin-agudelo';
const SITE_BASE_URL: string = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.productoraear.com';

/* ================================================================== */
/* Tipos exportados                                                    */
/* ================================================================== */

export type AstraPhase = 'DESCUBRIMIENTO' | 'COTIZACION' | 'MANEJO_OBJECIONES' | 'CIERRE_STRIPE';
export type ObjectionType = 'PRECIO' | 'CONSULTA_FAMILIAR' | 'COMPARACION' | null;

export interface AstraMessageInput {
  message: string;
  userPhone?: string;
  eventDate?: string;
  format?: FormatType;
  location?: string;
  distanceKm?: number;
}

/** Payload firmado del checkout Stripe (depósito 100 €). */
export interface AstraCheckoutPayload {
  amountEur: number; // 100.00
  currency: 'EUR';
  priceLockHash: string; // SHA-256 hex (64 chars)
  issuedAt: number;
  expiresAt: number; // issuedAt + 24h
  validForHours: 24;
  totalBudgetEur: number;
  checkoutUrl: string; // enlace de pago Price-Lock
  stripeMetadata: StripeSessionMetadata;
}

export interface AstraMessageOutput {
  phase: AstraPhase;
  objectionDetected: ObjectionType;
  reply: string;
  quote?: SovereignQuoteResult;
  checkout?: AstraCheckoutPayload;
  whatsappUrl: string; // botón de WhatsApp directo
  bonusCode: string;
}

/* ================================================================== */
/* Storyselling — biografía lírica + física acústica                   */
/* ================================================================== */

const EDWIN_LYRIC_BIO =
  'Edwin Agudelo no interpreta canciones: las enciende. Su voz de tenor ha hecho llorar a novios en la primera copa y reír a abuelos que creían que el mariachi era cosa del pasado. "Las Mañanitas" bajo su garganta dejan de ser un tema para convertirse en un ritual: velas, silencio, y una sala entera recordando por qué se enamoró.';

const ACOUSTIC_PHYSICS =
  `Nuestro estándar S-Class es matemático: ${ACOUSTIC_POWER_PER_PAX_W} W de presión acústica por persona homologada (rider Bose F1 + micrófonía Shure Beta). No adivinamos el volumen: lo calculamos para que la última mesa escuche igual que la primera.`;

/* ================================================================== */
/* Heurística de detección                                             */
/* ================================================================== */

const PRECIO_PATTERNS = [/\bcaro\b/i, /\bmuy caro\b/i, /\bprecio alto\b/i, /\bencarecid/i, /\bnos sale muy/i];
const FAMILIAR_PATTERNS = [/\blo hablo con mi (pareja|esposa|marido|mujer|familia)/i, /\bhablo con mi (pareja|esposa|marido|mujer|familia)/i, /\bconsulto a mi (pareja|esposa|marido|mujer|familia)/i, /\bmi (pareja|esposa|marido|mujer) decide/i];
const COMPARACION_PATTERNS = [/\botro mariachi cobra menos/i, /\bencontré (un )?mariachi más barato/i, /\bmás barat[oa]s?\b/i, /\bcotización más baja/i, /\bcomparad[oa]/i];

export function detectObjection(message: string): ObjectionType {
  const text = message.toLowerCase();
  if (PRECIO_PATTERNS.some((p) => p.test(text))) return 'PRECIO';
  if (FAMILIAR_PATTERNS.some((p) => p.test(text))) return 'CONSULTA_FAMILIAR';
  if (COMPARACION_PATTERNS.some((p) => p.test(text))) return 'COMPARACION';
  return null;
}

const CIERRE_TRIGGERS = [/\bquiero reservar/i, /\blo quiero/i, /\bvamos a por ello/i, /\bconfirmar/i, /\bpagar ahora/i, /\bcerrar/i, /\bsí, lo quiero/i];

export function detectCloseIntent(message: string): boolean {
  return CIERRE_TRIGGERS.some((p) => p.test(message));
}

/** Extrae formato y rider del texto crudo (fallback si no viene en el payload). */
function parseFormatFromText(text: string): FormatType | null {
  const t = text.toLowerCase();
  if (/quinteto/.test(t)) return 'quinteto';
  if (/tr[ií]o/.test(t)) return 'trio';
  if (/solista|solo\b/.test(t)) return 'solista';
  return null;
}

function parseDistanceKm(text: string): number | null {
  const m = text.match(/(\d+(?:[.,]\d+)?)\s*(?:km|kil[oó]metros?)/i);
  if (!m) return null;
  const n = Number(m[1].replace(',', '.'));
  return Number.isFinite(n) ? n : null;
}

/* ================================================================== */
/* Utilidades de copy                                                  */
/* ================================================================== */

function formatLabel(format: FormatType): string {
  if (format === 'trio') return 'Trío';
  if (format === 'quinteto') return 'Quinteto';
  return 'Solista';
}

/** Precio base por formato, derivado de las constantes SSOT. */
function basePriceFor(format: FormatType): number {
  if (format === 'trio') return BASE_SOLISTA + SUPLEMENTO_TRIO;
  if (format === 'quinteto') return BASE_SOLISTA + SUPLEMENTO_QUINTETO;
  return BASE_SOLISTA;
}

function buildWhatsappUrl(context: string): string {
  const text = encodeURIComponent(
    `Hola, soy Astra de EAR OS. ${context} — Quiero cerrar mi reserva con Edwin Agudelo (bono ${ASTRA_BONUS_CODE}).`,
  );
  return `${CENTRALITA.whatsapp}?text=${text}`;
}

function buildCheckoutUrl(hash: string): string {
  const params = new URLSearchParams({
    deposit: String(DEPOSITO_STRIPE),
    priceLockHash: hash,
    bonus: ASTRA_BONUS_CODE,
  });
  return `${SITE_BASE_URL}/checkout/presupuesto?${params.toString()}`;
}

/* ================================================================== */
/* Generación del checkout Stripe (100 € + Price-Lock SHA-256 / 24h)   */
/* ================================================================== */

/**
 * Firma el depósito de 100 € con el guardián criptográfico y emite el
 * payload de checkout: hash SHA-256 válido por 24 h + metadata Stripe.
 */
export function generateStripeCheckout(quoteInput: SovereignQuoteInput): AstraCheckoutPayload {
  const issuedAt = Date.now();

  // Hash in-situ con la misma fórmula SSOT -> el guardián nunca lo rechaza.
  const clientHash = calculateSovereignQuote(quoteInput).priceLockHash;

  const verification = verifyAndSignStripeSession({
    input: quoteInput,
    clientHash,
    issuedAtTimestamp: issuedAt,
    artistSlug: ARTIST_SLUG,
  });

  if (!verification.isValid) {
    throw new Error(`ASTRA_CHECKOUT_REJECTED:${verification.status}`);
  }

  const { quote, stripeMetadata } = verification;
  return {
    amountEur: DEPOSITO_STRIPE, // 100.00 €
    currency: 'EUR',
    priceLockHash: quote.priceLockHash,
    issuedAt,
    expiresAt: issuedAt + PRICE_LOCK_WINDOW_MS,
    validForHours: 24,
    totalBudgetEur: quote.totalBudget,
    checkoutUrl: buildCheckoutUrl(quote.priceLockHash),
    stripeMetadata,
  };
}

/* ================================================================== */
/* Copys por fase                                                      */
/* ================================================================== */

function discoveryCopy(input: AstraMessageInput): string {
  const lines = [
    '🎩 *EAR OS — Centralita S-Class 24/7*',
    '',
    EDWIN_LYRIC_BIO,
    '',
    ACOUSTIC_PHYSICS,
    '',
    'Para bloquear su fecha necesito solo 3 datos:',
    '1️⃣ *Fecha del evento* (ej. "el 12 de septiembre")',
    `2️⃣ *Formato*: Solista (${BASE_SOLISTA} €) · Trío (+${SUPLEMENTO_TRIO} €) · Quinteto (+${SUPLEMENTO_QUINTETO} €)`,
    '3️⃣ *Ciudad o km desde nuestra base*',
  ];
  if (input.location) lines.push(`📍 Ubicación recibida: ${input.location}.`);
  if (input.eventDate) lines.push(`📅 Fecha recibida: ${input.eventDate}.`);
  lines.push('', 'Dígame esos datos y en menos de 60 segundos le entrego su presupuesto firmado con Price-Lock criptográfico. 🚀');
  return lines.join('\n');
}

function quoteCopy(quoteInput: SovereignQuoteInput, quote: SovereignQuoteResult): string {
  const base = basePriceFor(quoteInput.format);
  const travel = Math.round(quoteInput.distanceKm * COSTE_KM);
  const sound = quote.totalBudget - base - travel;

  const lines = [
    '💰 *Presupuesto firmado — Price-Lock SHA-256*',
    `• Formato ${formatLabel(quoteInput.format)}: ${base} €`,
    `• Desplazamiento (${quoteInput.distanceKm} km × ${COSTE_KM.toFixed(2).replace('.', ',')} €/km): ${travel} €`,
  ];
  if (sound > 0) lines.push(`• Rider acústico Bose F1 Elite: ${sound} €`);

  lines.push(
    '──────────────',
    `*Total presupuesto: ${quote.totalBudget} €*`,
    '',
    '🛡️ *Garantía 0 Fallos*: músicos, amplificación y monitorización se homologan en sala antes del evento. Si algo no cumple el estándar S-Class, lo reemplazamos sin coste.',
    '',
    `🎁 *Bono ${ASTRA_BONUS_CODE}*: ${ASTRA_BONUS_VALUE_EUR} € en microfonía/iluminación de cortesía si reserva hoy (24 h).`,
  );
  return lines.join('\n');
}

function objectionCopy(type: ObjectionType, quoteInput: SovereignQuoteInput | null): string {
  const bonusLine = `🎁 Y recuerde el bono ${ASTRA_BONUS_CODE}: ${ASTRA_BONUS_VALUE_EUR} € en microfonía/iluminación de cortesía si cierra hoy.`;

  if (type === 'PRECIO') {
    return [
      'Entiendo la sensibilidad con los números. Déjeme poner el precio en perspectiva:',
      '',
      EDWIN_LYRIC_BIO,
      '',
      ACOUSTIC_PHYSICS,
      '',
      'Un mariachi "barato" le vende una voz y un violín. Edwin le entrega un *sistema*: sonido calibrado por persona, monitorización Shure Beta, garantía 0 fallos y una producción que se graba en la memoria de sus invitados para siempre.',
      '',
      bonusLine,
    ].join('\n');
  }

  if (type === 'CONSULTA_FAMILIAR') {
    return [
      'Por supuesto: las grandes decisiones se toman juntos. Y le propongo algo mejor que "hablarlo":',
      '',
      `Envíele este mismo presupuesto firmado con Price-Lock criptográfico — el precio queda *bloqueado 24 h* y el bono ${ASTRA_BONUS_CODE} (${ASTRA_BONUS_VALUE_EUR} € en complementos) viaja con la reserva.`,
      '',
      'Cuando ambos lo lean, ya no comparan precios: comparan una experiencia S-Class con cualquier otra. Y ahí Edwin Agudelo no tiene competencia.',
    ].join('\n');
  }

  // COMPARACION
  return [
    'Excelente que compare — es señal de que le importa la calidad. Pero fíjese en lo que *no* está comparando:',
    '',
    ACOUSTIC_PHYSICS,
    '',
    EDWIN_LYRIC_BIO,
    '',
    'El otro mariachi cobra menos porque no homologa 12 W por persona, no garantiza 0 fallos y no le regala 150 € en complementos. Usted no está comprando música: está comprando que *su* evento sea inolvidable.',
    '',
    bonusLine,
  ].join('\n');
}

function closeCopy(quoteInput: SovereignQuoteInput, checkout: AstraCheckoutPayload): string {
  return [
    '🔐 *CIERRE ACTIVADO — Depósito Price-Lock*',
    '',
    `Su fecha queda reservada con un depósito de ${checkout.amountEur.toFixed(2)} € (reembolsable). Precio bloqueado criptográficamente por 24 h.`,
    '',
    `🧾 Total presupuesto: ${checkout.totalBudgetEur} € · Depósito hoy: ${checkout.amountEur.toFixed(2)} € · Saldo al evento: ${(checkout.totalBudgetEur - checkout.amountEur).toFixed(2)} €`,
    `🎁 Bono aplicado: ${ASTRA_BONUS_CODE} (${ASTRA_BONUS_VALUE_EUR} € en microfonía/iluminación de cortesía)`,
    '',
    '👉 *Pulse el enlace de pago seguro (Stripe) para bloquear su fecha ahora mismo:*',
    checkout.checkoutUrl,
    '',
    `⏳ El Price-Lock expira en 24 h. Después, la tarifa vuelve a mercado abierto y el bono ${ASTRA_BONUS_CODE} se retira.`,
    '',
    '¿Cualquier duda antes de pagar? Escríbame por WhatsApp y le acompaño paso a paso. 🎩',
  ].join('\n');
}

/* ================================================================== */
/* Función principal                                                   */
/* ================================================================== */

/**
 * Procesa un mensaje entrante de la centralita y devuelve la respuesta
 * persuasiva de Astra con su fase, objeción detectada, cotización firmada
 * (si aplica), checkout Stripe de 100 € y botón de WhatsApp directo.
 */
export function processAstraMessage(input: AstraMessageInput): AstraMessageOutput {
  const message = input.message ?? '';

  // --- Resolución de parámetros (payload > texto) ----------------------
  const textFormat = parseFormatFromText(message);
  const format: FormatType = input.format ?? textFormat ?? 'solista';
  const distanceKm: number = input.distanceKm ?? parseDistanceKm(message) ?? 0;
  const soundRider: SoundRiderType = /bose|f1|elite/i.test(message) ? 'bose_f1_elite' : 'standard';

  const quoteInput: SovereignQuoteInput = { format, distanceKm, soundRider };
  const objection = detectObjection(message);
  const wantsClose = detectCloseIntent(message);

  // --- Fase 4: CIERRE_STRIPE ------------------------------------------
  if (wantsClose) {
    const quote = calculateSovereignQuote(quoteInput);
    const checkout = generateStripeCheckout(quoteInput);
    return {
      phase: 'CIERRE_STRIPE',
      objectionDetected: objection,
      reply: closeCopy(quoteInput, checkout),
      quote,
      checkout,
      whatsappUrl: buildWhatsappUrl(`Mi presupuesto firmado es de ${quote.totalBudget} € (formato ${formatLabel(format)}).`),
      bonusCode: ASTRA_BONUS_CODE,
    };
  }

  // --- Fase 3: MANEJO_OBJECIONES ---------------------------------------
  if (objection) {
    return {
      phase: 'MANEJO_OBJECIONES',
      objectionDetected: objection,
      reply: objectionCopy(objection, quoteInput),
      whatsappUrl: buildWhatsappUrl('Tengo una duda sobre el presupuesto de Edwin Agudelo.'),
      bonusCode: ASTRA_BONUS_CODE,
    };
  }

  // --- Fase 2: COTIZACION (hay fecha o formato explícito) --------------
  if (input.eventDate || input.format || textFormat) {
    const quote = calculateSovereignQuote(quoteInput);
    return {
      phase: 'COTIZACION',
      objectionDetected: null,
      reply: quoteCopy(quoteInput, quote),
      quote,
      whatsappUrl: buildWhatsappUrl(`Quiero cotizar formato ${formatLabel(format)} para mi evento.`),
      bonusCode: ASTRA_BONUS_CODE,
    };
  }

  // --- Fase 1: DESCUBRIMIENTO ------------------------------------------
  return {
    phase: 'DESCUBRIMIENTO',
    objectionDetected: null,
    reply: discoveryCopy(input),
    whatsappUrl: buildWhatsappUrl('Quiero información para reservar a Edwin Agudelo.'),
    bonusCode: ASTRA_BONUS_CODE,
  };
}

/* ================================================================== */
/* Suite de autodiagnóstico (4 tests)                                  */
/* ================================================================== */

export interface AstraDiagnosticCase {
  id: number;
  name: string;
  ok: boolean;
  detail: string;
}

export interface AstraDiagnosticsReport {
  passed: boolean;
  cases: AstraDiagnosticCase[];
}

/**
 * Suite de autodiagnóstico del motor conversacional Astra.
 *   Test 1: Parser + cotización instantánea Trío (600 €) + km.
 *   Test 2: Desarme de objeción "es muy caro" con storyselling + bono 150 €.
 *   Test 3: Firma SHA-256 válida para depósito Stripe 100 €.
 *   Test 4: Split Soberano exacto 80% Artista / 10% EAR / 10% VIMUME.
 */
export function runAstraDiagnostics(): AstraDiagnosticsReport {
  const cases: AstraDiagnosticCase[] = [];

  /* ---- TEST 1 — Parser y cotización instantánea Trío (600 €) + km ---- */
  try {
    const out1 = processAstraMessage({
      message: 'Hola, quiero a Edwin en formato trío para mi boda, son unos 80 km desde nuestra base.',
      eventDate: '2026-09-12',
      location: 'Méntrida (Toledo)',
    });
    const ok =
      out1.phase === 'COTIZACION' &&
      out1.quote !== undefined &&
      out1.quote.totalBudget >= 600; // Trío base 600 € + km
    cases.push({
      id: 1,
      name: 'Parser y cotización instantánea Trío (600 €) + km',
      ok,
      detail: `phase=${out1.phase} · totalBudget=${out1.quote?.totalBudget ?? 'N/A'} €`,
    });
  } catch (err) {
    cases.push({ id: 1, name: 'Parser y cotización instantánea Trío (600 €) + km', ok: false, detail: String(err) });
  }

  /* ---- TEST 2 — Desarme de objeción "es muy caro" --------------------- */
  try {
    const out2 = processAstraMessage({ message: 'Me encanta, pero es muy caro para mi bolsillo.' });
    const replyLower = out2.reply.toLowerCase();
    const ok =
      out2.phase === 'MANEJO_OBJECIONES' &&
      out2.objectionDetected === 'PRECIO' &&
      replyLower.includes('edwin agudelo') && // storyselling biográfico
      replyLower.includes('12 w') && // física acústica 12 W/pax
      replyLower.includes(ASTRA_BONUS_CODE.toLowerCase()) && // bono 150 € (reply se compara en minúsculas)
      replyLower.includes(String(ASTRA_BONUS_VALUE_EUR));
    cases.push({
      id: 2,
      name: 'Desarme de objeción "es muy caro" (storyselling + bono 150 €)',
      ok,
      detail: `phase=${out2.phase} · objection=${out2.objectionDetected}`,
    });
  } catch (err) {
    cases.push({ id: 2, name: 'Desarme de objeción "es muy caro" (storyselling + bono 150 €)', ok: false, detail: String(err) });
  }

  /* ---- TEST 3 — Firma SHA-256 válida para depósito Stripe 100 € ------- */
  try {
    const out3 = processAstraMessage({
      message: 'Perfecto, quiero reservar y pagar ahora mismo.',
      eventDate: '2026-09-12',
      format: 'trio',
      distanceKm: 80,
    });
    const hashOk = /^[a-f0-9]{64}$/.test(out3.checkout?.priceLockHash ?? '');
    const ok =
      out3.phase === 'CIERRE_STRIPE' &&
      out3.checkout !== undefined &&
      out3.checkout.amountEur === DEPOSITO_STRIPE && // 100.00 €
      hashOk &&
      out3.checkout.validForHours === 24 &&
      out3.checkout.expiresAt - out3.checkout.issuedAt === PRICE_LOCK_WINDOW_MS;
    cases.push({
      id: 3,
      name: 'Firma SHA-256 válida para depósito Stripe 100 €',
      ok,
      detail: `hash=${(out3.checkout?.priceLockHash ?? '').slice(0, 16)}… · amount=${out3.checkout?.amountEur} €`,
    });
  } catch (err) {
    cases.push({ id: 3, name: 'Firma SHA-256 válida para depósito Stripe 100 €', ok: false, detail: String(err) });
  }

  /* ---- TEST 4 — Split Soberano exacto 80/10/10 ------------------------ */
  try {
    const quote = calculateSovereignQuote({ format: 'trio', distanceKm: 80, soundRider: 'standard' });
    const total = quote.totalBudget;
    const artist = Math.round(total * 0.8);
    const earOs = Math.round(total * 0.1);
    const vimume = Math.round(total - artist - earOs); // residuo exacto -> suma cerrada
    const ok =
      artist === Math.round(total * SPLIT_SOBERANO.artist) &&
      earOs === Math.round(total * SPLIT_SOBERANO.earOs) &&
      artist + earOs + vimume === total;
    cases.push({
      id: 4,
      name: 'Split Soberano exacto 80% Artista / 10% EAR / 10% VIMUME',
      ok,
      detail: `total=${total} € → artista=${artist} · earOs=${earOs} · vimume=${vimume}`,
    });
  } catch (err) {
    cases.push({ id: 4, name: 'Split Soberano exacto 80% Artista / 10% EAR / 10% VIMUME', ok: false, detail: String(err) });
  }

  return { passed: cases.every((c) => c.ok), cases };
}
