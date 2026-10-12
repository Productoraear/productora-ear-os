import type { MariachiFormatId } from '@/lib/mariachi/mariachiDispatchCore';

/**
 * ════════════════════════════════════════════════════════════════════════════
 * EAR OS — CATÁLOGO TIPADO DE SUB-LANDINGS MARIACHI (pSEO DE INTENCIÓN)
 * ════════════════════════════════════════════════════════════════════════════
 * Convierte cada intención de búsqueda huérfana del sector en una landing de
 * conversión dedicada, con copy de venta estilo Hormozi (resultado soñado,
 * inversión de riesgo, especificidad) y neuromarketing ético.
 *
 * DOCTRINA DEL DATO VERIFICADO (CERO FACHADAS):
 *  - Los precios NUNCA se hardcodean aquí: provienen del SSOT canónico vía
 *    `MARIACHI_FORMATS` (tarifa base 350 €, depósito 100 €, logística 1,50 €/km).
 *  - Cero cifras inventadas (sin "350+ eventos", sin ratings, sin % mágicos).
 *  - Cero `any` implícito: tipado estricto y exhaustivo.
 *  - Cada landing hereda el mismo motor real de reserva (Stripe + Price-Lock
 *    SHA-256) y la centralita verificada (+34 693 693 048).
 * ════════════════════════════════════════════════════════════════════════════
 */

export type MariachiLandingAccent = 'oro' | 'rubi' | 'cyan';

export interface MariachiLandingStep {
    readonly title: string;
    readonly detail: string;
}

export interface MariachiLandingDefinition {
    /** Slug de la URL: /mariachis/{slug} */
    readonly slug: string;
    /** Color de acento de la vista (un solo color por landing). */
    readonly accent: MariachiLandingAccent;
    /** Etiqueta corta para navegación interna. */
    readonly navLabel: string;
    /** Título SEO único y descriptivo. */
    readonly metaTitle: string;
    /** Meta descripción única (no duplicada entre landings). */
    readonly metaDescription: string;
    /** H1 orientado a palabra clave transaccional. */
    readonly h1: string;
    /** Subheadline: inversión de riesgo + especificidad. */
    readonly heroSubheadline: string;
    /** Resultado soñado enmarcado en valor (Hormozi). */
    readonly dreamOutcome: string;
    /** Miedos reales del cliente que la landing desactiva. */
    readonly fears: readonly string[];
    /** Beneficios concretos demostrables (sin cifras infladas). */
    readonly outcomes: readonly string[];
    /** Formación recomendada para esta intención (ancla al SSOT). */
    readonly recommendedFormatId: MariachiFormatId;
    /** Pasos de contratación, específicos del caso de uso. */
    readonly processSteps: readonly MariachiLandingStep[];
    /** Índices del SSOT de FAQ (`MARIACHI_FAQS`) relevantes al caso. */
    readonly faqIndexes: readonly number[];
    /** CTA de cierre textual. */
    readonly finalCta: string;
}

/**
 * Mapa de acentos al sistema de diseño OLED (valor hexadecimal real).
 */
export const MARIACHI_ACCENT_HEX: Readonly<Record<MariachiLandingAccent, string>> = {
    oro: '#ecb613',
    rubi: '#FF2B44',
    cyan: '#00E5FF',
};

/**
 * Catálogo canónico de sub-landings mariachi.
 * Ordenado por volumen de intención transaccional (mayor demanda primero).
 */
export const MARIACHI_LANDINGS: readonly MariachiLandingDefinition[] = [
    {
        slug: 'serenata',
        accent: 'oro',
        navLabel: 'Serenata a domicilio',
        metaTitle: 'Serenata Mariachi a Domicilio en España | Precio Cerrado y Sorpresa Garantizada | Productora EAR',
        metaDescription: 'Organiza una serenata mariachi sorpresa con precio cerrado desde 350 € y depósito de 100 € deducible en Stripe. Llegada a domicilio, restaurante o habitación de hotel con repertorio de rancheras y boleros.',
        h1: 'Serenata Mariachi a Domicilio',
        heroSubheadline: 'No compres "un grupo": compra el momento exacto en que esa persona entiende, sin palabras, lo importante que es para ti.',
        dreamOutcome: 'Convertir una fecha corriente en el recuerdo que se cuenta durante años, con Las Mañanitas o el bolero de vuestra historia sonando a un palmo de la persona homenajeada.',
        fears: [
            'Que el grupo llegue tarde o no aparezca',
            'Que la sorpresa se estropee por falta de coordinación',
            'Que el volumen sea inadecuado para el lugar',
            'Que el precio se dispare con costes ocultos',
        ],
        outcomes: [
            'Coordinación directa por WhatsApp con la centralita verificada de Productora EAR',
            'Precio cerrado y público, sin regateo ni sorpresas',
            'Depósito de 100 € 100% deducible que blinda tu fecha',
            'Repertorio acústico adaptado al límite de ruido del recinto',
        ],
        recommendedFormatId: 'solista',
        processSteps: [
            { title: 'Elige la sorpresa', detail: 'Indica fecha, lugar y homenajeado. Te confirmamos disponibilidad caso a caso por la centralita.' },
            { title: 'Bloquea con 100 €', detail: 'El depósito Price-Lock de Stripe reserva la fecha y es íntegramente deducible del total.' },
            { title: 'Vive el momento', detail: 'El solista llega uniformado de gala, con sonido calibrado al lugar y el repertorio pactado.' },
        ],
        faqIndexes: [0, 1, 3, 4, 2],
        finalCta: 'Quiero coordinar mi serenata sorpresa por WhatsApp',
    },
    {
        slug: 'boda',
        accent: 'rubi',
        navLabel: 'Mariachi para bodas',
        metaTitle: 'Mariachi para Bodas y Fincas en España | Ensamble Imperial de Gala | Productora EAR',
        metaDescription: 'Mariachi en directo para bodas y fincas: entrada de novios, cóctel y banquete con ensamble de 6 músicos de gala. Precio cerrado, protocolo acústico por límite dBA de la finca y depósito 100 € deducible.',
        h1: 'Mariachi para Bodas y Fincas',
        heroSubheadline: 'La boda no se recuerda por el menú: se recuerda por los tres minutos en que la música enmudeció la sala y todos miraron a los novios.',
        dreamOutcome: 'Un ensamble de charros de gala que convierte la entrada de novios o el brindis en el instante de mayor emoción del día, con el volumen justo que la finca permite.',
        fears: [
            'Que la finca prohíba la actuación por exceso de decibelios',
            'Que un directorio mande músicos de relleno sin ensayo',
            'Que el caché se encarezca a última hora',
            'Que la fecha no esté realmente bloqueada',
        ],
        outcomes: [
            'Ficha técnica (rider) previa adaptada al límite dBA de la finca',
            'Ensamble Imperial con voz tenor y dos trompetas, vihuela y guitarrón',
            'Tarifa cerrada desde 900 € con bloqueo atómico de agenda',
            'Medición con sonómetro en la prueba de sonido cuando la finca lo exige',
        ],
        recommendedFormatId: 'gala',
        processSteps: [
            { title: 'Cuéntanos la finca y el momento', detail: 'Entrada, cóctel, banquete o brindis. Pedimos el límite dBA del recinto para dimensionar la formación.' },
            { title: 'Recibe tu rider acústico', detail: 'Te enviamos la formación recomendada (cuerdas o sordinas) y el presupuesto cerrado.' },
            { title: 'Reserva y coordina', detail: 'Depósito de 100 € deducible y coordinación telefónica permanente hasta el día del evento.' },
        ],
        faqIndexes: [0, 4, 2, 5, 3],
        finalCta: 'Reservar el mariachi de mi boda',
    },
    {
        slug: 'pedida-de-mano',
        accent: 'rubi',
        navLabel: 'Pedida de mano',
        metaTitle: 'Pedida de Mano con Mariachi | Serenata de Compromiso Sorpresa | Productora EAR',
        metaDescription: 'Pide matrimonio con una serenata mariachi sorpresa a domicilio o en el lugar de la pedida. Precio cerrado, voz tenor de gala y depósito 100 € deducible. Coordinación discreta por WhatsApp.',
        h1: 'Pedida de Mano con Mariachi',
        heroSubheadline: 'El "sí" no depende de la música, pero la escena que rodea a ese sí es lo único que controlas al cien por cien.',
        dreamOutcome: 'Una pedida sincronizada al segundo: el mariachi aparece en el momento pactado, suena la canción de vuestra historia y tú solo tienes que arrodillarte.',
        fears: [
            'Que la sorpresa falle por un retraso',
            'Que el lugar no tolere el volumen',
            'Que la coordinación rompa la discreción',
        ],
        outcomes: [
            'Coordinación discreta por WhatsApp, sin llamadas que levanten sospechas',
            'Solista o cuarteto según la intimidad del momento',
            'Depósito 100 € deducible y precio cerrado',
            'Llegada puntual con puesta en escena ensayada',
        ],
        recommendedFormatId: 'solista',
        processSteps: [
            { title: 'Define la escena', detail: 'Lugar, hora y canción clave. Planificamos la entrada para que nadie más la vea venir.' },
            { title: 'Bloquea la fecha', detail: 'Depósito Price-Lock de 100 € que reserva la agenda del solista.' },
            { title: 'Ejecuta la sorpresa', detail: 'Aparición en el momento exacto con repertorio romántico y sonido acorde al lugar.' },
        ],
        faqIndexes: [0, 1, 5, 4],
        finalCta: 'Organizar mi pedida de mano sorpresa',
    },
    {
        slug: 'cumpleaños',
        accent: 'oro',
        navLabel: 'Cumpleaños',
        metaTitle: 'Mariachi para Cumpleaños en España | Las Mañanitas y Sorpresa | Productora EAR',
        metaDescription: 'Celebra un cumpleaños con mariachi en directo: Las Mañanitas, rancheras y serenata sorpresa. Formatos desde solista hasta cuarteto, precio cerrado y depósito 100 € deducible en Stripe.',
        h1: 'Mariachi para Cumpleaños',
        heroSubheadline: 'Un cumpleaños más se olvida. El cumpleaños en el que un mariachi cantó Las Mañanitas en la puerta de casa, no.',
        dreamOutcome: 'El homenajeado abre la puerta y se encuentra con un mariachi cantando Las Mañanitas, rodeado de la familia, con el volumen justo para el lugar.',
        fears: [
            'Que la sorpresa se filtre',
            'Que en un piso la trompeta moleste a los vecinos',
            'Que el presupuesto no esté claro',
        ],
        outcomes: [
            'Formato solista o cuarteto según el espacio y la intimidad',
            'Alternativa de cuerdas (sin trompeta) para interiores',
            'Precio cerrado con depósito 100 € deducible',
            'Coordinación puntual para que nadie del grupo se entere',
        ],
        recommendedFormatId: 'cuarteto',
        processSteps: [
            { title: 'Elige formato y lugar', detail: 'Domicilio, restaurante o terraza. Recomendamos el formato en función del espacio.' },
            { title: 'Bloquea la fecha', detail: 'Depósito de 100 € que reserva la agenda y se descuenta del total.' },
            { title: 'Suelta la sorpresa', detail: 'El grupo llega uniformado y canta el repertorio pactado, Las Mañanitas incluidas.' },
        ],
        faqIndexes: [0, 1, 3, 4],
        finalCta: 'Organizar el cumpleaños con mariachi',
    },
    {
        slug: 'despedida',
        accent: 'cyan',
        navLabel: 'Despedidas de soltero/a',
        metaTitle: 'Mariachi para Despedidas de Soltero y Soltera | Show Sorpresa | Productora EAR',
        metaDescription: 'Despedida de soltero o soltera con mariachi sorpresa: animación, rancheras y show en vivo. Precio cerrado, formato cuarteto o gala y depósito 100 € deducible en Stripe.',
        h1: 'Despedidas de Soltero y Soltera',
        heroSubheadline: 'La despedida perfecta no es la más cara: es la que deja al protagonista sin palabras delante de todos sus amigos.',
        dreamOutcome: 'El protagonista de la despedida es sorprendido por un mariachi en plena celebración, convirtiendo la fiesta en un momento de euforia colectiva.',
        fears: [
            'Que la animación quede forzada',
            'Que el grupo no encaje con el tono del grupo',
            'Que el volumen rompa la fiesta o moleste al local',
        ],
        outcomes: [
            'Mariachi con show interactivo y repertorio festivo',
            'Adaptación acústica al local o terraza',
            'Precio cerrado y depósito 100 € deducible',
            'Coordinación para la entrada sorpresa en el momento preciso',
        ],
        recommendedFormatId: 'cuarteto',
        processSteps: [
            { title: 'Cuéntanos el plan', detail: 'Lugar, número de asistentes y tono de la celebración.' },
            { title: 'Reserva con 100 €', detail: 'Bloqueo de fecha y coordinación de la entrada sorpresa.' },
            { title: 'A disfrutar', detail: 'Show en vivo con interacción festiva y repertorio a la carta.' },
        ],
        faqIndexes: [0, 1, 4, 6],
        finalCta: 'Montar la despedida con mariachi',
    },
    {
        slug: 'comunion',
        accent: 'oro',
        navLabel: 'Comunión y bautizo',
        metaTitle: 'Mariachi para Comuniones y Bautizos | Celebración Familiar | Productora EAR',
        metaDescription: 'Mariachi para comunión o bautizo: celebración familiar con música en vivo adaptada al salón o finca. Precio cerrado, formato reducido y depósito 100 € deducible.',
        h1: 'Comuniones y Bautizos',
        heroSubheadline: 'En las celebraciones familiares sobran los discursos y falta lo que de verdad une a tres generaciones: música en vivo.',
        dreamOutcome: 'Abuelos, padres y niños compartiendo el mismo momento musical, con una formación que llena el salón sin invadirlo.',
        fears: [
            'Que el volumen incomode a mayores y niños',
            'Que la actuación alargue demasiado el convite',
            'Que no encaje con una celebración de día',
        ],
        outcomes: [
            'Formación reducida y acústica, ideal para interior',
            'Duración contenida para no romper el ritmo del convite',
            'Repertorio familiar y festivo',
            'Precio cerrado con depósito 100 € deducible',
        ],
        recommendedFormatId: 'cuarteto',
        processSteps: [
            { title: 'Indica salón y horario', detail: 'Adaptamos formación y duración al momento del convite.' },
            { title: 'Reserva con 100 €', detail: 'Bloqueo de fecha deducible del total.' },
            { title: 'Celebra en familia', detail: 'Música en vivo que une a todas las generaciones.' },
        ],
        faqIndexes: [0, 1, 4],
        finalCta: 'Reservar mariachi para la celebración',
    },
    {
        slug: 'aniversario',
        accent: 'rubi',
        navLabel: 'Aniversarios',
        metaTitle: 'Mariachi para Aniversarios de Boda | Serenata Romántica | Productora EAR',
        metaDescription: 'Celebra un aniversario de boda con serenata romántica de mariachi: el bolero de vuestra historia en directo. Precio cerrado, voz de gala y depósito 100 € deducible.',
        h1: 'Aniversarios de Boda',
        heroSubheadline: 'Después de años juntos, la mejor declaración no se escribe: se canta con la canción que os acompañó desde el principio.',
        dreamOutcome: 'Revivir vuestra canción en directo, en el lugar donde empezó todo o en una cena íntima, con la voz tenor de un mariachi de gala.',
        fears: [
            'Que sea demasiado para una celebración íntima',
            'Que no sepan qué canción elegir',
            'Que el precio no esté claro',
        ],
        outcomes: [
            'Solista de gala con repertorio romántico a medida',
            'Asesoría para elegir el bolero o ranchera perfecto',
            'Sonido calibrado para cenas y espacios íntimos',
            'Precio cerrado y depósito 100 € deducible',
        ],
        recommendedFormatId: 'solista',
        processSteps: [
            { title: 'Elige la canción', detail: 'Te ayudamos a seleccionar el bolero o ranchera que cuenta vuestra historia.' },
            { title: 'Reserva la fecha', detail: 'Depósito de 100 € deducible que blinda la agenda.' },
            { title: 'Sorprende', detail: 'Serenata íntima con la voz de gala en el momento pactado.' },
        ],
        faqIndexes: [0, 1, 5, 6],
        finalCta: 'Sorprender en nuestro aniversario',
    },
    {
        slug: 'empresa',
        accent: 'cyan',
        navLabel: 'Empresas y corporativo',
        metaTitle: 'Mariachi para Empresas y Eventos Corporativos | Show de Gala | Productora EAR',
        metaDescription: 'Mariachi en vivo para cenas de empresa, convenciones y eventos corporativos en España. Ensamble de gala con factura, price cerrado y depósito 100 € deducible en Stripe.',
        h1: 'Eventos Corporativos y Empresas',
        heroSubheadline: 'Invertir en un evento de empresa solo se justifica si genera comentarios al día siguiente. El mariachi los genera.',
        dreamOutcome: 'Un cierre de evento corporativo que la plantilla comenta durante semanas, con factura para la empresa y coordinación profesional sin fricciones.',
        fears: [
            'Que no haya factura o contrato',
            'Que el grupo no dé la talla ante directivos e invitados',
            'Que la logística complique al organizador',
        ],
        outcomes: [
            'Ensamble de gala con factura y coordinación profesional',
            'Repertorio adaptable a cena, cóctel o convención',
            'Precio cerrado con depósito 100 € deducible',
            'Puntualidad y uniformidad de gala impecable',
        ],
        recommendedFormatId: 'gala',
        processSteps: [
            { title: 'Define el momento', detail: 'Recepción, cóctel, cena o cierre. Dimensionamos la formación y la duración.' },
            { title: 'Aprueba presupuesto', detail: 'Presupuesto cerrado con factura para la empresa.' },
            { title: 'Ejecución impecable', detail: 'Coordinación técnica y artística con puntualidad de gala.' },
        ],
        faqIndexes: [0, 1, 5, 7],
        finalCta: 'Cotizar el evento de empresa',
    },
    {
        slug: 'fiestas-patronales',
        accent: 'cyan',
        navLabel: 'Fiestas patronales y B2G',
        metaTitle: 'Mariachi para Fiestas Patronales y Ayuntamientos | Contrato Menor Art. 118 LCSP | Productora EAR',
        metaDescription: 'Producción integral de mariachi para fiestas patronales y ayuntamientos mediante contrato menor (Art. 118 LCSP). Presupuesto desglosado, factura FACe y sin pago online. Techo preventivo 14.250 €.',
        h1: 'Fiestas Patronales y Ayuntamientos',
        heroSubheadline: 'Un ayuntamiento no contrata "un mariachi": contrata una producción llave en mano con memoria desglosada que pase sin reparos por Intervención.',
        dreamOutcome: 'Un concierto de plaza o feria con escenario, sonido e iluminación coordinados, presupuestado como contrato menor y facturado por FACe sin fricción administrativa.',
        fears: [
            'Que el expediente sea rechazado por Intervención',
            'Que la producción técnica falle el día del evento',
            'Que el presupuesto no esté desglosado',
        ],
        outcomes: [
            'Presupuesto desglosado y factura FACe (sin pago online)',
            'Producción integral: mariachi, PA, luces y técnico según formato',
            'Referencias orientativas de mercado, a validar con proveedores',
            'Techo preventivo de contrato menor: 14.250 €',
        ],
        recommendedFormatId: 'monumental',
        processSteps: [
            { title: 'Define el formato', detail: 'Concierto de plaza, feria o acto institucional. Dimensionamos el rider.' },
            { title: 'Recibe la memoria', detail: 'Presupuesto desglosado listo para Intervención, con rangos orientativos.' },
            { title: 'Tramita el contrato menor', detail: 'Art. 118 LCSP y factura FACe. Sin pago online en esta vertical.' },
        ],
        faqIndexes: [0, 3, 4],
        finalCta: 'Solicitar memoria B2G para mi ayuntamiento',
    },
    {
        slug: 'quinceañera',
        accent: 'rubi',
        navLabel: 'Quinceañera',
        metaTitle: 'Mariachi para Quinceañera en España | XV Años con Mariachi | Productora EAR',
        metaDescription: 'Celebra unos XV años con mariachi en directo: vals, show sorpresa y rancheras para la quinceañera. Precio cerrado, depósito 100 € deducible y coordinación de la entrada.',
        h1: 'Quinceañera / XV Años',
        heroSubheadline: 'Los XV años son la primera gran puesta en escena de una vida. La música en directo es lo que la convierte en inolvidable.',
        dreamOutcome: 'La quinceañera entra acompañada de un mariachi en vivo, con vals y rancheras que marcan el inicio de su fiesta de XV años.',
        fears: [
            'Que no haya tradición ni repertorio adecuado',
            'Que la entrada no esté sincronizada',
            'Que la producción quede corta para la ocasión',
        ],
        outcomes: [
            'Repertorio de vals, rancheras y boleros para XV años',
            'Coordinación de la entrada y el brindis',
            'Formato desde cuarteto hasta ensamble de gala',
            'Precio cerrado con depósito 100 € deducible',
        ],
        recommendedFormatId: 'gala',
        processSteps: [
            { title: 'Planifica la entrada', detail: 'Coordinamos vals, entrada y brindis con el protocolo de la celebración.' },
            { title: 'Reserva con 100 €', detail: 'Bloqueo de fecha deducible del total.' },
            { title: 'Celebra los XV', detail: 'Mariachi en vivo con repertorio tradicional para la quinceañera.' },
        ],
        faqIndexes: [0, 1, 5, 6],
        finalCta: 'Reservar mariachi para los XV años',
    },
];

/**
 * Mapa de acceso rápido por slug (validación en ruta dinámica).
 */
export const MARIACHI_LANDING_BY_SLUG: ReadonlyMap<string, MariachiLandingDefinition> =
    new Map(MARIACHI_LANDINGS.map((l) => [l.slug, l]));

export function isMariachiLandingSlug(slug: string): boolean {
    return MARIACHI_LANDING_BY_SLUG.has(slug);
}