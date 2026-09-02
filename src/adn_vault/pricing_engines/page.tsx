import React from 'react';
import { Metadata } from 'next';
import { notFound, redirect, RedirectType } from 'next/navigation';
import { BespokeTemplate } from '@/app/components/SClassScreens/BespokeTemplate';
import { PROVINCIAS } from '@/lib/constants/seo-data';
import { generateSemanticPageData, resolveGeoLocation } from '@/lib/seo/semantic-engine';

export const dynamicParams = true;
export const revalidate = 3600;

interface PageProps {
  params: Promise<{
    slug: string[];
  }>;
}

// 🛡️ LISTA DE RAÍCES ESTÁTICAS DE NIVEL 1 QUE TIENEN RUTA PROPIA EN APP ROUTER
const EXACT_ROOT_STATIC_ROUTES = new Set([
  'about', 'academia', 'afiliados', 'artistas', 'artists', 'aviso-legal', 'ayuntamientos',
  'ayuntamientospremium', 'ayuntamientos-premium', 'blog', 'calculadora',
  'categorias', 'checkout', 'contacto', 'cookies', 'cotizador', 'dossier', 'dossier-seo',
  'empresarios', 'infraestructura', 'journal', 'marketplace',
  'precios', 'presupuesto', 'privacidad', 'proveedores',
  'proyectos', 'reclamar-perfil', 'soberania-tecnica', 'social',
  'the-signal', 'vimume', 'login', 'register', 'admin', 'nexus', 'dashboard',
  'studio', 'api', 'guia-estrategica', 'casos-exito', 'subasta', 'metodologia',
  'prensa', 'terms', 'privacy', 'directorio', 'business', 'comparativas-premium'
]);

// Helper para detectar si un slug contiene una provincia conocida
function findProvinceInString(str: string): string | null {
  const normalized = str.toLowerCase();
  for (const prov of PROVINCIAS) {
    if (normalized === prov || normalized.endsWith(`-${prov}`) || normalized.includes(`-${prov}-`)) {
      return prov;
    }
  }
  return null;
}

/**
 * 🛰️ GENERADOR DE METADATOS CANÓNICOS S-CLASS
 * Garantiza que cada URL apunte estrictamente a su equivalente canónico único con OpenGraph.
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  if (!slug || slug.length === 0) return {};
  
  const rootPrefix = slug[0].toLowerCase();
  if (EXACT_ROOT_STATIC_ROUTES.has(rootPrefix) && slug.length === 1) {
    return {};
  }

  // Determinar la ubicación para enriquecer metadatos
  let locationCandidate = 'Madrid';
  const lastSegment = slug[slug.length - 1].toLowerCase();
  if (PROVINCIAS.includes(lastSegment)) {
    locationCandidate = lastSegment;
  } else if (PROVINCIAS.includes(rootPrefix)) {
    locationCandidate = rootPrefix;
  }

  const semantic = generateSemanticPageData(slug, locationCandidate);
  const canonicalUrl = `https://www.productoraear.com/${semantic.canonicalPath.replace(/^\//, '')}`;

  return {
    title: semantic.title,
    description: semantic.metaDescription,
    keywords: semantic.localKeywords,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: semantic.title,
      description: semantic.metaDescription,
      url: canonicalUrl,
      images: ['/og-image-vimume.jpg'],
      siteName: 'Productora EAR',
      locale: 'es_ES',
      type: 'website'
    },
    twitter: {
      card: 'summary_large_image',
      title: semantic.title,
      description: semantic.metaDescription,
      images: ['/og-image-vimume.jpg']
    }
  };
}

/**
 * 🏆 ENRUTADOR UNIVERSAL OMEGA & GUARDIÁN DE CANONICIDAD 301
 * Erradica errores 404, neutraliza escaneos legacy y canaliza tráfico hacia los pilares canónicos.
 */
export default async function DynamicCatchAllPage({ params }: PageProps) {
  const { slug } = await params;
  if (!slug || slug.length === 0) notFound();

  const primaryPrefix = slug[0].toLowerCase();
  const rawPath = slug.join('/').toLowerCase();

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 1. NEUTRALIZACIÓN INMEDIATA DE ESCANEOS MALICIOSOS / OBSOLETOS (404 LIMPIO)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  if (
    rawPath.includes('wp-content') ||
    rawPath.includes('wp-admin') ||
    rawPath.includes('wp-includes') ||
    rawPath.includes('.php') ||
    rawPath.includes('xmlrpc') ||
    rawPath.includes('eval-stdin')
  ) {
    notFound();
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 2. PROTOCOLO DE REDIRECCIÓN 301 PERMANENTE (ANTI-CANIBALIZACIÓN QUIRÚRGICA)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  // 2.A. Rutas Legadas de Artículos (/articulo/*, /noticias/*, /post/*)
  if (primaryPrefix === 'articulo' || primaryPrefix === 'noticias' || primaryPrefix === 'post' || primaryPrefix === 'blog-post') {
    const rawRest = slug.slice(1).join('-');
    const detectedProv = findProvinceInString(rawRest) || 'madrid';
    
    if (rawRest.includes('pantalla-led') || rawRest.includes('led') || rawRest.includes('visual')) {
      redirect(`/arsenal/pantalla-led/${detectedProv}`, RedirectType.replace);
    } else if (rawRest.includes('mariachi') || rawRest.includes('edwin') || rawRest.includes('cantante') || rawRest.includes('serenata')) {
      redirect(`/servicios/mariachis/${detectedProv}`, RedirectType.replace);
    } else if (rawRest.includes('festejo') || rawRest.includes('patronal') || rawRest.includes('ayuntamiento')) {
      redirect(`/b2g/fiestas-patronales/${detectedProv}`, RedirectType.replace);
    } else if (rawRest.includes('wedding') || rawRest.includes('boda') || rawRest.includes('planner')) {
      redirect(`/servicios/wedding-planners/${detectedProv}`, RedirectType.replace);
    } else {
      redirect(`/servicios/sonorizacion-eventos/${detectedProv}`, RedirectType.replace);
    }
  }

  // 2.B. Rutas Legadas de Bodas / Weddings / Production (/weddings/*, /bodas/*, /production/*)
  if ((primaryPrefix === 'weddings' || primaryPrefix === 'bodas' || primaryPrefix === 'production') && slug.length >= 2) {
    const rawRest = slug.slice(1).join('-');
    const detectedProv = findProvinceInString(rawRest) || (slug.length >= 3 && PROVINCIAS.includes(slug[2].toLowerCase()) ? slug[2].toLowerCase() : 'madrid');
    
    if (rawRest.includes('mariachi') || rawRest.includes('musica')) {
      redirect(`/servicios/mariachis/${detectedProv}`, RedirectType.replace);
    } else if (rawRest.includes('planner') || rawRest.includes('fincas')) {
      redirect(`/servicios/wedding-planners/${detectedProv}`, RedirectType.replace);
    } else {
      redirect(`/servicios/sonorizacion-eventos/${detectedProv}`, RedirectType.replace);
    }
  }

  // 2.C. Rutas Legadas con Sufijos Especiales como /arsenal(1)/*
  if (primaryPrefix.startsWith('arsenal(') || primaryPrefix.startsWith('servicios(')) {
    const detectedProv = findProvinceInString(rawPath) || 'madrid';
    redirect(`/arsenal/pantalla-led/${detectedProv}`, RedirectType.replace);
  }

  // 2.D. Inversión Territorial (/madrid/pantalla-led -> /arsenal/pantalla-led/madrid)
  const isProvincia = PROVINCIAS.includes(primaryPrefix);
  if (isProvincia && slug.length >= 2) {
    const province = primaryPrefix;
    const subRoute = slug[1].toLowerCase();

    if (subRoute.includes('pantalla-led') || subRoute.includes('led') || subRoute.includes('altavoces')) {
      redirect(`/arsenal/${subRoute}/${province}`, RedirectType.replace);
    } else if (subRoute.includes('mariachi') || subRoute.includes('mariachis')) {
      redirect(`/servicios/mariachis/${province}`, RedirectType.replace);
    } else if (subRoute.includes('festejos') || subRoute.includes('patronales') || subRoute.includes('festivales')) {
      redirect(`/b2g/fiestas-patronales/${province}`, RedirectType.replace);
    } else {
      redirect(`/servicios/${subRoute}/${province}`, RedirectType.replace);
    }
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 3. PILARES CANÓNICOS SANEADOS & MATRIZ RELACIONAL S-CLASS
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  // 3.A. SERVICIOS ARTÍSTICOS & RELACIONALES (/servicios/[servicio]/[provincia])
  if (primaryPrefix === 'servicios') {
    const lastSeg = slug[slug.length - 1].toLowerCase();
    const isLastProv = PROVINCIAS.includes(lastSeg);
    const provinceSlug = isLastProv ? lastSeg : (slug.length >= 3 ? slug[2].toLowerCase() : 'madrid');
    const serviceSlug = isLastProv ? slug.slice(1, slug.length - 1).join('-') : slug.slice(1).join('-');
    
    const { cityName } = resolveGeoLocation(provinceSlug);
    const semantic = generateSemanticPageData(slug, cityName);

    return (
      <BespokeTemplate
        title={semantic.title}
        description={semantic.metaDescription}
        location={cityName}
        serviceId={serviceSlug || 'mariachis'}
        keywords={semantic.localKeywords}
        isApex={true}
      />
    );
  }

  // 3.B. RUTAS DIRECTAS ULTRA-AMIGABLES POR INTENCIÓN DE BÚSQUEDA PURA
  // Permite URLs directas como /mariachis/madrid, /mariachis/cumpleanos-madre/albacete, /alquiler-pantalla-led/madrid
  const directFriendlyPrefixes = new Set([
    'mariachis', 'mariachi', 'serenatas', 'serenata', 'alquiler-pantalla-led', 'pantallas-led', 'pantalla-led',
    'sonorizacion-eventos', 'sonorizacion', 'wedding-planners', 'wedding-planner', 'dj-boda', 'alquiler-sonido'
  ]);

  if (directFriendlyPrefixes.has(primaryPrefix)) {
    const lastSeg = slug[slug.length - 1].toLowerCase();
    const isLastProv = PROVINCIAS.includes(lastSeg);
    const provinceSlug = isLastProv ? lastSeg : (slug.length >= 2 && PROVINCIAS.includes(slug[1].toLowerCase()) ? slug[1].toLowerCase() : 'madrid');
    const serviceSlug = isLastProv ? slug.slice(0, slug.length - 1).join('-') : slug.join('-');

    const { cityName } = resolveGeoLocation(provinceSlug);
    const semantic = generateSemanticPageData(slug, cityName);

    return (
      <BespokeTemplate
        title={semantic.title}
        description={semantic.metaDescription}
        location={cityName}
        serviceId={serviceSlug || primaryPrefix}
        keywords={semantic.localKeywords}
        isApex={true}
      />
    );
  }

  // 3.C. ARSENAL TÉCNICO / PANTALLAS LED / SONIDO (/arsenal/[equipo]/[provincia])
  if (primaryPrefix === 'arsenal') {
    const lastSeg = slug[slug.length - 1].toLowerCase();
    const isLastProv = PROVINCIAS.includes(lastSeg);
    const provinceSlug = isLastProv ? lastSeg : 'madrid';
    const equipmentSlug = isLastProv ? slug.slice(1, slug.length - 1).join('-') : (slug[1] || 'pantalla-led');
    
    const { cityName } = resolveGeoLocation(provinceSlug);
    const semantic = generateSemanticPageData(slug, cityName);

    return (
      <BespokeTemplate
        title={semantic.title}
        description={semantic.metaDescription}
        location={cityName}
        serviceId={equipmentSlug}
        keywords={semantic.localKeywords}
        isApex={true}
      />
    );
  }

  // 3.D. B2G INSTITUCIONAL / FESTEJOS PATRONALES (/b2g/[evento]/[provincia])
  if (primaryPrefix === 'b2g') {
    const lastSeg = slug[slug.length - 1].toLowerCase();
    const isLastProv = PROVINCIAS.includes(lastSeg);
    const provinceSlug = isLastProv ? lastSeg : 'madrid';
    const eventSlug = isLastProv ? slug.slice(1, slug.length - 1).join('-') : (slug[1] || 'fiestas-patronales');
    
    const { cityName } = resolveGeoLocation(provinceSlug);
    const semantic = generateSemanticPageData(slug, cityName);

    return (
      <BespokeTemplate
        title={semantic.title}
        description={semantic.metaDescription}
        location={cityName}
        serviceId={eventSlug}
        keywords={semantic.localKeywords}
        isApex={true}
      />
    );
  }

  // 3.E. LANDINGS PROVINCIALES PURAS (/[provincia])
  if (isProvincia && slug.length === 1) {
    const { cityName } = resolveGeoLocation(primaryPrefix);
    const semantic = generateSemanticPageData(slug, cityName);

    return (
      <BespokeTemplate
        title={semantic.title}
        description={semantic.metaDescription}
        location={cityName}
        serviceId="produccion-integral"
        keywords={semantic.localKeywords}
        isApex={true}
      />
    );
  }

  // 4. FALLBACK CONTROLADO: Si la ruta no concuerda con ningún patrón
  notFound();
}
