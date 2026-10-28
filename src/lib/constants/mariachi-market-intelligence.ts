/**
 * ════════════════════════════════════════════════════════════════════════════
 * INTELIGENCIA DE MERCADO — CENTRALITA DE MARIACHIS (OBSERVACIÓN PÚBLICA)
 * ════════════════════════════════════════════════════════════════════════════
 * Radiografía factual del canal de intermediación dominante en España, medida
 * sobre páginas públicas el 2026-10-28.
 *
 * LÍMITES DE ESTE FICHERO (los marca la ley, no la comodidad):
 *  - Se registran HECHOS de mercado: recuentos, precios publicados, planes,
 *    número de fichas, provincias cubiertas y omisiones de información.
 *  - NO se almacena ni se reproduce copy, fotografía, logotipo ni nombre
 *    comercial del operador observado. `.clinerules` §10 prohíbe marcas de
 *    terceros en código, interfaces, URLs o metadatos; directiva 96/9/CE
 *    prohíbe la extracción sustancial de su base de datos.
 *  - `observedAt` es obligatorio: un dato de mercado sin fecha es una opinión.
 *
 * Uso previsto: construir la contra-oferta (Oferta Hormozi) y el mapa de
 * provincias sin competencia real. Jamás para replicar su catálogo.
 * ════════════════════════════════════════════════════════════════════════════
 */

/** Importe en euros con su condición de cobro. */
export interface ObservedPrice {
    readonly amountEur: number;
    readonly condition: string;
}

/** Riesgo competitivo que la observación documenta. */
export interface MarketGap {
    readonly id: string;
    readonly label: string;
    /** Hecho medido. */
    readonly fact: string;
    /** Cómo lo aprovecha la Centralita sin imitar al observado. */
    readonly counterMove: string;
}

/** Ficha de la observación de mercado. */
export interface MarketObservation {
    readonly observedAt: string;
    readonly scope: 'espana';
    /** Nº de fichas de grupo publicadas en el directorio observado. */
    readonly groupsListed: number;
    /** Nº de fichas con mejor posición comercial (plan de pago). */
    readonly groupsPremium: number;
    /** Provincias con al menos una ficha real. */
    readonly coveredProvinces: readonly string[];
    /** Nº total de provincias del territorio observado (50 + 2 ciudades autónomas). */
    readonly totalProvinces: number;
    /** Precio que paga el cliente final. */
    readonly clientPrice: ObservedPrice;
    /** Precio del plan gratuito para el grupo. */
    readonly proFreePlan: readonly ObservedPrice[];
    /** Precio del plan de pago para el grupo. */
    readonly proPremiumPlan: readonly ObservedPrice[];
    /** Lo que el observado NO publica (huecos explotables). */
    readonly omissions: readonly string[];
    /** Inconsistencia detectada en su propia comunicación de precio. */
    readonly contradiction: string;
    /** Gaps explotables. */
    readonly gaps: readonly MarketGap[];
}

/** Observación canónica e inmutable. */
export const MARIACHI_MARKET_OBSERVATION: MarketObservation = Object.freeze({
    observedAt: '2026-10-28',
    scope: 'espana',
    groupsListed: 60,
    groupsPremium: 7,
    coveredProvinces: Object.freeze([
        'Madrid',
        'Barcelona',
        'Valencia',
        'Sevilla',
        'Burgos',
        'La Rioja',
        'Tarragona',
        'Jaén',
        'Asturias',
    ]),
    totalProvinces: 52,
    clientPrice: Object.freeze({
        amountEur: 0,
        condition: 'Gratuito para el cliente final; su coste lo paga el grupo.',
    } as const satisfies ObservedPrice),
    proFreePlan: Object.freeze([
        Object.freeze({ amountEur: 0, condition: 'Cuota mensual fija' } as const),
        Object.freeze({
            amountEur: 4,
            condition: 'Por cada lead aceptado por el grupo',
        } as const),
    ]),
    proPremiumPlan: Object.freeze([
        Object.freeze({
            amountEur: 79,
            condition: 'Primer mes de bienvenida para grupos nuevos',
        } as const),
        Object.freeze({
            amountEur: 208,
            condition: 'Mensualidad indicada en la cabecera de su página de planes',
        } as const),
        Object.freeze({
            amountEur: 250,
            condition: 'Mensualidad indicada en el cuerpo de esa misma página',
        } as const),
    ]),
    omissions: Object.freeze([
        'No publica precio de servicio: todas las fichas muestran «Consultar precio».',
        'No publica teléfono ni WhatsApp del grupo: toda captación pasa por su formulario.',
        'No publica depósito, fianza ni condición de cancelación.',
        'No bloquea fecha: el cliente compara y el grupo persigue el cierre.',
        'No publica rider acústico ni límite de decibelios del recinto.',
    ]),
    contradiction:
        'Su propia página de planes anuncia 208 €/mes en cabecera y 250 €/mes en el cuerpo: una diferencia del 20 % publicada en el mismo folio.',
    gaps: Object.freeze([
        Object.freeze({
            id: 'precio-opaco',
            label: 'Precio sobre consulta',
            fact: 'Cero precios publicados en 60 fichas.',
            counterMove:
                'Precio cerrado desde el primer clic con catálogo SSOT y depósito deducible.',
        } as const satisfies MarketGap),
        Object.freeze({
            id: 'cobertura-43',
            label: '43 provincias sin oferta real',
            fact: 'Solo 9 provincias tienen ficha; 43 quedan a cero.',
            counterMove:
                'Malla de 160 landings geográficas en 24 mercados españoles antes que nadie.',
        } as const satisfies MarketGap),
        Object.freeze({
            id: 'cuota-fija',
            label: 'Coste fijo sin garantía de bolo',
            fact: 'El grupo paga 208–250 €/mes cierre o no cierre, o 4 € por lead aceptado.',
            counterMove:
                'Cero cuota fija: 10 % de infraestructura solo sobre bolo cobrado.',
        } as const satisfies MarketGap),
        Object.freeze({
            id: 'sin-lock',
            label: 'Sin bloqueo de fecha',
            fact: 'No existe reserva atómica ni depósito que comprometa la fecha.',
            counterMove:
                'Depósito Price-Lock de 100 € deducible + lock atómico idempotente.',
        } as const satisfies MarketGap),
        Object.freeze({
            id: 'contacto-cautivo',
            label: 'Contacto cautivo',
            fact: 'El cliente nunca ve el teléfono del grupo; el grupo nunca ve el cliente.',
            counterMove:
                'Despacho con trazabilidad: el grupo recibe el evento con datos y el cliente recibe músico con teléfono verificado.',
        } as const satisfies MarketGap),
    ]),
} as const);

/** Nº de provincias sin oferta real del observado (dato derivado, no declarado). */
export const UNCOVERED_PROVINCES_COUNT: number =
    MARIACHI_MARKET_OBSERVATION.totalProvinces -
    MARIACHI_MARKET_OBSERVATION.coveredProvinces.length;

/** Coste anual de un grupo que se queda en el plan de pago del observado. */
export const OBSERVED_ANNUAL_SUBSCRIPTION_EUR: number = (() => {
    const premium = MARIACHI_MARKET_OBSERVATION.proPremiumPlan;
    const welcome = premium[0]?.amountEur ?? 0;
    const recurring = premium[2]?.amountEur ?? premium[1]?.amountEur ?? 0;
    return welcome + recurring * 11;
})();
