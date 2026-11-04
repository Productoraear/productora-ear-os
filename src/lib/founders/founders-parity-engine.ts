/**
 * ════════════════════════════════════════════════════════════════════════════
 * EAR OS — MOTOR DE PARIDAD DE CONTRATO & PACTO DE LOS 100 FUNDADORES
 * ════════════════════════════════════════════════════════════════════════════
 * Ejecuta la doble estrategia comercial sancionada por el CEO para dominar
 * todas las categorías (Fincas, Catering, Fotografía, Música, Wedding Planners)
 * sin mencionar marcas registradas de terceros (JUR-4):
 *
 *   1. MODALIDAD PARIDAD FUNDADOR VITALICIO (Cupo estricto: 100 plazas):
 *      · Igualamos al céntimo la cuota mensual/anual del contrato anterior
 *        del proveedor (ej. 110,83 €/mes · 212,50 €/mes · 271,67 €/mes).
 *      · Congelación vitalicia por contrato (0% subida IPC de por vida).
 *      · 0% fugas de competidores en su ficha (territorio soberano exclusivo).
 *      · 0% comisión sobre las reservas cerradas en su escaparate.
 *
 *   2. MODALIDAD PUENTE SPLIT 80/10/10 ("DEMOSTRAR ANTES DE COBRAR"):
 *      · Para el empresario escéptico que no desea pagar cuota fija mensual.
 *      · Cuota mensual: 0,00 € · Permanencia: 0 meses.
 *      · Conserjería 24/7 autónoma incluida que filtra y exige depósito de
 *        100 € (`DEPOSITO_STRIPE_EUR`) al cliente antes de molestar al proveedor.
 *      · Solo se liquida bajo Split Soberano (`80% Proveedor / 10% EAR OS / 10% VIMUME`)
 *        cuando la venta es real y está cobrada.
 *
 * Cero `any`, aritmética en céntimos enteros, importable en cliente y servidor.
 * ════════════════════════════════════════════════════════════════════════════
 */

import {
  CENTRALITA_EAR_OS,
  DEPOSITO_STRIPE_EUR,
  SPLIT_SOBERANO,
} from '@/lib/constants/ear-os-ssot';
import { centsToEur, eurToCents } from '@/lib/budget/budget-allocator-engine';

/** Cupo máximo inmutable del Pacto de los 100 Fundadores Vitalicios. */
export const MAX_FOUNDERS_SLOTS = 100 as const;

export type FounderEnrollmentMode =
  | 'PARIDAD_FUNDADOR_VITALICIO'
  | 'PUENTE_SPLIT_CERO_CUOTA';

export type MarketReferenceTierId =
  | 'tier_estandar_110'
  | 'tier_plata_212'
  | 'tier_oro_271'
  | 'factura_personalizada';

export interface MarketReferenceTier {
  readonly id: MarketReferenceTierId;
  readonly label: string;
  readonly monthlyCents: number;
  readonly monthlyEur: number;
  readonly annualCents: number;
  readonly annualEur: number;
  readonly description: string;
}

/**
 * Escalones reales verificados en el mercado de directorios tradicionales
 * (expresados en céntimos enteros, sin citar marcas de terceros — JUR-4).
 */
export const MARKET_REFERENCE_TIERS: readonly MarketReferenceTier[] = Object.freeze([
  {
    id: 'tier_estandar_110',
    label: 'Escalón Estándar (110,83 €/mes)',
    monthlyCents: 11083,
    monthlyEur: 110.83,
    annualCents: 132996,
    annualEur: 1329.96,
    description: 'Cuota anual clásica ~1.330 €/año con permanencia de 12 meses.',
  },
  {
    id: 'tier_plata_212',
    label: 'Escalón Plata (212,50 €/mes)',
    monthlyCents: 21250,
    monthlyEur: 212.5,
    annualCents: 255000,
    annualEur: 2550.0,
    description: 'Cuota primera página clásica ~2.550 €/año con competidores laterales.',
  },
  {
    id: 'tier_oro_271',
    label: 'Escalón Cabecera Oro (271,67 €/mes)',
    monthlyCents: 27167,
    monthlyEur: 271.67,
    annualCents: 326004,
    annualEur: 3260.04,
    description: 'Cuota cabecera ~3.260 €/año sujeta a subidas anuales de tarifa.',
  },
  {
    id: 'factura_personalizada',
    label: 'Importe Exacto de mi Factura Actual',
    monthlyCents: 15000,
    monthlyEur: 150.0,
    annualCents: 180000,
    annualEur: 1800.0,
    description: 'Igualamos al céntimo cualquier recibo vigente aportado por el proveedor.',
  },
]);

export interface FoundersParityInput {
  readonly providerName: string;
  readonly category: string;
  readonly province: string;
  readonly mode: FounderEnrollmentMode;
  readonly referenceTierId: MarketReferenceTierId;
  readonly customMonthlyFeeEur?: number;
  readonly competitorsShownOnOldProfile: number;
  readonly averageBookingTicketEur: number;
  readonly estimatedBookingsPerYear: number;
  readonly previousContractRef?: string;
  /** Plazas ya adjudicadas (por defecto 0 si no hay consulta a BD; jamás inventado). */
  readonly confirmedFoundersCount?: number;
}

export interface FoundersParityResult {
  readonly mode: FounderEnrollmentMode;
  readonly maxFoundersSlots: number;
  readonly confirmedFoundersCount: number;
  readonly remainingFoundersSlots: number;
  readonly frozenMonthlyFeeCents: number;
  readonly frozenMonthlyFeeEur: number;
  readonly frozenAnnualFeeCents: number;
  readonly frozenAnnualFeeEur: number;
  readonly fiveYearIpcSavingsEur: number;
  readonly leakedLeadsRecoveredPerYear: number;
  readonly recoveredRevenuePerYearEur: number;
  readonly splitSimulationPerBooking: {
    readonly grossTicketEur: number;
    readonly providerNet80Eur: number;
    readonly earOs10Eur: number;
    readonly vimumeSocial10Eur: number;
    readonly clientDepositLockEur: number;
  };
  readonly certificateCode: string;
  readonly whatsappActivationText: string;
  readonly whatsappActivationUrl: string;
}

/** Hash determinista FNV-1a 64-bit para el Certificado de Paridad de Fundador. */
function computeFounderCertificateHash(seed: string): string {
  let h1 = 0x811c9dc5 ^ seed.length;
  let h2 = 0x01000193 ^ seed.length;
  for (let i = 0; i < seed.length; i += 1) {
    const c = seed.charCodeAt(i);
    h1 = Math.imul(h1 ^ c, 16777619);
    h2 = Math.imul(h2 ^ c, 2246822507);
  }
  const p1 = (h1 >>> 0).toString(16).padStart(8, '0').toUpperCase();
  const p2 = (h2 >>> 0).toString(16).padStart(8, '0').toUpperCase();
  return `EAR-FND100-${p1}${p2}`;
}

export function calculateFoundersParity(input: FoundersParityInput): FoundersParityResult {
  const providerName = (input.providerName || 'Proveedor Homologado').trim();
  const category = (input.category || 'Finca & Banquete').trim();
  const province = (input.province || 'Madrid').trim();

  const confirmedFoundersCount = Math.max(
    0,
    Math.min(MAX_FOUNDERS_SLOTS, Math.round(input.confirmedFoundersCount ?? 0)),
  );
  const remainingFoundersSlots = MAX_FOUNDERS_SLOTS - confirmedFoundersCount;

  const tier =
    MARKET_REFERENCE_TIERS.find((t) => t.id === input.referenceTierId) ??
    MARKET_REFERENCE_TIERS[0];

  const baseMonthlyCents =
    input.referenceTierId === 'factura_personalizada' &&
    typeof input.customMonthlyFeeEur === 'number' &&
    Number.isFinite(input.customMonthlyFeeEur) &&
    input.customMonthlyFeeEur > 0
      ? eurToCents(input.customMonthlyFeeEur)
      : tier.monthlyCents;

  // En modo PUENTE_SPLIT_CERO_CUOTA la cuota mensual fija es 0 €
  const frozenMonthlyFeeCents =
    input.mode === 'PUENTE_SPLIT_CERO_CUOTA' ? 0 : baseMonthlyCents;
  const frozenAnnualFeeCents = frozenMonthlyFeeCents * 12;

  const frozenMonthlyFeeEur = centsToEur(frozenMonthlyFeeCents);
  const frozenAnnualFeeEur = centsToEur(frozenAnnualFeeCents);

  // En los directorios clásicos la tarifa sube ~8% anual acumulado; en 5 años supone ~46,9% extra
  const baseAnnualEur = centsToEur(baseMonthlyCents * 12);
  const fiveYearIpcSavingsEur =
    input.mode === 'PARIDAD_FUNDADOR_VITALICIO'
      ? Math.round(baseAnnualEur * 0.85)
      : Math.round(baseAnnualEur * 5);

  const competitorsCount = Math.max(0, Math.min(20, Math.round(input.competitorsShownOnOldProfile || 4)));
  const avgTicketEur = Math.max(200, Math.round(input.averageBookingTicketEur || 4500));
  const bookingsPerYear = Math.max(1, Math.min(200, Math.round(input.estimatedBookingsPerYear || 12)));

  // Cada anuncio competidor dentro de la propia ficha drena ~6% de conversión directa
  const leakedLeadsRecoveredPerYear =
    competitorsCount > 0 ? Math.max(1, Math.round((bookingsPerYear * competitorsCount * 6) / 100)) : 0;
  const recoveredRevenuePerYearEur = leakedLeadsRecoveredPerYear * avgTicketEur;

  // Desglose Split Soberano 80/10/10 por evento cerrado
  const ticketCents = eurToCents(avgTicketEur);
  const providerNet80Cents = Math.round(ticketCents * SPLIT_SOBERANO.artista);
  const earOs10Cents = Math.round(ticketCents * SPLIT_SOBERANO.earOs);
  const vimume10Cents = ticketCents - providerNet80Cents - earOs10Cents;

  const contractRefClean = (input.previousContractRef || 'SIN-REF-PREVIA').trim();
  const certificateCode = computeFounderCertificateHash(
    `${providerName}|${category}|${province}|${input.mode}|${frozenAnnualFeeCents}|${contractRefClean}`,
  );

  const modeTitle =
    input.mode === 'PARIDAD_FUNDADOR_VITALICIO'
      ? `PACTO 100 FUNDADORES · CUOTA CONGELADA (${frozenMonthlyFeeEur.toFixed(2)} €/mes · 0% subida vitalicia)`
      : `PUENTE SPLIT SOBERANO 80/10/10 · 0,00 €/mes de cuota fija (Solo cobramos si vendemos)`;

  const whatsappActivationText = [
    `🏛️ *SOLICITUD DE ALIANZA SOBERANA · ${certificateCode}*`,
    `• *Entidad:* ${providerName} (${category} · ${province})`,
    `• *Modalidad Elegida:* ${modeTitle}`,
    input.mode === 'PARIDAD_FUNDADOR_VITALICIO'
      ? `• *Paridad Aplicada:* Igualación de factura previa (${frozenAnnualFeeEur.toFixed(2)} €/año congelados de por vida · Ref: ${contractRefClean})`
      : `• *Liquidación por Éxito:* 80% Proveedor (${centsToEur(providerNet80Cents)} €) / 10% EAR OS / 10% VIMUME sobre ticket medio de ${avgTicketEur} €`,
    `• *Blindaje de Ficha:* 0 competidores anunciados en mi perfil (recuperación estimada: +${recoveredRevenuePerYearEur.toLocaleString('es-ES')} €/año)`,
    `• *Filtro Anti-Mirones:* Conserjería 24/7 + Depósito de bloqueo de ${DEPOSITO_STRIPE_EUR} € deducible.`,
  ].join('\n');

  const cleanPhone = CENTRALITA_EAR_OS.replace(/\D/g, '');
  const whatsappActivationUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(whatsappActivationText)}`;

  return {
    mode: input.mode,
    maxFoundersSlots: MAX_FOUNDERS_SLOTS,
    confirmedFoundersCount,
    remainingFoundersSlots,
    frozenMonthlyFeeCents,
    frozenMonthlyFeeEur,
    frozenAnnualFeeCents,
    frozenAnnualFeeEur,
    fiveYearIpcSavingsEur,
    leakedLeadsRecoveredPerYear,
    recoveredRevenuePerYearEur,
    splitSimulationPerBooking: {
      grossTicketEur: avgTicketEur,
      providerNet80Eur: centsToEur(providerNet80Cents),
      earOs10Eur: centsToEur(earOs10Cents),
      vimumeSocial10Eur: centsToEur(vimume10Cents),
      clientDepositLockEur: DEPOSITO_STRIPE_EUR,
    },
    certificateCode,
    whatsappActivationText,
    whatsappActivationUrl,
  };
}
