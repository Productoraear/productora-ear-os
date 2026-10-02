/**
 * ════════════════════════════════════════════════════════════════════════════
 * EAR OS — SSOT CENTRALIZADO E INMUTABLE (SINGLE SOURCE OF TRUTH)
 * ════════════════════════════════════════════════════════════════════════════
 * Fuente única y canónica de las constantes de negocio S-CLASS.
 * Todo motor financiero, checkout, licitación y rider acústico DEBE consumir
 * exclusivamente estas constantes. Queda prohibido duplicar valores.
 *
 * Reglas SSOT (Protocolo Omega · AGENTS.md):
 *  - Tarifa Base Solista (Edwin Agudelo): 350,00 €.
 *  - Logística S-Class: 1,50 €/km a partir del km 50 de Méntrida
 *    (+120 € Hotel si hora fin >= 3:00 AM o distancia > 200 km).
 *  - Split Soberano: 80% Artista / 10% EAR OS / 10% VIMUME.
 *  - Depósito Stripe: 100,00 € (Price-Lock SHA-256).
 *  - Límite B2G (Art. 118 LCSP): < 15.000,00 € (ajuste preventivo 14.250,00 €).
 *  - Rider acústico: 12 W/pax, límite de salud pública < 75 dB SPL.
 *  - Centralita: +34 693 693 048 (Solo CEO Edwin Agudelo).
 * ════════════════════════════════════════════════════════════════════════════
 */

/** Tarifa base innegociable del Solista Premium (Edwin Agudelo). */
export const TARIFA_BASE_SOLISTA_EUR: number = 350.0;

/** Precio por kilómetro logístico a partir del km exento. */
export const LOGISTICA_EUR_PER_KM: number = 1.5;

/** Kilómetros exentos desde el Hub Méntrida (km 0). */
export const LOGISTICA_KM_EXENTOS: number = 50;

/** Distancia que activa suplemento hotelero. */
export const LOGISTICA_KM_HOTEL: number = 200;

/** Suplemento hotelero (fin >= 3:00 AM o distancia > 200 km). */
export const SUPLEMENTO_HOTEL_EUR: number = 120;

/** Hora de cierre que activa el suplemento hotelero (3:00 AM). */
export const HORA_FIN_HOTEL: number = 3;

/** Depósito de cierre en Stripe (Price-Lock SHA-256), inmutable. */
export const DEPOSITO_STRIPE_EUR: number = 100.0;

/** Techo legal de contrato menor (Art. 118 LCSP). */
export const LIMITE_B2G_LCSP_EUR: number = 15000.0;

/** Ajuste preventivo del 95% para blindar reparos de intervención. */
export const AJUSTE_PREVENTIVO_B2G_EUR: number = 14250.0;

/** Alias canónico del techo preventivo de Contrato Menor (Art. 118 LCSP). */
export const SAFE_LCSP_CEILING_EUR: number = AJUSTE_PREVENTIVO_B2G_EUR;

/** Presión sonora de salud pública (límite máximo). */
export const LIMITE_SPL_DB: number = 75;

/** Potencia acústica por asistente (W/pax). */
export const WATTS_PER_PAX: number = 12;

/** Centralita oficial (Solo CEO Edwin Agudelo). */
export const CENTRALITA_EAR_OS: string = '+34 693 693 048';

/** Ratio base del impuesto sobre el valor añadido. */
export const VAT_RATE: number = 0.21;

/** Split Soberano 80/10/10 (inmutable). */
export const SPLIT_SOBERANO = Object.freeze({
    artista: 0.8,
    earOs: 0.1,
    vimume: 0.1,
} as const);

/**
 * Bloque canónico e inmutable de las reglas de negocio EAR OS.
 * `Object.freeze()` garantiza inmutabilidad en runtime y `as const`
 * exclusividad literal de tipos en compile-time (cero `any`).
 */
export const EAR_OS_SSOT = Object.freeze({
    TARIFA_BASE_SOLISTA_EUR,
    LOGISTICA_EUR_PER_KM,
    LOGISTICA_KM_EXENTOS,
    LOGISTICA_KM_HOTEL,
    SUPLEMENTO_HOTEL_EUR,
    HORA_FIN_HOTEL,
    DEPOSITO_STRIPE_EUR,
    LIMITE_B2G_LCSP_EUR,
    AJUSTE_PREVENTIVO_B2G_EUR,
    SAFE_LCSP_CEILING_EUR,
    LIMITE_SPL_DB,
    WATTS_PER_PAX,
    CENTRALITA_EAR_OS,
    VAT_RATE,
    SPLIT_SOBERANO,
} as const);

/** Tipo derivado del SSOT para un consumo tipado estricto. */
export type EarOsSsot = typeof EAR_OS_SSOT;