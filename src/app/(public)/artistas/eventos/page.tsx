import type { Metadata } from 'next';
import Link from 'next/link';
import {
  TARIFA_BASE_SOLISTA_EUR,
  DEPOSITO_STRIPE_EUR,
  CENTRALITA_EAR_OS,
} from '@/lib/constants/ear-os-ssot';

export const metadata: Metadata = {
  title: 'Artistas para Eventos | EAR OS',
  description:
    'Contrata artistas en directo para bodas, eventos corporativos y celebraciones privadas. Tarifa solista transparente y reserva inmediata.',
  alternates: {
    canonical: '/artistas/eventos',
  },
  openGraph: {
    title: 'Artistas para Eventos | EAR OS',
    description:
      'Contrata artistas en directo para bodas, eventos corporativos y celebraciones privadas. Tarifa solista transparente y reserva inmediata.',
    url: '/artistas/eventos',
    type: 'website',
  },
};

const TIPOS_EVENTO = [
  {
    slug: 'bodas',
    titulo: 'Bodas',
    descripcion:
      'Ceremonias, cócteles y banquetes con música en directo seleccionada para cada momento.',
  },
  {
    slug: 'corporativos',
    titulo: 'Eventos Corporativos',
    descripcion:
      'Presentaciones, galas y team buildings con artistas profesionales y sonido certificado.',
  },
  {
    slug: 'privados',
    titulo: 'Celebraciones Privadas',
    descripcion:
      'Cumpleaños, aniversarios y fiestas privadas con formato solista o banda completa.',
  },
  {
    slug: 'festivales',
    titulo: 'Festivales y Salas',
    descripcion:
      'Programación de artistas para salas, festivales y ciclos culturales con rider técnico.',
  },
] as const;

const WHATSAPP_URL = `https://wa.me/${CENTRALITA_EAR_OS.replace(/\D/g, '')}`;

export default function ArtistasEventosPage() {
  const precioSolista = TARIFA_BASE_SOLISTA_EUR.toFixed(2);
  const deposito = DEPOSITO_STRIPE_EUR.toFixed(2);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: 'Artista Solista en Directo para Eventos',
    description:
      'Contratación de artista solista profesional para bodas, eventos corporativos y celebraciones privadas.',
    brand: {
      '@type': 'Brand',
      name: 'EAR OS',
    },
    offers: {
      '@type': 'Offer',
      url: '/reservar/solista',
      priceCurrency: 'EUR',
      price: precioSolista,
      availability: 'https://schema.org/InStock',
      priceValidUntil: '2026-12-31',
      eligibleQuantity: {
        '@type': 'QuantitativeValue',
        value: 1,
        unitCode: 'C62',
      },
    },
  };

  return (
    <main className="w-full overflow-x-hidden bg-[#050507] text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="mx-auto w-full max-w-6xl px-6 pt-24 pb-16">
        <p className="mb-4 text-xs uppercase tracking-[0.3em] text-white/50">
          EAR OS · Artistas
        </p>
        <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">
          Artistas en directo para tu evento
        </h1>
        <p className="mt-6 max-w-2xl text-base text-white/70">
          Selecciona el tipo de evento y accede a artistas verificados con tarifa
          transparente, disponibilidad en tiempo real y reserva inmediata.
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-4">
          <Link
            href="/reservar/solista"
            className="rounded-3xl bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-white/90"
          >
            Reservar solista · {precioSolista} €
          </Link>
          <Link
            href="/alquiler"
            className="rounded-3xl border border-white/15 bg-[#09090d]/80 px-6 py-3 text-sm font-semibold text-white transition hover:border-white/30 hover:bg-[#09090d]"
          >
            Ver packs de alquiler
          </Link>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-3xl border border-white/15 bg-[#09090d]/80 px-6 py-3 text-sm font-semibold text-white transition hover:border-white/30 hover:bg-[#09090d]"
          >
            WhatsApp {CENTRALITA_EAR_OS}
          </a>
        </div>

        <p className="mt-4 text-xs text-white/50">
          Depósito de reserva: {deposito} € · Confirmación inmediata
        </p>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 pb-24">
        <h2 className="mb-8 text-2xl font-semibold">Tipos de evento</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {TIPOS_EVENTO.map((tipo) => (
            <Link
              key={tipo.slug}
              href={`/eventos?tipo=${tipo.slug}`}
              className="group rounded-3xl border border-white/10 bg-[#09090d]/80 p-6 transition hover:-translate-y-0.5 hover:border-white/25 hover:bg-[#09090d]"
            >
              <h3 className="text-lg font-semibold text-white">{tipo.titulo}</h3>
              <p className="mt-3 text-sm text-white/70">{tipo.descripcion}</p>
              <span className="mt-6 inline-flex items-center text-sm font-medium text-white/80 transition group-hover:text-white">
                Explorar artistas →
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 pb-24">
        <div className="rounded-3xl border border-white/10 bg-[#09090d]/80 p-8 transition hover:border-white/25">
          <h2 className="text-2xl font-semibold">Reserva directa</h2>
          <p className="mt-3 max-w-2xl text-sm text-white/70">
            Tarifa solista oficial {precioSolista} € con depósito de {deposito} €.
            Sin intermediarios, sin sorpresas.
          </p>
          <div className="mt-6 flex flex-wrap gap-4">
            <Link
              href="/reservar/solista"
              className="rounded-3xl bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-white/90"
            >
              Reservar ahora
            </Link>
            <Link
              href="/checkout"
              className="rounded-3xl border border-white/15 bg-[#09090d]/80 px-6 py-3 text-sm font-semibold text-white transition hover:border-white/30 hover:bg-[#09090d]"
            >
              Ir al checkout
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}