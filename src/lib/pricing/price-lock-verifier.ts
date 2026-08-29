/**
 * EAR OS V2 — Guardián Criptográfico Anti-Fraude de Price-Lock
 * ------------------------------------------------------------------
 * Capa de verificación server-side para el checkout de Stripe.
 * Recalcula la cotización soberana, valida la ventana temporal (24 h),
 * la integridad del hash SHA-256 emitido en cliente y los invariantes
 * de negocio inmutables:
 *   - Tarifa base mínima: 350 € (Solista Edwin Agudelo).
 *   - Split Soberano: artist80 + earOs10 + vimume10 === totalBudget.
 *
 * SSOT: src/lib/pricing/sovereign-pricing.ts
 */

import {
  BASE_SOLISTA,
  COSTE_KM,
  DEPOSITO_STRIPE,
  SUPLEMENTO_TRIO,
  calculateSovereignQuote,
} from './sovereign-pricing';
import type { SovereignQuoteInput, SovereignQuoteResult } from './sovereign-pricing';

/* ------------------------------------------------------------------ */
/* Constantes de seguridad                                             */
/* ------------------------------------------------------------------ */

/** Ventana de validez del Price-Lock: 24 horas (86.400.000 ms). */
export const PRICE_LOCK_WINDOW_MS = 86_400_000;

/** Piso inmutable de tarifa base en EUR — detección de manipulación. */
export const MIN_BASE_PRICE_EUR: number = BASE_SOLISTA; // 350 €

/* ------------------------------------------------------------------ */
/* Tipos exportados                                                    */
/* ------------------------------------------------------------------ */

export type PriceLockValidationStatus =
  | 'VALID'
  | 'EXPIRED'
  | 'HASH_MISMATCH'
  | 'INVALID_BASE_PRICE'
  | 'INVALID_SPLIT_INVARIANT';

/** Parámetros de entrada del guardián criptográfico. */
export interface VerifyAndSignParams {
  input: SovereignQuoteInput;
  clientHash: string;
  issuedAtTimestamp: number; // timestamp Unix en ms
  artistSlug: string; // ej. "edwin-agudelo"
}

/** Metadata firmada que viaja a Stripe (idempotencia + auditoría). */
export interface StripeSessionMetadata {
  artistSlug: string;
  priceLockHash: string;
  totalBudget: number;
  depositAmount: number;
  artistSplit: number;
  earOsSplit: number;
  vimumeSplit: number;
  verifiedAt: number;
}

/** Resultado de fallo — discriminated union por `status`. */
export interface PriceLockFailure {
  status: Exclude<PriceLockValidationStatus, 'VALID'>;
  isValid: false;
}

/** Resultado de éxito con cotización recalculada y metadata Stripe. */
export interface PriceLockSuccess {
  status: 'VALID';
  isValid: true;
  quote: SovereignQuoteResult;
  stripeMetadata: StripeSessionMetadata;
}

export type PriceLockVerificationResult = PriceLockFailure | PriceLockSuccess;

/** Informe de la suite de auto-verificación embebida. */
export interface SelfDiagnosticCase {
  name: string;
  expected: PriceLockValidationStatus;
  actual: PriceLockValidationStatus;
  ok: boolean;
}

export interface SelfDiagnosticReport {
  passed: boolean;
  cases: SelfDiagnosticCase[];
}

/* ------------------------------------------------------------------ */
/* Función principal                                                   */
/* ------------------------------------------------------------------ */

/**
 * Verifica la integridad criptográfica y los invariantes de negocio del
 * presupuesto antes de firmar la sesión de Stripe.
 *
 * Orden de verificación (fail-fast):
 *   1. Ventana temporal (24 h)            -> EXPIRED
 *   2. Integridad SHA-256 Price-Lock      -> HASH_MISMATCH
 *   3. Piso de tarifa base (>= 350 €)     -> INVALID_BASE_PRICE
 *   4. Invariante del Split Soberano      -> INVALID_SPLIT_INVARIANT
 */
export function verifyAndSignStripeSession(
  params: VerifyAndSignParams,
): PriceLockVerificationResult {
  const { input, clientHash, issuedAtTimestamp, artistSlug } = params;

  // a) Recalcular la cotización de forma determinista (SSOT).
  const quote = calculateSovereignQuote(input);

  // b) Ventana de Price-Lock: expiración estricta a las 24 h.
  if (Date.now() - issuedAtTimestamp > PRICE_LOCK_WINDOW_MS) {
    return { status: 'EXPIRED', isValid: false };
  }

  // c) Detección de manipulación del hash emitido en cliente.
  if (clientHash !== quote.priceLockHash) {
    return { status: 'HASH_MISMATCH', isValid: false };
  }

  // d) Piso inmutable: ninguna tarifa base inferior a 350 €.
  if (quote.totalBudget < MIN_BASE_PRICE_EUR) {
    return { status: 'INVALID_BASE_PRICE', isValid: false };
  }

  // e) Invariante matemático del Split Soberano (80/10/10).
  const { artist80, earOs10, vimume10 } = quote.split;
  if (artist80 + earOs10 + vimume10 !== quote.totalBudget) {
    return { status: 'INVALID_SPLIT_INVARIANT', isValid: false };
  }

  // f) Todo verificado -> firma la sesión con metadata de auditoría.
  const verifiedAt = Date.now();
  return {
    status: 'VALID',
    isValid: true,
    quote,
    stripeMetadata: {
      artistSlug,
      priceLockHash: quote.priceLockHash,
      totalBudget: quote.totalBudget,
      depositAmount: DEPOSITO_STRIPE, // 100 € reembolsable
      artistSplit: artist80,
      earOsSplit: earOs10,
      vimumeSplit: vimume10,
      verifiedAt,
    },
  };
}

/* ------------------------------------------------------------------ */
/* Suite de auto-verificación (test embebido)                          */
/* ------------------------------------------------------------------ */

/**
 * Ejecuta los 4 casos de prueba del guardián criptográfico.
 * Devuelve `true` solo si todos los casos superan sus aserciones.
 */
export function runSelfDiagnostics(): boolean {
  const now = Date.now();
  const artistSlug = 'edwin-agudelo';

  // --- Casos base -----------------------------------------------------
  const solistaInput: SovereignQuoteInput = {
    format: 'solista',
    distanceKm: 0,
    soundRider: 'standard',
  };
  const trioInput: SovereignQuoteInput = {
    format: 'trio',
    distanceKm: 100,
    soundRider: 'standard',
  };

  const solistaHash = calculateSovereignQuote(solistaInput).priceLockHash;
  const trioHash = calculateSovereignQuote(trioInput).priceLockHash;

  // --- Caso 1: Válido (Solista, 0 km, Standard) -----------------------
  const case1 = verifyAndSignStripeSession({
    input: solistaInput,
    clientHash: solistaHash,
    issuedAtTimestamp: now,
    artistSlug,
  });

  // --- Caso 2: Expirado (timestamp de hace 48 h) ----------------------
  const case2 = verifyAndSignStripeSession({
    input: solistaInput,
    clientHash: solistaHash,
    issuedAtTimestamp: now - 48 * 60 * 60 * 1000,
    artistSlug,
  });

  // --- Caso 3: Hash falso (tampering) ---------------------------------
  const case3 = verifyAndSignStripeSession({
    input: solistaInput,
    clientHash: 'f4ke-h4sh-tampered-by-adversary',
    issuedAtTimestamp: now,
    artistSlug,
  });

  // --- Caso 4: Trío con 100 km -> VALID con split exacto --------------
  const case4 = verifyAndSignStripeSession({
    input: trioInput,
    clientHash: trioHash,
    issuedAtTimestamp: now,
    artistSlug,
  });

  // Aserción de split exacto para el caso 4 (SSOT: 350 + 250 + round(100*0.35) = 635 €).
  const expectedTrioTotal = BASE_SOLISTA + SUPLEMENTO_TRIO + Math.round(100 * COSTE_KM);
  let case4SplitExact = false;
  if (case4.status === 'VALID' && case4.isValid) {
    const { artist80, earOs10, vimume10 } = case4.quote.split;
    case4SplitExact =
      case4.quote.totalBudget === expectedTrioTotal &&
      artist80 + earOs10 + vimume10 === case4.quote.totalBudget &&
      case4.stripeMetadata.artistSplit === artist80 &&
      case4.stripeMetadata.earOsSplit === earOs10 &&
      case4.stripeMetadata.vimumeSplit === vimume10;
  }

  // --- Informe ---------------------------------------------------------
  const cases: SelfDiagnosticCase[] = [
    { name: 'Caso 1 — Válido (Solista, 0 km, Standard)', expected: 'VALID', actual: case1.status, ok: case1.status === 'VALID' },
    { name: 'Caso 2 — Expirado (48 h)', expected: 'EXPIRED', actual: case2.status, ok: case2.status === 'EXPIRED' },
    { name: 'Caso 3 — Hash Falso (tampering)', expected: 'HASH_MISMATCH', actual: case3.status, ok: case3.status === 'HASH_MISMATCH' },
    { name: 'Caso 4 — Trío 100 km (split exacto)', expected: 'VALID', actual: case4.status, ok: case4.status === 'VALID' && case4SplitExact },
  ];

  const passed = cases.every((c) => c.ok);

  for (const c of cases) {
    console.log(`[PRICE-LOCK DIAG] ${c.ok ? 'PASS' : 'FAIL'} | ${c.name} | esperado=${c.expected} real=${c.actual}`);
  }
  console.log(`[PRICE-LOCK DIAG] Resultado global: ${passed ? 'ALL PASS ✔' : 'FAILURE ✘'}`);

  return passed;
}