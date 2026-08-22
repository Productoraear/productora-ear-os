// @ts-nocheck
import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { 
  Sparkles, ShieldCheck, Zap, PhoneCall, ArrowLeft, CheckCircle2, 
  ChevronRight, Truck, Award, Eye, FileSpreadsheet, Layers
} from 'lucide-react';
import { CHRISTMAS_LIGHTING_PRODUCTS, CHRISTMAS_LIGHTING_CATEGORIES, ChristmasLightingProduct } from '@/data/luces-navidad';
import { BespokeTemplate } from '@/app/components/SClassScreens/BespokeTemplate';
import { PROVINCIAS } from '@/lib/constants/seo-data';
import { resolveGeoLocation } from '@/lib/seo/semantic-engine';

interface PageProps {
  params: Promise<{
    slug: string[];
  }>;
}

export const dynamicParams = true;
export const revalidate = 3600;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  if (!slug || slug.length === 0) return {};

  const primary = slug[0].toLowerCase();
  
  if (primary === 'luces-navidad') {
    if (slug.length === 1) {
      return {
        title: 'Catálogo Oficial Luces de Navidad 2025 | Alumbrado Monumental Demetrio & EAR',
        description: 'Catálogo técnico oficial de 358 referencias con fotografías de alta definición. Iluminación navideña monumental para Ayuntamientos (LCSP), centros comerciales y fincas.',
        alternates: {
          canonical: 'https://www.productoraear.com/arsenal/luces-navidad',
        },
        openGraph: {
          title: 'Catálogo Oficial Luces de Navidad 2025 | Alumbrado Monumental Demetrio & EAR',
          description: '358 referencias de iluminación navideña monumental, motivos 3D transitables y tecnología Twinkly Pro.',
          images: ['https://images.unsplash.com/photo-1543589077-47d81606c1bf?q=80&w=1200&auto=format&fit=crop'],
          type: 'website'
        }
      };
    }
    
    const productId = slug[1].toLowerCase();
    const product = CHRISTMAS_LIGHTING_PRODUCTS.find(
      p => p.id.toLowerCase() === productId || p.canonicalUrl.toLowerCase().endsWith(`/${productId}`)
    );
    
    if (product) {
      return {
        title: `${product.name} (Ref: ${product.sku}) | Luces de Navidad Demetrio 2025`,
        description: `${product.description} Dimensiones: ${product.dimensions}. IP: ${product.ipRating}. Voltaje: ${product.voltage}. Suministro e instalación Productora EAR.`,
        alternates: {
          canonical: `https://www.productoraear.com${product.canonicalUrl}`,
        },
        openGraph: {
          title: `${product.name} | Catálogo Demetrio 2025`,
          description: product.description,
          images: [product.image || 'https://images.unsplash.com/photo-1543589077-47d81606c1bf?q=80&w=800&auto=format&fit=crop'],
          type: 'website'
        }
      };
    }
  }

  const provinceCandidate = slug[slug.length - 1];
  const location = PROVINCIAS.includes(provinceCandidate.toLowerCase()) ? provinceCandidate : 'Madrid';
  return {
    title: `Alquiler de ${slug.join(' ')} en ${location} | El Arsenal Técnico EAR`,
    description: `Equipamiento audiovisual profesional, pantallas LED, sonido Line Array y estructuras en ${location}. Garantía S-Class de cero fallos.`,
    alternates: {
      canonical: `https://www.productoraear.com/arsenal/${slug.join('/')}`,
    }
  };
}

export default async function ArsenalCatchAllPage({ params }: PageProps) {
  const { slug } = await params;
  if (!slug || slug.length === 0) notFound();

  const primary = slug[0].toLowerCase();

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 1. VISTA DE CATÁLOGO GENERAL DE LUCES DE NAVIDAD (/arsenal/luces-navidad)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  if (primary === 'luces-navidad' && slug.length === 1) {
    return (
      <main className="min-h-screen bg-[#050505] text-white pt-24 pb-20 px-4 sm:px-6 lg:px-8 selection:bg-[#ecb613] selection:text-black">
        {/* Header Hero */}
        <div className="max-w-7xl mx-auto mb-14 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#ecb613]/10 border border-[#ecb613]/30 text-[#ecb613] text-xs font-semibold uppercase tracking-widest mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            Catálogo Oficial Demetrio 2025 · Distribuidor Homologado Productora EAR
          </div>
          
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight">
            Alumbrado Navideño & <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ecb613] via-[#ffd471] to-[#ecb613]">
              Motivos Monumentales 3D
            </span>
          </h1>
          
          <p className="max-w-3xl mx-auto text-base sm:text-lg text-neutral-400 font-light leading-relaxed mb-8">
            Galería técnica de 358 referencias con fotografías de alta resolución. Proyectos integrales de iluminación para plazas consistoriales, avenidas, centros comerciales y fincas de eventos con certificación IP67.
          </p>

          <div className="flex flex-wrap justify-center gap-4 text-xs sm:text-sm text-neutral-300 mb-8">
            <span className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10">
              <ShieldCheck className="w-4 h-4 text-[#ecb613]" /> Pliegos LCSP / Contrato Menor
            </span>
            <span className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10">
              <Zap className="w-4 h-4 text-[#ecb613]" /> Seguridad Eléctrica 24V / 230V
            </span>
            <span className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10">
              <Truck className="w-4 h-4 text-[#ecb613]" /> Transporte e Instalación con Grúa Pluma
            </span>
          </div>

          <div className="flex justify-center gap-4">
            <a
              href="https://wa.me/34682141077?text=Hola%2C%20solicito%20presupuesto%20del%20cat%C3%A1logo%20de%20luces%20de%20Navidad%202025"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-[#ecb613] to-[#d4af37] text-black font-bold text-sm hover:brightness-110 transition-all shadow-xl shadow-[#ecb613]/20"
            >
              <PhoneCall className="w-4 h-4" /> Solicitar Presupuesto y Memoria Técnica
            </a>
          </div>
        </div>

        {/* Categories Showcase Gallery */}
        <div className="max-w-7xl mx-auto mb-16">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#ecb613]" />
            Líneas de Producto & Diseños Exclusivos
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {CHRISTMAS_LIGHTING_CATEGORIES.slice(0, 6).map((catName, idx) => {
              const sampleProd = CHRISTMAS_LIGHTING_PRODUCTS.find(p => p.category === catName);
              const imgUrl = sampleProd?.image || 'https://images.unsplash.com/photo-1543589077-47d81606c1bf?q=80&w=800&auto=format&fit=crop';
              return (
                <div key={idx} className="group relative rounded-2xl overflow-hidden bg-neutral-900 border border-white/10 aspect-square flex flex-col justify-end p-3 hover:border-[#ecb613] transition-all">
                  <img src={imgUrl} alt={catName} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-60 group-hover:opacity-80" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                  <span className="relative z-10 text-xs font-bold text-white group-hover:text-[#ecb613] transition-colors leading-tight">
                    {catName}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Product Grid */}
        <div className="max-w-7xl mx-auto">
          <div className="border-b border-white/10 pb-6 mb-8 flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-[#ecb613]" />
              Catálogo Completo ({CHRISTMAS_LIGHTING_PRODUCTS.length} Referencias)
            </h2>
            <span className="text-xs text-neutral-400 font-mono">
              Temporada 2025/2026 · Normativa CE & UNE-EN 60598
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {CHRISTMAS_LIGHTING_PRODUCTS.slice(0, 60).map((prod) => (
              <div 
                key={prod.id}
                className="group relative bg-[#0d0d0d] border border-white/10 rounded-2xl overflow-hidden hover:border-[#ecb613]/60 transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Product Visual Card */}
                  <div className="relative h-48 w-full overflow-hidden bg-neutral-900">
                    <img 
                      src={prod.image} 
                      alt={prod.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-transparent to-black/20" />
                    
                    <div className="absolute top-3 left-3">
                      <span className="px-2 py-1 rounded bg-black/80 backdrop-blur-md border border-white/15 font-mono text-[10px] text-[#ecb613] font-bold">
                        {prod.sku}
                      </span>
                    </div>

                    <div className="absolute top-3 right-3">
                      <span className="px-2 py-0.5 rounded bg-black/80 backdrop-blur-md border border-white/10 text-[10px] text-white">
                        {prod.ipRating || 'IP67'}
                      </span>
                    </div>
                  </div>

                  <div className="p-4">
                    <span className="text-[10px] text-neutral-400 uppercase tracking-wider block mb-1">
                      {prod.category}
                    </span>

                    <h3 className="text-sm font-bold text-white mb-2 group-hover:text-[#ecb613] transition-colors line-clamp-2">
                      {prod.name}
                    </h3>

                    <p className="text-xs text-neutral-400 mb-3 line-clamp-2">
                      {prod.description}
                    </p>

                    <div className="space-y-1 text-xs text-neutral-300 bg-white/[0.02] p-2.5 rounded-lg border border-white/5 mb-2">
                      <div className="flex justify-between">
                        <span className="text-neutral-500">Dimensiones:</span>
                        <span className="font-medium text-right">{prod.dimensions || 'Ver ficha'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-500">Voltaje:</span>
                        <span className="font-medium">{prod.voltage || '24V'}</span>
                      </div>
                      {prod.powerWatts && (
                        <div className="flex justify-between">
                          <span className="text-neutral-500">Potencia:</span>
                          <span className="font-medium">{prod.powerWatts} W</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="p-4 pt-0 flex items-center justify-between border-t border-white/5 mt-2">
                  <div className="text-xs font-bold text-[#ecb613]">
                    {prod.priceDisplay || 'Cotización a Medida'}
                  </div>
                  <Link
                    href={`/arsenal/luces-navidad/${prod.id}`}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-white hover:text-[#ecb613] transition-colors bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg border border-white/10"
                  >
                    <Eye className="w-3 h-3 text-[#ecb613]" /> Ficha Técnica
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center p-10 bg-gradient-to-br from-[#111] to-[#080808] border border-[#ecb613]/30 rounded-3xl">
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">
              ¿Deseas descargar el catálogo técnico en PDF o solicitar licitación municipal?
            </h3>
            <p className="text-sm text-neutral-400 mb-8 max-w-2xl mx-auto">
              Facilitamos el expediente completo con certificados de homologación, ensayos de resistencia al viento, fichas de carga y precios cerrados bajo contrato menor LCSP (&lt;15.000€).
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="https://wa.me/34682141077?text=Hola%2C%20solicito%20el%20expediente%20t%C3%A9cnico%20y%20precios%20del%20cat%C3%A1logo%20de%20luces%20de%20Navidad%20Demetrio%202025"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[#ecb613] text-black font-bold text-sm hover:brightness-110 transition-all shadow-lg"
              >
                <PhoneCall className="w-4 h-4" /> Hablar con Asesor Técnico de Licitaciones
              </a>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 2. FICHA TÉCNICA INDIVIDUAL CON FOTOGRAFÍA HD (/arsenal/luces-navidad/[id])
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  if (primary === 'luces-navidad' && slug.length >= 2) {
    const productId = slug[1].toLowerCase();
    const product = CHRISTMAS_LIGHTING_PRODUCTS.find(
      p => p.id.toLowerCase() === productId || p.canonicalUrl.toLowerCase().endsWith(`/${productId}`)
    );

    if (!product) notFound();

    return (
      <main className="min-h-screen bg-[#050505] text-white pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Back button */}
          <Link
            href="/arsenal/luces-navidad"
            className="inline-flex items-center gap-2 text-sm text-neutral-400 hover:text-[#ecb613] transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" /> Volver al Catálogo de Iluminación Navideña
          </Link>

          <div className="bg-[#0d0d0d] border border-white/10 rounded-3xl overflow-hidden p-6 sm:p-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Product Large Image */}
              <div className="relative rounded-2xl overflow-hidden bg-neutral-900 border border-white/10 aspect-square sm:aspect-auto sm:h-[400px]">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full bg-black/80 backdrop-blur-md border border-[#ecb613]/40 font-mono text-xs text-[#ecb613] font-bold">
                    Ref: {product.sku}
                  </span>
                </div>
                <div className="absolute top-4 right-4">
                  <span className="px-3 py-1 rounded-full bg-black/80 backdrop-blur-md border border-white/15 text-xs text-white">
                    {product.ipRating || 'IP67 Exterior'}
                  </span>
                </div>
              </div>

              {/* Product Specs Detail */}
              <div className="flex flex-col justify-between">
                <div>
                  <span className="text-xs font-mono text-[#ecb613] uppercase tracking-wider block mb-2">
                    {product.category} · Pág. {product.cataloguePage || 'Catálogo 2025'}
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-4 leading-tight">
                    {product.name}
                  </h1>
                  <p className="text-sm text-neutral-300 leading-relaxed mb-6">
                    {product.description}
                  </p>

                  <div className="space-y-2 mb-6">
                    <div className="flex justify-between p-3 rounded-xl bg-white/[0.03] border border-white/5 text-xs">
                      <span className="text-neutral-400">Dimensiones:</span>
                      <span className="font-semibold text-white">{product.dimensions || 'Consultar ficha'}</span>
                    </div>
                    <div className="flex justify-between p-3 rounded-xl bg-white/[0.03] border border-white/5 text-xs">
                      <span className="text-neutral-400">Tensión Operativa:</span>
                      <span className="font-semibold text-white">{product.voltage} (Baja Tensión)</span>
                    </div>
                    <div className="flex justify-between p-3 rounded-xl bg-white/[0.03] border border-white/5 text-xs">
                      <span className="text-neutral-400">Grado de Protección:</span>
                      <span className="font-semibold text-white">{product.ipRating || 'IP67'}</span>
                    </div>
                    {product.powerWatts && (
                      <div className="flex justify-between p-3 rounded-xl bg-white/[0.03] border border-white/5 text-xs">
                        <span className="text-neutral-400">Consumo Energético:</span>
                        <span className="font-semibold text-white">{product.powerWatts} W</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-neutral-500 uppercase block">Tarifa Oficial</span>
                    <span className="text-2xl font-black text-[#ecb613]">{product.priceDisplay || 'Bajo Presupuesto'}</span>
                  </div>
                  <a
                    href={`https://wa.me/34682141077?text=Hola%2C%20solicito%20reserva%20para%20la%20referencia%20${encodeURIComponent(product.sku)}%20(${encodeURIComponent(product.name)})`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2.5 rounded-xl bg-[#ecb613] text-black font-bold text-xs hover:brightness-110 transition-all flex items-center gap-1.5"
                  >
                    <PhoneCall className="w-3.5 h-3.5" /> Cotizar Inmediato
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 3. ARSENAL TÉCNICO GENERAL (/arsenal/[equipo]/[provincia])
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  const lastSeg = slug[slug.length - 1].toLowerCase();
  const isLastProv = PROVINCIAS.includes(lastSeg);
  const provinceSlug = isLastProv ? lastSeg : 'madrid';
  const equipmentSlug = isLastProv ? slug.slice(0, slug.length - 1).join('-') : slug.join('-');

  const { cityName } = resolveGeoLocation(provinceSlug);

  return (
    <BespokeTemplate
      title={`Alquiler de ${equipmentSlug.replace(/-/g, ' ')} en ${cityName}`}
      description={`Infraestructura técnica S-Class, alquiler de ${equipmentSlug.replace(/-/g, ' ')} con técnico in-situ y transporte asegurado en ${cityName}.`}
      location={cityName}
      province={cityName}
      category="Arsenal Técnico"
      serviceId={equipmentSlug}
      isApex={true}
    />
  );
}
