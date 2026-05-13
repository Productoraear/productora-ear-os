/**
 * 🛰️ S-CLASS MULTIVARIATE ENGINE - V146
 * Algoritmo de Hash Determinista para Diversificación Territorial.
 */

export type SClassTemplate = 'AURA_ONYX' | 'KINETIC_GOLD' | 'INSTITUTIONAL_BLUE' | 'MINIMAL_GLASS';

/**
 * Convierte un string (provincia) en un índice determinista para asignar un diseño S-Class.
 * Esto garantiza consistencia SEO (misma URL = mismo diseño) sin persistencia en DB.
 */
export function getTemplateForProvince(province: string): SClassTemplate {
  const templates: SClassTemplate[] = ['AURA_ONYX', 'KINETIC_GOLD', 'INSTITUTIONAL_BLUE', 'MINIMAL_GLASS'];
  
  // Hash simple basado en la suma de caracteres
  const hash = province.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  return templates[hash % templates.length];
}

/**
 * Devuelve el copy y estilos específicos para cada variante del motor multivariante.
 */
export function getTemplateConfig(template: SClassTemplate, location: string) {
  const configs = {
    AURA_ONYX: {
      accentColor: '#d4a855',
      copy: `Protocolo Supremo y Dominancia en ${location}. La élite de la producción artística bajo el estándar EAR GOLD.`,
      tagline: 'Sovereign Authority',
      gradient: 'from-[#d4a855]/20'
    },
    KINETIC_GOLD: {
      accentColor: '#ffcc00',
      copy: `High Energy & Entertainment Elite en ${location}. Vibración cinética y sistemas de impacto masivo.`,
      tagline: 'Kinetic Performance',
      gradient: 'from-yellow-500/20'
    },
    INSTITUTIONAL_BLUE: {
      accentColor: '#3b82f6',
      copy: `Valor Social Bonificable VIMUME en ${location}. Infraestructura cultural y protocolo institucional transparente.`,
      tagline: 'Institutional Excellence',
      gradient: 'from-blue-600/20'
    },
    MINIMAL_GLASS: {
      accentColor: '#ffffff',
      copy: `La Excelencia para Fincas y Bodas en ${location}. Estética minimalista y sofisticación sonora de alta gama.`,
      tagline: 'Pure Elegance',
      gradient: 'from-white/10'
    }
  };
  
  return configs[template];
}
