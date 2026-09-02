/**
 * 🗺️ CANONICAL ROUTES SSOT
 * Centralización de rutas para evitar 404 y enlaces inconsistentes.
 */
export const ROUTES = {
  home: "/",
  artistas: "/artistas",
  artists: "/artistas",
  presupuesto: "/presupuesto",
  cotizador: "/cotizador",
  theSignal: "/the-signal",
  empresarios: "/empresarios",
  ayuntamientos: "/ayuntamientospremium",
  ayuntamientosPremium: "/ayuntamientospremium",
  dossier: "/dossier",
  servicios: "/servicios",
  bodas: "/bodas",
  calculadora: "/calculadora",
  marketplace: "/marketplace",
  ocasiones: "/ocasiones",
  precios: "/precios",
  infraestructura: "/infraestructura",
  arsenal: "/arsenal",
  reclamarPerfil: "/reclamar-perfil",
  login: "/login",
  dashboard: "/dashboard",
  blog: "/blog",
  blogCasos: "/blog/casos-clinicos",
  blogInvestigacion: "/blog/investigacion",
  blogTecnica: "/blog/tecnica-sonora",
  blogImpacto: "/blog/impacto-social",
  blogB2G: "/blog/b2g",
  vimume: "/vimume",
  vimumeCentros: "/vimume/centros",
  vimumeEventos: "/vimume/eventos",
  vimumeNosotros: "/vimume/nosotros",
  vimumeFaq: "/vimume/faq",
  vimumeInversion: "/vimume/inversion",
  vimumeInvestigacion: "/vimume/investigacion",
  fundacion: "/vimume/fundacion",
  protocolo: "/vimume/protocolo",
  roadmap: "/vimume/roadmap",
  contacto: "/contacto",
  vimumeContacto: "/vimume/contacto",
} as const;

export type RouteKey = keyof typeof ROUTES;

