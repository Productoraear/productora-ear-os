/**
 * 📦 PROVIDER SERVICE MATCHER — MOTOR BILATERAL 100 DIMENSIONES (Pareja ↔ Proveedor B2B/B2G)
 * Bloque B1.02. Catering, Foto/Vídeo, Buses, Estructuras, Sonido.
 * Score Bilateral = (coupleScore × 0.5) + (providerServiceScore × 0.5)
 */
import {
    PROVIDER_SERVICE_CALIBRATION_DIMENSIONS,
    SERVICE_COUPLE_TO_PROVIDER_PAIRS,
    getProviderServiceDimensionById,
    type ProviderServiceCalibration,
    type ProviderServiceMatchResult
} from './providerServiceCalibratorTypes';
import type {
    CalibrationDimension,
    CoupleCalibration,
    DimensionType,
    DimensionValue
} from './calibratorTypes';

const clampScore = (n: number, lo = 0, hi = 100): number =>
    Math.max(lo, Math.min(hi, Math.round(n)));

function isBlankDimensionValue(v: DimensionValue): boolean {
    return v === undefined || v === null || v === '';
}

const NEUTRAL_SELECT_VALUES = new Set<string>([
    'Indiferente'
]);

function isNeutralSelectValue(v: DimensionValue): boolean {
    return typeof v === 'string' && NEUTRAL_SELECT_VALUES.has(v);
}

function matchDimensionValues(
    coupleValue: DimensionValue,
    providerValue: DimensionValue,
    type: DimensionType,
    dimension: Pick<CalibrationDimension, 'min' | 'max'>
): number {
    if (isBlankDimensionValue(coupleValue)) return 100;
    if (isNeutralSelectValue(coupleValue)) return 100;
    if (isBlankDimensionValue(providerValue)) return 50;

    switch (type) {
        case 'toggle': {
            if (coupleValue === true) return providerValue === true ? 100 : 0;
            return 100;
        }
        case 'select': {
            if (String(coupleValue) === String(providerValue)) return 100;
            return 30;
        }
        case 'multi-select': {
            const c = Array.isArray(coupleValue) ? coupleValue.map(String) : [];
            const p = Array.isArray(providerValue) ? providerValue.map(String) : [];
            if (c.length === 0) return 100;
            if (p.length === 0) return 20;
            const overlap = c.filter((x) => p.includes(x)).length;
            if (overlap === 0) return 10;
            return clampScore((overlap / Math.min(c.length, 3)) * 100);
        }
        case 'scale': {
            const c = Number(coupleValue);
            const p = Number(providerValue);
            if (!Number.isFinite(c) || !Number.isFinite(p)) return 50;
            const min = dimension.min ?? 1;
            const max = dimension.max ?? 5;
            return clampScore(100 - (Math.abs(c - p) / Math.max(max - min, 1)) * 100);
        }
        case 'slider': {
            const c = Number(coupleValue);
            const p = Number(providerValue);
            if (!Number.isFinite(c) || !Number.isFinite(p)) return 50;
            const min = dimension.min ?? 0;
            const max = dimension.max ?? 100;
            return clampScore(100 - (Math.abs(c - p) / Math.max(max - min, 1)) * 100);
        }
        default:
            return 50;
    }
}

export interface ProviderServiceMatchInput {
    coupleCalibration: CoupleCalibration;
    providerServiceCalibration: ProviderServiceCalibration;
}

export function calculateProviderServiceMatch(
    input: ProviderServiceMatchInput
): ProviderServiceMatchResult {
    const { coupleCalibration, providerServiceCalibration } = input;

    const breakdown: ProviderServiceMatchResult['dimensionBreakdown'] = [];
    const coupleStrengths: string[] = [];
    const providerStrengths: string[] = [];
    const warnings: string[] = [];
    const knockouts: string[] = [];

    const coupleDims = PROVIDER_SERVICE_CALIBRATION_DIMENSIONS.filter((d) => d.side === 'couple');
    let coupleWeightedSum = 0;
    let coupleTotalWeight = 0;

    for (const cDim of coupleDims) {
        const coupleValue = coupleCalibration.dimensions[cDim.id];
        const providerId = SERVICE_COUPLE_TO_PROVIDER_PAIRS[cDim.id];
        const providerDim = providerId != null ? getProviderServiceDimensionById(providerId) : undefined;
        const providerValue =
            providerId != null ? providerServiceCalibration.dimensions[providerId] ?? undefined : undefined;

        if (isBlankDimensionValue(coupleValue)) {
            breakdown.push({
                dimensionId: cDim.id,
                label: cDim.label,
                coupleValue: null,
                providerValue: providerValue ?? null,
                matchPercent: 100,
                isKnockout: cDim.isKnockout,
                passed: true
            });
            continue;
        }

        const matchPercent = matchDimensionValues(coupleValue, providerValue, cDim.type, cDim);
        const passed = matchPercent >= 100;

        if (cDim.isKnockout && matchPercent < 100) {
            knockouts.push(cDim.label);
            warnings.push(`${cDim.label}: requisito no cubierto por el proveedor`);
        } else if (providerDim && matchPercent >= 80) {
            coupleStrengths.push(cDim.label);
        } else if (providerDim && matchPercent < 50) {
            warnings.push(`${cDim.label}: afinidad baja (${matchPercent}%)`);
        }

        breakdown.push({
            dimensionId: cDim.id,
            label: cDim.label,
            coupleValue,
            providerValue: providerValue ?? null,
            matchPercent,
            isKnockout: cDim.isKnockout,
            passed
        });

        coupleWeightedSum += matchPercent * cDim.weight;
        coupleTotalWeight += cDim.weight;
    }

    const coupleScore =
        coupleTotalWeight > 0 ? clampScore(coupleWeightedSum / coupleTotalWeight) : 50;

    /* ── Lado proveedor: compuertas de negocio ── */
    let providerScore = 100;

    const dim = (id: number): DimensionValue => providerServiceCalibration.dimensions[id];
    const num = (id: number, fallback: number): number => {
        const v = dim(id);
        if (typeof v === 'number' && Number.isFinite(v)) return v;
        const n = Number(v);
        return Number.isFinite(n) ? n : fallback;
    };
    const bool = (id: number): boolean => dim(id) === true;

    const penalize = (amount: number, reason: string, isKnockout = false) => {
        providerScore = Math.max(0, providerScore - amount);
        warnings.push(reason);
        if (isKnockout) knockouts.push(reason);
    };

    const coupleGuestCount = Number(coupleCalibration.dimensions[2] ?? 0);
    const aforoMin = num(52, 0);
    const aforoMax = num(53, 999999);

    if (aforoMax > 0 && coupleGuestCount > aforoMax) {
        penalize(100, `Aforo máximo del proveedor (${aforoMax}) inferior a los invitados (${coupleGuestCount})`, true);
    } else if (aforoMin > 0 && coupleGuestCount < aforoMin) {
        penalize(35, `La pareja (${coupleGuestCount} pax) no alcanza el aforo mínimo (${aforoMin})`);
    } else if (coupleGuestCount > 0) {
        providerStrengths.push(`Aforo válido: ${coupleGuestCount} pax en rango ${aforoMin}-${aforoMax}`);
    }

    const ticketMin = num(61, 0);
    const coupleBudget = Number(coupleCalibration.dimensions[11] ?? 0);

    if (ticketMin > 0 && coupleBudget < ticketMin) {
        penalize(100, `Presupuesto de la pareja (${coupleBudget} €) inferior al ticket mínimo del proveedor (${ticketMin} €)`, true);
    }

    if (bool(63) && !bool(13)) {
        penalize(100, 'El proveedor exige Price-Lock 100 € Stripe y la pareja no lo acepta', true);
    }

    providerScore = clampScore(providerScore);

    /* ── Fusión bilateral ── */
    const bilateralRaw = clampScore(coupleScore * 0.5 + providerScore * 0.5);
    const bilateralScore = knockouts.length > 0 ? 0 : bilateralRaw;

    let affinityTier: ProviderServiceMatchResult['affinityTier'] = 'POTENTIAL_FIT';
    if (bilateralScore >= 85) affinityTier = 'EXACT_MATCH';
    else if (bilateralScore >= 65) affinityTier = 'HIGH_COMPATIBILITY';
    else if (bilateralScore >= 50) affinityTier = 'POTENTIAL_FIT';
    else affinityTier = 'DISMISSED';

    return {
        coupleScore,
        providerServiceScore: providerScore,
        bilateralScore,
        affinityTier,
        coupleStrengths,
        providerStrengths,
        warnings,
        knockouts,
        estimatedTotalEur: Math.round(coupleBudget),
        dimensionBreakdown: breakdown
    };
}