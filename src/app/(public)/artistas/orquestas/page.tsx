import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import {
  Users,
  Music,
  ChevronRight,
} from 'lucide-react';
import {
  TARIFA_BASE_SOLISTA_EUR,
  CENTRALITA_EAR_OS,
} from '@/lib/constants/ear-os-ssot';
import { ArtistPricingMatrix } from '@/app/components/artists/ArtistPricingMatrix';
import { ArtistTestimonials } from '@/app/components/artists/ArtistTestimonials';

export const metadata: Metadata = {
  title: 'Orquestas de Gala S-Class | Ensambles Productora EAR',
  description:
    'Contrata las mejores agrupaciones y ensambles de mariachi en España. Puestas en escena soberbias dirigidas por Edwin Agudelo con trajes de charro de gala.',
  alternates: {
    canonical: 'https://productoraear.com/artistas/orquestas',
  },
};

const RESERVAR_SOLISTA_HREF = '/reservar/solista';

const WHATSAPP_HREF = `https://wa.me/${CENTRALITA_EAR_OS.replace(/\D/g, '')}?text=${encodeURIComponent(
  'Hola, quiero reservar un Ensamble de Gala S-Class.'
)}`;

interface OrquestaNodo {
  slug: string;
  title: string;
  location: string;
  desc: string;
  icon: React.ReactNode;
}

interface FichaTecnica {
  label: string;
  value: string;
}

const LOCALIZED_ORQUESTAS: OrquestaNodo[] = [
  {
    slug: 'mariachis-bodas-barcelona-gala',
    title: 'Ensamble de Gala en Barcelona',
    location: 'Barcelona',
    desc: 'Gran puesta en escena con 6+ músicos y sombreros tradicionales.',
    icon: <Users className="text-amber-400" size={24} />,
  },
  {
    slug: 'mariachi-aniversarios-zaragoza-gala',
    title: 'Agrupación Profesional en Zaragoza',
    location: 'Zaragoza',
    desc: 'Perfecto para aniversarios, bodas de oro y eventos de empresa.',
    icon: <Music className="text-[#ecb613]" size={24} />,
  },
];

const FICHA_TECNICA: FichaTecnica[] = [
  { label: 'Músicos en Escena', value: 'Desde 6 hasta 12 integrantes en gala' },
  { label: 'Rider de Microfonía', value: 'Inalámbrica Shure / Ecualización digital' },
  { label: 'Duración Recomendada', value: '60 a 120 minutos en dos bloques' },
  { label: 'Repertorio de Apertura', value: 'El Rey, La Bikina, Si Nos Dejan' },
  { label: 'Cumplimiento Operativo', value: 'Seguro RC de montaje y coordinación directa de tiempos' },
  { label: 'Tarifa Oficial SSOT', value: `Desde ${TARIFA_BASE_SOLISTA_EUR} € · Sin sobrecostes ocultos` },
];

export default function OrquestasPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: 'Ensamble de Gala S-Class — Orquestas y Mariachis',
    description:
      'Ensamble profesional de mariachi de gala con 6 a 12 músicos, trajes bordados a mano y coordinación operativa integral.',
    brand: {
      '@type': 'Brand',
      name: 'Productora EAR',
    },
    url: 'https://productoraear.com/artistas/orquestas',
    offers: {
      '@type': 'Offer',
      priceCurrency: 'EUR',
      price: TARIFA_BASE_SOLISTA_EUR.toFixed(2),
      availability: 'https://schema.org/InStock',
      url: 'https://productoraear.com/reservar/solista',
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
            <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.25em] bg-[#ecb613]/10 text-[#ecb613] border border-[#ecb613]/20 flex items-center gap-1.5 font-mono">
              <Users size={12} /> Academia Diamante Rojo V2
            </span>
            <span className="text-white/20 text-[9px] font-black uppercase tracking-widest font-mono">
              S-CLASS ENSAMBLES
            </span>
          </div>

          <h1 className="text-5xl md:text-8xl font-black uppercase italic tracking-tighter leading-none text-white font-syne">
            Orquestas{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ecb613] to-white/70">
              S-Class
            </span>
          </h1>

          <p className="text-white/40 text-lg md:text-xl italic leading-relaxed max-w-2xl mx-auto">
            Ensambles de 6 a 12 músicos con guitarrón, vihuela, guitarra, violines y trompetas. Trajes de charro bordados a mano, repertorio de gala y coordinación operativa directa con Edwin Agudelo.
          </p>

          <div className="flex flex-wrap justify-center items-center gap-3 pt-2">
            <span className="px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.25em] bg-[#ecb613]/10 text-[#ecb613] border border-[#ecb613]/25 font-mono">
              Desde {TARIFA_BASE_SOLISTA_EUR} € · Tarifa Oficial SSOT
            </span>
          </div>
        </section>

        {/* DETAILS */}
        <section className="bg-[#09090d]/80 border border-white/10 rounded-3xl p-8 md:p-16 relative overflow-hidden group hover:border-[#ecb613]/30 transition-colors duration-500">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-8">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider bg-[#ecb613]/10 text-[#ecb613] border border-[#ecb613]/25 font-mono">
                  Curaduría Militar de Escena
                </span>
                <span className="text-white/30 text-[9px] font-black uppercase tracking-widest font-mono">
                  S-CLASS STANDARDS
                </span>
              </div>

              <h2 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter leading-[0.9] font-syne">
                Ensambles <br />
                <span className="text-[#ecb613]">Profesionales</span>
              </h2>

              <p className="text-white/50 text-sm md:text-base leading-relaxed">
                Cada ensamble parte de un mínimo de 6 integrantes: guitarrón, vihuela, guitarra, violines y trompetas. Los músicos provienen de la Academia Diamante Rojo y se seleccionan por criterios de afinación, presencia escénica y protocolo social. Trajes de charro bordados a mano, repertorio de gala y coordinación de tiempos alineada con eventos corporativos e institucionales.
              </p>

              <div className="space-y-4">
                <h4 className="text-xs font-black uppercase tracking-widest text-[#ecb613]">
                  Nodos Territoriales de Ensambles:
                </h4>
                <div className="grid md:grid-cols-2 gap-4">
                  {LOCALIZED_ORQUESTAS.map((item) => (
                    <Link
                      key={item.slug}
                      href={`/artistas/${item.slug}`}
                      className="p-5 bg-white/[0.02] border border-white/10 hover:border-[#ecb613]/40 rounded-3xl flex flex-col justify-between transition-all duration-300 group/link hover:-translate-y-1 hover:shadow-[0_0_30px_-10px_rgba(236,182,19,0.25)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ecb613]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#030305]"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-white/5 rounded-xl text-white/60 transition-colors duration-300 group-hover/link:bg-[#ecb613]/10 group-hover/link:text-[#ecb613]">
                          {item.icon}
                        </div>
                        <span className="text-[8px] font-mono font-black text-white/30 uppercase">
                          {item.location}
                        </span>
                      </div>
                      <div>
                        <h5 className="text-[12px] font-black uppercase tracking-tight text-white group-hover/link:text-[#ecb613] transition-colors mb-1">
                          {item.title}
                        </h5>
                        <p className="text-[9px] text-white/40 leading-tight italic">
                          {item.desc}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link
                  href={RESERVAR_SOLISTA_HREF}
                  className="group/cta relative px-8 py-4 bg-white text-black hover:bg-[#ecb613] rounded-xl text-[10px] font-black uppercase tracking-[0.3em] transition-all duration-300 text-center overflow-hidden hover:-translate-y-0.5 hover:shadow-[0_10px_40px_-10px_rgba(236,182,19,0.6)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ecb613]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#030305] active:translate-y-0"
                >
                  <span className="relative z-10 inline-flex items-center justify-center gap-2">
                    Reservar Ensamble de Gala
                    <ChevronRight
                      size={14}
                      className="transition-transform duration-300 group-hover/cta:translate-x-1"
                    />
                  </span>
                  <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover/cta:translate-x-full" />
                </Link>
                <a
                  href={WHATSAPP_HREF}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/wa relative px-8 py-4 bg-[#ecb613]/10 border border-[#ecb613]/30 hover:bg-[#ecb613] hover:text-black rounded-xl text-[10px] font-black uppercase tracking-[0.3em] text-[#ecb613] transition-all duration-300 text-center overflow-hidden hover:-translate-y-0.5 hover:shadow-[0_10px_40px_-10px_rgba(236,182,19,0.6)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ecb613]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#030305] active:translate-y-0"
                >
                  <span className="relative z-10 inline-flex items-center justify-center gap-2">
                    WhatsApp Directo
                    <ChevronRight
                      size={14}
                      className="transition-transform duration-300 group-hover/wa:translate-x-1"
                    />
                  </span>
                </a>
              </div>
            </div>

            <div className="lg:col-span-5 bg-[#09090d]/80 border border-white/10 rounded-3xl p-8 md:p-10 space-y-6 hover:border-[#ecb613]/30 transition-colors duration-500">
              <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-[#ecb613]">
                <Users size={24} />
              </div>
              <h3 className="text-xl font-black uppercase tracking-tight font-syne">
                Ficha de Formación
              </h3>

              <div className="space-y-4 border-t border-white/10 pt-4">
                {FICHA_TECNICA.map((spec) => (
                  <div key={spec.label} className="flex flex-col gap-1">
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
              Garantía Corporativa EAR OS
            </span>
            <h2 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter font-syne">
              Tarifas y Transparencia
            </h2>
            <p className="text-white/40 text-sm md:text-base leading-relaxed">
              El coste de un ensamble de gran formato se calcula por número de músicos, desplazamiento y duración del bloque. Tarifa oficial desde {TARIFA_BASE_SOLISTA_EUR} € sin sobrecostes ocultos.
            </p>
          </div>

          <ArtistPricingMatrix />
        </section>

        {/* TESTIMONIALS */}
        <ArtistTestimonials />

        {/* PREVENTS DEAD ENDS */}
        <section className="border-t border-white/10 pt-20">
          <div className="bg-[#09090d]/80 rounded-3xl border border-white/10 p-10 md:p-16 flex flex-col md:flex-row justify-between items-center gap-8 hover:border-[#ecb613]/30 transition-colors duration-500">
            <div className="space-y-4 max-w-xl text-center md:text-left">
              <span className="text-[#ecb613] text-[10px] font-black uppercase tracking-[0.4em] font-mono">
                Ecosistema EAR OS
              </span>
              <h3 className="text-3xl font-black uppercase italic tracking-tight font-syne">
                ¿Buscas formatos individuales?
              </h3>
              <p className="text-white/40 text-sm">
                Si necesitas una amenización acústica íntima con 1 a 3 músicos, consulta la selección de solistas desde {TARIFA_BASE_SOLISTA_EUR} €.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <Link
                href="/artistas/solistas"
                className="group/sol px-8 py-5 bg-white/5 hover:bg-white text-white hover:text-black rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] text-center transition-all duration-300 flex items-center justify-center gap-2 hover:-translate-y-0.5 hover:shadow-[0_10px_40px_-10px_rgba(255,255,255,0.4)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#030305] active:translate-y-0"
              >
                Ver Solistas Premium
                <ChevronRight
                  size={14}
                  className="group-hover/sol:translate-x-1 transition-transform duration-300"
                />
              </Link>
              <Link
                href={RESERVAR_SOLISTA_HREF}
                className="group/res px-8 py-5 bg-[#ecb613] hover:bg-white text-black rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] text-center transition-all duration-300 inline-flex items-center justify-center gap-2 hover:-translate-y-0.5 hover:shadow-[0_10px_40px_-10px_rgba(236,182,19,0.7)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ecb613]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#030305] active:translate-y-0"
              >
                Reservar Ahora
                <ChevronRight
                  size={14}
                  className="group-hover/res:translate-x-1 transition-transform duration-300"
                />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}