import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import {
  Disc,
  ShieldCheck,
  Music,
  ArrowRight,
  ChevronRight,
  Phone,
} from 'lucide-react';
import { ROUTES } from '@/lib/routes';
import {
  TARIFA_BASE_SOLISTA_EUR,
  DEPOSITO_STRIPE_EUR,
  CENTRALITA_EAR_OS,
} from '@/lib/constants/ear-os-ssot';
import { ArtistPricingMatrix } from '@/app/components/artists/ArtistPricingMatrix';
import { ArtistTestimonials } from '@/app/components/artists/ArtistTestimonials';

export const metadata: Metadata = {
  title: 'DJs & Ingeniería Rítmica S-Class | Productora EAR',
  description:
    'Contrata DJs profesionales y servicios de diseño de iluminación y sonido de gala para eventos corporativos, institucionales y fiestas exclusivas. Tarifa solista desde 350 €.',
  alternates: {
    canonical: 'https://productoraear.com/artistas/djs',
  },
};

const WHATSAPP_HREF = `https://wa.me/${CENTRALITA_EAR_OS.replace(/\D/g, '')}?text=${encodeURIComponent(
  'Hola, quiero reservar un DJ Premium S-Class para mi evento.'
)}`;

interface EngineeringSpec {
  readonly label: string;
  readonly value: string;
}

interface TrustItem {
  readonly icon: React.ReactNode;
  readonly title: string;
  readonly desc: string;
}

const ENGINEERING_SPECS: readonly EngineeringSpec[] = [
  {
    label: 'Equipamiento Cabina',
    value: 'Pioneer DJ CDJ-3000 / DJM-A9 Standard Global',
  },
  {
    label: 'Diseño Lumínico Acoplado',
    value: 'Cabezas móviles LED DMX de alta definición',
  },
  {
    label: 'Soporte Sonoro',
    value: 'Columnas auto-alimentadas Bose L1 PRO / F1 System',
  },
  {
    label: 'Duración de los Sets',
    value: 'Desde 120 minutos hasta 5 horas continuas',
  },
  {
    label: 'Repertorio y Playlists',
    value: 'Curaduría adaptada según el protocolo del Planner OS',
  },
] as const;

const TRUST_ITEMS: readonly TrustItem[] = [
  {
    icon: <ShieldCheck size={20} />,
    title: 'Garantía S-Class',
    desc: 'Contrato blindado y seguro de responsabilidad civil incluido.',
  },
  {
    icon: <Music size={20} />,
    title: 'Curaduría a medida',
    desc: 'Playlist diseñada según el protocolo del Planner OS.',
  },
  {
    icon: <ArrowRight size={20} />,
    title: 'Cierre inmediato',
    desc: `Reserva online con depósito Stripe de ${DEPOSITO_STRIPE_EUR} €.`,
  },
] as const;

export default function DJsElectronicPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: 'DJs & Ingeniería Rítmica S-Class',
    description:
      'Portafolio oficial de DJs y soluciones de ingeniería acústica de Productora EAR. Sets exclusivos de música electrónica, house melódico y fisiones tradicionales con percusión en vivo.',
    url: 'https://productoraear.com/artistas/djs',
    brand: {
      '@type': 'Brand',
      name: 'Productora EAR',
    },
    offers: {
      '@type': 'Offer',
      price: TARIFA_BASE_SOLISTA_EUR.toFixed(2),
      priceCurrency: 'EUR',
      availability: 'https://schema.org/InStock',
      url: 'https://productoraear.com/reservar/solista',
      priceValidUntil: '2026-12-31',
      seller: {
        '@type': 'Organization',
        name: 'Productora EAR',
      },
    },
  };

  return (
    <main className="min-h-screen w-full overflow-x-hidden bg-[#030305] text-white pt-40 pb-24 font-sans selection:bg-[#ecb613]/30">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#ecb613]/5 blur-[150px] rounded-full pointer-events-none translate-x-1/4 -translate-y-1/4" />
      <div className="absolute bottom-1/3 left-0 w-[500px] h-[500px] bg-white/[0.02] blur-[120px] rounded-full pointer-events-none -translate-x-1/4" />

      <div className="max-w-7xl mx-auto px-6 space-y-24 relative z-10">
        {/* HERO */}
        <section className="space-y-6 text-center max-w-4xl mx-auto">
          <div className="flex justify-center items-center gap-3">
            <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.25em] bg-[#ecb613]/10 text-[#ecb613] border border-[#ecb613]/20 flex items-center gap-1.5 font-mono transition-all duration-500 hover:bg-[#ecb613]/20 hover:border-[#ecb613]/40">
              <Disc size={12} /> Ingeniería de Sonido V2
            </span>
            <span className="text-white/20 text-[9px] font-black uppercase tracking-widest font-mono">
              ELECTRONIC & DJS
            </span>
          </div>

          <h1 className="text-5xl md:text-8xl font-black uppercase italic tracking-tighter leading-none text-white font-syne">
            DJs &{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ecb613] to-white/70">
              Electronic
            </span>{' '}
            S-Class
          </h1>

          <p className="text-white/40 text-lg md:text-xl italic leading-relaxed max-w-2xl mx-auto">
            Sets de música electrónica, house melódico y fisiones tradicionales con percusión en vivo.
            Cabina Pioneer CDJ-3000 / DJM-A9, iluminación DMX y sonido Bose L1 PRO calibrado por recinto.
          </p>

          <div className="flex flex-wrap justify-center items-center gap-3 pt-2">
            <span className="px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.25em] bg-[#ecb613]/10 text-[#ecb613] border border-[#ecb613]/25 font-mono transition-all duration-500 hover:bg-[#ecb613]/20 hover:border-[#ecb613]/50 hover:scale-105">
              Tarifa Solista {TARIFA_BASE_SOLISTA_EUR} €
            </span>
            <span className="px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.25em] bg-white/5 text-white/60 border border-white/10 font-mono transition-all duration-500 hover:bg-white/10 hover:border-white/20 hover:scale-105">
              Depósito Stripe {DEPOSITO_STRIPE_EUR} €
            </span>
          </div>
        </section>

        {/* DETAILS */}
        <section className="bg-gradient-to-br from-[#0d0d0d] to-[#030305] border border-white/10 rounded-3xl p-8 md:p-16 relative overflow-hidden group transition-all duration-500 hover:border-[#ecb613]/30 hover:shadow-[0_0_60px_-15px_rgba(236,182,19,0.15)]">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-8">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider bg-[#ecb613]/10 text-[#ecb613] border border-[#ecb613]/25 font-mono transition-all duration-500 hover:bg-[#ecb613]/20">
                  Curaduría Rítmica de Precisión
                </span>
                <span className="text-white/30 text-[9px] font-black uppercase tracking-widest font-mono">
                  S-CLASS ENGINEERING
                </span>
              </div>

              <h2 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter leading-[0.9] font-syne">
                Ingeniería <br />
                <span className="text-[#ecb613]">Rítmica</span>
              </h2>

              <p className="text-white/50 text-sm md:text-base leading-relaxed">
                El ritmo corporativo y de gala exige transición fluida y control de intensidades acústicas.
                Nuestros DJs operan cabina Pioneer CDJ-3000 / DJM-A9 con sonido Bose L1 PRO calibrado por
                recinto. Las fisiones en directo incorporan solistas de viento o percusión charra sobre
                bases rítmicas de house melódico, con sets de 120 minutos a 5 horas continuas.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link
                  href="/reservar/solista"
                  className="group/cta relative px-8 py-4 bg-white text-black hover:bg-[#ecb613] rounded-xl text-[10px] font-black uppercase tracking-[0.3em] transition-all duration-300 text-center overflow-hidden hover:scale-[1.03] hover:shadow-[0_0_40px_-10px_rgba(236,182,19,0.6)] active:scale-[0.98]"
                >
                  <span className="relative z-10 inline-flex items-center justify-center gap-2">
                    Reservar DJ Premium · {TARIFA_BASE_SOLISTA_EUR} €
                    <ArrowRight
                      size={14}
                      className="transition-transform duration-300 group-hover/cta:translate-x-1"
                    />
                  </span>
                  <span className="absolute inset-0 -translate-x-full group-hover/cta:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/40 to-transparent" />
                </Link>
                <Link
                  href={ROUTES.artistas}
                  className="group/cta2 relative px-8 py-4 bg-white/5 border border-white/10 hover:border-[#ecb613]/50 hover:bg-white/10 rounded-xl text-[10px] font-black uppercase tracking-[0.3em] text-white transition-all duration-300 text-center hover:scale-[1.03] active:scale-[0.98]"
                >
                  <span className="inline-flex items-center justify-center gap-2">
                    Ver Catálogo de Artistas
                    <ChevronRight
                      size={14}
                      className="transition-transform duration-300 group-hover/cta2:translate-x-1"
                    />
                  </span>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 bg-[#09090d]/80 border border-white/10 rounded-3xl p-8 md:p-10 space-y-6 transition-all duration-500 hover:border-[#ecb613]/30 hover:bg-[#09090d]">
              <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-[#ecb613] transition-all duration-500 hover:bg-[#ecb613]/10 hover:scale-110">
                <Disc size={24} />
              </div>
              <h3 className="text-xl font-black uppercase tracking-tight font-syne">Ficha de Ingeniería</h3>

              <div className="space-y-4 border-t border-white/5 pt-4">
                {ENGINEERING_SPECS.map((spec) => (
                  <div
                    key={spec.label}
                    className="flex flex-col gap-1 transition-all duration-300 hover:translate-x-1"
                  >
                    <span className="text-[9px] font-black text-white/30 uppercase tracking-widest">
                      {spec.label}
                    </span>
                    <span className="text-xs font-bold text-white/80">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* PRICING */}
        <section className="space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-[#ecb613] text-[10px] font-black uppercase tracking-[0.5em]">
              Excelencia Técnica EAR OS
            </span>
            <h2 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter font-syne">
              Tarifas y Transparencia
            </h2>
            <p className="text-white/40 text-sm md:text-base leading-relaxed">
              Tarifa solista oficial desde{' '}
              <span className="text-[#ecb613] font-bold">{TARIFA_BASE_SOLISTA_EUR} €</span> con depósito
              Stripe de {DEPOSITO_STRIPE_EUR} €. Sin costes de intermediarios.
            </p>
          </div>

          <ArtistPricingMatrix />
        </section>

        {/* TESTIMONIALS */}
        <ArtistTestimonials />

        {/* PREVENTS DEAD ENDS */}
        <section className="border-t border-white/5 pt-20">
          <div className="bg-[#09090d]/80 rounded-3xl border border-white/10 p-10 md:p-16 flex flex-col md:flex-row justify-between items-center gap-8 transition-all duration-500 hover:border-[#ecb613]/30 hover:shadow-[0_0_60px_-15px_rgba(236,182,19,0.15)]">
            <div className="space-y-4 max-w-xl text-center md:text-left">
              <span className="text-[#ecb613] text-[10px] font-black uppercase tracking-[0.4em] font-mono">
                Ecosistema EAR OS
              </span>
              <h3 className="text-3xl font-black uppercase italic tracking-tight font-syne">
                ¿Prefieres un show tradicional en acústico?
              </h3>
              <p className="text-white/40 text-sm">
                Consulta las opciones de solistas premium lideradas por la trayectoria de Edwin Agudelo.
                Tarifa base {TARIFA_BASE_SOLISTA_EUR} €.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <Link
                href="/artistas/solistas"
                className="group/cta3 px-8 py-5 bg-white/5 hover:bg-white text-white hover:text-black rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] text-center transition-all duration-300 flex items-center justify-center gap-2 hover:scale-[1.03] active:scale-[0.98] hover:shadow-[0_0_40px_-10px_rgba(255,255,255,0.4)]"
              >
                Ver Solistas Premium
                <ChevronRight
                  size={14}
                  className="transition-transform duration-300 group-hover/cta3:translate-x-1"
                />
              </Link>
              <a
                href={WHATSAPP_HREF}
                target="_blank"
                rel="noopener noreferrer"
                className="group/cta4 px-8 py-5 bg-[#ecb613] hover:bg-white text-black rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] text-center transition-all duration-300 flex items-center justify-center gap-2 hover:scale-[1.03] active:scale-[0.98] hover:shadow-[0_0_40px_-10px_rgba(236,182,19,0.7)]"
              >
                <Phone
                  size={14}
                  className="transition-transform duration-300 group-hover/cta4:rotate-12"
                />
                WhatsApp Dirección Artística
              </a>
            </div>
          </div>
        </section>

        {/* TRUST BAR */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TRUST_ITEMS.map((item) => (
            <div
              key={item.title}
              className="group/trust bg-[#09090d]/80 border border-white/10 rounded-3xl p-8 space-y-3 transition-all duration-500 hover:border-[#ecb613]/30 hover:-translate-y-1 hover:shadow-[0_0_40px_-15px_rgba(236,182,19,0.25)]"
            >
              <div className="w-10 h-10 rounded-xl bg-[#ecb613]/10 text-[#ecb613] flex items-center justify-center transition-all duration-500 group-hover/trust:bg-[#ecb613]/20 group-hover/trust:scale-110">
                {item.icon}
              </div>
              <h4 className="text-sm font-black uppercase tracking-widest font-syne">{item.title}</h4>
              <p className="text-white/40 text-xs leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}