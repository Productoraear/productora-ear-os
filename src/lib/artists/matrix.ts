/**
 * 🗺️ TALENT OS V2 - HIGH-VALUE SEO MATRIX (EVENT × CITY × FORMAT × INTENT)
 * Avoids duplicate and thin content by using high-density structured localized data.
 * Fully enriched with absolute authority evidence, awards, tour backing, and VIMUME clinical integration.
 */

export interface SEOVariant {
  slug: string;
  title: string;
  metaDescription: string;
  eventType: 'bodas' | 'cumpleaños' | 'aniversarios' | 'ferias' | 'festivales' | 'ayuntamientos' | 'corporativos';
  city: string;
  showType: 'solista' | 'mariachi-6' | 'show-caballo' | 'monumental';
  showTypeName: string;
  intent: string;
  uniqueDescription: string;
  localLogistics: string;
  suggestedRepertoire: string[];
}

export const HIGH_VALUE_VARIANTS: SEOVariant[] = [
  {
    slug: "mariachi-bodas-madrid-solista",
    title: "Mariachi Solista para Bodas en Madrid | Edwin Agudelo Premium",
    metaDescription: "Contrata a Edwin Agudelo, solista premium de mariachi para bodas de gala en Madrid. Sonido Bose, canciones personalizadas y fotos temáticas sin intermediarios.",
    eventType: "bodas",
    city: "Madrid",
    showType: "solista",
    showTypeName: "Edwin Agudelo - Solista Premium",
    intent: "Contratar mariachi solista de gala con protocolo Bose en la capital.",
    uniqueDescription: "Una experiencia nupcial íntima y distinguida en la Comunidad de Madrid. Diseñamos la entrada sorpresa de Edwin Agudelo (tenor lírico con diploma de honor consular) durante el cóctel o el banquete. Interpretación impecable respaldada por su amplia trayectoria y el himno de resiliencia 'Acompáñame'.",
    localLogistics: "Desplazamiento incluido para Madrid centro, Pozuelo, Las Rozas, La Moraleja y Alcalá de Henares. Equipamiento sónico premium Bose auto-amplificado calibrado acústicamente.",
    suggestedRepertoire: ["Te amaré toda la vida", "Cásate conmigo", "Acompáñame", "La mitad que me faltaba"]
  },
  {
    slug: "mariachis-bodas-barcelona-gala",
    title: "Mariachis para Bodas de Gala en Barcelona | Edwin Agudelo y Agrupación",
    metaDescription: "Espectáculo premium de Mariachi con 6 integrantes en Barcelona. Rigor organizativo, trajes de gala impecables y repertorio tradicional de alto impacto sónico.",
    eventType: "bodas",
    city: "Barcelona",
    showType: "mariachi-6",
    showTypeName: "Edwin Agudelo con Mariachis (6+)",
    intent: "Reserva de agrupación de gala para bodas de lujo en Cataluña.",
    uniqueDescription: "Lleva el máximo esplendor de la tradición musical a tu boda en Barcelona. Liderada por Edwin Agudelo—reconocido por coordinar 37 grandes conciertos internacionales—nuestra agrupación de gala ofrece una puesta en escena impecable con sombreros de charro bordados, violines, trompetas y guitarrón.",
    localLogistics: "Logística optimizada para Masías en el Penedès, Sitges, Maresme y área metropolitana de Barcelona. Sonido ecualizado para exteriores e interiores de alta fidelidad.",
    suggestedRepertoire: ["Si nos dejan", "Hermoso Cariño", "El Rey", "Acompáñame"]
  },
  {
    slug: "mariachi-caballo-eventos-sevilla",
    title: "Espectáculo de Mariachi a Caballo en Sevilla | Show Ecuestre Edwin Agudelo",
    metaDescription: "Show ecuestre único en Sevilla. Edwin Agudelo fusiona la doma clásica de alta escuela con el mariachi tradicional. Impacto visual garantizado.",
    eventType: "ferias",
    city: "Sevilla",
    showType: "show-caballo",
    showTypeName: "Show Cantando a Caballo",
    intent: "Espectáculo ecuestre de mariachi de alta escuela para fincas y ferias.",
    uniqueDescription: "Fusión única de la elegancia ecuestre andaluza y la potencia del canto a caballo de Edwin Agudelo. Un show exclusivo donde Edwin, montado en caballos de alta escuela con seguro de responsabilidad completo, entona rancheras tradicionales con trajes charros de gala, ideal para recintos abiertos, plazas y ferias de gran envergadura.",
    localLogistics: "Transporte adaptado de caballos con remolques de seguridad homologados. Coordinación directa con picaderos y fincas de Sevilla. Cobertura en toda Andalucía.",
    suggestedRepertoire: ["El Jinete", "Cielito Lindo", "México Lindo y Querido", "Volver Volver"]
  },
  {
    slug: "mariachi-ayuntamientos-valencia-monumental",
    title: "Banda Monumental de Mariachis en Valencia | Festivales e Institucional",
    metaDescription: "Espectáculo masivo de Mariachi para Ayuntamientos en Valencia. Formación de gran escala (hasta 13 músicos) con el sello de Productora EAR.",
    eventType: "ayuntamientos",
    city: "Valencia",
    showType: "monumental",
    showTypeName: "Banda Monumental EAR",
    intent: "Contratación de gran formato de mariachis para fiestas patronales.",
    uniqueDescription: "Concierto monumental diseñado para licitaciones públicas y programas culturales de ayuntamientos en la Comunidad Valenciana. Con el respaldo de haber aportado el marco musical para Ana Gabriel en la Plaza de Toros de Valencia, reunimos a más de 12 músicos en escena interpretando himnos con arreglos sinfónicos de alta definición.",
    localLogistics: "Montaje técnico completo con microfonía inalámbrica profesional para violines y trompetas. Riguroso cumplimiento del protocolo B2G de la Generalitat Valenciana.",
    suggestedRepertoire: ["La Bikina", "Las Llaves de mi Alma", "Volver Volver", "El Rey"]
  },
  {
    slug: "mariachi-cumpleanos-malaga-solista",
    title: "Mariachi para Cumpleaños y Mañanitas en Málaga | Edwin Agudelo",
    metaDescription: "Sorpresa de cumpleaños con Edwin Agudelo solista en Málaga. Regala 'Las Mañanitas' y rancheras clásicas con la mejor voz y elegancia.",
    eventType: "cumpleaños",
    city: "Málaga",
    showType: "solista",
    showTypeName: "Edwin Agudelo - Solista Premium",
    intent: "Serenata de cumpleaños a domicilio con cantante premium de mariachi.",
    uniqueDescription: "El regalo más emotivo para padres, abuelos y seres queridos en Málaga. Edwin Agudelo (condecorado con el premio Gladiadores en el extranjero 2021) coordina la entrada secreta con el pastel para entonar las mañanitas con total elegancia y afecto, integrando micro-estimulación emocional para mayores.",
    localLogistics: "Desplazamiento para Málaga centro, Marbella, Fuengirola, Benalmádena y Torremolinos. Sonido discreto de alta definición Bose para interiores o jardines.",
    suggestedRepertoire: ["Las Mañanitas", "Amor Eterno", "Cien Años", "Acompáñame"]
  },
  {
    slug: "mariachi-aniversarios-zaragoza-gala",
    title: "Bodas de Oro y Aniversarios en Zaragoza | Mariachi de Gala",
    metaDescription: "Espectáculo de mariachi de gala para aniversarios en Zaragoza. 6 integrantes con repertorio de oro y dedicatorias exclusivas por Edwin Agudelo.",
    eventType: "aniversarios",
    city: "Zaragoza",
    showType: "mariachi-6",
    showTypeName: "Edwin Agudelo con Mariachis (6+)",
    intent: "Contratación de mariachis profesionales para bodas de plata y de oro.",
    uniqueDescription: "Conmemoramos trayectorias de vida y aniversarios familiares singulares en Aragón. Con un repertorio enfocado en la nostalgia y la felicidad compartida, y la integración de las frecuencias acústicas VIMUME para la estimulación de memoria activa en mayores, garantizamos un recuerdo imborrable y lleno de emoción.",
    localLogistics: "Reserva de fecha preferente con soporte técnico integrado para restaurantes, fincas feriales y domicilios de Zaragoza y provincia.",
    suggestedRepertoire: ["Motivos", "Gema", "Te amaré toda la vida", "Acompáñame"]
  },
  {
    slug: "mariachis-corporativos-madrid-monumental",
    title: "Mariachis para Eventos Corporativos en Madrid | Productora EAR",
    metaDescription: "Show corporativo premium en Madrid. Formato masivo espectacular para galas de empresa, convenciones y marcas, dirigido por Edwin Agudelo.",
    eventType: "corporativos",
    city: "Madrid",
    showType: "monumental",
    showTypeName: "Banda Monumental EAR",
    intent: "Música en directo premium para convenciones B2B de marcas multinacionales.",
    uniqueDescription: "El estándar oro para eventos empresariales en la capital. Edwin Agudelo, exdirector de salas y productor de 37 grandes conciertos internacionales, garantiza cronogramas milimétricos, sonido impecable apto para IFEMA y hoteles de 5 estrellas, y un show de alto nivel acústico idóneo para amenizaciones y cierres de gala.",
    localLogistics: "Rider técnico homologado de alta gama de Productora EAR. Técnico de sonido dedicado, microfonía inalámbrica y coordinación de protocolo B2B.",
    suggestedRepertoire: ["El Rey", "La Bikina", "México Lindo y Querido", "Acompáñame"]
  },
  {
    slug: "mariachi-bodas-oro-alicante-solista",
    title: "Mariachis para Bodas de Oro en Alicante | Edwin Agudelo Solista",
    metaDescription: "Homenaje de Bodas de Oro en Alicante con Edwin Agudelo. Show solista premium con canciones emotivas y fotos temáticas de recuerdo.",
    eventType: "aniversarios",
    city: "Alicante",
    showType: "solista",
    showTypeName: "Edwin Agudelo - Solista Premium",
    intent: "Contratar mariachi para sorpresa de 50 aniversario matrimonial.",
    uniqueDescription: "El tributo definitivo al amor de toda una vida. En Alicante, Edwin Agudelo entona las canciones preferidas de la pareja recreando la atmósfera dorada del mariachi tradicional de gala. Este show incluye sintonía sónica VIMUME para la reconexión de recuerdos de los homenajeados en un entorno de paz y gozo.",
    localLogistics: "Desplazamiento para Alicante centro, Elche, Altea, Benidorm y Torrevieja. Photocall, sombreros de charro para los homenajeados e ingeniería sónica Bose incluidos.",
    suggestedRepertoire: ["Amor de los Dos", "Gema", "Las Mañanitas", "Acompáñame"]
  },
  {
    slug: "mariachi-ferias-murcia-gala",
    title: "Mariachis para Ferias y Fiestas en Murcia | Formación Profesional",
    metaDescription: "Espectáculo tradicional de Mariachi con 6 músicos para fiestas de Murcia. Coordinación por Edwin Agudelo. Rigor, alegría y trajes de charro.",
    eventType: "ferias",
    city: "Murcia",
    showType: "mariachi-6",
    showTypeName: "Edwin Agudelo con Mariachis (6+)",
    intent: "Contratar agrupación de mariachis para recintos feriales y peñas.",
    uniqueDescription: "El complemento perfecto para dinamizar las fiestas patronales y eventos populares de la Región de Murcia. Un directo enérgico liderado por Edwin Agudelo que invita a cantar a todos los asistentes. La formación cuenta con trajes de gala charros impecables, trompetas, violines y voces coordinadas de alto impacto sónico.",
    localLogistics: "Montaje de sonido profesional y técnico sónico de Productora EAR incluidos. Cumplimiento de seguros de montaje, instalación y responsabilidad civil.",
    suggestedRepertoire: ["Cielito Lindo", "La Bikina", "Volver Volver", "El Rey"]
  },
  {
    slug: "mariachi-cumpleanos-bilbao-gala",
    title: "Mariachi para Cumpleaños y Serenatas en Bilbao | Edwin Agudelo",
    metaDescription: "Sorprende en Bilbao con el mejor espectáculo de Mariachis para cumpleaños. Directo de alta calidad, trajes bordados y sombreros de gala.",
    eventType: "cumpleaños",
    city: "Bilbao",
    showType: "mariachi-6",
    showTypeName: "Edwin Agudelo con Mariachis (6+)",
    intent: "Regalar mariachis para fiesta de cumpleaños familiar en el País Vasco.",
    uniqueDescription: "Lleva la calidez y el color de las mejores rancheras a Vizcaya. Coordinamos un repertorio alegre tradicional y baladas icónicas cantadas por la inigualable voz de Edwin Agudelo. Formación premium con trajes bordados de gala, violines y trompetas de alto nivel acústico e interactividad familiar.",
    localLogistics: "Desplazamiento y sonido profesional adaptado para caseríos, restaurantes y domicilios en Bilbao, Getxo y área metropolitana vasca.",
    suggestedRepertoire: ["Las Mañanitas", "El Rey", "Volver Volver", "Acompáñame"]
  }
];
