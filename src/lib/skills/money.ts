/**
 * ════════════════════════════════════════════════════════════════════════════
 * EAR OS — SKILLS SOBERANAS · ARITMÉTICA MONETARIA EN CÉNTIMOS ENTEROS
 * ════════════════════════════════════════════════════════════════════════════
 * Un balance que no cuadra al céntimo es un balance falso. Todo el cálculo de
 * las habilidades se hace en céntimos enteros y el split se aplica con reparto
 * de resto explícito, de modo que:
 *
 *     atribuido(artista) + atribuido(earOs) + atribuido(vimume) === bruto
 *
 * SIEMPRE, al céntimo, para cualquier importe. El resto de redondeo (0, 1 o 2
 * céntimos) va SIEMPRE al artista y queda declarado en `roundingCentsApplied`
 * para que el contable pueda auditarlo y no tenga que confiar en la promesa.
 *
 * Prohibido `Float` para dinero fuera de este módulo (INV-10 en su versión
 * monetaria): la Zona Cero define ratios, este módulo define los céntimos.
 * ════════════════════════════════════════════════════════════════════════════
 */

import { SPLIT_SOBERANO, VAT_RATE } from '@/lib/constants/ear-os-ssot';

export interface CentsSplit {
  /** Bruto del evento en céntimos enteros. */
  readonly grossCents: number;
  /** Parte del artista/proveedor (80 % canónico + resto de redondeo). */
  readonly artistCents: number;
  /** Comisión EAR OS (10 % canónico). */
  readonly earOsCents: number;
  /** Fondo VIMUME (10 % canónico). */
  readonly vimumeCents: number;
  /**
   * Céntimos de redondeo que absorbió el artista para que la suma cuadre
   * exactamente con el bruto. Puede ser 0, 1 o 2. Se declara, no se esconde.
   */
  readonly roundingCentsApplied: number;
  /** `true` si artist+earOs+vimume === gross (siempre, por construcción). */
  readonly reconciled: boolean;
}

/** Convierte euros (posiblemente con decimales) a céntimos enteros, una sola vez. */
export function eurosToCents(euros: number): number {
  const safe = Number.isFinite(euros) ? euros : 0;
  return Math.round(safe * 100);
}

/** Convierte céntimos enteros a euros para presentación. */
export function centsToEuros(cents: number): number {
  const safe = Number.isInteger(cents) ? cents : Math.round(cents);
  return safe / 100;
}

/**
 * Aplica el Split Soberano 80/10/10 en céntimos con reconciliación exacta.
 * Los ratios se leen del SSOT: cambiar la Zona Cero cambia este resultado.
 */
export function splitSovereignCents(grossCents: number): CentsSplit {
  const gross = Math.max(0, Math.round(Number.isFinite(grossCents) ? grossCents : 0));

  const earOsCents = Math.round(gross * SPLIT_SOBERANO.earOs);
  const vimumeCents = Math.round(gross * SPLIT_SOBERANO.vimume);
  const naiveArtist = Math.round(gross * SPLIT_SOBERANO.artista);

  // El artista absorbe el resto para que la identidad contable sea exacta.
  const artistCents = gross - earOsCents - vimumeCents;

  return {
    grossCents: gross,
    artistCents,
    earOsCents,
    vimumeCents,
    roundingCentsApplied: artistCents - naiveArtist,
    reconciled: artistCents + earOsCents + vimumeCents === gross,
  };
}

export interface VatBreakdown {
  /** Base imponible en céntimos. */
  readonly baseCents: number;
  /** Cuota de IVA en céntimos. */
  readonly vatCents: number;
  /** Total con IVA en céntimos (base + cuota). */
  readonly totalCents: number;
  /** Tipo aplicado, leído del SSOT. */
  readonly rate: number;
}

/** Desglosa un total CON IVA ya conocido (operación inversa del recargo). */
export function vatFromGrossCents(totalCents: number): VatBreakdown {
  const total = Math.max(0, Math.round(Number.isFinite(totalCents) ? totalCents : 0));
  const baseCents = Math.round(total / (1 + VAT_RATE));
  return { baseCents, vatCents: total - baseCents, totalCents: total, rate: VAT_RATE };
}

/** Añade IVA a una base imponible en céntimos. */
export function vatFromBaseCents(baseCents: number): VatBreakdown {
  const base = Math.max(0, Math.round(Number.isFinite(baseCents) ? baseCents : 0));
  const vatCents = Math.round(base * VAT_RATE);
  return { baseCents: base, vatCents, totalCents: base + vatCents, rate: VAT_RATE };
}

/** Formato monetario español determinista para documentos (`1.234,56 €`). */
export function formatEurosEs(cents: number): string {
  const euros = centsToEuros(cents);
  const negative = euros < 0;
  const absolute = Math.abs(euros);
  const fixed = absolute.toFixed(2);
  const [integerPart, decimalPart] = fixed.split('.');
  const grouped = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `${negative ? '-' : ''}${grouped},${decimalPart} €`;
}
