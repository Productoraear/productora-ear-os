export interface NavItem {
  name: string;
  href: string;
  submenu?: NavItem[];
}

export const NAVIGATION_CONFIG: Record<string, NavItem[]> = {
  GLOBAL: [
    { name: "INICIO", href: "/" },
    { 
      name: "EVENTOS", 
      href: "/eventos",
      submenu: [
        { name: "S-CLASS WEDDINGS", href: "/weddings" },
        { name: "PRODUCCIÓN & RENTALS", href: "/eventos/produccion" },
        { name: "CALENDARIO", href: "/eventos/calendario" },
        { name: "UNIO PLANNER", href: "/eventos/bodas/planner" }
      ]
    },
    { 
      name: "VIMUME", 
      href: "/vimume",
      submenu: [
        { name: "VISIÓN 360", href: "/vimume" },
        { name: "SERVICIOS MAYORES", href: "/vimume/servicios" },
        { name: "BLOG CIENTÍFICO", href: "/vimume/blog" },
        { name: "COLECTIVO RSC", href: "/vimume/rsc" }
      ]
    },
    { 
      name: "ARTISTAS", 
      href: "/artistas",
      submenu: [
        { name: "ROSTER OFICIAL", href: "/artists" },
        { name: "ASTRA PORTAL", href: "/astra" },
        { name: "ACADEMY & MINDSET", href: "/artistas/academy" },
        { name: "LEGAL & BUSINESS", href: "/artistas/servicios/legal" }
      ]
    },
    { 
      name: "SISTEMA OPERATIVO", 
      href: "/command-center",
      submenu: [
        { name: "COMMAND CENTER (CEO)", href: "/command-center" },
        { name: "PROFESOR IA (RAG)", href: "/profesor-ia" },
        { name: "DASHBOARD", href: "/dashboard" },
        { name: "BÓVEDA DE ACTIVOS", href: "/command-center#assets" }
      ]
    },
    { name: "CONTACTO", href: "/contacto" },
  ],
  VIMUME: [
    { name: "VIMUME HOME", href: "/vimume" },
    { 
      name: "SERVICIOS", 
      href: "/vimume/servicios", 
      submenu: [
        { name: "MUSICOTERAPIA", href: "/vimume/servicios/musicoterapia" },
        { name: "FORMACIÓN CUIDADORES", href: "/vimume/servicios/formacion" },
        { name: "EVENTOS ESPECIALES", href: "/vimume/servicios/eventos" }
      ]
    },
    { name: "BLOG / CIENCIA", href: "/vimume/blog" },
    { name: "STAKEHOLDERS", href: "/vimume/rsc" },
    { name: "SOBRE NOSOTROS", href: "/vimume/nosotros" },
    { name: "PORTAL EAR", href: "/" },
  ],
  ARTISTAS: [
    { name: "ARTISTAS HOME", href: "/artistas" },
    { name: "CATÁLOGO", href: "/artists" },
    { 
      name: "ACADEMY", 
      href: "/artistas/academy", 
      submenu: [
        { name: "MINDSET & ÉXITO", href: "/artistas/academy/mindset" },
        { name: "NEGOCIO MUSICAL", href: "/artistas/academy/negocio" },
        { name: "LEGAL & FINANZAS", href: "/artistas/academy/legal" }
      ]
    },
    { name: "ASTRA PORTAL", href: "/astra" },
    { name: "SERVICIOS 360", href: "/artistas/servicios" },
    { name: "PORTAL EAR", href: "/" },
  ],
  EVENTOS: [
    { name: "EVENTOS HOME", href: "/eventos" },
    { 
      name: "BODAS (UNIO)", 
      href: "/weddings", 
      submenu: [
        { name: "PLANIFICADOR", href: "/eventos/bodas/planner" },
        { name: "GUÍA DE COSTES", href: "/eventos/bodas/costos" },
        { name: "PROVEEDORES", href: "/eventos/bodas/proveedores" }
      ]
    },
    { name: "PRODUCCIÓN", href: "/eventos/produccion" },
    { name: "ALQUILER / RENTALS", href: "/rentals" },
    { name: "CALENDARIO", href: "/eventos/calendario" },
    { name: "PORTAL EAR", href: "/" },
  ]
};
