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

interface TipoEvento {
  readonly slug: string;
  readonly titulo: string;
  readonly descripcion: string;
  readonly artistasDisponibles: number;
  readonly duracionMediaMin: number;
  readonly formatos: readonly string[];
}

const TIPOS_EVENTO: readonly TipoEvento[] = [
  {
    slug: 'bodas',
    titulo: 'Bodas',
    descripcion:
      'Ceremonia, cóctel y banquete con repertorio adaptado a cada tramo horario.',
    artistasDisponibles: 42,
    duracionMediaMin: 180,
    formatos: ['Solista', 'Dúo', 'Trío'],
  },
  {
    slug: 'corporativos',
    titulo: 'Eventos Corporativos',
    descripcion:
      'Presentaciones, galas y team buildings con sonido certificado y rider técnico.',
    artistasDisponibles: 28,
    duracionMediaMin: 120,
    formatos: ['Solista', 'Dúo', 'Banda'],
  },
  {
    slug: 'privados',
    titulo: 'Celebraciones Privadas',
    descripcion:
      'Cumpleaños, aniversarios y fiestas con formato solista o banda completa.',
    artistasDisponibles: 36,
    duracionMediaMin: 150,
    formatos: ['Solista', 'Dúo', 'Banda'],
  },
  {
    slug: 'festivales',
    titulo: 'Festivales y Salas',
    descripcion:
      'Programación para salas, festivales y ciclos culturales con rider técnico completo.',
    artistasDisponibles: 19,
    duracionMediaMin: 60,
    formatos: ['Solista', 'Dúo', 'Banda'],
  },
] as const;

const WHATSAPP_URL = `https://wa.me/${CENTRALITA_EAR_OS.replace(/\D/g, '')}`;

const CTA_PRIMARY_CLASS =
  'group/cta relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-3xl bg-white px-6 py-3 text-sm font-semibold text-black shadow-[0_0_0_0_rgba(255,255,255,0)] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_8px_30px_-8px_rgba(255,255,255,0.45)] active:translate-y-0 active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white motion-reduce:transform-none motion-reduce:transition-none';

const CTA_SECONDARY_CLASS =
  'group/cta relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-3xl border border-white/15 bg-[#09090d]/80 px-6 py-3 text-sm font-semibold text-white transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-white/35 hover:bg-[#0d0d12] hover:shadow-[0_8px_30px_-12px_rgba(255,255,255,0.25)] active:translate-y-0 active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white motion-reduce:transform-none motion-reduce:transition-none';

const CARD_CLASS =
  'group relative overflow-hidden rounded-3xl border border-white/10 bg-[#09090d]/80 p-6 transition-all duration-300 ease-out hover:-translate-y-1 hover:border-white/25 hover:bg-[#0d0d12] hover:shadow-[0_20px_50px_-20px_rgba(255,255,255,0.18)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white motion-reduce:transform-none motion-reduce:transition-none';

function EmptyState({ mensaje }: { readonly mensaje: string }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="rounded-3xl border border-dashed border-white/15 bg-[#09090d]/60 p-10 text-center"
    >
      <p className="text-sm font-medium text-white/70">{mensaje}</p>
      <p className="mt-2 text-xs text-white/40">
        Vuelve a intentarlo en unos minutos o contacta por WhatsApp.
      </p>
    </div>
  );
}

function ErrorState({ mensaje }: { readonly mensaje: string }) {
  return (
    <div
      role="alert"
      aria-live="assertive"
      className="rounded-3xl border border-red-500/30 bg-red-500/5 p-10 text-center"
    >
      <p className="text-sm font-semibold text-red-300">{mensaje}</p>
      <p className="mt-2 text-xs text-white/50">
        Si el problema persiste, escríbenos por WhatsApp {CENTRALITA_EAR_OS}.
      </p>
    </div>
  );
}

function LoadingState() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className="grid grid-cols-1 gap-6 sm:grid-cols-2"
    >
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          className="animate-pulse rounded-3xl border border-white/10 bg-[#09090d]/80 p-6"
        >
          <div className="h-5 w-1/2 rounded bg-white/10" />
          <div className="mt-4 h-3 w-full rounded bg-white/5" />
          <div className="mt-2 h-3 w-4/5 rounded bg-white/5" />
          <div className="mt-6 h-3 w-1/3 rounded bg-white/10" />
        </div>
      ))}
    </div>
  );
}

export default function ArtistasEventosPage() {
  const precioSolista = TARIFA_BASE_SOLISTA_EUR.toFixed(2);
  const deposito = DEPOSITO_STRIPE_EUR.toFixed(2);
  const totalArtistas = TIPOS_EVENTO.reduce(
    (acc, tipo) => acc + tipo.artistasDisponibles,
    0,
  );

  const tieneTipos = TIPOS_EVENTO.length > 0;
  const tieneArtistas = totalArtistas > 0;

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
    <main className="w-full overflow-x-hidden bg-[#030305] text-white">
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
          {tieneArtistas
            ? `${totalArtistas} artistas verificados disponibles en ${TIPOS_EVENTO.length} tipos de evento. Tarifa solista ${precioSolista} €, depósito ${deposito} € y confirmación inmediata.`
            : `Tarifa solista ${precioSolista} €, depósito ${deposito} € y confirmación inmediata.`}
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-4">
          <Link href="/reservar/solista" className={CTA_PRIMARY_CLASS}>
            <span className="relative z-10">
              Reservar solista · {precioSolista} €
            </span>
            <span
              aria-hidden="true"
              className="relative z-10 transition-transform duration-300 ease-out group-hover/cta:translate-x-0.5 motion-reduce:transform-none"
            >
              →
            </span>
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-black/10 to-transparent transition-transform duration-700 ease-out group-hover/cta:translate-x-full motion-reduce:hidden"
            />
          </Link>
          <Link href="/alquiler" className={CTA_SECONDARY_CLASS}>
            <span className="relative z-10">Ver packs de alquiler</span>
            <span
              aria-hidden="true"
              className="relative z-10 transition-transform duration-300 ease-out group-hover/cta:translate-x-0.5 motion-reduce:transform-none"
            >
              →
            </span>
          </Link>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={CTA_SECONDARY_CLASS}
          >
            <span className="relative z-10">WhatsApp {CENTRALITA_EAR_OS}</span>
          </a>
        </div>

        <p className="mt-4 text-xs text-white/50">
          Depósito de reserva: {deposito} € · Confirmación inmediata
        </p>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 pb-24">
        <h2 className="mb-8 text-2xl font-semibold">Tipos de evento</h2>
        {!tieneTipos ? (
          <EmptyState mensaje="Todavía no hay tipos de evento publicados." />
        ) : !tieneArtistas ? (
          <ErrorState mensaje="No hay artistas disponibles en este momento." />
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {TIPOS_EVENTO.map((tipo) => (
              <Link key={tipo.slug} href={`/eventos?tipo=${tipo.slug}`} className={CARD_CLASS}>
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -inset-px rounded-3xl bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100 motion-reduce:transition-none"
                />
                <div className="relative">
                  <h3 className="text-lg font-semibold text-white">
                    {tipo.titulo}
                  </h3>
                  <p className="mt-3 text-sm text-white/70">{tipo.descripcion}</p>
                  <dl className="mt-4 grid grid-cols-2 gap-3 text-xs text-white/60">
                    <div>
                      <dt className="uppercase tracking-wider text-white/40">
                        Artistas
                      </dt>
                      <dd className="mt-1 text-sm font-medium text-white/90">
                        {tipo.artistasDisponibles}
                      </dd>
                    </div>
                    <div>
                      <dt className="uppercase tracking-wider text-white/40">
                        Duración media
                      </dt>
                      <dd className="mt-1 text-sm font-medium text-white/90">
                        {tipo.duracionMediaMin} min
                      </dd>
                    </div>
                  </dl>
                  <p className="mt-4 text-xs text-white/50">
                    Formatos: {tipo.formatos.join(' · ')}
                  </p>
                  <span className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-white/80 transition-colors duration-300 ease-out group-hover:text-white motion-reduce:transition-none">
                    Explorar artistas
                    <span
                      aria-hidden="true"
                      className="transition-transform duration-300 ease-out group-hover:translate-x-1 motion-reduce:transform-none"
                    >
                      →
                    </span>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 pb-24">
        <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-[#09090d]/80 p-8 transition-all duration-300 ease-out hover:border-white/25 hover:shadow-[0_20px_50px_-20px_rgba(255,255,255,0.15)] motion-reduce:transition-none">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -inset-px rounded-3xl bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100 motion-reduce:transition-none"
          />
          <div className="relative">
            <h2 className="text-2xl font-semibold">Reserva directa</h2>
            <p className="mt-3 max-w-2xl text-sm text-white/70">
              Tarifa solista oficial {precioSolista} € con depósito de {deposito}{' '}
              €. Sin intermediarios, sin sorpresas.
            </p>
            <div className="mt-6 flex flex-wrap gap-4">
              <Link href="/reservar/solista" className={CTA_PRIMARY_CLASS}>
                <span className="relative z-10">Reservar ahora</span>
                <span
                  aria-hidden="true"
                  className="relative z-10 transition-transform duration-300 ease-out group-hover/cta:translate-x-0.5 motion-reduce:transform-none"
                >
                  →
                </span>
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-black/10 to-transparent transition-transform duration-700 ease-out group-hover/cta:translate-x-full motion-reduce:hidden"
                />
              </Link>
              <Link href="/checkout" className={CTA_SECONDARY_CLASS}>
                <span className="relative z-10">Ir al checkout</span>
                <span
                  aria-hidden="true"
                  className="relative z-10 transition-transform duration-300 ease-out group-hover/cta:translate-x-0.5 motion-reduce:transform-none"
                >
                  →
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}