import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { 
  Heart, Sparkles, MapPin, ShieldCheck, Music, 
  Flame, Tv, Clock, Phone, ArrowRight, CheckCircle2,
  Calendar, Star, Sliders, MessageCircle, Building2
} from 'lucide-react';
import { PROVINCIAS_52_GRAPH, generateGeoSchema } from '@/lib/constants/seo-data-hydrated';
import { CENTRALITA } from '@/lib/phone-constants';
import { DarkFeatureGrid, FeatureCardItem } from '@/components/ui/DarkFeatureGrid';
import { StatDisplayBand, StatItem } from '@/components/ui/StatDisplayBand';

interface Props {
  params: Promise<{ provincia: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { provincia } = await params;
  const provKey = provincia.toLowerCase();
  const data = PROVINCIAS_52_GRAPH[provKey];

  if (!data) {
    return {
      title: `Bodas de Gala y Mariachis en ${provincia} | Productora EAR`,
      description: `Contratación directa de mariachis, sonido Bose 12W/pax y catering de brasas para bodas en ${provincia}. Garantía 0 fallos.`
    };
  }

  return {
    title: `Bodas de Gala, Mariachis y Sonido en ${data.name} | Productora EAR`,
    description: `${data.localKeywords.mariachi}. ${data.localKeywords.sonido}. Desplazamiento desde Hub Central (${data.distanceFromHubKm} km). SLA: ${data.logisticsSpecs.wattsPerPax} W/pax.`,
    alternates: {
      canonical: `https://www.productoraear.com/bodas/${data.slug}`
    },
    openGraph: {
      title: `Bodas Exclusivas en ${data.name} — Productora EAR`,
      description: `Música de conservatorio, sonido Bose y catering de brasas para bodas y fincas en ${data.name}.`,
      url: `https://www.productoraear.com/bodas/${data.slug}`,
      type: 'website'
    }
  };
}

export default async function ProvincialWeddingPage({ params }: Props) {
  const { provincia } = await params;
  const provKey = provincia.toLowerCase();
  const data = PROVINCIAS_52_GRAPH[provKey] || {
    slug: provKey,
    name: provincia.charAt(0).toUpperCase() + provincia.slice(1),
    region: 'CENTRO' as const,
    distanceFromHubKm: 60,
    deliveryCostBase: 35,
    featuredVenuesCount: 240,
    topIntents: [`bodas ${provincia}`, `mariachi ${provincia}`, `sonido bodas ${provincia}`],
    localKeywords: {
      mariachi: `Mariachis de conservatorio y tenor solista para bodas en ${provincia}`,
      sonido: `Sonorización Bose F1 y pantallas LED para fincas y salones de ${provincia}`,
      brasas: `Catering de brasas y showcooking a la brasa en ${provincia}`,
      ayuntamientos: `Espectáculos de gala para celebraciones en ${provincia}`
    },
    logisticsSpecs: { soundSlaHours: 2.5, wattsPerPax: 12, guaranteeType: 'Garantía Técnica S-Class' }
  };

  const schemaJson = generateGeoSchema(provKey, 'mariachi');

  const weddingServices: FeatureCardItem[] = [
    {
      id: 'mariachi-solista',
      title: `Tenor & Solista en ${data.name}`,
      description: 'Voz lírica de conservatorio, repertorio romántico y sonido Bose F1 invisible para ceremonia y cóctel.',
      imageSrc: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop',
      link: '/artistas/edwin-agudelo',
      category: 'Música de Gala · Desde 350 €'
    },
    {
      id: 'mariachi-quinteto',
      title: `Ensamble Mariachi 5M (${data.name})`,
      description: '5 maestros de conservatorio uniformados de gran gala con trompetas, violines, vihuela y guitarrón.',
      imageSrc: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=800&auto=format&fit=crop',
      link: '/artistas/edwin-agudelo',
      category: 'Formación Completa · Desde 750 €'
    },
    {
      id: 'catering-brasas',
      title: `Live Fire & Brasas en ${data.name}`,
      description: 'Showcooking de cortes ibéricos de bellota y asado al sarmiento con estaciones de fuego en directo.',
      imageSrc: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=800&auto=format&fit=crop',
      link: '/proveedores?cat=catering',
      category: 'Gastronomía · Desde 45 €/pax'
    },
    {
      id: 'sonido-bose-led',
      title: `Sonido Bose & LED en ${data.name}`,
      description: 'Presión acústica garantizada a 12 W/pax, microfonía Shure Axient y pantallas LED P2.9 Novastar 4K.',
      imageSrc: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&auto=format&fit=crop&q=80',
      link: '/alquiler-equipos-sonido-audiovisuales',
      category: 'Hardware S-Class · 12 W/pax'
    }
  ];

  const statsList: StatItem[] = [
    { value: '12', superscript: 'W/pax', label: `Presión Acústica Homologada en ${data.name}` },
    { value: `${data.distanceFromHubKm}`, superscript: 'KM', label: 'Distancia Logística desde Hub Central' },
    { value: '100', superscript: '€', label: 'Depósito de Garantía Reembolsable (Stripe)' }
  ];

  return (
    <main className="min-h-screen bg-obsidian text-paper font-sans selection:bg-[#ecb613] selection:text-black">
      {/* Microdatos GEO Schema.org */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJson) }}
      />

      {/* 1. HERO EDITORIAL PROVINCIAL */}
      <section className="relative pt-36 pb-20 px-6 max-w-7xl mx-auto text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-ash text-xs font-mono uppercase tracking-widest">
          <MapPin size={14} className="text-[#ecb613]" />
          <span>Nodo Territorial: {data.name} · Región {data.region}</span>
        </div>

        <h1 className="font-light text-4xl sm:text-6xl lg:text-7xl leading-[0.95] tracking-[-0.05em] text-paper max-w-5xl mx-auto font-syne">
          Bodas de Gala, Música de Autor & <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ecb613] via-amber-200 to-white">
            Catering de Fuego en {data.name}
          </span>
        </h1>

        <p className="text-fog text-base sm:text-lg max-w-2xl mx-auto font-light leading-relaxed">
          {data.localKeywords.mariachi}. Producción técnica integral con sonido calibrado a {data.logisticsSpecs.wattsPerPax} W/pax y cero intermediarios.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            href={`/cotizador?provincia=${data.slug}&mode=bespoke`}
            className="w-full sm:w-auto px-8 py-4 bg-[#ecb613] text-black font-mono font-bold text-xs uppercase tracking-wider rounded-none hover:scale-105 transition-transform flex items-center justify-center gap-2 shadow-2xl"
          >
            <span>Cotizar Boda en {data.name}</span>
            <ArrowRight size={16} />
          </Link>

          <a
            href={`https://wa.me/34693693048?text=${encodeURIComponent(`Hola Productora EAR, deseo consultar disponibilidad para una boda en ${data.name}.`)}`}
            target="_blank"
            rel="noreferrer"
            className="w-full sm:w-auto px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/15 text-white font-mono text-xs uppercase tracking-wider rounded-none transition-all flex items-center justify-center gap-2"
          >
            <MessageCircle size={16} className="text-emerald-400" />
            <span>Consultar por WhatsApp</span>
          </a>
        </div>
      </section>

      {/* 2. STATS DISPLAY BAND PROVINCIAL */}
      <StatDisplayBand stats={statsList} title={`Estándar Técnico y Logístico en ${data.name}`} />

      {/* 3. CATÁLOGO DE SERVICIOS ADAPTADOS A LA PROVINCIA */}
      <section className="py-20 px-6 max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <span className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-[#ecb613] block">
            Servicios Homologados S-Class
          </span>
          <h2 className="text-3xl sm:text-5xl font-light tracking-tight uppercase text-paper font-syne">
            Producción Integral para Fincas de {data.name}
          </h2>
          <p className="text-ash text-xs sm:text-sm max-w-xl mx-auto">
            Todos los formatos incluyen montaje acústico invisible, seguro de responsabilidad civil de 300.000 € y split soberano.
          </p>
        </div>

        <DarkFeatureGrid items={weddingServices} columns={4} />
      </section>

      {/* 4. ESPECIFICACIONES LOGÍSTICAS DE ENTREGA */}
      <section className="py-16 px-6 bg-charcoal/40 border-y border-white/5">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 rounded-lg bg-obsidian border border-white/10 space-y-2">
            <Clock className="text-[#ecb613]" size={24} />
            <h3 className="text-base font-bold uppercase text-paper">SLA de Montaje</h3>
            <p className="text-xs text-ash leading-relaxed">
              Llegada con {data.logisticsSpecs.soundSlaHours} horas de antelación para prueba de sonido y calibración de sala sin interferir en la recepción.
            </p>
          </div>

          <div className="p-6 rounded-lg bg-obsidian border border-white/10 space-y-2">
            <ShieldCheck className="text-emerald-400" size={24} />
            <h3 className="text-base font-bold uppercase text-paper">Garantía por Escrito</h3>
            <p className="text-xs text-ash leading-relaxed">
              {data.logisticsSpecs.guaranteeType}. En caso de imprevisto, se activa el protocolo Plan B con relevo garantizado en menos de 2 horas.
            </p>
          </div>

          <div className="p-6 rounded-lg bg-obsidian border border-white/10 space-y-2">
            <Building2 className="text-blue-400" size={24} />
            <h3 className="text-base font-bold uppercase text-paper">Red de Fincas ({data.featuredVenuesCount})</h3>
            <p className="text-xs text-ash leading-relaxed">
              Coordinación técnica directa con wedding planners y fincas homologadas en toda la provincia de {data.name}.
            </p>
          </div>
        </div>
      </section>

      {/* 5. CIERRE CON CENTRALITA Y COTIZADOR */}
      <section className="py-24 px-6 max-w-4xl mx-auto text-center space-y-8">
        <div className="space-y-3">
          <h2 className="text-3xl sm:text-5xl font-light text-paper uppercase tracking-tight font-syne">
            Bloquea tu Fecha en <span className="text-[#ecb613]">{data.name}</span>
          </h2>
          <p className="text-fog text-sm max-w-lg mx-auto font-light leading-relaxed">
            Depósito de garantía de 100 € gestionado a través de Stripe Live. 100% reembolsable de forma automática en 24h si decides no formalizar.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href={`/checkout/presupuesto?provincia=${data.slug}&tipo=boda-gala`}
            className="w-full sm:w-auto px-10 py-4 bg-[#ecb613] text-black font-mono font-bold text-xs uppercase tracking-wider rounded-none hover:scale-105 transition-transform shadow-2xl"
          >
            Bloquear Fecha (100 € Depósito)
          </Link>
          <a
            href={CENTRALITA.tel}
            className="w-full sm:w-auto px-8 py-4 bg-white/10 text-white font-mono text-xs uppercase tracking-wider rounded-none hover:bg-white/20 transition-all flex items-center justify-center gap-2"
          >
            <Phone size={14} className="text-[#ecb613]" />
            <span>Llamar a Centralita ({CENTRALITA.display})</span>
          </a>
        </div>
      </section>
    </main>
  );
}
