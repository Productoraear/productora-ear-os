
export interface LegacyRouteMeta {
  sourceUrl: string;
  targetPath: string;
  priority: number; // 1-10
  category: 'seo' | 'direct' | 'ad';
  vampireStatus: 'hunting' | 'captured' | 'indexed';
  metadata: {
    title: string;
    description: string;
    keywords: string[];
  };
}

export const LEGACY_ROUTES: Record<string, LegacyRouteMeta> = {
  // Kamal.es Vampirization
  "alquiler-de-equipos-audiovisuales": {
    sourceUrl: "https://www.kamal.es/alquiler-de-equipos-audiovisuales/",
    targetPath: "/services/audiovisual/tech-rentals",
    priority: 10,
    category: 'seo',
    vampireStatus: 'hunting',
    metadata: {
      title: "Alquiler de Equipos Audiovisuales Premium | EAR OS",
      description: "Superamos el estándar de Kamal con tecnología L-Acoustics y DiGiCo. Despliegue táctico inmediato.",
      keywords: ["alquiler audiovisuales madrid", "equipos sonido profesional"]
    }
  },
  "produccion-de-eventos": {
    sourceUrl: "https://www.kamal.es/produccion-de-eventos/",
    targetPath: "/services/production/event-architect",
    priority: 9,
    category: 'seo',
    vampireStatus: 'hunting',
    metadata: {
      title: "Arquitectura de Eventos S-Class | EAR OS",
      description: "No solo producimos, diseñamos experiencias inmersivas con precisión militar.",
      keywords: ["produccion eventos corporativos", "organizacion eventos madrid"]
    }
  },
  // Bodas.net Vampirization
  "proveedores-bodas/musica": {
    sourceUrl: "https://www.bodas.net/proveedores/musica/",
    targetPath: "/artists/matcher",
    priority: 10,
    category: 'seo',
    vampireStatus: 'hunting',
    metadata: {
      title: "Discovery de Artistas S-Class | EAR OS Matcher",
      description: "Olvida el directorio estático de Bodas.net. Encuentra el vibe perfecto con nuestro Tinder de Artistas.",
      keywords: ["musica bodas", "dj bodas madrid", "musica en vivo"]
    }
  },
  // ACADEMY - OACV01 Sincronización
  "academy": {
    sourceUrl: "https://www.productoraear.com/academia/",
    targetPath: "/academy",
    priority: 10,
    category: 'direct',
    vampireStatus: 'captured',
    metadata: {
      title: "Academia VIMUME OACV01 | EAR OS Master",
      description: "La central de control operativa del Viaje Musical por la Memoria. Ingeniería de 1.500€ para el impacto cultural.",
      keywords: ["formacion vimume", "academia ear", "musicoterapia elite"]
    }
  }
};
