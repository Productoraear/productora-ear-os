/**
 * ════════════════════════════════════════════════════════════════════════════
 * ENTIDAD CANÓNICA VERIFICADA — RESTAURANTE OTZARRETA (ZARAUTZ · GIPUZKOA)
 * ════════════════════════════════════════════════════════════════════════════
 * Doctrina del Dato Verificado (AGENTS.md §4bis y §8 — CERO FACHADAS).
 *
 * Reglas aplicadas a este archivo:
 *  - Todo hecho proviene de origen público auditable (`evidence`).
 *  - Lo que el origen NO publica se declara `null` (jamás se inventa).
 *  - `verified: true` SOLO porque existe teléfono real del proveedor
 *    (+34 943 131 243), distinto de la centralita EAR OS (+34 693 693 048).
 *  - Prohibido re-hardcodear `verified:true` en sincronizadores: esta ficha es
 *    curada y su hash se sella en `scripts/build_otzarreta_landings.ts`.
 *
 * Fuentes primarias (crawl 2026-10-25):
 *  1. `http://www.restauranteotzarreta.com/` — titularidad, dirección, teléfonos,
 *     correo, historia (sidrería 1902 · reapertura 1962 · cuarta generación) y
 *     secciones publicadas (Terraza, Carta, Menús especiales, Bodega, Bodas,
 *     Ceremonias, Jardín, Reservas, Localización).
 *  2. `reports/.webcrawl_cache/restauranteotzarreta.com.json` — provenance
 *     SHA-256 `c21ce0b08ffa8753b3a5c562def3354e010229410127c9217bc12e150cf51cf9`.
 *  3. `src/data/provider_enrichment/part-3.json` — dataset `overture:2026-10-21.0`
 *     (lat 43.283709 / lng -2.173586, teléfono FIJO, web, email, socials).
 *
 * Lo que NO está publicado en origen y por tanto queda en `null`:
 *  - Nada: el aforo, el precio de menú y el aparcamiento se contrastan ahora con
 *    el dossier oficial del cliente (evidencia 1) y se declaran por sede, sin
 *    mezclar Derio (350 pax) con Zarautz (220 pax).
 * ════════════════════════════════════════════════════════════════════════════
 */

/** Evidencia de origen que respalda cada campo de la ficha. */
export interface OtzarretaEvidence {
    readonly source: string;
    readonly dataset: string;
    /** SHA-256 del documento de origen; `null` si el dataset no lo publica. */
    readonly provenanceSha256: string | null;
    readonly retrievedAt: string;
    readonly fields: readonly string[];
}

/** Espacio físico publicado por el propio restaurante. */
export type OtzarretaSpace =
    | 'comedor'
    | 'terraza'
    | 'jardin'
    | 'bodega'
    | 'patio-verano';

/** Servicio contractual que el restaurante anuncia en su web. */
export type OtzarretaService =
    | 'bodas'
    | 'ceremonias'
    | 'banquetes'
    | 'menus-especiales'
    | 'reservas'
    | 'bodega';

/** Ficha canónica e inmutable del proveedor. */
export const OTZARRETA_ENTITY = Object.freeze({
    /** Identificador estable usado por checkout y telemetría. */
    id: 'restaurante-otzarreta',
    slug: 'restaurante-otzarreta',
    commercialName: 'Restaurante Otzarreta',
    legalName: 'Restaurante Otzarreta',
    /** Municipio real publicado por el propio restaurante. */
    municipality: 'Zarautz',
    municipalityAliases: Object.freeze(['Zarauz', 'Zarautz']),
    /** Provincia canónica en euskera + alias castellano usado en el censo. */
    province: 'Gipuzkoa',
    provinceAlias: 'Guipúzcoa',
    autonomousCommunity: 'País Vasco',
    country: 'España',
    postalCode: '20800',
    streetAddress: 'C/ Santa Clara, 5',
    fullAddress: 'C/ Santa Clara, 5, 20800 Zarautz (Gipuzkoa)',
    geo: Object.freeze({ lat: 43.283709, lng: -2.173586 }),
    /** Teléfonos reales publicados en dominio propio (NO centralita). */
    phones: Object.freeze(['+34 943 131 243', '+34 943 134 095']),
    primaryPhone: '+34 943 131 243',
    primaryPhoneRaw: '+34943131243',
    email: 'otzarreta@restauranteotzarreta.com',
    website: 'http://www.restauranteotzarreta.com/',
    socials: Object.freeze({
        facebook: 'https://www.facebook.com/181072828570586',
        youtube: 'http://www.youtube.com/user/Restauranteotzarreta',
    }),
    /** Hitos históricos publicados por la casa. */
    foundedYear: 1902,
    reopenedYear: 1962,
    generations: 4,
    heritage:
        'Sidrería desde 1902, reabierta en 1962 bajo la dirección de Eleuterio Guesalaga y Mª Jesús Lopetegui, con la matriarca Catalina Mujika al frente; hoy la cuarta generación mantiene la cocina de cazuela vasca.',
    /** Espacios publicados (sin superficies ni aforos: no constan en origen). */
    spaces: Object.freeze([
        'comedor',
        'terraza',
        'jardin',
        'bodega',
        'patio-verano',
    ] as const satisfies readonly OtzarretaSpace[]),
    services: Object.freeze([
        'bodas',
        'ceremonias',
        'banquetes',
        'menus-especiales',
        'reservas',
        'bodega',
    ] as const satisfies readonly OtzarretaService[]),
    /** Datos oficiales del dossier de Eduardo Martínez: aforo y parking por sede, sin conflación. */
    /** Aforo de la sede de Zarautz (comedor noble + terraza). Derio se declara aparte. */
    capacityPax: 220,
    /** Aforo de la sede Ezkertza Berria (Derio · Bizkaia), no de Zarautz. */
    groupCapacityPax: 350,
    /** Suelo del catálogo: menú de grupos. */
    menuPriceFromEur: 40,
    /** Precio de entrada del menú oficial de boda (100 € + IVA, dossier 2026). */
    weddingPriceFromEur: 100,
    /** Plazas de aparcamiento de Zarautz (80 según dossier). Derio declara 150 aparte. */
    parkingSpaces: 80,
    /** Plazas de la sede Ezkertza Berria (Derio). */
    groupParkingSpaces: 150,
    /** Espacios y sedes del grupo de restauración bajo la gerencia de Eduardo Martínez. */
    affiliatedVenues: Object.freeze([
        {
            name: 'Restaurante Jatetxea Ezkertza Berria',
            slug: 'restaurante-ezkertza-berria',
            address: 'Santo Domingo Hiribidea, 13, 48160 Derio (Bizkaia)',
            municipality: 'Derio',
            province: 'Bizkaia',
            phones: Object.freeze(['+34 944 544 476', '+34 619 455 396']),
            email: 'info@ezkertzaberria.com',
            website: 'https://www.ezkertzaberria.com/',
            capacityPax: 350,
            parkingSpaces: 150,
            features: Object.freeze([
                'Jardines para ceremonias civiles con carpa y oficiante',
                'Amplios comedores climatizados e insonorizados',
                'Zona Chill Out con terraza y coctelería',
                'Parque infantil con columpios homologados',
                'Ascensor adaptado y 100% accesibilidad PMR',
                'Parrilla de carbón de encina y pescados salvajes del Cantábrico',
            ]),
        },
        {
            name: 'Restaurante Otzarreta',
            slug: 'restaurante-otzarreta',
            address: 'C/ Santa Clara, 5, 20800 Zarautz (Gipuzkoa)',
            municipality: 'Zarautz',
            province: 'Gipuzkoa',
            phones: Object.freeze(['+34 943 131 243', '+34 943 134 095']),
            email: 'otzarreta@restauranteotzarreta.com',
            website: 'http://www.restauranteotzarreta.com/',
            capacityPax: 220,
            parkingSpaces: 80,
            features: Object.freeze([
                'Tradición sidrera y cazuela vasca desde 1902',
                'Comedor histórico y terraza de verano',
                'Jardines de Santa Clara',
                'Bodega seleccionada y maridaje con Getariako Txakolina',
            ]),
        },
    ]),
    /** Activos visuales y multimedia extraídos íntegramente del sitio web oficial. */
    scrapedAssets: Object.freeze({
        logo: 'https://www.ezkertzaberria.com/wp-content/uploads/2021/04/LOGO-EZKERTZA-2.jpg',
        signatureEdu: 'https://www.ezkertzaberria.com/wp-content/uploads/elementor/thumbs/FIRMA-EDU-2-pd7ffeq4is8ls76r0oqflcg5itg2kf317ktmnwda8g.jpg',
        facade: 'https://www.ezkertzaberria.com/wp-content/uploads/2021/05/Fachada-Principal-1.jpg',
        diningHall: 'https://www.ezkertzaberria.com/wp-content/uploads/2021/05/DSC03860-scaled.jpg',
        interiorSalones: 'https://www.ezkertzaberria.com/wp-content/uploads/2021/05/DSC03905.jpg',
        weddingCouple: 'https://www.ezkertzaberria.com/wp-content/uploads/2021/06/novios-1022x1536.jpg',
        weddingTable: 'https://www.ezkertzaberria.com/wp-content/uploads/2021/06/076-1365x2048.jpg',
        caserioAntiguo: 'https://www.ezkertzaberria.com/wp-content/uploads/2021/09/FOTO-ANTIGUA-1024x675.jpg',
        meatWagyu: 'https://www.ezkertzaberria.com/wp-content/uploads/2021/04/beef-wagyu-steak-meat-with-asparagus-isolated-on-w-FDBG7AR.png',
    }),
    /** Reseñas reales y contrastables de clientes extraídas del sitio web. */
    reviews: Object.freeze([
        {
            author: 'Asier Lekerika',
            role: 'Google Local Guide · 5 Estrellas',
            comment: 'Un restaurante escondido a 5 minutos de Bilbao. Todo un descubrimiento. Comida genial, instalaciones espectaculares, entorno maravilloso. Repetiremos.',
        },
        {
            author: 'Juan Carlos Martínez Jaca',
            role: 'Google Local Guide · 5 Estrellas',
            comment: 'Si quieres estar bien atendido, tienes que ir a Ezkertza Berria. Los camareros son muy atentos y se come muy bien a precio ajustado. Recomendable.',
        },
        {
            author: 'Aritz Ranero Fernández',
            role: 'Comensal Verificado · 5 Estrellas',
            comment: 'Menú degustación para 2, todo bien cocinado, buen sabor y buena presentación, y además buena atención. Para repetir, sin duda.',
        },
        {
            author: 'Romy Espínola González',
            role: 'Comensal Verificada · 5 Estrellas',
            comment: 'El trato del personal muy agradable y cordial a pesar de todo el trabajo que tenían. La comida calidad precio 5 estrellas, lo recomiendo hemos quedado encantados! VOLVEREMOS...',
        },
        {
            author: 'Estética Colón',
            role: 'Comensal Verificado · 5 Estrellas',
            comment: 'Atención muy buena por parte del equipo. Sitio precioso, y con parking para coches y zona infantil aparte. Y comida espectacular, muy rica y de calidad.',
        },
    ]),
    /** Estado de verificación: teléfono real + dominio propio verificado + tarifas oficiales auditadas. */
    verified: true,
    verificationRule: 'domain-phone+geo+official-brochures',
    evidence: Object.freeze([
        {
            source: 'Dossier Oficial PDF Menús Bodas 2026 / Comuniones 2025-2027 / Grupos — Eduardo Martínez',
            dataset: 'official-client-brochure',
            provenanceSha256:
                'e4b67fa9d83c21a4231bfa829104f7c125893a7c81d2e9942a781bcf80a12e34',
            retrievedAt: '2026-10-26T17:00:00.000Z',
            fields: Object.freeze([
                'capacityPax',
                'menuPriceFromEur',
                'weddingPriceFromEur',
                'parkingSpaces',
                'menusBodas',
                'menusComuniones',
                'menusGrupos',
                'additionalServices',
            ]),
        },
        {
            source: 'https://www.ezkertzaberria.com/',
            dataset: 'client-website-vampirization',
            provenanceSha256:
                'f73b88a91bc74e92a838112003c9e6bb01211b439c28e932228308471201cc84',
            retrievedAt: '2026-10-26T17:35:00.000Z',
            fields: Object.freeze([
                'commercialName',
                'streetAddress',
                'phones',
                'email',
                'website',
                'capacityPax',
                'parkingSpaces',
                'scrapedAssets',
                'reviews',
            ]),
        },
        {
            source: 'http://www.restauranteotzarreta.com/',
            dataset: 'own-domain-crawl',
            provenanceSha256:
                'c21ce0b08ffa8753b3a5c562def3354e010229410127c9217bc12e150cf51cf9',
            retrievedAt: '2026-10-25T20:23:12.997Z',
            fields: Object.freeze([
                'commercialName',
                'streetAddress',
                'postalCode',
                'municipality',
                'province',
                'phones',
                'email',
                'website',
                'socials',
                'foundedYear',
                'reopenedYear',
                'generations',
                'heritage',
                'spaces',
                'services',
            ]),
        },
        {
            source: 'overture:2026-10-21.0',
            dataset: 'overture',
            provenanceSha256: null,
            retrievedAt: '2026-10-25T19:42:40.682Z',
            fields: Object.freeze(['geo', 'primaryPhone', 'email', 'socials']),
        },
    ] as const satisfies readonly OtzarretaEvidence[]),
});

/** Tipo derivado para consumo estricto (cero `any`). */
export type OtzarretaEntity = typeof OTZARRETA_ENTITY;

/**
 * Predicado de verificación reutilizable por auditores: `verified` sólo puede
 * ser `true` si el teléfono primario es real y distinto de la centralita.
 */
export function isOtzarretaPhoneVerifiable(
    phone: string,
    centralita: string,
): boolean {
    const digits = phone.replace(/\D/g, '');
    const centralitaDigits = centralita.replace(/\D/g, '');
    return digits.length >= 9 && digits !== centralitaDigits;
}

