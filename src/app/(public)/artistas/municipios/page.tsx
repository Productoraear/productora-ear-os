import React from 'react';
import Link from 'next/link';
import { generateArtistSEOMeta } from '@/lib/artists/seo';
import { Award, ShieldCheck, ArrowRight, Phone } from 'lucide-react';
import {
  TARIFA_BASE_SOLISTA_EUR,
  DEPOSITO_STRIPE_EUR,
  CENTRALITA_EAR_OS,
} from '@/lib/constants/ear-os-ssot';

export const metadata = generateArtistSEOMeta('ayuntamientos', 'municipios');

const WHATSAPP_HREF = `https://wa.me/${CENTRALITA_EAR_OS.replace(/\D/g, '')}`;

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: 'Servicio Artístico para Municipios y Ayuntamientos — EAR OS',
  description:
    'Servicio homologado para concejalías de festejos, ferias tradicionales y semanas culturales. Facturación Facturae y cumplimiento reglamentario.',
  brand: {
    '@type': 'Brand',
    name: 'EAR OS',
  },
  offers: {
    '@type': 'Offer',
    priceCurrency: 'EUR',
    price: TARIFA_BASE_SOLISTA_EUR.toFixed(2),
    availability: 'https://schema.org/InStock',
    url: 'https://ear-os.com/reservar/solista',
    priceValidUntil: '2026-12-31',
    eligibleQuantity: {
      '@type': 'QuantitativeValue',
      value: 1,
      unitCode: 'C62',
    },
  },
};

export default function ArtistasMunicipiosPage() {
  return (
    <main className="min-h-screen w-full overflow-x-hidden bg-[#030305] text-white pt-40 pb-24 font-sans selection:bg-[#ecb613]/30 selection:text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-4xl mx-auto px-6 space-y-16">
        {/* Header */}
        <div className="space-y-4 animate-[fadeIn_0.6s_ease-out]">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.25em] bg-[#ecb613]/10 text-[#ecb613] border border-[#ecb613]/20 transition-all duration-300 ease-out hover:bg-[#ecb613]/15 hover:border-[#ecb613]/40 hover:shadow-[0_0_20px_-5px_rgba(236,182,19,0.4)]">
              Administraciones
            </span>
            <span className="text-white/20 text-[9px] font-black uppercase tracking-widest font-mono transition-colors duration-300 hover:text-white/40">
              Municipalities OS
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter text-white font-syne">
            Municipios &amp; Ayuntamientos
          </h1>
          <p className="text-white/40 text-lg max-w-xl italic">
            Contratación pública para concejalías de festejos, ferias tradicionales y semanas culturales.
          </p>
        </div>

        {/* Info Blocks */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="group relative rounded-3xl bg-[#09090d]/80 border border-white/10 p-8 space-y-4 transition-all duration-500 ease-out hover:border-[#ecb613]/40 hover:bg-[#09090d] hover:-translate-y-1 hover:shadow-[0_20px_60px_-20px_rgba(236,182,19,0.15)] overflow-hidden">
            <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-[#ecb613]/5 to-transparent transition-transform duration-1000 ease-out group-hover:translate-x-full" />
            <Award
              className="relative text-[#ecb613] transition-transform duration-500 ease-out group-hover:scale-110 group-hover:rotate-[-4deg]"
              size={28}
            />
            <h3 className="relative text-lg font-black uppercase tracking-tight transition-colors duration-300 group-hover:text-[#ecb613]">
              Licitaciones y Contratos Públicos
            </h3>
            <p className="relative text-white/50 text-xs leading-relaxed transition-colors duration-300 group-hover:text-white/70">
              Integrados y certificados en plataformas públicas de contratación estatal. Facturación en formato Facturae y cumplimiento reglamentario.
            </p>
          </div>

          <div className="group relative rounded-3xl bg-[#09090d]/80 border border-white/10 p-8 space-y-4 transition-all duration-500 ease-out hover:border-[#ecb613]/40 hover:bg-[#09090d] hover:-translate-y-1 hover:shadow-[0_20px_60px_-20px_rgba(236,182,19,0.15)] overflow-hidden">
            <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-[#ecb613]/5 to-transparent transition-transform duration-1000 ease-out group-hover:translate-x-full" />
            <ShieldCheck
              className="relative text-[#ecb613] transition-transform duration-500 ease-out group-hover:scale-110 group-hover:rotate-[4deg]"
              size={28}
            />
            <h3 className="relative text-lg font-black uppercase tracking-tight transition-colors duration-300 group-hover:text-[#ecb613]">
              Formatos Flexibles
            </h3>
            <p className="relative text-white/50 text-xs leading-relaxed transition-colors duration-300 group-hover:text-white/70">
              Shows acústicos de plaza en formaciones de cámara reducidas y espectáculos sinfónicos masivos de gran afluencia popular.
            </p>
          </div>
        </div>

        {/* Pricing & CTA */}
        <div className="rounded-3xl bg-[#09090d]/80 border border-white/10 p-8 md:p-10 space-y-8 transition-all duration-500 ease-out hover:border-[#ecb613]/40 hover:shadow-[0_30px_80px_-30px_rgba(236,182,19,0.2)]">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div className="space-y-2">
              <span className="text-[9px] font-black uppercase tracking-[0.25em] text-[#ecb613]">
                Tarifa Oficial SSOT
              </span>
              <div className="flex items-baseline gap-3">
                <span className="text-5xl md:text-6xl font-black italic tracking-tighter text-white font-syne">
                  {TARIFA_BASE_SOLISTA_EUR} €
                </span>
                <span className="text-white/40 text-xs font-mono uppercase tracking-widest">
                  / sesión solista
                </span>
              </div>
              <p className="text-white/40 text-xs leading-relaxed max-w-md">
                Reserva garantizada con depósito de {DEPOSITO_STRIPE_EUR} €. Packs de inventario y formaciones ampliadas bajo presupuesto cerrado.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/reservar/solista"
                className="group relative inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-[#ecb613] text-black text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 ease-out hover:bg-white hover:scale-[1.03] hover:shadow-[0_15px_40px_-10px_rgba(236,182,19,0.5)] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ecb613] focus-visible:ring-offset-2 focus-visible:ring-offset-[#030305] overflow-hidden"
              >
                <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full" />
                <span className="relative">Reservar Solista</span>
                <ArrowRight
                  size={14}
                  className="relative transition-transform duration-300 ease-out group-hover:translate-x-1"
                />
              </Link>
              <a
                href={WHATSAPP_HREF}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 ease-out hover:bg-white/10 hover:border-[#ecb613]/40 hover:scale-[1.03] hover:shadow-[0_15px_40px_-15px_rgba(236,182,19,0.25)] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ecb613] focus-visible:ring-offset-2 focus-visible:ring-offset-[#030305] overflow-hidden"
              >
                <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-[#ecb613]/10 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full" />
                <Phone
                  size={14}
                  className="relative text-[#ecb613] transition-transform duration-300 ease-out group-hover:rotate-12"
                />
                <span className="relative">WhatsApp Directo</span>
              </a>
            </div>
          </div>

          <div className="pt-6 border-t border-white/5 flex flex-wrap gap-x-8 gap-y-3 text-[10px] font-mono uppercase tracking-widest text-white/30">
            <span className="transition-colors duration-300 hover:text-[#ecb613]/70">
              Facturae · Contratación Pública
            </span>
            <span className="transition-colors duration-300 hover:text-[#ecb613]/70">
              Depósito Stripe {DEPOSITO_STRIPE_EUR} €
            </span>
            <span className="transition-colors duration-300 hover:text-[#ecb613]/70">
              Centralita {CENTRALITA_EAR_OS}
            </span>
          </div>
        </div>
      </div>
    </main>
  );
}