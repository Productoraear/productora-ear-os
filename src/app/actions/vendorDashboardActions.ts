'use server';

import {
    calculateVendorQuote,
    type VendorQuoteInput,
    type VendorQuoteBreakdown,
    type VendorDashboardTelemetry
} from '@/lib/vendor/vendorDashboardEngine';

/**
 * Calcula un presupuesto S-Class de proveedor aplicando las leyes PHASE_X_SSOT.
 * Wrapper de server action que expone el motor puro al cliente.
 */
export async function calculateVendorQuoteAction(
    input: VendorQuoteInput
): Promise<{ success: true; quote: VendorQuoteBreakdown } | { success: false; error: string }> {
    try {
        if (!Number.isFinite(input.baseCache) || input.baseCache < 0) {
            return { success: false, error: 'Caché base no válida' };
        }
        if (!Number.isFinite(input.distanceKm) || input.distanceKm < 0) {
            return { success: false, error: 'Distancia no válida' };
        }
        if (!Number.isFinite(input.ratePerKm) || input.ratePerKm < 0) {
            return { success: false, error: 'Tarifa kilométrica no válida' };
        }

        const quote = calculateVendorQuote(input);
        return { success: true, quote };
    } catch (error) {
        console.error('[vendorDashboardActions] Error calculando presupuesto:', error);
        return { success: false, error: 'Error calculando el presupuesto S-Class' };
    }
}

/**
 * Telemetría SSOT de proveedor (PHASE 4 §3) para el dashboard.
 * Datos deterministas de Edwin Agudelo hasta conexión con telemetría real.
 */
export async function getVendorDashboardTelemetryAction(
    vendorSlug: string
): Promise<VendorDashboardTelemetry> {
    const slug = vendorSlug.toLowerCase();

    if (slug === 'edwin-agudelo') {
        return {
            profileViews30d: 1240,
            conversionRate: 6.8,
            activeLeads: 3,
            sclassBadge: true,
            onboarding: [
                { id: 'kyc', label: 'Identidad Stripe (DNI + Selfie)', done: true },
                { id: 'iaepro', label: 'Carga IAE + Responsabilidad Civil', done: true },
                { id: 'contract', label: 'Firma de contrato biométrica', done: true },
                { id: 'calendar', label: 'Calendario iCal sincronizado', done: true },
                { id: 'media', label: 'Galería multimedia curada', done: false }
            ]
        };
    }

    return {
        profileViews30d: 0,
        conversionRate: 0,
        activeLeads: 0,
        sclassBadge: false,
        onboarding: [
            { id: 'kyc', label: 'Identidad Stripe (DNI + Selfie)', done: false },
            { id: 'iaepro', label: 'Carga IAE + Responsabilidad Civil', done: false },
            { id: 'contract', label: 'Firma de contrato biométrica', done: false },
            { id: 'calendar', label: 'Calendario iCal sincronizado', done: false },
            { id: 'media', label: 'Galería multimedia curada', done: false }
        ]
    };
}