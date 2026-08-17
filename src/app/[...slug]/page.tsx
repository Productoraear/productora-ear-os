import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { BespokeTemplate } from '@/app/components/SClassScreens/BespokeTemplate';
import { PROVINCIAS, SERVICIOS } from '@/lib/constants/seo-data';
import { generateSemanticPageData } from '@/lib/seo/semantic-engine';

export const dynamicParams = true;
export const revalidate = 3600;

interface PageProps {
  params: Promise<{
    slug: string[];
  }>;
}

// 🛡️ LISTA DE RAÍCES ESTÁTICAS DE NIVEL 1 QUE TIENEN RUTA PROPIA
const EXACT_ROOT_STATIC_ROUTES = new Set([
  'about', 'academia', 'afiliados', 'artistas', 'artists', 'aviso-legal',
  'ayuntamientospremium', 'ayuntamientos-premium', 'blog', 'calculadora',
  'categorias', 'checkout', 'contacto', 'cookies', 'cotizador', 'dossier', 'dossier-seo',
  'empresarios', 'infraestructura', 'journal', 'marketplace',
  'precios', 'presupuesto', 'privacidad', 'proveedores',
  'proyectos', 'reclamar-perfil', 'soberania-tecnica', 'social',
  'the-signal', 'vimume', 'login', 'register', 'admin', 'nexus', 'dashboard',
  'studio', 'api', 'guia-estrategica', 'casos-exito', 'subasta', 'metodologia',
  'prensa', 'terms', 'privacy', 'directorio', 'wedding-planners', 'business', 'comparativas-premium'
]);

// 🏷️ CATEGORÍAS VERTICALES DINÁMICAS (ADMITEN SUB-RUTAS COMO /eventos/festivales, /ocasiones/ferias, ETC.)
const DYNAMIC_VERTICAL_PREFIXES = new Set([
  'eventos', 'ocasiones', 'servicios', 'weddings', 'production', 'tools', 'arsenal', 'bodas'
]);

function formatTitle(slugArray: string[]) {
  const lastSegment = slugArray[slugArray.length - 1];
  return lastSegment
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (l) => l.toUpperCase())
    .replace('Ear', 'EAR')
    .replace('Ai', 'IA')
    .replace('Dj', 'DJ');
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  if (!slug || slug.length === 0) return {};
  
  const rootPrefix = slug[0].toLowerCase();
  if (EXACT_ROOT_STATIC_ROUTES.has(rootPrefix) && slug.length === 1) {
    return {};
  }

  const semantic = generateSemanticPageData(slug, slug.length >= 2 ? slug[0] : 'España');

  return {
    title: `${semantic.title} | Productora EAR`,
    description: semantic.metaDescription,
    keywords: semantic.localKeywords,
    openGraph: {
      title: `${semantic.title} | Productora EAR`,
      description: semantic.metaDescription,
      images: ['/og-image-vimume.jpg'],
    }
  };
}

export default async function DynamicCatchAllPage({ params }: PageProps) {
  const { slug } = await params;
  if (!slug || slug.length === 0) notFound();

  const primaryPrefix = slug[0].toLowerCase();
  const isProvincia = PROVINCIAS.includes(primaryPrefix);

  // 1. RUTA VERTICAL DINÁMICA (ej: /eventos/festivales, /ocasiones/ferias, /servicios/sonorizacion, /weddings/fincas)
  if (DYNAMIC_VERTICAL_PREFIXES.has(primaryPrefix)) {
    const subCategory = slug.slice(1).join('-') || 'general';
    const cleanTitle = formatTitle(slug);

    return (
      <BespokeTemplate
        title={cleanTitle}
        description={`Producción técnica, sonido homologado (12 W/pax) y contratación artística de élite para ${cleanTitle}.`}
        location="España (Nacional)"
        serviceId={subCategory}
        keywords={[cleanTitle, primaryPrefix, 'Productora EAR', 'Producción de Eventos', 'Riders Técnicos']}
        isApex={true}
      />
    );
  }

  // 2. RUTA TERRITORIAL DINÁMICA (ej: /madrid, /barcelona, /valencia, /sevilla...)
  if (isProvincia) {
    const provinceCapitalized = primaryPrefix.charAt(0).toUpperCase() + primaryPrefix.slice(1);
    
    // CASO 2.A: /madrid/sonorizacion-eventos
    if (slug.length >= 2) {
      const serviceSlug = slug[1].toLowerCase();
      const serviceObj = SERVICIOS.find(s => s.slug === serviceSlug) || {
        id: serviceSlug,
        nombre: formatTitle([serviceSlug]),
        descripcion: `Servicio especializado de producción y rider acústico en ${provinceCapitalized}.`,
        keywords: [serviceSlug, primaryPrefix, 'Productora EAR']
      };

      return (
        <BespokeTemplate
          title={`${serviceObj.nombre} en ${provinceCapitalized}`}
          description={serviceObj.descripcion}
          location={provinceCapitalized}
          serviceId={serviceObj.id}
          keywords={serviceObj.keywords}
          isApex={true}
        />
      );
    }

    // CASO 2.B: /madrid (Landing provincial pura)
    return (
      <BespokeTemplate
        title={`Producción & Eventos en ${provinceCapitalized}`}
        description={`Ingeniería acústica de precisión, catálogo homologado de 24.869 proveedores y orquestas en exclusiva para ${provinceCapitalized}.`}
        location={provinceCapitalized}
        serviceId="produccion-territorial"
        keywords={['producción de eventos', provinceCapitalized, 'alquiler sonido', 'artistas en exclusiva']}
        isApex={true}
      />
    );
  }

  // 3. CUALQUIER OTRA RUTA NO VÁLIDA DEVUELVE 404
  notFound();
}
