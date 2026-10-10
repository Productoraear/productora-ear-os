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
    <main className="min-h-screen w-full overflow-x-hidden bg-[#050505] text-white pt-40 pb-24 font-sans">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-4xl mx-auto px-6 space-y-16">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.25em] bg-[#ecb613]/10 text-[#ecb613] border border-[#ecb613]/20">
              Administraciones
            </span>
            <span className="text-white/20 text-[9px] font-black uppercase tracking-widest font-mono">
              Municipalities OS
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter text-white font-syne">
            Municipios &amp; Ayuntamientos
          </h1>
          <p className="text-white/40 text-lg max-w-xl italic">
            Servicio homologado para concejalías de festejos, ferias tradicionales y semanas culturales.
          </p>
        </div>

        {/* Info Blocks */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="rounded-3xl bg-[#09090d]/80 border border-white/10 p-8 space-y-4 transition-all duration-300 hover:border-[#ecb613]/40 hover:bg-[#09090d] hover:-translate-y-1">
            <Award className="text-[#ecb613]" size={28} />
            <h3 className="text-lg font-black uppercase tracking-tight">
              Licitaciones y Contratos Públicos
            </h3>
            <p className="text-white/50 text-xs leading-relaxed">
              Estamos integrados y certificados en plataformas públicas de contratación estatal. Facilitamos facturación en formato Facturae y cumplimiento reglamentario absoluto.
            </p>
          </div>

          <div className="rounded-3xl bg-[#09090d]/80 border border-white/10 p-8 space-y-4 transition-all duration-300 hover:border-[#ecb613]/40 hover:bg-[#09090d] hover:-translate-y-1">
            <ShieldCheck className="text-[#ecb613]" size={28} />
            <h3 className="text-lg font-black uppercase tracking-tight">Formatos Flexibles</h3>
            <p className="text-white/50 text-xs leading-relaxed">
              Desde shows acústicos de plaza en formaciones de cámara reducidas hasta espectáculos sinfónicos masivos de gran afluencia popular.
            </p>
          </div>
        </div>

        {/* Pricing & CTA */}
        <div className="rounded-3xl bg-[#09090d]/80 border border-white/10 p-8 md:p-10 space-y-8 transition-all duration-300 hover:border-[#ecb613]/40">
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
                Reserva garantizada con depósito de {DEPOSITO_STRIPE_EUR} €. Packs de inventario y formaciones ampliadas disponibles bajo presupuesto cerrado.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/reservar/solista"
                className="group inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-[#ecb613] text-black text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 hover:bg-white hover:scale-[1.02]"
              >
                Reservar Solista
                <ArrowRight
                  size={14}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>
              <a
                href={WHATSAPP_HREF}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 hover:bg-white/10 hover:border-[#ecb613]/40"
              >
                <Phone size={14} className="text-[#ecb613]" />
                WhatsApp Directo
              </a>
            </div>
          </div>

          <div className="pt-6 border-t border-white/5 flex flex-wrap gap-x-8 gap-y-3 text-[10px] font-mono uppercase tracking-widest text-white/30">
            <span>Facturae · Contratación Pública</span>
            <span>Depósito Stripe {DEPOSITO_STRIPE_EUR} €</span>
            <span>Centralita {CENTRALITA_EAR_OS}</span>
          </div>
        </div>
      </div>
    </main>
  );
}