import React from 'react';
import type { Metadata } from 'next';
import JardinesLaCartujaGrandSlam from '@/components/fincas/JardinesLaCartujaGrandSlam';
import {
  TARIFA_BASE_SOLISTA_EUR,
  DEPOSITO_STRIPE_EUR,
  CENTRALITA_EAR_OS,
} from '@/lib/constants/ear-os-ssot';

export const metadata: Metadata = {
  title: 'Jardines La Cartuja · Oferta Irresistible S-Class | EAR OS',
  description: `Experiencia inmersiva y cotizador en tiempo real para Jardines La Cartuja (El Puig, Valencia). Reserva de depósito de ${DEPOSITO_STRIPE_EUR} € Price-Lock y garantía acústica S-Class.`,
};

const SITE_URL = 'https://ear-os.com';
const PAGE_URL = `${SITE_URL}/fincas/jardines-la-cartuja`;
const WHATSAPP_URL = `https://wa.me/${CENTRALITA_EAR_OS.replace(/\D/g, '')}`;

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: 'Jardines La Cartuja · Experiencia S-Class EAR OS',
  description:
    'Experiencia inmersiva y cotizador en tiempo real para Jardines La Cartuja (El Puig, Valencia). Reserva de depósito Price-Lock y garantía acústica S-Class.',
  brand: {
    '@type': 'Brand',
    name: 'EAR OS',
  },
  offers: {
    '@type': 'Offer',
    url: PAGE_URL,
    priceCurrency: 'EUR',
    price: TARIFA_BASE_SOLISTA_EUR.toFixed(2),
    availability: 'https://schema.org/InStock',
    priceValidUntil: '2026-12-31',
    seller: {
      '@type': 'Organization',
      name: 'EAR OS',
      telephone: `+${CENTRALITA_EAR_OS.replace(/\D/g, '')}`,
    },
  },
};

export default function JardinesLaCartujaPage() {
  return (
    <div className="w-full overflow-x-hidden min-h-screen bg-[#030305]">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="w-full px-4 sm:px-6 lg:px-10 pt-10 pb-6">
        <div className="mx-auto max-w-6xl rounded-3xl bg-[#09090d]/80 border border-white/10 p-6 sm:p-10 transition-all duration-500 hover:border-white/20 hover:shadow-[0_0_60px_-15px_rgba(255,255,255,0.15)]">
          <p className="text-xs uppercase tracking-[0.3em] text-white/50">
            Finca S-Class · El Puig, Valencia
          </p>
          <h1 className="mt-3 text-3xl sm:text-5xl font-semibold text-white tracking-tight">
            Jardines La Cartuja
          </h1>
          <p className="mt-4 max-w-3xl text-sm sm:text-base text-white/70 leading-relaxed">
            Experiencia inmersiva con cotizador en tiempo real y garantía acústica S-Class.
            Reserva con depósito Price-Lock de {DEPOSITO_STRIPE_EUR} € y asegura tu fecha.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="rounded-2xl bg-white/5 border border-white/10 px-5 py-4">
              <p className="text-[11px] uppercase tracking-[0.25em] text-white/50">
                Tarifa Solista
              </p>
              <p className="mt-1 text-2xl font-semibold text-white">
                {TARIFA_BASE_SOLISTA_EUR} €
              </p>
              <p className="text-xs text-white/50 mt-1">
                Depósito Price-Lock: {DEPOSITO_STRIPE_EUR} €
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <a
                href="/reservar/solista"
                className="inline-flex items-center justify-center rounded-2xl bg-white text-black px-6 py-3 text-sm font-semibold transition-all duration-300 hover:bg-white/90 hover:scale-[1.02]"
              >
                Reservar Solista
              </a>
              <a
                href="/alquiler"
                className="inline-flex items-center justify-center rounded-2xl bg-white/5 text-white border border-white/15 px-6 py-3 text-sm font-semibold transition-all duration-300 hover:bg-white/10 hover:border-white/30"
              >
                Ver Alquiler
              </a>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-300 border border-emerald-400/20 px-6 py-3 text-sm font-semibold transition-all duration-300 hover:bg-emerald-500/20 hover:border-emerald-400/40"
              >
                WhatsApp +{CENTRALITA_EAR_OS}
              </a>
            </div>
          </div>
        </div>
      </section>

      <JardinesLaCartujaGrandSlam initialEditMode={false} />
    </div>
  );
}