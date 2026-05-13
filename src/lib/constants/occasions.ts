/**
 * 💍 OCCASIONS SSOT - S-CLASS INTENT CLUSTERING
 * Purpose: Centralized contract for occasion hubs.
 */

export interface OccasionConfig {
  slug: string;
  title: string;
  intent: string;
  primaryServices: string[];
  seoTitle: string;
  seoDescription: string;
  schemaType: 'Event' | 'Organization' | 'Service';
  canonicalPath: string;
  accentColor: string;
  gradient: string;
}

export const OCCASIONS_MAP: Record<string, OccasionConfig> = {
  'bodas': {
    slug: 'bodas',
    title: 'Bodas de Lujo y Galas Nupciales',
    intent: 'NUPCIAL_PREMIUM',
    primaryServices: ['mariachi-gala', 'solista-premium', 'sonorizacion-eventos'],
    seoTitle: 'Bodas de Lujo España | Música y Producción S-Class EAR GOLD',
    seoDescription: 'Orquestación de bodas exclusivas. Mariachis de gala, solistas premium y sistemas de impacto sónico diseñados por Edwin Agudelo.',
    schemaType: 'Event',
    canonicalPath: '/ocasiones/bodas',
    accentColor: '#d4a855',
    gradient: 'from-[#d4a855]/20'
  },
  'corporativo': {
    slug: 'corporativo',
    title: 'Eventos Corporativos y Convenciones',
    intent: 'B2B_HIGH_GRAVITY',
    primaryServices: ['produccion-audiovisual', 'iluminacion-espectacular', 'banda-monumental'],
    seoTitle: 'Eventos Corporativos S-Class | Producción Audiovisual y B2B España',
    seoDescription: 'Infraestructura de dominancia para convenciones y galas corporativas. Ingeniería de eventos y tecnología audiovisual de vanguardia.',
    schemaType: 'Organization',
    canonicalPath: '/ocasiones/corporativo',
    accentColor: '#3b82f6',
    gradient: 'from-blue-600/20'
  },
  'ayuntamientos': {
    slug: 'ayuntamientos',
    title: 'Protocolos Institucionales y B2G',
    intent: 'B2G_SOVEREIGN',
    primaryServices: ['banda-monumental', 'innovacion-social', 'show-cantando-a-caballo'],
    seoTitle: 'Producción para Ayuntamientos B2G | Impacto Social VIMUME EAR GOLD',
    seoDescription: 'Sistemas de producción para entidades públicas. Protocolos bonificados por el programa VIMUME e impacto social garantizado.',
    schemaType: 'Service',
    canonicalPath: '/ocasiones/ayuntamientos',
    accentColor: '#ef4444',
    gradient: 'from-red-600/20'
  },
  'ferias': {
    slug: 'ferias',
    title: 'Grandes Formatos, Ferias y Fiestas',
    intent: 'MASSIVE_IMPACT',
    primaryServices: ['banda-monumental', 'sonorizacion-eventos', 'iluminacion-espectacular'],
    seoTitle: 'Producción de Ferias y Fiestas | Espectáculos de Gran Formato España',
    seoDescription: 'Dominancia escénica para recintos feriales y fiestas patronales. Despliegue de infraestructura masiva y talento certificado.',
    schemaType: 'Event',
    canonicalPath: '/ocasiones/ferias',
    accentColor: '#8b5cf6',
    gradient: 'from-purple-600/20'
  }
};

export const getAllOccasions = () => Object.values(OCCASIONS_MAP);
export const getOccasionBySlug = (slug: string) => OCCASIONS_MAP[slug];
