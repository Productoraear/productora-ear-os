// src/lib/constants/pricing-catalog.ts

export interface FormatPricing {
  id: string;
  name: string;
  basePrice: number;
  duration: string;
  members: number;
  description: string;
  category: 'SOLISTA' | 'CAMARA' | 'ENSAMBLE' | 'ESPECIALIDAD' | 'TECNICA' | 'B2G';
  rider: string;
  wattsPerPax: number;
  minGrossMargin: number;
  split: {
    artist: number;
    platform: number;
    vimume: number;
  };
}

export const SCLASS_ROSTER_14_FORMATS: FormatPricing[] = [
  {
    id: 'solista-edwin-agudelo',
    name: 'Solista de Gala (Edwin Agudelo)',
    basePrice: 350,
    duration: '60 - 90 minutos',
    members: 1,
    description: 'Voz de tenor y guitarra acústica en directo. Formato insignia de Productora EAR con sonido Bose y microfonía Shure Beta 87A.',
    category: 'SOLISTA',
    rider: 'Bose S1 Pro / Bose F1 Model 812 + Shure GLXD4 Beta 87A',
    wattsPerPax: 12,
    minGrossMargin: 0.62,
    split: { artist: 0.80, platform: 0.10, vimume: 0.10 }
  },
  {
    id: 'duo-acustico',
    name: 'Dúo Acústico S-Class',
    basePrice: 480,
    duration: '90 minutos',
    members: 2,
    description: 'Voz y piano o guitarra con arreglos de cámara para eventos íntimos, ceremonias y cócteles corporativos.',
    category: 'CAMARA',
    rider: 'Bose F1 Model 812 + Mezcla Behringer XR18 + Microfonía Shure Axient RF',
    wattsPerPax: 12,
    minGrossMargin: 0.60,
    split: { artist: 0.80, platform: 0.10, vimume: 0.10 }
  },
  {
    id: 'trio-camara',
    name: 'Trío de Cámara',
    basePrice: 600,
    duration: '90 minutos',
    members: 3,
    description: 'Voz principal, guitarra/teclado y percusión suave/cuerda para cócteles de bodas y galas familiares.',
    category: 'CAMARA',
    rider: 'Bose F1 Model 812 + Monitorización In-Ear + Shure Beta 87A',
    wattsPerPax: 12,
    minGrossMargin: 0.59,
    split: { artist: 0.80, platform: 0.10, vimume: 0.10 }
  },
  {
    id: 'cuarteto-imperial',
    name: 'Cuarteto Imperial de Cuerdas y Voces',
    basePrice: 750,
    duration: '90 minutos (2 pases)',
    members: 4,
    description: 'Formación de cámara con cuerdas y vientos para galas, recepciones diplomáticas y ceremonias de gran solemnidad.',
    category: 'CAMARA',
    rider: 'Bose F1 Model 812 + Consola XR18 + 4 micros Shure Beta 87A/98H',
    wattsPerPax: 12,
    minGrossMargin: 0.58,
    split: { artist: 0.80, platform: 0.10, vimume: 0.10 }
  },
  {
    id: 'quinteto-gala-mariachi',
    name: 'Quinteto de Gala Mariachi',
    basePrice: 900,
    duration: '75 minutos de gala',
    members: 5,
    description: 'Voz principal tenor + 2 Trompetas + Vihuela + Guitarrón. Trajes charros de gran gala con botonaduras de plata cosidas a mano.',
    category: 'ENSAMBLE',
    rider: 'Line Array Bose F1 Model 812 + Subwoofer Activo F1 + XR18 Midas',
    wattsPerPax: 12,
    minGrossMargin: 0.58,
    split: { artist: 0.80, platform: 0.10, vimume: 0.10 }
  },
  {
    id: 'gran-ensamble-orquestal',
    name: 'Gran Ensamble Orquestal S-Class',
    basePrice: 1400,
    duration: '120 minutos (2 pases)',
    members: 10,
    description: 'Ensamble sinfónico completo con sección rítmica y vientos para festivales, macrofiestas patronales y grandes celebraciones.',
    category: 'ENSAMBLE',
    rider: 'Doble Columna Bose F1 812 + Subwoofers duales 18" + Iluminación DMX',
    wattsPerPax: 18,
    minGrossMargin: 0.58,
    split: { artist: 0.80, platform: 0.10, vimume: 0.10 }
  },
  {
    id: 'vimume-b2g-clinico',
    name: 'VIMUME B2G — Intervención Neuroacústica',
    basePrice: 480,
    duration: '60 minutos clínicos',
    members: 2,
    description: 'Protocolo de estimulación neuroacústica Gamma 40Hz para residencias de mayores y centros de día. Límite < 75 dB SPL.',
    category: 'B2G',
    rider: 'Bose S1 Pro calibrado a < 75 dB SPL + Generador acústico 40Hz Gamma',
    wattsPerPax: 6,
    minGrossMargin: 0.65,
    split: { artist: 0.80, platform: 0.10, vimume: 0.10 }
  },
  {
    id: 'pantallas-led-p26',
    name: 'Pantallas LED P2.6 Modular de Alto Brillo',
    basePrice: 250,
    duration: 'Jornada de evento',
    members: 1,
    description: 'Pared de vídeo modular para mapping, fondos visuales cinematográficos y directos en bodas y actos institucionales.',
    category: 'TECNICA',
    rider: 'Módulos LED P2.6 outdoor/indoor > 5.500 nits + Procesador NovaStar 4K',
    wattsPerPax: 0,
    minGrossMargin: 0.70,
    split: { artist: 0.80, platform: 0.10, vimume: 0.10 }
  },
  {
    id: 'mariachi-femenino-gala',
    name: 'Mariachi Femenino de Gala',
    basePrice: 700,
    duration: '60 minutos',
    members: 5,
    description: 'Tradición y potencia vocal femenina con trajes charros bordados para bodas, serenatas de ensueño y mañanitas.',
    category: 'ESPECIALIDAD',
    rider: 'Bose F1 Model 812 + 5 micrófonos Shure inalámbricos + XR18',
    wattsPerPax: 12,
    minGrossMargin: 0.58,
    split: { artist: 0.80, platform: 0.10, vimume: 0.10 }
  },
  {
    id: 'discomovil-bose-f1',
    name: 'Discomóvil Bose F1 Pro & DJ Live Set',
    basePrice: 450,
    duration: '4 horas continuas',
    members: 1,
    description: 'DJ Set profesional con columnas Bose F1 812, microfonía Shure Axient RF, robótica DMX y barra de sonido 12 W/pax.',
    category: 'TECNICA',
    rider: 'Columnas Bose F1 812 (1.000W) + Subwoofer F1 + Cabina DJ Pioneer CDJ',
    wattsPerPax: 12,
    minGrossMargin: 0.65,
    split: { artist: 0.80, platform: 0.10, vimume: 0.10 }
  },
  {
    id: 'duo-clasico-ceremonia',
    name: 'Dúo Clásico de Ceremonia',
    basePrice: 380,
    duration: '60 minutos',
    members: 2,
    description: 'Voz lírica y piano clásico con repertorio litúrgico y clásico universal para momentos solemnes y ceremonias religiosas/civiles.',
    category: 'CAMARA',
    rider: 'Teclado Nord Stage / Piano acústico + Shure Beta 87A + Bose S1 Pro',
    wattsPerPax: 10,
    minGrossMargin: 0.60,
    split: { artist: 0.80, platform: 0.10, vimume: 0.10 }
  },
  {
    id: 'saxo-lounge-exclusive',
    name: 'Saxo Lounge & Deep Ambient',
    basePrice: 400,
    duration: '90 minutos',
    members: 1,
    description: 'Saxofón en vivo sobre bases electrónicas lounge/chillout para cócteles de lujo, sunsets y recepciones VIP.',
    category: 'ESPECIALIDAD',
    rider: 'Saxofón con pinza inalámbrica Shure Beta 98H/C + Bose S1 Pro autónomo',
    wattsPerPax: 10,
    minGrossMargin: 0.68,
    split: { artist: 0.80, platform: 0.10, vimume: 0.10 }
  },
  {
    id: 'flamenco-pop-fusion',
    name: 'Flamenco Pop Fusión',
    basePrice: 650,
    duration: '90 minutos',
    members: 4,
    description: 'Fusión de pop español y raíz flamenca con palmas, guitarra española de concierto, cajón y voz desgarrada.',
    category: 'ESPECIALIDAD',
    rider: 'Bose F1 Model 812 + XR18 + Microfonía Shure Beta 87A + D.I. Radial',
    wattsPerPax: 12,
    minGrossMargin: 0.58,
    split: { artist: 0.80, platform: 0.10, vimume: 0.10 }
  },
  {
    id: 'coro-rociero-gala',
    name: 'Coro Rociero de Gala',
    basePrice: 800,
    duration: '75 minutos',
    members: 8,
    description: 'Ensamble de voces rocieras, guitarras y percusión tradicional para ceremonias, romerías y actos solemnes al aire libre.',
    category: 'ESPECIALIDAD',
    rider: 'Sistema PA Bose F1 dual + 6 micrófonos Shure para masa coral',
    wattsPerPax: 12,
    minGrossMargin: 0.58,
    split: { artist: 0.80, platform: 0.10, vimume: 0.10 }
  }
];

export const PRICING_CATALOG: Record<string, FormatPricing> = {
  ...Object.fromEntries(SCLASS_ROSTER_14_FORMATS.map(f => [f.id, f])),
  // Alias legacy para retrocompatibilidad total
  'clasico-esencial': SCLASS_ROSTER_14_FORMATS[0],
  'premium-gala': SCLASS_ROSTER_14_FORMATS[3],
  'cuarteto-gala': SCLASS_ROSTER_14_FORMATS[3],
  'quinteto-honor': SCLASS_ROSTER_14_FORMATS[4],
  'solista': SCLASS_ROSTER_14_FORMATS[0],
  'duo': SCLASS_ROSTER_14_FORMATS[1],
  'trio': SCLASS_ROSTER_14_FORMATS[2],
  'cuarteto': SCLASS_ROSTER_14_FORMATS[3],
  'quinteto': SCLASS_ROSTER_14_FORMATS[4],
  'gran-ensamble': SCLASS_ROSTER_14_FORMATS[5],
  'sinfonico-royal': {
    id: 'sinfonico-royal',
    name: 'Gran Concierto S-Class Royal',
    basePrice: 1800,
    duration: 'Espectáculo Completo',
    members: 12,
    description: 'Sinfónica del Colibrí, grabación 4K e ingeniero sónico dedicado.',
    category: 'ENSAMBLE',
    rider: 'Doble Columna Bose F1 + Microfonía Shure Axient RF',
    wattsPerPax: 18,
    minGrossMargin: 0.58,
    split: { artist: 0.80, platform: 0.10, vimume: 0.10 }
  },
  'octeto-magistral': {
    id: 'octeto-magistral',
    name: 'Octeto Magistral de Gran Gala',
    basePrice: 2400,
    duration: 'Espectáculo Completo',
    members: 8,
    description: 'Formación Ampliada de Cuerdas & Viento (8 Integrantes)',
    category: 'ENSAMBLE',
    rider: 'Sistema Bose F1 + Consola Behringer XR18',
    wattsPerPax: 18,
    minGrossMargin: 0.58,
    split: { artist: 0.80, platform: 0.10, vimume: 0.10 }
  },
  'banda-monumental': {
    id: 'banda-monumental',
    name: 'Banda Monumental',
    basePrice: 4500,
    duration: 'Espectáculo Completo',
    members: 16,
    description: 'Espectáculo Audiovisual Masivo (12-16 Artistas)',
    category: 'ENSAMBLE',
    rider: 'Line Array Bose F1 Model 812 + Subwoofers duales 18" + Iluminación DMX',
    wattsPerPax: 20,
    minGrossMargin: 0.58,
    split: { artist: 0.80, platform: 0.10, vimume: 0.10 }
  },
  'boda-diamond': {
    id: 'boda-diamond',
    name: 'Boda S-Class Diamond 360',
    basePrice: 3800,
    duration: 'Jornada Completa 360 (Ceremonia, Cóctel y Baile)',
    members: 5,
    description: 'Sonorización integral de 3 espacios a 12-18 W/pax con actuación central de Edwin Agudelo y discomóvil Bose F1.',
    category: 'ESPECIALIDAD',
    rider: 'Triple zona Bose F1 + Shure Axient RF + XR18 + Robótica DMX',
    wattsPerPax: 18,
    minGrossMargin: 0.58,
    split: { artist: 0.80, platform: 0.10, vimume: 0.10 }
  }
};
