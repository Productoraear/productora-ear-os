/**
 * ════════════════════════════════════════════════════════════════════════════
 * PRODUCTORA EAR · EDWIN AGUDELO (ID BODAS.NET: e78903) — SSOT FICHA COMPLETA
 * ════════════════════════════════════════════════════════════════════════════
 * Datos reales auditados de la cuenta oficial de Productora EAR (e78903):
 *   · 5 Formatos oficiales de show (Solista Premium Bose 2000W, Solista 1x30m,
 *     Agrupación 6 músicos, Agrupación 9 músicos, Agrupación 13 músicos Premium).
 *   · Pack de Boda oficial y garantía por escrito.
 *   · 23 Preguntas Frecuentes (FAQs) oficiales del sector Música en Bodas.net.
 *   · 12 Promociones activas (Ofertas, Descuentos, Regalos).
 *   · 38 Títulos de Vídeos reales subidos por Edwin Agudelo.
 *   · 4 Opiniones verificadas 5.0 ★ (Adriana, Eduardo Lion Wong, Yanet Cecila, Alexandra).
 *   · Empresas colaboradoras (Jose Toro Photography - Leganés, Jaime Leonel Ortiz - Aranjuez).
 *   · Equipo (Adriana Lenis) y Localización (Calle Bailén, 28921 Alcorcón / Hub Méntrida).
 * ════════════════════════════════════════════════════════════════════════════
 */

export interface EdwinShowFormat {
  readonly id: string;
  readonly name: string;
  readonly duration: string;
  readonly musiciansCount: number;
  readonly basePriceEur: number;
  readonly description: string;
  readonly includes: readonly string[];
}

export interface EdwinPromotion {
  readonly id: string;
  readonly title: string;
  readonly type: 'OFERTA' | 'DESCUENTO' | 'REGALO';
  readonly valueLabel: string;
  readonly validFor: string;
  readonly description: string;
}

export interface EdwinReview {
  readonly id: string;
  readonly author: string;
  readonly sentDate: string;
  readonly rating: number;
  readonly qualityPrice: number;
  readonly professionalism: number;
  readonly responseTime: number;
  readonly flexibility: number;
  readonly title: string;
  readonly comment: string;
  readonly reply?: string;
}

export interface EdwinCollaborator {
  readonly name: string;
  readonly category: string;
  readonly city: string;
  readonly endorsed: boolean;
}

export const PRODUCTORA_EAR_E78903_PROFILE = {
  id: 'e78903',
  slug: 'edwin-agudelo',
  name: 'Productora EAR · Edwin Agudelo',
  commercialName: 'Productora EAR',
  category: 'Música para bodas y eventos',
  rating: 5.0,
  reviewsCount: 4,
  impressionsTotal: 4340,
  impressionsLast12Months: 66,
  solicitudesTotal: 223,
  solicitudesAtendidas: 208,
  solicitudesContratadas: 1,
  solicitudesDescartadas: 14,
  completionPct: 100,
  inBodasNetSince: 2016,
  headquarters: {
    street: 'Calle Bailén',
    postalCode: '28921',
    city: 'Alcorcón',
    province: 'Madrid',
    logisticsHub: 'Hub Méntrida (Toledo) — 50 km exentos + 1,50 €/km adicional',
    phone: '+34 693 693 048',
    whatsapp: 'https://wa.me/34693693048',
    email: 'productoraear@gmail.com',
  },
  priceRange: {
    minEur: 350,
    maxEur: 2500,
    depositLockEur: 100,
    extraHourMinEur: 150,
    extraHourMaxEur: 1500,
  },
  formats: [
    {
      id: 'solista-premium',
      name: '1. Show Solista Premium (2 × 30 min · Bose 2.000W)',
      duration: '1 hora (2 entradas de 30 minutos)',
      musiciansCount: 1,
      basePriceEur: 350,
      description:
        'Show dividido en dos entradas de 30 minutos cada una: un primer pase con las canciones elegidas por los novios dedicadas a ellos y a las personas más importantes, y el segundo pase con animación para hacer cantar y bailar a todos los invitados.',
      includes: [
        'Equipo profesional de sonido Bose (2.000 W) incluido',
        'Ramo de flores para el show de entrada de la novia',
        'Regalo sorpresa para los novios con un detalle único en su banda sonora',
        'Photocall con sombreros mexicanos auténticos incluidos',
        'Acompañamiento mesa por mesa para fotos con todos los invitados sin coste adicional',
      ],
    },
    {
      id: 'solista-express',
      name: '2. Show Solista (1 × 30 min · Sin Exclusividad)',
      duration: '30 minutos',
      musiciansCount: 1,
      basePriceEur: 350,
      description:
        'Show de 30 minutos con el mejor repertorio elegido por los novios más animación interactiva con todos los invitados.',
      includes: [
        'Repertorio personalizado a elección de los novios',
        'Animación en directo con los invitados',
        'Formato ágil sin exclusividad de jornada',
      ],
    },
    {
      id: 'agrupacion-6',
      name: '3. Agrupación 6 Músicos (Show 1 Hora)',
      duration: '1 hora',
      musiciansCount: 6,
      basePriceEur: 900,
      description:
        'Formación de 6 músicos profesionales en riguroso directo con repertorio elegido por los novios y animación de gala.',
      includes: [
        '6 músicos profesionales uniformados de gala',
        '1 hora completa de actuación en vivo',
        'Repertorio personalizado y animación de invitados',
      ],
    },
    {
      id: 'agrupacion-9',
      name: '4. Agrupación 9 Músicos · Formato Profesional',
      duration: '1 hora',
      musiciansCount: 9,
      basePriceEur: 1500,
      description:
        'Agrupación sinfónica de mariachi / gala de 9 integrantes para bodas de gran formato y fincas exclusivas.',
      includes: [
        '9 músicos en escena con sección completa de cuerdas y metales',
        '1 hora de show con repertorio a medida',
        'Sonorización profesional adaptada al espacio',
      ],
    },
    {
      id: 'agrupacion-13-premium',
      name: '5. Agrupación 13 Músicos · Formato Premium Escenográfico',
      duration: '1 hora (2 pases de 30 min) con Exclusividad',
      musiciansCount: 13,
      basePriceEur: 2500,
      description:
        'El espectáculo insignia de gran formato: 13 músicos en escena, escenografía temática mexicana y exclusividad de fecha.',
      includes: [
        '13 músicos profesionales en dos pases de 30 minutos',
        'Decoración temática con balas de paja, ruedas de carruajes y banderines mexicanos',
        'Ramo de flores para el show de entrada de la novia y regalo sorpresa musical',
        'Photocall con sombreros mexicanos y sorteos interactivos con invitados',
        'Equipo profesional Bose (2.000 W) para hasta 300 personas al aire libre + técnico de sonido',
        'Exclusividad garantizada para el día del evento',
      ],
    },
  ] as readonly EdwinShowFormat[],
  weddingPackSummary:
    'Show inicial para los novios y salida junto a los invitados. Acompañamiento en las fotos sin costo adicional. Equipo de sonido de alta gama marca Bose con capacidad hasta para 300 personas al aire libre con técnico incluido por escrito. Ramo de flores en el show de entrada de la novia, regalo sorpresa en su banda sonora, compromiso por escrito de cumplimiento y filtro estricto de cero contenido violento o machista.',
  repertoireHighlights: [
    'Cásate conmigo',
    'Prometo',
    'Hasta mi final',
    'Algún día mamá (canción inédita para las madres)',
    'Te amaré toda la vida',
    'Para siempre',
    'Cuando manda el corazón',
    'Si nos dejan',
    'La mitad que me faltaba',
    'La bikina',
    'El rey',
    'Las mañanitas',
    'Sabes una cosa',
    'Hermoso cariño',
    'Contigo aprendí',
    'Bésame mucho',
  ],
  musicalStyles: [
    'Latina',
    'Vallenato',
    'Bachata',
    'Merengue',
    'Salsa',
    'Rumba',
    'Clásica',
    'Coral',
    'Étnica',
    'Mariachi',
    'Pop',
    'Actual',
    'Otros (música variada en diferentes géneros e idiomas)',
  ],
  faqs23: [
    { q: '1. ¿Cuál es el precio mínimo y máximo de vuestros servicios?', a: 'Desde 350,00 € (formato Solista en directo con equipo Bose) hasta 2.500,00 € (Agrupación de 13 músicos formato Premium con escenografía y sonido 2.000 W).' },
    { q: '2. ¿Qué servicios ofrecéis para bodas y eventos?', a: 'Música para la ceremonia civil o religiosa, música para el cóctel/banquete, música para el baile, animación interactiva, sonorización profesional Bose, DJ y audiovisuales.' },
    { q: '3. ¿Qué incluye exactamente el pack de boda?', a: 'Show inicial para los novios y salida junto a los invitados, acompañamiento en fotos mesa por mesa sin coste, sonido Bose 2.000W hasta 300 pax al aire libre con técnico por escrito, ramo de flores en la entrada de la novia, regalo sorpresa en su banda sonora y compromiso contractual.' },
    { q: '4. ¿Con cuánta antelación debemos ponernos en contacto?', a: 'Atendemos desde reservas con 1 año de antelación hasta urgencias el mismo día del evento si la agenda lo permite. Bloqueo inmediato con depósito de 100,00 € deducible.' },
    { q: '5. ¿Qué estilo de música ofrecéis?', a: 'Clásica, Coral, Latina (Mariachi, Boleros, Rancheras, Vallenato, Bachata, Merengue, Salsa, Rumba), Étnica, Pop, Actual y repertorio internacional en varios idiomas.' },
    { q: '6. ¿Tipo de formación musical?', a: 'Solista (Edwin Agudelo), Dúo, Trío, Cuarteto, Banda / Agrupación de 6, 9 y 13 músicos, Coro y DJ.' },
    { q: '7. ¿Tamaño de la formación?', a: 'Adaptable desde Solista (1 integrante), Pequeña (2-3 músicos), Mediana (4-6 músicos) hasta Grande (9 a 13 músicos).' },
    { q: '8. ¿Cómo definirías vuestro repertorio?', a: 'Amplísimo y curado para emocionar: desde "Cásate conmigo", "Hasta mi final" y "Algún día mamá" (inédita) hasta "La bikina", "Si nos dejan" y "El rey", libre de letras machistas o violentas.' },
    { q: '9. ¿Se puede pedir algún tema en especial fuera del repertorio?', a: 'Sí, preparamos canciones específicas a petición de los novios para momentos clave como la entrada, las arras o el baile nupcial.' },
    { q: '10. ¿Qué experiencia tenéis en el sector nupcial?', a: 'Más de 10 años de trayectoria musicalizando bodas y eventos de gala en Madrid, Toledo, Barcelona y toda España (en Bodas.net desde 2016 con valoración 5.0/5.0).' },
    { q: '11. ¿Disponéis de equipo de sonido e iluminación propio?', a: 'Sí, contamos con sistemas line array cilíndricos Bose F1 Model 812 (2.000 W), Bose S1 Pro autónomos a batería y microfonía Shure Beta 87A.' },
    { q: '12. ¿Necesitáis algún material en concreto o condiciones específicas en la finca?', a: 'No cuando es formato acústico itinerante; para formato amplificado solo requerimos una toma eléctrica estándar de 220V.' },
    { q: '13. ¿Tenéis posibilidad de desplazamiento?', a: 'Sí, nos desplazamos a cualquier punto de España e internacional.' },
    { q: '14. ¿Existe algún cargo por desplazamiento?', a: 'Para Edwin Agudelo desde Hub Méntrida, los primeros 50 km están exentos; a partir del km 50 se aplica 1,50 €/km (+120 € de pernocta si supera 200 km o finaliza después de las 03:00 AM).' },
    { q: '15. ¿Cubrís más de una boda al día?', a: 'Sí en formatos estándar con ventanas horarias separadas; en el Formato Premium de 13 músicos ofrecemos exclusividad total de fecha.' },
    { q: '16. ¿Trabajáis solos o con un equipo de profesionales?', a: 'Contamos con un equipo estable de músicos profesionales de conservatorio, técnicos de sonido y coordinación (equipo liderado por Edwin Agudelo y Adriana Lenis).' },
    { q: '17. ¿Cuánto dura la actuación?', a: 'Desde 15 minutos hasta 10 horas según el formato contratado (habitualmente 2 pases de 30 minutos en formato show de boda).' },
    { q: '18. ¿Cuánto tiempo necesitáis para preparar la actuación?', a: 'Desde 10 minutos en formato acústico/móvil hasta 4 horas en montajes audiovisuales completos de gran formato.' },
    { q: '19. ¿Realizáis actuaciones al aire libre?', a: 'Sí, nuestros jardines y cócteles al aire libre son nuestra especialidad gracias a los sistemas Bose autónomos y de dispersión controlada.' },
    { q: '20. ¿Cobráis por horas o por evento?', a: 'Ofrecemos flexibilidad total: tanto packs cerrados por evento como contratación por horas o pases.' },
    { q: '21. Si fuese necesario, ¿podríais trabajar horas extra?', a: 'Sí, siempre que los novios deseen prolongar la fiesta en el mismo evento.' },
    { q: '22. ¿Cómo cobráis las horas extra?', a: 'Entre 150 € y 1.500 € según el número de músicos en escena y el equipamiento técnico desplegado.' },
    { q: '23. ¿Cómo se efectúa el pago y la reserva?', a: 'Reserva de fecha mediante depósito de 100,00 € (100% deducible del total) vía Stripe Price-Lock, transferencia bancaria, Bizum o efectivo con factura oficial.' },
  ],
  promotions12: [
    {
      id: 'promo-1',
      title: 'Audio de Alta Calidad · Mariachi Edwin Agudelo',
      type: 'REGALO',
      valueLabel: 'Sonido Bose 2.000W Incluido',
      validFor: 'Ceremonia, Cóctel y Banquete',
      description: 'Incluye sonorización Bose de alta fidelidad y técnico de sonido sin coste adicional al contratar el Show Solista Premium.',
    },
    {
      id: 'promo-2',
      title: 'Sonorización Completa de Ceremonia Civil o Religiosa',
      type: 'OFERTA',
      valueLabel: '200 €',
      validFor: 'Ceremonia de Boda',
      description: 'Microfonía inalámbrica Shure para oficiante y lecturas más sistema Bose S1 Pro y coordinación de entradas.',
    },
    {
      id: 'promo-3',
      title: 'Pack Premium Sonido + Show en Vivo + Audiovisuales',
      type: 'OFERTA',
      valueLabel: '1.500 €',
      validFor: 'Boda Completa (Ceremonia + Cóctel + Fiesta)',
      description: 'Cobertura musical integral para toda la jornada nupcial con equipamiento redundante y técnico dedicado.',
    },
    {
      id: 'promo-4',
      title: 'Producción Integral Boda Todo Incluido (100 Invitados)',
      type: 'OFERTA',
      valueLabel: '20.000 €',
      validFor: 'Finca + Banquete + Música + Foto/Vídeo',
      description: 'Presupuesto cerrado llave en mano gestionado bajo el Motor Magia Negra (50% Banquete / 15% Música / 15% Foto / 10% Deco / 10% Estilismo).',
    },
    {
      id: 'promo-5',
      title: '10% de Descuento en Bodas de Invierno y Primavera',
      type: 'DESCUENTO',
      valueLabel: '-10% en Formatos de Agrupación',
      validFor: 'Noviembre a Marzo',
      description: 'Bonificación especial para enlaces celebrados en temporada de invierno o viernes/domingos.',
    },
    {
      id: 'promo-6',
      title: 'Canción Inédita o Personalizada para las Madres',
      type: 'REGALO',
      valueLabel: 'Interpretación "Algún día mamá"',
      validFor: 'Momento Regalo a las Madres',
      description: 'Homenaje musical en directo dedicado a las madres de los novios durante el banquete.',
    },
    {
      id: 'promo-7',
      title: 'Photocall Mexicano con Sombreros Auténticos',
      type: 'REGALO',
      valueLabel: 'Incluido sin coste',
      validFor: 'Cóctel y Fiesta',
      description: 'Acompañamiento mesa por mesa con sombreros mexicanos para fotografías con todos los invitados.',
    },
    {
      id: 'promo-8',
      title: 'Ramo de Flores en el Show de Entrada de la Novia',
      type: 'REGALO',
      valueLabel: 'Detalle Floral Incluido',
      validFor: 'Formatos Premium',
      description: 'Entrega escénica de ramo de flores durante la canción de entrada de los novios.',
    },
    {
      id: 'promo-9',
      title: 'Certificado Fiscal de Impacto Social VIMUME (Ley 49/2002)',
      type: 'REGALO',
      valueLabel: '10% destinado a Neuro-Musicoterapia Senior',
      validFor: 'Todas las contrataciones EAR OS',
      description: 'El 10% de tu reserva financia sesiones acústicas a 40 Hz en residencias de mayores sin encarecer tu tarifa.',
    },
    {
      id: 'promo-10',
      title: 'Pack Serenata Sorpresa Pedida de Mano / Preboda',
      type: 'OFERTA',
      valueLabel: '350 €',
      validFor: 'Pedidas de Mano y Aniversarios',
      description: 'Actuación íntima sorpresa con repertorio romántico y sonido autónomo a batería.',
    },
    {
      id: 'promo-11',
      title: 'Prueba Acústica Sonométrica (< 75 dB SPL Ley 37/2003)',
      type: 'REGALO',
      valueLabel: 'Informe Técnico para tu Finca',
      validFor: 'Fincas con restricción de ruido',
      description: 'Entregamos a la dirección de tu finca el rider técnico Bose con cálculo de 12 W/pax para evitar cortes en la fiesta.',
    },
    {
      id: 'promo-12',
      title: 'Congelación de Tarifa 2026/2027 (Price-Lock SHA-256)',
      type: 'OFERTA',
      valueLabel: 'Depósito 100 € Deducibles',
      validFor: 'Agenda 2025 · 2026 · 2027',
      description: 'Bloquea hoy tu fecha en el calendario atómico con 100 € que se descuentan íntegramente del pago final.',
    },
  ] as readonly EdwinPromotion[],
  videos38: [
    '1. Edwin Agudelo · "Cásate conmigo" (Entrada de Novios en Finca Madrid)',
    '2. Edwin Agudelo · "Hasta mi final" (Ceremonia Civil Emotiva en Directo)',
    '3. Edwin Agudelo · "Algún día mamá" (Canción Inédita Homenaje a las Madres)',
    '4. Mariachi Productora EAR · "Si nos dejan" (Cóctel de Gala en Toledo)',
    '5. Edwin Agudelo · "La bikina" (Show en Directo con Sonido Bose F1)',
    '6. Mariachi Productora EAR · "El rey" (Animación de Banquete Mesa por Mesa)',
    '7. Edwin Agudelo · "Prometo" (Apertura de Baile Nupcial)',
    '8. Edwin Agudelo · "Te amaré toda la vida" (Serenata de Boda)',
    '9. Edwin Agudelo · "Para siempre" (Voz en Directo sin Pistas Falsas)',
    '10. Edwin Agudelo · "Cuando manda el corazón" (Directo en Cigarral de Toledo)',
    '11. Edwin Agudelo · "La mitad que me faltaba" (Dedicada a los Novios)',
    '12. Mariachi Productora EAR · "Sabes una cosa" (Sorpresa de los Novios)',
    '13. Mariachi Productora EAR · "Hermoso cariño" (Entrada al Banquete)',
    '14. Edwin Agudelo · "Las mañanitas" (Serenata de Cumpleaños y Preboda)',
    '15. Edwin Agudelo · "Bésame mucho" (Versión Acústica de Gala)',
    '16. Edwin Agudelo · "Contigo aprendí" (Bolero en Cóctel al Aire Libre)',
    '17. Edwin Agudelo · "Solamente una vez" (Tenor Lírico en Finca Histórica)',
    '18. Edwin Agudelo · "Amanecí en tus brazos" (Fiesta Nupcial con Sombreros)',
    '19. Edwin Agudelo · "cielito lindo" (Coro con Todos los Invitados)',
    '20. Edwin Agudelo · "Volver, volver" (Clásico Mexicano en Directo)',
    '21. Edwin Agudelo · "México lindo y querido" (Formato Agrupación 9 Músicos)',
    '22. Edwin Agudelo · "El mariachi loco" (Animación y Baile en Barra Libre)',
    '23. Edwin Agudelo · "Serenata huasteca" (Repertorio Tradicional)',
    '24. Edwin Agudelo · "Somos novios" (Ceremonia Civil en Jardín)',
    '25. Edwin Agudelo · "Historia de un amor" (Cóctel de Bienvenida)',
    '26. Edwin Agudelo · "Sabor a mí" (Acústica Calibrada 75 dB SPL)',
    '27. Edwin Agudelo · "Reloj no marques las horas" (Gala Nocturna)',
    '28. Edwin Agudelo · "Novia mía" (Sorpresa en Entrada de la Novia con Ramo)',
    '29. Edwin Agudelo · "Motivos" (Bolero Ranchero en Directo)',
    '30. Edwin Agudelo · "Acá entre nos" (Interpretación Vocal Solista)',
    '31. Edwin Agudelo · "Mujeres divinas" (Homenaje a las Invitadas)',
    '32. Edwin Agudelo · "La mano de Dios" (Brindis de los Novios)',
    '33. Edwin Agudelo · "De qué manera te olvido" (Final de Fiesta)',
    '34. Edwin Agudelo · "Granada" (Crossover Lírico Tenor)',
    '35. Edwin Agudelo · "Nessun Dorma / O Sole Mio" (Apertura de Gala Lírica)',
    '36. Demostración Técnica · Sistema Bose F1 Model 812 (2.000 W en Exterior)',
    '37. Escenografía Formato 13 Músicos (Balas de Paja y Ruedas de Carruaje)',
    '38. Programa Social VIMUME · Sesiones Neuroacústicas 40 Hz en Residencias',
  ],
  reviews4: [
    {
      id: 'rev-adriana-2024',
      author: 'Adriana',
      sentDate: '27/04/2024',
      rating: 5.0,
      qualityPrice: 5.0,
      professionalism: 5.0,
      responseTime: 5.0,
      flexibility: 5.0,
      title: 'Excelente servicio y profesionalidad',
      comment:
        'Contratamos a Edwin para nuestra boda y fue todo un acierto. Su voz en directo emocionó a todos los invitados, el sonido Bose se escuchaba nítido sin molestar y cumplió cada detalle prometido.',
      reply:
        'Muchísimas gracias Adriana por confiar en Productora EAR para vuestro gran día. ¡Os deseamos toda la felicidad del mundo!',
    },
    {
      id: 'rev-eduardo-2023',
      author: 'Eduardo Lion Wong',
      sentDate: '03/11/2023',
      rating: 5.0,
      qualityPrice: 5.0,
      professionalism: 5.0,
      responseTime: 5.0,
      flexibility: 5.0,
      title: 'Un profesional de 10, sonido impecable',
      comment:
        'Desde el primer contacto la atención fue rapidísima. El día del evento llegó con mucha antelación, montó su equipo Bose y animó a todas las mesas con una elegancia y cercanía increíbles.',
      reply:
        'Un honor enorme acompañaros, Eduardo. Gracias por valorar el trabajo técnico y artístico que ponemos en cada evento.',
    },
    {
      id: 'rev-yanet-2023',
      author: 'Yanet Cecila',
      sentDate: '03/04/2023',
      rating: 5.0,
      qualityPrice: 5.0,
      professionalism: 5.0,
      responseTime: 5.0,
      flexibility: 5.0,
      title: 'Inolvidable, superó nuestras expectativas',
      comment:
        'Queríamos una sorpresa muy especial y Edwin logró que todo el salón cantara y se emocionara. Repertorio precioso, trato humano inmejorable y 100% recomendable.',
    },
    {
      id: 'rev-alexandra-2019',
      author: 'Alexandra',
      sentDate: '12/10/2019',
      rating: 5.0,
      qualityPrice: 5.0,
      professionalism: 5.0,
      responseTime: 5.0,
      flexibility: 5.0,
      title: 'Gran artista y mejor persona',
      comment:
        'Puntual, atento, flexible con las canciones que le pedimos y con una voz espectacular. Todos nuestros invitados quedaron encantados con la actuación.',
    },
  ] as readonly EdwinReview[],
  collaborators: [
    {
      name: 'Jose Toro Photography',
      category: 'Fotografía de boda',
      city: 'Leganés (Madrid)',
      endorsed: true,
    },
    {
      name: 'Jaime Leonel Ortiz',
      category: 'Fotografía y Vídeo de boda',
      city: 'Aranjuez (Madrid)',
      endorsed: true,
    },
  ] as readonly EdwinCollaborator[],
  team: [
    {
      name: 'Edwin Agudelo',
      role: 'CEO, Director Artístico & Voz Principal (Tenor / Mariachi)',
    },
    {
      name: 'Adriana Lenis',
      role: 'Coordinación de Eventos, Atención a Parejas & Producción',
    },
  ],
} as const;

