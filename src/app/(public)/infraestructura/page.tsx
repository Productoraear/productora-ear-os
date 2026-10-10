import type { Metadata } from 'next';
import Link from 'next/link';
import {
  TARIFA_BASE_SOLISTA_EUR,
  DEPOSITO_STRIPE_EUR,
  CENTRALITA_EAR_OS,
} from '@/lib/constants/ear-os-ssot';

export const metadata: Metadata = {
  title: 'Infraestructura | Productora EAR',
  description:
    'Infraestructura técnica de Productora EAR: frontend, APIs, datos y despliegue. Reserva directa desde 350 €.',
};

const WHATSAPP_HREF = `https://wa.me/${CENTRALITA_EAR_OS.replace(/\D/g, '')}`;

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: 'Infraestructura Técnica Productora EAR',
  description:
    'Arquitectura técnica de Productora EAR: frontend Next.js 15, APIs tipadas, modelos de datos y despliegue continuo.',
  brand: {
    '@type': 'Brand',
    name: 'Productora EAR',
  },
  offers: {
    '@type': 'Offer',
    price: TARIFA_BASE_SOLISTA_EUR.toFixed(2),
    priceCurrency: 'EUR',
    availability: 'https://schema.org/InStock',
    url: 'https://productora-ear.com/reservar/solista',
    priceValidUntil: '2026-12-31',
    eligibleQuantity: {
      '@type': 'QuantitativeValue',
      value: 1,
      unitCode: 'C62',
    },
  },
};

const pillars = [
  {
    title: 'Frontend',
    text: 'Next.js 15 con App Router, TypeScript estricto y una estética OLED consistente.',
  },
  {
    title: 'APIs',
    text: 'Rutas de API tipadas para perfiles, oráculos y flujos de negocio críticos.',
  },
  {
    title: 'Datos',
    text: 'Modelos de datos estructurados y validación en frontera para mantener integridad.',
  },
  {
    title: 'Despliegue',
    text: 'Build estático, verificación de tipos y despliegue continuo con mínima fricción.',
  },
];

export default function InfraestructuraPage() {
  return (
    <main className="w-full overflow-x-hidden min-h-screen bg-[#030305] text-[#f5f5f7] px-6 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mx-auto w-full max-w-5xl">
        <header className="mb-10">
          <p className="text-xs uppercase tracking-[0.3em] text-[#a1a1aa] mb-3">
            Productora EAR · Zona Cero
          </p>
          <h1 className="text-4xl md:text-5xl font-semibold leading-tight mb-4">
            Infraestructura
          </h1>
          <p className="text-lg text-[#a1a1aa] max-w-2xl">
            Arquitectura técnica de Productora EAR enfocada en rendimiento, seguridad y
            mantenibilidad. Reserva directa desde{' '}
            <span className="text-white font-semibold">
              {TARIFA_BASE_SOLISTA_EUR} €
            </span>{' '}
            (depósito Stripe {DEPOSITO_STRIPE_EUR} €).
          </p>
        </header>

        <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
          {pillars.map((pillar) => (
            <article
              key={pillar.title}
              className="rounded-3xl bg-[#09090d]/80 border border-white/10 p-6 transition-all duration-300 hover:border-white/25 hover:bg-[#0d0d12]/90 hover:-translate-y-0.5"
            >
              <h2 className="text-lg font-semibold mb-2">{pillar.title}</h2>
              <p className="text-[15px] text-[#a1a1aa] leading-relaxed m-0">
                {pillar.text}
              </p>
            </article>
          ))}
        </section>

        <section className="rounded-3xl bg-[#09090d]/80 border border-white/10 p-8 transition-all duration-300 hover:border-white/25">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-[#a1a1aa] mb-2">
                Tarifa Solista
              </p>
              <p className="text-3xl font-semibold text-white">
                {TARIFA_BASE_SOLISTA_EUR} €
              </p>
              <p className="text-sm text-[#a1a1aa] mt-1">
                Depósito de reserva: {DEPOSITO_STRIPE_EUR} € · Confirmación inmediata
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/reservar/solista"
                className="inline-flex items-center justify-center rounded-2xl bg-white text-black font-semibold px-6 py-3 transition-all duration-300 hover:bg-[#e5e5ea] hover:scale-[1.02]"
              >
                Reservar Solista
              </Link>
              <Link
                href="/alquiler"
                className="inline-flex items-center justify-center rounded-2xl border border-white/15 text-white font-semibold px-6 py-3 transition-all duration-300 hover:border-white/40 hover:bg-white/5"
              >
                Ver Alquiler
              </Link>
              <a
                href={WHATSAPP_HREF}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-2xl border border-white/15 text-white font-semibold px-6 py-3 transition-all duration-300 hover:border-white/40 hover:bg-white/5"
              >
                WhatsApp {CENTRALITA_EAR_OS}
              </a>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}