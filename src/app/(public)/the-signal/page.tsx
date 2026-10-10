'use client';

import React from 'react';
import TheEarSignal from '@/app/components/TheEarSignal';
import {
  TARIFA_BASE_SOLISTA_EUR,
  DEPOSITO_STRIPE_EUR,
  CENTRALITA_EAR_OS,
} from '@/lib/constants/ear-os-ssot';

const WHATSAPP_HREF = `https://wa.me/${CENTRALITA_EAR_OS.replace(/\D/g, '')}`;

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: 'The Signal — EAR OS',
  description:
    'Superficie comercial de señalización y captación EAR OS. Reserva directa con tarifa solista transparente.',
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
    priceValidUntil: '2030-12-31',
    eligibleQuantity: {
      '@type': 'QuantitativeValue',
      value: 1,
      unitCode: 'C62',
    },
  },
  additionalProperty: [
    {
      '@type': 'PropertyValue',
      name: 'Depósito Stripe',
      value: `${DEPOSITO_STRIPE_EUR.toFixed(2)} EUR`,
    },
    {
      '@type': 'PropertyValue',
      name: 'Centralita',
      value: CENTRALITA_EAR_OS,
    },
  ],
};

export default function TheSignalPage() {
  return (
    <main className="min-h-screen w-full overflow-x-hidden bg-[#050505]">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-[#09090d]/80 border border-white/10 p-8 sm:p-12 transition-all duration-500 hover:border-white/20 hover:shadow-[0_0_60px_-15px_rgba(255,255,255,0.15)]">
          <p className="text-xs uppercase tracking-[0.3em] text-white/50">
            EAR OS · The Signal
          </p>
          <h1 className="mt-4 text-3xl sm:text-5xl font-semibold text-white tracking-tight">
            Señal comercial con precio transparente
          </h1>
          <p className="mt-6 max-w-2xl text-base sm:text-lg text-white/70 leading-relaxed">
            Tarifa solista oficial:{' '}
            <span className="text-white font-medium">
              {TARIFA_BASE_SOLISTA_EUR.toFixed(2)} €
            </span>{' '}
            · Depósito Stripe:{' '}
            <span className="text-white font-medium">
              {DEPOSITO_STRIPE_EUR.toFixed(2)} €
            </span>
            . Sin textos de &quot;consultar&quot;. Cierre directo.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <a
              href="/reservar/solista"
              className="inline-flex items-center justify-center rounded-2xl bg-white text-black px-6 py-3 text-sm font-semibold tracking-wide transition-all duration-300 hover:bg-white/90 hover:scale-[1.02] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
            >
              Reservar solista · {TARIFA_BASE_SOLISTA_EUR.toFixed(2)} €
            </a>
            <a
              href="/alquiler"
              className="inline-flex items-center justify-center rounded-2xl border border-white/15 bg-white/5 text-white px-6 py-3 text-sm font-semibold tracking-wide transition-all duration-300 hover:bg-white/10 hover:border-white/30 hover:scale-[1.02] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
            >
              Ver alquiler
            </a>
            <a
              href="/checkout"
              className="inline-flex items-center justify-center rounded-2xl border border-white/15 bg-transparent text-white px-6 py-3 text-sm font-semibold tracking-wide transition-all duration-300 hover:bg-white/5 hover:border-white/30 hover:scale-[1.02] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
            >
              Checkout
            </a>
            <a
              href={WHATSAPP_HREF}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-2xl border border-emerald-400/30 bg-emerald-400/10 text-emerald-200 px-6 py-3 text-sm font-semibold tracking-wide transition-all duration-300 hover:bg-emerald-400/20 hover:border-emerald-400/50 hover:scale-[1.02] focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/50"
            >
              WhatsApp · {CENTRALITA_EAR_OS}
            </a>
          </div>
        </div>

        <div className="mt-12 rounded-3xl bg-[#09090d]/80 border border-white/10 p-6 sm:p-10 transition-all duration-500 hover:border-white/20">
          <TheEarSignal />
        </div>
      </section>
    </main>
  );
}