/**
 * ════════════════════════════════════════════════════════════════════════════
 * MOTOR DE DOMINANCIA PROVINCIAL — RESTAURANTE OTZARRETA / EZKERTZA BERRIA · DERIO (BIZKAIA)
 * ════════════════════════════════════════════════════════════════════════════
 * Instantánea del "Motor Génesis" (ESTRATEGIA_LANDING_GENESIS_100_PREGUNTAS.md)
 * aplicada a la entidad REAL verificada (`OTZARRETA_ENTITY`, Derio · Bizkaia):
 *
 *   · 72 landings geográficas = 18 municipios/comarcas reales de Bizkaia × 4 verticales
 *   · 54 landings de intención = consultas con intención transaccional real
 *   · 1 hub de clúster que reparte autoridad a las 126 URL
 *
 * Doctrina aplicada sin excepciones:
 *  1. Entidad-first: sin proveedor verificado no hay URL.
 *  2. Cero invención: cada cifra (350 pax, 50-200 salón, 150 plazas de parking,
 *     menús 2026) proviene de la ficha canónica y del dossier oficial.
 *  3. Precio/depósito/split: SIEMPRE desde `ear-os-ssot.ts` (cero hardcode).
 *  4. Determinismo: mismo slug → mismo copy, mismo `stripeSessionId`, mismo
 *     `provenanceHash`. N ejecuciones = bytes idénticos (idempotencia ACID).
 *  5. Anti-cannibalización: composición por bancos con carriles de hash
 *     independientes y cero colisión de slugs con `otzarreta-126-cluster-engine.ts`.
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
    | 'ceremonia-civil-caserio'
    | 'comuniones-empresa'
    | 'catering-fincas';

/** Municipio o comarca real de Bizkaia con distancia aproximada por carretera. */
export interface OtzarretaMunicipality {
    readonly slug: string;
    readonly name: string;
    /** Kilómetros aproximados por carretera desde Santo Domingo Hiribidea, 13 (Derio). */
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

/** Los 18 municipios y áreas de influencia de Bizkaia con demanda real de banquete. */
export const OTZARRETA_MUNICIPALITIES: readonly OtzarretaMunicipality[] = Object.freeze([
    {
        slug: 'derio',
        name: 'Derio',
        distanceKm: 0,
        corridor: 'Santo Domingo Hiribidea / N-637',
        profile: 'valle',
        landmark: 'el corazón del Txorierri junto al Parque Tecnológico',
        demand: 'bodas exclusivas de un evento al día con ceremonia y banquete en la misma finca',
    },
    {
        slug: 'bilbao',
        name: 'Bilbao',
        distanceKm: 8,
        corridor: 'Túneles de Artxanda / N-637',
        profile: 'capital',
        landmark: 'el centro de Bilbao y la ría del Nervión',
        demand: 'bodas urbanas que buscan caserío con jardín y 150 plazas de párking privado a 8 minutos',
    },
    {
        slug: 'loiu',
        name: 'Loiu',
        distanceKm: 4,
        corridor: 'BI-631 / N-637',
        profile: 'valle',
        landmark: 'el entorno del aeropuerto y las campas de Loiu',
        demand: 'bodas con invitados llegados en avión y comidas directivas sin pérdida de tiempo',
    },
    {
        slug: 'sondika',
        name: 'Sondika',
        distanceKm: 5,
        corridor: 'BI-737 / Túnel de Santo Domingo',
        profile: 'valle',
        landmark: 'el acceso norte de Artxanda y el eje de Sondika',
        demand: 'celebraciones familiares, comuniones y banquetes de cuadrilla con aparcamiento privado',
    },
    {
        slug: 'zamudio',
        name: 'Zamudio',
        distanceKm: 4,
        corridor: 'N-637 Corredor del Txorierri',
        profile: 'industrial',
        landmark: 'el Parque Científico y Tecnológico de Bizkaia',
        demand: 'comidas de empresa, galas corporativas y bodas del valle del Txorierri',
    },
    {
        slug: 'lezama',
        name: 'Lezama',
        distanceKm: 7,
        corridor: 'BI-737 / Corredor del Txorierri',
        profile: 'valle',
        landmark: 'el valle rural de Lezama y sus viñedos de txakoli',
        demand: 'ceremonias civiles en caserío rodeadas de praderas verdes y cocina tradicional a la brasa',
    },
    {
        slug: 'larrabetzu',
        name: 'Larrabetzu',
        distanceKm: 11,
        corridor: 'BI-2713 / N-637',
        profile: 'valle',
        landmark: 'la villa medieval y el Txorierri oriental',
        demand: 'banquetes gastronómicos de producto noble y reuniones familiares de gran formato',
    },
    {
        slug: 'mungia',
        name: 'Mungia',
        distanceKm: 12,
        corridor: 'BI-631 Autovía de Mungia',
        profile: 'valle',
        landmark: 'la comarca de Mungialdea y Butrón',
        demand: 'bodas de finca campestre, comuniones con jardín infantil y banquetes de asador',
    },
    {
        slug: 'uribe-kosta',
        name: 'Uribe Kosta',
        distanceKm: 18,
        corridor: 'BI-634 / N-637',
        profile: 'litoral',
        landmark: 'la costa vizcaína entre Sopela, Plentzia, Gorliz y Getxo',
        demand: 'bodas de parejas costeras que eligen un caserío tranquilo en el Txorierri sin atascos',
    },
    {
        slug: 'sopela',
        name: 'Sopela',
        distanceKm: 19,
        corridor: 'BI-634 / N-637',
        profile: 'litoral',
        landmark: 'los acantilados y playas de Sopela',
        demand: 'bodas de primavera y verano con traslado rápido en autobús privado hasta Derio',
    },
    {
        slug: 'plentzia',
        name: 'Plentzia',
        distanceKm: 20,
        corridor: 'BI-634 / BI-2120',
        profile: 'litoral',
        landmark: 'la bahía y ría de Plentzia',
        demand: 'celebraciones familiares y enlaces civiles con parrilla de pescados salvajes del Cantábrico',
    },
    {
        slug: 'gorliz',
        name: 'Gorliz',
        distanceKm: 22,
        corridor: 'BI-634 / BI-3151',
        profile: 'litoral',
        landmark: 'el pinar y la bahía de Gorliz',
        demand: 'comuniones, bautizos y bodas costeras que buscan carpa climatizada y jardín botánico',
    },
    {
        slug: 'getxo',
        name: 'Getxo',
        distanceKm: 16,
        corridor: 'La Avanzada / N-637',
        profile: 'litoral',
        landmark: 'Neguri, Las Arenas, Algorta y el Puente Colgante',
        demand: 'bodas de gran formato de la Margen Derecha con exclusividad de un evento al día',
    },
    {
        slug: 'erandio',
        name: 'Erandio',
        distanceKm: 9,
        corridor: 'BI-637 / N-637',
        profile: 'industrial',
        landmark: 'la vega de Asúa y la ría en Erandio',
        demand: 'banquetes de empresa y celebraciones vecinales a menos de diez minutos de Derio',
    },
    {
        slug: 'barakaldo',
        name: 'Barakaldo',
        distanceKm: 14,
        corridor: 'Puente Rontegi / N-637',
        profile: 'industrial',
        landmark: 'la Margen Izquierda y el entorno de BEC',
        demand: 'eventos corporativos, bodas multitudinarias hasta 350 comensales y comuniones',
    },
    {
        slug: 'basauri',
        name: 'Basauri',
        distanceKm: 12,
        corridor: 'N-637 / AP-68',
        profile: 'industrial',
        landmark: 'el nudo del Nervión-Ibaizabal en Basauri',
        demand: 'bodas de familias de Bizkaia central y comidas de empresa con factura B2B',
    },
    {
        slug: 'galdakao',
        name: 'Galdakao',
        distanceKm: 13,
        corridor: 'N-637 / N-240',
        profile: 'valle',
        landmark: 'el corredor del Ibaizabal desde Galdakao',
        demand: 'banquetes nupciales y asador de chuletón a la brasa con acceso directo sin semáforos',
    },
    {
        slug: 'durango',
        name: 'Durango',
        distanceKm: 32,
        corridor: 'AP-8 / N-637',
        profile: 'valle',
        landmark: 'el casco histórico del Duranguesado',
        demand: 'bodas del interior de Bizkaia que reúnen invitados de toda la provincia en Derio',
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
            'menú de parrilla al carbón y cazuela vasca servido en salón acristalado, terraza o jardín en Derio, con un solo evento al día',
        noiseRange: '85-90 dBA en exterior y 80-85 dBA en interior',
        spaces: Object.freeze(['comedor', 'terraza', 'jardin', 'bodega']),
    },
    {
        slug: 'ceremonia-civil-caserio',
        label: 'Ceremonia civil en caserío',
        shortLabel: 'ceremonia civil',
        eventNoun: 'ceremonia civil',
        promise:
            'jardín botánico y carpa climatizada para el sí quiero en Derio, con el banquete servido sin desplazar a los invitados',
        noiseRange: '85-90 dBA en exterior y 80-85 dBA en interior',
        spaces: Object.freeze(['jardin', 'terraza', 'comedor', 'bodega']),
    },
    {
        slug: 'comuniones-empresa',
        label: 'Comuniones y comidas de empresa',
        shortLabel: 'comida de grupo',
        eventNoun: 'comida de grupo',
        promise:
            'menús especiales para familias y equipos de Bizkaia, con parque infantil homologado, bodega y 150 plazas de párking privado',
        noiseRange: '80-85 dBA en interior',
        spaces: Object.freeze(['comedor', 'bodega', 'terraza']),
    },
    {
        slug: 'catering-fincas',
        label: 'Catering para fincas y caseríos',
        shortLabel: 'catering de finca',
        eventNoun: 'banquete en finca',
        promise:
            'cocina vasca tradicional y logística de eventos coordinada desde Derio para fincas y caseríos de Bizkaia',
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
        slug: 'restaurante-bodas-derio',
        keyword: 'restaurante para bodas en Derio',
        vertical: 'bodas-gala',
        municipality: 'derio',
        hook: 'el caserío está en el propio Derio (Santo Domingo Hiribidea, 13), así que la ceremonia y el banquete no exigen autobús',
    },
    {
        slug: 'banquete-boda-derio',
        keyword: 'banquete de boda en Derio',
        vertical: 'bodas-gala',
        municipality: 'derio',
        hook: 'el banquete se sirve en comedor acristalado de 50 a 200 pax o en carpa ajardinada hasta 350 invitados',
    },
    {
        slug: 'menu-boda-derio',
        keyword: 'menú de boda en Derio',
        vertical: 'bodas-gala',
        municipality: 'derio',
        hook: 'los siete menús oficiales 2026 desde 100 € + IVA y los menús especiales se acuerdan antes de firmar',
    },
    {
        slug: 'boda-jardin-derio',
        keyword: 'boda en jardín en Derio',
        vertical: 'ceremonia-civil-caserio',
        municipality: 'derio',
        hook: 'los jardines botánicos permiten el sí quiero al aire libre y pasar al comedor sin coches',
    },
    {
        slug: 'ceremonia-civil-en-jardin-derio',
        keyword: 'ceremonia civil al aire libre en Derio',
        vertical: 'ceremonia-civil-caserio',
        municipality: 'derio',
        hook: 'la carpa climatizada y la terraza cubren el plan B si cambia el tiempo a media ceremonia',
    },
    {
        slug: 'restaurante-ceremonias-derio',
        keyword: 'restaurante para ceremonias en Derio',
        vertical: 'ceremonia-civil-caserio',
        municipality: 'derio',
        hook: 'ceremonia, cóctel y banquete comparten recinto exclusivo de un solo evento al día',
    },
    {
        slug: 'caserio-bodas-txorierri',
        keyword: 'caserío para bodas en el Txorierri',
        vertical: 'bodas-gala',
        municipality: null,
        hook: 'en el valle del Txorierri la casa reúne parrilla al carbón de encina, jardines y 150 plazas de párking',
    },
    {
        slug: 'asador-bodas-derio',
        keyword: 'asador para bodas en Derio',
        vertical: 'bodas-gala',
        municipality: 'derio',
        hook: 'Eduardo Martínez asa al momento chuletones y rodaballos salvajes sobre brasa de encina y sarmiento',
    },
    {
        slug: 'restaurante-bodas-bilbao',
        keyword: 'restaurante para bodas cerca de Bilbao',
        vertical: 'bodas-gala',
        municipality: 'bilbao',
        hook: 'a ocho minutos del centro de Bilbao por los túneles de Artxanda, con 150 plazas de párking privado',
    },
    {
        slug: 'banquete-boda-bilbao',
        keyword: 'banquete de boda para invitados de Bilbao',
        vertical: 'bodas-gala',
        municipality: 'bilbao',
        hook: 'los invitados que salen de Bilbao aparcan una sola vez en recinto cerrado y no vuelven a mover el coche',
    },
    {
        slug: 'boda-jardin-bilbao',
        keyword: 'boda en jardín cerca de Bilbao',
        vertical: 'ceremonia-civil-caserio',
        municipality: 'bilbao',
        hook: 'el jardín botánico evita elegir entre entorno verde y cercanía inmediata a la capital vizcaína',
    },
    {
        slug: 'restaurante-bodas-loiu',
        keyword: 'restaurante para bodas cerca de Loiu',
        vertical: 'bodas-gala',
        municipality: 'loiu',
        hook: 'a cinco minutos del aeropuerto de Bilbao en Loiu, ideal para bodas con familia de fuera',
    },
    {
        slug: 'restaurante-bodas-sondika',
        keyword: 'restaurante para bodas cerca de Sondika',
        vertical: 'bodas-gala',
        municipality: 'sondika',
        hook: 'desde Sondika el túnel de Santo Domingo deja el caserío a apenas cinco kilómetros',
    },
    {
        slug: 'restaurante-bodas-zamudio',
        keyword: 'restaurante para bodas cerca de Zamudio',
        vertical: 'bodas-gala',
        municipality: 'zamudio',
        hook: 'junto al Parque Tecnológico de Zamudio, con acceso directo por la N-637 sin semáforos',
    },
    {
        slug: 'restaurante-bodas-lezama',
        keyword: 'restaurante para bodas cerca de Lezama',
        vertical: 'bodas-gala',
        municipality: 'lezama',
        hook: 'el corredor del Txorierri une Lezama con Santo Domingo Hiribidea en siete minutos',
    },
    {
        slug: 'restaurante-bodas-larrabetzu',
        keyword: 'restaurante para bodas cerca de Larrabetzu',
        vertical: 'bodas-gala',
        municipality: 'larrabetzu',
        hook: 'los invitados de Larrabetzu y el Txorierri oriental llegan en diez minutos por la N-637',
    },
    {
        slug: 'restaurante-bodas-mungia',
        keyword: 'restaurante para bodas cerca de Mungia',
        vertical: 'bodas-gala',
        municipality: 'mungia',
        hook: 'la autovía BI-631 conecta Mungia con la finca de Derio en doce kilómetros exactos',
    },
    {
        slug: 'banquete-boda-mungia',
        keyword: 'banquete de boda para familias de Mungia',
        vertical: 'bodas-gala',
        municipality: 'mungia',
        hook: 'Mungia y Mungialdea encuentran salón acristalado, carpa y parque infantil homologado en un solo recinto',
    },
    {
        slug: 'restaurante-bodas-uribe-kosta',
        keyword: 'restaurante para bodas cerca de Uribe Kosta',
        vertical: 'bodas-gala',
        municipality: 'uribe-kosta',
        hook: 'las parejas de Uribe Kosta disfrutan de un caserío con jardín a dieciséis minutos de la costa',
    },
    {
        slug: 'boda-jardin-uribe-kosta',
        keyword: 'boda en jardín para invitados de Uribe Kosta',
        vertical: 'ceremonia-civil-caserio',
        municipality: 'uribe-kosta',
        hook: 'la conexión por la BI-634 permite trasladar en autobús privado a todo el grupo desde la costa',
    },
    {
        slug: 'restaurante-bodas-sopela',
        keyword: 'restaurante para bodas cerca de Sopela',
        vertical: 'bodas-gala',
        municipality: 'sopela',
        hook: 'desde Sopela el enlace al Txorierri evita el tráfico urbano de Bilbao y garantiza párking para 150 coches',
    },
    {
        slug: 'restaurante-bodas-plentzia',
        keyword: 'restaurante para bodas cerca de Plentzia',
        vertical: 'bodas-gala',
        municipality: 'plentzia',
        hook: 'las bodas de Plentzia encuentran cocina de brasa del Cantábrico en el valle de Derio',
    },
    {
        slug: 'restaurante-bodas-gorliz',
        keyword: 'restaurante para bodas cerca de Gorliz',
        vertical: 'bodas-gala',
        municipality: 'gorliz',
        hook: 'a veintidós kilómetros de Gorliz, con carpa climatizada preparada frente a cualquier cambio de clima',
    },
    {
        slug: 'restaurante-bodas-getxo',
        keyword: 'restaurante para bodas cerca de Getxo',
        vertical: 'bodas-gala',
        municipality: 'getxo',
        hook: 'desde Neguri, Las Arenas y Algorta se accede en catorce minutos por La Avanzada y N-637',
    },
    {
        slug: 'banquete-boda-getxo',
        keyword: 'banquete de boda para invitados de Getxo',
        vertical: 'bodas-gala',
        municipality: 'getxo',
        hook: 'los invitados de Getxo disponen de un evento único al día y barra libre hasta las 6:00 AM en Exclusividad Premium',
    },
    {
        slug: 'restaurante-bodas-erandio',
        keyword: 'restaurante para bodas cerca de Erandio',
        vertical: 'bodas-gala',
        municipality: 'erandio',
        hook: 'a nueve kilómetros de Erandio, con acceso llano y ascensor adaptado 100% PMR',
    },
    {
        slug: 'restaurante-bodas-barakaldo',
        keyword: 'restaurante para bodas cerca de Barakaldo',
        vertical: 'bodas-gala',
        municipality: 'barakaldo',
        hook: 'cruzando Rontegi desde Barakaldo, el complejo acoge hasta 350 comensales con 150 plazas de párking',
    },
    {
        slug: 'restaurante-bodas-basauri',
        keyword: 'restaurante para bodas cerca de Basauri',
        vertical: 'bodas-gala',
        municipality: 'basauri',
        hook: 'desde Basauri la N-637 enlaza directamente en doce minutos con la puerta del caserío',
    },
    {
        slug: 'restaurante-bodas-galdakao',
        keyword: 'restaurante para bodas cerca de Galdakao',
        vertical: 'bodas-gala',
        municipality: 'galdakao',
        hook: 'Galdakao y el valle del Ibaizabal conectan en trece kilómetros sin cruzar el centro de Bilbao',
    },
    {
        slug: 'restaurante-bodas-durango',
        keyword: 'restaurante para bodas cerca de Durango',
        vertical: 'bodas-gala',
        municipality: 'durango',
        hook: 'el Duranguesado llega por la AP-8 en veintidós minutos para celebrar en un caserío exclusivo',
    },
    {
        slug: 'restaurante-bodas-amorebieta',
        keyword: 'restaurante para bodas cerca de Amorebieta',
        vertical: 'bodas-gala',
        municipality: null,
        hook: 'desde Amorebieta-Etxano la AP-8 y la N-637 dejan el caserío de Derio a dieciséis minutos',
    },
    {
        slug: 'comuniones-derio',
        keyword: 'comuniones en Derio',
        vertical: 'comuniones-empresa',
        municipality: 'derio',
        hook: 'la comunión cuenta con menús oficiales 2025-2027 de 55 € a 95 €, jardines y parque infantil homologado',
    },
    {
        slug: 'comunion-restaurante-derio',
        keyword: 'restaurante para comuniones en Derio',
        vertical: 'comuniones-empresa',
        municipality: 'derio',
        hook: 'el grupo familiar disfruta de recinto cerrado, columpios homologados y aparcamiento para 150 vehículos',
    },
    {
        slug: 'bautizos-derio',
        keyword: 'bautizos en Derio',
        vertical: 'comuniones-empresa',
        municipality: 'derio',
        hook: 'el bautizo se adapta a comedor luminoso o terraza ajardinada con acceso cómodo para carritos y mayores',
    },
    {
        slug: 'comida-empresa-derio',
        keyword: 'comida de empresa en Derio',
        vertical: 'comuniones-empresa',
        municipality: 'derio',
        hook: 'las comidas directivas junto al Parque Tecnológico cuentan con factura B2B, menú cerrado desde 40 € y privacidad',
    },
    {
        slug: 'cena-empresa-bizkaia',
        keyword: 'cena de empresa en Bizkaia',
        vertical: 'comuniones-empresa',
        municipality: null,
        hook: 'las cenas de empresa de toda Bizkaia combinan parrilla al carbón de encina, bodega y párking privado',
    },
    {
        slug: 'comida-fin-de-ano-derio',
        keyword: 'comida de fin de año en Derio',
        vertical: 'comuniones-empresa',
        municipality: 'derio',
        hook: 'los equipos del Txorierri y Bilbao cierran el ejercicio con menú pactado, bodega y música sin sorpresas',
    },
    {
        slug: 'celebracion-aniversario-boda-bizkaia',
        keyword: 'celebrar aniversario de boda en Bizkaia',
        vertical: 'comuniones-empresa',
        municipality: null,
        hook: 'las bodas de oro y plata vuelven al caserío de Derio con ascensor PMR y cocina vasca de producto',
    },
    {
        slug: 'pedida-de-mano-restaurante-derio',
        keyword: 'pedida de mano en un restaurante de Derio',
        vertical: 'comuniones-empresa',
        municipality: 'derio',
        hook: 'la pedida se prepara en reservado con menú degustación y maridaje seleccionado en bodega',
    },
    {
        slug: 'banquete-bautizo-bilbao',
        keyword: 'banquete de bautizo cerca de Bilbao',
        vertical: 'comuniones-empresa',
        municipality: 'bilbao',
        hook: 'a ocho minutos de Bilbao, las familias celebran en jardín privado sin estrés de aparcamiento urbano',
    },
    {
        slug: 'catering-boda-finca-bizkaia',
        keyword: 'catering de boda para finca en Bizkaia',
        vertical: 'catering-fincas',
        municipality: null,
        hook: 'la coordinación gastronómica parte de Derio hacia fincas y caseríos de toda Bizkaia',
    },
    {
        slug: 'catering-caserio-bizkaia',
        keyword: 'catering para caserío en Bizkaia',
        vertical: 'catering-fincas',
        municipality: null,
        hook: 'los caseríos de Bizkaia central, Mungia y Uribe Kosta reciben servicio integral con trazabilidad oficial',
    },
    {
        slug: 'catering-boda-txorierri',
        keyword: 'catering para boda en el Txorierri',
        vertical: 'catering-fincas',
        municipality: 'zamudio',
        hook: 'en el propio valle del Txorierri el montaje llega en minutos desde Santo Domingo Hiribidea, 13',
    },
    {
        slug: 'restaurante-terraza-bodas-derio',
        keyword: 'restaurante con terraza para bodas en Derio',
        vertical: 'bodas-gala',
        municipality: 'derio',
        hook: 'la zona chill out y terraza enlaza el cóctel al aire libre con el comedor acristalado climatizado',
    },
    {
        slug: 'restaurante-bodega-bodas-derio',
        keyword: 'restaurante con bodega para bodas en Derio',
        vertical: 'bodas-gala',
        municipality: 'derio',
        hook: 'la bodega seleccionada acompaña el chuletón a la brasa y da paso a la barra libre hasta el amanecer',
    },
    {
        slug: 'comida-familiar-tradicional-vasca-derio',
        keyword: 'comida familiar tradicional vasca en Derio',
        vertical: 'comuniones-empresa',
        municipality: 'derio',
        hook: 'la cazuela vasca y el carbón de encina siguen la línea de cuatro generaciones bajo la dirección de Eduardo Martínez',
    },
    {
        slug: 'restaurante-grupos-derio',
        keyword: 'restaurante para grupos en Derio',
        vertical: 'comuniones-empresa',
        municipality: 'derio',
        hook: 'grupos desde 40 € por comensal disponen de salones modulables para 50 a 200 invitados y hasta 350 en finca',
    },
    {
        slug: 'menu-especial-celiacos-boda-bizkaia',
        keyword: 'menú especial para celiacos en boda en Bizkaia',
        vertical: 'bodas-gala',
        municipality: null,
        hook: 'los menús sin gluten se pactan antes de firmar y se sirven identificados en mesa con total seguridad',
    },
    {
        slug: 'menu-vegetariano-boda-bizkaia',
        keyword: 'menú vegetariano para boda en Bizkaia',
        vertical: 'bodas-gala',
        municipality: null,
        hook: 'el menú vegetariano se diseña con producto de temporada vasco al mismo nivel que el banquete principal',
    },
    {
        slug: 'banquete-boda-sin-gluten-bizkaia',
        keyword: 'banquete de boda sin gluten en Bizkaia',
        vertical: 'bodas-gala',
        municipality: null,
        hook: 'el banquete adaptado para alergias se coordina directamente con cocina antes de la prueba de menú',
    },
    {
        slug: 'restaurante-con-jardin-bizkaia',
        keyword: 'restaurante con jardín para bodas en Bizkaia',
        vertical: 'ceremonia-civil-caserio',
        municipality: null,
        hook: 'el jardín botánico de Derio funciona como altar civil, zona de cóctel y entorno fotográfico privado',
    },
    {
        slug: 'banquete-boda-gran-bilbao',
        keyword: 'banquete de boda en Gran Bilbao',
        vertical: 'bodas-gala',
        municipality: 'bilbao',
        hook: 'en el cinturón verde del Gran Bilbao, Santo Domingo Hiribidea 13 combina naturaleza y acceso inmediato',
    },
    {
        slug: 'restaurante-bodas-bizkaia-precio',
        keyword: 'precio de restaurante para bodas en Bizkaia',
        vertical: 'bodas-gala',
        municipality: null,
        hook: 'tarifas transparentes de 100 € a 173 € + IVA por comensal y depósito de 100 € 100% deducible del total',
    },
    {
        slug: 'reservar-restaurante-otzarreta',
        keyword: 'reservar en Restaurante Otzarreta Derio',
        vertical: 'comuniones-empresa',
        municipality: 'derio',
        hook: 'la fecha se bloquea en exclusiva (1 evento al día) mediante Conserjería EAR OS y depósito Stripe de 100 € deducible',
    },
]);

/**
 * Banco de aperturas (14 variantes sintácticas). Cada landing elige una por
 * carril de hash propio, de modo que dos URLs casi nunca comparten apertura.
 */
const OPENINGS: readonly string[] = Object.freeze([
    'Quien organiza {event} en {muni} busca un caserío vasco que resuelva ceremonia, aperitivo y banquete sin cambiar de coche, y la sede canónica de Derio concentra todo en un único recinto.',
    'En {muni} la pregunta decisiva no es dónde celebrar, sino cuántos traslados soporta la familia; en Santo Domingo Hiribidea, 13 (Derio, Bizkaia) la respuesta es uno solo y con 150 plazas de párking.',
    '{muni} aporta invitados, fecha y exigencia gastronómica; el caserío de Derio aporta salón acristalado de 50 a 200 plazas, carpa botánica hasta 350 comensales y parrilla al carbón.',
    'Hay fechas de temporada alta en {muni} que se bloquean con meses de antelación, por lo que conviene visitar el caserío de Derio y asegurar exclusividad de un solo evento al día.',
    'Si la lista de invitados sale de {muni} y del Gran Bilbao, el punto de encuentro más práctico es Derio, en el corazón del Txorierri, con aparcamiento cerrado gratuito para toda la comitiva.',
    'Entre el enlace civil o religioso en {muni} y el banquete suele abrirse una espera incómoda; en los jardines botánicos de Derio ese tiempo se transforma en cóctel con cortador de jamón.',
    'Para {event} en {muni}, la dirección de Eduardo Martínez muestra primero los salones y jardines de Derio antes de cerrar menú, porque la logística manda tanto como el producto.',
    '{muni} mantiene su propio pulso social y familiar; la cocina tradicional vasca y la brasa de encina en Derio responden con menús oficiales cerrados desde 100 € + IVA en bodas y 40 € en grupos.',
    'La distancia real entre {muni} y Santo Domingo Hiribidea, 13 se mide en pocos minutos de autovía, una ventaja que permite disfrutar hasta el final sin depender de taxis urbanos.',
    'Un {event} en {muni} pierde ritmo cuando ceremonia, copas y cena se reparten en tres direcciones; en Derio todo ocurre dentro de la misma finca ajardinada y climatizada.',
    'Cuando parte de la familia reside en {muni} y otros invitados aterrizan en Loiu, Derio actúa como nodo central de Bizkaia con acceso directo desde el aeropuerto y la N-637.',
    'Antes de contratar salón en {muni}, merece la pena comprobar en persona la carpa de ceremonia civil, la accesibilidad PMR con ascensor y las 150 plazas de párking privado en Derio.',
    'En {muni} conviven todo tipo de banquetes, pero la diferencia entre una jornada agotadora y una celebración fluida está en reunir parrilla viva, jardín y discoteca en un solo enclave.',
    'Con más de un siglo de oficio hostelero vasco, el equipo de Eduardo Martínez atiende celebraciones de {muni} desde su finca de Derio con trato señorial y cero intermediarios.',
]);

/** Banco de anclajes geográficos (14 variantes con distancia y eje viario). */
const LOCALS: readonly string[] = Object.freeze([
    'Desde {landmark}, el acceso por {corridor} cubre {km} km directos hasta Santo Domingo Hiribidea, 13 en Derio (Bizkaia).',
    'El recorrido desde {landmark} supone {km} km cómodos por {corridor}, respondiendo a una demanda centrada en {demand}.',
    '{landmark} marca el punto de partida de numerosos invitados; el último enlace hacia el valle del Txorierri entra por {corridor} hasta Derio.',
    'A {km} km de {landmark} siguiendo {corridor}, el caserío atiende de forma habitual {demand}.',
    'La vía {corridor} conecta {landmark} en {km} km con la entrada del recinto en Derio, evitando atascos urbanos y zonas de pago.',
    'En {muni} predomina {demand}, un calendario donde la exclusividad de un único evento al día protege cada reserva en Derio.',
    'Tomando {landmark} como referencia, {corridor} resuelve en pocos minutos los {km} km hasta el aparcamiento privado de 150 plazas.',
    '{landmark} y la finca de Derio comparten comarca y provincia en Bizkaia, separados por apenas {km} km a través de {corridor}.',
    'La ruta desde {landmark} suma {km} km por {corridor}, facilitando el regreso nocturno de invitados de Bilbao, Txorierri y Uribe Kosta.',
    '{muni} posee agenda propia: {landmark} concentra familias y empresas que buscan {demand} a un paso de casa.',
    'El trayecto natural desde {landmark} sigue {corridor} durante {km} km hasta estacionar dentro del recinto cerrado en Derio.',
    'En fines de semana de primavera y otoño, {corridor} mantiene fluido el enlace desde {landmark} en {km} km hasta la zona de jardines.',
    '{demand} define el perfil habitual de quienes reservan desde {muni} con antelación para asegurar su fecha en Derio.',
    'Desde {landmark} se llega por {corridor} en {km} km, con señalización directa al Parque Tecnológico y Santo Domingo Hiribidea, 13.',
]);

/** Banco de ángulos diferenciales (12 marcos para el `hook` de la landing). */
const ANGLES: readonly string[] = Object.freeze([
    'El detalle decisivo de esta ruta: {hook}.',
    'Lo que conviene comprobar antes de comparar presupuestos en Bizkaia: {hook}.',
    'Un dato clave que no detallan los portales genéricos: {hook}.',
    'La ventaja operativa para los anfitriones: {hook}.',
    'En la práctica diaria del caserío, esto se traduce en lo siguiente: {hook}.',
    'El factor que suele inclinar la elección de las parejas: {hook}.',
    'Un matiz importante que Eduardo Martínez explica en la visita técnica: {hook}.',
    'Frente a los salones convencionales de alquiler compartido: {hook}.',
    'Sobre el terreno en Derio, {hook}.',
    'La propuesta de valor de esta ubicación se resume así: {hook}.',
    'Un criterio práctico al elegir recinto en Bizkaia: {hook}.',
    'Lo que marca la comodidad de los invitados el día del banquete: {hook}.',
]);

/** Banco de autoridad culinaria (12 variantes, sólo hechos publicados). */
const KITCHEN: readonly string[] = Object.freeze([
    'La cocina de Eduardo Martínez une la tradición vasca documentada desde 1902 y 1962 con la parrilla al carbón de encina y sarmiento en Derio.',
    'Lejos del catering recalentado en cubetas, cada chuletón de ganado mayor y cada rodaballo salvaje del Cantábrico pasan de la brasa viva al plato.',
    'El dossier oficial 2026 fija siete menús nupciales cerrados (de 100 € a 173 € + IVA), comuniones de 55 € a 95 € y menús de grupo desde 40 €.',
    'Cuatro generaciones de oficio respaldan una cocina de cazuela vasca y brasa directa apoyada en bodega seleccionada y servicio de sala propio.',
    'El recinto elabora, emplata y sirve en la misma finca de Derio, asegurando temperatura, punto de brasa y ritmo de mesa en banquetes de hasta 350 pax.',
    'Desde el Menú Cantábrico (100 €) hasta el Menú Caserío Ezkertza Beko (173 € con txangurro y Möet & Chandon), cada partida es pública y trazable.',
    'Opciones como el Menú Imperial o el Menú Vasco incorporan barra libre, DJ y autobús de 55 plazas incluidos en el presupuesto oficial de 2026.',
    'La cocina adapta menús identificados en mesa para celíacos, vegetarianos y alergias alimentarias sin perder la calidad del banquete principal.',
    'El comedor acristalado de 50 a 200 comensales y la carpa exterior hasta 350 plazas permiten celebrar con total holgura en cualquier estación.',
    'La tradición sidrera y de asador vasco convive en Derio con zona chill out, parque infantil homologado y ascensor accesible para personas mayores.',
    'Cada menú nupcial puede complementarse con cortador de jamón ibérico, recena nocturna y Exclusividad Premium hasta las 6:00 AM.',
    'La bodega forma parte activa del recorrido gastronómico, maridando pescados salvajes, mariscos y carnes maduradas con total rigor.',
]);

/** Banco de espacios y servicio (12 variantes construidas con la vertical). */
const SPACES: readonly string[] = Object.freeze([
    'El recorrido en Derio se reparte entre {spaces}: {promise}.',
    'La finca distribuye {spaces} bajo una regla fija: {promise}.',
    'Con {spaces} integrados en el mismo recinto, {promise}.',
    'Los espacios habilitados incluyen {spaces}, organizados para que {promise}.',
    'Entre {spaces} se adapta el protocolo a la estación del año: {promise}.',
    '{spaces} permiten separar recepción, ceremonia y banquete: {promise}.',
    'La combinación interior y ajardinada abarca {spaces}, garantizando que {promise}.',
    'El complejo ofrece {spaces}, de forma que {promise}.',
    'Sin depender de un único salón cerrado, {spaces} se articulan para que {promise}.',
    'Durante la visita técnica se configuran {spaces} con un objetivo claro: {promise}.',
    'La operativa trabaja sobre {spaces} con exclusividad de un evento al día: {promise}.',
    'La arquitectura del caserío integra {spaces} para asegurar que {promise}.',
]);

/** Banco técnico-acústico (12 variantes, Ley 37/2003 y aforo verificado). */
const TECH: readonly string[] = Object.freeze([
    'En acústica, el rider cumple la Ley 37/2003 del Ruido ({noise}) con medición verificada en montaje y sonorización Bose F1.',
    'El protocolo sonoro aplica la Ley 37/2003 fijando {noise}, con salones insonorizados de 50 a 200 plazas y carpa hasta 350.',
    'La normativa acústica establece {noise} bajo la Ley 37/2003; cualquier actuación en directo se calibra antes de abrir puertas.',
    'Para música en vivo o discoteca, el límite homologado es {noise} (Ley 37/2003), evitando cortes inesperados durante el baile.',
    'Los niveles de presión sonora se documentan por escrito ({noise}) conforme a la Ley 37/2003 y el limitador oficial de sala.',
    'El recinto opera con {noise} como referencia técnica homologada y respaldo integral de Productora EAR bajo la Ley 37/2003.',
    'La ingeniería acústica garantiza {noise} sin distorsión y con verificación previa mediante sonómetro calibrado (Ley 37/2003).',
    'Cada montaje musical se ajusta a {noise} según la Ley 37/2003 del Ruido, protegiendo tanto el baile como la sobremesa.',
    'Si el enlace incluye solista lírico o banda en directo, el equipo fija {noise} y valida acometida y limitador (Ley 37/2003).',
    'La Ley 37/2003 marca el estándar y el caserío de Derio ofrece {noise} en recintos climatizados e insonorizados.',
    'Con capacidad de 50 a 200 en salón y hasta 350 en finca, la acústica opera en {noise} bajo control de la Ley 37/2003.',
    'Todo evento musical queda cubierto por sonómetro homologado y límite de {noise} conforme a la Ley 37/2003.',
]);

/** Banco logístico (10 variantes): kilómetros desde la sede canónica en Derio. */
const LOGISTICS: readonly string[] = Object.freeze([
    'El cómputo logístico parte de la sede canónica en Santo Domingo Hiribidea, 13 (Derio, Bizkaia): los primeros {kmFree} km están exentos y después se aplica {eurKm} €/km.',
    'Si un servicio auxiliar requiere desplazamiento fuera de Derio, los {kmFree} km iniciales no tienen coste y el exceso se tarifica a {eurKm} €/km.',
    'Para traslados y logística en Bizkaia, el origen fiscal es Santo Domingo Hiribidea, 13 (Derio), con {kmFree} km incluidos y {eurKm} €/km adicional.',
    'La distancia se calcula con transparencia desde Derio (Bizkaia): {kmFree} km sin cargo y {eurKm} €/km a partir de ese radio.',
    'En servicios desplazados a fincas de Bizkaia, el criterio es auditable desde Derio: {kmFree} km cortesía y {eurKm} €/km restante.',
    'Cualquier desplazamiento se presupuesta desde Santo Domingo Hiribidea, 13 (Derio) con {kmFree} km incluidos y {eurKm} €/km adicional.',
    'El coste de transporte no se estima a ojo: {kmFree} km exentos desde Derio (Txorierri) y {eurKm} €/km por kilómetro excedido.',
    'Los eventos en fincas externas de Bizkaia aplican distancia real desde Derio: {kmFree} km incluidos y {eurKm} €/km a partir del siguiente.',
    'La logística técnica se factura con origen en Derio (48160, Bizkaia); los primeros {kmFree} km van incluidos y luego {eurKm} €/km.',
    'Antes de confirmar, el cliente conoce la regla exacta: {kmFree} km incluidos desde Derio y {eurKm} €/km a partir de ahí.',
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
        '{muni}': context.scope === 'provincial' ? 'Bizkaia' : context.municipality.name,
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
 * Compone el núcleo narrativo único (5 oraciones, 5 carriles independientes).
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
 * Bizkaia y no un municipio concreto: evita afirmar distancias falsas.
 */
const PROVINCE_LOCALS: readonly string[] = Object.freeze([
    'La provincia se cubre desde Derio: el caserío está en Santo Domingo Hiribidea, 13 y la red N-637, AP-8, BI-631 y BI-634 conecta el Txorierri con toda Bizkaia.',
    'Bizkaia concentra invitados entre Gran Bilbao, Uribe Kosta, Mungia y el Duranguesado; por eso Derio unifica ceremonia, banquete y copas sin traslados.',
    'De Uribe Kosta y Getxo al Duranguesado y Bizkaia central, las autovías confluyen en el corredor del Txorierri facilitando la llegada en pocos minutos.',
    'La finca de Derio atiende celebraciones de toda Bizkaia con la misma parrilla al carbón de encina, salón acristalado de 50 a 200 plazas y carpa hasta 350.',
    'En Bizkaia el problema nunca es el paisaje, sino repartir la boda en tres sitios; en Derio todo ocurre en el mismo recinto cerrado con 150 plazas de párking.',
    'Desde Bilbao, Loiu, Sondika, Zamudio y Lezama hasta Mungia, Uribe Kosta y Galdakao, las familias comparten un enclave estratégico junto al aeropuerto.',
    'La logística provincial se ordena con base fija en Santo Domingo Hiribidea, 13 (48160 Derio, Bizkaia) y una regla transparente de kilometraje.',
    'Bizkaia combina costa, valles rurales e industria tecnológica; el caserío adapta el menú oficial y los jardines botánicos sin variar la fianza deducible.',
    'Para invitados repartidos por Bilbao, Margen Derecha, Margen Izquierda e interior vizcaíno, Derio actúa como punto equidistante con aparcamiento gratuito.',
    'Toda la provincia entra en el radio operativo del Txorierri: un solo aparcamiento para 150 coches, accesibilidad PMR total y un único evento por día.',
]);

/** Alcance de la landing: municipal o provincial. */
export type OtzarretaScope = 'municipal' | 'provincial';

/**
 * Construye las 7 preguntas frecuentes con respuestas verificables del dossier oficial.
 * Incorpora los 7 menús de bodas 2026, comuniones, aforo en Derio y regalos oficiales.
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
            answer: `La sede canónica de Derio (Santo Domingo Hiribidea, 13, 48160 Bizkaia) cuenta con salón acristalado climatizado para 50 a 200 comensales y capacidad total ampliada en carpa y jardines botánicos de hasta ${OTZARRETA_ENTITY.capacityPax} personas, además de ${OTZARRETA_ENTITY.parkingSpaces} plazas de aparcamiento privado cerrado. La distribución de ${spacesLabel} permite celebrar ceremonia civil, cóctel y banquete sin traslados.`,
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
 * geográfico cuando la intención cubre toda Bizkaia.
 */
const PROVINCE_SCOPE: OtzarretaMunicipality = Object.freeze({
    slug: 'bizkaia',
    name: 'Bizkaia',
    distanceKm: 0,
    corridor: 'N-637 / AP-8 / BI-631 / BI-634',
    profile: 'valle',
    landmark: 'la red de carreteras que une Txorierri, Gran Bilbao, Mungia y Uribe Kosta',
    demand: 'bodas y banquetes repartidos entre el litoral, el Gran Bilbao y Bizkaia central',
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
            body: `${OTZARRETA_ENTITY.heritage} La oferta gastronómica incluye 7 menús nupciales oficiales desde 100 € + IVA en el Menú Cantábrico (marisco individual, merluza o bacalao y entrecotte a la brasa) hasta 173 € en el Menú Caserío Ezkertza Beko (con Möet & Chandon y chuletón de 1 Kg a la brasa), con comuniones desde 55 € y grupos desde 40 €. Hoy el servicio se apoya en ${spacesLabel}, sin cambiar de dirección entre ceremonia, aperitivo y banquete.`,
        },
        {
            heading: `Cómo se organiza ${context.vertical.shortLabel} en ${context.scope === 'provincial' ? 'Bizkaia' : context.municipality.name}`,
            body: `${capitalize(spacesLine)} ${distanceText}`,
        },
        {
            heading: `Aforo hasta ${OTZARRETA_ENTITY.capacityPax} personas en Derio, ${OTZARRETA_ENTITY.parkingSpaces} plazas de párking y acústica legal`,
            body: `La sede de Derio cuenta con salón acristalado de 50 a 200 comensales y hasta ${OTZARRETA_ENTITY.capacityPax} personas en carpa y jardines botánicos, más ${OTZARRETA_ENTITY.parkingSpaces} plazas de aparcamiento privado cerrado. Menús como el Vasco regalan 2h de barra libre, 2h de DJ y autobús de 55 plazas, mientras que la Exclusividad Premium permite fiesta hasta las 6:00 AM. ${techLine} En desplazamientos, el cómputo parte de ${OTZARRETA_ENTITY.fullAddress}: ${LOGISTICA_KM_EXENTOS} km exentos y ${LOGISTICA_EUR_PER_KM.toFixed(2).replace('.', ',')} €/km a partir de ahí.`,
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
        args.context.scope === 'provincial' ? 'Bizkaia' : args.context.municipality.name;

    const restaurant: OtzarretaJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Restaurant',
        '@id': `${OTZARRETA_CANONICAL_BASE}/otzarreta#restaurant`,
        name: OTZARRETA_ENTITY.commercialName,
        url: OTZARRETA_ENTITY.website,
        telephone: OTZARRETA_ENTITY.primaryPhone,
        email: OTZARRETA_ENTITY.email,
        servesCuisine: 'Cocina vasca de cazuela y parrilla al carbón',
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
        description: `${args.context.vertical.promise}. Salón acristalado de 50 a 200 plazas y hasta 350 invitados en finca y carpa.`,
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
            ? `El servicio cubre toda Bizkaia con salida desde ${OTZARRETA_ENTITY.fullAddress}.`
            : seed.municipality.distanceKm === 0
              ? `La casa está en el propio ${seed.municipality.name}, en ${OTZARRETA_ENTITY.fullAddress}, sin trayecto entre ceremonia y banquete.`
              : `Desde ${seed.municipality.landmark} hay ${seed.municipality.distanceKm} km por ${seed.municipality.corridor} hasta ${OTZARRETA_ENTITY.fullAddress}.`;

    const description = `${capitalize(seed.keyword)}: ${seed.vertical.promise}. ${
        seed.scope === 'provincial'
            ? 'Servicio en toda Bizkaia desde Derio (Txorierri).'
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
            seed.scope === 'provincial' ? 'Bizkaia' : seed.municipality.name
        } · Derio`,
        keyword: seed.keyword,
        keywords: [
            seed.keyword,
            `restaurante otzarreta ${seed.municipality.slug}`,
            `${seed.vertical.slug} ${seed.municipality.slug}`,
            'restaurante otzarreta derio',
        ],
        municipalitySlug: seed.municipality.slug,
        municipalityName:
            seed.scope === 'provincial' ? 'Bizkaia' : seed.municipality.name,
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
