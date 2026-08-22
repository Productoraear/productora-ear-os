// @ts-nocheck
import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Sparkles, ShieldCheck, Zap, Download, PhoneCall, ArrowLeft, CheckCircle2, ChevronRight, Truck, Award } from 'lucide-react';
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
        title: 'Catálogo Luces de Navidad 2025 | Alumbrado Monumental Demetrio & EAR',
        description: 'Catálogo técnico oficial de 358 referencias de iluminación navideña monumental para Ayuntamientos, centros comerciales y fincas. Motivos 3D, conos gigantes y Twinkly Pro.',
        alternates: {
          canonical: 'https://www.productoraear.com/arsenal/luces-navidad',
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
        <div className="max-w-7xl mx-auto mb-12 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ecb613]/10 border border-[#ecb613]/30 text-[#ecb613] text-xs font-semibold uppercase tracking-widest mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            Catálogo Oficial Demetrio 2025 · Distribuidor Homologado
          </div>
          
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-6">
            Alumbrado Navideño & <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ecb613] via-[#ffd471] to-[#ecb613]">Motivos Monumentales 3D</span>
          </h1>
          
          <p className="max-w-3xl mx-auto text-base sm:text-lg text-neutral-400 font-light leading-relaxed mb-8">
            358 referencias de alta durabilidad para licitaciones municipales (LCSP), centros comerciales, plazas mayores y fincas singulares. Tecnología LED de bajo consumo, protección IP67 y micro-LED Twinkly Pro.
          </p>

          <div className="flex flex-wrap justify-center gap-4 text-sm text-neutral-300">
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
              <ShieldCheck className="w-4 h-4 text-[#ecb613]" /> Pliegos LCSP / Contrato Menor
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
              <Zap className="w-4 h-4 text-[#ecb613]" /> Seguridad 24V / 230V IP67
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
              <Truck className="w-4 h-4 text-[#ecb613]" /> Transporte e Instalación Certificada
            </span>
          </div>
        </div>

        {/* Categories & Product Grid */}
        <div className="max-w-7xl mx-auto">
          <div className="border-b border-white/10 pb-6 mb-8 flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-[#ecb613]" />
              Referencias Destacadas ({CHRISTMAS_LIGHTING_PRODUCTS.length} Productos)
            </h2>
            <a
              href="https://wa.me/34682141077?text=Hola%2C%20solicito%20presupuesto%20del%20cat%C3%A1logo%20de%20luces%20de%20Navidad%202025"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#ecb613] to-[#d4af37] text-black font-bold text-sm hover:brightness-110 transition-all shadow-lg shadow-[#ecb613]/20"
            >
              <PhoneCall className="w-4 h-4" /> Solicitar Presupuesto LCSP
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {CHRISTMAS_LIGHTING_PRODUCTS.slice(0, 48).map((prod) => (
              <div 
                key={prod.id}
                className="group relative bg-[#0d0d0d] border border-white/10 rounded-2xl p-5 hover:border-[#ecb613]/50 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-neutral-400 mb-2">
                    <span className="font-mono text-[#ecb613]">{prod.sku}</span>
                    <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10">{prod.ipRating || 'IP67'}</span>
                  </div>

                  <h3 className="text-base font-bold text-white mb-2 group-hover:text-[#ecb613] transition-colors line-clamp-2">
                    {prod.name}
                  </h3>

                  <p className="text-xs text-neutral-400 mb-4 line-clamp-2">
                    {prod.description}
                  </p>

                  <div className="space-y-1 text-xs text-neutral-300 bg-white/[0.02] p-3 rounded-lg border border-white/5 mb-4">
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Dimensiones:</span>
                      <span className="font-medium text-right">{prod.dimensions || 'Ver ficha'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Voltaje:</span>
                      <span className="font-medium">{prod.voltage || '24V / 230V'}</span>
                    </div>
                    {prod.powerWatts && (
                      <div className="flex justify-between">
                        <span className="text-neutral-500">Potencia:</span>
                        <span className="font-medium">{prod.powerWatts} W</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                  <div className="text-sm font-bold text-[#ecb613]">
                    {prod.priceDisplay || 'Cotización a Medida'}
                  </div>
                  <Link
                    href={`/arsenal/luces-navidad/${prod.id}`}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-white hover:text-[#ecb613] transition-colors"
                  >
                    Ver Ficha <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center p-8 bg-[#0d0d0d] border border-white/10 rounded-2xl">
            <h3 className="text-lg font-bold text-white mb-2">¿Necesitas el catálogo completo o un proyecto técnico para tu municipio?</h3>
            <p className="text-sm text-neutral-400 mb-6 max-w-2xl mx-auto">
              Realizamos estudios luminotécnicos, planos de distribución de cargas, memorias técnicas para contratos menores LCSP e instalación con camión pluma.
            </p>
            <a
              href="https://wa.me/34682141077?text=Hola%2C%20necesito%20asesoramiento%20para%20un%20proyecto%20de%20alumbrado%20navide%C3%B1o"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-black font-bold text-sm hover:bg-[#ecb613] transition-all"
            >
              Contactar con el Equipo de Ingeniería
            </a>
          </div>
        </div>
      </main>
    );
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 2. FICHA TÉCNICA INDIVIDUAL DE PRODUCTO DE NAVIDAD (/arsenal/luces-navidad/[id])
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

          <div className="bg-[#0d0d0d] border border-white/10 rounded-3xl p-6 sm:p-10">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6 border-b border-white/10 pb-6">
              <div>
                <span className="text-xs font-mono text-[#ecb613] uppercase tracking-wider block mb-1">
                  SKU: {product.sku} · Catálogo Demetrio Pág. {product.cataloguePage || '2025'}
                </span>
                <h1 className="text-2xl sm:text-4xl font-extrabold text-white">
                  {product.name}
                </h1>
              </div>
              <div className="text-right">
                <span className="text-xs text-neutral-400 block">Tarifa Oficial</span>
                <span className="text-2xl sm:text-3xl font-black text-[#ecb613]">
                  {product.priceDisplay || 'Bajo Presupuesto'}
                </span>
              </div>
            </div>

            <p className="text-base text-neutral-300 leading-relaxed mb-8">
              {product.description}
            </p>

            {/* Technical Specifications Matrix */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
              <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4">
                <span className="text-xs text-neutral-500 block mb-1">Categoría Técnica</span>
                <span className="text-sm font-semibold text-white">{product.category}</span>
              </div>
              <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4">
                <span className="text-xs text-neutral-500 block mb-1">Dimensiones / Altura</span>
                <span className="text-sm font-semibold text-white">{product.dimensions || 'Según ficha técnica'}</span>
              </div>
              <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4">
                <span className="text-xs text-neutral-500 block mb-1">Voltaje Operativo</span>
                <span className="text-sm font-semibold text-white">{product.voltage} (Baja Tensión / Seguridad)</span>
              </div>
              <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4">
                <span className="text-xs text-neutral-500 block mb-1">Grado de Estanqueidad</span>
                <span className="text-sm font-semibold text-white">{product.ipRating || 'IP67 (Exterior Extremo)'}</span>
              </div>
              {product.powerWatts && (
                <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4">
                  <span className="text-xs text-neutral-500 block mb-1">Consumo Eléctrico</span>
                  <span className="text-sm font-semibold text-white">{product.powerWatts} W</span>
                </div>
              )}
              {product.weightKg && (
                <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4">
                  <span className="text-xs text-neutral-500 block mb-1">Peso Estimado</span>
                  <span className="text-sm font-semibold text-white">{product.weightKg}</span>
                </div>
              )}
            </div>

            {/* Direct WhatsApp / Lock Quote */}
            <div className="bg-[#141414] border border-[#ecb613]/30 rounded-2xl p-6 flex flex-wrap items-center justify-between gap-6">
              <div>
                <h3 className="text-base font-bold text-white mb-1">¿Deseas reservar o solicitar oferta formal para este motivo?</h3>
                <p className="text-xs text-neutral-400">Entrega garantizada con memoria técnica y transporte especializado en toda España.</p>
              </div>
              <a
                href={`https://wa.me/34682141077?text=Hola%2C%20solicito%20presupuesto%20para%20la%20referencia%20${encodeURIComponent(product.sku)}%20(${encodeURIComponent(product.name)})`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#ecb613] to-[#d4af37] text-black font-bold text-sm hover:brightness-110 transition-all flex items-center gap-2"
              >
                <PhoneCall className="w-4 h-4" /> Solicitar Oferta Inmediata
              </a>
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
