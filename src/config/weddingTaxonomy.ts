// 🏛️ SSOT TAXONOMÍA Y MEGA-NAVEGACIÓN BODAS.NET // PRODUCTORA EAR OS
// Generado automáticamente por scripts/workers/bodas_forensic_taxonomy_sweep.js
// Fecha de auditoría forense: 2026-09-16T19:59:50.895Z

export interface WeddingSubcategory {
  id: string;
  name: string;
  href: string;
  icon?: string;
  count?: number | null;
}

export interface WeddingCategory {
  id: string;
  title: string;
  href: string;
  items: WeddingSubcategory[];
}

export interface WeddingToolsSuite {
  id: string;
  name: string;
  path: string;
  isB2B: boolean;
}

export interface WeddingTaxonomySSOT {
  mainMenuItems: WeddingCategory[];
  subcategories: WeddingSubcategory[];
  tools: WeddingToolsSuite[];
}

export const WEDDING_TAXONOMY_SSOT: WeddingTaxonomySSOT = {
  "mainMenuItems": [
    {
      "id": "lugares-boda",
      "title": "Lugares para Boda",
      "href": "https://www.bodas.net/banquetes",
      "items": [
        {
          "id": "fincas",
          "name": "Fincas",
          "href": "/fincas-boda"
        },
        {
          "id": "masias",
          "name": "Masías",
          "href": "/masias-boda"
        },
        {
          "id": "hoteles",
          "name": "Hoteles",
          "href": "/hoteles-bodas"
        },
        {
          "id": "restaurantes",
          "name": "Restaurantes",
          "href": "/restaurantes-bodas"
        },
        {
          "id": "salones-de-boda",
          "name": "Salones de Boda",
          "href": "/salones-de-boda"
        },
        {
          "id": "castillos",
          "name": "Castillos",
          "href": "/castillos-bodas"
        },
        {
          "id": "cortijos",
          "name": "Cortijos",
          "href": "/cortijos-bodas"
        },
        {
          "id": "haciendas",
          "name": "Haciendas",
          "href": "/haciendas-bodas"
        },
        {
          "id": "bodegas",
          "name": "Bodegas",
          "href": "/bodegas-bodas"
        },
        {
          "id": "espacios-singulares",
          "name": "Espacios Singulares",
          "href": "/espacios-singulares-bodas"
        },
        {
          "id": "playa",
          "name": "Bodas en la playa",
          "href": "/bodas-en-la-playa"
        }
      ]
    },
    {
      "id": "proveedores",
      "title": "Proveedores",
      "href": "https://www.bodas.net/proveedores-boda",
      "items": [
        {
          "id": "fotografos",
          "name": "Fotógrafos",
          "href": "/fotografos-bodas"
        },
        {
          "id": "video",
          "name": "Vídeo",
          "href": "/video-bodas"
        },
        {
          "id": "musica",
          "name": "Música & Mariachis",
          "href": "/musica-bodas"
        },
        {
          "id": "catering",
          "name": "Catering",
          "href": "/catering-bodas"
        },
        {
          "id": "coches-boda",
          "name": "Coches de boda",
          "href": "/coches-de-boda"
        },
        {
          "id": "autobuses",
          "name": "Autobuses",
          "href": "/autobuses-bodas"
        },
        {
          "id": "floristerias",
          "name": "Floristerías",
          "href": "/floristerias-bodas"
        },
        {
          "id": "invitaciones",
          "name": "Invitaciones de boda",
          "href": "/invitaciones-de-boda"
        },
        {
          "id": "detalles",
          "name": "Detalles de bodas",
          "href": "/detalles-de-bodas"
        },
        {
          "id": "viaje-novios",
          "name": "Viaje de novios",
          "href": "/luna-de-miel"
        },
        {
          "id": "mobiliario",
          "name": "Mobiliario",
          "href": "/alquiler-mobiliario-bodas"
        },
        {
          "id": "carpas",
          "name": "Carpas",
          "href": "/alquiler-carpas-bodas"
        },
        {
          "id": "animacion",
          "name": "Animación",
          "href": "/animacion-bodas"
        },
        {
          "id": "decoracion",
          "name": "Decoración para bodas",
          "href": "/decoracion-bodas"
        },
        {
          "id": "organizacion",
          "name": "Organización Bodas",
          "href": "/organizacion-bodas"
        },
        {
          "id": "tartas",
          "name": "Tartas de boda",
          "href": "/tartas-de-boda"
        },
        {
          "id": "food-truck",
          "name": "Food truck y mesas dulces",
          "href": "/mesas-dulces-bodas"
        }
      ]
    },
    {
      "id": "novias",
      "title": "Novias",
      "href": "https://www.bodas.net/novias",
      "items": [
        {
          "id": "talleres-novia",
          "name": "Talleres de novia",
          "href": "/talleres-de-novia"
        },
        {
          "id": "tiendas-novia",
          "name": "Tiendas de novia",
          "href": "/tiendas-de-novia"
        },
        {
          "id": "complementos-novia",
          "name": "Complementos novia",
          "href": "/complementos-novia"
        },
        {
          "id": "joyeria",
          "name": "Joyería",
          "href": "/joyeria-bodas"
        },
        {
          "id": "belleza-novias",
          "name": "Belleza Novias",
          "href": "/belleza-novias"
        },
        {
          "id": "trajes-fiesta",
          "name": "Trajes fiesta",
          "href": "/vestidos-fiesta"
        },
        {
          "id": "trajes-madrina",
          "name": "Trajes madrina",
          "href": "/vestidos-madrina"
        },
        {
          "id": "vestidos-arras",
          "name": "Vestidos de arras",
          "href": "/vestidos-arras"
        }
      ]
    },
    {
      "id": "novios",
      "title": "Novios",
      "href": "https://www.bodas.net/novios",
      "items": [
        {
          "id": "trajes-novio",
          "name": "Trajes novio",
          "href": "/trajes-novio"
        },
        {
          "id": "complementos-novio",
          "name": "Complementos novio",
          "href": "/complementos-novio"
        }
      ]
    }
  ],
  "subcategories": [
    {
      "id": "fincas",
      "name": "Fincas",
      "href": "/fincas-boda"
    },
    {
      "id": "masias",
      "name": "Masías",
      "href": "/masias-boda"
    },
    {
      "id": "hoteles",
      "name": "Hoteles",
      "href": "/hoteles-bodas"
    },
    {
      "id": "restaurantes",
      "name": "Restaurantes",
      "href": "/restaurantes-bodas"
    },
    {
      "id": "salones-de-boda",
      "name": "Salones de Boda",
      "href": "/salones-de-boda"
    },
    {
      "id": "castillos",
      "name": "Castillos",
      "href": "/castillos-bodas"
    },
    {
      "id": "cortijos",
      "name": "Cortijos",
      "href": "/cortijos-bodas"
    },
    {
      "id": "haciendas",
      "name": "Haciendas",
      "href": "/haciendas-bodas"
    },
    {
      "id": "bodegas",
      "name": "Bodegas",
      "href": "/bodegas-bodas"
    },
    {
      "id": "espacios-singulares",
      "name": "Espacios Singulares",
      "href": "/espacios-singulares-bodas"
    },
    {
      "id": "playa",
      "name": "Bodas en la playa",
      "href": "/bodas-en-la-playa"
    },
    {
      "id": "fotografos",
      "name": "Fotógrafos",
      "href": "/fotografos-bodas"
    },
    {
      "id": "video",
      "name": "Vídeo",
      "href": "/video-bodas"
    },
    {
      "id": "musica",
      "name": "Música & Mariachis",
      "href": "/musica-bodas"
    },
    {
      "id": "catering",
      "name": "Catering",
      "href": "/catering-bodas"
    },
    {
      "id": "coches-boda",
      "name": "Coches de boda",
      "href": "/coches-de-boda"
    },
    {
      "id": "autobuses",
      "name": "Autobuses",
      "href": "/autobuses-bodas"
    },
    {
      "id": "floristerias",
      "name": "Floristerías",
      "href": "/floristerias-bodas"
    },
    {
      "id": "invitaciones",
      "name": "Invitaciones de boda",
      "href": "/invitaciones-de-boda"
    },
    {
      "id": "detalles",
      "name": "Detalles de bodas",
      "href": "/detalles-de-bodas"
    },
    {
      "id": "viaje-novios",
      "name": "Viaje de novios",
      "href": "/luna-de-miel"
    },
    {
      "id": "mobiliario",
      "name": "Mobiliario",
      "href": "/alquiler-mobiliario-bodas"
    },
    {
      "id": "carpas",
      "name": "Carpas",
      "href": "/alquiler-carpas-bodas"
    },
    {
      "id": "animacion",
      "name": "Animación",
      "href": "/animacion-bodas"
    },
    {
      "id": "decoracion",
      "name": "Decoración para bodas",
      "href": "/decoracion-bodas"
    },
    {
      "id": "organizacion",
      "name": "Organización Bodas",
      "href": "/organizacion-bodas"
    },
    {
      "id": "tartas",
      "name": "Tartas de boda",
      "href": "/tartas-de-boda"
    },
    {
      "id": "food-truck",
      "name": "Food truck y mesas dulces",
      "href": "/mesas-dulces-bodas"
    },
    {
      "id": "talleres-novia",
      "name": "Talleres de novia",
      "href": "/talleres-de-novia"
    },
    {
      "id": "tiendas-novia",
      "name": "Tiendas de novia",
      "href": "/tiendas-de-novia"
    },
    {
      "id": "complementos-novia",
      "name": "Complementos novia",
      "href": "/complementos-novia"
    },
    {
      "id": "joyeria",
      "name": "Joyería",
      "href": "/joyeria-bodas"
    },
    {
      "id": "belleza-novias",
      "name": "Belleza Novias",
      "href": "/belleza-novias"
    },
    {
      "id": "trajes-fiesta",
      "name": "Trajes fiesta",
      "href": "/vestidos-fiesta"
    },
    {
      "id": "trajes-madrina",
      "name": "Trajes madrina",
      "href": "/vestidos-madrina"
    },
    {
      "id": "vestidos-arras",
      "name": "Vestidos de arras",
      "href": "/vestidos-arras"
    },
    {
      "id": "trajes-novio",
      "name": "Trajes novio",
      "href": "/trajes-novio"
    },
    {
      "id": "complementos-novio",
      "name": "Complementos novio",
      "href": "/complementos-novio"
    }
  ],
  "tools": [
    {
      "id": "agenda-tareas",
      "name": "Mi Agenda & Tareas",
      "path": "/tools/Checklist",
      "isB2B": false
    },
    {
      "id": "presupuestador",
      "name": "Presupuestador de Boda",
      "path": "/tools/Budget",
      "isB2B": false
    },
    {
      "id": "invitados",
      "name": "Gestor de Invitados",
      "path": "/tools/Guests",
      "isB2B": false
    },
    {
      "id": "mesas-seating",
      "name": "Organizador de Mesas (Seating Plan)",
      "path": "/tools/Tables",
      "isB2B": false
    },
    {
      "id": "web-boda",
      "name": "Web de Boda",
      "path": "/tools/WeddingWebsite",
      "isB2B": false
    },
    {
      "id": "equipo-proveedores",
      "name": "Equipo de Proveedores",
      "path": "/tools/Suppliers",
      "isB2B": false
    },
    {
      "id": "escaparate-b2b",
      "name": "Mi Escaparate (Fincas & Proveedores)",
      "path": "/emp-AdminChecklist.php",
      "isB2B": true
    },
    {
      "id": "solicitudes-b2b",
      "name": "Mis Solicitudes & Leads",
      "path": "/emp-AdminSolicitudes.php",
      "isB2B": true
    },
    {
      "id": "opiniones-b2b",
      "name": "Opiniones y Valoraciones",
      "path": "/emp-AdminReviews.php",
      "isB2B": true
    },
    {
      "id": "facturacion-b2b",
      "name": "Facturación y Recibos",
      "path": "/emp-AdminRecibos.php",
      "isB2B": true
    }
  ]
};
