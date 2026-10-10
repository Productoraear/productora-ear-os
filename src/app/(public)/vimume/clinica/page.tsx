'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck, FileText, Brain, Sparkles, MessageCircle, CalendarCheck } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import {
  TARIFA_BASE_SOLISTA_EUR,
  DEPOSITO_STRIPE_EUR,
  CENTRALITA_EAR_OS,
} from '@/lib/constants/ear-os-ssot';

const VIMUMEClinicalBlock = dynamic(
  () => import('@/modules/SClassScreens/PRO_VIMUMECLINICALBLOCK').then(m => m.VIMUMEClinicalBlock),
  { ssr: false }
);

const WHATSAPP_HREF = `https://wa.me/${CENTRALITA_EAR_OS.replace(/\D/g, '')}?text=${encodeURIComponent(
  'Hola, quiero información sobre el protocolo clínico VIMUME y la Tarifa Solista.'
)}`;

const PRICE_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: 'VIMUME — Autoridad Clínica & Pliegos B2G (Protocolo Gamma 40Hz)',
  description:
    'Protocolo de estimulación Gamma 40Hz (MIT), generación de memorias técnicas bajo Art. 118 LCSP y fondos NextGenerationEU.',
  brand: {
    '@type': 'Brand',
    name: 'EAR OS',
  },
  offers: {
    '@type': 'Offer',
    priceCurrency: 'EUR',
    price: TARIFA_BASE_SOLISTA_EUR.toFixed(2),
    availability: 'https://schema.org/InStock',
    url: '/reservar/solista',
    priceValidUntil: '2026-12-31',
  },
};

export default function VimumeClinicaPage() {
  const searchParams = useSearchParams();
  const mode = searchParams.get('mode');

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[#050505] text-[#f5f1e8] selection:bg-[#ecb613] selection:text-black font-sans pt-28 pb-32 px-4 md:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(PRICE_JSON_LD) }}
      />

      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Breadcrumb & Context */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-white/10">
          <div className="space-y-1">
            <Link
              href="/vimume"
              className="inline-flex items-center gap-2 text-xs font-mono text-pink-400 hover:text-pink-300 transition-colors mb-2"
            >
              <ArrowLeft size={14} />
              <span>Volver al Hub VIMUME</span>
            </Link>
            <h1 className="text-3xl md:text-5xl font-black uppercase text-white font-syne">
              AUTORIDAD CLÍNICA & <span className="text-[#ecb613]">PLIEGOS B2G</span>
            </h1>
            <p className="text-xs md:text-sm text-white/60">
              Protocolo de estimulación Gamma 40Hz (MIT), generación de memorias técnicas bajo Art. 118 LCSP y fondos NextGenerationEU.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#ecb613]/10 border border-[#ecb613]/30 text-[#ecb613] text-xs font-mono">
              <ShieldCheck size={14} />
              <span>Art. 118 LCSP (&lt;15.000€) Habilitado</span>
            </div>
            <Link
              href="/dossier"
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-white text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center gap-2"
            >
              <FileText size={14} className="text-pink-400" />
              <span>Descargar Pliego B2G</span>
            </Link>
          </div>
        </div>

        {/* Bloque de Precio Transparente SSOT + CTA de Cierre Real */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 rounded-3xl bg-[#09090d]/80 border border-white/10 p-6 md:p-8 hover:border-[#ecb613]/40 transition-all duration-300">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles size={16} className="text-[#ecb613]" />
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#ecb613]">
                Tarifa Oficial SSOT
              </span>
            </div>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
              <div>
                <p className="text-xs font-mono uppercase tracking-wider text-white/50 mb-1">
                  Tarifa Solista
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl md:text-6xl font-black text-white font-syne">
                    {TARIFA_BASE_SOLISTA_EUR}
                  </span>
                  <span className="text-2xl font-bold text-[#ecb613]">€</span>
                </div>
                <p className="text-xs text-white/50 mt-2 font-mono">
                  Reserva garantizada con depósito de {DEPOSITO_STRIPE_EUR} € vía Stripe.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/reservar/solista"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#ecb613] hover:bg-[#f5c93a] text-black text-xs font-mono font-bold uppercase tracking-wider transition-all hover:scale-[1.02]"
                >
                  <CalendarCheck size={14} />
                  <span>Reservar Solista</span>
                </Link>
                <a
                  href={WHATSAPP_HREF}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-white text-xs font-mono font-bold uppercase tracking-wider transition-all hover:scale-[1.02]"
                >
                  <MessageCircle size={14} className="text-emerald-400" />
                  <span>WhatsApp Directo</span>
                </a>
              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-[#09090d]/80 border border-white/10 p-6 md:p-8 hover:border-pink-400/40 transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Brain size={16} className="text-pink-400" />
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-pink-400">
                  Packs de Inventario
                </span>
              </div>
              <p className="text-sm text-white/70 leading-relaxed">
                Combina el protocolo clínico con packs de inventario B2G para licitaciones y despliegues institucionales.
              </p>
            </div>
            <Link
              href="/alquiler"
              className="mt-6 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-white text-xs font-mono font-bold uppercase tracking-wider transition-all hover:scale-[1.02]"
            >
              <FileText size={14} className="text-pink-400" />
              <span>Ver Packs de Inventario</span>
            </Link>
          </div>
        </div>

        {/* Dynamic Clinical Block */}
        <VIMUMEClinicalBlock />
      </div>
    </div>
  );
}