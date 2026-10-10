import type { Metadata } from 'next';
import React from 'react';
import Link from 'next/link';
import {
  Tv, Volume2, ShieldCheck, Zap,
  CheckCircle2, PhoneCall, Sparkles, Layers
} from 'lucide-react';
import { AudiovisualFaqAccordion } from '@/components/seo/AudiovisualFaqAccordion';
import { AudiovisualCalculator } from '@/components/public/AudiovisualCalculator';
import {
  TARIFA_BASE_SOLISTA_EUR,
  DEPOSITO_STRIPE_EUR,
  CENTRALITA_EAR_OS
} from '@/lib/constants/ear-os-ssot';

const CANONICAL_URL =
  'https://ear-os.com/alquiler-equipos-sonido-audiovisuales';

export const metadata: Metadata = {
  title:
    'Alquiler de Equipos de Sonido, Pantallas LED Gigantes & Iluminación DMX | Productora EAR',
  description:
    'Alquiler profesional de pantallas LED P2.9 HDR, sonorización Bose F1 / L-Acoustics e iluminación robótica DMX para bodas de gala, convenciones corporativas y festivales. Montaje certificado, técnicos titulados y cobertura nacional.',
  keywords: [
    'alquiler pantallas LED',
    'alquiler equipos sonido',
    'iluminación DMX eventos',
    'sonorización profesional bodas',
    'pantalla LED gigante alquiler',
    'alquiler audiovisual corporativo',
    'Productora EAR'
  ],
  alternates: {
    canonical: CANONICAL_URL
  },
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    url: CANONICAL_URL,
    siteName: 'Productora EAR',
    title:
      'Alquiler de Equipos de Sonido, Pantallas LED Gigantes & Iluminación DMX | Productora EAR',
    description:
      'Infraestructura escénica audiovisual de alta definición: pantallas LED P2.9 HDR, sonorización Bose F1 / L-Acoustics e iluminación robótica DMX. Montaje certificado y técnicos titulados.',
    images: [
      {
        url: 'https://ear-os.com/og/alquiler-audiovisuales.jpg',
        width: 1200,
        height: 630,
        alt: 'Alquiler de pantallas LED y sonido profesional — Productora EAR'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title:
      'Alquiler de Equipos de Sonido, Pantallas LED Gigantes & Iluminación DMX',
    description:
      'Pantallas LED P2.9 HDR, sonorización Bose F1 / L-Acoustics e iluminación DMX para eventos de gala y corporativos.',
    images: ['https://ear-os.com/og/alquiler-audiovisuales.jpg']
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1
    }
  }
};

const SERVICE_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Alquiler de Equipos de Sonido, Pantallas LED Gigantes & Iluminación DMX',
  description:
    'Infraestructura escénica audiovisual de alta definición para eventos y galas.',
  serviceType: 'Alquiler de equipos audiovisuales',
  areaServed: {
    '@type': 'Country',
    name: 'España'
  },
  provider: {
    '@type': 'Organization',
    name: 'Productora EAR',
    url: 'https://ear-os.com',
    telephone: CENTRALITA_EAR_OS
  },
  offers: {
    '@type': 'Offer',
    price: TARIFA_BASE_SOLISTA_EUR.toFixed(2),
    priceCurrency: 'EUR',
    availability: 'https://schema.org/InStock',
    url: CANONICAL_URL
  }
} as const;

const BREADCRUMB_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Inicio',
      item: 'https://ear-os.com'
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Alquiler de Equipos de Sonido y Audiovisuales',
      item: CANONICAL_URL
    }
  ]
} as const;

export default function AlquilerAudiovisualesPage() {
  const whatsappHref = `https://wa.me/${CENTRALITA_EAR_OS.replace(
    /\D/g,
    ''
  )}?text=Hola,%20busco%20presupuesto%20para%20alquiler%20de%20pantalla%20LED%20y%20sonido`;

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[#030305] text-white pt-24 pb-20 px-4">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SERVICE_JSON_LD) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_JSON_LD) }}
      />

      <div className="max-w-7xl mx-auto space-y-16">
        {/* HEADER AUDIOVISUAL S-CLASS */}
        <div className="border-b border-white/10 pb-12">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="bg-[#ecb613]/10 border border-[#ecb613]/40 text-[#ecb613] text-xs font-mono font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5">
              <Tv size={14} /> Arsenal Técnico B2B // Cobertura Nacional
            </span>
            <span className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono px-3 py-1 rounded-full uppercase">
              Pantallas LED P2.9 HDR
            </span>
            <span className="bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-mono px-3 py-1 rounded-full uppercase">
              Sonorización Bose F1 / L-Acoustics
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-fraunces font-black text-white leading-tight max-w-5xl">
            Alquiler de Equipos de Sonido, Pantallas LED Gigantes &amp; Iluminación DMX
          </h1>
          <p className="mt-4 text-white/60 font-montserrat text-base md:text-lg max-w-3xl leading-relaxed">
            Infraestructura escénica de alta definición para bodas de gala, convenciones corporativas, ferias y festejos públicos. Montaje certificado, técnicos titulados y microfonía de grado emisión.
          </p>
        </div>

        {/* SIMULADOR INTERACTIVO DE PANTALLAS LED & SONIDO */}
        <AudiovisualCalculator
          tarifaBaseSolistaEur={TARIFA_BASE_SOLISTA_EUR}
          depositoStripeEur={DEPOSITO_STRIPE_EUR}
          whatsappHref={whatsappHref}
        />

        {/* MÓDULOS TÉCNICOS DESTACADOS (GSC KEYWORDS) */}
        <div className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-3xl font-fraunces font-black text-white uppercase">
              Catálogo de Soluciones Audiovisuales
            </h2>
            <p className="text-white/50 text-xs">
              Equipamiento homologado de alta gama para todo tipo de producciones.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-[#ecb613]">
                  <Tv size={24} />
                </div>
                <h3 className="text-xl font-bold font-fraunces text-white">
                  Pantallas LED Gigantes P2.9
                </h3>
                <p className="text-white/60 text-xs leading-relaxed">
                  Módulos LED de alta tasa de refresco (3840Hz), contraste profundo y brillo para luz solar directa. Ideales para vídeos nupciales, presentaciones B2B y conciertos.
                </p>
                <ul className="space-y-2 text-xs text-white/50">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-[#ecb613]" /> Resolución 4K HDR P2.9
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-[#ecb613]" /> Estructuras Truss en Aluminio
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-[#ecb613]" /> Escalador &amp; Procesador de Vídeo
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
                  <Volume2 size={24} />
                </div>
                <h3 className="text-xl font-bold font-fraunces text-white">
                  Sonorización de Gala &amp; Conciertos
                </h3>
                <p className="text-white/60 text-xs leading-relaxed">
                  Sistemas Bose F1 Model 812, Bose S1 Pro y cajas de alineación de fase L-Acoustics K2 con mesas digitales Behringer XR18 y microfonía inalámbrica Shure Axient.
                </p>
                <ul className="space-y-2 text-xs text-white/50">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-blue-400" /> Cobertura Homogénea 12 W/pax
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-blue-400" /> Microfonía Inalámbrica Shure/Neumann
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-blue-400" /> Mesas de Mezcla Digitales DANTE
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <Sparkles size={24} />
                </div>
                <h3 className="text-xl font-bold font-fraunces text-white">
                  Iluminación Robótica &amp; DMX
                </h3>
                <p className="text-white/60 text-xs leading-relaxed">
                  Cabezas móviles Beam/Spot/Wash, focos de bañado arquitectónico LED a batería para jardines de fincas y puentes de luces para pista de baile.
                </p>
                <ul className="space-y-2 text-xs text-white/50">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-emerald-400" /> Control DMX con Escenas de Gala
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-emerald-400" /> Iluminación Inalámbrica para Fincas
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-emerald-400" /> Efectos de Humo denso &amp; Fuego Frío
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* INYECCIÓN DEL ACORDEÓN DE FAQ JSON-LD */}
        <AudiovisualFaqAccordion />

        {/* GARANTÍAS TÉCNICAS */}
        <div className="bg-[#0a0a0f] border border-white/10 rounded-3xl p-8">
          <h3 className="text-xs font-mono text-emerald-400 uppercase tracking-widest mb-6">
            Soberanía Técnica &amp; Garantía Operativa EAR OS
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link
              href="/soberania-tecnica"
              className="bg-black/40 border border-white/5 p-5 rounded-2xl space-y-2 hover:border-emerald-500/50 hover:bg-white/5 transition-all group"
            >
              <ShieldCheck className="text-emerald-400 group-hover:scale-110 transition-transform" size={28} />
              <h4 className="font-bold text-sm text-white group-hover:text-emerald-400 transition-colors">
                Póliza RC 1M€
              </h4>
              <p className="text-xs text-white/50">
                Cobertura civil completa en recintos e instalaciones.
              </p>
            </Link>

            <Link
              href="/soberania-tecnica"
              className="bg-black/40 border border-white/5 p-5 rounded-2xl space-y-2 hover:border-emerald-500/50 hover:bg-white/5 transition-all group"
            >
              <Zap className="text-emerald-400 group-hover:scale-110 transition-transform" size={28} />
              <h4 className="font-bold text-sm text-white group-hover:text-emerald-400 transition-colors">
                Técnicos Titulados
              </h4>
              <p className="text-xs text-white/50">
                Personal cualificado con prevención de riesgos laborables.
              </p>
            </Link>

            <Link
              href="/soberania-tecnica"
              className="bg-black/40 border border-white/5 p-5 rounded-2xl space-y-2 hover:border-emerald-500/50 hover:bg-white/5 transition-all group"
            >
              <Layers className="text-emerald-400 group-hover:scale-110 transition-transform" size={28} />
              <h4 className="font-bold text-sm text-white group-hover:text-emerald-400 transition-colors">
                Plan B por Clima
              </h4>
              <p className="text-xs text-white/50">
                Estructuras estancas e impermeables para exterior.
              </p>
            </Link>

            <Link
              href="/soberania-tecnica"
              className="bg-black/40 border border-white/5 p-5 rounded-2xl space-y-2 hover:border-emerald-500/50 hover:bg-white/5 transition-all group"
            >
              <CheckCircle2 className="text-emerald-400 group-hover:scale-110 transition-transform" size={28} />
              <h4 className="font-bold text-sm text-white group-hover:text-emerald-400 transition-colors">
                Facturación FACe/DIR3
              </h4>
              <p className="text-xs text-white/50">
                Apto para contratos privados y licitaciones públicas.
              </p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}