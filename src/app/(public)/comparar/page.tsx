import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import {
  CheckCircle2,
  XCircle,
  ShieldCheck,
  ArrowRight,
  Scale,
  Cpu,
  MessageCircle,
  CalendarCheck,
} from 'lucide-react';
import { MeshGradientBackground } from '@/components/sclass/MeshGradientBackground';
import {
  TARIFA_BASE_SOLISTA_EUR,
  DEPOSITO_STRIPE_EUR,
  CENTRALITA_EAR_OS,
} from '@/lib/constants/ear-os-ssot';

export const metadata: Metadata = {
  title: 'Matriz Comparativa S-Class vs Portales Tradicionales | Productora EAR',
  description:
    'Transparencia absoluta: Compara el Split 80/10/10, garantía acústica 12 W/pax y Price-Lock 100€ de Productora EAR frente a las comisiones ocultas de portales tradicionales.',
};

const TARIFA_SOLISTA_FORMATTED = TARIFA_BASE_SOLISTA_EUR.toFixed(2).replace('.', ',');
const DEPOSITO_FORMATTED = DEPOSITO_STRIPE_EUR.toFixed(2).replace('.', ',');
const WHATSAPP_HREF = `https://wa.me/${CENTRALITA_EAR_OS.replace(/\D/g, '')}`;

const comparisonItems = [
  {
    feature: 'Estructura de Comisión & Split',
    traditional: '20% - 30% comisión oculta al cliente y al artista',
    earOs: 'Split Soberano 80% Artista / 10% EAR OS / 10% VIMUME',
    highlight: true,
  },
  {
    feature: 'Transparencia Tarifaria (Base Solista)',
    traditional: 'Tarifas infladas con márgenes opacos sin desglose',
    earOs: `Tarifa Base Solista Edwin Agudelo: ${TARIFA_SOLISTA_FORMATTED} € fija y pública`,
    highlight: false,
  },
  {
    feature: 'Cálculo de Desplazamiento',
    traditional: 'Costes de transporte arbitrarios o inflados por provincia',
    earOs:
      '1,50 €/km exactos desde Méntrida a partir del km 50 (+120 € hotel si fin >= 3:00 AM o > 200 km)',
    highlight: true,
  },
  {
    feature: 'Calibración & Rider Acústico',
    traditional: 'Hardware no especificado, altavoces genéricos sin SPL medido',
    earOs: 'Garantía Acústica 12 W/pax (Bose F1 812 / S1 Pro, Shure Beta 87A)',
    highlight: false,
  },
  {
    feature: 'Reserva & Exclusividad de Fecha',
    traditional: 'Pagos del 50% por adelantado sin garantía de devolución',
    earOs: `Depósito de ${DEPOSITO_FORMATTED} € en Stripe (SHA-256 Price-Lock 72h)`,
    highlight: true,
  },
  {
    feature: 'Licitaciones Públicas B2G',
    traditional: 'Sin adaptación a la Ley de Contratos del Sector Público',
    earOs: 'Filtro B2G Art. 118 LCSP (<15.000 € y <75 dB SPL)',
    highlight: false,
  },
];

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: 'Tarifa Base Solista Edwin Agudelo — Productora EAR',
  description:
    'Servicio profesional de DJ y producción de evento con garantía acústica 12 W/pax, Split Soberano 80/10/10 y Price-Lock SHA-256.',
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
    eligibleQuantity: {
      '@type': 'QuantitativeValue',
      value: 1,
      unitCode: 'C62',
    },
  },
};

export default function CompararPage() {
  return (
    <MeshGradientBackground intensity="stage">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="min-h-screen w-full overflow-x-hidden pt-28 sm:pt-32 pb-40 px-4 md:px-8">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Header */}
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-5 py-2 bg-[#ecb613]/10 border border-[#ecb613]/30 rounded-full text-[#ecb613] text-[10px] font-mono uppercase tracking-[0.3em] shadow-[0_0_30px_rgba(236,182,19,0.15)]">
              <Scale size={14} className="animate-pulse" />
              MATRIZ DE TRANSPARENCIA S-CLASS // NO HOME REDIRECT
            </div>

            <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-white font-syne leading-[0.95]">
              POR QUÉ ELEGIR{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ecb613] via-amber-200 to-white italic">
                PRODUCTORA EAR
              </span>
            </h1>

            <p className="text-sm sm:text-base text-zinc-400 font-light leading-relaxed">
              Sin sorpresas de última hora. Compara la soberanía técnica y económica de EAR OS frente a las
              agencias y portales tradicionales.
            </p>
          </div>

          {/* Comparison Grid Matrix */}
          <div className="rounded-3xl bg-[#09090d]/80 border border-white/10 p-4 sm:p-8 backdrop-blur-2xl shadow-2xl space-y-6 transition-all duration-500 hover:border-[#ecb613]/30 hover:shadow-[0_0_60px_rgba(236,182,19,0.08)]">
            {/* Table Header */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-4 border-b border-white/10 font-syne font-bold uppercase text-sm tracking-wider">
              <div className="text-zinc-400 hidden md:block">Criterio de Evaluación</div>
              <div className="text-rose-400 bg-rose-950/20 p-3 rounded-2xl border border-rose-500/20 flex items-center justify-between">
                <span>Agencias / Portales Tradicionales</span>
                <XCircle size={18} className="text-rose-400 shrink-0" />
              </div>
              <div className="text-[#ecb613] bg-[#ecb613]/10 p-3 rounded-2xl border border-[#ecb613]/30 flex items-center justify-between">
                <span>Productora EAR OS (S-Class)</span>
                <ShieldCheck size={18} className="text-[#ecb613] shrink-0" />
              </div>
            </div>

            {/* Comparison Rows */}
            <div className="space-y-4 font-sans text-xs sm:text-sm">
              {comparisonItems.map((item, idx) => (
                <div
                  key={idx}
                  className={`grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-2xl border transition-all duration-300 hover:border-[#ecb613]/30 hover:bg-white/[0.04] ${
                    item.highlight ? 'bg-white/[0.03] border-white/10' : 'bg-transparent border-white/5'
                  }`}
                >
                  <div className="font-bold text-white font-syne flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF]" />
                    {item.feature}
                  </div>

                  <div className="text-zinc-400 bg-black/40 p-3 rounded-xl border border-white/5 space-y-1">
                    <span className="text-[10px] font-mono text-rose-400/80 uppercase block md:hidden">
                      Portales Tradicionales:
                    </span>
                    <p>{item.traditional}</p>
                  </div>

                  <div className="text-zinc-200 bg-[#ecb613]/5 p-3 rounded-xl border border-[#ecb613]/20 font-medium space-y-1">
                    <span className="text-[10px] font-mono text-[#ecb613] uppercase block md:hidden">
                      EAR OS S-Class:
                    </span>
                    <p className="flex items-start gap-2">
                      <CheckCircle2 size={16} className="text-[#ecb613] shrink-0 mt-0.5" />
                      <span>{item.earOs}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Footer Callouts */}
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6 p-6 rounded-3xl bg-[#09090d]/80 border border-white/10 backdrop-blur-2xl transition-all duration-500 hover:border-[#ecb613]/30">
            <div className="space-y-1 text-center lg:text-left">
              <h3 className="text-lg font-bold text-white font-syne uppercase">
                ¿Listo para configurar tu evento con tarifas reales?
              </h3>
              <p className="text-xs text-zinc-400">
                Reserva la Tarifa Base Solista por {TARIFA_SOLISTA_FORMATTED} € o abre el Cotizador Inteligente
                para personalizar tu propuesta en tiempo real.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
              <Link
                href="/reservar/solista"
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-[#ecb613] text-black font-syne font-bold text-xs uppercase tracking-wider hover:bg-amber-300 transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#ecb613]/20"
              >
                <CalendarCheck size={16} />
                <span>Reservar Solista</span>
                <ArrowRight size={14} />
              </Link>

              <Link
                href="/cotizador?mode=comparison"
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white/5 border border-white/15 text-white font-syne font-bold text-xs uppercase tracking-wider hover:bg-white/10 hover:border-[#ecb613]/40 transition-all flex items-center justify-center gap-2"
              >
                <Cpu size={16} />
                <span>Personalizar en Cotizador</span>
              </Link>

              <a
                href={WHATSAPP_HREF}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-syne font-bold text-xs uppercase tracking-wider hover:bg-emerald-500/20 transition-all flex items-center justify-center gap-2"
              >
                <MessageCircle size={16} />
                <span>WhatsApp Directo</span>
              </a>
            </div>
          </div>
        </div>
      </main>
    </MeshGradientBackground>
  );
}