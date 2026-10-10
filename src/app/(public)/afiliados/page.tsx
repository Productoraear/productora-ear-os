import type { Metadata } from 'next';
import Link from 'next/link';
import {
  TARIFA_BASE_SOLISTA_EUR,
  DEPOSITO_STRIPE_EUR,
  CENTRALITA_EAR_OS,
  SPLIT_SOBERANO,
  LOGISTICA_EUR_PER_KM,
  LOGISTICA_KM_EXENTOS,
} from '@/lib/constants/ear-os-ssot';

const SITE_URL = 'https://productoraear.com';
const PAGE_PATH = '/afiliados';
const CANONICAL_URL = `${SITE_URL}${PAGE_PATH}`;
const PAGE_TITLE = 'Programa de Prescriptores y Afiliados S-Class | EAR OS';
const PAGE_DESCRIPTION =
  'Comisiones del 10% directas para wedding planners, fincas y prescriptores de eventos. Liquidación en 24h bajo el Split Soberano 80/10/10.';

const COMISION_PRESCRIPTOR_PCT = 0.1;
const LIQUIDACION_HORAS = 24;
const RANGO_SOLISTA_MIN_EUR = 350;
const RANGO_SOLISTA_MAX_EUR = 700;
const RANGO_SONORIZACION_MIN_EUR = 800;
const RANGO_SONORIZACION_MAX_EUR = 2500;
const RANGO_PRODUCCION_MIN_EUR = 3000;
const RANGO_PRODUCCION_MAX_EUR = 12000;
const SPL_DBA_MAX = 102;

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: {
    canonical: CANONICAL_URL,
  },
  openGraph: {
    title: PAGE_TITLE,
    description:
      'Programa de afiliación para wedding planners, fincas y prescriptores de eventos. Depósito deducible de 100 € y liquidación en 24h.',
    url: CANONICAL_URL,
    siteName: 'Productora EAR OS',
    locale: 'es_ES',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function AfiliadosPage() {
  const whatsappClean = CENTRALITA_EAR_OS.replace(/\s+/g, '').replace('+', '');
  const whatsappUrl = `https://wa.me/${whatsappClean}?text=${encodeURIComponent(
    'Hola Edwin, deseo información para activar mi código de Prescriptor / Afiliado en EAR OS.'
  )}`;

  const comisionSolistaMin = RANGO_SOLISTA_MIN_EUR * COMISION_PRESCRIPTOR_PCT;
  const comisionSolistaMax = RANGO_SOLISTA_MAX_EUR * COMISION_PRESCRIPTOR_PCT;
  const comisionSonorizacionMin = RANGO_SONORIZACION_MIN_EUR * COMISION_PRESCRIPTOR_PCT;
  const comisionSonorizacionMax = RANGO_SONORIZACION_MAX_EUR * COMISION_PRESCRIPTOR_PCT;
  const comisionProduccionMin = RANGO_PRODUCCION_MIN_EUR * COMISION_PRESCRIPTOR_PCT;
  const comisionProduccionMax = RANGO_PRODUCCION_MAX_EUR * COMISION_PRESCRIPTOR_PCT;

  const splitArtistaPct = (SPLIT_SOBERANO.artista * 100).toFixed(0);
  const splitEarOsPct = (SPLIT_SOBERANO.earOs * 100).toFixed(0);
  const splitVimumePct = (SPLIT_SOBERANO.vimume * 100).toFixed(0);
  const comisionPctLabel = (COMISION_PRESCRIPTOR_PCT * 100).toFixed(0);

  const schemaJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Programa de Prescriptores y Afiliados EAR OS',
    description:
      'Programa de comisiones del 10% para wedding planners, recintos y prescriptores de espectáculos en directo. Liquidación en 24h.',
    url: CANONICAL_URL,
    serviceType: 'Programa de afiliación y prescripción de eventos',
    areaServed: {
      '@type': 'Country',
      name: 'España',
    },
    provider: {
      '@type': 'Organization',
      name: 'Productora EAR OS',
      telephone: CENTRALITA_EAR_OS,
      url: SITE_URL,
    },
    offers: {
      '@type': 'Offer',
      price: DEPOSITO_STRIPE_EUR,
      priceCurrency: 'EUR',
      description: `Depósito deducible de ${DEPOSITO_STRIPE_EUR.toFixed(2)} € y liquidación con Split ${splitArtistaPct}/${splitEarOsPct}/${splitVimumePct}.`,
      availability: 'https://schema.org/InStock',
      url: CANONICAL_URL,
    },
  };

  return (
    <main className="min-h-screen bg-[#030305] text-[#f5f5f5] pt-28 pb-20 px-4 sm:px-6 lg:px-8 selection:bg-[#ecb613] selection:text-black">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJsonLd) }}
      />

      <div className="max-w-6xl mx-auto space-y-16">
        <header className="text-center space-y-6 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#ecb613]/10 border border-[#ecb613]/30 text-[#ecb613] text-xs font-semibold uppercase tracking-widest transition-all duration-300 hover:bg-[#ecb613]/15 hover:border-[#ecb613]/50">
            <span className="w-2 h-2 rounded-full bg-[#ecb613] animate-pulse" />
            Alianzas Estratégicas S-Class
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
            Prescriptores &amp; Afiliados <span className="text-[#ecb613]">EAR OS</span>
          </h1>
          <p className="text-base sm:text-lg text-neutral-400 leading-relaxed">
            Recomienda artistas solistas, sonorización homologada y espectáculos de gala.
            Comisión directa del{' '}
            <strong className="text-white font-semibold">{comisionPctLabel}%</strong>{' '}
            sobre honorarios brutos concertados, con liquidación en {LIQUIDACION_HORAS}h y trazabilidad SSOT.
          </p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="group rounded-3xl bg-[#09090d]/80 border border-white/10 p-8 backdrop-blur-md transition-all duration-300 hover:border-[#ecb613]/50 hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#ecb613]/10">
            <div className="text-xs font-mono uppercase tracking-widest text-[#ecb613] mb-3 transition-transform duration-300 group-hover:translate-x-0.5">
              01 · Transparencia SSOT
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Tarifas Transparentes</h3>
            <p className="text-sm text-neutral-400 leading-relaxed mb-4">
              Tarifa solista base canónica fijada en{' '}
              <strong className="text-white">{TARIFA_BASE_SOLISTA_EUR.toFixed(2)} €</strong>.
              Kilometraje logístico exacto a {LOGISTICA_EUR_PER_KM.toFixed(2)} €/km (primeros{' '}
              {LOGISTICA_KM_EXENTOS} km exentos).
            </p>
            <div className="text-2xl font-black text-white font-mono">
              {TARIFA_BASE_SOLISTA_EUR.toFixed(2)} €{' '}
              <span className="text-xs text-neutral-500 font-sans font-normal">Base Solista</span>
            </div>
          </div>

          <div className="group rounded-3xl bg-[#09090d]/80 border border-white/10 p-8 backdrop-blur-md transition-all duration-300 hover:border-[#00E5FF]/50 hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#00E5FF]/10">
            <div className="text-xs font-mono uppercase tracking-widest text-[#00E5FF] mb-3 transition-transform duration-300 group-hover:translate-x-0.5">
              02 · Blindaje VIP
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              Depósito {DEPOSITO_STRIPE_EUR.toFixed(0)} € Price-Lock
            </h3>
            <p className="text-sm text-neutral-400 leading-relaxed mb-4">
              Tu cliente reserva con un depósito inmutable de{' '}
              <strong className="text-white">{DEPOSITO_STRIPE_EUR.toFixed(2)} €</strong> en Stripe,
              100% deducible del importe total. Bloqueo atómico de fecha sin cancelaciones sorpresa.
            </p>
            <div className="text-2xl font-black text-white font-mono">
              {DEPOSITO_STRIPE_EUR.toFixed(2)} €{' '}
              <span className="text-xs text-neutral-500 font-sans font-normal">Deducible</span>
            </div>
          </div>

          <div className="group rounded-3xl bg-[#09090d]/80 border border-white/10 p-8 backdrop-blur-md transition-all duration-300 hover:border-emerald-400/50 hover:-translate-y-1 hover:shadow-2xl hover:shadow-emerald-400/10">
            <div className="text-xs font-mono uppercase tracking-widest text-emerald-400 mb-3 transition-transform duration-300 group-hover:translate-x-0.5">
              03 · Impacto &amp; Split
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              Split Soberano {splitArtistaPct}/{splitEarOsPct}/{splitVimumePct}
            </h3>
            <p className="text-sm text-neutral-400 leading-relaxed mb-4">
              {splitArtistaPct}% Artista ejecutor, {splitEarOsPct}% Infraestructura tecnológica EAR OS y{' '}
              {splitVimumePct}% Impacto Social VIMUME con deducción fiscal Modelo 182 AEAT (Ley 49/2002).
            </p>
            <div className="text-2xl font-black text-emerald-400 font-mono">
              {splitArtistaPct} / {splitEarOsPct} / {splitVimumePct}
            </div>
          </div>
        </section>

        <section className="rounded-3xl bg-[#09090d]/80 border border-white/10 p-8 sm:p-10 backdrop-blur-md space-y-6 transition-all duration-300 hover:border-white/20">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold text-white">Escala de Comisiones para Prescriptores</h2>
              <p className="text-sm text-neutral-400">
                Wedding Planners, Directores de Fincas, Maitres y Agencias de Eventos.
              </p>
            </div>
            <div className="px-4 py-2 rounded-2xl bg-white/5 border border-white/10 text-xs font-mono text-[#ecb613] transition-all duration-300 hover:bg-white/10 hover:border-[#ecb613]/40">
              Liquidación en {LIQUIDACION_HORAS}h tras el evento
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-white/10">
            <div className="group p-5 rounded-2xl bg-black/40 border border-white/5 space-y-2 transition-all duration-300 hover:border-[#ecb613]/40 hover:bg-black/60 hover:-translate-y-0.5">
              <span className="text-xs text-neutral-400 uppercase font-mono transition-colors duration-300 group-hover:text-[#ecb613]">
                Solista en Cóctel / Ceremonia
              </span>
              <div className="text-lg font-bold text-white">
                {RANGO_SOLISTA_MIN_EUR} € a {RANGO_SOLISTA_MAX_EUR} €
              </div>
              <p className="text-xs text-neutral-500">
                Comisión prescriptor: {comisionSolistaMin.toFixed(0)} € – {comisionSolistaMax.toFixed(0)} €
                ({comisionPctLabel}% de honorarios brutos concertados).
              </p>
            </div>
            <div className="group p-5 rounded-2xl bg-black/40 border border-white/5 space-y-2 transition-all duration-300 hover:border-[#00E5FF]/40 hover:bg-black/60 hover:-translate-y-0.5">
              <span className="text-xs text-neutral-400 uppercase font-mono transition-colors duration-300 group-hover:text-[#00E5FF]">
                Sonorización &amp; Iluminación
              </span>
              <div className="text-lg font-bold text-white">
                {RANGO_SONORIZACION_MIN_EUR} € a {RANGO_SONORIZACION_MAX_EUR} €
              </div>
              <p className="text-xs text-neutral-500">
                Kits homologados de hasta {SPL_DBA_MAX} dBA con microfonía Shure y columnas Bose F1.
                Comisión: {comisionSonorizacionMin.toFixed(0)} € – {comisionSonorizacionMax.toFixed(0)} €.
              </p>
            </div>
            <div className="group p-5 rounded-2xl bg-black/40 border border-white/5 space-y-2 transition-all duration-300 hover:border-emerald-400/40 hover:bg-black/60 hover:-translate-y-0.5">
              <span className="text-xs text-neutral-400 uppercase font-mono transition-colors duration-300 group-hover:text-emerald-400">
                Producción Integral en Finca
              </span>
              <div className="text-lg font-bold text-white">
                {RANGO_PRODUCCION_MIN_EUR} € a {RANGO_PRODUCCION_MAX_EUR} €
              </div>
              <p className="text-xs text-neutral-500">
                Coordinación 360° de recintos, banquete y acústica. Comisión:{' '}
                {comisionProduccionMin.toFixed(0)} € – {comisionProduccionMax.toFixed(0)} €.
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-3xl bg-gradient-to-b from-[#09090d] to-black border border-white/10 p-8 sm:p-12 text-center space-y-8 transition-all duration-300 hover:border-[#ecb613]/30">
          <div className="max-w-2xl mx-auto space-y-3">
            <h2 className="text-3xl font-black text-white">Activa tu Alianza S-Class Hoy Mismo</h2>
            <p className="text-sm sm:text-base text-neutral-400">
              Contacta directamente con la Dirección de EAR OS para registrar tu código de prescriptor
              y recibir material promocional exclusivo.
            </p>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-4">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-[#ecb613] hover:bg-[#d4a310] text-black font-bold text-sm tracking-wide transition-all duration-300 shadow-lg shadow-[#ecb613]/20 hover:shadow-xl hover:shadow-[#ecb613]/40 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ecb613] focus-visible:ring-offset-2 focus-visible:ring-offset-[#030305]"
            >
              <span className="transition-transform duration-300 group-hover:scale-110">💬</span>
              Contactar por WhatsApp ({CENTRALITA_EAR_OS})
            </a>
            <Link
              href="/reservar/solista"
              className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm tracking-wide border border-white/15 hover:border-white/30 transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#030305]"
            >
              <span className="transition-transform duration-300 group-hover:translate-x-0.5">→</span>
              Reservar Solista ({TARIFA_BASE_SOLISTA_EUR.toFixed(0)} €)
            </Link>
            <Link
              href="/alquiler"
              className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white font-medium text-sm tracking-wide border border-white/10 hover:border-white/20 transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#030305]"
            >
              <span className="transition-transform duration-300 group-hover:translate-x-0.5">→</span>
              Catálogo de Alquiler
            </Link>
          </div>

          <div className="pt-4 text-xs text-neutral-500 font-mono">
            Soporte Centralita Oficial: {CENTRALITA_EAR_OS} · Cumplimiento Ley 49/2002 y Split{' '}
            {splitArtistaPct}/{splitEarOsPct}/{splitVimumePct}
          </div>
        </section>
      </div>
    </main>
  );
}