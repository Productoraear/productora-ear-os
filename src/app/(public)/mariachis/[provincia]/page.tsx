import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ShieldCheck,
  Check,
  ArrowRight,
  MessageCircle,
  PhoneCall,
  Sparkles,
  Award,
  Users,
  MapPin,
  CalendarCheck,
  Sliders,
  Music,
} from 'lucide-react';
import { CENTRALITA_EAR_OS, DEPOSITO_STRIPE_EUR } from '@/lib/constants/ear-os-ssot';
import { MARIACHI_MARKETS } from '@/lib/seo/centralita-mariachis-dominance-engine';
import { MARIACHI_FORMATS } from '@/lib/mariachi/mariachiDispatchCore';
import mariachisCatalog from '@/data/mariachis_catalog_clean.json';

const CLEAN_PHONE = CENTRALITA_EAR_OS.replace(/\D/g, '');
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://productoraear.com';

const SPANISH_PROVINCES = MARIACHI_MARKETS.filter((m) => m.inSpain);

export function generateStaticParams(): { provincia: string }[] {
  return SPANISH_PROVINCES.map((m) => ({ provincia: m.slug }));
}

interface PageProps {
  params: Promise<{ provincia: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { provincia } = await params;
  const market = SPANISH_PROVINCES.find((m) => m.slug.toLowerCase() === provincia.toLowerCase());
  if (!market) {
    return { title: 'Mariachis en España | Centralita Productora EAR' };
  }

  const title = `▷ Contratar Mariachis en ${market.name} | Precio Cerrado desde 350€ · Centralita EAR OS`;
  const description = `Contratación directa de mariachis profesionales en ${market.name} (${market.corridor}). Mariachi Imperial S-Class con Edwin Agudelo, equipo Bose F1 Model 812, garantía de sonido y reserva segura con ${DEPOSITO_STRIPE_EUR}€ deducibles.`;
  const canonical = `${BASE_URL}/mariachis/${market.slug}`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      type: 'website',
      locale: 'es_ES',
      url: canonical,
      siteName: 'Productora EAR',
      title,
      description,
      images: [
        {
          url: 'https://productoraear.com/og-mariachis.jpg',
          width: 1200,
          height: 630,
          alt: `Mariachis en ${market.name}`,
        },
      ],
    },
  };
}

export default async function MariachiProvinciaPage({ params }: PageProps) {
  const { provincia } = await params;
  const market = SPANISH_PROVINCES.find((m) => m.slug.toLowerCase() === provincia.toLowerCase());
  if (!market) {
    notFound();
  }

  // Filtrar o destacar agrupaciones disponibles
  const availableGroups = mariachisCatalog.filter((g) =>
    g.provinces.includes('todas') || g.provinces.includes(market.slug)
  );

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': ['MusicGroup', 'LocalBusiness'],
    name: `Mariachis en ${market.name} - Centralita EAR OS`,
    url: `${BASE_URL}/mariachis/${market.slug}`,
    telephone: CENTRALITA_EAR_OS,
    priceRange: '350€ - 850€',
    address: {
      '@type': 'PostalAddress',
      addressLocality: market.name,
      addressCountry: 'ES',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '40.4168',
      longitude: '-3.7038',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '87',
      bestRating: '5.0',
      worstRating: '1.0',
    },
  };

  const whatsappUrl = `https://wa.me/${CLEAN_PHONE}?text=${encodeURIComponent(
    `Hola, solicito disponibilidad y presupuesto para mariachis en ${market.name} (${market.corridor}). Vengo de la web oficial de Productora EAR.`
  )}`;

  return (
    <main className="min-h-screen bg-[#050507] text-white pt-24 pb-20 selection:bg-[#ecb613] selection:text-black">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero Territorial */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono mb-4">
          <MapPin size={13} className="text-[#ecb613]" />
          <span>PLAZA TERRITORIAL HOMOLOGADA · {market.name.toUpperCase()}</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight font-montserrat text-white mb-6">
          Contratar Mariachis en <span className="text-[#ecb613]">{market.name}</span>
        </h1>

        <p className="text-zinc-300 text-base sm:text-xl max-w-3xl leading-relaxed mb-8">
          Servicio de excelencia y contratación directa sin intermediarios en {market.name} ({market.corridor}).
          Dirección artística de <strong>Edwin Agudelo (Mariachi Imperial S-Class)</strong>, sonido profesional autónomo
          Bose F1 Model 812 y blindaje de fecha con depósito de {DEPOSITO_STRIPE_EUR} € deducible.
        </p>

        <div className="flex flex-wrap items-center gap-4">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3.5 rounded-xl bg-[#ecb613] hover:bg-amber-400 text-black font-montserrat font-bold text-sm flex items-center gap-2 shadow-[0_0_30px_rgba(236,182,19,0.3)] transition-all"
          >
            <MessageCircle size={17} />
            <span>Consultar Disponibilidad en {market.name}</span>
          </a>

          <a
            href={`tel:${CLEAN_PHONE}`}
            className="px-6 py-3.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 font-mono text-sm flex items-center gap-2 transition-colors"
          >
            <PhoneCall size={17} className="text-emerald-400" />
            <span>Centralita: {CENTRALITA_EAR_OS}</span>
          </a>
        </div>
      </section>

      {/* Garantías Inviolables S-Class */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-16 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-zinc-900/60 border border-white/5 backdrop-blur-sm">
          <div className="w-10 h-10 rounded-xl bg-[#ecb613]/10 border border-[#ecb613]/30 flex items-center justify-center text-[#ecb613] mb-4">
            <Award size={20} />
          </div>
          <h3 className="text-lg font-bold text-white mb-2 font-montserrat">Voz Tenor & Calidad de Gala</h3>
          <p className="text-zinc-400 text-sm leading-relaxed">
            Sin improvisaciones ni furgonetas amateurs. Traje de charro de gala a elegir con botonadura de plata y repertorio clásico ranchero.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-zinc-900/60 border border-white/5 backdrop-blur-sm">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4">
            <Sliders size={20} />
          </div>
          <h3 className="text-lg font-bold text-white mb-2 font-montserrat">Sonido Bose F1 Model 812</h3>
          <p className="text-zinc-400 text-sm leading-relaxed">
            Dotación acústica homologada bajo la Ley 37/2003 del Ruido. Microfonía inalámbrica profesional para serenatas en interiores y jardines.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-zinc-900/60 border border-white/5 backdrop-blur-sm">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4">
            <ShieldCheck size={20} />
          </div>
          <h3 className="text-lg font-bold text-white mb-2 font-montserrat">Tarifa Canónica 350 € - 550 €</h3>
          <p className="text-zinc-400 text-sm leading-relaxed">
            Suelo base 350,00 € y tarifa estándar 550,00 € con hasta 100 km incluidos. Reserva segura de {DEPOSITO_STRIPE_EUR} € con Stripe Price-Lock.
          </p>
        </div>
      </section>

      {/* Catálogo de Formaciones en Plaza */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-16">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-8 font-montserrat">
          Formaciones Disponibles en <span className="text-[#ecb613]">{market.name}</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {availableGroups.slice(0, 3).map((group) => (
            <div
              key={group.id}
              className="p-6 rounded-2xl bg-zinc-900/80 border border-zinc-800 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono text-[#ecb613] px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                    {group.badge || 'Formación Homologada'}
                  </span>
                  <span className="text-sm font-bold text-emerald-400 font-mono">
                    ★ {group.rating} ({group.reviews})
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white mb-2 font-montserrat">{group.name}</h3>

                <ul className="space-y-2 mb-6">
                  {group.features.map((feat, i) => (
                    <li key={i} className="text-xs text-zinc-300 flex items-center gap-2">
                      <Check size={14} className="text-[#ecb613] shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 border-t border-zinc-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-zinc-500 font-mono uppercase block">Tarifa Oficial</span>
                  <span className="text-lg font-extrabold text-white font-montserrat">{group.priceTag}</span>
                </div>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-lg bg-[#ecb613] hover:bg-amber-400 text-black font-bold text-xs flex items-center gap-1 transition-colors"
                >
                  <span>Reservar</span>
                  <ArrowRight size={13} />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Otras Plazas de la Malla Territorial */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pt-8 border-t border-zinc-900">
        <h3 className="text-xs font-mono text-zinc-400 uppercase tracking-widest mb-4">
          Red Territorial pSEO de Mariachis en España:
        </h3>
        <div className="flex flex-wrap gap-2">
          {SPANISH_PROVINCES.map((prov) => (
            <Link
              key={prov.slug}
              href={`/mariachis/${prov.slug}`}
              className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                prov.slug === market.slug
                  ? 'bg-[#ecb613]/20 border-[#ecb613] text-amber-300 font-bold'
                  : 'bg-zinc-950/60 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
              }`}
            >
              {prov.name}
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
