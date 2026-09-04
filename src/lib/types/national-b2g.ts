/**
 * TIPADO NACIONAL B2G // EAR OS V2
 * Interfaz estricta para el registro de municipios objetivo en la estrategia
 * de contratación menor (Art. 118 LCSP) orientada a Festejos y Cultura.
 *
 * SSOT de tipado para el directorio `src/data/b2g-national/`.
 */

/**
 * Tramo de priorización comercial del municipio.
 * - 'A': Alta prioridad (presupuesto estimado >= 10.000 € y contacto activo).
 * - 'B': Prioridad media (presupuesto estimado 5.000 € – 9.999 €).
 * - 'C': Prioridad baja / prospectivo (presupuesto estimado < 5.000 €).
 */
export type MunicipalityTramo = 'A' | 'B' | 'C';

/**
 * Contacto operativo del área de Festejos del Ayuntamiento.
 */
export interface ContactoFestejos {
  /** Correo electrónico institucional o de la concejalía de Festejos. */
  email: string;
  /** Teléfono de contacto (formato E.164 recomendado, ej: +34 600 000 000). */
  telefono: string;
}

/**
 * Registro estricto de un municipio objetivo para la estrategia B2G nacional.
 *
 * Invariantes de negocio:
 * - `presupuestoEstimadoFestejos` debe expresarse en EUR y, para ser elegible
 *   como contrato menor, situarse por debajo del techo del Art. 118 LCSP (14.990 €).
 * - `tramo` determina la priorización comercial y el esfuerzo de prospección.
 * - `fiestasPatronalesFechas` contiene fechas ISO 8601 (YYYY-MM-DD) de las
 *   fiestas patronales o actos públicos relevantes del municipio.
 */
export interface MunicipalityRecord {
  /** Identificador único y estable del municipio (UUID o slug normalizado). */
  id: string;

  /** Nombre oficial del municipio (ej: "Méntrida"). */
  nombre: string;

  /** Provincia a la que pertenece el municipio (ej: "Toledo"). */
  provincia: string;

  /** Comunidad Autónoma (ej: "Castilla-La Mancha"). */
  comunidadAutonoma: string;

  /** Población de derecho estimada (habitantes). */
  poblacion: number;

  /** Tramo de priorización comercial. */
  tramo: MunicipalityTramo;

  /** Contacto operativo del área de Festejos. */
  contactoFestejos: ContactoFestejos;

  /**
   * Fechas de las fiestas patronales / actos públicos relevantes.
   * Formato ISO 8601 (YYYY-MM-DD). Orden cronológico recomendado.
   */
  fiestasPatronalesFechas: string[];

  /**
   * Presupuesto estimado para Festejos expresado en EUR.
   * Para elegibilidad como contrato menor (Art. 118 LCSP) debe ser < 14.990 €.
   */
  presupuestoEstimadoFestejos: number;
}