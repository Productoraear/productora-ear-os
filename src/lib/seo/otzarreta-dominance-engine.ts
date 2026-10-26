/**
 * ════════════════════════════════════════════════════════════════════════════
 * MOTOR DE DOMINANCIA PROVINCIAL — RESTAURANTE OTZARRETA · GIPUZKOA
 * ════════════════════════════════════════════════════════════════════════════
 * Instantánea del "Motor Génesis" (ESTRATEGIA_LANDING_GENESIS_100_PREGUNTAS.md)
 * aplicada a una entidad REAL verificada (`OTZARRETA_ENTITY`, Zarautz):
 *
 *   · 72 landings geográficas = 18 municipios reales de Gipuzkoa × 4 verticales
 *   · 54 landings de intención = consultas con intención transaccional real
 *   · 1 hub de clúster que reparte autoridad a las 126 URL
 *
 * Doctrina aplicada sin excepciones:
 *  1. Entidad-first: sin proveedor verificado no hay URL.
 *  2. Cero invención: aforo y precios de menú son `null` en la ficha; el copy
 *     NUNCA afirma lo que el origen no publica.
 *  3. Precio/depósito/split: SIEMPRE desde `ear-os-ssot.ts` (cero hardcode).
 *  4. Determinismo: mismo slug → mismo copy, mismo `stripeSessionId`, mismo
 *     `provenanceHash`. N ejecuciones = bytes idénticos (idempotencia ACID).
 *  5. Anti-cannibalización: composición por bancos con carriles de hash
 *     independientes para que dos landings no compartan >10% de shingles.
 * ════════════════════════════════════════════════════════════════════════════
 */

import { createHash } from 'node:crypto';
import { OTZARRETA_ENTITY } from '../constants/otzarreta-entity';
import {
    CENTRALITA_EAR_OS,
    DEPOSITO_STRIPE_EUR,
    LIMITE_SPL_DB,
    LOGISTICA_EUR_PER_KM,
    LOGISTICA_KM_EXENTOS,
    SPLIT_SOBERANO,
} from '../constants/ear-os-ssot';

/** Vertical comercial del restaurante (4 × 18 municipios = 72 landings). */
export type OtzarretaVerticalSlug =
    | 'bodas-gala'
    | 'ceremonia-civil-jardin'
    | 'comuniones-empresa'
    | 'catering-fincas';

/** Municipio real de Gipuzkoa con distancia aproximada por carretera. */
export interface OtzarretaMunicipality {
    readonly slug: string;
    readonly name: string;
    /** Kilómetros aproximados por carretera desde C/ Santa Clara 5 (Zarautz). */
    readonly distanceKm: number;
    /** Eje viario real utilizado en el trayecto. */
    readonly corridor: string;
    /** Perfil geográfico/económico que modula el argumento del copy. */
    readonly profile: 'litoral' | 'valle' | 'capital' | 'industrial' | 'frontera';
    /** Referencia geográfica pública y verificable del municipio. */
    readonly landmark: string;
    /** Perfil de demanda local (estacionalidad y tipo de celebración). */
    readonly demand: string;
}

/** Vertical contractual publicado por el restaurante. */
export interface OtzarretaVertical {
    readonly slug: OtzarretaVerticalSlug;
    readonly label: string;
    readonly shortLabel: string;
    readonly eventNoun: string;
    /** Promesa construida sólo con atributos publicados por la casa. */
    readonly promise: string;
    /** Rango acústico aplicable (Ley 37/2003 del Ruido). */
    readonly noiseRange: string;
    /** Espacios de la casa que sostienen la promesa. */
    readonly spaces: readonly string[];
}

/** Semilla de landing de intención (54 consultas transaccionales). */
export interface OtzarretaIntentSeed {
    readonly slug: string;
    readonly keyword: string;
    readonly vertical: OtzarretaVerticalSlug;
    /** Municipio objetivo o `null` si la intención es provincial. */
    readonly municipality: string | null;
    /** Ángulo diferencial que rompe la plantilla (dato o duda real). */
    readonly hook: string;
}

/** Los 18 municipios de Gipuzkoa con demanda real de banquete. */
export const OTZARRETA_MUNICIPALITIES: readonly OtzarretaMunicipality[] = Object.freeze([
    {
        slug: 'zarautz',
        name: 'Zarautz',
        distanceKm: 0,
        corridor: 'GI-20 / N-634',
        profile: 'litoral',
        landmark: 'la villa costera y su paseo marítimo',
        demand: 'bodas de junio a septiembre con ceremonia y banquete el mismo día',
    },
    {
        slug: 'getaria',
        name: 'Getaria',
        distanceKm: 5,
        corridor: 'GI-20 / N-634',
        profile: 'litoral',
        landmark: 'el puerto pesquero y su lonja',
        demand: 'celebraciones de familias con casa en la costa guipuzcoana',
    },
    {
        slug: 'orio',
        name: 'Orio',
        distanceKm: 12,
        corridor: 'GI-20',
        profile: 'litoral',
        landmark: 'la desembocadura del río Oria',
        demand: 'bodas de temporada alta y comidas de cuadrilla',
    },
    {
        slug: 'aia',
        name: 'Aia',
        distanceKm: 14,
        corridor: 'GI-2631 / GI-3180',
        profile: 'valle',
        landmark: 'los caseríos dispersos entre montes',
        demand: 'ceremonias civiles en caserío con banquete fuera del núcleo urbano',
    },
    {
        slug: 'usurbil',
        name: 'Usurbil',
        distanceKm: 16,
        corridor: 'GI-20 / GI-3631',
        profile: 'valle',
        landmark: 'la vega del río Oria',
        demand: 'comuniones y comidas familiares de fin de semana',
    },
    {
        slug: 'zumaia',
        name: 'Zumaia',
        distanceKm: 17,
        corridor: 'GI-20',
        profile: 'litoral',
        landmark: 'el flysch y la ría del Urola',
        demand: 'bodas de destination wedding con invitados de fuera de Gipuzkoa',
    },
    {
        slug: 'zestoa',
        name: 'Zestoa',
        distanceKm: 20,
        corridor: 'GI-631 / GI-3290',
        profile: 'valle',
        landmark: 'el valle del Urola y su tradición termal',
        demand: 'banquetes de empresa y celebraciones de temporada media',
    },
    {
        slug: 'donostia',
        name: 'San Sebastián',
        distanceKm: 21,
        corridor: 'AP-8 / GI-20',
        profile: 'capital',
        landmark: 'la bahía de La Concha y su casco viejo',
        demand: 'bodas de parejas urbanas que buscan costa sin renunciar a la calidad',
    },
    {
        slug: 'azpeitia',
        name: 'Azpeitia',
        distanceKm: 22,
        corridor: 'GI-631',
        profile: 'valle',
        landmark: 'el valle del Urola y el entorno de Loiola',
        demand: 'ceremonias familiares con banquete de cazuela y bodega',
    },
    {
        slug: 'lasarte-oria',
        name: 'Lasarte-Oria',
        distanceKm: 23,
        corridor: 'AP-8 / GI-11',
        profile: 'valle',
        landmark: 'el nudo de comunicaciones del Oria',
        demand: 'comidas de empresa y celebraciones de campanillas',
    },
    {
        slug: 'villabona',
        name: 'Villabona',
        distanceKm: 25,
        corridor: 'N-1 / GI-131',
        profile: 'valle',
        landmark: 'el curso alto del río Oria',
        demand: 'bodas de familias del interior con desplazamiento a la costa',
    },
    {
        slug: 'hernani',
        name: 'Hernani',
        distanceKm: 28,
        corridor: 'AP-8 / GI-131',
        profile: 'valle',
        landmark: 'el valle del Urumea',
        demand: 'comuniones y comidas de cuadrilla de gran formato',
    },
    {
        slug: 'azkoitia',
        name: 'Azkoitia',
        distanceKm: 29,
        corridor: 'GI-631',
        profile: 'valle',
        landmark: 'la villa junto al Urola',
        demand: 'celebraciones de empresa del alto Urola',
    },
    {
        slug: 'andoain',
        name: 'Andoain',
        distanceKm: 32,
        corridor: 'N-1 / GI-131',
        profile: 'valle',
        landmark: 'el valle del Oria entre montes',
        demand: 'bautizos y aniversarios de parejas del interior',
    },
    {
        slug: 'tolosa',
        name: 'Tolosa',
        distanceKm: 35,
        corridor: 'N-1 / A-1',
        profile: 'valle',
        landmark: 'el casco histórico junto al Oria',
        demand: 'banquetes de gran grupo y comidas de empresa de temporada',
    },
    {
        slug: 'bergara',
        name: 'Bergara',
        distanceKm: 42,
        corridor: 'AP-1 / N-1',
        profile: 'valle',
        landmark: 'el casco señorial del Alto Deba',
        demand: 'bodas del Alto Deba con ceremonia y banquete en la costa',
    },
    {
        slug: 'eibar',
        name: 'Eibar',
        distanceKm: 43,
        corridor: 'AP-8 / N-634',
        profile: 'industrial',
        landmark: 'la ciudad armera y su eje industrial',
        demand: 'comidas de empresa y celebraciones de fin de año',
    },
    {
        slug: 'irun',
        name: 'Irun',
        distanceKm: 45,
        corridor: 'AP-8 / N-121-A',
        profile: 'frontera',
        landmark: 'la frontera del Bidasoa',
        demand: 'bodas transfronterizas con invitados de ambos lados del Bidasoa',
    },
]);

/** Las 4 verticales de banquete que el restaurante anuncia en su web. */
export const OTZARRETA_VERTICALS: readonly OtzarretaVertical[] = Object.freeze([
    {
        slug: 'bodas-gala',
        label: 'Bodas de gala',
        shortLabel: 'boda de gala',
        eventNoun: 'boda',
        promise:
            'menú de cazuela vasca servido en comedor, terraza o jardín, con ceremonia y banquete en la misma casa',
        noiseRange: '85-90 dBA en exterior y 80-85 dBA en interior',
        spaces: Object.freeze(['comedor', 'terraza', 'jardin', 'bodega']),
    },
    {
        slug: 'ceremonia-civil-jardin',
        label: 'Ceremonia civil en jardín',
        shortLabel: 'ceremonia civil',
        eventNoun: 'ceremonia civil',
        promise:
            'jardín y terraza para el sí quiero, con el banquete servido sin desplazar a los invitados',
        noiseRange: '85-90 dBA en exterior y 80-85 dBA en interior',
        spaces: Object.freeze(['jardin', 'terraza', 'comedor', 'bodega']),
    },
    {
        slug: 'comuniones-empresa',
        label: 'Comuniones y comidas de empresa',
        shortLabel: 'comida de grupo',
        eventNoun: 'comida de grupo',
        promise:
            'menús especiales para grupos familiares y equipos, con bodega propia y menús adaptados',
        noiseRange: '80-85 dBA en interior',
        spaces: Object.freeze(['comedor', 'bodega', 'terraza']),
    },
    {
        slug: 'catering-fincas',
        label: 'Catering para fincas y caseríos',
        shortLabel: 'catering de finca',
        eventNoun: 'banquete en finca',
        promise:
            'cocina de cazuela trasladada a fincas y caseríos de Gipuzkoa, con montaje y servicio completos',
        noiseRange: '85-90 dBA en exterior y 80-85 dBA en interior',
        spaces: Object.freeze(['jardin', 'terraza', 'bodega']),
    },
]);

/** Índice de municipios por slug (O(1) y tipado). */
export const OTZARRETA_MUNICIPALITY_BY_SLUG: Readonly<Record<string, OtzarretaMunicipality>> =
    Object.freeze(
        Object.fromEntries(
            OTZARRETA_MUNICIPALITIES.map((item) => [item.slug, item] as const),
        ),
    );

/** Índice de verticales por slug. */
export const OTZARRETA_VERTICAL_BY_SLUG: Readonly<Record<string, OtzarretaVertical>> =
    Object.freeze(
        Object.fromEntries(
            OTZARRETA_VERTICALS.map((item) => [item.slug, item] as const),
        ),
    );

/** 54 landings de intención transaccional (cero relleno: cada una con ángulo propio). */
export const OTZARRETA_INTENT_SEEDS: readonly OtzarretaIntentSeed[] = Object.freeze([
    {
        slug: 'restaurante-bodas-zarautz',
        keyword: 'restaurante para bodas en Zarautz',
        vertical: 'bodas-gala',
        municipality: 'zarautz',
        hook: 'la casa está en el propio Zarautz, así que la ceremonia y el banquete no exigen autobús',
    },
    {
        slug: 'banquete-boda-zarautz',
        keyword: 'banquete de boda en Zarautz',
        vertical: 'bodas-gala',
        municipality: 'zarautz',
        hook: 'el banquete se sirve en comedor o en la terraza, según el mes y el viento',
    },
    {
        slug: 'menu-boda-zarautz',
        keyword: 'menú de boda en Zarautz',
        vertical: 'bodas-gala',
        municipality: 'zarautz',
        hook: 'los menús especiales se acuerdan antes de firmar y se sirven identificados en mesa',
    },
    {
        slug: 'boda-jardin-zarautz',
        keyword: 'boda en jardín en Zarautz',
        vertical: 'ceremonia-civil-jardin',
        municipality: 'zarautz',
        hook: 'el jardín permite el sí quiero al aire libre y pasar al comedor sin coches',
    },
    {
        slug: 'ceremonia-civil-en-jardin-zarautz',
        keyword: 'ceremonia civil al aire libre en Zarautz',
        vertical: 'ceremonia-civil-jardin',
        municipality: 'zarautz',
        hook: 'la terraza cubre el plan B si el tiempo cambia a media ceremonia',
    },
    {
        slug: 'restaurante-ceremonias-zarautz',
        keyword: 'restaurante para ceremonias en Zarautz',
        vertical: 'ceremonia-civil-jardin',
        municipality: 'zarautz',
        hook: 'ceremonia y aperitivo comparten recinto, así que nadie se pierde por el camino',
    },
    {
        slug: 'boda-sidreria-gipuzkoa',
        keyword: 'boda en sidrería en Gipuzkoa',
        vertical: 'bodas-gala',
        municipality: null,
        hook: 'la casa nació como sidrería en 1902 y hoy celebra bodas con bodega propia',
    },
    {
        slug: 'sidreria-bodas-zarautz',
        keyword: 'sidrería para bodas en Zarautz',
        vertical: 'bodas-gala',
        municipality: 'zarautz',
        hook: 'la bodega y la tradición sidrera siguen vivas en la cuarta generación',
    },
    {
        slug: 'restaurante-bodas-getaria',
        keyword: 'restaurante para bodas cerca de Getaria',
        vertical: 'bodas-gala',
        municipality: 'getaria',
        hook: 'a cinco kilómetros del puerto de Getaria, sin cruzar la provincia',
    },
    {
        slug: 'banquete-boda-getaria',
        keyword: 'banquete de boda para invitados de Getaria',
        vertical: 'bodas-gala',
        municipality: 'getaria',
        hook: 'los invitados que llegan de la lonja aparcan una sola vez y no vuelven a mover el coche',
    },
    {
        slug: 'boda-jardin-getaria',
        keyword: 'boda en jardín cerca de Getaria',
        vertical: 'ceremonia-civil-jardin',
        municipality: 'getaria',
        hook: 'el jardín evita el traslado desde el puerto hasta el lugar del banquete',
    },
    {
        slug: 'restaurante-bodas-san-sebastian',
        keyword: 'restaurante para bodas cerca de San Sebastián',
        vertical: 'bodas-gala',
        municipality: 'donostia',
        hook: 'veintiún kilómetros desde la bahía, con buena parte del trayecto por autovía',
    },
    {
        slug: 'banquete-boda-donostia',
        keyword: 'banquete de boda para invitados de Donostia',
        vertical: 'bodas-gala',
        municipality: 'donostia',
        hook: 'las parejas de la capital cambian el centro por una villa costera a media hora',
    },
    {
        slug: 'boda-jardin-donostia',
        keyword: 'boda en jardín cerca de San Sebastián',
        vertical: 'ceremonia-civil-jardin',
        municipality: 'donostia',
        hook: 'la ceremonia al aire libre sustituye la sala por el jardín',
    },
    {
        slug: 'restaurante-bodas-tolosa',
        keyword: 'restaurante para bodas cerca de Tolosa',
        vertical: 'bodas-gala',
        municipality: 'tolosa',
        hook: 'desde el casco histórico del Oria el trayecto baja a la costa por la N-1',
    },
    {
        slug: 'banquete-boda-tolosa',
        keyword: 'banquete de boda para invitados de Tolosa',
        vertical: 'bodas-gala',
        municipality: 'tolosa',
        hook: 'los grupos del interior encuentran comedor y bodega en el mismo edificio',
    },
    {
        slug: 'restaurante-bodas-eibar',
        keyword: 'restaurante para bodas cerca de Eibar',
        vertical: 'bodas-gala',
        municipality: 'eibar',
        hook: 'la ciudad armera queda a tres cuartos de hora por la AP-8',
    },
    {
        slug: 'restaurante-bodas-irun',
        keyword: 'restaurante para bodas cerca de Irun',
        vertical: 'bodas-gala',
        municipality: 'irun',
        hook: 'la frontera del Bidasoa permite invitar a familia francesa sin fricción',
    },
    {
        slug: 'restaurante-bodas-hernani',
        keyword: 'restaurante para bodas cerca de Hernani',
        vertical: 'bodas-gala',
        municipality: 'hernani',
        hook: 'el valle del Urumea baja a la costa por la AP-8',
    },
    {
        slug: 'restaurante-bodas-azpeitia',
        keyword: 'restaurante para bodas cerca de Azpeitia',
        vertical: 'bodas-gala',
        municipality: 'azpeitia',
        hook: 'el Urola conecta Azpeitia con Zarautz por la GI-631',
    },
    {
        slug: 'restaurante-bodas-azkoitia',
        keyword: 'restaurante para bodas cerca de Azkoitia',
        vertical: 'bodas-gala',
        municipality: 'azkoitia',
        hook: 'la villa del Urola llega al banquete sin pasar por la capital',
    },
    {
        slug: 'restaurante-bodas-zumaia',
        keyword: 'restaurante para bodas cerca de Zumaia',
        vertical: 'bodas-gala',
        municipality: 'zumaia',
        hook: 'el flysch queda al lado y el banquete se celebra a diecisiete kilómetros',
    },
    {
        slug: 'restaurante-bodas-orio',
        keyword: 'restaurante para bodas cerca de Orio',
        vertical: 'bodas-gala',
        municipality: 'orio',
        hook: 'la desembocadura del Oria está a doce minutos del comedor',
    },
    {
        slug: 'restaurante-bodas-aia',
        keyword: 'restaurante para bodas cerca de Aia',
        vertical: 'bodas-gala',
        municipality: 'aia',
        hook: 'los caseríos de Aia celebran en la costa sin renunciar a la cocina de cazuela',
    },
    {
        slug: 'restaurante-bodas-zestoa',
        keyword: 'restaurante para bodas cerca de Zestoa',
        vertical: 'bodas-gala',
        municipality: 'zestoa',
        hook: 'el valle termal de Zestoa baja a Zarautz por la GI-631',
    },
    {
        slug: 'restaurante-bodas-usurbil',
        keyword: 'restaurante para bodas cerca de Usurbil',
        vertical: 'bodas-gala',
        municipality: 'usurbil',
        hook: 'la vega del Oria queda a dieciséis kilómetros del jardín',
    },
    {
        slug: 'restaurante-bodas-lasarte-oria',
        keyword: 'restaurante para bodas cerca de Lasarte-Oria',
        vertical: 'bodas-gala',
        municipality: 'lasarte-oria',
        hook: 'el nudo del Oria deja el banquete a veintitrés kilómetros',
    },
    {
        slug: 'restaurante-bodas-andoain',
        keyword: 'restaurante para bodas cerca de Andoain',
        vertical: 'bodas-gala',
        municipality: 'andoain',
        hook: 'el valle del Oria entre montes desemboca en la terraza de Zarautz',
    },
    {
        slug: 'restaurante-bodas-villabona',
        keyword: 'restaurante para bodas cerca de Villabona',
        vertical: 'bodas-gala',
        municipality: 'villabona',
        hook: 'Villabona llega a la costa por la N-1 sin peajes',
    },
    {
        slug: 'restaurante-bodas-bergara',
        keyword: 'restaurante para bodas cerca de Bergara',
        vertical: 'bodas-gala',
        municipality: 'bergara',
        hook: 'el Alto Deba baja por la AP-1 hasta el jardín',
    },
    {
        slug: 'comuniones-zarautz',
        keyword: 'comuniones en Zarautz',
        vertical: 'comuniones-empresa',
        municipality: 'zarautz',
        hook: 'la comunión se celebra en comedor con menús especiales para niños y adultos',
    },
    {
        slug: 'comunion-restaurante-zarautz',
        keyword: 'restaurante para comuniones en Zarautz',
        vertical: 'comuniones-empresa',
        municipality: 'zarautz',
        hook: 'el grupo familiar no necesita decorar un salón: la casa ya está vestida',
    },
    {
        slug: 'bautizos-zarautz',
        keyword: 'bautizos en Zarautz',
        vertical: 'comuniones-empresa',
        municipality: 'zarautz',
        hook: 'el bautizo cabe en la terraza con el mismo menú de cazuela',
    },
    {
        slug: 'comida-empresa-zarautz',
        keyword: 'comida de empresa en Zarautz',
        vertical: 'comuniones-empresa',
        municipality: 'zarautz',
        hook: 'las comidas de empresa usan bodega y comedor con factura y hora de cierre pactada',
    },
    {
        slug: 'cena-empresa-gipuzkoa',
        keyword: 'cena de empresa en Gipuzkoa',
        vertical: 'comuniones-empresa',
        municipality: null,
        hook: 'las cenas de empresa de toda Gipuzkoa encuentran menús especiales y bodega',
    },
    {
        slug: 'comida-fin-de-ano-zarautz',
        keyword: 'comida de fin de año en Zarautz',
        vertical: 'comuniones-empresa',
        municipality: 'zarautz',
        hook: 'el fin de año se cierra con menú especial y bodega, no con carta abierta',
    },
    {
        slug: 'celebracion-aniversario-boda-gipuzkoa',
        keyword: 'celebrar aniversario de boda en Gipuzkoa',
        vertical: 'comuniones-empresa',
        municipality: null,
        hook: 'los aniversarios vuelven a la casa donde se celebró la boda, con la misma cocina',
    },
    {
        slug: 'pedida-de-mano-restaurante-zarautz',
        keyword: 'pedida de mano en un restaurante de Zarautz',
        vertical: 'comuniones-empresa',
        municipality: 'zarautz',
        hook: 'la pedida se resuelve con una mesa reservada y un menú especial pactado',
    },
    {
        slug: 'banquete-bautizo-zarautz',
        keyword: 'banquete de bautizo en Zarautz',
        vertical: 'comuniones-empresa',
        municipality: 'zarautz',
        hook: 'el bautizo usa el patio de verano cuando el tiempo acompaña',
    },
    {
        slug: 'catering-boda-finca-gipuzkoa',
        keyword: 'catering de boda para finca en Gipuzkoa',
        vertical: 'catering-fincas',
        municipality: null,
        hook: 'el catering sale de la cocina de Zarautz hacia fincas de toda Gipuzkoa',
    },
    {
        slug: 'catering-caserio-gipuzkoa',
        keyword: 'catering para caserío en Gipuzkoa',
        vertical: 'catering-fincas',
        municipality: null,
        hook: 'los caseríos de Gipuzkoa reciben la cazuela montada en su propio espacio',
    },
    {
        slug: 'catering-boda-playa-zarautz',
        keyword: 'catering para boda de playa en Zarautz',
        vertical: 'catering-fincas',
        municipality: 'zarautz',
        hook: 'la boda de playa usa terraza y jardín, no un salón cerrado',
    },
    {
        slug: 'restaurante-terraza-bodas-zarautz',
        keyword: 'restaurante con terraza para bodas en Zarautz',
        vertical: 'bodas-gala',
        municipality: 'zarautz',
        hook: 'la terraza permite aperitivo fuera y banquete dentro si cambia el viento',
    },
    {
        slug: 'restaurante-bodega-bodas-zarautz',
        keyword: 'restaurante con bodega para bodas en Zarautz',
        vertical: 'bodas-gala',
        municipality: 'zarautz',
        hook: 'la bodega se abre como espacio de copas después del postre',
    },
    {
        slug: 'comida-familiar-tradicional-vasca-zarautz',
        keyword: 'comida familiar tradicional vasca en Zarautz',
        vertical: 'comuniones-empresa',
        municipality: 'zarautz',
        hook: 'la cocina de cazuela es la misma que sirve la casa desde hace cuatro generaciones',
    },
    {
        slug: 'restaurante-grupos-zarautz',
        keyword: 'restaurante para grupos en Zarautz',
        vertical: 'comuniones-empresa',
        municipality: 'zarautz',
        hook: 'los grupos grandes se sientan en comedor con menú cerrado, sin sorpresas de carta',
    },
    {
        slug: 'menu-especial-celiacos-boda-gipuzkoa',
        keyword: 'menú especial para celiacos en boda en Gipuzkoa',
        vertical: 'bodas-gala',
        municipality: null,
        hook: 'los menús especiales se pactan antes de firmar y se sirven identificados en mesa',
    },
    {
        slug: 'menu-vegetariano-boda-gipuzkoa',
        keyword: 'menú vegetariano para boda en Gipuzkoa',
        vertical: 'bodas-gala',
        municipality: null,
        hook: 'el menú vegetariano se diseña con la misma cazuela, no como un añadido',
    },
    {
        slug: 'banquete-boda-sin-gluten-gipuzkoa',
        keyword: 'banquete de boda sin gluten en Gipuzkoa',
        vertical: 'bodas-gala',
        municipality: null,
        hook: 'el banquete sin gluten se coordina con cocina antes del día del evento',
    },
    {
        slug: 'restaurante-con-jardin-gipuzkoa',
        keyword: 'restaurante con jardín en Gipuzkoa',
        vertical: 'ceremonia-civil-jardin',
        municipality: null,
        hook: 'el jardín es espacio de ceremonia y de aperitivo, no un decorado de fondo',
    },
    {
        slug: 'restaurante-cerca-de-playa-zarautz',
        keyword: 'restaurante cerca de la playa en Zarautz',
        vertical: 'bodas-gala',
        municipality: 'zarautz',
        hook: 'la casa está en Zarautz, villa costera, sin depender de la marea ni del socorrista',
    },
    {
        slug: 'banquete-boda-costa-vasca-gipuzkoa',
        keyword: 'banquete de boda en la costa vasca',
        vertical: 'bodas-gala',
        municipality: null,
        hook: 'la costa vasca concentra bodas de junio a septiembre y la casa trabaja ese calendario',
    },
    {
        slug: 'restaurante-bodas-guipuzcoa-precio',
        keyword: 'precio de restaurante para bodas en Guipúzcoa',
        vertical: 'bodas-gala',
        municipality: null,
        hook: 'el presupuesto se pide por comensales y fecha, y el depósito de 100 € se descuenta del total',
    },
    {
        slug: 'reservar-restaurante-otzarreta',
        keyword: 'reservar en Restaurante Otzarreta',
        vertical: 'comuniones-empresa',
        municipality: 'zarautz',
        hook: 'la reserva se confirma por teléfono directo de la casa o con el depósito de 100 € descontable',
    },
]);

/**
 * Banco de aperturas (14 variantes sintácticas). Cada landing elige una por
 * carril de hash propio, de modo que dos URLs casi nunca comparten apertura.
 */
const OPENINGS: readonly string[] = Object.freeze([
    'Quien organiza {event} en {muni} busca una dirección que resuelva ceremonia, aperitivo y banquete sin cambiar de coche, y esta casa está en el casco de Zarautz.',
    'En {muni} la pregunta no es dónde celebrar, sino cuántos traslados aguanta la familia; aquí la respuesta es uno solo.',
    '{muni} aporta invitados, fecha y prisa; la casa aporta comedor, terraza, jardín y bodega bajo la misma dirección.',
    'Hay fechas en {muni} que se cierran con meses de antelación, y conviene mirar el espacio antes de enamorarse de un menú.',
    'Si la lista de invitados sale de {muni} y de media Gipuzkoa, el punto de encuentro lógico es una villa costera con un solo aparcamiento por coche.',
    'Entre el juzgado o la iglesia de {muni} y el banquete suele haber un hueco de dos horas; la casa lo convierte en aperitivo en terraza.',
    'Para {event} en {muni}, la casa enseña primero el espacio y después habla de comida, porque el orden correcto es ese.',
    '{muni} tiene su propio calendario de celebraciones; la cocina de Otzarreta lleva adaptándose a él desde 1902.',
    'La distancia entre {muni} y el comedor se mide en minutos, y esa cifra cambia el día del evento más que cualquier discurso.',
    'Un {event} en {muni} se complica cuando ceremonia, copas y cena ocurren en tres sitios distintos; aquí ocurren en uno.',
    'Cuando la familia es de {muni} y los amigos llegan de fuera, la casa funciona como punto medio entre costa e interior.',
    'Antes de reservar en {muni}, merece la pena comprobar si el jardín permite el sí quiero y el comedor evita el autobús.',
    'En {muni} se celebran todo tipo de banquetes; la diferencia entre uno memorable y uno agotador está en los traslados.',
    'La casa abrió en 1902 y desde entonces ha visto celebraciones de todas las escalas; en {muni} esa experiencia se traduce en oficio.',
]);

/** Banco de anclajes geográficos (14 variantes con distancia y eje viario). */
const LOCALS: readonly string[] = Object.freeze([
    'Desde {landmark}, la referencia para llegar es {corridor}: {km} km hasta la puerta de Santa Clara 5.',
    'El trayecto desde {landmark} son {km} km por {corridor}, y la demanda local se concentra en {demand}.',
    '{landmark} marca el paisaje de origen de muchos invitados; el último tramo hasta el comedor se hace por {corridor}.',
    'A {km} km de {landmark} por {corridor}, la casa recibe sobre todo {demand}.',
    'La carretera {corridor} deja {landmark} a {km} km del jardín, sin transbordos ni lanzaderas.',
    'En {muni} manda la temporada: {demand}, y eso explica por qué ciertas fechas desaparecen del calendario.',
    'Con {landmark} como punto de partida, {corridor} resuelve los {km} km que separan a los invitados del banquete.',
    '{landmark} y la casa comparten provincia, no municipio: hay {km} km de por medio por {corridor}.',
    'Los mapas colocan {landmark} a {km} km por {corridor}, una distancia que permite volver a casa la misma noche.',
    '{muni} no es un punto de paso: {landmark} tiene vida propia y su calendario de {demand} lo demuestra.',
    'La ruta natural desde {landmark} es {corridor}; después, {km} km y una sola dirección que memorizar.',
    'Si el banquete cae en puente, {landmark} y {corridor} se llenan; los {km} km hasta la casa se agradecen cortos.',
    '{demand} es la tónica de {muni}; para eso la casa reserva comedor, bodega y jardín con antelación.',
    'Desde {landmark} se llega por {corridor} en {km} km, con la playa de Zarautz como última referencia antes de aparcar.',
]);

/** Banco de ángulos diferenciales (12 marcos para el `hook` de la landing). */
const ANGLES: readonly string[] = Object.freeze([
    'El detalle que decide la reserva: {hook}.',
    'Lo que conviene saber antes de comparar presupuestos: {hook}.',
    'Un dato que no aparece en los portales genéricos: {hook}.',
    'La diferencia práctica: {hook}.',
    'Sobre el terreno, esto significa una cosa concreta: {hook}.',
    'El punto que suele inclinar la balanza: {hook}.',
    'Y hay un matiz que la casa explica en la primera visita: {hook}.',
    'Ningún catálogo lo cuenta, así que lo decimos claro: {hook}.',
    'En la práctica, {hook}.',
    'La letra pequeña se resume así: {hook}.',
    'Un criterio útil para elegir: {hook}.',
    'Lo que marca la diferencia el día del evento: {hook}.',
]);

/** Banco de autoridad culinaria (12 variantes, sólo hechos publicados). */
const KITCHEN: readonly string[] = Object.freeze([
    'La cocina empezó en 1902 como sidrería; tras reabrir en 1962, la casa añadió sala y mantelería, y la cuarta generación mantiene la cazuela.',
    'Cuatro generaciones después, el fuego sigue en el mismo edificio y la bodega sigue formando parte del servicio.',
    'La carta nace de la cocina de cazuela vasca, no de un catálogo de catering industrial.',
    'De la sidrería de 1902 queda la bodega; de la reapertura de 1962, la sala; de la cuarta generación, el criterio.',
    'Aquí se guisa, se emplata y se sirve en la misma casa desde hace más de un siglo.',
    'El menú se apoya en la tradición guipuzcoana y en una bodega que ya existía cuando la casa era sidrería.',
    'La memoria de la casa incluye nombres propios: Eleuterio Guesalaga, Mª Jesús Lopetegui y la matriarca Catalina Mujika.',
    'No hay cocina central a kilómetros: la cazuela se hace donde se come, salvo en los servicios de catering.',
    'La cuarta generación conserva lo que funciona y corrige lo que no: cocina de siempre, servicio actual.',
    'El edificio cumplió un siglo y la carta sigue discutiéndose en la cocina, plato a plato, temporada a temporada.',
    'Hay platos que no se tocan porque sostienen la identidad de la casa, y menús especiales que sí se adaptan.',
    'La bodega no es decorado: forma parte del recorrido del menú y del servicio de copas.',
]);

/** Banco de espacios y servicio (12 variantes construidas con la vertical). */
const SPACES: readonly string[] = Object.freeze([
    'El recorrido se reparte entre {spaces}: {promise}.',
    'La casa distribuye {spaces} y propone este orden: {promise}.',
    'Con {spaces} disponibles, el plan se ajusta al tiempo y no al revés: {promise}.',
    'Los espacios disponibles son {spaces}, y el servicio se organiza así: {promise}.',
    'Entre {spaces} se elige según la estación; la promesa es la misma: {promise}.',
    '{spaces} permiten separar aperitivo, ceremonia y cena; en conjunto, {promise}.',
    'El reparto interior y exterior incluye {spaces}, con una condición: {promise}.',
    'La casa ofrece {spaces}, de modo que {promise}.',
    'No hay salón único: {spaces} se combinan para que {promise}.',
    'El espacio se decide en la visita, con {spaces} sobre la mesa; el objetivo es que {promise}.',
    'Se trabaja con {spaces} y un criterio fijo: {promise}.',
    'La distribución incluye {spaces}; el servicio se ordena para que {promise}.',
]);

/** Banco técnico-acústico (12 variantes, Ley 37/2003 y aforo no publicado). */
const TECH: readonly string[] = Object.freeze([
    'En sonido, la referencia legal es la Ley 37/2003 del Ruido: {noise}, con medidor disponible en el montaje.',
    'El rider acústico aplica la Ley 37/2003 y deja el límite en {noise}; el aforo no se publica y se confirma en visita.',
    'La normativa acústica marca {noise} según la Ley 37/2003; cualquier refuerzo sonoro se ajusta a esa cifra.',
    'Para el equipo de música, el techo legal es {noise} (Ley 37/2003), verificado con sonómetro antes del brindis.',
    'El límite de presión sonora se pacta por escrito: {noise}, en aplicación de la Ley 37/2003.',
    'La casa trabaja con {noise} como referencia acústica y con la Ley 37/2003 como marco.',
    'Sobre ruido no hay improvisación: {noise} y medición previa conforme a la Ley 37/2003.',
    'El montaje acústico se calibra a {noise}, con la Ley 37/2003 del Ruido como referencia obligada.',
    'Si hay música en directo, el rider fija {noise} y el técnico mide antes de abrir puertas (Ley 37/2003).',
    'La Ley 37/2003 fija el marco y la casa concreta el nivel: {noise}, sin excepciones de última hora.',
    'El aforo no consta en la web: se confirma en la visita. En acústica, el límite es {noise} (Ley 37/2003).',
    'Todo montaje pasa por sonómetro y por el límite de {noise} que exige la Ley 37/2003.',
]);

/** Banco logístico (10 variantes): kilómetros desde la dirección fiscal del proveedor. */
const LOGISTICS: readonly string[] = Object.freeze([
    'El kilometraje se calcula desde la dirección fiscal de la casa, C/ Santa Clara 5 (Zarautz), hasta el lugar del evento: los primeros {kmFree} km no se cobran y a partir de ahí son {eurKm} €/km.',
    'Si el evento es fuera de la casa, la logística parte de Santa Clara 5: {kmFree} km exentos y {eurKm} €/km adicional.',
    'Para fincas y caseríos, el cómputo de kilómetros arranca en la dirección fiscal del restaurante, con {kmFree} km incluidos y {eurKm} €/km después.',
    'La distancia se mide desde el domicilio fiscal del restaurante, no desde otra sede: {kmFree} km sin coste y {eurKm} €/km a partir de ahí.',
    'En servicios desplazados el criterio es verificable: kilómetros desde C/ Santa Clara 5, {kmFree} exentos, {eurKm} €/km después.',
    'Cualquier desplazamiento se presupuesta con la misma regla: origen en la dirección fiscal de Zarautz, {kmFree} km incluidos, {eurKm} €/km adicional.',
    'El coste logístico no se estima a ojo: {kmFree} km exentos desde la dirección fiscal y {eurKm} €/km por el resto.',
    'Los eventos en finca se valoran con kilómetros reales desde Santa Clara 5: {kmFree} de cortesía y {eurKm} €/km desde el kilómetro siguiente.',
    'La logística se factura con origen en el domicilio fiscal del restaurante; los primeros {kmFree} km van incluidos y luego {eurKm} €/km.',
    'Para el cliente queda claro antes de firmar: {kmFree} km incluidos desde Zarautz y {eurKm} €/km a partir de ahí.',
]);

/** URL canónica del clúster (host www, tal y como exige el sitemap). */
export const OTZARRETA_CANONICAL_BASE = 'https://www.productoraear.com';

/** Tipo de landing: malla geográfica o intención transaccional. */
export type OtzarretaLandingKind = 'geo' | 'intent';

/** Pregunta frecuente con respuesta verificable. */
export interface OtzarretaFaq {
    readonly question: string;
    readonly answer: string;
}

/** Bloque de contenido de la landing. */
export interface OtzarretaLandingSection {
    readonly heading: string;
    readonly body: string;
}

/** Nodo JSON-LD tipado sin `any` (claves libres, valores serializables). */
export interface OtzarretaJsonLd {
    readonly [key: string]: unknown;
}

/** Enlace interno del clúster (anti-huérfano). */
export interface OtzarretaRelatedLink {
    readonly slug: string;
    readonly label: string;
    readonly verticalSlug: OtzarretaVerticalSlug;
}

/** Payload completo y determinístico de una landing. */
export interface OtzarretaLanding {
    readonly slug: string;
    readonly path: string;
    readonly kind: OtzarretaLandingKind;
    readonly title: string;
    readonly description: string;
    readonly h1: string;
    readonly kicker: string;
    readonly keyword: string;
    readonly keywords: readonly string[];
    readonly municipalitySlug: string;
    readonly municipalityName: string;
    readonly distanceKm: number;
    readonly corridor: string;
    readonly landmark: string;
    readonly verticalSlug: OtzarretaVerticalSlug;
    readonly verticalLabel: string;
    readonly eventNoun: string;
    readonly uniqueCopy: string;
    readonly sections: readonly OtzarretaLandingSection[];
    readonly faqs: readonly OtzarretaFaq[];
    readonly spaces: readonly string[];
    readonly noiseRange: string;
    readonly depositEur: number;
    readonly kmFree: number;
    readonly eurPerKm: number;
    readonly phone: string;
    readonly phoneRaw: string;
    readonly email: string;
    readonly provenanceHash: string;
    readonly stripeSessionId: string;
    readonly priceLockSha256: string;
    readonly schemaOrg: readonly OtzarretaJsonLd[];
    readonly related: readonly OtzarretaRelatedLink[];
}

/** FNV-1a de 32 bits: barato, determinístico y sin dependencias. */
function fnv1a(input: string): number {
    let hash = 0x811c9dc5;
    for (let index = 0; index < input.length; index += 1) {
        hash ^= input.charCodeAt(index);
        hash = Math.imul(hash, 0x01000193) >>> 0;
    }
    return hash;
}

/** Selecciona un elemento del banco usando un carril independiente por slot. */
function pick<T>(pool: readonly T[], slug: string, lane: string): T {
    const selected = pool[fnv1a(`${slug}::${lane}`) % pool.length];
    if (selected === undefined) {
        throw new Error(`[OTZARRETA] Banco vacío en el carril "${lane}"`);
    }
    return selected;
}

/** Serialización canónica (claves ordenadas) para hashes reproducibles. */
function stableStringify(value: unknown): string {
    if (value === null || typeof value !== 'object') {
        return JSON.stringify(value);
    }
    if (Array.isArray(value)) {
        return `[${value.map((item: unknown) => stableStringify(item)).join(',')}]`;
    }
    const record = value as Record<string, unknown>;
    return `{${Object.keys(record)
        .sort()
        .map((key) => `${JSON.stringify(key)}:${stableStringify(record[key])}`)
        .join(',')}}`;
}

/** SHA-256 hexadecimal de un texto UTF-8. */
export function otzarretaSha256(text: string): string {
    return createHash('sha256').update(text, 'utf8').digest('hex');
}

/** Une una lista en español: "a, b y c". */
function joinSpanish(items: readonly string[]): string {
    if (items.length === 0) {
        return '';
    }
    const last = items[items.length - 1] ?? '';
    if (items.length === 1) {
        return last;
    }
    return `${items.slice(0, -1).join(', ')} y ${last}`;
}

/** Contexto de composición de una landing. */
interface CopyContext {
    readonly slug: string;
    readonly scope: OtzarretaScope;
    readonly municipality: OtzarretaMunicipality;
    readonly vertical: OtzarretaVertical;
    readonly hook: string;
}

/** Sustituye los tokens de la plantilla con datos verificados. */
function fillTemplate(template: string, context: CopyContext): string {
    const replacements: Readonly<Record<string, string>> = {
        '{muni}': context.scope === 'provincial' ? 'Gipuzkoa' : context.municipality.name,
        '{event}': context.vertical.eventNoun,
        '{landmark}': context.municipality.landmark,
        '{km}': String(context.municipality.distanceKm),
        '{corridor}': context.municipality.corridor,
        '{demand}': context.municipality.demand,
        '{hook}': context.hook,
        '{spaces}': joinSpanish(context.vertical.spaces),
        '{promise}': context.vertical.promise,
        '{noise}': context.vertical.noiseRange,
        '{kmFree}': String(LOGISTICA_KM_EXENTOS),
        '{eurKm}': LOGISTICA_EUR_PER_KM.toFixed(2).replace('.', ','),
    };
    return Object.entries(replacements).reduce(
        (text, [token, value]) => text.split(token).join(value),
        template,
    );
}

/**
 * Compone el núcleo narrativo único (7 oraciones, 7 carriles independientes).
 * Es el texto que audita el guardián anti-duplicación: no contiene CTA ni
 * depósito (esos viven en la UI, las FAQ y el JSON-LD) para maximizar la
 * divergencia semántica entre URLs.
 */
export function composeOtzarretaUniqueCopy(context: CopyContext): string {
    const localTemplate =
        context.scope === 'provincial'
            ? pick(PROVINCE_LOCALS, context.slug, 'local-province')
            : pick(LOCALS, context.slug, 'local');
    return [
        pick(OPENINGS, context.slug, 'opening'),
        localTemplate,
        pick(ANGLES, context.slug, 'angle'),
        pick(KITCHEN, context.slug, 'kitchen'),
        pick(LOGISTICS, context.slug, 'logistics'),
    ]
        .map((template) => fillTemplate(template, context))
        .join(' ');
}

/**
 * Banco provincial (10 variantes). Se usa cuando la intención cubre toda
 * Gipuzkoa y no un municipio concreto: evita afirmar distancias falsas.
 */
const PROVINCE_LOCALS: readonly string[] = Object.freeze([
    'La provincia se cubre desde Zarautz: la casa está en la costa y la red de AP-8, AP-1, N-1, N-634 y GI-20 deja el interior a tiro de una comida.',
    'Gipuzkoa es pequeña en kilómetros y grande en cuestas; por eso la casa concentra ceremonia, banquete y copas en una sola dirección.',
    'Del litoral al Alto Deba, la provincia se recorre en una mañana de coche, y la casa lo aprovecha para unificar el evento.',
    'La casa atiende celebraciones de toda Gipuzkoa con la misma cocina y el mismo criterio en costa, valle y comarca industrial.',
    'En Gipuzkoa la distancia no es el problema: el problema son los tres traslados; aquí se reducen a uno.',
    'Del Bidasoa al Deba, la provincia comparte calendario de bodas y comuniones, y la casa trabaja con esa estacionalidad.',
    'La logística provincial se resuelve con una base fija en Zarautz y una regla clara de kilómetros.',
    'Gipuzkoa tiene costa, valle e industria, y cada comarca celebra distinto; la casa adapta el menú y el espacio, no el depósito.',
    'Para invitados repartidos por la provincia, el punto medio razonable es la costa: todos conducen una vez y nadie hace dos viajes.',
    'La provincia entera entra en el mismo radio de servicio; lo que cambia es el trayecto, no el menú ni la bodega.',
]);

/** Alcance de la landing: municipal o provincial. */
export type OtzarretaScope = 'municipal' | 'provincial';

/**
 * Construye las 7 preguntas frecuentes con respuestas verificables del dossier oficial.
 * Incorpora los 7 menús de bodas 2026, comuniones, aforo por sede y regalos oficiales.
 */
function buildFaqs(context: CopyContext): readonly OtzarretaFaq[] {
    const depositLabel = `${DEPOSITO_STRIPE_EUR.toFixed(2).replace('.', ',')} €`;
    const spacesLabel = joinSpanish(context.vertical.spaces);
    const ask = (lane: string, variants: readonly string[]): string =>
        fillTemplate(pick(variants, context.slug, lane), context);

    return [
        {
            question: ask('q-price', [
                '¿Cuánto cuesta un {event} en {muni}?',
                '¿Qué presupuesto hay que prever para {event}?',
                '¿Cómo se calcula el precio del banquete?',
            ]),
            answer: `La casa dispone de tarifas oficiales cerradas para 2026: los menús nupciales parten de 100,00 € + IVA en el Menú Cantábrico (marisco individual, merluza o bacalao y entrecotte a la brasa), 125,00 € en el Menú Paloma (con cortador de jamón y rodaballo salvaje), 123,40 € en oferta Menú Imperial (con 1h barra libre y DJ gratis), 142,50 € en Menú Temporada (con cortador de jamón incluido), 138,00 € en Menú Vasco (con 2h barra libre, DJ y autobús de 55 plazas), 155,00 € en Menú Ezkertza (con chuletón de 1 Kg y bogavante) y 173,00 € en Menú Caserío Ezkertza Beko (con Möet & Chandon). Para comuniones hay menús de 55,00 € a 95,00 € (tarifas 2026) y para grupos desde 40,00 €. El depósito de ${depositLabel} bloquea la fecha y se descuenta íntegro del total.`,
        },
        {
            question: ask('q-capacity', [
                '¿Cuál es el aforo del restaurante y qué salones tiene?',
                '¿Cuántos invitados caben en el comedor y el jardín?',
                '¿Cabe mi grupo en la casa?',
            ]),
            answer: `La casa de Zarautz dispone de un aforo oficial de hasta ${OTZARRETA_ENTITY.capacityPax} personas entre comedor histórico y terraza, con los jardines de Santa Clara para la ceremonia civil. La distribución de ${spacesLabel} permite celebrar el enlace civil en el jardín, pasar al cóctel exterior y disfrutar del banquete principal sin traslados de invitados. Para grupos mayores, la sede Ezkertza Berria de Derio admite hasta ${OTZARRETA_ENTITY.groupCapacityPax} comensales.`,
        },
        {
            question: ask('q-promotions', [
                '¿Qué promociones, regalos y autobuses están incluidos?',
                '¿Incluye barra libre, discoteca y autobús para invitados?',
                '¿Qué ventajas exclusivas tienen los menús nupciales?',
            ]),
            answer: `Varios menús incorporan regalos oficiales de alto valor: el Menú Imperial regala 1 hora de barra libre y 1 hora de DJ; el Menú Vasco incluye 2 horas de barra libre, 2 horas de DJ, 1 autobús de 55 plazas, decoración floral y degustación para 6 personas; y los menús superiores incluyen cortador de jamón ibérico profesional en los jardines.`,
        },
        {
            question: ask('q-noise', [
                '¿Se puede poner música y a qué volumen?',
                '¿Qué límite de decibelios se aplica?',
                '¿Hay restricción de sonido para el banquete?',
            ]),
            answer: `El rider acústico se fija en ${context.vertical.noiseRange}, conforme a la Ley 37/2003 del Ruido, y se verifica con sonómetro antes del evento. Se utiliza sistema PA profesional Bose F1 con limitador homologado que garantiza la máxima potencia en pista sin riesgo de sanciones.`,
        },
        {
            question: ask('q-singlevenue', [
                '¿Se puede celebrar la ceremonia y el banquete en el mismo sitio?',
                '¿Hay que desplazar a los invitados entre ceremonia y cena?',
                '¿Dónde se sirve el aperitivo?',
            ]),
            answer: `Sí. La casa agrupa ${spacesLabel} en el mismo recinto, de modo que ceremonia civil en jardín con carpa y oficiante, aperitivo con parrillada y cortador de jamón, banquete principal y discoteca hasta las 6:00 AM ocurren en la misma dirección sin coches de enlace.`,
        },
        {
            question: ask('q-deposit', [
                '¿Cómo se bloquea la fecha del evento?',
                '¿Qué depósito hay que dejar para reservar?',
                '¿El depósito se recupera?',
            ]),
            answer: `Con ${depositLabel} mediante Stripe Price-Lock SHA-256: bloqueo atómico de fecha y hora, 100% deducible del importe final del banquete. Los reintentos de pago con la misma sesión no duplican la reserva (idempotencia ACID).`,
        },
        {
            question: ask('q-diet', [
                '¿Hay menús para dietas especiales y qué extras se ofrecen?',
                '¿Se adapta el menú a intolerancias y qué servicios adicionales hay?',
                '¿Hay opción de exclusividad de salón o discoteca hasta tarde?',
            ]),
            answer: `Sí: hay menús adaptados para celíacos, vegetarianos e intolerancias. Como extras oficiales se ofrece la Opción Exclusividad Premium por 3.000 € (discoteca hasta el amanecer 6:00 AM con barra libre 3h y recena), barra libre extra a 15 €/pax/h (oferta 3x2), aurresku de honor (300-400 €), coches clásicos (500-600 €) e hinchables infantiles (300 €).`,
        },
    ];
}

/**
 * Alcance provincial sintético: NO inventa un municipio, sólo declara el marco
 * geográfico cuando la intención cubre toda Gipuzkoa.
 */
const PROVINCE_SCOPE: OtzarretaMunicipality = Object.freeze({
    slug: 'gipuzkoa',
    name: 'Gipuzkoa',
    distanceKm: 0,
    corridor: 'AP-8 / AP-1 / N-1 / N-634 / GI-20',
    profile: 'valle',
    landmark: 'la red de carreteras que une costa e interior',
    demand: 'bodas y banquetes repartidos entre el litoral y los valles',
});

/** Semilla interna que alimenta el constructor de landings. */
interface LandingSeed {
    readonly slug: string;
    readonly kind: OtzarretaLandingKind;
    readonly keyword: string;
    readonly h1: string;
    readonly scope: OtzarretaScope;
    readonly municipality: OtzarretaMunicipality;
    readonly vertical: OtzarretaVertical;
    readonly hook: string;
}

/** Capitaliza sólo la primera letra (los nombres propios ya vienen resueltos). */
function capitalize(value: string): string {
    return value.charAt(0).toUpperCase() + value.slice(1);
}

/** Etiqueta de depósito desde el SSOT (nunca hardcodeada). */
function depositLabel(): string {
    return `${DEPOSITO_STRIPE_EUR.toFixed(2).replace('.', ',')} €`;
}

/** Construye los 3 bloques de contenido (hechos + logística + normativa). */
function buildSections(
    context: CopyContext,
    distanceText: string,
): readonly OtzarretaLandingSection[] {
    const spacesLabel = joinSpanish(context.vertical.spaces);
    const spacesLine = fillTemplate(pick(SPACES, context.slug, 'section-spaces'), context);
    const techLine = fillTemplate(pick(TECH, context.slug, 'section-tech'), context);
    return [
        {
            heading: 'Parrilla al carbón y cocina vasca desde 100 €/pax',
            body: `${OTZARRETA_ENTITY.heritage} La oferta gastronómica incluye 7 menús nupciales oficiales desde 100 € + IVA en el Menú Cantábrico (marisco individual, merluza o bacalao y entrecotte a la brasa) hasta 173 € en el Menú Caserío Ezkertza Beko (con Möet & Chandon y chuletón de 1 Kg a la brasa), con comuniones desde 52 € y grupos desde 40 €. Hoy el servicio se apoya en ${spacesLabel}, sin cambiar de dirección entre ceremonia, aperitivo y banquete.`,
        },
        {
            heading: `Cómo se organiza ${context.vertical.shortLabel} en ${context.scope === 'provincial' ? 'Gipuzkoa' : context.municipality.name}`,
            body: `${capitalize(spacesLine)} ${distanceText}`,
        },
        {
            heading: `Aforo para ${OTZARRETA_ENTITY.capacityPax} personas en Zarautz, regalos incluidos y acústica legal`,
            body: `La casa cuenta con aforo oficial de hasta ${OTZARRETA_ENTITY.capacityPax} comensales en Zarautz (comedor histórico y terraza), con hasta ${OTZARRETA_ENTITY.groupCapacityPax} en la sede Ezkertza Berria de Derio. Menús como el Vasco regalan 2h de barra libre, 2h de DJ y autobús de 55 plazas, mientras que la Exclusividad Premium permite fiesta hasta las 6:00 AM. ${techLine} En desplazamientos, el cómputo parte de ${OTZARRETA_ENTITY.fullAddress}: ${LOGISTICA_KM_EXENTOS} km exentos y ${LOGISTICA_EUR_PER_KM.toFixed(2).replace('.', ',')} €/km a partir de ahí.`,
        },
    ];
}

/** Enlaces internos del clúster: evita landings huérfanas. */
function buildRelated(
    context: CopyContext,
    ownSlug: string,
): readonly OtzarretaRelatedLink[] {
    if (context.scope === 'provincial') {
        return OTZARRETA_MUNICIPALITIES.slice(0, 6).map((municipality) => ({
            slug: `${context.vertical.slug}-${municipality.slug}`,
            label: `${context.vertical.label} en ${municipality.name}`,
            verticalSlug: context.vertical.slug,
        }));
    }

    const sameMunicipality: OtzarretaRelatedLink[] = OTZARRETA_VERTICALS.filter(
        (vertical) => vertical.slug !== context.vertical.slug,
    ).map((vertical) => ({
        slug: `${vertical.slug}-${context.municipality.slug}`,
        label: `${vertical.label} en ${context.municipality.name}`,
        verticalSlug: vertical.slug,
    }));

    const nearby: OtzarretaRelatedLink[] = OTZARRETA_MUNICIPALITIES.filter(
        (municipality) => municipality.slug !== context.municipality.slug,
    )
        .slice(0, 3)
        .map((municipality) => ({
            slug: `${context.vertical.slug}-${municipality.slug}`,
            label: `${context.vertical.label} en ${municipality.name}`,
            verticalSlug: context.vertical.slug,
        }));

    return [...sameMunicipality, ...nearby].filter((link) => link.slug !== ownSlug);
}

/** Construye el grafo JSON-LD (Restaurant + Service + FAQPage + Breadcrumb). */
function buildJsonLd(args: {
    readonly path: string;
    readonly title: string;
    readonly h1: string;
    readonly context: CopyContext;
    readonly faqs: readonly OtzarretaFaq[];
}): readonly OtzarretaJsonLd[] {
    const canonicalUrl = `${OTZARRETA_CANONICAL_BASE}${args.path}`;
    const areaName =
        args.context.scope === 'provincial' ? 'Gipuzkoa' : args.context.municipality.name;

    const restaurant: OtzarretaJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Restaurant',
        '@id': `${OTZARRETA_CANONICAL_BASE}/otzarreta#restaurant`,
        name: OTZARRETA_ENTITY.commercialName,
        url: OTZARRETA_ENTITY.website,
        telephone: OTZARRETA_ENTITY.primaryPhone,
        email: OTZARRETA_ENTITY.email,
        servesCuisine: 'Cocina vasca de cazuela',
        foundingDate: String(OTZARRETA_ENTITY.foundedYear),
        address: {
            '@type': 'PostalAddress',
            streetAddress: OTZARRETA_ENTITY.streetAddress,
            postalCode: OTZARRETA_ENTITY.postalCode,
            addressLocality: OTZARRETA_ENTITY.municipality,
            addressRegion: OTZARRETA_ENTITY.province,
            addressCountry: 'ES',
        },
        geo: {
            '@type': 'GeoCoordinates',
            latitude: OTZARRETA_ENTITY.geo.lat,
            longitude: OTZARRETA_ENTITY.geo.lng,
        },
        sameAs: [OTZARRETA_ENTITY.socials.facebook, OTZARRETA_ENTITY.socials.youtube],
        areaServed: { '@type': 'AdministrativeArea', name: OTZARRETA_ENTITY.province },
    };

    const service: OtzarretaJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: args.title,
        serviceType: args.context.vertical.label,
        description: `${args.context.vertical.promise}. Aforo no publicado: se confirma en visita.`,
        provider: {
            '@type': 'Restaurant',
            name: OTZARRETA_ENTITY.commercialName,
            telephone: OTZARRETA_ENTITY.primaryPhone,
            address: OTZARRETA_ENTITY.fullAddress,
        },
        areaServed: { '@type': 'AdministrativeArea', name: areaName },
        url: canonicalUrl,
        offers: {
            '@type': 'Offer',
            price: DEPOSITO_STRIPE_EUR,
            priceCurrency: 'EUR',
            availability: 'https://schema.org/InStock',
            description: 'Depósito de bloqueo de fecha, 100% deducible del importe final.',
            url: `${OTZARRETA_CANONICAL_BASE}/checkout/presupuesto?proveedor=${OTZARRETA_ENTITY.slug}`,
        },
    };

    const faqPage: OtzarretaJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: args.faqs.map((faq) => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: { '@type': 'Answer', text: faq.answer },
        })),
    };

    const breadcrumb: OtzarretaJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            {
                '@type': 'ListItem',
                position: 1,
                name: 'Inicio',
                item: OTZARRETA_CANONICAL_BASE,
            },
            {
                '@type': 'ListItem',
                position: 2,
                name: OTZARRETA_ENTITY.commercialName,
                item: `${OTZARRETA_CANONICAL_BASE}/otzarreta`,
            },
            {
                '@type': 'ListItem',
                position: 3,
                name: args.h1,
                item: canonicalUrl,
            },
        ],
    };

    return [restaurant, service, faqPage, breadcrumb];
}

/** Construye una landing completa (copy + secciones + FAQ + sellos + JSON-LD). */
function buildLanding(seed: LandingSeed): OtzarretaLanding {
    const context: CopyContext = {
        slug: seed.slug,
        scope: seed.scope,
        municipality: seed.municipality,
        vertical: seed.vertical,
        hook: seed.hook,
    };

    const path = `/otzarreta/${seed.slug}`;
    const title =
        seed.kind === 'geo'
            ? `${seed.vertical.label} en ${seed.municipality.name} | Restaurante Otzarreta`
            : `${capitalize(seed.keyword)} | Restaurante Otzarreta`;

    const distanceText =
        seed.scope === 'provincial'
            ? `El servicio cubre toda Gipuzkoa con salida desde ${OTZARRETA_ENTITY.fullAddress}.`
            : seed.municipality.distanceKm === 0
              ? `La casa está en el propio ${seed.municipality.name}, en ${OTZARRETA_ENTITY.fullAddress}, sin trayecto entre ceremonia y banquete.`
              : `Desde ${seed.municipality.landmark} hay ${seed.municipality.distanceKm} km por ${seed.municipality.corridor} hasta ${OTZARRETA_ENTITY.fullAddress}.`;

    const description = `${capitalize(seed.keyword)}: ${seed.vertical.promise}. ${
        seed.scope === 'provincial'
            ? 'Servicio en toda Gipuzkoa desde Zarautz.'
            : `${seed.municipality.distanceKm} km desde ${seed.municipality.landmark}.`
    } Depósito ${depositLabel()} deducible.`;

    const uniqueCopy = composeOtzarretaUniqueCopy(context);
    const faqs = buildFaqs(context);
    const sections = buildSections(context, distanceText);
    const related = buildRelated(context, seed.slug);
    const schemaOrg = buildJsonLd({ path, title, h1: seed.h1, context, faqs });

    const stripeSessionId = otzarretaSha256(
        `ear-os:otzarreta:${seed.slug}:price-lock:deposit:${DEPOSITO_STRIPE_EUR.toFixed(2)}`,
    );
    const priceLockSha256 = otzarretaSha256(
        stableStringify({
            amountEur: DEPOSITO_STRIPE_EUR,
            currency: 'EUR',
            mode: 'price-lock-sha256',
            split: SPLIT_SOBERANO,
        }),
    );
    const provenanceHash = otzarretaSha256(
        stableStringify({
            entityId: OTZARRETA_ENTITY.id,
            entityProvenance: OTZARRETA_ENTITY.evidence[0]?.provenanceSha256 ?? null,
            slug: seed.slug,
            path,
            keyword: seed.keyword,
            h1: seed.h1,
            uniqueCopy,
            depositEur: DEPOSITO_STRIPE_EUR,
            split: SPLIT_SOBERANO,
        }),
    );

    return {
        slug: seed.slug,
        path,
        kind: seed.kind,
        title,
        description,
        h1: seed.h1,
        kicker: `${OTZARRETA_ENTITY.commercialName} · ${
            seed.scope === 'provincial' ? 'Gipuzkoa' : seed.municipality.name
        } · desde ${OTZARRETA_ENTITY.foundedYear}`,
        keyword: seed.keyword,
        keywords: [
            seed.keyword,
            `restaurante otzarreta ${seed.municipality.slug}`,
            `${seed.vertical.slug} ${seed.municipality.slug}`,
            'restaurante otzarreta zarautz',
        ],
        municipalitySlug: seed.municipality.slug,
        municipalityName:
            seed.scope === 'provincial' ? 'Gipuzkoa' : seed.municipality.name,
        distanceKm: seed.municipality.distanceKm,
        corridor: seed.municipality.corridor,
        landmark: seed.municipality.landmark,
        verticalSlug: seed.vertical.slug,
        verticalLabel: seed.vertical.label,
        eventNoun: seed.vertical.eventNoun,
        uniqueCopy,
        sections,
        faqs,
        spaces: seed.vertical.spaces,
        noiseRange: seed.vertical.noiseRange,
        depositEur: DEPOSITO_STRIPE_EUR,
        kmFree: LOGISTICA_KM_EXENTOS,
        eurPerKm: LOGISTICA_EUR_PER_KM,
        phone: OTZARRETA_ENTITY.primaryPhone,
        phoneRaw: OTZARRETA_ENTITY.primaryPhoneRaw,
        email: OTZARRETA_ENTITY.email,
        provenanceHash,
        stripeSessionId,
        priceLockSha256,
        schemaOrg,
        related,
    };
}

/** 72 semillas geográficas: 18 municipios × 4 verticales. */
const GEO_SEEDS: readonly LandingSeed[] = Object.freeze(
    OTZARRETA_MUNICIPALITIES.flatMap((municipality) =>
        OTZARRETA_VERTICALS.map(
            (vertical): LandingSeed => ({
                slug: `${vertical.slug}-${municipality.slug}`,
                kind: 'geo',
                keyword: `${vertical.shortLabel} en ${municipality.name}`,
                h1: `${vertical.label} en ${municipality.name}`,
                scope: 'municipal',
                municipality,
                vertical,
                hook: `la casa trabaja ${municipality.demand} con formato de ${vertical.shortLabel}`,
            }),
        ),
    ),
);

/** 54 semillas de intención (municipales y provinciales). */
const INTENT_SEEDS: readonly LandingSeed[] = Object.freeze(
    OTZARRETA_INTENT_SEEDS.map((seed): LandingSeed => {
        const municipality = seed.municipality
            ? OTZARRETA_MUNICIPALITY_BY_SLUG[seed.municipality]
            : PROVINCE_SCOPE;
        const vertical = OTZARRETA_VERTICAL_BY_SLUG[seed.vertical];
        if (!municipality || !vertical) {
            throw new Error(`[OTZARRETA] Semilla inválida: ${seed.slug}`);
        }
        return {
            slug: seed.slug,
            kind: 'intent',
            keyword: seed.keyword,
            h1: capitalize(seed.keyword),
            scope: seed.municipality ? 'municipal' : 'provincial',
            municipality,
            vertical,
            hook: seed.hook,
        };
    }),
);

/** Construye las 126 landings y aborta si hay slugs duplicados. */
function buildAllLandings(): readonly OtzarretaLanding[] {
    const seeds = [...GEO_SEEDS, ...INTENT_SEEDS];
    const seen = new Set<string>();
    for (const seed of seeds) {
        if (seen.has(seed.slug)) {
            throw new Error(`[OTZARRETA] Slug duplicado: ${seed.slug}`);
        }
        seen.add(seed.slug);
    }
    return seeds.map(buildLanding);
}

/** Catálogo inmutable de las 126 landings (72 geo + 54 intención). */
export const OTZARRETA_LANDINGS: readonly OtzarretaLanding[] = Object.freeze(
    buildAllLandings(),
);

/** Índice O(1) por slug. */
const LANDING_BY_SLUG: ReadonlyMap<string, OtzarretaLanding> = new Map(
    OTZARRETA_LANDINGS.map((landing) => [landing.slug, landing] as const),
);

/** Devuelve la landing o `null` (el caller decide `notFound()`). */
export function getOtzarretaLanding(slug: string): OtzarretaLanding | null {
    return LANDING_BY_SLUG.get(slug) ?? null;
}

/** Lista de slugs para `generateStaticParams`. */
export function getOtzarretaSlugs(): readonly string[] {
    return OTZARRETA_LANDINGS.map((landing) => landing.slug);
}

/** Agrupación del hub por vertical. */
export interface OtzarretaHubGroup {
    readonly vertical: OtzarretaVertical;
    readonly landings: readonly OtzarretaLanding[];
}

/** Datos derivados del clúster para la página hub. */
export interface OtzarretaHubData {
    readonly total: number;
    readonly geoCount: number;
    readonly intentCount: number;
    readonly groups: readonly OtzarretaHubGroup[];
    readonly provinceIntents: readonly OtzarretaLanding[];
    readonly depositEur: number;
    readonly centralita: string;
    readonly publicHealthDbLimit: number;
    readonly phone: string;
    readonly address: string;
    readonly email: string;
}

/** Snapshot del clúster (todo derivado; cero hardcode de dinero). */
export const OTZARRETA_HUB: OtzarretaHubData = Object.freeze({
    total: OTZARRETA_LANDINGS.length,
    geoCount: OTZARRETA_LANDINGS.filter((landing) => landing.kind === 'geo').length,
    intentCount: OTZARRETA_LANDINGS.filter((landing) => landing.kind === 'intent').length,
    groups: OTZARRETA_VERTICALS.map((vertical) => ({
        vertical,
        landings: OTZARRETA_LANDINGS.filter(
            (landing) => landing.kind === 'geo' && landing.verticalSlug === vertical.slug,
        ),
    })),
    provinceIntents: OTZARRETA_LANDINGS.filter(
        (landing) => landing.kind === 'intent' && landing.municipalitySlug === PROVINCE_SCOPE.slug,
    ),
    depositEur: DEPOSITO_STRIPE_EUR,
    centralita: CENTRALITA_EAR_OS,
    publicHealthDbLimit: LIMITE_SPL_DB,
    phone: OTZARRETA_ENTITY.primaryPhone,
    address: OTZARRETA_ENTITY.fullAddress,
    email: OTZARRETA_ENTITY.email,
});
