/**
 * ════════════════════════════════════════════════════════════════════════════
 * EAR OS — MOTOR DE CONTRATOS INTELIGENTES (SMART CONTRACT ENGINE)
 * ════════════════════════════════════════════════════════════════════════════
 * Generador canónico de contratos de prestación de servicios artísticos
 * amparados bajo el Art. 1255 del Código Civil español y la Ley 37/2003 del Ruido.
 *
 * Integra:
 *  - Deducción íntegra de fianza (DEPOSITO_STRIPE_EUR = 100,00 €).
 *  - Split Soberano inmutable: 80% Artista / 10% EAR OS / 10% VIMUME.
 *  - Rider Acústico telecalibrado (12 W/pax, < 75 dB SPL salud pública).
 *  - Sellado Criptográfico SHA-256 de inmutabilidad.
 * ════════════════════════════════════════════════════════════════════════════
 */

import crypto from 'node:crypto';
import {
    DEPOSITO_STRIPE_EUR,
    SPLIT_SOBERANO,
    VAT_RATE,
    WATTS_PER_PAX,
    LIMITE_SPL_DB,
    CENTRALITA_EAR_OS,
    TARIFA_BASE_SOLISTA_EUR,
} from '@/lib/constants/ear-os-ssot';

export type ContractPartyRole = 'CLIENT' | 'PROVIDER' | 'PRODUCER';

export interface SmartContractParty {
    name: string;
    taxId: string; // NIF / CIF
    role: ContractPartyRole;
    email: string;
    phone: string;
    address: string;
}

export interface ContractFinancialSplit {
    artistNet: number;
    earOsNet: number;
    vimumeNet: number;
}

export interface ContractFinancials {
    baseAmount: number;
    vatRate: number;
    vatAmount: number;
    totalAmount: number;
    depositDeducted: number;
    remainingToPay: number;
    split: ContractFinancialSplit;
}

export interface AcousticRiderClause {
    maxSplDb: number;
    wattsPerPax: number;
    estimatedPax: number;
    totalPowerWatts: number;
    limiterHomologated: boolean;
    legalReference: string;
}

export interface ContractEventDetails {
    date: string; // YYYY-MM-DD
    startTime: string; // HH:mm
    durationHours: number;
    location: string;
    city: string;
    province?: string;
    venueName?: string;
    estimatedPax: number;
}

export type ContractStatus = 'DRAFT' | 'ACCEPTED_BY_PROVIDER' | 'SIGNED' | 'SETTLED';

export interface SmartContractDocument {
    contractId: string;
    requestId: string;
    status: ContractStatus;
    createdAt: string;
    legalFramework: string;
    parties: {
        client: SmartContractParty;
        provider: SmartContractParty;
        producer: SmartContractParty;
    };
    eventDetails: ContractEventDetails;
    financials: ContractFinancials;
    acousticRider: AcousticRiderClause;
    clauses: readonly string[];
    sha256Hash: string;
}

export interface GenerateContractParams {
    requestId: string;
    client: {
        name: string;
        taxId?: string;
        email: string;
        phone: string;
        address?: string;
    };
    provider: {
        id: string;
        name: string;
        taxId?: string;
        email: string;
        phone: string;
        address?: string;
        stageName?: string;
    };
    eventDetails: {
        date: string;
        startTime?: string;
        durationHours?: number;
        location: string;
        city: string;
        province?: string;
        venueName?: string;
        estimatedPax?: number;
    };
    baseAmount?: number;
    depositPaid?: number;
}

/** Productora EAR como entidad administradora y garante de la plataforma */
export const DEFAULT_PRODUCER_PARTY: SmartContractParty = Object.freeze({
    name: 'PRODUCTORA EAR S.L. & PLATAFORMA SOBERANA EAR OS',
    taxId: 'B-88990011',
    role: 'PRODUCER',
    email: 'administracion@productoraear.com',
    phone: CENTRALITA_EAR_OS,
    address: 'Hub Operativo Méntrida, Toledo, España',
});

/**
 * Computa el desglose financiero exacto de acuerdo con el SSOT:
 * - IVA aplicable: 21% sobre base imponible
 * - Total con IVA = Base + IVA
 * - Fianza ya depositada (100 €) se deduce al 100%
 * - Split Soberano: computado sobre la base imponible neta
 */
export function calculateContractFinancials(
    baseAmount: number = TARIFA_BASE_SOLISTA_EUR,
    depositPaid: number = DEPOSITO_STRIPE_EUR
): ContractFinancials {
    const safeBase = Math.max(0, baseAmount);
    const vatAmount = Number((safeBase * VAT_RATE).toFixed(2));
    const totalAmount = Number((safeBase + vatAmount).toFixed(2));
    const safeDeposit = Math.min(totalAmount, Math.max(0, depositPaid));
    const remainingToPay = Number((totalAmount - safeDeposit).toFixed(2));

    const artistNet = Number((safeBase * SPLIT_SOBERANO.artista).toFixed(2));
    const earOsNet = Number((safeBase * SPLIT_SOBERANO.earOs).toFixed(2));
    const vimumeNet = Number((safeBase * SPLIT_SOBERANO.vimume).toFixed(2));

    return {
        baseAmount: safeBase,
        vatRate: VAT_RATE,
        vatAmount,
        totalAmount,
        depositDeducted: safeDeposit,
        remainingToPay,
        split: {
            artistNet,
            earOsNet,
            vimumeNet,
        },
    };
}

/**
 * Computa la cláusula técnica de rider acústico bajo normativa española
 */
export function calculateAcousticRider(estimatedPax: number = 100): AcousticRiderClause {
    const pax = Math.max(1, estimatedPax);
    const totalPowerWatts = pax * WATTS_PER_PAX;

    return {
        maxSplDb: LIMITE_SPL_DB,
        wattsPerPax: WATTS_PER_PAX,
        estimatedPax: pax,
        totalPowerWatts,
        limiterHomologated: true,
        legalReference: 'Ley 37/2003 del Ruido y Real Decreto 1367/2007 (Evaluación y Gestión del Ruido Ambiental)',
    };
}

/**
 * Genera el articulado legal del contrato inteligente
 */
export function generateContractClauses(financials: ContractFinancials, acoustic: AcousticRiderClause): readonly string[] {
    return Object.freeze([
        'PRIMERA (OBJETO Y MARCO LEGAL). El presente contrato se rige por el Art. 1255 del Código Civil español (autonomía de la voluntad contractual), formalizando la prestación de servicios artísticos y técnicos en la fecha y condiciones estipuladas.',
        `SEGUNDA (HONORARIOS Y LIQUIDACIÓN). El importe acordado asciende a ${financials.baseAmount.toFixed(2)} € más IVA (${financials.vatAmount.toFixed(2)} €), totalizando ${financials.totalAmount.toFixed(2)} €. El depósito de reserva de ${financials.depositDeducted.toFixed(2)} € abonado mediante Stripe Price-Lock es 100% deducible, quedando un saldo pendiente de ${financials.remainingToPay.toFixed(2)} € a liquidar en el evento.`,
        `TERCERA (DISTRIBUCIÓN SOBERANA 80/10/10). De la base neta de ${financials.baseAmount.toFixed(2)} €, el 80% (${financials.split.artistNet.toFixed(2)} €) corresponde a la retribución soberana del artista ejecutor; el 10% (${financials.split.earOsNet.toFixed(2)} €) cubre la infraestructura tecnológica y soporte de EAR OS; y el 10% (${financials.split.vimumeNet.toFixed(2)} €) se asigna como contribución social y sanitaria al proyecto VIMUME para neuro-estimulación con cadencia 40 Hz Gamma en mayores (deducción fiscal conforme a Ley 49/2002 de Mecenazgo).`,
        `CUARTA (RIDER ACÚSTICO Y SALUD PÚBLICA). De acuerdo con la Ley 37/2003 del Ruido, la emisión sonora no superará ${acoustic.maxSplDb} dBA SPL en límites perimetrales. El dimensionamiento acústico se calibra a razón de ${acoustic.wattsPerPax} W por asistente (total ${acoustic.totalPowerWatts} W para un aforo previsto de ${acoustic.estimatedPax} pax), garantizando una acústica de gala sin agresión coclear ni sanciones administrativas.`,
        'QUINTA (INMUTABILIDAD CRIPTOGRÁFICA). El presente documento se formaliza con sello criptográfico digital SHA-256. Cualquier alteración de sus términos invalida automáticamente el token de ejecución y la póliza de cobertura de la plataforma EAR OS.',
    ]);
}

/**
 * Calcula el hash SHA-256 canónico del contrato
 */
export function computeContractSha256(contractData: Omit<SmartContractDocument, 'sha256Hash'>): string {
    const canonicalPayload = JSON.stringify({
        contractId: contractData.contractId,
        requestId: contractData.requestId,
        status: contractData.status,
        createdAt: contractData.createdAt,
        parties: contractData.parties,
        eventDetails: contractData.eventDetails,
        financials: contractData.financials,
        acousticRider: contractData.acousticRider,
        clauses: contractData.clauses,
    });
    return crypto.createHash('sha256').update(canonicalPayload, 'utf8').digest('hex');
}

/**
 * Genera el documento completo de Smart Contract
 */
export function generateSmartContract(params: GenerateContractParams): SmartContractDocument {
    const contractId = `CTR-${params.requestId.replace(/^req-/, '').toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;
    const createdAt = new Date().toISOString();

    const clientParty: SmartContractParty = {
        name: params.client.name,
        taxId: params.client.taxId || 'PENDIENTE_NIF',
        role: 'CLIENT',
        email: params.client.email,
        phone: params.client.phone,
        address: params.client.address || 'Domicilio no especificado',
    };

    const providerParty: SmartContractParty = {
        name: params.provider.stageName || params.provider.name,
        taxId: params.provider.taxId || 'PENDIENTE_CIF',
        role: 'PROVIDER',
        email: params.provider.email,
        phone: params.provider.phone,
        address: params.provider.address || 'Sede del Proveedor',
    };

    const eventDetails: ContractEventDetails = {
        date: params.eventDetails.date,
        startTime: params.eventDetails.startTime || '20:00',
        durationHours: params.eventDetails.durationHours || 2,
        location: params.eventDetails.location,
        city: params.eventDetails.city,
        province: params.eventDetails.province || 'Toledo',
        venueName: params.eventDetails.venueName || 'Ubicación privada',
        estimatedPax: params.eventDetails.estimatedPax || 100,
    };

    const financials = calculateContractFinancials(
        params.baseAmount ?? TARIFA_BASE_SOLISTA_EUR,
        params.depositPaid ?? DEPOSITO_STRIPE_EUR
    );

    const acousticRider = calculateAcousticRider(eventDetails.estimatedPax);
    const clauses = generateContractClauses(financials, acousticRider);

    const partialDoc: Omit<SmartContractDocument, 'sha256Hash'> = {
        contractId,
        requestId: params.requestId,
        status: 'ACCEPTED_BY_PROVIDER',
        createdAt,
        legalFramework: 'Art. 1255 Código Civil / Ley 37/2003 del Ruido / Ley 49/2002 de Mecenazgo',
        parties: {
            client: clientParty,
            provider: providerParty,
            producer: DEFAULT_PRODUCER_PARTY,
        },
        eventDetails,
        financials,
        acousticRider,
        clauses,
    };

    const sha256Hash = computeContractSha256(partialDoc);

    return {
        ...partialDoc,
        sha256Hash,
    };
}
