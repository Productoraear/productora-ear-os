/**
 * ════════════════════════════════════════════════════════════════════════════
 * FICHA CANÓNICA DE VENUE — RESTAURANTE EZKERTZA BERRIA (DERIO · BIZKAIA)
 * ════════════════════════════════════════════════════════════════════════════
 * Doctrina del Dato Verificado (AGENTS.md §4bis y §8 — CERO FACHADAS).
 *
 * Origen: ficha pública del venue en un marketplace de bodas, ingerida por
 * orden del CEO el 2026-10-31 (dossier «caballo de troya»). Reglas aplicadas:
 *  - Toda cifra publicada (rating, opiniones, promociones, aforo) se limita a
 *    lo que consta en la ficha ingerida; lo que la ficha no publica se
 *    declara `null` o se omite. Nada se inventa.
 *  - Los textos de las reseñas se reproducen tal cual fueron ingeridos; los
 *    truncados por la fuente conservan «…» y el texto completo vive en la
 *    ficha de origen. Cualquier titular puede retirar su cita por flag
 *    (JUR-5): la retirada es una edición de este fichero + deploy (< 10 min).
 *  - Cero líneas de contacto del proveedor: el peaje soberano
 *    (`sovereign-lead-gate.ts`) es el único canal público. Este fichero no
 *    contiene teléfonos ni correos del venue.
 *  - Los precios de menú no se duplican aquí: el suelo «desde 100 €» se lee
 *    de `otzarreta-entity.ts` (`weddingPriceFromEur`), anclado al SSOT.
 * ════════════════════════════════════════════════════════════════════════════
 */

/** Reseña pública ingerida de la ficha del venue. */
export interface EzkertzaDerioReview {
    readonly author: string;
    readonly date: string;
    /** Valoración de 0 a 5 publicada en la ficha. */
    readonly rating: number;
    readonly title: string;
    readonly comment: string;
}

/** Pregunta frecuente publicada en la ficha, con respuesta redactada desde datos verificados. */
export interface EzkertzaDerioFaq {
    readonly question: string;
    readonly answer: string;
}

/** Menú publicado en la ficha. Sin precios unitarios: el suelo es del SSOT. */
export interface EzkertzaDerioMenu {
    readonly name: string;
    readonly description: string;
    readonly badge: string | null;
}

/** Promoción publicada en la ficha (despersonalizada de la plataforma de origen). */
export interface EzkertzaDerioPromo {
    readonly badge: string;
    readonly title: string;
    readonly detail: string;
}

/** Boda real publicada en la ficha. */
export interface EzkertzaDerioRealWedding {
    readonly couple: string;
    readonly photoCount: number;
    readonly description: string;
}

/** Evidencia de origen de la ficha. */
export interface EzkertzaDerioEvidence {
    readonly source: string;
    readonly dataset: string;
    /** SHA-256 del documento de origen; `null` cuando la ingesta no lo sella. */
    readonly provenanceSha256: string | null;
    readonly retrievedAt: string;
    readonly fields: readonly string[];
}

export const EZKERTZA_DERIO_VENUE = Object.freeze({
    id: 'restaurante-ezkertza-berria',
    slug: 'restaurante-ezkertza-berria',
    name: 'Restaurante Ezkertza Berria',
    municipality: 'Derio',
    province: 'Bizkaia',
    provinceAlias: 'Vizcaya',
    streetAddress: 'Santo Domingo Hiribidea, 13',
    postalCode: '48160',
    fullAddress: 'Santo Domingo Hiribidea, 13, 48160 Derio (Bizkaia)',
    /** Mismas coordenadas ya publicadas en el JSON-LD de /otzarreta (43.2928, -2.8833). */
    geo: Object.freeze({ lat: 43.2928, lng: -2.8833 }),

    /** Valoración agregada publicada en la ficha ingerida. */
    rating: 4.8,
    ratingMax: 5,
    ratingLabel: 'Excelente',
    reviewCount: 23,
    recommendationPercent: 96,
    hiredByCouplesLabel: 'Más de 100 parejas lo han contratado',

    /** Datos rápidos de la ficha (el suelo de precio se lee del SSOT vía entidad). */
    menusFromEur: 100,
    guestRange: '50 a 200 invitados',
    discountPercent: 3,
    responseTime: 'Responde en 24 horas',

    tags: Object.freeze(['Ceremonia', 'Banquete', 'Exteriores', 'Decoración exterior'] as const),

    datosDeInteres: Object.freeze([
        'En el campo',
        'Zona ajardinada, terraza, carpa',
        'Solo hace 1 evento al día',
        'Cuenta con parking',
    ] as const),

    media: Object.freeze({
        virtualTour360: true,
        videoCount: 3,
        photoCount: 69,
    }),

    about: Object.freeze({
        onMarketplacesSince: 2019,
        lastUpdated: 'Septiembre 2026',
        description:
            'Si siempre soñaste con una boda de estilo rural, estás en el lugar adecuado. Restaurante Ezkertza Berria pone a tu disposición sus cuidadas instalaciones para que puedas llevar a cabo un banquete por todo lo alto, con el apoyo en todo momento de un equipo de profesionales con más de dos décadas de experiencia. Diferentes espacios, uno para cada momento de la celebración: ya sea en exterior o en interior, el encanto del caserío es absoluto. Destacan sus extensos jardines y la carpa para ceremonias civiles.',
    }),

    realWeddings: Object.freeze([
        {
            couple: 'Esther & Nelson',
            photoCount: 23,
            description:
                'Celebración documentada en la galería oficial del caserío, disponible íntegra en la visita técnica.',
        },
    ] as const satisfies readonly EzkertzaDerioRealWedding[]),
    spaces: Object.freeze([
        'Salones de banquetes',
        'Terraza',
        'Zona ajardinada',
        'Carpa',
        'Zona de baile',
        'Parking',
    ] as const),

    services: Object.freeze([
        'Banquete',
        'Ceremonia',
        'Fotografía',
        'Música',
        'Transporte',
        'Decoración',
    ] as const),

    location: Object.freeze(['En el campo', 'A las afueras de la ciudad'] as const),
    accommodationForGuests: false,

    promos: Object.freeze([
        {
            badge: 'Exclusivo',
            title: '3% de descuento para novios',
            detail:
                'Promoción permanente aplicable al presupuesto cerrado de banquete. El cupón se gestiona con la Conserjería al confirmar la visita técnica.',
        },
    ] as const satisfies readonly EzkertzaDerioPromo[]),

    menus: Object.freeze([
        {
            name: 'Menú Ezkertza',
            description:
                'Menú insignia del caserío: producto de la parrilla de carbón de encina y servicio de gala.',
            badge: null,
        },
        {
            name: 'Menú Vasco',
            description:
                'Cocina de cazuela vasca tradicional, la especialidad de la casa desde hace décadas.',
            badge: null,
        },
        {
            name: 'Menú Cantábrico',
            description:
                'Pescados salvajes del Cantábrico y producto del mar, con maridaje de la bodega.',
            badge: 'Con oferta aplicada',
        },
        {
            name: 'Especial temporada',
            description:
                'Menú que cambia con el mercado y la huerta de cada estación.',
            badge: null,
        },
    ] as const satisfies readonly EzkertzaDerioMenu[]),

    faqs: Object.freeze([
        {
            question:
                '¿Cuánto cuesta un menú de boda por persona en Restaurante Ezkertza Berria?',
            answer:
                'Los menús de boda parten de 100 € + IVA por comensal según el dossier oficial 2026. La casa ofrece 7 menús oficiales (Cantábrico, Vasco, Ezkertza, especial de temporada y otros formatos de gala) y el precio cerrado se calcula en el cotizador de la Conserjería EAR OS.',
        },
        {
            question:
                '¿De qué espacios dispone Restaurante Ezkertza Berria para celebrar una boda?',
            answer:
                'Salones de banquetes climatizados e insonorizados, terraza, zona ajardinada con carpa para ceremonias civiles, zona de baile y parking privado gratuito de 150 plazas.',
        },
        {
            question:
                '¿Qué servicios ofrece Restaurante Ezkertza Berria para la organización de eventos de boda?',
            answer:
                'Banquete, ceremonia, fotografía, música, transporte de invitados y decoración, coordinados por el equipo del caserío y la Conserjería EAR OS.',
        },
        {
            question: '¿En qué entorno se encuentra Restaurante Ezkertza Berria?',
            answer:
                'En el campo, a las afueras de la ciudad: Derio (Bizkaia), a pocos minutos de Bilbao y junto a zonas ajardinadas con terraza y carpa.',
        },
        {
            question:
                '¿Qué tipo de cocina se puede encontrar en Restaurante Ezkertza Berria?',
            answer:
                'Cocina vasca de autor: parrilla de carbón de encina, cazuela vasca tradicional y pescados salvajes del Cantábrico.',
        },
        {
            question:
                '¿Qué tipo de menús especiales para boda es posible encontrar en Restaurante Ezkertza Berria?',
            answer:
                'Menú Ezkertza, Menú Vasco, Menú Cantábrico (con oferta aplicada) y el especial de temporada, dentro del catálogo oficial de 7 menús.',
        },
        {
            question:
                '¿Cómo funciona la contratación de la barra libre para bodas en Restaurante Ezkertza Berria?',
            answer:
                'La barra libre se configura dentro del presupuesto cerrado durante la visita técnica, junto con la coctelería de la zona Chill Out y la terraza.',
        },
        {
            question:
                '¿A cuántas personas puede dar servicio Restaurante Ezkertza Berria para la celebración del banquete de boda?',
            answer:
                'La ficha del venue publica un rango de 50 a 200 invitados para banquete nupcial; el caserío dispone además de comedores para hasta 350 comensales en eventos ampliados (dossier oficial).',
        },
        {
            question:
                '¿Cuántas parejas recomiendan a Restaurante Ezkertza Berria y cuáles son los aspectos mejor valorados de sus servicios para bodas?',
            answer:
                'El 96% de las parejas lo recomienda, con una valoración de 4,8/5 sobre 23 opiniones publicadas. Los aspectos mejor valorados son la atención del equipo, la comida y los jardines con carpa.',
        },
        {
            question:
                '¿Qué promociones tiene disponibles Restaurante Ezkertza Berria relacionadas con los servicios de boda?',
            answer:
                'Un 3% de descuento exclusivo para novios, promoción permanente aplicable al presupuesto cerrado de banquete.',
        },
    ] as const satisfies readonly EzkertzaDerioFaq[]),
    reviews: Object.freeze([
        {
            author: 'Ines',
            date: '08/07/2024',
            rating: 5.0,
            title: 'Súper recomendable',
            comment:
                'Edu es súper cercano y un gran profesional, nos lo hizo super fácil. Se curro algún detalle sin nosotros pedírselo, salió todo perfecto. Los camareros super majos y atentos, la gente salió super contenta. Mil gracias por todo…',
        },
        {
            author: 'Jessicä',
            date: '26/07/2026',
            rating: 5.0,
            title: 'Una boda de cuento de hadas',
            comment:
                'Yeray y Jessica 25/07/2026. No podemos estar más contentos. Tenemos muy muy buen sabor de boca y nuestros invitados han salido encantados. Comida de 10, comimos hasta reventar ya desde el cocktail, nuestras felicitaciones a todos…',
        },
        {
            author: 'Nerea',
            date: '12/07/2026',
            rating: 5.0,
            title: 'Excelente experiencia, totalmente recomendable',
            comment:
                'Celebramos nuestra boda el pasado 20 de junio y todo salió a pedir de boca. Desde el principio el trato fue muy cercano y siempre están disponibles para cualquier duda. Mención especial a Khalem…',
        },
        {
            author: 'INES',
            date: '06/07/2026',
            rating: 4.6,
            title: 'Celebración de aniversario',
            comment:
                'Como siempre es un placer ir a celebrar el aniversario de boda allí. Tras dos años nada ha cambiado, la atención de la gente espectacular, la comida no defrauda y te sientes como en casa.',
        },
        {
            author: 'Carmen',
            date: '09/01/2026',
            rating: 1.8,
            title: 'Experiencia negativa',
            comment:
                'La primera toma de contacto fue muy buena, saben vender muy bien sus servicios y nos encantó el lugar para el presupuesto que teníamos. La segunda toma de contacto nos atendió otra persona, no…',
        },
        {
            author: 'Teresa',
            date: '02/04/2025',
            rating: 4.8,
            title: 'Lugar ideal para celebrar',
            comment:
                'A la gente le gustó mucho el menú, mucha cantidad sin estimación, nos dieron muchas comodidades. Con música allí mismo, elegida por nosotros.',
        },
        {
            author: 'Itxaso',
            date: '28/11/2024',
            rating: 5.0,
            title: 'Boda increíble',
            comment:
                'Inmejorable, no fallaron en nada, estuvieron super atentos de todo el mundo. Volvería a repetirla sin pensarlo.',
        },
        {
            author: 'Josu',
            date: '04/11/2024',
            rating: 5.0,
            title: 'Boda 21/09/24',
            comment:
                'Solo tenemos palabras de agradecimiento para todo el equipo del Ezkertza Berria, hicieron que nuestro día fuese increíble. Todos los invitados comentaron lo atentos que fueron los profesionales y la alegría que transmitían…',
        },
        {
            author: 'Janire',
            date: '22/10/2024',
            rating: 5.0,
            title: 'Nos dieron un día espectacular',
            comment:
                'Elegimos el restaurante Ezkertza porque el tipo de menú que nos ofrecían era lo que íbamos buscando. Queríamos un sitio bonito, con opción a exterior y que nos dieran buen menú…',
        },
        {
            author: 'Saioa',
            date: '01/09/2024',
            rating: 5.0,
            title: 'Boda de 10',
            comment:
                'Muchísimas gracias de corazón, hemos salido encantados y todos los invitados también. Comida, atención, ambiente, camareros, todo de 10. Volveremos seguro. Edu y Khalem os ayudarán en todo para que vuestro día sea único.',
        },
        {
            author: 'Katia',
            date: '15/04/2024',
            rating: 5.0,
            title: 'Superó expectativas',
            comment:
                'No conocía este sitio y supe de él por una amiga que había celebrado las bodas de oro de sus padres. Cuando fuimos a verle para celebrar mi boda, nos encantó y la atención del…',
        },
        {
            author: 'Iratxe',
            date: '26/10/2023',
            rating: 5.0,
            title: 'La boda perfecta',
            comment:
                'Nos casamos el sábado 21/10/2023. Llevábamos días preparando y llevando cositas; enseguida entendieron lo que queríamos, todo estaba como queríamos y salió perfecto. La boda que siempre quise, fue un día perfecto…',
        },
        {
            author: 'Izaskun',
            date: '21/10/2023',
            rating: 5.0,
            title: 'Fue un día increíble',
            comment:
                'Salió todo perfecto, fue un gran día, el trato ha sido excelente. Muchísimas gracias a Edu por todo, volvería a elegir el restaurante una y otra vez.',
        },
        {
            author: 'Julieta',
            date: '13/07/2023',
            rating: 5.0,
            title: 'La boda más esperada por nuestros allegados',
            comment:
                'Lo hemos pasado súper bien, y hemos comido de lo más rico y super bien atendidos de principio a fin, todos mis invitados y familia super agradecidos y satisfechos.',
        },
        {
            author: 'Irune',
            date: '15/05/2023',
            rating: 5.0,
            title: 'Cómo en casa',
            comment:
                'Estuvimos como en casa. Eduardo organizó todo como nosotros queríamos o mejor. Cuentan con grandes profesionales y la comida es una maravilla.',
        },
    ] as const satisfies readonly EzkertzaDerioReview[]),

    evidence: Object.freeze([
        {
            source:
                'Ficha pública del venue en marketplace de bodas (ingesta CEO 2026-10-31)',
            dataset: 'marketplace-venue-listing',
            provenanceSha256: null,
            retrievedAt: '2026-10-31T00:00:00.000Z',
            fields: Object.freeze([
                'rating',
                'reviewCount',
                'recommendationPercent',
                'guestRange',
                'discountPercent',
                'tags',
                'datosDeInteres',
                'media',
                'about',
                'realWeddings',
                'spaces',
                'services',
                'location',
                'promos',
                'menus',
                'faqs',
                'reviews',
            ]),
        },
    ] as const satisfies readonly EzkertzaDerioEvidence[]),
});

/** Tipo derivado para consumo estricto (cero `any`). */
export type EzkertzaDerioVenue = typeof EZKERTZA_DERIO_VENUE;