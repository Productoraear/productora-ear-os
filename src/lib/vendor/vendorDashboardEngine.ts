/**
 * ⚡ VENDOR DASHBOARD ENGINE — EAR OS S-CLASS (SSOT)
 * Leyes inmutables derivadas de PHASE_1..4_SSOT (Aprobado por CEO — Octubre 2026).
 *
 * Motor financiero y logístico puro, determinista y estrictamente tipado.
 * Cero "any". Cero fachadas: todo cálculo emana de las leyes PHASE_X_SSOT.
 */

export type Currency = 'EUR' | 'USD' | 'GBP';

export type SeasonDemand = 'LOW' | 'MEDIUM' | 'HIGH' | 'PEAK';

export type EventKind =
    | 'SOLISTA'
    | 'BODA'
    | 'MARIACHI'
    | 'CORPORATIVO'
    | 'FESTEJO_PLAZA';

/** PHASE 1 §1 — Yield Management: multiplicadores automáticos controlados por EAR OS. */
export const YIELD_MULTIPLIERS: Record<SeasonDemand, number> = {
    LOW: 1.0,
    MEDIUM: 1.1,
    HIGH: 1.2,
    PEAK: 1.3
} as const;

/** PHASE 1 §1 — Soporte nativo multidivisa, prioridad Euros. Tipos de referencia fijos. */
export const FX_TO_EUR: Record<Exclude<Currency, 'EUR'>, number> = {
    USD: 0.92,
    GBP: 1.17
} as const;

/** PHASE 1 §2 — Comisión inmutable de EAR OS. */
export const EAR_COMMISSION_PCT = 0.2;

/** PHASE 1 §2 — Afiliados (Fincas B2B): 5% extraído del 20% de EAR OS. */
export const AFFILIATE_REFERRAL_PCT = 0.05;

/** PHASE 1 §1 — Price-Lock dinámico: porcentaje del presupuesto (ya no fijo 100€). */
export const DEFAULT_DEPOSIT_PCT = 0.2;

/** PHASE 2 §3 — Complejidad del evento: bodas +25% base. */
export const WEDDING_COMPLEXITY_SURCHARGE_PCT = 0.25;

/** PHASE 2 §3 — Dietas: +30€/pax si duración >4h o distancia >100km. */
export const MEAL_FEE_PER_PAX_EUR = 30;
export const MEAL_MIN_DURATION_HOURS = 4;
export const MEAL_MIN_DISTANCE_KM = 100;

/** SSOT histórico EAR OS — Hotel +120€ si fin >= 3:00 AM o distancia > 200 km. */
export const LATE_FINISH_HOTEL_FEE_EUR = 120;
export const LATE_FINISH_HOUR = 3;
export const LONG_HAUL_KM = 200;

/** PHASE 1 §4 — Grace Period: 1 hora desde el pago para cancelación gratuita. */
export const CLIENT_GRACE_PERIOD_HOURS = 1;

export interface VendorQuoteInput {
    /** Caché base del proveedor antes de yield y recargos (EUR). */
    baseCache: number;
    eventKind: EventKind;
    season: SeasonDemand;
    distanceKm: number;
    /** PHASE 2 §2 — Tarifa configurable por proveedor (€/km, según vehículo). */
    ratePerKm: number;
    /** PHASE 2 §2 — Km gratuitos antes de empezar a facturar distancia. */
    freeKmThreshold: number;
    endTimeHour: number;
    attendees: number;
    durationHours: number;
    currency: Currency;
    /** PHASE 2 §3 — ¿Aplica recargo base de boda +25%? */
    includeWeddingSurcharge: boolean;
    /** PHASE 2 §3 — ¿Aplica dietas +30€/pax? (se autovalida por duración o distancia) */
    includeMeals: boolean;
    /** PHASE 1 §2 — ¿Hubo finca afiliada que refirió? (5% del 20% va a la finca) */
    hasAffiliateReferral: boolean;
    /** PHASE 1 §1 — Override manual de logística (permitido 1er año). */
    manualLogisticsOverride?: boolean;
    manualLogisticsFee?: number;
}

export interface VendorQuoteBreakdown {
    cacheBase: number;
    /** Caché tras Yield Management (PHASE 1 §1). */
    yieldMultiplier: number;
    yieldAdjustedCache: number;
    /** Recargo por complejidad de boda (PHASE 2 §3, +25%). */
    weddingSurcharge: number;
    /** Dietas +30€/pax (PHASE 2 §3). */
    mealsFee: number;
    /** Logística: distancia * tarifa configurada + hotel (PHASE 2 §2). */
    logisticsFee: number;
    hotelFee: number;
    /** Subtotal del servicio antes de comisión. */
    subtotal: number;
    /** Price-Lock dinámico (PHASE 1 §1). */
    depositPct: number;
    depositAmount: number;
    /** Comisión inmutable EAR OS (PHASE 1 §2). */
    earCommissionPct: number;
    earCommissionAmount: number;
    /** Fracción de comisión cedida a finca afiliada (PHASE 1 §2). */
    affiliatePct: number;
    affiliateAmount: number;
    earNetCommission: number;
    /** Liquidación neta del proveedor (80%). */
    providerNetPayout: number;
    currency: Currency;
}

function round2(value: number): number {
    return Math.round((value + Number.EPSILON) * 100) / 100;
}

function toEur(amount: number, currency: Currency): number {
    if (currency === 'EUR') return amount;
    return amount * FX_TO_EUR[currency];
}

/**
 * Calcula el presupuesto S-Class de un proveedor según las leyes PHASE_X_SSOT.
 * Todas las magnitudes de entrada en la divisa elegida se normalizan a EUR.
 */
export function calculateVendorQuote(input: VendorQuoteInput): VendorQuoteBreakdown {
    const cacheBaseEur = toEur(input.baseCache, input.currency);

    // PHASE 1 §1 — Yield Management
    const yieldMultiplier = YIELD_MULTIPLIERS[input.season];
    const yieldAdjustedCache = cacheBaseEur * yieldMultiplier;

    // PHASE 2 §3 — Recargo complejidad boda (+25%)
    const isWeddingKind = input.includeWeddingSurcharge || input.eventKind === 'BODA';
    const weddingSurcharge = isWeddingKind
        ? yieldAdjustedCache * WEDDING_COMPLEXITY_SURCHARGE_PCT
        : 0;

    // PHASE 2 §3 — Dietas +30€/pax (solo si >4h o >100km)
    const mealsActive =
        input.includeMeals &&
        (input.durationHours > MEAL_MIN_DURATION_HOURS || input.distanceKm > MEAL_MIN_DISTANCE_KM);
    const mealsFee = mealsActive ? input.attendees * MEAL_FEE_PER_PAX_EUR : 0;

    // PHASE 2 §2 — Logística: tarifa configurable por proveedor desde su Km 0
    let kmFee = 0;
    if (input.manualLogisticsOverride && input.manualLogisticsFee !== undefined) {
        kmFee = toEur(input.manualLogisticsFee, input.currency);
    } else if (input.distanceKm > input.freeKmThreshold) {
        kmFee = (input.distanceKm - input.freeKmThreshold) * input.ratePerKm;
    }

    // Hotel +120€ si fin >= 3:00 AM o distancia > 200 km
    const lateFinish = input.endTimeHour >= LATE_FINISH_HOUR || input.endTimeHour === 0;
    const hotelFee = lateFinish || input.distanceKm > LONG_HAUL_KM ? LATE_FINISH_HOTEL_FEE_EUR : 0;

    const logisticsFee = kmFee + hotelFee;

    const subtotal = yieldAdjustedCache + weddingSurcharge + mealsFee + logisticsFee;

    // PHASE 1 §1 — Price-Lock dinámico (% del presupuesto)
    const depositPct = DEFAULT_DEPOSIT_PCT;
    const depositAmount = subtotal * depositPct;

    // PHASE 1 §2 — Comisión inmutable 20%
    const earCommissionPct = EAR_COMMISSION_PCT;
    const earCommissionAmount = subtotal * earCommissionPct;

    // Afiliados: 5% del 20% de EAR OS (15% EAR, 5% finca)
    const affiliatePct = input.hasAffiliateReferral ? AFFILIATE_REFERRAL_PCT : 0;
    const affiliateAmount = subtotal * affiliatePct;
    const earNetCommission = earCommissionAmount - affiliateAmount;

    const providerNetPayout = subtotal - earCommissionAmount;

    return {
        cacheBase: round2(cacheBaseEur),
        yieldMultiplier,
        yieldAdjustedCache: round2(yieldAdjustedCache),
        weddingSurcharge: round2(weddingSurcharge),
        mealsFee: round2(mealsFee),
        logisticsFee: round2(logisticsFee),
        hotelFee: round2(hotelFee),
        subtotal: round2(subtotal),
        depositPct,
        depositAmount: round2(depositAmount),
        earCommissionPct,
        earCommissionAmount: round2(earCommissionAmount),
        affiliatePct,
        affiliateAmount: round2(affiliateAmount),
        earNetCommission: round2(earNetCommission),
        providerNetPayout: round2(providerNetPayout),
        currency: input.currency
    };
}

/** PHASE 4 §1 — Autenticación / KYC: pasos de onboarding gamificado hacia la insignia S-Class. */
export interface OnboardingStep {
    id: string;
    label: string;
    done: boolean;
}

export interface VendorDashboardTelemetry {
    /** PHASE 4 §3 — Analítica para proveedores. */
    profileViews30d: number;
    conversionRate: number;
    activeLeads: number;
    sclassBadge: boolean;
    onboarding: OnboardingStep[];
}