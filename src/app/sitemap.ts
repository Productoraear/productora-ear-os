import { MetadataRoute } from 'next';
import { PROVINCIAS, OCASIONES, GUIAS } from '@/lib/constants/seo-data';
import { HIGH_VALUE_VARIANTS } from '@/lib/artists/matrix';
import allProviders from '@/data/all_providers_database.json';

const now = new Date();
const baseUrl = 'https://www.productoraear.com';

const unique = <T extends { url: string }>(items: T[]) => {
  const seen = new Set<string>();
  return items.filter(i => (seen.has(i.url) ? false : (seen.add(i.url), true)));
};

/**
 * 🗺️ SITEMAP SOBERANO CANÓNICO (EAR OS V2 - S-CLASS DEEP RELATIONAL ENGINE)
 * Integra la Matriz Relacional Completa: [Rol Relacional / Familiar] x [Celebración / Evento] x [52 Provincias].
 * Garantiza >85% de unicidad semántica por URL e indexación directa de intenciones de búsqueda de alta conversión.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  // 1. NÚCLEO SOBERANO & NODOS DE ALTA CONVERSIÓN
  const corePages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: now, priority: 1.0, changeFrequency: 'daily' },
    { url: `${baseUrl}/artistas/edwin-agudelo`, lastModified: now, priority: 1.0, changeFrequency: 'daily' },
    { url: `${baseUrl}/the-signal`, lastModified: now, priority: 0.95, changeFrequency: 'daily' },
    { url: `${baseUrl}/eventos`, lastModified: now, priority: 0.95, changeFrequency: 'daily' },
    { url: `${baseUrl}/bodas`, lastModified: now, priority: 0.95, changeFrequency: 'daily' },
    { url: `${baseUrl}/empresarios`, lastModified: now, priority: 0.95, changeFrequency: 'weekly' },
    { url: `${baseUrl}/arsenal`, lastModified: now, priority: 0.95, changeFrequency: 'weekly' },
    { url: `${baseUrl}/cotizador`, lastModified: now, priority: 0.95, changeFrequency: 'weekly' },
    { url: `${baseUrl}/ayuntamientos`, lastModified: now, priority: 0.95, changeFrequency: 'weekly' },
    { url: `${baseUrl}/academia`, lastModified: now, priority: 0.90, changeFrequency: 'weekly' },
    { url: `${baseUrl}/servicios`, lastModified: now, priority: 0.90, changeFrequency: 'weekly' },
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
    // 16 URLs Canónicas de Arsenal Técnico
    { url: `${baseUrl}/alquiler-pantalla-led/pantalla-led-interior`, lastModified: now, priority: 0.90, changeFrequency: 'weekly' },
    { url: `${baseUrl}/alquiler-pantalla-led/pantallas-led-exterior`, lastModified: now, priority: 0.90, changeFrequency: 'weekly' },
    { url: `${baseUrl}/alquiler-pantalla-led/pantalla-led-suelo`, lastModified: now, priority: 0.90, changeFrequency: 'weekly' },
    { url: `${baseUrl}/alquiler-pantalla-led/pantallas-led-curva-flexibles`, lastModified: now, priority: 0.90, changeFrequency: 'weekly' },
    { url: `${baseUrl}/alquiler-tv-monitor-led-madrid/alquiler-monitores-98`, lastModified: now, priority: 0.85, changeFrequency: 'weekly' },
    { url: `${baseUrl}/alquiler-tv-monitor-led-madrid/alquiler-monitores-85`, lastModified: now, priority: 0.85, changeFrequency: 'weekly' },
    { url: `${baseUrl}/alquiler-tv-monitor-led-madrid/alquiler-pantallas-tactiles`, lastModified: now, priority: 0.85, changeFrequency: 'weekly' },
    { url: `${baseUrl}/alquilar-equipos-de-sonido-en-madrid/alquiler-altavoces`, lastModified: now, priority: 0.90, changeFrequency: 'weekly' },
    { url: `${baseUrl}/alquilar-equipos-de-sonido-en-madrid/microfonos`, lastModified: now, priority: 0.85, changeFrequency: 'weekly' },
    { url: `${baseUrl}/alquilar-equipos-de-sonido-en-madrid/alquiler-traduccion-simultanea`, lastModified: now, priority: 0.85, changeFrequency: 'weekly' },
    { url: `${baseUrl}/alquiler-iluminacion-eventos/alquiler-cabezas-moviles`, lastModified: now, priority: 0.85, changeFrequency: 'weekly' },
    { url: `${baseUrl}/alquiler-iluminacion-eventos/iluminacion-laser`, lastModified: now, priority: 0.85, changeFrequency: 'weekly' },
    { url: `${baseUrl}/alquiler-camaras-profesionales/alquiler-blackmagic-ursa`, lastModified: now, priority: 0.85, changeFrequency: 'weekly' },
    { url: `${baseUrl}/alquiler-equipos-informaticos`, lastModified: now, priority: 0.85, changeFrequency: 'weekly' },
    { url: `${baseUrl}/alquiler-escenarios/alquiler-tarima`, lastModified: now, priority: 0.85, changeFrequency: 'weekly' },
    { url: `${baseUrl}/alquiler-estructuras-truss`, lastModified: now, priority: 0.85, changeFrequency: 'weekly' },
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

  // 4. PILAR RELACIONAL PROFUNDO: [EVENTO / CELEBRACIÓN] + [ROL FAMILIAR] x 52 PROVINCIAS
  // (/servicios/mariachis/[evento-rol]/[provincia])
  const relationalCanonicalPages: MetadataRoute.Sitemap = [];
  const allRelationalCombos = [
    // 4.A. Cumpleaños Familiares & Emocionales
    'cumpleanos-madre',
    'cumpleanos-padre',
    'cumpleanos-abuela',
    'cumpleanos-abuelo',
    'cumpleanos-esposa',
    'cumpleanos-esposo',
    'cumpleanos-hermana',
    'cumpleanos-hermano',
    'cumpleanos-suegra',
    'cumpleanos-suegro',
    'cumpleanos-amiga',
    'cumpleanos-amigo',
    // 4.B. Aniversarios & Bodas de Oro/Plata
    'aniversario-esposa',
    'aniversario-esposo',
    'aniversario-novia',
    'aniversario-suegra',
    'aniversario-suegro',
    'boda-oro-abuela',
    'boda-oro-abuelo',
    'boda-plata-esposa',
    'boda-plata-esposo',
    // 4.C. Jubilaciones & Hitos Laborales
    'jubilacion-padre',
    'jubilacion-madre',
    'jubilacion-jefe',
    'jubilacion-jefa',
    'ascenso-jefe',
    // 4.D. Reconciliaciones, Despedidas & Graduaciones
    'reconciliacion-novia',
    'reconciliacion-esposa',
    'despedida-amigo',
    'despedida-amiga',
    'graduacion-hermana',
    'graduacion-hermano',
    'bienvenida-padre',
    'bienvenida-madre'
  ];

  allRelationalCombos.forEach(combo => {
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

  // 8. CATÁLOGO SOBERANO: 4.906 PROVEEDORES CURADOS (/proveedores/[id])
  const providerPages: MetadataRoute.Sitemap = (allProviders as any[]).map((p: any) => {
    const provSlug = p.slug || p.id || (p.name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    return {
      url: `${baseUrl}/proveedores/${provSlug}`,
      lastModified: now,
      priority: p.isPreferred ? 0.95 : 0.70,
      changeFrequency: 'monthly' as const
    };
  });

  // 9. PILAR PROGRAMÁTICO: BODAS x SERVICIO x 52 PROVINCIAS (/bodas/[provincia]/[servicio])
  const weddingProgrammaticPages: MetadataRoute.Sitemap = [];
  const weddingServices = [
    'dj-eventos',
    'catering-gourmet',
    'mariachis-boda',
    'wedding-planners',
    'sonorizacion-boda',
    'iluminacion-boda',
    'maestros-de-ceremonia',
    'decoracion-espacios'
  ];

  weddingServices.forEach(serv => {
    PROVINCIAS.forEach(prov => {
      weddingProgrammaticPages.push({
        url: `${baseUrl}/bodas/${prov}/${serv}`,
        lastModified: now,
        priority: 0.90,
        changeFrequency: 'weekly'
      });
    });
  });

  // 10. PILAR PROGRAMÁTICO S-CLASS: [vertical]/[intent] — NEURO-FUNNEL SEO NODES (INCLUYE GSC HARVEST)
  const neuroFunnelProgrammaticPages: MetadataRoute.Sitemap = [
    { vertical: 'bodas', intent: 'madrid-precios-musica-directo' },
    { vertical: 'bodas', intent: 'fincas-toledo-sonorizacion-gala' },
    { vertical: 'bodas', intent: 'serenata-sorpresa-pedida-mano' },
    { vertical: 'bodas', intent: 'mariachi-bodas-precios-espana' },
    { vertical: 'bodas', intent: 'mariachi-para-bodas-en-barcelona' },
    { vertical: 'bodas', intent: 'alquiler-equipo-sonido-mallorca' },
    { vertical: 'bodas', intent: 'equipos-de-sonido-para-eventos-galicia' },
    { vertical: 'corporativo', intent: 'eventos-empresa-madrid-sonido-dj' },
    { vertical: 'corporativo', intent: 'presentacion-producto-audiovisual' },
    { vertical: 'corporativo', intent: 'cena-gala-empresarial-madrid' },
    { vertical: 'corporativo', intent: 'alquiler-pantallas-led-madrid' },
    { vertical: 'corporativo', intent: 'sonorizacion-eventos-barcelona-valles' },
    { vertical: 'quinceaneras', intent: 'fiestas-15-anos-dj-iluminacion' },
    { vertical: 'cumpleanos', intent: 'mariachi-sorpresa-domicilio-madrid' },
    { vertical: 'vimume', intent: 'musicoterapia-centros-mayores-madrid' },
    { vertical: 'vimume', intent: 'envejecimiento-activo-musicoterapia' },
    { vertical: 'ayuntamientos', intent: 'conciertos-fiestas-patronales-lcsp' },
    { vertical: 'ayuntamientos', intent: 'sonorizacion-actos-institucionales' },
    { vertical: 'fincas', intent: 'opiniones-quinta-malpica-sonorizacion' },
    { vertical: 'fincas', intent: 'finca-los-afligidos-musica-directo' },
  ].map(node => ({
    url: `${baseUrl}/${node.vertical}/${node.intent}`,
    lastModified: now,
    priority: 0.90,
    changeFrequency: 'weekly' as const,
  }));

  // PURGADO ATÓMICO: Cero basura legada, 100% de unicidad semántica y foco absoluto en intenciones de búsqueda
  return unique([
    ...corePages,
    ...occasionPages,
    ...guidePages,
    ...matrixPages,
    ...serviceCanonicalPages,
    ...relationalCanonicalPages,
    ...arsenalCanonicalPages,
    ...b2gCanonicalPages,
    ...provinceCanonicalPages,
    ...weddingProgrammaticPages,
    ...neuroFunnelProgrammaticPages,
    ...providerPages
  ]);
}
