import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  Sparkles, ArrowLeft
} from 'lucide-react';
import { CHRISTMAS_LIGHTING_PRODUCTS, CHRISTMAS_LIGHTING_CATEGORIES } from '@/data/luces-navidad';
import ChristmasLightingCatalogView from '@/features/catalog/ui/ChristmasLightingCatalogView';
import LightingDetailActions from '@/features/catalog/ui/LightingDetailActions';

const SITE_URL = 'https://productoraear.com';
const DEFAULT_OG_IMAGE = '/images/demetrio/page_2.jpg';

interface PageProps {
  params: Promise<{
    slug: string[];
  }>;
}

export const dynamicParams = true;
export const revalidate = 3600;

function slugifyCategory(cat: string): string {
  return cat
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function resolveCategory(slug: string[]): string | undefined {
  if (!slug || slug.length === 0) return undefined;
  const catSlug = slug.length >= 2 && slug[0] === 'categoria' ? slug[1] : slug[0];
  return CHRISTMAS_LIGHTING_CATEGORIES.find(
    (c) => slugifyCategory(c) === catSlug.toLowerCase()
  );
}

function resolveProduct(slug: string[]) {
  if (!slug || slug.length === 0) return undefined;
  const productId = slug[slug.length - 1].toLowerCase();
  return CHRISTMAS_LIGHTING_PRODUCTS.find(
    (p) =>
      p.id.toLowerCase() === productId ||
      p.canonicalUrl.toLowerCase().endsWith(`/${productId}`) ||
      p.sku.toLowerCase() === productId
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  if (!slug || slug.length === 0) {
    return {
      title: 'Catálogo Alumbrado Navideño | Productora EAR',
      description:
        'Catálogo oficial de alumbrado navideño monumental para municipios y grandes eventos. Suministro e instalación homologada Productora EAR.',
      alternates: {
        canonical: `${SITE_URL}/arsenal/luces-navidad`,
      },
    };
  }

  const matchedCategory = resolveCategory(slug);
  if (matchedCategory) {
    const catSlug = slugifyCategory(matchedCategory);
    const canonical = `${SITE_URL}/arsenal/luces-navidad/categoria/${catSlug}`;
    const title = `${matchedCategory} | Catálogo Alumbrado Navideño Productora EAR`;
    const description = `Línea oficial de ${matchedCategory} para alumbrado público y grandes eventos. Cumplimiento normativo LCSP e instalación homologada.`;
    return {
      title,
      description,
      alternates: {
        canonical,
      },
      openGraph: {
        title,
        description,
        url: canonical,
        siteName: 'Productora EAR',
        type: 'website',
        images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: matchedCategory }],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [DEFAULT_OG_IMAGE],
      },
    };
  }

  const product = resolveProduct(slug);
  if (product) {
    const canonical = `${SITE_URL}${product.canonicalUrl}`;
    const title = `${product.name} (Ref: ${product.sku}) | Productora EAR Alumbrado Monumental`;
    const description = `${product.description} Medidas: ${product.dimensions}. IP: ${product.ipRating}. Voltaje: ${product.voltage}. Suministro e instalación Productora EAR.`;
    const ogImage = product.image || DEFAULT_OG_IMAGE;
    return {
      title,
      description,
      alternates: {
        canonical,
      },
      openGraph: {
        title: `${product.name} | Productora EAR S-Class`,
        description: product.description,
        url: canonical,
        siteName: 'Productora EAR',
        images: [{ url: ogImage, width: 1200, height: 630, alt: product.name }],
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: `${product.name} | Productora EAR S-Class`,
        description: product.description,
        images: [ogImage],
      },
    };
  }

  return {
    title: 'Catálogo Alumbrado Navideño | Productora EAR',
    description:
      'Catálogo oficial de alumbrado navideño monumental para municipios y grandes eventos. Suministro e instalación homologada Productora EAR.',
    alternates: {
      canonical: `${SITE_URL}/arsenal/luces-navidad`,
    },
  };
}

export default async function LucesNavidadCatchAllPage({ params }: PageProps) {
  const { slug } = await params;
  if (!slug || slug.length === 0) notFound();

  const matchedCategory = resolveCategory(slug);

  if (matchedCategory) {
    const catSlug = slugifyCategory(matchedCategory);
    const canonical = `${SITE_URL}/arsenal/luces-navidad/categoria/${catSlug}`;
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: `${matchedCategory} | Catálogo Alumbrado Navideño Productora EAR`,
      description: `Línea oficial de ${matchedCategory} para alumbrado público y grandes eventos.`,
      url: canonical,
      isPartOf: {
        '@type': 'WebSite',
        name: 'Productora EAR',
        url: SITE_URL,
      },
    };

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <ChristmasLightingCatalogView
          products={CHRISTMAS_LIGHTING_PRODUCTS}
          categories={[...CHRISTMAS_LIGHTING_CATEGORIES]}
          initialCategory={matchedCategory}
        />
      </>
    );
  }

  const product = resolveProduct(slug);
  if (!product) notFound();

  const relatedProducts = CHRISTMAS_LIGHTING_PRODUCTS
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const canonical = `${SITE_URL}${product.canonicalUrl}`;
  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    sku: product.sku,
    image: product.image ? [`${SITE_URL}${product.image.startsWith('/') ? product.image : `/${product.image}`}`] : [`${SITE_URL}${DEFAULT_OG_IMAGE}`],
    category: product.category,
    brand: {
      '@type': 'Brand',
      name: 'Productora EAR',
    },
    url: canonical,
    offers: {
      '@type': 'Offer',
      url: canonical,
      availability: 'https://schema.org/InStock',
      priceCurrency: 'EUR',
      price: '0',
      priceValidUntil: '2099-12-31',
      seller: {
        '@type': 'Organization',
        name: 'Productora EAR',
        url: SITE_URL,
      },
    },
    additionalProperty: [
      product.dimensions && {
        '@type': 'PropertyValue',
        name: 'Dimensiones',
        value: product.dimensions,
      },
      product.voltage && {
        '@type': 'PropertyValue',
        name: 'Voltaje',
        value: product.voltage,
      },
      product.ipRating && {
        '@type': 'PropertyValue',
        name: 'Grado de Protección',
        value: product.ipRating,
      },
      product.powerWatts && {
        '@type': 'PropertyValue',
        name: 'Consumo',
        value: `${product.powerWatts} W`,
      },
      product.weightKg && {
        '@type': 'PropertyValue',
        name: 'Peso',
        value: `${product.weightKg} kg`,
      },
    ].filter(Boolean),
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Inicio',
        item: SITE_URL,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Arsenal',
        item: `${SITE_URL}/arsenal`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: 'Luces Navidad',
        item: `${SITE_URL}/arsenal/luces-navidad`,
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: product.name,
        item: canonical,
      },
    ],
  };

  return (
    <main className="min-h-screen bg-[#030305] text-white pt-28 pb-20 px-4 sm:px-6 lg:px-8 selection:bg-[#ecb613] selection:text-black">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/arsenal/luces-navidad"
            className="inline-flex items-center gap-2 text-sm text-neutral-400 hover:text-[#ecb613] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Volver al Catálogo de Alumbrado Monumental
          </Link>

          <span className="text-xs font-mono text-neutral-500">
            Página {product.cataloguePage || '1'} / 145 · Catálogo Oficial S-Class
          </span>
        </div>

        <div className="bg-[#0d0d0d] border border-white/10 rounded-3xl overflow-hidden p-6 sm:p-10 mb-12 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
            <div className="lg:col-span-7 relative rounded-2xl overflow-hidden bg-black border border-white/10 flex items-center justify-center p-2 min-h-[450px]">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-contain max-h-[600px] rounded-xl"
              />
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 rounded-full bg-black/90 backdrop-blur-md border border-[#ecb613]/50 font-mono text-xs text-[#ecb613] font-bold">
                  Ref: {product.sku}
                </span>
              </div>
              <div className="absolute top-4 right-4">
                <span className="px-3 py-1 rounded-full bg-black/80 backdrop-blur-md border border-white/15 text-xs text-white">
                  {product.ipRating || 'IP65 / IP67'}
                </span>
              </div>
            </div>

            <div className="lg:col-span-5 flex flex-col justify-between">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ecb613]/10 border border-[#ecb613]/30 text-[#ecb613] text-[11px] font-mono uppercase tracking-widest mb-3">
                  <Sparkles className="w-3.5 h-3.5" />
                  {product.category}
                </div>

                <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-4 leading-tight">
                  {product.name}
                </h1>

                <p className="text-sm text-neutral-300 leading-relaxed mb-6">
                  {product.description}
                </p>

                <div className="space-y-2 mb-6 font-mono text-xs">
                  <div className="flex justify-between p-3 rounded-xl bg-white/[0.03] border border-white/5">
                    <span className="text-neutral-400">Dimensiones / Medidas:</span>
                    <span className="font-semibold text-white text-right">{product.dimensions || 'Ver ficha técnica'}</span>
                  </div>
                  <div className="flex justify-between p-3 rounded-xl bg-white/[0.03] border border-white/5">
                    <span className="text-neutral-400">Tensión Operativa:</span>
                    <span className="font-semibold text-white">{product.voltage} (Baja Tensión Segura)</span>
                  </div>
                  <div className="flex justify-between p-3 rounded-xl bg-white/[0.03] border border-white/5">
                    <span className="text-neutral-400">Grado de Protección:</span>
                    <span className="font-semibold text-white">{product.ipRating || 'IP65 / IP67 Exterior'}</span>
                  </div>
                  {product.powerWatts && (
                    <div className="flex justify-between p-3 rounded-xl bg-white/[0.03] border border-white/5">
                      <span className="text-neutral-400">Consumo Energético:</span>
                      <span className="font-semibold text-white">{product.powerWatts} W</span>
                    </div>
                  )}
                  {product.weightKg && (
                    <div className="flex justify-between p-3 rounded-xl bg-white/[0.03] border border-white/5">
                      <span className="text-neutral-400">Peso Estructural:</span>
                      <span className="font-semibold text-white">{product.weightKg} kg</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-neutral-500 uppercase block font-mono">Tarifa Oficial Distribuidor</span>
                    <span className="text-2xl font-black text-[#ecb613]">{product.priceDisplay || 'Bajo Presupuesto'}</span>
                  </div>
                  <span className="text-xs text-neutral-400 font-mono">Suministro & Montaje</span>
                </div>

                <LightingDetailActions product={product} />
              </div>
            </div>
          </div>

          {relatedProducts.length > 0 && (
            <div className="border-t border-white/10 pt-8 mt-8">
              <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider font-mono text-neutral-400">
                Otras Referencias de {product.category}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {relatedProducts.map((rel) => (
                  <Link
                    key={rel.id}
                    href={`/arsenal/luces-navidad/${rel.id}`}
                    className="group p-3 rounded-xl bg-white/[0.02] hover:bg-white/5 border border-white/5 hover:border-[#ecb613]/50 transition-all block"
                  >
                    <div className="h-28 w-full bg-black rounded-lg overflow-hidden mb-2 flex items-center justify-center">
                      <img src={rel.image} alt={rel.name} className="h-full w-full object-contain group-hover:scale-105 transition-transform" />
                    </div>
                    <span className="text-[10px] font-mono text-[#ecb613] block">{rel.sku}</span>
                    <span className="text-xs font-semibold text-white line-clamp-1 group-hover:text-[#ecb613] transition-colors">{rel.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}