/**
 * ════════════════════════════════════════════════════════════════════════════
 * SOVEREIGN DOMAIN REGISTRY — ENRUTAMIENTO Y AISLAMIENTO MULTI-DOMINIO (S-CLASS)
 * ════════════════════════════════════════════════════════════════════════════
 * Gobierna las 4 unidades de negocio independientes sobre el mismo cerebro SSOT:
 *  1. fincasparaboda.com            -> Fincas, banquetes, caterings y directorio nupcial
 *  2. viajemusicalporlamemoria.com  -> VIMUME, centros senior, neuroacústica 40Hz y B2G
 *  3. artistaseuropa.com            -> Red de artistas, mariachis, orquestas y músicos pro
 *  4. productoraear.com             -> Hub maestro de producción técnica y audiovisual
 *
 * CANDADOS Y DOCTRINA (AGENTS.md §10, §11 & §14):
 *  - 0 menciones a marcas de terceros (JUR-4: cero portales o apps de transporte).
 *  - Aislamiento de fallo: circuit-breaker independiente por vertical (si una
 *    vertical entra en mantenimiento, las otras 3 siguen facturando).
 *  - Cero 'any', 100% tipado estricto TypeScript 5.8.
 *  - El peaje telefónico siempre se deriva del SSOT (CENTRALITA_EAR_OS).
 * ════════════════════════════════════════════════════════════════════════════
 */

import { CENTRALITA_EAR_OS } from '@/lib/constants/ear-os-ssot';

export type SovereignDomainId =
  | 'fincasparaboda'
  | 'vimume'
  | 'artistaseuropa'
  | 'productoraear';

export type SovereignVerticalType =
  | 'fincas_bodas'
  | 'vimume_senior_b2g'
  | 'artistas_musica'
  | 'productora_master';

export type DomainHealthStatus = 'operational' | 'maintenance' | 'degraded';

export interface SovereignDomainConfig {
  readonly id: SovereignDomainId;
  readonly vertical: SovereignVerticalType;
  readonly primaryHost: string;
  readonly aliases: readonly string[];
  readonly name: string;
  readonly brandHeadline: string;
  readonly defaultTitle: string;
  readonly conciergePhone: string;
  readonly themeAccent: string;
  readonly defaultHomePath: string;
  readonly allowedPublicPrefixes: readonly string[];
  readonly allowedCategories: readonly string[];
  readonly status: DomainHealthStatus;
  readonly maintenanceNotice: string;
}

export const SOVEREIGN_DOMAINS: Readonly<Record<SovereignDomainId, SovereignDomainConfig>> = Object.freeze({
  fincasparaboda: {
    id: 'fincasparaboda',
    vertical: 'fincas_bodas',
    primaryHost: 'fincasparaboda.com',
    aliases: Object.freeze(['www.fincasparaboda.com', 'fincas.localhost']),
    name: 'Fincas Para Boda :: Red de Espacios Homologados',
    brandHeadline: 'Directorio Exclusivo de Fincas, Palacios y Restaurantes para Bodas',
    defaultTitle: 'Fincas para Bodas, Espacios Singulares y Banquetes Homologados',
    conciergePhone: CENTRALITA_EAR_OS,
    themeAccent: '#ecb613',
    defaultHomePath: '/fincas',
    allowedPublicPrefixes: Object.freeze([
      '/',
      '/fincas',
      '/otzarreta',
      '/proveedores',
      '/directorio',
      '/calculadora',
      '/presupuesto',
      '/checkout',
      '/contacto',
      '/reservar',
      '/terminos',
      '/privacidad',
      '/aviso-legal',
      '/confianza',
    ]),
    allowedCategories: Object.freeze([
      'fincas',
      'restaurantes',
      'catering',
      'fotografos',
      'wedding-planners',
      'espacios',
      'decoracion',
    ]),
    status: 'operational',
    maintenanceNotice: 'Fincas Para Boda en optimización técnica. La Conserjería oficial sigue operativa por WhatsApp.',
  },

  vimume: {
    id: 'vimume',
    vertical: 'vimume_senior_b2g',
    primaryHost: 'viajemusicalporlamemoria.com',
    aliases: Object.freeze(['www.viajemusicalporlamemoria.com', 'vimume.localhost']),
    name: 'VIMUME :: Viaje Musical por la Memoria',
    brandHeadline: 'Neuroacústica 40Hz, Terapias No Farmacológicas y Programas B2G para Mayores',
    defaultTitle: 'VIMUME :: Impacto Clínico, Neuro-musicoterapia y Licitaciones Sociales',
    conciergePhone: CENTRALITA_EAR_OS,
    themeAccent: '#00E5FF',
    defaultHomePath: '/vimume',
    allowedPublicPrefixes: Object.freeze([
      '/',
      '/vimume',
      '/contacto',
      '/presupuesto',
      '/terminos',
      '/privacidad',
      '/aviso-legal',
      '/confianza',
    ]),
    allowedCategories: Object.freeze([
      'centros-senior',
      'residencias',
      'ayuntamientos',
      'terapias-neuroacusticas',
      'impacto-social',
    ]),
    status: 'operational',
    maintenanceNotice: 'Portal VIMUME en actualización clínica. Atención institucional directa en centralita.',
  },

  artistaseuropa: {
    id: 'artistaseuropa',
    vertical: 'artistas_musica',
    primaryHost: 'artistaseuropa.com',
    aliases: Object.freeze(['www.artistaseuropa.com', 'artistas.localhost']),
    name: 'Artistas Europa :: Contratación Musical Directa',
    brandHeadline: 'Red Soberana de Músicos, Solistas de Gala, Mariachis y Orquestas Populares',
    defaultTitle: 'Artistas Europa :: Contratación Musical sin Intermediarios · Split 80/10/10',
    conciergePhone: CENTRALITA_EAR_OS,
    themeAccent: '#FF2B44',
    defaultHomePath: '/artistas',
    allowedPublicPrefixes: Object.freeze([
      '/',
      '/artistas',
      '/reservar',
      '/checkout',
      '/contacto',
      '/presupuesto',
      '/terminos',
      '/privacidad',
      '/aviso-legal',
      '/confianza',
    ]),
    allowedCategories: Object.freeze([
      'solistas',
      'mariachis',
      'orquestas',
      'duetos',
      'djs',
      'clasica',
      'flamenco',
      'jazz',
    ]),
    status: 'operational',
    maintenanceNotice: 'Centralita de Artistas Europa en calibración de agendas. Despacho urgente disponible por WhatsApp.',
  },

  productoraear: {
    id: 'productoraear',
    vertical: 'productora_master',
    primaryHost: 'productoraear.com',
    aliases: Object.freeze([
      'www.productoraear.com',
      'localhost',
      'localhost:3007',
      '127.0.0.1',
      '127.0.0.1:3007',
      '82.29.179.172:8000',
      'productora-ear-os',
    ]),
    name: 'Productora EAR :: Producción Técnica & Master Hub',
    brandHeadline: 'Producción Audiovisual Integral, Sonorización S-Class y Licitaciones Públicas',
    defaultTitle: 'Productora EAR :: Alquiler de Audiovisuales, Bodas & Eventos B2G',
    conciergePhone: CENTRALITA_EAR_OS,
    themeAccent: '#ecb613',
    defaultHomePath: '/',
    allowedPublicPrefixes: Object.freeze([
      '/',
      '/fincas',
      '/artistas',
      '/vimume',
      '/otzarreta',
      '/proveedores',
      '/directorio',
      '/calculadora',
      '/reservar',
      '/presupuesto',
      '/checkout',
      '/contacto',
      '/terminos',
      '/privacidad',
      '/aviso-legal',
      '/confianza',
    ]),
    allowedCategories: Object.freeze([
      'audiovisuales',
      'iluminacion',
      'sonido',
      'pantallas-led',
      'escenarios',
      'fincas',
      'artistas',
      'vimume',
    ]),
    status: 'operational',
    maintenanceNotice: 'EAR OS Master Hub en mantenimiento preventivo. Canales de contingencia activos.',
  },
});

/**
 * Resuelve la configuración soberana a partir de la cabecera Host del cliente.
 * Si el Host no coincide exactamente con ningún dominio ni alias, degrada de
 * forma segura al Master Hub (`productoraear`).
 */
export function resolveVerticalFromHost(rawHost: string | null | undefined): SovereignDomainConfig {
  if (!rawHost) return SOVEREIGN_DOMAINS.productoraear;

  const normalizedHost: string = rawHost.toLowerCase().trim().replace(/:\d+$/, '');

  for (const config of Object.values(SOVEREIGN_DOMAINS)) {
    if (config.primaryHost === normalizedHost) {
      return config;
    }
    for (const alias of config.aliases) {
      const normalizedAlias = alias.replace(/:\d+$/, '').toLowerCase();
      if (normalizedAlias === normalizedHost) {
        return config;
      }
    }
  }

  // Comprobación de prefijo / subdominio heurístico para entornos de staging o tunnels
  if (normalizedHost.includes('fincas')) return SOVEREIGN_DOMAINS.fincasparaboda;
  if (normalizedHost.includes('viajemusical') || normalizedHost.includes('vimume')) return SOVEREIGN_DOMAINS.vimume;
  if (normalizedHost.includes('artista')) return SOVEREIGN_DOMAINS.artistaseuropa;

  return SOVEREIGN_DOMAINS.productoraear;
}

/**
 * Determina si una ruta pública solicitada está autorizada para la vertical activa.
 * Las rutas internas del sistema (`/api/*`, `/_next/*`, `/admin/*`, etc.) siempre
 * están autorizadas para garantizar telemetría, estáticos y administración.
 */
export function isPathAllowedForVertical(
  config: SovereignDomainConfig,
  pathname: string,
): boolean {
  // 1. Prefijos universales de infraestructura y administración (siempre permitidos)
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/command-center') ||
    pathname.startsWith('/login') ||
    pathname === '/favicon.ico' ||
    pathname === '/robots.txt' ||
    pathname === '/sitemap.xml'
  ) {
    return true;
  }

  // 2. En el Master Hub ('productoraear') todas las rutas son válidas
  if (config.id === 'productoraear') {
    return true;
  }

  // 3. Verificación exacta o por prefijo de ruta permitida en la vertical
  return config.allowedPublicPrefixes.some((prefix) => {
    if (prefix === '/') return pathname === '/';
    return pathname === prefix || pathname.startsWith(`${prefix}/`);
  });
}

/**
 * Validador de Circuit-Breaker por vertical.
 * Permite aislar y apagar una unidad de negocio comprometida sin interrumpir las demás.
 */
export function checkVerticalCircuitBreaker(config: SovereignDomainConfig): {
  readonly operational: boolean;
  readonly notice?: string;
} {
  if (config.status === 'operational') {
    return { operational: true };
  }

  return {
    operational: false,
    notice: config.maintenanceNotice,
  };
}

