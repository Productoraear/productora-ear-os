/**
 * ════════════════════════════════════════════════════════════════════════════
 * EAR OS — COMMISSION LEDGER SOBERANO 80/10/10 EN CÉNTIMOS ENTEROS
 * ════════════════════════════════════════════════════════════════════════════
 * Conciliación financiera determinista sin fugas de redondeo:
 *  - 80% Retribución neta para el Artista / Proveedor
 *  - 10% Infraestructura tecnológica EAR OS
 *  - 10% Donación con Impacto Social VIMUME (Ley 49/2002 de Mecenazgo)
 * Invariante: artistCents + earOsCents + vimumeCents === totalBaseCents
 * ════════════════════════════════════════════════════════════════════════════
 */

import crypto from 'node:crypto';
import { SPLIT_SOBERANO } from '@/lib/constants/ear-os-ssot';

export interface SplitCentsBreakdown {
  totalBaseCents: number;
  artistCents: number;
  earOsCents: number;
  vimumeCents: number;
  depositCents: number;
  balanceDueCents: number;
  vatRatePercent: number;
  vatCents: number;
  totalWithVatCents: number;
  auditHash: string;
}

export interface SplitCalculationInput {
  totalBaseEur: number;
  depositPaidEur?: number;
  vatRatePercent?: number;
  eventId?: string;
}

export function calculateCommissionLedgerSplitCents(input: SplitCalculationInput): SplitCentsBreakdown {
  const totalBaseCents = Math.round(input.totalBaseEur * 100);
  const depositCents = Math.round((input.depositPaidEur ?? 0) * 100);
  const vatRate = input.vatRatePercent ?? 21;

  // Exact 80/10/10 split in integer cents
  const earOsCents = Math.floor(totalBaseCents * SPLIT_SOBERANO.earOs);
  const vimumeCents = Math.floor(totalBaseCents * SPLIT_SOBERANO.vimume);
  // Invariant preservation: artist gets the exact remainder to eliminate 1-cent rounding drift
  const artistCents = totalBaseCents - earOsCents - vimumeCents;

  const vatCents = Math.round((totalBaseCents * vatRate) / 100);
  const totalWithVatCents = totalBaseCents + vatCents;
  const balanceDueCents = Math.max(0, totalWithVatCents - depositCents);

  const hashContent = `${totalBaseCents}:${artistCents}:${earOsCents}:${vimumeCents}:${depositCents}:${input.eventId ?? 'DIRECT'}`;
  const auditHash = crypto.createHash('sha256').update(hashContent).digest('hex');

  return {
    totalBaseCents,
    artistCents,
    earOsCents,
    vimumeCents,
    depositCents,
    balanceDueCents,
    vatRatePercent: vatRate,
    vatCents,
    totalWithVatCents,
    auditHash
  };
}

export function reconcileCommissionSplit(breakdown: SplitCentsBreakdown): {
  isValid: boolean;
  driftCents: number;
} {
  const sum = breakdown.artistCents + breakdown.earOsCents + breakdown.vimumeCents;
  const drift = breakdown.totalBaseCents - sum;
  return {
    isValid: drift === 0,
    driftCents: drift
  };
}
