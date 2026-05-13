/**
 * CONSTANTES DE DOMINANCIA GEOGRÁFICA Y SEMÁNTICA (ESP)
 * EAR OS V2 GOLD - PRODUCTORAEAR.COM
 */

export const PROVINCIAS = [
  "alava", "albacete", "alicante", "almeria", "asturias", "avila", "badajoz", "baleares", 
  "barcelona", "burgos", "caceres", "cadiz", "cantabria", "castellon", "ciudad-real", 
  "cordoba", "cuenca", "gerona", "granada", "guadalajara", "guipuzcoa", "huelva", "huesca", 
  "jaen", "leon", "lerida", "lugo", "madrid", "malaga", "murcia", "navarra", "orense", 
  "palencia", "las-palmas", "pontevedra", "la-rioja", "salamanca", "segovia", "sevilla", 
  "soria", "tarragona", "santa-cruz-de-tenerife", "teruel", "toledo", "valencia", 
  "valladolid", "vizcaya", "zamora", "zaragoza", "ceuta", "melilla"
];

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

export const SEO_METADATA_BASE = {
  title: "Productora EAR - Dominancia en Eventos Premium",
  description: "Líderes en sonorización, iluminación y producción audiovisual en toda España. Tecnología S-Class para eventos inolvidables.",
};
