/**
 * 🗺️ TALENT OS V2 - HIGH-VALUE SEO MATRIX (EVENT × CITY × FORMAT × INTENT)
 * Avoids duplicate and thin content by using high-density structured localized data.
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
    uniqueDescription: "Una experiencia nupcial íntima y distinguida en la Comunidad de Madrid. Diseñamos la entrada sorpresa de Edwin Agudelo durante el cóctel o el banquete, adaptando las dedicatorias a la historia de amor de la pareja.",
    localLogistics: "Desplazamiento incluido para Madrid centro, Pozuelo, Las Rozas y La Moraleja. Equipamiento sónico Bose 2000W auto-alimentado.",
    suggestedRepertoire: ["Te amaré toda la vida", "Cásate conmigo", "La mitad que me faltaba"]
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
    uniqueDescription: "Lleva el máximo esplendor de la tradición mexicana a tu boda en Barcelona. La agrupación Sol de Oro, liderada por Edwin Agudelo, ofrece una puesta en escena impecable con sombreros de gala, violines, trompetas y guitarrón.",
    localLogistics: "Logística optimizada para Masías en el Penedès, Sitges y área metropolitana de Barcelona. Sonido calibrado para exteriores e interiores.",
    suggestedRepertoire: ["Si nos dejan", "Hermoso Cariño", "El Rey"]
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
    uniqueDescription: "Fusión única de la elegancia ecuestre andaluza y la potencia del canto a caballo de Edwin Agudelo. Ideal para bodas rústicas, ferias y exhibiciones de gran impacto visual en el sur de España.",
    localLogistics: "Transporte adaptado de caballos con seguro de responsabilidad civil completo. Coordinación directa con picaderos y fincas de Sevilla.",
    suggestedRepertoire: ["El Jinete", "Cielito Lindo", "México Lindo y Querido"]
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
    uniqueDescription: "Licitaciones públicas y programas culturales de alta reputación en la Comunidad Valenciana. Un concierto monumental que reúne a más de 12 músicos en escena interpretando himnos atemporales con arreglos de gala.",
    localLogistics: "Montaje técnico completo con microfonía inalámbrica para violines y trompetas. Cumplimiento estricto del protocolo B2G de la Generalitat.",
    suggestedRepertoire: ["La Bikina", "Las Llaves de mi Alma", "Volver Volver"]
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
    uniqueDescription: "El regalo más emotivo para padres, abuelos y seres queridos en Málaga. Edwin Agudelo coordina la entrada secreta con el pastel o las velas para entonar las mañanitas con total elegancia y afecto.",
    localLogistics: "Desplazamiento para Málaga centro, Marbella, Fuengirola y Torremolinos. Equipamiento de sonido portátil discreto y elegante.",
    suggestedRepertoire: ["Las Mañanitas", "Amor Eterno", "Cien Años"]
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
    uniqueDescription: "Conmemoramos trayectorias de vida y hitos familiares singulares en Aragón. Con un setlist enfocado en la nostalgia y la felicidad compartida, garantizamos lágrimas de alegría y un recuerdo imborrable.",
    localLogistics: "Reserva de fecha preferente con soporte en restaurantes, fincas feriales y domicilios de Zaragoza.",
    suggestedRepertoire: ["Motivos", "Gema", "Te amaré toda la vida"]
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
    uniqueDescription: "El estándar oro para eventos empresariales en la capital. Coordinación impecable con directores de marketing, cronogramas milimétricos y show de alto nivel acústico idóneo para amenizaciones y cierres de gala.",
    localLogistics: "Rider técnico homologado para recintos feriales como IFEMA, hoteles de 5 estrellas y eventos al aire libre en Madrid.",
    suggestedRepertoire: ["El Rey", "La Bikina", "México Lindo y Querido"]
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
    uniqueDescription: "El tributo definitivo al amor de toda una vida. En Alicante, Edwin Agudelo entona las canciones preferidas de la pareja recreando la atmósfera dorada del mariachi tradicional.",
    localLogistics: "Desplazamiento para Alicante centro, Elche, Altea y Benidorm. Photocall y sombreros de charro para los homenajeados incluidos.",
    suggestedRepertoire: ["Amor de los Dos", "Gema", "Las Mañanitas"]
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
    uniqueDescription: "El complemento perfecto para dinamizar las fiestas patronales y eventos populares de la Región de Murcia. Un directo enérgico que invita a cantar a todos los asistentes.",
    localLogistics: "Sonido profesional y técnico de sonido incluidos. Seguros de montaje e instalación homologados.",
    suggestedRepertoire: ["Cielito Lindo", "La Bikina", "Volver Volver"]
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
    uniqueDescription: "Lleva la calidez y el color de las mejores rancheras a Vizcaya. Coordinamos el repertorio alegre tradicional y baladas icónicas para cantar en familia con la máxima sintonía sónica.",
    localLogistics: "Desplazamiento y sonido profesional adaptado para caseríos, restaurantes y domicilios en Bilbao y alrededores.",
    suggestedRepertoire: ["Las Mañanitas", "El Rey", "Volver Volver"]
  }
];
