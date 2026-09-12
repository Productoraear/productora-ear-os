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
    name: 'Show Solista Premium (Edwin Agudelo)',
    basePrice: 350,
    duration: '60 min (2 salidas de 30 min)',
    members: 1,
    description: 'Cantante y compositor en directo con pistas profesionales de máxima calidad y sonido Bose 2.000W. Incluye pack experiencial de complementos: photocall temático con sombreros charros, sesión de fotos de recuerdo en las mesas, ramo de flores de cortesía y dedicatoria personalizada.',
    category: 'SOLISTA',
    rider: 'Bose F1 Model 812 / Bose S1 Pro (2.000W) + Shure Beta 87A + Pistas Master',
    wattsPerPax: 12,
    minGrossMargin: 0.62,
    split: { artist: 0.80, platform: 0.10, vimume: 0.10 }
  },
  {
    id: 'grupo-6-mariachi',
    name: 'Show Agrupación Mariachi (6 Músicos)',
    basePrice: 600,
    duration: '60 minutos continuos',
    members: 6,
    description: 'Edwin Agudelo acompañado de 5 músicos de alto nivel en vivo (trompeta, vihuela, guitarrón, violín). Sonido acústico y amplificado profesional en directo. La fuerza del mariachi puro en escena sin necesidad de atrezzo artificial.',
    category: 'ENSAMBLE',
    rider: 'Line Array Bose F1 Model 812 + Microfonía Shure + Mezcla Digital',
    wattsPerPax: 12,
    minGrossMargin: 0.58,
    split: { artist: 0.80, platform: 0.10, vimume: 0.10 }
  },
  {
    id: 'grupo-9-mariachi-pro',
    name: 'Show Agrupación Profesional (9 Músicos)',
    basePrice: 900,
    duration: '60 minutos de gala',
    members: 9,
    description: 'Formato profesional completo: Edwin Agudelo junto a 8 músicos de conservatorio y gira (sección ampliada de metales y cuerdas). Catarsis y despliegue sonoro de gran mariachi para bodas y galas de alta exigencia.',
    category: 'ENSAMBLE',
    rider: 'Bose F1 Model 812 dual + Subwoofer F1 + XR18 Midas + Microfonía Shure',
    wattsPerPax: 14,
    minGrossMargin: 0.58,
    split: { artist: 0.80, platform: 0.10, vimume: 0.10 }
  },
  {
    id: 'grupo-13-mariachi-premium',
    name: 'Show Gran Ensamble Monumental (13 Músicos)',
    basePrice: 1300,
    duration: '60 min (2 salidas de 30 min)',
    members: 13,
    description: 'El máximo estándar de la música mexicana en España: Edwin Agudelo + 12 músicos en escena. Dos salidas de 30 minutos para adaptarse al protocolo nupcial o institucional. Exclusividad absoluta de fecha por parte del artista.',
    category: 'ENSAMBLE',
    rider: 'Sistema PA Line Array Bose F1 dual + Consola Digital + Monitoreo In-Ear',
    wattsPerPax: 18,
    minGrossMargin: 0.58,
    split: { artist: 0.80, platform: 0.10, vimume: 0.10 }
  }
];

export const PRICING_CATALOG: Record<string, FormatPricing> = {
  ...Object.fromEntries(SCLASS_ROSTER_14_FORMATS.map(f => [f.id, f])),
  // Alias directos de los 4 formatos oficiales
  'solista': SCLASS_ROSTER_14_FORMATS[0],
  'clasico-esencial': SCLASS_ROSTER_14_FORMATS[0],
  'grupo-6': SCLASS_ROSTER_14_FORMATS[1],
  'quinteto-gala-mariachi': SCLASS_ROSTER_14_FORMATS[1],
  'grupo-9': SCLASS_ROSTER_14_FORMATS[2],
  'grupo-13': SCLASS_ROSTER_14_FORMATS[3],
  'gran-ensamble': SCLASS_ROSTER_14_FORMATS[3],
  'premium-gala': SCLASS_ROSTER_14_FORMATS[3],
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
