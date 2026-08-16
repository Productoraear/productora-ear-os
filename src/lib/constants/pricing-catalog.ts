// src/lib/constants/pricing-catalog.ts
export interface FormatPricing {
  id: string;
  name: string;
  basePrice: number;
  duration: string;
  members: number;
  description: string;
}

export const PRICING_CATALOG: Record<string, FormatPricing> = {
  'clasico-esencial': {
    id: 'clasico-esencial',
    name: 'Show Clásico Esencial',
    basePrice: 350,
    duration: '45 minutos',
    members: 5,
    description: 'Formación estándar para celebraciones íntimas y homenajes.'
  },
  'premium-gala': {
    id: 'cuarteto-gala', // Alias alineado con query param
    name: 'Espectáculo Premium Gala',
    basePrice: 750,
    duration: '90 minutos (2 pases)',
    members: 8,
    description: 'Trajes de gala bordados, microfonía premium y repertorio libre.'
  },
  'cuarteto-imperial': {
    id: 'cuarteto-imperial',
    name: 'Mariachi Cuarteto Imperial',
    basePrice: 950,
    duration: '60 minutos',
    members: 4,
    description: '2 Trompetas, Vihuela y Guitarrón de alta fidelidad.'
  },
  'quinteto-honor': {
    id: 'quinteto-honor',
    name: 'Quinteto de Honor con Violín',
    basePrice: 1250,
    duration: 'Espectáculo Completo',
    members: 5,
    description: 'Sección de Cuerda & Voz Lírica (5 Integrantes)'
  },
  'sinfonico-royal': {
    id: 'sinfonico-royal',
    name: 'Gran Concierto S-Class Royal',
    basePrice: 1800,
    duration: 'Espectáculo Completo',
    members: 12,
    description: 'Sinfónica del Colibrí, grabación 4K e ingeniero sónico dedicado.'
  },
  'octeto-magistral': {
    id: 'octeto-magistral',
    name: 'Octeto Magistral de Gran Gala',
    basePrice: 2400,
    duration: 'Espectáculo Completo',
    members: 8,
    description: 'Formación Ampliada de Cuerdas & Viento (8 Integrantes)'
  },
  'banda-monumental': {
    id: 'banda-monumental',
    name: 'Banda Monumental',
    basePrice: 4500,
    duration: 'Espectáculo Completo',
    members: 16,
    description: 'Espectáculo Audiovisual Masivo (12-16 Artistas)'
  }
};
