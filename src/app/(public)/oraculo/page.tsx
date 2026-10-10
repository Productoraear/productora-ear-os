/**
 * 💎 ESPEJO /oraculo — Reutiliza la suite Oráculo Diamante Rojo.
 * Ruta canónica: /academia/oraculo. Este espejo mantiene la URL corta viva.
 *
 * Sellado S-Class: precio SSOT transparente, CTA de cierre real,
 * JSON-LD Offer coherente con el SSOT y estética Luxury OLED.
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import {
  TARIFA_BASE_SOLISTA_EUR,
  CENTRALITA_EAR_OS,
} from '@/lib/constants/ear-os-ssot';

export const metadata: Metadata = {
  title: 'Oráculo Diamante Rojo · Diagnóstico Estratégico | EAR OS',
  description:
    'Suite Oráculo Diamante Rojo: diagnóstico estratégico de alto rendimiento. Tarifa Solista transparente y reserva directa.',
  alternates: {
    canonical: '/academia/oraculo',
  },
};

const WHATSAPP_HREF = `https://wa.me/${CENTRALITA_EAR_OS.replace(/\D/g, '')}`;

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: 'Oráculo Diamante Rojo · Diagnóstico Estratégico',
  description:
    'Suite de diagnóstico estratégico de alto rendimiento operada por EAR OS.',
  brand: {
    '@type': 'Brand',
    name: 'EAR OS',
  },
  offers: {
    '@type': 'Offer',
    price: TARIFA_BASE_SOLISTA_EUR.toFixed(2),
    priceCurrency: 'EUR',
    availability: 'https://schema.org/InStock',
    url: '/reservar/solista',
  },
};

export default function OraculoEspejoPage() {
  return (
    <main className="w-full overflow-x-hidden bg-[#05050a] text-white">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 py-20">
        <header className="flex flex-col gap-4">
          <span className="text-xs uppercase tracking-[0.3em] text-white/50">
            EAR OS · Suite Oráculo
          </span>
          <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">
            Oráculo Diamante Rojo
          </h1>
          <p className="max-w-2xl text-base text-white/70">
            Diagnóstico estratégico de alto rendimiento. Precio transparente,
            sin letra pequeña y con reserva directa.
          </p>
        </header>

        <div className="grid gap-6 sm:grid-cols-2">
          <article className="rounded-3xl border border-white/10 bg-[#09090d]/80 p-8 transition-all duration-300 hover:border-white/20 hover:bg-[#0c0c12]/90">
            <h2 className="text-lg font-medium text-white/90">
              Tarifa Solista
            </h2>
            <p className="mt-4 text-4xl font-semibold">
              {TARIFA_BASE_SOLISTA_EUR} €
            </p>
            <p className="mt-2 text-sm text-white/60">
              Sesión única de diagnóstico estratégico.
            </p>
            <Link
              href="/reservar/solista"
              className="mt-6 inline-flex items-center justify-center rounded-2xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-medium text-white transition-all duration-300 hover:border-white/30 hover:bg-white/10"
            >
              Reservar ahora
            </Link>
          </article>

          <article className="rounded-3xl border border-white/10 bg-[#09090d]/80 p-8 transition-all duration-300 hover:border-white/20 hover:bg-[#0c0c12]/90">
            <h2 className="text-lg font-medium text-white/90">
              Packs de inventario
            </h2>
            <p className="mt-4 text-sm text-white/70">
              Consulta los packs disponibles con precio cerrado y condiciones
              transparentes.
            </p>
            <Link
              href="/alquiler"
              className="mt-6 inline-flex items-center justify-center rounded-2xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-medium text-white transition-all duration-300 hover:border-white/30 hover:bg-white/10"
            >
              Ver packs
            </Link>
          </article>
        </div>

        <div className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-[#09090d]/80 p-8 transition-all duration-300 hover:border-white/20">
          <h2 className="text-lg font-medium text-white/90">
            ¿Prefieres hablar directamente?
          </h2>
          <p className="text-sm text-white/60">
            Centralita EAR OS disponible para cierre inmediato.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href={WHATSAPP_HREF}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-2xl border border-emerald-400/30 bg-emerald-400/10 px-6 py-3 text-sm font-medium text-emerald-200 transition-all duration-300 hover:border-emerald-400/50 hover:bg-emerald-400/20"
            >
              WhatsApp {CENTRALITA_EAR_OS}
            </a>
            <Link
              href="/checkout"
              className="inline-flex items-center justify-center rounded-2xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-medium text-white transition-all duration-300 hover:border-white/30 hover:bg-white/10"
            >
              Ir al checkout
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}