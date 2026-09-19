/**
 * 🎸 ARTIST MATCHER — MOTOR BILATERAL 100 DIMENSIONES (Pareja ↔ Artista)
 * Bloque B1.02. Misma matemática que neuralFincaMatcher (knockouts + weights).
 * Score Bilateral = (coupleScore × 0.5) + (artistScore × 0.5)
 */
import {
    ARTIST_CALIBRATION_DIMENSIONS,
    ARTIST_COUPLE_TO_PROVIDER_PAIRS,
    getArtistDimensionById,
    type ArtistCalibration,
    type ArtistMatchResult
} from './artistCalibratorTypes';
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
    'Indiferente',
    'No necesario',
    'No necesaria',
    'Sin límite'
]);

function isNeutralSelectValue(v: DimensionValue): boolean {
    return typeof v === 'string' && NEUTRAL_SELECT_VALUES.has(v);
}

function matchDimensionValues(
    coupleValue: DimensionValue,
    artistValue: DimensionValue,
    type: DimensionType,
    dimension: Pick<CalibrationDimension, 'min' | 'max'>
): number {
    if (isBlankDimensionValue(coupleValue)) return 100;
    if (isNeutralSelectValue(coupleValue)) return 100;
    if (isBlankDimensionValue(artistValue)) return 50;

    switch (type) {
        case 'toggle': {
            if (coupleValue === true) return artistValue === true ? 100 : 0;
            return 100;
        }
        case 'select': {
            if (String(coupleValue) === String(artistValue)) return 100;
            return 30;
        }
        case 'multi-select': {
            const c = Array.isArray(coupleValue) ? coupleValue.map(String) : [];
            const p = Array.isArray(artistValue) ? artistValue.map(String) : [];
            if (c.length === 0) return 100;
            if (p.length === 0) return 20;
            const overlap = c.filter((x) => p.includes(x)).length;
            if (overlap === 0) return 10;
            return clampScore((overlap / Math.min(c.length, 3)) * 100);
        }
        case 'scale': {
            const c = Number(coupleValue);
            const p = Number(artistValue);
            if (!Number.isFinite(c) || !Number.isFinite(p)) return 50;
            const min = dimension.min ?? 1;
            const max = dimension.max ?? 5;
            return clampScore(100 - (Math.abs(c - p) / Math.max(max - min, 1)) * 100);
        }
        case 'slider': {
            const c = Number(coupleValue);
            const p = Number(artistValue);
            if (!Number.isFinite(c) || !Number.isFinite(p)) return 50;
            const min = dimension.min ?? 0;
            const max = dimension.max ?? 100;
            return clampScore(100 - (Math.abs(c - p) / Math.max(max - min, 1)) * 100);
        }
        default:
            return 50;
    }
}

export interface ArtistMatchInput {
    coupleCalibration: CoupleCalibration;
    artistCalibration: ArtistCalibration;
}

export function calculateArtistMatch(input: ArtistMatchInput): ArtistMatchResult {
    const { coupleCalibration, artistCalibration } = input;

    const breakdown: ArtistMatchResult['dimensionBreakdown'] = [];
    const coupleStrengths: string[] = [];
    const artistStrengths: string[] = [];
    const warnings: string[] = [];
    const knockouts: string[] = [];

    const coupleDims = ARTIST_CALIBRATION_DIMENSIONS.filter((d) => d.side === 'couple');
    let coupleWeightedSum = 0;
    let coupleTotalWeight = 0;

    for (const cDim of coupleDims) {
        const coupleValue = coupleCalibration.dimensions[cDim.id];
        const artistId = ARTIST_COUPLE_TO_PROVIDER_PAIRS[cDim.id];
        const artistDim = artistId != null ? getArtistDimensionById(artistId) : undefined;
        const artistValue =
            artistId != null ? artistCalibration.dimensions[artistId] ?? undefined : undefined;

        if (isBlankDimensionValue(coupleValue)) {
            breakdown.push({
                dimensionId: cDim.id,
                label: cDim.label,
                coupleValue: null,
                artistValue: artistValue ?? null,
                matchPercent: 100,
                isKnockout: cDim.isKnockout,
                passed: true
            });
            continue;
        }

        const matchPercent = matchDimensionValues(coupleValue, artistValue, cDim.type, cDim);
        const passed = matchPercent >= 100;

        if (cDim.isKnockout && matchPercent < 100) {
            knockouts.push(cDim.label);
            warnings.push(`${cDim.label}: requisito no cubierto por el artista`);
        } else if (artistDim && matchPercent >= 80) {
            coupleStrengths.push(cDim.label);
        } else if (artistDim && matchPercent < 50) {
            warnings.push(`${cDim.label}: afinidad baja (${matchPercent}%)`);
        }

        breakdown.push({
            dimensionId: cDim.id,
            label: cDim.label,
            coupleValue,
            artistValue: artistValue ?? null,
            matchPercent,
            isKnockout: cDim.isKnockout,
            passed
        });

        coupleWeightedSum += matchPercent * cDim.weight;
        coupleTotalWeight += cDim.weight;
    }

    const coupleScore =
        coupleTotalWeight > 0 ? clampScore(coupleWeightedSum / coupleTotalWeight) : 50;

    /* ── Lado artista: compuertas de negocio ── */
    let artistScore = 100;

    const dim = (id: number): DimensionValue => artistCalibration.dimensions[id];
    const num = (id: number, fallback: number): number => {
        const v = dim(id);
        if (typeof v === 'number' && Number.isFinite(v)) return v;
        const n = Number(v);
        return Number.isFinite(n) ? n : fallback;
    };
    const bool = (id: number): boolean => dim(id) === true;

    const penalize = (amount: number, reason: string, isKnockout = false) => {
        artistScore = Math.max(0, artistScore - amount);
        warnings.push(reason);
        if (isKnockout) knockouts.push(reason);
    };

    const cacheBase = num(71, 350);
    const coupleBudget = Number(coupleCalibration.dimensions[21] ?? 0);

    if (coupleBudget > 0 && cacheBase > coupleBudget * 1.2) {
        penalize(35, `Caché del artista (${cacheBase} €) muy por encima del presupuesto de música (${coupleBudget} €)`);
    } else if (coupleBudget > 0 && cacheBase <= coupleBudget) {
        artistStrengths.push(`Caché (${cacheBase} €) dentro del presupuesto de música (${coupleBudget} €)`);
    }

    // Price-Lock 100 € Stripe (artista 75, pareja 28)
    if (bool(75) && !bool(28)) {
        penalize(100, 'El artista exige Price-Lock 100 € Stripe y la pareja no lo acepta', true);
    }

    // Cumplimiento acústico <75 dBA (artista 85, pareja 35)
    if (bool(85) && !bool(35)) {
        penalize(100, 'El artista exige cumplimiento acústico <75 dBA y la pareja no lo acepta', true);
    }

    artistScore = clampScore(artistScore);

    /* ── Fusión bilateral ── */
    const bilateralRaw = clampScore(coupleScore * 0.5 + artistScore * 0.5);
    const bilateralScore = knockouts.length > 0 ? 0 : bilateralRaw;

    let affinityTier: ArtistMatchResult['affinityTier'] = 'POTENTIAL_FIT';
    if (bilateralScore >= 85) affinityTier = 'EXACT_MATCH';
    else if (bilateralScore >= 65) affinityTier = 'HIGH_COMPATIBILITY';
    else if (bilateralScore >= 50) affinityTier = 'POTENTIAL_FIT';
    else affinityTier = 'DISMISSED';

    return {
        coupleScore,
        artistScore,
        bilateralScore,
        affinityTier,
        coupleStrengths,
        artistStrengths,
        warnings,
        knockouts,
        estimatedTotalEur: Math.round(cacheBase),
        dimensionBreakdown: breakdown
    };
}