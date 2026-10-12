import { MUNICIPALITIES_DATABASE } from '@/lib/geo/spanish-municipalities';

/**
 * ════════════════════════════════════════════════════════════════════════════
 * EAR OS — MATRIZ SEMÁNTICA DE KEYWORDS MARIACHI (SSOT pSEO 400+)
 * ════════════════════════════════════════════════════════════════════════════
 * Fuente ÚNICA de verdad para las intenciones de búsqueda de la ruta
 * `/mariachis`. Cubre las cuatro macro-intenciones (transaccional, local,
 * evento e informacional) más las ampliaciones semánticas de "situaciones"
 * (ocasiones de regalo/celebración) y "roles/afinidades" (a quién se dedica).
 *
 * DOCTRINA DEL DATO VERIFICADO:
 *  - Cero `verified:true` hardcodeado. Este módulo solo almacena keywords
 *    (texto de búsqueda), no proveedores ni teléfonos.
 *  - Cero `any` implícito: tipado estricto y exhaustivo.
 *  - Los términos locales se derivan del SSOT geoespacial
 *    (`MUNICIPALITIES_DATABASE`, ordenados por `searchIntentScore`), nunca
 *    por orden arbitrario.
 * ════════════════════════════════════════════════════════════════════════════
 */

export type MariachiIntentCategory = 'transaccional' | 'local' | 'evento' | 'informacional';

export interface MariachiKeywordMatrix {
    readonly transaccionales: readonly string[];
    readonly locales: readonly string[];
    readonly eventos: readonly string[];
    readonly informacionales: readonly string[];
    readonly situaciones: readonly string[];
    readonly rolesAfinidades: readonly string[];
}

export interface MariachiKeywordIntegrityReport {
    readonly ok: boolean;
    readonly transaccionales: number;
    readonly locales: number;
    readonly eventos: number;
    readonly informacionales: number;
    readonly situaciones: number;
    readonly rolesAfinidades: number;
    readonly total: number;
    readonly violations: readonly string[];
}

/**
 * Umbrales de dominio pSEO (no negociables).
 * Transaccionales + locales + eventos + informacionales >= 100 cada una.
 * Situaciones y roles/afinidades >= 50 cada una.
 */
const MIN_TRANSACCIONALES = 100;
const MIN_LOCALES = 100;
const MIN_EVENTOS = 100;
const MIN_INFORMACIONALES = 100;
const MIN_SITUACIONES = 50;
const MIN_ROLES = 50;

/* ════════════════════════════════ 1. TRANSACCIONALES (100+) ════════════════════════════════ */

const MARIACHI_KEYWORDS_TRANSACCIONALES: readonly string[] = [
    'contratar mariachis',
    'contratar mariachi',
    'contratar mariachis a domicilio',
    'contratar mariachi a domicilio',
    'mariachis a domicilio',
    'mariachi a domicilio',
    'reservar mariachi',
    'reservar mariachis',
    'alquilar mariachi',
    'alquiler de mariachis',
    'precio mariachis por hora',
    'precio mariachi por hora',
    'tarifa mariachis',
    'tarifa mariachi',
    'mariachis baratos',
    'mariachi barato',
    'mariachis economicos',
    'presupuesto mariachis',
    'presupuesto mariachi',
    'pedir presupuesto mariachis',
    'contratar grupo de mariachis',
    'contratar mariachi para fiesta',
    'contratar mariachi para boda',
    'contratar mariachi para cumpleanos',
    'contratar mariachi para serenata',
    'contratar mariachi para aniversario',
    'contratar mariachi para pedida de mano',
    'contratar mariachi para empresa',
    'contratar mariachi para fiesta patronal',
    'contratar mariachi para despedida de soltera',
    'contratar mariachi para despedida de soltero',
    'contratar mariachi para comunion',
    'contratar mariachi para bautizo',
    'contratar charros para fiestas',
    'charros para fiestas',
    'contratar charros',
    'mariachi con deposito',
    'reserva mariachi con 100 euros',
    'mariachi con fianza',
    'mariachi precio cerrado',
    'mariachi con precio cerrado',
    'mariachi con pago seguro',
    'mariachi con tarjeta',
    'mariachi online',
    'contratar mariachi online',
    'reservar mariachi online',
    'mariachi por whatsapp',
    'contratar mariachi por whatsapp',
    'mariachi por telefono',
    'contratar mariachi por telefono',
    'mariachi urgente',
    'mariachi para hoy',
    'mariachi para esta noche',
    'mariachi de ultima hora',
    'mariachi 24 horas',
    'serenata a domicilio',
    'contratar serenata',
    'contratar serenata a domicilio',
    'serenata sorpresa',
    'contratar serenata sorpresa',
    'serenata romantica',
    'contratar serenata romantica',
    'serenata de mariachi',
    'contratar serenata de mariachi',
    'mariachi en vivo',
    'mariachi en directo',
    'contratar mariachi en vivo',
    'contratar mariachi en directo',
    'grupo de mariachis',
    'contratar grupo de mariachi',
    'trio de mariachis',
    'cuarteto de mariachis',
    'contratar cuarteto mariachi',
    'mariachi de 6 integrantes',
    'mariachi monumental',
    'contratar mariachi monumental',
    'mariachi con show',
    'mariachi con animacion',
    'mariachi de gala',
    'contratar mariachi de gala',
    'mariachi profesional',
    'contratar mariachi profesional',
    'mariachi certificado',
    'mariachi con seguro',
    'mariachi con factura',
    'mariachi para empresas',
    'mariachi para eventos',
    'contratar mariachi para eventos',
    'mariachi para eventos corporativos',
    'contratar mariachi para evento corporativo',
    'mariachi para fiestas',
    'contratar mariachi para fiesta privada',
    'mariachi para chalet',
    'mariachi para restaurante',
    'mariachi para terraza',
    'mariachi para hotel',
    'mariachi para finca',
    'contratar mariachi para finca',
    'mariachi precio fijo',
    'mariachi sin sorpresas',
    'mariachi con desglose de precio',
    'mariachi pagar al contado',
    'mariachi precio por integrante',
    'mariachi paquete completo',
    'mariachi pack serenata',
    'mariachi pack boda',
    'mariachi pack cumpleanos',
    'mariachi temporada alta',
    'mariachi fecha disponible',
    'mariachi disponibilidad inmediata',
];

/* ════════════════════════════════ 2. EVENTOS (100+) ════════════════════════════════ */

const MARIACHI_KEYWORDS_EVENTOS: readonly string[] = [
    'mariachis para bodas',
    'mariachi para bodas',
    'mariachis para boda',
    'mariachi para boda',
    'mariachi boda civil',
    'mariachi boda finca',
    'mariachi boda masia',
    'mariachi boda hacienda',
    'mariachi coctel de boda',
    'mariachi banquete de boda',
    'mariachi entrada de novios',
    'mariachi apertura de baile',
    'mariachi brindis de boda',
    'serenata para novios',
    'mariachi para despedida de soltera',
    'mariachi para despedida de soltero',
    'mariachi para pedida de mano',
    'serenata de pedida de mano',
    'mariachi para aniversario de boda',
    'mariachi bodas de plata',
    'mariachi bodas de oro',
    'mariachi para serenatas',
    'serenata de mariachi',
    'mariachi para cumpleanos',
    'mariachi cumpleanos adulto',
    'mariachi cumpleanos infantil',
    'mariachi cumpleanos sorpresa',
    'mariachi para las mananitas',
    'las mananitas con mariachi',
    'mariachi para aniversario',
    'mariachi para san valentin',
    'serenata de san valentin',
    'mariachi para el dia de la madre',
    'mariachi para el dia del padre',
    'serenata para la madre',
    'serenata para el padre',
    'serenata para la abuela',
    'serenata para el abuelo',
    'mariachi para comunion',
    'mariachi para bautizo',
    'mariachi para confirmacion',
    'mariachi para graduacion',
    'mariachi para jubilacion',
    'serenata de jubilacion',
    'mariachi para homenaje',
    'mariachi para eventos corporativos',
    'mariachi para cena de empresa',
    'mariachi para convencion',
    'mariachi para lanzamiento de producto',
    'mariachi para coctel de empresa',
    'mariachi para navidad de empresa',
    'mariachi para fiestas patronales',
    'mariachi para fiesta patronal',
    'mariachi para fiesta de pueblo',
    'mariachi para fiesta popular',
    'mariachi para feria',
    'mariachi para festival',
    'mariachi para feria de abril',
    'mariachi para fiesta mexicana tematica',
    'mariachi para fiesta tematica',
    'mariachi para cumpleanos mexicano',
    'mariachi para fiesta de disfraces',
    'mariachi para fiesta privada',
    'mariachi para fiesta en casa',
    'mariachi para fiesta en chalet',
    'mariachi para fiesta en finca',
    'mariachi para fiesta en jardin',
    'mariachi para fiesta en restaurante',
    'mariachi para fiesta en terraza',
    'mariachi para fiesta en hotel',
    'mariachi para evento de empresa',
    'mariachi para team building',
    'mariachi para galas',
    'mariachi para gala benefica',
    'mariachi para inauguracion',
    'mariachi para apertura de local',
    'mariachi para congreso',
    'mariachi para recepcion',
    'mariachi para bienvenida',
    'mariachi para despedida',
    'mariachi para boda civil ayuntamiento',
    'mariachi para boda religiosa',
    'mariachi para boda en la playa',
    'mariachi para boda campestre',
    'mariachi para boda de noche',
    'mariachi para boda de dia',
    'mariachi para boda elegante',
    'mariachi para boda intima',
    'mariachi para boda grande',
    'mariachi para boda low cost',
    'mariachi para boda de lujo',
    'mariachi para aniversario de empresa',
    'mariachi para fiesta de la vendimia',
    'mariachi para carnaval',
    'mariachi para dia de muertos',
    'mariachi para quinceanera',
    'mariachi para puesta de largo',
    'mariachi para mayoria de edad',
    'mariachi 18 cumpleanos',
    'mariachi para cumpleanos 30',
    'mariachi para cumpleanos 40',
    'mariachi para cumpleanos 50',
    'mariachi para cumpleanos 60',
    'mariachi para cumpleanos 70',
    'mariachi para cumpleanos 80',
    'mariachi para cumpleanos 90',
];

/* ════════════════════════════════ 3. INFORMACIONALES (100+) ════════════════════════════════ */

const MARIACHI_KEYWORDS_INFORMACIONALES: readonly string[] = [
    'cuanto cuesta contratar un mariachi',
    'cuanto cuesta un mariachi en espana',
    'cuanto cobra un mariachi por hora',
    'precio de un mariachi para boda',
    'precio de un mariachi para serenata',
    'cuanto cuesta un mariachi a domicilio',
    'que es un mariachi',
    'que es la musica mariachi',
    'historia del mariachi',
    'origen del mariachi',
    'cuantos integrantes tiene un mariachi',
    'que instrumentos tiene un mariachi',
    'que instrumentos usa un mariachi',
    'como se viste un mariachi',
    'traje de charro que es',
    'como reservar un mariachi',
    'como contratar un mariachi',
    'como funciona la reserva con deposito',
    'que es el deposito de 100 euros',
    'que es el precio cerrado',
    'que canciones canta un mariachi',
    'repertorio de un mariachi',
    'canciones tipicas de mariachi',
    'las mananitas letra',
    'como se canta las mananitas',
    'cuanto dura una serenata',
    'cuantas canciones canta una serenata',
    'que es una serenata',
    'como organizar una serenata',
    'como sorprender con un mariachi',
    'ideas para contratar un mariachi',
    'mariachi para san valentin ideas',
    'mariachi para regalar ideas',
    'cuando contratar un mariachi',
    'cuanto tiempo antes reservar un mariachi',
    'que diferencia hay entre mariachi y rondalla',
    'que diferencia hay entre trio y mariachi',
    'mariachi vs grupo norteno',
    'mexicano vs mariachi',
    'que es un charro',
    'que es una charra',
    'que es un guitarrón',
    'que es una vihuela',
    'que es un huapango',
    'que es una ranchera',
    'que es un bolero ranchero',
    'mejores mariachis de espana',
    'mejores mariachis de madrid',
    'como elegir un buen mariachi',
    'que preguntar antes de contratar un mariachi',
    'que incluye el precio de un mariachi',
    'el mariachi lleva equipo de sonido',
    'cuanto espacio necesita un mariachi',
    'mariachi en exteriores o interiores',
    'normativa de ruido para mariachi',
    'limite de decibelios en bodas',
    'rider acustico que es',
    'que es el rider de un artista',
    'mariachi en fincas requisitos',
    'certificado acustico para fincas',
    'ley del ruido 37 2003 bodas',
    'quien es edwin agudelo',
    'edwin agudelo mariachi',
    'mariachi imperial edwin agudelo',
    'mariachi voces de gala',
    'mariachi femenino',
    'mariachi mixto',
    'mariachi para bodas civiles',
    'mariachi para misa panamericana',
    'mariachi para boda catolica',
    'mariachi para ceremonia religiosa',
    'canciones romanticas de mariachi',
    'boleros para boda',
    'rancheras para boda',
    'musica mexicana para boda',
    'musica mariachi moderna',
    'mariachi con canciones modernas',
    'mariachi version canciones actuales',
    'cuanto se paga por adelantado un mariachi',
    'se puede pagar con tarjeta un mariachi',
    'mariachi factura iva',
    'mariachi contrato',
    'contrato de actuacion mariachi',
    'garantia de actuacion mariachi',
    'que pasa si cancela el mariachi',
    'politica de cancelacion mariachi',
    'reembolso deposito mariachi',
    'el deposito es deducible',
    'como se calcula el desplazamiento del mariachi',
    'cuanto cobra un mariachi por kilómetro',
    'mariachi a cuantos km se desplaza',
    'mariachi cobertura nacional',
    'mariachi en tu ciudad',
    'mariachi cerca de mi',
    'mariachi disponible hoy',
    'mariachi con disponibilidad inmediata',
    'mariachi para fin de semana',
    'mariachi para navidad',
    'mariachi para nochevieja',
    'regalar un mariachi',
    'mariachi como regalo',
    'mariachi experiencia regalo',
    'mariachi pack regalo',
    'cuanto cuesta regalar una serenata',
    'cuanto cuesta un mariachi para cumpleanos',
    'cuanto cuesta un mariachi para empresa',
    'cuanto cuesta un mariachi para fiesta patronal',
];

/* ════════════════════════════ 4. SITUACIONES / OCASIONES (50+) ════════════════════════════ */

const MARIACHI_SITUACIONES: readonly string[] = [
    'serenata',
    'show sorpresa',
    'serenata san valentin',
    'regalo para suegra',
    'regalo para hermana',
    'regalo para tia',
    'regalo para abuela',
    'regalo para madre',
    'regalo para padre',
    'regalo para novia',
    'regalo para esposa',
    'regalo para amiga',
    'sorpresa de cumpleanos',
    'sorpresa de aniversario',
    'declaracion de amor',
    'pedida de mano sorpresa',
    'reconciliacion',
    'pedir perdon',
    'bienvenida',
    'despedida',
    'despedida de soltera',
    'despedida de soltero',
    'homenaje',
    'jubilacion',
    'nacimiento de un bebe',
    'baby shower',
    'bautizo',
    'primera comunion',
    'graduacion',
    'aprobar un examen',
    'nuevo empleo',
    'ascenso laboral',
    'apertura de negocio',
    'inauguracion',
    'aniversario de empresa',
    'cierre de ano',
    'navidad',
    'nochevieja',
    'ano nuevo',
    'reyes magos',
    'dia de la madre',
    'dia del padre',
    'dia de los enamorados',
    'dia de la mujer',
    'dia del abuelo',
    'cumpleanos sorpresa',
    'fiesta sorpresa',
    'cena romantica',
    'aniversario de novios',
    'aniversario de boda',
    'cena familiar',
    'reunion familiar',
    'brindis de empresa',
    'coctel de bienvenida',
    'recepcion de invitados',
];

/* ════════════════════════════ 5. ROLES / AFINIDADES (50+) ════════════════════════════ */

const MARIACHI_ROLES_AFINIDADES: readonly string[] = [
    'jefe',
    'amigo',
    'colega',
    'companero de trabajo',
    'novia',
    'novio',
    'esposa',
    'esposo',
    'madre',
    'padre',
    'suegra',
    'suegro',
    'hermana',
    'hermano',
    'tia',
    'tio',
    'abuela',
    'abuelo',
    'hija',
    'hijo',
    'nieta',
    'nieto',
    'prima',
    'primo',
    'cunada',
    'cunado',
    'madrina',
    'padrino',
    'ahijada',
    'ahijado',
    'clienta',
    'cliente',
    'jefa',
    'socia',
    'socio',
    'profesora',
    'profesor',
    'alumna',
    'alumno',
    'vecina',
    'vecino',
    'amiga',
    'mejor amiga',
    'mejor amigo',
    'pareja',
    'prometida',
    'prometido',
    'compadre',
    'comadre',
    'abuelita',
    'abuelito',
    'equipo de trabajo',
    'amiga del alma',
    'comandante de equipo',
    'su persona favorita',
];

/* ════════════════════════════ 6. SSOT GEO: CIUDADES Y PROVINCIAS ════════════════════════════ */

/**
 * Ciudades cabeceras ordenadas por volumen de contratación mensual
 * (mayor demanda primero). No es orden aleatorio: refleja la densidad de
 * búsqueda comercial de eventos en España.
 */
export const TOP_CIUDADES_MARIACHI: readonly string[] = [
    'Madrid',
    'Barcelona',
    'Valencia',
    'Sevilla',
    'Malaga',
    'Zaragoza',
    'Bilbao',
    'Murcia',
    'Alicante',
    'Granada',
    'Cordoba',
    'Valladolid',
    'Toledo',
    'Vigo',
    'A Coruna',
    'Gijon',
    'Palma de Mallorca',
    'Las Palmas',
    'Santa Cruz de Tenerife',
    'San Sebastian',
    'Pamplona',
    'Santander',
    'Burgos',
    'Salamanca',
    'Leon',
];

export const PROVINCIAS_ESPANA_MARIACHI: readonly string[] = [
    'Alava',
    'Albacete',
    'Alicante',
    'Almeria',
    'Asturias',
    'Avila',
    'Badajoz',
    'Barcelona',
    'Burgos',
    'Caceres',
    'Cadiz',
    'Cantabria',
    'Castellon',
    'Ciudad Real',
    'Cordoba',
    'Cuenca',
    'Girona',
    'Granada',
    'Guadalajara',
    'Guipuzcoa',
    'Huelva',
    'Huesca',
    'Illes Balears',
    'Jaen',
    'La Rioja',
    'Las Palmas',
    'Leon',
    'Lleida',
    'Lugo',
    'Madrid',
    'Malaga',
    'Murcia',
    'Navarra',
    'Ourense',
    'Palencia',
    'Pontevedra',
    'Salamanca',
    'Santa Cruz de Tenerife',
    'Segovia',
    'Sevilla',
    'Soria',
    'Tarragona',
    'Teruel',
    'Toledo',
    'Valencia',
    'Valladolid',
    'Vizcaya',
    'Zamora',
    'Zaragoza',
    'A Coruna',
    'Ceuta',
    'Melilla',
];

type KeywordTemplate = (loc: string) => string;

const LOCAL_TOP_CITY_TEMPLATES: readonly KeywordTemplate[] = [
    (loc) => `mariachis en ${loc}`,
    (loc) => `contratar mariachis en ${loc}`,
    (loc) => `mariachi a domicilio en ${loc}`,
    (loc) => `precio mariachi ${loc}`,
    (loc) => `serenata mariachi en ${loc}`,
];

const LOCAL_CORE_TEMPLATES: readonly KeywordTemplate[] = [
    (loc) => `mariachis en ${loc}`,
    (loc) => `mariachi a domicilio en ${loc}`,
];

/**
 * Construye los términos locales de forma determinista:
 *  1. Ciudades cabecera (mayor volumen) con plantillas enriquecidas.
 *  2. 52 provincias con plantillas base.
 *  3. Municipios SSOT con `searchIntentScore >= 88` (poblaciones de mayor
 *     demanda, equiparable a núcleos > 8k habitantes) con plantillas base.
 */
export function buildMariachiLocalKeywords(): readonly string[] {
    const out: string[] = [];

    for (const city of TOP_CIUDADES_MARIACHI) {
        for (const tpl of LOCAL_TOP_CITY_TEMPLATES) {
            out.push(tpl(city));
        }
    }

    for (const province of PROVINCIAS_ESPANA_MARIACHI) {
        for (const tpl of LOCAL_CORE_TEMPLATES) {
            out.push(tpl(province));
        }
    }

    const rankedMunicipalities = [...MUNICIPALITIES_DATABASE]
        .filter((m) => m.searchIntentScore >= 88)
        .sort((a, b) => b.searchIntentScore - a.searchIntentScore);

    const seenMunicipio = new Set<string>();
    for (const muni of rankedMunicipalities) {
        const key = muni.name.toLowerCase();
        if (seenMunicipio.has(key)) continue;
        seenMunicipio.add(key);
        for (const tpl of LOCAL_CORE_TEMPLATES) {
            out.push(tpl(muni.name));
        }
    }

    return dedupe(out);
}

/* ════════════════════════════ 7. UTILIDADES Y MATRIZ FINAL ════════════════════════════ */

function dedupe(items: readonly string[]): string[] {
    const seen = new Set<string>();
    const result: string[] = [];
    for (const item of items) {
        const key = item.trim().toLowerCase();
        if (!key || seen.has(key)) continue;
        seen.add(key);
        result.push(item.trim());
    }
    return result;
}

export const MARIACHI_LOCALES: readonly string[] = buildMariachiLocalKeywords();

export const MARIACHI_KEYWORD_MATRIX: MariachiKeywordMatrix = {
    transaccionales: MARIACHI_KEYWORDS_TRANSACCIONALES,
    locales: MARIACHI_LOCALES,
    eventos: MARIACHI_KEYWORDS_EVENTOS,
    informacionales: MARIACHI_KEYWORDS_INFORMACIONALES,
    situaciones: MARIACHI_SITUACIONES,
    rolesAfinidades: MARIACHI_ROLES_AFINIDADES,
};

/**
 * Lista plana consolidada (deduplicada) de todas las palabras clave.
 */
export const MARIACHI_KEYWORDS_ALL: readonly string[] = dedupe([
    ...MARIACHI_KEYWORDS_TRANSACCIONALES,
    ...MARIACHI_LOCALES,
    ...MARIACHI_KEYWORDS_EVENTOS,
    ...MARIACHI_KEYWORDS_INFORMACIONALES,
    ...MARIACHI_SITUACIONES,
    ...MARIACHI_ROLES_AFINIDADES,
]);

/**
 * Subconjunto representativo para la etiqueta metadata de la ruta `/mariachis`.
 * Prioriza transaccionales y locales (máxima intención de conversión).
 */
export const MARIACHI_KEYWORDS_METADATA: readonly string[] = dedupe([
    ...MARIACHI_KEYWORDS_TRANSACCIONALES.slice(0, 28),
    ...MARIACHI_LOCALES.slice(0, 24),
    ...MARIACHI_KEYWORDS_EVENTOS.slice(0, 16),
    ...MARIACHI_KEYWORDS_INFORMACIONALES.slice(0, 12),
]);

export function getMariachiKeywordsByIntent(
    intent: MariachiIntentCategory,
): readonly string[] {
    switch (intent) {
        case 'transaccional':
            return MARIACHI_KEYWORD_MATRIX.transaccionales;
        case 'local':
            return MARIACHI_KEYWORD_MATRIX.locales;
        case 'evento':
            return MARIACHI_KEYWORD_MATRIX.eventos;
        case 'informacional':
            return MARIACHI_KEYWORD_MATRIX.informacionales;
    }
}

/**
 * Verificador de integridad SSOT: confirma que la matriz supera los umbrales
 * mínimos de cobertura pSEO y que no existen duplicados por categoría.
 */
export function assertMariachiKeywordMatrixIntegrity(): MariachiKeywordIntegrityReport {
    const violations: string[] = [];
    const sizes = {
        transaccionales: MARIACHI_KEYWORD_MATRIX.transaccionales.length,
        locales: MARIACHI_KEYWORD_MATRIX.locales.length,
        eventos: MARIACHI_KEYWORD_MATRIX.eventos.length,
        informacionales: MARIACHI_KEYWORD_MATRIX.informacionales.length,
        situaciones: MARIACHI_KEYWORD_MATRIX.situaciones.length,
        rolesAfinidades: MARIACHI_KEYWORD_MATRIX.rolesAfinidades.length,
    };

    if (sizes.transaccionales < MIN_TRANSACCIONALES) {
        violations.push(`transaccionales < ${MIN_TRANSACCIONALES} (${sizes.transaccionales})`);
    }
    if (sizes.locales < MIN_LOCALES) {
        violations.push(`locales < ${MIN_LOCALES} (${sizes.locales})`);
    }
    if (sizes.eventos < MIN_EVENTOS) {
        violations.push(`eventos < ${MIN_EVENTOS} (${sizes.eventos})`);
    }
    if (sizes.informacionales < MIN_INFORMACIONALES) {
        violations.push(`informacionales < ${MIN_INFORMACIONALES} (${sizes.informacionales})`);
    }
    if (sizes.situaciones < MIN_SITUACIONES) {
        violations.push(`situaciones < ${MIN_SITUACIONES} (${sizes.situaciones})`);
    }
    if (sizes.rolesAfinidades < MIN_ROLES) {
        violations.push(`rolesAfinidades < ${MIN_ROLES} (${sizes.rolesAfinidades})`);
    }

    const checkDuplicates = (label: string, items: readonly string[]): void => {
        if (dedupe(items).length !== items.length) {
            violations.push(`duplicados en ${label}`);
        }
    };
    checkDuplicates('transaccionales', MARIACHI_KEYWORD_MATRIX.transaccionales);
    checkDuplicates('locales', MARIACHI_KEYWORD_MATRIX.locales);
    checkDuplicates('eventos', MARIACHI_KEYWORD_MATRIX.eventos);
    checkDuplicates('informacionales', MARIACHI_KEYWORD_MATRIX.informacionales);
    checkDuplicates('situaciones', MARIACHI_KEYWORD_MATRIX.situaciones);
    checkDuplicates('rolesAfinidades', MARIACHI_KEYWORD_MATRIX.rolesAfinidades);

    const total = MARIACHI_KEYWORDS_ALL.length;

    return {
        ok: violations.length === 0,
        total,
        ...sizes,
        violations,
    };
}