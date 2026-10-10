import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { generateArtistSEOMeta } from '@/lib/artists/seo';
import { MapPin, Globe, Sparkles, ArrowRight } from 'lucide-react';

const SITE_URL = 'https://productoraear.com';
const CANONICAL_PATH = '/artistas/ciudades';

export const metadata: Metadata = {
  ...generateArtistSEOMeta('eventos', 'principales ciudades'),
  title: 'Artistas por Ciudades | Cobertura Nacional — Productora EAR',
  description:
    'Zonas de actuación preferente de Productora EAR: Madrid, Barcelona, Sevilla, Valencia y Zaragoza. Desplazamiento bonificado y equipo técnico localizado.',
  alternates: {
    canonical: `${SITE_URL}${CANONICAL_PATH}`,
  },
  openGraph: {
    title: 'Artistas por Ciudades | Cobertura Nacional — Productora EAR',
    description:
      'Zonas de actuación preferente con desplazamiento bonificado y equipo técnico localizado en las principales ciudades de España.',
    url: `${SITE_URL}${CANONICAL_PATH}`,
    siteName: 'Productora EAR',
    locale: 'es_ES',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Artistas por Ciudades | Cobertura Nacional — Productora EAR',
    description:
      'Zonas de actuación preferente con desplazamiento bonificado y equipo técnico localizado.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

interface CityEntry {
  readonly name: string;
  readonly type: string;
  readonly slug: string;
  readonly artistsCount: number;
  readonly venuesCount: number;
  readonly responseTimeHours: number;
  readonly travelBonusKm: number;
}

const CITIES: readonly CityEntry[] = [
  {
    name: 'Madrid',
    type: 'Sede Principal',
    slug: 'madrid',
    artistsCount: 48,
    venuesCount: 126,
    responseTimeHours: 2,
    travelBonusKm: 0,
  },
  {
    name: 'Barcelona',
    type: 'Sucursal Noreste',
    slug: 'barcelona',
    artistsCount: 36,
    venuesCount: 94,
    responseTimeHours: 4,
    travelBonusKm: 50,
  },
  {
    name: 'Sevilla',
    type: 'Sucursal Sur',
    slug: 'sevilla',
    artistsCount: 22,
    venuesCount: 61,
    responseTimeHours: 6,
    travelBonusKm: 80,
  },
  {
    name: 'Valencia',
    type: 'Sucursal Levante',
    slug: 'valencia',
    artistsCount: 27,
    venuesCount: 73,
    responseTimeHours: 5,
    travelBonusKm: 70,
  },
  {
    name: 'Zaragoza',
    type: 'Sucursal Centro-Norte',
    slug: 'zaragoza',
    artistsCount: 18,
    venuesCount: 42,
    responseTimeHours: 7,
    travelBonusKm: 90,
  },
] as const;

const TOTAL_ARTISTS = CITIES.reduce((acc, c) => acc + c.artistsCount, 0);
const TOTAL_VENUES = CITIES.reduce((acc, c) => acc + c.venuesCount, 0);
const FASTEST_RESPONSE = Math.min(...CITIES.map((c) => c.responseTimeHours));

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Ciudades de cobertura — Productora EAR',
  description:
    'Zonas de actuación preferente con desplazamiento bonificado y equipo técnico localizado.',
  url: `${SITE_URL}${CANONICAL_PATH}`,
  numberOfItems: CITIES.length,
  itemListElement: CITIES.map((city, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    item: {
      '@type': 'Place',
      name: city.name,
      address: {
        '@type': 'PostalAddress',
        addressLocality: city.name,
        addressCountry: 'ES',
      },
    },
  })),
};

export default function ArtistasCiudadesPage() {
  return (
    <main className="min-h-screen bg-[#030305] text-white pt-40 pb-24 font-sans antialiased selection:bg-[#ecb613]/30 selection:text-white">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-4xl mx-auto px-6 space-y-16">
        {/* Header */}
        <div className="space-y-4 animate-[fadeIn_0.6s_ease-out_both]">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.25em] bg-[#ecb613]/10 text-[#ecb613] border border-[#ecb613]/20 transition-colors duration-300 hover:bg-[#ecb613]/20">
              Cobertura
            </span>
            <span className="text-white/20 text-[9px] font-black uppercase tracking-widest font-mono">
              Cities Coverage
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter text-white font-syne">
            Principales Ciudades
          </h1>
          <p className="text-white/40 text-lg max-w-xl italic">
            {CITIES.length} sedes operativas · {TOTAL_ARTISTS} artistas en catálogo ·{' '}
            {TOTAL_VENUES} salas verificadas · respuesta mínima en {FASTEST_RESPONSE}h.
          </p>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="group bg-[#0b0b0b] border border-white/5 rounded-2xl p-5 transition-all duration-300 hover:border-[#ecb613]/30 hover:bg-[#0e0e0e] hover:-translate-y-0.5 hover:shadow-[0_8px_30px_-12px_rgba(236,182,19,0.25)]">
            <span className="text-[9px] font-black uppercase tracking-widest text-white/30 font-mono block mb-2 transition-colors duration-300 group-hover:text-white/50">
              Sedes
            </span>
            <span className="text-3xl font-black text-[#ecb613] font-syne transition-transform duration-300 inline-block group-hover:scale-105">
              {CITIES.length}
            </span>
          </div>
          <div className="group bg-[#0b0b0b] border border-white/5 rounded-2xl p-5 transition-all duration-300 hover:border-[#ecb613]/30 hover:bg-[#0e0e0e] hover:-translate-y-0.5 hover:shadow-[0_8px_30px_-12px_rgba(236,182,19,0.25)]">
            <span className="text-[9px] font-black uppercase tracking-widest text-white/30 font-mono block mb-2 transition-colors duration-300 group-hover:text-white/50">
              Artistas
            </span>
            <span className="text-3xl font-black text-[#ecb613] font-syne transition-transform duration-300 inline-block group-hover:scale-105">
              {TOTAL_ARTISTS}
            </span>
          </div>
          <div className="group bg-[#0b0b0b] border border-white/5 rounded-2xl p-5 transition-all duration-300 hover:border-[#ecb613]/30 hover:bg-[#0e0e0e] hover:-translate-y-0.5 hover:shadow-[0_8px_30px_-12px_rgba(236,182,19,0.25)]">
            <span className="text-[9px] font-black uppercase tracking-widest text-white/30 font-mono block mb-2 transition-colors duration-300 group-hover:text-white/50">
              Salas
            </span>
            <span className="text-3xl font-black text-[#ecb613] font-syne transition-transform duration-300 inline-block group-hover:scale-105">
              {TOTAL_VENUES}
            </span>
          </div>
          <div className="group bg-[#0b0b0b] border border-white/5 rounded-2xl p-5 transition-all duration-300 hover:border-[#ecb613]/30 hover:bg-[#0e0e0e] hover:-translate-y-0.5 hover:shadow-[0_8px_30px_-12px_rgba(236,182,19,0.25)]">
            <span className="text-[9px] font-black uppercase tracking-widest text-white/30 font-mono block mb-2 transition-colors duration-300 group-hover:text-white/50">
              Respuesta
            </span>
            <span className="text-3xl font-black text-[#ecb613] font-syne transition-transform duration-300 inline-block group-hover:scale-105">
              {FASTEST_RESPONSE}h
            </span>
          </div>
        </div>

        {/* List */}
        <div className="grid md:grid-cols-2 gap-6">
          {CITIES.map((city) => (
            <Link
              key={city.name}
              href={`/artistas/ciudades/${city.slug}`}
              aria-label={`Ver artistas y salas en ${city.name}`}
              className="group relative bg-[#0b0b0b] border border-white/5 rounded-[2.5rem] p-8 flex flex-col gap-6 overflow-hidden transition-all duration-500 ease-out hover:border-[#ecb613]/40 hover:bg-[#0e0e0e] hover:-translate-y-1 hover:shadow-[0_20px_60px_-20px_rgba(236,182,19,0.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ecb613]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#030305]"
            >
              {/* Glow accent */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -top-24 -right-24 h-48 w-48 rounded-full bg-[#ecb613]/0 blur-3xl transition-all duration-700 group-hover:bg-[#ecb613]/10"
              />
              <div className="relative flex justify-between items-start">
                <div className="space-y-1">
                  <h3 className="text-xl font-black uppercase text-white font-syne transition-colors duration-300 group-hover:text-[#ecb613]">
                    {city.name}
                  </h3>
                  <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest block font-mono transition-colors duration-300 group-hover:text-white/50">
                    {city.type}
                  </span>
                </div>
                <MapPin
                  size={18}
                  className="text-[#ecb613] transition-transform duration-500 ease-out group-hover:scale-110 group-hover:-rotate-6"
                  aria-hidden="true"
                />
              </div>
              <div className="relative grid grid-cols-3 gap-3 pt-4 border-t border-white/5 transition-colors duration-300 group-hover:border-white/10">
                <div>
                  <span className="text-[9px] font-black uppercase tracking-widest text-white/30 font-mono block mb-1">
                    Artistas
                  </span>
                  <span className="text-sm font-black text-white font-syne">
                    {city.artistsCount}
                  </span>
                </div>
                <div>
                  <span className="text-[9px] font-black uppercase tracking-widest text-white/30 font-mono block mb-1">
                    Salas
                  </span>
                  <span className="text-sm font-black text-white font-syne">
                    {city.venuesCount}
                  </span>
                </div>
                <div>
                  <span className="text-[9px] font-black uppercase tracking-widest text-white/30 font-mono block mb-1">
                    Respuesta
                  </span>
                  <span className="text-sm font-black text-white font-syne">
                    {city.responseTimeHours}h
                  </span>
                </div>
              </div>
              <div className="relative flex items-center justify-between text-[10px] font-mono uppercase tracking-widest">
                <span className="text-white/30 transition-colors duration-300 group-hover:text-white/50">
                  Desplazamiento bonificado
                </span>
                <span className="flex items-center gap-2 text-[#ecb613] font-black">
                  {city.travelBonusKm === 0
                    ? 'Incluido'
                    : `+${city.travelBonusKm} km`}
                  <ArrowRight
                    size={12}
                    aria-hidden="true"
                    className="transition-transform duration-500 ease-out group-hover:translate-x-1"
                  />
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            href="/contacto"
            className="group inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[#ecb613] text-[#030305] text-[11px] font-black uppercase tracking-[0.25em] transition-all duration-300 ease-out hover:bg-[#f5c93a] hover:-translate-y-0.5 hover:shadow-[0_16px_40px_-12px_rgba(236,182,19,0.6)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ecb613]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#030305] active:translate-y-0"
          >
            Solicitar cobertura
            <ArrowRight
              size={14}
              aria-hidden="true"
              className="transition-transform duration-300 ease-out group-hover:translate-x-1"
            />
          </Link>
          <Link
            href="/artistas"
            className="group inline-flex items-center gap-3 px-8 py-4 rounded-full border border-white/10 text-white text-[11px] font-black uppercase tracking-[0.25em] transition-all duration-300 ease-out hover:border-[#ecb613]/40 hover:text-[#ecb613] hover:-translate-y-0.5 hover:bg-white/[0.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ecb613]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#030305] active:translate-y-0"
          >
            Ver catálogo
            <ArrowRight
              size={14}
              aria-hidden="true"
              className="transition-transform duration-300 ease-out group-hover:translate-x-1"
            />
          </Link>
        </div>

        {/* Footer note */}
        <div className="flex items-center gap-3 text-white/30 text-xs font-mono uppercase tracking-widest">
          <Globe
            size={14}
            className="text-[#ecb613] transition-transform duration-500 hover:rotate-12"
            aria-hidden="true"
          />
          <span>
            Cobertura nacional · {TOTAL_VENUES} salas verificadas ·{' '}
            {TOTAL_ARTISTS} artistas activos
          </span>
          <Sparkles
            size={14}
            className="text-[#ecb613] transition-transform duration-500 hover:scale-125"
            aria-hidden="true"
          />
        </div>
      </div>
    </main>
  );
}