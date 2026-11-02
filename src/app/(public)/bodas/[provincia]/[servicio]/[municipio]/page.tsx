import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import {
  Sparkles,
  MapPin,
  ShieldCheck,
  ArrowRight,
  Phone,
  Clock,
  Award,
  CheckCircle2,
  ChevronRight,
  Star,
  Building2,
  HelpCircle,
  Hash
} from 'lucide-react';
import { MUNICIPALITIES_DATASET } from '@/lib/constants/spanish-municipalities';
import { PROVINCIAS_52_GRAPH } from '@/lib/constants/seo-data-hydrated';
import { MeshGradientBackground } from '@/components/sclass/MeshGradientBackground';
import { getProvidersByLocation } from '@/lib/data/vampire-service';
import { AdjacentMunicipalitiesCrossLinker } from '@/components/geo/AdjacentMunicipalitiesCrossLinker';
import {
  resolveCanonicalBodasMunicipio,
  getCanonicalService
} from '@/lib/navigation/canonical-taxonomy';
import { composeIntentLanding } from '@/lib/seo/intent-70-30-composer';

// ISR ligero para proteger el presupuesto de build (< 60s, INV-15)
export const dynamicParams = true;
export const revalidate = 86400;

interface PageProps {
  params: Promise<{
    provincia: string;
    servicio: string;
    municipio: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const provincia = resolvedParams?.provincia || 'madrid';
  const servicio = resolvedParams?.servicio || 'mariachi-gala';
  const municipio = resolvedParams?.municipio || 'navalcarnero';

  const provKey = provincia.toLowerCase();

  const canonical = resolveCanonicalBodasMunicipio(provincia, servicio, municipio);

  if (!canonical) {
    return {
      title: `Servicios para Bodas en ${provKey} | Productora EAR`,
      alternates: {
        canonical: `https://productoraear.com/bodas/${provKey}`,
      },
    };
  }

  if (canonical.municipality === undefined) {
    return {
      title: `${getCanonicalService(canonical.service)?.label ?? 'Servicios para Bodas'} en ${PROVINCIAS_52_GRAPH[canonical.province]?.name ?? canonical.province} | Productora EAR`,
      alternates: {
        canonical: `https://productoraear.com${canonical.path}`,
      },
    };
  }

  const provData = PROVINCIAS_52_GRAPH[canonical.province];
  const provName = provData ? provData.name : canonical.province;

  const townList = MUNICIPALITIES_DATASET[canonical.province] || [];
  const townData = townList.find(t => t.slug === canonical.municipality);
  const townName = townData ? townData.name : canonical.municipality!.charAt(0).toUpperCase() + canonical.municipality!.slice(1).replace(/-/g, ' ');

  const service = getCanonicalService(canonical.service);
  const servTitle = service?.label ?? 'Mariachis & Música de Gala';

  return {
    title: `${servTitle} en ${townName} (${provName}) | Cotización SSOT & Depósito 100 €`,
    description: `Contratación oficial y logística cerrada de ${servTitle.toLowerCase()} en ${townName} (${provName}). Desglose de desplazamiento por km, Price-Lock 100 € deducible y normativa acústica Ley 37/2003.`,
    alternates: {
      canonical: `https://productoraear.com${canonical.path}`,
    },
    keywords: [
      `${servTitle} ${townName}`,
      `bodas ${townName} ${provName}`,
      `contratar ${servTitle.toLowerCase()} ${townName}`,
      `presupuesto ${servTitle.toLowerCase()} ${townName}`
    ]
  };
}

export default async function LocalMunicipalityPage({ params }: PageProps) {
  const resolvedParams = await params;
  const provincia = resolvedParams?.provincia || 'madrid';
  const servicio = resolvedParams?.servicio || 'mariachi-gala';
  const municipio = resolvedParams?.municipio || 'navalcarnero';

  const provKey = provincia.toLowerCase();

  const canonical = resolveCanonicalBodasMunicipio(provincia, servicio, municipio);
  if (!canonical) {
    redirect(`/bodas/${provKey}`);
  }
  if (canonical.needsRedirect) {
    redirect(canonical.path);
  }

  const provData = PROVINCIAS_52_GRAPH[canonical.province];
  const provName = provData ? provData.name : canonical.province;

  const townList = MUNICIPALITIES_DATASET[canonical.province] || [];
  const townData = townList.find(t => t.slug === canonical.municipality);
  const townName = townData ? townData.name : canonical.municipality!.charAt(0).toUpperCase() + canonical.municipality!.slice(1).replace(/-/g, ' ');
  const townSlug = canonical.municipality ?? 'municipio';
  const comarca = townData?.comarca || 'Comarca Histórica';
  const distanceKm = townData?.distanceFromMentrideKm ?? 35;
  const staticVenues = townData?.featuredVenues || ['Fincas y Salones Exclusivos'];

  const service = getCanonicalService(canonical.service);
  const servTitle = service?.label ?? 'Mariachis de Gala & Serenatas';
  const serviceSlug = canonical.service;

  // Invocar al motor determinista de Intención 70% Transaccional / 30% Informacional
  const composed = composeIntentLanding({
    provinceSlug: canonical.province,
    provinceName: provName,
    townSlug,
    townName,
    comarca,
    serviceSlug,
    serviceName: servTitle,
    distanceFromMentrideKm: distanceKm,
    isEdwinAgudelo: true
  });

  const localVendors = await getProvidersByLocation(provName, servTitle, 6);

  const whatsappText = encodeURIComponent(
    `¡Hola Productora EAR! Solicito disponibilidad y presupuesto oficial para ${servTitle} en ${townName} (${provName}). Distancia aprox: ${distanceKm} km. Presupuesto estimado: ${composed.quoteSummary.totalEstimatedEur} €.`
  );

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Service',
        name: `${servTitle} en ${townName}`,
        provider: {
          '@type': 'Organization',
          name: 'Productora EAR',
          url: 'https://productoraear.com',
          telephone: '+34693693048'
        },
        areaServed: {
          '@type': 'AdministrativeArea',
          name: `${townName}, ${provName}`
        },
        offers: {
          '@type': 'Offer',
          priceCurrency: 'EUR',
          price: composed.quoteSummary.basePriceEur,
          priceValidUntil: '2026-12-31',
          availability: 'https://schema.org/InStock',
          url: `https://productoraear.com${canonical.path}`
        }
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://productoraear.com' },
          { '@type': 'ListItem', position: 2, name: 'Bodas', item: 'https://productoraear.com/bodas' },
          { '@type': 'ListItem', position: 3, name: provName, item: `https://productoraear.com/bodas/${canonical.province}` },
          { '@type': 'ListItem', position: 4, name: townName, item: `https://productoraear.com${canonical.path}` }
        ]
      },
      {
        '@type': 'FAQPage',
        mainEntity: composed.faqItems.map(faq => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer
          }
        }))
      }
    ]
  };

  const transactionalBlocks = composed.blocks.filter(b => b.kind === 'transactional');
  const informationalBlocks = composed.blocks.filter(b => b.kind === 'informational');

  return (
    <MeshGradientBackground intensity="subtle">
      <main className="min-h-screen pt-28 pb-32 px-4 md:px-8 font-sans text-white">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
        />

        <div className="max-w-6xl mx-auto space-y-12">

          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs font-mono text-zinc-400">
            <Link href="/" className="hover:text-white">Inicio</Link>
            <ChevronRight size={12} />
            <Link href="/bodas" className="hover:text-white">Bodas</Link>
            <ChevronRight size={12} />
            <span className="text-[#ecb613] uppercase">{provName}</span>
            <ChevronRight size={12} />
            <span className="text-white font-bold">{townName}</span>
          </nav>

          {/* Hero Section */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#ecb613]/10 border border-[#ecb613]/30 text-[#ecb613] text-xs font-mono tracking-widest uppercase">
              <MapPin size={14} />
              <span>LOGÍSTICA AUDITADA // {townName.toUpperCase()} ({provName.toUpperCase()})</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight text-white font-syne leading-[1.05]">
              {servTitle} en <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ecb613] via-amber-200 to-white">{townName}</span>
            </h1>

            <p className="text-zinc-300 text-base md:text-lg max-w-3xl leading-relaxed font-light">
              Despliegue operativo directo en <strong className="text-white">{townName}</strong> ({comarca}). Tarifa cerrada con desglose de desplazamiento oficial, fianza vinculante con depósito Stripe Price-Lock de {composed.quoteSummary.depositEur} € y cumplimiento de la Ley 37/2003 de Ruido.
            </p>
          </div>

          {/* Tarjetas de Métricas de Inversión SSOT */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-[#0e0e14] border border-white/10 space-y-1">
              <span className="text-[10px] font-mono text-[#ecb613] uppercase tracking-wider block">Caché Base Oficial</span>
              <p className="text-2xl font-black font-syne text-white">{composed.quoteSummary.basePriceEur} €</p>
              <p className="text-[11px] text-zinc-400">Split Ético 80% Artista / 10% VIMUME</p>
            </div>

            <div className="p-5 rounded-2xl bg-[#0e0e14] border border-white/10 space-y-1">
              <span className="text-[10px] font-mono text-[#ecb613] uppercase tracking-wider block">Desplazamiento Auditado</span>
              <p className="text-2xl font-black font-syne text-white">{composed.quoteSummary.distanceKm} km</p>
              <p className="text-[11px] text-zinc-400">{composed.quoteSummary.billableKm} km facturables (+{composed.quoteSummary.travelCostEur} €)</p>
            </div>

            <div className="p-5 rounded-2xl bg-[#0e0e14] border border-white/10 space-y-1">
              <span className="text-[10px] font-mono text-[#ecb613] uppercase tracking-wider block">Presupuesto Cerrado</span>
              <p className="text-2xl font-black font-syne text-white">{composed.quoteSummary.totalEstimatedEur} €</p>
              <p className="text-[11px] text-zinc-400">Sin costes ocultos de combustible</p>
            </div>

            <div className="p-5 rounded-2xl bg-[#0e0e14] border border-white/10 space-y-1">
              <span className="text-[10px] font-mono text-[#ecb613] uppercase tracking-wider block">Depósito Vinculante</span>
              <p className="text-2xl font-black font-syne text-white">{composed.quoteSummary.depositEur} €</p>
              <p className="text-[11px] text-zinc-400">100% deducible de la liquidación</p>
            </div>
          </div>

          {/* ━━━ SECCIÓN TRANSACCIONAL (70% INTENCIÓN DE COMPRA) ━━━ */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-[#ecb613] uppercase tracking-widest px-3 py-1 rounded-full bg-[#ecb613]/10 border border-[#ecb613]/20">
                CONDICIONES DE CONTRATACIÓN // RATIO 70%
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {transactionalBlocks.map(block => (
                <div key={block.id} className="p-6 rounded-3xl bg-[#09090d]/80 border border-white/10 backdrop-blur-md space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-white font-syne">
                      {block.heading}
                    </h3>
                    <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-light">
                      {block.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ━━━ SECCIÓN INFORMACIONAL Y TÉCNICA (30% NORMATIVA Y GUÍA) ━━━ */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest px-3 py-1 rounded-full bg-cyan-400/10 border border-cyan-400/20">
                INGENIERÍA ACÚSTICA Y LOGÍSTICA // RATIO 30%
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {informationalBlocks.map(block => (
                <div key={block.id} className="p-6 rounded-3xl bg-[#09090d]/80 border border-cyan-500/20 backdrop-blur-md space-y-3">
                  <h3 className="text-lg font-bold text-white font-syne">
                    {block.heading}
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-light">
                    {block.body}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Preguntas Frecuentes Desplegables (FAQ) */}
          <div className="p-8 rounded-[2.5rem] bg-[#0c0c14] border border-white/10 space-y-6">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-[#ecb613]" />
              <h3 className="text-xl font-bold font-syne uppercase text-white">
                Preguntas Frecuentes sobre {servTitle} en {townName}
              </h3>
            </div>

            <div className="space-y-3">
              {composed.faqItems.map((faq, idx) => (
                <details key={idx} className="group p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-white/15 transition-all">
                  <summary className="font-semibold text-sm text-white cursor-pointer list-none flex justify-between items-center">
                    <span>{faq.question}</span>
                    <span className="text-xs font-mono text-[#ecb613] group-open:rotate-90 transition-transform">▸</span>
                  </summary>
                  <p className="mt-3 text-xs sm:text-sm text-zinc-300 font-light leading-relaxed pl-2 border-l border-[#ecb613]/30">
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>

          {/* Venues Destacados en el Municipio */}
          <div className="p-8 rounded-[2.5rem] bg-[#0c0c12] border border-white/10 space-y-4">
            <h3 className="text-lg font-bold font-syne uppercase text-white flex items-center gap-2">
              <Award size={18} className="text-[#ecb613]" />
              <span>Espacios y Fincas de Referencia en {townName}</span>
            </h3>
            <p className="text-xs text-zinc-400">
              Hemos sonorizado y actuado en los recintos más emblemáticos de la zona con máxima integración paisajística y acústica:
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              {staticVenues.map((venue, idx) => (
                <span key={idx} className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-zinc-300">
                  📍 {venue}
                </span>
              ))}
            </div>
          </div>

          {/* CTAs de Conversión Rápida */}
          <div className="p-8 sm:p-12 rounded-[2.5rem] bg-gradient-to-br from-[#12121c] to-[#0a0a0f] border border-[#ecb613]/30 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">
            <div className="space-y-2 max-w-xl text-center md:text-left">
              <span className="text-[10px] font-mono text-[#ecb613] uppercase tracking-widest block">
                PRICE-LOCK 72H SHA-256 // BLOQUEO INMEDIATO
              </span>
              <h2 className="text-2xl sm:text-3xl font-black uppercase text-white font-syne">
                ¿Celebras tu Evento en {townName}?
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 font-light">
                Presupuesto estimado de {composed.quoteSummary.totalEstimatedEur} € con {distanceKm} km auditados. Bloquea la fecha con el depósito de 100 € deducible o solicita confirmación inmediata vía WhatsApp.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 shrink-0 w-full md:w-auto">
              <Link
                href="/reservar/solista"
                className="px-6 py-4 rounded-2xl bg-[#ecb613] hover:bg-amber-400 text-black font-black uppercase text-xs tracking-wider text-center transition-all shadow-lg shadow-[#ecb613]/20 flex items-center justify-center gap-2"
              >
                <span>Bloquear Fecha ({composed.quoteSummary.depositEur} €)</span>
                <ArrowRight size={16} />
              </Link>
              <a
                href={`https://wa.me/34693693048?text=${whatsappText}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-4 rounded-2xl bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#25D366] border border-[#25D366]/30 font-bold uppercase text-xs tracking-wider text-center transition-colors flex items-center justify-center gap-2"
              >
                <Phone size={16} />
                <span>WhatsApp Directo</span>
              </a>
            </div>
          </div>

          {/* Sello de Procedencia Forense */}
          <div className="p-4 rounded-2xl bg-black/40 border border-white/5 flex flex-col sm:flex-row justify-between items-center text-[10px] font-mono text-zinc-500 gap-2">
            <div className="flex items-center gap-2">
              <Hash className="w-3 h-3 text-[#ecb613]" />
              <span>SHA-256: {composed.provenanceHash.slice(0, 16)}…</span>
            </div>
            <div>
              <span>Ratio Verificado: {Math.round(composed.transactionalRatio * 100)}% Transaccional · {Math.round(composed.informationalRatio * 100)}% Informacional</span>
            </div>
          </div>

          {/* Malla de Enlaces Internos a Municipios Colindantes */}
          <AdjacentMunicipalitiesCrossLinker
            currentProvince={canonical.province}
            currentLocation={canonical.municipality ?? municipio}
            currentServiceSlug={canonical.service}
          />

        </div>
      </main>
    </MeshGradientBackground>
  );
}
