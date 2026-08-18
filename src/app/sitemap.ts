import { MetadataRoute } from 'next';
import { PROVINCIAS, OCASIONES, GUIAS } from '@/lib/constants/seo-data';
import { HIGH_VALUE_VARIANTS } from '@/lib/artists/matrix';

const now = new Date();
const baseUrl = 'https://www.productoraear.com';

const unique = <T extends { url: string }>(items: T[]) => {
  const seen = new Set<string>();
  return items.filter(i => (seen.has(i.url) ? false : (seen.add(i.url), true)));
};

/**
 * 🗺️ SITEMAP SOBERANO CANÓNICO (EAR OS V2 - S-CLASS REBUILD)
 * Genera exclusivamente URLs canónicas vivas y saneadas para erradicar la fragmentación de Crawl Budget.
 * Prioridad 0.80 - 1.00 y frecuencia weekly en los pilares estratégicos de conversión.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  // 1. NÚCLEO SOBERANO & NODOS DE ALTA CONVERSIÓN
  const corePages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: now, priority: 1.0, changeFrequency: 'daily' },
    { url: `${baseUrl}/artistas/edwin-agudelo`, lastModified: now, priority: 1.0, changeFrequency: 'daily' },
    { url: `${baseUrl}/cotizador`, lastModified: now, priority: 0.95, changeFrequency: 'weekly' },
    { url: `${baseUrl}/academia`, lastModified: now, priority: 0.90, changeFrequency: 'weekly' },
    { url: `${baseUrl}/servicios`, lastModified: now, priority: 0.90, changeFrequency: 'weekly' },
    { url: `${baseUrl}/arsenal`, lastModified: now, priority: 0.90, changeFrequency: 'weekly' },
    { url: `${baseUrl}/presupuesto`, lastModified: now, priority: 0.90, changeFrequency: 'weekly' },
    { url: `${baseUrl}/artistas`, lastModified: now, priority: 0.90, changeFrequency: 'weekly' },
    { url: `${baseUrl}/vimume`, lastModified: now, priority: 0.90, changeFrequency: 'weekly' },
    { url: `${baseUrl}/vimume/hermes`, lastModified: now, priority: 0.85, changeFrequency: 'weekly' },
    { url: `${baseUrl}/vimume/nosotros`, lastModified: now, priority: 0.85, changeFrequency: 'weekly' },
    { url: `${baseUrl}/vimume/investigacion`, lastModified: now, priority: 0.85, changeFrequency: 'weekly' },
    { url: `${baseUrl}/vimume/inversion`, lastModified: now, priority: 0.85, changeFrequency: 'weekly' },
    { url: `${baseUrl}/vimume/centros`, lastModified: now, priority: 0.85, changeFrequency: 'weekly' },
    { url: `${baseUrl}/vimume/eventos`, lastModified: now, priority: 0.85, changeFrequency: 'weekly' },
    { url: `${baseUrl}/vimume/contacto`, lastModified: now, priority: 0.85, changeFrequency: 'weekly' },
    { url: `${baseUrl}/contacto`, lastModified: now, priority: 0.85, changeFrequency: 'weekly' },
    { url: `${baseUrl}/afiliados`, lastModified: now, priority: 0.85, changeFrequency: 'weekly' },
    { url: `${baseUrl}/dossier`, lastModified: now, priority: 0.85, changeFrequency: 'weekly' },
    { url: `${baseUrl}/blog`, lastModified: now, priority: 0.80, changeFrequency: 'weekly' },
  ];

  // 2. CATEGORÍAS & GUÍAS ESTRATÉGICAS
  const occasionPages: MetadataRoute.Sitemap = OCASIONES.map(o => ({
    url: `${baseUrl}/ocasiones/${o.slug}`,
    lastModified: now,
    priority: 0.80,
    changeFrequency: 'weekly'
  }));

  const guidePages: MetadataRoute.Sitemap = GUIAS.map(g => ({
    url: `${baseUrl}/guias/${g.slug}`,
    lastModified: now,
    priority: 0.80,
    changeFrequency: 'monthly'
  }));

  const matrixPages: MetadataRoute.Sitemap = HIGH_VALUE_VARIANTS.map(v => ({
    url: `${baseUrl}/artistas/${v.slug}`,
    lastModified: now,
    priority: 0.90,
    changeFrequency: 'weekly'
  }));

  // 3. PILAR CANÓNICO: SERVICIOS x 52 PROVINCIAS (/servicios/[servicio]/[provincia])
  const serviceCanonicalPages: MetadataRoute.Sitemap = [];
  const primaryServices = [
    'mariachis',
    'sonorizacion-eventos',
    'wedding-planners',
    'edwin-agudelo-solista',
    'edwin-agudelo-mariachi-6',
    'edwin-caballo',
    'iluminacion-espectacular',
    'produccion-audiovisual',
    'dj-premium'
  ];

  primaryServices.forEach(serviceSlug => {
    PROVINCIAS.forEach(province => {
      const isHighIntent = /mariachis|edwin|sonorizacion/.test(serviceSlug);
      serviceCanonicalPages.push({
        url: `${baseUrl}/servicios/${serviceSlug}/${province}`,
        lastModified: now,
        priority: isHighIntent ? 0.90 : 0.85,
        changeFrequency: 'weekly'
      });
    });
  });

  // 4. PILAR RELACIONAL DE ALTA CONVERSIÓN (/servicios/mariachis/[evento-rol]/[provincia])
  const relationalCanonicalPages: MetadataRoute.Sitemap = [];
  const topRelationalCombos = [
    'cumpleanos-madre',
    'cumpleanos-padre',
    'aniversario-suegro',
    'aniversario-suegra',
    'boda-oro-abuela',
    'boda-plata-esposa',
    'jubilacion-padre',
    'despedida-amigo',
    'graduacion-hermana',
    'reconciliacion-novia'
  ];

  topRelationalCombos.forEach(combo => {
    PROVINCIAS.forEach(province => {
      relationalCanonicalPages.push({
        url: `${baseUrl}/servicios/mariachis/${combo}/${province}`,
        lastModified: now,
        priority: 0.90,
        changeFrequency: 'weekly'
      });
    });
  });

  // 5. PILAR CANÓNICO: ARSENAL & PANTALLAS LED x 52 PROVINCIAS (/arsenal/[equipo]/[provincia])
  const arsenalCanonicalPages: MetadataRoute.Sitemap = [];
  const primaryArsenalItems = [
    'pantalla-led',
    'alquiler-sonido',
    'altavoces-line-array',
    'iluminacion-dmx'
  ];

  primaryArsenalItems.forEach(itemSlug => {
    PROVINCIAS.forEach(province => {
      arsenalCanonicalPages.push({
        url: `${baseUrl}/arsenal/${itemSlug}/${province}`,
        lastModified: now,
        priority: 0.85,
        changeFrequency: 'weekly'
      });
    });
  });

  // 6. PILAR CANÓNICO: B2G INSTITUCIONAL x 52 PROVINCIAS (/b2g/[evento]/[provincia])
  const b2gCanonicalPages: MetadataRoute.Sitemap = [];
  const b2gEventTypes = [
    'fiestas-patronales',
    'festivales'
  ];

  b2gEventTypes.forEach(eventSlug => {
    PROVINCIAS.forEach(province => {
      b2gCanonicalPages.push({
        url: `${baseUrl}/b2g/${eventSlug}/${province}`,
        lastModified: now,
        priority: 0.85,
        changeFrequency: 'weekly'
      });
    });
  });

  // 7. PILAR TERRITORIAL: LANDINGS PROVINCIALES PURAS (/[provincia])
  const provinceCanonicalPages: MetadataRoute.Sitemap = PROVINCIAS.map(province => ({
    url: `${baseUrl}/${province}`,
    lastModified: now,
    priority: 0.85,
    changeFrequency: 'weekly'
  }));

  // PURGADO ATÓMICO: 0 URLs de basura legada (/articulo/*, /weddings/*) en el sitemap
  return unique([
    ...corePages,
    ...occasionPages,
    ...guidePages,
    ...matrixPages,
    ...serviceCanonicalPages,
    ...relationalCanonicalPages,
    ...arsenalCanonicalPages,
    ...b2gCanonicalPages,
    ...provinceCanonicalPages
  ]);
}
