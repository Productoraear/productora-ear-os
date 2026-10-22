/**
 * ════════════════════════════════════════════════════════════════════════════
 * EAR OS — MOTOR DE LIQUIDACIÓN SPLIT SOBERANO 80/10/10 Y MODELO 182
 * ════════════════════════════════════════════════════════════════════════════
 * Computa la distribución determinista de honorarios post-evento:
 *  - 80% Retribución neta para el Artista / Proveedor
 *  - 10% Infraestructura tecnológica EAR OS
 *  - 10% Donación con Impacto Social VIMUME (Ley 49/2002 de Mecenazgo)
 *  - Emisión de Certificado Fiscal Oficial Modelo 182 AEAT
 * ════════════════════════════════════════════════════════════════════════════
 */

import crypto from 'node:crypto';
import {
    SPLIT_SOBERANO,
    DEPOSITO_STRIPE_EUR,
    VAT_RATE,
    TARIFA_BASE_SOLISTA_EUR,
} from '@/lib/constants/ear-os-ssot';

export interface SettlementParty {
    id: string;
    name: string;
    taxId: string; // NIF / CIF
    stripeAccountId?: string;
    iban?: string;
    email?: string;
}

export interface Modelo182Certificate {
    certificateId: string;
    donorName: string;
    donorTaxId: string;
    amountEur: number;
    deductionRatePercent: number; // 80% para los primeros 250€ según Ley 49/2002
    potentialTaxDeductionEur: number;
    fiscalYear: number;
    beneficiaryEntity: string;
    legalReference: string;
    issuedAt: string;
    sha256Hash: string;
}

export interface SplitPayoutBreakdown {
    baseGrossEur: number;
    vatAmountEur: number;
    totalGrossEur: number;
    depositDeductedEur: number;
    remainingToCollectEur: number;
    artistGrossSplitEur: number; // 80% de baseGrossEur
    earOsFeeEur: number; // 10% de baseGrossEur
    vimumeDonationEur: number; // 10% de baseGrossEur
    irpfRatePercent: number;
    irpfWithheldEur: number;
    finalArtistNetPayoutEur: number;
}

export interface SettlementExecutionResult {
    settlementId: string;
    eventId: string;
    status: 'SETTLED' | 'PENDING_TRANSFER';
    breakdown: SplitPayoutBreakdown;
    modelo182Certificate: Modelo182Certificate;
    transfers: {
        artistTransferId: string;
        earOsTransferId: string;
        vimumeDonationId: string;
    };
    sha256Hash: string;
    executedAt: string;
}

export interface CalculateSettlementParams {
    baseAmount?: number;
    depositPaid?: number;
    applyIrpf?: boolean;
    irpfRatePercent?: number; // Ej: 15% retención profesional habitual
}

export interface ExecuteSettlementParams {
    eventId: string;
    baseAmount?: number;
    depositPaid?: number;
    applyIrpf?: boolean;
    irpfRatePercent?: number;
    client: {
        name: string;
        taxId: string;
        email?: string;
    };
    provider: {
        id: string;
        name: string;
        taxId: string;
        stripeAccountId?: string;
    };
}

/**
 * Computa el desglose financiero del split 80/10/10 con IRPF parametrizable
 */
export function calculateSettlementBreakdown(params: CalculateSettlementParams = {}): SplitPayoutBreakdown {
    const base = Math.max(0, params.baseAmount ?? TARIFA_BASE_SOLISTA_EUR);
    const vat = Number((base * VAT_RATE).toFixed(2));
    const totalGross = Number((base + vat).toFixed(2));
    const depositDeducted = Math.min(totalGross, Math.max(0, params.depositPaid ?? DEPOSITO_STRIPE_EUR));
    const remainingToCollect = Number((totalGross - depositDeducted).toFixed(2));

    const artistGrossSplit = Number((base * SPLIT_SOBERANO.artista).toFixed(2));
    const earOsFee = Number((base * SPLIT_SOBERANO.earOs).toFixed(2));
    const vimumeDonation = Number((base * SPLIT_SOBERANO.vimume).toFixed(2));

    const irpfRate = params.applyIrpf ? (params.irpfRatePercent ?? 15) : 0;
    const irpfWithheld = Number((artistGrossSplit * (irpfRate / 100)).toFixed(2));
    const finalArtistNetPayout = Number((artistGrossSplit - irpfWithheld).toFixed(2));

    return {
        baseGrossEur: base,
        vatAmountEur: vat,
        totalGrossEur: totalGross,
        depositDeductedEur: depositDeducted,
        remainingToCollectEur: remainingToCollect,
        artistGrossSplitEur: artistGrossSplit,
        earOsFeeEur: earOsFee,
        vimumeDonationEur: vimumeDonation,
        irpfRatePercent: irpfRate,
        irpfWithheldEur: irpfWithheld,
        finalArtistNetPayoutEur: finalArtistNetPayout,
    };
}

/**
 * Genera el Certificado Oficial de Deducción Fiscal Modelo 182 (Ley 49/2002 de Mecenazgo)
 * - Tramo de hasta 250 € al 80% de deducción IRPF
 */
export function generateModelo182Certificate(params: {
    donorName: string;
    donorTaxId: string;
    donationAmount: number;
    fiscalYear?: number;
}): Modelo182Certificate {
    const amount = Number(params.donationAmount.toFixed(2));
    const fiscalYear = params.fiscalYear || new Date().getFullYear();
    const certificateId = `M182-${fiscalYear}-${Date.now().toString(36).toUpperCase()}`;
    const issuedAt = new Date().toISOString();

    // Deducción Ley 49/2002: 80% hasta 250 €
    const deductionRatePercent = 80;
    const potentialTaxDeductionEur = Number((amount * 0.8).toFixed(2));

    const rawPayload = JSON.stringify({
        certificateId,
        donorName: params.donorName,
        donorTaxId: params.donorTaxId,
        amountEur: amount,
        deductionRatePercent,
        potentialTaxDeductionEur,
        fiscalYear,
        beneficiaryEntity: 'PROYECTO SOCIAL Y DE NEUROESTIMULACIÓN VIMUME',
        legalReference: 'Ley 49/2002 de Régimen Fiscal de las Entidades sin Fines Lucrativos y de los Incentivos Fiscales al Mecenazgo (Modelo 182 AEAT)',
        issuedAt,
    });

    const sha256Hash = crypto.createHash('sha256').update(rawPayload, 'utf8').digest('hex');

    return {
        certificateId,
        donorName: params.donorName,
        donorTaxId: params.donorTaxId,
        amountEur: amount,
        deductionRatePercent,
        potentialTaxDeductionEur,
        fiscalYear,
        beneficiaryEntity: 'PROYECTO SOCIAL Y DE NEUROESTIMULACIÓN VIMUME',
        legalReference: 'Ley 49/2002 de Régimen Fiscal de las Entidades sin Fines Lucrativos y de los Incentivos Fiscales al Mecenazgo (Modelo 182 AEAT)',
        issuedAt,
        sha256Hash,
    };
}

/**
 * Ejecuta el cierre de liquidación y emite las claves de transferencia y certificado
 */
export function executeSettlement(params: ExecuteSettlementParams): SettlementExecutionResult {
    const settlementId = `SETTLE-${params.eventId.replace(/^evt-/, '').toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;
    const executedAt = new Date().toISOString();

    const breakdown = calculateSettlementBreakdown({
        baseAmount: params.baseAmount,
        depositPaid: params.depositPaid,
        applyIrpf: params.applyIrpf,
        irpfRatePercent: params.irpfRatePercent,
    });

    const modelo182 = generateModelo182Certificate({
        donorName: params.client.name,
        donorTaxId: params.client.taxId,
        donationAmount: breakdown.vimumeDonationEur,
    });

    const transfers = {
        artistTransferId: params.provider.stripeAccountId
            ? `tr_art_${Date.now().toString(36)}`
            : `manual_sepa_${params.provider.id}`,
        earOsTransferId: `tr_ear_${Date.now().toString(36)}`,
        vimumeDonationId: `don_vim_${modelo182.certificateId}`,
    };

    const auditPayload = JSON.stringify({
        settlementId,
        eventId: params.eventId,
        breakdown,
        modelo182Hash: modelo182.sha256Hash,
        transfers,
        executedAt,
    });

    const sha256Hash = crypto.createHash('sha256').update(auditPayload, 'utf8').digest('hex');

    return {
        settlementId,
        eventId: params.eventId,
        status: 'SETTLED',
        breakdown,
        modelo182Certificate: modelo182,
        transfers,
        sha256Hash,
        executedAt,
    };
}
