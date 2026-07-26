/**
 * CONSTANTES DE DOMINANCIA GEOGRÁFICA Y SEMÁNTICA (ESP)
 * EAR OS V2 GOLD - PRODUCTORAEAR.COM
 */

export const PROVINCIAS = ['madrid', 'barcelona', 'valencia', 'sevilla', 'zaragoza', 'malaga', 'murcia', 'palma', 'las-palmas', 'bilbao', 'alicante', 'cordoba', 'valladolid', 'vigo', 'gijon', 'hospitalet', 'vitoria', 'coruna', 'elche', 'granada', 'terrassa', 'badalona', 'oviedo', 'sabadell', 'cartagena', 'jerez', 'mostoles', 'santa-cruz', 'pamplona', 'almeria', 'alcala', 'fuenlabrada', 'leganes', 'san-sebastian', 'getafe', 'burgos', 'albacete', 'castellon', 'santander', 'alcorcon', 'logrono', 'badajoz', 'la-laguna', 'huelva', 'salamanca', 'marbella', 'lerida', 'dos-hermanas', 'torrejon', 'parla', 'mataro', 'leon', 'algeciras', 'santa-coloma', 'alcobendas', 'cadiz', 'jaen', 'reus', 'orense', 'telde', 'gerona', 'barakaldo', 'roquetas', 'santiago', 'lugo', 'lorca', 'caceres', 'san-fernando', 'las-rozas', 'sant-cugat', 'rivas', 'san-sebastian-reyes', 'cornella', 'el-puerto', 'pozuelo', 'guadalajara', 'tarraco', 'melilla', 'toledo', 'ceuta', 'pontevedra', 'chiclana', 'torrent', 'el-ejido', 'arona', 'roquetas-de-mar', 'coslada', 'velez-malaga', 'mijas', 'getxo', 'fuengirola', 'rubi', 'manresa', 'alcala-de-guadaira', 'ponferrada', 'valdemoro', 'majadahonda', 'benidorm', 'molina-de-segura', 'santa-lucia', 'sanlucar', 'estepona', 'benalmadena', 'sagunto', 'paterna', 'zamora', 'avila', 'segovia', 'cuenca', 'huesca', 'soria', 'teruel'];

export const SERVICIOS = [
  {
    id: "sonorizacion-eventos",
    slug: "sonorizacion-eventos",
    nombre: "Sonorización de Eventos",
    descripcion: "Ingeniería acústica de precisión para eventos de alto nivel.",
    keywords: ["sonido para eventos", "alquiler de sonido", "ingeniería sónica"]
  },
  {
    id: "innovacion-social",
    slug: "innovacion-social",
    nombre: "Innovación Social & VIMUME",
    descripcion: "Proyectos de impacto social y economía plateada liderados por EAR.",
    keywords: ["innovación social", "silver economy", "vimume", "impacto social"]
  },
  {
    id: "iluminacion-espectacular",
    slug: "iluminacion-espectacular",
    nombre: "Iluminación Espectacular",
    descripcion: "Diseño lumínico inmersivo y tecnología LED de última generación.",
    keywords: ["iluminación eventos", "diseño de luces", "alquiler de luces"]
  },
  {
    id: "produccion-audiovisual",
    slug: "produccion-audiovisual",
    nombre: "Producción Audiovisual",
    descripcion: "Cobertura integral y streaming de alta definición para corporativos.",
    keywords: ["producción audiovisual", "video para eventos", "streaming profesional"]
  },
  {
    id: "dj-premium",
    slug: "dj-premium",
    nombre: "DJ Premium y Animación",
    descripcion: "Curaduría musical exclusiva para audiencias exigentes con sistemas S-Class.",
    keywords: ["dj para eventos", "música premium", "animación corporativa", "dj bodas"]
  },
  {
    id: "configurador-bespoke",
    slug: "configurador-bespoke",
    nombre: "Configurador Bespoke",
    descripcion: "Presupuestos en tiempo real con nuestra IA de ingeniería sónica.",
    keywords: ["presupuesto sonido", "configurador eventos", "cotización online"]
  },
  {
    id: "edwin-agudelo-solista",
    slug: "edwin-agudelo-solista",
    nombre: "Edwin Agudelo - Solista Premium",
    descripcion: "Gladiador en el Extranjero 2021. Cantautor en positivo con 20 años de trayectoria. La voz más versátil para eventos de alta gama.",
    keywords: ["cantante solista madrid", "edwin agudelo", "gladiador en el extranjero", "acompañame edwin agudelo", "musica en vivo premium"],
    related_entities: ["productora-ear", "vimume", "innovacion-social"]
  },
  {
    id: "edwin-agudelo-mariachi-6",
    slug: "edwin-agudelo-mariachi-6",
    nombre: "Edwin Agudelo con Mariachis (6+)",
    descripcion: "Formación de gala con mínimo 6 músicos. El protocolo original de Edwin Agudelo para bodas y grandes eventos.",
    keywords: ["mariachis profesionales", "edwin agudelo mariachi", "mariachis 6 integrantes", "mariachi de gala españa"],
    related_entities: ["productora-ear", "vimume", "innovacion-social"]
  },
  {
    id: "edwin-caballo",
    slug: "edwin-caballo",
    nombre: "Show Cantando a Caballo",
    descripcion: "Espectáculo ecuestre único en Europa. Edwin Agudelo fusiona la doma clásica con el mariachi de alta escuela.",
    keywords: ["mariachi a caballo", "show ecuestre", "espectáculo ecuestre madrid", "doma clásica y mariachi", "edwin agudelo show caballo"],
    related_entities: ["productora-ear", "vimume", "innovacion-social"]
  },
  {
    id: "banda-monumental",
    slug: "banda-monumental",
    nombre: "Banda Monumental EAR",
    descripcion: "La máxima expresión de potencia musical. Una formación masiva diseñada para festivales, ferias y eventos de gran escala.",
    keywords: ["banda de musica", "banda municipal", "banda para festivales", "gran formato musical"],
    related_entities: ["productora-ear"]
  }
];

export const OCASIONES = [
  { slug: 'bodas', nombre: 'Bodas de Lujo', descripcion: 'Planificación y música para bodas premium.' },
  { slug: 'corporativo', nombre: 'Eventos Corporativos', descripcion: 'Soluciones B2B para convenciones y galas.' },
  { slug: 'ayuntamientos', nombre: 'Institucional B2G', descripcion: 'Protocolos para entidades públicas y festejos.' },
  { slug: 'ferias', nombre: 'Ferias y Fiestas', descripcion: 'Gran formato para recintos feriales.' }
];

export const GUIAS = [
  { slug: 'como-contratar-mariachi', nombre: 'Guía: Cómo contratar un Mariachi', descripcion: 'Todo lo que debes saber para no fallar en tu elección.' },
  { slug: 'planificacion-sonido-boda', nombre: 'Guía: Planificación de Sonido para Bodas', descripcion: 'Ingeniería acústica para el día más importante.' },
  { slug: 'impacto-social-eventos', nombre: 'Guía: Impacto Social en Eventos B2B', descripcion: 'Cómo VIMUME transforma tu responsabilidad social.' }
];

export const SEO_METADATA_BASE = {
  title: "VIMUME OS - Autoridad en Impacto Social & Memoria",
  description: "Arquitectura narrativa y operativa para la economía plateada. Innovación social, gestión de artistas de gala y producción técnica de alta autoridad.",
};
