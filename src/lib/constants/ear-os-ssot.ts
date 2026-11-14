/**
 * ════════════════════════════════════════════════════════════════════════════
 * EAR OS — SSOT CENTRALIZADO E INMUTABLE (SINGLE SOURCE OF TRUTH) v14.0
 * ════════════════════════════════════════════════════════════════════════════
 * Fuente única y canónica de las constantes de negocio S-CLASS.
 * Todo motor financiero, checkout, licitación y rider acústico DEBE consumir
 * exclusivamente estas constantes. Queda prohibido duplicar valores.
 *
 * Reglas SSOT (Protocolo Omega · AGENTS.md v12.0):
 *  - Tarifa estándar mínima oficial Solista (Edwin Agudelo): 550,00 €
 *    (incluye 100 km de desplazamiento). Suelo inviolable: 350,00 €.
 *  - Logística S-Class: 1,50 €/km a partir del km 50 de Méntrida
 *    (+120 € Hotel si hora fin >= 3:00 AM o distancia > 200 km).
 *  - Split Soberano: 80% Artista / 10% EAR OS / 10% VIMUME.
 *  - Depósito de Reserva y Bloqueo de Fecha: 100,00 € fijo (Price-Lock SHA-256).
 *    Siempre deducible del importe total en la liquidación final.
 *  - Cobro del servicio: 100% del total previo a la ejecución del evento.
 *  - Límite B2G (Art. 118 LCSP): < 15.000,00 € (techo preventivo 14.250,00 €).
 *    El techo preventivo B2G incluye una sesión VIMUME de impacto social.
 *  - Rider acústico: 12 W/pax, límite de salud pública < 75 dB SPL.
 *    AVISO LEGAL: El calculador acústico es una herramienta técnica voluntaria
 *    a demanda. No constituye promesa contractual de indemnidad legal ni
 *    sustituto de un técnico acústico homologado (Ley 37/2003).
 *  - Centralita: +34 693 693 048 (Único canal oficial, CEO Edwin Agudelo).
 * ════════════════════════════════════════════════════════════════════════════
 */

/**
 * SUELO TARIFARIO SOLISTA (innegociable, sanción CEO).
 * Es el mínimo absoluto del Solista Premium Edwin Agudelo: ningún cupón,
 * descuento de afiliado ni promoción puede cotizar por debajo de esta cifra.
 * Aplica EXCLUSIVAMENTE a Edwin Agudelo (`e78903`).
 */
export const TARIFA_BASE_SOLISTA_EUR: number = 350.0;

/**
 * TARIFA ESTÁNDAR MÍNIMA OFICIAL del Solista (Edwin Agudelo).
 * Vigente desde la directiva comercial del CEO: 550,00 € con
 * `SOLISTA_KM_INCLUIDOS` (100 km) de desplazamiento ya incluidos en el precio.
 * El suelo de 350,00 € solo es alcanzable con cupón de afiliado válido.
 */
export const TARIFA_ESTANDAR_SOLISTA_EUR: number = 550.0;

/**
 * Kilómetros de desplazamiento incluidos en la tarifa estándar de 550,00 €.
 * Por encima de esta franquicia se factura `LOGISTICA_EUR_PER_KM`.
 */
export const SOLISTA_KM_INCLUIDOS: number = 100;

/**
 * DEPÓSITO DE RESERVA Y BLOQUEO DE FECHA (FIJO, INMUTABLE).
 * Importe fijo de 100,00 € Stripe Price-Lock SHA-256.
 * Siempre deducible al 100% del importe total en la liquidación final.
 * Este es el único depósito autorizado; NO se aceptan porcentajes variables
 * como depósito de reserva salvo aprobación explícita del CEO.
 */
export const DEPOSITO_RESERVA_EUR: number = 100.0;

/**
 * Depósito de cierre en Stripe (Price-Lock SHA-256), inmutable.
 * Alias legacy mantenido por compatibilidad con motores existentes.
 */
export const DEPOSITO_STRIPE_EUR: number = DEPOSITO_RESERVA_EUR;

/**
 * POLÍTICA DE COBRO DEL SERVICIO.
 * El 100% del importe total se cobra PREVIO a la ejecución del evento.
 * Solo el depósito de reserva (100 €) se cobra en el momento de la contratación.
 * No se ejecuta ningún evento sin haber recibido el 100% del pago.
 */
export const COBRO_PREVIO_AL_EVENTO_PCT: number = 1.0; // 100%

/**
 * @deprecated RESERVA_BLOQUEO_PCT: El depósito es un importe fijo de 100 €
 * (DEPOSITO_RESERVA_EUR), no un porcentaje del total. Esta constante se
 * conserva únicamente para backward-compatibility y NO debe usarse en
 * nuevos motores de cotización.
 */
export const RESERVA_BLOQUEO_PCT: number = 0.5;

/** Etiqueta canónica de la tarifa estándar Solista (copy comercial). */
export const SOLISTA_TARIFA_ETIQUETA: string = 'Tarifa estándar mínima';

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

/** Techo legal de contrato menor (Art. 118 LCSP). */
export const LIMITE_B2G_LCSP_EUR: number = 15000.0;

/**
 * Ajuste preventivo anti-fraccionamiento (95% del techo legal).
 * El contrato menor B2G incluye sesión VIMUME de impacto social.
 * Ningún expediente B2G puede superar esta cifra sin licitación ordinaria.
 */
export const AJUSTE_PREVENTIVO_B2G_EUR: number = 14250.0;

/** Alias canónico del techo preventivo de Contrato Menor (Art. 118 LCSP). */
export const SAFE_LCSP_CEILING_EUR: number = AJUSTE_PREVENTIVO_B2G_EUR;

/**
 * Techo anti-desbordamiento del presupuesto declarado por el cliente
 * (1.000.000,00 €). Se aplica como GUARD explícito → `400`
 * `PRESUPUESTO_EXCEDE_MAXIMO_LEGAL`, nunca como recorte silencioso (`clamp`).
 * Consumido por la ruta de depósito y por el MCP Concierge: un único número.
 */
export const MAX_TOTAL_ESTIMADO_EUR: number = 1_000_000.0;

/**
 * Presión sonora de salud pública (límite máximo legal Ley 37/2003).
 * AVISO: El calculador acústico de EAR OS es una herramienta técnica
 * voluntaria a demanda. No constituye promesa contractual de indemnidad
 * legal ni sustituto de un técnico acústico homologado.
 */
export const LIMITE_SPL_DB: number = 75;

/** Potencia acústica por asistente (W/pax) — referencia técnica informativa. */
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
    TARIFA_ESTANDAR_SOLISTA_EUR,
    SOLISTA_KM_INCLUIDOS,
    DEPOSITO_RESERVA_EUR,
    DEPOSITO_STRIPE_EUR,
    COBRO_PREVIO_AL_EVENTO_PCT,
    RESERVA_BLOQUEO_PCT,
    LOGISTICA_EUR_PER_KM,
    LOGISTICA_KM_EXENTOS,
    LOGISTICA_KM_HOTEL,
    SUPLEMENTO_HOTEL_EUR,
    HORA_FIN_HOTEL,
    LIMITE_B2G_LCSP_EUR,
    AJUSTE_PREVENTIVO_B2G_EUR,
    SAFE_LCSP_CEILING_EUR,
    MAX_TOTAL_ESTIMADO_EUR,
    LIMITE_SPL_DB,
    WATTS_PER_PAX,
    CENTRALITA_EAR_OS,
    VAT_RATE,
    SPLIT_SOBERANO,
} as const);

/** Tipo derivado del SSOT para un consumo tipado estricto. */
export type EarOsSsot = typeof EAR_OS_SSOT;