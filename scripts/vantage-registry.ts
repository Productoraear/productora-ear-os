
/**
 * 🦅 REGISTRO MAESTRO DE VENTAJAS INJUSTAS (DNA EAR OS)
 * Este archivo protege el conocimiento estratégico y los activos de blindaje
 * de la Productora EAR. No debe ser modificado sin validación del Kernel.
 */

export const UNFAIR_ADVANTAGES = {
  STRATEGIC: {
    EL_FARO: {
      title: "La Metáfora del Faro",
      description: "Separación total entre Estrategia (Mapa/Por Qué) y Táctica (Paso/Cómo).",
      principle: "Nunca dejes que una táctica brillante te distraiga de una estrategia mediocre."
    },
    SOBERANIA: {
      title: "Soberanía de Decisiones",
      description: "Fronteras claras entre tecnología, marketing y dirección para evitar el micromanagement.",
      rule: "Paz mental nace de saber qué te toca decidir y qué no."
    }
  },
  OPERATIONAL: {
    CAZADOR_PROTOCOL: {
      title: "El Cazador / Vampiro Digital",
      description: "Motor de scraping humanizado para captación de leads en bodas.net (EVE_URLS).",
      tech: "Algoritmos de navegación mimetizada para evitar detecciones."
    },
    BLINDAJE_EAR: {
      title: "Blindaje Forense",
      description: "Organización de PC NVMe/HDD con symlinks y optimización extrema de recursos.",
      status: "Activo (50GB liberados, 4 Verticales Consolidadas)."
    }
  },
  MARKET: {
    MENTRIDA_HUB: {
      title: "Operaciones Méntrida",
      description: "Centro estratégico en Toledo con cobertura de 300km (Madrid, Toledo, España).",
      advantage: "Reducción de costes logísticos y proximidad a eventos premium."
    },
    NO_VENDING: {
      title: "Venta de Alivio y Chispa",
      description: "En VIMUME no vendemos servicios; aliviamos dolor y devolvemos identidad.",
      forbidden: "Marketing agresivo prohibido."
    }
  },
  TECHNICAL: {
    MOAT_ESTETICO: {
      title: "Moat Estético S-Class",
      description: "Diseño premium que actúa como barrera de entrada para competidores.",
      standard: "Tipografía Montserrat, Colores Corporativos EAR (Gold/Dark)."
    },
    IA_FUSION_QWEN: {
      title: "IA Fusion Kernel",
      description: "Unión de ASTRA CORE y QWEN para procesamiento inteligente de datos y generación de código.",
      engine: "Digital Twin Explorer + Affinity Service."
    }
  }
};

export type AdvantageCategory = keyof typeof UNFAIR_ADVANTAGES;
