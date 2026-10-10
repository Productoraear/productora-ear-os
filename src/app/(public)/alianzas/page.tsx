import type { Metadata } from 'next';
import Link from 'next/link';
import { AllianceNetwork } from '@/modules/SClassScreens/AllianceNetwork';
import {
  TARIFA_BASE_SOLISTA_EUR,
  DEPOSITO_STRIPE_EUR,
  CENTRALITA_EAR_OS,
  WATTS_PER_PAX,
} from '@/lib/constants/ear-os-ssot';
import { MessageCircle, ArrowRight, Handshake } from 'lucide-react';

const SITE_URL = 'https://productoraear.com';
const CANONICAL_PATH = '/alianzas';
const CANONICAL_URL = `${SITE_URL}${CANONICAL_PATH}`;

const PAGE_TITLE = 'Red de Alianzas Estratégicas S-Class | Productora EAR';
const PAGE_DESCRIPTION =
  'Red de colaboradores, fincas monumentales, wedding planners y empresas de catering de alta fidelidad homologadas en EAR OS. Split soberano 80/10/10 sin intermediarios.';

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  keywords: [
    'alianzas bodas',
    'fincas colaboradoras madrid',
    'partners productora ear',
    'catering homologado',
    'wedding planners espana',
    'prescriptores b2b eventos',
    'split 80/10/10',
  ],
  alternates: {
    canonical: CANONICAL_URL,
  },
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    url: CANONICAL_URL,
    siteName: 'Productora EAR',
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
  },
  twitter: {
    card: 'summary_large_image',
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

const ALIANZAS_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Programa de Alianzas Estratégicas & Prescriptores B2B EAR OS',
  description:
    'Alianzas comerciales para fincas, wedding planners y prescriptores con liquidación de comisiones Split 80/10/10 y reserva protegida.',
  serviceType: 'Alianzas estratégicas B2B para eventos',
  areaServed: {
    '@type': 'Country',
    name: 'España',
  },
  provider: {
    '@type': 'Organization',
    name: 'Productora EAR',
    telephone: CENTRALITA_EAR_OS,
    url: SITE_URL,
  },
  offers: {
    '@type': 'Offer',
    price: TARIFA_BASE_SOLISTA_EUR,
    priceCurrency: 'EUR',
    availability: 'https://schema.org/InStock',
    url: `${SITE_URL}/reservar/solista`,
  },
} as const;

const BREADCRUMB_JSON_LD = {
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
      name: 'Alianzas',
      item: CANONICAL_URL,
    },
  ],
} as const;

export default function AlianzasPage() {
  const whatsappDigits = CENTRALITA_EAR_OS.replace(/\D/g, '');
  const whatsappUrl = `https://wa.me/${whatsappDigits}?text=${encodeURIComponent(
    'Hola Productora EAR, deseo activar una alianza estratégica B2B como prescriptor o finca homologada.',
  )}`;

  return (
    <div className="min-h-screen bg-[#030305] text-white pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-x-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ALIANZAS_JSON_LD) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_JSON_LD) }}
      />

      <div className="mb-8">
        <span className="inline-block text-xs uppercase font-mono tracking-widest text-[#00E5FF] px-3 py-1 rounded-full bg-[#00E5FF]/10 border border-[#00E5FF]/20 transition-all duration-500 ease-out hover:bg-[#00E5FF]/20 hover:border-[#00E5FF]/50 hover:shadow-[0_0_24px_-6px_rgba(0,229,255,0.6)] hover:scale-[1.03] cursor-default">
          ECOSISTEMA S-CLASS
        </span>
        <h1 className="text-3xl sm:text-4xl font-black font-syne uppercase tracking-tight text-white mt-3 transition-colors duration-500 ease-out hover:text-[#00E5FF]/95">
          Red Soberana de Alianzas &amp; Fincas Homologadas
        </h1>
        <p className="text-sm text-zinc-400 font-mono mt-1 transition-colors duration-500 ease-out hover:text-zinc-300">
          Infraestructura de colaboración B2B con Split garantizado (80/10/10) y certificación de calidad técnica.
        </p>
      </div>

      <AllianceNetwork />

      {/* 🛡️ Alianzas / Prescriptores — Conversión & Presupuesto SSOT S-Class */}
      <section className="mt-14 rounded-3xl bg-[#09090d]/80 border border-white/10 backdrop-blur-md p-6 sm:p-10 transition-all duration-500 ease-out hover:border-[#00E5FF]/40 hover:shadow-[0_0_60px_-15px_rgba(0,229,255,0.35)] shadow-2xl group/section">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider text-[#00E5FF] bg-[#00E5FF]/10 border border-[#00E5FF]/20 transition-all duration-300 ease-out group-hover/section:bg-[#00E5FF]/15 group-hover/section:border-[#00E5FF]/40 group-hover/section:shadow-[0_0_20px_-6px_rgba(0,229,255,0.5)]">
              <Handshake
                size={14}
                className="transition-transform duration-300 ease-out group-hover/section:rotate-12 group-hover/section:scale-110"
              />{' '}
              Split Soberano 80/10/10 &bull; Sin Intermediarios
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-syne uppercase tracking-tight text-white transition-colors duration-500 ease-out group-hover/section:text-[#00E5FF]/95">
              Prescribe con Garantía Técnica &amp; Comisión Inmutable
            </h2>
            <p className="text-sm text-zinc-400 leading-relaxed font-sans transition-colors duration-500 ease-out group-hover/section:text-zinc-300">
              Cada prescripción queda blindada con contrato inteligente y depósito de retención (
              {DEPOSITO_STRIPE_EUR} € deducible). Tarifa Solista Premium oficial desde{' '}
              <span className="text-white font-bold">{TARIFA_BASE_SOLISTA_EUR} €</span> y sonorización
              calibrada a {WATTS_PER_PAX} W/pax.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row items-stretch sm:items-center gap-4 w-full lg:w-auto shrink-0">
            <Link
              href="/reservar/solista"
              className="group/cta relative overflow-hidden px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#ecb613] via-[#ffcf4d] to-[#ecb613] bg-[length:200%_100%] bg-left text-black font-bold text-xs uppercase tracking-wider text-center transition-all duration-500 ease-out hover:bg-right hover:brightness-110 hover:scale-[1.03] active:scale-[0.98] shadow-lg shadow-[#ecb613]/20 hover:shadow-xl hover:shadow-[#ecb613]/40 flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ecb613] focus-visible:ring-offset-2 focus-visible:ring-offset-[#030305]"
            >
              <span className="relative z-10">Contratar Solista ({TARIFA_BASE_SOLISTA_EUR} €)</span>
              <ArrowRight
                size={14}
                className="relative z-10 transition-transform duration-300 ease-out group-hover/cta:translate-x-1"
              />
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 ease-out group-hover/cta:translate-x-full"
              />
            </Link>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group/wa relative overflow-hidden px-6 py-3.5 rounded-2xl bg-[#092215] border border-emerald-500/40 text-emerald-400 font-bold text-xs uppercase tracking-wider text-center transition-all duration-300 ease-out hover:bg-emerald-500/20 hover:border-emerald-400/70 hover:scale-[1.03] active:scale-[0.98] hover:shadow-lg hover:shadow-emerald-500/20 flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#030305]"
            >
              <MessageCircle
                size={14}
                className="text-[#25D366] transition-transform duration-300 ease-out group-hover/wa:scale-110 group-hover/wa:rotate-6"
              />
              <span className="relative z-10">WhatsApp Alianzas ({CENTRALITA_EAR_OS})</span>
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-emerald-400/20 to-transparent transition-transform duration-700 ease-out group-hover/wa:translate-x-full"
              />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}