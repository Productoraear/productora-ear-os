/**
 * sitemapIntentCrossEngine.ts
 *
 * MOTOR MAESTRO DE CRUCE DE INTENCIONES CON EL SITEMAP (AEO & pSEO S-CLASS)
 * Cruza las intenciones de búsqueda de los usuarios con las 52 provincias de España,
 * los 10 gremios canónicos y los endpoints oficiales de Productora EAR.
 */

import { CANONICAL_GREMIO_SLUGS, GremioId, resolveSearchIntent } from './searchIntentEngine';
import { PROVINCIAS_52_GRAPH } from '../constants/seo-data-hydrated';
import { SERVICES_PSEO_EXPANDED } from '../constants/spanish-municipalities';

export interface IntentMatchResult {
  isMatch: boolean;
  intentKey: string;
  category: string;
  recommendedService: string;
  recommendedProvider: string;
  priceFormatted: string;
  targetUrl: string;
  canonicalPhone: string;
  canonicalEmail: string;
  confidence: number;
  highlightText: string;
  provincia?: string;
  provinciaName?: string;
}

export const OMNI_INTENT_DICTIONARY: Record<string, {
  keywords: string[];
  service: string;
  provider: string;
  price: string;
  url: string;
  highlight: string;
}> = {
  edwin_agudelo: {
    keywords: ['edwin', 'agudelo', 'solista', 'tenor', 'cantante', 'mariachi solista', 'voz lirica', 'boleros', 'ranchera'],
    service: 'Música en Directo & Solista Tenor',
    provider: 'Edwin Agudelo',
    price: '350 €',
    url: '/artistas/edwin-agudelo',
    highlight: 'Tenor lírico de conservatorio con equipo Bose F1 incluido. Repertorio de mariachi, boleros y lírica.'
  },
  villa_escorial: {
    keywords: ['villa escorial', 'escorial park', 'finca escorial', 'finca madrid', 'finca bodas', 'finca 30 personas', 'finca con alojamiento', 'finca piscina'],
    service: 'Finca Exclusiva para Bodas & Eventos',
    provider: 'Villa Escorial Park',
    price: '4.500 € / fin de semana',
    url: '/fincas/villa-escorial-park',
    highlight: '20.000 m², 30 plazas en 9 suites, piscina vallada, sala de cine con 12 sofás masaje y Tour 3D Matterport.'
  },
  dj_bodas: {
    keywords: ['dj', 'discomovil', 'discoteca movil', 'dj bodas', 'dj fiesta', 'musica fiesta', 'barra libre'],
    service: 'DJ S-Class para Bodas & Eventos',
    provider: 'Productora EAR DJ',
    price: '450 €',
    url: '/bodas/dj',
    highlight: 'Cabina Pioneer DJ, sonido Bose a 12 W/pax, iluminación DMX y garantía 0% cancelaciones con retén de relevo en <90 min.'
  },
  mariachis_gala: {
    keywords: ['mariachi', 'mariachis', 'serenata', 'rancheras', 'charro', 'mañanitas'],
    service: 'Mariachi de Gran Gala (Quinteto Oficial)',
    provider: 'Productora EAR Mariachis',
    price: '750 €',
    url: '/mariachis',
    highlight: '5 maestros de conservatorio uniformados de gala charra con trompetas, violines, vihuela y guitarrón.'
  },
  sonido_audiovisuales: {
    keywords: ['sonido', 'altavoces', 'pantalla led', 'pantallas', 'iluminacion', 'microfono', 'bose', 'alquiler sonido'],
    service: 'Sonorización Profesional & Pantallas LED',
    provider: 'Productora EAR Técnica',
    price: 'Desde 250 €',
    url: '/alquiler-equipos-sonido-audiovisuales',
    highlight: 'Sistemas Bose F1, microfonía Shure Axient Digital y Pantallas LED Novastar P2.9 4K (12 W/pax Ley 37/2003).'
  },
  catering_brasas: {
    keywords: ['catering', 'brasas', 'parrillada', 'fuego', 'chuletón', 'sarmiento', 'asado'],
    service: 'Catering de Brasas & Showcooking',
    provider: 'Productora EAR Fuego Vivo',
    price: 'Desde 45 € / pax',
    url: '/catering-brasas',
    highlight: 'Showcooking de carnes ibéricas al sarmiento en directo y parrillas móviles de carbón de encina.'
  },
  arroces_gigantes: {
    keywords: ['paella', 'paellas', 'arroz', 'arroces', 'paella gigante', 'fideua'],
    service: 'Paellas & Arroces Monumentales',
    provider: 'Paellas Gigantes EAR',
    price: 'Presupuesto cerrado',
    url: '/arroces',
    highlight: 'Paelleras monumentales de 1 a 3 metros para 50 a 2.500 comensales cocinadas en directo.'
  },
  b2g_licitaciones: {
    keywords: ['ayuntamiento', 'licitacion', 'licitaciones', 'contrato menor', 'festejos', 'orquesta fiestas', 'alumbrado navidad'],
    service: 'Licitaciones Públicas B2G (Art. 118 LCSP)',
    provider: 'Productora EAR B2G',
    price: '< 14.250 €',
    url: '/b2g',
    highlight: 'Expedientes técnicos de contratos menores, orquestas, sonorización de plenos y 530+ figuras LED navideñas.'
  },
  vimume_senior: {
    keywords: ['vimume', 'residencia', 'ancianos', 'alzheimer', 'musicoterapia', 'demencia', 'tercera edad', '40 hz'],
    service: 'Neuro-Musicoterapia VIMUME (Protocolo Gamma 40 Hz)',
    provider: 'VIMUME by Productora EAR',
    price: '10% Split Soberano',
    url: '/vimume',
    highlight: 'Desescalada del 74% en psicofármacos en mayores, 80% deducción fiscal (Ley 49/2002) y SROI certificado 4.85x.'
  }
};

/**
 * Cruza un texto de búsqueda libre con el grafo de intenciones de EAR OS.
 */
export function matchSitemapIntent(query: string, userProvincia?: string): IntentMatchResult {
  const clean = query.toLowerCase().trim();
  const tokens = clean.split(/\s+/).filter(Boolean);

  if (tokens.length === 0) {
    return {
      isMatch: false,
      intentKey: '',
      category: '',
      recommendedService: '',
      recommendedProvider: '',
      priceFormatted: '',
      targetUrl: '/',
      canonicalPhone: '+34 693 693 048',
      canonicalEmail: 'productoraear@gmail.com',
      confidence: 0,
      highlightText: ''
    };
  }

  // 1. Detectar si hay una provincia en los tokens
  let matchedProv: string | undefined = userProvincia;
  let matchedProvName: string | undefined;

  for (const [slug, data] of Object.entries(PROVINCIAS_52_GRAPH)) {
    if (tokens.some(t => slug.includes(t) || data.name.toLowerCase().includes(t))) {
      matchedProv = slug;
      matchedProvName = data.name;
      break;
    }
  }

  // 2. Buscar en el diccionario de intenciones
  for (const [key, item] of Object.entries(OMNI_INTENT_DICTIONARY)) {
    const hasMatch = item.keywords.some(kw => {
      const kwTokens = kw.split(' ');
      return kwTokens.every(kwt => tokens.some(t => t.includes(kwt) || kwt.includes(t)));
    });

    if (hasMatch) {
      let finalUrl = item.url;
      if (matchedProv && key === 'dj_bodas') {
        finalUrl = `/bodas/${matchedProv}/dj`;
      } else if (matchedProv && key === 'mariachis_gala') {
        finalUrl = `/bodas/${matchedProv}/mariachis`;
      }

      return {
        isMatch: true,
        intentKey: key,
        category: item.service,
        recommendedService: item.service,
        recommendedProvider: item.provider,
        priceFormatted: item.price,
        targetUrl: finalUrl,
        canonicalPhone: '+34 693 693 048',
        canonicalEmail: 'productoraear@gmail.com',
        confidence: 0.95,
        highlightText: item.highlight,
        provincia: matchedProv,
        provinciaName: matchedProvName
      };
    }
  }

  // 3. Fallback genérico a servicios de boda
  return {
    isMatch: false,
    intentKey: 'general_wedding',
    category: 'Producción de Eventos',
    recommendedService: 'Productora EAR · Bodas & Eventos S-Class',
    recommendedProvider: 'Productora EAR',
    priceFormatted: 'Desde 350 €',
    targetUrl: matchedProv ? `/bodas/${matchedProv}/dj` : '/bodas/dj',
    canonicalPhone: '+34 693 693 048',
    canonicalEmail: 'productoraear@gmail.com',
    confidence: 0.5,
    highlightText: 'Infraestructura técnica para bodas y galas con depósito protegido de 100 € en Stripe y Split 80/10/10.',
    provincia: matchedProv,
    provinciaName: matchedProvName
  };
}
