/**
 * ════════════════════════════════════════════════════════════════════════════
 * ENTIDAD CANÓNICA VERIFICADA — RESTAURANTE OTZARRETA / EZKERTZA BERRIA (DERIO · BIZKAIA)
 * ════════════════════════════════════════════════════════════════════════════
 * Doctrina del Dato Verificado (AGENTS.md §4bis y §8 — CERO FACHADAS).
 *
 * Reglas aplicadas a este archivo:
 *  - Todo hecho proviene de origen público auditable (`evidence`).
 *  - Lo que el origen NO publica se declara `null` (jamás se inventa).
 *  - `verified: true` SOLO porque existe teléfono real del proveedor
 *    (+34 944 544 476), distinto de la centralita EAR OS (+34 693 693 048).
 *  - Prohibido re-hardcodear `verified:true` en sincronizadores: esta ficha es
 *    curada y su hash se sella en `scripts/build_otzarreta_landings.ts`.
 *
 * Fuentes primarias:
 *  1. Dossier Oficial PDF Menús Bodas 2026 / Comuniones 2025-2027 / Grupos — Eduardo Martínez.
 *  2. `https://www.ezkertzaberria.com/` — sede canónica en Santo Domingo Hiribidea, 13,
 *     48160 Derio (Bizkaia · comarca Txorierri / Gran Bilbao), teléfonos, correo,
 *     aforo (350 pax) y aparcamiento (150 plazas).
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

/**
 * Menú oficial de boda/celebración publicado en el dossier 2026 de la casa.
 *
 * FUENTE ÚNICA DE VERDAD (Directiva CEO 2026-11-21): el Bento de `/otzarreta`
 * y el system prompt del Concierge (`/api/concierge/chat`) leen de ESTE array.
 * Prohibido re-hardcodear nombres o importes en cualquiera de las dos
 * superficies: una sola edición aquí propaga el cambio a las dos.
 *
 * Reglas de honestidad aplicadas:
 *  - `priceEur` sólo se rellena con importe de dossier oficial. `null` = la casa
 *    no publica precio unitario de ese menú; se declara en la UI, jamás se estima.
 *  - El suelo público («desde X € + IVA») NO vive aquí: se lee de
 *    `weddingPriceFromEur` para que no existan dos cifras que puedan divergir.
 */
export interface OtzarretaWeddingMenu {
    /** Nombre comercial exacto del menú. */
    readonly name: string;
    /** Importe por comensal sin IVA según dossier; `null` si no publicado. */
    readonly priceEur: number | null;
    /** Descripción de una línea: qué distingue a este menú. */
    readonly note: string;
    /** Complementos incluidos declarados en el dossier (vacío si no consta). */
    readonly extras: readonly string[];
}

/** Catálogo oficial de menús de celebración (orden de carta, de clásico a gala). */
export const OTZARRETA_WEDDING_MENUS: readonly OtzarretaWeddingMenu[] = Object.freeze([
    {
        name: 'Cantábrico',
        priceEur: 100,
        note: 'Pescado salvaje del Cantábrico a la brasa de encina.',
        extras: Object.freeze([]),
    },
    {
        name: 'Especial Imperial',
        priceEur: 123.4,
        note: 'Banquete de gala con barra libre y música.',
        extras: Object.freeze(['1 h de barra libre', '1 h de DJ']),
    },
    {
        name: 'Paloma',
        priceEur: 125,
        note: 'Clásico de la casa para celebraciones de mediodía.',
        extras: Object.freeze([]),
    },
    {
        name: 'Vasco',
        priceEur: 138,
        note: 'Pack completo de banquete con barra libre, DJ y transporte.',
        extras: Object.freeze(['2 h de barra libre', '2 h de DJ', 'Autobús para 55 pax']),
    },
    {
        name: 'Especial Temporada',
        priceEur: 142.5,
        note: 'Producto de mercado y huerta de cada estación.',
        extras: Object.freeze([]),
    },
    {
        name: 'Ezkertza',
        priceEur: 155,
        note: 'Menú insignia: chuletón de ganado mayor y medio bogavante.',
        extras: Object.freeze(['Chuletón de 1 kg', '½ bogavante']),
    },
    {
        name: 'Caserío Beko',
        priceEur: 173,
        note: 'El más alto de la casa, con champán de maison.',
        extras: Object.freeze(['Moët & Chandon']),
    },
] as const);

/**
 * Etiqueta de precio legible para copy público (`123,40 €`) o `null`.
 * Formateo es-ES explícito: el separador decimal es coma, nunca punto.
 */
export function formatOtzarretaMenuPrice(priceEur: number | null): string | null {
    if (priceEur === null) return null;
    return `${priceEur.toFixed(2).replace('.', ',')} €`;
}

/** Ficha canónica e inmutable del proveedor. */
export const OTZARRETA_ENTITY = Object.freeze({
    /** Identificador estable usado por checkout y telemetría. */
    id: 'restaurante-otzarreta',
    slug: 'restaurante-otzarreta',
    commercialName: 'Restaurante Otzarreta',
    legalName: 'Restaurante Otzarreta',
    /** Municipio canónico publicado por el restaurante. */
    municipality: 'Derio',
    municipalityAliases: Object.freeze(['Derio', 'Txorierri', 'Gran Bilbao']),
    /** Provincia canónica en euskera + alias castellano usado en el censo. */
    province: 'Bizkaia',
    provinceAlias: 'Vizcaya',
    autonomousCommunity: 'País Vasco',
    country: 'España',
    postalCode: '48160',
    streetAddress: 'Santo Domingo Hiribidea, 13',
    fullAddress: 'Santo Domingo Hiribidea, 13, 48160 Derio (Bizkaia)',
    geo: Object.freeze({ lat: 43.2928, lng: -2.8833 }),
    /** Teléfonos reales publicados en dominio propio (NO centralita). */
    phones: Object.freeze(['+34 944 544 476', '+34 619 455 396']),
    primaryPhone: '+34 944 544 476',
    primaryPhoneRaw: '+34944544476',
    email: 'info@ezkertzaberria.com',
    website: 'https://www.ezkertzaberria.com/',
    socials: Object.freeze({
        facebook: 'https://www.facebook.com/181072828570586',
        youtube: 'http://www.youtube.com/user/Restauranteotzarreta',
    }),
    /** Hitos históricos publicados por la casa. */
    foundedYear: 1902,
    reopenedYear: 1962,
    generations: 4,
    heritage:
        'Casa hostelera de raíz vasca (tradición desde 1902 y reapertura en 1962) bajo la dirección gastronómica de Eduardo Martínez en Santo Domingo Hiribidea, 13 (Derio, Bizkaia), especializada en parrilla al carbón de encina, cocina de cazuela vasca y banquetes en caserío en el valle del Txorierri.',
    /** Espacios publicados. */
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
    /** Datos oficiales del dossier de Eduardo Martínez en Derio (Bizkaia). */
    /** Aforo máximo de la sede canónica en Derio (comedor acristalado 50–200 pax + carpa y jardines hasta 350 pax). */
    capacityPax: 350,
    /** Aforo del complejo Ezkertza Berria & Otzarreta en Derio (Bizkaia). */
    groupCapacityPax: 350,
    /** Suelo del catálogo: menú de grupos. */
    menuPriceFromEur: 40,
    /** Precio de entrada del menú oficial de boda (100 € + IVA, dossier 2026). */
    weddingPriceFromEur: 100,
    /** Plazas de aparcamiento privado en Derio (150 según dossier oficial). */
    parkingSpaces: 150,
    /** Plazas de la sede canónica en Derio (Bizkaia). */
    groupParkingSpaces: 150,
    /** Catálogo oficial de menús de celebración (fuente única: Bento + Concierge). */
    weddingMenus: OTZARRETA_WEDDING_MENUS,
    /** Sede canónica única bajo la gerencia de Eduardo Martínez en Derio (Bizkaia). */
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
                'Amplios comedores climatizados e insonorizados (50 a 200 pax)',
                'Zona Chill Out con terraza y coctelería',
                'Parque infantil con columpios homologados',
                'Ascensor adaptado y 100% accesibilidad PMR',
                'Parrilla de carbón de encina y pescados salvajes del Cantábrico',
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
                'postalCode',
                'municipality',
                'province',
                'geo',
                'phones',
                'email',
                'website',
                'capacityPax',
                'parkingSpaces',
                'scrapedAssets',
                'reviews',
            ]),
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

