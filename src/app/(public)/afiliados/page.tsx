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

export const metadata: Metadata = {
  title: 'Programa de Prescriptores y Afiliados S-Class | EAR OS',
  description:
    'Monetiza tus recomendaciones en eventos de gala y bodas. Comisiones del 10% directas con liquidación transparente bajo el Split Soberano 80/10/10.',
  openGraph: {
    title: 'Programa de Prescriptores y Afiliados S-Class | EAR OS',
    description:
      'Alianzas estratégicas para wedding planners, fincas y prescriptores de eventos de lujo. Cero fricción, depósitos deducibles y liquidación inmediata.',
    url: 'https://productoraear.com/afiliados',
  },
};

export default function AfiliadosPage() {
  const whatsappClean = CENTRALITA_EAR_OS.replace(/\s+/g, '').replace('+', '');
  const whatsappUrl = `https://wa.me/${whatsappClean}?text=${encodeURIComponent(
    'Hola Edwin, deseo información para activar mi código de Prescriptor / Afiliado en EAR OS.'
  )}`;

  const schemaJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Programa de Prescriptores y Afiliados EAR OS',
    description:
      'Programa de incentivos y comisiones para wedding planners, recintos y prescriptores de espectáculos en directo.',
    provider: {
      '@type': 'Organization',
      name: 'Productora EAR OS',
      telephone: CENTRALITA_EAR_OS,
      url: 'https://productoraear.com',
    },
    offers: {
      '@type': 'Offer',
      price: DEPOSITO_STRIPE_EUR,
      priceCurrency: 'EUR',
      description: 'Depósito de blindaje VIP y liquidación con Split 80/10/10.',
      availability: 'https://schema.org/InStock',
    },
  };

  return (
    <main className="min-h-screen bg-[#030305] text-[#f5f5f5] pt-28 pb-20 px-4 sm:px-6 lg:px-8 selection:bg-[#ecb613] selection:text-black">
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJsonLd) }}
      />

      <div className="max-w-6xl mx-auto space-y-16">
        {/* Hero Section */}
        <header className="text-center space-y-6 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#ecb613]/10 border border-[#ecb613]/30 text-[#ecb613] text-xs font-semibold uppercase tracking-widest">
            <span className="w-2 h-2 rounded-full bg-[#ecb613] animate-pulse" />
            Alianzas Estratégicas S-Class
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
            Prescriptores & Afiliados <span className="text-[#ecb613]">EAR OS</span>
          </h1>
          <p className="text-base sm:text-lg text-neutral-400 leading-relaxed">
            Recomienda artistas solistas de élite, sonorización homologada y espectáculos de gala.
            Gana hasta un <strong className="text-white font-semibold">10% de comisión directa</strong> por
            cada evento producido, con liquidación trazable y sin intermediarios opacos.
          </p>
        </header>

        {/* Pilares del Split Soberano */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-3xl bg-[#09090d]/80 border border-white/10 p-8 backdrop-blur-md hover:border-[#ecb613]/50 transition-all duration-300">
            <div className="text-xs font-mono uppercase tracking-widest text-[#ecb613] mb-3">01 · Transparencia SSOT</div>
            <h3 className="text-xl font-bold text-white mb-2">Tarifas Transparentes</h3>
            <p className="text-sm text-neutral-400 leading-relaxed mb-4">
              Tarifa solista base canónica fijada en{' '}
              <strong className="text-white">{TARIFA_BASE_SOLISTA_EUR.toFixed(2)} €</strong>.
              Kilometraje logístico exacto a {LOGISTICA_EUR_PER_KM.toFixed(2)} €/km (primeros {LOGISTICA_KM_EXENTOS} km exentos).
            </p>
            <div className="text-2xl font-black text-white font-mono">350,00 € <span className="text-xs text-neutral-500 font-sans font-normal">Base Solista</span></div>
          </div>

          <div className="rounded-3xl bg-[#09090d]/80 border border-white/10 p-8 backdrop-blur-md hover:border-[#00E5FF]/50 transition-all duration-300">
            <div className="text-xs font-mono uppercase tracking-widest text-[#00E5FF] mb-3">02 · Blindaje VIP</div>
            <h3 className="text-xl font-bold text-white mb-2">Depósito 100 € Price-Lock</h3>
            <p className="text-sm text-neutral-400 leading-relaxed mb-4">
              Tu cliente reserva con un depósito inmutable de{' '}
              <strong className="text-white">{DEPOSITO_STRIPE_EUR.toFixed(2)} €</strong> en Stripe, 100% deducible del importe total. Bloqueo atómico de fecha sin cancelaciones sorpresa.
            </p>
            <div className="text-2xl font-black text-white font-mono">100,00 € <span className="text-xs text-neutral-500 font-sans font-normal">Deducible</span></div>
          </div>

          <div className="rounded-3xl bg-[#09090d]/80 border border-white/10 p-8 backdrop-blur-md hover:border-emerald-400/50 transition-all duration-300">
            <div className="text-xs font-mono uppercase tracking-widest text-emerald-400 mb-3">03 · Impacto & Split</div>
            <h3 className="text-xl font-bold text-white mb-2">Split Soberano 80/10/10</h3>
            <p className="text-sm text-neutral-400 leading-relaxed mb-4">
              80% Artista ejecutor, 10% Infraestructura tecnológica EAR OS y 10% Impacto Social VIMUME con deducción fiscal Modelo 182 AEAT (Ley 49/2002).
            </p>
            <div className="text-2xl font-black text-emerald-400 font-mono">
              {(SPLIT_SOBERANO.artista * 100).toFixed(0)} / {(SPLIT_SOBERANO.earOs * 100).toFixed(0)} / {(SPLIT_SOBERANO.vimume * 100).toFixed(0)}
            </div>
          </div>
        </section>

        {/* Tabla de Rendimiento para Prescriptores */}
        <section className="rounded-3xl bg-[#09090d]/80 border border-white/10 p-8 sm:p-10 backdrop-blur-md space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold text-white">Escala de Comisiones para Prescriptores</h2>
              <p className="text-sm text-neutral-400">Wedding Planners, Directores de Fincas, Maitres y Agencias de Eventos.</p>
            </div>
            <div className="px-4 py-2 rounded-2xl bg-white/5 border border-white/10 text-xs font-mono text-[#ecb613]">
              Liquidación en 24h tras el evento
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-white/10">
            <div className="p-5 rounded-2xl bg-black/40 border border-white/5 space-y-2">
              <span className="text-xs text-neutral-400 uppercase font-mono">Solista en Cóctel / Ceremonia</span>
              <div className="text-lg font-bold text-white">Desde 350 € a 700 €</div>
              <p className="text-xs text-neutral-500">Comisión prescriptor: 10% de honorarios brutos concertados.</p>
            </div>
            <div className="p-5 rounded-2xl bg-black/40 border border-white/5 space-y-2">
              <span className="text-xs text-neutral-400 uppercase font-mono">Sonorización & Iluminación</span>
              <div className="text-lg font-bold text-white">Desde 800 € a 2.500 €</div>
              <p className="text-xs text-neutral-500">Kits homologados de hasta 102 dBA con microfonía Shure y columnas Bose F1.</p>
            </div>
            <div className="p-5 rounded-2xl bg-black/40 border border-white/5 space-y-2">
              <span className="text-xs text-neutral-400 uppercase font-mono">Producción Integral en Finca</span>
              <div className="text-lg font-bold text-white">Desde 3.000 € a 12.000 €</div>
              <p className="text-xs text-neutral-500">Coordinación 360° de recintos, banquete y acústica. Retribución preferente.</p>
            </div>
          </div>
        </section>

        {/* CTA Actions */}
        <section className="rounded-3xl bg-gradient-to-b from-[#09090d] to-black border border-white/10 p-8 sm:p-12 text-center space-y-8">
          <div className="max-w-2xl mx-auto space-y-3">
            <h2 className="text-3xl font-black text-white">Activa tu Alianza S-Class Hoy Mismo</h2>
            <p className="text-sm sm:text-base text-neutral-400">
              Contacta directamente con la Dirección de EAR OS para registrar tu código de prescriptor y recibir material promocional exclusivo.
            </p>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-4">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-4 rounded-2xl bg-[#ecb613] hover:bg-[#d4a310] text-black font-bold text-sm tracking-wide transition-all duration-300 shadow-lg shadow-[#ecb613]/20"
            >
              Contactar por WhatsApp (+34 693 693 048)
            </a>
            <Link
              href="/reservar/solista"
              className="inline-flex items-center justify-center px-8 py-4 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm tracking-wide border border-white/15 transition-all duration-300"
            >
              Reservar Solista (350 €)
            </Link>
            <Link
              href="/alquiler"
              className="inline-flex items-center justify-center px-8 py-4 rounded-2xl bg-white/5 hover:bg-white/10 text-neutral-300 font-medium text-sm tracking-wide border border-white/10 transition-all duration-300"
            >
              Catálogo de Alquiler
            </Link>
          </div>

          <div className="pt-4 text-xs text-neutral-500 font-mono">
            Soporte Centralita Oficial: {CENTRALITA_EAR_OS} · Cumplimiento Ley 49/2002 y Split 80/10/10
          </div>
        </section>
      </div>
    </main>
  );
}