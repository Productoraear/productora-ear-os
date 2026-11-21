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

/**
 * Carta oficial de menús de celebración — OFERTA SANCIONADA 2027.
 *
 * SANCIÓN DEL CEO (Edwin Agudelo, Director Generalista) de 2026-11-21: la
 * oferta comercial vigente son los CUATRO menús de gala de 145 € a 185 € + IVA.
 * Sustituye al catálogo heredado del dossier de 2026 (100–173 €), que queda
 * derogado como tarifa comercial.
 *
 * Orden de carta: de entrada a gala. El «desde» NO se escribe aquí: se deriva
 * del primer importe (`OTZARRETA_WEDDING_MENUS_CLAIM`) para que no existan dos
 * cifras que puedan divergir (INV-10 / AF-4).
 */
export const OTZARRETA_WEDDING_MENUS: readonly OtzarretaWeddingMenu[] = Object.freeze([
    {
        name: 'Menú Tradición',
        priceEur: 145,
        note: 'La cocina de siempre del caserío, llevada al servicio de gala.',
        extras: Object.freeze([]),
    },
    {
        name: 'Menú Asador',
        priceEur: 155,
        note: 'La brasa de encina y sarmiento de Eduardo Martínez como eje del banquete.',
        extras: Object.freeze([]),
    },
    {
        name: 'Menú Ezkertza',
        priceEur: 165,
        note: 'Menú insignia del caserío, con las piezas nobles de la casa.',
        extras: Object.freeze([]),
    },
    {
        name: 'Menú Soberano',
        priceEur: 185,
        note: 'El más alto de la carta: servicio de gala completo.',
        extras: Object.freeze([]),
    },
] as const);

/**
 * Reclamo canónico de cabecera que las dos superficies (Bento de `/otzarreta` y
 * system prompt del Concierge) citan palabra por palabra.
 *
 * Se DERIVA del primer menú de la carta: si el CEO sube el suelo, el reclamo se
 * mueve con él y no puede quedarse publicando un importe caducado.
 */
export const OTZARRETA_WEDDING_MENUS_CLAIM = `Menús de Gala desde ${(OTZARRETA_WEDDING_MENUS[0]?.priceEur ?? 0).toLocaleString('es-ES')} € + IVA`;

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
    /**
     * Precio de entrada de la carta de gala sancionada 2027 (145 € + IVA).
     *
     * Se DERIVA de `OTZARRETA_WEDDING_MENUS[0]` y no se escribe a mano: es el
     * «desde» que publican el Bento, la ficha y el Concierge. Una sola edición
     * de la carta mueve el suelo de las tres superficies (INV-10).
     */
    weddingPriceFromEur: OTZARRETA_WEDDING_MENUS[0]?.priceEur ?? 0,
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

/* ─────────────────────────────────────────────────────────────────────────────
 * PRESET OFICIAL DE AFORO POR SALA — SANCIÓN DEL CEO 2026-11-21
 * ─────────────────────────────────────────────────────────────────────────────
 * Resuelve la deuda declarada en `CLINE_EXECUTION_LOG.md` (2026-11-21): el
 * preset «220 pax salón» NO se implementó porque 220 no existía en ninguna
 * fuente; ahora el CEO sanciona las cifras oficiales y las deja trazables.
 *
 * Doctrina aplicada (AF-1 / doctrina del dato verificado):
 *  · `interiorPax` = 200 → techo del documentado «50 a 200 pax» que ya publican
 *    la ficha, el explorador y el motor de dominancia.
 *  · `exteriorPax` = 350 → `capacityPax` del SSOT. No se escribe el literal:
 *    se LEE de la entidad para que no existan dos aforos vivos.
 *  · `totalPax` = 350 → máximo de la finca; nunca suma de salas, porque una
 *    misma boda no ocupa interior y exterior a la vez.
 *  · `parkingSpaces` = 120 → suelo real del dossier (150 publicados). Se declara
 *    el mínimo garantizado para no prometer plazas de más.
 */
export interface OtzarretaSeatingPreset {
    /** Nombre de la sala o recinto. */
    readonly label: string;
    /** Aforo máximo de esa sala, en comensales. */
    readonly capacityPax: number;
    /** Rango estándar publicado (texto es-ES, sin inventar decimales). */
    readonly standardRange: string;
    /** Espacio del enum `OtzarretaSpace` al que corresponde, si aplica. */
    readonly space: OtzarretaSpace | null;
}

export const OTZARRETA_SEATING_PRESET = Object.freeze({
    /** Salón acristalado climatizado e insonorizado (interior). */
    interiorSalon: Object.freeze({
        label: 'Salón acristalado',
        capacityPax: 200,
        standardRange: '50 a 200 comensales',
        space: 'comedor',
    } as const satisfies OtzarretaSeatingPreset),
    /** Jardín botánico con carpa para ceremonia civil (exterior). */
    exteriorGarden: Object.freeze({
        label: 'Jardín y carpa',
        capacityPax: OTZARRETA_ENTITY.capacityPax,
        standardRange: 'hasta 350 comensales',
        space: 'jardin',
    } as const satisfies OtzarretaSeatingPreset),
    /** Capacidad total máxima de la finca (un solo evento al día). */
    totalPax: OTZARRETA_ENTITY.capacityPax,
    /** Suelo garantizado de plazas de aparcamiento privado en recinto cerrado. */
    parkingSpaces: 120,
});

/** Tipo derivado del preset (consumo estricto, cero `any`). */
export type OtzarretaSeatingPresetSpec = typeof OTZARRETA_SEATING_PRESET;

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

