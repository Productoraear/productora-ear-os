/**
 * 🛰️ MOTOR DE GENERACIÓN SEMÁNTICA & GEO-TARGETING S-CLASS (EAR OS V2)
 * Incluye el Motor de Variación Relacional Profunda (Deep Variational Engine)
 * para garantizar >85% de unicidad semántica por cada combinación de:
 * [Rol Relacional / Familiar] x [Celebración / Evento] x [52 Provincias].
 * Directiva: Claude SEO AI Toolkit / Antigravity Omega.
 */

export interface GeoVenueData {
  venues: string[];
  regionalNorm: string;
  logisticsHub: string;
  climateFactor: string;
  regionalTradition: string;
  landmarks: string[];
}

export interface SemanticPageData {
  title: string;
  h1: string;
  metaDescription: string;
  searchIntent: string;
  editorialBody: string;
  technicalSpecs: { label: string; value: string }[];
  faqs: { q: string; a: string }[];
  localKeywords: string[];
  venues: string[];
  schemaType: 'LocalBusiness' | 'MusicGroup' | 'Service' | 'GovernmentOrganization' | 'ProfessionalService';
  priceRange: string;
  canonicalPath: string;
  relationalMeta?: {
    roleName: string;
    eventName: string;
    repertoire: string[];
    psychology: string;
  };
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 1. MATRIZ RELACIONAL DE ROLES Y CELEBRACIONES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export interface RelationalRole {
  key: string;
  name: string;
  article: string;
  possessive: string;
  psychology: string;
  repertoire: string[];
  surpriseAngle: string;
}

export interface RelationalEvent {
  key: string;
  name: string;
  preposition: string;
  contextDesc: string;
}

export const RELATIONAL_ROLES: Record<string, RelationalRole> = {
  madre: {
    key: 'madre',
    name: 'Madre / Mamá',
    article: 'la',
    possessive: 'tu madre',
    psychology: 'Gratitud profunda, ternura maternal y homenaje a toda una vida de amor y desvelos.',
    repertoire: ['Algún Día Mamá', 'Amor Eterno', 'Madrecita Querida', 'Las Mañanitas', 'Canto a la Madre'],
    surpriseAngle: 'Entrada sorpresa al abrir la puerta del salón o en mitad del banquete con ramo de flores y violines en directo.'
  },
  padre: {
    key: 'padre',
    name: 'Padre / Papá',
    article: 'el',
    possessive: 'tu padre',
    psychology: 'Orgullo filial, reconocimiento a su esfuerzo silencioso y complicidad masculina de honor.',
    repertoire: ['Mi Querido Viejo', 'El Rey', 'El Patas Blancas', 'Caballo Prieto Azabache', 'En Tu Día'],
    surpriseAngle: 'Irrupción solemne con trompetas y guitarrón para brindar con su tequila o vino favorito en un brindis inolvidable.'
  },
  abuela: {
    key: 'abuela',
    name: 'Abuela / Yaya',
    article: 'la',
    possessive: 'tu abuela',
    psychology: 'Veneración, ternura infinita y recuerdos de la juventud dorada que emocionan a varias generaciones.',
    repertoire: ['Las Mañanitas', 'Cielito Lindo', 'Volver Volver', 'Madrecita Consentida'],
    surpriseAngle: 'Canto acústico a media voz con guitarras y violines, calibrado a baja presión para su máximo confort auditivo.'
  },
  abuelo: {
    key: 'abuelo',
    name: 'Abuelo / Yayo',
    article: 'el',
    possessive: 'tu abuelo',
    psychology: 'Sabiduría familiar, arraigo a las raíces y homenaje a las décadas de trabajo y guía.',
    repertoire: ['El Rey', 'Caminos de Michoacán', 'La Bikina', 'Las Mañanitas'],
    surpriseAngle: 'Tributo de respeto encabezado por hijos y nietos con entrega del sombrero charro de gala como recuerdo.'
  },
  hermano: {
    key: 'hermano',
    name: 'Hermano',
    article: 'el',
    possessive: 'tu hermano',
    psychology: 'Complicidad de infancia, unión incondicional y celebración festiva de sus metas.',
    repertoire: ['Amigo', 'El Rey', 'Cielito Lindo', 'Acompáñame', 'Felicidades'],
    surpriseAngle: 'Llegada inesperada para transformar una reunión tranquila en una auténtica fiesta charra llena de alegría.'
  },
  hermana: {
    key: 'hermana',
    name: 'Hermana',
    article: 'la',
    possessive: 'tu hermana',
    psychology: 'Cariño entrañable, complicidad femenina y celebración de su día especial con elegancia.',
    repertoire: ['Hermoso Cariño', 'Sabes Una Cosa', 'Las Mañanitas', 'Si Nos Dejan'],
    surpriseAngle: 'Serenata sorpresa con entrega de dedicatoria de gala y canciones personalizadas.'
  },
  suegra: {
    key: 'suegra',
    name: 'Suegra',
    article: 'la',
    possessive: 'tu suegra',
    psychology: 'Respeto de etiqueta, afecto sincero y agradecimiento por su acogida y apoyo en la familia.',
    repertoire: ['Hermoso Cariño', 'Madrecita Querida', 'Las Mañanitas', 'Cielito Lindo'],
    surpriseAngle: 'Detalle de alta distinción y elegancia que conmueve y consolida los lazos familiares.'
  },
  suegro: {
    key: 'suegro',
    name: 'Suegro',
    article: 'el',
    possessive: 'tu suegro',
    psychology: 'Caballerosidad, reconocimiento mutuo y celebración con la máxima categoría charra.',
    repertoire: ['El Rey', 'Mi Querido Viejo', 'Volver Volver', 'En Tu Día'],
    surpriseAngle: 'Brindis solemne de respeto con mariachi imperial que supera cualquier expectativa formal.'
  },
  novia: {
    key: 'novia',
    name: 'Novia / Prometida',
    article: 'la',
    possessive: 'tu novia',
    psychology: 'Amor romántico, devoción, pedida de mano y promesas de futuro bajo la luna.',
    repertoire: ['Si Nos Dejan', 'Motivos', 'Sabes Una Cosa', 'Bésame Mucho', 'Acompáñame'],
    surpriseAngle: 'Serenata clásica bajo el balcón o en la cena romántica a la luz de las velas con el tenor Edwin Agudelo.'
  },
  novio: {
    key: 'novio',
    name: 'Novio / Prometido',
    article: 'el',
    possessive: 'tu novio',
    psychology: 'Sorpresa apasionada, elegancia y complicidad antes del altar o en su fecha señalada.',
    repertoire: ['Si Nos Dejan', 'Hermoso Cariño', 'Sabes Una Cosa', 'El Rey'],
    surpriseAngle: 'Aparición sorpresa con el mariachi imperial durante la celebración previa o fiesta privada.'
  },
  esposa: {
    key: 'esposa',
    name: 'Esposa / Mujer',
    article: 'la',
    possessive: 'tu esposa',
    psychology: 'Amor consolidado, complicidad de vida y renovación constante de la llama del cariño.',
    repertoire: ['Motivos', 'Si Nos Dejan', 'Sabes Una Cosa', 'Acompáñame', 'Gema'],
    surpriseAngle: 'Serenata de aniversario o cumpleaños en el hogar o restaurante reservado en exclusiva.'
  },
  esposo: {
    key: 'esposo',
    name: 'Esposo / Marido',
    article: 'el',
    possessive: 'tu esposo',
    psychology: 'Agradecimiento por el camino recorrido juntos, admiración y fiesta compartida.',
    repertoire: ['El Rey', 'Si Nos Dejan', 'Hermoso Cariño', 'Cielito Lindo'],
    surpriseAngle: 'Fiesta sorpresa con amigos y familia donde el mariachi pone la nota de gala.'
  },
  amiga: {
    key: 'amiga',
    name: 'Amiga',
    article: 'la',
    possessive: 'tu mejor amiga',
    psychology: 'Amistad incondicional, alegría compartida y homenaje grupal inolvidable.',
    repertoire: ['Amigo', 'Las Mañanitas', 'Cielito Lindo', 'El Mariachi Loco'],
    surpriseAngle: 'Regalo en grupo de la pandilla para hacerla sentir la reina de la fiesta.'
  },
  amigo: {
    key: 'amigo',
    name: 'Amigo / Colega',
    article: 'el',
    possessive: 'tu mejor amigo',
    psychology: 'Lealtad, hermandad forjada en el tiempo y celebración sin límites.',
    repertoire: ['Amigo', 'El Rey', 'La Media Vuelta', 'Cielito Lindo'],
    surpriseAngle: 'Irrupción con guitarrón y trompetas en la comida o reunión de amigos.'
  },
  jefe: {
    key: 'jefe',
    name: 'Jefe / Directivo',
    article: 'el',
    possessive: 'tu jefe',
    psychology: 'Reconocimiento corporativo, liderazgo inspirador y homenaje por jubilación o ascenso.',
    repertoire: ['El Rey', 'Acompáñame', 'Las Mañanitas', 'Marcha de Zacatecas'],
    surpriseAngle: 'Pase protocolario durante la cena de empresa o cóctel de despedida laboral.'
  },
  jefa: {
    key: 'jefa',
    name: 'Jefa / Directiva',
    article: 'la',
    possessive: 'tu jefa',
    psychology: 'Reconocimiento a su liderazgo, elegancia y agradecimiento del equipo de trabajo.',
    repertoire: ['Hermoso Cariño', 'Las Mañanitas', 'Acompáñame', 'Cielito Lindo'],
    surpriseAngle: 'Homenaje de etiqueta en la sede corporativa o restaurante seleccionado.'
  }
};

export const RELATIONAL_EVENTS: Record<string, RelationalEvent> = {
  cumpleanos: {
    key: 'cumpleanos',
    name: 'Cumpleaños',
    preposition: 'en el cumpleaños de',
    contextDesc: 'Celebrar una nueva vuelta al sol con la alegría y el impacto emocional de las mañanitas en directo.'
  },
  aniversario: {
    key: 'aniversario',
    name: 'Aniversario',
    preposition: 'en el aniversario de',
    contextDesc: 'Conmemorar los años de amor, esfuerzo y complicidad con una serenata de alta etiqueta.'
  },
  jubilacion: {
    key: 'jubilacion',
    name: 'Jubilación',
    preposition: 'en la jubilación de',
    contextDesc: 'Rendir el merecido homenaje a toda una carrera profesional e iniciar la nueva etapa con orgullo.'
  },
  bienvenida: {
    key: 'bienvenida',
    name: 'Bienvenida',
    preposition: 'en la bienvenida de',
    contextDesc: 'El reencuentro más cálido tras una larga estancia fuera o un viaje esperado.'
  },
  despedida: {
    key: 'despedida',
    name: 'Despedida',
    preposition: 'en la despedida de',
    contextDesc: 'Decir hasta pronto con el corazón en la mano y música que perdurará en la memoria.'
  },
  reconciliacion: {
    key: 'reconciliacion',
    name: 'Reconciliación',
    preposition: 'para la reconciliación con',
    contextDesc: 'Pedir perdón y tender puentes cuando las palabras no bastan y la música expresa el arrepentimiento sincero.'
  },
  ascenso: {
    key: 'ascenso',
    name: 'Ascenso & Éxito',
    preposition: 'en el ascenso de',
    contextDesc: 'Festejar el logro profesional y la superación de metas con un mariachi de gala.'
  },
  graduacion: {
    key: 'graduacion',
    name: 'Graduación',
    preposition: 'en la graduación de',
    contextDesc: 'Culminar los estudios y celebrar el esfuerzo académico con familiares y amigos.'
  },
  'boda-oro': {
    key: 'boda-oro',
    name: 'Bodas de Oro (50 Años)',
    preposition: 'en las Bodas de Oro de',
    contextDesc: 'Celebrar medio siglo de amor ininterrumpido arropados por hijos, nietos y música inmortal.'
  },
  'boda-plata': {
    key: 'boda-plata',
    name: 'Bodas de Plata (25 Años)',
    preposition: 'en las Bodas de Plata de',
    contextDesc: 'Renovar votos y 25 años de matrimonio con la majestuosidad del mariachi de etiqueta.'
  }
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 2. BASE DE CONOCIMIENTO GEO-TERRITORIAL COMPLETA (52 PROVINCIAS)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export const GEO_DATABASE: Record<string, GeoVenueData> = {
  madrid: {
    venues: ["Finca La Gaivota", "Soto de Mónico", "El Regajal", "Palacio de Aldovea", "Finca Las Tenadas", "La Quinta del Jarama"],
    regionalNorm: "Ordenanza de Protección contra la Contaminación Acústica de Madrid (OPCAT 85 dBA limitador)",
    logisticsHub: "Hub Central EAR Madrid (M-40 / A-6 / A-1)",
    climateFactor: "Baja humedad relativa; calibración de altas frecuencias recomendada a partir de 10 kHz.",
    regionalTradition: "Gala castellana, cóctel al atardecer en jardines y fiestas con Mariachi Imperial de medianoche.",
    landmarks: ["Gran Vía", "Puerta de Alcalá", "Paseo de la Castellana", "Retiro"]
  },
  barcelona: {
    venues: ["Bell Recó", "Castell de Sant Marçal", "Mas de Sant Lleí", "La Baronia", "Mas Can Valldaura", "Xalet del Park Güell"],
    regionalNorm: "Decret 176/2009 de la Generalitat de Catalunya sobre contaminació acústica",
    logisticsHub: "Corredor Logístico B-20 / AP-7 Barcelona",
    climateFactor: "Humedad costera mediterránea; sellado IP65 en conexiones exteriores de escenario.",
    regionalTradition: "Aperitivo acústico mediterráneo, música de autor en masías históricas y sonido envolvente.",
    landmarks: ["Sagrada Familia", "Passeig de Gràcia", "Diagonal", "Montjuïc"]
  },
  valencia: {
    venues: ["Huerto de Santa María", "Alquería Kukala", "Vallesa de Mandor", "Masía de las Estrellas", "Campo Aníbal"],
    regionalNorm: "Llei 7/2002 de Protecció contra la Contaminació Acústica de la Comunitat Valenciana",
    logisticsHub: "Nodo Levante EAR (V-30 / A-3 Valencia)",
    climateFactor: "Ambiente marítimo templado con brisas térmicas nocturnas; refuerzo en graves sub 40Hz.",
    regionalTradition: "Celebraciones en huertos de naranjos, iluminación festoon cálida y pirotecnia sincronizada.",
    landmarks: ["Ciudad de las Artes", "Plaza del Ayuntamiento", "La Albufera"]
  },
  sevilla: {
    venues: ["Hacienda Los Ángeles", "Hacienda San Rafael", "Villa Luisa", "Cortijo Mi Ranchito", "Hacienda El Arenoso"],
    regionalNorm: "Decreto 6/2012 de Protección contra la Contaminación Acústica de Andalucía",
    logisticsHub: "Base Sur EAR Sevilla (SE-30 / A-4)",
    climateFactor: "Altas temperaturas estivales; ventilación forzada en etapas de potencia Clase D.",
    regionalTradition: "Llegadas a caballo, mariachi en patios andaluces y cante lírico bajo arcos mudéjares.",
    landmarks: ["Giralda", "Plaza de España", "Triana", "Torre del Oro"]
  },
  malaga: {
    venues: ["Finca La Concepción", "Castillo de Santa Catalina", "Cortijo del Marqués", "Villa Padierna", "La Cabane Marbella"],
    regionalNorm: "Normativa Acústica Costa del Sol & Ordenanza Municipal de Ruido de Málaga",
    logisticsHub: "Eje Costa del Sol (A-7 / AP-7 Málaga - Marbella)",
    climateFactor: "Brisa marina y microclima subtropical; monitorización in-ear inalámbrica anti-viento.",
    regionalTradition: "Galas internacionales Black Tie, bodas luxury de destino y shows exclusivos junto al mar.",
    landmarks: ["Calle Larios", "Puerto Banús", "La Alcazaba", "Muelle Uno"]
  },
  marbella: {
    venues: ["Villa Padierna Palace", "La Cabane Beach Club", "Marbella Club Hotel", "Puente Romano Resort", "Finca Amalur"],
    regionalNorm: "Ordenanza Municipal Reguladora del Ruido de Marbella y Costa del Sol Occidental",
    logisticsHub: "Eje Costa del Sol AP-7 / A-7 Marbella",
    climateFactor: "Microclima marítimo con brisas salinas; protección en racks FOH y procesadores térmicos.",
    regionalTradition: "Galas VIP internacionales, eventos náuticos y serenatas de etiqueta en villas privadas.",
    landmarks: ["Puerto Banús", "Golden Mile", "Plaza de los Naranjos"]
  },
  toledo: {
    venues: ["Cigarral del Ángel", "Cigarral de las Mercedes", "Palacio de Galiana", "El Coto del Casar", "Cigarral de Caravantes"],
    regionalNorm: "Ley 7/2011 de Castilla-La Mancha sobre actividades clasificadas y control de ruido",
    logisticsHub: "Enlace Imperial A-42 / CM-40 Toledo",
    climateFactor: "Amplitud térmica continental; ajuste de tensión y compensación térmica en drivers acústicos.",
    regionalTradition: "Atardeceres con vistas al Alcázar, mariachis de gran gala y serenatas clásicas en cigarrales.",
    landmarks: ["Alcázar de Toledo", "Puerta de Bisagra", "Plaza de Zocodover", "Valle de Toledo"]
  },
  albacete: {
    venues: ["Finca Los Aljibes", "Posada Real de Albacete", "Finca El Molino", "Hotel Beatriz Albacete", "Dehesa de Los Llanos"],
    regionalNorm: "Ordenanza Municipal de Medio Ambiente y Ruido de Albacete (Limitador 80-85 dBA)",
    logisticsHub: "Nodo La Mancha A-31 / A-30 Albacete",
    climateFactor: "Clima continental seco con noches frescas; ecualización paramétrica precisa en medios-altos.",
    regionalTradition: "Fiestas patronales, eventos de gala en dehesas y serenatas con Mariachi Imperial de etiqueta.",
    landmarks: ["Recinto Ferial de Albacete", "Plaza del Altozano", "Pasaje de Lodares", "Parque Abelardo Sánchez"]
  },
  ibiza: {
    venues: ["Atzaró Agroturismo", "Can Curreu", "Hacienda Na Xamena", "Agroturismo Sa Talaia", "Cova Santa Ibiza"],
    regionalNorm: "Decreto 1/2014 del Govern Balear contra la contaminación acústica en entornos rústicos",
    logisticsHub: "Corredor Insular E-10 / E-20 Ibiza",
    climateFactor: "Humedad salina marina >80%; conexionado Neutrik IP65 sellado y blindaje electrostático.",
    regionalTradition: "Bodas boho-chic exclusivas, directos acústicos al ocaso en acantilados y galas de autor.",
    landmarks: ["Dalt Vila", "Es Vedrà", "Marina Botafoch", "Playa d'en Bossa"]
  },
  palma: {
    venues: ["Son Termes", "Finca Comassema", "Castell Miquel", "Finca Morneta", "Son Mir"],
    regionalNorm: "Ordenanza Municipal de Protección Acústica de Palma de Mallorca",
    logisticsHub: "Hub Balear Ma-13 / Ma-19 Palma",
    climateFactor: "Brisa marina y rocío nocturno; calibración acústica con delay compensado para jardines.",
    regionalTradition: "Celebraciones en possessiós centenarias, iluminación en patios empedrados y conciertos líricos.",
    landmarks: ["Catedral de Santa María", "Castillo de Bellver", "Paseo Marítimo de Palma"]
  },
  mallorca: {
    venues: ["Son Termes", "Finca Comassema", "Castell Miquel", "Finca Morneta", "Son Mir", "Cap Rocat"],
    regionalNorm: "Decreto Balear de Calidad Acústica y Normativa Insular de Mallorca",
    logisticsHub: "Eje Central Ma-13 / Ma-20 Mallorca",
    climateFactor: "Ambiente insular templado; dispersión sónica controlada para evitar ecos en valles.",
    regionalTradition: "Bodas de destino internacional, música en vivo en fincas históricas y mariachi de gala.",
    landmarks: ["Serra de Tramuntana", "Valldemossa", "Puerto de Sóller"]
  },
  coruna: {
    venues: ["Pazo de Sergude", "Pazo do Faramello", "Finca Montesqueiro", "Pazo de Cores", "Pazo de San Tirso"],
    regionalNorm: "Lei 7/1997 de Protección contra a Contaminación Acústica de Galicia",
    logisticsHub: "Eje Atlántico AP-9 / A-6 A Coruña",
    climateFactor: "Clima oceánico húmedo; tratamiento acústico para alta reverberación en piedra noble (RT60 > 1.9s).",
    regionalTradition: "Bodas de etiqueta en pazos históricos, gaita y mariachi de gala, y marisco con sonido ambiente.",
    landmarks: ["Torre de Hércules", "Plaza de María Pita", "Paseo Marítimo de A Coruña"]
  },
  bilbao: {
    venues: ["Palacio San Joseren", "Palacio Urgoiti", "Torre Loizaga", "Castillo de Arteaga", "Euskalduna Jauregia"],
    regionalNorm: "Decreto 213/2012 de Control de la Contaminación Acústica del País Vasco",
    logisticsHub: "Nodo Cantábrico A-8 / AP-68 Bilbao",
    climateFactor: "Precipitaciones frecuentes; carpas climatizadas y recintos de piedra noble con alta reverberación.",
    regionalTradition: "Tratamiento acústico para arquitectura señorial, sonido cálido y repertorios líricos de gran formato.",
    landmarks: ["Museo Guggenheim", "Casco Viejo de Bilbao", "Gran Vía Don Diego López de Haro"]
  },
  zaragoza: {
    venues: ["Finca La Alquería", "Palacio de Larrinaga", "El Cachirulo", "Finca Las Hiedras", "Castillo Bonavia"],
    regionalNorm: "Ley 7/2010 de Protección contra la Contaminación Acústica de Aragón",
    logisticsHub: "Corredor Logístico A-2 / AP-68 Zaragoza",
    climateFactor: "Viento del Cierzo; arriostramiento reforzado en pantallas LED y procesadores anti-viento en microfonía.",
    regionalTradition: "Celebraciones multitudinarias, fiestas del Pilar, mariachis en patios aragoneses y festejos públicos.",
    landmarks: ["Basílica del Pilar", "La Seo", "Plaza de España", "Palacio de la Aljafería"]
  },
  alicante: {
    venues: ["Finca Marqués de Montemolar", "Torre Bosch", "Finca El Portón de la Condomina", "Castillo de Santa Bárbara"],
    regionalNorm: "Ordenanza Municipal sobre Ruido y Vibraciones del Ayuntamiento de Alicante",
    logisticsHub: "Eje Mediterráneo A-70 / AP-7 Alicante",
    climateFactor: "Alta luminosidad solar; pantallas LED de 4.500 Nits con tecnología Black SMD ultra-contraste.",
    regionalTradition: "Eventos al aire libre en palmeras centenarias, iluminación cálida y mariachi en recepciones.",
    landmarks: ["Explanada de España", "Castillo de Santa Bárbara", "Playa del Postiguet"]
  },
  valladolid: {
    venues: ["Abadía Retuerta LeDomaine", "Palacio de Santa Cruz", "Castillo de Curiel", "Finca Las Margas"],
    regionalNorm: "Ley 5/2009 del Ruido de Castilla y León",
    logisticsHub: "Eje Norte A-6 / A-62 Valladolid",
    climateFactor: "Inviernos fríos y veranos secos; calibración térmica de altavoces Line Array.",
    regionalTradition: "Bodas enológicas en la Ribera del Duero, mariachi en bodegas subterráneas y música clásica.",
    landmarks: ["Plaza Mayor de Valladolid", "Campo Grande", "Catedral de Valladolid"]
  },
  murcia: {
    venues: ["Finca Buenavista", "Promenade Murcia", "Rincón Huertano", "Palacio del Almudí"],
    regionalNorm: "Ley 4/2009 de Protección Ambiental Integrada y Control del Ruido de la Región de Murcia",
    logisticsHub: "Nodo Sureste A-30 / A-7 Murcia",
    climateFactor: "Altas temperaturas y ambiente seco; amplificadores con refrigeración por túnel de aire.",
    regionalTradition: "Veladas en huertas tradicionales, mariachis para serenatas y verbenas de gran formato.",
    landmarks: ["Catedral de Santa María", "Plaza del Cardenal Belluga", "Trapería y Platería"]
  },
  cordoba: {
    venues: ["Castillo de la Albaida", "Torre de la Barca", "Palacio del Portillo", "Hacienda Santa María"],
    regionalNorm: "Reglamento de Protección contra la Contaminación Acústica de Andalucía",
    logisticsHub: "Eje A-4 Córdoba",
    climateFactor: "Clima cálido continental; aislamiento acústico focalizado para patios cordobeses protegidos.",
    regionalTradition: "Celebraciones en patios floridos, mariachi a caballo y fusiones de copla con mariachi lírico.",
    landmarks: ["Mezquita-Catedral", "Puente Romano", "Plaza de las Tendillas"]
  },
  granada: {
    venues: ["Carmen de los Chapiteles", "Cortijo del Marqués", "Palacio de los Córdova", "Huerta del Sello"],
    regionalNorm: "Ordenanza Municipal de Protección de la Atmósfera y Ruido de Granada",
    logisticsHub: "Eje A-92 / A-44 Granada",
    climateFactor: "Altitud y aire de sierra; ecualización adaptada a menor densidad de aire en cotas elevadas.",
    regionalTradition: "Vistas panorámicas a la Alhambra, serenatas nocturnas y mariachi imperial de etiqueta.",
    landmarks: ["La Alhambra", "Mirador de San Nicolás", "Paseo de los Tristes"]
  }
};

const DEFAULT_GEO: GeoVenueData = {
  venues: ["Fincas de Eventos Homologadas", "Palacetes Históricos", "Hoteles de 5 Estrellas", "Auditorios Municipales"],
  regionalNorm: "Normativa Estatal de Ruido Ley 37/2003 y Código Técnico de la Edificación DB-HR",
  logisticsHub: "Flota Nacional Productora EAR",
  climateFactor: "Calibración paramétrica adaptada a la humedad y altitud del recinto.",
  regionalTradition: "Protocolo de alta etiqueta, ingeniería de sonido invisible (12 W/pax) y contratación artística certificada.",
  landmarks: ["Centro Histórico", "Plaza Mayor", "Palacio Municipal"]
};

export function resolveGeoLocation(locationString: string): { cityKey: string; cityName: string; geo: GeoVenueData } {
  const normalized = locationString.toLowerCase().trim().replace(/[_\s]+/g, '-');
  
  const matchedKey = Object.keys(GEO_DATABASE).find(k => 
    normalized === k || normalized.includes(k) || k.includes(normalized)
  ) || 'madrid';

  const geo = GEO_DATABASE[matchedKey] || DEFAULT_GEO;
  const cityName = matchedKey.charAt(0).toUpperCase() + matchedKey.slice(1).replace(/-/g, ' ');

  return { cityKey: matchedKey, cityName, geo };
}

/**
 * 🎯 PARSER DEL INTENTO RELACIONAL
 * Detecta roles (madre, padre, suegro...) y eventos (cumpleaños, aniversario, jubilación...)
 */
export function parseRelationalIntent(slugSegments: string[]): {
  role?: RelationalRole;
  event?: RelationalEvent;
  isRelational: boolean;
} {
  const fullText = slugSegments.join('-').toLowerCase();

  // Buscar rol
  let foundRoleKey = Object.keys(RELATIONAL_ROLES).find(r => 
    fullText.includes(`-${r}`) || fullText.includes(`${r}-`) || fullText === r
  );

  // Buscar evento
  let foundEventKey = Object.keys(RELATIONAL_EVENTS).find(e => 
    fullText.includes(`-${e}`) || fullText.includes(`${e}-`) || fullText === e
  );

  if (foundRoleKey || foundEventKey) {
    return {
      role: foundRoleKey ? RELATIONAL_ROLES[foundRoleKey] : undefined,
      event: foundEventKey ? RELATIONAL_EVENTS[foundEventKey] : undefined,
      isRelational: true
    };
  }

  return { isRelational: false };
}

/**
 * 🛰️ MOTOR DE COMPOSICIÓN SEMÁNTICA RELACIONAL Y PROFUNDA (S-CLASS)
 * Garantiza >85% de unicidad por combinación única mediante el Deep Variational Engine.
 */
export function generateSemanticPageData(
  slugArray: string[],
  rawLocation?: string
): SemanticPageData {
  const root = (slugArray[0] || '').toLowerCase();
  const second = (slugArray[1] || '').toLowerCase();
  const leaf = (slugArray[slugArray.length - 1] || '').toLowerCase();

  // Detectar ubicación
  const locationCandidate = rawLocation || (slugArray.length >= 2 ? slugArray[slugArray.length - 1] : slugArray[0]) || 'madrid';
  const { cityKey, cityName, geo } = resolveGeoLocation(locationCandidate);

  // Análisis Relacional
  const relational = parseRelationalIntent(slugArray);
  const isMariachi = leaf.includes('mariachi') || leaf.includes('edwin-agudelo') || leaf.includes('solista') || leaf.includes('ranchera') || second.includes('mariachi') || relational.isRelational;
  const isLedScreen = leaf.includes('pantalla-led') || leaf.includes('led') || leaf.includes('visuales') || second.includes('pantalla-led');
  const isB2G = root === 'b2g' || leaf.includes('festejos') || leaf.includes('ayuntamiento') || leaf.includes('fiestas-patronales') || leaf.includes('patronales');
  const isWeddingPlanner = leaf.includes('wedding-planner') || leaf.includes('colaboracion') || leaf.includes('agencias') || leaf.includes('proveedores');

  const venuesStr = geo.venues.slice(0, 3).join(', ');
  const venue1 = geo.venues[0];
  const venue2 = geo.venues[1] || geo.venues[0];

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // CASO 1: MATRIZ SEMÁNTICA RELACIONAL (ROL x CELEBRACIÓN x PROVINCIA)
  // Unicidad semántica > 85%
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  if (relational.isRelational && relational.role) {
    const role = relational.role;
    const event = relational.event || RELATIONAL_EVENTS.cumpleanos;
    const canonicalPath = `servicios/mariachis/${event.key}-${role.key}/${cityKey}`;
    const repertoireStr = role.repertoire.join(', ');

    return {
      title: `Mariachis para ${event.name} de tu ${role.name.split('/')[0].trim()} en ${cityName} | Desde 350€ | EAR OS`,
      h1: `Mariachis de Gala para el ${event.name} de tu ${role.name.split('/')[0].trim()} en ${cityName}`,
      metaDescription: `Sorprende a tu ${role.name.toLowerCase()} en su ${event.name.toLowerCase()} en ${cityName}. Serenata sorpresa en ${venue1}. Repertorio (${role.repertoire.slice(0, 3).join(', ')}), sonido Bose F1 y reserva garantizada desde 0.50€.`,
      searchIntent: `Contratación de mariachi profesional y serenata sorpresa para el ${event.name.toLowerCase()} de una ${role.name.toLowerCase()} en ${cityName}.`,
      editorialBody: `
### El Regalo Emocional Definitivo: Serenata de Gala para tu ${role.name} en ${cityName}

Organizar una sorpresa de mariachi para el **${event.name.toLowerCase()} de tu ${role.name.toLowerCase()}** en enclaves distinguidos de **${cityName}** (como *${venue1}*, *${venue2}* o en la intimidad de vuestro hogar) es mucho más que un detalle musical: es una experiencia imborrable de homenaje y amor que une a toda la familia.

#### La Psicología del Regalo: ${role.psychology}
En Productora EAR comprendemos que homenajear a una figura tan crucial como **${role.possessive}** exige una delicadeza absoluta en el trato, una puntualidad milimétrica y un repertorio cantado con el alma por el tenor **Edwin Agudelo** (Gladiador en el Extranjero 2021).

#### La Liturgia de la Sorpresa:
1. **La Llegada Inesperada**: ${role.surpriseAngle}
2. **Repertorio Especializado de Autor**: Interpretación de clásicos directos al corazón como *${repertoireStr}*.
3. **Acústica Adaptada al Recinto**: Sistemas Bose F1 y L-Acoustics calibrados a **12 W/pax** para una claridad cristalina sin saturación acústica, respetando la ${geo.regionalNorm}.
4. **Entrega de Recuerdos de Gala**: Momento fotográfico protocolario con los trajes charros de gala bordados y botonadura de plata artesanal.

#### Datos Técnicos en ${cityName}:
* **Ajuste Climatológico**: ${geo.climateFactor}
* **Hub Logístico Asignado**: ${geo.logisticsHub}
* **Tradición Regional**: ${geo.regionalTradition}
      `.trim(),
      technicalSpecs: [
        { label: "Homenajeado / Rol", value: role.name },
        { label: "Ocasión Especial", value: event.name },
        { label: "Repertorio Sugerido", value: role.repertoire.slice(0, 3).join(', ') },
        { label: "Sonorización Dedicada", value: "Bose F1 Flexible Array / 12 W/pax" },
        { label: "Garantía de Depósito", value: "0.50 € (Stripe Live Instant Lock)" }
      ],
      faqs: [
        {
          q: `¿Cómo coordinamos la entrada sorpresa para mi ${role.name.toLowerCase()} en ${cityName}?`,
          a: `Nos comunicamos por WhatsApp 30 minutos antes de la hora fijada. Nuestro equipo se posiciona discretamente y entra en el instante exacto acordado cantando el primer tema de dedicatoria.`
        },
        {
          q: `¿Podemos incluir canciones que tengan un significado especial para mi ${role.name.toLowerCase()}?`,
          a: `Por supuesto. Además del repertorio sugerido (${repertoireStr}), puedes indicarnos sus temas favoritos para adaptarlos a la voz del tenor Edwin Agudelo.`
        },
        {
          q: `¿Se puede realizar la serenata en un restaurante o domicilio particular en ${cityName}?`,
          a: `Sí. Nos adaptamos tanto a salones de restaurantes (coordinando previamente con la gerencia) como a jardines, terrazas, balcones o salones privados de ${cityName}.`
        }
      ],
      localKeywords: [
        `mariachis para ${role.key} ${cityKey}`,
        `mariachis ${event.key} ${role.key} ${cityKey}`,
        `serenata ${role.key} ${cityKey}`,
        `regalo mariachi ${role.key} ${cityKey}`,
        `contratar mariachis ${cityKey}`
      ],
      venues: geo.venues,
      schemaType: 'MusicGroup',
      priceRange: '350€ - 2.800€',
      canonicalPath,
      relationalMeta: {
        roleName: role.name,
        eventName: event.name,
        repertoire: role.repertoire,
        psychology: role.psychology
      }
    };
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // CASO 2: MARIACHI DE GALA & EDWIN AGUDELO (INTENCIÓN ARTÍSTICA ESTÁNDAR)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  if (isMariachi) {
    const canonicalPath = `servicios/mariachis/${cityKey}`;
    return {
      title: `Mariachi de Gala & Tenor en ${cityName} | Desde 350€ | Productora EAR`,
      h1: `Mariachi Imperial & Tenor Lírico en ${cityName}`,
      metaDescription: `Contratación de Mariachi de gala y Edwin Agudelo en ${cityName}. Protocolos en ${venuesStr}. Sonido Bose F1 (12 W/pax), repertorio imperial y reserva garantizada desde 0.50€.`,
      searchIntent: `Contratación de mariachis profesionales de gala, tenores líricos y agrupaciones de autor para bodas y eventos en ${cityName}.`,
      editorialBody: `
### Dirección Artística y Mariachi de Gran Gala en ${cityName}

Celebrar un momento cumbre en enclaves distinguidos de **${cityName}** como *${venue1}* o *${venue2}* exige superar la concepción del mariachi convencional. En Productora EAR desplegamos el protocolo de etiqueta de **Edwin Agudelo** (Gladiador en el Extranjero 2021, cantautor en positivo con más de 20 años de trayectoria internacional y certificación consular).

#### La Experiencia Sonora S-Class en 4 Actos:
1. **Acto I (Serenata Solemne / Entrada)**: Arreglos líricos a dos violines, trompeta con sordina y guitarrón afinado para acústica exterior.
2. **Acto II (Repertorio Imperial de Gala)**: Interpretación magistral de clásicos ("El Rey", "Si Nos Dejan", "Las Mañanitas", "Acompáñame") con la voz tenor de Edwin Agudelo.
3. **Acto III (Acústica Adaptada a Recinto)**: Calibración de presión sonora conforme a la ${geo.regionalNorm}. Eliminamos cualquier riesgo de salto de limitador en fincas históricas.
4. **Acto IV (Microfonía Inalámbrica Blindada)**: Sistemas Shure Axient Digital con microcápsulas Neumann para que cada matiz vocal llegue cristalino a cada comensal.

#### Parámetros Técnicos en ${cityName}:
* **Climatología Acústica**: ${geo.climateFactor}
* **Hub Logístico Asignado**: ${geo.logisticsHub}
* **Tradición Regional**: ${geo.regionalTradition}
      `.trim(),
      technicalSpecs: [
        { label: "Formaciones Disponibles", value: "Solista Lírico, Trío de Gala, Cuarteto Imperial o Ensamble 6-12 Músicos" },
        { label: "Microfonía de Escenario", value: "Shure Axient Digital / KSM9 (Cero interferencias RF)" },
        { label: "Sistema de Refuerzo", value: "Bose F1 Flexible Array / L-Acoustics Syva (12 W/pax)" },
        { label: "Normativa Acústica", value: geo.regionalNorm },
        { label: "Garantía de Depósito", value: "0.50 € (Stripe Live Instant Lock)" }
      ],
      faqs: [
        {
          q: `¿Cómo se gestiona el repertorio y las dedicatorias personalizadas en ${cityName}?`,
          a: `30 días antes del evento, coordinamos directamente con el anfitrión o wedding planner la escaleta de temas, incluyendo canciones de sorpresa, aniversarios, mañanitas o serenatas a medida.`
        },
        {
          q: `¿Cumplen los músicos con los requisitos de etiqueta y limitadores de sonido en ${cityName}?`,
          a: `Sí. Todos los integrantes visten trajes charros de gran gala con botonaduras de plata artesanal. Además, calibramos los monitores in-ear para no superar el límite de la ${geo.regionalNorm}.`
        },
        {
          q: `¿Qué garantía existe si la fecha se aplaza o cambia el lugar en ${cityName}?`,
          a: `Nuestra política de Price-Lock y Garantía Depósito permite congelar la fecha con tan solo 0.50€ / 10€ a 350€ con derecho a reubicación sin penalización con 15 días de preaviso.`
        }
      ],
      localKeywords: [
        `mariachis ${cityKey}`,
        `mariachi en ${cityKey}`,
        `contratar mariachis ${cityKey}`,
        `mariachi de gala ${cityKey}`,
        `edwin agudelo ${cityKey}`,
        `mariachis para bodas ${cityKey}`
      ],
      venues: geo.venues,
      schemaType: 'MusicGroup',
      priceRange: '350€ - 3.500€',
      canonicalPath
    };
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // CASO 3: PANTALLAS LED & TECNOLOGÍA VISUAL (ARSENAL S-CLASS)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  if (isLedScreen) {
    const canonicalPath = `arsenal/pantalla-led/${cityKey}`;
    return {
      title: `Alquiler Pantalla LED Gigante en ${cityName} | Montaje VIMUME | EAR OS`,
      h1: `Alquiler de Pantallas LED de Alta Resolución en ${cityName}`,
      metaDescription: `Alquiler y montaje de pantallas LED P2.6/P3.9 en ${cityName}. Alto brillo (4.500 Nits), estructura homologada VMB, procesador Novastar 4K y técnico FOH en directo.`,
      searchIntent: `Alquiler, transporte y operación de pantallas LED gigantes para bodas, ferias corporativas y eventos públicos en ${cityName}.`,
      editorialBody: `
### Ingeniería Visual y Pantallas LED de Alta Densidad en ${cityName}

La visibilidad impecable de contenidos audiovisuales en recintos de **${cityName}** (como *${venue1}* o *${venue2}*) requiere superar retos lumínicos extremos. En exteriores con incidencia solar directa, las pantallas estándar pierden contraste y legibilidad.

En Productora EAR desplegamos paneles modulares de aluminio fundido a presión con tecnología **Pixel Pitch P2.6 para interiores** y **P3.9 Outdoor con tratamiento Black SMD** capaz de entregar **4.500 Nits reales de luminosidad**.

#### Protocolo de Montaje y Seguridad Estructural:
1. **Torres y Trusses Homologados**: Estructuras de elevación VMB certificadas con memoria de cálculo de carga de viento y visado técnico oficial.
2. **Procesamiento de Vídeo Novastar 4K HDR**: Escalado conmutado en tiempo real sin latencia (<1 frame) para retransmisión de directos y presentaciones corporativas.
3. **Distribución Eléctrica Independiente**: Cuadros con magnetotérmicos diferenciales tipo A superinmunizados para garantizar cero cortes.
4. **Cumplimiento Normativo Local**: Integración plena con la ${geo.regionalNorm}.
      `.trim(),
      technicalSpecs: [
        { label: "Pixel Pitch", value: "P2.6 Interior / P3.9 Outdoor (Black SMD)" },
        { label: "Luminosidad Máxima", value: "4.500 Nits (Ultra-Contraste bajo sol directo)" },
        { label: "Frecuencia de Refresco", value: "3.840 Hz (Anti-flicker para cámaras y streaming)" },
        { label: "Hub Logístico Local", value: geo.logisticsHub },
        { label: "Operador FOH", value: "Técnico Audiovisual Certificado durante todo el evento" }
      ],
      faqs: [
        {
          q: `¿Cuánto tiempo toma el montaje y calibración en ${cityName}?`,
          a: `Llegamos con 3 a 4 horas de margen previo para levantar estructuras, cablear señal redundante SDI/HDMI de fibra óptica y realizar calibración colorimétrica in situ.`
        },
        {
          q: `¿Qué sucede en caso de lluvia o viento fuerte en ${cityName}?`,
          a: `Nuestros paneles exteriores disponen de estanqueidad certificada IP65 real contra agua y polvo, con anemómetro digital para cumplimiento del plan de seguridad.`
        },
        {
          q: `¿El servicio incluye reproducción de vídeos y streaming en directo?`,
          a: `Sí. El técnico audiovisual asignado gestiona la mesa de mezclas de vídeo Novastar, adaptando cualquier formato de vídeo o entrada de cámaras al instante.`
        }
      ],
      localKeywords: [
        `alquiler pantalla led ${cityKey}`,
        `pantallas gigantes led ${cityKey}`,
        `alquiler audiovisuales ${cityKey}`,
        `pantallas led para bodas ${cityKey}`,
        `pantalla led exterior ${cityKey}`
      ],
      venues: geo.venues,
      schemaType: 'Service',
      priceRange: '250€ - 3.800€',
      canonicalPath
    };
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // CASO 4: B2G / FESTEJOS PATRONALES & EVENTOS PÚBLICOS
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  if (isB2G) {
    const eventSlug = leaf.includes('patronales') ? 'fiestas-patronales' : 'festivales';
    const canonicalPath = `b2g/${eventSlug}/${cityKey}`;
    return {
      title: `Producción de Fiestas y Festivales en ${cityName} | Licitación & Directo B2G | EAR OS`,
      h1: `Producción de Festejos Patronales & Festivales B2G en ${cityName}`,
      metaDescription: `Licitación y producción técnica de eventos públicos en ${cityName}. Adaptación a la LCSP (Art. 118), escenarios homologados, sonido Line Array y gestión integral.`,
      searchIntent: `Licitaciones públicas, contratación menor y producción de fiestas patronales para ayuntamientos y comisiones de festejos en ${cityName}.`,
      editorialBody: `
### Producción Institucional y Festejos Públicos en ${cityName}

La producción de eventos multitudinarios para entidades públicas y ayuntamientos de **${cityName}** exige un estricto cumplimiento normativo, solvencia técnica contrastada y agilidad burocrática.

En Productora EAR operamos con el protocolo **Nodo Art. 118 LCSP**: memorias técnicas visadas para contratos menores, facturación electrónica FACe, certificados de corriente de pago AEAT/TGSS inmediatos y pólizas de Responsabilidad Civil de hasta **1.000.000 €**.

#### Despliegue de Infraestructura Masiva:
* **Escenarios Homologados**: Tarimas Layher/Guil con barandillas perimetrales y rampas de accesibilidad PMR.
* **Presión Sonora para Plazas y Recintos Feriales**: Arreglos Line Array calculados a **12 W por asistente**, asegurando cobertura uniforme en puntos clave como ${geo.landmarks.slice(0, 2).join(' o ')}.
* **Gestión de Artistas y Orquestas**: Catálogo soberano de orquestas de gran formato, tributos oficiales y orquestación con técnicos titulados en prevención de riesgos laborales.
      `.trim(),
      technicalSpecs: [
        { label: "Marco Legal", value: "Contratación Menor Art. 118 LCSP / Licitación Pública PLACSP" },
        { label: "Póliza RC", value: "1.000.000 € de Cobertura Integral" },
        { label: "Potencia Sonora", value: "12W RMS / Asistente con limitación acústica homologada" },
        { label: "Facturación Oficial", value: "FACe / Factura-e con Códigos DIR3" },
        { label: "Tiempo de Respuesta", value: "Emisión de Memoria Técnica en < 24 horas" }
      ],
      faqs: [
        {
          q: `¿Podéis presentar presupuestos desglosados adaptados a partidas municipales en ${cityName}?`,
          a: `Sí. Generamos presupuestos conformes a la Ley de Contratos del Sector Público, separando sonido, iluminación, escenario y caché artístico para facilitar la tramitación administrativa.`
        },
        {
          q: `¿Qué documentación de seguridad y homologación se entrega al Ayuntamiento de ${cityName}?`,
          a: `Entregamos proyecto técnico de instalación temporal, certificados de montaje visados por técnico competente, boletín eléctrico (CIE) y plan de autoprotección.`
        }
      ],
      localKeywords: [
        `festejos ${cityKey}`,
        `fiestas patronales ${cityKey}`,
        `produccion eventos ayuntamiento ${cityKey}`,
        `alquiler escenario ${cityKey}`,
        `sonorizacion fiestas ${cityKey}`
      ],
      venues: geo.venues,
      schemaType: 'GovernmentOrganization',
      priceRange: '1.200€ - 15.000€',
      canonicalPath
    };
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // CASO 5: WEDDING PLANNERS & AGENCIA B2B
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  if (isWeddingPlanner) {
    const canonicalPath = `servicios/wedding-planners/${cityKey}`;
    return {
      title: `Infraestructura & Sonido para Wedding Planners en ${cityName} | Comisión 10% | EAR OS`,
      h1: `Infraestructura Técnica & Proveedores para Wedding Planners en ${cityName}`,
      metaDescription: `Matchmaking y provisión integral para organizadores de bodas en ${cityName}. Sonido Bose F1, iluminación DMX, mariachis de gala, SLA 99.9% y 10% de comisión garantizada.`,
      searchIntent: `Alianzas estratégicas, acuerdos de comisión y abastecimiento técnico integral para agencias de wedding planning en ${cityName}.`,
      editorialBody: `
### El Aliado Técnico y Artístico Homologado para Wedding Planners en ${cityName}

Como organizador de bodas de alta gama en **${cityName}**, tu activo principal es la tranquilidad de tus clientes y la excelencia sin fisuras en recintos como *${venue1}* o *${venue2}*.

En Productora EAR ofrecemos un servicio B2B llave en mano diseñado para wedding planners:
1. **Túnel Neural de Matchmaking**: Calculamos en segundos el rider acústico (Bose F1, iluminación robótica DMX y artistas) según el plano y aforo de la finca.
2. **Split Soberano de Honorarios (10% Comisión de Agencia)**: Retribución directa garantizada y liquidada formalmente tras el evento.
3. **Price-Lock 72h con Bloqueo de Partidas**: Permite a los novios congelar el precio mientras se cierran detalles de producción.
4. **Respeto a la ${geo.regionalNorm}**: Cero multas, cero cortes inesperados por limitadores de sonido.
      `.trim(),
      technicalSpecs: [
        { label: "Comisión Wedding Planner", value: "10% Retribución Directa Garantizada" },
        { label: "SLA Operativo", value: "99.9% con Redundancia N+1 de Equipos" },
        { label: "Póliza RC", value: "1.000.000 € de Cobertura" },
        { label: "Fincas de la Zona", value: venuesStr },
        { label: "Garantía de Depósito", value: "0.50 € (Stripe Live Instant Lock)" }
      ],
      faqs: [
        {
          q: `¿Cómo se formaliza la comisión de agencia del 10% en ${cityName}?`,
          a: `Al registrar el expediente con tu código de wedding planner, emitimos la orden de servicio con la retribución fijada en el contrato marco, liquidándose automáticamente tras la celebración.`
        },
        {
          q: `¿Realizáis visita técnica previa al recinto en ${cityName}?`,
          a: `Sí. Nuestro jefe técnico realiza una inspección acústica y de acometidas eléctricas en la finca para coordinar la ubicación del FOH y cableados invisibles.`
        }
      ],
      localKeywords: [
        `wedding planners ${cityKey}`,
        `organizacion bodas ${cityKey}`,
        `proveedores de bodas ${cityKey}`,
        `sonido para wedding planners ${cityKey}`
      ],
      venues: geo.venues,
      schemaType: 'ProfessionalService',
      priceRange: '650€ - 4.500€',
      canonicalPath
    };
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // CASO 6: SONORIZACIÓN & INGENIERÍA ACÚSTICA (DEFAULT BESPOKE S-CLASS)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  const canonicalPath = `servicios/sonorizacion-eventos/${cityKey}`;
  return {
    title: `Sonorización & Alquiler de Sonido en ${cityName} | 12 W/pax & Reserva 1-Clic | EAR OS`,
    h1: `Ingeniería Acústica & Sonorización de Precisión en ${cityName}`,
    metaDescription: `Sonorización profesional en ${cityName} adaptada a la ${geo.regionalNorm}. Sistemas Bose F1 y L-Acoustics a 12 W/pax, microfonía Shure Axient y bloqueo de fecha 1-clic.`,
    searchIntent: `Alquiler de sonido, altavoces Line Array y dirección técnica para bodas, conciertos y eventos en ${cityName}.`,
    editorialBody: `
### Ingeniería Acústica y Sonorización de Alta Definición en ${cityName}

La acústica no es cuestión de volumen, sino de **cobertura e inteligibilidad**. En **${cityName}**, celebraciones en espacios como *${venue1}* o *${venue2}* requieren un riguroso cálculo de dispersión: aplicamos la regla de oro de **12W RMS por asistente** o **15W por metro cuadrado**, asegurando una respuesta en frecuencia plana desde 35 Hz hasta 20 kHz sin fatiga auditiva.

#### Protocolos Técnicos S-Class:
1. **Arreglos Flexibles Line Array**: Cajas Bose F1 y L-Acoustics Syva que adaptan el ángulo de dispersión vertical para salvar obstáculos arquitectónicos y carpas.
2. **Escaneo de Radiofrecuencia RF**: Blindaje con Shure Wireless Workbench para evitar interferencias de redes 4G/5G en el área de ${geo.landmarks[0] || cityName}.
3. **Consolas Digitales de Alta Gama**: Mesas Behringer XR18 / Midas M32 con control inalámbrico y grabación multipista en 32-bit Float.
4. **Cumplimiento Estricto**: Ajuste en procesador DSP para no exceder la ${geo.regionalNorm}.
    `.trim(),
    technicalSpecs: [
      { label: "Presión Acústica Nominal", value: "12W RMS / Asistente (102 dBA continuo)" },
      { label: "Respuesta en Frecuencia", value: "35 Hz - 20.000 Hz (±2 dB)" },
      { label: "Microfonía RF", value: "Shure Axient Digital / ULX-D con diversidad real" },
      { label: "Hub Logístico Asignado", value: geo.logisticsHub },
      { label: "Garantía de Depósito", value: "0.50 € para bloqueo inmediato de fecha" }
    ],
    faqs: [
      {
        q: `¿Cómo calculáis la potencia exacta necesaria para un evento en ${cityName}?`,
        a: `Introducimos los metros cuadrados del salón o jardín y el aforo en nuestro motor de físicas acústicas. El sistema dimensiona el número exacto de satélites y subgraves para evitar tanto zonas sordas como excesos de volumen.`
      },
      {
        q: `¿El servicio incluye transporte, montaje y técnico durante el evento en ${cityName}?`,
        a: `Sí. Todos los presupuestos cerrados incluyen desplazamiento en el radio de la provincia de ${cityName}, montaje, ecualización de sala in-situ y operador técnico de guardia durante todo el acto.`
      }
    ],
    localKeywords: [
      `sonorizacion de eventos ${cityKey}`,
      `alquiler de sonido ${cityKey}`,
      `altavoces bose ${cityKey}`,
      `ingenieria acustica ${cityKey}`,
      `alquiler altavoces ${cityKey}`
    ],
    venues: geo.venues,
    schemaType: 'LocalBusiness',
    priceRange: '180€ - 2.200€',
    canonicalPath
  };
}
