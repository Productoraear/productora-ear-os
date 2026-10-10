import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  TARIFA_BASE_SOLISTA_EUR,
  DEPOSITO_STRIPE_EUR,
  CENTRALITA_EAR_OS,
} from '@/lib/constants/ear-os-ssot';

export const metadata: Metadata = {
  title: 'Catálogo Integral 360 | EAR OS — Entidades Públicas y Privadas',
  description:
    'Catálogo integral 360 de servicios técnicos para entidades públicas y privadas: escenarios, sonido, iluminación, pirotecnia y personal técnico. Tarifa Solista 350 € y packs de inventario con pliegos B2G.',
  alternates: {
    canonical: '/instituciones/catalogo-360',
  },
  openGraph: {
    title: 'Catálogo Integral 360 | EAR OS',
    description:
      'Servicios técnicos integrales para entidades públicas y privadas. Tarifa Solista 350 € y packs de inventario con pliegos B2G.',
    type: 'website',
  },
};

const WHATSAPP_HREF = `https://wa.me/${CENTRALITA_EAR_OS.replace(/\D/g, '')}`;

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: 'Catálogo Integral 360 — Servicios Técnicos EAR OS',
  description:
    'Catálogo integral 360 de servicios técnicos para entidades públicas y privadas: escenarios, sonido, iluminación, pirotecnia y personal técnico cualificado.',
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
    eligibleQuantity: {
      '@type': 'QuantitativeValue',
      unitCode: 'C62',
      value: 1,
    },
  },
};

const Catalogo360 = () => {
  return (
    <div className="w-full overflow-x-hidden bg-black text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="mx-auto w-full max-w-6xl px-6 py-16 md:py-24">
        <header className="mb-12">
          <p className="mb-3 text-xs uppercase tracking-[0.3em] text-white/50">
            EAR OS · Instituciones
          </p>
          <h1 className="text-4xl font-bold leading-tight md:text-5xl">
            Catálogo Integral 360 para Entidades Públicas y Privadas
          </h1>
          <p className="mt-6 max-w-3xl text-base leading-relaxed text-white/70 md:text-lg">
            Ofrecemos un catálogo completo de servicios técnicos que abarcan desde
            escenarios hasta iluminación, pasando por sonido y pirotecnia, con
            personal técnico altamente cualificado.
          </p>
        </header>

        <div className="grid gap-6 md:grid-cols-2">
          <article className="rounded-3xl bg-[#09090d]/80 border border-white/10 p-8 transition-all duration-300 hover:border-white/20 hover:bg-[#0c0c12]/90 hover:-translate-y-0.5">
            <h2 className="text-xl font-semibold text-white">
              Cobertura técnica integral
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-white/70">
              Nuestro catálogo está diseñado para satisfacer las necesidades de
              entidades públicas y privadas, proporcionando una visión integral
              de nuestros servicios. Cada servicio se detalla con transparencia
              y pliegos B2G.
            </p>
          </article>

          <article className="rounded-3xl bg-[#09090d]/80 border border-white/10 p-8 transition-all duration-300 hover:border-white/20 hover:bg-[#0c0c12]/90 hover:-translate-y-0.5">
            <h2 className="text-xl font-semibold text-white">
              Tarifa Solista
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-white/70">
              Acceso directo a la Tarifa Solista oficial con reserva garantizada
              mediante depósito de {DEPOSITO_STRIPE_EUR} €.
            </p>
            <p className="mt-6 text-3xl font-bold text-white">
              {TARIFA_BASE_SOLISTA_EUR} €
              <span className="ml-2 text-sm font-normal text-white/50">
                / servicio
              </span>
            </p>
            <Link
              href="/reservar/solista"
              className="mt-6 inline-flex items-center justify-center rounded-2xl bg-white px-6 py-3 text-sm font-semibold text-black transition-all duration-300 hover:bg-white/90 hover:scale-[1.02]"
            >
              Reservar Tarifa Solista
            </Link>
          </article>
        </div>

        <div className="mt-12 rounded-3xl bg-[#09090d]/80 border border-white/10 p-8 transition-all duration-300 hover:border-white/20">
          <h2 className="text-xl font-semibold text-white">
            Packs de inventario y pliegos B2G
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-white/70">
            Consulta los packs de inventario disponibles y solicita el pliego
            B2G adaptado a tu entidad. Cierre directo por WhatsApp o vía
            checkout oficial.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/alquiler"
              className="inline-flex items-center justify-center rounded-2xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-white/10 hover:border-white/25"
            >
              Ver packs de inventario
            </Link>
            <Link
              href="/checkout"
              className="inline-flex items-center justify-center rounded-2xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-white/10 hover:border-white/25"
            >
              Ir al checkout
            </Link>
            <a
              href={WHATSAPP_HREF}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-2xl bg-emerald-500/90 px-6 py-3 text-sm font-semibold text-black transition-all duration-300 hover:bg-emerald-400 hover:scale-[1.02]"
            >
              WhatsApp {CENTRALITA_EAR_OS}
            </a>
          </div>
        </div>

        <p className="mt-10 text-sm text-white/60">
          Para obtener más información o cotizar alguno de nuestros servicios,
          contacta con la centralita oficial:{' '}
          <a
            href={WHATSAPP_HREF}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-white underline decoration-white/30 underline-offset-4 transition-colors hover:decoration-white"
          >
            {CENTRALITA_EAR_OS}
          </a>
          . Estamos a tu disposición.
        </p>
      </section>
    </div>
  );
};

export default Catalogo360;