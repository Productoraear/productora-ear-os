/**
 * ════════════════════════════════════════════════════════════════════════════
 * EAR OS — SINGLE SOURCE OF TRUTH (SSOT CENTRALIZADO E INMUTABLE) v14.1
 * ════════════════════════════════════════════════════════════════════════════
 * Zona Cero de Integridad Financiera, Operativa y Legal.
 * Todo motor financiero, checkout, licitación y rider acústico DEBE consumir
 * exclusivamente estas constantes. Prohibido duplicar valores en código o copy.
 * ════════════════════════════════════════════════════════════════════════════
 */

// 1. CONSTANTES COMERCIALES: ARTISTAS & SOLISTA (EDWIN AGUDELO — PACIENTE CERO)
/** Suelo canónico inviolable de Edwin Agudelo (solo con cupón de afiliado/redes a < 100 km de Méntrida). */
export const TARIFA_BASE_SOLISTA_EUR: number = 350.0;

/** Tarifa estándar oficial de catálogo de Edwin Agudelo con 100 km incluidos de desplazamiento. */
export const TARIFA_ESTANDAR_SOLISTA_EUR: number = 550.0;

/** Kilómetros de desplazamiento incluidos en la tarifa estándar de 550,00 €. */
export const SOLISTA_KM_INCLUIDOS: number = 100;

/** Etiqueta canónica de la tarifa estándar Solista (copy comercial de interfaz). */
export const SOLISTA_TARIFA_ETIQUETA: string = 'Tarifa estándar mínima';

// 2. PARÁMETROS LOGÍSTICOS S-CLASS
/** Coste por kilómetro adicional a partir de la demarcación exenta. */
export const LOGISTICA_EUR_PER_KM: number = 1.5;

/** Kilómetros exentos desde la base operativa (Hub Méntrida para Edwin Agudelo). */
export const LOGISTICA_KM_EXENTOS: number = 50;

/** Distancia límite que activa el suplemento hotelero obligatorio. */
export const LOGISTICA_KM_HOTEL: number = 200;

/** Suplemento hotelero fijo si hora fin >= 03:00 AM o distancia > 200 km. */
export const SUPLEMENTO_HOTEL_EUR: number = 120.0;

/** Hora límite de finalización que activa la pernocta logística. */
export const HORA_FIN_HOTEL: number = 3;

// 3. PASARELA FINANCIERA, COBRO PREVIO & SPLIT SOBERANO
/** Depósito de reserva Price-Lock SHA-256 (100% deducible de la liquidación final). */
export const DEPOSITO_RESERVA_EUR: number = 100.0;
export const DEPOSITO_STRIPE_EUR: number = 100.0;

/** Porcentaje de fianza si el evento se contrata con menos de 7 días de antelación. */
export const DEPOSITO_URGENCIA_MENOS_7_DIAS_PCT: number = 0.5;

/** @deprecated Se conserva por compatibilidad hacia atrás en motores heredados. */
export const RESERVA_BLOQUEO_PCT: number = 0.5;

/** Cobro del servicio: el 100% debe estar liquidado antes de iniciar la actuación. */
export const COBRO_PREVIO_AL_EVENTO_PCT: number = 1.0;

/**
 * Split Soberano Canónico:
 * - Aplica al directorio gratuito (80% Artista/Proveedor, 10% EAR OS, 10% VIMUME).
 * - Los proveedores en planes de pago (Club Fundadores / suscripción) retienen el 100%
 *   de su caché en contrataciones directas (0% comisión EAR OS).
 */
export const SPLIT_SOBERANO = Object.freeze({
  artista: 0.8,
  earOs: 0.1,
  vimume: 0.1,
} as const);

// 4. CONTRATACIÓN PÚBLICA (B2G - LEY 9/2017 LCSP)
/** Límite legal máximo para contratos menores de servicios (Art. 118 LCSP). */
export const LIMITE_B2G_LCSP_EUR: number = 15000.0;

/** Techo preventivo operativo (-5%) para evitar reparos de intervención municipal. */
export const AJUSTE_PREVENTIVO_B2G_EUR: number = 14250.0;
export const SAFE_LCSP_CEILING_EUR: number = AJUSTE_PREVENTIVO_B2G_EUR;

/** Techo máximo admisible por el cotizador (Guard estricto con error 400). */
export const MAX_TOTAL_ESTIMADO_EUR: number = 1000000.0;

// 5. RIDER TÉCNICO & PROTOCOLO ACÚSTICO (LEY 37/2003 DEL RUIDO)
/** Límite de presión sonora para salud pública (herramienta técnica a demanda). */
export const LIMITE_SPL_DB: number = 75;

/** Potencia acústica recomendada por asistente en recintos. */
export const WATTS_PER_PAX: number = 12;

// 6. CONTACT-GATE & CENTRALITA SOBERANA
/** Canal telefónico oficial EAR OS (Centralita CEO Edwin Agudelo). */
export const CENTRALITA_EAR_OS: string = '+34 693 693 048';

/** Tipo impositivo de IVA general en España. */
export const VAT_RATE: number = 0.21;

// 7. BLOQUE MAESTRO INMUTABLE CONGELADO (ZONA CERO)
export const EAR_OS_SSOT = Object.freeze({
  TARIFA_BASE_SOLISTA_EUR,
  TARIFA_ESTANDAR_SOLISTA_EUR,
  SOLISTA_KM_INCLUIDOS,
  SOLISTA_TARIFA_ETIQUETA,
  LOGISTICA_EUR_PER_KM,
  LOGISTICA_KM_EXENTOS,
  LOGISTICA_KM_HOTEL,
  SUPLEMENTO_HOTEL_EUR,
  HORA_FIN_HOTEL,
  DEPOSITO_RESERVA_EUR,
  DEPOSITO_STRIPE_EUR,
  DEPOSITO_URGENCIA_MENOS_7_DIAS_PCT,
  RESERVA_BLOQUEO_PCT,
  COBRO_PREVIO_AL_EVENTO_PCT,
  SPLIT_SOBERANO,
  LIMITE_B2G_LCSP_EUR,
  AJUSTE_PREVENTIVO_B2G_EUR,
  SAFE_LCSP_CEILING_EUR,
  MAX_TOTAL_ESTIMADO_EUR,
  LIMITE_SPL_DB,
  WATTS_PER_PAX,
  CENTRALITA_EAR_OS,
  VAT_RATE,
} as const);

export type EarOsSsot = typeof EAR_OS_SSOT;
