/**
 * ════════════════════════════════════════════════════════════════════════════════
 * METRICS-PROVENANCE.TS — CANAL CANÓNICO DE PROCEDENCIA DE TELEMETRÍA (S-CLASS)
 * ════════════════════════════════════════════════════════════════════════════════
 * Doctrina Anti-Vanidad (AF-1 / AF-5 / RETO_ESPEJO):
 *   - Toda métrica del panel de administración declara su procedencia exacta:
 *       * 'live': Sondeada en tiempo real de la base de datos o servicio externo activo.
 *       * 'static': Extraída de manifiesto inmutable verificado con SHA-256 o fuente SSOT.
 *       * 'empty': Sin sonda verificada o base de datos offline -> valor forzado a 0.
 *   - Si probed === false, el valor evaluado es OBLIGATORIAMENTE 0 y status 'SIN_DATOS'.
 *   - Función pura de traducción: CERO accesos a disco, CERO llamadas de red paralelas,
 *     CERO split-brain con el canal de verdad del servidor.
 */

export type AdminMetricSource = 'live' | 'empty' | 'static';
export type AdminMetricMode = 'REAL' | 'SIMULADO';

export interface AdminMetric {
  readonly key: string;
  readonly label: string;
  readonly value: number;
  readonly formattedValue?: string;
  readonly unit?: string;
  readonly source: AdminMetricSource;
  readonly probed: boolean;
  readonly mode: AdminMetricMode;
  readonly checkedAt: string;
  readonly ref: string;
  readonly manifestSha256?: string;
}

/**
 * Genera una métrica vacía cuando la sonda no se ejecutó o el backend está desconectado.
 * Garantía: value === 0, probed === false, source === 'empty'.
 */
export function emptyMetric(
  key: string,
  label: string,
  ref: string,
  unit = '',
  formattedOverride?: string
): AdminMetric {
  return {
    key,
    label,
    value: 0,
    formattedValue: formattedOverride ?? '0',
    unit,
    source: 'empty',
    probed: false,
    mode: 'REAL',
    checkedAt: new Date().toISOString(),
    ref,
  };
}

/**
 * Traduce una medición en vivo.
 * Si probed === false, degrada atómicamente a emptyMetric (imposible pintar verde sin sonda).
 */
export function liveMetric(
  key: string,
  label: string,
  value: number,
  probed: boolean,
  ref: string,
  unit = '',
  checkedAt?: string,
  mode: AdminMetricMode = 'REAL',
  formattedValue?: string
): AdminMetric {
  if (!probed) {
    return emptyMetric(key, label, ref, unit, formattedValue ? '0' : undefined);
  }

  return {
    key,
    label,
    value,
    formattedValue: formattedValue ?? (unit ? `${value} ${unit}`.trim() : `${value}`),
    unit,
    source: 'live',
    probed: true,
    mode,
    checkedAt: checkedAt ?? new Date().toISOString(),
    ref,
  };
}

/**
 * Registra una constante o catálogo estático verificado de manifiestos SSOT.
 */
export function staticMetric(
  key: string,
  label: string,
  value: number,
  ref: string,
  unit = '',
  manifestSha256?: string,
  formattedValue?: string
): AdminMetric {
  return {
    key,
    label,
    value,
    formattedValue: formattedValue ?? (unit ? `${value} ${unit}`.trim() : `${value}`),
    unit,
    source: 'static',
    probed: true,
    mode: 'REAL',
    checkedAt: new Date().toISOString(),
    ref,
    manifestSha256,
  };
}
