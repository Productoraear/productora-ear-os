/**
 * ════════════════════════════════════════════════════════════════════════════
 * ARCHIVO HISTÓRICO RECUPERADO — edwinagudelo.es (2009 → 2023)
 * ════════════════════════════════════════════════════════════════════════════
 * Reconstrucción forense del sitio propio del operador (Edwin Agudelo), dado
 * de baja tras un incidente de seguridad. Fuente única de recuperación:
 * Internet Archive Wayback Machine (snapshots con timestamp explícito).
 *
 * DOCTRINA DE RECUPERACIÓN (CERO INVENCIÓN):
 *  - Solo se transcribe lo que consta en el snapshot citado. Cada bloque lleva
 *    su `provenance` con URL original, timestamp y campos recuperados.
 *  - Los títulos de canciones son HECHOS de repertorio, no obra ajena: no se
 *    reproduce letra, audio ni partitura alguna.
 *  - Datos personales de terceros (manager y prensa del archivo) NO se
 *    almacenan: la recuperación se limita al titular del dominio y a la línea
 *    oficial que él mismo publicaba (`+34 693 693 048`).
 *  - Las ambigüedades del original se declaran en `editorialNotes`, no se
 *    resuelven por conveniencia.
 *
 * Uso previsto: alimentar la sección «Mundo del Mariachi» del hub comercial y
 * el selector de repertorio, sin copiar una sola línea de copy del archivo.
 * ════════════════════════════════════════════════════════════════════════════
 */

/** Evidencia de origen de cada bloque recuperado. */
export interface ArchiveProvenance {
    /** URL original reconstruible en la Wayback Machine. */
    readonly originalUrl: string;
    /** Timestamp exacto del snapshot (`YYYYMMDDhhmmss`). */
    readonly waybackTimestamp: string;
    /** URL del snapshot consultado. */
    readonly snapshotUrl: string;
    /** Fecha de consulta de la recuperación (ISO-8601, solo fecha). */
    readonly retrievedAt: string;
    /** Campos efectivamente recuperados del snapshot. */
    readonly fields: readonly string[];
}

/** Categoría de repertorio con sus títulos exactos. */
export interface RepertoireCategory {
    readonly id: string;
    readonly label: string;
    /** Ocasión comercial a la que sirve el repertorio. */
    readonly occasion: string;
    readonly titles: readonly string[];
    /** Decisiones editoriales sobre el original (ambigüedades, duplicados). */
    readonly editorialNotes: string;
    readonly provenance: ArchiveProvenance;
}

/** Servicio artístico recuperado del catálogo histórico. */
export interface ArchivedService {
    readonly id: string;
    readonly label: string;
    /** Qué entregaba el servicio según el snapshot. */
    readonly delivery: string;
    /** `true` si el servicio exige desplazamiento físico. */
    readonly requiresTravel: boolean;
}

/** Artículo del clúster temático «Mundo del mariachi». */
export interface ArchivedArticle {
    /** Slug recuperado del índice Wayback (`true` en `urlConfirmed`). */
    readonly slug: string;
    /** Titular recuperado del snapshot. */
    readonly heading: string;
    /** Ángulo de contenido, en una línea. */
    readonly angle: string;
    /**
     * `true` si el slug consta en el índice de la Wayback Machine;
     * `false` si el titular se recuperó del menú del hub pero su URL no
     * quedó archivada con nombre propio (se declara, no se inventa).
     */
    readonly urlConfirmed: boolean;
}

const RETRIEVED_AT = '2026-10-28';

/** Línea oficial recuperada del propio archivo (titular: el operador). */
export const ARCHIVE_OFFICIAL_LINE = '+34 693 693 048';

/** Identidad de marca recuperada del archivo propio. */
export const ARCHIVE_BRAND_ASSETS = Object.freeze({
    /** Claim de la etapa 2019–2021. */
    taglineV1: 'Tu mensajero de sentimientos',
    /** Claim operativo de la etapa 2019–2021. */
    operationClaim: 'Mariachis 24 horas',
    /** Claim de la etapa 2022–2023. */
    taglineV2: 'Sin Igual',
    /** Claim de conversión de la etapa 2022–2023. */
    conversionClaim: 'Ahora es cuando todo cobra sentido',
    /** Gancho comercial recuperado (regalo por contacto). */
    welcomeHook: '150 € en complementos por llegar hasta aquí',
    /** Promesa de disponibilidad. */
    availability: 'Atención 24 horas',
    /** Rango de formación declarado en el archivo. */
    formationRange: 'de 6 a 13 integrantes',
    /** Criterio de calidad que el propio archivo publicaba. */
    qualityStandard:
        'Prueba de sonido previa, trajes profesionales de charro, repertorio a gusto del contratante y puntualidad: eso distingue un servicio costoso de uno caro.',
    provenance: Object.freeze({
        originalUrl: 'https://edwinagudelo.es/servicios/',
        waybackTimestamp: '20210511155036',
        snapshotUrl:
            'https://web.archive.org/web/20210511155036/https://edwinagudelo.es/servicios/',
        retrievedAt: RETRIEVED_AT,
        fields: Object.freeze([
            'taglineV1',
            'operationClaim',
            'welcomeHook',
            'availability',
            'formationRange',
            'officialLine',
        ]),
    } as const satisfies ArchiveProvenance),
} as const);

/* ══════════════════════════════════════════════════════════════════════════
 * REPERTORIO RECUPERADO POR CATEGORÍA
 * Recuperación PARCIAL declarada: se transcriben los títulos que constan en los
 * snapshots archivados. No se completa el catálogo con memoria ni invención:
 * 52 títulos verificados, ampliables sólo con nueva captura de la Wayback.
 * ══════════════════════════════════════════════════════════════════════════ */

export const ARCHIVE_REPERTOIRE: readonly RepertoireCategory[] = Object.freeze([
    {
        id: 'boda',
        label: 'Canciones para boda (románticas)',
        occasion: 'Ceremonia, entrada de novios, primer baile y cóctel',
        titles: Object.freeze([
            'Alma corazón y vida',
            'Amanecí en tus brazos',
            'Amor de los dos',
            'Contigo aprendí',
            'En tu pelo',
            'Entrega total',
            'Escándalo',
            'Esclavo y amo',
            'Hermoso cariño',
            'La mano de Dios',
            'La venia bendita',
            'Millón de primaveras',
            'Novia mía',
            'Nuestro juramento',
            'Piel de Niña',
            'Para siempre',
            'Qué bonito amor',
            'Sabes una cosa',
            'Si nos dejan',
            'Somos novios',
            'Te amaré toda la vida',
            'Te lo pido por favor',
            'Tengo una amante',
        ]),
        editorialNotes:
            '23 títulos transcritos literalmente del snapshot. «Hermoso cariño» y «Qué bonito amor» reaparecen en otras categorías del propio archivo: se conservan en ambas por fidelidad a la fuente, no por error de duplicado.',
        provenance: Object.freeze({
            originalUrl: 'https://edwinagudelo.es/canciones-para-boda/',
            waybackTimestamp: '20221130145032',
            snapshotUrl:
                'https://web.archive.org/web/20221130145032/https://edwinagudelo.es/canciones-para-boda/',
            retrievedAt: RETRIEVED_AT,
            fields: Object.freeze(['titles']),
        } as const satisfies ArchiveProvenance),
    },
    {
        id: 'quinceanera',
        label: 'Canciones 15 años',
        occasion: 'Fiesta de quince años, vals y entrada de la quinceañera',
        titles: Object.freeze([
            'Mi niña bonita',
            'Yo te esperaba 15 primaveras',
            'Las mañanitas o Las nochecitas mexicanas',
            'Happy birthday',
            'Hermoso cariño',
            'Motivos',
            'Ha llegado un Ángel',
            'Quince Años',
            'El Camino de la vida',
            'De niña a mujer',
            'Ojalá no crecieras',
            'Sabes Una Cosa',
        ]),
        editorialNotes:
            '12 títulos. «Las mañanitas o Las nochecitas mexicanas» se conserva como entrada única porque así figuraba en el original (dos variantes de la misma pieza).',
        provenance: Object.freeze({
            originalUrl: 'https://edwinagudelo.es/canciones-15-anos-quinceanera/',
            waybackTimestamp: '20220527224634',
            snapshotUrl:
                'https://web.archive.org/web/20220527224634/https://edwinagudelo.es/canciones-15-anos-quinceanera/',
            retrievedAt: RETRIEVED_AT,
            fields: Object.freeze(['titles']),
        } as const satisfies ArchiveProvenance),
    },
    {
        id: 'dia-madre',
        label: 'Canciones día de la madre',
        occasion: 'Regalo de mayo, homenaje y serenata familiar',
        titles: Object.freeze([
            'Algún día mamá',
            'Mi vejez',
            'Hermoso cariño',
            'Mamá Vieja',
            'Qué Bonito Amor',
            'Rayito de Luna',
            'Te Amaré Toda La Vida',
        ]),
        editorialNotes:
            '7 títulos. La frase «Aunque no sea mayo» encabezaba la lista en el original como reclamo, no como canción: se excluye deliberadamente del repertorio.',
        provenance: Object.freeze({
            originalUrl:
                'https://edwinagudelo.es/canciones-dia-de-la-madre-mariachis/',
            waybackTimestamp: '20220527225200',
            snapshotUrl:
                'https://web.archive.org/web/20220527225200/https://edwinagudelo.es/canciones-dia-de-la-madre-mariachis/',
            retrievedAt: RETRIEVED_AT,
            fields: Object.freeze(['titles']),
        } as const satisfies ArchiveProvenance),
    },
    {
        id: 'dia-padre',
        label: 'Canciones para el día del Padre',
        occasion: 'Regalo de marzo, homenaje y comida familiar',
        titles: Object.freeze([
            'Las mañanitas o Las nochecitas mexicanas',
            'Happy birthday',
            'Mi viejo',
            'El hombre que más te amó',
            'Mi querido cascarrabias',
            'Mi vejez',
            'Cuando yo quería ser grande',
            'El rey',
            'Hermoso cariño',
            'Amigo',
        ]),
        editorialNotes:
            '10 títulos transcritos del snapshot de 2022-10-05 (entrada firmada por el propio autor el 2 de abril de 2022).',
        provenance: Object.freeze({
            originalUrl:
                'https://edwinagudelo.es/canciones-para-el-dia-del-padre-mariachis/',
            waybackTimestamp: '20221005215629',
            snapshotUrl:
                'https://web.archive.org/web/20221005215629/https://edwinagudelo.es/canciones-para-el-dia-del-padre-mariachis/',
            retrievedAt: RETRIEVED_AT,
            fields: Object.freeze(['titles', 'publishedAt']),
        } as const satisfies ArchiveProvenance),
    },
] as const satisfies readonly RepertoireCategory[]);

/** Nº total de títulos recuperados (suma real, no estimación). */
export const ARCHIVE_REPERTOIRE_TOTAL: number = ARCHIVE_REPERTOIRE.reduce(
    (total, category) => total + category.titles.length,
    0,
);

/* ══════════════════════════════════════════════════════════════════════════
 * CATÁLOGO DE SERVICIOS RECUPERADO
 * ══════════════════════════════════════════════════════════════════════════ */

export const ARCHIVE_SERVICES: readonly ArchivedService[] = Object.freeze([
    {
        id: 'regalo-boda',
        label: 'Regalo de boda',
        delivery: 'Sorprender a los novios con mariachi en directo.',
        requiresTravel: true,
    },
    {
        id: 'regalo-cumpleanos',
        label: 'Obsequio de cumpleaños',
        delivery: 'Serenata sorpresa de cumpleaños en domicilio o restaurante.',
        requiresTravel: true,
    },
    {
        id: 'fiesta-quince-anos',
        label: 'Fiesta de quince años',
        delivery: 'Entrada, vals y repertorio de XV años.',
        requiresTravel: true,
    },
    {
        id: 'regalo-dia-madre',
        label: 'Regalo día de la Madre',
        delivery: 'Serenata de mayo con repertorio de madre.',
        requiresTravel: true,
    },
    {
        id: 'regalo-dia-padre',
        label: 'Regalo día del Padre',
        delivery: 'Serenata de marzo con repertorio de padre.',
        requiresTravel: true,
    },
    {
        id: 'serenata',
        label: 'Serenata',
        delivery: 'Actuación a domicilio en horario nocturno.',
        requiresTravel: true,
    },
    {
        id: 'cancion-personalizada',
        label: 'Canción personalizada',
        delivery: 'Composición a medida con el nombre y la historia del homenajeado.',
        requiresTravel: false,
    },
    {
        id: 'serenata-virtual',
        label: 'Serenata virtual',
        delivery: 'Actuación emitida en directo para destinatarios a distancia.',
        requiresTravel: false,
    },
    {
        id: 'video-personalizado',
        label: 'Vídeo personalizado',
        delivery: 'Pieza audiovisual grabada con dedicatoria.',
        requiresTravel: false,
    },
    {
        id: 'show-solista',
        label: 'Show como solista',
        delivery: 'Actuación de voz solista con acompañamiento.',
        requiresTravel: true,
    },
    {
        id: 'show-grupo',
        label: 'Show con grupo de mariachis',
        delivery: 'Formación completa de 6 a 13 integrantes.',
        requiresTravel: true,
    },
    {
        id: 'show-caballos',
        label: 'Show cantando a caballo',
        delivery: 'Número ecuestre con mariachi.',
        requiresTravel: true,
    },
] as const satisfies readonly ArchivedService[]);

/* ══════════════════════════════════════════════════════════════════════════
 * CLÚSTER TEMÁTICO «EL MUNDO DEL MARIACHI» — RECUPERADO DE LA WAYBACK
 * ══════════════════════════════════════════════════════════════════════════ */

export const ARCHIVE_WORLD_CLUSTER: readonly ArchivedArticle[] = Object.freeze([
    {
        slug: 'el-mundo-del-mariachi',
        heading: 'El mariachi es un género',
        angle: 'Hub del clúster: historia, instrumentos, protagonistas y grandes exponentes.',
        urlConfirmed: true,
    },
    {
        slug: 'origen-del-mariachi',
        heading: 'Orígenes del mariachi. ¿Cómo y dónde nace el mariachi?',
        angle: 'Tres siglos de desarrollo del son en la Nueva España con influencias europeas, africanas e indígenas.',
        urlConfirmed: true,
    },
    {
        slug: 'mariachi-patrimonio-inmaterial',
        heading: 'Declaran mariachi patrimonio inmaterial',
        angle: 'Reconocimiento UNESCO de la música de mariachi como patrimonio cultural inmaterial.',
        urlConfirmed: true,
    },
    {
        slug: 'festival-internacional-del-mariachi',
        heading: 'Festival internacional del mariachi',
        angle: 'Encuentro Internacional del Mariachi y la Charrería en Guadalajara, Jalisco.',
        urlConfirmed: false,
    },
    {
        slug: 'instrumentos-del-mariachi',
        heading: 'Principales instrumentos',
        angle: 'Violines, trompetas, vihuela, guitarrón y guitarra: la dotación del mariachi moderno.',
        urlConfirmed: true,
    },
    {
        slug: 'sabes-por-que-los-mariachis-visten-asi',
        heading: 'Trajes y vestuario',
        angle: 'Del atuendo rural de Jalisco (manta de algodón y sombrero de palma) al traje de charro.',
        urlConfirmed: true,
    },
    {
        slug: 'diferencias-entre-charros-y-mariachis',
        heading: '¿Cuál es la diferencia entre charros y mariachis?',
        angle: 'La regla de oro: a un charro jamás se le llama mariachi. Orígenes distintos, atuendos similares.',
        urlConfirmed: true,
    },
    {
        slug: 'te-ayudamos-a-contratar-un-mariachi',
        heading: 'Te ayudamos a contratar un mariachi',
        angle: 'Formación base de 5 a 13 músicos, factores de precio y presentación garantizada.',
        urlConfirmed: true,
    },
    {
        slug: 'que-quiere-decir-la-palabra-mariachi-aprende-sus-dos-significados',
        heading: '¿Qué quiere decir la palabra mariachi?',
        angle: 'Los dos significados documentados del término.',
        urlConfirmed: true,
    },
    {
        slug: 'como-son-los-mariachis',
        heading: '¿Cómo son los mariachis?',
        angle: 'Composición, indumentaria y carácter de la agrupación.',
        urlConfirmed: true,
    },
    {
        slug: 'cual-es-el-mejor-mariachi-mexicano',
        heading: '¿Cuál es el mejor mariachi mexicano?',
        angle: 'Criterios objetivos de calidad frente a fama.',
        urlConfirmed: true,
    },
    {
        slug: 'cuanto-cuesta-contratar-mariachis',
        heading: '¿Cuánto cuesta una hora de mariachi?',
        angle: 'Factores reales del precio: distancia, integrantes, fecha, calidad en directo y complementos.',
        urlConfirmed: true,
    },
    {
        slug: 'cuanto-vale-una-hora-de-mariachi',
        heading: '¿Cuánto vale una hora de mariachi?',
        angle: 'Distinción entre caro y costoso: prueba de sonido, traje, repertorio y puntualidad.',
        urlConfirmed: true,
    },
    {
        slug: 'el-mariachi-entrega-canciones-alegria-presencia-toque-mexicano',
        heading: 'El mariachi entrega canciones, alegría, presencia, toque mexicano',
        angle: 'Valor intangible del directo frente a la reproducción grabada.',
        urlConfirmed: true,
    },
    {
        slug: 'que-aporta-un-mariachi-en-tu-fiesta',
        heading: 'Qué aporta un mariachi en tu fiesta',
        angle: 'Ambientación, participación del invitado y recuerdo.',
        urlConfirmed: true,
    },
    {
        slug: 'razones-para-contratar-un-mariachi',
        heading: 'Razones para contratar un mariachi',
        angle: 'Motivos de contratación por tipo de celebración.',
        urlConfirmed: true,
    },
    {
        slug: 'recomendaciones-para-contratar-un-mariachi',
        heading: 'Recomendaciones para contratar un mariachi',
        angle: 'Checklist previo a la reserva.',
        urlConfirmed: true,
    },
    {
        slug: 'como-distinguir-un-buen-mariachi',
        heading: '¿Cómo distinguir un buen mariachi?',
        angle: 'Señales de profesionalidad verificables por el cliente.',
        urlConfirmed: true,
    },
    {
        slug: 'serenata-para-esa-persona-especial',
        heading: 'Serenata para esa persona especial',
        angle: 'Formato serenata, horario y puesta en escena.',
        urlConfirmed: true,
    },
    {
        slug: 'contratar-mariachis-para-cumpleanos',
        heading: 'Contratar mariachis para cumpleaños',
        angle: 'Cumpleaños de todas las edades.',
        urlConfirmed: true,
    },
    {
        slug: 'contratar-mariachis-fiesta-celebracion',
        heading: 'Contratar mariachis para fiesta o celebración',
        angle: 'Fiestas patronales, aniversarios y celebraciones de empresa.',
        urlConfirmed: true,
    },
    {
        slug: 'cancion-las-mananitas-con-mariachi',
        heading: 'Las mañanitas con mariachi',
        angle: 'La pieza de apertura por excelencia del repertorio mexicano.',
        urlConfirmed: true,
    },
] as const satisfies readonly ArchivedArticle[]);

/** Nº de artículos del clúster histórico (dato derivado del array). */
export const ARCHIVE_WORLD_CLUSTER_COUNT: number = ARCHIVE_WORLD_CLUSTER.length;

